import type { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery & Strategic Blueprint',
    duration: 'Week 1',
    tagline: 'De-risking technical decisions before writing a single line of code.',
    description: 'We dig deep into your product vision, target audience friction points, competitive landscape, and technical requirements. We define the tech stack, data models, user flows, and project milestone criteria.',
    deliverables: [
      'Comprehensive Technical Scope & Specification Document',
      'System Architecture & Entity-Relationship Diagram',
      'Fixed-price milestone agreement & timeline roadmap'
    ],
    clientRole: 'A 60-minute kick-off call and review of requirements.'
  },
  {
    number: '02',
    title: 'Interactive Prototyping & UX Architecture',
    duration: 'Week 1–2',
    tagline: 'Crafting high-fidelity visuals that anticipate developer implementation.',
    description: 'We translate scope into an intuitive Figma design system. You test an interactive, clickable prototype of every critical page and workflow to experience the UX before engineering begins.',
    deliverables: [
      'High-fidelity clickable Figma prototype',
      'Complete component design system (colors, typography, responsive states)',
      'Asynchronous Loom walkthrough for team feedback'
    ],
    clientRole: 'Async review of prototype with guided Loom commenting.'
  },
  {
    number: '03',
    title: 'Rapid Engineering & Live Preview Sprints',
    duration: 'Weeks 2–4',
    tagline: 'Clean, type-safe code deployed continuously to private staging environments.',
    description: 'We build your application using modern React, TypeScript, and clean architectural patterns. You get access to a live, password-protected staging URL updated with each milestone so you never wait for a big-bang reveal.',
    deliverables: [
      'Clean, modular, fully commented React & TypeScript codebase',
      'Private Vercel/Cloudflare preview deployment URLs',
      'Weekly 5-minute video updates detailing completed features'
    ],
    clientRole: 'Weekly 15-minute test flight on staging environment.'
  },
  {
    number: '04',
    title: 'Rigorous QA, Core Web Vitals & Security Audit',
    duration: 'Week 4–5',
    tagline: 'Stress-testing for speed, security, and responsive perfection.',
    description: 'Before public deployment, we run end-to-end user journey tests, cross-browser compatibility checks across iOS/Android/macOS/Windows, accessibility checks, and ruthless bundle-size pruning.',
    deliverables: [
      '95+ Google Lighthouse Performance & SEO certification',
      'Cross-browser & cross-device compatibility sign-off',
      'Security review (input sanitization, auth tokens, rate limits)'
    ],
    clientRole: 'Final acceptance review and go-live approval.'
  },
  {
    number: '05',
    title: 'Launch Day & 30-Day Hypercare Warranty',
    duration: 'Launch & Beyond',
    tagline: 'Zero-downtime cutover and hands-on operational support.',
    description: 'We orchestrate domain DNS routing, SSL provisioning, and analytics setup. Following deployment, we provide 30 days of complimentary bug-fix support, video training for your team, and full IP handover.',
    deliverables: [
      'Production DNS & CDN deployment with zero downtime',
      'Full source code repository transfer & GitHub ownership',
      'Recorded video training library for your team',
      '30-day priority bug warranty & uptime monitoring'
    ],
    clientRole: 'Celebrate your new digital product with your customers!'
  }
];
