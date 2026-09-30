import { parseMetric, formatMetricNumber } from '../components/CountUpNumber';

/**
 * Global observer that attaches to numerical metric elements on the page.
 * Uses requestAnimationFrame and direct DOM updates for 60fps performance with 0 React overhead.
 */
export function initGlobalCountUpObserver(): () => void {
  if (typeof window === 'undefined') return () => {};

  const animatedElements = new WeakSet<Element>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (!entry.isIntersecting || animatedElements.has(el)) return;

        // Mark as animated so it only runs once per element
        animatedElements.add(el);
        observer.unobserve(el);

        const rawText = el.getAttribute('data-countup-target') || el.textContent || '';
        const parsed = parseMetric(rawText);
        if (!parsed.isValid || parsed.targetNum === 0) return;

        const totalDurationMs = 4500; // 4.5 seconds
        const startTime = performance.now();
        const target = parsed.targetNum;

        // Set initial 0
        el.textContent = formatMetricNumber(
          0,
          parsed.prefix,
          parsed.suffix,
          parsed.decimals,
          parsed.hasIndianComma
        );

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / totalDurationMs);
          // Calm, technical easeOutQuart
          const ease = 1 - Math.pow(1 - progress, 4);
          const current = target * ease;

          el.textContent = formatMetricNumber(
            current,
            parsed.prefix,
            parsed.suffix,
            parsed.decimals,
            parsed.hasIndianComma
          );

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = rawText;
          }
        };

        requestAnimationFrame(animate);
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  const observeElements = () => {
    // Select elements explicitly marked with data-countup="true" or .count-up-metric
    const elements = document.querySelectorAll<HTMLElement>(
      '[data-countup="true"]:not([data-countup-applied="true"])'
    );
    elements.forEach((el) => {
      if (!animatedElements.has(el)) {
        if (!el.getAttribute('data-countup-target')) {
          el.setAttribute('data-countup-target', el.textContent || '');
        }
        observer.observe(el);
      }
    });
  };

  observeElements();

  // Periodic check or DOM mutation observer to catch dynamically rendered elements
  const mutationObserver = new MutationObserver(() => {
    observeElements();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
