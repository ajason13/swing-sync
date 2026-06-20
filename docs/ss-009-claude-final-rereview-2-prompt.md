# SS-009 Claude Final Implementation Focused Re-Review 2 Prompt

Use this prompt in Claude Chat for focused final implementation re-review.
Claude does not have filesystem or GitHub access, so this prompt includes the
prior blocking finding, the applied fix, and the current relevant source/test
snippets.

```text
You are Claude acting as the adversarial final implementation auditor for Swing
Sync story SS-009, focused only on the C1 blocker from your prior review.

Context:
- Story: SS-009 Implement joint angle and coordinate normalization utilities.
- Branch: ss-009-angle-utils.
- Current Notion status: 4. Final Audit (Claude).
- PR: none yet.
- Sensitive-story boundaries still apply: no export, persistence, telemetry,
  remote logging, cloud storage, SDK/provider/model/asset changes, workers,
  dependencies, metric payload generation, schema expansion, or medical/coaching
  claims.

Prior Claude focused final re-review result:
- Verdict: FAIL.
- B7 was closed because actual source/test contents were provided.
- C2, C3, C4 were confirmed closed.
- Operative blocker C1: `finalize` contained this fallback:

```ts
warnings: warnings.length > 0 ? warnings : ["ZERO_LENGTH_VECTOR"]
```

Claude found this unacceptable because it could fabricate a diagnostic warning
if a future null/non-finite path failed to add its own correct warning. Claude
required removing the fallback and making side-selection failures emit
`UNDECLARED_HANDEDNESS` structurally instead of relying on a separate caller
validation path.

Applied fix:
1. Removed `finalize`'s fabricated `["ZERO_LENGTH_VECTOR"]` fallback.
2. `finalize` now returns `unavailable` only when the collector contains real
   warnings. If `value` is `null` or non-finite with no warnings, it throws an
   invariant error instead of guessing a warning code.
3. `sideIndex` now receives the `WarningCollector`.
4. `leadSide` and `trailSide` now receive the collector and add
   `UNDECLARED_HANDEDNESS` directly before returning `undefined`.
5. Side-selecting primitives no longer depend on separate
   `validateHandedness` calls to make side selection safe:
   - `calculateShoulderAngle` uses `sideIndex(..., collector)`.
   - `calculateLeadArmPlane` uses `sideIndex(..., collector)`.
   - `calculateLeadKneeFlex` / `calculateTrailKneeFlex` call
     `calculateKneeFlex(input, "lead" | "trail")`, and knee flex uses
     `sideIndex(..., collector)` for hip/knee/ankle.
6. `calculateSpineAngle` still calls `validateHandedness` because it does not
   side-select but still uses handedness in `signedHorizontal`.
7. Added one non-blocking recommended regression from your prior review:
   low visibility plus zero-length geometry co-occurrence returns both warnings
   in canonical order.

Relevant current source snippets follow.

Source: `src/geometry-metrics.ts` public side-selecting functions

```ts
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
```

Source: `src/geometry-metrics.ts` side selection and finalization

```ts
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
```

Source: `test/unit/geometry-metrics.test.ts` focused relevant tests

```ts
  it("returns unavailable for warning-only undeclared input", () => {
    expectUnavailable(calculateShoulderAngle({ ...standardInput(), handedness: "undeclared" }), [
      "UNDECLARED_HANDEDNESS"
    ]);
    expectUnavailable(calculateShoulderAngle({ ...standardInput(), mirrored: "undeclared" }), [
      "UNDECLARED_MIRRORING"
    ]);
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
```

Existing broad test retained:

```ts
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
```

Verification after this fix:

```bash
npm run test:unit -- geometry-metrics
# 1 file, 25 tests passed

npm run test:unit
# 8 files, 76 tests passed

npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
git diff --check
# all passed
```

Question for Claude:
Does this focused fix close C1 without introducing new blockers? Return PASS
only if SS-009 is now ready for PR preparation. If FAIL, identify only concrete
remaining blockers in the changed finalization/side-selection logic or the
newly added focused test.
```
