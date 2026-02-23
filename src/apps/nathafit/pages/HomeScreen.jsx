import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNathaFit } from '../context/NathaFitContext';
import { useAuth } from '../../../context/AuthContext';
import {
  workoutData,
  getIcon,
  getIconBg,
  formatReps,
  getPhaseLabel,
  getPhaseShort,
  getGreeting,
  getWeeksForPhase,
  findNextWorkout,
} from '../helpers/workoutHelpers';
import ProgressRing from '../components/ProgressRing';

// ── Active Workout Constants ──
const CIRCUIT_TIME = 7 * 60;
const REST_TIME = 30;

const FLOW = [
  { type: 'circuit', circuit: 0, round: 1 },
  { type: 'rest' },
  { type: 'circuit', circuit: 1, round: 1 },
  { type: 'rest' },
  { type: 'circuit', circuit: 0, round: 2 },
  { type: 'rest' },
  { type: 'circuit', circuit: 1, round: 2 },
];

// ── WeekView (inline) ──
function WeekView({ phase, week, completedWorkouts, onSelectWorkout }) {
  const workouts = workoutData.workouts.filter(w => w.phase === phase && w.week === week);
  const phaseInfo = workoutData.phases.find(p => p.id === phase);
  const schedule = phaseInfo?.weeklySchedule || {};

  return (
    <div className="px-4 pb-6 space-y-4">
      {/* Phase context card */}
      {phaseInfo && (
        <div className={`rounded-2xl p-4 border ${phaseInfo.optional ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-purple-500/5 border-purple-500/20'}`}>
          <div className="flex gap-3">
            <div className="text-2xl">
              {phaseInfo.optional ? '🌱' : phaseInfo.id === 'training-1' ? '💪' : phaseInfo.id === 'training-2' ? '🔥' : '⚡'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm">{phaseInfo.name}</span>
                {phaseInfo.optional && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                )}
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{phaseInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resistance Training label */}
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Resistance Training</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      {/* Workout cards */}
      {workouts.map(w => {
        const { icon, cls } = getIcon(w.focus);
        const isDone = completedWorkouts.has(w.id);
        return (
          <button
            key={w.id}
            className={`w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-colors border ${
              isDone
                ? 'bg-green-500/5 border-green-500/10'
                : 'bg-[#141416] border-white/5 active:bg-white/5'
            }`}
            onClick={() => onSelectWorkout(w)}
          >
            {isDone && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </div>
            )}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${getIconBg(cls)}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/40 text-[11px] font-medium uppercase tracking-wider">{w.day}</div>
              <div className="text-white font-semibold text-sm">{w.focus}</div>
              <div className="text-white/40 text-xs">2 circuits · 4 exercises · ~28 min</div>
            </div>
            {w.optional && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                Optional
              </span>
            )}
            {isDone && (
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-xs font-bold">✓</span>
              </div>
            )}
            <span className="text-white/20 text-lg shrink-0">›</span>
          </button>
        );
      })}

      {/* Also this week */}
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Also This Week</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="rounded-2xl bg-[#141416] border border-white/5 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg">🚶</div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">LISS Cardio</div>
          <div className="text-white/40 text-xs">{schedule.lissCardio || '2–3 sessions'} · 35–45 min</div>
        </div>
      </div>

      {schedule.hiitCardio && (
        <div className="rounded-2xl bg-[#141416] border border-white/5 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-lg">🏃</div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm">HIIT Cardio</div>
            <div className="text-white/40 text-xs">{schedule.hiitCardio} · 10–15 min intervals</div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-[#141416] border border-white/5 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-lg">🧘</div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">Rehabilitation</div>
          <div className="text-white/40 text-xs">{schedule.rehabilitation || '1 session'} · Stretching & foam rolling</div>
        </div>
      </div>
    </div>
  );
}

// ── WorkoutDetail (inline) ──
function WorkoutDetail({ workout, onStart }) {
  const { icon } = getIcon(workout.focus);
  const totalExercises = workout.circuits.reduce((sum, c) => sum + c.exercises.length, 0);

  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="text-center py-8 px-4">
        <div className="text-5xl mb-3">{icon}</div>
        <h1 className="text-2xl font-bold text-white mb-1">{workout.focus}</h1>
        <p className="text-white/40 text-sm">
          {getPhaseLabel(workout.phase)} · Week {workout.week} · {workout.day}
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white">~28</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{totalExercises}</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider">Exercises</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">4</div>
            <div className="text-[11px] text-white/40 uppercase tracking-wider">Rounds</div>
          </div>
        </div>
      </div>

      {/* Circuits */}
      <div className="px-4 space-y-4">
        {workout.circuits.map(circuit => (
          <div key={circuit.id} className="rounded-2xl bg-[#141416] border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-white font-semibold text-sm">{circuit.name}</span>
              <span className="text-[11px] font-semibold text-[#A855F7] bg-purple-500/10 px-2.5 py-1 rounded-full">
                2 × 7 min
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {circuit.exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40 font-semibold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{ex.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {ex.perSide && <span className="text-white/30 text-xs">per side</span>}
                      {ex.equipment && (
                        <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                          {ex.weight}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-white/60 text-sm font-semibold tabular-nums shrink-0">
                    {formatReps(ex)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Start button */}
        <button
          className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-[#7C3AED] to-[#EC4899] active:opacity-80 transition-opacity mt-4"
          onClick={onStart}
        >
          Start Workout
        </button>
      </div>
    </div>
  );
}

// ── ActiveWorkout (full-screen overlay) ──
function ActiveWorkout({ workout, onComplete, onQuit }) {
  const [flowIndex, setFlowIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CIRCUIT_TIME);
  const [paused, setPaused] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const intervalRef = useRef(null);

  const step = FLOW[flowIndex];
  const isRest = step?.type === 'rest';
  const isDone = flowIndex >= FLOW.length;

  useEffect(() => {
    if (isDone) return;
    setTimeLeft(isRest ? REST_TIME : CIRCUIT_TIME); // eslint-disable-line react-hooks/set-state-in-effect -- reset timer on step change
    setCurrentExercise(0);
    setPaused(false);
  }, [flowIndex, isDone, isRest]);

  useEffect(() => {
    if (paused || isDone) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (flowIndex < FLOW.length - 1) setFlowIndex(f => f + 1);
          else onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused, isDone, flowIndex, onComplete]);

  const nextStep = useCallback(() => {
    if (flowIndex < FLOW.length - 1) setFlowIndex(f => f + 1);
    else onComplete();
  }, [flowIndex, onComplete]);

  if (isDone) return null;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  // Build round dots
  const dots = FLOW.filter(s => s.type === 'circuit').map((s) => ({
    done: FLOW.indexOf(s) < flowIndex,
    active: FLOW.indexOf(s) === flowIndex,
  }));

  if (isRest) {
    const next = FLOW[flowIndex + 1];
    const nextLabel = next ? `Circuit ${next.circuit + 1} · Round ${next.round}` : 'Done!';
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
          <div className="text-white font-semibold">{workout.focus}</div>
          <button className="text-white/40 text-sm font-medium px-3 py-1 rounded-lg active:bg-white/5" onClick={onQuit}>
            Quit
          </button>
        </div>

        {/* Rest screen */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">💧</div>
          <div className="text-2xl font-bold text-white mb-1">Rest</div>
          <div className="text-white/40 text-sm mb-6">Catch your breath</div>
          <div className="text-6xl font-bold text-white tabular-nums mb-6">{ss}</div>
          <div className="text-white/40 text-sm mb-8">
            Up next: <span className="text-white font-semibold">{nextLabel}</span>
          </div>
          <button
            className="px-8 py-3 rounded-xl bg-white/10 text-white font-semibold active:bg-white/20 transition-colors"
            onClick={nextStep}
          >
            Skip →
          </button>
        </div>
      </div>
    );
  }

  const circuit = workout.circuits[step.circuit];

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-3">
        <div>
          <div className="text-white font-semibold">{workout.focus}</div>
          <div className="text-white/40 text-xs">{getPhaseLabel(workout.phase)} · Week {workout.week}</div>
        </div>
        <button className="text-white/40 text-sm font-medium px-3 py-1 rounded-lg active:bg-white/5" onClick={onQuit}>
          Quit
        </button>
      </div>

      {/* Timer section */}
      <div className="text-center py-6 px-4">
        <div className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${
          step.circuit === 0 ? 'text-purple-300 bg-purple-500/10' : 'text-pink-300 bg-pink-500/10'
        }`}>
          {circuit.name} · Round {step.round}
        </div>
        <div className="text-6xl font-bold text-white tabular-nums">{mm}:{ss}</div>
        <div className="text-white/30 text-xs mt-2">Complete as many rounds as possible</div>
        <div className="flex items-center justify-center gap-2 mt-4">
          {dots.map((d, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                d.done ? 'bg-green-500' : d.active ? 'bg-[#A855F7]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {circuit.exercises.map((ex, i) => (
          <button
            key={i}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              i === currentExercise ? 'bg-[#A855F7]/10 border border-[#A855F7]/30' : 'active:bg-white/5'
            }`}
            onClick={() => setCurrentExercise(i)}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i === currentExercise ? 'bg-[#A855F7] text-white' : 'bg-white/10 text-white/40'
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 text-white text-sm font-medium">{ex.name}</div>
            <div className="text-white/50 text-sm font-semibold tabular-nums shrink-0">{formatReps(ex)}</div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <button
          className="flex-1 py-3.5 rounded-xl bg-white/10 text-white font-semibold active:bg-white/20 transition-colors"
          onClick={() => setPaused(p => !p)}
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-semibold active:opacity-80 transition-opacity"
          onClick={nextStep}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── CompleteScreen (full-screen overlay) ──
function CompleteScreen({ workout, elapsed, onDone }) {
  const mins = Math.max(1, Math.floor(elapsed / 60));
  const totalExercises = workout.circuits.reduce((sum, c) => sum + c.exercises.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-bold text-white mb-2">Well Done!</h1>
      <p className="text-white/70 text-base mb-8">
        {workout.focus} — Week {workout.week}
      </p>
      <div className="flex gap-8 mb-10">
        <div>
          <div className="text-3xl font-bold text-white">{mins}</div>
          <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Minutes</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-white">{totalExercises}</div>
          <div className="text-xs text-white/60 uppercase tracking-wider mt-1">Exercises</div>
        </div>
      </div>
      <button
        className="px-12 py-4 rounded-2xl bg-white text-[#7C3AED] font-bold text-base active:opacity-80 transition-opacity"
        onClick={onDone}
      >
        Done
      </button>
    </div>
  );
}

// ═══════════════════════════════════════
// ── HomeScreen (main export) ──
// ═══════════════════════════════════════
export default function HomeScreen() {
  const { user } = useAuth();
  const { completedWorkouts, completedHistory, markComplete } = useNathaFit();

  const [screen, setScreen] = useState(null); // null | 'week' | 'detail' | 'active' | 'complete'
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);

  // Home sub-state
  const [activePhase, setActivePhase] = useState('pre-training');
  const [expandedPhaseInfo, setExpandedPhaseInfo] = useState(false);

  const activePhaseData = workoutData.phases.find(p => p.id === activePhase);
  const totalWorkouts = workoutData.workouts.length;
  const doneCount = completedWorkouts.size;
  const nextWorkout = useMemo(() => findNextWorkout(completedWorkouts), [completedWorkouts]);

  const currentStreak = useMemo(() => {
    if (completedHistory.length === 0) return 0;
    const dates = [...new Set(completedHistory.map(h => h.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((today - d) / 86400000);
      if (diff <= i + 1) streak++;
      else break;
    }
    return streak;
  }, [completedHistory]);

  const weeks = getWeeksForPhase(activePhase);

  const navigate = (newScreen, phase, week, workout) => {
    setScreen(newScreen);
    if (phase !== undefined) setSelectedPhase(phase);
    if (week !== undefined) setSelectedWeek(week);
    if (workout !== undefined) setSelectedWorkout(workout);
  };

  const goBack = () => {
    if (screen === 'detail') setScreen('week');
    else if (screen === 'week') setScreen(null);
    else setScreen(null);
  };

  const userName = user?.name || 'Natha';

  // ── Active Workout overlay ──
  if (screen === 'active' && selectedWorkout) {
    return (
      <ActiveWorkout
        workout={selectedWorkout}
        onComplete={() => setScreen('complete')}
        onQuit={() => setScreen('detail')}
      />
    );
  }

  // ── Complete Screen overlay ──
  if (screen === 'complete' && selectedWorkout) {
    const elapsed = workoutStartTime
      ? Math.floor((Date.now() - workoutStartTime) / 1000) // eslint-disable-line react-hooks/purity -- one-time read at transition
      : 28 * 60;
    return (
      <CompleteScreen
        workout={selectedWorkout}
        elapsed={elapsed}
        onDone={() => {
          markComplete(selectedWorkout, workoutStartTime);
          setScreen(null);
          setSelectedWorkout(null);
        }}
      />
    );
  }

  // ── Toolbar for sub-screens ──
  const showToolbar = screen === 'week' || screen === 'detail';
  let toolbarTitle = '';
  let toolbarSub = '';
  if (screen === 'week') {
    toolbarTitle = `Week ${selectedWeek}`;
    toolbarSub = getPhaseLabel(selectedPhase);
  } else if (screen === 'detail' && selectedWorkout) {
    toolbarTitle = selectedWorkout.focus;
    toolbarSub = `${selectedWorkout.day} · Week ${selectedWorkout.week}`;
  }

  return (
    <div className="min-h-full bg-[#0A0A0B]">
      {/* Toolbar */}
      {showToolbar && (
        <div className="sticky top-0 z-20 bg-[#0A0A0B]/90 backdrop-blur-lg border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white active:bg-white/10 shrink-0"
            onClick={goBack}
          >
            ←
          </button>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{toolbarTitle}</div>
            <div className="text-white/40 text-xs truncate">{toolbarSub}</div>
          </div>
        </div>
      )}

      {/* ── Week View ── */}
      {screen === 'week' && (
        <WeekView
          phase={selectedPhase}
          week={selectedWeek}
          completedWorkouts={completedWorkouts}
          onSelectWorkout={(w) => navigate('detail', w.phase, w.week, w)}
        />
      )}

      {/* ── Workout Detail ── */}
      {screen === 'detail' && selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onStart={() => {
            setWorkoutStartTime(Date.now());
            setScreen('active');
          }}
        />
      )}

      {/* ── Home Screen ── */}
      {!screen && (
        <>
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#EC4899] px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-8 rounded-b-3xl">
            <div className="text-white/70 text-sm">{getGreeting()}</div>
            <div className="text-white text-2xl font-bold mt-0.5">{userName}</div>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl py-3 px-2 text-center">
                <div className="text-white text-xl font-bold">{doneCount}</div>
                <div className="text-white/60 text-[11px] uppercase tracking-wider mt-0.5">Workouts</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl py-3 px-2 text-center">
                <div className="text-white text-xl font-bold">{currentStreak}</div>
                <div className="text-white/60 text-[11px] uppercase tracking-wider mt-0.5">Day Streak</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl py-3 px-2 text-center">
                <div className="text-white text-xl font-bold">{totalWorkouts > 0 ? Math.round((doneCount / totalWorkouts) * 100) : 0}%</div>
                <div className="text-white/60 text-[11px] uppercase tracking-wider mt-0.5">Complete</div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-6">
            {/* Next workout card */}
            {nextWorkout && (
              <button
                className="-mt-5 w-full bg-[#141416] border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-left active:bg-white/5 transition-colors"
                onClick={() => navigate('detail', nextWorkout.phase, nextWorkout.week, nextWorkout)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-white/40 text-[11px] font-semibold uppercase tracking-wider mb-1">Next Workout</div>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${getIconBg(getIcon(nextWorkout.focus).cls)}`}>
                      {getIcon(nextWorkout.focus).icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-semibold text-sm">{nextWorkout.focus}</div>
                      <div className="text-white/40 text-xs">
                        {getPhaseLabel(nextWorkout.phase)} · Week {nextWorkout.week} · {nextWorkout.day}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm ml-0.5">▶</span>
                </div>
              </button>
            )}

            {/* Section header */}
            <div className="mt-6 mb-3">
              <span className="text-white font-semibold">Program</span>
            </div>

            {/* Phase chip row */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              {workoutData.phases.map(p => (
                <button
                  key={p.id}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activePhase === p.id
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-white/5 text-white/50 active:bg-white/10'
                  }`}
                  onClick={() => { setActivePhase(p.id); setExpandedPhaseInfo(false); }}
                >
                  {getPhaseShort(p.id)}
                  {p.optional && (
                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                      activePhase === p.id ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      Opt
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Phase info banner */}
            {activePhaseData && (
              <div className={`mt-3 rounded-2xl p-4 border ${
                activePhaseData.optional ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-purple-500/5 border-purple-500/15'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-white font-semibold text-sm">{activePhaseData.name}</span>
                  {activePhaseData.optional && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{activePhaseData.description}</p>
                {expandedPhaseInfo && (
                  <p className="text-white/40 text-xs leading-relaxed mt-2">{activePhaseData.detail}</p>
                )}
                <button
                  className="text-[#A855F7] text-xs font-semibold mt-2"
                  onClick={() => setExpandedPhaseInfo(v => !v)}
                >
                  {expandedPhaseInfo ? 'Show less' : 'Learn more'}
                </button>
              </div>
            )}

            {/* Week list */}
            <div className="mt-4 space-y-2">
              {weeks.map(({ week, workouts: weekWorkouts }) => {
                const done = weekWorkouts.filter(w => completedWorkouts.has(w.id)).length;
                return (
                  <button
                    key={`${activePhase}-${week}`}
                    className="w-full flex items-center gap-3 bg-[#141416] border border-white/5 rounded-2xl p-4 text-left active:bg-white/5 transition-colors"
                    onClick={() => navigate('week', activePhase, week)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {week}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm">Week {week}</div>
                      <div className="text-white/40 text-xs">
                        {weekWorkouts.length} sessions · {weekWorkouts.map(w => w.focus.split(' ')[0]).join(', ')}
                      </div>
                    </div>
                    <ProgressRing done={done} total={weekWorkouts.length} />
                    <span className="text-white/40 text-xs tabular-nums shrink-0">{done}/{weekWorkouts.length}</span>
                    <span className="text-white/20 text-lg shrink-0">›</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
