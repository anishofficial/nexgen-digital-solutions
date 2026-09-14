import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  // Mode state: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [smartRedirectNotice, setSmartRedirectNotice] = useState<string | null>(null);

  // Sync mode if initialMode prop changes (e.g. navigating from /login to /signup)
  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('signin');
    }
  }, [location.pathname]);

  // If already authenticated, redirect to home or client portal
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = (location.state as any)?.from || '/';
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setSmartRedirectNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSmartRedirectNotice(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await login(email, password, rememberMe);

        if (result.success) {
          setSuccessMessage('Welcome back! Redirecting to your studio space...');
          setTimeout(() => {
            const destination = (location.state as any)?.from || '/';
            navigate(destination);
          }, 800);
        } else if (result.notFound) {
          // Smart switch: account doesn't exist yet -> automatically switch to Sign Up with email intact
          setMode('signup');
          setSmartRedirectNotice(
            `No account exists for "${email}" yet. We've switched you to Sign Up — please confirm your details to create your account!`
          );
        } else {
          setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
        }
      } else {
        // Sign Up
        const result = await register(email, password, name);

        if (result.success) {
          setSuccessMessage('Account created successfully! Welcome to NexGen Studio.');
          setTimeout(() => {
            const destination = (location.state as any)?.from || '/';
            navigate(destination);
          }, 900);
        } else {
          setErrorMessage(result.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top navigation link back to home */}
      <div className="max-w-md w-full mx-auto mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Secure Client Access
        </span>
      </div>

      <div className="max-w-md w-full mx-auto">
        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Card Top Border Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4 group">
              <div className="w-11 h-11 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
                <img src="/logo-icon.png" alt="NexGen" className="w-full h-full object-contain" />
              </div>
              <img src="/nexgen-wordmark.png" alt="NEXGEN" className="brand-wordmark h-5 w-auto object-contain" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              {mode === 'signin'
                ? 'Sign in to access your estimates, projects, and custom quotes.'
                : 'Join NexGen Studio to manage digital projects and instant estimates.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Smart Switch Notification Banner */}
          {smartRedirectNotice && (
            <div className="mb-6 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-start gap-3 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-cyan-300">Account Not Found</p>
                <p className="mt-0.5 text-slate-300 leading-relaxed">{smartRedirectNotice}</p>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {mode === 'signin' && errorMessage.toLowerCase().includes('no account') && (
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="block mt-1 text-cyan-300 underline font-semibold hover:text-cyan-200"
                  >
                    Click here to sign up instead →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
            {/* Name input (Sign Up mode only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5 animate-fadeIn">
                <label htmlFor="name" className="block text-xs font-medium text-slate-300">
                  Full Name <span className="text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-slate-300">
                Work or Personal Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={mode === 'signin' ? 'current-password' : 'new-password'} className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === 'signup' && (
                  <span className="text-[11px] text-slate-500">Min 6 characters</span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id={mode === 'signin' ? 'current-password' : 'new-password'}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign in extra options */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/40"
                  />
                  <span>Keep me signed in</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Need an account?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{mode === 'signin' ? 'Authenticating...' : 'Creating Account...'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{mode === 'signin' ? 'Sign In to Studio' : 'Create NexGen Account'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Mode Switch Footer Link */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            {mode === 'signin' ? (
              <p>
                Haven't joined yet?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signup')}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 underline underline-offset-2 ml-1"
                >
                  Create free account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleModeChange('signin')}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 underline underline-offset-2 ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Admin Link at the bottom */}
        <div className="text-center mt-6">
          <Link
            to="/admin"
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors inline-flex items-center gap-1"
          >
            <span>Studio Team Member?</span>
            <span className="underline">Access Admin Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
