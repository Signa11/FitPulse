import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { WorkoutProvider } from '../../context/WorkoutContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import AppShell from '../../components/shared/AppShell';
import HomePage from '../../pages/HomePage';
import WorkoutsPage from '../../pages/WorkoutsPage';
import ProfilePage from '../../pages/ProfilePage';
import WorkoutDetailPage from '../../pages/WorkoutDetailPage';

const NAV_ITEMS = [
  { path: '/fitpulse', icon: 'Home', label: 'Home' },
  { path: '/fitpulse/workouts', icon: 'Dumbbell', label: 'Workouts' },
  { path: '/fitpulse/profile', icon: 'User', label: 'Profile' },
];

export default function FitPulseApp() {
  const { setCurrentApp } = useTheme();
  useEffect(() => { setCurrentApp('fitpulse'); }, [setCurrentApp]);

  return (
    <WorkoutProvider>
      <LanguageProvider>
        <AppShell appName="FitPulse" navItems={NAV_ITEMS}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="workouts" element={<WorkoutsPage />} />
            <Route path="workout/:id" element={<WorkoutDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </AppShell>
      </LanguageProvider>
    </WorkoutProvider>
  );
}
