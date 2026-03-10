// RunLab – Workout Generator
// Creates structured workout objects from VDOT-derived training paces.
// Uses createWorkout / createStep / createRepeatGroup from models.js.

import { createWorkout, createStep, createRepeatGroup, StepType, DurationType, TargetType } from './models';

/**
 * Generate an easy run workout.
 * @param {string} name
 * @param {number} km - total easy distance in km
 * @param {object} paces - from getTrainingPaces()
 */
export function generateEasyRun(name, km, paces) {
  return createWorkout({
    name,
    description: `Easy run – ${km} km`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.OPEN,
        durationValue: null,
        targetType: TargetType.NO_TARGET,
      }),
      createStep({
        type: StepType.ACTIVE,
        durationType: DurationType.DISTANCE,
        durationValue: km * 1000,
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.OPEN,
        durationValue: null,
        targetType: TargetType.NO_TARGET,
      }),
    ],
  });
}

/**
 * Generate a tempo / threshold run.
 * @param {string} name
 * @param {number} km - tempo distance in km
 * @param {object} paces
 */
export function generateTempoRun(name, km, paces) {
  return createWorkout({
    name,
    description: `Tempo run – ${km} km @ threshold pace`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.TIME,
        durationValue: 600, // 10 min
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
      createStep({
        type: StepType.ACTIVE,
        durationType: DurationType.DISTANCE,
        durationValue: km * 1000,
        targetType: TargetType.SPEED,
        targetLow: paces.threshold.min,
        targetHigh: paces.threshold.max,
      }),
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.TIME,
        durationValue: 600, // 10 min
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
    ],
  });
}

/**
 * Generate an interval session.
 * @param {string} name
 * @param {number} reps - number of repetitions
 * @param {number} distMeters - interval distance in meters
 * @param {object} paces
 * @param {number} [recoveryMeters=200] - jog recovery distance
 */
export function generateIntervalSession(name, reps, distMeters, paces, recoveryMeters = 200) {
  const intervalStep = createStep({
    type: StepType.ACTIVE,
    durationType: DurationType.DISTANCE,
    durationValue: distMeters,
    targetType: TargetType.SPEED,
    targetLow: paces.interval.min,
    targetHigh: paces.interval.max,
  });

  const recoveryStep = createStep({
    type: StepType.RECOVERY,
    durationType: DurationType.DISTANCE,
    durationValue: recoveryMeters,
    targetType: TargetType.SPEED,
    targetLow: paces.easy.min,
    targetHigh: paces.easy.max,
  });

  const repeatGroup = createRepeatGroup({
    repeatCount: reps,
    steps: [intervalStep, recoveryStep],
  });

  return createWorkout({
    name,
    description: `Intervals – ${reps}x${distMeters}m @ interval pace`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.TIME,
        durationValue: 600, // 10 min
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
      repeatGroup,
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.TIME,
        durationValue: 600,
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
    ],
  });
}

/**
 * Generate a long run.
 * @param {string} name
 * @param {number} km - long run distance in km
 * @param {object} paces
 */
export function generateLongRun(name, km, paces) {
  // Blend easy + marathon pace: use easy range with slightly faster ceiling
  const blendMin = paces.easy.min;
  const blendMax = (paces.easy.max + paces.marathon.max) / 2;

  return createWorkout({
    name,
    description: `Long run – ${km} km`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.OPEN,
        durationValue: null,
        targetType: TargetType.NO_TARGET,
      }),
      createStep({
        type: StepType.ACTIVE,
        durationType: DurationType.DISTANCE,
        durationValue: km * 1000,
        targetType: TargetType.SPEED,
        targetLow: blendMin,
        targetHigh: blendMax,
      }),
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.OPEN,
        durationValue: null,
        targetType: TargetType.NO_TARGET,
      }),
    ],
  });
}

/**
 * Generate a fartlek session.
 * @param {string} name
 * @param {number} totalMinutes - approximate session length
 * @param {object} paces
 */
export function generateFartlek(name, totalMinutes, paces) {
  const surgeTime = 120; // 2 min fast
  const easyTime = 120;  // 2 min easy
  const reps = Math.max(3, Math.floor((totalMinutes - 20) / ((surgeTime + easyTime) / 60)));

  const surgeStep = createStep({
    type: StepType.ACTIVE,
    durationType: DurationType.TIME,
    durationValue: surgeTime,
    targetType: TargetType.SPEED,
    targetLow: paces.threshold.min,
    targetHigh: paces.interval.max,
  });

  const easyStep = createStep({
    type: StepType.RECOVERY,
    durationType: DurationType.TIME,
    durationValue: easyTime,
    targetType: TargetType.SPEED,
    targetLow: paces.easy.min,
    targetHigh: paces.easy.max,
  });

  const repeatGroup = createRepeatGroup({
    repeatCount: reps,
    steps: [surgeStep, easyStep],
  });

  return createWorkout({
    name,
    description: `Fartlek – ${reps}x(2min hard / 2min easy)`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.TIME,
        durationValue: 600,
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
      repeatGroup,
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.TIME,
        durationValue: 600,
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
    ],
  });
}

/**
 * Generate a race-pace run.
 * @param {string} name
 * @param {number} km - distance at race pace
 * @param {object} paces
 * @param {string} raceType - 'marathon', 'half', '10k', '5k'
 */
export function generateRacePace(name, km, paces, raceType = 'marathon') {
  const targetPace = raceType === '5k' || raceType === '10k' ? paces.threshold : paces.marathon;

  return createWorkout({
    name,
    description: `Race pace – ${km} km @ ${raceType} pace`,
    steps: [
      createStep({
        type: StepType.WARMUP,
        durationType: DurationType.TIME,
        durationValue: 900, // 15 min
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
      createStep({
        type: StepType.ACTIVE,
        durationType: DurationType.DISTANCE,
        durationValue: km * 1000,
        targetType: TargetType.SPEED,
        targetLow: targetPace.min,
        targetHigh: targetPace.max,
      }),
      createStep({
        type: StepType.COOLDOWN,
        durationType: DurationType.TIME,
        durationValue: 600,
        targetType: TargetType.SPEED,
        targetLow: paces.easy.min,
        targetHigh: paces.easy.max,
      }),
    ],
  });
}
