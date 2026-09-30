import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Zap, Star, Sparkles, ChevronDown } from 'lucide-react';

// =========================================================================
// SLIDE TEXT CONFIGURATION
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
    mainLines: ['Every night,', 'your roof waits.'],
    subLines: ['Silent. Unused. Ready.'],
  },
  {
    id: 2,
    start: 0.20,
    end: 0.40,
    mainLines: ['Then the sun', 'rises.'],
    subLines: ['Free energy,', 'every single day.'],
  },
  {
    id: 3,
    start: 0.40,
    end: 0.60,
    mainLines: ['Your panels', 'wake up.'],
    subLines: ['Sunlight becomes power', 'for your home.'],
  },
  {
    id: 4,
    start: 0.60,
    end: 0.80,
    mainLines: ['Your home runs', 'on its own', 'light.'],
    subLines: ['Lower bills for', 'the next 25 years.'],
  },
];

interface SolarHero3DExperienceProps {
  onExploreInnovation?: () => void;
  onOpenCalculator?: () => void;
  onOpenQuote?: () => void;
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

export const SolarHero3DExperience: React.FC<SolarHero3DExperienceProps> = ({
  onExploreInnovation,
  onOpenCalculator,
  onOpenQuote,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Cached HTMLImageElement array for 302 frames
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState<boolean>(false);

  // Performance & Scroll Refs (NO React re-renders during continuous scrolling)
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const isAnimatingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Slide DOM refs for direct transform manipulation
  const slideContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const slideLineRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []]);

  // Hero section and overlay DOM refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Active Dot index (only updates state when active index transitions 0..4)
  const [activeDotIndex, setActiveDotIndex] = useState<number>(0);
  const activeDotIndexRef = useRef<number>(0);

  // User preference for reduced motion
  const prefersReducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = mediaQuery.matches;
      const listener = (e: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = e.matches;
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Calculate line-by-line staggered entry and reversed exit
  const calculateLineStyle = useCallback(
    (
      lineIndex: number,
      totalLines: number,
      start: number,
      end: number,
      isSlide1: boolean,
      progress: number
    ) => {
      const reduced = prefersReducedMotionRef.current;
      if (progress < start || progress >= end) {
        return { opacity: 0, translateY: reduced ? 0 : 20 };
      }

      const enterSpan = isSlide1 ? 0.025 : 0.05;
      const exitSpan = 0.05;
      const staggerStep = 0.12;

      // 1. Enter Window: [start, start + enterSpan]
      if (progress < start + enterSpan && !isSlide1) {
        const enterFraction = clamp01((progress - start) / enterSpan);
        const lineEnterT = clamp01(
          (enterFraction - lineIndex * staggerStep) / (1 - (totalLines - 1) * staggerStep * 0.7)
        );
        const ease = power2Out(lineEnterT);

        return {
          opacity: ease,
          translateY: reduced ? 0 : 20 * (1 - ease),
        };
      }

      // 2. Exit Window: [end - exitSpan, end]
      if (progress > end - exitSpan) {
        const exitFraction = clamp01((progress - (end - exitSpan)) / exitSpan);
        const reversedIndex = totalLines - 1 - lineIndex;
        const lineExitT = clamp01(
          (exitFraction - reversedIndex * staggerStep) / (1 - (totalLines - 1) * staggerStep * 0.7)
        );
        const ease = power2In(lineExitT);

        return {
          opacity: 1 - ease,
          translateY: reduced ? 0 : -20 * ease,
        };
      }

      // 3. Steady State: fully visible
      return {
        opacity: 1,
        translateY: 0,
      };
    },
    []
  );

  // Direct DOM updates for slide lines (0 React re-renders)
  const updateSlidesDOM = useCallback(
    (progress: number) => {
      for (let s = 0; s < SLIDES_DATA.length; s++) {
        const slide = SLIDES_DATA[s];
        const container = slideContainersRef.current[s];
        if (!container) continue;

        const isSlideActive = progress >= slide.start && progress < slide.end;

        if (!isSlideActive) {
          if (container.style.display !== 'none') {
            container.style.display = 'none';
            container.style.opacity = '0';
          }
          continue;
        }

        if (container.style.display !== 'flex') {
          container.style.display = 'flex';
          container.style.opacity = '1';
        }

        const isSlide1 = slide.id === 1;
        const totalLines = slide.mainLines.length + slide.subLines.length;
        const lines = slideLineRefs.current[s];

        for (let l = 0; l < totalLines; l++) {
          const lineEl = lines[l];
          if (!lineEl) continue;

          const style = calculateLineStyle(
            l,
            totalLines,
            slide.start,
            slide.end,
            isSlide1,
            progress
          );
          lineEl.style.opacity = style.opacity.toFixed(3);
          lineEl.style.transform = `translate3d(0, ${style.translateY.toFixed(1)}px, 0)`;
        }
      }
    },
    [calculateLineStyle]
  );

  // Direct DOM updates for Hero content & overlays
  const updateHeroDOM = useCallback((progress: number) => {
    const HERO_REVEAL_START = 0.8;
    const heroOpacity = Math.max(0, Math.min(1, (progress - HERO_REVEAL_START) / (1 - HERO_REVEAL_START)));
    const heroTranslateY = (1 - heroOpacity) * 35;

    const heroEl = heroSectionRef.current;
    if (heroEl) {
      heroEl.style.opacity = heroOpacity.toFixed(3);
      heroEl.style.transform = `translate3d(0, ${heroTranslateY.toFixed(1)}px, 0)`;
      heroEl.style.pointerEvents = heroOpacity > 0.4 ? 'auto' : 'none';
    }

    if (gradientRef.current) {
      gradientRef.current.style.opacity = heroOpacity.toFixed(3);
    }

    if (scrollHintRef.current) {
      const hintOpacity = Math.max(0, 1 - progress / 0.04);
      scrollHintRef.current.style.opacity = hintOpacity.toFixed(3);
    }
  }, []);

  // Update active dot index only when crossing discrete section thresholds
  const updateDots = useCallback((progress: number) => {
    let nextIndex = 0;
    if (progress >= 0.8) {
      nextIndex = 4;
    } else {
      for (let i = 0; i < SLIDES_DATA.length; i++) {
        if (progress >= SLIDES_DATA[i].start && progress < SLIDES_DATA[i].end) {
          nextIndex = i;
          break;
        }
      }
    }
    if (nextIndex !== activeDotIndexRef.current) {
      activeDotIndexRef.current = nextIndex;
      setActiveDotIndex(nextIndex);
    }
  }, []);

  // Draw a specific frame onto the canvas (optimized to skip redundant redraws)
  const drawFrame = useCallback((frameIndex: number, forceRedraw = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    if (!forceRedraw && lastDrawnFrameRef.current === clampedIndex) return;

    let img = imagesRef.current[clampedIndex];

    // Fallback: if requested frame is not yet fully loaded, find nearest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
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

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

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

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    lastDrawnFrameRef.current = clampedIndex;
  }, []);

  // Resize canvas according to viewport and DPR
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const maxDpr = isMobile ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

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

  // Single unified render loop with buttery 60fps lerp damping
  const renderLoop = useCallback(() => {
    const target = targetProgressRef.current;
    let current = smoothProgressRef.current;
    const diff = target - current;

    if (prefersReducedMotionRef.current) {
      current = target;
    } else if (Math.abs(diff) > 0.0001) {
      // 0.18 lerp factor: silky smooth, responsive, zero jitter or sluggish delay
      current += diff * 0.18;
    } else {
      current = target;
    }

    smoothProgressRef.current = current;

    // 1. Draw canvas frame
    const targetFrame = Math.max(
      0,
      Math.min(TOTAL_FRAMES - 1, Math.round(current * (TOTAL_FRAMES - 1)))
    );
    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);
    }

    // 2. Direct DOM update for text slides
    updateSlidesDOM(current);

    // 3. Direct DOM update for Hero overlay and hint
    updateHeroDOM(current);

    // 4. Update discrete active dot
    updateDots(current);

    // Continue loop until settled within tolerance
    if (Math.abs(target - current) > 0.0001) {
      rafIdRef.current = requestAnimationFrame(renderLoop);
    } else {
      isAnimatingRef.current = false;
      rafIdRef.current = null;
    }
  }, [drawFrame, updateSlidesDOM, updateHeroDOM, updateDots]);

  // Read scroll progress from the 380vh track and wake up RAF loop
  const updateTargetProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.scrollHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    const rect = container.getBoundingClientRect();
    const currentScroll = -rect.top;
    const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
    targetProgressRef.current = progress;

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [renderLoop]);

  // Parallel preloading of 302 frames on mount
  useEffect(() => {
    let isCancelled = false;

    // First load frame 0 to immediately display the night scene
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      setIsFirstFrameLoaded(true);
      handleResize();
      drawFrame(0, true);
      // Initialize DOM overlays at progress 0
      updateSlidesDOM(0);
      updateHeroDOM(0);
      updateDots(0);
    };

    // Concurrently preload all remaining frames
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[i] = img;
      };
      img.onerror = () => {
        setTimeout(() => {
          if (!isCancelled && !imagesRef.current[i]) {
            const retryImg = new Image();
            retryImg.src = getFramePath(i);
            retryImg.onload = () => {
              if (!isCancelled) {
                imagesRef.current[i] = retryImg;
              }
            };
          }
        }, 400);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [drawFrame, handleResize, updateSlidesDOM, updateHeroDOM, updateDots]);

  // Scroll and Resize listeners with automatic cleanup
  useEffect(() => {
    const onScrollOrResize = () => {
      updateTargetProgress();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
    updateTargetProgress();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [updateTargetProgress, handleResize]);

  // Smooth jump to specific slide or hero when clicking progress dots
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
        style={{ position: 'sticky', top: 0 }}
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
        <div
          ref={gradientRef}
          className="absolute inset-0 pointer-events-none z-10 will-change-[opacity]"
          style={{
            opacity: 0,
            background:
              'linear-gradient(90deg, rgba(10, 18, 36, 0.65) 0%, rgba(10, 18, 36, 0.30) 35%, rgba(10, 18, 36, 0.05) 55%, transparent 75%)',
          }}
        />

        {/* 4. VIDEO TEXT SLIDES OVERLAY (Slides 1 to 4: 0% to 80% scroll) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {SLIDES_DATA.map((slide, sIdx) => (
            <div
              key={slide.id}
              ref={(el) => {
                slideContainersRef.current[sIdx] = el;
              }}
              className="absolute inset-x-0 flex flex-col items-center md:items-start text-center md:text-left pointer-events-none"
              style={{
                top: '17vh',
                paddingLeft: 'clamp(1rem, 8vw, 8vw)',
                paddingRight: 'clamp(1rem, 8vw, 8vw)',
                maxHeight: '32vh',
                display: sIdx === 0 ? 'flex' : 'none',
                opacity: sIdx === 0 ? 1 : 0,
              }}
            >
              {/* Main Lines Container */}
              <div className="flex flex-col items-center md:items-start w-full max-w-[88vw] md:max-w-2xl overflow-visible">
                {slide.mainLines.map((lineText, lIdx) => (
                  <span
                    key={lIdx}
                    ref={(el) => {
                      if (!slideLineRefs.current[sIdx]) slideLineRefs.current[sIdx] = [];
                      slideLineRefs.current[sIdx][lIdx] = el;
                    }}
                    className="block font-kalam text-white tracking-[0.01em] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis will-change-[transform,opacity]"
                    style={{
                      fontWeight: 400,
                      fontSize: 'clamp(31px, 6.6vw, 62px)',
                      opacity: sIdx === 0 ? 1 : 0,
                      transform: 'translate3d(0, 0, 0)',
                    }}
                  >
                    {lineText}
                  </span>
                ))}
              </div>

              {/* Sub Lines Container */}
              {slide.subLines.length > 0 && (
                <div className="flex flex-col items-center md:items-start mt-2 md:mt-3 w-full max-w-[88vw] md:max-w-2xl overflow-visible">
                  {slide.subLines.map((subText, subIdx) => {
                    const absoluteLineIndex = slide.mainLines.length + subIdx;
                    return (
                      <span
                        key={subIdx}
                        ref={(el) => {
                          if (!slideLineRefs.current[sIdx]) slideLineRefs.current[sIdx] = [];
                          slideLineRefs.current[sIdx][absoluteLineIndex] = el;
                        }}
                        className="block font-kalam tracking-[0.01em] leading-[1.3] whitespace-nowrap overflow-hidden text-ellipsis will-change-[transform,opacity]"
                        style={{
                          fontWeight: 300,
                          color: 'rgba(255, 255, 255, 0.90)',
                          fontSize: 'clamp(15px, 3.9vw, 22px)',
                          opacity: sIdx === 0 ? 1 : 0,
                          transform: 'translate3d(0, 0, 0)',
                        }}
                      >
                        {subText}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Initial Scroll Hint (Fades out cleanly after first scroll) */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/80 pointer-events-none will-change-[opacity]"
            style={{
              opacity: 1,
            }}
          >
            <span className="font-kalam text-xs tracking-wider uppercase font-light text-white/85">
              Scroll
            </span>
            <ChevronDown className="w-4 h-4 text-white/80 animate-bounce" />
          </div>

          {/* Thin Vertical Progress Dots Indicator (4 video slides + 1 Hero dot) */}
          <div className="fixed right-4 md:right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3.5 pointer-events-auto">
            {[0.05, 0.25, 0.45, 0.65, 0.9].map((progTarget, index) => {
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

        {/* 5. ORIGINAL HERO SECTION (Reveals at 80% - 100% of 380vh scroll track) */}
        <div
          id="hero"
          ref={heroSectionRef}
          className="relative z-20 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-end pt-28 md:pt-36 pb-8 md:pb-12 px-6 md:px-12 lg:px-16 will-change-[transform,opacity]"
          style={{
            opacity: 0,
            transform: 'translate3d(0, 35px, 0)',
            pointerEvents: 'none',
          }}
        >
          {/* Main Content Area: Left Typography & Right Glass Stat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 md:mb-14">
            {/* LEFT COLUMN: Social Proof Capsule, Headline, Subtitle, CTA */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Social Proof Pill / Verified Trust Badge */}
              <div className="inline-flex items-center gap-2.5 sm:gap-3 bg-black/45 backdrop-blur-md border border-white/20 rounded-full py-1 px-2 sm:px-3 shadow-xl">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="h-3 w-px bg-white/30" />
                <span className="text-white font-semibold text-xs tracking-wide uppercase">
                  25+ YEARS OF SOLAR EXPERIENCE
                </span>
              </div>

              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#C6F500]">
                <span>Solar Technologies</span>
                <span>•</span>
                <span>Ichalkaranji's Established Solar EPC Partner</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                Powering Businesses, <br />
                Homes & Industries <span className="font-editorial-italic font-normal text-white">with Solar.</span>
              </h1>

              {/* Subtitle Body Text */}
              <p className="text-white/85 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
                Solar Technologies delivers complete solar solutions across residential, commercial, industrial and institutional applications — from engineering and installation to long-term support.
              </p>

              {/* Primary Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreInnovation}
                  className="group inline-flex items-center gap-2.5 bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold text-sm md:text-base px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(198,245,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore Solutions</span>
                  <Zap className="w-4 h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
                </button>
                <button
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm md:text-base px-6 py-3.5 rounded-full border border-white/20 transition-all duration-200 cursor-pointer"
                >
                  <span>Solar Calculator</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Two Glassmorphism Stat Cards */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end justify-end">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
                {/* Stat Card 1: 25+ Years of Commitment */}
                <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                    25+
                  </span>
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Years of Commitment
                    </p>
                    <p className="text-[11px] text-white/70 mt-1">
                      Solar EPC Excellence
                    </p>
                  </div>
                </div>

                {/* Stat Card 2: Turnkey Solutions */}
                <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-[#C6F500] leading-none">
                    EPC
                  </span>
                  <div className="mt-4">
                    <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Turnkey Solutions
                    </p>
                    <p className="text-[11px] text-white/70 mt-1">
                      Residential • Commercial • Industrial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Verified Company Credentials */}
          <div className="pt-6 mt-4 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-3xl ml-auto">
              {/* Credential 1 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-telemetry text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1">
                  25+ Yrs
                </span>
                <span className="text-xs text-[#C6F500] font-semibold uppercase tracking-wider">
                  Solar Experience
                </span>
                <span className="text-[11px] text-white/70 font-normal leading-tight mt-0.5">
                  Decades of proven engineering & reliability
                </span>
              </div>

              {/* Credential 2 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-telemetry text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1">
                  MSEDCL
                </span>
                <span className="text-xs text-[#C6F500] font-semibold uppercase tracking-wider">
                  Supervision & Contracting
                </span>
                <span className="text-[11px] text-white/70 font-normal leading-tight mt-0.5">
                  In-house Govt. Licensed Contractor
                </span>
              </div>

              {/* Credential 3 */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="font-telemetry text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none mb-1">
                  Turnkey
                </span>
                <span className="text-xs text-[#C6F500] font-semibold uppercase tracking-wider">
                  End-to-End Execution
                </span>
                <span className="text-[11px] text-white/70 font-normal leading-tight mt-0.5">
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
