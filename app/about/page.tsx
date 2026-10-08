import AboutHero from "@/src/components/about/AboutHero";
import HowItWorks from "@/src/components/about/HowItWorks";
import Footer from "@/src/components/Footer";
import LandingHeader from "@/src/components/LandingHeader";
import React from "react";


export const metadata = {
  title: "About Us | SunZee1",
  description: "Learn about SunZee1, a registered solar energy investment platform.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050814] text-white">
      
      {/* Global Navigation */}
      <LandingHeader />

      {/* Main Page Content */}
      <main className="flex flex-1 flex-col pb-24">
        
        {/* Modular Sections */}
        <AboutHero />
        <HowItWorks />
        
        {/* You can easily drop in more sections here later */}
        {/* <CompanyDetails /> */}
        {/* <SecurityAudits /> */}
        
      </main>

      {/* Global Footer */}
      <Footer />
      
    </div>
  );
}