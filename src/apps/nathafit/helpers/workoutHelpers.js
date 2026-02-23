import workoutData from '../data/workouts.json';

export const FOCUS_MAP = {
  'Legs & Cardio': { icon: '🦵', cls: 'legs' },
  'Legs': { icon: '🦵', cls: 'legs' },
  'Arms & Abs': { icon: '💪', cls: 'arms' },
  'Arms': { icon: '💪', cls: 'arms' },
  'Abs': { icon: '🔥', cls: 'abs' },
  'Abs & Cardio': { icon: '🔥', cls: 'abs' },
  'Full Body': { icon: '⚡', cls: 'full' },
  'Full Body (Optional)': { icon: '⚡', cls: 'full' },
};

export function getIcon(focus) {
  return FOCUS_MAP[focus] || { icon: '🏋️', cls: 'full' };
}

export function formatReps(ex) {
  if (ex.type === 'time') return `${ex.duration}s`;
  return `${ex.reps}×`;
}

export function getPhaseLabel(id) {
  const map = {
    'pre-training': 'Pre-Training',
    'training-1': 'Weeks 1–4',
    'training-2': 'Weeks 5–8',
    'training-3': 'Weeks 9–12',
  };
  return map[id] || id;
}

export function getPhaseShort(id) {
  const map = {
    'pre-training': 'Pre',
    'training-1': 'W1–4',
    'training-2': 'W5–8',
    'training-3': 'W9–12',
  };
  return map[id] || id;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getWeeksForPhase(phaseId) {
  const workouts = workoutData.workouts.filter(w => w.phase === phaseId);
  const weeks = [...new Set(workouts.map(w => w.week))].sort((a, b) => a - b);
  return weeks.map(week => ({
    week,
    workouts: workouts.filter(w => w.week === week),
  }));
}

export function findNextWorkout(completedSet) {
  return workoutData.workouts.find(w => !completedSet.has(w.id)) || null;
}

export function getIconBg(cls) {
  const map = {
    legs: 'bg-pink-500/20',
    arms: 'bg-purple-500/20',
    abs: 'bg-orange-500/20',
    full: 'bg-emerald-500/20',
  };
  return map[cls] || 'bg-white/10';
}

export { workoutData };
