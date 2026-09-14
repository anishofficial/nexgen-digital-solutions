import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#portfolio' },
    { label: 'Process', href: '#process' },
    { label: 'Estimator', href: '#estimator' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          const sections = ['home', 'services', 'portfolio', 'process', 'estimator', 'pricing', 'about', 'faq', 'contact'];
          const scrollPosition = window.scrollY + 200;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
        isScrolled
          ? 'bg-nexgen-bg/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/30'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <img
                src="/logo-icon.png"
                alt="NexGen Solutions"
                className="w-10 h-10 object-contain drop-shadow-[0_0_14px_rgba(6,182,212,0.4)]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <img
                src="/nexgen-wordmark.png"
                alt="NEXGEN"
                className="brand-wordmark h-5 sm:h-5.5 w-auto object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all duration-300 group-hover:brightness-110"
              />
              <span className="text-[10px] text-slate-400 tracking-wider hidden sm:block mt-0.5">
                Web & Software Solutions
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/90 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Available for Q3/Q4 Projects</span>
            </div>

            {/* Theme adjustment button */}
            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              href="#contact"
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              Start Project
            </Button>
          </div>

          {/* Mobile Menu Toggle & Theme */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[60px] bg-nexgen-bg/95 border-b border-slate-800 backdrop-blur-xl px-5 py-6 shadow-2xl animate-fadeIn z-50">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for 2 new client sprints</span>
            </div>
            <span className="text-xs text-slate-400">NexGen Solutions</span>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60 flex items-center justify-between transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>

          {/* Theme switcher inside mobile drawer */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Theme</span>
            <ThemeToggle variant="segmented" />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              href="#contact"
              icon={<ArrowUpRight className="w-4 h-4" />}
              className="w-full"
            >
              Discuss Your Project
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
