import { useState } from 'react';
import { X } from 'lucide-react';

const RPE_LEVELS = [
  { value: 1, label: 'Very light', color: '#22c55e' },
  { value: 2, label: 'Light', color: '#4ade80' },
  { value: 3, label: 'Moderate', color: '#86efac' },
  { value: 4, label: 'Somewhat hard', color: '#facc15' },
  { value: 5, label: 'Hard', color: '#fbbf24' },
  { value: 6, label: 'Harder', color: '#f59e0b' },
  { value: 7, label: 'Very hard', color: '#f97316' },
  { value: 8, label: 'Extremely hard', color: '#ef4444' },
  { value: 9, label: 'Near max', color: '#dc2626' },
  { value: 10, label: 'Maximum', color: '#991b1b' },
];

export default function RPEDialog({ onSubmit, onClose, initialRPE = null, initialNotes = '' }) {
  const [rpe, setRpe] = useState(initialRPE);
  const [notes, setNotes] = useState(initialNotes);

  function handleSubmit() {
    if (rpe == null) return;
    onSubmit({ rpe, notes });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div className="bg-[#1A1A1D] border border-white/10 rounded-2xl w-full max-w-sm p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">Rate Your Effort</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* RPE grid */}
        <div className="grid grid-cols-5 gap-2">
          {RPE_LEVELS.map(level => (
            <button
              key={level.value}
              onClick={() => setRpe(level.value)}
              className={`flex flex-col items-center py-2.5 rounded-xl transition-all border ${
                rpe === level.value
                  ? 'border-white/30 scale-105'
                  : 'border-transparent hover:bg-white/5'
              }`}
              style={rpe === level.value ? { background: `${level.color}20` } : {}}
            >
              <span className="text-lg font-bold" style={{ color: level.color }}>{level.value}</span>
              <span className="text-[9px] text-white/40 mt-0.5 leading-tight text-center">{level.label}</span>
            </button>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-white/40 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            placeholder="How did it feel?"
            className="w-full bg-[#141416] border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#4FACFE]/50 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={rpe == null}
          className="w-full py-3 rounded-xl font-semibold text-sm text-black transition-all disabled:opacity-30"
          style={{ background: '#4FACFE' }}
        >
          Save RPE
        </button>
      </div>
    </div>
  );
}
