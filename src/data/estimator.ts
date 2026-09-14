export interface ScopeCategory {
  id: string;
  name: string;
  description: string;
  options: {
    id: string;
    label: string;
    description: string;
    price: number;
    days: number;
  }[];
}

export const estimatorCategories: ScopeCategory[] = [
  {
    id: 'project-type',
    name: '1. Which core development service do you need?',
    description: 'Select your primary engineering discipline.',
    options: [
      {
        id: 'full-stack-web',
        label: 'Full Stack Web Development',
        description: 'Complete web product with modern reactive frontend, database, API & auth.',
        price: 8500,
        days: 28
      },
      {
        id: 'app-development',
        label: 'App Development (iOS & Android)',
        description: 'Cross-platform mobile application with offline sync, notifications & store compliance.',
        price: 9800,
        days: 35
      },
      {
        id: 'frontend-development',
        label: 'Front End Development',
        description: 'Pixel-perfect, accessible React/Next.js UI implementation with sub-second performance.',
        price: 4500,
        days: 16
      },
      {
        id: 'backend-development',
        label: 'Back End Development',
        description: 'Scalable REST/GraphQL APIs, database architectures, security & cloud infrastructure.',
        price: 5200,
        days: 18
      },
      {
        id: 'software-solutions',
        label: 'Software Solutions',
        description: 'Custom internal tools, workflow automation engines, and system integrations.',
        price: 6800,
        days: 22
      }
    ]
  },
  {
    id: 'scale',
    name: '2. What is the scope & screen complexity?',
    description: 'Select the scale of user workflows and unique interfaces required.',
    options: [
      {
        id: 'streamlined',
        label: 'Essential & Streamlined (1–4 core views)',
        description: 'Lean, ultra-focused experience without unnecessary bloat.',
        price: 0,
        days: 0
      },
      {
        id: 'standard',
        label: 'Comprehensive (5–9 unique views)',
        description: 'Full multi-step customer journey, dashboards, and role states.',
        price: 1500,
        days: 6
      },
      {
        id: 'complex',
        label: 'Enterprise / Deep App (10+ views & dynamic states)',
        description: 'Complex nested layouts, multi-tenant views, and advanced data visualization.',
        price: 3400,
        days: 12
      }
    ]
  },
  {
    id: 'features',
    name: '3. Add-on specialized disciplines (Select multiple)',
    description: 'Bundle design, marketing, merchandise, or technical modules.',
    options: [
      {
        id: 'ui-ux-design',
        label: 'UI/UX Design System & Prototypes',
        description: 'Clickable Figma prototype, user journey mapping, and complete design tokens.',
        price: 1800,
        days: 7
      },
      {
        id: 'digital-marketing',
        label: 'Digital Marketing & Technical SEO',
        description: 'Conversion funnel optimization, GA4 tracking, and search engine indexation.',
        price: 1600,
        days: 5
      },
      {
        id: 'custom-merchandise',
        label: 'Custom Merchandise & Swag Kit',
        description: 'Premium branded apparel design, vector production tech packs, and supplier curation.',
        price: 1200,
        days: 4
      },
      {
        id: 'database-api',
        label: 'Advanced Database & Cloud APIs',
        description: 'Custom microservice endpoints, webhook reconciliation, and automated cron jobs.',
        price: 1400,
        days: 4
      }
    ]
  },
  {
    id: 'speed',
    name: '4. Delivery velocity requirement',
    description: 'How urgently do you need this deployed to production?',
    options: [
      {
        id: 'standard-pace',
        label: 'Standard Sprint Cadence (Recommended)',
        description: 'Balanced sprint cycles with thorough async feedback loops.',
        price: 0,
        days: 0
      },
      {
        id: 'express-fastrack',
        label: 'Fast-Track Priority Sprint',
        description: 'Dedicated daily progress releases, front-of-queue engineering focus.',
        price: 1800,
        days: -7
      }
    ]
  }
];
