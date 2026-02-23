import { useMemo } from 'react';
import { useNathaFit } from '../context/NathaFitContext';
import { workoutData, getIcon, getIconBg } from '../helpers/workoutHelpers';

export default function ProgressPage() {
  const { completedWorkouts, completedHistory } = useNathaFit();

  const totalWorkouts = workoutData.workouts.length;
  const doneCount = completedWorkouts.size;
  const pct = totalWorkouts > 0 ? Math.round((doneCount / totalWorkouts) * 100) : 0;

  // Phase breakdown
  const phaseStats = useMemo(() =>
    workoutData.phases.map(p => {
      const total = workoutData.workouts.filter(w => w.phase === p.id).length;
      const done = workoutData.workouts.filter(w => w.phase === p.id && completedWorkouts.has(w.id)).length;
      const phasePct = total > 0 ? Math.round((done / total) * 100) : 0;
      return { ...p, total, done, pct: phasePct };
    }),
    [completedWorkouts]
  );

  // Recent history (most recent first)
  const recent = useMemo(
    () => [...completedHistory].reverse().slice(0, 20),
    [completedHistory]
  );

  // Phase color map for variety in the grid
  const phaseColors = {
    'pre-training': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    'training-1': { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' },
    'training-2': { bg: 'bg-pink-500/10', text: 'text-pink-400', bar: 'bg-pink-500' },
    'training-3': { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
  };

  return (
    <div className="min-h-full bg-[#0A0A0B]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#EC4899] px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-8 rounded-b-3xl">
        <h1 className="text-white text-2xl font-bold">Your Progress</h1>
        <p className="text-white/60 text-sm mt-1">
          {doneCount} of {totalWorkouts} workouts completed
        </p>

        {/* Phase breakdown grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {phaseStats.map(p => (
            <div key={p.id} className="bg-white/15 backdrop-blur-sm rounded-xl py-3 px-3 text-center">
              <div className="text-white text-lg font-bold">{p.done}/{p.total}</div>
              <div className="text-white/60 text-[11px] uppercase tracking-wider mt-0.5">{p.name}</div>
              {/* Mini progress bar */}
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white/60 rounded-full transition-all duration-500"
                  style={{ width: `${p.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        {/* Overall progress bar */}
        <div className="-mt-4 bg-[#141416] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm font-medium">Overall Progress</span>
            <span className="text-white font-bold text-sm">{pct}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-white/30 text-xs mt-2">
            {totalWorkouts - doneCount} workouts remaining
          </div>
        </div>

        {/* Phase detail cards */}
        <div className="mt-6 space-y-2">
          {phaseStats.map(p => {
            const colors = phaseColors[p.id] || { bg: 'bg-white/5', text: 'text-white/60', bar: 'bg-white/40' };
            return (
              <div key={p.id} className="bg-[#141416] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{p.name}</span>
                    {p.optional && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${colors.text}`}>{p.done}/{p.total}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent activity */}
        <div className="mt-6">
          <h2 className="text-white font-semibold mb-3">Recent Activity</h2>
          {recent.length === 0 ? (
            <div className="bg-[#141416] border border-white/5 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">📋</div>
              <div className="text-white font-semibold text-sm mb-1">No workouts yet</div>
              <div className="text-white/40 text-xs">Complete your first workout to see it here</div>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((h, i) => {
                const w = workoutData.workouts.find(wo => wo.id === h.id);
                if (!w) return null;
                const { icon, cls } = getIcon(w.focus);
                const durationMins = h.duration ? Math.max(1, Math.floor(h.duration / 60)) : '~28';
                return (
                  <div key={i} className="flex items-center gap-3 bg-[#141416] border border-white/5 rounded-2xl p-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getIconBg(cls)}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{w.focus} · Week {w.week}</div>
                      <div className="text-white/40 text-xs">{h.date} · {durationMins} min</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <span className="text-green-400 text-xs font-bold">✓</span>
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
