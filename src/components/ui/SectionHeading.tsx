import React from 'react';
import { Badge } from './Badge';
import { ScrollWordReveal } from './ScrollWordReveal';

interface SectionHeadingProps {
  badgeText?: string;
  badgeVariant?: 'cyan' | 'indigo' | 'emerald' | 'subtle';
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  badgeVariant = 'cyan',
  title,
  highlightWord,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const alignClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';

  // Highlight words array
  const highlightWords = highlightWord ? highlightWord.split(' ') : [];

  return (
    <div className={`flex flex-col max-w-3xl mb-14 md:mb-20 ${alignClass} ${className}`}>
      {badgeText && (
        <div className="mb-4">
          <Badge variant={badgeVariant} dot>
            {badgeText}
          </Badge>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
        <ScrollWordReveal
          text={title}
          type="stagger"
          highlightWords={highlightWords}
          highlightClassName="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm font-extrabold"
          delayOffset={50}
        />
      </h2>

      {subtitle && (
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl font-normal">
          <ScrollWordReveal
            text={subtitle}
            type="stagger"
            wordClassName="text-slate-400 font-normal"
            delayOffset={200}
          />
        </p>
      )}
    </div>
  );
};
