import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the minimum solar panel size available at Green Infra?',
      a: 'Green Infra supplies solar panels from 1kW and above. Whether you need a small 1kW system for a home or a larger system for an industrial unit, we have the right solution. We provide complete installation including panels, mounting structure, inverter, wiring and commissioning.',
    },
    {
      q: 'Do solar panels work on cloudy or monsoon days in Maharashtra?',
      a: 'Yes, solar panels continue to generate power even on cloudy and monsoon days. While output is reduced compared to direct sunlight, diffuse daylight still produces usable electricity. Systems are designed to balance annual production so you benefit all year round across Maharashtra\'s varied climate.',
    },
    {
      q: 'What is the PM Surya Ghar Muft Bijli Yojana subsidy?',
      a: 'Under the Government of India\'s PM Surya Ghar scheme, residential households installing rooftop solar panels receive a direct subsidy: ₹30,000 per kW for systems up to 2kW and ₹18,000 per kW for the next 1kW (3kW total). For a 3kW system, you can receive up to ₹78,000 subsidy credited directly to your bank account after installation and DISCOM inspection. Green Infra can guide you through the process.',
    },
    {
      q: 'What electric vehicles does Green Infra offer?',
      a: 'Green Infra is an authorised electric vehicle dealer in Jaysingpur, offering a range of EVs for personal, commercial and agricultural use. Visit our showroom on the Sangli–Kolhapur Bypass, near Miraj–Jaysingpur Railway Station, to see available models and discuss your requirements.',
    },
    {
      q: 'Does Green Infra provide after-sales service and maintenance?',
      a: 'Yes. Green Infra provides after-sales support for both solar systems and EV customers. This includes solar panel cleaning, inverter health checks, electrical inspections, and EV service guidance. We are committed to ensuring your green energy investment performs reliably for the long term.',
    },
    {
      q: 'How does net metering work and can Green Infra help?',
      a: 'Net metering allows you to export excess solar electricity back to the grid and earn utility credits, which offset your electricity bill. During daytime your system produces more than you use, sending excess power to the grid. At night you draw against those credits. Green Infra assists with net metering documentation and MSEDCL coordination as part of the installation process.',
    },
  ];

  return (
    <section id="faq" className="relative py-24 px-6 md:px-12 lg:px-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Frequently Asked <span className="font-editorial-italic font-normal text-emerald-800">Questions</span>
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Answers to common questions about Green Infra Solar & Electrical Vehicle.
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
