import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { speedToPace, formatDuration, formatDistance } from '../data/paceZones';

const TYPE_COLORS = {
  easy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: '#22c55e' },
  tempo: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: '#3b82f6' },
  interval: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: '#f97316' },
  long: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', dot: '#a855f7' },
  fartlek: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', dot: '#06b6d4' },
  racepace: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: '#f43f5e' },
  race: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: '#eab308' },
  rest: { bg: 'bg-white/5', text: 'text-white/30', border: 'border-white/5', dot: '#666' },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function StepSummary({ step }) {
  const paceRange = step.targetLow && step.targetHigh
    ? `${speedToPace(step.targetLow)} – ${speedToPace(step.targetHigh)} /km`
    : null;

  const duration = step.durationType === 'time' && step.durationValue
    ? formatDuration(step.durationValue)
    : step.durationType === 'distance' && step.durationValue
      ? formatDistance(step.durationValue)
      : 'Lap button';

  const typeLabel = { warmup: 'Warmup', active: 'Active', rest: 'Rest', recovery: 'Recovery', cooldown: 'Cooldown' }[step.type] || step.type;

  return (
    <div className="flex items-center gap-2 py-1.5 text-xs">
      <span className="text-white/30 w-16 shrink-0">{typeLabel}</span>
      <span className="text-white/60">{duration}</span>
      {paceRange && <span className="text-white/40 ml-auto">{paceRange}</span>}
    </div>
  );
}

export default function WorkoutDayCard({ day, workout, isToday, onToggleComplete, onLogRPE, stravaActivity }) {
  const [expanded, setExpanded] = useState(false);
  const colors = TYPE_COLORS[day.type] || TYPE_COLORS.easy;

  // Calculate total distance from workout steps
  let totalDistance = 0;
  if (workout?.steps) {
    for (const step of workout.steps) {
      if (step.type === 'repeat' && step.steps) {
        for (const child of step.steps) {
          if (child.durationType === 'distance' && child.durationValue) {
            totalDistance += child.durationValue * (step.repeatCount || 1);
          }
        }
      } else if (step.durationType === 'distance' && step.durationValue) {
        totalDistance += step.durationValue;
      }
    }
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      isToday ? 'border-[#4FACFE]/40 ring-1 ring-[#4FACFE]/20' : `border-white/5 ${colors.border}`
    } ${day.completed ? 'opacity-70' : ''}`}>
      {/* Main card */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full text-left px-3 py-3 ${colors.bg} hover:bg-white/5 transition-colors`}
      >
        <div className="flex items-center gap-2">
          {/* Day label */}
          <span className="text-[10px] text-white/30 w-7 shrink-0">{DAY_LABELS[day.day]}</span>

          {/* Type dot */}
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors.dot }} />

          {/* Name */}
          <span className="text-white text-xs font-medium flex-1 truncate">{day.label || workout?.name || 'Run'}</span>

          {/* Distance */}
          {totalDistance > 0 && (
            <span className="text-white/30 text-[10px] shrink-0">{formatDistance(totalDistance)}</span>
          )}

          {/* Completed check */}
          {day.completed && (
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          )}

          {/* RPE badge */}
          {day.rpe && (
            <span className="text-[10px] bg-white/10 rounded-full px-1.5 py-0.5 text-white/50 shrink-0">
              RPE {day.rpe}
            </span>
          )}

          <span className="text-white/20 shrink-0">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 py-2 border-t border-white/5 bg-[#0E0E10]">
          {/* Workout steps */}
          {workout?.steps && workout.steps.length > 0 && (
            <div className="divide-y divide-white/5">
              {workout.steps.map((step, i) => {
                if (step.type === 'repeat') {
                  return (
                    <div key={step.id || i} className="py-1.5">
                      <div className="text-[10px] text-white/30 mb-1">Repeat x{step.repeatCount}</div>
                      <div className="pl-3 border-l border-white/10">
                        {(step.steps || []).map((child, ci) => (
                          <StepSummary key={child.id || ci} step={child} />
                        ))}
                      </div>
                    </div>
                  );
                }
                return <StepSummary key={step.id || i} step={step} />;
              })}
            </div>
          )}

          {/* Strava match */}
          {stravaActivity && (
            <div className="mt-2 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/70 text-[10px] truncate">{stravaActivity.name}</p>
                <p className="text-white/40 text-[10px]">
                  {formatDistance(stravaActivity.distance)} · {formatDuration(stravaActivity.time)}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                day.completed
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {day.completed ? 'Completed' : 'Mark Done'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onLogRPE(); }}
              className="flex-1 py-2 rounded-lg text-xs font-medium bg-white/5 text-white/50 hover:bg-white/10 transition-all"
            >
              {day.rpe ? `RPE: ${day.rpe}` : 'Log RPE'}
            </button>
          </div>

          {/* Notes */}
          {day.notes && (
            <p className="text-white/30 text-[10px] mt-2 italic">{day.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
