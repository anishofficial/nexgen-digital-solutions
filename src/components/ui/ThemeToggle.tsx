import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme } from '../../context/useTheme';
import type { Theme } from '../../context/ThemeContextCore';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-cyan-400" /> },
    { value: 'system', label: 'System', icon: <Laptop className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md ${className}`}>
        {options.map((opt) => {
          const isActive = theme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              aria-label={`Switch to ${opt.label} theme`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown / Compact toggle mode (default for navbar)
  const currentIcon = () => {
    if (theme === 'system') return <Laptop className="w-4 h-4 text-indigo-400" />;
    return resolvedTheme === 'dark' ? (
      <Moon className="w-4 h-4 text-cyan-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-400" />
    );
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme Adjustment (Light, Dark, System)"
        className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
      >
        <span className="transition-transform duration-200 hover:rotate-12">
          {currentIcon()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900/95 border border-slate-800/90 shadow-xl shadow-black/40 backdrop-blur-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
            Theme Mode
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
