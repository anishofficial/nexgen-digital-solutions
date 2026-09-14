export type ProjectCategory = 'All' | 'Full Stack Web' | 'App Development' | 'UI/UX & Front End' | 'Software Solutions';

export interface ProjectMetric {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  client: string;
  year: string;
  category: Exclude<ProjectCategory, 'All'>;
  description: string;
  problem: string;
  solution: string;
  results: ProjectMetric[];
  techStack: string[];
  featured: boolean;
  accentColor: string;
  badge: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface Service {
  id: string;
  iconName: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  bestFor: string;
  timeline: string;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  price: string;
  period: string;
  timeline: string;
  description: string;
  features: string[];
  guarantee: string;
  ctaText: string;
  highlighted: boolean;
}

export interface ProcessStep {
  number: string;
  title: string;
  duration: string;
  tagline: string;
  description: string;
  deliverables: string[];
  clientRole: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General & Engagement' | 'Pricing & IP' | 'Engineering & Stack' | 'Post-Launch & Growth';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  metric: string;
  metricLabel: string;
  tags: string[];
}

export interface EstimationOption {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  baseWeeks: number;
}
