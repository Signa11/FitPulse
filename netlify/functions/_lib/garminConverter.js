// Convert RunLab internal workout model → Garmin Connect JSON format

const STEP_TYPE_MAP = {
    warmup:   { stepTypeId: 1, stepTypeKey: 'warmup' },
    active:   { stepTypeId: 3, stepTypeKey: 'interval' },
    rest:     { stepTypeId: 4, stepTypeKey: 'rest' },
    recovery: { stepTypeId: 4, stepTypeKey: 'rest' },
    cooldown: { stepTypeId: 2, stepTypeKey: 'cooldown' },
};

const END_CONDITION_MAP = {
    time:     { conditionTypeId: 2, conditionTypeKey: 'time' },
    distance: { conditionTypeId: 3, conditionTypeKey: 'distance' },
    open:     { conditionTypeId: 1, conditionTypeKey: 'lap.button' },
};

const TARGET_TYPE_MAP = {
    no_target:  { workoutTargetTypeId: 1, workoutTargetTypeKey: 'no.target' },
    speed:      { workoutTargetTypeId: 6, workoutTargetTypeKey: 'speed.zone' },
    heart_rate: { workoutTargetTypeId: 4, workoutTargetTypeKey: 'heart.rate.zone' },
};

function convertStep(step, order) {
    const stepType = STEP_TYPE_MAP[step.type] || STEP_TYPE_MAP.active;
    const endCondition = END_CONDITION_MAP[step.durationType] || END_CONDITION_MAP.open;
    const targetType = TARGET_TYPE_MAP[step.targetType] || TARGET_TYPE_MAP.no_target;

    const garminStep = {
        type: 'ExecutableStepDTO',
        stepId: null,
        stepOrder: order,
        childStepId: null,
        description: null,
        stepType: { ...stepType },
        endCondition: { ...endCondition },
        endConditionValue: null,
        endConditionCompare: null,
        endConditionZone: null,
        preferredEndConditionUnit: null,
        targetType: { ...targetType },
        targetValueOne: null,
        targetValueTwo: null,
        zoneNumber: null,
    };

    // Duration value
    if (step.durationType === 'time' && step.durationValue) {
        garminStep.endConditionValue = step.durationValue; // seconds
    } else if (step.durationType === 'distance' && step.durationValue) {
        garminStep.endConditionValue = step.durationValue; // metres
        garminStep.preferredEndConditionUnit = { unitKey: 'kilometer' };
    }

    // Target values
    if (step.targetType === 'speed' && step.targetLow != null && step.targetHigh != null) {
        garminStep.targetValueOne = step.targetLow;   // m/s (slower)
        garminStep.targetValueTwo = step.targetHigh;   // m/s (faster)
    } else if (step.targetType === 'heart_rate' && step.targetLow != null && step.targetHigh != null) {
        garminStep.targetValueOne = step.targetLow;
        garminStep.targetValueTwo = step.targetHigh;
    }

    return garminStep;
}

export function workoutToGarminJSON(workout) {
    const steps = [];
    let stepOrder = 1;

    for (const step of workout.steps || []) {
        if (step.type === 'repeat') {
            const children = step.steps || step.children || [];
            const childSteps = [];
            let childOrder = 1;
            for (const child of children) {
                childSteps.push(convertStep(child, childOrder++));
            }
            steps.push({
                type: 'RepeatGroupDTO',
                stepId: null,
                stepOrder: stepOrder++,
                stepType: { stepTypeId: 6, stepTypeKey: 'repeat' },
                numberOfIterations: step.repeatCount || 1,
                workoutSteps: childSteps,
                smartRepeat: false,
                childStepId: null,
                endCondition: null,
                endConditionValue: null,
                preferredEndConditionUnit: null,
                endConditionCompare: null,
                endConditionZone: null,
            });
        } else {
            steps.push(convertStep(step, stepOrder++));
        }
    }

    return {
        workoutName: workout.name || 'RunLab Workout',
        description: workout.description || 'Created with RunLab',
        sportType: { sportTypeId: 1, sportTypeKey: 'running' },
        workoutSegments: [{
            segmentOrder: 1,
            sportType: { sportTypeId: 1, sportTypeKey: 'running' },
            workoutSteps: steps,
        }],
    };
}
