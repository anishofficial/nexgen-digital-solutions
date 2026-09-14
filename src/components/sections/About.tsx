import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Sparkles, Shield, Clock } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="About NexGen Solutions"
          badgeVariant="indigo"
          title="Senior craftsmanship without the agency bloat."
          highlightWord="craftsmanship"
          subtitle="We founded NexGen Solutions on a straightforward belief: great digital products are built by passionate senior builders working directly with ambitious founders."
        />

        {/* Narrative & Principles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-nexgen-card border border-slate-800/90 relative group hover:border-cyan-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Design & Engineering Unified
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Design and code are two sides of the same coin. We design with code in mind, producing pixel-perfect layouts, intuitive micro-interactions, and accessible typography.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nexgen-card border border-slate-800/90 relative group hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Radical Engineering Integrity
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We write clean, strictly typed TypeScript, modular components, and self-documenting architectures. We build for longevity: your platform will be easy to scale.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-nexgen-card border border-slate-800/90 relative group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Conversion & Business First
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every screen, form, CTA hierarchy, and micro-animation we architect is intentionally calibrated to maximize user trust, reduce friction, and increase conversion rates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
