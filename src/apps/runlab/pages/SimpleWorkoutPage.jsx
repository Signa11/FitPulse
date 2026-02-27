import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, Zap, Upload, Loader2 } from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';
import { createWorkout, createStep, StepType, DurationType, TargetType } from '../data/models';
import { paceToSpeed, parseDuration, parseDistance } from '../data/paceZones';
import { exportWorkoutTCX } from '../services/fitEncoder';
import PaceZonePicker from '../components/PaceZonePicker';

const ACCENT = '#4FACFE';

export default function SimpleWorkoutPage() {
  const navigate = useNavigate();
  const { addWorkout, garminStatus, sendToGarmin } = useRunLab();

  const [name, setName] = useState('');
  const [mode, setMode] = useState('distance'); // 'distance' | 'time'
  const [distance, setDistance] = useState('');   // e.g. "5 km" or "5000"
  const [time, setTime] = useState('');           // e.g. "30:00"
  const [slowPace, setSlowPace] = useState('');   // e.g. "6:30"
  const [fastPace, setFastPace] = useState('');   // e.g. "5:45"
  const [saved, setSaved] = useState(false);
  const [garminSending, setGarminSending] = useState(false);
  const [garminSent, setGarminSent] = useState(false);

  function buildWorkout() {
    const steps = [];

    // Warmup: 10 min easy
    steps.push(createStep({
      type: StepType.WARMUP,
      durationType: DurationType.TIME,
      durationValue: 600,
      notes: 'Warm Up',
    }));

    // Main run
    const mainStep = { type: StepType.ACTIVE, notes: 'Run' };

    if (mode === 'distance') {
      mainStep.durationType = DurationType.DISTANCE;
      mainStep.durationValue = parseDistance(distance);
    } else {
      mainStep.durationType = DurationType.TIME;
      mainStep.durationValue = parseDuration(time);
    }

    // Optional pace target
    const slowSpeed = paceToSpeed(slowPace);
    const fastSpeed = paceToSpeed(fastPace);
    if (slowSpeed || fastSpeed) {
      mainStep.targetType = TargetType.SPEED;
      // slow pace = lower speed (targetLow), fast pace = higher speed (targetHigh)
      mainStep.targetLow = slowSpeed || (fastSpeed ? fastSpeed * 0.95 : null);
      mainStep.targetHigh = fastSpeed || (slowSpeed ? slowSpeed * 1.05 : null);
    }

    steps.push(createStep(mainStep));

    // Cooldown: 5 min easy
    steps.push(createStep({
      type: StepType.COOLDOWN,
      durationType: DurationType.TIME,
      durationValue: 300,
      notes: 'Cool Down',
    }));

    return createWorkout({
      name: name || 'Quick Run',
      steps,
    });
  }

  function handleSave() {
    const w = buildWorkout();
    addWorkout(w);
    setSaved(true);
    setTimeout(() => navigate('/runlab'), 1200);
  }

  function handleExport() {
    const w = buildWorkout();
    exportWorkoutTCX(w);
  }

  async function handleSendToGarmin() {
    const w = buildWorkout();
    setGarminSending(true);
    try {
      await sendToGarmin(w);
      setGarminSent(true);
      setTimeout(() => setGarminSent(false), 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setGarminSending(false);
    }
  }

  return (
    <div className="px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/runlab')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </button>
        <h1 className="text-xl font-bold text-white">Quick Workout</h1>
      </div>

      {/* Explainer */}
      <div
        className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: `${ACCENT}12` }}
      >
        <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
        <p className="text-white/50 text-sm leading-relaxed">
          Create a simple 3-step workout: 10 min warm-up, your run, and 5 min cool-down. Perfect for quick exports.
        </p>
      </div>

      {/* Workout name */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Workout Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Morning 5K"
          className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
        />
      </div>

      {/* Distance or Time toggle */}
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Main Run</label>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('distance')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'distance' ? 'text-black' : 'bg-[#141416] border border-white/10 text-white/60'
            }`}
            style={mode === 'distance' ? { background: ACCENT } : {}}
          >
            Distance
          </button>
          <button
            onClick={() => setMode('time')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'time' ? 'text-black' : 'bg-[#141416] border border-white/10 text-white/60'
            }`}
            style={mode === 'time' ? { background: ACCENT } : {}}
          >
            Time
          </button>
        </div>

        {mode === 'distance' ? (
          <input
            type="text"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            placeholder="e.g. 5km or 5000"
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
          />
        ) : (
          <input
            type="text"
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="mm:ss e.g. 30:00"
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#4FACFE]/50 transition-colors"
          />
        )}
      </div>

      {/* Pace target */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Target Pace (optional)</label>
        <PaceZonePicker
          slowPace={slowPace}
          fastPace={fastPace}
          onPaceChange={(slow, fast) => { setSlowPace(slow); setFastPace(fast); }}
        />
      </div>

      {/* Preview */}
      <div>
        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Preview</label>
        <div className="bg-[#141416] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/70 text-sm">Warm Up</span>
            <span className="text-white/30 text-xs ml-auto">10:00</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-white/70 text-sm">Run</span>
            <span className="text-white/30 text-xs ml-auto">
              {mode === 'distance' ? (distance || '---') : (time || '---')}
              {slowPace && fastPace ? ` @ ${slowPace}–${fastPace}/km` : slowPace ? ` @ ${slowPace}/km` : fastPace ? ` @ ${fastPace}/km` : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-white/70 text-sm">Cool Down</span>
            <span className="text-white/30 text-xs ml-auto">5:00</span>
          </div>
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
          {saved ? 'Saved!' : 'Save'}
        </button>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-semibold text-sm bg-white/10 text-white hover:bg-white/15 transition-all active:scale-[0.97]"
        >
          <Download className="w-4 h-4" />
          Export TCX
        </button>
        {garminStatus.connected && (
          <button
            onClick={handleSendToGarmin}
            disabled={garminSending}
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 px-5 font-semibold text-sm transition-all active:scale-[0.97] disabled:opacity-50"
            style={{ background: garminSent ? '#22c55e' : `${ACCENT}20`, color: garminSent ? '#fff' : ACCENT }}
          >
            {garminSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {garminSent ? 'Sent!' : 'Garmin'}
          </button>
        )}
      </div>
    </div>
  );
}
