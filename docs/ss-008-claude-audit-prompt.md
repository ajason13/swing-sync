# SS-008 Claude Final Implementation Audit Prompt

Paste this into Claude Chat. Claude does not have filesystem, Notion, or GitHub
access; all required context is embedded here.

## Role

You are the lead adversarial implementation auditor for Swing Sync.

Stage: final implementation audit.

Scope: `SS-008 Define Swing Sync metric JSON schema`.

Return:

- PASS/FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may prepare the PR.

## Story State

Task: `SS-008 Define Swing Sync metric JSON schema`

Branch: `ss-008-metric-schema`

Current tracker status: `4. Final Audit (Claude)`

Acceptance criteria:

- Schema includes metric name, value, units, phase, handedness, confidence, and
  limitation notes.
- Aligns naming with CaddieSet-inspired concepts without overclaiming
  equivalence.
- Has fixtures for valid, missing, and low-confidence data.

Dedicated test case: `SS-TC-012`

`SS-TC-012` covers deterministic schema validation for synthetic valid,
missing-value, and low-confidence fixtures; bounded metric names, phases,
handedness, confidence/quality states, units, and limitation codes; no
fabricated values for missing data; no CaddieSet equivalence claims; no raw
frames, previews, landmarks, requested/observed timestamps, media
characteristics, identifiers, or sensitive diagnostics; and no regression to
protected SS-005/SS-006/SS-007 behavior.

## Prior QA Gate

Claude QA planning initially returned FAIL with B1-B4:

- B1: missing status/confidence pairing.
- B2: optional per-metric CaddieSet disclaimer.
- B3: undefined recursive prohibited-key strategy.
- B4: undefined off-version validation.

Codex revised the spec. Claude focused re-review returned PASS:

- B1-B4 closed.
- No new blockers.
- Non-blocking note: schema docs should state prohibited-key rejection is
  exact-match and case-sensitive, not casing/synonym aware.

Implementation includes that note in the JSON Schema `$comment`.

## Implemented Files

- `docs/schemas/swing-metric-payload-v0.1.0.schema.json`
- `src/metric-contract.ts`
- `test/fixtures/metrics/valid-payload.json`
- `test/fixtures/metrics/missing-payload.json`
- `test/fixtures/metrics/low-confidence-payload.json`
- `test/unit/metric-contract.test.ts`
- planning/audit docs and `CONTEXT.md`

No runtime UI, model, worker, SDK, dependency, export, persistence, telemetry,
remote logging, remote review, or public schema serving was added.

## Implemented Contract Summary

### Payload

```ts
interface SwingMetricPayload {
  schemaVersion: "0.1.0";
  caddieSetEquivalence: "not-equivalent";
  metrics: readonly SwingMetric[];
}
```

Only exact `schemaVersion: "0.1.0"` is accepted. There is no SemVer range
parsing.

`caddieSetEquivalence: "not-equivalent"` is required at payload level. There is
no per-metric `caddieset-not-equivalent` limitation code.

### Metric

```ts
interface SwingMetric {
  metricName:
    | "address-stance-ratio"
    | "top-shoulder-line-angle"
    | "impact-spine-line-angle"
    | "finish-balance-line-angle";
  value:
    | { status: "measured"; numericValue: number }
    | { status: "missing" | "unsupported" | "not-reviewed"; numericValue: null };
  units: "ratio" | "degrees";
  phaseId:
    | "address"
    | "toe-up"
    | "mid-backswing"
    | "top"
    | "mid-downswing"
    | "impact"
    | "mid-follow-through"
    | "finish";
  handedness: "right" | "left" | "undeclared";
  confidence: { kind: "not-calibrated" | "low-evidence" | "unavailable" };
  limitationNotes: readonly MetricLimitationCode[];
}
```

Metric/unit and metric/phase mappings are enforced:

- `address-stance-ratio` -> `ratio`, `address`
- `top-shoulder-line-angle` -> `degrees`, `top`
- `impact-spine-line-angle` -> `degrees`, `impact`
- `finish-balance-line-angle` -> `degrees`, `finish`

Measured values require `right` or `left`; measured `undeclared` is rejected.

Status/confidence pairing:

- `measured` -> `not-calibrated` or `low-evidence`
- `missing` -> `unavailable`
- `unsupported` -> `unavailable`
- `not-reviewed` -> `unavailable`

### Limitation Codes

Allowed:

- `none`
- `phase-review-required`
- `phase-unsupported`
- `metric-not-calculated`
- `pose-evidence-low`
- `impact-not-directly-observed`

Rules:

- non-empty array required;
- duplicate codes rejected;
- if `none` is present, it must be the only code.

### Prohibited-Key Strategy

The validator recursively rejects the exact case-sensitive keys:

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

The schema `$comment` says: prohibited-key rejection is exact-match and
case-sensitive; it does not catch casing or naming variants.

## Key Implementation Details

`src/metric-contract.ts`:

- exports literal vocabularies and TypeScript types;
- exports `isSwingMetricPayload(value: unknown): value is SwingMetricPayload`;
- has no DOM, worker, storage, network, console, telemetry, dependency, or
  runtime side effects;
- returns `false` rather than throwing for malformed input;
- rejects additional properties at payload, metric, value, and confidence
  object levels;
- rejects prohibited keys recursively before structural acceptance;
- enforces exact version, required CaddieSet non-equivalence marker,
  metric/unit mapping, metric/phase mapping, handedness rules,
  status/confidence pairing, limitation rules, and finite measured values.

`docs/schemas/swing-metric-payload-v0.1.0.schema.json`:

- Draft 2020-12 JSON Schema documentation artifact under `docs/schemas/`, not
  `public/`;
- includes `$schema`, `$id`, title, description, `$comment`;
- uses `const`, `enum`, `additionalProperties: false`, `if`/`then`/`else`,
  `uniqueItems`, and metric-specific mapping rules;
- is not used with a new validator dependency.

Fixtures:

- `valid-payload.json` includes all four allowed metric names and a measured
  finite `0` value.
- `missing-payload.json` uses `missing`, `numericValue: null`, `unavailable`,
  and limitation notes.
- `low-confidence-payload.json` uses `low-evidence` with a measured finite
  value and non-coaching limitation codes.

Unit tests:

- all three fixtures validate;
- every allowed metric name is covered;
- exact schema version and CaddieSet marker are enforced;
- unknown/non-canonical/case/whitespace enum values are rejected;
- metric/unit and metric/phase mismatches are rejected;
- `0` measured value is accepted;
- `NaN`, `Infinity`, and `-Infinity` measured values are rejected;
- missing/non-measured fabricated numeric values are rejected;
- status/confidence mismatches are rejected;
- measured `undeclared` handedness is rejected;
- empty, duplicate, unknown, and `none`-combined limitation arrays are rejected;
- missing required fields and additional properties are rejected at every level;
- every exact prohibited key is tested nested inside a metric value object;
- fixture/schema text is scanned for sensitive fields and unsafe wording;
- malformed inputs return false.

## Protected Boundaries

Preserve SS-005:

- exact `@mediapipe/tasks-vision@0.10.35`;
- approved same-origin model/WASM assets;
- dedicated worker VIDEO-mode inference;
- complete landmark arrays with `x`, `y`, `z`, and `visibility`;
- no invented per-landmark `presence`;
- volatile local frames/landmarks;
- fail-closed unexpected external requests;
- no telemetry, remote logging, raw-frame persistence, or landmark persistence.

Preserve SS-006:

- fixed-budget ordered sample queue;
- volatile previews/pose outputs;
- cleanup, cancellation/retry, stale-generation rejection;
- observed seek timestamps excluded from diagnostics, persistence, network
  transit, and future export unless separately reviewed.

Preserve SS-007:

- phase vocabulary unchanged;
- manual-review-only readiness;
- no numeric-confidence automatic acceptance;
- no metrics, coaching advice, export, persistence, telemetry, remote review,
  new model/SDK/assets, dependencies, or worker architecture.

## Verification Run

Passed:

```bash
npm run test:unit -- metric-contract
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

Results:

- focused metric tests: 10 passed;
- full unit tests: 50 passed across 7 files;
- build passed;
- compliance, safety, privacy, license audit, bundle fixture, SBOM generation,
  production audit, and diff check passed;
- `npm audit --omit=dev`: 0 vulnerabilities.

`npm run sbom:generate` changed only generated SBOM metadata
(UUID/timestamp/npm tool version) because no production dependency changed; that
metadata churn was restored after verification.

## Audit Questions

Please attack:

- Whether the implementation fully satisfies SS-TC-012.
- Whether the validator has any fail-open path for malformed or sensitive data.
- Whether status/confidence, value/null, unit/phase, handedness, limitation, and
  version rules are enforced coherently.
- Whether the CaddieSet disclaimer and naming boundary are structurally
  sufficient without overclaiming equivalence.
- Whether exact case-sensitive prohibited-key rejection plus documentation is
  acceptable for SS-008.
- Whether the JSON Schema doc and TypeScript validator drift in material ways.
- Whether any fixture or schema text includes unsafe wording, sensitive data,
  identifiers, timestamps, media details, or coaching/medical language.
- Whether any runtime, dependency, privacy, safety, licensing, export,
  persistence, telemetry, or protected SS-005/SS-006/SS-007 boundary was
  accidentally changed.

Return PASS only if Codex may prepare the PR. If FAIL, list the minimum
blocking fixes and focused tests required before PR preparation.
