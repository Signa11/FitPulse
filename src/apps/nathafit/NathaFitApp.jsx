import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { NathaFitProvider } from './context/NathaFitContext';
import AppShell from '../../components/shared/AppShell';
import HomeScreen from './pages/HomeScreen';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

const NAV_ITEMS = [
  { path: '/nathafit', icon: 'Home', label: 'Home' },
  { path: '/nathafit/progress', icon: 'BarChart3', label: 'Progress' },
  { path: '/nathafit/settings', icon: 'Settings', label: 'Settings' },
];

export default function NathaFitApp() {
  const { setCurrentApp } = useTheme();
  useEffect(() => { setCurrentApp('nathafit'); }, [setCurrentApp]);

  return (
    <NathaFitProvider>
      <Routes>
        {/* HomeScreen handles its own full-screen overlays for active workout */}
        <Route index element={
          <AppShell appName="NathaFit" navItems={NAV_ITEMS}>
            <HomeScreen />
          </AppShell>
        } />
        <Route path="progress" element={
          <AppShell appName="NathaFit" navItems={NAV_ITEMS}>
            <ProgressPage />
          </AppShell>
        } />
        <Route path="settings" element={
          <AppShell appName="NathaFit" navItems={NAV_ITEMS}>
            <SettingsPage />
          </AppShell>
        } />
      </Routes>
    </NathaFitProvider>
  );
}
