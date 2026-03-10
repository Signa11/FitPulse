// RunLab – Smart Plan Generator
// Generates a periodized training plan with real structured workouts
// based on VDOT fitness level and race goal.

import { createPlan } from './models';
import { calculateVDOT, getTrainingPaces, RACE_DISTANCES } from './vdot';
import {
  generateEasyRun,
  generateTempoRun,
  generateIntervalSession,
  generateLongRun,
  generateFartlek,
  generateRacePace,
} from './workoutGenerator';

// ── Phase assignment (reused logic from planTemplates.js) ───
function assignPhases(weekCount) {
  const phases = [];
  const taper = Math.max(1, Math.round(weekCount * 0.15));
  const peak = Math.max(1, Math.round(weekCount * 0.2));
  const build = Math.max(1, Math.round(weekCount * 0.35));
  const base = weekCount - build - peak - taper;
  for (let i = 0; i < base; i++) phases.push('Base');
  for (let i = 0; i < build; i++) phases.push('Build');
  for (let i = 0; i < peak; i++) phases.push('Peak');
  for (let i = 0; i < taper; i++) phases.push('Taper');
  return phases;
}

// ── Week count by race type ─────────────────────────────────
const WEEK_COUNTS = {
  '5k': 8,
  '10k': 10,
  'half': 12,
  'marathon': 16,
};

// ── Base volumes (km/week) by race type ─────────────────────
const BASE_WEEKLY_KM = {
  '5k': 25,
  '10k': 35,
  'half': 45,
  'marathon': 55,
};

// ── Phase volume multipliers ────────────────────────────────
const PHASE_VOLUME = {
  Base: 0.75,
  Build: 1.0,
  Peak: 1.1,
  Taper: 0.6,
};

// ── Day role distributions by phase ─────────────────────────
// Each array defines workout types for the week. Length = runsPerWeek.
const PHASE_PATTERNS = {
  Base: {
    3: ['easy', 'easy', 'long'],
    4: ['easy', 'tempo', 'easy', 'long'],
    5: ['easy', 'fartlek', 'easy', 'tempo', 'long'],
    6: ['easy', 'fartlek', 'easy', 'tempo', 'easy', 'long'],
  },
  Build: {
    3: ['interval', 'tempo', 'long'],
    4: ['interval', 'easy', 'tempo', 'long'],
    5: ['interval', 'easy', 'tempo', 'easy', 'long'],
    6: ['easy', 'interval', 'easy', 'tempo', 'easy', 'long'],
  },
  Peak: {
    3: ['interval', 'tempo', 'long'],
    4: ['interval', 'tempo', 'easy', 'long'],
    5: ['interval', 'easy', 'tempo', 'racepace', 'long'],
    6: ['easy', 'interval', 'easy', 'tempo', 'racepace', 'long'],
  },
  Taper: {
    3: ['easy', 'tempo', 'easy'],
    4: ['easy', 'tempo', 'easy', 'easy'],
    5: ['easy', 'easy', 'tempo', 'easy', 'easy'],
    6: ['easy', 'easy', 'tempo', 'easy', 'easy', 'easy'],
  },
};

// ── Interval progression by phase week ──────────────────────
const INTERVAL_CONFIGS = {
  Base:  { reps: 4, dist: 400 },
  Build: { reps: 5, dist: 800 },
  Peak:  { reps: 4, dist: 1000 },
  Taper: { reps: 3, dist: 400 },
};

// ── Day-of-week mapping (spread runs across the week) ───────
function spreadDays(runsPerWeek) {
  const maps = {
    3: [1, 3, 6],         // Tue, Thu, Sun
    4: [0, 2, 4, 6],      // Mon, Wed, Fri, Sun
    5: [0, 1, 3, 4, 6],   // Mon, Tue, Thu, Fri, Sun
    6: [0, 1, 2, 4, 5, 6], // Mon-Wed, Fri-Sun
  };
  return maps[runsPerWeek] || maps[4];
}

/**
 * Generate a smart training plan.
 * @param {object} params
 * @param {string} params.raceType - '5k' | '10k' | 'half' | 'marathon'
 * @param {string} [params.goalTime] - optional goal time string
 * @param {string} params.recentRaceDistance - '5k' | '10k' | 'half' | 'marathon'
 * @param {number} params.recentRaceTime - seconds
 * @param {number} params.runsPerWeek - 3-6
 * @param {string} params.startDate - ISO date string (Monday of week 1)
 * @returns {{ plan: object, workouts: object[] }}
 */
export function generateSmartPlan({
  raceType,
  goalTime,
  recentRaceDistance,
  recentRaceTime,
  runsPerWeek = 4,
  startDate,
}) {
  const clampedRuns = Math.max(3, Math.min(6, runsPerWeek));
  const distMeters = RACE_DISTANCES[recentRaceDistance] || 10000;
  const vdot = calculateVDOT(distMeters, recentRaceTime);
  const paces = getTrainingPaces(vdot || 40);
  const weekCount = WEEK_COUNTS[raceType] || 10;
  const phases = assignPhases(weekCount);
  const baseKm = BASE_WEEKLY_KM[raceType] || 35;
  const dayIndices = spreadDays(clampedRuns);

  const workouts = [];
  const weeks = [];

  const start = new Date(startDate || new Date());
  // Align to Monday
  const dayOfWeek = start.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  start.setDate(start.getDate() + mondayOffset);

  for (let w = 0; w < weekCount; w++) {
    const phase = phases[w];
    const volumeMultiplier = PHASE_VOLUME[phase];

    // Progressive overload within phase (ramp up across weeks)
    const phaseWeeks = phases.filter(p => p === phase).length;
    const phaseIndex = phases.slice(0, w).filter(p => p === phase).length;
    const progressionFactor = phase === 'Taper'
      ? 1 - (phaseIndex / phaseWeeks) * 0.4 // taper decreases
      : 1 + (phaseIndex / phaseWeeks) * 0.15; // others ramp up

    const weekKm = baseKm * volumeMultiplier * progressionFactor;
    const pattern = PHASE_PATTERNS[phase][clampedRuns] || PHASE_PATTERNS[phase][4];
    const intervalCfg = INTERVAL_CONFIGS[phase];

    const days = [];

    for (let r = 0; r < pattern.length; r++) {
      const type = pattern[r];
      const dayIndex = dayIndices[r];

      // Calculate date for this day
      const dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + w * 7 + dayIndex);
      const dateStr = dayDate.toISOString().split('T')[0];

      let workout;
      const weekLabel = `W${w + 1}`;

      switch (type) {
        case 'easy': {
          const km = Math.round(weekKm * 0.2);
          workout = generateEasyRun(`${weekLabel} Easy ${km}km`, km, paces);
          break;
        }
        case 'tempo': {
          const km = Math.round(weekKm * 0.15);
          workout = generateTempoRun(`${weekLabel} Tempo ${km}km`, Math.max(3, km), paces);
          break;
        }
        case 'interval': {
          workout = generateIntervalSession(
            `${weekLabel} Intervals ${intervalCfg.reps}x${intervalCfg.dist}m`,
            intervalCfg.reps,
            intervalCfg.dist,
            paces,
          );
          break;
        }
        case 'long': {
          const km = Math.round(weekKm * 0.35);
          workout = generateLongRun(`${weekLabel} Long ${km}km`, Math.max(6, km), paces);
          break;
        }
        case 'fartlek': {
          const minutes = Math.round(weekKm * 0.2 / 0.17); // rough: ~170m/min easy pace
          workout = generateFartlek(`${weekLabel} Fartlek`, Math.max(30, minutes), paces);
          break;
        }
        case 'racepace': {
          const km = Math.round(weekKm * 0.15);
          workout = generateRacePace(`${weekLabel} Race Pace ${km}km`, Math.max(3, km), paces, raceType);
          break;
        }
        default: {
          const km = Math.round(weekKm * 0.2);
          workout = generateEasyRun(`${weekLabel} Run ${km}km`, km, paces);
        }
      }

      workouts.push(workout);

      days.push({
        day: dayIndex,
        label: workout.name,
        type,
        workoutId: workout.id,
        date: dateStr,
        completed: false,
        rpe: null,
        completedAt: null,
        stravaActivityId: null,
        actualDistance: null,
        actualTime: null,
        notes: '',
      });
    }

    // Mark final week's last run as race day if it's a taper week at the end
    if (w === weekCount - 1 && days.length > 0) {
      const lastDay = days[days.length - 1];
      lastDay.type = 'race';
      lastDay.label = `Race Day – ${raceType.toUpperCase()}`;
    }

    weeks.push({
      weekNumber: w + 1,
      phase,
      days,
    });
  }

  const raceLabel = { '5k': '5K', '10k': '10K', 'half': 'Half Marathon', 'marathon': 'Marathon' }[raceType] || raceType;

  const plan = createPlan({
    name: `${raceLabel} Smart Plan`,
    raceType,
    goalTime: goalTime || '',
    weeks,
    vdot,
    startDate: start.toISOString().split('T')[0],
    runsPerWeek: clampedRuns,
  });

  return { plan, workouts };
}
