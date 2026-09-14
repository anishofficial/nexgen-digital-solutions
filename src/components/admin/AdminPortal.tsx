import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  adminLogin, 
  logoutAdmin,
  getAdminInquiries, 
  getAdminMetrics, 
  updateAdminInquiry, 
  getStoredAdminToken, 
  getStoredAdminUser, 
  type BackendInquiry,
  type StudioMetrics,
  type AdminUser
} from '../../utils/api';
import { ThemeToggle } from '../ui/ThemeToggle';
import { 
  Lock, 
  LogOut, 
  ArrowLeft, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  AlertCircle, 
  Mail, 
  Download, 
  X, 
  Layers, 
  Server, 
  Activity, 
  Eye, 
  ExternalLink,
  RefreshCw,
  Edit3
} from 'lucide-react';


const STATUS_LABELS: Record<BackendInquiry['status'], { label: string; bg: string; text: string; border: string }> = {
  new: { label: 'New', bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  contacted: { label: 'Contacted', bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30' },
  scoping: { label: 'Scoping', bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  proposal_sent: { label: 'Proposal Sent', bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  won: { label: 'Won Contract', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  archived: { label: 'Archived', bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
};

export const AdminPortal: React.FC = () => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => getStoredAdminToken());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getStoredAdminUser());
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'services' | 'logs'>('overview');
  const [inquiries, setInquiries] = useState<BackendInquiry[]>([]);
  const [metrics, setMetrics] = useState<StudioMetrics | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<BackendInquiry | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Fetch metrics & inquiries using verified token
  const loadDashboardData = useCallback(async (authToken: string) => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      const [metricsRes, inquiriesRes] = await Promise.all([
        getAdminMetrics(authToken),
        getAdminInquiries(authToken, { limit: 100 }),
      ]);

      if (metricsRes.success && metricsRes.data) {
        setMetrics(metricsRes.data);
      }
      if (inquiriesRes.success && Array.isArray(inquiriesRes.data)) {
        setInquiries(inquiriesRes.data);
      }
    } catch (err: any) {
      if (err.status === 401) {
        setToken(null);
        setCurrentUser(null);
        setAuthError('Your session has expired. Please sign in again.');
      } else {
        setDataError(err.message || 'Failed to load dashboard data from backend server.');
      }
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Validate session on mount or token change
  useEffect(() => {
    let isCancelled = false;
    if (!token) return;

    Promise.all([
      getAdminMetrics(token),
      getAdminInquiries(token, { limit: 100 }),
    ])
      .then(([metricsRes, inquiriesRes]) => {
        if (isCancelled) return;
        if (metricsRes.success && metricsRes.data) {
          setMetrics(metricsRes.data);
        }
        if (inquiriesRes.success && Array.isArray(inquiriesRes.data)) {
          setInquiries(inquiriesRes.data);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        if (err.status === 401) {
          setToken(null);
          setCurrentUser(null);
          setAuthError('Your session has expired. Please sign in again.');
        } else {
          setDataError(err.message || 'Failed to load dashboard data from backend server.');
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);


  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Please enter both your admin email and password.');
      return;
    }

    setAuthError('');
    setIsLoggingIn(true);

    try {
      const response = await adminLogin(authEmail.trim(), authPassword);
      if (response.success && response.token) {
        setToken(response.token);
        setCurrentUser(response.user);
        setAuthPassword('');
      } else {
        setAuthError('Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin(token);
    setToken(null);
    setCurrentUser(null);
    setInquiries([]);
    setMetrics(null);
    setSelectedInquiry(null);
    setAuthError('');
  };

  // Status changes
  const handleStatusChange = async (id: string, newStatus: BackendInquiry['status']) => {
    if (!token) return;

    try {
      await updateAdminInquiry(token, id, { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Save internal notes
  const handleSaveNotes = async (id: string) => {
    if (!token) return;
    setIsSavingNote(true);

    try {
      await updateAdminInquiry(token, id, { internal_notes: noteContent });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, internalNotes: noteContent } : inq));
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, internalNotes: noteContent } : null);
      }
      setEditingNotesId(null);
    } catch (err: any) {
      alert(`Failed to save internal notes: ${err.message}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Inquiry ID', 'Client Name', 'Email', 'Company', 'Services', 'Budget', 'Timeline', 'Status', 'Received Date'];
    const rows = inquiries.map(inq => [
      inq.id,
      `"${inq.name}"`,
      `"${inq.email}"`,
      `"${inq.company || ''}"`,
      `"${(inq.services || []).join('; ')}"`,
      `"${inq.budget}"`,
      `"${inq.timeline}"`,
      inq.status,
      new Date(inq.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `nexgen-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;

      const matchesSearch = 
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        (inq.services || []).some(s => s.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, searchQuery]);

  // Navigate to Public Site
  const navigateToHome = () => {
    window.location.href = '/';
  };

  // =========================================================================
  // 1. SECURE LOGIN SCREEN (When No Valid Session Exists)
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        {/* Dynamic ambient gradients */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Back to Public Site */}
        <button
          onClick={navigateToHome}
          className="absolute top-6 left-6 flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-850 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10">
          {/* Logo Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative flex items-center justify-center w-14 h-14 mb-3">
              <img
                src="/logo-icon.png"
                alt="NexGen Solutions"
                className="w-14 h-14 object-contain drop-shadow-[0_0_18px_rgba(6,182,212,0.5)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/nexgen-wordmark.png"
                alt="NEXGEN"
                className="brand-wordmark h-6 w-auto object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.35)]"
              />
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Secure production authentication required for studio management.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                disabled={isLoggingIn}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoggingIn}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Session is encrypted with JWT and stored in temporary browser session memory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED PRODUCTION ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col transition-colors duration-300">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 flex-shrink-0">
              <img
                src="/logo-icon.png"
                alt="NexGen Solutions"
                className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <img
                src="/nexgen-wordmark.png"
                alt="NEXGEN"
                className="brand-wordmark h-5 w-auto object-contain"
              />
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold tracking-wider">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              {currentUser ? `Signed in as: ${currentUser.name} (${currentUser.email})` : 'Production Backend Live'}
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadDashboardData(token)}
            title="Refresh Data"
            disabled={isLoadingData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <ThemeToggle />

          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {dataError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{dataError}</span>
            </div>
            <button
              onClick={() => loadDashboardData(token)}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview & Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
              activeTab === 'inquiries'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inbound Inquiries</span>
            {metrics && metrics.newInquiries > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-bold">
                {metrics.newInquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>8 Disciplines Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Server Telemetry</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PIPELINE */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-nexgen-card border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Total Inbound Leads</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {metrics ? metrics.totalInquiries : inquiries.length}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span>{metrics ? `+${metrics.monthlyGrowthPercent}% vs last month` : 'Live synchronized'}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-nexgen-card border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Active Pipeline Value</span>
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ${metrics ? metrics.activePipelineValue.toLocaleString() : '0'}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                  <span>Average deal size: ${metrics ? metrics.averageDealSize.toLocaleString() : '0'}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-nexgen-card border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>New Leads Triage</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {metrics ? metrics.newInquiries : inquiries.filter(i => i.status === 'new').length} New
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Awaiting scope review & roadmap call
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-nexgen-card border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Won Contracts</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ${metrics ? metrics.wonContractsValue.toLocaleString() : '0'}
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Conversion rate: {metrics ? `${metrics.conversionRate}%` : '0%'}
                </div>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="p-6 rounded-2xl bg-nexgen-card border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Latest Client Submissions</h3>
                  <p className="text-xs text-slate-400">Directly synchronized from the public API database</p>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium hover:underline cursor-pointer"
                >
                  View All ({inquiries.length}) →
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  {isLoadingData ? 'Loading inquiries from backend...' : 'No inquiries recorded in database yet.'}
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {inquiries.slice(0, 5).map((inq) => {
                    const statusInfo = STATUS_LABELS[inq.status] || STATUS_LABELS.new;
                    return (
                      <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{inq.name}</span>
                            {inq.company && (
                              <span className="text-xs font-mono text-slate-400">@{inq.company}</span>
                            )}
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-1">{inq.message}</p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-xs font-mono text-cyan-300 font-semibold">{inq.budget}</span>
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setActiveTab('inquiries');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs text-slate-200 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search & Filter */}
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, company, email, service..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Statuses ({inquiries.length})</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scoping">Scoping</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won Contract</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  disabled={inquiries.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="rounded-2xl bg-nexgen-card border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Client / Company</th>
                      <th className="py-3 px-4">Requested Disciplines</th>
                      <th className="py-3 px-4">Budget</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Received</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          {isLoadingData ? 'Fetching records from database...' : 'No client inquiries found matching your filters.'}
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => {
                        const statusInfo = STATUS_LABELS[inq.status] || STATUS_LABELS.new;
                        return (
                          <tr key={inq.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white">{inq.name}</div>
                              <div className="text-[11px] text-slate-400">{inq.email}</div>
                              {inq.company && (
                                <div className="text-[10px] text-cyan-400/90 font-mono">@{inq.company}</div>
                              )}
                            </td>
                            <td className="py-3 px-4 max-w-[200px]">
                              <div className="flex flex-wrap gap-1">
                                {(inq.services || []).map((s, idx) => (
                                  <span key={idx} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-cyan-300">
                              {inq.budget}
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {inq.timeline}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={inq.status}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value as BackendInquiry['status'])}
                                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="scoping">Scoping</option>
                                <option value="proposal_sent">Proposal Sent</option>
                                <option value="won">Won Contract</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedInquiry(inq)}
                                title="Inspect Lead Details"
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 8 DISCIPLINES CATALOG */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-nexgen-card border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">NexGen Studio 8 Disciplines Architecture</h3>
              <p className="text-xs text-slate-400 mb-5">Verified active engineering disciplines deployed across client sprint contracts.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Full Stack Web Development', rate: 'From $6,500', turnaround: '2-4 weeks', stack: 'React, Next.js, Node, PostgreSQL, Tailwind' },
                  { name: 'App Development', rate: 'From $8,000', turnaround: '3-6 weeks', stack: 'React Native, Expo, Swift, Kotlin' },
                  { name: 'Front End Development', rate: 'From $4,500', turnaround: '1-3 weeks', stack: 'TypeScript, Tailwind, WebGL, High Refresh Motion' },
                  { name: 'Back End Development', rate: 'From $5,500', turnaround: '2-4 weeks', stack: 'Node, Express, Go, GraphQL, Redis, AWS' },
                  { name: 'UI/UX Design', rate: 'From $3,800', turnaround: '1-2 weeks', stack: 'Figma Systems, Design Tokens, Micro-interactions' },
                  { name: 'Digital Marketing', rate: 'From $3,000/mo', turnaround: 'Ongoing Sprints', stack: 'SEO, SEM, Funnels, Conversion Analytics' },
                  { name: 'Custom Merchandise', rate: 'From $2,500', turnaround: '2-3 weeks', stack: '3D Renderings, Apparel, Tech Merch Sourcing' },
                  { name: 'Software Solutions', rate: 'From $9,500', turnaround: '4-8 weeks', stack: 'Enterprise ERP, Telemetry, AI Pipelines' },
                ].map((disc, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white mb-1">{disc.name}</div>
                      <div className="text-[11px] font-mono text-cyan-300 font-semibold mb-2">{disc.rate}</div>
                      <div className="text-[10px] text-slate-400">Standard SLA: {disc.turnaround}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                      {disc.stack}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM LOGS & TELEMETRY */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>Production Telemetry & Audit Feed</span>
                </span>
                <span className="text-emerald-400 font-bold">● SYSTEM HEALTHY</span>
              </div>

              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">[AUTH]</span>
                  <span className="text-cyan-400">JWT</span>
                  <span>Administrator session authenticated via secure Bearer token.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">[DATABASE]</span>
                  <span className="text-emerald-400">SQLITE</span>
                  <span>Database initialized with WAL mode & foreign keys enabled. Total records: {inquiries.length}.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">[SECURITY]</span>
                  <span className="text-indigo-400">HELMET</span>
                  <span>Strict Content-Security-Policy & CORS origin allowlist enforced.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">[RATE_LIMIT]</span>
                  <span className="text-amber-400">ACTIVE</span>
                  <span>Protection enabled on login, inquiry submissions, and newsletter endpoints.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LEAD DETAIL MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedInquiry(null);
                setEditingNotesId(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                {selectedInquiry.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-400">{selectedInquiry.email}</p>
              </div>
            </div>

            <div className="space-y-4 py-4 border-y border-slate-800/80 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Company / Project:</span>
                  <div className="font-semibold text-white mt-0.5">{selectedInquiry.company || 'Direct Founder'}</div>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Budget Allocation:</span>
                  <div className="font-mono text-cyan-300 font-bold mt-0.5">{selectedInquiry.budget}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-mono text-[10px]">Requested Disciplines:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedInquiry.services || []).map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-mono text-[10px]">Project Scope & Vision:</span>
                <div className="mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Internal Studio Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-500 uppercase font-mono text-[10px]">Internal Architect Notes:</span>
                  {editingNotesId !== selectedInquiry.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(selectedInquiry.id);
                        setNoteContent(selectedInquiry.internalNotes || '');
                      }}
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{selectedInquiry.internalNotes ? 'Edit Notes' : 'Add Notes'}</span>
                    </button>
                  )}
                </div>

                {editingNotesId === selectedInquiry.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Add internal notes about this client inquiry..."
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(selectedInquiry.id)}
                        disabled={isSavingNote}
                        className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-1"
                      >
                        {isSavingNote ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-400 italic">
                    {selectedInquiry.internalNotes || 'No internal notes added yet.'}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500 font-mono text-[11px]">Timeline: {selectedInquiry.timeline}</span>
                <span className="text-slate-500 font-mono text-[11px]">{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <a
                href={`mailto:${selectedInquiry.email}?subject=NexGen Solutions — Project Scope & Architecture Proposal`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Email Client Directly</span>
              </a>

              <div className="flex items-center gap-2">
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as BackendInquiry['status'])}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scoping">Scoping</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won Contract</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
