import CtaSection from "@/src/components/CtaSection";
import FaqSection from "@/src/components/FaqSection";
import Footer from "@/src/components/Footer";
import InfrastructureSection from "@/src/components/InfrastructureSection";
import LandingHeader from "@/src/components/LandingHeader";
import LandingHero from "@/src/components/LandingHero";
import NetworkSection from "@/src/components/NetworkSection";
import ProtocolFlow from "@/src/components/ProtocolFlow";



export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0f0d]">
      {/* Header Navigation */}
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <LandingHero />
        <ProtocolFlow />
        <NetworkSection/>
        <InfrastructureSection />
        <FaqSection/>
        <CtaSection/>
      </main>
        <Footer/>
    </div>
  );
}