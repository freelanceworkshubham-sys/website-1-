import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ArrowRight, Sun, Zap, CheckCircle2 } from 'lucide-react';

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
    projectName: 'Residential Home Solar System',
    location: 'Jaysingpur, Sangli, Maharashtra',
    system: 'Rooftop Solar from 1kW',
    projectType: 'Residential',
    performance: 'Net-Metered Clean Power',
    description:
      'Complete rooftop solar installation for a residential home in Jaysingpur — panel supply, mounting structure, inverter, wiring and commissioning.',
    statusNote: 'Green Infra Installation',
  },
  {
    id: 'proj-2',
    projectName: 'Commercial Shop Solar Setup',
    location: 'Jaysingpur, Maharashtra',
    system: 'Commercial Rooftop Solar',
    projectType: 'Commercial',
    performance: 'Reliable Daytime Power',
    description:
      'Solar power system for a commercial establishment, reducing grid dependence and electricity costs through clean rooftop solar generation.',
    statusNote: 'Green Infra Installation',
  },
  {
    id: 'proj-3',
    projectName: 'Industrial Unit Solar Plant',
    location: 'Sangli–Kolhapur Region, Maharashtra',
    system: 'Industrial Solar EPC',
    projectType: 'Industrial',
    performance: 'High-Yield Solar Generation',
    description:
      'Solar power plant for an industrial facility, engineered for heavy load offset and daytime production with monitoring support.',
    statusNote: 'Green Infra Installation',
  },
  {
    id: 'proj-4',
    projectName: 'School Campus Solar System',
    location: 'Jaysingpur Area, Maharashtra',
    system: 'Institutional Rooftop Solar',
    projectType: 'Educational Institute',
    performance: 'Clean Campus Energy',
    description:
      'Rooftop solar system for a school campus providing clean electricity for classrooms, lighting and administrative areas.',
    statusNote: 'Green Infra Installation',
  },
  {
    id: 'proj-5',
    projectName: 'EV Vehicle Delivery',
    location: 'Jaysingpur, Sangli, Maharashtra',
    system: 'Electric Vehicle Supply',
    projectType: 'EV Dealership',
    performance: 'Zero-Emission Mobility',
    description:
      'Authorised EV vehicle delivery to customers across Jaysingpur and Sangli region with complete documentation and handover support.',
    statusNote: 'Green Infra EV Dealer',
  },
  {
    id: 'proj-6',
    projectName: 'Agricultural Solar Pump',
    location: 'Sangli District, Maharashtra',
    system: 'Agricultural Solar System',
    projectType: 'Agriculture',
    performance: 'Daytime Pump Power',
    description:
      'Solar water pump system for agricultural use, reducing diesel and electricity cost for irrigation through clean solar power.',
    statusNote: 'Green Infra Installation',
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
    'Residential Homes',
    'Commercial Shops',
    'Industrial Units',
    'Schools & Institutes',
    'Agricultural Setups',
    'EV Vehicle Customers',
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

    const animate = () => {
      if (trackRef.current && isVisibleRef.current && !isTouchingRef.current) {
        speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

        if (speedRef.current > 0.001) {
          const halfWidth = trackRef.current.scrollWidth / 2;
          if (halfWidth > 0) {
            offsetRef.current -= speedRef.current;
            if (offsetRef.current <= 0) {
              offsetRef.current += halfWidth;
            }

            trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
          }
        }
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
    isPausedRef.current = true;
    targetSpeedRef.current = 0;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    targetSpeedRef.current = 0.75;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartOffsetRef.current = offsetRef.current;
    targetSpeedRef.current = 0;
    speedRef.current = 0;
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
      id="projects"
      ref={sectionRef}
      className="relative py-16 sm:py-20 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 sm:mb-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2 sm:space-y-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            GREEN INFRA PROJECTS
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Real Solar. Real EVs. Real Results.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Solar installations and EV deliveries by Green Infra across Jaysingpur, Sangli and Maharashtra.
          </p>
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
              className="w-[280px] sm:w-[350px] md:w-[390px] shrink-0 bg-slate-50/90 hover:bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 hover:border-emerald-300/90 shadow-2xs flex flex-col justify-between transition-all duration-250 hover:-translate-y-1.5 hover:shadow-lg group cursor-pointer"
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
                    PROJECT
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
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">System Output</span>
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
                  <span>GET A QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
                </a>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  Green Infra
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMERS SERVED RIBBON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mt-12 pt-10 border-t border-slate-200">
        <div className="text-center space-y-2 mb-6">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            WHO WE SERVE
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Green Infra Solar & EV — Serving All Segments
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
