import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Enquiry & Site Assessment',
      description:
        'Contact Green Infra with your solar or EV requirement. Our team will visit your site and assess feasibility.',
      detailLabel: 'ENQUIRY & SITE ASSESSMENT',
      detailHeading: 'We Come to You',
      detailDescription:
        'Share your solar panel requirement (1kW and above) or EV interest with Green Infra. Our team will assess your site, rooftop, electricity usage and conditions to recommend the right solution.',
      included: [
        'Free enquiry consultation',
        'Site & rooftop assessment',
        'Electricity usage review',
        'Solar / EV recommendation',
      ],
      bottom: 'No obligation. Free assessment.',
      buttonText: 'VIEW OUR SERVICES',
    },
    {
      step: '02',
      title: 'Custom Solution & Proposal',
      description:
        'We design the right solar system or EV solution for your needs with a clear proposal and pricing.',
      detailLabel: 'CUSTOM SOLUTION & PROPOSAL',
      detailHeading: 'Designed for Your Need',
      detailDescription:
        'Green Infra prepares a customised solar system design (from 1kW) or EV proposal with complete specifications, investment details and expected savings or benefits.',
      included: [
        'Solar system capacity planning',
        'EV model recommendation',
        'Investment & savings estimate',
        'Transparent pricing proposal',
      ],
      bottom: 'Clear proposal. Honest pricing.',
      buttonText: 'CALCULATE SAVINGS',
    },
    {
      step: '03',
      title: 'Installation, Delivery & Support',
      description:
        'Our team installs your solar system or delivers your EV with complete support and documentation.',
      detailLabel: 'INSTALLATION, DELIVERY & SUPPORT',
      detailHeading: 'Ready to Power Your Tomorrow',
      detailDescription:
        'Green Infra executes complete solar installation including panels, mounting, inverter, wiring and net metering — or delivers your EV with full documentation. We provide ongoing after-sales service and support.',
      included: [
        'Complete solar installation',
        'EV delivery & documentation',
        'Net metering & commissioning',
        'After-sales service support',
      ],
      bottom: 'Installed, delivered and supported.',
      buttonText: 'EXPLORE OUR PROJECTS',
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80">
      <div id="how-it-works" className="relative -top-24 pointer-events-none" />
      <style>{`
        @keyframes stepContentFade {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .step-transition {
          animation: stepContentFade 300ms ease-out forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            From Enquiry to Green Energy
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Three steps to solar power or your electric vehicle. Simple, transparent and complete.
          </p>
        </div>

        {/* 2-Column Structure: LEFT = 3 Stacked Step Cards, RIGHT = Large Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* LEFT: 3 Stacked Step Cards */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={item.step}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveStep(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveStep(idx);
                    }
                  }}
                  className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer text-left outline-none ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500/20 translate-x-0.5'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300 focus-visible:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-xs font-bold tracking-wider ${
                        isActive ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      STEP {item.step}
                    </span>
                    {isActive && (
                      <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Current Step
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Large Detail / Information Card (Dynamic to activeStep) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[440px]">

            {/* Transitioning Content Wrapper */}
            <div key={activeStep} className="step-transition flex flex-col justify-between h-full space-y-6">

              <div className="space-y-6">
                {/* Small Label */}
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                    {currentStep.detailLabel}
                  </span>

                  {/* Heading */}
                  <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-2 leading-snug">
                    {currentStep.detailHeading}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                    {currentStep.detailDescription}
                  </p>
                </div>

                {/* Included Checklist */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    What's included:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStep.included.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200/90 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Line & CTA Button */}
              <div className="pt-8 mt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-medium text-slate-600">
                  {currentStep.bottom}
                </span>

                <a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-black bg-[#C6F500] hover:bg-[#b8e500] active:scale-[0.99] px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <span>{currentStep.buttonText}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
