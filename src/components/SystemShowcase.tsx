import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  Sun,
  Building2,
  Factory,
  Home,
  Zap,
  Wrench,
  Fuel,
  GraduationCap,
  HeartPulse,
  Hotel,
  Landmark,
  Film,
  Scissors,
  Cpu,
} from 'lucide-react';

interface SystemShowcaseProps {
  onSelectSystem?: (tier: any) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  tagline: string;
  idealFor: string;
  specs: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
    label4: string;
    val4: string;
  };
  features: string[];
}

export const SystemShowcase: React.FC<SystemShowcaseProps> = ({ onSelectSystem }) => {
  const [selectedService, setSelectedService] = useState<string>('epc');

  const services: ServiceItem[] = [
    {
      id: 'epc',
      name: '01 — Complete EPC Solutions',
      shortName: 'EPC Solutions',
      icon: <Zap className="w-3.5 h-3.5" />,
      tagline:
        'Complete solar EPC solutions from concept and engineering through supply, installation and commissioning for small, medium and large-scale facilities.',
      idealFor: 'Turnkey Solar Power Plants • Residential, Commercial & Industrial',
      specs: {
        label1: 'Execution Scope',
        val1: 'Concept to Commissioning',
        label2: 'Engineering',
        val2: 'In-House Electrical & Structural',
        label3: 'Contracting',
        val3: 'MSEDCL Supervision (M.C. 11716)',
        label4: 'Commitment',
        val4: '25+ Years of Solar Experience',
      },
      features: [
        'Detailed engineering, layout planning & structural load analysis',
        'Direct procurement of robust Tier-1 panels and smart inverters',
        'End-to-end MSEDCL documentation, net metering & CEI approvals',
        'System synchronization, grid integration and plant commissioning',
      ],
    },
    {
      id: 'rooftop',
      name: '02 — Customized Rooftop Solar',
      shortName: 'Rooftop Solar',
      icon: <Sun className="w-3.5 h-3.5" />,
      tagline:
        'Customized rooftop solar systems designed for bungalows, apartments, commercial establishments, hospitals and industrial sheds.',
      idealFor: 'Homes, Showrooms, Hospitals & Manufacturing Rooftops',
      specs: {
        label1: 'Design Type',
        val1: 'Customized Rooftop Solutions',
        label2: 'Structure Engineering',
        val2: 'In-House Robust Structure Design',
        label3: 'Liaisoning',
        val3: 'Complete MSEDCL Approvals',
        label4: 'Performance',
        val4: 'High-Yield Online Monitored Plants',
      },
      features: [
        'Precise shadow-free layout modeling for maximum daily harvest',
        'Robust, wind-rated custom mounting structures engineered in-house',
        'Seamless interconnection with your property’s existing LT/HT distribution',
        'Intelligent online monitoring for real-time generation tracking',
      ],
    },
    {
      id: 'om',
      name: '03 — Operation & Maintenance (O&M)',
      shortName: 'Operation & Maint.',
      icon: <Wrench className="w-3.5 h-3.5" />,
      tagline:
        'Long-term O&M support to maintain solar system performance, minimize downtime and protect your multi-decade investment.',
      idealFor: 'Residential, Commercial & Industrial Solar Power Plants',
      specs: {
        label1: 'Team',
        val1: 'Dedicated In-House O&M Crew',
        label2: 'Monitoring',
        val2: 'Intelligent Online Telemetry',
        label3: 'Focus',
        val3: 'Maximizing Generation & Uptime',
        label4: 'Coverage',
        val4: 'Ichalkaranji, Kolhapur & Maharashtra',
      },
      features: [
        'Scheduled module cleaning and preventive electrical inspections',
        'String diagnostics, terminal torque audits and inverter health checks',
        'Prompt on-ground service response to minimize generation downtime',
        'Performance auditing and generation report verification',
      ],
    },
  ];

  // Verified 11 sectors served by Solar Technologies (Section 11)
  const industries = [
    { name: 'Bungalows & Apartments', icon: <Home className="w-4 h-4 text-emerald-600" /> },
    { name: 'Commercial Complexes', icon: <Building2 className="w-4 h-4 text-blue-600" /> },
    { name: 'Engineering & Mfg.', icon: <Cpu className="w-4 h-4 text-amber-600" /> },
    { name: 'Hospitals & Healthcare', icon: <HeartPulse className="w-4 h-4 text-rose-600" /> },
    { name: 'Educational Institutes', icon: <GraduationCap className="w-4 h-4 text-indigo-600" /> },
    { name: 'Petrol Pumps', icon: <Fuel className="w-4 h-4 text-orange-600" /> },
    { name: 'Hotels & Resorts', icon: <Hotel className="w-4 h-4 text-teal-600" /> },
    { name: 'Banks & Financial', icon: <Landmark className="w-4 h-4 text-sky-600" /> },
    { name: 'Textile / Sizing Units', icon: <Scissors className="w-4 h-4 text-purple-600" /> },
    { name: 'Theatres / Multiplex', icon: <Film className="w-4 h-4 text-fuchsia-600" /> },
    { name: 'Industrial Plants', icon: <Factory className="w-4 h-4 text-slate-700" /> },
  ];

  const currentService = services.find((s) => s.id === selectedService) || services[0];

  const handleConsultService = () => {
    if (onSelectSystem) {
      onSelectSystem({
        id: currentService.id,
        name: currentService.name,
        tagline: currentService.tagline,
      });
    } else {
      const calcEl = document.getElementById('calculator');
      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-12 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div id="systems" className="relative -top-24 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div className="max-w-xl space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block">
              OUR SOLAR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Solar Technologies Core Solutions
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              Complete solar EPC solutions from concept and engineering through supply, installation, commissioning and long-term O&amp;M support.
            </p>
          </div>

          {/* Segmented Service Selector Tabs (3 Core Services) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs self-start md:self-end">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`group flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                  selectedService === service.id
                    ? 'bg-[#C6F500] text-black shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">{service.icon}</span>
                <span>{service.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Service Detail Presentation */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Col: Specs and Description */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold">
                <span>{currentService.idealFor}</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {currentService.name}
              </h3>

              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                {currentService.tagline}
              </p>

              {/* 4 Technical Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <div className="bg-slate-50 hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">{currentService.specs.label1}</span>
                  <span className="text-slate-900 font-bold text-xs sm:text-sm mt-0.5 block break-words">{currentService.specs.val1}</span>
                </div>
                <div className="bg-slate-50 hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">{currentService.specs.label2}</span>
                  <span className="text-emerald-700 font-bold text-xs sm:text-sm mt-0.5 block break-words">{currentService.specs.val2}</span>
                </div>
                <div className="bg-slate-50 hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">{currentService.specs.label3}</span>
                  <span className="text-slate-800 font-semibold text-xs sm:text-sm mt-0.5 block break-words">{currentService.specs.val3}</span>
                </div>
                <div className="bg-slate-50 hover:bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">{currentService.specs.label4}</span>
                  <span className="text-slate-800 font-semibold text-xs sm:text-sm mt-0.5 block break-words">{currentService.specs.val4}</span>
                </div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConsultService}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.98] min-h-[44px]"
                >
                  <span>Enquire For This Solution</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Col: Scope of Work / Features */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-4 sm:p-7 md:p-8 shadow-md space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-slate-400">Execution Standards</span>
                <span className="text-xs text-[#C6F500] font-bold">Solar Technologies Quality</span>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {currentService.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-[#C6F500] shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Govt. Licensed Electrical Contractor</span>
                <span className="text-white font-medium">M.C. NO-11716</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 11: COMPACT INDUSTRIES & APPLICATIONS SERVED */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block">
              SECTORS &amp; APPLICATIONS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Solar Solutions Across Key Industries
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Tailored engineering and installation expertise for diverse residential, commercial, and industrial segments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3 text-center flex flex-col items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-slate-50 group-hover:scale-110 transition-transform duration-200">
                  {ind.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">
                  {ind.name}
                </span>
              </div>
            ))}
            {/* Trust badge card */}
            <div className="bg-emerald-900 text-white rounded-xl p-3 text-center flex flex-col items-center justify-center gap-1 shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6F500]">
                25+ Years
              </span>
              <span className="text-[10px] font-medium text-emerald-100 leading-tight">
                Proven Track Record
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
