import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Timer, Activity, LogOut } from 'lucide-react';

const apps = [
  {
    id: 'fitpulse',
    name: 'FitPulse',
    description: 'Workouts, nutrition & community',
    icon: Dumbbell,
    accent: '#FF6B4A',
    path: '/fitpulse',
  },
  {
    id: 'nathafit',
    name: 'NathaFit',
    description: 'BBG 12-week workout program',
    icon: Timer,
    accent: '#7C3AED',
    path: '/nathafit',
  },
  {
    id: 'runlab',
    name: 'RunLab',
    description: 'Running workouts for Garmin',
    icon: Activity,
    accent: '#4FACFE',
    path: '/runlab',
  },
];

export default function AppSelectorPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6">
      {/* Header with user info */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)]">
        <div className="flex items-center gap-3">
          {user?.avatar && (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          )}
          <span className="text-white/50 text-sm">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* MoveLab Logo */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FF6B4A] via-[#7C3AED] to-[#4FACFE] flex items-center justify-center">
          <span className="text-4xl font-black text-white">M</span>
        </div>
        <h1 className="text-3xl font-bold text-white">MoveLab</h1>
        <p className="text-white/40 mt-2">Choose your app</p>
      </div>

      {/* App Grid */}
      <div className="grid gap-4 w-full max-w-sm">
        {apps.map(app => (
          <button
            key={app.id}
            onClick={() => navigate(app.path)}
            className="bg-[#141416] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/15 transition-all duration-200 group active:scale-[0.98]"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: app.accent + '20' }}
            >
              <app.icon className="w-7 h-7" style={{ color: app.accent }} />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-white text-lg">{app.name}</h3>
              <p className="text-white/40 text-sm">{app.description}</p>
            </div>
            <div className="text-white/20 group-hover:text-white/40 transition-colors text-xl">
              ›
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
