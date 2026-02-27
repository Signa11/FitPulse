import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Timer, Activity, LogOut, Users, Zap, TrendingUp, X, Award, Flame, Calendar } from 'lucide-react';

const apps = [
  { id: 'fitpulse', name: 'FitPulse', description: 'Workouts & nutrition', icon: Dumbbell, accent: '#FF6B4A', path: '/fitpulse' },
  { id: 'nathafit', name: 'NathaFit', description: 'BBG 12-week program', icon: Timer, accent: '#7C3AED', path: '/nathafit' },
  { id: 'runlab',   name: 'RunLab',   description: 'Running & Garmin',     icon: Activity, accent: '#4FACFE', path: '/runlab' },
];

const ACTION_LABELS = {
  completed: 'completed',
  created: 'created',
  joined: 'joined',
  achieved: 'earned',
  made: 'made',
  started: 'started',
};

const TARGET_ICONS = {
  workout: Dumbbell,
  run: Activity,
  plan: Timer,
  achievement: Zap,
  recipe: Zap,
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function memberSinceLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ── Profile Modal ─────────────────────────────────────────

function ProfileModal({ member, feed, onClose }) {
  if (!member) return null;

  const memberFeed = feed.filter(a => a.user.id === member.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md max-h-[85vh] bg-[#141416] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col animate-[slideUp_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 text-center border-b border-white/5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/5 text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="mx-auto mb-3">
            {member.avatar ? (
              <img src={member.avatar} alt="" className="w-20 h-20 rounded-full border-3 border-white/10 mx-auto" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4FACFE] flex items-center justify-center border-3 border-white/10 mx-auto">
                <span className="text-white font-bold text-2xl">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <h2 className="text-white font-bold text-lg">{member.name}</h2>
          <p className="text-white/30 text-xs mt-0.5 flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3" />
            Member since {memberSinceLabel(member.memberSince)}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
                <Award className="w-4 h-4 text-[#4FACFE]" />
                {member.level || 1}
              </div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Level</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
                <Flame className="w-4 h-4 text-orange-400" />
                {member.streak || 0}
              </div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
                <Zap className="w-4 h-4 text-yellow-400" />
                {member.points || 0}
              </div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white font-bold text-lg">
                <Dumbbell className="w-4 h-4 text-green-400" />
                {member.workoutsCompleted || 0}
              </div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider">Workouts</p>
            </div>
          </div>
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-3">Recent Activity</p>

          {memberFeed.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-6 h-6 mx-auto mb-2 text-white/10" />
              <p className="text-white/25 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {memberFeed.map(item => {
                const Icon = TARGET_ICONS[item.targetType] || Activity;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">
                        <span className="text-white/40">{ACTION_LABELS[item.action] || item.action}</span>
                        {' '}
                        <span className="text-white/80">{item.target}</span>
                      </p>
                      <p className="text-white/20 text-xs">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────

export default function AppSelectorPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetch('/api/community/members')
      .then(r => r.json())
      .then(d => { if (d.data) setMembers(d.data); })
      .catch(() => {})
      .finally(() => setLoadingMembers(false));

    fetch('/api/community/feed?limit=50')
      .then(r => r.json())
      .then(d => { if (d.data) setFeed(d.data); })
      .catch(() => {})
      .finally(() => setLoadingFeed(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B4A] via-[#7C3AED] to-[#4FACFE] flex items-center justify-center">
            <span className="text-lg font-black text-white">M</span>
          </div>
          <span className="text-white font-bold text-lg">MoveLab</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="hover:opacity-80 transition-opacity">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4FACFE] flex items-center justify-center">
                <span className="text-white font-bold text-xs">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hey {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-white/40 text-sm mt-1">What are you training today?</p>
        </div>

        {/* App Grid — compact horizontal cards */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => navigate(app.path)}
              className="flex-shrink-0 w-[140px] bg-[#141416] border border-white/5 rounded-2xl p-4 hover:border-white/15 transition-all active:scale-[0.97]"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: app.accent + '20' }}
              >
                <app.icon className="w-5 h-5" style={{ color: app.accent }} />
              </div>
              <p className="text-white font-semibold text-sm">{app.name}</p>
              <p className="text-white/30 text-xs mt-0.5">{app.description}</p>
            </button>
          ))}
        </div>

        {/* Community Members */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Community
              {!loadingMembers && members.length > 0 && (
                <span className="text-white/30 ml-1.5 normal-case tracking-normal font-normal">
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>

          {loadingMembers ? (
            <div className="flex gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-16 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse" />
                  <div className="w-10 h-2 rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <p className="text-white/25 text-sm">No members yet. Be the first!</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
              {members.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                >
                  <div className="relative">
                    {m.avatar ? (
                      <img src={m.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-white/30 transition-colors" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#4FACFE] flex items-center justify-center border-2 border-white/10 group-hover:border-white/30 transition-colors">
                        <span className="text-white font-bold text-sm">
                          {m.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {m.streak > 0 && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-[#0A0A0B]">
                        {m.streak}
                      </div>
                    )}
                  </div>
                  <span className="text-white/60 text-[11px] truncate w-16 text-center group-hover:text-white/80 transition-colors">
                    {m.name?.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Activity Feed */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Activity</h2>
          </div>

          {loadingFeed ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-[#141416] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-3 rounded bg-white/5 animate-pulse" />
                    <div className="w-1/3 h-2 rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 text-center">
              <Activity className="w-8 h-8 mx-auto mb-3 text-white/15" />
              <p className="text-white/30 text-sm">No activity yet.</p>
              <p className="text-white/20 text-xs mt-1">Start a workout to see activity here!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {feed.map(item => {
                const Icon = TARGET_ICONS[item.targetType] || Activity;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      const m = members.find(mb => mb.id === item.user.id);
                      if (m) setSelectedMember(m);
                    }}
                    className="w-full bg-[#141416] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/10 transition-colors text-left"
                  >
                    {item.user.avatar ? (
                      <img src={item.user.avatar} alt="" className="w-9 h-9 rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 font-bold text-xs">
                          {item.user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">
                        <span className="font-medium text-white">{item.user.name}</span>
                        {' '}
                        <span className="text-white/40">{ACTION_LABELS[item.action] || item.action}</span>
                        {' '}
                        <span className="text-white/60">{item.target}</span>
                      </p>
                      <p className="text-white/25 text-xs mt-0.5">{timeAgo(item.createdAt)}</p>
                    </div>
                    <Icon className="w-4 h-4 text-white/15 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Profile Modal */}
      {selectedMember && (
        <ProfileModal
          member={selectedMember}
          feed={feed}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
