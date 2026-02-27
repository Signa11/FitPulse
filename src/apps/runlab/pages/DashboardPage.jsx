import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Timer, Calendar, Zap, ChevronRight, Trash2, Upload, Link2, Unlink, Loader2, Mail, Lock, Eye, EyeOff, Send } from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';
import { exportWorkoutTCX } from '../services/fitEncoder';

const ACCENT = '#4FACFE';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { workouts, plans, deleteWorkout, deletePlan, garminStatus, connectGarmin, disconnectGarmin, sendToGarmin } = useRunLab();
  const [showGarminForm, setShowGarminForm] = useState(false);
  const [garminEmail, setGarminEmail] = useState('');
  const [garminPassword, setGarminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [garminLoading, setGarminLoading] = useState(false);
  const [garminError, setGarminError] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [sentId, setSentId] = useState(null);

  const handleGarminConnect = async (e) => {
    e.preventDefault();
    if (!garminEmail || !garminPassword) return;
    setGarminLoading(true);
    setGarminError('');
    try {
      await connectGarmin(garminEmail, garminPassword);
      setShowGarminForm(false);
      setGarminEmail('');
      setGarminPassword('');
    } catch (err) {
      setGarminError(err.message);
    } finally {
      setGarminLoading(false);
    }
  };

  const handleGarminDisconnect = async () => {
    try {
      await disconnectGarmin();
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  const handleSendToGarmin = async (workout) => {
    setSendingId(workout.id);
    try {
      await sendToGarmin(workout);
      setSentId(workout.id);
      setTimeout(() => setSentId(null), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="px-4 space-y-8">
      {/* Hero */}
      <section
        className="rounded-2xl p-6 text-center"
        style={{ background: `linear-gradient(135deg, ${ACCENT}20 0%, ${ACCENT}08 100%)` }}
      >
        <div
          className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: `${ACCENT}30` }}
        >
          <Zap className="w-7 h-7" style={{ color: ACCENT }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">RunLab</h1>
        <p className="text-white/50 text-sm">Build running workouts. Export to Garmin.</p>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/runlab/interval')}
          className="flex flex-col items-center gap-2 bg-[#141416] border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all active:scale-[0.97]"
        >
          <div className="p-2.5 rounded-xl" style={{ background: `${ACCENT}20` }}>
            <Timer className="w-6 h-6" style={{ color: ACCENT }} />
          </div>
          <span className="text-sm font-semibold text-white">Create Workout</span>
        </button>

        <button
          onClick={() => navigate('/runlab/plan')}
          className="flex flex-col items-center gap-2 bg-[#141416] border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all active:scale-[0.97]"
        >
          <div className="p-2.5 rounded-xl" style={{ background: `${ACCENT}20` }}>
            <Calendar className="w-6 h-6" style={{ color: ACCENT }} />
          </div>
          <span className="text-sm font-semibold text-white">Create Plan</span>
        </button>
      </section>

      {/* Quick workout shortcut */}
      <button
        onClick={() => navigate('/runlab/simple')}
        className="w-full flex items-center gap-3 bg-[#141416] border border-white/5 rounded-2xl px-5 py-4 hover:border-white/15 transition-all active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" style={{ color: ACCENT }} />
        <span className="text-sm text-white/70">Quick single-run workout</span>
        <ChevronRight className="w-4 h-4 text-white/30 ml-auto" />
      </button>

      {/* Garmin Connection */}
      <section className="bg-[#141416] border border-white/5 rounded-2xl p-4">
        {garminStatus.loading ? (
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking Garmin connection...
          </div>
        ) : garminStatus.connected ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">Garmin Connected</p>
              <p className="text-white/40 text-xs truncate">{garminStatus.displayName}</p>
            </div>
            <button
              onClick={handleGarminDisconnect}
              className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              title="Disconnect Garmin"
            >
              <Unlink className="w-4 h-4" />
            </button>
          </div>
        ) : showGarminForm ? (
          <form onSubmit={handleGarminConnect} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white text-sm font-medium">Connect Garmin Account</p>
              <button type="button" onClick={() => { setShowGarminForm(false); setGarminError(''); }} className="text-white/30 text-xs hover:text-white/60">Cancel</button>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="email"
                value={garminEmail}
                onChange={e => setGarminEmail(e.target.value)}
                placeholder="Garmin email"
                className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20"
                disabled={garminLoading}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={garminPassword}
                onChange={e => setGarminPassword(e.target.value)}
                placeholder="Garmin password"
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20"
                disabled={garminLoading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {garminError && (
              <p className="text-red-400 text-xs">{garminError}</p>
            )}
            <p className="text-white/20 text-xs">Your credentials are used once to obtain a token and are not stored.</p>
            <button
              type="submit"
              disabled={garminLoading || !garminEmail || !garminPassword}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{ background: ACCENT, color: '#000' }}
            >
              {garminLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting...
                </span>
              ) : 'Connect'}
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowGarminForm(true)}
            className="w-full flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white/40" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">Connect Garmin</p>
              <p className="text-white/30 text-xs">Push workouts directly to your watch</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </button>
        )}
      </section>

      {/* Saved workouts */}
      <section>
        <h2 className="text-lg font-bold text-white mb-3">Saved Workouts</h2>
        {workouts.length === 0 ? (
          <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 text-center">
            <Timer className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <p className="text-white/40 text-sm">No workouts yet.</p>
            <p className="text-white/25 text-xs mt-1">Create your first interval workout to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.map(w => (
              <div
                key={w.id}
                className="bg-[#141416] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 group"
              >
                <button
                  onClick={() => navigate(`/runlab/interval/${w.id}`)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-white font-medium text-sm truncate">{w.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {w.steps?.length || 0} step{(w.steps?.length || 0) !== 1 ? 's' : ''}
                    {' · '}
                    {new Date(w.createdAt).toLocaleDateString()}
                  </p>
                </button>
                {garminStatus.connected && (
                  <button
                    onClick={() => handleSendToGarmin(w)}
                    disabled={sendingId === w.id}
                    className="p-2 rounded-lg text-white/20 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                    style={{ color: sentId === w.id ? '#22c55e' : sendingId === w.id ? ACCENT : undefined }}
                    title="Send to Garmin"
                  >
                    {sendingId === w.id ? <Loader2 className="w-4 h-4 animate-spin" /> : sentId === w.id ? <Send className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => deleteWorkout(w.id)}
                  className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-white/20" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Saved plans */}
      <section>
        <h2 className="text-lg font-bold text-white mb-3">Training Plans</h2>
        {plans.length === 0 ? (
          <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <p className="text-white/40 text-sm">No plans yet.</p>
            <p className="text-white/25 text-xs mt-1">Build a multi-week training plan for your next race.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {plans.map(p => (
              <div
                key={p.id}
                className="bg-[#141416] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{p.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {p.weeks?.length || 0} week{(p.weeks?.length || 0) !== 1 ? 's' : ''}
                    {p.raceType ? ` · ${p.raceType.toUpperCase()}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => deletePlan(p.id)}
                  className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
