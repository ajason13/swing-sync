# SS-009 Claude QA Focused Re-Review Prompt

Use this prompt in Claude Chat for focused pre-implementation QA re-review.
Claude does not have filesystem or GitHub access, so this prompt is
self-contained.

## Role

You are Claude acting as the adversarial QA planner for Swing Sync story
`SS-009 Implement joint angle and coordinate normalization utilities`.

Stage: **second focused pre-implementation QA re-review**.

Prior verdicts: **FAIL**, then focused re-review **FAIL**.

Your task is to re-review only whether new blocker B6 is closed by the revised
specification, plus any cross-cutting issue introduced by the B6 fixes. Claude
already closed B1, B3, B4, and B5; B2's threshold table was accepted and only
surfaced B6. Do not redo the full audit unless the changed text creates a new
blocker.

## Required Verdict Format

Return:

- `PASS` or `FAIL`;
- status for B6: closed or still open;
- any new blockers introduced by the fixes;
- non-blocking recommendations;
- explicit sign-off status for moving to `3. In Development (ChatGPT)`.

## Protected Boundaries

- No implementation has started.
- SS-009 must not expand `src/metric-contract.ts` or the SS-008 JSON Schema.
- SS-009 must not create `SwingMetricPayload` objects.
- SS-009 must not add logging, telemetry, storage, network calls, exports,
  dependencies, SDK/model/provider changes, workers, or public serving.
- SS-009 must not make medical, injury-prevention, professional coaching,
  calibration, benchmark, CaddieSet equivalence, guaranteed correctness, or
  absolute privacy/deletion claims.

## Prior Findings And Fixes

Claude focused re-review status:

- B1: closed.
- B2: denominator threshold table sound; new B6 status/value issue surfaced.
- B3: closed.
- B4: closed.
- B5: closed.

### B1 - `lead-arm-plane-degrees` references undefined landmarks

Fix added to the spec:

- `lead-arm-plane-degrees` requires normalized lead shoulder, normalized trail
  shoulder, and normalized lead wrist.
- Formula:

```text
shoulderReference = leadShoulder2d - trailShoulder2d
leadArm = leadWrist2d - leadShoulder2d
angle = atan2(leadArm.yUp, signedHorizontal(leadArm.x))
  - atan2(shoulderReference.yUp, signedHorizontal(shoulderReference.x))
```

- Result is converted to degrees and wrapped to `[-180, 180]`.

### B2 - Ratio primitives lack fail-closed denominator guards

Fix added to the spec:

- Validation is cumulative and uses `GEOMETRY_EPSILON = 1e-6`.
- Denominator and vector thresholds:

| Check | Threshold | Warning |
| --- | --- | --- |
| Any 2D angle reference vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Knee thigh vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Knee shank vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Hip rotation baseline hip width | `<= GEOMETRY_EPSILON` | `INSUFFICIENT_BASELINE` |
| Head displacement baseline shoulder width | `<= GEOMETRY_EPSILON` | `INSUFFICIENT_BASELINE` |

- `baselineLandmarks` absent or `undefined` produces `MISSING_BASELINE`.

### B3 - Mirroring sign rule unclear for non-projection primitives

Fix added to the spec:

- Magnitude-based primitives use raw Euclidean distances only.
- Mirroring and handedness sign normalization must not be applied to hip
  rotation proxy or head displacement ratio.
- `xTarget`, `mirrorSign`, and `handednessSign` apply only to signed 2D
  projection-angle calculations.

### B4 - Missing landmarks did not distinguish malformed entries

Fix added to the spec:

- Missing required indexes produce `MISSING_LANDMARK`.
- A present array entry that is not an object, is `null`, or has `x`, `y`,
  `z`, or `visibility` missing or not a number produces `MISSING_LANDMARK`.
- A present required `x`, `y`, `z`, or `visibility` value that is numeric but
  not finite, such as `NaN`, `Infinity`, or `-Infinity`, produces
  `NON_FINITE_COORDINATE`.

### B5 - Warning priority and short-circuit order unstated

Fix added to the spec:

- Validation is cumulative.
- Each primitive collects every applicable warning in this canonical order:
  1. `UNDECLARED_HANDEDNESS`
  2. `UNDECLARED_MIRRORING`
  3. `MISSING_BASELINE`
  4. `MISSING_LANDMARK`
  5. `NON_FINITE_COORDINATE`
  6. `LOW_VISIBILITY`
  7. `ZERO_LENGTH_VECTOR`
  8. `INSUFFICIENT_BASELINE`
- Later checks may be skipped only when evaluating them would require
  dereferencing missing or malformed data.

## Other Relevant Revised Spec Text

Public API:

```ts
function calculateShoulderAngle(input: GeometryMetricInput): GeometryMetricResult;
function calculateSpineAngle(input: GeometryMetricInput): GeometryMetricResult;
function calculateLeadKneeFlex(input: GeometryMetricInput): GeometryMetricResult;
function calculateTrailKneeFlex(input: GeometryMetricInput): GeometryMetricResult;
function calculateLeadArmPlane(input: GeometryMetricInput): GeometryMetricResult;
function calculateHipRotationProxy(input: GeometryMetricInput): GeometryMetricResult;
function calculateHeadDisplacement(input: GeometryMetricInput): GeometryMetricResult;
```

Input:

```ts
interface GeometryMetricInput {
  landmarks: readonly PoseLandmark[];
  worldLandmarks: readonly PoseLandmark[];
  baselineLandmarks?: readonly PoseLandmark[];
  handedness: "undeclared" | "right" | "left";
  mirrored: "undeclared" | "yes" | "no";
}
```

Return:

```ts
type GeometryWarningCode =
  | "MISSING_LANDMARK"
  | "NON_FINITE_COORDINATE"
  | "LOW_VISIBILITY"
  | "ZERO_LENGTH_VECTOR"
  | "UNDECLARED_HANDEDNESS"
  | "UNDECLARED_MIRRORING"
  | "MISSING_BASELINE"
  | "INSUFFICIENT_BASELINE";

type GeometryMetricStatus = "measured" | "unavailable";

interface GeometryMetricResult {
  status: GeometryMetricStatus;
  value: number | null;
  warnings: readonly GeometryWarningCode[];
}
```

Warning applicability:

| Primitive | Applicable warning codes |
| --- | --- |
| `shoulder-angle-degrees` | `UNDECLARED_HANDEDNESS`, `UNDECLARED_MIRRORING`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `ZERO_LENGTH_VECTOR` |
| `spine-angle-degrees` | `UNDECLARED_HANDEDNESS`, `UNDECLARED_MIRRORING`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `ZERO_LENGTH_VECTOR` |
| `lead-knee-flex-degrees` | `UNDECLARED_HANDEDNESS`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `ZERO_LENGTH_VECTOR` |
| `trail-knee-flex-degrees` | `UNDECLARED_HANDEDNESS`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `ZERO_LENGTH_VECTOR` |
| `lead-arm-plane-degrees` | `UNDECLARED_HANDEDNESS`, `UNDECLARED_MIRRORING`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `ZERO_LENGTH_VECTOR` |
| `hip-rotation-proxy-ratio` | `MISSING_BASELINE`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `INSUFFICIENT_BASELINE` |
| `head-displacement-ratio` | `MISSING_BASELINE`, `MISSING_LANDMARK`, `NON_FINITE_COORDINATE`, `LOW_VISIBILITY`, `INSUFFICIENT_BASELINE` |

New required tests include malformed present landmark entries, present numeric
non-finite fields, exactly-at-threshold visibility, exactly-at-epsilon vector
lengths, cosine clamping before `acos`, mirrored declarations not changing ratio
magnitudes, unused-array corruption not affecting primitives that do not
consume that array, cumulative warning order, and nested landmark immutability.

## B6 Finding And Fix

### B6 - Cumulative warnings create status/value ambiguity and baseline visibility scope is unclear

Claude finding:

- Cumulative warnings could co-occur with technically computable geometry. The
  spec did not explicitly state whether any warning forces `unavailable` and
  `value: null`.
- Hip rotation proxy and head displacement consume baseline landmarks, but the
  spec did not explicitly state whether `LOW_VISIBILITY` applies to baseline
  landmarks as well as active landmarks.

Fix added to the spec:

- Return-contract rules now state:

```text
measured requires a finite numeric value and an empty warnings array.
unavailable requires value: null and at least one warning.
Any non-empty warnings array forces status: "unavailable" and value: null,
regardless of whether the underlying arithmetic could have technically produced
a finite number. measured is reserved exclusively for zero-warning results.
```

- Validation rules now state:

```text
Baseline landmarks consumed by hip rotation proxy and head displacement use the
same MIN_LANDMARK_VISIBILITY threshold and malformed/non-finite validation as
active landmarks. Low-visibility baseline landmarks produce LOW_VISIBILITY and
force unavailable.
```

- The baseline validation paragraph now states:

```text
baselineLandmarks present with malformed, missing, low-visibility, or non-finite
required baseline landmarks uses the same landmark validation warnings and
visibility threshold as active landmarks before denominator checks.
```

- The test matrix now adds:
  - mirrored declaration does not change hip rotation proxy or head displacement
    ratio magnitudes or warning arrays;
  - warning-only failures with otherwise computable geometry return
    `status: "unavailable"` and `value: null`;
  - baseline low-visibility landmarks return `LOW_VISIBILITY` for
    baseline-dependent primitives.

## Question For Claude

Is B6 closed sufficiently for Codex to implement SS-009 from
`docs/ss-009-preimplementation-spec.md`? Return PASS only if implementation can
begin without further blocking clarification.
