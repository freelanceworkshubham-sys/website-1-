import React, { useState, useEffect, useRef } from 'react';
import { Sun, ArrowRight } from 'lucide-react';

interface StepData {
  id: string;
  stepNum: string;
  shortTitle: string;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  accentColor: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  accentGlow: string;
}

const STEPS: StepData[] = [
  {
    id: 'step-consult',
    stepNum: '01',
    shortTitle: 'ENQUIRY',
    title: 'Customer Enquiry & Requirement',
    description: 'Customer visits or contacts Green Infra with solar panel or EV requirement. We understand electricity usage, budget and goals.',
    actionText: 'CONTACT US TODAY',
    actionHref: '#contact',
    accentColor: '#2563EB',
    accentBorder: 'border-[#2563EB]',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-600',
    accentGlow: 'rgba(37, 99, 235, 0.22)',
  },
  {
    id: 'step-survey',
    stepNum: '02',
    shortTitle: 'SITE VISIT',
    title: 'Site Assessment & Survey',
    description: 'Our team visits your site, assesses rooftop space, shadow analysis, electrical infrastructure and feasibility for your system.',
    actionText: 'SCHEDULE SITE VISIT',
    actionHref: '#contact',
    accentColor: '#EA580C',
    accentBorder: 'border-[#EA580C]',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-600',
    accentGlow: 'rgba(234, 88, 12, 0.22)',
  },
  {
    id: 'step-design',
    stepNum: '03',
    shortTitle: 'SOLUTION',
    title: 'Custom Solar or EV Solution Design',
    description: 'We design the right solar panel system (from 1kW) or recommend the best EV option. Proposal with pricing, ROI and specifications shared.',
    actionText: 'VIEW OUR SOLUTIONS',
    actionHref: '#services',
    accentColor: '#059669',
    accentBorder: 'border-[#059669]',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
    accentGlow: 'rgba(5, 150, 105, 0.22)',
  },
  {
    id: 'step-install',
    stepNum: '04',
    shortTitle: 'INSTALL & DELIVER',
    title: 'Solar Installation or EV Delivery',
    description: 'Our certified team installs your solar system with full electrical work and commissioning, or we deliver and hand over your EV with documentation.',
    actionText: 'EXPLORE OUR WORK',
    actionHref: '#projects',
    accentColor: '#0284C7',
    accentBorder: 'border-[#0284C7]',
    accentBg: 'bg-cyan-50',
    accentText: 'text-cyan-600',
    accentGlow: 'rgba(2, 132, 199, 0.22)',
  },
  {
    id: 'step-support',
    stepNum: '05',
    shortTitle: 'SUPPORT',
    title: 'After-Sales Service & Support',
    description: 'Green Infra provides ongoing solar system maintenance, EV service support and guidance so your green energy investment keeps performing.',
    actionText: 'CONTACT FOR SUPPORT',
    actionHref: '#contact',
    accentColor: '#7C3AED',
    accentBorder: 'border-[#7C3AED]',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-600',
    accentGlow: 'rgba(124, 58, 237, 0.22)',
  },
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const LiveTelemetryBar: React.FC = () => {
  // Single source of truth for active step
  const [activeStep, setActiveStep] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Outer wrapper elements positioned by RAF
  const nodeWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement | null>(null);

  // Single animation controller refs
  const angleRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);
  const lastTimeRef = useRef<number>(performance.now());
  const activeStepRef = useRef<number>(0);

  // Click-to-rotate transition state within the single RAF loop
  const isClickTransitionRef = useRef<boolean>(false);
  const clickStartAngleRef = useRef<number>(0);
  const clickTargetAngleRef = useRef<number>(0);
  const clickStartTimeRef = useRef<number>(0);
  const resumeHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive dimensions ref (Desktop: radius 175px, center 170px, node 100px. Min clear gap: 175 - 85 - 50 = 40px)
  const dimensionsRef = useRef({
    stageSize: 480,
    radius: 175,
    centerSize: 170,
    nodeSize: 100,
  });

  const [dimensions, setDimensions] = useState({
    stageSize: 480,
    radius: 175,
    centerSize: 170,
    nodeSize: 100,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const width = window.innerWidth;
      let nextDims;
      if (width < 350) {
        // Ultra-compact mobile (320px)
        nextDims = { stageSize: 280, radius: 104, centerSize: 94, nodeSize: 52 };
      } else if (width < 400) {
        // Compact mobile (360px - 390px)
        nextDims = { stageSize: 316, radius: 118, centerSize: 106, nodeSize: 58 };
      } else if (width < 640) {
        // Standard mobile (400px - 639px)
        nextDims = { stageSize: 344, radius: 128, centerSize: 114, nodeSize: 64 };
      } else {
        // Tablet / Desktop
        nextDims = { stageSize: 480, radius: 175, centerSize: 154, nodeSize: 88 };
      }

      dimensionsRef.current = nextDims;
      setDimensions(nextDims);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          lastTimeRef.current = performance.now();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Mathematical node placement along circular orbit
    const updateNodePositions = (angleDeg: number) => {
      const { stageSize, radius, nodeSize } = dimensionsRef.current;
      const center = stageSize / 2;
      const halfNode = nodeSize / 2;
      const stepAngle = 360 / STEPS.length;

      for (let i = 0; i < STEPS.length; i++) {
        const el = nodeWrapperRefs.current[i];
        if (!el) continue;
        const rad = ((angleDeg + i * stepAngle) * Math.PI) / 180;
        const x = Math.round(center + radius * Math.cos(rad) - halfNode);
        const y = Math.round(center + radius * Math.sin(rad) - halfNode);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (dotRef.current) {
        const dotRad = (angleDeg * Math.PI) / 180;
        const dotX = center + radius * Math.cos(dotRad);
        const dotY = center + radius * Math.sin(dotRad);
        dotRef.current.setAttribute('cx', dotX.toString());
        dotRef.current.setAttribute('cy', dotY.toString());
      }
    };

    updateNodePositions(angleRef.current);

    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      };
    }

    // 25 seconds per full 360° orbit
    const SPEED = 360 / 25;
    let rafId: number;

    const animate = (now: number) => {
      // Cap deltaSec to 0.1s to prevent any tab switch or pause jump
      const deltaSec = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (isVisibleRef.current) {
        if (isClickTransitionRef.current) {
          // Smooth angular transition to clicked step using easeInOutCubic
          const elapsed = now - clickStartTimeRef.current;
          const progress = Math.min(1, elapsed / 700);
          const eased = easeInOutCubic(progress);

          angleRef.current =
            clickStartAngleRef.current +
            (clickTargetAngleRef.current - clickStartAngleRef.current) * eased;

          updateNodePositions(angleRef.current);

          if (progress >= 1) {
            isClickTransitionRef.current = false;
            angleRef.current = ((angleRef.current % 360) + 360) % 360;
          }
        } else if (!isPausedRef.current) {
          // Continuous smooth orbit
          angleRef.current = (angleRef.current + SPEED * deltaSec) % 360;
          updateNodePositions(angleRef.current);

          // Find which step is closest to TOP (270 degrees)
          const stepAngle = 360 / STEPS.length;
          let closestIdx = 0;
          let minDiff = Infinity;
          for (let i = 0; i < STEPS.length; i++) {
            const nodeAngle = ((angleRef.current + i * stepAngle) % 360 + 360) % 360;
            let diff = Math.abs(nodeAngle - 270);
            if (diff > 180) diff = 360 - diff;
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = i;
            }
          }

          // Only update state when step actually changes (once every ~5s, not every frame)
          if (closestIdx !== activeStepRef.current) {
            activeStepRef.current = closestIdx;
            setActiveStep(closestIdx);
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (resumeHoldTimerRef.current) clearTimeout(resumeHoldTimerRef.current);
    };
  }, []);

  // Hover: Pause orbit without moving the node from its position
  const handleNodeMouseEnter = (idx: number) => {
    if (isClickTransitionRef.current) return;
    if (resumeHoldTimerRef.current) clearTimeout(resumeHoldTimerRef.current);
    isPausedRef.current = true;
  };

  const handleNodeMouseLeave = () => {
    if (isClickTransitionRef.current) return;
    isPausedRef.current = false;
    lastTimeRef.current = performance.now();
  };

  // Click: Smoothly rotate orbit so clicked step glides into the top (270°) position along circular path
  const handleNodeClick = (idx: number) => {
    if (resumeHoldTimerRef.current) clearTimeout(resumeHoldTimerRef.current);

    // 1. Immediately update activeStep to clicked step
    activeStepRef.current = idx;
    setActiveStep(idx);

    // 2. Pause continuous rotation
    isPausedRef.current = true;

    // 3. Calculate shortest angular distance to top (270°)
    const stepAngle = 360 / STEPS.length;
    const currentDeg = ((angleRef.current + idx * stepAngle) % 360 + 360) % 360;
    let diff = 270 - currentDeg;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    clickStartAngleRef.current = angleRef.current;
    clickTargetAngleRef.current = angleRef.current + diff;
    clickStartTimeRef.current = performance.now();
    isClickTransitionRef.current = true;

    // 4. Hold step for 2.2 seconds after rotation completes, then smoothly resume continuous loop
    resumeHoldTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = performance.now();
    }, 700 + 2200);
  };

  // Single source of truth for the active step content
  const currentStep = STEPS[activeStep];
  const { stageSize, radius, centerSize, nodeSize } = dimensions;
  const center = stageSize / 2;

  return (
    <section
      id="solar-journey"
      ref={sectionRef}
      className="relative py-10 sm:py-16 px-3 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-y border-slate-200/80 overflow-hidden"
    >
      <div id="how-it-works" className="relative -top-24 pointer-events-none" />
      <style>{`
        @keyframes infoCardContentFade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card-content-fade {
          animation: infoCardContentFade 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-2 sm:space-y-2.5">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-200/80 inline-block">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            How Green Infra Works
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            From your first enquiry to solar installation or EV delivery — a seamless 5-step green energy journey.
          </p>
        </div>

        {/* ORBITAL VISUAL CONTAINER */}
        <div className="relative flex items-center justify-center">
          
          <div
            ref={stageRef}
            className="relative will-change-transform select-none"
            style={{ width: `${stageSize}px`, height: `${stageSize}px` }}
          >
            {/* SVG Orbit Path with subtle guide stroke & traveling dot (z-0) */}
            <svg
              className="absolute inset-0 pointer-events-none z-0"
              width={stageSize}
              height={stageSize}
              viewBox={`0 0 ${stageSize} ${stageSize}`}
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="1.25"
              />

              {STEPS.map((_, i) => {
                const rad = (i * (360 / STEPS.length) * Math.PI) / 180;
                return (
                  <circle
                    key={i}
                    cx={center + radius * Math.cos(rad)}
                    cy={center + radius * Math.sin(rad)}
                    r="2.5"
                    fill="#94A3B8"
                    opacity="0.4"
                  />
                );
              })}

              <circle
                ref={dotRef}
                cx={center}
                cy={center - radius}
                r="3.5"
                fill="#7FD4F0"
                style={{ filter: 'drop-shadow(0 0 4px rgba(127, 212, 240, 0.7))' }}
              />
            </svg>

            {/* Central Station Circle: YOUR SOLAR JOURNEY (z-20 protected layer) */}
            <div
              className="absolute rounded-full bg-[#0A1224] text-white border-2 border-white/90 shadow-lg flex flex-col items-center justify-center text-center z-20 transition-transform duration-300 pointer-events-none"
              style={{
                width: `${centerSize}px`,
                height: `${centerSize}px`,
                left: `${center - centerSize / 2}px`,
                top: `${center - centerSize / 2}px`,
              }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center mb-0.5 sm:mb-1 text-[#C6F500]">
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-[#C6F500] uppercase">
                GREEN
              </span>
              <span className="text-xs sm:text-base font-extrabold tracking-wider text-white uppercase leading-tight">
                INFRA
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                SOLAR & EV
              </span>
            </div>

            {/* 4 Continuously Orbiting Step Nodes (z-10 layer) */}
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                // Outer wrapper: RAF strictly updates translate3d on this wrapper element
                <div
                  key={step.id}
                  ref={(el) => {
                    nodeWrapperRefs.current[idx] = el;
                  }}
                  className="absolute top-0 left-0 will-change-transform z-10"
                  style={{
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                  }}
                >
                  {/* Inner interactive button: handles scale(1.08), hover, borders around its own center without modifying orbital position */}
                  <button
                    type="button"
                    onClick={() => handleNodeClick(idx)}
                    onMouseEnter={() => handleNodeMouseEnter(idx)}
                    onMouseLeave={handleNodeMouseLeave}
                    className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-center cursor-pointer select-none outline-none"
                    style={{
                      borderWidth: '2px',
                      borderColor: isActive ? step.accentColor : '#E2E8F0',
                      transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      opacity: isActive ? 1 : 0.75,
                      boxShadow: isActive
                        ? `0 6px 20px ${step.accentGlow}, 0 2px 6px rgba(0,0,0,0.06)`
                        : '0 2px 6px rgba(0,0,0,0.04)',
                      transition:
                        'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), border-color 250ms ease, opacity 250ms ease, box-shadow 250ms ease',
                    }}
                  >
                    <span
                      className={`font-mono text-[9px] sm:text-xs font-bold leading-none mb-0.5 ${
                        isActive ? step.accentText : 'text-slate-400'
                      }`}
                    >
                      {step.stepNum}
                    </span>

                    <span
                      className={`text-[8px] sm:text-[11px] font-semibold tracking-tight px-1 leading-tight ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {step.shortTitle}
                    </span>

                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1 transition-all duration-300"
                        style={{ backgroundColor: step.accentColor }}
                      />
                    )}
                  </button>
                </div>
              );
            })}

          </div>

        </div>

        {/* SUBTLE CONNECTOR INDICATOR */}
        <div className="w-px h-5 bg-gradient-to-b from-slate-200 to-transparent mx-auto mt-2" />

        {/* ACTIVE STEP INFORMATION CARD (Stationary container, renders ONLY currentStep) */}
        <div className="w-full max-w-xl transition-all duration-300">
          <div
            className="bg-slate-50/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 relative overflow-hidden min-h-[105px] flex items-center transition-all duration-300"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: currentStep.accentColor,
              boxShadow: `0 4px 20px -4px ${currentStep.accentGlow}, 0 1px 3px rgba(0, 0, 0, 0.04)`,
            }}
          >
            {/* Inner Content that animates smoothly on step change */}
            <div
              key={activeStep}
              className="card-content-fade w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${currentStep.accentBg} ${currentStep.accentText}`}
                  >
                    STEP {currentStep.stepNum}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
                    {currentStep.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pr-2">
                  {currentStep.description}
                </p>
              </div>

              <a
                href={currentStep.actionHref}
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${currentStep.accentText} group hover:opacity-90 shrink-0 self-start sm:self-center transition-all cursor-pointer`}
              >
                <span>{currentStep.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// Also export as SolarJourney for clarity
export const SolarJourney = LiveTelemetryBar;
