import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Demo from "./pages/Demo.tsx";
import Index from "./pages/Index.tsx";
import Marketplace from "./pages/Marketplace.tsx";
import Dao from "./pages/Dao.tsx";
import AgentsDashboard from "./pages/AgentsDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const SpecializedAgentsFramework = lazy(() => import("./pages/SpecializedAgentsFramework.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="x402-search-theme">
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/dao" element={<Dao />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/agents" element={<AgentsDashboard />} />
                <Route
                  path="/specialized-agents"
                  element={
                    <Suspense
                      fallback={
                        <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground text-sm">
                          Loading framework…
                        </div>
                      }
                    >
                      <SpecializedAgentsFramework />
                    </Suspense>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
