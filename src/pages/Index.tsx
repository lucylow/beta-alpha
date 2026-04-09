import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import GuardrailsPromiseSection from "@/components/landing/GuardrailsPromiseSection";
import RiskScenariosSection from "@/components/landing/RiskScenariosSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import SecuritySection from "@/components/landing/SecuritySection";
import ApprovalWorkflowSection from "@/components/landing/ApprovalWorkflowSection";
import DemoSimulator from "@/components/landing/DemoSimulator";
import SpendingLimitsSection from "@/components/landing/SpendingLimitsSection";
import AllowlistBlocklistSection from "@/components/landing/AllowlistBlocklistSection";
import AuditTrailSection from "@/components/landing/AuditTrailSection";
import TransactionFeed from "@/components/landing/TransactionFeed";
import HowItWorks from "@/components/landing/HowItWorks";
import TechSpecs from "@/components/landing/TechSpecs";
import PricingSection from "@/components/landing/PricingSection";
import InstallSection from "@/components/landing/InstallSection";
import ConfigGeneratorSection from "@/components/landing/ConfigGeneratorSection";
import FAQSection from "@/components/landing/FAQSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import TeamRoadmap from "@/components/landing/TeamRoadmap";
import DocsHubSection from "@/components/landing/DocsHubSection";
import ContactCaptureSection from "@/components/landing/ContactCaptureSection";
import JudgesSection from "@/components/landing/JudgesSection";
import FooterCTA from "@/components/landing/FooterCTA";

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero → Promise → Risk → Problem narrative */}
      <HeroSection />
      <GuardrailsPromiseSection />
      <RiskScenariosSection />
      <ProblemSection />
      {/* Solution → Controls → Approval demo */}
      <SolutionSection />
      <SecuritySection />
      <ApprovalWorkflowSection />
      <DemoSimulator />
      {/* Budget → Lists → Logs → Feed */}
      <SpendingLimitsSection />
      <AllowlistBlocklistSection />
      <AuditTrailSection />
      <TransactionFeed />
      {/* How it works → Tech → Pricing */}
      <HowItWorks />
      <TechSpecs />
      <PricingSection />
      {/* Onboarding → Config → FAQ */}
      <InstallSection />
      <ConfigGeneratorSection />
      <FAQSection />
      {/* Breadth → Credibility → Resources */}
      <UseCasesSection />
      <TeamRoadmap />
      <DocsHubSection />
      <ContactCaptureSection />
      <JudgesSection />
      <FooterCTA />
    </div>
  );
}
