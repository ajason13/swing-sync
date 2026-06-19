# SS-009 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This specification defines the
candidate implementation contract and may be used only after Claude QA planning
returns PASS or blocking findings are resolved.**

## Scope

SS-009 defines local, zero-dependency TypeScript geometry utilities that consume
pose-landmark-like inputs and return bounded educational metric primitives or
warnings.

In scope:

- pure coordinate and vector helpers;
- side-aware landmark selection for declared right- and left-handed golfers;
- deterministic primitive calculations for shoulder angle, spine angle, lead
  and trail knee flex, lead arm plane, hip rotation proxy, and head
  displacement;
- structured warning codes and unavailable results for invalid inputs;
- focused unit tests with synthetic project-authored coordinates; and
- documentation of privacy, safety, licensing, and observability boundaries.

Out of scope:

- expanding `src/metric-contract.ts` or
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`;
- creating `SwingMetricPayload` objects;
- runtime UI, overlays, user-facing coaching, drills, corrective instructions,
  medical or injury guidance;
- calibration, representative validation, benchmark comparison, CaddieSet
  equivalence, or biomechanical correctness claims;
- export, persistence, remote review, telemetry, remote logging, cloud storage,
  service-worker caching, new model/provider/SDK/assets, new workers, new
  dependencies, or public serving.

## Protected Contracts

SS-009 must preserve:

- SS-005 exact `@mediapipe/tasks-vision@0.10.35`, approved same-origin model and
  WASM assets, dedicated worker inference, complete landmark arrays, volatile
  raw frame/landmark handling, and fail-closed unexpected-network behavior;
- SS-006 fixed-budget ordered sample queue, volatile previews/pose outputs,
  cleanup, cancellation/retry, and exclusion of observed seek timestamps from
  diagnostics, persistence, network transit, and export;
- SS-007 phase vocabulary, explicit face-on/handedness/mirrored/setup
  declarations, manual-review-only readiness, evidence states, and no
  automatic confidence acceptance; and
- SS-008 metric schema version, metric names, units, phases, handedness,
  confidence vocabulary, limitation codes, CaddieSet non-equivalence field, and
  prohibited sensitive keys.

## Artifact Contract

Create:

- `src/geometry-metrics.ts`
- `test/unit/geometry-metrics.test.ts`

Do not create fixtures from external datasets. Do not add a dependency.

The source module may import types from `src/pose-contract.ts` and
`src/phase-review.ts`, but it must not import browser APIs or mutate
`SampledFrameOutput` records.

The module is not responsible for populating SS-008 metric payloads. A future
reviewed story may translate geometry primitive results into schema-compliant
payload values, but SS-009 must not perform that translation.

Export these public functions:

```ts
function calculateShoulderAngle(input: GeometryMetricInput): GeometryMetricResult;
function calculateSpineAngle(input: GeometryMetricInput): GeometryMetricResult;
function calculateLeadKneeFlex(input: GeometryMetricInput): GeometryMetricResult;
function calculateTrailKneeFlex(input: GeometryMetricInput): GeometryMetricResult;
function calculateLeadArmPlane(input: GeometryMetricInput): GeometryMetricResult;
function calculateHipRotationProxy(input: GeometryMetricInput): GeometryMetricResult;
function calculateHeadDisplacement(input: GeometryMetricInput): GeometryMetricResult;
```

Codex may implement shared internal helpers, but tests must exercise the public
functions above.

## Input Contract

Candidate utilities accept explicit landmark arrays and declarations rather
than owning frame-processing state:

```ts
interface GeometryMetricInput {
  landmarks: readonly PoseLandmark[];
  worldLandmarks: readonly PoseLandmark[];
  baselineLandmarks?: readonly PoseLandmark[];
  handedness: "undeclared" | "right" | "left";
  mirrored: "undeclared" | "yes" | "no";
}
```

Rules:

- `landmarks` are normalized image landmarks from `PoseFrameResult.landmarks[0]`.
- `worldLandmarks` are world landmarks from `PoseFrameResult.worldLandmarks[0]`.
- `baselineLandmarks` are normalized image landmarks from the reviewed address
  sample and are required only for hip rotation proxy and head displacement.
- Exactly one pose is selected by the caller before invoking this module.
- The module must reject arrays shorter than 33 when a required index is
  requested.
- Landmark arrays are assumed to use the same MediaPipe 33-point pose topology
  as `PoseFrameResult.landmarks[0]` and `PoseFrameResult.worldLandmarks[0]`;
  index `11` is left shoulder, index `12` is right shoulder, and so on as
  listed below.
- The module must not infer view, handedness, mirrored orientation, setup, or
  phase readiness.
- `handedness: "undeclared"` produces `UNDECLARED_HANDEDNESS` for every public
  primitive.
- `mirrored: "undeclared"` produces `UNDECLARED_MIRRORING` for every public
  primitive that uses 2D projection sign normalization.
- The caller is responsible for invoking SS-009 only after SS-007 review state
  is ready for future metrics.

## Landmark Indices

Use the standard 33-landmark pose topology indexes already returned by
MediaPipe Pose Landmarker:

| Index | Name |
| --- | --- |
| `0` | nose |
| `11` | left shoulder |
| `12` | right shoulder |
| `13` | left elbow |
| `14` | right elbow |
| `15` | left wrist |
| `16` | right wrist |
| `23` | left hip |
| `24` | right hip |
| `25` | left knee |
| `26` | right knee |
| `27` | left ankle |
| `28` | right ankle |

Right-handed golfer:

- lead side: left shoulder/elbow/wrist/hip/knee/ankle;
- trail side: right shoulder/elbow/wrist/hip/knee/ankle.

Left-handed golfer:

- lead side: right shoulder/elbow/wrist/hip/knee/ankle;
- trail side: left shoulder/elbow/wrist/hip/knee/ankle.

## Coordinate Semantics

Use MediaPipe coordinates conservatively:

- Normalized image landmarks: use `x` and `y` for 2D projection metrics. The
  official Web guide defines `x` and `y` as normalized by image width and
  height. Convert to an internal local math frame by using `yUp = -y` when
  computing projected angles.
- Normalized `z`: do not use in SS-009 calculations.
- World landmarks: use only for knee-flex vector angles where the angle between
  hip-knee and ankle-knee segments is invariant to a common coordinate frame.
  Do not claim target-line orientation or calibrated biomechanical accuracy.
- Mirrored orientation: require a declared `"yes"` or `"no"` value and use it
  only for sign normalization of 2D projection results. Do not infer mirrored
  state and do not transform MediaPipe anatomical labels.
- Magnitude-based primitives use raw Euclidean distances only. Mirroring and
  handedness sign normalization must not be applied to hip rotation proxy or
  head displacement ratio.

The candidate spec does not approve a global target-line 3D canonical frame.

2D projection sign normalization:

```text
mirrorSign = mirrored == "yes" ? -1 : 1
handednessSign = handedness == "right" ? 1 : -1
xTarget = x * mirrorSign * handednessSign
yUp = -y
```

Use `xTarget` and `yUp` only for signed 2D projection-angle calculations.
Distance and ratio calculations must use raw normalized Euclidean distances
because absolute distances are unaffected by this sign convention.

## Return Contract

Use a discriminated result shape:

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

- `measured` requires a finite numeric `value` and an empty `warnings` array.
- `unavailable` requires `value: null` and at least one warning.
- Any non-empty `warnings` array forces `status: "unavailable"` and
  `value: null`, regardless of whether the underlying arithmetic could have
  technically produced a finite number. `measured` is reserved exclusively for
  zero-warning results.
- Warning arrays must be deterministic, unique, and ordered by first detection.
- The module must not include raw landmarks, timestamps, phase labels, media
  characteristics, filenames, identifiers, local wall-clock time, or
  performance timings in return values.
- The module must not throw for malformed user data unless the caller violates
  TypeScript-level API shape in code. Runtime invalid inputs return
  unavailable results.

## Validation Contract

Defaults:

```text
MIN_LANDMARK_VISIBILITY = 0.5
GEOMETRY_EPSILON = 1e-6
```

Validation rules:

- Validate cumulatively. Each primitive collects every applicable warning in
  the canonical order below and returns `unavailable` if any warning is
  present.
- Canonical warning order:
  1. `UNDECLARED_HANDEDNESS`
  2. `UNDECLARED_MIRRORING`
  3. `MISSING_BASELINE`
  4. `MISSING_LANDMARK`
  5. `NON_FINITE_COORDINATE`
  6. `LOW_VISIBILITY`
  7. `ZERO_LENGTH_VECTOR`
  8. `INSUFFICIENT_BASELINE`
- Omit warnings that do not apply to the primitive. Do not short-circuit unless
  a later check cannot be evaluated without dereferencing missing or malformed
  data; in that case, skip only the unsafe later check.
- Missing required indexes produce `MISSING_LANDMARK`.
- A present array entry that is not an object, is `null`, or has `x`, `y`, `z`,
  or `visibility` missing or not a number produces `MISSING_LANDMARK`.
- A present required `x`, `y`, `z`, or `visibility` value that is numeric but
  not finite, such as `NaN`, `Infinity`, or `-Infinity`, produces
  `NON_FINITE_COORDINATE`.
- Any required visibility below `MIN_LANDMARK_VISIBILITY` produces
  `LOW_VISIBILITY`.
- `visibility === MIN_LANDMARK_VISIBILITY` is accepted by the visibility gate.
- Low visibility makes the affected primitive unavailable. It does not produce
  a low-evidence measured value in SS-009.
- Vector length less than or equal to `GEOMETRY_EPSILON` produces
  `ZERO_LENGTH_VECTOR`.
- Missing baseline data for baseline-dependent primitives produces
  `MISSING_BASELINE`.
- Baseline denominators less than or equal to `GEOMETRY_EPSILON` produce
  `INSUFFICIENT_BASELINE`.
- Baseline landmarks consumed by hip rotation proxy and head displacement use
  the same `MIN_LANDMARK_VISIBILITY` threshold and malformed/non-finite
  validation as active landmarks. Low-visibility baseline landmarks produce
  `LOW_VISIBILITY` and force `unavailable`.

Do not use MediaPipe visibility as calibrated confidence or correctness.

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

Denominator and vector thresholds:

| Check | Threshold | Warning |
| --- | --- | --- |
| Any 2D angle reference vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Knee thigh vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Knee shank vector length | `<= GEOMETRY_EPSILON` | `ZERO_LENGTH_VECTOR` |
| Hip rotation baseline hip width | `<= GEOMETRY_EPSILON` | `INSUFFICIENT_BASELINE` |
| Head displacement baseline shoulder width | `<= GEOMETRY_EPSILON` | `INSUFFICIENT_BASELINE` |

`baselineLandmarks` absent or `undefined` produces `MISSING_BASELINE` for
baseline-dependent primitives. `baselineLandmarks` present with malformed,
missing, low-visibility, or non-finite required baseline landmarks uses the
same landmark validation warnings and visibility threshold as active landmarks
before denominator checks.

## Primitive Contracts

### Shoulder Angle

Primitive name: `shoulder-angle-degrees`

Input:

- normalized lead shoulder;
- normalized trail shoulder.

Formula:

```text
v = leadShoulder2d - trailShoulder2d
angle = atan2(v.yUp, signedHorizontal(v.x)) * 180 / Math.PI
```

Normalize to `[-180, 180]`.

Interpretation is an internal educational projection primitive only. Do not
claim a positive or negative value is good, bad, correct, safe, or diagnostic.

### Spine Angle

Primitive name: `spine-angle-degrees`

Input:

- normalized left shoulder;
- normalized right shoulder;
- normalized left hip;
- normalized right hip.

Formula:

```text
shoulderCenter = midpoint(leftShoulder2d, rightShoulder2d)
hipCenter = midpoint(leftHip2d, rightHip2d)
v = shoulderCenter - hipCenter
angle = atan2(signedHorizontal(v.x), v.yUp) * 180 / Math.PI
```

A vertical projected centerline returns `0`. Normalize to `[-180, 180]`.

### Knee Flex

Primitive names:

- `lead-knee-flex-degrees`
- `trail-knee-flex-degrees`

Input:

- world hip, knee, and ankle for the selected side.

Formula:

```text
thigh = hip - knee
shank = ankle - knee
cosTheta = dot(thigh, shank) / (length(thigh) * length(shank))
angle = acos(clamp(cosTheta, -1, 1)) * 180 / Math.PI
```

The output is the interior angle between the two segments. Do not convert it
into a coaching flex recommendation.

### Lead Arm Plane

Primitive name: `lead-arm-plane-degrees`

Input:

- normalized lead shoulder;
- normalized trail shoulder;
- normalized lead wrist.

Formula:

```text
shoulderReference = leadShoulder2d - trailShoulder2d
leadArm = leadWrist2d - leadShoulder2d
angle = atan2(leadArm.yUp, signedHorizontal(leadArm.x))
  - atan2(shoulderReference.yUp, signedHorizontal(shoulderReference.x))
```

Convert to degrees and normalize to `[-180, 180]`.

### Hip Rotation Proxy

Primitive name: `hip-rotation-proxy-ratio`

Input:

- normalized active left hip;
- normalized active right hip;
- normalized baseline left hip;
- normalized baseline right hip.

Formula:

```text
baselineWidth = abs(baselineLeftHip.x - baselineRightHip.x)
activeWidth = abs(activeLeftHip.x - activeRightHip.x)
ratio = activeWidth / baselineWidth
```

Use raw normalized `x` values. Do not apply `xTarget`, `mirrorSign`, or
`handednessSign`. If `baselineWidth <= GEOMETRY_EPSILON`, return unavailable
with `INSUFFICIENT_BASELINE`.

This is only an apparent-width proxy. Do not describe it as true hip rotation.

### Head Displacement

Primitive name: `head-displacement-ratio`

Input:

- normalized active nose;
- normalized baseline nose;
- normalized baseline left shoulder;
- normalized baseline right shoulder.

Formula:

```text
delta = activeNose2d - baselineNose2d
baselineShoulderWidth = distance2d(baselineLeftShoulder2d, baselineRightShoulder2d)
ratio = length(delta) / baselineShoulderWidth
```

Use raw normalized 2D Euclidean distances. Do not apply `xTarget`,
`mirrorSign`, or `handednessSign`. If
`baselineShoulderWidth <= GEOMETRY_EPSILON`, return unavailable with
`INSUFFICIENT_BASELINE`.

This uses the nose landmark as a head proxy. Do not describe it as exact head
center tracking.

## Handedness And Mirroring

Handedness:

- must be `"right"` or `"left"` for measured public primitives;
- selects lead/trail anatomical landmarks;
- `"undeclared"` returns `UNDECLARED_HANDEDNESS`;
- must not be inferred.

Mirroring:

- must be `"yes"` or `"no"` for measured 2D projection primitives;
- affects only 2D sign normalization for projection angles;
- `"undeclared"` returns `UNDECLARED_MIRRORING` for projection primitives;
- must not relabel anatomical landmarks.

If handedness or mirroring is unavailable, side-dependent projection primitives
return `unavailable`. Baseline-independent non-side-specific helpers may still
be tested internally, but public primitive functions should require explicit
declarations for consistency with SS-007.

## Test Matrix

`test/unit/geometry-metrics.test.ts` must include deterministic synthetic
coverage for `SS-TC-013`:

- level right-handed shoulder angle returns `0`;
- projected shoulder tilt returns a known positive or negative value after
  sign normalization;
- vertical spine centerline returns `0`;
- projected spine lean returns a known signed value;
- lead and trail knee flex return expected dot-product angles;
- lead arm plane returns a known relative angle and wraps into `[-180, 180]`;
- hip rotation proxy compares active hip width to baseline hip width;
- head displacement compares active nose movement to baseline shoulder width;
- left-handed inputs select the opposite anatomical side from right-handed
  inputs;
- mirrored declaration changes only expected 2D sign normalization;
- mirrored declaration does not change hip rotation proxy or head displacement
  ratio magnitudes or warning arrays;
- missing required array indexes return `MISSING_LANDMARK` and `value: null`;
- present landmark entries with missing or undefined fields return
  `MISSING_LANDMARK` and `value: null`;
- present numeric `NaN`, `Infinity`, or `-Infinity` fields return
  `NON_FINITE_COORDINATE` and `value: null`;
- low visibility on required landmarks returns `LOW_VISIBILITY` and
  `value: null`;
- visibility exactly equal to `MIN_LANDMARK_VISIBILITY` is accepted;
- coincident points and zero-length vectors return `ZERO_LENGTH_VECTOR`;
- vector lengths exactly equal to `GEOMETRY_EPSILON` return
  `ZERO_LENGTH_VECTOR`;
- knee-flex cosine inputs are clamped to `[-1, 1]` before `acos`;
- missing baseline returns `MISSING_BASELINE`;
- zero-width or near-zero baseline denominators return
  `INSUFFICIENT_BASELINE`;
- undeclared handedness and mirroring fixtures assert cumulative warning order;
- warning-only failures with otherwise computable geometry return
  `status: "unavailable"` and `value: null`;
- baseline low-visibility landmarks return `LOW_VISIBILITY` for baseline-
  dependent primitives;
- corruption in an unused array does not affect primitives that do not consume
  that array;
- functions do not mutate input landmark objects or arrays, including nested
  landmark object properties.

Use a default test tolerance of `1e-4` for non-trivial trigonometric degree and
ratio assertions, unless a value can be asserted exactly.

## Observability

Observability is intentionally unchanged for SS-009.

Do not add console logging, runtime diagnostics, telemetry, analytics, traces,
storage writes, network calls, or debug payloads. In particular, do not log or
persist raw landmarks, derived metric values, warning arrays, phase labels,
handedness, timestamps, media characteristics, filenames, identifiers, local
wall-clock time, or performance timing.

## Privacy, Safety, And Licensing

- Landmarks and metric primitives are sensitive derived data.
- SS-009 utilities operate on caller-provided in-memory data and add no storage
  or transmission behavior.
- Do not make absolute privacy, deletion, anonymity, safety, legal, medical,
  coaching, performance, or correctness claims.
- Do not copy CaddieSet code, formulas, datasets, model outputs, media,
  fixtures, or identifiers.
- Use only independently authored TypeScript and common vector geometry.

## Verification Required After Implementation

When implementation is later approved, run:

```bash
npm run test:unit -- geometry-metrics
npm run test:unit
npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
git diff --check
```

No dependency, bundle, model, SDK, provider, worker, export, persistence, or
public-serving changes are approved by this specification.
