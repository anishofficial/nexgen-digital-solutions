import React, { useState } from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { faqData } from '../../data/faqs';
import { ChevronDown, Search, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export const FAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>(['who-builds', 'ownership-ip']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'General & Engagement',
    'Pricing & IP',
    'Engineering & Stack',
    'Post-Launch & Growth'
  ];

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badgeText="Got Questions?"
          badgeVariant="cyan"
          title="Frequently asked questions & clear answers."
          highlightWord="clear answers"
          subtitle="Everything you need to know about partnering with NexGen, our IP guarantees, and how we deliver senior software velocity."
        />

        {/* Search & Category Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. IP ownership, timeline, payment, tech stack)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List with High Refresh Rate CSS Grid Expansion */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
              No questions found matching "{searchQuery}". Try another keyword or feel free to message us directly!
            </div>
          ) : (
            filteredFAQs.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden transform-gpu ${
                    isOpen
                      ? 'bg-nexgen-card border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(item.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-colors cursor-pointer select-none"
                  >
                    <span className="text-base font-semibold text-white">
                      {item.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg bg-slate-850 flex items-center justify-center text-cyan-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0 ${
                        isOpen ? 'rotate-180 bg-cyan-500/20 text-cyan-300' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                        <p>{item.answer}</p>
                        <div className="mt-3 text-[11px] font-mono text-cyan-400/80">
                          Category: {item.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Question not answered CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Have a specific question not covered here?</div>
              <div className="text-xs text-slate-400">We respond to every single client inquiry within 12 hours.</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" href="#contact">
            Ask Direct Question
          </Button>
        </div>
      </div>
    </section>
  );
};
