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
  Battery,
  Lightbulb,
  Flame,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SystemShowcaseProps {
  onSelectSystem?: (tier: any) => void;
}

export interface ServiceDetail {
  id: string;
  count: string;
  name: string;
  category: 'power' | 'components' | 'lighting' | 'maintenance';
  categoryLabel: string;
  icon: React.ReactNode;
  tagline: string;
  idealFor: string;
  warranty: string;
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

const ALL_SERVICES: ServiceDetail[] = [
  {
    id: 'on-grid',
    count: '01',
    name: 'On Grid Solar System',
    category: 'power',
    categoryLabel: 'Power Systems',
    icon: <Sun className="w-4 h-4 text-amber-500" />,
    tagline:
      'Grid-connected solar systems that export excess generated solar power back to the MSEDCL electricity grid for maximum savings and net metering credits.',
    idealFor: 'Residential Homes • Offices • Commercial Plazas • Hospitals',
    warranty: '25+ Year Panel Warranty',
    specs: {
      label1: 'Grid Connection',
      val1: 'Bi-Directional Net-Metered',
      label2: 'Bill Savings',
      val2: 'Up to 80% Monthly Reduction',
      label3: 'Govt. Subsidy',
      val3: 'Eligible for PM Surya Ghar (Up to 40%)',
      label4: 'Payback Period',
      val4: '3 to 5 Years Typical',
    },
    features: [
      'Eliminates need for expensive battery banks in stable grid areas',
      'Automatic export of surplus afternoon power to Mahavitaran (MSEDCL)',
      'Complete paperwork assistance for bi-directional net metering',
      'Mobile app telemetry for realtime kWh generation tracking',
    ],
  },
  {
    id: 'off-grid',
    count: '02',
    name: 'Off Grid Solar System',
    category: 'power',
    categoryLabel: 'Power Systems',
    icon: <Battery className="w-4 h-4 text-emerald-500" />,
    tagline:
      'Independent standalone solar systems with dedicated high-capacity battery bank for 100% self-reliance and power freedom without grid dependency.',
    idealFor: 'Rural Areas • Farmhouses • Remote Manufacturing • Petrol Pumps',
    warranty: '25+ Year Panels • 5+ Year Battery',
    specs: {
      label1: 'Autonomy',
      val1: '100% Grid-Independent',
      label2: 'Storage Chemistry',
      val2: 'Lithium Ferro Phosphate (LFP) / Tubular',
      label3: 'Power Continuity',
      val3: 'Zero Cutoff During Grid Failure',
      label4: 'Inverter Type',
      val4: 'Pure Sine Wave Smart Solar PCU',
    },
    features: [
      'Continuous 24/7 power even in remote areas with zero grid infrastructure',
      'Intelligent battery charging prioritization from sunlight',
      'Heavy surge protection against voltage spikes and brownouts',
      'Modular expandability as electricity requirements increase',
    ],
  },
  {
    id: 'rooftop',
    count: '03',
    name: 'Rooftop Solar System',
    category: 'power',
    categoryLabel: 'Power Systems',
    icon: <Home className="w-4 h-4 text-blue-500" />,
    tagline:
      'Turnkey engineered rooftop installations tailored for concrete slabs, metal sheds, and tiled roofs with optimized tilt angles and shadow-free layouts.',
    idealFor: 'Villas • Housing Societies • Warehouses • Factory Sheds',
    warranty: '25+ Year Performance Guarantee',
    specs: {
      label1: 'Capacity Range',
      val1: '1kW to 500kW+ Custom Systems',
      label2: 'Mounting Structure',
      val2: 'Galvanized Anodized Aluminium (Wind Load 150km/h)',
      label3: 'Orientation',
      val3: 'True South Azimuth with 12°-18° Tilt',
      label4: 'Space Required',
      val4: '~80-100 sq.ft per 1kW',
    },
    features: [
      '3D shadow simulation to ensure zero obstruction throughout the year',
      'Elevated structure options available to preserve usable rooftop terrace space',
      'Quick 2 to 4-day residential installation by certified Invisible Energy crews',
      'Complete safety earthing and lightning arrester integration included',
    ],
  },
  {
    id: 'solar-panels',
    count: '04',
    name: 'Tier-1 Solar Panels',
    category: 'components',
    categoryLabel: 'Equipment & Panels',
    icon: <Layers className="w-4 h-4 text-cyan-500" />,
    tagline:
      'High-efficiency Mono PERC and TOPCon Tier-1 solar modules that deliver peak output even under weak diffuse sunlight and high ambient temperatures.',
    idealFor: 'Wholesalers • Installers • Commercial Projects • System Upgrades',
    warranty: '25+ Year Linear Power Warranty',
    specs: {
      label1: 'Cell Technology',
      val1: 'Mono PERC / N-Type TOPCon Bifacial',
      label2: 'Module Efficiency',
      val2: 'Up to 22.8% Conversion Efficiency',
      label3: 'Degradation',
      val3: '< 0.55% Annual Linear Drop',
      label4: 'Certifications',
      val4: 'ALMM Approved • BIS • IEC Certified',
    },
    features: [
      'Certified under Approved List of Models and Manufacturers (ALMM)',
      'Superior temperature coefficient ideal for Maharashtra summers',
      'Anti-reflective, highly transparent tempered solar glass',
      'Wholesale and retail availability directly from Sangli hub',
    ],
  },
  {
    id: 'solar-inverter',
    count: '05',
    name: 'Solar Inverters',
    category: 'components',
    categoryLabel: 'Equipment & Panels',
    icon: <Zap className="w-4 h-4 text-amber-500" />,
    tagline:
      'High-grade on-grid, off-grid, and hybrid solar inverters with dual MPPT trackers, converting DC solar output to clean AC household electricity with 98.6% efficiency.',
    idealFor: 'Residential • Industrial Units • Institutions • Solar Upgrades',
    warranty: '5 to 10 Year Manufacturer Warranty',
    specs: {
      label1: 'Peak Efficiency',
      val1: '98.6% Conversion Efficiency',
      label2: 'MPPT Trackers',
      val2: 'Single, Dual & Quad MPPT Options',
      label3: 'Protection',
      val3: 'IP65 Weatherproof & Anti-Islanding',
      label4: 'Connectivity',
      val4: 'Wi-Fi / 4G Realtime Cloud Telemetry',
    },
    features: [
      'Built-in DC isolator, surge protection device (SPD) Type II',
      'Silent operation with fanless natural heat dissipation',
      'Full compatibility with PM Surya Ghar compliant DISCOM meters',
      'Instant mobile alerts for performance anomalies or grid drops',
    ],
  },
  {
    id: 'solar-batteries',
    count: '06',
    name: 'Solar Batteries & Storage',
    category: 'components',
    categoryLabel: 'Equipment & Panels',
    icon: <Battery className="w-4 h-4 text-purple-500" />,
    tagline:
      'Heavy-duty deep-cycle tubular and lithium energy storage systems designed for frequent charge-discharge cycles and extended power backup.',
    idealFor: 'Off-Grid Systems • Hybrid Setups • Commercial Backup • Farm Houses',
    warranty: '3 to 10 Year Comprehensive Warranty',
    specs: {
      label1: 'Battery Types',
      val1: 'Lithium (LiFePO4) & C10 Deep-Cycle Tubular',
      label2: 'Cycle Life',
      val2: '3500+ Cycles (Lithium) / 1500+ (Tubular)',
      label3: 'Depth of Discharge',
      val3: 'Up to 90% DoD for Lithium Storage',
      label4: 'Safety',
      val4: 'Intelligent BMS (Battery Management System)',
    },
    features: [
      'Zero maintenance options with compact wall-mounted lithium packs',
      'High charge acceptance from solar panels during short peak sunlight hours',
      'Thermal runaway protection designed for hot climates',
      'Seamless transition with solar inverters in microsecond intervals',
    ],
  },
  {
    id: 'solar-maintenance',
    count: '07',
    name: 'Solar Maintenance & Repair',
    category: 'maintenance',
    categoryLabel: 'Services & Care',
    icon: <Wrench className="w-4 h-4 text-orange-500" />,
    tagline:
      'Professional preventive maintenance, automated panel de-dusting, inverter health diagnostics, and quick repair services across Maharashtra.',
    idealFor: 'Existing Solar Plant Owners • Housing Societies • Industrial Plants',
    warranty: 'Prompt 24-48hr Local Sangli Response',
    specs: {
      label1: 'Service Range',
      val1: 'Deep Cleaning, Electrical Audit, Inverter Repairs',
      label2: 'Yield Recovery',
      val2: 'Restores 15-25% Lost Energy Output',
      label3: 'Inspection',
      val3: 'Thermal IR Hotspot & String Health Check',
      label4: 'Coverage',
      val4: 'Sangli, Kolhapur, Pune, Satara & Mumbai',
    },
    features: [
      'De-mineralized water cleaning removing stubborn soot, dust & bird droppings',
      'Torque tightening of all structure bolts and electrical terminations',
      'Inverter firmware upgrades and string voltage balance checks',
      'Custom AMC (Annual Maintenance Contracts) for residential and commercial plants',
    ],
  },
  {
    id: 'solar-earthing',
    count: '08',
    name: 'Solar Earthing & Lightning Protection',
    category: 'components',
    categoryLabel: 'Equipment & Panels',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    tagline:
      'Dedicated chemical gel earthing electrodes and early streamer emission (ESE) lightning arresters protecting your solar installation and building assets.',
    idealFor: 'All Rooftop & Ground-Mounted Solar Installations',
    warranty: 'Maintenance-Free Chemical Compound',
    specs: {
      label1: 'Electrode Type',
      val1: 'Copper Bonded / GI Chemical Earth Electrodes',
      label2: 'Earth Resistance',
      val2: 'Maintained Below 5 Ohms Standard',
      label3: 'Protection Radius',
      val3: 'Lightning Arrester Coverage up to 100m',
      label4: 'Compliance',
      val4: 'IS 3043 & IEEE 80 Earthing Standards',
    },
    features: [
      'Separate dedicated earthing pits for DC side, AC side, and Lightning Arrester',
      'Moisture-retaining chemical backfill compound for long-term conductivity',
      'Complete safety for family, factory workers, and delicate electrical gadgets',
      'Mandatory inspection certification for DISCOM net metering clearance',
    ],
  },
  {
    id: 'solar-highmast',
    count: '09',
    name: 'Solar Highmast Lighting',
    category: 'lighting',
    categoryLabel: 'Lighting & Municipal',
    icon: <Radio className="w-4 h-4 text-amber-600" />,
    tagline:
      'Heavy-duty solar-powered high mast towers designed for massive public illumination of highway crossings, market yards, industrial campuses, and stadiums.',
    idealFor: 'Municipal Councils • Industrial Estates • Highway Tolls • Gram Panchayats',
    warranty: '5-Year System Guarantee',
    specs: {
      label1: 'Tower Heights',
      val1: '9 Meter, 12 Meter & 16 Meter High Mast',
      label2: 'Luminaires',
      val2: 'High-Lumen Optical LED Flood Lights',
      label3: 'Battery & Solar',
      val3: 'Centralized Solar Array with Lithium Bank',
      label4: 'Automation',
      val4: 'Dusk-to-Dawn Timer & Dimming Controls',
    },
    features: [
      'Galvanized polygonal octagonal mast engineered for high wind velocity',
      'Zero monthly electricity bills for local municipalities and public bodies',
      'Automatic power saving mode after midnight for extended rainy season autonomy',
      'Complete foundation civil work, tower erection, and commissioning by Invisible Energy',
    ],
  },
  {
    id: 'street-lights',
    count: '10',
    name: 'Solar Street Lights',
    category: 'lighting',
    categoryLabel: 'Lighting & Municipal',
    icon: <Lightbulb className="w-4 h-4 text-yellow-500" />,
    tagline:
      'All-In-One (AIO) and integrated solar street lights with automatic dusk-to-dawn sensors and PIR motion detectors for roads, housing colonies, and pathways.',
    idealFor: 'Gated Communities • Village Roads • Farm Entrances • Industrial Perimeters',
    warranty: '3 to 5 Year Warranty',
    specs: {
      label1: 'Wattage Options',
      val1: '12W, 18W, 24W, 40W, 60W, 90W LED',
      label2: 'Integrated Units',
      val2: 'Monocrystalline PV + LiFePO4 Battery in one fixture',
      label3: 'Run Time',
      val3: 'Dusk to Dawn (12-14 Hours Nightly)',
      label4: 'Sensor',
      val4: 'Microwave / PIR Smart Motion Sensor',
    },
    features: [
      '100% wireless zero-trenching installation—mounts directly onto poles or walls',
      'IP66 waterproof aluminium alloy casing with anti-corrosion coating',
      'Dusk-to-dawn automatic on/off operation with 3-day monsoon backup reserve',
      'Bulk supply and installation contracts for colonies and institutions across Maharashtra',
    ],
  },
  {
    id: 'water-heater',
    count: '11',
    name: 'Solar Water Heater / Geyser',
    category: 'lighting',
    categoryLabel: 'Thermal & Geysers',
    icon: <Flame className="w-4 h-4 text-rose-500" />,
    tagline:
      'Eco-friendly solar water heating systems with evacuated tube collector (ETC) and flat plate collector (FPC) technology delivering boiling hot water with zero power bills.',
    idealFor: 'Homes • Hostels • Hotels • Hospitals • Dairies • Commercial Laundries',
    warranty: '5 to 7 Year Tank Warranty',
    specs: {
      label1: 'Capacity',
      val1: '100, 150, 200, 300, 500 Liters Per Day (LPD)',
      label2: 'Collector Type',
      val2: 'Three-Target Evacuated Tube (ETC) / Flat Plate (FPC)',
      label3: 'Inner Tank',
      val3: 'Food-Grade Stainless Steel (SS304L) / Enamel Coated',
      label4: 'Insulation',
      val4: 'High-Density 50mm Polyurethane Foam (PUF)',
    },
    features: [
      'Retains water temperature above 60°C for up to 48 hours in chilly winters',
      'Pressurized systems available for luxury homes with modern shower panels',
      'Saves up to 1500 to 2500 units of electricity per year compared to electric geysers',
      'Complete plumbing connection, anti-scaling rods, and backup electric coil support',
    ],
  },
];

export const SystemShowcase: React.FC<SystemShowcaseProps> = ({ onSelectSystem }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('on-grid');

  const categories = [
    { id: 'all', label: 'All 11 Services' },
    { id: 'power', label: 'Power Systems (On/Off/Rooftop)' },
    { id: 'components', label: 'Panels & Equipment' },
    { id: 'lighting', label: 'Street Lights & Thermal' },
    { id: 'maintenance', label: 'Maintenance & Repairs' },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? ALL_SERVICES
      : ALL_SERVICES.filter((s) => s.category === activeCategory);

  const currentService =
    ALL_SERVICES.find((s) => s.id === selectedServiceId) || ALL_SERVICES[0];

  const handleSelect = (service: ServiceDetail) => {
    setSelectedServiceId(service.id);
    if (onSelectSystem) {
      onSelectSystem({
        id: service.id,
        name: service.name,
      });
    }
  };

  return (
    <section
      id="services"
      className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-slate-50 text-slate-900 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            INVISIBLE ENERGY SOLUTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Comprehensive Solar Solutions <br className="hidden sm:inline" />
            <span className="text-emerald-700">for Homes, Businesses &amp; Communities</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From grid-tied rooftop setups and high-capacity storage to municipal street lights and solar water heaters—explore all 11 turnkey services provided by Invisible Energy across Maharashtra.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Two-Column Interactive Service Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Left Column: Scrollable Services List (Cards) */}
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredServices.map((svc) => {
              const isSelected = svc.id === currentService.id;
              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedServiceId(svc.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 shrink-0">
                      {svc.count}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                      {svc.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {svc.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {svc.idealFor}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Interactive Service Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-xl space-y-6">
            
            {/* Top Identity & Count */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                  SERVICE {currentService.count}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {currentService.categoryLabel}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full">
                {currentService.warranty}
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {currentService.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {currentService.tagline}
              </p>
            </div>

            {/* Application pill */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 text-xs text-slate-700 flex items-center gap-2">
              <span className="font-bold text-slate-900 shrink-0">Best Suited For:</span>
              <span className="truncate">{currentService.idealFor}</span>
            </div>

            {/* 4 Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  {currentService.specs.label1}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                  {currentService.specs.val1}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  {currentService.specs.label2}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5 block">
                  {currentService.specs.val2}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  {currentService.specs.label3}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                  {currentService.specs.val3}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  {currentService.specs.label4}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                  {currentService.specs.val4}
                </span>
              </div>
            </div>

            {/* Key Advantages / Features */}
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Highlights &amp; Inclusions:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {currentService.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSelect(currentService)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Request Quote for {currentService.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+918888208099"
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors py-1"
              >
                Call +91 8888208099
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
