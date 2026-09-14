import type { Testimonial } from '../types';

export const testimonialsData: Testimonial[] = [
  {
    id: 'marcus-vance',
    quote: 'NexGen eliminated the bureaucracy of big digital agencies. We got senior Silicon Valley-grade code quality, unmatched speed, and a direct line to the builder. Our web app latency dropped by 80% on day one.',
    author: 'Marcus Vance',
    role: 'Chief Technology Officer',
    company: 'Strata Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    metric: '0.4s',
    metricLabel: 'Sub-second real-time telemetry load',
    tags: ['React 19', 'Enterprise SaaS', 'Performance']
  },
  {
    id: 'elena-rostova',
    quote: 'The attention to typography, fluid micro-interactions, and checkout speed completely transformed our brand authority. We achieved a 62% cart conversion rate within our first quarter.',
    author: 'Elena Rostova',
    role: 'Head of Brand Experience',
    company: 'Lumina Atelier',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    metric: '+240%',
    metricLabel: 'Increase in Average Order Value',
    tags: ['Headless E-Commerce', 'Shopify API', 'UI/UX']
  },
  {
    id: 'david-thorne',
    quote: 'Founders pitch us every day, and our new web presence immediately communicates that we operate at the bleeding edge. NexGen delivered on-time, on-budget, and without a single surprise invoice.',
    author: 'David Thorne',
    role: 'Managing General Partner',
    company: 'Apex Capital Ventures',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    metric: '+310%',
    metricLabel: 'Surge in high-quality founder dealflow',
    tags: ['Flagship Website', 'Brand Strategy', 'Tailwind']
  },
  {
    id: 'sarah-lin',
    quote: 'Navigating HIPAA compliance while building a silky smooth patient onboarding experience is tough. NexGen handled both the technical compliance and design with remarkable finesse.',
    author: 'Dr. Sarah Lin',
    role: 'Co-Founder & Chief Medical Officer',
    company: 'Novus Health',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    metric: '-68%',
    metricLabel: 'Reduction in patient booking drop-offs',
    tags: ['Full-Stack Web App', 'Telehealth', 'TypeScript']
  }
];

export const clientLogos = [
  { name: 'Strata Cloud', label: 'STRATA' },
  { name: 'Lumina Global', label: 'LUMINA' },
  { name: 'Apex Capital', label: 'APEX VENTURES' },
  { name: 'Novus Health', label: 'NOVUS' },
  { name: 'Khorus AI', label: 'KHORUS LABS' },
  { name: 'Zenith Spaces', label: 'ZENITH' },
];
