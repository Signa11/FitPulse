/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const APP_THEMES = {
  movelab: {
    accent: '#FFFFFF',
    accentLight: '#FFFFFF',
    accentDark: '#CCCCCC',
    accentGlow: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #1C1C1E 0%, #0A0A0B 100%)',
  },
  fitpulse: {
    accent: '#FF6B4A',
    accentLight: '#FF8A6F',
    accentDark: '#E55A3C',
    accentGlow: 'rgba(255,107,74,0.3)',
    gradient: 'linear-gradient(135deg, #FF6B4A 0%, #FF8A6F 100%)',
  },
  nathafit: {
    accent: '#7C3AED',
    accentLight: '#A855F7',
    accentDark: '#6B21A8',
    accentGlow: 'rgba(124,58,237,0.3)',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  },
  runlab: {
    accent: '#4FACFE',
    accentLight: '#7DBFFF',
    accentDark: '#3B82F6',
    accentGlow: 'rgba(79,172,254,0.3)',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [currentApp, setCurrentApp] = useState('movelab');

  useEffect(() => {
    const theme = APP_THEMES[currentApp];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-light', theme.accentLight);
    root.style.setProperty('--color-accent-dark', theme.accentDark);
    root.style.setProperty('--color-accent-glow', theme.accentGlow);
    root.style.setProperty('--gradient-accent', theme.gradient);
  }, [currentApp]);

  return (
    <ThemeContext.Provider value={{ currentApp, setCurrentApp, theme: APP_THEMES[currentApp], themes: APP_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
