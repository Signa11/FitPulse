import { useState } from 'react';
import { useNathaFit } from '../context/NathaFitContext';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const { resetProgress } = useNathaFit();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-full bg-[#0A0A0B]">
      {/* Header */}
      <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-6">
        <h1 className="text-white text-2xl font-bold">Settings</h1>
      </div>

      <div className="px-4 pb-6 space-y-6">
        {/* Profile section */}
        <div>
          <h2 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2 px-1">Profile</h2>
          <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {(user?.name || 'N').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{user?.name || 'Natha'}</div>
                <div className="text-white/40 text-xs">{user?.email || 'NathaFit User'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Workout config section */}
        <div>
          <h2 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2 px-1">Workout</h2>
          <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm shrink-0">
                ⏱
              </div>
              <div className="flex-1 text-white text-sm">Circuit Duration</div>
              <div className="text-white/40 text-sm font-medium shrink-0">7 min</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm shrink-0">
                💤
              </div>
              <div className="flex-1 text-white text-sm">Rest Between Circuits</div>
              <div className="text-white/40 text-sm font-medium shrink-0">30 sec</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm shrink-0">
                🔄
              </div>
              <div className="flex-1 text-white text-sm">Rounds per Circuit</div>
              <div className="text-white/40 text-sm font-medium shrink-0">2</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-sm shrink-0">
                🔢
              </div>
              <div className="flex-1 text-white text-sm">Circuits per Workout</div>
              <div className="text-white/40 text-sm font-medium shrink-0">2</div>
            </div>
          </div>
        </div>

        {/* About section */}
        <div>
          <h2 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2 px-1">About</h2>
          <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm shrink-0">
                📖
              </div>
              <div className="flex-1 text-white text-sm">Program</div>
              <div className="text-white/40 text-sm font-medium shrink-0">BBG 1.0</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-sm shrink-0">
                ✍️
              </div>
              <div className="flex-1 text-white text-sm">Author</div>
              <div className="text-white/40 text-sm font-medium shrink-0">Kayla Itsines</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-sm shrink-0">
                📅
              </div>
              <div className="flex-1 text-white text-sm">Duration</div>
              <div className="text-white/40 text-sm font-medium shrink-0">16 weeks</div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm shrink-0">
                📊
              </div>
              <div className="flex-1 text-white text-sm">Total Workouts</div>
              <div className="text-white/40 text-sm font-medium shrink-0">48</div>
            </div>
          </div>
        </div>

        {/* Data section */}
        <div>
          <h2 className="text-white/40 text-[11px] font-semibold uppercase tracking-widest mb-2 px-1">Data</h2>
          <div className="bg-[#141416] border border-white/5 rounded-2xl overflow-hidden">
            {!showConfirm ? (
              <button
                className="w-full px-4 py-3.5 text-left text-red-400 text-sm font-medium active:bg-red-500/5 transition-colors"
                onClick={() => setShowConfirm(true)}
              >
                Reset All Progress
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-white/60 text-sm">
                  Are you sure? This will reset all completed workouts and history. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold active:bg-red-500/20 transition-colors"
                    onClick={handleReset}
                  >
                    Yes, Reset
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-semibold active:bg-white/10 transition-colors"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
