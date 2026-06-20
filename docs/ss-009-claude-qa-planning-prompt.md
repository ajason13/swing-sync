# SS-009 Claude QA Planning Prompt

Use this prompt in Claude Chat for pre-implementation adversarial QA planning.
Claude does not have filesystem or GitHub access, so this prompt is
self-contained.

## Role

You are Claude acting as the adversarial QA planner for Swing Sync story
`SS-009 Implement joint angle and coordinate normalization utilities`.

Stage: **pre-implementation QA planning**.

Codex has not implemented the utilities yet. Your job is to attack the
candidate specification, identify blockers, and decide whether Codex may move
from `2. QA Planning (Claude)` to `3. In Development (ChatGPT)` after any
blocking findings are resolved.

## Required Verdict Format

Return:

- `PASS` or `FAIL`;
- blockers ordered by severity;
- non-blocking recommendations;
- missing tests or edge cases;
- explicit sign-off status.

Treat blockers as implementation gates, not suggestions.

## Story Context

Acceptance criteria:

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

SS-009 is safety-, privacy-, and coaching-sensitive. Gemini researches and
drafts. Codex verifies research, records Adopt / Revise / Defer / Reject
decisions, and implements only after approved gates. Claude performs
adversarial QA planning and final implementation audit.

## Protected Project Boundaries

- Raw swing video is processed locally by default and is not uploaded.
- Landmarks, movement patterns, phase labels, and metric primitives are
  sensitive derived data.
- Remote sharing, export, persistence, telemetry, remote logging, cloud
  storage, model-provider calls, new dependencies, new workers, SDK/model
  changes, and public serving are out of scope.
- User-facing copy and future AI coaching must not imply medical advice,
  injury prevention, professional athletic instruction, diagnosis,
  rehabilitation, guaranteed correctness, guaranteed safety, guaranteed
  privacy, or guaranteed deletion.
- Clean-room implementation is required. Do not copy CaddieSet code, formulas,
  datasets, fixtures, model outputs, media, or identifiers.

## Existing Repository Contracts

`src/pose-contract.ts`:

```ts
export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseFrameResult {
  timestampMs: number;
  landmarks: PoseLandmark[][];
  worldLandmarks: PoseLandmark[][];
  thresholds: {
    readonly minPoseDetectionConfidence: 0.5;
    readonly minPosePresenceConfidence: 0.5;
    readonly minTrackingConfidence: 0.5;
  };
}
```

`src/phase-review.ts` requires explicit user declarations:

```ts
export interface PhaseDeclarations {
  view: "undeclared" | "face-on";
  handedness: "undeclared" | "right" | "left";
  mirrored: "undeclared" | "yes" | "no";
  setup: "undeclared" | "confirmed";
}
```

It accepts future metric readiness only after one normalized pose and one world
pose with 33 finite landmarks exist for each of the eight ordered samples and
declarations are present. Phase evidence states are only `unsupported-input`
and `review-required`.

`src/metric-contract.ts` currently allows only these metric names:

```text
address-stance-ratio
top-shoulder-line-angle
impact-spine-line-angle
finish-balance-line-angle
```

Measured metric payload values require finite numbers and `right` or `left`
handedness. Missing/unsupported/not-reviewed payload values use
`numericValue: null`. Confidence is categorical only:
`not-calibrated`, `low-evidence`, or `unavailable`.

SS-009 must not expand this schema or generate metric payloads unless a future
reviewed story approves it.

## Gemini Research Disposition Summary

Codex adopted Gemini's zero-dependency local geometry direction, vector
formulas, synthetic fixtures, fail-closed validation, side-aware lead/trail
mapping, and no new dependencies.

Codex revised or rejected:

- Gemini's global target-line 3D canonical transformation matrix;
- unverified world-axis and z-axis mirroring claims;
- schema identifiers not present in SS-008;
- payload generation in SS-009;
- low-visibility measured values;
- numeric warning IDs and diagnostic logging;
- biological range bounds and "100% accuracy" success metrics;
- absolute privacy claims such as "destroyed immediately";
- any copied CaddieSet formulas, code, data, media, fixtures, or identifiers.

## Candidate Specification To Audit

Artifacts:

- `src/geometry-metrics.ts`
- `test/unit/geometry-metrics.test.ts`

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

Rules:

- `measured` requires finite `value`.
- `unavailable` requires `value: null` and at least one warning.
- Warning arrays are deterministic, unique, and ordered by first detection.
- No return value may include raw landmarks, timestamps, phase labels, media
  characteristics, filenames, identifiers, wall-clock time, or performance
  timings.
- Invalid inputs return unavailable results rather than fabricated numbers.

Validation defaults:

```text
MIN_LANDMARK_VISIBILITY = 0.5
GEOMETRY_EPSILON = 1e-6
```

Low visibility makes the affected primitive unavailable. MediaPipe visibility
is not calibrated confidence or correctness.

Primitive contracts:

- `shoulder-angle-degrees`: normalized lead/trail shoulders, projected 2D
  `atan2`.
- `spine-angle-degrees`: normalized shoulder and hip midpoints, projected 2D
  `atan2` from vertical.
- `lead-knee-flex-degrees` and `trail-knee-flex-degrees`: world hip/knee/ankle
  vectors, dot-product interior angle with clamped cosine.
- `lead-arm-plane-degrees`: normalized lead wrist/shoulder and shoulder-line
  relative projected angle, wrapped to `[-180, 180]`.
- `hip-rotation-proxy-ratio`: active normalized hip width divided by address
  baseline hip width. It is only an apparent-width proxy.
- `head-displacement-ratio`: normalized active nose movement relative to
  address baseline nose, scaled by baseline shoulder width. Nose is only a
  head proxy.

Handedness:

- `right`: lead side is anatomical left; trail side is anatomical right.
- `left`: lead side is anatomical right; trail side is anatomical left.
- No inference is allowed.

Mirroring:

- must be `"yes"` or `"no"`;
- affects only 2D sign normalization for projection angles;
- must not relabel anatomical landmarks.

2D projection sign normalization:

```text
mirrorSign = mirrored == "yes" ? -1 : 1
handednessSign = handedness == "right" ? 1 : -1
xTarget = x * mirrorSign * handednessSign
yUp = -y
```

Observability:

- intentionally unchanged;
- no console logging, runtime diagnostics, telemetry, analytics, traces,
  storage writes, network calls, or debug payloads.

Required test matrix:

- level right-handed shoulder angle returns `0`;
- projected shoulder tilt returns a known signed value;
- vertical spine centerline returns `0`;
- projected spine lean returns a known signed value;
- lead and trail knee flex return expected dot-product angles;
- lead arm plane returns a known relative angle and wraps into `[-180, 180]`;
- hip rotation proxy compares active hip width to baseline hip width;
- head displacement compares active nose movement to baseline shoulder width;
- left-handed inputs select the opposite anatomical side from right-handed
  inputs;
- mirrored declaration changes only expected 2D sign normalization;
- missing landmarks return `MISSING_LANDMARK` and `value: null`;
- non-finite coordinates return `NON_FINITE_COORDINATE` and `value: null`;
- low visibility returns `LOW_VISIBILITY` and `value: null`;
- coincident points and zero-length vectors return `ZERO_LENGTH_VECTOR`;
- missing baseline returns `MISSING_BASELINE`;
- zero-width baseline returns `INSUFFICIENT_BASELINE`;
- functions do not mutate inputs.

## Audit Questions

Attack the candidate spec for:

- fail-open paths that could fabricate metric numbers;
- unclear handedness or mirrored sign rules;
- invalid coordinate-space mixing;
- missing validation for malformed arrays or partial landmarks;
- warning/status inconsistencies;
- tests that would pass while implementation still violates acceptance
  criteria;
- privacy/logging/storage/network regressions;
- accidental expansion of the SS-008 metric payload schema;
- unsafe coaching, medical, accuracy, calibration, or CaddieSet equivalence
  claims; and
- implementation details that are too ambiguous for Codex to safely begin.

Return `PASS` only if Codex can implement the spec without further blocking
clarification.
