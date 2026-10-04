import React from 'react';
import { ArrowRight, Phone, ShieldCheck, Sun, Zap, MapPin, MessageCircle } from 'lucide-react';

interface FinalCTAProps {
  onOpenQuote: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenQuote }) => {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-12 lg:p-14 text-center relative overflow-hidden shadow-2xl border border-slate-800">

          {/* Subtle warm glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 space-y-4 sm:space-y-5 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6F500] bg-white/10 px-3.5 py-1 rounded-full border border-white/15 inline-flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#C6F500]" />
              SWITCH TO SOLAR TODAY
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Save Up to 80% on Your Electricity Bills?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed max-w-lg mx-auto">
              Join 500+ satisfied homeowners, commercial businesses, and factories across Maharashtra who trust Invisible Energy. Get your free site assessment and customized quote today.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenQuote}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <span>GET FREE QUOTE</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
              </button>

              <a
                href="tel:+918888208099"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-white/15 hover:border-white/25 active:scale-[0.98] cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#C6F500]" />
                <span>Call +91 8888208099</span>
              </a>

              <a
                href="https://wa.me/+918888208099"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-emerald-500/40 active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-slate-400 border-t border-white/10 mt-6">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6F500]" />
                7+ Years Experience • Est. 2017
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#C6F500]" />
                500+ Projects in Maharashtra
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C6F500]" />
                138/1/A/9, Magdum Park, Sangliwadi, Sangli
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
