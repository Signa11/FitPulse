import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AppShell from '../../components/shared/AppShell';
import { RunLabProvider } from './context/RunLabContext';
import DashboardPage from './pages/DashboardPage';
import IntervalBuilderPage from './pages/IntervalBuilderPage';
import PlanBuilderPage from './pages/PlanBuilderPage';
import SimpleWorkoutPage from './pages/SimpleWorkoutPage';

const NAV_ITEMS = [
  { path: '/runlab', icon: 'Home', label: 'Dashboard' },
  { path: '/runlab/interval', icon: 'Timer', label: 'Intervals' },
  { path: '/runlab/plan', icon: 'Calendar', label: 'Plans' },
];

export default function RunLabApp() {
  const { setCurrentApp } = useTheme();
  useEffect(() => { setCurrentApp('runlab'); }, [setCurrentApp]);

  return (
    <RunLabProvider>
      <AppShell appName="RunLab" navItems={NAV_ITEMS}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="interval" element={<IntervalBuilderPage />} />
          <Route path="interval/:id" element={<IntervalBuilderPage />} />
          <Route path="plan" element={<PlanBuilderPage />} />
          <Route path="simple" element={<SimpleWorkoutPage />} />
        </Routes>
      </AppShell>
    </RunLabProvider>
  );
}
