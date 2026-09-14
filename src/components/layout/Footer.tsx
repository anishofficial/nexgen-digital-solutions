import React from 'react';
import { Mail, ArrowUp, ShieldCheck, Zap, Heart, Lock } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-850 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none bg-radial-highlight opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11">
                <img
                  src="/logo-icon.png"
                  alt="NexGen Solutions"
                  className="w-11 h-11 object-contain drop-shadow-[0_0_16px_rgba(6,182,212,0.45)]"
                />
              </div>
              <div className="flex items-center">
                <img
                  src="/nexgen-wordmark.png"
                  alt="NEXGEN"
                  className="brand-wordmark h-6 sm:h-7 w-auto object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.35)]"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              Building the next generation of digital experiences. We bridge senior engineering, conversion-focused design, and modern web architecture across our 8 core disciplines.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for new client sprints</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@nexgensolutions.dev"
                aria-label="Email"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Specialized Services</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Case Studies & Work</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">Our Delivery Blueprint</a></li>
              <li><a href="#estimator" className="hover:text-white transition-colors">Scope & Cost Calculator</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Transparent Pricing</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About NexGen</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Client Questions (FAQ)</a></li>
            </ul>
          </div>

          {/* Capabilities Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              8 Core Disciplines
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Full Stack Web Development</li>
              <li>• App Development</li>
              <li>• Front End Development</li>
              <li>• Back End Development</li>
              <li>• UI/UX Design</li>
              <li>• Digital Marketing</li>
              <li>• Custom Merchandise</li>
              <li>• Software Solutions</li>
            </ul>
          </div>

          {/* Studio Guarantee Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              The NexGen Solutions Pledge
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>100% Code & IP Ownership transferred to you.</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>Zero junior outsourcing. Direct senior engineering.</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>30-day post-launch bug warranty on all projects.</span>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[11px] text-slate-400">
                Direct Inquiries: <br />
                <a href="mailto:hello@nexgensolutions.dev" className="text-cyan-300 font-mono font-medium hover:underline">
                  hello@nexgensolutions.dev
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} NexGen Solutions. All rights reserved. Crafted with precision in React & Tailwind.
          </div>

          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <ThemeToggle variant="segmented" />

            <a
              href="/admin"
              className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </a>

            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Global Remote Solutions
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
