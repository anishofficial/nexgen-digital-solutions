import React, { useEffect, useRef, useState } from 'react';

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  activeWordClassName?: string;
  type?: 'stagger' | 'fill' | 'cascade';
  highlightWords?: string[];
  highlightClassName?: string;
  delayOffset?: number;
  threshold?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div' | 'span';
}

export const ScrollWordReveal: React.FC<ScrollWordRevealProps> = ({
  text,
  className = '',
  wordClassName = '',
  activeWordClassName = '',
  type = 'stagger',
  highlightWords = [],
  highlightClassName = 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 font-extrabold',
  delayOffset = 0,
  threshold = 0.12,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Normalize highlight words for case-insensitive lookup
  const cleanHighlights = highlightWords.map(w => w.toLowerCase().trim());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (type === 'stagger' || type === 'cascade') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Use requestAnimationFrame for high-refresh-rate sync
            requestAnimationFrame(() => {
              setIsVisible(true);
            });
            observer.unobserve(el);
          }
        },
        { threshold, rootMargin: '0px 0px -40px 0px' }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }

    if (type === 'fill') {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const start = windowHeight * 0.85;
            const end = windowHeight * 0.25;
            const current = rect.top;

            if (current > start) {
              setScrollProgress(0);
            } else if (current < end) {
              setScrollProgress(1);
            } else {
              const progress = (start - current) / (start - end);
              setScrollProgress(Math.min(1, Math.max(0, progress)));
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [type, threshold]);

  const words = text.split(/\s+/).filter(Boolean);

  if (type === 'fill') {
    return (
      <Component ref={containerRef as any} className={`inline-block ${className}`}>
        {words.map((word, idx) => {
          const wordProgressThreshold = idx / words.length;
          const isLit = scrollProgress >= wordProgressThreshold;
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const isHighlighted = cleanHighlights.some(h => cleanWord.includes(h) || h.includes(cleanWord));

          return (
            <span
              key={idx}
              className={`inline-block mr-[0.28em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none transform-gpu ${
                isLit
                  ? isHighlighted
                    ? `${highlightClassName} drop-shadow-[0_0_15px_rgba(6,182,212,0.45)] scale-[1.02]`
                    : activeWordClassName || 'text-slate-900 dark:text-white drop-shadow-sm'
                  : 'text-slate-300 dark:text-slate-600/40 opacity-40 blur-[0.3px]'
              } ${wordClassName}`}
              style={{
                willChange: 'opacity, transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transitionDelay: `${(idx % 6) * 12}ms`
              }}
            >
              {word}
            </span>
          );
        })}
      </Component>
    );
  }

  // 'stagger' or 'cascade' mode with 120Hz/144Hz high refresh rate spring physics
  return (
    <Component ref={containerRef as any} className={`inline-block ${className}`}>
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = cleanHighlights.some(h => cleanWord.includes(h) || h.includes(cleanWord));
        const delay = delayOffset + idx * (type === 'cascade' ? 32 : 22);

        return (
          <span
            key={idx}
            className={`inline-block mr-[0.26em] transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              isVisible
                ? 'opacity-100 translate-y-0 filter-none scale-100'
                : 'opacity-0 translate-y-4 blur-[3px] scale-[0.97] pointer-events-none'
            } ${isHighlighted ? highlightClassName : ''} ${wordClassName}`}
            style={{
              transitionDelay: `${delay}ms`,
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 14px, 0)'
            }}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
};
