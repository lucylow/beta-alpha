import { useRef } from "react";
import HeroSection from "@/components/free-ai-setup/HeroSection";
import AudienceSection from "@/components/free-ai-setup/AudienceSection";
import PathSelector from "@/components/free-ai-setup/PathSelector";
import { LocalStepsSection, ModelComparisonSection, ConnectionSection } from "@/components/free-ai-setup/LocalSetupSection";
import { CloudSection, GpuSection } from "@/components/free-ai-setup/CloudGpuSection";
import TradeoffSection from "@/components/free-ai-setup/TradeoffSection";
import { QuickStartSection, PromptExamplesSection } from "@/components/free-ai-setup/QuickStartSection";
import {
  TroubleshootingSection,
  PrivacySection,
  FaqSection,
  ResourcesSection,
  RoadmapSection,
  CommunitySection,
  FooterSection,
} from "@/components/free-ai-setup/ReferenceSection";

export default function FreeAiSetup() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const pathClick = (p: string) => {
    const map: Record<string, string> = { local: "local-setup", cloud: "cloud-apis", gpu: "gpu-rental" };
    scrollTo(map[p] ?? "path-selector");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* sticky nav */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <span className="font-bold text-sm text-foreground">Free AI Setup</span>
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            {[
              ["Local", "local-setup"],
              ["Cloud", "cloud-apis"],
              ["GPU", "gpu-rental"],
              ["Compare", "path-selector"],
              ["FAQ", ""],
            ].map(([label, id]) => (
              <button
                key={label}
                onClick={() => {
                  if (id) scrollTo(id);
                  else document.querySelector("section:last-of-type")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <HeroSection onPathClick={pathClick} />
      <AudienceSection />
      <PathSelector />
      <LocalStepsSection />
      <ConnectionSection />
      <ModelComparisonSection />
      <CloudSection />
      <GpuSection />
      <TradeoffSection />
      <QuickStartSection />
      <PromptExamplesSection />
      <TroubleshootingSection />
      <PrivacySection />
      <FaqSection />
      <ResourcesSection />
      <RoadmapSection />
      <CommunitySection />
      <FooterSection />
    </div>
  );
}
