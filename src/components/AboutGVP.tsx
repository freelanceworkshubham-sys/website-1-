import React from 'react';
import { ArrowRight, Award, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface AboutGVPProps {
  onOpenQuote?: () => void;
}

export const AboutGVP: React.FC<AboutGVPProps> = ({ onOpenQuote }) => {
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
              ABOUT GVP SOLAR ENERGY
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Powering Maharashtra with Practical Solar.
            </h2>

            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl">
              GVP Solar Energy delivers rooftop and commercial solar solutions — from system design and installation to approvals, net metering and after-sales support.
            </p>

            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={handleScrollToProjects}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors group cursor-pointer py-1.5 min-h-[44px]"
              >
                <span>LEARN ABOUT GVP</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Compact Proof Points */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-4">
            
            {/* Stat 1 */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors truncate">
                13+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Years
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block truncate">
                Experience
              </span>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors truncate">
                500+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Projects
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block truncate">
                Delivered
              </span>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors truncate">
                10+ MW
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Executed
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block truncate">
                Capacity
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
