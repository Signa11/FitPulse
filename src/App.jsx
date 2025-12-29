import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { LanguageProvider } from './context/LanguageContext';
import TopBar from './components/layout/TopBar';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import WorkoutsPage from './pages/WorkoutsPage';
import ProfilePage from './pages/ProfilePage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Public Route wrapper (redirects to home if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="w-12 h-12 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isDetailPage = location.pathname.includes('/workout/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {!isDetailPage && !isAuthPage && isAuthenticated && <TopBar />}

      <main className={`${isDetailPage || isAuthPage ? '' : 'top-safe-area bottom-safe-area'}`}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/workouts" element={
            <ProtectedRoute>
              <WorkoutsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/workout/:id" element={
            <ProtectedRoute>
              <WorkoutDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {!isDetailPage && !isAuthPage && isAuthenticated && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;
