/**
 * NexGen Solutions - Production API Client
 * Secure communication layer for Public & Admin endpoints.
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface BackendInquiry {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'contacted' | 'scoping' | 'proposal_sent' | 'won' | 'archived';
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
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
  topRequestedServices?: { service: string; count: number }[];
  inquiriesByBudget?: { budget: string; count: number }[];
  totalEstimatesGenerated?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  total?: number;
  filteredTotal?: number;
  count?: number;
}

const TOKEN_KEY = 'nexgen_admin_token';
const USER_KEY = 'nexgen_admin_user';

// Token Management (sessionStorage only - never stored permanently across unauthenticated browser sessions)
export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function logoutAdmin(token?: string | null): Promise<void> {
  const activeToken = token || getStoredAdminToken();
  if (activeToken) {
    try {
      await request('/api/admin/logout', { method: 'POST' }, activeToken);
    } catch {
      // Best-effort backend notification
    }
  }
  clearAdminSession();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Base Fetch Helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  // If endpoint is relative (starts with /), prefix with API_BASE_URL unless API_BASE_URL is empty
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized globally for admin requests
    if (response.status === 401) {
      clearAdminSession();
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(401, errorData.error || 'Authentication required or session expired.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error || `Server responded with status ${response.status}`
      );
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    if (err.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out. Please check your network connection.');
    }
    throw new ApiError(0, err.message || 'Network communication error. Please ensure the backend server is running.');
  }
}

// Public API Endpoints
export async function submitPublicInquiry(inquiryData: {
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
}): Promise<ApiResponse<{ inquiryId: string; email: string; name: string; receivedAt: string }>> {
  return request<ApiResponse<{ inquiryId: string; email: string; name: string; receivedAt: string }>>(
    '/api/inquiries',
    {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    }
  );
}

export async function saveEstimateCalculation(estimateData: {
  productType: string;
  scope: string;
  features: string[];
  timeline: string;
  estimatedCost: string;
  clientName?: string;
  clientEmail?: string;
}): Promise<ApiResponse<{ referenceCode: string }>> {
  return request<ApiResponse<{ referenceCode: string }>>(
    '/api/estimates',
    {
      method: 'POST',
      body: JSON.stringify(estimateData),
    }
  );
}

export async function submitNewsletterSubscription(email: string): Promise<ApiResponse> {
  return request<ApiResponse>('/api/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Admin API Endpoints
export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; token: string; user: AdminUser }> {
  const result = await request<{ success: boolean; token: string; user: AdminUser }>(
    '/api/admin/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );

  if (result.success && result.token && result.user) {
    setAdminSession(result.token, result.user);
  }

  return result;
}

export async function getAdminInquiries(
  token: string,
  params: { status?: string; limit?: number; offset?: number } = {}
): Promise<{ success: boolean; total: number; filteredTotal?: number; count: number; data: BackendInquiry[] }> {
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.offset) searchParams.set('offset', String(params.offset));

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return request<{ success: boolean; total: number; filteredTotal?: number; count: number; data: BackendInquiry[] }>(
    `/api/admin/inquiries${query}`,
    { method: 'GET' },
    token
  );
}

export async function getAdminMetrics(
  token: string
): Promise<{ success: boolean; data: StudioMetrics }> {
  return request<{ success: boolean; data: StudioMetrics }>(
    '/api/admin/metrics',
    { method: 'GET' },
    token
  );
}

export async function updateAdminInquiry(
  token: string,
  id: string,
  updates: { status?: BackendInquiry['status']; internal_notes?: string }
): Promise<{ success: boolean; data: Partial<BackendInquiry> }> {
  return request<{ success: boolean; data: Partial<BackendInquiry> }>(
    `/api/admin/inquiries/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(updates),
    },
    token
  );
}

