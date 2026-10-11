import React, { useEffect, useRef, memo } from 'react';

export interface ParsedMetric {
  prefix: string;
  targetNum: number;
  suffix: string;
  decimals: number;
  hasIndianComma: boolean;
  isValid: boolean;
}

/**
 * Intelligent parser that extracts prefix, numerical value, decimals,
 * Indian comma conventions, and suffix units from any metric string.
 */
export function parseMetric(raw: string | number): ParsedMetric {
  if (typeof raw === 'number') {
    const isFloat = raw % 1 !== 0;
    return {
      prefix: '',
      targetNum: raw,
      suffix: '',
      decimals: isFloat ? 1 : 0,
      hasIndianComma: raw >= 1000,
      isValid: true,
    };
  }

  const str = String(raw).trim();
  // Regex to match: [prefix][digits, with optional commas and dot][suffix]
  const match = str.match(/^([^\d.-]*?)(-?\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      prefix: '',
      targetNum: 0,
      suffix: str,
      decimals: 0,
      hasIndianComma: false,
      isValid: false,
    };
  }

  const prefix = match[1] || '';
  const numRaw = match[2] || '0';
  const suffix = match[3] || '';

  const hasIndianComma = numRaw.includes(',');
  const cleanNum = numRaw.replace(/,/g, '');
  const targetNum = parseFloat(cleanNum);

  let decimals = 0;
  if (cleanNum.includes('.')) {
    decimals = cleanNum.split('.')[1].length;
  }

  return {
    prefix,
    targetNum: isNaN(targetNum) ? 0 : targetNum,
    suffix,
    decimals,
    hasIndianComma,
    isValid: !isNaN(targetNum),
  };
}

/**
 * Format a number with Indian comma grouping (en-IN) and preserve decimals.
 */
export function formatMetricNumber(
  val: number,
  prefix: string,
  suffix: string,
  decimals: number,
  hasIndianComma: boolean
): string {
  let formattedNumber: string;

  if (hasIndianComma) {
    formattedNumber = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  } else if (decimals > 0) {
    formattedNumber = val.toFixed(decimals);
  } else {
    formattedNumber = Math.round(val).toString();
  }

  return `${prefix}${formattedNumber}${suffix}`;
}

export interface CountUpNumberProps {
  value: string | number;
  duration?: number; // In seconds, minimum 1 to 2 seconds (defaults to 1.8s)
  delay?: number; // In seconds, optional start delay
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  trigger?: boolean; // When provided, starts counting when true
  onComplete?: () => void;
}

export const CountUpNumberComponent: React.FC<CountUpNumberProps> = ({
  value,
  duration = 1.8,
  delay = 0,
  className = '',
  style,
  as: Component = 'span',
  trigger,
  onComplete,
}) => {
  const spanRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const isAnimatingRef = useRef<boolean>(false);
  const currentValRef = useRef<number>(0);
  const targetValRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<any>(null);

  const parsed = parseMetric(value);
  targetValRef.current = parsed.targetNum;

  // Enforce minimum animation duration of 1 to 2 seconds (clamped to 1.5s - 2.0s)
  const effectiveDuration = Math.max(1.5, Math.min(2.0, duration || 1.8));

  // Function to run the count-up animation
  const startCountUp = (target: number, animDurationSec: number) => {
    const el = spanRef.current;
    if (!el || !parsed.isValid) return;

    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const execute = () => {
      const startTime = performance.now();
      const totalDurationMs = animDurationSec * 1000;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / totalDurationMs);

        // Smooth pacing curve:
        // For small numbers (target <= 20 such as 7+, 15+), use power 1.8 so every
        // integer increment is evenly spaced throughout the full 1.5 - 2.0s duration.
        // For larger numbers (such as 400+, 500+), use power 2.4 for fluid deceleration.
        const ease = target <= 20
          ? 1 - Math.pow(1 - progress, 1.8)
          : 1 - Math.pow(1 - progress, 2.4);

        const current = target * ease;
        currentValRef.current = current;

        el.textContent = formatMetricNumber(
          current,
          parsed.prefix,
          parsed.suffix,
          parsed.decimals,
          parsed.hasIndianComma
        );

        if (progress < 1) {
          animFrameIdRef.current = requestAnimationFrame(animate);
        } else {
          el.textContent = String(value);
          currentValRef.current = target;
          hasAnimatedRef.current = true;
          isAnimatingRef.current = false;
          onComplete?.();
        }
      };

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    if (delay > 0) {
      timeoutIdRef.current = setTimeout(execute, delay * 1000);
    } else {
      execute();
    }
  };

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !parsed.isValid) return;

    // Handle interactive dynamic value changes (e.g. calculator slider moving)
    if (hasAnimatedRef.current) {
      const startVal = currentValRef.current;
      const endVal = parsed.targetNum;
      if (Math.abs(startVal - endVal) < 0.001) return;

      const dynamicDuration = 600; // 0.6s snappy response on live calculation
      const startTime = performance.now();

      const animateUpdate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / dynamicDuration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startVal + (endVal - startVal) * ease;
        currentValRef.current = current;

        el.textContent = formatMetricNumber(
          current,
          parsed.prefix,
          parsed.suffix,
          parsed.decimals,
          parsed.hasIndianComma
        );

        if (progress < 1) {
          animFrameIdRef.current = requestAnimationFrame(animateUpdate);
        } else {
          el.textContent = String(value);
          currentValRef.current = endVal;
        }
      };

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(animateUpdate);
      return;
    }

    // Set initial 0 text before animating
    if (!hasAnimatedRef.current && !isAnimatingRef.current) {
      el.textContent = formatMetricNumber(
        0,
        parsed.prefix,
        parsed.suffix,
        parsed.decimals,
        parsed.hasIndianComma
      );
    }

    // MODE 1: Explicit trigger passed (e.g., hero scroll visibility)
    if (trigger !== undefined) {
      if (trigger && !hasAnimatedRef.current && !isAnimatingRef.current) {
        startCountUp(parsed.targetNum, effectiveDuration);
      }
      return;
    }

    // MODE 2: Standard Viewport Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current && !isAnimatingRef.current) {
            observer.disconnect();
            startCountUp(parsed.targetNum, effectiveDuration);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -10px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [
    trigger,
    value,
    duration,
    delay,
    parsed.isValid,
    parsed.targetNum,
    parsed.prefix,
    parsed.suffix,
    parsed.decimals,
    parsed.hasIndianComma,
  ]);

  return (
    <Component
      ref={spanRef as any}
      className={className}
      style={style}
      data-countup-applied="true"
    >
      {formatMetricNumber(
        0,
        parsed.prefix,
        parsed.suffix,
        parsed.decimals,
        parsed.hasIndianComma
      )}
    </Component>
  );
};

export const CountUpNumber = memo(CountUpNumberComponent);
