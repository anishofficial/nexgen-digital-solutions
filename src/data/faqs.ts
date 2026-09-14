import type { FAQItem } from '../types';

export const faqData: FAQItem[] = [
  {
    id: 'who-builds',
    question: 'Who will actually be building my website or application?',
    answer: 'Unlike traditional agencies that sell you with a senior partner and outsource your project to junior interns, at NexGen you collaborate directly with a senior freelance full-stack engineer and designer. Every line of code and design token is crafted by seasoned hands with 8+ years of production experience.',
    category: 'General & Engagement'
  },
  {
    id: 'ownership-ip',
    question: 'Who owns the intellectual property and code when we finish?',
    answer: 'You own 100% of everything upon final milestone payment. This includes the entire Git repository, Figma design files, domain configurations, custom code, and deployment scripts. There are zero proprietary vendor lock-ins or licensing fees.',
    category: 'Pricing & IP'
  },
  {
    id: 'payment-terms',
    question: 'What are your payment terms and milestone structures?',
    answer: 'For fixed-scope projects (Launchpad Websites & Custom Web Apps), we typically work on a 50% kick-off deposit and 50% upon final delivery and acceptance. For larger enterprise builds, we split into three milestones: 40% kick-off, 30% functional staging build, and 30% final deployment.',
    category: 'Pricing & IP'
  },
  {
    id: 'timeline-guarantee',
    question: 'How long does a typical project take from start to finish?',
    answer: 'A high-conversion marketing flagship website typically takes 2 to 3 weeks. A complex full-stack web application or custom SaaS MVP takes 4 to 6 weeks. We commit to firm calendar delivery dates in writing and provide weekly progress builds.',
    category: 'General & Engagement'
  },
  {
    id: 'tech-stack-choice',
    question: 'Why do you prioritize React, TypeScript, Next.js and Tailwind CSS?',
    answer: 'This modern ecosystem provides the gold standard balance of developer velocity, rock-solid type safety, top-tier performance, and global hiring compatibility. If you ever hire an in-house engineering team later, they will immediately be able to navigate and expand the codebase with zero friction.',
    category: 'Engineering & Stack'
  },
  {
    id: 'client-feedback',
    question: 'How much time will I need to invest during the project?',
    answer: 'We respect your time. Outside of a 60-minute initial discovery session, we primarily operate asynchronously via Loom video walkthroughs and a dedicated Slack channel. Most founders spend under 1.5 hours per week reviewing live previews and providing feedback.',
    category: 'General & Engagement'
  },
  {
    id: 'post-launch-support',
    question: 'What happens after the website goes live? Do you leave us hanging?',
    answer: 'Never. Every project includes a 30-day hypercare warranty covering any unforeseen bugs or browser edge cases completely free of charge. After that, we offer flexible on-demand engineering retainers or ad-hoc support packages.',
    category: 'Post-Launch & Growth'
  },
  {
    id: 'hosting-infrastructure',
    question: 'Where will my website or web app be hosted?',
    answer: 'We deploy to high-performance, globally distributed edge infrastructure such as Vercel, AWS, or Cloudflare, paired with managed database providers like Supabase or Neon. We set up everything under your own company accounts so you retain total control.',
    category: 'Engineering & Stack'
  }
];
