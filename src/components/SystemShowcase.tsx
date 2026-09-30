import React, { useState } from 'react';
import { ShieldCheck, Check, ArrowRight, Sun, Building2, Factory, Home, Zap, Wrench } from 'lucide-react';
import { SystemTier } from '../types/solar';

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
  const [selectedService, setSelectedService] = useState<string>('residential');

  const services: ServiceItem[] = [
    {
      id: 'residential',
      name: 'Residential Rooftop Solar',
      shortName: 'Residential',
      icon: <Home className="w-3.5 h-3.5" />,
      tagline: 'Custom rooftop solar installations for independent homes, bungalows and residential societies.',
      idealFor: 'Homes, villas & housing societies (3 kW – 25 kW)',
      specs: {
        label1: 'Subsidy Support',
        val1: 'PM Surya Ghar CFA (up to ₹78K)',
        label2: 'Typical Payback',
        val2: '3.2 – 4.5 Years',
        label3: 'Module Standard',
        val3: 'Tier-1 Mono PERC / TOPCon',
        label4: 'Warranty',
        val4: '25-Year Performance Warranty',
      },
      features: [
        'Complete PM Surya Ghar subsidy application processing',
        'DISCOM net-metering approvals and installation',
        'Custom non-penetrating / anchored structure design',
        'Mobile app generation & savings monitoring',
      ],
    },
    {
      id: 'commercial',
      name: 'Commercial Solar Solutions',
      shortName: 'Commercial',
      icon: <Building2 className="w-3.5 h-3.5" />,
      tagline: 'Rooftop and shed installations for hospitals, schools, showrooms and commercial complexes.',
      idealFor: 'Offices, retail, educational campuses (20 kW – 200 kW)',
      specs: {
        label1: 'Tariff Reduction',
        val1: 'Up to 75% Daytime Offset',
        label2: 'Typical Payback',
        val2: '3.0 – 4.0 Years',
        label3: 'Tax Advantage',
        val3: 'Accelerated Depreciation',
        label4: 'Warranty',
        val4: '25-Year Linear Warranty',
      },
      features: [
        'Optimized for daytime air conditioning and lighting loads',
        'Pre-engineered aluminum and HDG mounting structures',
        '3-phase commercial string inverters with high safety ratings',
        'Zero business downtime during installation',
      ],
    },
    {
      id: 'industrial',
      name: 'Industrial Solar (HT Systems)',
      shortName: 'Industrial',
      icon: <Factory className="w-3.5 h-3.5" />,
      tagline: 'Engineered high-tension solar plants for manufacturing units, textile mills and MIDC plants.',
      idealFor: 'MIDC factories, warehouses & processing units (100 kW – 2 MW+)',
      specs: {
        label1: 'Grid Connectivity',
        val1: '11 kV / 22 kV / 33 kV HT',
        label2: 'Typical Payback',
        val2: '2.8 – 3.8 Years',
        label3: 'Structure',
        val3: 'Heavy-Duty Galvanized Steel',
        label4: 'System Type',
        val4: 'Captive On-Grid / Open Access',
      },
      features: [
        'Designed around factory shift loads and peak tariff periods',
        'Transformer & HT switchgear synchronization',
        'Industrial structural stability and wind load certification',
        'Dedicated project manager and scheduled O&M protocols',
      ],
    },
    {
      id: 'netmetering',
      name: 'Net Metering & DISCOM Approvals',
      shortName: 'Net Metering',
      icon: <Zap className="w-3.5 h-3.5" />,
      tagline: 'Complete liaisoning for grid approval, load sanction, bi-directional meter testing & commissioning.',
      idealFor: 'All grid-connected rooftop systems across Maharashtra',
      specs: {
        label1: 'Liaisoning',
        val1: 'MSEDCL, BEST, Adani, Tata',
        label2: 'Meter Type',
        val2: 'Bi-Directional Net Meter',
        label3: 'Documentation',
        val3: '100% Handled by GVP',
        label4: 'Compliance',
        val4: 'MERC Grid Code Compliant',
      },
      features: [
        'Feasibility study and load sanction application',
        'CEI (Chief Electrical Inspector) safety approvals',
        'Bi-directional meter procurement, testing and sync',
        'Regular tracking until the first net-metered bill arrives',
      ],
    },
    {
      id: 'om',
      name: 'Solar Operations & Maintenance (O&M)',
      shortName: 'Solar O&M',
      icon: <Wrench className="w-3.5 h-3.5" />,
      tagline: 'Professional module cleaning, preventive electrical health audits and AMC generation upkeep.',
      idealFor: 'Existing and newly installed solar power plants',
      specs: {
        label1: 'Inspection Frequency',
        val1: 'Quarterly & On-Demand',
        label2: 'Uptime Target',
        val2: '99%+ Generation Uptime',
        label3: 'Testing',
        val3: 'Thermal & String Diagnostics',
        label4: 'Support',
        val4: 'Direct Maharashtra Helpline',
      },
      features: [
        'High-pressure demineralized water module washing',
        'Inverter health checks, DC connector and terminal torque audits',
        'Thermographic hotspot checks for degraded cells',
        'Real-time generation alerts and swift site visits',
      ],
    },
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
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div className="max-w-xl space-y-2.5 sm:space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-block">
              OUR SOLAR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              End-to-End Solar EPC Solutions
            </h2>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              From site audit and engineering design to DISCOM approvals, net metering and long-term O&amp;M support.
            </p>
          </div>

          {/* Segmented Service Selector Tabs (5 Services) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs self-start md:self-end">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
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
                <span className="text-xs font-mono uppercase text-slate-400">Included Scope</span>
                <span className="text-xs text-[#C6F500] font-bold">GVP Standard</span>
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
                <span>Executed across Maharashtra</span>
                <span className="text-white font-medium">DISCOM Approved</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
