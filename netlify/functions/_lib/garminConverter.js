// Convert RunLab internal workout model → Garmin Connect JSON format

const STEP_TYPE_MAP = {
    warmup: 'warmup',
    active: 'interval',
    rest: 'rest',
    recovery: 'rest',
    cooldown: 'cooldown',
};

const END_CONDITION_MAP = {
    time: 'time',
    distance: 'distance',
    open: 'lap.button',
};

const TARGET_TYPE_MAP = {
    no_target: 'no.target',
    speed: 'speed.zone',
    heart_rate: 'heart.rate.zone',
};

function convertStep(step, order) {
    const garminStep = {
        stepOrder: order,
        stepType: { stepTypeKey: STEP_TYPE_MAP[step.type] || 'interval' },
        endCondition: { conditionTypeKey: END_CONDITION_MAP[step.durationType] || 'lap.button' },
        targetType: { workoutTargetTypeKey: TARGET_TYPE_MAP[step.targetType] || 'no.target' },
    };

    if (step.durationType === 'time' && step.durationValue) {
        garminStep.endConditionValue = step.durationValue; // seconds
    } else if (step.durationType === 'distance' && step.durationValue) {
        garminStep.endConditionValue = step.durationValue; // metres
    }

    if (step.targetType === 'speed' && step.targetLow != null && step.targetHigh != null) {
        garminStep.targetValueLow = step.targetLow;
        garminStep.targetValueHigh = step.targetHigh;
    } else if (step.targetType === 'heart_rate' && step.targetLow != null && step.targetHigh != null) {
        garminStep.targetValueLow = step.targetLow;
        garminStep.targetValueHigh = step.targetHigh;
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
                stepOrder: stepOrder++,
                stepType: { stepTypeKey: 'repeat' },
                numberOfIterations: step.repeatCount || 1,
                workoutSteps: childSteps,
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
