import { ArrowUpRight, Code2, Shield, Zap, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { ScrollWordReveal } from '../ui/ScrollWordReveal';

export const Hero: React.FC = () => {
  const serviceBadges = [
    'Full Stack Web',
    'App Development',
    'Front End Dev',
    'Back End Dev',
    'UI/UX Design',
    'Digital Marketing',
    'Custom Merchandise',
    'Software Solutions'
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-40 pointer-events-none mask-radial" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Kinetic 8 Services Ribbon */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            Our 8 Disciplines:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {serviceBadges.map((service, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 flex-shrink-0 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors cursor-default"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Main Headline with Scroll Words Reveal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              <ScrollWordReveal
                text="Building the next generation of digital experiences."
                type="stagger"
                highlightWords={['digital', 'experiences.']}
                highlightClassName="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent font-black"
                delayOffset={50}
              />
            </h1>

            {/* Sub-headline with Scroll Words Reveal */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              <ScrollWordReveal
                text="NexGen Solutions is a modern technology company specializing in Full Stack Web, Mobile Apps, Frontend, Backend, UI/UX Design, Digital Marketing, Custom Merchandise, and bespoke Software Solutions."
                type="stagger"
                highlightWords={['Full', 'Stack', 'Web,', 'Mobile', 'Apps,', 'Frontend,', 'Backend,', 'UI/UX', 'Design,', 'Digital', 'Marketing,', 'Custom', 'Merchandise,', 'Software', 'Solutions.']}
                highlightClassName="text-cyan-300 font-semibold"
                delayOffset={250}
              />
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto flex-wrap">
              <Button
                variant="primary"
                size="lg"
                href="#contact"
                icon={<ArrowUpRight className="w-5 h-5" />}
                className="shadow-glow-cyan"
              >
                Start Your Project
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="#contact"
                icon={<Calendar className="w-4 h-4 text-cyan-400" />}
                iconPosition="left"
                className="border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold hover:border-cyan-400 shadow-sm"
              >
                Book Free Strategy Call
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href="#services"
                icon={<Code2 className="w-4 h-4 text-cyan-400" />}
                iconPosition="left"
              >
                Explore Capabilities
              </Button>
            </div>

            {/* Strategy Call Assurance Badge */}
            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Free 30-min strategy & roadmap session</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-slate-400">100% complimentary • Direct senior engineer</span>
            </div>
          </div>

          {/* Right Column: High-Tech Studio Interactive Visual */}
          <div className="lg:col-span-5 relative">
            {/* Glowing Backdrop behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-70" />

            {/* Studio Showcase Terminal Card */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
              {/* Terminal Window Chrome */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">nexgen://solutions-core.ts</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  production: ready
                </span>
              </div>

              {/* Code Snippet Highlight */}
              <div className="mt-4 font-mono text-xs text-slate-300 space-y-1 bg-slate-950/70 p-4 rounded-xl border border-slate-800/60 overflow-x-auto">
                <div>
                  <span className="text-indigo-400">const</span>{' '}
                  <span className="text-cyan-300">nexgenProduct</span> ={' '}
                  <span className="text-slate-400">{'{'}</span>
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">craft:</span>{' '}
                  <span className="text-emerald-300">'bespoke-only'</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">stack:</span>{' '}
                  <span className="text-amber-300">['React', 'Next.js', 'Tailwind', 'TS']</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">lighthouse:</span>{' '}
                  <span className="text-emerald-400 font-bold">100</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">clientIPOwnership:</span>{' '}
                  <span className="text-cyan-400">true</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-400">agencyBureaucracy:</span>{' '}
                  <span className="text-rose-400">0</span>
                </div>
                <div>
                  <span className="text-slate-400">{'}'};</span>
                </div>
              </div>

              {/* Floating Real-Time Benchmark Cards */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Speed Score
                    </span>
                    <span className="text-emerald-400 font-bold">100/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full w-[99%]" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">LCP: 0.38s • INP: 12ms</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      Security & QA
                    </span>
                    <span className="text-cyan-400 font-bold">A+ Grade</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[100%]" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Strict Type Checking & CSP</span>
                </div>
              </div>

              {/* Testimonial Snippet inside card */}
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/20 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-300 italic">
                    "Our inbound conversion spiked by 340% within 30 days of the NexGen redesign."
                  </p>
                  <p className="text-[10px] text-cyan-400 mt-1 font-medium">
                    Marcus Vance — CTO, Strata Systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
