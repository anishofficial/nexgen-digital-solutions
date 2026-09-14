import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'indigo' | 'emerald' | 'subtle' | 'outline';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  dot = false,
  className = ''
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    subtle: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    outline: 'bg-transparent text-slate-400 border-slate-700/70 hover:border-slate-500/70',
  };

  const dotStyles = {
    cyan: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    indigo: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    subtle: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide border backdrop-blur-sm transition-colors ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};
