/**
 * @deprecated
 * Legacy mock lead storage has been decommissioned.
 * All admin workflows and public submissions now use the production backend API via `src/utils/api.ts`.
 */

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'contacted' | 'scoping' | 'proposal_sent' | 'won' | 'archived';
  createdAt: string;
}

