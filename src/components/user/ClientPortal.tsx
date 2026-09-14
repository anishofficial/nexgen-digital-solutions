import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  ArrowLeft, 
  Calculator, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const ClientPortal: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please sign in or create an account to view your client dashboard.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="md" href="/login">
              Sign In to Your Account
            </Button>
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Studio</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">NexGen Client Space</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
                Client Member
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-36 h-36 text-cyan-400" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Studio Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hello, {user.name || 'Client Partner'}! 👋
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Welcome to your NexGen client portal. From here you can start new digital projects, configure instant cost estimates, and track your inquiry status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                href="/#estimator"
                icon={<Calculator className="w-4 h-4" />}
              >
                Launch Estimator
              </Button>
              <Button
                variant="secondary"
                size="md"
                href="/#contact"
                icon={<Send className="w-4 h-4" />}
              >
                Submit New Brief
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Details & Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Account Profile Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-sm">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{user.name || 'Client'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Account Type</span>
                <span className="text-slate-200 font-medium capitalize">{user.role || 'Client Member'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Security</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" /> JWT Authenticated
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account ID</span>
                <span className="text-slate-400 font-mono text-[11px] truncate max-w-[150px]">{user.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Instant Estimator</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Project Scope Calculator</h3>
              <p className="text-xs text-slate-400 mb-4">
                Calculate real-time engineering timelines, infrastructure costs, and delivery milestones for web, mobile, and AI systems.
              </p>
            </div>
            <Link
              to="/#estimator"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all"
            >
              Configure an Estimate →
            </Link>
          </div>

          {/* Project Discussion */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Direct Advisory</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Schedule Sprint Briefing</h3>
              <p className="text-xs text-slate-400 mb-4">
                Discuss custom architectural blueprints directly with our principal engineers and design leads.
              </p>
            </div>
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all"
            >
              Book Project Review →
            </Link>
          </div>
        </div>

        {/* Client Workspace Guide */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>NexGen Studio Client Workflow</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="font-semibold text-white block mb-1">1. Scope Definition</span>
              Choose the exact technical features and delivery cadence suited for your product roadmap.
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="font-semibold text-white block mb-1">2. Architecture & Sprint</span>
              Receive a production blueprint within 24 hours including cost breakdown and sprint deliverables.
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <span className="font-semibold text-white block mb-1">3. Production Launch</span>
              Deploy zero-downtime, fully audited web applications with CI/CD and automated monitoring.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
