import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, ChevronRight, Zap } from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';
import { createPlan } from '../data/models';
import {
  RACE_TYPES, getTemplatesForRace,
  instantiateTemplate, createBlankPlanWeeks,
} from '../data/planTemplates';
import { generateSmartPlan } from '../data/planGenerator';
import { RACE_DISTANCES, parseTime, formatTime, predictRaceTime } from '../data/vdot';
import { calculateVDOT } from '../data/vdot';

const ACCENT = '#4FACFE';
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PHASE_COLORS = {
  Base: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  Build: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Peak: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  Taper: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

const WEEK_COUNT_OPTIONS = {
  '5k': [6, 8, 10],
  '10k': [8, 10, 12],
  'half': [10, 12, 14],
  'marathon': [12, 16, 18, 20],
};

export default function PlanBuilderPage() {
  const navigate = useNavigate();
  const { addPlan, addWorkout } = useRunLab();

  const [step, setStep] = useState('setup'); // 'setup' | 'smart' | 'edit'
  const [raceType, setRaceType] = useState('10k');
  const [goalTime, setGoalTime] = useState('');
  const [plan, setPlan] = useState(null);
  const [saved, setSaved] = useState(false);

  // Smart plan fields
  const [recentRaceDistance, setRecentRaceDistance] = useState('10k');
  const [recentRaceTime, setRecentRaceTime] = useState('');
  const [runsPerWeek, setRunsPerWeek] = useState(4);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const dayOfWeek = d.getDay();
    const mondayOffset = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    d.setDate(d.getDate() + mondayOffset);
    return d.toISOString().split('T')[0];
  });
  const [generating, setGenerating] = useState(false);

  // Live VDOT preview
  const recentTimeSecs = parseTime(recentRaceTime);
  const liveVDOT = recentTimeSecs
    ? calculateVDOT(RACE_DISTANCES[recentRaceDistance] || 10000, recentTimeSecs)
    : null;
  const predictedGoal = liveVDOT
    ? formatTime(predictRaceTime(liveVDOT, RACE_DISTANCES[raceType] || 10000))
    : null;

  // ── Setup phase ────────────────────────────────────────────

  const templates = getTemplatesForRace(raceType);

  function handleStartFromTemplate(tpl) {
    const p = instantiateTemplate(tpl);
    p.goalTime = goalTime;
    setPlan(p);
    setStep('edit');
  }

  function handleStartBlank() {
    const weekCounts = WEEK_COUNT_OPTIONS[raceType] || [8];
    const weekCount = weekCounts[Math.floor(weekCounts.length / 2)];
    const p = createPlan({
      name: `${RACE_TYPES.find(r => r.value === raceType)?.label || raceType} Plan`,
      raceType,
      goalTime,
      weeks: createBlankPlanWeeks(weekCount),
    });
    setPlan(p);
    setStep('edit');
  }

  function handleGenerateSmartPlan() {
    if (!recentTimeSecs) return;
    setGenerating(true);

    // Use requestAnimationFrame to let the UI update before heavy computation
    requestAnimationFrame(() => {
      const { plan: newPlan, workouts } = generateSmartPlan({
        raceType,
        goalTime,
        recentRaceDistance,
        recentRaceTime: recentTimeSecs,
        runsPerWeek,
        startDate,
      });

      // Store all generated workouts
      for (const w of workouts) {
        addWorkout(w);
      }
      addPlan(newPlan);

      setGenerating(false);
      navigate(`/runlab/plan/${newPlan.id}`);
    });
  }

  // ── Edit phase helpers ─────────────────────────────────────

  function updatePlanName(name) {
    setPlan(prev => ({ ...prev, name }));
  }

  function updateDayLabel(weekIndex, dayIndex, label) {
    setPlan(prev => {
      const weeks = [...prev.weeks];
      const week = { ...weeks[weekIndex], days: [...weeks[weekIndex].days] };
      const existingIdx = week.days.findIndex(d => d.day === dayIndex);
      if (existingIdx >= 0) {
        week.days[existingIdx] = { ...week.days[existingIdx], label };
      } else {
        week.days.push({ day: dayIndex, label, type: 'easy', workoutId: null });
      }
      weeks[weekIndex] = week;
      return { ...prev, weeks };
    });
  }

  function removeDayEntry(weekIndex, dayIndex) {
    setPlan(prev => {
      const weeks = [...prev.weeks];
      const week = { ...weeks[weekIndex], days: weeks[weekIndex].days.filter(d => d.day !== dayIndex) };
      weeks[weekIndex] = week;
      return { ...prev, weeks };
    });
  }

  function handleSave() {
    if (!plan) return;
    const p = { ...plan, name: plan.name || 'Untitled Plan' };
    addPlan(p);
    setSaved(true);
    setTimeout(() => {
      navigate('/runlab');
    }, 1200);
  }

  // ── Smart Plan setup view ─────────────────────────────────

  if (step === 'smart') {
    return (
      <div className="px-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('setup')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/50" />
          </button>
          <h1 className="text-xl font-bold text-white">Smart Plan (VDOT)</h1>
        </div>

        {/* Race type (already selected) */}
        <div className="bg-[#141416] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-white/40 text-xs uppercase">Goal Race</span>
          <span className="text-white text-sm font-medium">
            {RACE_TYPES.find(r => r.value === raceType)?.label || raceType}
          </span>
        </div>

        {/* Recent race */}
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Your Recent Race Result</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/30 mb-1">Distance</label>
              <select
                value={recentRaceDistance}
                onChange={e => setRecentRaceDistance(e.target.value)}
                className="w-full bg-[#141416] border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-[#4FACFE]/50"
              >
                {RACE_TYPES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/30 mb-1">Finish Time</label>
              <input
                type="text"
                value={recentRaceTime}
                onChange={e => setRecentRaceTime(e.target.value)}
                placeholder="mm:ss or h:mm:ss"
                className="w-full bg-[#141416] border border-white/10 rounded-xl px-3 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50"
              />
            </div>
          </div>
        </div>

        {/* VDOT preview */}
        {liveVDOT && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/50 text-xs">Your VDOT</span>
              <span className="text-2xl font-bold text-white">{liveVDOT}</span>
            </div>
            {predictedGoal && (
              <p className="text-white/40 text-xs">
                Predicted {RACE_TYPES.find(r => r.value === raceType)?.label}: <span className="text-white/70 font-medium">{predictedGoal}</span>
              </p>
            )}
          </div>
        )}

        {/* Runs per week */}
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Runs Per Week</label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map(n => (
              <button
                key={n}
                onClick={() => setRunsPerWeek(n)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  runsPerWeek === n
                    ? 'text-black'
                    : 'bg-[#141416] border border-white/10 text-white/60 hover:border-white/20'
                }`}
                style={runsPerWeek === n ? { background: ACCENT } : {}}
              >
                {n}x
              </button>
            ))}
          </div>
        </div>

        {/* Start date */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Start Date (Monday)</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
          />
        </div>

        {/* Goal time override */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Goal Time (optional override)</label>
          <input
            type="text"
            value={goalTime}
            onChange={e => setGoalTime(e.target.value)}
            placeholder={predictedGoal ? `Predicted: ${predictedGoal}` : 'e.g. 50:00'}
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
          />
        </div>

        {/* Generate */}
        <div className="pb-4">
          <button
            onClick={handleGenerateSmartPlan}
            disabled={!recentTimeSecs || generating}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4FACFE, #00F2FE)', color: '#000' }}
          >
            <Zap className="w-4 h-4" />
            {generating ? 'Generating Plan...' : 'Generate Smart Plan'}
          </button>
          {!recentTimeSecs && recentRaceTime && (
            <p className="text-red-400/70 text-xs mt-2 text-center">Enter a valid time (e.g. 25:00 or 1:45:00)</p>
          )}
        </div>
      </div>
    );
  }

  // ── Setup view ─────────────────────────────────────────────

  if (step === 'setup') {
    return (
      <div className="px-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/runlab')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/50" />
          </button>
          <h1 className="text-xl font-bold text-white">New Training Plan</h1>
        </div>

        {/* Race type */}
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Race Distance</label>
          <div className="grid grid-cols-4 gap-2">
            {RACE_TYPES.map(r => (
              <button
                key={r.value}
                onClick={() => setRaceType(r.value)}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  raceType === r.value
                    ? 'text-black'
                    : 'bg-[#141416] border border-white/10 text-white/60 hover:border-white/20'
                }`}
                style={raceType === r.value ? { background: ACCENT } : {}}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Goal time */}
        <div>
          <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Goal Time (optional)</label>
          <input
            type="text"
            value={goalTime}
            onChange={e => setGoalTime(e.target.value)}
            placeholder="e.g. 25:00 or 1:45:00"
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
          />
        </div>

        {/* Start From */}
        <div>
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Start From</label>

          {/* Smart Plan — featured option */}
          <button
            onClick={() => setStep('smart')}
            className="w-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl px-4 py-4 flex items-center gap-3 hover:border-blue-500/40 transition-all text-left mb-3"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4FACFE, #00F2FE)' }}>
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">Smart Plan (VDOT)</p>
              <p className="text-white/40 text-xs">Auto-generate from your race time with optimal paces</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/30" />
          </button>

          {templates.length > 0 && (
            <div className="space-y-2 mb-3">
              {templates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleStartFromTemplate(tpl)}
                  className="w-full bg-[#141416] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-white/15 transition-all text-left"
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: ACCENT }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{tpl.name}</p>
                    <p className="text-white/40 text-xs">{tpl.weekCount} weeks · {tpl.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleStartBlank}
            className="w-full bg-[#141416] border border-dashed border-white/10 rounded-xl px-4 py-3 text-white/50 hover:text-white/80 hover:border-white/20 transition-all text-sm text-center"
          >
            Start with blank plan
          </button>
        </div>
      </div>
    );
  }

  // ── Edit view ──────────────────────────────────────────────

  if (!plan) return null;

  return (
    <div className="px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setStep('setup')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </button>
        <h1 className="text-xl font-bold text-white">Edit Plan</h1>
      </div>

      {/* Plan name */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Plan Name</label>
        <input
          type="text"
          value={plan.name}
          onChange={e => updatePlanName(e.target.value)}
          className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
        />
      </div>

      {plan.goalTime && (
        <div className="bg-[#141416] border border-white/5 rounded-xl px-4 py-3">
          <span className="text-white/40 text-xs">Goal: </span>
          <span className="text-white text-sm font-medium">{plan.goalTime}</span>
        </div>
      )}

      {/* Week grid */}
      <div className="space-y-4">
        {plan.weeks.map((week, wi) => {
          const phaseColor = PHASE_COLORS[week.phase] || PHASE_COLORS.Base;
          return (
            <div key={wi} className="bg-[#141416] border border-white/5 rounded-xl overflow-hidden">
              {/* Week header */}
              <div className={`flex items-center justify-between px-4 py-2.5 ${phaseColor.bg} border-b ${phaseColor.border}`}>
                <span className="text-white text-sm font-semibold">Week {week.weekNumber}</span>
                <span className={`text-xs font-medium ${phaseColor.text}`}>{week.phase}</span>
              </div>

              {/* Days grid */}
              <div className="px-3 py-3 grid grid-cols-7 gap-1">
                {DAY_LABELS.map((dayLabel, di) => {
                  const entry = week.days.find(d => d.day === di);
                  return (
                    <div key={di} className="text-center">
                      <div className="text-[10px] text-white/30 mb-1">{dayLabel}</div>
                      {entry ? (
                        <button
                          onClick={() => removeDayEntry(wi, di)}
                          className="w-full text-[10px] leading-tight text-white/70 bg-white/5 rounded-lg px-1 py-1.5 hover:bg-white/10 transition-colors truncate"
                          title={entry.label}
                        >
                          {entry.label?.split(' ').slice(0, 2).join(' ') || 'Run'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const label = prompt(`Workout for ${DAY_LABELS[di]}, Week ${week.weekNumber}:`);
                            if (label) updateDayLabel(wi, di, label);
                          }}
                          className="w-full text-[10px] text-white/15 bg-transparent border border-dashed border-white/10 rounded-lg py-1.5 hover:border-white/20 hover:text-white/30 transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="pb-4">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-[0.97]"
          style={{ background: ACCENT, color: '#000' }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Plan'}
        </button>
      </div>
    </div>
  );
}
