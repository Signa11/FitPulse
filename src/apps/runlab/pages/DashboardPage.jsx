import { useNavigate } from 'react-router-dom';
import { Plus, Timer, Calendar, Zap, ChevronRight, Trash2 } from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';

const ACCENT = '#4FACFE';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { workouts, plans, deleteWorkout, deletePlan } = useRunLab();

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
