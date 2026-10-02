import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sun, MapPin, Phone, Mail, Zap, Clock } from 'lucide-react';

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

        {/* Top Tier: Green Infra Identity Ribbon */}
        <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1 max-w-md">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#C6F500] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Green Infra Solar & Electrical Vehicle • Jaysingpur
              </span>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                Solar Panels & Electric Vehicles — One Destination
              </h3>
              <p className="text-xs text-slate-400">
                Solar panels from 1kW and above for homes, shops, industries and institutions. Authorised EV dealer in Jaysingpur, Maharashtra.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-8 border-t border-slate-800/80 pt-3 lg:border-t-0 lg:pt-0">
              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-[#C6F500] tracking-tight block">
                  1kW+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Solar Panels
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-white tracking-tight block">
                  EV
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Electric Vehicles
                </span>
              </div>

              <div>
                <span className="font-telemetry text-xl sm:text-3xl font-bold text-emerald-400 tracking-tight block">
                  MH
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Maharashtra
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* Store Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Store Address</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Sangli–Kolhapur Bypass, Near Miraj–Jaysingpur Railway Station, Jaysingpur, Maharashtra, India.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Open: Mon–Sat, 9:00 AM – 7:00 PM</span>
              </div>
            </div>

            {/* Google Maps / Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Find Us</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Located on the Sangli–Kolhapur Bypass road, conveniently situated near Miraj–Jaysingpur Railway Station for easy access from across the region.
              </p>
            </div>

            {/* Direct Connect */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D4C]">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Contact Green Infra</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                <p>
                  <a href="tel:+919370000000" className="hover:text-emerald-700 font-semibold transition-colors">
                    Contact via WhatsApp or Call
                  </a>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  📍 पत्ता — सांगली-कोल्हापूर बायपास, मिरज-जयसिंगपूर रेल्वे स्टेशन, जयसिंगपूर
                </p>
                <p className="text-[11px] text-slate-500">
                  🔋 1kW पासून पुढे सोलर पॅनल उपलब्ध
                </p>
                <p className="text-[11px] text-slate-500">
                  ⚡ इलेक्ट्रिक वाहने उपलब्ध
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
              <div className="w-8 h-8 rounded-full bg-[#C6F500] flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <circle cx="12" cy="10" r="3.5" fill="#1a3a1a" />
                  <line x1="12" y1="4" x2="12" y2="2" stroke="#1a3a1a" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="17.5" y1="5.5" x2="19" y2="4" stroke="#1a3a1a" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="20" y1="10" x2="22" y2="10" stroke="#1a3a1a" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 16 L8 21 L14 15 L12 15 L14 10 L8 17 Z" fill="#1a3a1a"/>
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">Green Infra Solar & Electrical Vehicle</span>
            </a>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Green Infra Solar & Electrical Vehicle is Jaysingpur's trusted green energy partner — supplying solar panels from 1kW and above, and serving as an authorised electric vehicle dealer across the Sangli–Kolhapur region.
            </p>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Solar Panels from 1kW & Above</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Authorised Electric Vehicle Dealer</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-5">
                Jaysingpur, Sangli–Kolhapur Bypass, Maharashtra
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Get solar & EV updates from Green Infra
              </span>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Subscribed to Green Infra updates.</span>
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
                <li><a href="#" className="hover:text-emerald-700 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">About Green Infra</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a></li>
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
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Panels (1kW+)</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Electric Vehicles (EV)</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Installation & Setup</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">Net Metering</a></li>
                <li><a href="#services" className="hover:text-emerald-700 transition-colors">After-Sales Service</a></li>
              </ul>
            </div>

            {/* Nav Group 3: Why Green Infra */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Why Us
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Solar from 1kW & Above</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Authorised EV Dealer</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Jaysingpur Location</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">Complete Installation</a></li>
                <li><a href="#about" className="hover:text-emerald-700 transition-colors">After-Sales Support</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Tier: Copyright */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} Green Infra Solar & Electrical Vehicle. All rights reserved. Jaysingpur, Maharashtra.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Jaysingpur, Sangli–Kolhapur Bypass
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
