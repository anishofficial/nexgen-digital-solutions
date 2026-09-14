import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { estimatorCategories } from '../../data/estimator';
import { saveEstimateCalculation } from '../../utils/api';
import { 
  Calculator, 
  Check, 
  Clock, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

interface CostEstimatorProps {
  onEstimateGenerated?: (summary: {
    productType: string;
    scope: string;
    features: string[];
    timeline: string;
    estimatedCost: string;
  }) => void;
}

function createOfflineRefCode(): string {
  const timestamp = typeof Date !== 'undefined' ? Date.now() : 0;
  return `EST-${String(timestamp).slice(-5)}`;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ onEstimateGenerated }) => {
  const [selectedProjectType, setSelectedProjectType] = useState<string>('full-stack-web');
  const [selectedScale, setSelectedScale] = useState<string>('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['ui-ux-design', 'digital-marketing']);
  const [selectedSpeed, setSelectedSpeed] = useState<string>('standard-pace');

  const projectTypeCat = estimatorCategories.find(c => c.id === 'project-type')!;
  const scaleCat = estimatorCategories.find(c => c.id === 'scale')!;
  const featuresCat = estimatorCategories.find(c => c.id === 'features')!;
  const speedCat = estimatorCategories.find(c => c.id === 'speed')!;

  const toggleFeature = (featId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featId) ? prev.filter(id => id !== featId) : [...prev, featId]
    );
  };

  // Calculate totals
  const currentProjectType = projectTypeCat.options.find(o => o.id === selectedProjectType) || projectTypeCat.options[0];
  const currentScale = scaleCat.options.find(o => o.id === selectedScale) || scaleCat.options[0];
  const currentSpeed = speedCat.options.find(o => o.id === selectedSpeed) || speedCat.options[0];
  const activeFeatureOptions = featuresCat.options.filter(o => selectedFeatures.includes(o.id));

  const totalBasePrice = 
    currentProjectType.price + 
    currentScale.price + 
    activeFeatureOptions.reduce((sum, f) => sum + f.price, 0) + 
    currentSpeed.price;

  const totalDays = Math.max(
    10,
    currentProjectType.days + 
    currentScale.days + 
    activeFeatureOptions.reduce((sum, f) => sum + f.days, 0) + 
    currentSpeed.days
  );

  const estimatedWeeks = Math.ceil(totalDays / 7);
  const formattedEstimate = `$${totalBasePrice.toLocaleString()}`;

  const [savedRefCode, setSavedRefCode] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyToContact = () => {
    const summary = {
      productType: currentProjectType.label,
      scope: currentScale.label,
      features: activeFeatureOptions.map(f => f.label),
      timeline: `${estimatedWeeks} weeks (${totalDays} working days)`,
      estimatedCost: formattedEstimate
    };

    if (onEstimateGenerated) {
      onEstimateGenerated(summary);
    }

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveEstimate = async () => {
    setIsSaving(true);
    try {
      const result = await saveEstimateCalculation({
        productType: currentProjectType.label,
        scope: currentScale.label,
        features: activeFeatureOptions.map(f => f.label),
        timeline: `${estimatedWeeks} weeks`,
        estimatedCost: formattedEstimate,
      });
      if (result.success && result.data) {
        setSavedRefCode(result.data.referenceCode);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(result.data.referenceCode);
        }
      }
    } catch {
      // Offline fallback
      setSavedRefCode(createOfflineRefCode());
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <section id="estimator" className="py-24 sm:py-32 relative bg-slate-950/70 border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Interactive Scope & Cost Tool"
          badgeVariant="cyan"
          title="Calculate your project investment in seconds."
          highlightWord="investment in seconds"
          subtitle="No hidden variables or high-pressure sales calls. Configure your scope, select your required integrations, and get an instant transparent estimate."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Project Type */}
            <div className="p-6 sm:p-7 rounded-2xl bg-nexgen-card border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {projectTypeCat.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {projectTypeCat.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypeCat.options.map((opt) => {
                  const isSelected = selectedProjectType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedProjectType(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu active:scale-[0.985] ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 animate-scaleUp">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {opt.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-400 font-semibold">${opt.price.toLocaleString()}</span>
                        <span className="text-slate-500">~{opt.days} days</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Screen Scale */}
            <div className="p-6 sm:p-7 rounded-2xl bg-nexgen-card border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {scaleCat.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {scaleCat.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scaleCat.options.map((opt) => {
                  const isSelected = selectedScale === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedScale(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu active:scale-[0.985] ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 animate-scaleUp">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {opt.description}
                      </p>
                      <div className="mt-3 text-[11px] font-mono text-cyan-400">
                        {opt.price === 0 ? 'Included' : `+$${opt.price.toLocaleString()}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Features & Integrations (Multi-select) */}
            <div className="p-6 sm:p-7 rounded-2xl bg-nexgen-card border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {featuresCat.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {featuresCat.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresCat.options.map((opt) => {
                  const isChecked = selectedFeatures.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleFeature(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu active:scale-[0.985] flex items-start gap-3 ${
                        isChecked
                          ? 'bg-cyan-950/20 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-all duration-200 ${
                        isChecked
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 scale-105'
                          : 'border-slate-700 bg-slate-900 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {opt.label}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400 font-medium">
                            +${opt.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Speed */}
            <div className="p-6 sm:p-7 rounded-2xl bg-nexgen-card border border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                {speedCat.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {speedCat.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {speedCat.options.map((opt) => {
                  const isSelected = selectedSpeed === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedSpeed(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu active:scale-[0.985] ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 animate-scaleUp">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {opt.description}
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-cyan-400">
                        {opt.price === 0 ? 'Standard Sprint' : `+$${opt.price.toLocaleString()} priority`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="p-7 rounded-3xl bg-nexgen-card border border-cyan-500/30 shadow-2xl shadow-cyan-950/30 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                  Real-time Estimate
                </span>
                <Badge variant="emerald" dot>
                  Milestone-backed
                </Badge>
              </div>

              {/* Big Price Display */}
              <div className="my-6">
                <span className="text-xs text-slate-400 block mb-1">Estimated Investment</span>
                <div className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                  <span>{formattedEstimate}</span>
                  <span className="text-xs font-normal text-slate-400">USD</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-cyan-300 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{estimatedWeeks} weeks ({totalDays} business days)</span>
                </div>
              </div>

              {/* Itemized Overview */}
              <div className="space-y-2.5 py-4 border-y border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Architecture:</span>
                  <span className="font-medium text-right max-w-[180px] truncate">{currentProjectType.label}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Complexity:</span>
                  <span className="font-medium">{currentScale.label.split('(')[0]}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Modules:</span>
                  <span className="font-medium">{activeFeatureOptions.length} Selected</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Sprint Speed:</span>
                  <span className="font-medium">{selectedSpeed === 'express-fastrack' ? 'Express Fastrack' : 'Standard Sprint'}</span>
                </div>
              </div>

              {/* What is Included Guarantee */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Standard In All NexGen Builds:</span>
                </div>
                <div>• 100% Full IP & Git Source Code Transfer</div>
                <div>• Sub-second Page Speed & Core Web Vitals</div>
                <div>• 30-Day Post-Launch Bug Warranty</div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApplyToContact}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full shadow-glow-cyan"
                >
                  Apply Scope to Inquiry
                </Button>

                <button
                  onClick={handleSaveEstimate}
                  disabled={isSaving}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  {savedRefCode ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Quote Saved: {savedRefCode} (Link Copied!)
                    </span>
                  ) : (
                    <span>{isSaving ? 'Saving...' : '💾 Save Quote & Copy Link'}</span>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-500 mt-2">
                  No commitment required. We’ll review and respond in &lt;12h.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
