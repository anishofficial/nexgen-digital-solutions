import type { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: 'full-stack-web',
    iconName: 'LayoutGrid',
    title: 'Full Stack Web Development',
    tagline: 'End-to-end web applications engineered with modern frontend and scalable backends.',
    description: 'Complete architectural execution from intuitive reactive client interfaces to high-throughput backend APIs, databases, authentication, and cloud infrastructure.',
    deliverables: [
      'Production-ready React / Next.js / TypeScript application',
      'Scalable database design (PostgreSQL / Supabase) & REST/GraphQL APIs',
      'Role-based access control, secure OAuth & session management',
      'Automated testing suites and continuous CI/CD deployment'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    bestFor: 'Founders and businesses requiring complete, production-ready web platforms from scratch.',
    timeline: '3 to 6 weeks'
  },
  {
    id: 'app-development',
    iconName: 'Smartphone',
    title: 'App Development',
    tagline: 'Native-feel iOS, Android, and cross-platform mobile applications.',
    description: 'We build fluid, high-performance mobile apps with 60fps gesture navigation, offline synchronization, device hardware integration, and store compliance.',
    deliverables: [
      'Cross-platform React Native / Expo production codebase',
      'iOS App Store & Google Play Store submission setup',
      'Biometric authentication, push notifications & offline storage',
      'Real-time backend data synchronization and webhook triggers'
    ],
    technologies: ['React Native', 'Expo', 'TypeScript', 'iOS / Android', 'Tailwind', 'Mobile APIs'],
    bestFor: 'Businesses needing mobile products for consumer audiences or specialized workforce apps.',
    timeline: '4 to 8 weeks'
  },
  {
    id: 'frontend-development',
    iconName: 'Monitor',
    title: 'Front End Development',
    tagline: 'Pixel-perfect, accessible, and reactive user interfaces that load in milliseconds.',
    description: 'Transforming designs into modular, clean, and responsive frontend code. We obsess over sub-second rendering, fluid micro-interactions, Core Web Vitals, and WCAG AA accessibility.',
    deliverables: [
      'Type-safe React / Next.js modular component architecture',
      'Pixel-accurate responsive layouts across all mobile, tablet, and desktop screens',
      'Guaranteed 98+ Google Lighthouse Performance & SEO score',
      'Accessible semantic HTML with smooth transitions and micro-interactions'
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vite', 'Framer Motion'],
    bestFor: 'Companies with existing designs or backends that require top-tier frontend execution.',
    timeline: '2 to 4 weeks'
  },
  {
    id: 'backend-development',
    iconName: 'Database',
    title: 'Back End Development',
    tagline: 'High-throughput APIs, rock-solid database architectures, and cloud services.',
    description: 'Engineering secure, resilient backend engines that power mission-critical operations. We handle relational data schemas, serverless workflows, caching, and external service integrations.',
    deliverables: [
      'Clean RESTful & GraphQL API design with comprehensive documentation',
      'PostgreSQL schema architecture, indexing & data migration pipelines',
      'Robust security: rate limiting, token encryption & access auditing',
      'Payment gateways (Stripe), webhooks, and third-party API integrations'
    ],
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Supabase / AWS'],
    bestFor: 'Products requiring high concurrency, ironclad data integrity, and secure business logic.',
    timeline: '2 to 5 weeks'
  },
  {
    id: 'ui-ux-design',
    iconName: 'Layers',
    title: 'UI/UX Design',
    tagline: 'User-centric interfaces and cohesive design systems that maximize retention.',
    description: 'We design digital products that users genuinely enjoy using. Through user journey mapping, wireframing, high-fidelity Figma prototypes, and complete design tokens, we bridge concept to code.',
    deliverables: [
      'User journey mapping & high-fidelity clickable Figma prototype',
      'Complete Atomic Design Token library (colors, typography, grid, states)',
      'WCAG AA/AAA compliant accessible component patterns',
      'Developer-ready specifications and design token exports'
    ],
    technologies: ['Figma', 'Design Systems', 'Interactive Prototyping', 'WCAG AA', 'Design Tokens'],
    bestFor: 'New ventures and existing platforms looking to elevate visual prestige and usability.',
    timeline: '2 to 3 weeks'
  },
  {
    id: 'digital-marketing',
    iconName: 'TrendingUp',
    title: 'Digital Marketing',
    tagline: 'Data-driven growth strategies, technical SEO, and conversion optimization.',
    description: 'Building a great product is only half the battle. We drive qualified acquisition through technical SEO, conversion rate optimization (CRO), high-impact landing pages, and growth funnels.',
    deliverables: [
      'Technical SEO audit, Schema markup & search engine indexation',
      'Conversion rate optimization (CRO) audits & landing page A/B tests',
      'Customer acquisition funnel strategy & tracking setup (GA4, PostHog)',
      'Performance marketing creative guidelines & campaign assets'
    ],
    technologies: ['Google Analytics 4', 'Technical SEO', 'PostHog', 'Conversion CRO', 'Schema.org'],
    bestFor: 'Brands looking to scale organic and paid customer acquisition and improve conversion rates.',
    timeline: '2 to 4 weeks or monthly sprint'
  },
  {
    id: 'custom-merchandise',
    iconName: 'Sparkles',
    title: 'Custom Merchandise',
    tagline: 'Premium branded apparel, physical goods, and packaging for modern tech brands.',
    description: 'Extend your brand identity into the physical world. We design and curate luxury custom company apparel, founder gear, event kits, packaging, and branded physical touchpoints.',
    deliverables: [
      'Bespoke apparel & merchandise design (hoodies, tees, accessories, tech gear)',
      'Production-ready vector tech packs, print specs & factory mockups',
      'Premium supplier sourcing guidance & sustainable material curation',
      'Online merchandise store integration and fulfillment guidance'
    ],
    technologies: ['Vector Design', 'Print Tech Packs', 'Brand Identity', 'Apparel Design', 'Shopify Merch'],
    bestFor: 'Tech startups, developer communities, and creator brands building loyal physical identity.',
    timeline: '1 to 3 weeks'
  },
  {
    id: 'software-solutions',
    iconName: 'Code2',
    title: 'Software Solutions',
    tagline: 'Custom internal tools, workflow automation, and enterprise integrations.',
    description: 'Bespoke software tailored precisely to eliminate operational bottlenecks. From workflow automation engines and custom portals to legacy codebase refactoring and integration bridges.',
    deliverables: [
      'Custom operational portals, administrative dashboards & analytics tools',
      'Business process automation pipelines & multi-platform webhook bridges',
      'Legacy software modernization and security patch refactoring',
      'Custom desktop or cloud utilities built to solve specific operational hurdles'
    ],
    technologies: ['TypeScript', 'Python', 'Node.js', 'PostgreSQL', 'Docker', 'Automation APIs'],
    bestFor: 'Companies needing tailored software solutions that off-the-shelf SaaS cannot solve.',
    timeline: '3 to 6 weeks'
  }
];
