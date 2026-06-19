# SS-008 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This specification defines the
candidate implementation contract and may be used only after Claude QA planning
returns PASS or blocking findings are resolved.**

## Scope

SS-008 defines a local metric payload schema, TypeScript contract, manual
validator, and synthetic fixtures for future Swing Sync metric stories.

In scope:

- a static JSON Schema artifact for review and documentation;
- TypeScript literal vocabularies, types, and a zero-dependency validator;
- synthetic valid, missing-value, and low-confidence fixture payloads;
- deterministic unit tests for `SS-TC-012` acceptance coverage; and
- documentation of CaddieSet-inspired naming, privacy, safety, and
  observability boundaries.

Out of scope:

- metric calculation;
- runtime UI changes;
- coaching advice, drills, corrective instructions, medical or injury guidance;
- calibration, accuracy validation, benchmark comparison, or representative
  side-on video validation;
- export, persistence, remote review, telemetry, remote logging, cloud storage,
  service-worker caching, new model/provider/SDK/assets, new workers, or new
  dependencies.

## Protected Contracts

SS-008 must preserve:

- SS-005 exact `@mediapipe/tasks-vision@0.10.35`, approved same-origin model and
  WASM assets, dedicated worker inference, complete landmark arrays, volatile
  raw frame/landmark handling, and fail-closed unexpected-network behavior;
- SS-006 fixed-budget ordered sample queue, volatile previews/pose outputs,
  cleanup, cancellation/retry, and exclusion of observed seek timestamps from
  diagnostics, persistence, network transit, and export; and
- SS-007 phase vocabulary, manual-review-only readiness, evidence states,
  sanitized warning codes, separate proposal/correction provenance, and no
  numeric-confidence automatic acceptance.

## Artifact Contract

Create:

- `docs/schemas/swing-metric-payload-v0.1.0.schema.json`
- `src/metric-contract.ts`
- `test/fixtures/metrics/valid-payload.json`
- `test/fixtures/metrics/missing-payload.json`
- `test/fixtures/metrics/low-confidence-payload.json`
- `test/unit/metric-contract.test.ts`

Do not place the schema under `public/` in SS-008. The schema is a repository
artifact for review, documentation, and test alignment, not a served API or
export surface.

No dependency may be added for JSON Schema validation. The JSON Schema file is
reviewable documentation; runtime/test validation uses the project-native
manual TypeScript validator.

## Versioning Contract

Use schema version `0.1.0`.

Rules:

- Every payload requires `schemaVersion: "0.1.0"`.
- `isSwingMetricPayload` must reject any `schemaVersion` value other than the
  exact string literal `"0.1.0"`. No SemVer range parsing or compatibility
  inference is approved in SS-008.
- The JSON Schema `$id` should be stable and repository-scoped, for example:
  `https://github.com/ajason13/swing-sync/schemas/swing-metric-payload-v0.1.0.schema.json`.
- Breaking field, vocabulary, or semantics changes require a future major
  version once a stable `1.0.0` contract exists. Before `1.0.0`, changes still
  require a reviewed story and fixture/test updates.
- SS-008 implements no migration behavior.

## Vocabulary Contract

### Metric Names

Allowed metric names:

```text
address-stance-ratio
top-shoulder-line-angle
impact-spine-line-angle
finish-balance-line-angle
```

These names are future-compatible contract entries inspired by common
phase-linked posture concepts and CaddieSet naming. SS-008 does not calculate
them and does not claim CaddieSet equivalence, CaddieSet validation, professional
coaching utility, performance improvement, or biomechanical accuracy.

### Units

Allowed units:

```text
ratio
degrees
```

Units must match the metric name:

- `address-stance-ratio`: `ratio`
- `top-shoulder-line-angle`: `degrees`
- `impact-spine-line-angle`: `degrees`
- `finish-balance-line-angle`: `degrees`

### Phase IDs

Allowed phase identifiers are exactly the SS-007 vocabulary:

```text
address
toe-up
mid-backswing
top
mid-downswing
impact
mid-follow-through
finish
```

Metric-name phase and `phaseId` must match:

- `address-stance-ratio` -> `address`
- `top-shoulder-line-angle` -> `top`
- `impact-spine-line-angle` -> `impact`
- `finish-balance-line-angle` -> `finish`

### Handedness

Allowed handedness:

```text
right
left
undeclared
```

Rules:

- `measured` values require `right` or `left`.
- `missing`, `unsupported`, and `not-reviewed` values may use `undeclared`.
- Handedness is copied from reviewed declarations or marked unavailable; SS-008
  must not infer handedness.

### Value

Every metric requires:

```ts
type MetricValue =
  | { status: "measured"; numericValue: number }
  | { status: "missing" | "unsupported" | "not-reviewed"; numericValue: null };
```

Rules:

- `measured.numericValue` must be finite.
- Non-measured statuses must use `numericValue: null`.
- Do not use `0`, `NaN`, `Infinity`, empty strings, or omitted properties to
  represent unavailable values.

### Confidence

Every metric requires a non-calibrated confidence object:

```ts
interface MetricConfidence {
  kind: "not-calibrated" | "low-evidence" | "unavailable";
}
```

Rules:

- No numeric confidence is approved.
- Do not use `high`, `accurate`, `valid`, `sufficient`, `calibrated`, or
  automatic-acceptance terminology.
- `measured` values may use `not-calibrated` or `low-evidence`.
- Non-measured values use `unavailable`.
- `low-evidence` exists to satisfy low-confidence fixture coverage without
  implying calibrated accuracy.

### Limitation Notes

Allowed limitation codes:

```text
none
phase-review-required
phase-unsupported
metric-not-calculated
pose-evidence-low
impact-not-directly-observed
```

Rules:

- Every metric requires a non-empty `limitationNotes` array.
- If `none` is present, it must be the only code.
- Codes are stable sanitized categories, not user-facing coaching advice.
- Do not include free text, timestamps, landmarks, filenames, media
  characteristics, identifiers, or local timing values in limitation notes.
- CaddieSet non-equivalence is not represented in `limitationNotes`; it is
  represented only by the required payload-level field below.
- `impact-not-directly-observed` is valid only on
  `impact-spine-line-angle`. It is rejected on every other metric name.

Metric-specific limitation-code mapping:

- `address-stance-ratio`: `none`, `phase-review-required`,
  `phase-unsupported`, `metric-not-calculated`, `pose-evidence-low`
- `top-shoulder-line-angle`: `none`, `phase-review-required`,
  `phase-unsupported`, `metric-not-calculated`, `pose-evidence-low`
- `impact-spine-line-angle`: `none`, `phase-review-required`,
  `phase-unsupported`, `metric-not-calculated`, `pose-evidence-low`,
  `impact-not-directly-observed`
- `finish-balance-line-angle`: `none`, `phase-review-required`,
  `phase-unsupported`, `metric-not-calculated`, `pose-evidence-low`

### CaddieSet Disclaimer

Every payload requires the schema-level constant:

```ts
caddieSetEquivalence: "not-equivalent";
```

Rules:

- This field is required on every payload.
- It must equal the exact string `"not-equivalent"`.
- It is payload-level metadata, not a per-metric limitation.
- It does not approve any CaddieSet formula, dataset, code, model, media, or
  benchmark reuse.

### Status And Confidence Pairing

The value status and confidence kind must obey this exact table:

| `value.status` | Allowed `confidence.kind` |
| --- | --- |
| `measured` | `not-calibrated`, `low-evidence` |
| `missing` | `unavailable` |
| `unsupported` | `unavailable` |
| `not-reviewed` | `unavailable` |

Any other status/confidence pairing is invalid. In particular, a measured value
with `unavailable` confidence is rejected, and an unavailable value with
`not-calibrated` or `low-evidence` confidence is rejected.

## Payload Shape

```ts
interface SwingMetricPayload {
  schemaVersion: "0.1.0";
  caddieSetEquivalence: "not-equivalent";
  metrics: readonly SwingMetric[];
}

interface SwingMetric {
  metricName: MetricName;
  value: MetricValue;
  units: MetricUnits;
  phaseId: PhaseId;
  handedness: MetricHandedness;
  confidence: MetricConfidence;
  limitationNotes: readonly MetricLimitationCode[];
}
```

Additional properties are rejected at every object level.

The validator must reject these exact prohibited keys recursively at any object
depth, using case-sensitive exact-key matching:

```text
bitmap
bitmapUrl
ballSpeed
canvas
clubType
deviceId
duration
fileName
filename
frame
frameIndex
golferId
height
image
imageBitmap
keypoints
landmarks
mediaCharacteristics
mimeType
objectUrl
observedSeekTimestampMs
performanceNow
pixels
playerName
pose
preview
requestedTimestampMs
runGeneration
sampleIndex
sex
thresholds
timestamp
timestampMs
userId
video
visibility
width
worldLandmarks
```

These keys cover the following prohibited content categories:

- raw frames, previews, images, pixels, canvases, `ImageBitmap`, object URLs, or
  video references;
- normalized/world landmarks, joint arrays, keypoints, coordinates, visibility
  arrays, or MediaPipe thresholds;
- requested timestamps, observed seek timestamps, frame indices, sample
  indices, run generations, local wall-clock times, or performance timings;
- file names, MIME types, duration, dimensions, orientation, device IDs, user
  IDs, golfer IDs, player names, sex, club type, ball-flight fields, or other
  identifiers; or
- coaching recommendations, drills, diagnoses, injury markers, medical terms,
  professional instruction, or corrective movement prescriptions.

The exact-key list is intentionally conservative and testable. SS-008 does not
claim it blocks every possible synonym; future schema revisions must update the
list and tests when new protected field names are introduced.

## Fixture Contract

Fixtures are static JSON only. They are project-authored, synthetic,
non-identifying, and license-clean.

### Valid Fixture

`valid-payload.json` contains at least two `measured` metrics with finite
synthetic values, reviewed `right` or `left` handedness, `not-calibrated`
confidence, matching units/phases, `limitationNotes: ["none"]`, and payload
`caddieSetEquivalence: "not-equivalent"`. At least one measured fixture value
must be `0` to prove finite zero is accepted.

### Missing Fixture

`missing-payload.json` contains at least one metric with:

- `value.status: "missing"`
- `numericValue: null`
- `confidence.kind: "unavailable"`
- a non-empty limitation such as `metric-not-calculated` or
  `phase-review-required`
- payload `caddieSetEquivalence: "not-equivalent"`

### Low-Confidence Fixture

`low-confidence-payload.json` contains at least one metric with:

- `metricName: "impact-spine-line-angle"`;
- `phaseId: "impact"`;
- `value.status: "measured"` and finite `numericValue`;
- `confidence.kind: "low-evidence"`;
- limitation codes `pose-evidence-low` and
  `impact-not-directly-observed`; and
- payload `caddieSetEquivalence: "not-equivalent"`.

## Validation Contract

`src/metric-contract.ts` must export:

- literal arrays for every vocabulary;
- TypeScript types derived from those arrays where practical;
- `isSwingMetricPayload(value: unknown): value is SwingMetricPayload`;
- focused helpers only if they reduce duplication; and
- no side effects, storage, network, console output, worker use, or DOM use.

The validator must:

- accept exactly schema version `0.1.0` and reject any other version string,
  including `0.1.1`, `1.0.0`, empty strings, numbers, or semver-compatible
  ranges;
- require payload-level `caddieSetEquivalence: "not-equivalent"` and reject
  missing, altered, boolean, object, or array values;
- reject unknown metric names, units, phase IDs, handedness, confidence kinds,
  value statuses, and limitation codes;
- reject additional properties at every level;
- reject non-finite measured values and any non-null unavailable value;
- reject status/confidence pairings outside the compatibility table;
- reject mismatched metric-name/unit and metric-name/phase combinations;
- reject metric-name/limitation-code mismatches, including
  `impact-not-directly-observed` on non-impact metrics;
- reject measured metrics with `undeclared` handedness;
- reject empty limitation arrays and `none` combined with other codes;
- reject duplicate limitation codes;
- reject the exact prohibited sensitive keys listed above recursively,
  including nested occurrences of `observedSeekTimestampMs` and
  `runGeneration`; and
- never throw for malformed input.

## Test Contract

Unit tests must cover:

- all three fixtures validate;
- every allowed metric name has at least one valid case;
- required fields are enforced;
- unknown metric names, units, phases, handedness, confidence kinds, value
  statuses, and limitation codes are rejected;
- schema version values other than exact `"0.1.0"` are rejected;
- missing or altered `caddieSetEquivalence` is rejected;
- status/confidence mismatches are rejected, including `measured` with
  `unavailable` and `missing` with `not-calibrated`;
- non-finite, missing, null measured, or fabricated unavailable numeric values
  are rejected, with explicit `NaN`, `Infinity`, and `-Infinity` cases;
- finite measured `0` is accepted;
- metric-name/unit and metric-name/phase mismatches are rejected;
- metric-name/limitation-code mismatches are rejected;
- `impact-spine-line-angle` appears in the low-confidence fixture with
  `phaseId: "impact"`, `confidence.kind: "low-evidence"`, and
  `impact-not-directly-observed`;
- measured `undeclared` handedness is rejected;
- additional properties and prohibited sensitive keys are rejected, including
  nested occurrences;
- empty `limitationNotes` and duplicate limitation codes are rejected;
- non-canonical casing and whitespace in enum values are rejected;
- unsafe limitation/user-facing wording is absent from schema and fixtures;
- no fixture contains raw landmarks, frames, previews, requested/observed
  timestamps, media characteristics, identifiers, ball-flight fields, or local
  timing values; and
- `SS-TC-012` coverage can be accurately claimed.

Run at least:

```bash
npm run test:unit
npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
npm audit --omit=dev
git diff --check
```

Because SS-008 should not touch runtime/browser behavior, `npm run test:smoke`
and `npm run pose-assets:verify` are not required unless implementation changes
runtime surfaces or protected pose assets.

## CaddieSet Boundary

Allowed:

- cite CaddieSet as academic inspiration for phase-linked posture metric naming;
- use independently chosen Swing Sync metric names that avoid copying exact
  CaddieSet keys as the app's canonical API; and
- document that CaddieSet uses joint-derived features and ball-flight data in a
  dataset context.

Prohibited:

- CaddieSet equivalence, validation, benchmark, accuracy, or professional
  coaching claims;
- copying CaddieSet formulas, data files, code, models, weights, videos, media,
  identifiers, or ball-flight targets;
- adding CaddieSet as a dependency or bundled asset; and
- user-facing wording that says Swing Sync computes CaddieSet metrics.

## Privacy And Safety Boundary

Metric payloads are sensitive local derived data. SS-008 adds no storage,
export, remote transmission, telemetry, remote logging, service-worker caching,
or public schema serving.

Do not make absolute deletion, privacy, anonymity, security, correctness,
injury-prevention, medical, or coaching claims. Use scoped wording:

- "This metric contract contains synthetic examples only."
- "Future calculated metrics may be sensitive and require separate review
  before storage, export, or sharing."
- "Metric names are educational labels, not validated coaching measurements."

## Observability Decision

Observability is intentionally unchanged. SS-008 should add no runtime logs,
metrics, traces, timings, debugging hooks, console output, or diagnostics.

If implementation accidentally creates runtime diagnostics, they must not
include metric values, confidence kinds, limitation codes, phase labels,
handedness, timestamps, landmarks, media characteristics, or identifiers.

## Implementation Start Gate

Before implementation:

- Claude must review this specification and `SS-TC-012` expectations.
- Any Claude blockers must be resolved in this document and in a focused
  response file.
- The task must move from `1. Spec Drafting (Gemini)` to
  `2. QA Planning (Claude)` for QA planning, then to
  `3. In Development (ChatGPT)` only after Claude QA PASS.
