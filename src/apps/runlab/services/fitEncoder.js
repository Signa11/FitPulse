// RunLab – TCX/FIT workout encoder
// Primary: TCX (Training Center XML) – accepted by Garmin Connect
// Secondary: FIT binary stub (basic workout encoding)

import { StepType, DurationType, TargetType } from '../data/models';
// paceZones available for future FIT encoder enhancements

// ── TCX Encoder (Primary) ────────────────────────────────────

const STEP_TYPE_TO_TCX = {
  [StepType.WARMUP]: 'Warmup',
  [StepType.ACTIVE]: 'Active',
  [StepType.REST]: 'Rest',
  [StepType.RECOVERY]: 'Rest',
  [StepType.COOLDOWN]: 'Cooldown',
};

/**
 * Encode a workout object into a TCX XML string.
 * Garmin Connect imports these as structured workouts.
 */
export function encodeWorkoutTCX(workout) {
  const steps = workout.steps || [];
  const flatSteps = flattenSteps(steps);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2
    http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Workouts>
    <Workout Sport="Running">
      <Name>${escapeXml(workout.name || 'RunLab Workout')}</Name>
`;

  flatSteps.forEach((step, idx) => {
    xml += encodeStepTCX(step, idx + 1);
  });

  // Garmin requires a ScheduledOn element; use today
  const today = new Date().toISOString().split('T')[0];
  xml += `      <ScheduledOn>${today}</ScheduledOn>
    </Workout>
  </Workouts>
</TrainingCenterDatabase>`;

  return xml;
}

function encodeStepTCX(step, order) {
  if (step.type === StepType.REPEAT) {
    return encodeRepeatTCX(step, order);
  }

  const intensity = step.type === StepType.REST || step.type === StepType.RECOVERY
    ? 'Resting' : 'Active';
  const stepType = STEP_TYPE_TO_TCX[step.type] || 'Active';

  let durationEl = '';
  if (step.durationType === DurationType.TIME && step.durationValue) {
    durationEl = `        <Duration xsi:type="Time_t">
          <Seconds>${step.durationValue}</Seconds>
        </Duration>`;
  } else if (step.durationType === DurationType.DISTANCE && step.durationValue) {
    durationEl = `        <Duration xsi:type="Distance_t">
          <Meters>${step.durationValue}</Meters>
        </Duration>`;
  } else {
    // Open / lap button
    durationEl = `        <Duration xsi:type="UserInitiated_t" />`;
  }

  let targetEl = '';
  if (step.targetType === TargetType.SPEED && step.targetLow != null && step.targetHigh != null) {
    targetEl = `        <Target xsi:type="Speed_t">
          <SpeedZone xsi:type="CustomSpeedZone_t">
            <LowInMetersPerSecond>${step.targetLow.toFixed(4)}</LowInMetersPerSecond>
            <HighInMetersPerSecond>${step.targetHigh.toFixed(4)}</HighInMetersPerSecond>
          </SpeedZone>
        </Target>`;
  } else if (step.targetType === TargetType.HEART_RATE && step.targetLow != null && step.targetHigh != null) {
    targetEl = `        <Target xsi:type="HeartRate_t">
          <HeartRateZone xsi:type="CustomHeartRateZone_t">
            <Low>${Math.round(step.targetLow)}</Low>
            <High>${Math.round(step.targetHigh)}</High>
          </HeartRateZone>
        </Target>`;
  } else {
    targetEl = `        <Target xsi:type="NoTarget_t" />`;
  }

  return `      <Step xsi:type="Step_t">
        <StepId>${order}</StepId>
        <Name>${escapeXml(step.notes || stepType)}</Name>
        <Intensity>${intensity}</Intensity>
${durationEl}
${targetEl}
      </Step>
`;
}

function encodeRepeatTCX(repeatStep, startOrder) {
  const children = repeatStep.children || [];
  let xml = `      <Step xsi:type="Repeat_t">
        <StepId>${startOrder}</StepId>
        <Repetitions>${repeatStep.repeatCount || 1}</Repetitions>
`;
  children.forEach((child, idx) => {
    xml += encodeStepTCX(child, startOrder * 100 + idx + 1);
  });
  xml += `      </Step>
`;
  return xml;
}

/**
 * Flatten steps: resolve repeat groups so their children reference is inline.
 * Repeat groups keep their children nested.
 */
function flattenSteps(steps) {
  return steps.map(step => {
    if (step.type === StepType.REPEAT) {
      return {
        ...step,
        children: step.steps || step.children || [],
      };
    }
    return step;
  });
}

// ── Download Helper ──────────────────────────────────────────

/**
 * Trigger a browser file download.
 */
export function downloadFile(content, filename, mimeType = 'application/xml') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Convenience: encode + download a workout as TCX.
 */
export function exportWorkoutTCX(workout) {
  const tcx = encodeWorkoutTCX(workout);
  const safeName = (workout.name || 'workout').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadFile(tcx, `${safeName}.tcx`, 'application/xml');
  return tcx;
}

// ── FIT Binary Encoder (Secondary / basic) ───────────────────
// Garmin FIT is a compact binary protocol. A full implementation is complex;
// this provides a minimal workout file that many Garmin devices accept.

const FIT_HEADER_SIZE = 14;
const FIT_MESG_DEFINITION = 0x40;

// CRC-16 lookup table for FIT
const crcTable = buildCrcTable();

function buildCrcTable() {
  const table = new Uint16Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >> 1) ^ 0xA001) : (crc >> 1);
    }
    table[i] = crc;
  }
  return table;
}

function fitCrc(bytes) {
  let crc = 0;
  for (const b of bytes) {
    crc = (crc >> 8) ^ crcTable[(crc ^ b) & 0xFF];
  }
  return crc;
}

/**
 * Attempt to encode a minimal FIT workout file.
 * Returns a Uint8Array or null if encoding fails.
 */
export function encodeWorkoutFIT(workout) {
  try {
    const records = [];

    // File ID message (mesg 0)
    records.push(encodeFitFileId());

    // Workout message (mesg 26)
    records.push(encodeFitWorkoutMsg(workout));

    // Workout steps (mesg 27)
    const flatSteps = flattenSteps(workout.steps || []);
    let stepIndex = 0;
    flatSteps.forEach(step => {
      if (step.type === StepType.REPEAT) {
        const children = step.children || [];
        const repeatStart = stepIndex;
        children.forEach(child => {
          records.push(encodeFitWorkoutStep(child, stepIndex));
          stepIndex++;
        });
        records.push(encodeFitRepeatStep(repeatStart, step.repeatCount || 1, stepIndex));
        stepIndex++;
      } else {
        records.push(encodeFitWorkoutStep(step, stepIndex));
        stepIndex++;
      }
    });

    // Assemble
    const dataBytes = concatArrays(records);
    const dataSize = dataBytes.length;

    // 14-byte header
    const header = new Uint8Array(FIT_HEADER_SIZE);
    header[0] = FIT_HEADER_SIZE;     // header size
    header[1] = 0x20;                // protocol version 2.0
    header[2] = 0xB4; header[3] = 0x08; // profile version 2228 LE
    // data size (LE 4 bytes)
    header[4] = dataSize & 0xFF;
    header[5] = (dataSize >> 8) & 0xFF;
    header[6] = (dataSize >> 16) & 0xFF;
    header[7] = (dataSize >> 24) & 0xFF;
    // ".FIT" ASCII
    header[8] = 0x2E; header[9] = 0x46; header[10] = 0x49; header[11] = 0x54;
    // header CRC
    const hdrCrc = fitCrc(header.subarray(0, 12));
    header[12] = hdrCrc & 0xFF;
    header[13] = (hdrCrc >> 8) & 0xFF;

    const fullData = concatArrays([header, dataBytes]);
    const fileCrc = fitCrc(fullData);
    const crcBytes = new Uint8Array(2);
    crcBytes[0] = fileCrc & 0xFF;
    crcBytes[1] = (fileCrc >> 8) & 0xFF;

    return concatArrays([fullData, crcBytes]);
  } catch (err) {
    console.warn('FIT encoding failed, use TCX instead:', err);
    return null;
  }
}

// Minimal FIT message encoders (simplified – enough for Garmin import)

function encodeFitFileId() {
  // Definition + data for file_id (mesg 0)
  const buf = [];
  // Definition header: local 0, mesg 0, 4 fields
  buf.push(FIT_MESG_DEFINITION | 0); // definition, local 0
  buf.push(0); // reserved
  buf.push(0); // arch little-endian
  buf.push(0, 0); // global mesg number 0 (file_id) LE
  buf.push(4); // 4 fields

  // field 0: type (enum, 1 byte) = 5 (workout)
  buf.push(0, 1, 0);
  // field 1: manufacturer (uint16) = 1 (Garmin)
  buf.push(1, 2, 0x84);
  // field 2: product (uint16) = 0
  buf.push(2, 2, 0x84);
  // field 3: serial_number (uint32z)
  buf.push(3, 4, 0x8C);

  // Data record local 0
  buf.push(0); // record header local 0
  buf.push(5); // type = workout
  buf.push(1, 0); // manufacturer = 1 (Garmin) LE
  buf.push(0, 0); // product = 0
  buf.push(0, 0, 0, 0); // serial

  return new Uint8Array(buf);
}

function encodeFitWorkoutMsg(workout) {
  const name = (workout.name || 'Workout').substring(0, 15);
  const nameBytes = new TextEncoder().encode(name);
  const nameLen = 16; // fixed 16 bytes

  const buf = [];
  // Definition: local 1, mesg 26 (workout)
  buf.push(FIT_MESG_DEFINITION | 1);
  buf.push(0);
  buf.push(0);
  buf.push(26, 0); // mesg 26 LE
  buf.push(2); // 2 fields

  // field 4: wkt_name (string, 16 bytes)
  buf.push(4, nameLen, 7); // field 4, size 16, type string
  // field 6: num_valid_steps (uint16)
  buf.push(6, 2, 0x84);

  // Data
  buf.push(1); // record header local 1
  // name padded to 16 bytes
  for (let i = 0; i < nameLen; i++) {
    buf.push(i < nameBytes.length ? nameBytes[i] : 0);
  }
  // num_valid_steps
  const stepCount = countSteps(workout.steps || []);
  buf.push(stepCount & 0xFF, (stepCount >> 8) & 0xFF);

  return new Uint8Array(buf);
}

function encodeFitWorkoutStep(step, messageIndex) {
  const buf = [];
  // Definition: local 2, mesg 27 (workout_step)
  buf.push(FIT_MESG_DEFINITION | 2);
  buf.push(0);
  buf.push(0);
  buf.push(27, 0); // mesg 27 LE
  buf.push(5); // 5 fields

  // field 254: message_index (uint16)
  buf.push(254, 2, 0x84);
  // field 0: wkt_step_name (string, 16 bytes)
  buf.push(0, 16, 7);
  // field 1: duration_type (enum)
  buf.push(1, 1, 0);
  // field 2: duration_value (uint32)
  buf.push(2, 4, 0x86);
  // field 3: target_type (enum)
  buf.push(3, 1, 0);

  // Data
  buf.push(2); // record header local 2
  // message_index
  buf.push(messageIndex & 0xFF, (messageIndex >> 8) & 0xFF);
  // step name
  const name = (step.notes || step.type || '').substring(0, 15);
  const nameBytes = new TextEncoder().encode(name);
  for (let i = 0; i < 16; i++) buf.push(i < nameBytes.length ? nameBytes[i] : 0);
  // duration_type: 0=time, 1=distance, 2=hr_less, ... 28=open
  const durType = step.durationType === DurationType.TIME ? 0
    : step.durationType === DurationType.DISTANCE ? 1 : 28;
  buf.push(durType);
  // duration_value (time in ms, distance in 100ths of m)
  let durVal = 0;
  if (step.durationType === DurationType.TIME) durVal = (step.durationValue || 0) * 1000;
  else if (step.durationType === DurationType.DISTANCE) durVal = (step.durationValue || 0) * 100;
  buf.push(durVal & 0xFF, (durVal >> 8) & 0xFF, (durVal >> 16) & 0xFF, (durVal >> 24) & 0xFF);
  // target_type: 0=speed, 1=hr, 2=open, 3=cadence, ...
  const tgtType = step.targetType === TargetType.SPEED ? 0
    : step.targetType === TargetType.HEART_RATE ? 1 : 2;
  buf.push(tgtType);

  return new Uint8Array(buf);
}

function encodeFitRepeatStep(startIndex, repeatCount, messageIndex) {
  const buf = [];
  // Definition: local 3, mesg 27
  buf.push(FIT_MESG_DEFINITION | 3);
  buf.push(0);
  buf.push(0);
  buf.push(27, 0);
  buf.push(4);

  // field 254: message_index
  buf.push(254, 2, 0x84);
  // field 1: duration_type = repeat (6)
  buf.push(1, 1, 0);
  // field 2: duration_value = step index to repeat from
  buf.push(2, 4, 0x86);
  // field 5: target_value = repeat count
  buf.push(5, 4, 0x86);

  // Data
  buf.push(3);
  buf.push(messageIndex & 0xFF, (messageIndex >> 8) & 0xFF);
  buf.push(6); // duration_type = repeat_until_steps_complete
  // duration_value = start step index
  buf.push(startIndex & 0xFF, (startIndex >> 8) & 0xFF, 0, 0);
  // target_value = repeat count
  buf.push(repeatCount & 0xFF, (repeatCount >> 8) & 0xFF, 0, 0);

  return new Uint8Array(buf);
}

function countSteps(steps) {
  let count = 0;
  for (const s of steps) {
    if (s.type === StepType.REPEAT) {
      count += (s.steps || s.children || []).length + 1;
    } else {
      count++;
    }
  }
  return count;
}

function concatArrays(arrays) {
  const totalLen = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    result.set(a instanceof Uint8Array ? a : new Uint8Array(a), offset);
    offset += a.length;
  }
  return result;
}

/**
 * Convenience: encode + download a workout as FIT.
 * Falls back to TCX if FIT encoding fails.
 */
export function exportWorkoutFIT(workout) {
  const fitData = encodeWorkoutFIT(workout);
  if (fitData) {
    const safeName = (workout.name || 'workout').replace(/[^a-zA-Z0-9_-]/g, '_');
    downloadFile(fitData, `${safeName}.fit`, 'application/octet-stream');
    return true;
  }
  // Fallback to TCX
  exportWorkoutTCX(workout);
  return false;
}

// ── XML helpers ──────────────────────────────────────────────

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
