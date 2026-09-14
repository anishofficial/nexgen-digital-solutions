import type { PricingTier } from '../types';

export const pricingTiers: PricingTier[] = [
  {
    id: 'frontend-uiux',
    name: 'Front-End & UI/UX Sprint',
    tagline: 'Pixel-perfect UI design translated into blazing fast, accessible frontend code.',
    price: '$4,500',
    period: 'one-time investment',
    timeline: '2–3 weeks delivery',
    description: 'A focused sprint combining bespoke UI/UX Figma design with modern React / Next.js frontend development. Zero bloat, responsive across all viewports, and sub-second rendering.',
    features: [
      'Bespoke UI/UX design in Figma (No generic templates)',
      'Clickable interactive prototype & design token library',
      'Modern Front End Development in React / Next.js & Tailwind CSS',
      'Sub-second page speed & guaranteed 98+ Google Lighthouse score',
      'Semantic, accessible HTML (WCAG AA compliant)',
      'Fluid micro-interactions and responsive screen optimization',
      'Full Git repository ownership & component documentation',
      '30-day post-launch bug warranty'
    ],
    guarantee: '100% on-time milestone delivery or we refund 15% of project fee.',
    ctaText: 'Start Front-End Sprint',
    highlighted: false
  },
  {
    id: 'fullstack-software',
    name: 'Full Stack & Software Solutions',
    badge: 'Most Popular',
    tagline: 'End-to-end web engineering, custom backend architecture, and software solutions.',
    price: '$8,900',
    period: 'one-time investment',
    timeline: '4–6 weeks delivery',
    description: 'Comprehensive full stack web development and custom software solutions. Complete with responsive client UI, secure backend APIs, PostgreSQL database, authentication, and cloud deployment.',
    features: [
      'Full Stack Web Development & system architecture design',
      'Custom Back End Development (Node.js / PostgreSQL / REST / GraphQL)',
      'Secure multi-role authentication (OAuth, magic links, session tokens)',
      'High-performance React/TypeScript dynamic interfaces',
      'Custom Software Solutions tailored to your business workflows',
      'Automated transaction handling, webhooks & third-party integrations',
      'CI/CD automated testing & global edge cloud deployment',
      '100% full source code IP ownership & database schema documentation',
      '60-day post-launch hypercare warranty & direct Slack access'
    ],
    guarantee: 'Zero-surprise fixed quote with weekly working demo builds.',
    ctaText: 'Build Full Stack Product',
    highlighted: true
  },
  {
    id: 'app-development-suite',
    name: 'Mobile App Development',
    badge: 'Native & Cross-Platform',
    tagline: 'Fluid iOS & Android applications built with native performance and clean code.',
    price: '$9,800',
    period: 'one-time investment',
    timeline: '5–8 weeks delivery',
    description: 'From interactive mobile UI/UX to high-performance cross-platform App Development. Deployed and verified for iOS App Store and Google Play Store compliance.',
    features: [
      'Cross-platform mobile App Development (React Native / Expo)',
      'Tailored mobile UI/UX design optimized for touch gestures (60fps)',
      'Biometric authentication (FaceID / Fingerprint) & secure local storage',
      'Offline-first data caching and real-time backend synchronization',
      'Push notifications pipeline & device hardware permissions',
      'App Store & Google Play Store submission & compliance handling',
      'Backend API integration and secure cloud database connection',
      'Complete mobile codebase handover & store publishing transfer'
    ],
    guarantee: 'App Store submission acceptance guarantee or revision until approved.',
    ctaText: 'Kick Off Mobile App',
    highlighted: false
  }
];

export const pricingAddOns = [
  {
    name: 'UI/UX Design System & Tokens',
    price: '+$1,800',
    description: 'Comprehensive Figma component library, wireframes, and interactive prototypes.'
  },
  {
    name: 'Digital Marketing & Technical SEO',
    price: '+$1,600',
    description: 'Keyword search architecture, GA4 event tracking, and conversion funnel optimization.'
  },
  {
    name: 'Custom Merchandise & Swag Kit',
    price: '+$1,200',
    description: 'Bespoke apparel design, print-ready vector tech packs, and factory sourcing.'
  },
  {
    name: 'Custom Software Automation Solution',
    price: '+$2,200',
    description: 'Internal operations dashboard, automated webhook pipeline, and legacy data migration.'
  }
];
