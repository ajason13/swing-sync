# SS-009 Claude Final Implementation Focused Re-Review Prompt

Use this prompt in Claude Chat for focused final implementation re-review.
Claude does not have filesystem or GitHub access, so this prompt includes the
actual source files inline.

## Role

You are Claude acting as the adversarial final implementation auditor for Swing
Sync story `SS-009 Implement joint angle and coordinate normalization
utilities`.

Stage: **focused final implementation re-review**.

Prior final audit verdict: **FAIL** due to B7, because the prompt summarized
implementation behavior instead of providing the actual source and test files.

Your task is to review the actual source below and determine whether B7 is
closed and whether conditional checks C1-C4 or the missing-test confirmations
surface any implementation blockers.

## Required Verdict Format

Return:

- `PASS` or `FAIL`;
- B7 status: closed or still open;
- status for C1-C4: confirmed, refuted, or blocker;
- any new blockers;
- non-blocking recommendations;
- explicit sign-off status.

## Story Acceptance Criteria

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

## Protected Boundaries

- Raw swing video remains local-first and is not uploaded by default.
- Landmarks, movement patterns, phase labels, and metric primitives are
  sensitive derived data.
- SS-009 must not add export, persistence, telemetry, remote logging, cloud
  storage, network calls, SDK/model/provider changes, dependencies, workers, or
  public serving.
- SS-009 must not expand `src/metric-contract.ts` or
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`.
- SS-009 must not create `SwingMetricPayload` objects.
- SS-009 must not make medical, injury-prevention, professional coaching,
  calibration, benchmark, CaddieSet equivalence, guaranteed correctness, or
  absolute privacy/deletion claims.

## Prior Conditional Checks To Confirm

- C1: `finalize` must be the only path that constructs a `GeometryMetricResult`
  and any warning must force `unavailable`/`null`.
- C2: knee flex must not reference or validate `mirrored`.
- C3: unused-array corruption test must corrupt arrays knee flex does not
  consume while leaving `worldLandmarks` valid.
- C4: near-parallel knee vector test must assert a measured near-zero angle,
  not just "does not throw".

Also confirm:

- warning order is enforced by collector ordering, not per-call convention;
- `MISSING_BASELINE`, `INSUFFICIENT_BASELINE`, and baseline low visibility are
  independently asserted;
- active low visibility below threshold is covered;
- exact visibility threshold is accepted;
- ratio primitives assert mirrored/unmirrored values and warnings are
  identical;
- single warning-only failures across public primitives return
  `unavailable` and `value: null`.

## Source: `src/geometry-metrics.ts`

```ts
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
  validateHandedness(input, collector);
  validateMirroring(input, collector);

  const leadShoulder = getNormalizedPoint(input, sideIndex(input, "lead", "shoulder"), collector);
  const trailShoulder = getNormalizedPoint(input, sideIndex(input, "trail", "shoulder"), collector);
  const value =
    leadShoulder && trailShoulder
      ? angleOf(projectedVector(input, trailShoulder, leadShoulder), collector)
      : null;
  return finalize(value, collector);
}

export function calculateSpineAngle(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
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
  return calculateKneeFlex(input, leadSide(input));
}

export function calculateTrailKneeFlex(input: GeometryMetricInput): GeometryMetricResult {
  return calculateKneeFlex(input, trailSide(input));
}

export function calculateLeadArmPlane(input: GeometryMetricInput): GeometryMetricResult {
  const collector = new WarningCollector();
  validateHandedness(input, collector);
  validateMirroring(input, collector);

  const leadShoulder = getNormalizedPoint(input, sideIndex(input, "lead", "shoulder"), collector);
  const trailShoulder = getNormalizedPoint(input, sideIndex(input, "trail", "shoulder"), collector);
  const leadWrist = getNormalizedPoint(input, sideIndex(input, "lead", "wrist"), collector);
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
  side: LandmarkSide | undefined
): GeometryMetricResult {
  const collector = new WarningCollector();
  validateHandedness(input, collector);

  const hip = side ? getWorldPoint(input, indexFor(side, "hip"), collector) : undefined;
  const knee = side ? getWorldPoint(input, indexFor(side, "knee"), collector) : undefined;
  const ankle = side ? getWorldPoint(input, indexFor(side, "ankle"), collector) : undefined;
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
  joint: "shoulder" | "wrist" | "hip" | "knee" | "ankle"
): number | undefined {
  const landmarkSide = side === "lead" ? leadSide(input) : trailSide(input);
  return landmarkSide ? indexFor(landmarkSide, joint) : undefined;
}

function leadSide(input: GeometryMetricInput): LandmarkSide | undefined {
  if (input.handedness === "right") return "left";
  if (input.handedness === "left") return "right";
  return undefined;
}

function trailSide(input: GeometryMetricInput): LandmarkSide | undefined {
  if (input.handedness === "right") return "right";
  if (input.handedness === "left") return "left";
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
  if (warnings.length > 0 || value === null || !Number.isFinite(value)) {
    return {
      status: "unavailable",
      value: null,
      warnings: warnings.length > 0 ? warnings : ["ZERO_LENGTH_VECTOR"]
    };
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
```

## Source: `test/unit/geometry-metrics.test.ts`

```ts
import { describe, expect, it } from "vitest";
import {
  calculateHeadDisplacement,
  calculateHipRotationProxy,
  calculateLeadArmPlane,
  calculateLeadKneeFlex,
  calculateShoulderAngle,
  calculateSpineAngle,
  calculateTrailKneeFlex,
  GEOMETRY_EPSILON,
  MIN_LANDMARK_VISIBILITY,
  type GeometryMetricInput
} from "../../src/geometry-metrics";
import type { PoseLandmark } from "../../src/pose-contract";

function landmark(overrides: Partial<PoseLandmark> = {}): PoseLandmark {
  return { x: 0, y: 0, z: 0, visibility: 1, ...overrides };
}

function landmarks(): PoseLandmark[] {
  return Array.from({ length: 33 }, () => landmark());
}

function standardInput(): GeometryMetricInput {
  const normalized = landmarks();
  normalized[0] = landmark({ x: 0, y: -0.7 });
  normalized[11] = landmark({ x: 0.2, y: -0.5 });
  normalized[12] = landmark({ x: -0.2, y: -0.5 });
  normalized[15] = landmark({ x: 0.2, y: -0.1 });
  normalized[16] = landmark({ x: -0.2, y: -0.1 });
  normalized[23] = landmark({ x: 0.15, y: 0 });
  normalized[24] = landmark({ x: -0.15, y: 0 });

  const world = landmarks();
  world[23] = landmark({ x: 0, y: 0.5, z: 0 });
  world[24] = landmark({ x: 0, y: 0.5, z: 0 });
  world[25] = landmark({ x: 0, y: 0, z: 0 });
  world[26] = landmark({ x: 0, y: 0, z: 0 });
  world[27] = landmark({ x: 0.3535533906, y: -0.3535533906, z: 0 });
  world[28] = landmark({ x: -0.3535533906, y: -0.3535533906, z: 0 });

  return {
    landmarks: normalized,
    worldLandmarks: world,
    baselineLandmarks: normalized.map((point) => ({ ...point })),
    handedness: "right",
    mirrored: "no"
  };
}

function expectMeasured(value: ReturnType<typeof calculateShoulderAngle>, expected: number): void {
  expect(value.status).toBe("measured");
  expect(value.warnings).toEqual([]);
  expect(value.value).toBeCloseTo(expected, 4);
}

function expectUnavailable(
  value: ReturnType<typeof calculateShoulderAngle>,
  warnings: readonly string[]
): void {
  expect(value.status).toBe("unavailable");
  expect(value.value).toBeNull();
  expect(value.warnings).toEqual(warnings);
}

describe("calculateShoulderAngle", () => {
  it("returns zero for level right-handed shoulders", () => {
    expectMeasured(calculateShoulderAngle(standardInput()), 0);
  });

  it("returns a signed projected shoulder angle and applies mirroring sign only to angles", () => {
    const input = standardInput();
    input.landmarks[11] = landmark({ x: 0.2, y: -0.535 });
    input.landmarks[12] = landmark({ x: -0.2, y: -0.465 });

    expectMeasured(calculateShoulderAngle(input), 9.9262);
    expectMeasured(calculateShoulderAngle({ ...input, mirrored: "yes" }), 170.0738);
  });

  it("returns unavailable for warning-only undeclared input", () => {
    expectUnavailable(calculateShoulderAngle({ ...standardInput(), handedness: "undeclared" }), [
      "UNDECLARED_HANDEDNESS"
    ]);
    expectUnavailable(calculateShoulderAngle({ ...standardInput(), mirrored: "undeclared" }), [
      "UNDECLARED_MIRRORING"
    ]);
  });

  it("returns unavailable for active low visibility", () => {
    const input = standardInput();
    input.landmarks[11].visibility = MIN_LANDMARK_VISIBILITY - 0.001;
    expectUnavailable(calculateShoulderAngle(input), ["LOW_VISIBILITY"]);
  });

  it("collects cumulative warnings in canonical order", () => {
    const input = standardInput();
    input.landmarks[11] = landmark({ x: 0, y: 0, visibility: 0.25 });
    input.landmarks[12] = landmark({ x: 0, y: 0, visibility: 0.25 });

    expectUnavailable(
      calculateShoulderAngle({ ...input, handedness: "undeclared", mirrored: "undeclared" }),
      ["UNDECLARED_HANDEDNESS", "UNDECLARED_MIRRORING"]
    );
  });
});

describe("calculateSpineAngle", () => {
  it("returns zero for a vertical projected spine centerline", () => {
    expectMeasured(calculateSpineAngle(standardInput()), 0);
  });

  it("returns a signed projected spine angle", () => {
    const input = standardInput();
    input.landmarks[11] = landmark({ x: -0.03, y: -0.5 });
    input.landmarks[12] = landmark({ x: -0.09, y: -0.5 });
    expectMeasured(calculateSpineAngle(input), -6.8428);
  });
});

describe("calculateLeadKneeFlex", () => {
  it("returns expected lead-side dot-product angle", () => {
    expectMeasured(calculateLeadKneeFlex(standardInput()), 135);
  });

  it("left-handed inputs select the opposite anatomical side", () => {
    const input = standardInput();
    input.worldLandmarks[23] = landmark({ x: 0, y: 1, z: 0 });
    input.worldLandmarks[25] = landmark({ x: 0, y: 0, z: 0 });
    input.worldLandmarks[27] = landmark({ x: 0, y: -1, z: 0 });
    input.worldLandmarks[24] = landmark({ x: 0, y: 1, z: 0 });
    input.worldLandmarks[26] = landmark({ x: 0, y: 0, z: 0 });
    input.worldLandmarks[28] = landmark({ x: 1, y: 0, z: 0 });

    expectMeasured(calculateLeadKneeFlex(input), 180);
    expectMeasured(calculateLeadKneeFlex({ ...input, handedness: "left" }), 90);
  });

  it("ignores corrupted normalized and baseline arrays because knee flex consumes world landmarks", () => {
    const input = standardInput();
    input.landmarks[11] = landmark({ x: Number.NaN });
    input.baselineLandmarks = [];

    expectMeasured(calculateLeadKneeFlex(input), 135);
  });

  it("clamps cosine before acos", () => {
    const input = standardInput();
    input.worldLandmarks[23] = landmark({ x: 1, y: 0, z: 0 });
    input.worldLandmarks[25] = landmark({ x: 0, y: 0, z: 0 });
    input.worldLandmarks[27] = landmark({ x: 1, y: GEOMETRY_EPSILON * 10, z: 0 });

    const result = calculateLeadKneeFlex(input);
    expect(result.status).toBe("measured");
    expect(result.warnings).toEqual([]);
    expect(result.value).toBeLessThan(0.001);
  });
});

describe("calculateTrailKneeFlex", () => {
  it("returns expected trail-side dot-product angle", () => {
    expectMeasured(calculateTrailKneeFlex(standardInput()), 135);
  });
});

describe("calculateLeadArmPlane", () => {
  it("returns a known relative angle and wraps into range", () => {
    const input = standardInput();
    input.landmarks[15] = landmark({ x: 0.2, y: -0.1 });
    expectMeasured(calculateLeadArmPlane(input), -90);

    input.landmarks[15] = landmark({ x: 0.2, y: -0.9 });
    expectMeasured(calculateLeadArmPlane(input), 90);
  });
});

describe("calculateHipRotationProxy", () => {
  it("compares active hip width to baseline hip width", () => {
    const input = standardInput();
    input.landmarks[23] = landmark({ x: 0.075, y: 0 });
    input.landmarks[24] = landmark({ x: -0.075, y: 0 });
    expectMeasured(calculateHipRotationProxy(input), 0.5);
  });

  it("mirroring does not change ratio magnitudes or warnings", () => {
    const input = standardInput();
    const base = calculateHipRotationProxy(input);
    const mirrored = calculateHipRotationProxy({ ...input, mirrored: "yes" });
    expect(mirrored).toEqual(base);
  });

  it("validates baseline landmarks and denominators", () => {
    const input = standardInput();
    input.baselineLandmarks = undefined;
    expectUnavailable(calculateHipRotationProxy(input), ["MISSING_BASELINE"]);

    const lowVisibility = standardInput();
    lowVisibility.baselineLandmarks![23].visibility = 0.25;
    expectUnavailable(calculateHipRotationProxy(lowVisibility), ["LOW_VISIBILITY"]);

    const zeroWidth = standardInput();
    zeroWidth.baselineLandmarks![23].x = 0;
    zeroWidth.baselineLandmarks![24].x = GEOMETRY_EPSILON;
    expectUnavailable(calculateHipRotationProxy(zeroWidth), ["INSUFFICIENT_BASELINE"]);
  });
});

describe("calculateHeadDisplacement", () => {
  it("compares active nose movement to baseline shoulder width", () => {
    const input = standardInput();
    input.landmarks[0] = landmark({ x: 0, y: -0.5 });
    expectMeasured(calculateHeadDisplacement(input), 0.5);
  });

  it("mirroring does not change ratio magnitudes or warnings", () => {
    const input = standardInput();
    input.landmarks[0] = landmark({ x: 0.1, y: -0.5 });
    const base = calculateHeadDisplacement(input);
    const mirrored = calculateHeadDisplacement({ ...input, mirrored: "yes" });
    expect(mirrored).toEqual(base);
  });

  it("validates baseline shoulder visibility and denominator", () => {
    const lowVisibility = standardInput();
    lowVisibility.baselineLandmarks![11].visibility = 0.25;
    expectUnavailable(calculateHeadDisplacement(lowVisibility), ["LOW_VISIBILITY"]);

    const zeroWidth = standardInput();
    zeroWidth.baselineLandmarks![11].x = 0;
    zeroWidth.baselineLandmarks![11].y = 0;
    zeroWidth.baselineLandmarks![12].x = GEOMETRY_EPSILON;
    zeroWidth.baselineLandmarks![12].y = 0;
    expectUnavailable(calculateHeadDisplacement(zeroWidth), ["INSUFFICIENT_BASELINE"]);
  });
});

describe("geometry metric validation", () => {
  it("classifies missing indexes, malformed entries, and non-finite numeric fields", () => {
    const missing = standardInput();
    missing.landmarks = missing.landmarks.slice(0, 12);
    expectUnavailable(calculateShoulderAngle(missing), ["MISSING_LANDMARK"]);

    const malformed = standardInput();
    (malformed.landmarks as PoseLandmark[])[11] = { x: 0, y: 0, z: 0 } as PoseLandmark;
    expectUnavailable(calculateShoulderAngle(malformed), ["MISSING_LANDMARK"]);

    const nonFinite = standardInput();
    nonFinite.landmarks[11].x = Number.NaN;
    expectUnavailable(calculateShoulderAngle(nonFinite), ["NON_FINITE_COORDINATE"]);
  });

  it("accepts exact visibility threshold and rejects zero-length vectors at epsilon", () => {
    const visible = standardInput();
    visible.landmarks[11].visibility = MIN_LANDMARK_VISIBILITY;
    visible.landmarks[12].visibility = MIN_LANDMARK_VISIBILITY;
    expectMeasured(calculateShoulderAngle(visible), 0);

    const epsilonLength = standardInput();
    epsilonLength.landmarks[11] = landmark({ x: 0, y: 0 });
    epsilonLength.landmarks[12] = landmark({ x: GEOMETRY_EPSILON, y: 0 });
    expectUnavailable(calculateShoulderAngle(epsilonLength), ["ZERO_LENGTH_VECTOR"]);
  });

  it("does not mutate input arrays or nested landmark objects", () => {
    const input = standardInput();
    const before = JSON.stringify(input);
    calculateShoulderAngle(input);
    calculateSpineAngle(input);
    calculateLeadKneeFlex(input);
    calculateTrailKneeFlex(input);
    calculateLeadArmPlane(input);
    calculateHipRotationProxy(input);
    calculateHeadDisplacement(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it("keeps unused-array corruption from affecting independent primitives", () => {
    const input = standardInput();
    input.landmarks = [];
    input.baselineLandmarks = [{ x: Number.NaN, y: 0, z: 0, visibility: 1 }];

    expectMeasured(calculateLeadKneeFlex(input), 135);
    expectMeasured(calculateTrailKneeFlex(input), 135);
  });

  it("returns unavailable for single warning-only failures across public primitives", () => {
    const input = standardInput();

    for (const result of [
      calculateShoulderAngle({ ...input, mirrored: "undeclared" }),
      calculateSpineAngle({ ...input, mirrored: "undeclared" }),
      calculateLeadArmPlane({ ...input, mirrored: "undeclared" }),
      calculateLeadKneeFlex({ ...input, handedness: "undeclared" }),
      calculateTrailKneeFlex({ ...input, handedness: "undeclared" })
    ]) {
      expect(result.status).toBe("unavailable");
      expect(result.value).toBeNull();
      expect(result.warnings.length).toBe(1);
    }

    expectUnavailable(calculateHipRotationProxy({ ...input, baselineLandmarks: undefined }), [
      "MISSING_BASELINE"
    ]);
    expectUnavailable(calculateHeadDisplacement({ ...input, baselineLandmarks: undefined }), [
      "MISSING_BASELINE"
    ]);
  });
});
```

## Verification Evidence

Passed after adding the focused hardening tests:

```bash
npm run test:unit -- geometry-metrics
# 1 file, 24 tests passed

npm run test:unit
# 8 files, 75 tests passed

npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
git diff --check
```

All listed commands passed after the B7 prompt repair and additional hardening
tests.

## Question For Claude

Can you now audit the actual implementation and test file contents? Return PASS
only if SS-009 is ready for PR preparation after no further blockers.
