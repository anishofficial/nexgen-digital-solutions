import React from 'react';
import { clientLogos } from '../../data/testimonials';

export const TrustBar: React.FC = () => {
  const techLogos = [
    'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 
    'PostgreSQL', 'GraphQL', 'Vercel', 'Figma', 'Stripe'
  ];

  return (
    <section className="border-y border-slate-800/80 bg-slate-950/60 py-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left flex-shrink-0">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
              Trusted Engineering Partner For
            </span>
            <span className="text-sm font-semibold text-slate-300">
              High-growth startups & modern brands
            </span>
          </div>

          {/* Client Names Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-4">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
                <span className="text-xs sm:text-sm font-bold tracking-widest font-mono text-slate-300">
                  {client.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Badges Row */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-[11px] text-slate-400 font-mono mr-2">OUR MODERN STACK:</span>
          {techLogos.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-300 hover:border-slate-700 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
