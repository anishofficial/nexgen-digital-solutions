import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { pricingTiers, pricingAddOns } from '../../data/pricing';
import { Check, ShieldCheck, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface PricingProps {
  onSelectTier?: (tierName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectTier }) => {
  const handleTierClick = (tierName: string) => {
    if (onSelectTier) {
      onSelectTier(tierName);
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Transparent Pricing"
          badgeVariant="cyan"
          title="Predictable investment. Uncompromising quality."
          highlightWord="Uncompromising quality"
          subtitle="Fixed sprint budgets and dedicated retainer capacity. You always know exactly what you’re paying, when milestones deliver, and what’s included."
        />

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {pricingTiers.map((tier) => {
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-slate-900 via-nexgen-card to-slate-900 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/40 lg:-translate-y-2'
                    : 'bg-nexgen-card border border-slate-800/90'
                }`}
              >
                {/* Badge if featured */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant={tier.highlighted ? 'cyan' : 'indigo'} dot>
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Tier Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[36px]">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="pb-6 mb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {tier.price}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      {tier.period}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tier.timeline}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  {/* Feature list */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      What's Included:
                    </span>
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Guarantee box */}
                  <div className="mb-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{tier.guarantee}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    size="md"
                    onClick={() => handleTierClick(tier.name)}
                    className="w-full"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {tier.ctaText}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Specialized Add-ons Grid */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Specialized Capabilities
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Modular engineering add-ons
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Can be bundled into any Launchpad or Custom App sprint.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricingAddOns.map((addon, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-nexgen-card border border-slate-800/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {addon.price}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">
                    {addon.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
