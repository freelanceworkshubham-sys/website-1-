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

  // Draw a specific frame onto the canvas (optimized to skip redundant redraws)
  const drawFrame = useCallback((frameIndex: number, forceRedraw = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    lastDrawnFrameRef.current = clampedIndex;
  }, []);

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

  // Load all 302 frames in parallel on mount
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
      drawFrame(0);
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
  }, [drawFrame, handleResize]);

  // Window resize listener
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Track scroll position across the 380vh track
  useEffect(() => {
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

      const targetFrame = Math.round(progress * (TOTAL_FRAMES - 1));
      currentFrameRef.current = targetFrame;
      drawFrame(targetFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Final Frame: ORIGINAL HERO SECTION reveal (fades in smoothly at 80% - 100%)
  const HERO_REVEAL_START = 0.80;
  const heroOpacity = Math.max(0, Math.min(1, (scrollProgress - HERO_REVEAL_START) / (1 - HERO_REVEAL_START)));
  const heroTranslateY = (1 - heroOpacity) * 35; // 35px -> 0px slide up

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

        {/* 3. Subtle Localized Navy Gradient (Only on left behind text for legibility; center & right 3D scene stays bright & crisp) */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-10"
          style={{
            opacity: heroOpacity,
            background:
              'linear-gradient(90deg, rgba(10, 18, 36, 0.65) 0%, rgba(10, 18, 36, 0.30) 35%, rgba(10, 18, 36, 0.05) 55%, transparent 75%)',
          }}
        />

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
          <div className="fixed right-4 md:right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3.5 pointer-events-auto">
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

        {/* 5. ORIGINAL HERO SECTION (from folder 3, unedited structure, horizontal line removed) */}
        <div
          id="hero"
          className="relative z-20 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-end pt-28 md:pt-36 pb-8 md:pb-12 px-6 md:px-12 lg:px-16 transition-all duration-300"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none',
          }}
        >
          {/* Main Content Area: Left Typography & Right Glass Stat Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-10 md:mb-14">
            
            {/* LEFT COLUMN: Social Proof Capsule, Headline, Subtitle, CTA */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Social Proof Pill (100% matched to image) */}
              <div className="inline-flex items-center gap-3 bg-black/45 backdrop-blur-md border border-white/20 rounded-full py-1 px-1.5 pr-4 shadow-xl">
                {/* Stacked User Avatars + Lime Plus Badge */}
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="Customer avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="Customer avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="Customer avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border-2 border-black/40"
                  />
                  {/* Neon Lime Plus Button */}
                  <div className="w-7 h-7 rounded-full bg-[#C6F500] text-black font-bold text-xs flex items-center justify-center border-2 border-black/40 shadow-sm z-10">
                    +
                  </div>
                </div>

                {/* Five Star Rating & 90k+ Users Worldwide */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-white/90 font-medium tracking-tight whitespace-nowrap">
                    90k+ Users Worldwide
                  </span>
                </div>
              </div>

              {/* Main Headline (Exact Typography & Line Breaks from Reference) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
                Next-Generation <br />
                Solar Energy <span className="font-editorial-italic font-normal text-white">Solutions</span>
              </h1>

              {/* Subtitle Body Text */}
              <p className="text-white/85 text-base sm:text-lg max-w-xl font-normal leading-relaxed text-balance">
                Delivering reliable, eco-friendly solar solutions designed to reduce energy costs while minimizing environmental impact.
              </p>

              {/* Primary Action Button (Neon Lime Pill with Lightning Bolt) */}
              <div className="pt-2">
                <button
                  onClick={onExploreInnovation}
                  className="group inline-flex items-center gap-2.5 bg-[#C6F500] hover:bg-[#b8e500] active:scale-95 text-black font-bold text-sm md:text-base px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(198,245,0,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(198,245,0,0.5)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Explore Innovation</span>
                  <Zap className="w-4 h-4 fill-black text-black group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Two Glassmorphism Stat Cards */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-start lg:items-end justify-end">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
                
                {/* Stat Card 1: 35% Reduced Carbon Footprint */}
                <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                    35%
                  </span>
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                    Reduced Carbon Footprint
                  </p>
                </div>

                {/* Stat Card 2: 25% Reduced Electricity Footprint */}
                <div className="glass-panel rounded-2xl p-5 md:p-6 text-white shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                  <span className="font-telemetry text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                    25%
                  </span>
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-snug mt-4">
                    Reduced Electricity Footprint
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Award Laurels & Multipliers (Horizontal line removed) */}
          <div className="pt-6 mt-4">
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl ml-auto">
              
              {/* Laurel 1: 7.9X GreenTech Award 2023 */}
              <div className="flex flex-col items-center text-center">
                <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                  7.9X
                </span>
                
                {/* Laurel Wreath Graphic with Leader Badge */}
                <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                  <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                    <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                    <path d="M22,24 C16,20 12,24 16,30" />
                    <path d="M26,36 C20,34 18,40 22,44" />
                    <path d="M35,46 C30,46 30,52 35,53" />
                    <path d="M20,14 C16,10 22,8 26,12" />

                    <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                    <path d="M78,24 C84,20 88,24 84,30" />
                    <path d="M74,36 C80,34 82,40 78,44" />
                    <path d="M65,46 C70,46 70,52 65,53" />
                    <path d="M80,14 C84,10 78,8 74,12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                      Leader
                    </span>
                    <span className="text-[7px] text-white/60 leading-none mt-0.5">
                      Verified
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                  GreenTech Innovation Award 2023
                </span>
              </div>

              {/* Laurel 2: 5X GreenTech Award 2024 */}
              <div className="flex flex-col items-center text-center">
                <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                  5X
                </span>
                
                {/* Laurel Wreath Graphic with Leader Badge */}
                <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                  <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                    <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                    <path d="M22,24 C16,20 12,24 16,30" />
                    <path d="M26,36 C20,34 18,40 22,44" />
                    <path d="M35,46 C30,46 30,52 35,53" />
                    <path d="M20,14 C16,10 22,8 26,12" />

                    <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                    <path d="M78,24 C84,20 88,24 84,30" />
                    <path d="M74,36 C80,34 82,40 78,44" />
                    <path d="M65,46 C70,46 70,52 65,53" />
                    <path d="M80,14 C84,10 78,8 74,12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                      Leader
                    </span>
                    <span className="text-[7px] text-white/60 leading-none mt-0.5">
                      Verified
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                  GreenTech Innovation Award 2024
                </span>
              </div>

              {/* Laurel 3: 1.2X GreenTech Award 2025 */}
              <div className="flex flex-col items-center text-center">
                <span className="font-telemetry text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none mb-2">
                  1.2X
                </span>
                
                {/* Laurel Wreath Graphic with Leader Badge */}
                <div className="relative w-16 h-12 flex items-center justify-center my-1 text-white/90">
                  <svg viewBox="0 0 100 60" className="w-full h-full stroke-current fill-none stroke-[2]">
                    <path d="M48,52 C32,50 20,40 18,22 C18,12 24,4 32,2" strokeLinecap="round" />
                    <path d="M22,24 C16,20 12,24 16,30" />
                    <path d="M26,36 C20,34 18,40 22,44" />
                    <path d="M35,46 C30,46 30,52 35,53" />
                    <path d="M20,14 C16,10 22,8 26,12" />

                    <path d="M52,52 C68,50 80,40 82,22 C82,12 76,4 68,2" strokeLinecap="round" />
                    <path d="M78,24 C84,20 88,24 84,30" />
                    <path d="M74,36 C80,34 82,40 78,44" />
                    <path d="M65,46 C70,46 70,52 65,53" />
                    <path d="M80,14 C84,10 78,8 74,12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#C6F500] leading-none">
                      Leader
                    </span>
                    <span className="text-[7px] text-white/60 leading-none mt-0.5">
                      Verified
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-xs text-white/70 font-medium leading-tight mt-1">
                  GreenTech Innovation Award 2025
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
