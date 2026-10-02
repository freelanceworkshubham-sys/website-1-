import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, Sun, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface BenefitNode {
  id: string;
  type: 'subsidy' | 'roi' | 'savings' | 'projects';
  tag: string;
  primary: string;
  secondary: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  ctaText?: string;
  icon: React.ReactNode;
}

const BENEFIT_NODES: BenefitNode[] = [
  {
    id: 'b-solar',
    type: 'subsidy',
    tag: 'SOLAR PANELS',
    primary: 'From 1kW & Above',
    secondary: 'Residential, commercial & industrial',
    accentColor: '#2563EB',
    accentBorder: 'border-blue-400',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-600',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />,
  },
  {
    id: 'b-ev',
    type: 'roi',
    tag: 'EV VEHICLES',
    primary: 'Electric Vehicles',
    secondary: 'Authorised dealer — Jaysingpur',
    accentColor: '#059669',
    accentBorder: 'border-emerald-400',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
    icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
  },
  {
    id: 'b-subsidy',
    type: 'savings',
    tag: 'PM SURYA GHAR',
    primary: '₹30K–₹78K*',
    secondary: 'Govt. residential subsidy available',
    accentColor: '#EA580C',
    accentBorder: 'border-orange-400',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-600',
    icon: <Sun className="w-3.5 h-3.5 text-orange-600" />,
  },
  {
    id: 'b-savings',
    type: 'projects',
    tag: 'GREEN ENERGY',
    primary: 'Lower Electricity Bills',
    secondary: 'Solar saves money every day',
    ctaText: 'CALCULATE →',
    accentColor: '#0284C7',
    accentBorder: 'border-cyan-400',
    accentBg: 'bg-cyan-50',
    accentText: 'text-cyan-600',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />,
  },
];

export const SolarBenefitsRibbon: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const lastTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);

  // Active tooltip state for clicks
  const [activeTooltip, setActiveTooltip] = useState<{
    nodeId: string;
    text: string;
  } | null>(null);

  // Touch tracking
  const touchStartXRef = useRef<number>(0);
  const touchStartOffsetRef = useRef<number>(0);
  const isTouchingRef = useRef<boolean>(false);

  // Render duplicated nodes for a seamless infinite loop
  const loopNodes = [...BENEFIT_NODES, ...BENEFIT_NODES];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          lastTimeRef.current = performance.now();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (prefersReducedMotion) {
      return () => observer.disconnect();
    }

    // Cruising speed: ~22px per second (~20s for a full loop)
    const SPEED = 22;

    const animate = (now: number) => {
      const deltaSec = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (trackRef.current && isVisibleRef.current && !isPausedRef.current && !isTouchingRef.current) {
        offsetRef.current += SPEED * deltaSec;

        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }

        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      observer.disconnect();
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    lastTimeRef.current = performance.now();
  };

  // Node Click Handlers
  const handleNodeClick = (node: BenefitNode) => {
    if (node.type === 'subsidy') {
      setActiveTooltip({
        nodeId: node.id,
        text: 'Central financial assistance under PM Surya Ghar is for eligible residential rooftop systems (up to ₹78,000 for 3 kW+).',
      });
    } else if (node.type === 'roi') {
      setActiveTooltip({
        nodeId: node.id,
        text: 'Estimate your customized system economics and payback in the calculator below.',
      });
      setTimeout(() => {
        const el = document.getElementById('calculator');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    } else if (node.type === 'savings') {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (node.type === 'projects') {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartOffsetRef.current = offsetRef.current;
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
    lastTimeRef.current = performance.now();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white pt-6 pb-2 select-none overflow-hidden"
    >
      {/* Curved Visual Ribbon Track */}
      <div
        className="w-full relative cursor-grab active:cursor-grabbing"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 px-6 sm:px-12 w-max will-change-transform items-center py-2"
        >
          {loopNodes.map((node, idx) => (
            <div
              key={`${node.id}-${idx}`}
              onClick={() => handleNodeClick(node)}
              className="group flex items-center gap-3 bg-slate-50/90 hover:bg-white border border-slate-200/90 hover:border-slate-300 rounded-full px-4 py-2 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0 hover:scale-[1.03]"
              style={{
                borderLeftWidth: '3px',
                borderLeftColor: node.accentColor,
              }}
            >
              {/* Node Icon */}
              <div className={`p-1.5 rounded-full ${node.accentBg} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                {node.icon}
              </div>

              {/* Text content */}
              <div className="flex flex-col text-left pr-1">
                <span className="text-[9px] font-bold font-mono tracking-widest text-slate-400 uppercase leading-none mb-0.5">
                  {node.tag}
                </span>
                <span className="text-xs font-semibold text-slate-900 tracking-tight leading-snug flex items-center gap-1.5">
                  <span>{node.primary}</span>
                  {node.ctaText && (
                    <span className="text-[10px] font-bold text-cyan-600 underline ml-0.5">
                      {node.ctaText}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {node.secondary}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Click Tooltip */}
      {activeTooltip && (
        <div className="max-w-md mx-auto px-4 mt-2 transition-all duration-300">
          <div className="bg-[#0A1224] text-white text-[11px] rounded-xl px-3.5 py-2 shadow-md flex items-center justify-between gap-2 border border-slate-800">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-[#7FD4F0] shrink-0" />
              <span className="text-slate-200 leading-tight">{activeTooltip.text}</span>
            </div>
            <button
              onClick={() => setActiveTooltip(null)}
              className="text-slate-400 hover:text-white p-0.5 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footnote */}
      <div className="text-center mt-2.5">
        <p className="text-[10px] text-slate-400 leading-tight">
          *Indicative residential CFA under PM Surya Ghar; eligibility and amount depend on applicable scheme rules.
        </p>
      </div>

      {/* Minimal Visual Connector toward Calculator */}
      <div className="flex flex-col items-center justify-center mt-3">
        <div className="w-px h-5 bg-gradient-to-b from-slate-300 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 -mt-0.5" />
      </div>

    </div>
  );
};
