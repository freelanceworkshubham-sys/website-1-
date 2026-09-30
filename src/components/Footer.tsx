import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sun, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative bg-white text-slate-900 border-t border-slate-200 pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        
        {/* Top Tier: Compact GVP Milestone Ribbon */}
        <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1 max-w-md">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#C6F500] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                GVP Solar Energy EPC
              </span>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                Powering Maharashtra with Practical Solar
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end solar engineering, procurement, net-metering approvals and lifelong maintenance.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-8 border-t border-slate-800/80 pt-3 lg:border-t-0 lg:pt-0">
              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-[#C6F500] tracking-tight block">
                  13+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Years Experience
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-white tracking-tight block">
                  500+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Sites Powered
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-emerald-400 tracking-tight block">
                  10+ MW
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Solar Capacity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Tier: Brand + Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand (Col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#C6F500] flex items-center justify-center p-1 shadow-sm border border-black/10">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-black stroke-current stroke-2">
                  <circle cx="12" cy="12" r="9" strokeWidth="2.5" />
                  <polygon points="12,5 17,8 19,13 16,18 10,19 6,15 6,9" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="text-slate-900 font-bold tracking-tight text-xl">GVP Solar Energy</span>
            </a>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Certified solar EPC solutions in Maharashtra. Delivering rooftop, commercial and industrial solar power plants with hassle-free DISCOM net-metering.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Ichalkaranji · Kolhapur · Pune · Sangli · Solapur · Satara</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Stay updated on solar subsidies &amp; net-metering norms
              </span>
              
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Subscribed to GVP Solar updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="group bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links (Col span 7) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            
            {/* Nav Group 1: Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#solar-journey" className="hover:text-emerald-700 transition-colors">Solar Journey</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">About GVP</a></li>
                <li><a href="#calculator" className="hover:text-emerald-700 transition-colors">Solar Calculator</a></li>
                <li><a href="#projects" className="hover:text-emerald-700 transition-colors">Field Projects</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">EPC Services</a></li>
              </ul>
            </div>

            {/* Nav Group 2: Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Residential Solar</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Commercial Rooftop</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Industrial HT Solar</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Net Metering Support</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Operations &amp; Maintenance</a></li>
              </ul>
            </div>

            {/* Nav Group 3: Schemes & Standards */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Schemes &amp; Trust
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#calculator" className="hover:text-emerald-700 transition-colors">PM Surya Ghar Subsidy</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">MSEDCL Net Metering</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">25-Year Panel Warranty</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">10+ MW Experience</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Safety Standard Compliant</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Tier: Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} GVP Solar Energy. All rights reserved. Maharashtra, India.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Maharashtra Solar EPC Specialist
            </span>
            <span className="text-slate-300">|</span>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
