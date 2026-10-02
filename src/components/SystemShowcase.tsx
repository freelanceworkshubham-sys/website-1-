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
  Tractor,
  GraduationCap,
  HeartPulse,
  Hotel,
  Car,
  Leaf,
  Store,
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
  const [selectedService, setSelectedService] = useState<string>('solar');

  const services: ServiceItem[] = [
    {
      id: 'solar',
      name: '01 — Solar Panel Supply & Installation',
      shortName: 'Solar Panels',
      icon: <Sun className="w-3.5 h-3.5" />,
      tagline:
        'Green Infra supplies and installs solar panels from 1kW and above for homes, shops, industries, schools and more — complete with mounting, inverter, wiring and commissioning.',
      idealFor: 'Homes • Shops • Industries • Schools • Agriculture',
      specs: {
        label1: 'Panel Range',
        val1: 'From 1kW & Above',
        label2: 'Applications',
        val2: 'Residential, Commercial & Industrial',
        label3: 'Location',
        val3: 'Jaysingpur, Sangli, Maharashtra',
        label4: 'Service',
        val4: 'Supply, Installation & Commissioning',
      },
      features: [
        'Solar panels from 1kW and above for all property types',
        'Complete installation including mounting structure, inverter and wiring',
        'Net metering documentation and MSEDCL coordination',
        'Online monitoring and after-sales service support',
      ],
    },
    {
      id: 'ev',
      name: '02 — Electric Vehicle Dealership',
      shortName: 'EV Vehicles',
      icon: <Car className="w-3.5 h-3.5" />,
      tagline:
        'Green Infra is an authorised electric vehicle dealer in Jaysingpur. We provide a range of EVs for personal and commercial use, with complete documentation and handover.',
      idealFor: 'Personal • Commercial • Agricultural EV Use',
      specs: {
        label1: 'Vehicle Type',
        val1: 'Electric Vehicles (EV)',
        label2: 'Dealer Status',
        val2: 'Authorised EV Dealer — Jaysingpur',
        label3: 'Coverage',
        val3: 'Sangli, Kolhapur & Maharashtra Region',
        label4: 'Documentation',
        val4: 'Complete RTO & Registration Support',
      },
      features: [
        'Authorised electric vehicle dealer for the Jaysingpur region',
        'Range of EV models for personal, commercial and agricultural use',
        'Complete RTO registration and documentation assistance',
        'After-sales EV service and support guidance',
      ],
    },
    {
      id: 'maintenance',
      name: '03 — After-Sales Service & Support',
      shortName: 'Service & Support',
      icon: <Wrench className="w-3.5 h-3.5" />,
      tagline:
        'Green Infra provides ongoing service and maintenance support for solar systems and EV customers, ensuring reliable long-term performance for every installation.',
      idealFor: 'Solar System Owners • EV Owners • All Customers',
      specs: {
        label1: 'Service Type',
        val1: 'Solar & EV After-Sales Support',
        label2: 'Solar Maintenance',
        val2: 'Panel Cleaning, Inverter Checks & Repairs',
        label3: 'EV Support',
        val3: 'Service Guidance & Assistance',
        label4: 'Coverage',
        val4: 'Jaysingpur & Sangli–Kolhapur Region',
      },
      features: [
        'Scheduled solar panel cleaning and system health checks',
        'Inverter diagnostics and electrical inspection',
        'EV service coordination and owner guidance',
        'Performance monitoring and generation report support',
      ],
    },
  ];

  // Sectors served by Green Infra
  const industries = [
    { name: 'Residential Homes', icon: <Home className="w-4 h-4 text-emerald-600" /> },
    { name: 'Commercial Shops', icon: <Store className="w-4 h-4 text-blue-600" /> },
    { name: 'Industrial Plants', icon: <Factory className="w-4 h-4 text-slate-700" /> },
    { name: 'Schools & Institutes', icon: <GraduationCap className="w-4 h-4 text-indigo-600" /> },
    { name: 'Hospitals', icon: <HeartPulse className="w-4 h-4 text-rose-600" /> },
    { name: 'Hotels & Resorts', icon: <Hotel className="w-4 h-4 text-teal-600" /> },
    { name: 'Agricultural Use', icon: <Tractor className="w-4 h-4 text-amber-600" /> },
    { name: 'Electric Vehicles', icon: <Car className="w-4 h-4 text-cyan-600" /> },
    { name: 'Commercial Complexes', icon: <Building2 className="w-4 h-4 text-orange-600" /> },
    { name: 'Green Energy Users', icon: <Leaf className="w-4 h-4 text-green-600" /> },
    { name: 'EV Charging', icon: <Zap className="w-4 h-4 text-yellow-600" /> },
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
              OUR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Green Infra Core Offerings
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              Solar panels from 1kW, EV vehicles and complete after-sales service — all at one place in Jaysingpur.
            </p>
          </div>

          {/* Segmented Service Selector Tabs */}
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
                  <span>Enquire About This Service</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Col: Features */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-4 sm:p-7 md:p-8 shadow-md space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-slate-400">What's Included</span>
                <span className="text-xs text-[#C6F500] font-bold">Green Infra Quality</span>
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
                <span>Jaysingpur, Sangli–Kolhapur Bypass</span>
                <span className="text-white font-medium">Maharashtra</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTORS & APPLICATIONS */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block">
              WHO WE SERVE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Green Energy for Every Segment
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Solar panels and EV vehicles for homes, businesses, industries and everyone going green in Maharashtra.
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
                Green Infra
              </span>
              <span className="text-[10px] font-medium text-emerald-100 leading-tight">
                Jaysingpur, MH
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
