export type InquiryStatus = 
  | 'new' 
  | 'contacted' 
  | 'scoping' 
  | 'proposal_sent' 
  | 'won' 
  | 'archived';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  status: InquiryStatus;
  internal_notes?: string | null;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Estimate {
  id: string;
  reference_code: string;
  product_type: string;
  scope: string;
  features: string[];
  timeline: string;
  estimated_cost: string;
  client_name?: string | null;
  client_email?: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'architect';
  password_hash: string;
  created_at: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface AuthTokenPayload {
  sub: string;
  userId?: string;
  email: string;
  name: string;
  role: string;
}

export interface StudioMetrics {
  totalInquiries: number;
  newInquiries: number;
  activePipelineValue: number;
  wonContractsValue: number;
  conversionRate: number;
  averageDealSize: number;
  inquiriesByStatus: Record<string, number>;
  monthlyGrowthPercent: number;
  averageTurnaroundDays: number;
  topRequestedServices: { service: string; count: number }[];
  inquiriesByBudget: { budget: string; count: number }[];
  totalEstimatesGenerated: number;
}

