import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Sun, Zap, MapPin } from 'lucide-react';

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
              READY TO GO GREEN?
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Get solar panels or an EV from Green Infra — Jaysingpur's green energy destination.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Visit us at the Sangli–Kolhapur Bypass, near Miraj–Jaysingpur Railway Station. Solar panels from 1kW and above. EV vehicles available.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>ENQUIRE NOW</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="tel:+919370000000"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-white/15 hover:border-white/25 active:scale-[0.98] cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Green Infra</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#C6F500]" />
                Solar Panels from 1kW & Above
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#C6F500]" />
                EV Vehicles — Authorised Dealer
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C6F500]" />
                Jaysingpur, Maharashtra
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
