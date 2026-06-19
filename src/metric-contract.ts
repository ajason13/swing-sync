export const metricSchemaVersion = "0.1.0" as const;
export const caddieSetEquivalence = "not-equivalent" as const;

export const metricNames = [
  "address-stance-ratio",
  "top-shoulder-line-angle",
  "impact-spine-line-angle",
  "finish-balance-line-angle"
] as const;

export const metricUnits = ["ratio", "degrees"] as const;

export const metricPhaseIds = [
  "address",
  "toe-up",
  "mid-backswing",
  "top",
  "mid-downswing",
  "impact",
  "mid-follow-through",
  "finish"
] as const;

export const metricHandednessValues = ["right", "left", "undeclared"] as const;
export const metricValueStatuses = ["measured", "missing", "unsupported", "not-reviewed"] as const;
export const metricConfidenceKinds = ["not-calibrated", "low-evidence", "unavailable"] as const;

export const metricLimitationCodes = [
  "none",
  "phase-review-required",
  "phase-unsupported",
  "metric-not-calculated",
  "pose-evidence-low",
  "impact-not-directly-observed"
] as const;

export const prohibitedMetricPayloadKeys = [
  "bitmap",
  "bitmapUrl",
  "ballSpeed",
  "canvas",
  "clubType",
  "deviceId",
  "duration",
  "fileName",
  "filename",
  "frame",
  "frameIndex",
  "golferId",
  "height",
  "image",
  "imageBitmap",
  "keypoints",
  "landmarks",
  "mediaCharacteristics",
  "mimeType",
  "objectUrl",
  "observedSeekTimestampMs",
  "performanceNow",
  "pixels",
  "playerName",
  "pose",
  "preview",
  "requestedTimestampMs",
  "runGeneration",
  "sampleIndex",
  "sex",
  "thresholds",
  "timestamp",
  "timestampMs",
  "userId",
  "video",
  "visibility",
  "width",
  "worldLandmarks"
] as const;

export type MetricName = (typeof metricNames)[number];
export type MetricUnits = (typeof metricUnits)[number];
export type MetricPhaseId = (typeof metricPhaseIds)[number];
export type MetricHandedness = (typeof metricHandednessValues)[number];
export type MetricValueStatus = (typeof metricValueStatuses)[number];
export type MetricConfidenceKind = (typeof metricConfidenceKinds)[number];
export type MetricLimitationCode = (typeof metricLimitationCodes)[number];

export type MetricValue =
  | { status: "measured"; numericValue: number }
  | { status: Exclude<MetricValueStatus, "measured">; numericValue: null };

export interface MetricConfidence {
  kind: MetricConfidenceKind;
}

export interface SwingMetric {
  metricName: MetricName;
  value: MetricValue;
  units: MetricUnits;
  phaseId: MetricPhaseId;
  handedness: MetricHandedness;
  confidence: MetricConfidence;
  limitationNotes: readonly MetricLimitationCode[];
}

export interface SwingMetricPayload {
  schemaVersion: typeof metricSchemaVersion;
  caddieSetEquivalence: typeof caddieSetEquivalence;
  metrics: readonly SwingMetric[];
}

const metricUnitByName: Record<MetricName, MetricUnits> = {
  "address-stance-ratio": "ratio",
  "top-shoulder-line-angle": "degrees",
  "impact-spine-line-angle": "degrees",
  "finish-balance-line-angle": "degrees"
};

const metricPhaseByName: Record<MetricName, MetricPhaseId> = {
  "address-stance-ratio": "address",
  "top-shoulder-line-angle": "top",
  "impact-spine-line-angle": "impact",
  "finish-balance-line-angle": "finish"
};

const allowedLimitationsByMetricName: Record<MetricName, readonly MetricLimitationCode[]> = {
  "address-stance-ratio": [
    "none",
    "phase-review-required",
    "phase-unsupported",
    "metric-not-calculated",
    "pose-evidence-low"
  ],
  "top-shoulder-line-angle": [
    "none",
    "phase-review-required",
    "phase-unsupported",
    "metric-not-calculated",
    "pose-evidence-low"
  ],
  "impact-spine-line-angle": [
    "none",
    "phase-review-required",
    "phase-unsupported",
    "metric-not-calculated",
    "pose-evidence-low",
    "impact-not-directly-observed"
  ],
  "finish-balance-line-angle": [
    "none",
    "phase-review-required",
    "phase-unsupported",
    "metric-not-calculated",
    "pose-evidence-low"
  ]
};

const metricNameSet = new Set<string>(metricNames);
const metricUnitSet = new Set<string>(metricUnits);
const metricPhaseIdSet = new Set<string>(metricPhaseIds);
const metricHandednessSet = new Set<string>(metricHandednessValues);
const metricValueStatusSet = new Set<string>(metricValueStatuses);
const metricConfidenceKindSet = new Set<string>(metricConfidenceKinds);
const metricLimitationCodeSet = new Set<string>(metricLimitationCodes);
const prohibitedMetricPayloadKeySet = new Set<string>(prohibitedMetricPayloadKeys);

export function isSwingMetricPayload(value: unknown): value is SwingMetricPayload {
  try {
    return isPayloadObject(value);
  } catch {
    return false;
  }
}

function isPayloadObject(value: unknown): value is SwingMetricPayload {
  if (!isRecord(value) || hasProhibitedKey(value)) return false;
  if (!hasExactKeys(value, ["schemaVersion", "caddieSetEquivalence", "metrics"])) return false;
  if (value.schemaVersion !== metricSchemaVersion) return false;
  if (value.caddieSetEquivalence !== caddieSetEquivalence) return false;
  if (!Array.isArray(value.metrics)) return false;
  return value.metrics.every(isMetricObject);
}

function isMetricObject(value: unknown): value is SwingMetric {
  if (!isRecord(value) || hasProhibitedKey(value)) return false;
  if (
    !hasExactKeys(value, [
      "metricName",
      "value",
      "units",
      "phaseId",
      "handedness",
      "confidence",
      "limitationNotes"
    ])
  ) {
    return false;
  }

  if (!isMetricName(value.metricName)) return false;
  if (!isMetricValue(value.value)) return false;
  if (!isMetricUnits(value.units) || value.units !== metricUnitByName[value.metricName]) return false;
  if (!isMetricPhaseId(value.phaseId) || value.phaseId !== metricPhaseByName[value.metricName]) {
    return false;
  }
  if (!isMetricHandedness(value.handedness)) return false;
  if (value.value.status === "measured" && value.handedness === "undeclared") return false;
  if (!isMetricConfidence(value.confidence)) return false;
  if (!isCompatibleConfidence(value.value.status, value.confidence.kind)) return false;
  return isMetricLimitations(value.metricName, value.limitationNotes);
}

function isMetricValue(value: unknown): value is MetricValue {
  if (!isRecord(value) || hasProhibitedKey(value)) return false;
  if (!hasExactKeys(value, ["status", "numericValue"])) return false;
  if (!isMetricValueStatus(value.status)) return false;
  if (value.status === "measured") {
    return typeof value.numericValue === "number" && Number.isFinite(value.numericValue);
  }
  return value.numericValue === null;
}

function isMetricConfidence(value: unknown): value is MetricConfidence {
  return (
    isRecord(value) &&
    !hasProhibitedKey(value) &&
    hasExactKeys(value, ["kind"]) &&
    isMetricConfidenceKind(value.kind)
  );
}

function isCompatibleConfidence(
  status: MetricValueStatus,
  confidence: MetricConfidenceKind
): boolean {
  if (status === "measured") return confidence === "not-calibrated" || confidence === "low-evidence";
  return confidence === "unavailable";
}

function isMetricLimitations(
  metricName: MetricName,
  value: unknown
): value is readonly MetricLimitationCode[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  const seen = new Set<string>();
  const allowed = new Set<string>(allowedLimitationsByMetricName[metricName]);
  for (const item of value) {
    if (!isMetricLimitationCode(item) || !allowed.has(item) || seen.has(item)) return false;
    seen.add(item);
  }
  return !seen.has("none") || seen.size === 1;
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function hasProhibitedKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasProhibitedKey);
  if (!isRecord(value)) return false;
  for (const [key, child] of Object.entries(value)) {
    if (prohibitedMetricPayloadKeySet.has(key) || hasProhibitedKey(child)) return true;
  }
  return false;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMetricName(value: unknown): value is MetricName {
  return typeof value === "string" && metricNameSet.has(value);
}

function isMetricUnits(value: unknown): value is MetricUnits {
  return typeof value === "string" && metricUnitSet.has(value);
}

function isMetricPhaseId(value: unknown): value is MetricPhaseId {
  return typeof value === "string" && metricPhaseIdSet.has(value);
}

function isMetricHandedness(value: unknown): value is MetricHandedness {
  return typeof value === "string" && metricHandednessSet.has(value);
}

function isMetricValueStatus(value: unknown): value is MetricValueStatus {
  return typeof value === "string" && metricValueStatusSet.has(value);
}

function isMetricConfidenceKind(value: unknown): value is MetricConfidenceKind {
  return typeof value === "string" && metricConfidenceKindSet.has(value);
}

function isMetricLimitationCode(value: unknown): value is MetricLimitationCode {
  return typeof value === "string" && metricLimitationCodeSet.has(value);
}
