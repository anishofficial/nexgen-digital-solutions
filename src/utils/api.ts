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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: string;
}

export interface UserAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
  notFound?: boolean;
  code?: string;
  error?: string;
}

const ADMIN_TOKEN_KEY = 'nexgen_admin_token';
const ADMIN_USER_KEY = 'nexgen_admin_user';

const USER_TOKEN_KEY = 'nexgen_user_token';
const USER_PROFILE_KEY = 'nexgen_user_profile';

// Admin Token Management
export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(token: string, user: AdminUser): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
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

// User Client Token Management (localStorage with sessionStorage fallback)
export function getStoredUserToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_TOKEN_KEY) || sessionStorage.getItem(USER_TOKEN_KEY);
}

export function getStoredUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_PROFILE_KEY) || sessionStorage.getItem(USER_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUserSession(token: string, user: UserProfile, rememberMe = true): void {
  if (typeof window === 'undefined') return;
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_TOKEN_KEY, token);
  storage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  if (rememberMe) {
    sessionStorage.removeItem(USER_TOKEN_KEY);
    sessionStorage.removeItem(USER_PROFILE_KEY);
  }
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
  sessionStorage.removeItem(USER_TOKEN_KEY);
  sessionStorage.removeItem(USER_PROFILE_KEY);
}

export async function logoutUser(token?: string | null): Promise<void> {
  const activeToken = token || getStoredUserToken();
  if (activeToken) {
    try {
      await request('/api/auth/logout', { method: 'POST' }, activeToken);
    } catch {
      // Safe cleanup
    }
  }
  clearUserSession();
}

export class ApiError extends Error {
  status: number;
  code?: string;
  notFound?: boolean;

  constructor(status: number, message: string, code?: string, notFound?: boolean) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.notFound = notFound;
  }
}

// Base Fetch Helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
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
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && endpoint.startsWith('/api/admin') && !endpoint.includes('/login')) {
        clearAdminSession();
      }
      throw new ApiError(
        response.status,
        data.error || data.message || `Server responded with status ${response.status}`,
        data.code,
        Boolean(data.notFound || response.status === 404)
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

// User Client Authentication Endpoints
export async function userRegister(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; token: string; user: UserProfile; message?: string }> {
  const result = await request<{ success: boolean; token: string; user: UserProfile; message?: string }>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }
  );

  if (result.success && result.token && result.user) {
    setUserSession(result.token, result.user, true);
  }

  return result;
}

export async function userLogin(
  email: string,
  password: string,
  rememberMe = true
): Promise<{ success: boolean; token: string; user: UserProfile; message?: string }> {
  const result = await request<{ success: boolean; token: string; user: UserProfile; message?: string }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );

  if (result.success && result.token && result.user) {
    setUserSession(result.token, result.user, rememberMe);
  }

  return result;
}

export async function userGetMe(
  token: string
): Promise<{ success: boolean; user: UserProfile }> {
  return request<{ success: boolean; user: UserProfile }>(
    '/api/auth/me',
    { method: 'GET' },
    token
  );
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

