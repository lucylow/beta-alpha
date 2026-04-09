import { WalletAgent } from "./walletAgent";

const wallet = new WalletAgent(5);
console.log(wallet.getBalance());
console.log(wallet.spend(0.001));
