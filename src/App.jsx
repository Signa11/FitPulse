import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AppSelectorPage from './pages/AppSelectorPage';

const FitPulseApp = lazy(() => import('./apps/fitpulse/FitPulseApp'));
const NathaFitApp = lazy(() => import('./apps/nathafit/NathaFitApp'));
const RunLabApp = lazy(() => import('./apps/runlab/RunLabApp'));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          {/* App selector (protected) */}
          <Route path="/" element={<ProtectedRoute><AppSelectorPage /></ProtectedRoute>} />

          {/* App sub-routes (protected) */}
          <Route path="/fitpulse/*" element={<ProtectedRoute><FitPulseApp /></ProtectedRoute>} />
          <Route path="/nathafit/*" element={<ProtectedRoute><NathaFitApp /></ProtectedRoute>} />
          <Route path="/runlab/*" element={<ProtectedRoute><RunLabApp /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
