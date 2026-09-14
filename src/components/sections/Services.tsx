import React, { useState, useEffect, useRef } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { servicesData } from '../../data/services';
import type { Service } from '../../types';
import { 
  LayoutGrid, 
  Smartphone, 
  Monitor, 
  Database, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Code
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(servicesData[0].id);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutGrid': return <LayoutGrid className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Code2': return <Code2 className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const handleInquire = (serviceTitle: string) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 sm:py-32 relative bg-slate-950/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Our 8 Core Capabilities"
          badgeVariant="cyan"
          title="Specialized digital craftsmanship for modern brands."
          highlightWord="digital craftsmanship"
          subtitle="From full stack engineering and mobile apps to UI/UX, marketing, and custom merchandise. Dedicated senior focus across the entire digital lifecycle."
        />

        {/* Services Grid (8 cards in responsive 4-column layout with 120Hz/144Hz high refresh rate spring entrance) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service: Service, idx: number) => {
            const isSelected = activeServiceId === service.id;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveServiceId(service.id)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
                  isVisible
                    ? 'opacity-100 filter-none'
                    : 'opacity-0 blur-[3px] pointer-events-none'
                } ${
                  isSelected
                    ? 'bg-nexgen-card border-cyan-500/50 shadow-xl shadow-cyan-950/20'
                    : 'bg-nexgen-card/70 border-slate-800 hover:border-slate-700 hover:shadow-lg'
                } border backdrop-blur-sm`}
                style={{
                  transitionDelay: `${idx * 45}ms`,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: isVisible
                    ? isSelected ? 'translate3d(0, -6px, 0)' : 'translate3d(0, 0, 0)'
                    : 'translate3d(0, 24px, 0)'
                }}
              >
                <div>
                  {/* Service Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{service.timeline}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-[11px] font-medium text-cyan-400/90 mb-2.5 line-clamp-2">
                    {service.tagline}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                      Key Deliverables
                    </span>
                    <ul className="space-y-1.5">
                      {service.deliverables.slice(0, 3).map((item, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  {/* Tech Stack Chips */}
                  <div className="pt-3 mb-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1">
                      {service.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[9px] font-mono text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[9px] font-mono text-slate-500">
                          +{service.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={() => handleInquire(service.title)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-1.5 transition-all duration-200 group active:scale-[0.98]"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner for Custom Inquiries */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white">Need a combination of our 8 core services?</h4>
            <p className="text-sm text-slate-400 mt-1">
              We frequently bundle Full Stack Development with Mobile Apps, UI/UX Design, Digital Marketing, Custom Merchandise, and Software Solutions for unified launches.
            </p>
          </div>
          <Button variant="primary" size="md" href="#contact" icon={<ArrowRight className="w-4 h-4" />}>
            Configure Custom Bundle
          </Button>
        </div>
      </div>
    </section>
  );
};
