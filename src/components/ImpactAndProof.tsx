import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ArrowRight, Sun, Zap, CheckCircle2, Star, Quote } from 'lucide-react';

interface ProjectCardData {
  id: string;
  projectName: string;
  location: string;
  system: string;
  projectType: string;
  performance: string;
  description: string;
  statusNote?: string;
}

const PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-1',
    projectName: '5kW Rooftop Solar Installation',
    location: 'Sangli, Maharashtra',
    system: 'Residential Rooftop Solar',
    projectType: 'Residential Solar',
    performance: '80% Power Bill Reduction',
    description:
      'Complete 5kW rooftop solar installation with high-efficiency Tier-1 panels, grid-tie inverter, net metering documentation, and MSEDCL commissioning.',
    statusNote: 'Invisible Energy Installation',
  },
  {
    id: 'proj-2',
    projectName: '50kW Industrial Solar Plant',
    location: 'Pune, Maharashtra',
    system: 'Industrial Solar EPC',
    projectType: 'Commercial Solar',
    performance: 'High-Yield Heavy Load Offset',
    description:
      'Engineered for a manufacturing facility to offset heavy daytime electricity consumption with rapid 4-year ROI and remote SCADA generation monitoring.',
    statusNote: 'Invisible Energy Installation',
  },
  {
    id: 'proj-3',
    projectName: '10kW Grid-Tied System',
    location: 'Kolhapur, Maharashtra',
    system: 'On-Grid Solar System',
    projectType: 'On-Grid System',
    performance: 'Dual Bi-Directional Export',
    description:
      'Commercial establishment solar setup exporting surplus daytime generation to the grid while supplying uninterrupted clean power to local operations.',
    statusNote: 'Invisible Energy Installation',
  },
  {
    id: 'proj-4',
    projectName: '8kW Battery Backup System',
    location: 'Mumbai, Maharashtra',
    system: 'Off-Grid Solar System',
    projectType: 'Off-Grid System',
    performance: '24/7 Uninterrupted Autonomy',
    description:
      'High-capacity solar system with lithium battery storage for total energy independence and resilient backup during peak grid outages.',
    statusNote: 'Invisible Energy Installation',
  },
  {
    id: 'proj-5',
    projectName: 'Community Solar Street Lighting',
    location: 'Satara, Maharashtra',
    system: 'Solar Street Lights',
    projectType: 'Public Infrastructure',
    performance: 'Dusk-to-Dawn Automated LED',
    description:
      'Turnkey solar street light installation for public access roads and residential colonies with automated light sensors and rugged weather protection.',
    statusNote: 'Invisible Energy Installation',
  },
  {
    id: 'proj-6',
    projectName: 'High-Capacity Solar Water Heater',
    location: 'Sangli District, Maharashtra',
    system: 'Solar Water Heating System',
    projectType: 'Eco-Thermal Solar',
    performance: 'Zero Electricity Water Heating',
    description:
      'Evacuated tube solar water heating system providing reliable hot water year-round for domestic and hospitality facilities.',
    statusNote: 'Invisible Energy Installation',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Patil',
    role: 'Homeowner, Sangli',
    rating: 5,
    quote:
      'Invisible Energy installed a 5kW solar system at our home in Sangli. The team was professional, completed the work in 3 days, and helped us with all subsidy paperwork. Our electricity bills have reduced by 80%. Highly recommended for anyone looking to go solar!',
  },
  {
    name: 'Priya Deshmukh',
    role: 'Business Owner, Pune',
    rating: 5,
    quote:
      'We installed a 50kW commercial solar system for our manufacturing unit. The ROI has been excellent - we recovered our investment in just 4 years. The after-sales service and maintenance support from Invisible Energy is outstanding.',
  },
  {
    name: 'Amit Kulkarni',
    role: 'Homeowner, Kolhapur',
    rating: 5,
    quote:
      'Best decision we made for our home! The 3kW system generates enough power for all our needs. The team explained everything clearly, installation was smooth, and we got the government subsidy without any hassle. Very satisfied with the service.',
  },
  {
    name: 'Sneha Joshi',
    role: 'Homeowner, Mumbai',
    rating: 5,
    quote:
      'Invisible Energy provided excellent service from consultation to installation. They helped us choose the right system size, handled all permissions, and the installation quality is top-notch. Our monthly savings are significant.',
  },
];

export const ImpactAndProof: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(0);
  const speedRef = useRef<number>(0.75);
  const targetSpeedRef = useRef<number>(0.75);
  const isPausedRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const rafIdRef = useRef<number | null>(null);

  const touchStartXRef = useRef<number>(0);
  const touchStartOffsetRef = useRef<number>(0);
  const isTouchingRef = useRef<boolean>(false);

  const loopCards = [...PROJECTS, ...PROJECTS];

  const verifiedClients = [
    'Residential Rooftops',
    'Commercial Complexes',
    'Industrial Manufacturing Units',
    'Educational Institutions',
    'Agricultural Pump Setups',
    'Community Street Lighting Projects',
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;

      if (!isPausedRef.current && isVisibleRef.current && trackRef.current) {
        offsetRef.current += speedRef.current * 60 * dt;

        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }

        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    targetSpeedRef.current = 0;
  };

  const handleMouseLeave = () => {
    targetSpeedRef.current = 0.75;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartOffsetRef.current = offsetRef.current;
    targetSpeedRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchingRef.current || !trackRef.current) return;
    const deltaX = touchStartXRef.current - e.touches[0].clientX;
    const halfWidth = trackRef.current.scrollWidth / 2;

    let newOffset = touchStartOffsetRef.current + deltaX;
    if (halfWidth > 0) {
      while (newOffset < 0) newOffset += halfWidth;
      while (newOffset >= halfWidth) newOffset -= halfWidth;
    }

    offsetRef.current = newOffset;
    trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    targetSpeedRef.current = 0.75;
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-16 sm:py-24 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden"
    >
      <div id="projects" className="relative -top-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-8 sm:mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              OUR PORTFOLIO
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Explore Our Completed <span className="text-emerald-700">Solar Projects</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Over 500+ successful rooftop, on-grid, off-grid, and commercial solar installations delivered across Sangli, Pune, Kolhapur, Mumbai, and Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-left">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 font-telemetry block leading-none">
                500+
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Installations
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-left">
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-telemetry block leading-none">
                80%
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Max Savings
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Carousel Track */}
      <div
        className="w-full relative cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 px-4 sm:px-6 md:px-12 w-max will-change-transform"
        >
          {loopCards.map((proj, idx) => (
            <div
              key={`${proj.id}-${idx}`}
              className="w-[280px] sm:w-[350px] md:w-[390px] shrink-0 bg-slate-50/90 hover:bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/80 hover:border-emerald-300/90 shadow-2xs flex flex-col justify-between transition-all duration-250 hover:-translate-y-1.5 hover:shadow-lg group cursor-pointer"
            >
              <div className="space-y-3 sm:space-y-4">

                {/* Top Row: Location & Project Type */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5 sm:pb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-115 group-hover:text-emerald-600 transition-all duration-200" />
                    <span className="truncate group-hover:text-slate-900 transition-colors">{proj.location}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0 group-hover:border-emerald-300 transition-colors">
                    {proj.projectType}
                  </span>
                </div>

                {/* System Title */}
                <div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    COMPLETED PROJECT
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5 group-hover:text-emerald-950 transition-colors">
                    {proj.projectName}
                  </h3>
                  <span className="text-xs text-emerald-700 font-medium block mt-0.5">
                    {proj.system}
                  </span>
                </div>

                {/* Performance Pill Box */}
                <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 group-hover:border-slate-300/80 flex items-center justify-between transition-colors">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Performance Impact</span>
                  <span className="font-telemetry text-xs sm:text-sm font-bold text-emerald-700">
                    {proj.performance}
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

              </div>

              {/* Bottom CTA */}
              <div className="pt-3.5 mt-3.5 sm:pt-5 sm:mt-5 border-t border-slate-200/80 flex items-center justify-between">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>GET FREE QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
                </a>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  Invisible Energy
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER TESTIMONIALS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-16 sm:mt-20">
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left intro */}
            <div className="lg:col-span-4 space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#C6F500] bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
                CLIENT TESTIMONIALS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                What Our Clients Say About <span className="text-[#C6F500]">Invisible Energy</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Homeowners and business leaders across Maharashtra trust us for dependable solar panel installation, swift subsidy paperwork, and lifetime customer care.
              </p>
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-[#C6F500] text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-[#b8e500] transition-colors"
                >
                  <span>Read More Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Testimonials 2x2 Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(t.rating)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[10px] text-slate-400">{t.role}</p>
                    </div>
                    <Quote className="w-4 h-4 text-[#C6F500]/50" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* SECTORS SERVED RIBBON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-12 pt-10 border-t border-slate-200">
        <div className="text-center space-y-2 mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            WHO WE SERVE
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Invisible Energy — Powering All Sectors Across Maharashtra
          </h3>
        </div>

        {/* Customer segment badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {verifiedClients.map((client, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200/90 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{client}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
