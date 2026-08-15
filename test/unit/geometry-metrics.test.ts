import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  type GeometryMetricResult,
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

function syntheticFixtureInput(): GeometryMetricInput {
  return JSON.parse(
    readFileSync(resolve("test/fixtures/math/synthetic-swing-landmarks.json"), "utf8")
  ) as GeometryMetricInput;
}

interface SyntheticGeometryEdgeCaseFixture {
  fixtureId: string;
  fixtureClass: string;
  baseFixture: string;
  provenance: {
    source: string;
    evidenceScope: string;
    limitations: string;
  };
  cases: readonly {
    caseId: string;
    mutation:
      | { kind: "truncate-landmarks"; length: number }
      | { kind: "set-nan-coordinate"; index: number; coordinate: "x" | "y" | "z" }
      | { kind: "set-visibility"; index: number; value: number };
    expected: GeometryMetricResult;
  }[];
}

function syntheticEdgeCaseFixture(): SyntheticGeometryEdgeCaseFixture {
  return JSON.parse(
    readFileSync(resolve("test/fixtures/math/synthetic-geometry-edge-cases.json"), "utf8")
  ) as SyntheticGeometryEdgeCaseFixture;
}

function applySyntheticMutation(
  input: GeometryMetricInput,
  mutation: SyntheticGeometryEdgeCaseFixture["cases"][number]["mutation"]
): GeometryMetricInput {
  const landmarks = input.landmarks.map((point) => ({ ...point }));
  if (mutation.kind === "truncate-landmarks") {
    landmarks.length = mutation.length;
  } else if (mutation.kind === "set-nan-coordinate") {
    landmarks[mutation.index][mutation.coordinate] = Number.NaN;
  } else {
    landmarks[mutation.index].visibility = mutation.value;
  }
  return { ...input, landmarks };
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
  it("uses the committed non-identifying synthetic math fixture", () => {
    expectMeasured(calculateShoulderAngle(syntheticFixtureInput()), 0);
  });

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

  it("collects low visibility and zero-length geometry warnings together", () => {
    const input = standardInput();
    input.landmarks[11] = landmark({ x: 0, y: 0, visibility: MIN_LANDMARK_VISIBILITY - 0.001 });
    input.landmarks[12] = landmark({ x: 0, y: 0, visibility: 1 });

    expectUnavailable(calculateShoulderAngle(input), ["LOW_VISIBILITY", "ZERO_LENGTH_VECTOR"]);
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
  it("fails closed for the named synthetic geometry edge-case fixture", () => {
    const fixture = syntheticEdgeCaseFixture();

    expect(fixture.fixtureId).toBe("synthetic-geometry-edge-cases-v1");
    expect(fixture.fixtureClass).toBe("project-authored-synthetic-landmarks");
    expect(fixture.baseFixture).toBe("synthetic-swing-landmarks.json");
    expect(fixture.provenance.source).toContain("no real-person or third-party media");
    expect(fixture.provenance.evidenceScope).toContain("regression behavior only");
    expect(fixture.provenance.evidenceScope).toContain("not real-world accuracy evidence");
    expect(fixture.cases).toHaveLength(3);

    for (const testCase of fixture.cases) {
      const input = applySyntheticMutation(syntheticFixtureInput(), testCase.mutation);
      expect(calculateShoulderAngle(input), testCase.caseId).toEqual(testCase.expected);
    }
  });

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
