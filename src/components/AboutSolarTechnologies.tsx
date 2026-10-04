import React from 'react';
import { ArrowRight, MapPin, Zap, CheckCircle2, ShieldCheck, Sun, Award, Users } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

interface AboutSolarTechnologiesProps {
  onOpenQuote?: () => void;
}

export const AboutSolarTechnologies: React.FC<AboutSolarTechnologiesProps> = ({ onOpenQuote }) => {
  const handleScrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenQuote) {
      onOpenQuote();
    }
  };

  return (
    <section
      id="about"
      className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5">
              <Sun className="w-3 h-3 text-emerald-600" />
              ABOUT INVISIBLE ENERGY
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Maharashtra's Trusted <span className="text-emerald-700">Solar Energy Partner</span> Since 2017
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Established in 2017, Invisible Energy has grown to become a leading wholesaler, dealer,
              and EPC provider of comprehensive Solar Power Energy Systems across Maharashtra and India.
              We specialize in complete solar installations from consultation to commissioning, helping
              homes, commercial enterprises, and manufacturing facilities harness clean energy while reducing
              electricity costs by up to 80%.
            </p>

            <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                138/1/A/9, Magdum Park, Sangliwadi Toll Naka, Sangli - 416416, Maharashtra
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleScrollToServices}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors group cursor-pointer py-1.5 min-h-[44px]"
              >
                <span>EXPLORE ALL 11 SOLAR SERVICES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-emerald-600" />
              </button>

              {onOpenQuote && (
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/70 px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <span>Free Site Assessment</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: 3 Real Metric Proof Cards */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2 sm:gap-4">

            {/* Stat 1: 500+ Projects Done */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors">
                500+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Projects
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Installed
              </span>
            </div>

            {/* Stat 2: 7+ Years Experience */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors">
                7+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Years
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Since 2017
              </span>
            </div>

            {/* Stat 3: 400+ Clients */}
            <div className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-3 sm:p-5 text-center flex flex-col justify-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block group-hover:text-emerald-900 transition-colors">
                400+
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase text-emerald-800 tracking-wider mt-0.5 sm:mt-1 block">
                Clients
              </span>
              <span className="text-[9px] sm:text-xs text-slate-500 mt-0.5 block leading-tight">
                Satisfied
              </span>
            </div>

          </div>

        </div>

        {/* Feature highlights strip matching invisibleenergy.in */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'Professional Installation',
              desc: 'Expert engineers with 1000+ completed installations',
              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            },
            {
              title: 'Tier-1 Components',
              desc: 'High-efficiency panels with 25+ year performance warranty',
              icon: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            },
            {
              title: 'Best Pricing & Subsidies',
              desc: 'PM Surya Ghar subsidy aid saving up to 40% on setup',
              icon: <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            },
            {
              title: 'Lifetime Local Support',
              desc: 'Dedicated maintenance, net-metering & rapid repairs',
              icon: <Users className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {item.icon}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">{item.title}</p>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
