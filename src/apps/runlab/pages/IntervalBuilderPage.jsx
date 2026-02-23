import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Trash2, GripVertical, Save, Download, ChevronDown, ChevronUp,
  Repeat, ArrowLeft,
} from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';
import {
  createWorkout, createStep, createRepeatGroup,
  StepType, DurationType, TargetType,
} from '../data/models';
import { paceToSpeed, speedToPace, formatDuration, formatDistance, parseDuration, parseDistance } from '../data/paceZones';
import { exportWorkoutTCX } from '../services/fitEncoder';

const ACCENT = '#4FACFE';

const STEP_COLORS = {
  [StepType.WARMUP]: { bg: 'bg-green-500/15', border: 'border-green-500/30', dot: 'bg-green-400' },
  [StepType.ACTIVE]: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  [StepType.REST]: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  [StepType.RECOVERY]: { bg: 'bg-orange-500/15', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  [StepType.COOLDOWN]: { bg: 'bg-red-500/15', border: 'border-red-500/30', dot: 'bg-red-400' },
  [StepType.REPEAT]: { bg: 'bg-purple-500/15', border: 'border-purple-500/30', dot: 'bg-purple-400' },
};

const STEP_TYPE_OPTIONS = [
  { value: StepType.WARMUP, label: 'Warm Up' },
  { value: StepType.ACTIVE, label: 'Active' },
  { value: StepType.REST, label: 'Rest' },
  { value: StepType.RECOVERY, label: 'Recovery' },
  { value: StepType.COOLDOWN, label: 'Cooldown' },
];

export default function IntervalBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addWorkout, updateWorkout, getWorkout } = useRunLab();

  const [workout, setWorkout] = useState(() => {
    if (id) {
      const existing = getWorkout(id);
      if (existing) return existing;
    }
    return createWorkout({
      name: '',
      steps: [
        createStep({ type: StepType.WARMUP, durationType: DurationType.TIME, durationValue: 600, notes: 'Warm Up' }),
        createStep({ type: StepType.ACTIVE, durationType: DurationType.TIME, durationValue: 300, notes: 'Run' }),
        createStep({ type: StepType.COOLDOWN, durationType: DurationType.TIME, durationValue: 300, notes: 'Cool Down' }),
      ],
    });
  });

  const [saved, setSaved] = useState(false);

  // Reload if navigating to a different ID
  useEffect(() => {
    if (id) {
      const existing = getWorkout(id);
      if (existing) setWorkout(existing); // eslint-disable-line react-hooks/set-state-in-effect -- sync with URL param
    }
  }, [id, getWorkout]);

  // ── Helpers ────────────────────────────────────────────────

  function updateStep(stepId, changes) {
    setWorkout(prev => ({
      ...prev,
      steps: prev.steps.map(s => {
        if (s.id === stepId) return { ...s, ...changes };
        if (s.type === StepType.REPEAT && s.steps) {
          return {
            ...s,
            steps: s.steps.map(child =>
              child.id === stepId ? { ...child, ...changes } : child
            ),
          };
        }
        return s;
      }),
    }));
  }

  function removeStep(stepId) {
    setWorkout(prev => ({
      ...prev,
      steps: prev.steps
        .filter(s => s.id !== stepId)
        .map(s => {
          if (s.type === StepType.REPEAT && s.steps) {
            return { ...s, steps: s.steps.filter(c => c.id !== stepId) };
          }
          return s;
        }),
    }));
  }

  function addStepAtEnd(type = StepType.ACTIVE) {
    const step = createStep({ type, notes: type.charAt(0).toUpperCase() + type.slice(1) });
    setWorkout(prev => ({ ...prev, steps: [...prev.steps, step] }));
  }

  function addRepeatGroup() {
    const interval = createStep({ type: StepType.ACTIVE, durationValue: 60, notes: 'Run' });
    const rest = createStep({ type: StepType.REST, durationValue: 60, notes: 'Rest' });
    const group = createRepeatGroup({ steps: [interval, rest], repeatCount: 4 });
    setWorkout(prev => ({ ...prev, steps: [...prev.steps, group] }));
  }

  function updateRepeatCount(groupId, count) {
    setWorkout(prev => ({
      ...prev,
      steps: prev.steps.map(s =>
        s.id === groupId ? { ...s, repeatCount: Math.max(1, count) } : s
      ),
    }));
  }

  function addStepToRepeat(groupId) {
    const step = createStep({ type: StepType.ACTIVE, durationValue: 60 });
    setWorkout(prev => ({
      ...prev,
      steps: prev.steps.map(s =>
        s.id === groupId ? { ...s, steps: [...(s.steps || []), step] } : s
      ),
    }));
  }

  function moveStep(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= workout.steps.length) return;
    setWorkout(prev => {
      const arr = [...prev.steps];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return { ...prev, steps: arr };
    });
  }

  // ── Save / Export ──────────────────────────────────────────

  function handleSave() {
    const w = { ...workout, name: workout.name || 'Untitled Workout' };
    if (id) {
      updateWorkout(w);
    } else {
      addWorkout(w);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (!id) navigate(`/runlab/interval/${w.id}`, { replace: true });
  }

  function handleExport() {
    const w = { ...workout, name: workout.name || 'Untitled Workout' };
    exportWorkoutTCX(w);
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="px-4 space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/runlab')}
          className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </button>
        <h1 className="text-xl font-bold text-white">
          {id ? 'Edit Workout' : 'New Interval Workout'}
        </h1>
      </div>

      {/* Workout name */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Workout Name</label>
        <input
          type="text"
          value={workout.name}
          onChange={e => setWorkout(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. 5x800m Intervals"
          className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        <label className="block text-xs text-white/40 uppercase tracking-wider">Steps</label>

        {workout.steps.map((step, index) => (
          step.type === StepType.REPEAT ? (
            <RepeatGroupCard
              key={step.id}
              group={step}
              index={index}
              onUpdateStep={updateStep}
              onRemoveStep={removeStep}
              onUpdateRepeatCount={updateRepeatCount}
              onAddStepToRepeat={addStepToRepeat}
              onMove={moveStep}
              totalSteps={workout.steps.length}
            />
          ) : (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              onUpdate={updateStep}
              onRemove={removeStep}
              onMove={moveStep}
              totalSteps={workout.steps.length}
            />
          )
        ))}

        {/* Add step buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addStepAtEnd(StepType.ACTIVE)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#141416] border border-dashed border-white/10 rounded-xl py-3 text-white/50 hover:text-white/80 hover:border-white/20 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
          <button
            onClick={addRepeatGroup}
            className="flex items-center justify-center gap-2 bg-[#141416] border border-dashed border-purple-500/20 rounded-xl py-3 px-4 text-purple-400/60 hover:text-purple-400 hover:border-purple-500/40 transition-all text-sm"
          >
            <Repeat className="w-4 h-4" />
            Repeat
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm transition-all active:scale-[0.97]"
          style={{ background: ACCENT, color: '#000' }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Workout'}
        </button>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-semibold text-sm bg-white/10 text-white hover:bg-white/15 transition-all active:scale-[0.97]"
        >
          <Download className="w-4 h-4" />
          Export TCX
        </button>
      </div>
    </div>
  );
}

// ── Step Card ────────────────────────────────────────────────

function StepCard({ step, index, onUpdate, onRemove, onMove, totalSteps, nested = false }) {
  const colors = STEP_COLORS[step.type] || STEP_COLORS[StepType.ACTIVE];

  const [paceStr, setPaceStr] = useState(() => {
    if (step.targetType === TargetType.SPEED && step.targetLow) {
      return speedToPace(step.targetLow);
    }
    return '';
  });

  function handleDurationChange(val) {
    if (step.durationType === DurationType.TIME) {
      onUpdate(step.id, { durationValue: parseDuration(val) });
    } else if (step.durationType === DurationType.DISTANCE) {
      onUpdate(step.id, { durationValue: parseDistance(val) });
    }
  }

  function handlePaceChange(val) {
    setPaceStr(val);
    const speed = paceToSpeed(val);
    if (speed) {
      // +/- 5% range around target pace
      onUpdate(step.id, {
        targetType: TargetType.SPEED,
        targetLow: speed * 0.95,
        targetHigh: speed * 1.05,
      });
    }
  }

  function handleHRChange(low, high) {
    onUpdate(step.id, {
      targetType: TargetType.HEART_RATE,
      targetLow: parseInt(low) || null,
      targetHigh: parseInt(high) || null,
    });
  }

  function clearTarget() {
    onUpdate(step.id, { targetType: TargetType.NO_TARGET, targetLow: null, targetHigh: null });
    setPaceStr('');
  }

  const durationDisplay = step.durationType === DurationType.TIME
    ? formatDuration(step.durationValue)
    : step.durationType === DurationType.DISTANCE
      ? formatDistance(step.durationValue)
      : 'Lap';

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-3 space-y-3 ${nested ? '' : ''}`}>
      {/* Top row: type + controls */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0`} />

        <select
          value={step.type}
          onChange={e => onUpdate(step.id, { type: e.target.value })}
          className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer appearance-none"
        >
          {STEP_TYPE_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-[#1C1C1E]">{o.label}</option>
          ))}
        </select>

        <span className="text-white/40 text-xs ml-auto mr-1">{durationDisplay}</span>

        {!nested && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              className="p-1 rounded text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMove(index, 1)}
              disabled={index === totalSteps - 1}
              className="p-1 rounded text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => onRemove(step.id)}
          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Duration row */}
      <div className="flex items-center gap-2">
        <select
          value={step.durationType}
          onChange={e => onUpdate(step.id, { durationType: e.target.value, durationValue: e.target.value === DurationType.OPEN ? 0 : step.durationValue })}
          className="bg-[#0A0A0B]/50 border border-white/10 text-white/70 text-xs rounded-lg px-2 py-1.5 focus:outline-none appearance-none"
        >
          <option value={DurationType.TIME} className="bg-[#1C1C1E]">Time</option>
          <option value={DurationType.DISTANCE} className="bg-[#1C1C1E]">Distance</option>
          <option value={DurationType.OPEN} className="bg-[#1C1C1E]">Open</option>
        </select>

        {step.durationType === DurationType.TIME && (
          <input
            type="text"
            placeholder="mm:ss"
            defaultValue={formatDuration(step.durationValue)}
            onBlur={e => handleDurationChange(e.target.value)}
            className="flex-1 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25"
          />
        )}

        {step.durationType === DurationType.DISTANCE && (
          <input
            type="text"
            placeholder="e.g. 800 or 1.5km"
            defaultValue={step.durationValue ? formatDistance(step.durationValue) : ''}
            onBlur={e => handleDurationChange(e.target.value)}
            className="flex-1 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25"
          />
        )}

        {step.durationType === DurationType.OPEN && (
          <span className="text-white/40 text-xs">Press lap to end</span>
        )}
      </div>

      {/* Target row */}
      <div className="flex items-center gap-2">
        <select
          value={step.targetType}
          onChange={e => {
            if (e.target.value === TargetType.NO_TARGET) clearTarget();
            else onUpdate(step.id, { targetType: e.target.value });
          }}
          className="bg-[#0A0A0B]/50 border border-white/10 text-white/70 text-xs rounded-lg px-2 py-1.5 focus:outline-none appearance-none"
        >
          <option value={TargetType.NO_TARGET} className="bg-[#1C1C1E]">No target</option>
          <option value={TargetType.SPEED} className="bg-[#1C1C1E]">Pace</option>
          <option value={TargetType.HEART_RATE} className="bg-[#1C1C1E]">Heart Rate</option>
        </select>

        {step.targetType === TargetType.SPEED && (
          <input
            type="text"
            placeholder="mm:ss /km"
            value={paceStr}
            onChange={e => handlePaceChange(e.target.value)}
            className="flex-1 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25"
          />
        )}

        {step.targetType === TargetType.HEART_RATE && (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="number"
              placeholder="Low"
              defaultValue={step.targetLow || ''}
              onBlur={e => handleHRChange(e.target.value, step.targetHigh)}
              className="w-16 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25"
            />
            <span className="text-white/30 text-xs">-</span>
            <input
              type="number"
              placeholder="High"
              defaultValue={step.targetHigh || ''}
              onBlur={e => handleHRChange(step.targetLow, e.target.value)}
              className="w-16 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#4FACFE]/50 placeholder:text-white/25"
            />
            <span className="text-white/40 text-xs">bpm</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Repeat Group Card ────────────────────────────────────────

function RepeatGroupCard({ group, index, onUpdateStep, onRemoveStep, onUpdateRepeatCount, onAddStepToRepeat, onMove, totalSteps }) {
  const colors = STEP_COLORS[StepType.REPEAT];
  const children = group.steps || [];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-3 space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Repeat className="w-4 h-4 text-purple-400" />
        <span className="text-purple-300 text-sm font-medium">Repeat</span>
        <span className="text-white/30 text-xs mx-1">x</span>
        <input
          type="number"
          min={1}
          value={group.repeatCount || 1}
          onChange={e => onUpdateRepeatCount(group.id, parseInt(e.target.value) || 1)}
          className="w-12 bg-[#0A0A0B]/50 border border-white/10 text-white text-sm rounded-lg px-2 py-1 text-center focus:outline-none focus:border-purple-500/50"
        />

        <div className="flex items-center gap-0.5 ml-auto">
          <button
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="p-1 rounded text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMove(index, 1)}
            disabled={index === totalSteps - 1}
            className="p-1 rounded text-white/30 hover:text-white/60 disabled:opacity-20 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onRemoveStep(group.id)}
          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Child steps */}
      <div className="space-y-2 pl-3 border-l-2 border-purple-500/20">
        {children.map((child, ci) => (
          <StepCard
            key={child.id}
            step={child}
            index={ci}
            onUpdate={onUpdateStep}
            onRemove={onRemoveStep}
            onMove={() => {}}
            totalSteps={children.length}
            nested
          />
        ))}
      </div>

      <button
        onClick={() => onAddStepToRepeat(group.id)}
        className="w-full flex items-center justify-center gap-1.5 text-purple-400/50 hover:text-purple-400 text-xs py-1.5 transition-colors"
      >
        <Plus className="w-3 h-3" />
        Add step to repeat
      </button>
    </div>
  );
}
