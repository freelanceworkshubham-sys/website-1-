import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Zap, Star, Sparkles, ChevronDown } from 'lucide-react';

// =========================================================================
// SLIDE TEXT CONFIGURATION (Edit your video slide copy here)
// Max 3 words per line. Each line renders as a block (no auto wrapping).
// =========================================================================
export interface TextSlideData {
  id: number;
  start: number; // scroll progress start (0.0 to 1.0)
  end: number;   // scroll progress end (0.0 to 1.0)
  mainLines: string[];
  subLines: string[];
}

const SLIDES_DATA: TextSlideData[] = [
  {
    id: 1,
    start: 0.0,
    end: 0.20,
    mainLines: ["Every night,", "your roof waits."],
    subLines: ["Silent. Unused. Ready."],
  },
  {
    id: 2,
    start: 0.20,
    end: 0.40,
    mainLines: ["Then the sun", "rises."],
    subLines: ["Free energy,", "every single day."],
  },
  {
    id: 3,
    start: 0.40,
    end: 0.60,
    mainLines: ["Your panels", "wake up."],
    subLines: ["Sunlight becomes power", "for your home."],
  },
  {
    id: 4,
    start: 0.60,
    end: 0.80,
    mainLines: ["Your home runs", "on its own", "light."],
    subLines: ["Lower bills for", "the next 25 years."],
  },
];

interface SolarHero3DExperienceProps {
  onExploreInnovation?: () => void;
  onOpenCalculator?: () => void;
  onOpenQuote?: () => void;
  onScrollProgressChange?: (progress: number) => void;
}

const TOTAL_FRAMES = 302;
const FRAME_1_COUNT = 150; // frames in public/frames/1 (001 to 150)

function getFramePath(index: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(index)));
  if (clamped < FRAME_1_COUNT) {
    const num = String(clamped + 1).padStart(3, '0');
    return `/frames/1/ezgif-frame-${num}.jpg`;
  } else {
    const num = String(clamped - FRAME_1_COUNT + 1).padStart(3, '0');
    return `/frames/2/ezgif-frame-${num}.jpg`;
  }
}

// Power2 easing curves (matching GSAP power2.out and power2.in)
const power2Out = (t: number) => 1 - (1 - t) * (1 - t);
const power2In = (t: number) => t * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// 8-Stage Physical Electrical Workflow sequence (0.00 to 1.00)
export const ELECTRICAL_WORKFLOW_STAGES = [
  { range: [0.0, 0.15], name: '01 · BUILDING & ROOFTOP', desc: 'Pre-solar state & site harvest' },
  { range: [0.15, 0.3], name: '02 · SOLAR PANELS', desc: 'High-efficiency PV array formation' },
  { range: [0.3, 0.45], name: '03 · DC CABLE PATH', desc: 'Direct-current solar transmission' },
  { range: [0.45, 0.6], name: '04 · DCDB & ISOLATOR', desc: 'Surge protection & isolation' },
  { range: [0.6, 0.72], name: '05 · SOLAR INVERTER', desc: 'Wall-mounted DC to AC conversion' },
  { range: [0.82, 0.90], name: '07 · BIDIRECTIONAL NET METER', desc: 'Two-way MSEDCL grid measurement' },
  { range: [0.90, 1.0], name: '08 · POWERED-HOME STATE', desc: 'Clean self-generation & grid export' },
];

export const SolarHero3DExperience: React.FC<SolarHero3DExperienceProps> = ({
  onExploreInnovation,
  onOpenCalculator,
  onOpenQuote,
  onScrollProgressChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cached HTMLImageElement array for 302 frames
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState<boolean>(false);

  // Animation and scroll state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Detect user preference for reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Helper to load a specific frame with priority
  const loadFrame = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    if (imagesRef.current[clamped]) return;

    const img = new Image();
    img.src = getFramePath(clamped);
    img.onload = () => {
      imagesRef.current[clamped] = img;
      // If user is currently parked on or near this frame, re-render immediately
      if (Math.abs(currentFrameRef.current - clamped) <= 2) {
        drawFrame(currentFrameRef.current, true);
      }
    };
    img.onerror = () => {
      setTimeout(() => {
        if (!imagesRef.current[clamped]) {
          const retry = new Image();
          retry.src = getFramePath(clamped);
          retry.onload = () => {
            imagesRef.current[clamped] = retry;
            if (Math.abs(currentFrameRef.current - clamped) <= 2) {
              drawFrame(currentFrameRef.current, true);
            }
          };
        }
      }, 400);
    };
    imagesRef.current[clamped] = img;
  }, []);

  // Draw a specific frame onto the canvas (with fallback redrawing and no stale cache lock)
  const drawFrame = useCallback((frameIndex: number, forceRedraw = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    let img = imagesRef.current[clampedIndex];
    const isExact = Boolean(img && img.complete && img.naturalWidth > 0);

    if (!forceRedraw && isExact && lastDrawnFrameRef.current === clampedIndex) return;

    // Fallback: if requested frame is not yet fully loaded, find nearest loaded frame
    if (!isExact) {
      // Prioritize loading requested frame and surrounding frames immediately
      loadFrame(clampedIndex);
      loadFrame(clampedIndex - 1);
      loadFrame(clampedIndex + 1);

      for (let i = clampedIndex - 1; i >= 0; i--) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = clampedIndex + 1; i < TOTAL_FRAMES; i++) {
          const candidate = imagesRef.current[i];
          if (candidate && candidate.complete && candidate.naturalWidth > 0) {
            img = candidate;
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (canvas.width === 0 || canvas.height === 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round((window.innerWidth || 1920) * dpr);
      canvas.height = Math.round((window.innerHeight || 1080) * dpr);
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    // Aspect ratio "cover" sizing for 1920x1080 source
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;
    const canvasRatio = canvasWidth / canvasHeight;
    const imgRatio = imgWidth / imgHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    if (isExact) {
      lastDrawnFrameRef.current = clampedIndex;
    } else {
      lastDrawnFrameRef.current = -1; // Keep open to redraw as soon as real frame arrives
    }
  }, [loadFrame]);

  // Resize canvas according to viewport and DPR
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      drawFrame(currentFrameRef.current, true);
    }
  }, [drawFrame]);

  // Wave-based smart preloading on mount
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load frame 0
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      setIsFirstFrameLoaded(true);
      handleResize();
      drawFrame(0, true);
    };

    // 2. Load keyframes across entire timeline (every 4th frame: 0, 4, 8, ... 300)
    // Provides instant visual feedback across all 8 electrical stages
    const keyframes: number[] = [];
    for (let k = 4; k < TOTAL_FRAMES; k += 4) {
      keyframes.push(k);
    }
    keyframes.push(TOTAL_FRAMES - 1);

    keyframes.forEach((frameIdx) => {
      if (isCancelled || imagesRef.current[frameIdx]) return;
      const img = new Image();
      img.src = getFramePath(frameIdx);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[frameIdx] = img;
        if (Math.abs(currentFrameRef.current - frameIdx) <= 4) {
          drawFrame(currentFrameRef.current, true);
        }
      };
    });

    // 3. Incrementally preload all remaining intermediate frames in small batches
    let batchIndex = 1;
    let batchTimer: NodeJS.Timeout;

    const loadNextBatch = () => {
      if (isCancelled || batchIndex >= TOTAL_FRAMES) return;
      const endBatch = Math.min(batchIndex + 12, TOTAL_FRAMES);
      for (let i = batchIndex; i < endBatch; i++) {
        if (!imagesRef.current[i]) {
          const img = new Image();
          img.src = getFramePath(i);
          img.onload = () => {
            if (isCancelled) return;
            imagesRef.current[i] = img;
            if (Math.abs(currentFrameRef.current - i) <= 2) {
              drawFrame(currentFrameRef.current, true);
            }
          };
        }
      }
      batchIndex = endBatch;
      if (batchIndex < TOTAL_FRAMES) {
        batchTimer = setTimeout(loadNextBatch, 80);
      }
    };

    batchTimer = setTimeout(loadNextBatch, 150);

    return () => {
      isCancelled = true;
      clearTimeout(batchTimer);
    };
  }, [drawFrame, handleResize]);

  // Window resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Continuous Master Scroll Scrubbing (Connects scroll position directly to animation frame)
  useEffect(() => {
    let scrollRafId: number | null = null;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.scrollHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      // When at top: rect.top = 0. As you scroll down: rect.top is negative.
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

      setScrollProgress(progress);
      onScrollProgressChange?.(progress);

      // Map progress smoothly through 302 frames with subtle final-state stabilization hold at [0.94, 1.00]
      const ANIMATION_END = 0.94;
      const animProgress = Math.min(1, progress / ANIMATION_END);
      const targetFrame = Math.round(animProgress * (TOTAL_FRAMES - 1));
      currentFrameRef.current = targetFrame;

      if (scrollRafId === null) {
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = null;
          drawFrame(currentFrameRef.current);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafId !== null) cancelAnimationFrame(scrollRafId);
    };
  }, [drawFrame, onScrollProgressChange]);

  // Jump to specific slide or hero when clicking progress dots
  const jumpToProgress = (targetProgress: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.scrollHeight - window.innerHeight;
    const targetScrollTop = container.offsetTop + targetProgress * totalScrollable;
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });
  };

  // Determine active slide index for progress dots (0 to 3 for slides, 4 for final Hero)
  const activeDotIndex = useMemo(() => {
    if (scrollProgress >= 0.80) return 4; // Final Hero section
    for (let i = 0; i < SLIDES_DATA.length; i++) {
      if (scrollProgress >= SLIDES_DATA[i].start && scrollProgress < SLIDES_DATA[i].end) {
        return i;
      }
    }
    return 0;
  }, [scrollProgress]);

  // Calculate line-by-line staggered entry (0.1s stagger feel) and reversed exit
  const calculateLineStyle = (
    lineIndex: number,
    totalLines: number,
    start: number,
    end: number,
    isSlide1: boolean
  ) => {
    // If completely outside the slide's active window
    if (scrollProgress < start || scrollProgress >= end) {
      return {
        opacity: 0,
        translateY: prefersReducedMotion ? 0 : 20,
      };
    }

    const enterSpan = isSlide1 ? 0.025 : 0.05;
    const exitSpan = 0.05;
    const staggerStep = 0.12;

    // 1. Enter Window: [start, start + enterSpan]
    if (scrollProgress < start + enterSpan && !isSlide1) {
      const enterFraction = clamp01((scrollProgress - start) / enterSpan);
      const lineEnterT = clamp01((enterFraction - lineIndex * staggerStep) / (1 - (totalLines - 1) * staggerStep * 0.7));
      const ease = power2Out(lineEnterT);

      return {
        opacity: ease,
        translateY: prefersReducedMotion ? 0 : 20 * (1 - ease),
      };
    }

    // 2. Exit Window: [end - exitSpan, end]
    if (scrollProgress > end - exitSpan) {
      const exitFraction = clamp01((scrollProgress - (end - exitSpan)) / exitSpan);
      const reversedIndex = totalLines - 1 - lineIndex;
      const lineExitT = clamp01((exitFraction - reversedIndex * staggerStep) / (1 - (totalLines - 1) * staggerStep * 0.7));
      const ease = power2In(lineExitT);

      return {
        opacity: 1 - ease,
        translateY: prefersReducedMotion ? 0 : -20 * ease,
      };
    }

    // 3. Steady State: fully visible
    return {
      opacity: 1,
      translateY: 0,
    };
  };

  // Final Frame: ORIGINAL HERO SECTION reveal (fades in smoothly between 78% and 92%)
  const HERO_REVEAL_START = 0.78;
  const HERO_REVEAL_END = 0.92;
  const heroRevealRaw = clamp01((scrollProgress - HERO_REVEAL_START) / (HERO_REVEAL_END - HERO_REVEAL_START));
  const heroOpacity = power2Out(heroRevealRaw);
  const heroTranslateY = prefersReducedMotion ? 0 : (1 - heroOpacity) * 20; // 20px -> 0px gentle slide up

  const currentStage = useMemo(() => {
    for (let i = 0; i < ELECTRICAL_WORKFLOW_STAGES.length; i++) {
      if (
        scrollProgress >= ELECTRICAL_WORKFLOW_STAGES[i].range[0] &&
        scrollProgress < ELECTRICAL_WORKFLOW_STAGES[i].range[1]
      ) {
        return ELECTRICAL_WORKFLOW_STAGES[i];
      }
    }
    return ELECTRICAL_WORKFLOW_STAGES[ELECTRICAL_WORKFLOW_STAGES.length - 1];
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      id="experience-track"
      data-nav-theme="dark"
      className="relative w-full h-[380vh] bg-[#070D09]"
    >
      {/* Sticky Viewport Container - Pins 100vh canvas while user scrolls 380vh track */}
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between select-none z-10"
        style={{ position: 'sticky', top: 0, height: '100vh', width: '100%' }}
      >
        
        {/* 1. Fullscreen 3D Canvas rendering the 302 frames at maximum crispness */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0 pointer-events-none"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            transform: 'translateZ(0)',
          }}
        />

        {/* 2. Loading Indicator (briefly visible while initializing first frame) */}
        {!isFirstFrameLoaded && (
          <div className="absolute inset-0 z-30 bg-[#070D09] flex flex-col items-center justify-center text-white space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#FFC94D] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#FFC94D]" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-[#EAF6FB]/90 uppercase font-sans">
              Initializing 3D Solar Model...
            </p>
          </div>
        )}

        {/* 3. Subtle Localized Navy Gradient */}
        {/* 3. Subtle Localized Gradients: Horizontal on desktop, soft top-down on mobile for cinematic readability */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 hidden lg:block"
          style={{
            opacity: heroOpacity,
            background:
              'linear-gradient(90deg, rgba(10, 18, 36, 0.65) 0%, rgba(10, 18, 36, 0.30) 35%, rgba(10, 18, 36, 0.05) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 lg:hidden"
          style={{
            opacity: heroOpacity,
            background:
              'linear-gradient(180deg, rgba(7, 13, 9, 0.78) 0%, rgba(7, 13, 9, 0.55) 35%, rgba(7, 13, 9, 0.28) 60%, transparent 84%)',
          }}
        />

        {/* Physical Electrical Workflow HUD Badge (Visible during 0.00 to 0.80) */}
        {scrollProgress < 0.80 && (
          <div className="absolute top-20 sm:top-24 left-4 sm:left-12 z-20 pointer-events-none transition-opacity duration-300">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full py-1 px-3 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#C6F500] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[#C6F500]">
                {currentStage.name}
              </span>
              <span className="text-[10px] text-white/70 hidden md:inline border-l border-white/20 pl-2">
                {currentStage.desc}
              </span>
            </div>
          </div>
        )}

        {/* 4. VIDEO TEXT SLIDES OVERLAY (Slides 1 to 4: 0% to 80% scroll) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {SLIDES_DATA.map((slide) => {
            const isSlideActive = scrollProgress >= slide.start && scrollProgress < slide.end;
            if (!isSlideActive) return null;

            const isSlide1 = slide.id === 1;
            const totalLines = slide.mainLines.length + slide.subLines.length;

            return (
              <div
                key={slide.id}
                className="absolute inset-x-0 flex flex-col items-center md:items-start text-center md:text-left pointer-events-none"
                style={{
                  top: '17vh',
                  paddingLeft: 'clamp(1rem, 8vw, 8vw)',
                  paddingRight: 'clamp(1rem, 8vw, 8vw)',
                  maxHeight: '32vh',
                }}
              >
                {/* Main Lines Container: max 3 words per line, white-space: nowrap, max 88vw on mobile */}
                <div className="flex flex-col items-center md:items-start w-full max-w-[88vw] md:max-w-2xl overflow-visible">
                  {slide.mainLines.map((lineText, lIdx) => {
                    const lineStyle = calculateLineStyle(
                      lIdx,
                      totalLines,
                      slide.start,
                      slide.end,
                      isSlide1
                    );

                    return (
                      <span
                        key={lIdx}
                        className="block font-kalam text-white tracking-[0.01em] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{
                          fontWeight: 400,
                          fontSize: 'clamp(31px, 6.6vw, 62px)',
                          opacity: lineStyle.opacity,
                          transform: `translateY(${lineStyle.translateY}px)`,
                          transition: 'opacity 0.08s ease-out, transform 0.08s ease-out',
                        }}
                      >
                        {lineText}
                      </span>
                    );
                  })}
                </div>

                {/* Sub Lines Container: font-weight 300, 90% opacity, 0.1s stagger */}
                {slide.subLines.length > 0 && (
                  <div className="flex flex-col items-center md:items-start mt-2 md:mt-3 w-full max-w-[88vw] md:max-w-2xl overflow-visible">
                    {slide.subLines.map((subText, sIdx) => {
                      const absoluteLineIndex = slide.mainLines.length + sIdx;
                      const lineStyle = calculateLineStyle(
                        absoluteLineIndex,
                        totalLines,
                        slide.start,
                        slide.end,
                        isSlide1
                      );

                      return (
                        <span
                          key={sIdx}
                          className="block font-kalam tracking-[0.01em] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{
                            fontWeight: 300,
                            color: 'rgba(255, 255, 255, 0.90)',
                            fontSize: 'clamp(15px, 3.9vw, 22px)',
                            opacity: lineStyle.opacity,
                            transform: `translateY(${lineStyle.translateY}px)`,
                            transition: 'opacity 0.08s ease-out, transform 0.08s ease-out',
                          }}
                        >
                          {subText}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Initial Scroll Hint (Fades out cleanly after first scroll) */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/80 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 1 - scrollProgress / 0.04),
            }}
          >
            <span className="font-kalam text-xs tracking-wider uppercase font-light text-white/85">
              Scroll
            </span>
            <ChevronDown className="w-4 h-4 text-white/80 animate-bounce" />
          </div>

          {/* Thin Vertical Progress Dots Indicator (4 video slides + 1 Hero dot) */}
          <div
            className="fixed right-4 md:right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3.5 pointer-events-auto"
            style={{
              opacity: scrollProgress >= 0.98 ? Math.max(0, (1 - scrollProgress) / 0.02) : 1,
              transition: 'opacity 0.2s ease-out',
            }}
          >
            {[0.05, 0.25, 0.45, 0.65, 0.90].map((progTarget, index) => {
              const isActive = index === activeDotIndex;
              return (
                <button
                  key={index}
                  onClick={() => jumpToProgress(progTarget)}
                  className="group p-1 flex items-center justify-center cursor-pointer focus:outline-none"
                  aria-label={`Jump to stage ${index + 1}`}
                  title={index === 4 ? 'Hero Section' : `Slide ${index + 1}`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-[10px] h-[10px] bg-white shadow-[0_0_8px_#ffffff]'
                        : 'w-[6px] h-[6px] bg-white/30 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ORIGINAL HERO SECTION: Mobile-first safe area below navbar, visible headline, compact trust cards, full desktop preservation */}
        <div
          id="hero"
          className="relative z-20 w-full max-w-7xl mx-auto flex-1 h-full flex flex-col justify-start lg:justify-between pt-24 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-10 px-4 sm:px-6 md:px-12 lg:px-16 transition-all duration-300 lg:overflow-visible transform-none lg:[transform:translateY(var(--hero-y))]"
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none',
            '--hero-y': `${heroTranslateY}px`,
          } as React.CSSProperties}
        >
          {/* Main Content Area: Left Typography & Desktop Right Glass Stat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 xl:gap-12 items-start lg:items-end w-full lg:my-auto">
            
            {/* LEFT COLUMN: Eyebrow, Main Headline, Subtitle, CTAs, Mobile Trust Cards */}
            <div className="relative lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-4 md:space-y-5 w-full">

              {/* Trust Badge & Eyebrow (Generous breathing room, clear of navbar) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full py-1 px-2.5 sm:px-3 shadow-md">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="h-2.5 w-px bg-white/30" />
                  <span className="text-white font-semibold text-[10px] sm:text-xs tracking-wide uppercase">
                    25+ YEARS OF SOLAR EXPERIENCE
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#C6F500]">
                  <span>Solar Technologies</span>
                  <span>•</span>
                  <span className="truncate">Ichalkaranji EPC</span>
                </div>
              </div>

              {/* Main Headline (Prominent, bold, commanding scale on mobile, identical desktop preservation) */}
              <h1 className="text-[32px] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[4rem] font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.10] text-balance max-w-[92vw] sm:max-w-xl lg:max-w-none">
                Powering Businesses, <br className="hidden sm:inline" />
                Homes & Industries <span className="font-editorial-italic font-normal text-white">with Solar.</span>
              </h1>

              {/* Subtitle Body Text (Increased readability scale, crisp contrast) */}
              <p className="text-white/90 text-sm sm:text-sm md:text-base lg:text-lg max-w-[92vw] sm:max-w-xl font-normal leading-relaxed text-balance">
                Solar Technologies delivers complete solar solutions across residential, commercial, industrial and institutional applications — from engineering and installation to long-term support.
              </p>

              {/* Primary Action Buttons (Well-proportioned touch targets) */}
              <div className="pt-1 sm:pt-2 flex flex-row flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  onClick={onExploreInnovation}
                  className="group inline-flex items-center gap-1.5 sm:gap-2 bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold text-xs sm:text-sm md:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(198,245,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,0,0.5)] cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Solutions</span>
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
                </button>
                <button
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 py-3 sm:py-3.5 rounded-full border border-white/20 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <span>Solar Calculator</span>
                </button>
              </div>

              {/* Mobile Compact 3-Card Trust Row (Polished glass cards, larger metrics, balanced spacing) */}
              <div className="grid grid-cols-3 gap-2.5 w-full pt-3 lg:hidden">
                {/* Card 1: 25+ */}
                <div className="glass-panel rounded-2xl p-2.5 text-center flex flex-col justify-center min-w-0 border border-white/20 bg-black/35 backdrop-blur-md shadow-xl">
                  <span className="font-telemetry text-lg sm:text-xl font-bold text-white leading-none">
                    25+
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-white/95 font-semibold uppercase tracking-wider leading-tight mt-1.5 truncate">
                    Years Exp
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-white/60 leading-tight mt-0.5 truncate">
                    Solar EPC
                  </span>
                </div>

                {/* Card 2: EPC */}
                <div className="glass-panel rounded-2xl p-2.5 text-center flex flex-col justify-center min-w-0 border border-white/20 bg-black/35 backdrop-blur-md shadow-xl">
                  <span className="font-telemetry text-lg sm:text-xl font-bold text-[#C6F500] leading-none">
                    EPC
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#C6F500] font-semibold uppercase tracking-wider leading-tight mt-1.5 truncate">
                    Turnkey
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-white/60 leading-tight mt-0.5 truncate">
                    End-to-End
                  </span>
                </div>

                {/* Card 3: MSEDCL */}
                <div className="glass-panel rounded-2xl p-2.5 text-center flex flex-col justify-center min-w-0 border border-white/20 bg-black/35 backdrop-blur-md shadow-xl">
                  <span className="font-telemetry text-lg sm:text-xl font-bold text-white leading-none">
                    MSEDCL
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-white/95 font-semibold uppercase tracking-wider leading-tight mt-1.5 truncate">
                    Supervision
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-white/60 leading-tight mt-0.5 truncate">
                    Govt. Lic.
                  </span>
                </div>
              </div>

            </div>

            {/* DESKTOP RIGHT COLUMN: Two Glassmorphism Stat Cards (Preserved exactly for >= lg) */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col items-end justify-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md lg:max-w-xs xl:max-w-sm">
                
                {/* Stat Card 1: 25+ Years of Commitment */}
                <div className="glass-panel rounded-2xl p-3.5 sm:p-4 md:p-5 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-none">
                    25+
                  </span>
                  <div className="mt-2.5 sm:mt-3">
                    <p className="text-[11px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-wider leading-snug">
                      Years of Commitment
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/70 mt-0.5 sm:mt-1 leading-tight">
                      Solar EPC Excellence
                    </p>
                  </div>
                </div>

                {/* Stat Card 2: Turnkey Solutions */}
                <div className="glass-panel rounded-2xl p-3.5 sm:p-4 md:p-5 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight text-[#C6F500] leading-none">
                    EPC
                  </span>
                  <div className="mt-2.5 sm:mt-3">
                    <p className="text-[11px] sm:text-xs md:text-sm font-bold text-white uppercase tracking-wider leading-snug">
                      Turnkey Solutions
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-white/70 mt-0.5 sm:mt-1 leading-tight">
                      Residential • Commercial • Industrial
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* DESKTOP BOTTOM ROW: Verified Company Credentials (Preserved for >= lg screens) */}
          <div className="hidden lg:block pt-3 sm:pt-4 border-t border-white/10 w-full mt-auto">
            <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-8 max-w-3xl ml-auto">
              
              {/* Credential 1 */}
              <div className="flex flex-col items-start text-left">
                <span className="font-telemetry text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none mb-0.5 sm:mb-1">
                  25+ Yrs
                </span>
                <span className="text-[9px] sm:text-xs text-[#C6F500] font-semibold uppercase tracking-wider truncate w-full">
                  Solar Experience
                </span>
                <span className="text-[8px] sm:text-[11px] text-white/70 font-normal leading-tight mt-0.5 hidden xs:block">
                  Decades of proven engineering & reliability
                </span>
              </div>

              {/* Credential 2 */}
              <div className="flex flex-col items-start text-left">
                <span className="font-telemetry text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none mb-0.5 sm:mb-1">
                  MSEDCL
                </span>
                <span className="text-[9px] sm:text-xs text-[#C6F500] font-semibold uppercase tracking-wider truncate w-full">
                  Supervision & Contracting
                </span>
                <span className="text-[8px] sm:text-[11px] text-white/70 font-normal leading-tight mt-0.5 hidden xs:block">
                  In-house Govt. Licensed Contractor
                </span>
              </div>

              {/* Credential 3 */}
              <div className="flex flex-col items-start text-left">
                <span className="font-telemetry text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-none mb-0.5 sm:mb-1">
                  Turnkey
                </span>
                <span className="text-[9px] sm:text-xs text-[#C6F500] font-semibold uppercase tracking-wider truncate w-full">
                  End-to-End Execution
                </span>
                <span className="text-[8px] sm:text-[11px] text-white/70 font-normal leading-tight mt-0.5 hidden xs:block">
                  Concept, design, commissioning & O&M
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
