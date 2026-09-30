import React, { useEffect, useRef } from 'react';

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
  duration?: number; // In seconds, defaults to 2.5s
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
  onComplete?: () => void;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 2.5,
  className = '',
  style,
  as: Component = 'span',
  onComplete,
}) => {
  const spanRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);
  const currentValRef = useRef<number>(0);
  const targetValRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  const parsed = parseMetric(value);
  targetValRef.current = parsed.targetNum;

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !parsed.isValid) return;

    // If it already animated once and value updates dynamically (e.g. calculator change):
    if (hasAnimatedRef.current) {
      const startVal = currentValRef.current;
      const endVal = parsed.targetNum;
      if (Math.abs(startVal - endVal) < 0.001) return;

      const dynamicDuration = 800; // 0.8s responsive transition on live interaction
      const startTime = performance.now();

      const animateUpdate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / dynamicDuration);
        // Smooth ease-out cubic
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

    // Initial Viewport Entry Setup: Start from 0 with matching format
    const initialText = formatMetricNumber(
      0,
      parsed.prefix,
      parsed.suffix,
      parsed.decimals,
      parsed.hasIndianComma
    );
    el.textContent = initialText;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            observer.disconnect();

            const startTime = performance.now();
            const totalDurationMs = duration * 1000;
            const target = parsed.targetNum;

            const animateEntry = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(1, elapsed / totalDurationMs);
              // Calm, technical easeOutQuart curve (2.5s smooth deceleration)
              const ease = 1 - Math.pow(1 - progress, 4);
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
                animFrameIdRef.current = requestAnimationFrame(animateEntry);
              } else {
                // Settle on exact raw value
                el.textContent = String(value);
                currentValRef.current = target;
                onComplete?.();
              }
            };

            animFrameIdRef.current = requestAnimationFrame(animateEntry);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [value, duration, parsed.isValid, parsed.prefix, parsed.suffix, parsed.decimals, parsed.hasIndianComma]);

  return (
    <Component
      ref={spanRef as any}
      className={className}
      style={style}
      data-countup-applied="true"
    >
      {String(value)}
    </Component>
  );
};
