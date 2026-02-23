// RunLab – Preset training plan templates
// Each template defines weeks grouped into phases with daily workout outlines.

// models used by instantiated plans at runtime

// ── Helpers ──────────────────────────────────────────────────

function week(weekNumber, phase, days) {
  return { weekNumber, phase, days };
}

/** Shorthand: day slot – a workout placeholder for a specific day of the week (0=Mon..6=Sun) */
function day(dayIndex, label, type = 'easy') {
  return { day: dayIndex, label, type, workoutId: null };
}

// ── 5K Plan (8 weeks) ────────────────────────────────────────

const PLAN_5K = {
  id: 'tpl_5k_beginner',
  name: '5K – Beginner',
  raceType: '5k',
  weekCount: 8,
  description: '8-week plan to run your first or fastest 5K.',
  weeks: [
    // Base (weeks 1-3)
    week(1, 'Base', [day(0, 'Easy 3 km', 'easy'), day(2, 'Easy 3 km', 'easy'), day(4, 'Easy 3 km + strides', 'easy')]),
    week(2, 'Base', [day(0, 'Easy 4 km', 'easy'), day(2, 'Easy 3 km', 'easy'), day(4, 'Easy 4 km + strides', 'easy')]),
    week(3, 'Base', [day(0, 'Easy 5 km', 'easy'), day(2, 'Fartlek 4 km', 'fartlek'), day(4, 'Easy 5 km', 'easy')]),
    // Build (weeks 4-5)
    week(4, 'Build', [day(0, 'Intervals 5x400 m', 'interval'), day(2, 'Easy 5 km', 'easy'), day(4, 'Tempo 3 km', 'tempo'), day(6, 'Long 6 km', 'long')]),
    week(5, 'Build', [day(0, 'Intervals 6x400 m', 'interval'), day(2, 'Easy 5 km', 'easy'), day(4, 'Tempo 4 km', 'tempo'), day(6, 'Long 7 km', 'long')]),
    // Peak (weeks 6-7)
    week(6, 'Peak', [day(0, 'Intervals 5x800 m', 'interval'), day(2, 'Easy 5 km', 'easy'), day(4, 'Tempo 5 km', 'tempo'), day(6, 'Long 8 km', 'long')]),
    week(7, 'Peak', [day(0, 'Intervals 4x1000 m', 'interval'), day(2, 'Easy 4 km', 'easy'), day(4, 'Race pace 3 km', 'tempo'), day(6, 'Long 6 km', 'long')]),
    // Taper (week 8)
    week(8, 'Taper', [day(0, 'Easy 3 km + strides', 'easy'), day(2, 'Easy 3 km', 'easy'), day(5, 'Race Day 5K', 'race')]),
  ],
};

// ── 10K Plan (10 weeks) ──────────────────────────────────────

const PLAN_10K = {
  id: 'tpl_10k_intermediate',
  name: '10K – Intermediate',
  raceType: '10k',
  weekCount: 10,
  description: '10-week plan for a strong 10K finish.',
  weeks: [
    // Base
    week(1, 'Base', [day(0, 'Easy 5 km', 'easy'), day(2, 'Easy 5 km', 'easy'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 8 km', 'long')]),
    week(2, 'Base', [day(0, 'Easy 5 km', 'easy'), day(2, 'Fartlek 5 km', 'fartlek'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 9 km', 'long')]),
    week(3, 'Base', [day(0, 'Easy 6 km', 'easy'), day(2, 'Fartlek 6 km', 'fartlek'), day(4, 'Easy 5 km', 'easy'), day(6, 'Long 10 km', 'long')]),
    // Build
    week(4, 'Build', [day(0, 'Intervals 6x400 m', 'interval'), day(2, 'Easy 6 km', 'easy'), day(4, 'Tempo 5 km', 'tempo'), day(6, 'Long 11 km', 'long')]),
    week(5, 'Build', [day(0, 'Intervals 5x800 m', 'interval'), day(2, 'Easy 6 km', 'easy'), day(4, 'Tempo 6 km', 'tempo'), day(6, 'Long 12 km', 'long')]),
    week(6, 'Build', [day(0, 'Intervals 4x1000 m', 'interval'), day(2, 'Easy 6 km', 'easy'), day(4, 'Tempo 6 km', 'tempo'), day(6, 'Long 13 km', 'long')]),
    // Peak
    week(7, 'Peak', [day(0, 'Intervals 3x1600 m', 'interval'), day(2, 'Easy 5 km', 'easy'), day(4, 'Tempo 7 km', 'tempo'), day(6, 'Long 14 km', 'long')]),
    week(8, 'Peak', [day(0, 'Intervals 5x1000 m', 'interval'), day(2, 'Easy 5 km', 'easy'), day(4, 'Race pace 5 km', 'tempo'), day(6, 'Long 12 km', 'long')]),
    // Taper
    week(9, 'Taper', [day(0, 'Easy 5 km + strides', 'easy'), day(2, 'Tempo 3 km', 'tempo'), day(4, 'Easy 4 km', 'easy'), day(6, 'Long 8 km', 'long')]),
    week(10, 'Taper', [day(0, 'Easy 4 km', 'easy'), day(2, 'Easy 3 km + strides', 'easy'), day(5, 'Race Day 10K', 'race')]),
  ],
};

// ── Half Marathon Plan (12 weeks) ────────────────────────────

const PLAN_HALF = {
  id: 'tpl_half_intermediate',
  name: 'Half Marathon – Intermediate',
  raceType: 'half',
  weekCount: 12,
  description: '12-week half marathon training plan.',
  weeks: [
    // Base (1-3)
    week(1, 'Base', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 6 km', 'easy'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 10 km', 'long')]),
    week(2, 'Base', [day(0, 'Easy 6 km', 'easy'), day(2, 'Fartlek 6 km', 'fartlek'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 12 km', 'long')]),
    week(3, 'Base', [day(0, 'Easy 7 km', 'easy'), day(2, 'Fartlek 7 km', 'fartlek'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 14 km', 'long')]),
    // Build (4-7)
    week(4, 'Build', [day(0, 'Intervals 6x800 m', 'interval'), day(2, 'Easy 7 km', 'easy'), day(4, 'Tempo 6 km', 'tempo'), day(6, 'Long 15 km', 'long')]),
    week(5, 'Build', [day(0, 'Intervals 5x1000 m', 'interval'), day(2, 'Easy 7 km', 'easy'), day(4, 'Tempo 7 km', 'tempo'), day(6, 'Long 16 km', 'long')]),
    week(6, 'Build', [day(0, 'Intervals 4x1600 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 8 km', 'tempo'), day(6, 'Long 18 km', 'long')]),
    week(7, 'Build', [day(0, 'Intervals 3x2000 m', 'interval'), day(2, 'Easy 7 km', 'easy'), day(4, 'Tempo 8 km', 'tempo'), day(6, 'Long 19 km', 'long')]),
    // Peak (8-10)
    week(8, 'Peak', [day(0, 'Intervals 5x1000 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 9 km', 'tempo'), day(6, 'Long 21 km', 'long')]),
    week(9, 'Peak', [day(0, 'Intervals 4x1600 m', 'interval'), day(2, 'Easy 7 km', 'easy'), day(4, 'Race pace 8 km', 'tempo'), day(6, 'Long 18 km', 'long')]),
    week(10, 'Peak', [day(0, 'Intervals 6x800 m', 'interval'), day(2, 'Easy 7 km', 'easy'), day(4, 'Tempo 7 km', 'tempo'), day(6, 'Long 21 km', 'long')]),
    // Taper (11-12)
    week(11, 'Taper', [day(0, 'Easy 6 km + strides', 'easy'), day(2, 'Tempo 5 km', 'tempo'), day(4, 'Easy 5 km', 'easy'), day(6, 'Long 13 km', 'long')]),
    week(12, 'Taper', [day(0, 'Easy 5 km', 'easy'), day(2, 'Easy 4 km + strides', 'easy'), day(5, 'Race Day Half Marathon', 'race')]),
  ],
};

// ── Marathon Plan (16 weeks) ─────────────────────────────────

const PLAN_MARATHON = {
  id: 'tpl_marathon_intermediate',
  name: 'Marathon – Intermediate',
  raceType: 'marathon',
  weekCount: 16,
  description: '16-week marathon training plan.',
  weeks: [
    // Base (1-4)
    week(1, 'Base', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 8 km', 'easy'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 14 km', 'long')]),
    week(2, 'Base', [day(0, 'Easy 7 km', 'easy'), day(2, 'Fartlek 8 km', 'fartlek'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 16 km', 'long')]),
    week(3, 'Base', [day(0, 'Easy 8 km', 'easy'), day(2, 'Fartlek 8 km', 'fartlek'), day(4, 'Easy 8 km', 'easy'), day(6, 'Long 18 km', 'long')]),
    week(4, 'Base', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 6 km', 'easy'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 14 km', 'long')]),
    // Build (5-9)
    week(5, 'Build', [day(0, 'Intervals 6x800 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 8 km', 'tempo'), day(6, 'Long 20 km', 'long')]),
    week(6, 'Build', [day(0, 'Intervals 5x1000 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 8 km', 'tempo'), day(6, 'Long 22 km', 'long')]),
    week(7, 'Build', [day(0, 'Intervals 4x1600 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 10 km', 'tempo'), day(6, 'Long 24 km', 'long')]),
    week(8, 'Build', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 6 km', 'easy'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 16 km', 'long')]),
    week(9, 'Build', [day(0, 'Intervals 3x2000 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 10 km', 'tempo'), day(6, 'Long 26 km', 'long')]),
    // Peak (10-13)
    week(10, 'Peak', [day(0, 'Intervals 5x1000 m', 'interval'), day(2, 'Easy 10 km', 'easy'), day(4, 'Tempo 10 km', 'tempo'), day(6, 'Long 29 km', 'long')]),
    week(11, 'Peak', [day(0, 'Intervals 4x1600 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Race pace 10 km', 'tempo'), day(6, 'Long 24 km', 'long')]),
    week(12, 'Peak', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 6 km', 'easy'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 18 km', 'long')]),
    week(13, 'Peak', [day(0, 'Intervals 6x800 m', 'interval'), day(2, 'Easy 8 km', 'easy'), day(4, 'Tempo 10 km', 'tempo'), day(6, 'Long 32 km', 'long')]),
    // Taper (14-16)
    week(14, 'Taper', [day(0, 'Easy 8 km + strides', 'easy'), day(2, 'Tempo 6 km', 'tempo'), day(4, 'Easy 6 km', 'easy'), day(6, 'Long 19 km', 'long')]),
    week(15, 'Taper', [day(0, 'Easy 6 km', 'easy'), day(2, 'Easy 5 km + strides', 'easy'), day(4, 'Easy 5 km', 'easy'), day(6, 'Long 13 km', 'long')]),
    week(16, 'Taper', [day(0, 'Easy 5 km', 'easy'), day(2, 'Easy 3 km + strides', 'easy'), day(5, 'Race Day Marathon', 'race')]),
  ],
};

// ── Exports ──────────────────────────────────────────────────

export const PLAN_TEMPLATES = [PLAN_5K, PLAN_10K, PLAN_HALF, PLAN_MARATHON];

export const RACE_TYPES = [
  { value: '5k', label: '5K' },
  { value: '10k', label: '10K' },
  { value: 'half', label: 'Half Marathon' },
  { value: 'marathon', label: 'Marathon' },
];

/**
 * Retrieve templates filtered by race type.
 */
export function getTemplatesForRace(raceType) {
  return PLAN_TEMPLATES.filter(t => t.raceType === raceType);
}

/**
 * Deep clone a template into a fresh plan (new IDs).
 */
export function instantiateTemplate(template) {
  return {
    ...template,
    id: crypto.randomUUID(),
    name: template.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    weeks: template.weeks.map(w => ({
      ...w,
      days: w.days.map(d => ({ ...d })),
    })),
  };
}

/**
 * Generate a blank plan skeleton for a given race type and week count.
 */
export function createBlankPlanWeeks(weekCount) {
  const phases = assignPhases(weekCount);
  return Array.from({ length: weekCount }, (_, i) => week(i + 1, phases[i], []));
}

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
