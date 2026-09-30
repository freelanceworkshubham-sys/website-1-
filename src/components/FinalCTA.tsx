import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Sun } from 'lucide-react';

interface FinalCTAProps {
  onOpenQuote: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenQuote }) => {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-12 text-center relative overflow-hidden shadow-xl border border-slate-800">
          
          {/* Subtle warm glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6F500] bg-white/10 px-3.5 py-1 rounded-full border border-white/15 inline-block">
              READY TO GO SOLAR?
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Get a site assessment and solar estimate from GVP Solar Energy.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Transparent feasibility analysis, customized system capacity planning, and complete subsidy guidance for your home or enterprise.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>GET A FREE SOLAR QUOTE</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const calc = document.getElementById('calculator');
                  if (calc) calc.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-white/15 hover:border-white/25 active:scale-[0.98] cursor-pointer"
              >
                <span>Calculate Potential First</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6F500]" />
                Zero Sales Pressure
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#C6F500]" />
                Maharashtra Grid Calibrated
              </span>
              <span>·</span>
              <span>DISCOM Liaison Included</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
