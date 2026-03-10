// RunLab – VDOT Calculator (Jack Daniels' Running Formula)
// Calculates VDOT from race results and derives training pace zones.

// ── Race distances in meters ────────────────────────────────
export const RACE_DISTANCES = {
  '5k': 5000,
  '10k': 10000,
  'half': 21097.5,
  'marathon': 42195,
};

// ── VDOT Lookup Table ───────────────────────────────────────
// Each entry: [VDOT, 5K time (s), 10K time (s), Half time (s), Marathon time (s),
//   Easy min/km (s), Marathon min/km (s), Threshold min/km (s), Interval min/km (s), Repetition min/km (s)]
const VDOT_TABLE = [
  [30, 1860, 3876, 8640, 18000, 462, 426, 390, 360, 342],
  [31, 1812, 3768, 8388, 17460, 450, 414, 381, 351, 333],
  [32, 1764, 3666, 8148, 16980, 438, 402, 372, 342, 324],
  [33, 1716, 3564, 7920, 16500, 426, 393, 363, 333, 315],
  [34, 1674, 3474, 7704, 16020, 414, 384, 354, 324, 306],
  [35, 1632, 3384, 7500, 15600, 405, 375, 345, 318, 300],
  [36, 1590, 3300, 7296, 15180, 396, 366, 339, 312, 294],
  [37, 1554, 3222, 7104, 14760, 387, 357, 333, 306, 288],
  [38, 1518, 3144, 6924, 14400, 378, 351, 324, 300, 282],
  [39, 1482, 3072, 6744, 14040, 372, 345, 318, 294, 276],
  [40, 1446, 3000, 6576, 13680, 363, 336, 312, 288, 270],
  [41, 1416, 2934, 6420, 13320, 357, 330, 306, 282, 267],
  [42, 1386, 2868, 6264, 13020, 348, 324, 300, 276, 261],
  [43, 1356, 2808, 6120, 12720, 342, 318, 294, 273, 258],
  [44, 1326, 2748, 5976, 12420, 336, 312, 291, 267, 252],
  [45, 1296, 2688, 5844, 12120, 330, 306, 285, 264, 249],
  [46, 1272, 2634, 5712, 11820, 324, 303, 282, 258, 246],
  [47, 1248, 2580, 5592, 11580, 318, 297, 276, 255, 240],
  [48, 1224, 2532, 5472, 11340, 312, 294, 273, 249, 237],
  [49, 1200, 2484, 5364, 11100, 309, 288, 267, 246, 234],
  [50, 1176, 2436, 5256, 10860, 303, 285, 264, 243, 228],
  [51, 1158, 2394, 5148, 10680, 300, 279, 261, 240, 225],
  [52, 1134, 2352, 5052, 10440, 294, 276, 255, 237, 222],
  [53, 1116, 2310, 4956, 10260, 291, 270, 252, 234, 219],
  [54, 1098, 2274, 4860, 10080, 285, 267, 249, 228, 216],
  [55, 1080, 2238, 4776, 9900, 282, 264, 246, 225, 213],
  [56, 1062, 2202, 4692, 9720, 279, 258, 243, 222, 210],
  [57, 1044, 2166, 4608, 9540, 273, 255, 240, 219, 207],
  [58, 1032, 2136, 4530, 9420, 270, 252, 237, 216, 204],
  [59, 1014, 2100, 4452, 9240, 267, 249, 234, 213, 201],
  [60, 1002, 2070, 4380, 9060, 264, 246, 231, 210, 198],
  [61, 984, 2040, 4308, 8940, 261, 243, 228, 207, 198],
  [62, 972, 2010, 4236, 8760, 258, 240, 225, 207, 195],
  [63, 960, 1986, 4170, 8640, 255, 237, 222, 204, 192],
  [64, 948, 1956, 4104, 8460, 252, 234, 219, 201, 189],
  [65, 936, 1932, 4038, 8340, 249, 234, 216, 198, 189],
  [66, 924, 1908, 3978, 8160, 246, 231, 216, 198, 186],
  [67, 912, 1884, 3918, 8040, 243, 228, 213, 195, 183],
  [68, 906, 1860, 3858, 7920, 240, 225, 210, 195, 183],
  [69, 894, 1842, 3804, 7800, 237, 225, 210, 192, 180],
  [70, 882, 1818, 3744, 7680, 237, 222, 207, 189, 180],
  [71, 876, 1800, 3696, 7560, 234, 219, 204, 189, 177],
  [72, 864, 1782, 3642, 7440, 231, 219, 204, 186, 177],
  [73, 858, 1764, 3594, 7380, 228, 216, 201, 186, 174],
  [74, 846, 1746, 3540, 7260, 228, 213, 201, 183, 174],
  [75, 840, 1728, 3492, 7140, 225, 213, 198, 183, 171],
  [76, 828, 1710, 3444, 7080, 222, 210, 198, 180, 171],
  [77, 822, 1698, 3402, 6960, 222, 210, 195, 180, 168],
  [78, 816, 1680, 3354, 6900, 219, 207, 195, 177, 168],
  [79, 804, 1662, 3312, 6780, 216, 207, 192, 177, 165],
  [80, 798, 1650, 3264, 6720, 216, 204, 192, 174, 165],
  [85, 756, 1560, 3072, 6300, 207, 195, 183, 168, 156],
];

const DIST_INDICES = { '5k': 1, '10k': 2, 'half': 3, 'marathon': 4 };

/**
 * Calculate VDOT from a race result using table interpolation.
 * @param {number} distanceMeters - race distance in meters
 * @param {number} timeSeconds - finish time in seconds
 * @returns {number} VDOT score (30-85)
 */
export function calculateVDOT(distanceMeters, timeSeconds) {
  // Find closest standard distance
  let distKey = null;
  let minDiff = Infinity;
  for (const [key, dist] of Object.entries(RACE_DISTANCES)) {
    const diff = Math.abs(dist - distanceMeters);
    if (diff / dist < 0.1 && diff < minDiff) { // within 10%
      minDiff = diff;
      distKey = key;
    }
  }
  if (!distKey) return null;

  // Adjust time proportionally if distance doesn't exactly match
  const ratio = RACE_DISTANCES[distKey] / distanceMeters;
  const adjustedTime = timeSeconds * ratio;

  const colIdx = DIST_INDICES[distKey];

  // Find bracketing rows
  for (let i = 0; i < VDOT_TABLE.length - 1; i++) {
    const tHigh = VDOT_TABLE[i][colIdx];
    const tLow = VDOT_TABLE[i + 1][colIdx];
    if (adjustedTime <= tHigh && adjustedTime >= tLow) {
      const frac = (tHigh - adjustedTime) / (tHigh - tLow);
      return Math.round((VDOT_TABLE[i][0] + frac * (VDOT_TABLE[i + 1][0] - VDOT_TABLE[i][0])) * 10) / 10;
    }
  }

  // Clamp to edges
  if (adjustedTime >= VDOT_TABLE[0][colIdx]) return VDOT_TABLE[0][0];
  if (adjustedTime <= VDOT_TABLE[VDOT_TABLE.length - 1][colIdx]) return VDOT_TABLE[VDOT_TABLE.length - 1][0];
  return null;
}

/**
 * Get training paces for a given VDOT.
 * Returns { easy, marathon, threshold, interval, repetition } where each is { min, max } in m/s.
 * "min" is the slower speed, "max" is the faster speed.
 */
export function getTrainingPaces(vdot) {
  if (vdot == null) return null;

  // Find bracketing rows
  let row;
  for (let i = 0; i < VDOT_TABLE.length - 1; i++) {
    if (vdot >= VDOT_TABLE[i][0] && vdot <= VDOT_TABLE[i + 1][0]) {
      const frac = (vdot - VDOT_TABLE[i][0]) / (VDOT_TABLE[i + 1][0] - VDOT_TABLE[i][0]);
      row = VDOT_TABLE[i].map((v, idx) => v + frac * (VDOT_TABLE[i + 1][idx] - v));
      break;
    }
  }
  if (!row) {
    // Exact match or clamp
    row = VDOT_TABLE.find(r => r[0] === Math.round(vdot)) || VDOT_TABLE[0];
  }

  // Pace indices: 5=Easy, 6=Marathon, 7=Threshold, 8=Interval, 9=Repetition
  // Values are seconds per km. Convert to m/s speed range.
  // Each zone gets a ±5% range around the pace value.
  const toSpeedRange = (secsPerKm) => {
    const speed = 1000 / secsPerKm;
    return {
      min: speed * 0.95, // slower
      max: speed * 1.05, // faster
    };
  };

  return {
    easy:       toSpeedRange(row[5]),
    marathon:   toSpeedRange(row[6]),
    threshold:  toSpeedRange(row[7]),
    interval:   toSpeedRange(row[8]),
    repetition: toSpeedRange(row[9]),
  };
}

/**
 * Predict race time for a distance given a VDOT.
 * @returns {number} predicted time in seconds, or null
 */
export function predictRaceTime(vdot, distanceMeters) {
  if (vdot == null) return null;

  let distKey = null;
  let minDiff = Infinity;
  for (const [key, dist] of Object.entries(RACE_DISTANCES)) {
    const diff = Math.abs(dist - distanceMeters);
    if (diff / dist < 0.1 && diff < minDiff) {
      minDiff = diff;
      distKey = key;
    }
  }
  if (!distKey) return null;

  const colIdx = DIST_INDICES[distKey];

  for (let i = 0; i < VDOT_TABLE.length - 1; i++) {
    if (vdot >= VDOT_TABLE[i][0] && vdot <= VDOT_TABLE[i + 1][0]) {
      const frac = (vdot - VDOT_TABLE[i][0]) / (VDOT_TABLE[i + 1][0] - VDOT_TABLE[i][0]);
      const time = VDOT_TABLE[i][colIdx] + frac * (VDOT_TABLE[i + 1][colIdx] - VDOT_TABLE[i][colIdx]);
      // Adjust for actual distance vs standard
      return Math.round(time * (distanceMeters / RACE_DISTANCES[distKey]));
    }
  }

  // Clamp
  const clamped = vdot <= VDOT_TABLE[0][0] ? VDOT_TABLE[0] : VDOT_TABLE[VDOT_TABLE.length - 1];
  return Math.round(clamped[colIdx] * (distanceMeters / RACE_DISTANCES[distKey]));
}

/**
 * Format seconds to "h:mm:ss" or "mm:ss".
 */
export function formatTime(totalSecs) {
  if (totalSecs == null) return '--:--';
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = Math.round(totalSecs % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Parse a time string "h:mm:ss" or "mm:ss" into seconds.
 */
export function parseTime(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = str.trim().split(':').map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}
