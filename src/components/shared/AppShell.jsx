import { useNavigate, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Home, Dumbbell, User, BarChart3, Settings, Timer, Calendar } from 'lucide-react';

const ICON_MAP = {
  Home, Dumbbell, User, BarChart3, Settings, Timer, Calendar,
};

export default function AppShell({ appName, navItems, hideNav = false, children }) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* TopBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-16 max-w-lg mx-auto" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
          <span className="font-bold text-lg text-white">{appName}</span>
          <div className="w-9" />
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-24 max-w-lg mx-auto">
        {children}
      </main>

      {/* BottomNav */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0B] border-t border-white/5" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-4">
            {navItems.map(({ path, icon, label }) => {
              const Icon = ICON_MAP[icon];
              if (!Icon) return null;
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === navItems[0].path}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200"
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className="p-2 rounded-xl transition-all duration-200"
                        style={isActive ? { background: theme.accent + '25' } : {}}
                      >
                        <Icon
                          className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
                          style={{ color: isActive ? theme.accent : 'rgba(255,255,255,0.4)' }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-40'}`}
                        style={{ color: isActive ? theme.accent : 'white' }}
                      >
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
