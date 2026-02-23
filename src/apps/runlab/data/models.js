// RunLab – Running workout data models

export const StepType = {
  WARMUP: 'warmup',
  ACTIVE: 'active',
  REST: 'rest',
  RECOVERY: 'recovery',
  COOLDOWN: 'cooldown',
  REPEAT: 'repeat',
};

export const DurationType = {
  TIME: 'time',         // seconds
  DISTANCE: 'distance', // metres
  OPEN: 'open',         // press-lap
};

export const TargetType = {
  NO_TARGET: 'no_target',
  SPEED: 'speed',           // m/s low–high
  HEART_RATE: 'heart_rate', // bpm low–high
};

/**
 * Create a single workout step (warmup, active, rest, cooldown).
 */
export function createStep(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type: StepType.ACTIVE,
    durationType: DurationType.TIME,
    durationValue: 300,          // 5 min default
    targetType: TargetType.NO_TARGET,
    targetLow: null,
    targetHigh: null,
    notes: '',
    ...overrides,
  };
}

/**
 * Create a repeat group that wraps child step IDs.
 */
export function createRepeatGroup(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    type: StepType.REPEAT,
    repeatCount: 3,
    stepIds: [],    // ordered IDs of child steps
    ...overrides,
  };
}

/**
 * Create a full workout definition.
 */
export function createWorkout(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'New Workout',
    description: '',
    steps: [],              // array of step / repeatGroup objects
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a multi-week training plan.
 */
export function createPlan(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'New Plan',
    raceType: '10k',         // 5k | 10k | half | marathon
    goalTime: '',             // e.g. "50:00"
    weeks: [],                // array of { weekNumber, phase, days: [{day,workoutId}] }
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
