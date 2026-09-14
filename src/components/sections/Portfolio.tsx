import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { projectsData } from '../../data/projects';
import type { Project, ProjectCategory } from '../../types';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Quote, 
  Sparkles,
  Lock,
  FileCode2
} from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories: ProjectCategory[] = [
    'All',
    'Full Stack Web',
    'App Development',
    'UI/UX & Front End',
    'Software Solutions'
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  const hasProjects = projectsData.length > 0;

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Work & Case Studies"
          badgeVariant="emerald"
          title="Featured client projects & technical builds."
          highlightWord="client projects"
          subtitle="Explore our engineering craft across full-stack applications, mobile apps, frontend interfaces, and bespoke software solutions."
        />

        {!hasProjects ? (
          /* Empty / NDA Curated State */
          <div className="max-w-3xl mx-auto p-8 sm:p-14 rounded-3xl bg-nexgen-card border border-slate-800 text-center shadow-2xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-6 h-6" />
              </div>

              <Badge variant="cyan" dot className="mb-4">
                Active Client NDAs
              </Badge>

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                Case studies currently being updated
              </h3>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto mb-8">
                Due to client non-disclosure agreements, our recent full-stack web applications, mobile builds, and software solutions are shared privately. Contact us to request private code walkthroughs or live staging access.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="md"
                  href="#contact"
                  icon={<ArrowUpRight className="w-4 h-4" />}
                  className="shadow-glow-cyan"
                >
                  Request Private Portfolio
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  href="#services"
                  icon={<FileCode2 className="w-4 h-4 text-cyan-400" />}
                  iconPosition="left"
                >
                  View Our 8 Services
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono">
                <span>• Full Stack Web</span>
                <span>• iOS & Android Apps</span>
                <span>• UI/UX Systems</span>
                <span>• Custom Software</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan/50 font-semibold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative flex flex-col justify-between rounded-2xl bg-nexgen-card border border-slate-800 hover:border-cyan-500/40 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/20"
                >
                  <div>
                    {/* Top Bar: Client & Category Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {project.client}
                      </span>
                      <Badge variant="subtle" className="text-[10px]">
                        {project.category}
                      </Badge>
                    </div>

                    {/* Project Title & Tagline */}
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      {project.tagline}
                    </p>

                    {/* Key Measurable Results Display */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-6">
                      {project.results.slice(0, 2).map((res, idx) => (
                        <div key={idx}>
                          <div className="text-lg font-black text-white font-mono flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{res.metric}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {res.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Case Study Details Trigger */}
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Case Study Deep Dive Modal */}
            <Modal
              isOpen={!!activeModalProject}
              onClose={() => setActiveModalProject(null)}
              title={activeModalProject ? `${activeModalProject.title} — Case Study` : ''}
              maxWidth="4xl"
            >
              {activeModalProject && (
                <div className="space-y-8">
                  {/* Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="cyan" dot>
                          {activeModalProject.badge}
                        </Badge>
                        <span className="text-xs font-mono text-slate-400">
                          {activeModalProject.client} • {activeModalProject.year}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {activeModalProject.title}
                      </h2>
                      <p className="text-sm text-cyan-400 mt-1">
                        {activeModalProject.tagline}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      href="#contact"
                      onClick={() => setActiveModalProject(null)}
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      Build Something Similar
                    </Button>
                  </div>

                  {/* Metrics Grid */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                      Verified Project Impact
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {activeModalProject.results.map((res, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                          <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
                            {res.metric}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {res.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Problem vs Solution 2-column breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                        <span>The Challenge</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeModalProject.problem}
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                        <span>Our Engineering Solution</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {activeModalProject.solution}
                      </p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
                      Core Architectural Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeModalProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Client Endorsement if available */}
                  {activeModalProject.testimonial && (
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 to-indigo-950/20 border border-cyan-500/20">
                      <Quote className="w-8 h-8 text-cyan-400/40 mb-3" />
                      <p className="text-sm text-slate-200 italic leading-relaxed">
                        "{activeModalProject.testimonial.quote}"
                      </p>
                      <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">
                            {activeModalProject.testimonial.author}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {activeModalProject.testimonial.role}
                          </div>
                        </div>
                        <Badge variant="emerald" dot>
                          Verified Client
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </>
        )}
      </div>
    </section>
  );
};
