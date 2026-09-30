import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ArrowRight, Sun, Zap, CheckCircle2 } from 'lucide-react';

interface ProjectCardData {
  id: string;
  location: string;
  system: string;
  projectType: string;
  performance: string;
  description: string;
}

const PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-1',
    location: 'Ichalkaranji, Maharashtra',
    system: '50 kW Rooftop Solar',
    projectType: 'Commercial Rooftop',
    performance: '~70,000 kWh/year',
    description:
      "A professionally designed rooftop solar system built around the site's electricity usage and available roof area.",
  },
  {
    id: 'proj-2',
    location: 'Kolhapur, Maharashtra',
    system: '10 kW On-Grid Solar',
    projectType: 'Residential Rooftop',
    performance: '~14,500 kWh/year',
    description:
      'High-efficiency residential rooftop installation designed for household power autonomy and grid net-metering.',
  },
  {
    id: 'proj-3',
    location: 'Pune (Chakan MIDC), Maharashtra',
    system: '250 kW Industrial Array',
    projectType: 'Industrial HT Solar',
    performance: '~3,60,000 kWh/year',
    description:
      'High-tension industrial rooftop installation engineered for manufacturing facility energy cost reduction.',
  },
  {
    id: 'proj-4',
    location: 'Sangli, Maharashtra',
    system: '75 kW Solar System',
    projectType: 'Commercial & Agro',
    performance: '~1,05,000 kWh/year',
    description:
      'Turnkey commercial solar solution optimized for peak daytime load compensation and long-term operating reliability.',
  },
  {
    id: 'proj-5',
    location: 'Solapur, Maharashtra',
    system: '12 kW On-Grid Solar',
    projectType: 'Residential Villa',
    performance: '~17,200 kWh/year',
    description:
      'Architectural rooftop solar array tailored to roof geometry with seamless DISCOM net-metering integration.',
  },
  {
    id: 'proj-6',
    location: 'Satara, Maharashtra',
    system: '120 kW Rooftop Solar',
    projectType: 'Institutional Campus',
    performance: '~1,70,000 kWh/year',
    description:
      'Comprehensive campus rooftop installation serving educational facilities with clean, dependable solar generation.',
  },
];

export const ImpactAndProof: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(0);
  const speedRef = useRef<number>(0.75); // Current pixels per frame
  const targetSpeedRef = useRef<number>(0.75); // Normal cruising speed
  const isPausedRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const rafIdRef = useRef<number | null>(null);

  // Touch drag tracking
  const touchStartXRef = useRef<number>(0);
  const touchStartOffsetRef = useRef<number>(0);
  const isTouchingRef = useRef<boolean>(false);

  // Duplicated list for seamless infinite loop (A + B)
  const loopCards = [...PROJECTS, ...PROJECTS];

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // IntersectionObserver to pause when section is out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Animation Loop (moves left-to-right)
    const animate = () => {
      if (trackRef.current && isVisibleRef.current && !isTouchingRef.current) {
        // Smoothly accelerate / decelerate towards target speed
        speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.08;

        if (speedRef.current > 0.001) {
          const halfWidth = trackRef.current.scrollWidth / 2;
          if (halfWidth > 0) {
            // Decrement offset to move cards from left to right
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

  // Desktop Hover Handlers
  const handleMouseEnter = () => {
    isPausedRef.current = true;
    targetSpeedRef.current = 0;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    targetSpeedRef.current = 0.75; // Resumes smoothly with ease-in
  };

  // Mobile Touch Handlers
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
    // Smoothly resume automatic movement
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
            OUR PROJECTS IN THE FIELD
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Real Systems. Real Sites. Real Solar.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Explore solar installations delivered by GVP Solar Energy across homes, businesses and industrial sites.
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
              className="w-[270px] sm:w-[350px] md:w-[390px] shrink-0 bg-slate-50/90 hover:bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200/80 hover:border-emerald-300/90 shadow-2xs flex flex-col justify-between transition-all duration-250 hover:-translate-y-1.5 hover:shadow-lg group cursor-pointer"
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
                    SYSTEM CAPACITY
                  </span>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5 group-hover:text-emerald-950 transition-colors">
                    {proj.system}
                  </h3>
                </div>

                {/* Performance Pill Box */}
                <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 group-hover:border-slate-300/80 flex items-center justify-between transition-colors">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Estimated Generation</span>
                  <span className="font-telemetry text-xs sm:text-base font-bold text-emerald-700">
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
                  href="#calculator"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>VIEW PROJECT</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 transition-transform duration-200 group-hover:translate-x-1.5" />
                </a>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                  GVP Solar
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
