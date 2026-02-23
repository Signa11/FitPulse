// RunLab – Pace zone calculator & pace string utilities

/**
 * Convert a "mm:ss" pace string (per km) to speed in m/s.
 * Returns null on invalid input.
 */
export function paceToSpeed(paceStr) {
  if (!paceStr || typeof paceStr !== 'string') return null;
  const parts = paceStr.split(':');
  if (parts.length !== 2) return null;
  const mins = parseInt(parts[0], 10);
  const secs = parseInt(parts[1], 10);
  if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || secs > 59) return null;
  const totalSecs = mins * 60 + secs;
  if (totalSecs === 0) return null;
  return 1000 / totalSecs;      // m/s
}

/**
 * Convert speed in m/s to a "m:ss" pace string (per km).
 */
export function speedToPace(speed) {
  if (!speed || speed <= 0) return '--:--';
  const secsPerKm = 1000 / speed;
  const mins = Math.floor(secsPerKm / 60);
  const secs = Math.round(secsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format seconds into "h:mm:ss" or "m:ss".
 */
export function formatDuration(totalSecs) {
  if (totalSecs == null || totalSecs < 0) return '0:00';
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = Math.round(totalSecs % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format metres to a friendly distance string.
 */
export function formatDistance(metres) {
  if (metres == null) return '';
  if (metres >= 1000) return `${(metres / 1000).toFixed(2)} km`;
  return `${Math.round(metres)} m`;
}

/**
 * Parse a user-entered duration string into seconds.
 * Accepts "mm:ss", "m:ss", or plain number (minutes).
 */
export function parseDuration(input) {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  const str = input.trim();
  if (str.includes(':')) {
    const [m, s] = str.split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
  }
  const n = parseFloat(str);
  return isNaN(n) ? 0 : n * 60;
}

/**
 * Parse a distance string into metres.
 * "1.5 km" => 1500, "400 m" => 400, "400" => 400 (default m).
 */
export function parseDistance(input) {
  if (typeof input === 'number') return input;
  if (!input) return 0;
  const str = input.trim().toLowerCase();
  if (str.endsWith('km')) return parseFloat(str) * 1000;
  return parseFloat(str) || 0;
}

// ── Pace Zones ──────────────────────────────────────────────

const ZONE_DEFINITIONS = [
  { name: 'Recovery',  label: 'Z1', pctLow: 1.25, pctHigh: 1.35 },
  { name: 'Easy',      label: 'Z2', pctLow: 1.12, pctHigh: 1.25 },
  { name: 'Tempo',     label: 'Z3', pctLow: 1.02, pctHigh: 1.12 },
  { name: 'Threshold', label: 'Z4', pctLow: 0.97, pctHigh: 1.02 },
  { name: 'VO2max',    label: 'Z5', pctLow: 0.90, pctHigh: 0.97 },
  { name: 'Sprint',    label: 'Z6', pctLow: 0.78, pctHigh: 0.90 },
];

/**
 * Calculate pace zones from a threshold pace (mm:ss per km).
 * Returns an array of { name, label, paceLow, paceHigh, speedLow, speedHigh }.
 * "paceLow" is the faster end (lower number), "paceHigh" is the slower end.
 */
export function calculatePaceZones(thresholdPaceStr) {
  const thresholdSpeed = paceToSpeed(thresholdPaceStr);
  if (!thresholdSpeed) return [];

  const thresholdSecsPerKm = 1000 / thresholdSpeed;

  return ZONE_DEFINITIONS.map(z => {
    const slowSecs = thresholdSecsPerKm * z.pctHigh;
    const fastSecs = thresholdSecsPerKm * z.pctLow;
    return {
      name: z.name,
      label: z.label,
      paceLow: secsToMinSec(fastSecs),
      paceHigh: secsToMinSec(slowSecs),
      speedLow: 1000 / slowSecs,
      speedHigh: 1000 / fastSecs,
    };
  });
}

function secsToMinSec(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = Math.round(totalSecs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
