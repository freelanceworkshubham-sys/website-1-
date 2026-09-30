import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SolarHero3DExperience } from './components/SolarHero3DExperience';
import { LiveTelemetryBar } from './components/LiveTelemetryBar';
import { SolarBenefitsRibbon } from './components/SolarBenefitsRibbon';
import { AboutGVP } from './components/AboutGVP';
import { SolarCalculator } from './components/SolarCalculator';
import { ImpactAndProof } from './components/ImpactAndProof';
import { SystemShowcase } from './components/SystemShowcase';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { SystemTier } from './types/solar';

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteInitialData, setQuoteInitialData] = useState<any>(null);
  const [heroProgress, setHeroProgress] = useState<number>(0);
  
  // Showcase Frame Mode: allows toggling between framed presentation and full-screen view
  const [isFramedShowcase, setIsFramedShowcase] = useState(false);

  const handleOpenCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenQuote = (data?: any) => {
    if (data) {
      setQuoteInitialData(data);
    }
    setIsQuoteOpen(true);
  };

  const handleSelectSystem = (tier: SystemTier) => {
    setQuoteInitialData({
      propertyType: tier.id,
      systemName: tier.name,
    });
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Main Website Container */}
      <div
        className={`w-full bg-white text-slate-900 overflow-x-clip ${
          isFramedShowcase
            ? 'max-w-[1440px] rounded-3xl md:rounded-[2.5rem] shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-white/25 ring-1 ring-black/40'
            : ''
        }`}
      >
        {/* Navigation Bar: Auto-hides at Hero for pristine cinematic view; reveals smoothly on scroll down leaving Hero */}
        <Navbar
          onOpenCalculator={handleOpenCalculator}
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* 01 — HERO (Cinematic 3D Scroll & Hero Experience) */}
        <SolarHero3DExperience
          onExploreInnovation={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCalculator={handleOpenCalculator}
          onOpenQuote={() => handleOpenQuote()}
          onScrollProgressChange={(progress) => {
            setHeroProgress(progress);
          }}
        />

        {/* 02 — ABOUT GVP SOLAR ENERGY (Shifted Up: Who we are, 13+ Years, 500+ Projects, 10+ MW) */}
        <AboutGVP onOpenQuote={() => handleOpenQuote()} />

        {/* 03 — HOW IT WORKS / SOLAR JOURNEY (Circular Interactive Process: Plan → Survey → Design → Install) */}
        <LiveTelemetryBar />

        {/* 04 — SMALL SOLAR BENEFITS RIBBON (PM Surya Ghar, Savings, ROI, Projects) */}
        <SolarBenefitsRibbon />

        {/* 05 — PROJECTS (Field-Verified Installations Across Maharashtra) */}
        <ImpactAndProof />

        {/* 06 — SERVICES (Key GVP Solar EPC Services) */}
        <SystemShowcase onSelectSystem={handleSelectSystem} />

        {/* 07 — SOLAR CALCULATOR (Shifted Down: Interactive Solar Yield & Financial Estimate) */}
        <SolarCalculator
          onScheduleAudit={(details) => handleOpenQuote(details)}
        />

        {/* 08 — FINAL CTA (Compact Site Assessment & Free Quote Conversion) */}
        <FinalCTA onOpenQuote={() => handleOpenQuote()} />

        {/* 09 — FOOTER */}
        <Footer />
      </div>

      {/* Interactive Consultation & Proposal Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialData={quoteInitialData}
      />
    </div>
  );
}
