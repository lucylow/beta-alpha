#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, symbol_short, Address, BytesN, Env, String, Vec,
};

/// AgentPay on Stellar — on-chain registry and payer-attested ledger for agent services.
///
/// Maps to MPP-style flows at the **application** layer:
/// - **Charge intent**: each paid API call can be backed by an off-chain USDC/x402 transfer; the payer
///   then calls [`record_query_payment`] with a unique `payment_ref` (replay-safe attestation).
/// - **Session intent**: high-frequency use is off-chain in a payment channel; a final settlement tx
///   can still call [`record_query_payment`] once per settlement with the net amount / proof hash.
const MAX_NAME_LEN: u32 = 64;
const MAX_ENDPOINT_LEN: u32 = 200;
const MAX_CATEGORY_LEN: u32 = 48;
const LIST_MAX: u32 = 24;

#[contract]
pub struct AgentPayContract;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInit = 1,
    NotInit = 2,
    AgentMissing = 3,
    NotOwner = 4,
    InactiveAgent = 5,
    PaymentRefReused = 6,
    BadPrice = 7,
    /// Non-positive `amount` in [`record_query_payment`].
    BadAmount = 8,
    StringTooLong = 9,
    Paused = 10,
    /// Paid amount is below the agent's listed minimum (`price_stroops`).
    BelowListedPrice = 11,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[soroban_sdk::contracttype]
pub struct Agent {
    pub owner: Address,
    pub name: String,
    pub endpoint: String,
    pub category: String,
    pub price_stroops: i128,
    pub reputation: u32,
    pub active: bool,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[soroban_sdk::contracttype]
pub struct PaymentEntry {
    pub payer: Address,
    pub agent_id: u32,
    pub amount: i128,
    pub payment_ref: BytesN<32>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[soroban_sdk::contracttype]
pub struct RegistryStats {
    /// Next id that will be assigned by [`register_agent`].
    pub next_agent_id: u32,
    pub payment_count: u32,
    pub paused: bool,
}

#[derive(Clone)]
#[soroban_sdk::contracttype]
enum DataKey {
    Admin,
    Init,
    NextId,
    Agent(u32),
    RefUsed(BytesN<32>),
    PaymentCount,
    Payment(u32),
}

fn read_admin(env: &Env) -> Result<Address, Error> {
    env.storage()
        .instance()
        .get(&DataKey::Admin)
        .ok_or(Error::NotInit)
}

fn read_next_id(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&DataKey::NextId)
        .unwrap_or(0u32)
}

fn validate_string_len(s: &String, max: u32) -> Result<(), Error> {
    if s.len() > max {
        Err(Error::StringTooLong)
    } else {
        Ok(())
    }
}

#[contractimpl]
impl AgentPayContract {
    /// One-time setup. `admin` can pause registry writes in emergencies.
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Init) {
            return Err(Error::AlreadyInit);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Init, &true);
        env.storage().instance().set(&DataKey::NextId, &1u32);
        env.storage().instance().set(&DataKey::PaymentCount, &0u32);
        Ok(())
    }

    pub fn admin(env: Env) -> Result<Address, Error> {
        read_admin(&env)
    }

    pub fn is_initialized(env: Env) -> bool {
        env.storage().instance().has(&DataKey::Init)
    }

    /// Emergency stop: only admin. When paused, no register/update/remove/payment records.
    pub fn set_paused(env: Env, paused: bool) -> Result<(), Error> {
        let admin = read_admin(&env)?;
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("paused"), &paused);
        Ok(())
    }

    pub fn paused(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&symbol_short!("paused"))
            .unwrap_or(false)
    }

    /// Register a new agent listing. `owner` must authorize (their AI wallet or custodial key).
    pub fn register_agent(
        env: Env,
        owner: Address,
        name: String,
        endpoint: String,
        category: String,
        price_stroops: i128,
    ) -> Result<u32, Error> {
        if Self::paused(env.clone()) {
            return Err(Error::Paused);
        }
        owner.require_auth();
        validate_string_len(&name, MAX_NAME_LEN)?;
        validate_string_len(&endpoint, MAX_ENDPOINT_LEN)?;
        validate_string_len(&category, MAX_CATEGORY_LEN)?;
        if price_stroops <= 0 {
            return Err(Error::BadPrice);
        }
        let id = read_next_id(&env);
        let agent = Agent {
            owner: owner.clone(),
            name,
            endpoint,
            category,
            price_stroops,
            reputation: 0,
            active: true,
        };
        env.storage().instance().set(&DataKey::Agent(id), &agent);
        env.storage().instance().set(&DataKey::NextId, &(id + 1));

        env.events().publish(
            (symbol_short!("reg"), id),
            (owner, agent.price_stroops),
        );
        Ok(id)
    }

    pub fn update_agent(
        env: Env,
        owner: Address,
        id: u32,
        name: String,
        endpoint: String,
        category: String,
        price_stroops: i128,
    ) -> Result<(), Error> {
        if Self::paused(env.clone()) {
            return Err(Error::Paused);
        }
        owner.require_auth();
        validate_string_len(&name, MAX_NAME_LEN)?;
        validate_string_len(&endpoint, MAX_ENDPOINT_LEN)?;
        validate_string_len(&category, MAX_CATEGORY_LEN)?;
        if price_stroops <= 0 {
            return Err(Error::BadPrice);
        }
        let mut agent: Agent = env
            .storage()
            .instance()
            .get(&DataKey::Agent(id))
            .ok_or(Error::AgentMissing)?;
        if agent.owner != owner {
            return Err(Error::NotOwner);
        }
        if !agent.active {
            return Err(Error::InactiveAgent);
        }
        agent.name = name;
        agent.endpoint = endpoint;
        agent.category = category;
        agent.price_stroops = price_stroops;
        env.storage().instance().set(&DataKey::Agent(id), &agent);
        Ok(())
    }

    pub fn remove_agent(env: Env, owner: Address, id: u32) -> Result<(), Error> {
        if Self::paused(env.clone()) {
            return Err(Error::Paused);
        }
        owner.require_auth();
        let mut agent: Agent = env
            .storage()
            .instance()
            .get(&DataKey::Agent(id))
            .ok_or(Error::AgentMissing)?;
        if agent.owner != owner {
            return Err(Error::NotOwner);
        }
        agent.active = false;
        env.storage().instance().set(&DataKey::Agent(id), &agent);
        Ok(())
    }

    pub fn get_agent(env: Env, id: u32) -> Option<Agent> {
        env.storage().instance().get(&DataKey::Agent(id))
    }

    /// Paginated listing: `skip` agents, then up to `take` (capped).
    pub fn list_agents(env: Env, skip: u32, take: u32) -> Vec<(u32, Agent)> {
        let t = take.min(LIST_MAX);
        let next = read_next_id(&env);
        let mut out: Vec<(u32, Agent)> = Vec::new(&env);
        let mut skipped: u32 = 0;
        let mut id: u32 = 1;
        while id < next {
            if let Some(a) = env.storage().instance().get::<DataKey, Agent>(&DataKey::Agent(id)) {
                if a.active {
                    if skipped < skip {
                        skipped += 1;
                    } else if out.len() < t {
                        out.push_back((id, a));
                    } else {
                        break;
                    }
                }
            }
            id += 1;
        }
        out
    }

    /// Payer attests a completed micropayment for a query. Uses Soroban auth (`payer.require_auth()`).
    /// Off-chain, the service should verify a matching Horizon payment before accepting the attestation.
    /// `payment_ref` MUST be unique (e.g. hash of funding tx + memo) — replay protected on-chain.
    pub fn record_query_payment(
        env: Env,
        payer: Address,
        agent_id: u32,
        amount: i128,
        payment_ref: BytesN<32>,
    ) -> Result<u32, Error> {
        if Self::paused(env.clone()) {
            return Err(Error::Paused);
        }
        payer.require_auth();
        if amount <= 0 {
            return Err(Error::BadAmount);
        }
        let agent: Agent = env
            .storage()
            .instance()
            .get(&DataKey::Agent(agent_id))
            .ok_or(Error::AgentMissing)?;
        if !agent.active {
            return Err(Error::InactiveAgent);
        }
        if env
            .storage()
            .instance()
            .has(&DataKey::RefUsed(payment_ref.clone()))
        {
            return Err(Error::PaymentRefReused);
        }
        if amount < agent.price_stroops {
            return Err(Error::BelowListedPrice);
        }

        env.storage()
            .instance()
            .set(&DataKey::RefUsed(payment_ref.clone()), &true);

        let mut agent = agent;
        agent.reputation = agent.reputation.saturating_add(1);
        env.storage()
            .instance()
            .set(&DataKey::Agent(agent_id), &agent);

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::PaymentCount)
            .unwrap_or(0u32);
        count += 1;
        env.storage().instance().set(&DataKey::PaymentCount, &count);
        let entry = PaymentEntry {
            payer,
            agent_id,
            amount,
            payment_ref,
        };
        env.storage().instance().set(&DataKey::Payment(count), &entry);

        env.events()
            .publish((symbol_short!("pay"), count, agent_id), entry.clone());
        Ok(count)
    }

    pub fn payment_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::PaymentCount)
            .unwrap_or(0u32)
    }

    pub fn get_payment(env: Env, index: u32) -> Option<PaymentEntry> {
        env.storage().instance().get(&DataKey::Payment(index))
    }

    /// O(1) dashboard / agent summary (Horizon indexer friendly).
    pub fn registry_stats(env: Env) -> RegistryStats {
        RegistryStats {
            next_agent_id: read_next_id(&env),
            payment_count: Self::payment_count(env.clone()),
            paused: Self::paused(env),
        }
    }
}

#[cfg(test)]
mod test;
