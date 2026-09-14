import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { processSteps } from '../../data/process';
import { CheckCircle2, Clock, UserCheck, ArrowRight } from 'lucide-react';

export const Process: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = processSteps[activeStepIndex];

  return (
    <section id="process" className="py-24 sm:py-32 relative bg-slate-950/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Our Proven Blueprint"
          badgeVariant="cyan"
          title="From initial concept to deployment in 5 transparent steps."
          highlightWord="5 transparent steps"
          subtitle="No dark periods. No mystery timelines. A battle-tested engineering process designed to keep you informed, confident, and ahead of schedule."
        />

        {/* Desktop Step Selectors with High Refresh Rate Spring Motion */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {processSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-xl text-left border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu active:scale-[0.98] relative cursor-pointer select-none ${
                  isActive
                    ? 'bg-nexgen-card border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    PHASE {step.number}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {step.duration}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                  {step.title}
                </h4>

                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive Card */}
        <div className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-nexgen-card border border-slate-800/90 shadow-2xl relative overflow-hidden transition-all duration-300">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="cyan" dot>
                  Phase {activeStep.number} of 05
                </Badge>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {activeStep.duration}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                {activeStep.title}
              </h3>

              <p className="text-sm font-semibold text-cyan-400/90 mb-4">
                {activeStep.tagline}
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                {activeStep.description}
              </p>

              {/* Client Role Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-0.5 font-semibold">
                    Your Time Investment
                  </span>
                  <p className="text-xs text-slate-300">
                    {activeStep.clientRole}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Deliverables Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-4 font-semibold">
                What You Receive In Phase {activeStep.number}
              </span>

              <ul className="space-y-4">
                {activeStep.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Next Phase</span>
                <button
                  onClick={() => setActiveStepIndex((prev) => (prev + 1) % processSteps.length)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer select-none active:translate-x-1"
                >
                  <span>Advance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
