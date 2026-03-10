import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Zap, Watch, Loader2 } from 'lucide-react';
import { useRunLab } from '../context/RunLabContext';
import WorkoutDayCard from '../components/WorkoutDayCard';
import RPEDialog from '../components/RPEDialog';
import { formatTime } from '../data/vdot';

const PHASE_COLORS = {
  Base: 'text-green-400',
  Build: 'text-blue-400',
  Peak: 'text-orange-400',
  Taper: 'text-purple-400',
};

export default function PlanViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPlan, updatePlan, getWorkout, garminStatus, sendToGarmin } = useRunLab();

  const plan = getPlan(id);
  const [currentWeek, setCurrentWeek] = useState(() => {
    if (!plan?.startDate) return 0;
    const start = new Date(plan.startDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, Math.min(diff, (plan?.weeks?.length || 1) - 1));
  });
  const [rpeDialog, setRpeDialog] = useState(null); // { weekIndex, dayIndex }
  const [sendingGarmin, setSendingGarmin] = useState(false);
  const [garminProgress, setGarminProgress] = useState('');

  if (!plan) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-white/40">Plan not found</p>
        <button onClick={() => navigate('/runlab/plan')} className="text-[#4FACFE] text-sm mt-2">Back to Plans</button>
      </div>
    );
  }

  const week = plan.weeks[currentWeek];
  const totalWeeks = plan.weeks.length;

  // Calculate race countdown
  const raceCountdown = useMemo(() => {
    if (!plan.startDate) return null;
    const start = new Date(plan.startDate);
    const raceDate = new Date(start);
    raceDate.setDate(raceDate.getDate() + totalWeeks * 7);
    const now = new Date();
    const diff = Math.ceil((raceDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [plan.startDate, totalWeeks]);

  // Week completion stats
  const weekStats = useMemo(() => {
    if (!week) return { completed: 0, total: 0 };
    const total = week.days.length;
    const completed = week.days.filter(d => d.completed).length;
    return { completed, total };
  }, [week]);

  // Toggle day completion
  const handleToggleComplete = useCallback((dayIndex) => {
    const updatedPlan = { ...plan, weeks: [...plan.weeks] };
    const w = { ...updatedPlan.weeks[currentWeek], days: [...updatedPlan.weeks[currentWeek].days] };
    const d = { ...w.days[dayIndex] };
    d.completed = !d.completed;
    d.completedAt = d.completed ? new Date().toISOString() : null;
    w.days[dayIndex] = d;
    updatedPlan.weeks[currentWeek] = w;
    updatePlan(updatedPlan);
  }, [plan, currentWeek, updatePlan]);

  // Open RPE dialog
  const handleOpenRPE = useCallback((dayIndex) => {
    setRpeDialog({ weekIndex: currentWeek, dayIndex });
  }, [currentWeek]);

  // Save RPE
  const handleSaveRPE = useCallback(({ rpe, notes }) => {
    if (!rpeDialog) return;
    const updatedPlan = { ...plan, weeks: [...plan.weeks] };
    const w = { ...updatedPlan.weeks[rpeDialog.weekIndex], days: [...updatedPlan.weeks[rpeDialog.weekIndex].days] };
    const d = { ...w.days[rpeDialog.dayIndex] };
    d.rpe = rpe;
    d.notes = notes;
    if (!d.completed) {
      d.completed = true;
      d.completedAt = new Date().toISOString();
    }
    w.days[rpeDialog.dayIndex] = d;
    updatedPlan.weeks[rpeDialog.weekIndex] = w;
    updatePlan(updatedPlan);
    setRpeDialog(null);
  }, [plan, rpeDialog, updatePlan]);

  // Send week's workouts to Garmin
  async function handleSendWeekToGarmin() {
    if (!garminStatus.connected || sendingGarmin) return;

    const workoutsToSend = week.days
      .filter(d => d.workoutId && !d.garminWorkoutId && d.type !== 'rest')
      .map(d => ({
        dayIndex: week.days.indexOf(d),
        day: d,
        workout: getWorkout(d.workoutId),
      }))
      .filter(item => item.workout);

    if (workoutsToSend.length === 0) {
      setGarminProgress('All workouts already sent!');
      setTimeout(() => setGarminProgress(''), 2000);
      return;
    }

    setSendingGarmin(true);
    const updatedPlan = { ...plan, weeks: [...plan.weeks] };
    const w = { ...updatedPlan.weeks[currentWeek], days: [...updatedPlan.weeks[currentWeek].days] };

    for (let i = 0; i < workoutsToSend.length; i++) {
      const { dayIndex, day, workout } = workoutsToSend[i];
      setGarminProgress(`Sending ${i + 1}/${workoutsToSend.length}...`);

      try {
        const result = await sendToGarmin(workout, day.date);
        const d = { ...w.days[dayIndex] };
        d.garminWorkoutId = result.garminWorkoutId;
        w.days[dayIndex] = d;
      } catch (err) {
        setGarminProgress(`Failed: ${err.message}`);
        setSendingGarmin(false);
        updatedPlan.weeks[currentWeek] = w;
        updatePlan(updatedPlan);
        return;
      }
    }

    updatedPlan.weeks[currentWeek] = w;
    updatePlan(updatedPlan);
    setSendingGarmin(false);
    setGarminProgress(`Sent ${workoutsToSend.length} workouts!`);
    setTimeout(() => setGarminProgress(''), 3000);
  }

  // Check if today falls in this week
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/runlab')} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/50" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{plan.name}</h1>
          <div className="flex items-center gap-3 text-xs text-white/40">
            {plan.vdot && (
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#4FACFE]" /> VDOT {plan.vdot}
              </span>
            )}
            {raceCountdown != null && (
              <span>{raceCountdown} days to race</span>
            )}
          </div>
        </div>
      </div>

      {/* Week navigator */}
      <div className="flex items-center justify-between bg-[#141416] border border-white/5 rounded-xl px-4 py-3">
        <button
          onClick={() => setCurrentWeek(w => Math.max(0, w - 1))}
          disabled={currentWeek === 0}
          className="p-1 rounded-lg hover:bg-white/5 disabled:opacity-20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>

        <div className="text-center">
          <div className="text-white text-sm font-semibold">Week {week.weekNumber}</div>
          <div className={`text-xs font-medium ${PHASE_COLORS[week.phase] || 'text-white/40'}`}>
            {week.phase} · {weekStats.completed}/{weekStats.total} done
          </div>
        </div>

        <button
          onClick={() => setCurrentWeek(w => Math.min(totalWeeks - 1, w + 1))}
          disabled={currentWeek === totalWeeks - 1}
          className="p-1 rounded-lg hover:bg-white/5 disabled:opacity-20 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Week progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${weekStats.total ? (weekStats.completed / weekStats.total) * 100 : 0}%`,
            background: 'linear-gradient(90deg, #4FACFE, #00F2FE)',
          }}
        />
      </div>

      {/* Day cards */}
      <div className="space-y-2">
        {week.days.map((day, di) => {
          const workout = day.workoutId ? getWorkout(day.workoutId) : null;
          const isToday = day.date === today;

          return (
            <WorkoutDayCard
              key={day.workoutId || di}
              day={day}
              workout={workout}
              isToday={isToday}
              onToggleComplete={() => handleToggleComplete(di)}
              onLogRPE={() => handleOpenRPE(di)}
              stravaActivity={null}
            />
          );
        })}

        {week.days.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm">No workouts this week</div>
        )}
      </div>

      {/* Garmin sync */}
      {garminStatus.connected && (
        <button
          onClick={handleSendWeekToGarmin}
          disabled={sendingGarmin}
          className="w-full flex items-center justify-center gap-2 bg-[#141416] border border-white/10 rounded-xl py-3 text-sm font-medium text-white/70 hover:border-[#4FACFE]/30 hover:text-white transition-all disabled:opacity-50"
        >
          {sendingGarmin ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Watch className="w-4 h-4" />
          )}
          {garminProgress || 'Send Week to Garmin'}
        </button>
      )}

      {/* Goal time */}
      {plan.goalTime && (
        <div className="bg-[#141416] border border-white/5 rounded-xl px-4 py-3 text-center">
          <span className="text-white/30 text-xs">Goal: </span>
          <span className="text-white/70 text-sm font-medium">{plan.goalTime}</span>
        </div>
      )}

      <div className="h-4" />

      {/* RPE Dialog */}
      {rpeDialog && (
        <RPEDialog
          onSubmit={handleSaveRPE}
          onClose={() => setRpeDialog(null)}
          initialRPE={plan.weeks[rpeDialog.weekIndex]?.days[rpeDialog.dayIndex]?.rpe}
          initialNotes={plan.weeks[rpeDialog.weekIndex]?.days[rpeDialog.dayIndex]?.notes || ''}
        />
      )}
    </div>
  );
}
