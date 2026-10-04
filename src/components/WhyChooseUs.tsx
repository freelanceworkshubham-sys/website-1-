import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, Sparkles, Sun, Zap, IndianRupee, Building2, ArrowRight } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenQuote?: () => void;
}

/* ─── Solar Flow Animation Steps ─── */
const FLOW_STEPS = [
  {
    id: 'sun',
    label: 'Solar Radiation',
    desc: 'Abundant sunlight hits your rooftop',
    icon: Sun,
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'panels',
    label: 'Solar Panels',
    desc: 'Tier-1 Mono PERC modules capture energy',
    icon: Zap,
    color: '#1E40AF',
    glowColor: 'rgba(30, 64, 175, 0.3)',
  },
  {
    id: 'inverter',
    label: 'Smart Inverter',
    desc: 'DC converted to AC with 98% efficiency',
    icon: Zap,
    color: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.3)',
  },
  {
    id: 'home',
    label: 'Home Electricity',
    desc: 'Powers your appliances & feeds the grid',
    icon: Building2,
    color: '#7C3AED',
    glowColor: 'rgba(124, 58, 237, 0.3)',
  },
  {
    id: 'savings',
    label: 'Up to 80% Savings',
    desc: '₹0 electricity bills for 25+ years',
    icon: IndianRupee,
    color: '#C6F500',
    glowColor: 'rgba(198, 245, 0, 0.4)',
  },
];

/* ─── Animated Energy Particle ─── */
const EnergyParticle: React.FC<{
  fromX: number; fromY: number;
  toX: number; toY: number;
  color: string;
  delay: number;
  duration: number;
  size?: number;
}> = ({ fromX, fromY, toX, toY, color, delay, duration, size = 6 }) => {
  const id = `particle-${fromX}-${toX}-${delay}`;
  return (
    <g>
      <defs>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow */}
      <circle r={size * 2.5} fill={`url(#glow-${id})`}>
        <animate
          attributeName="cx" from={fromX} to={toX}
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
        <animate
          attributeName="cy" from={fromY} to={toY}
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
        <animate
          attributeName="opacity" values="0;1;1;0"
          keyTimes="0;0.1;0.85;1"
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
      </circle>
      {/* Core dot */}
      <circle r={size / 2} fill={color}>
        <animate
          attributeName="cx" from={fromX} to={toX}
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
        <animate
          attributeName="cy" from={fromY} to={toY}
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
        <animate
          attributeName="opacity" values="0;1;1;0"
          keyTimes="0;0.1;0.85;1"
          dur={`${duration}s`} begin={`${delay}s`}
          repeatCount="indefinite" />
      </circle>
    </g>
  );
};

/* ─── Building SVG Illustration ─── */
const BuildingIllustration: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const panelActive = activeStep >= 1;
  const inverterActive = activeStep >= 2;
  const homeActive = activeStep >= 3;
  const savingsActive = activeStep >= 4;

  return (
    <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#F0F9FF" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0F2440" />
        </linearGradient>
        <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background sky */}
      <rect width="420" height="380" fill="url(#sky)" rx="16" />

      {/* Sun */}
      <g>
        <circle cx="340" cy="55" r="28" fill="#FCD34D" opacity={activeStep >= 0 ? 1 : 0.3}
          style={{ transition: 'opacity 0.8s ease' }}>
          <animate attributeName="r" values="26;30;26" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="340" cy="55" r="40" fill="none" stroke="#FCD34D"
          strokeWidth="1" opacity={activeStep >= 0 ? 0.3 : 0}
          style={{ transition: 'opacity 0.8s ease' }}>
          <animate attributeName="r" values="36;44;36" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Sun rays */}
        {activeStep >= 0 && [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1={340 + Math.cos((angle * Math.PI) / 180) * 34}
            y1={55 + Math.sin((angle * Math.PI) / 180) * 34}
            x2={340 + Math.cos((angle * Math.PI) / 180) * 44}
            y2={55 + Math.sin((angle * Math.PI) / 180) * 44}
            stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round"
            opacity="0.5"
          >
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s"
              begin={`${i * 0.25}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>

      {/* Ground */}
      <rect x="0" y="310" width="420" height="70" fill="#E2E8F0" rx="0" />
      <rect x="0" y="310" width="420" height="3" fill="#CBD5E1" />

      {/* Building body */}
      <g filter="url(#softShadow)">
        <rect x="60" y="150" width="160" height="160" fill="url(#buildingGrad)"
          stroke="#CBD5E1" strokeWidth="1" rx="4" />
        {/* Roof */}
        <rect x="50" y="142" width="180" height="14" fill="url(#roofGrad)" rx="3" />

        {/* Windows */}
        {[0, 1, 2].map(row => (
          [0, 1, 2].map(col => (
            <rect key={`w-${row}-${col}`}
              x={80 + col * 48} y={168 + row * 44}
              width="28" height="32" rx="2"
              fill={homeActive ? '#DBEAFE' : '#F1F5F9'}
              stroke={homeActive ? '#93C5FD' : '#CBD5E1'}
              strokeWidth="0.8"
              style={{ transition: 'fill 0.6s ease, stroke 0.6s ease' }}
            />
          ))
        ))}

        {/* Door */}
        <rect x="122" y="268" width="36" height="42" rx="3"
          fill={homeActive ? '#BFDBFE' : '#E2E8F0'}
          stroke={homeActive ? '#60A5FA' : '#94A3B8'} strokeWidth="1"
          style={{ transition: 'fill 0.6s ease' }} />
        <circle cx="152" cy="290" r="2.5"
          fill={homeActive ? '#2563EB' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease' }} />
      </g>

      {/* Solar Panels on rooftop */}
      <g style={{ opacity: panelActive ? 1 : 0.35, transition: 'opacity 0.8s ease' }}>
        {[0, 1, 2, 3].map(i => (
          <g key={`panel-${i}`}>
            <rect
              x={70 + i * 40} y="108" width="34" height="30" rx="2"
              fill="url(#panelGrad)"
              stroke={panelActive ? '#3B82F6' : '#475569'}
              strokeWidth={panelActive ? '1.2' : '0.6'}
              style={{ transition: 'stroke 0.6s ease' }}
            />
            {/* Panel grid lines */}
            <line x1={70 + i * 40 + 11} y1="108" x2={70 + i * 40 + 11} y2="138"
              stroke={panelActive ? '#60A5FA' : '#334155'} strokeWidth="0.4" opacity="0.5" />
            <line x1={70 + i * 40 + 23} y1="108" x2={70 + i * 40 + 23} y2="138"
              stroke={panelActive ? '#60A5FA' : '#334155'} strokeWidth="0.4" opacity="0.5" />
            <line x1={70 + i * 40} y1="123" x2={70 + i * 40 + 34} y2="123"
              stroke={panelActive ? '#60A5FA' : '#334155'} strokeWidth="0.4" opacity="0.5" />
          </g>
        ))}
        {/* Panel highlight shimmer */}
        {panelActive && (
          <rect x="68" y="106" width="168" height="34" rx="3" fill="none"
            stroke="#3B82F6" strokeWidth="1" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" repeatCount="indefinite" />
          </rect>
        )}
      </g>

      {/* Inverter box (right side of building) */}
      <g style={{ opacity: inverterActive ? 1 : 0.3, transition: 'opacity 0.8s ease' }}>
        <rect x="280" y="200" width="60" height="48" rx="6"
          fill={inverterActive ? '#F0FDF4' : '#F8FAFC'}
          stroke={inverterActive ? '#059669' : '#CBD5E1'}
          strokeWidth={inverterActive ? '1.5' : '0.8'}
          style={{ transition: 'all 0.6s ease' }} />
        {/* Inverter screen */}
        <rect x="290" y="210" width="40" height="18" rx="2"
          fill={inverterActive ? '#065F46' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease' }} />
        {/* LED indicators */}
        <circle cx="296" cy="238" r="3"
          fill={inverterActive ? '#34D399' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease' }}>
          {inverterActive && (
            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="310" cy="238" r="3"
          fill={inverterActive ? '#10B981' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease' }} />
        <circle cx="324" cy="238" r="3"
          fill={inverterActive ? '#059669' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease' }} />
        {/* Label */}
        <text x="310" y="264" textAnchor="middle" fontSize="8" fontWeight="600"
          fill={inverterActive ? '#065F46' : '#94A3B8'}
          style={{ transition: 'fill 0.6s ease', fontFamily: 'system-ui' }}>
          INVERTER
        </text>
      </g>

      {/* Cable: panels → inverter */}
      <path d="M 230 125 Q 260 125 268 170 Q 272 195 280 210"
        stroke={panelActive ? '#1E40AF' : '#CBD5E1'}
        strokeWidth={panelActive ? '2' : '1'}
        fill="none" strokeDasharray={panelActive ? '6 3' : 'none'}
        opacity={panelActive ? 0.7 : 0.3}
        style={{ transition: 'all 0.8s ease' }}>
        {panelActive && (
          <animate attributeName="stroke-dashoffset" values="18;0" dur="1s" repeatCount="indefinite" />
        )}
      </path>

      {/* Cable: inverter → building */}
      <path d="M 280 230 Q 260 240 230 250 Q 222 252 220 260"
        stroke={inverterActive ? '#059669' : '#CBD5E1'}
        strokeWidth={inverterActive ? '2' : '1'}
        fill="none" strokeDasharray={inverterActive ? '6 3' : 'none'}
        opacity={inverterActive ? 0.7 : 0.3}
        style={{ transition: 'all 0.8s ease' }}>
        {inverterActive && (
          <animate attributeName="stroke-dashoffset" values="18;0" dur="1s" repeatCount="indefinite" />
        )}
      </path>

      {/* Energy particles: sun → panels */}
      {activeStep >= 0 && (
        <g>
          <EnergyParticle fromX={320} fromY={80} toX={154} toY={108}
            color="#FCD34D" delay={0} duration={2} />
          <EnergyParticle fromX={330} fromY={75} toX={120} toY={110}
            color="#FBBF24" delay={0.7} duration={2.2} />
          <EnergyParticle fromX={310} fromY={85} toX={190} toY={112}
            color="#FCD34D" delay={1.3} duration={1.8} />
        </g>
      )}

      {/* Energy particles: panels → inverter */}
      {panelActive && (
        <g>
          <EnergyParticle fromX={230} fromY={125} toX={280} toY={215}
            color="#3B82F6" delay={0.2} duration={1.5} size={5} />
          <EnergyParticle fromX={230} fromY={130} toX={285} toY={220}
            color="#2563EB" delay={1} duration={1.6} size={4} />
        </g>
      )}

      {/* Energy particles: inverter → home */}
      {inverterActive && (
        <g>
          <EnergyParticle fromX={280} fromY={230} toX={220} toY={260}
            color="#10B981" delay={0.3} duration={1.2} size={5} />
          <EnergyParticle fromX={278} fromY={235} toX={215} toY={255}
            color="#34D399" delay={0.9} duration={1.4} size={4} />
        </g>
      )}

      {/* Savings badge */}
      {savingsActive && (
        <g>
          <rect x="300" y="300" width="100" height="40" rx="12"
            fill="#C6F500" stroke="#A3D200" strokeWidth="1">
            <animate attributeName="opacity" values="0;1" dur="0.6s" fill="freeze" />
          </rect>
          <text x="350" y="316" textAnchor="middle" fontSize="9" fontWeight="700"
            fill="#1A1A1A" style={{ fontFamily: 'system-ui' }}>
            ₹0 BILL
          </text>
          <text x="350" y="330" textAnchor="middle" fontSize="7.5" fontWeight="500"
            fill="#333" style={{ fontFamily: 'system-ui' }}>
            80% Savings!
          </text>
        </g>
      )}

      {/* Clouds */}
      <ellipse cx="80" cy="45" rx="28" ry="12" fill="white" opacity="0.7" />
      <ellipse cx="100" cy="40" rx="22" ry="10" fill="white" opacity="0.5" />
      <ellipse cx="180" cy="32" rx="20" ry="8" fill="white" opacity="0.4" />

      {/* Small tree */}
      <g>
        <rect x="375" y="278" width="6" height="32" rx="2" fill="#92400E" />
        <ellipse cx="378" cy="270" rx="18" ry="20" fill="#22C55E" opacity="0.5" />
        <ellipse cx="378" cy="265" rx="14" ry="16" fill="#16A34A" opacity="0.6" />
      </g>
    </svg>
  );
};

/* ─── Main Component ─── */
export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenQuote }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  const counters = [
    { count: '500+', label: 'Projects Done', sub: 'Rooftop & Industrial' },
    { count: '400+', label: 'Total Clients', sub: 'Across Maharashtra' },
    { count: '25+', label: 'Expert Staff', sub: 'Certified Solar Engineers' },
    { count: '15+', label: 'Awards Won', sub: 'Industry Recognition' },
  ];

  const pillars = [
    {
      count: '01',
      title: 'Competitive Pricing & Subsidies',
      desc: 'We offer competitive prices in Maharashtra with complete end-to-end assistance in PM Surya Ghar Muft Bijli Yojana subsidy applications, saving you up to 40% on setup costs.',
      accent: 'border-l-amber-500',
    },
    {
      count: '02',
      title: 'Expert Certified Installation Team',
      desc: 'Our certified engineers and technicians bring 7+ years of experience and 1000+ successful installations across Sangli, Pune, Kolhapur, and Mumbai.',
      accent: 'border-l-emerald-500',
    },
    {
      count: '03',
      title: 'Premium Quality Tier-1 Products',
      desc: 'We use exclusively Tier-1 solar panels (Mono PERC / TOPCon) and high-efficiency smart inverters backed by a 25+ year performance warranty.',
      accent: 'border-l-cyan-500',
    },
  ];

  /* Scroll-driven step progression */
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    // Calculate how far into view the section is
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // Start animation when section is 30% into viewport
    const entryPoint = vh * 0.7;
    const exitPoint = -sectionHeight * 0.3;

    if (sectionTop > entryPoint) {
      setActiveStep(-1);
      return;
    }

    // Progress from 0 to 1 as user scrolls through
    const scrollRange = entryPoint - exitPoint;
    const progress = Math.min(1, Math.max(0, (entryPoint - sectionTop) / scrollRange));

    // Map progress to steps (0..4)
    const step = Math.min(4, Math.floor(progress * 5));
    setActiveStep(step);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200 overflow-hidden"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">

        {/* 4 Large Highlight Counter Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {counters.map((c, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-center shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <span className="font-telemetry text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors block leading-none">
                {c.count}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-2 sm:mt-2.5 uppercase tracking-wider">
                {c.label}
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">
                {c.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Main Two-Column: Why Choose Us & Solar Flow Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Why Choose Us Content & 3 Pillars */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-emerald-600" />
                WHY CHOOSE INVISIBLE ENERGY
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                Why Choose <span className="text-emerald-700">Invisible Energy</span> for Solar?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                With 7+ years of experience in Maharashtra's solar industry, we combine technical expertise, Tier-1 products, and exceptional customer service to deliver solar solutions that exceed expectations.
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div className="space-y-3.5 pt-1">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className={`bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs border-l-4 ${p.accent} hover:bg-white hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className="font-mono text-xs font-bold text-slate-400 mt-0.5">
                      {p.count}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {p.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {onOpenQuote && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="inline-flex items-center gap-2 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>Request Free Site Consultation</span>
                  <Sparkles className="w-4 h-4 fill-black text-black" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Premium Interactive Solar Flow Animation */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/40 border border-slate-200 shadow-xl">

              {/* Header badge */}
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  How Solar Works
                </div>
                <h4 className="text-sm font-bold text-slate-800 mt-1">
                  Rooftop Solar Installation Flow
                </h4>
              </div>

              {/* SVG Illustration */}
              <div className="px-3 pb-2">
                <BuildingIllustration activeStep={activeStep} />
              </div>

              {/* Flow Steps Progress */}
              <div className="px-5 pb-5">
                <div className="space-y-0">
                  {FLOW_STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    const isActive = i <= activeStep;
                    const isCurrent = i === activeStep;

                    return (
                      <div key={step.id} className="flex items-stretch gap-3">
                        {/* Vertical connector line + dot */}
                        <div className="flex flex-col items-center w-6 shrink-0">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
                            style={{
                              backgroundColor: isActive ? step.color : '#E2E8F0',
                              boxShadow: isCurrent ? `0 0 12px ${step.glowColor}` : 'none',
                              transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                            }}
                          >
                            <StepIcon className="w-2.5 h-2.5" style={{ color: isActive ? '#fff' : '#94A3B8' }} />
                          </div>
                          {i < FLOW_STEPS.length - 1 && (
                            <div
                              className="w-0.5 flex-1 min-h-[16px] transition-colors duration-500"
                              style={{
                                backgroundColor: i < activeStep ? FLOW_STEPS[i + 1].color : '#E2E8F0',
                              }}
                            />
                          )}
                        </div>

                        {/* Step label */}
                        <div className={`pb-3 pt-0.5 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom info strip */}
              <div className="border-t border-slate-200 px-5 py-3.5 flex items-center justify-between bg-white/60">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tier-1 Verified Installation
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                  25+ Year Warranty
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
