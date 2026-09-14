import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { testimonialsData } from '../../data/testimonials';
import { Quote, TrendingUp, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative bg-slate-950/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Client Endorsements"
          badgeVariant="indigo"
          title="Direct feedback from partners who trust our craft."
          highlightWord="trust our craft"
          subtitle="We measure our success strictly by the commercial velocity and technical reliability we unlock for our client partners."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((t) => (
            <div
              key={t.id}
              className="p-8 sm:p-10 rounded-3xl bg-nexgen-card border border-slate-800 flex flex-col justify-between relative group hover:border-slate-700 transition-all shadow-xl"
            >
              <div>
                {/* Metric pill */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold">{t.metric}</span>
                    <span className="text-slate-400 hidden sm:inline">• {t.metricLabel}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <Quote className="w-7 h-7 text-slate-700 mb-3" />
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic mb-8">
                  "{t.quote}"
                </p>
              </div>

              <div>
                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pb-5 mb-5 border-b border-slate-800">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border border-cyan-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {t.author}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {t.role} • <span className="text-cyan-400">{t.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
