import React from 'react';
import { Zap, Star } from 'lucide-react';
import { SolarLandscapeArtwork } from './SolarLandscapeArtwork';

interface HeroSectionProps {
  onExploreInnovation: () => void;
  onOpenCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreInnovation, onOpenCalculator }) => {
  return (
    <section id="hero" className="relative min-h-[920px] lg:min-h-screen w-full flex flex-col justify-between pt-28 md:pt-36 pb-12 px-6 md:px-12 lg:px-16 overflow-hidden">
      {/* 100% Matched Landscape Artwork with Mountain Valley & Solar Farm Grid */}
      <SolarLandscapeArtwork />

      {/* Hero Body Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-end pb-4 md:pb-8">
        
        {/* Main Content Area: Left Typography & Right Glass Stat Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 md:mb-14">
          
          {/* LEFT COLUMN: Social Proof Capsule, Headline, Subtitle, CTA */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Social Proof Pill (100% matched to image) */}
            <div className="inline-flex items-center gap-3 bg-black/45 backdrop-blur-md border border-white/20 rounded-full py-1 px-1.5 pr-4 shadow-xl">
              {/* Stacked User Avatars + Lime Plus Badge */}
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer avatar"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                />
                {/* Neon Lime Plus Button */}
                <div className="w-7 h-7 rounded-full bg-[#C6F500] text-black font-bold text-xs flex items-center justify-center border-2 border-black/40 shadow-sm z-10">
                  +
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#C6F500] animate-pulse" />
                <span className="text-white/90 font-medium tracking-tight whitespace-nowrap">
                  25+ Years of Solar Experience
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              Powering Businesses, <br />
              Homes &amp; <span className="font-editorial-italic font-normal text-white">Industries</span>
            </h1>

            {/* Subtitle Body Text */}
            <p className="text-white/85 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
              Green Infra Solar & Electrical Vehicle — Jaysingpur's trusted destination for solar panels from 1kW and above, EV vehicles, and complete green energy solutions across Maharashtra.
            </p>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={onOpenCalculator}
                className="group inline-flex items-center gap-2.5 bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold text-sm md:text-base px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(198,245,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Calculate Your Solar Savings</span>
                <Zap className="w-4 h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Two Glassmorphism Stat Cards */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end justify-end">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
              
              {/* Stat Card 1: 25+ Years */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-[#C6F500] leading-none">
                  25+
                </span>
                <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                  Years of Solar Commitment
                </p>
              </div>

              {/* Stat Card 2: Turnkey EPC */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                <span className="font-telemetry text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  EPC
                </span>
                <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                  End-to-End Solar Solutions
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Verified Credentials */}
        <div className="border-t border-white/15 pt-6 mt-4">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl ml-auto text-center">
            
            <div className="flex flex-col items-center">
              <span className="font-telemetry text-xl sm:text-2xl font-bold text-white tracking-tight leading-none mb-1">
                25+ YRS
              </span>
              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                Solar Experience
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-telemetry text-xl sm:text-2xl font-bold text-[#C6F500] tracking-tight leading-none mb-1">
                MSEDCL
              </span>
              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                Supervision &amp; Contracting
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-telemetry text-xl sm:text-2xl font-bold text-white tracking-tight leading-none mb-1">
                TURNKEY
              </span>
              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                End-to-End Solutions
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
