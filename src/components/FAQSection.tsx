import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Sonar’s bifacial technology perform on cloudy, rainy, or winter days?',
      a: 'Even in heavy cloud cover, daylight contains high amounts of diffuse irradiance. Sonar N-type TOPCon cells are specifically engineered with wide-spectrum absorption that captures ambient blue light and infrared radiation. In winter, snow surrounding the panels acts as a natural mirror (albedo effect), allowing the rear glass of our bifacial modules to boost energy yield by up to 28% compared to standard panels.',
    },
    {
      q: 'What happens to my power supply during a municipal grid blackout?',
      a: 'Standard solar grid-tied systems shut off automatically during a blackout to protect utility line workers. However, when paired with the Sonar Solid-State Battery Wall, our intelligent microgrid switch automatically isolates your home from the downed utility in under 8 milliseconds (UPS speed). Your refrigerator, HVAC, Wi-Fi, and medical equipment continue running seamlessly without any power drop.',
    },
    {
      q: 'How does the PM Surya Ghar Muft Bijli Yojana subsidy work?',
      a: 'Under the Government of India\'s PM Surya Ghar scheme, residential households installing rooftop solar panels receive a direct subsidy: ₹30,000 per kW for systems up to 2 kW and ₹18,000 per kW for the next 1 kW (3 kW total). For a 3 kW system costing approximately ₹1,65,000, you receive a subsidy of ₹78,000 — reducing your net investment to around ₹87,000. The subsidy is credited directly to your bank account after installation and DISCOM inspection.',
    },
    {
      q: 'Will solar panel installation cause roof leaks or void my existing roof warranty?',
      a: 'No. Sonar uses patented zero-penetration and compression-sealed mounting hardware with triple-tier redundant silicone elastomer flashing. Every roof mount is certified by licensed structural engineers. Furthermore, our installations include a 10-year workmanship and watertight roof guarantee that exceeds standard roofing requirements.',
    },
    {
      q: 'How does net energy metering (NEM) compensate me for excess power?',
      a: 'During peak daytime sun hours, your system will often produce more kilowatt-hours than your building consumes. This excess clean energy is fed backward into the municipal electric grid, spinning your electric meter backward and generating utility credits. At night, you draw power against those earned credits.',
    },
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Frequently Asked <span className="font-editorial-italic font-normal text-emerald-800">Questions</span>
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Clear, transparent technical answers to guide your clean energy transition.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#C6F500] text-black border-lime-500 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
