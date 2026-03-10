// RunLab – Adaptive Training Engine
// Analyzes completed weeks and suggests adjustments for upcoming training.

import { calculateVDOT, getTrainingPaces, RACE_DISTANCES } from './vdot';
import {
  generateEasyRun,
  generateTempoRun,
  generateIntervalSession,
  generateLongRun,
  generateFartlek,
  generateRacePace,
} from './workoutGenerator';

/**
 * Analyze a completed week by comparing planned vs actual performance.
 * @param {object} plan - the full plan object
 * @param {number} weekIndex - 0-based week index
 * @param {object[]} stravaActivities - array of { id, distance, time, avgPace, avgHR, date }
 * @returns {object} analysis results
 */
export function analyzeWeek(plan, weekIndex, stravaActivities = []) {
  const week = plan.weeks[weekIndex];
  if (!week) return null;

  const days = week.days;
  const totalDays = days.length;
  const completedDays = days.filter(d => d.completed);
  const completionRate = totalDays > 0 ? completedDays.length / totalDays : 0;

  // Average RPE
  const rpeValues = days.filter(d => d.rpe != null).map(d => d.rpe);
  const avgRPE = rpeValues.length > 0
    ? Math.round((rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length) * 10) / 10
    : null;

  // Match Strava activities to planned days (by date ± 1 day)
  let totalPlannedDist = 0;
  let totalActualDist = 0;
  let matchedActivities = 0;

  for (const day of days) {
    // Estimate planned distance from workout steps
    const plannedDist = day.actualDistance || estimateDayDistance(day);
    totalPlannedDist += plannedDist;

    if (day.stravaActivityId || day.actualDistance) {
      totalActualDist += day.actualDistance || 0;
      matchedActivities++;
      continue;
    }

    // Try to auto-match a Strava activity by date
    if (day.date && stravaActivities.length > 0) {
      const dayDate = new Date(day.date);
      const match = stravaActivities.find(a => {
        const actDate = new Date(a.date);
        const diff = Math.abs(dayDate - actDate);
        return diff <= 86400000; // within 1 day
      });
      if (match) {
        totalActualDist += match.distance;
        matchedActivities++;
      }
    }
  }

  const loadRatio = totalPlannedDist > 0 ? totalActualDist / totalPlannedDist : 1;

  return {
    weekNumber: week.weekNumber,
    phase: week.phase,
    completionRate,
    avgRPE,
    totalPlannedDist,
    totalActualDist,
    loadRatio,
    matchedActivities,
    totalDays,
    completedCount: completedDays.length,
  };
}

/**
 * Rough distance estimate for a day based on type.
 */
function estimateDayDistance(day) {
  const typeDistances = {
    easy: 5000,
    tempo: 7000,
    interval: 6000,
    long: 12000,
    fartlek: 6000,
    racepace: 6000,
    race: 5000,
  };
  return typeDistances[day.type] || 5000;
}

/**
 * Generate adjustment suggestions for the next week based on analysis.
 * @param {object} plan
 * @param {number} completedWeekIndex - index of the week just completed
 * @param {object} analysis - from analyzeWeek()
 * @returns {object} { recommendation, adjustments, suggestVDOTUpdate }
 */
export function getAdjustmentSuggestions(plan, completedWeekIndex, analysis) {
  if (!analysis) return null;

  const nextWeekIndex = completedWeekIndex + 1;
  if (nextWeekIndex >= plan.weeks.length) {
    return { recommendation: 'plan_complete', adjustments: [], suggestVDOTUpdate: false };
  }

  const suggestions = {
    recommendation: 'on_track', // 'on_track' | 'reduce' | 'increase' | 'repeat' | 'vdot_update'
    adjustments: [],
    suggestVDOTUpdate: false,
    volumeChange: 0, // percentage
  };

  // High RPE or overloaded → reduce
  if (analysis.avgRPE != null && analysis.avgRPE > 7) {
    suggestions.recommendation = 'reduce';
    suggestions.volumeChange = -10;
    suggestions.adjustments.push(
      `Average RPE was ${analysis.avgRPE}/10 (high). Reducing next week volume by 10%.`
    );
  } else if (analysis.loadRatio > 1.15) {
    suggestions.recommendation = 'reduce';
    suggestions.volumeChange = -10;
    suggestions.adjustments.push(
      'Actual training load exceeded plan by >15%. Dialing back next week.'
    );
  }

  // Low RPE + full completion → can increase
  if (analysis.avgRPE != null && analysis.avgRPE < 4 && analysis.completionRate >= 1) {
    suggestions.recommendation = 'increase';
    suggestions.volumeChange = 5;
    suggestions.adjustments.push(
      `Sessions felt easy (RPE ${analysis.avgRPE}). Adding 5% volume next week.`
    );
    suggestions.suggestVDOTUpdate = true;
  }

  // Low completion → consider repeat
  if (analysis.completionRate < 0.6) {
    suggestions.recommendation = 'repeat';
    suggestions.volumeChange = -10;
    suggestions.adjustments.push(
      `Only completed ${Math.round(analysis.completionRate * 100)}% of sessions. Consider repeating this week with reduced volume.`
    );
  }

  // On track
  if (suggestions.adjustments.length === 0) {
    suggestions.recommendation = 'on_track';
    suggestions.adjustments.push('Training is on track. Keep it up!');
  }

  return suggestions;
}

/**
 * Apply volume adjustments to a week's workouts.
 * Returns new workout objects with scaled distances.
 * @param {object[]} days - the week's days
 * @param {number} volumeChangePct - e.g. -10 for 10% reduction
 * @param {object} paces - from getTrainingPaces()
 * @returns {object[]} new workout objects
 */
export function adjustWeekVolume(days, volumeChangePct, paces) {
  const factor = 1 + volumeChangePct / 100;

  return days.map(day => {
    if (!day.workoutId) return null;

    // Re-generate workout with scaled volume
    const baseKm = estimateDayDistance(day) / 1000;
    const adjustedKm = Math.max(2, Math.round(baseKm * factor));
    const weekLabel = `W${day.label?.match(/W(\d+)/)?.[1] || '?'}`;

    switch (day.type) {
      case 'easy':
        return generateEasyRun(`${weekLabel} Easy ${adjustedKm}km (adjusted)`, adjustedKm, paces);
      case 'tempo':
        return generateTempoRun(`${weekLabel} Tempo ${adjustedKm}km (adjusted)`, adjustedKm, paces);
      case 'long':
        return generateLongRun(`${weekLabel} Long ${adjustedKm}km (adjusted)`, adjustedKm, paces);
      case 'interval':
        return generateIntervalSession(`${weekLabel} Intervals (adjusted)`, 4, 800, paces);
      case 'fartlek':
        return generateFartlek(`${weekLabel} Fartlek (adjusted)`, Math.round(adjustedKm / 0.17), paces);
      case 'racepace':
        return generateRacePace(`${weekLabel} Race Pace (adjusted)`, adjustedKm, paces);
      default:
        return null;
    }
  }).filter(Boolean);
}

/**
 * Check if any Strava activities suggest a VDOT update.
 * @param {object[]} activities - Strava activities
 * @param {number} currentVDOT - current plan VDOT
 * @returns {object|null} { newVDOT, raceDistance, raceTime } or null
 */
export function suggestVDOTUpdate(activities, currentVDOT) {
  if (!activities?.length || !currentVDOT) return null;

  for (const activity of activities) {
    // Check if activity distance is close to a race distance
    for (const [key, raceDist] of Object.entries(RACE_DISTANCES)) {
      const diff = Math.abs(activity.distance - raceDist) / raceDist;
      if (diff < 0.05) { // within 5%
        const newVDOT = calculateVDOT(activity.distance, activity.time);
        if (newVDOT && newVDOT > currentVDOT + 0.5) {
          return {
            newVDOT,
            raceDistance: key,
            raceTime: activity.time,
            activityName: activity.name,
          };
        }
      }
    }
  }

  return null;
}
