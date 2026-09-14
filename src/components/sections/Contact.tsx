import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { submitPublicInquiry } from '../../utils/api';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck
} from 'lucide-react';


interface ContactProps {
  prefilledScope?: {
    productType: string;
    scope: string;
    features: string[];
    timeline: string;
    estimatedCost: string;
  } | null;
  prefilledService?: string | null;
}

export const Contact: React.FC<ContactProps> = ({ prefilledScope, prefilledService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [] as string[],
    budget: '$5,000 – $10,000',
    timeline: 'Within 4 weeks',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const availableServices = [
    'Full Stack Web Development',
    'App Development',
    'Front End Development',
    'Back End Development',
    'UI/UX Design',
    'Digital Marketing',
    'Custom Merchandise',
    'Software Solutions',
  ];

  const budgetOptions = [
    '< $5,000',
    '$5,000 – $10,000',
    '$10,000 – $25,000',
    '$25,000+',
  ];

  const timelineOptions = [
    'Immediate (Next 2 weeks)',
    'Within 4 weeks',
    'Next 2–3 months',
    'Flexible / Planning',
  ];

  // Adjust state during render when props change
  const [prevScope, setPrevScope] = useState(prefilledScope);
  if (prefilledScope !== prevScope) {
    setPrevScope(prefilledScope);
    if (prefilledScope) {
      setFormData(prev => ({
        ...prev,
        budget: prefilledScope.estimatedCost.includes('9,') || prefilledScope.estimatedCost.includes('1') 
          ? '$10,000 – $25,000' 
          : '$5,000 – $10,000',
        message: `Project Estimate Scope:\n• Type: ${prefilledScope.productType}\n• Scale: ${prefilledScope.scope}\n• Add-on Features: ${prefilledScope.features.join(', ') || 'None'}\n• Estimated Timeline: ${prefilledScope.timeline}\n• Calculated Estimate: ${prefilledScope.estimatedCost}\n\nAdditional details about our vision: `
      }));
    }
  }

  const [prevService, setPrevService] = useState(prefilledService);
  if (prefilledService !== prevService) {
    setPrevService(prefilledService);
    if (prefilledService) {
      setFormData(prev => ({
        ...prev,
        services: prev.services.includes(prefilledService) ? prev.services : [...prev.services, prefilledService]
      }));
    }
  }

  const toggleService = (srv: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(srv)
        ? prev.services.filter(s => s !== srv)
        : [...prev.services, srv]
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hello@nexgenstudio.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitPublicInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        services: formData.services.length > 0 ? formData.services : ['Custom Software Solutions'],
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.message.trim(),
      });

      if (result.success) {
        setSubmissionId(result.data?.inquiryId || `INQ-${Date.now().toString().slice(-4)}`);
        setIsSubmitted(true);
      } else {
        setErrorMessage(result.error || 'Unable to submit brief. Please check your network and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission encountered an issue. Please reach out directly to hello@nexgenstudio.dev');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden bg-slate-950">
      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          badgeText="Let's Build Together"
          badgeVariant="cyan"
          title="Turn your idea into a category-defining digital product."
          highlightWord="category-defining"
          subtitle="Tell us about your upcoming project or engineering challenge. We review every brief and return a preliminary scope and quote within 12 business hours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Booking Options */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-nexgen-card border border-slate-800 relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Accepting Q3/Q4 Inquiries
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight mb-3">
                Ready for a direct senior partnership?
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Skip the layers of agency bureaucracy. You'll work directly with a senior full-stack engineer and designer dedicated to your milestone goals.
              </p>

              {/* Direct email card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      Direct Email
                    </span>
                    <a href="mailto:hello@nexgensolutions.dev" className="text-sm font-bold text-white hover:text-cyan-300 font-mono transition-colors">
                      hello@nexgensolutions.dev
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Direct intro call booking */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Prefer a 20-minute video scope call?
                  </h4>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Discuss your technical requirements, budget, and timeline directly on a screen-share session.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  href="https://cal.com"
                  target="_blank"
                  className="w-full text-xs"
                >
                  Schedule Video Call (Cal.com)
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Guaranteed response within 12 business hours</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Mutual Non-Disclosure Agreement (NDA) on request</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Zero spam, zero high-pressure sales calls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-nexgen-card border border-slate-800 shadow-2xl relative">
              {isSubmitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-scaleUp">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Inquiry Received!
                  </h3>
                  {submissionId && (
                    <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                      Reference ID: {submissionId}
                    </div>
                  )}
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-cyan-300 font-semibold">{formData.name || 'friend'}</span>. We have received your project details and will send a preliminary scope breakdown and milestone estimate to <span className="text-cyan-300">{formData.email}</span> within 12 hours.
                  </p>
                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setSubmissionId(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Vance"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Company or Project Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Strata Systems or stealth venture"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
                    />
                  </div>

                  {/* Services Needed */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Services Needed (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableServices.map((srv) => {
                        const isSelected = formData.services.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleService(srv)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Target Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                      >
                        {budgetOptions.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Target Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500/60"
                      >
                        {timelineOptions.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                      Project Details & Goals *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you are looking to build, your current bottlenecks, and any target deadlines..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 custom-scrollbar"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    icon={isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    className="w-full shadow-glow-cyan"
                  >
                    {isSubmitting ? 'Transmitting Scope...' : 'Submit Project Inquiry'}
                  </Button>

                  <p className="text-[11px] text-center text-slate-500">
                    We treat all shared product concepts under strict studio confidentiality.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
