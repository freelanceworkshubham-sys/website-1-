import React from 'react';
import { ArrowRight, MapPin, Zap, CheckCircle2, Leaf } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

interface AboutSolarTechnologiesProps {
  onOpenQuote?: () => void;
}

export const AboutSolarTechnologies: React.FC<AboutSolarTechnologiesProps> = ({ onOpenQuote }) => {
  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenQuote) {
      onOpenQuote();
    }
  };

  return (
    <section
      id="about"
      className="relative py-10 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block">
              ABOUT GREEN INFRA
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Solar Energy & Electric Vehicles — <span className="text-emerald-700">One Destination.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Green Infra Solar & Electrical Vehicle is Jaysingpur's trusted green energy partner,
              located on the Sangli–Kolhapur Bypass near Miraj–Jaysingpur Railway Station.
              We supply and install solar panels from 1kW and above for homes, shops, industries,
              schools and more — and are an authorised dealer for electric vehicles in the region.
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sangli–Kolhapur Bypass, Near Miraj–Jaysingpur Railway Station, Jaysingpur, Maharashtra
              </span>
            </div>

            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={handleScrollToProjects}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors group cursor-pointer py-1.5 min-h-[44px]"
              >
                <span>EXPLORE OUR WORK</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Compact Proof Points */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-4">

            {/* Stat 1: Solar from 1kW */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-base sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors">
                1kW+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Solar
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Panels Available
              </span>
            </div>

            {/* Stat 2: EV Vehicles */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-base sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors">
                EV
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Vehicles
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Authorised Dealer
              </span>
            </div>

            {/* Stat 3: Location */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <Leaf className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Green
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Energy Partner
              </span>
            </div>

          </div>

        </div>

        {/* Feature highlights strip */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Solar Panels from 1kW & above', desc: 'Residential, Commercial & Industrial' },
            { label: 'Electric Vehicle Dealership', desc: 'Authorised EV dealer in Jaysingpur' },
            { label: 'Complete Solar Solutions', desc: 'Supply, installation & support' },
            { label: 'Jaysingpur, Maharashtra', desc: 'Sangli–Kolhapur Bypass location' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">{item.label}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
