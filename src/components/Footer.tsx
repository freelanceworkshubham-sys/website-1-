import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sun, MapPin, Phone, Mail, Clock, Youtube, MessageCircle, Instagram } from 'lucide-react';

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

        {/* Top Tier: Invisible Energy Identity Ribbon */}
        <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1.5 max-w-lg">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#C6F500] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                Invisible Energy • Sangli, Maharashtra
              </span>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                Leading Solar Panel Installation Company in Sangli
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Established in 2017, Invisible Energy has grown to become a leading wholesaler &amp; dealer of comprehensive Solar Power Energy Systems across Maharashtra and India.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-6 border-t border-slate-800/80 pt-3 lg:border-t-0 lg:pt-0">
              <div>
                <span className="font-telemetry text-lg sm:text-2xl font-bold text-[#C6F500] tracking-tight block">
                  500+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Projects Done
                </span>
              </div>

              <div>
                <span className="font-telemetry text-lg sm:text-2xl font-bold text-white tracking-tight block">
                  400+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Total Clients
                </span>
              </div>

              <div>
                <span className="font-telemetry text-lg sm:text-2xl font-bold text-emerald-400 tracking-tight block">
                  7+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Years Exp.
                </span>
              </div>

              <div>
                <span className="font-telemetry text-lg sm:text-2xl font-bold text-amber-400 tracking-tight block">
                  15+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5 leading-tight">
                  Awards Won
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

            {/* Office Address */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Our Office Address</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                138/1/A/9, Magdum Park, Sangliwadi Toll Naka, Sangli - 416416, Maharashtra, India.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Mon - Sat (09:00 AM - 06:00 PM)</span>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call &amp; WhatsApp Us</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                <p>
                  <a href="tel:+918888208099" className="hover:text-emerald-700 font-semibold transition-colors block">
                    +91 8888208099
                  </a>
                </p>
                <p>
                  <a href="tel:+917020205273" className="hover:text-emerald-700 font-semibold transition-colors block">
                    +91 7020205273
                  </a>
                </p>
                <p className="pt-1">
                  <a
                    href="https://wa.me/+918888208099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </p>
              </div>
            </div>

            {/* Email & Social Connect */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email &amp; Social Connect</span>
              </div>
              <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                <p>
                  <a href="mailto:contact@invisibleenergy.in" className="hover:text-emerald-700 font-semibold transition-colors">
                    contact@invisibleenergy.in
                  </a>
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <a
                    href="https://www.youtube.com/@invisibleenergy-t9k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                    title="Invisible Energy YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/invisible_energy_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
                    title="Invisible Energy Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/+918888208099"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                    title="WhatsApp Invisible Energy"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-52 sm:h-64 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.1867154026127!2d74.54477707578009!3d16.86665568393438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc11970bfb901fb%3A0x50be9a3cd2a609e6!2sInvisible%20Energy!5e0!3m2!1sen!2sin!4v1766832071943!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            title="Invisible Energy Sangli Google Maps Location"
          />
        </div>

        {/* Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-4 border-t border-slate-200 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-emerald-700 transition-colors">About Invisible Energy</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Solutions</a></li>
              <li><a href="#workflow" className="hover:text-emerald-700 transition-colors">5-Stage Work Process</a></li>
              <li><a href="#portfolio" className="hover:text-emerald-700 transition-colors">Completed Projects</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Power Systems
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">On Grid Solar System</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Off Grid Solar System</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Rooftop Solar System</a></li>
              <li><a href="#calculator" className="hover:text-emerald-700 transition-colors">Solar Yield Calculator</a></li>
              <li><a href="#faq" className="hover:text-emerald-700 transition-colors">PM Surya Ghar Subsidy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Equipment &amp; Lighting
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Tier-1 Solar Panels</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Inverters &amp; PCUs</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Batteries &amp; Storage</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Street Lights</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Highmast Towers</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Water Heater / Geyser</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Service &amp; Support
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Solar Panel Cleaning</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Inverter Repair &amp; Health</a></li>
              <li><a href="#services" className="hover:text-emerald-700 transition-colors">Chemical Earthing Audit</a></li>
              <li><a href="#faq" className="hover:text-emerald-700 transition-colors">Installation FAQs</a></li>
              <li><a href="#contact" className="hover:text-emerald-700 transition-colors">Schedule Site Survey</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            &copy; 2017 - {new Date().getFullYear()} <strong className="text-slate-700 font-semibold">Invisible Energy</strong>. All Rights Reserved. Sangli, Maharashtra.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>138/1/A/9, Magdum Park, Sangliwadi Toll Naka</span>
            <span>•</span>
            <a href="tel:+918888208099" className="hover:text-emerald-700">+91 8888208099</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
