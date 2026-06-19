# SS-008 Claude QA Planning Prompt

Paste this into Claude Chat. Claude does not have filesystem, Notion, or GitHub
access; all required context is embedded here.

## Role

You are the lead adversarial QA planner for Swing Sync.

Stage: pre-implementation QA planning.

Scope: `SS-008 Define Swing Sync metric JSON schema`.

Return:

- PASS/FAIL verdict for implementation readiness.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may move to
  `3. In Development (ChatGPT)`.

## Story State

Task: `SS-008 Define Swing Sync metric JSON schema`

Branch: `ss-008-metric-schema`

Current tracker status: `2. QA Planning (Claude)`

Acceptance criteria:

- Schema includes metric name, value, units, phase, handedness, confidence, and
  limitation notes.
- Aligns naming with CaddieSet-inspired concepts without overclaiming
  equivalence.
- Has fixtures for valid, missing, and low-confidence data.

Dedicated test case: `SS-TC-012`

`SS-TC-012` requires deterministic schema validation for synthetic valid,
missing-value, and low-confidence fixtures; bounded metric names, phases,
handedness, confidence/quality states, units, and limitation codes; no
fabricated values for missing data; no CaddieSet equivalence claims; no raw
frames, previews, landmarks, requested/observed timestamps, media
characteristics, identifiers, or sensitive diagnostics; and no regression to
protected SS-005/SS-006/SS-007 behavior.

## Protected Boundaries

SS-005:

- exact `@mediapipe/tasks-vision@0.10.35`;
- approved same-origin model and WASM assets;
- dedicated worker VIDEO-mode inference;
- complete normalized/world landmark arrays with `x`, `y`, `z`, and
  `visibility`;
- no invented per-landmark `presence`;
- local volatile raw frames and landmarks;
- fail-closed unexpected external requests;
- no telemetry, remote logging, raw-frame persistence, or landmark persistence.

SS-006:

- fixed-budget eight-sample integer-millisecond timestamp grid;
- ordered output associating requested/observed timestamps, volatile previews,
  and pose results;
- cancellation, failure, retry, stale-generation rejection, cleanup;
- no persistence, transit, export, or diagnostics containing frame pixels,
  landmarks, observed timestamps, media characteristics, or identifiers;
- `observedSeekTimestampMs` remains excluded from diagnostics, persistence,
  network transit, and future export unless separately reviewed.

SS-007:

- stable ordered phase vocabulary:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, `finish`;
- manual-review-only behavior with no numeric-confidence auto-acceptance;
- evidence states limited to `unsupported-input` and `review-required`;
- stable sanitized warning codes only;
- nondecreasing shared-sample correction with explicit user confirmation;
- separate automatic proposal and user-correction provenance;
- no metrics, coaching advice, export, persistence, telemetry, remote review,
  new model/SDK/assets, new dependencies, or new worker architecture.

## Gemini Research Disposition Summary

Gemini recommended a zero-dependency TypeScript validator, versioned JSON
payload wrapper, CaddieSet-inspired metric naming, synthetic valid/missing/low
confidence fixtures, and strict privacy/safety boundaries.

Codex accepted those broad directions only with revisions:

- Gemini's raw JSON Schema and fixture examples were malformed.
- Gemini used overstrong privacy language such as "absolute firewall" and
  complete destruction on refresh/tab close.
- Gemini proposed `1.0.0`, `public/schemas/`, `high` confidence, and a React
  context; these are revised or rejected.
- Gemini's CaddieSet claims are bounded to naming inspiration only.
- No new validation dependency is approved.

Primary checks:

- JSON Schema Draft 2020-12 supports schema structure, identifiers, `$defs`,
  and validation vocabularies.
- SemVer supports `MAJOR.MINOR.PATCH`, but SS-008 is an initial internal
  contract, so the candidate starts at `0.1.0`.
- GolfDB supports eight-event golf swing sequencing research but does not
  validate Swing Sync's eight volatile pose samples as exact event detections.
- CaddieSet supports phase-linked posture feature inspiration and currently has
  an MIT-licensed GitHub repository, but SS-008 must not copy CaddieSet data,
  formulas, code, media, models, identifiers, or claim equivalence.

## Candidate Specification To Audit

### Scope

SS-008 defines a local metric payload schema, TypeScript contract, manual
validator, and synthetic fixtures for future Swing Sync metric stories.

It does not calculate metrics, change UI, add runtime behavior, add export,
store payloads, send payloads, add telemetry, add dependencies, change model
assets, or add provider integrations.

### Artifacts

Codex proposes:

- `docs/schemas/swing-metric-payload-v0.1.0.schema.json`
- `src/metric-contract.ts`
- `test/fixtures/metrics/valid-payload.json`
- `test/fixtures/metrics/missing-payload.json`
- `test/fixtures/metrics/low-confidence-payload.json`
- `test/unit/metric-contract.test.ts`

The schema is under `docs/schemas/`, not `public/`, because SS-008 does not
approve public hosting, export, or runtime distribution.

No JSON Schema validation dependency is approved.

### Versioning

Use `schemaVersion: "0.1.0"`.

Breaking field, vocabulary, or semantics changes require future reviewed story
work. SS-008 implements no migration behavior.

### Metric Names

Allowed metric names:

- `address-stance-ratio`
- `top-shoulder-line-angle`
- `impact-spine-line-angle`
- `finish-balance-line-angle`

These are future-compatible contract entries inspired by common phase-linked
posture concepts and CaddieSet naming. SS-008 does not calculate them and does
not claim CaddieSet equivalence, CaddieSet validation, professional coaching
utility, performance improvement, or biomechanical accuracy.

### Units

Allowed units:

- `ratio`
- `degrees`

Metric-name/unit mapping:

- `address-stance-ratio` -> `ratio`
- all other allowed metric names -> `degrees`

### Phase IDs

Allowed phase identifiers are exactly:

- `address`
- `toe-up`
- `mid-backswing`
- `top`
- `mid-downswing`
- `impact`
- `mid-follow-through`
- `finish`

Metric-name/phase mapping:

- `address-stance-ratio` -> `address`
- `top-shoulder-line-angle` -> `top`
- `impact-spine-line-angle` -> `impact`
- `finish-balance-line-angle` -> `finish`

### Handedness

Allowed:

- `right`
- `left`
- `undeclared`

Measured values require `right` or `left`. Non-measured values may use
`undeclared`. SS-008 must not infer handedness.

### Value

Candidate TypeScript shape:

```ts
type MetricValue =
  | { status: "measured"; numericValue: number }
  | { status: "missing" | "unsupported" | "not-reviewed"; numericValue: null };
```

`measured.numericValue` must be finite. Non-measured values must use
`numericValue: null`.

### Confidence

Candidate confidence shape:

```ts
interface MetricConfidence {
  kind: "not-calibrated" | "low-evidence" | "unavailable";
}
```

No numeric confidence is approved. No `high`, `accurate`, `valid`,
`sufficient`, `calibrated`, or automatic-acceptance terminology is approved.
`low-evidence` satisfies low-confidence fixture coverage without implying
calibrated accuracy.

### Limitation Notes

Allowed limitation codes:

- `none`
- `phase-review-required`
- `phase-unsupported`
- `metric-not-calculated`
- `pose-evidence-low`
- `impact-not-directly-observed`
- `caddieset-not-equivalent`

Every metric requires a non-empty `limitationNotes` array. If `none` is
present, it must be the only code.

### Prohibited Payload Content

Payloads and fixtures must not contain:

- raw frames, previews, images, pixels, canvases, `ImageBitmap`, object URLs, or
  video references;
- normalized/world landmarks, joint arrays, keypoints, coordinates, visibility
  arrays, or MediaPipe thresholds;
- requested timestamps, observed seek timestamps, frame indices, sample
  indices, run generations, local wall-clock times, or performance timings;
- file names, MIME types, duration, dimensions, orientation, device IDs, user
  IDs, golfer IDs, player names, sex, club type, ball-flight fields, or other
  identifiers;
- coaching recommendations, drills, diagnoses, injury markers, medical terms,
  professional instruction, or corrective movement prescriptions.

### Validator

`src/metric-contract.ts` must export literal vocabularies, types, and
`isSwingMetricPayload(value: unknown): value is SwingMetricPayload`.

The validator must reject unknown vocabulary, additional properties at every
level, non-finite measured values, non-null unavailable values, metric/unit and
metric/phase mismatches, measured `undeclared` handedness, empty limitation
arrays, `none` combined with other codes, and prohibited sensitive keys
recursively. It must never throw for malformed input.

### Tests

Required tests:

- all three fixtures validate;
- every allowed metric name has at least one valid case;
- required fields are enforced;
- unknown metric names, units, phases, handedness, confidence kinds, value
  statuses, and limitation codes are rejected;
- non-finite, missing, null measured, or fabricated unavailable numeric values
  are rejected;
- metric-name/unit and metric-name/phase mismatches are rejected;
- measured `undeclared` handedness is rejected;
- additional properties and prohibited sensitive keys are rejected, including
  nested occurrences;
- unsafe limitation/user-facing wording is absent from schema and fixtures;
- no fixture contains raw landmarks, frames, previews, requested/observed
  timestamps, media characteristics, identifiers, ball-flight fields, or local
  timing values.

### Verification Expected After Implementation

At minimum:

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

Smoke/pose-asset checks are required only if implementation changes runtime or
protected pose surfaces.

## Audit Questions

Please attack this candidate spec. In particular:

- Are the metric names too close to CaddieSet or too likely to imply
  calculation/validation?
- Is `not-calibrated` acceptable as a measured confidence state, or should the
  shape use a different term?
- Should `undeclared` handedness ever be allowed in a metric object?
- Are the limitation codes too broad, too user-facing, or too easy to misuse as
  coaching/accuracy claims?
- Does recursive prohibited-key rejection create false confidence or hidden
  maintenance risk?
- Are `docs/schemas/`, `src/metric-contract.ts`, and fixture locations
  appropriate?
- Are there missing rejection tests needed before implementation?
- Does anything weaken SS-005, SS-006, or SS-007 boundaries?
- Does the spec accidentally approve export, persistence, telemetry, public
  schema serving, or metric calculation?

Return PASS only if Codex can safely implement this candidate after addressing
minor non-blocking notes. If there are blockers, return FAIL and identify the
minimum changes needed before implementation.
