import type { PoseLandmark } from "./pose-contract";

export const MIN_LANDMARK_VISIBILITY = 0.5;
export const GEOMETRY_EPSILON = 1e-6;

export type GeometryWarningCode =
  | "MISSING_LANDMARK"
  | "NON_FINITE_COORDINATE"
  | "LOW_VISIBILITY"
  | "ZERO_LENGTH_VECTOR"
  | "UNDECLARED_HANDEDNESS"
  | "UNDECLARED_MIRRORING"
  | "MISSING_BASELINE"
  | "INSUFFICIENT_BASELINE";

export type GeometryMetricStatus = "measured" | "unavailable";
export type GeometryHandedness = "undeclared" | "right" | "left";
export type GeometryMirroring = "undeclared" | "yes" | "no";

export interface GeometryMetricInput {
  landmarks: readonly PoseLandmark[];
  worldLandmarks: readonly PoseLandmark[];
  baselineLandmarks?: readonly PoseLandmark[];
  handedness: GeometryHandedness;
  mirrored: GeometryMirroring;
}

export interface GeometryMetricResult {
  status: GeometryMetricStatus;
  value: number | null;
  /** Any warning forces an unavailable result; measured results have no warnings. */
  warnings: readonly GeometryWarningCode[];
}

interface Point2 {
  x: number;
  y: number;
}

interface Point3 {
  x: number;
  y: number;
  z: number;
}

type LandmarkSide = "left" | "right";

const landmarkIndex = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28
} as const;

const warningOrder: readonly GeometryWarningCode[] = [
  "UNDECLARED_HANDEDNESS",
  "UNDECLARED_MIRRORING",
  "MISSING_BASELINE",
  "MISSING_LANDMARK",
  "NON_FINITE_COORDINATE",
  "LOW_VISIBILITY",
  "ZERO_LENGTH_VECTOR",
  "INSUFFICIENT_BASELINE"
];

export function calculateShoulderAngle(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  validateMirroring(input, collector);

  const leadShoulder = getNormalizedPoint(
    input,
    sideIndex(input, "lead", "shoulder", collector),
    collector
  );
  const trailShoulder = getNormalizedPoint(
    input,
    sideIndex(input, "trail", "shoulder", collector),
    collector
  );
  const value =
    leadShoulder && trailShoulder
      ? angleOf(projectedVector(input, trailShoulder, leadShoulder), collector)
      : null;
  return finalize(value, collector);
}

export function calculateSpineAngle(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  // Spine angle does not side-select; validate handedness before signedHorizontal can default.
  validateHandedness(input, collector);
  validateMirroring(input, collector);

  const leftShoulder = getNormalizedPoint(input, landmarkIndex.leftShoulder, collector);
  const rightShoulder = getNormalizedPoint(input, landmarkIndex.rightShoulder, collector);
  const leftHip = getNormalizedPoint(input, landmarkIndex.leftHip, collector);
  const rightHip = getNormalizedPoint(input, landmarkIndex.rightHip, collector);
  const value =
    leftShoulder && rightShoulder && leftHip && rightHip
      ? spineAngle(input, leftShoulder, rightShoulder, leftHip, rightHip, collector)
      : null;
  return finalize(value, collector);
}

export function calculateLeadKneeFlex(input: GeometryMetricInput): GeometryMetricResult {
  return calculateKneeFlex(input, "lead");
}

export function calculateTrailKneeFlex(input: GeometryMetricInput): GeometryMetricResult {
  return calculateKneeFlex(input, "trail");
}

export function calculateLeadArmPlane(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  validateMirroring(input, collector);

  const leadShoulder = getNormalizedPoint(
    input,
    sideIndex(input, "lead", "shoulder", collector),
    collector
  );
  const trailShoulder = getNormalizedPoint(
    input,
    sideIndex(input, "trail", "shoulder", collector),
    collector
  );
  const leadWrist = getNormalizedPoint(
    input,
    sideIndex(input, "lead", "wrist", collector),
    collector
  );
  const value =
    leadShoulder && trailShoulder && leadWrist
      ? armPlane(input, leadShoulder, trailShoulder, leadWrist, collector)
      : null;
  return finalize(value, collector);
}

export function calculateHipRotationProxy(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  const activeLeftHip = getNormalizedPoint(input, landmarkIndex.leftHip, collector);
  const activeRightHip = getNormalizedPoint(input, landmarkIndex.rightHip, collector);
  const baseline = getBaseline(input, collector);
  const baselineLeftHip = baseline
    ? getPointFromLandmarks(baseline, landmarkIndex.leftHip, collector)
    : undefined;
  const baselineRightHip = baseline
    ? getPointFromLandmarks(baseline, landmarkIndex.rightHip, collector)
    : undefined;

  const value =
    activeLeftHip && activeRightHip && baselineLeftHip && baselineRightHip
      ? hipRotationProxy(activeLeftHip, activeRightHip, baselineLeftHip, baselineRightHip, collector)
      : null;
  return finalize(value, collector);
}

export function calculateHeadDisplacement(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  const activeNose = getNormalizedPoint(input, landmarkIndex.nose, collector);
  const baseline = getBaseline(input, collector);
  const baselineNose = baseline
    ? getPointFromLandmarks(baseline, landmarkIndex.nose, collector)
    : undefined;
  const baselineLeftShoulder = baseline
    ? getPointFromLandmarks(baseline, landmarkIndex.leftShoulder, collector)
    : undefined;
  const baselineRightShoulder = baseline
    ? getPointFromLandmarks(baseline, landmarkIndex.rightShoulder, collector)
    : undefined;

  const value =
    activeNose && baselineNose && baselineLeftShoulder && baselineRightShoulder
      ? headDisplacement(
          activeNose,
          baselineNose,
          baselineLeftShoulder,
          baselineRightShoulder,
          collector
        )
      : null;
  return finalize(value, collector);
}

function calculateKneeFlex(
  input: GeometryMetricInput,
  side: "lead" | "trail"
): GeometryMetricResult {
  const collector = new WarningCollector();

  const hip = getWorldPoint(input, sideIndex(input, side, "hip", collector), collector);
  const knee = getWorldPoint(input, sideIndex(input, side, "knee", collector), collector);
  const ankle = getWorldPoint(input, sideIndex(input, side, "ankle", collector), collector);
  const value = hip && knee && ankle ? kneeFlex(hip, knee, ankle, collector) : null;
  return finalize(value, collector);
}

function getBaseline(
  input: GeometryMetricInput,
  collector: WarningCollector
): readonly PoseLandmark[] | undefined {
  if (!input.baselineLandmarks) {
    collector.add("MISSING_BASELINE");
    return undefined;
  }
  return input.baselineLandmarks;
}

function getNormalizedPoint(
  input: GeometryMetricInput,
  index: number | undefined,
  collector: WarningCollector
): Point2 | undefined {
  if (index === undefined) return undefined;
  const point = getLandmark(input.landmarks, index, collector);
  return point ? { x: point.x, y: point.y } : undefined;
}

function getWorldPoint(
  input: GeometryMetricInput,
  index: number | undefined,
  collector: WarningCollector
): Point3 | undefined {
  if (index === undefined) return undefined;
  const point = getLandmark(input.worldLandmarks, index, collector);
  return point ? { x: point.x, y: point.y, z: point.z } : undefined;
}

function getPointFromLandmarks(
  landmarks: readonly PoseLandmark[],
  index: number,
  collector: WarningCollector
): Point2 | undefined {
  const point = getLandmark(landmarks, index, collector);
  return point ? { x: point.x, y: point.y } : undefined;
}

function getLandmark(
  landmarks: readonly PoseLandmark[],
  index: number,
  collector: WarningCollector
): PoseLandmark | undefined {
  const value = landmarks[index] as unknown;
  if (!isLandmarkRecord(value)) {
    collector.add("MISSING_LANDMARK");
    return undefined;
  }
  if (
    typeof value.x !== "number" ||
    typeof value.y !== "number" ||
    typeof value.z !== "number" ||
    typeof value.visibility !== "number"
  ) {
    collector.add("MISSING_LANDMARK");
    return undefined;
  }
  if (![value.x, value.y, value.z, value.visibility].every(Number.isFinite)) {
    collector.add("NON_FINITE_COORDINATE");
    return undefined;
  }
  if (value.visibility < MIN_LANDMARK_VISIBILITY) {
    collector.add("LOW_VISIBILITY");
  }
  return value;
}

function isLandmarkRecord(value: unknown): value is Partial<PoseLandmark> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateHandedness(input: GeometryMetricInput, collector: WarningCollector): void {
  if (input.handedness === "undeclared") collector.add("UNDECLARED_HANDEDNESS");
}

function validateMirroring(input: GeometryMetricInput, collector: WarningCollector): void {
  if (input.mirrored === "undeclared") collector.add("UNDECLARED_MIRRORING");
}

function sideIndex(
  input: GeometryMetricInput,
  side: "lead" | "trail",
  joint: "shoulder" | "wrist" | "hip" | "knee" | "ankle",
  collector: WarningCollector
): number | undefined {
  const landmarkSide = side === "lead" ? leadSide(input, collector) : trailSide(input, collector);
  return landmarkSide ? indexFor(landmarkSide, joint) : undefined;
}

function leadSide(input: GeometryMetricInput, collector: WarningCollector): LandmarkSide | undefined {
  if (input.handedness === "right") return "left";
  if (input.handedness === "left") return "right";
  collector.add("UNDECLARED_HANDEDNESS");
  return undefined;
}

function trailSide(input: GeometryMetricInput, collector: WarningCollector): LandmarkSide | undefined {
  if (input.handedness === "right") return "right";
  if (input.handedness === "left") return "left";
  collector.add("UNDECLARED_HANDEDNESS");
  return undefined;
}

function indexFor(
  side: LandmarkSide,
  joint: "shoulder" | "wrist" | "hip" | "knee" | "ankle"
): number {
  const key = `${side}${capitalize(joint)}` as keyof typeof landmarkIndex;
  return landmarkIndex[key];
}

function capitalize(value: string): string {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function projectedVector(input: GeometryMetricInput, from: Point2, to: Point2): Point2 {
  return {
    x: signedHorizontal(input, to.x - from.x),
    y: -(to.y - from.y)
  };
}

function signedHorizontal(input: GeometryMetricInput, x: number): number {
  const mirrorSign = input.mirrored === "yes" ? -1 : 1;
  const handednessSign = input.handedness === "left" ? -1 : 1;
  return x * mirrorSign * handednessSign;
}

function spineAngle(
  input: GeometryMetricInput,
  leftShoulder: Point2,
  rightShoulder: Point2,
  leftHip: Point2,
  rightHip: Point2,
  collector: WarningCollector
): number | null {
  const shoulderCenter = midpoint(leftShoulder, rightShoulder);
  const hipCenter = midpoint(leftHip, rightHip);
  const vector = {
    x: signedHorizontal(input, shoulderCenter.x - hipCenter.x),
    y: -(shoulderCenter.y - hipCenter.y)
  };
  if (!hasLength(vector, collector)) return null;
  return normalizeDegrees((Math.atan2(vector.x, vector.y) * 180) / Math.PI);
}

function angleOf(vector: Point2, collector: WarningCollector): number | null {
  if (!hasLength(vector, collector)) return null;
  return normalizeDegrees((Math.atan2(vector.y, vector.x) * 180) / Math.PI);
}

function kneeFlex(
  hip: Point3,
  knee: Point3,
  ankle: Point3,
  collector: WarningCollector
): number | null {
  const thigh = subtract3(hip, knee);
  const shank = subtract3(ankle, knee);
  const thighLength = length3(thigh);
  const shankLength = length3(shank);
  if (thighLength <= GEOMETRY_EPSILON || shankLength <= GEOMETRY_EPSILON) {
    collector.add("ZERO_LENGTH_VECTOR");
    return null;
  }
  const cosine = dot3(thigh, shank) / (thighLength * shankLength);
  return (Math.acos(clamp(cosine, -1, 1)) * 180) / Math.PI;
}

function armPlane(
  input: GeometryMetricInput,
  leadShoulder: Point2,
  trailShoulder: Point2,
  leadWrist: Point2,
  collector: WarningCollector
): number | null {
  const shoulderReference = projectedVector(input, trailShoulder, leadShoulder);
  const leadArm = projectedVector(input, leadShoulder, leadWrist);
  if (!hasLength(shoulderReference, collector) || !hasLength(leadArm, collector)) return null;
  return normalizeDegrees(
    ((Math.atan2(leadArm.y, leadArm.x) -
      Math.atan2(shoulderReference.y, shoulderReference.x)) *
      180) /
      Math.PI
  );
}

function hipRotationProxy(
  activeLeftHip: Point2,
  activeRightHip: Point2,
  baselineLeftHip: Point2,
  baselineRightHip: Point2,
  collector: WarningCollector
): number | null {
  const baselineWidth = Math.abs(baselineLeftHip.x - baselineRightHip.x);
  if (baselineWidth <= GEOMETRY_EPSILON) {
    collector.add("INSUFFICIENT_BASELINE");
    return null;
  }
  return Math.abs(activeLeftHip.x - activeRightHip.x) / baselineWidth;
}

function headDisplacement(
  activeNose: Point2,
  baselineNose: Point2,
  baselineLeftShoulder: Point2,
  baselineRightShoulder: Point2,
  collector: WarningCollector
): number | null {
  const baselineShoulderWidth = distance2(baselineLeftShoulder, baselineRightShoulder);
  if (baselineShoulderWidth <= GEOMETRY_EPSILON) {
    collector.add("INSUFFICIENT_BASELINE");
    return null;
  }
  return distance2(activeNose, baselineNose) / baselineShoulderWidth;
}

function hasLength(vector: Point2, collector: WarningCollector): boolean {
  if (length2(vector) <= GEOMETRY_EPSILON) {
    collector.add("ZERO_LENGTH_VECTOR");
    return false;
  }
  return true;
}

function midpoint(a: Point2, b: Point2): Point2 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function subtract3(a: Point3, b: Point3): Point3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function length2(vector: Point2): number {
  return Math.hypot(vector.x, vector.y);
}

function length3(vector: Point3): number {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function distance2(a: Point2, b: Point2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function dot3(a: Point3, b: Point3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeDegrees(value: number): number {
  let normalized = value;
  while (normalized > 180) normalized -= 360;
  while (normalized <= -180) normalized += 360;
  return Object.is(normalized, -0) ? 0 : normalized;
}

function finalize(value: number | null, collector: WarningCollector): GeometryMetricResult {
  const warnings = collector.values();
  if (warnings.length > 0) {
    return { status: "unavailable", value: null, warnings };
  }
  if (value === null || !Number.isFinite(value)) {
    throw new Error("Geometry metric invariant violated: unavailable result requires a warning");
  }
  return { status: "measured", value, warnings: [] };
}

class WarningCollector {
  private readonly warnings = new Set<GeometryWarningCode>();

  add(warning: GeometryWarningCode): void {
    this.warnings.add(warning);
  }

  values(): readonly GeometryWarningCode[] {
    return warningOrder.filter((warning) => this.warnings.has(warning));
  }
}
