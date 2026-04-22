import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/Layout/SkipLink';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoadingSpinner from './components/common/LoadingSpinner';

/* Lazy-loaded pages for code splitting */
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AIAssistant = lazy(() => import('./pages/AIAssistant'));
const Timeline = lazy(() => import('./pages/Timeline'));
const VotingGuide = lazy(() => import('./pages/VotingGuide'));
const KnowledgeCards = lazy(() => import('./pages/KnowledgeCards'));
const Quiz = lazy(() => import('./pages/Quiz'));
const ScenarioSimulator = lazy(() => import('./pages/ScenarioSimulator'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <LoadingSpinner size="lg" text="Loading…" />
    </div>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] overflow-x-hidden">
      <SkipLink />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[260px]">
        <Header onMenuToggle={() => setSidebarOpen((o) => !o)} />

        <main id="main-content" className="p-4 lg:p-8 relative overflow-hidden" role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/guide" element={<VotingGuide />} />
              <Route path="/knowledge" element={<KnowledgeCards />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/simulator" element={<ScenarioSimulator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
