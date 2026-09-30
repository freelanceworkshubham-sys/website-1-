import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sun, MapPin, Phone, Mail, Building, Clock } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

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
    <footer id="contact" className="relative bg-white text-slate-900 border-t border-slate-200 pt-10 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        
        {/* Top Tier: Compact Solar Technologies Milestone Ribbon */}
        <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1 max-w-md">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#C6F500] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Solar Technologies • Established Solar EPC Partner
              </span>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                Powering Businesses, Homes &amp; Industries
              </h3>
              <p className="text-xs text-slate-400">
                Turnkey solar power solutions from concept and engineering through supply, installation, commissioning and dedicated O&amp;M support.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-8 border-t border-slate-800/80 pt-3 lg:border-t-0 lg:pt-0">
              <div>
                <CountUpNumber
                  value="25+"
                  className="font-telemetry text-xl sm:text-3xl font-bold text-[#C6F500] tracking-tight block"
                />
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Years of Commitment
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-white tracking-tight block">
                  MSEDCL
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Supervision &amp; Contracting
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-emerald-400 tracking-tight block">
                  Turnkey
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  EPC Solutions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Card: Verified Official Offices & Direct Channels */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Corporate Office */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Corporate Office</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Station Road, Opposite MSEDCL, Behind Hotel Status Inn, Ichalkaranji, Dist-Kolhapur, 416115, Maharashtra, India.
              </p>
            </div>

            {/* Kolhapur Office */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Kolhapur Office</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Shop No-11, Empire Tower, Dasara Chowk, Kolhapur - 416003, Maharashtra, India.
              </p>
            </div>

            {/* Direct Connect */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Reach Solar Technologies</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                <p>
                  <a href="tel:+917620762036" className="hover:text-emerald-700 font-semibold transition-colors">
                    +91 76207 62036
                  </a>
                </p>
                <p>
                  <a href="tel:+917057473392" className="hover:text-emerald-700 font-semibold transition-colors">
                    +91 70574 73392
                  </a>
                </p>
                <p className="pt-1 flex items-center gap-1.5 text-xs text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href="mailto:soltechno@outlook.com" className="hover:text-emerald-700 transition-colors">
                    soltechno@outlook.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Tier: Brand + Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand (Col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-2.5">
              <img
                src="/solar-tech-logo.png"
                alt="Solar Technologies"
                className="h-7 w-auto object-contain"
              />
            </a>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Solar Technologies is an established solar solutions provider based in Ichalkaranji, Maharashtra. Providing integrated solar solutions across residential, commercial, industrial and institutional applications.
            </p>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Govt. Licensed Electrical Contractor (M. C. NO-11716)</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                In-house MSEDCL supervision &amp; engineering contracting with 25+ years of experience.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Receive solar updates &amp; net-metering advisories
              </span>
              
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Subscribed to Solar Technologies updates.</span>
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
            
            {/* Nav Group 1: Navigation (Exactly matching Section 15 requirements) */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#" className="hover:text-emerald-700 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">About</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Services</a></li>
                <li><a href="#solar-journey" className="hover:text-emerald-700 transition-colors">Solar Journey</a></li>
                <li><a href="#projects" className="hover:text-emerald-700 transition-colors">Projects</a></li>
                <li><a href="#calculator" className="hover:text-emerald-700 transition-colors">Calculator</a></li>
                <li><a href="#contact" className="hover:text-emerald-700 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Nav Group 2: Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">EPC Solutions</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Rooftop Solar</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Operation &amp; Maintenance</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">MSEDCL Supervision</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Net Metering Coordination</a></li>
              </ul>
            </div>

            {/* Nav Group 3: Why Solar Technologies */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Why Us
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">25+ Years Commitment</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">In-House Structure Design</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Superior Workmanship</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Dedicated O&amp;M Team</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Govt. Licensed (M.C. 11716)</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Tier: Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} Solar Technologies. All rights reserved. Ichalkaranji, Kolhapur, Maharashtra.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Official Website: solartechnologies.in
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

