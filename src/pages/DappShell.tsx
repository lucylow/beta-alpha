import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DappLayout from "@/components/dapp/DappLayout";
import HeroDashboard from "./dapp/HeroDashboard";
import SearchConsole from "./dapp/SearchConsole";
import WalletCenter from "./dapp/WalletCenter";
import ActivityFeed from "./dapp/ActivityFeed";
import ProtocolExplainer from "./dapp/ProtocolExplainer";
import PricingPage from "./dapp/PricingPage";
import DocsPage from "./dapp/DocsPage";
import DemoMode from "./dapp/DemoMode";
import AnalyticsPage from "./dapp/AnalyticsPage";
import TrustPage from "./dapp/TrustPage";

export default function DappShell() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");

  return (
    <DappLayout
      walletConnected={walletConnected}
      onToggleWallet={() => setWalletConnected((p) => !p)}
      network={network}
      onToggleNetwork={() => setNetwork((p) => (p === "testnet" ? "mainnet" : "testnet"))}
    >
      <Routes>
        <Route index element={<HeroDashboard walletConnected={walletConnected} network={network} />} />
        <Route path="search" element={<SearchConsole walletConnected={walletConnected} network={network} />} />
        <Route path="wallet" element={<WalletCenter walletConnected={walletConnected} onToggleWallet={() => setWalletConnected((p) => !p)} network={network} />} />
        <Route path="activity" element={<ActivityFeed />} />
        <Route path="protocol" element={<ProtocolExplainer />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route path="demo" element={<DemoMode />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="trust" element={<TrustPage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </DappLayout>
  );
}
