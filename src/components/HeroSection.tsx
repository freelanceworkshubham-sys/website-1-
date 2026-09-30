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

              {/* Five Star Rating & 90k+ Users Worldwide */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white/90 font-medium tracking-tight whitespace-nowrap">
                  90k+ Users Worldwide
                </span>
              </div>
            </div>

            {/* Main Headline (Exact Typography & Line Breaks from Reference) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              Next-Generation <br />
              Solar Energy <span className="font-editorial-italic font-normal text-white">Solutions</span>
            </h1>

            {/* Subtitle Body Text */}
            <p className="text-white/85 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
              Delivering reliable, eco-friendly solar solutions designed to reduce energy costs while minimizing environmental impact.
            </p>

            {/* Primary Action Button (Neon Lime Pill with Lightning Bolt) */}
            <div className="pt-2">
              <button
                onClick={onExploreInnovation}
                className="group inline-flex items-center gap-2.5 bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold text-sm md:text-base px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(198,245,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Innovation</span>
                <Zap className="w-4 h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Two Glassmorphism Stat Cards */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end justify-end">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
              
              {/* Stat Card 1: 35% Reduced Carbon Footprint */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                  35%
                </span>
                <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                  Reduced Carbon Footprint
                </p>
              </div>

              {/* Stat Card 2: 25% Reduced Electricity Footprint */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                  25%
                </span>
                <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                  Reduced Electricity Footprint
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Award Laurels & Multipliers (100% matched to image) */}
        <div className="border-t border-white/15 pt-6 mt-4">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl ml-auto">
            
            {/* Laurel 1: 7.9X GreenTech Award 2023 */}
            <div className="flex flex-col items-center text-center">
              <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                7.9X
              </span>
              
              {/* Laurel Wreath Graphic with Leader Badge */}
              <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                  {/* Left Wreath Branch */}
                  <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                  <path d="M22,24 C16,20 12,24 16,30" />
                  <path d="M26,36 C20,34 18,40 22,44" />
                  <path d="M35,46 C30,46 30,52 35,53" />
                  <path d="M20,14 C16,10 22,8 26,12" />

                  {/* Right Wreath Branch */}
                  <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                  <path d="M78,24 C84,20 88,24 84,30" />
                  <path d="M74,36 C80,34 82,40 78,44" />
                  <path d="M65,46 C70,46 70,52 65,53" />
                  <path d="M80,14 C84,10 78,8 74,12" />
                </svg>
                {/* Center Leader Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                    Leader
                  </span>
                  <span className="text-[7px] text-white/60 leading-none mt-0.5">
                    Verified
                  </span>
                </div>
              </div>

              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                GreenTech Innovation Award 2023
              </span>
            </div>

            {/* Laurel 2: 5X GreenTech Award 2024 */}
            <div className="flex flex-col items-center text-center">
              <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                5X
              </span>
              
              {/* Laurel Wreath Graphic with Leader Badge */}
              <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                  {/* Left Wreath Branch */}
                  <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                  <path d="M22,24 C16,20 12,24 16,30" />
                  <path d="M26,36 C20,34 18,40 22,44" />
                  <path d="M35,46 C30,46 30,52 35,53" />
                  <path d="M20,14 C16,10 22,8 26,12" />

                  {/* Right Wreath Branch */}
                  <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                  <path d="M78,24 C84,20 88,24 84,30" />
                  <path d="M74,36 C80,34 82,40 78,44" />
                  <path d="M65,46 C70,46 70,52 65,53" />
                  <path d="M80,14 C84,10 78,8 74,12" />
                </svg>
                {/* Center Leader Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                    Leader
                  </span>
                  <span className="text-[7px] text-white/60 leading-none mt-0.5">
                    Verified
                  </span>
                </div>
              </div>

              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                GreenTech Innovation Award 2024
              </span>
            </div>

            {/* Laurel 3: 1.2X GreenTech Award 2025 */}
            <div className="flex flex-col items-center text-center">
              <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                1.2X
              </span>
              
              {/* Laurel Wreath Graphic with Leader Badge */}
              <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                  {/* Left Wreath Branch */}
                  <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                  <path d="M22,24 C16,20 12,24 16,30" />
                  <path d="M26,36 C20,34 18,40 22,44" />
                  <path d="M35,46 C30,46 30,52 35,53" />
                  <path d="M20,14 C16,10 22,8 26,12" />

                  {/* Right Wreath Branch */}
                  <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                  <path d="M78,24 C84,20 88,24 84,30" />
                  <path d="M74,36 C80,34 82,40 78,44" />
                  <path d="M65,46 C70,46 70,52 65,53" />
                  <path d="M80,14 C84,10 78,8 74,12" />
                </svg>
                {/* Center Leader Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                    Leader
                  </span>
                  <span className="text-[7px] text-white/60 leading-none mt-0.5">
                    Verified
                  </span>
                </div>
              </div>

              <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                GreenTech Innovation Award 2025
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
