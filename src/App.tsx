import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Portfolio } from './components/sections/Portfolio';
import { Process } from './components/sections/Process';
import { CostEstimator } from './components/sections/CostEstimator';
import { Pricing } from './components/sections/Pricing';
import { About } from './components/sections/About';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ } from './components/sections/FAQ';
import { Contact } from './components/sections/Contact';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthPage } from './components/auth/AuthPage';
import { ClientPortal } from './components/user/ClientPortal';

function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }, [location]);

  return null;
}

function MainLayout() {
  const [prefilledScope, setPrefilledScope] = useState<{
    productType: string;
    scope: string;
    features: string[];
    timeline: string;
    estimatedCost: string;
  } | null>(null);

  const [prefilledService, setPrefilledService] = useState<string | null>(null);

  const handleEstimateGenerated = (summary: {
    productType: string;
    scope: string;
    features: string[];
    timeline: string;
    estimatedCost: string;
  }) => {
    setPrefilledScope(summary);
  };

  const handleSelectService = (serviceName: string) => {
    setPrefilledService(serviceName);
  };

  const handleSelectTier = (tierName: string) => {
    setPrefilledService(tierName);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-cyan-500/20 selection:text-cyan-300 font-sans relative transition-colors duration-300">
      <ScrollToHashElement />

      {/* Sticky modern navigation header */}
      <Navbar />

      <main>
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Services Section (8 Core Capabilities) */}
        <Services onSelectService={handleSelectService} />

        {/* 3. Projects / Portfolio Showcase */}
        <Portfolio />

        {/* 4. Process: 5-step collaborative delivery blueprint */}
        <Process />

        {/* 5. Interactive Cost & Scope Estimator */}
        <CostEstimator onEstimateGenerated={handleEstimateGenerated} />

        {/* 6. Pricing & Engagement Models */}
        <Pricing onSelectTier={handleSelectTier} />

        {/* 7. About: Studio philosophy & principles */}
        <About />

        {/* 8. Testimonials: Client ROI & Endorsements */}
        <Testimonials />

        {/* 9. FAQ: Interactive accordion with live search */}
        <FAQ />

        {/* 10. Contact & Booking: High-converting project inquiry form */}
        <Contact 
          prefilledScope={prefilledScope} 
          prefilledService={prefilledService} 
        />
      </main>

      {/* Modern Studio Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/login" element={<AuthPage initialMode="signin" />} />
            <Route path="/signin" element={<AuthPage initialMode="signin" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />
            <Route path="/register" element={<AuthPage initialMode="signup" />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/dashboard" element={<ClientPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
