#![cfg(test)]

extern crate std;

use super::{AgentPayContract, AgentPayContractClient, Error};
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

#[test]
fn initialize_register_and_payment() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AgentPayContract);
    let client = AgentPayContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);
    let payer = Address::generate(&env);

    env.mock_all_auths();
    client.initialize(&admin);

    let name = String::from_str(&env, "SearchBot");
    let endpoint = String::from_str(&env, "https://api.example/mcp");
    let category = String::from_str(&env, "search");
    let id = client
        .register_agent(&owner, &name, &endpoint, &category, &1_000_000i128)
        .unwrap();

    let pref = BytesN::from_array(&env, &[7u8; 32]);
    let pay_ix = client
        .record_query_payment(&payer, &id, &1_000_000i128, &pref)
        .unwrap();
    assert_eq!(pay_ix, 1);

    let agent = client.get_agent(&id).unwrap();
    assert_eq!(agent.reputation, 1);

    let stats = client.registry_stats();
    assert_eq!(stats.next_agent_id, id + 1);
    assert_eq!(stats.payment_count, 1);
    assert!(!stats.paused);
}

#[test]
fn below_listed_price_errors() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AgentPayContract);
    let client = AgentPayContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);
    let payer = Address::generate(&env);
    env.mock_all_auths();
    client.initialize(&admin);

    let name = String::from_str(&env, "Bot");
    let endpoint = String::from_str(&env, "https://x/mcp");
    let category = String::from_str(&env, "search");
    let id = client
        .register_agent(&owner, &name, &endpoint, &category, &1_000_000i128)
        .unwrap();

    let pref = BytesN::from_array(&env, &[9u8; 32]);
    assert_eq!(
        client.try_record_query_payment(&payer, &id, &999_999i128, &pref),
        Err(Ok(Error::BelowListedPrice))
    );
}

#[test]
fn payment_ref_replay_fails() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AgentPayContract);
    let client = AgentPayContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);
    let payer = Address::generate(&env);
    env.mock_all_auths();
    client.initialize(&admin);

    let name = String::from_str(&env, "Bot");
    let endpoint = String::from_str(&env, "https://x/mcp");
    let category = String::from_str(&env, "search");
    let id = client
        .register_agent(&owner, &name, &endpoint, &category, &500_000i128)
        .unwrap();

    let pref = BytesN::from_array(&env, &[3u8; 32]);
    client
        .record_query_payment(&payer, &id, &500_000i128, &pref)
        .unwrap();
    assert_eq!(
        client.try_record_query_payment(&payer, &id, &500_000i128, &pref),
        Err(Ok(Error::PaymentRefReused))
    );
}

#[test]
fn pause_blocks_payments() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AgentPayContract);
    let client = AgentPayContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let owner = Address::generate(&env);
    let payer = Address::generate(&env);
    env.mock_all_auths();
    client.initialize(&admin);

    let name = String::from_str(&env, "Bot");
    let endpoint = String::from_str(&env, "https://x/mcp");
    let category = String::from_str(&env, "search");
    let id = client
        .register_agent(&owner, &name, &endpoint, &category, &400_000i128)
        .unwrap();

    client.set_paused(&true).unwrap();
    let pref = BytesN::from_array(&env, &[1u8; 32]);
    assert_eq!(
        client.try_record_query_payment(&payer, &id, &400_000i128, &pref),
        Err(Ok(Error::Paused))
    );
}
