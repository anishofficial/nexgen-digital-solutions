import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/Badge';
import { 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Smartphone, 
  Globe, 
  Database, 
  Palette, 
  TrendingUp, 
  ShoppingBag, 
  Cpu
} from 'lucide-react';

interface ScrollManifestoProps {
  onSelectService?: (serviceName: string) => void;
}

export const ScrollManifesto: React.FC<ScrollManifestoProps> = ({ onSelectService }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const statementWords = [
    { text: "We", type: "normal" },
    { text: "are", type: "normal" },
    { text: "a", type: "normal" },
    { text: "specialized", type: "normal" },
    { text: "engineering", type: "normal" },
    { text: "studio", type: "normal" },
    { text: "dedicated", type: "normal" },
    { text: "strictly", type: "normal" },
    { text: "to", type: "normal" },
    { text: "eight", type: "bold" },
    { text: "core", type: "bold" },
    { text: "disciplines:", type: "bold" },
    { text: "Full", type: "highlight", service: "Full Stack Web Development" },
    { text: "Stack", type: "highlight", service: "Full Stack Web Development" },
    { text: "Web", type: "highlight", service: "Full Stack Web Development" },
    { text: "Development,", type: "highlight", service: "Full Stack Web Development" },
    { text: "cross-platform", type: "normal" },
    { text: "App", type: "highlight", service: "App Development" },
    { text: "Development,", type: "highlight", service: "App Development" },
    { text: "pixel-perfect", type: "normal" },
    { text: "Front", type: "highlight", service: "Front End Development" },
    { text: "End", type: "highlight", service: "Front End Development" },
    { text: "Development,", type: "highlight", service: "Front End Development" },
    { text: "high-throughput", type: "normal" },
    { text: "Back", type: "highlight", service: "Back End Development" },
    { text: "End", type: "highlight", service: "Back End Development" },
    { text: "Development,", type: "highlight", service: "Back End Development" },
    { text: "human-centered", type: "normal" },
    { text: "UI/UX", type: "highlight", service: "UI/UX Design" },
    { text: "Design,", type: "highlight", service: "UI/UX Design" },
    { text: "data-driven", type: "normal" },
    { text: "Digital", type: "highlight", service: "Digital Marketing" },
    { text: "Marketing,", type: "highlight", service: "Digital Marketing" },
    { text: "luxury", type: "normal" },
    { text: "Custom", type: "highlight", service: "Custom Merchandise" },
    { text: "Merchandise,", type: "highlight", service: "Custom Merchandise" },
    { text: "and", type: "normal" },
    { text: "bespoke", type: "normal" },
    { text: "Software", type: "highlight", service: "Software Solutions" },
    { text: "Solutions.", type: "highlight", service: "Software Solutions" },
    { text: "Zero", type: "bold" },
    { text: "junior", type: "bold" },
    { text: "handoffs.", type: "bold" },
    { text: "Pure", type: "gradient" },
    { text: "senior", type: "gradient" },
    { text: "craftsmanship.", type: "gradient" }
  ];

  const servicePills = [
    { title: "Full Stack Web", icon: Globe, serviceName: "Full Stack Web Development", wordsRange: [12, 15] },
    { title: "App Development", icon: Smartphone, serviceName: "App Development", wordsRange: [17, 18] },
    { title: "Front End Dev", icon: Layers, serviceName: "Front End Development", wordsRange: [20, 22] },
    { title: "Back End Dev", icon: Database, serviceName: "Back End Development", wordsRange: [24, 26] },
    { title: "UI/UX Design", icon: Palette, serviceName: "UI/UX Design", wordsRange: [28, 29] },
    { title: "Digital Marketing", icon: TrendingUp, serviceName: "Digital Marketing", wordsRange: [31, 32] },
    { title: "Custom Merchandise", icon: ShoppingBag, serviceName: "Custom Merchandise", wordsRange: [34, 35] },
    { title: "Software Solutions", icon: Cpu, serviceName: "Software Solutions", wordsRange: [38, 39] }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when section is 80% from top, complete when near center
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.15;
      const totalDistance = start - end;
      const currentPos = start - rect.top;

      let progress = 0;
      if (rect.top <= start && rect.bottom >= 0) {
        progress = Math.min(1, Math.max(0, currentPos / (totalDistance + rect.height * 0.4)));
      } else if (rect.top < start) {
        progress = 1;
      }

      setScrollProgress(progress);
      const currentWordIdx = Math.floor(progress * statementWords.length);
      setActiveWordIndex(currentWordIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [statementWords.length]);

  const handlePillClick = (serviceName: string) => {
    if (onSelectService) {
      onSelectService(serviceName);
    }
    const servicesEl = document.getElementById('services');
    if (servicesEl) {
      servicesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="manifesto" 
      ref={sectionRef} 
      className="py-24 sm:py-36 relative overflow-hidden bg-gradient-to-b from-[#070a13] via-slate-950 to-[#070a13] border-y border-slate-800/80"
    >
      {/* Dynamic ambient backdrop lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-hero-grid bg-[size:40px_40px] opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Header & Scroll Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-16">
          <div className="flex items-center gap-3">
            <Badge variant="cyan" dot>
              Scroll to Illuminate
            </Badge>
            <span className="text-xs font-mono text-slate-400">
              Our Focused Capabilities
            </span>
          </div>

          {/* Live Scroll Meter */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-150 ease-out" 
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-semibold min-w-[38px] text-right">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

        {/* Big Scrollytelling Typography Block */}
        <div className="relative mb-16">
          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.3] text-left sm:text-justify">
            {statementWords.map((wordObj, idx) => {
              const wordThreshold = idx / statementWords.length;
              const isLit = scrollProgress >= wordThreshold;
              const isCurrent = activeWordIndex === idx;

              let wordColorClass = 'text-slate-700/50 opacity-25 blur-[0.3px]';

              if (isLit) {
                if (wordObj.type === 'highlight') {
                  wordColorClass = 'text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] font-extrabold';
                } else if (wordObj.type === 'gradient') {
                  wordColorClass = 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.5)] font-black';
                } else if (wordObj.type === 'bold') {
                  wordColorClass = 'text-white font-extrabold drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]';
                } else {
                  wordColorClass = 'text-slate-100 font-bold';
                }
              }

              return (
                <span
                  key={idx}
                  onClick={() => wordObj.service && handlePillClick(wordObj.service)}
                  className={`inline-block mr-[0.25em] mb-1 transition-all duration-300 ease-out select-none cursor-default ${
                    wordObj.service ? 'cursor-pointer hover:underline hover:text-cyan-200' : ''
                  } ${isCurrent ? 'scale-105' : 'scale-100'} ${wordColorClass}`}
                  style={{
                    willChange: 'opacity, transform, filter',
                    transitionDelay: `${(idx % 4) * 15}ms`
                  }}
                >
                  {wordObj.text}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interactive 8 Disciplines Status Grid */}
        <div className="pt-10 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              The 8 Disciplines We Deliver (Click to explore)
            </span>
            <span className="text-xs text-cyan-400/80 font-mono hidden sm:inline-block">
              100% In-House Senior Execution
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {servicePills.map((pill, idx) => {
              const Icon = pill.icon;
              const isPillActive = scrollProgress >= (pill.wordsRange[0] / statementWords.length);

              return (
                <button
                  key={idx}
                  onClick={() => handlePillClick(pill.serviceName)}
                  className={`group p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                    isPillActive
                      ? 'bg-slate-900/90 border-cyan-500/40 text-white shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isPillActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold tracking-tight">
                      {pill.title}
                    </span>
                  </div>
                  <ArrowUpRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isPillActive ? 'text-cyan-400' : 'text-slate-600'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
