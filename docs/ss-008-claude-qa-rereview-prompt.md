# SS-008 Claude QA Focused Re-Review Prompt

Paste this into Claude Chat. Claude does not have filesystem, Notion, or GitHub
access; all required context is embedded here.

## Role

You are the lead adversarial QA planner for Swing Sync.

Stage: focused pre-implementation QA re-review.

Scope: SS-008 metric JSON schema planning blockers B1-B4 from the prior FAIL.

Return:

- PASS/FAIL verdict.
- Whether B1-B4 are closed.
- Any new blockers introduced by the revisions.
- Missing tests or edge cases that remain blocking.
- Explicit sign-off status for whether Codex may move SS-008 to
  `3. In Development (ChatGPT)`.

## Prior Verdict Summary

You previously returned FAIL with four blockers:

- **B1:** Missing status/confidence pairing rule.
- **B2:** `caddieset-not-equivalent` was an optional per-metric limitation
  instead of a required disclaimer mechanism.
- **B3:** Recursive prohibited-key rejection had no exact key list or matching
  strategy.
- **B4:** Exact validator behavior for schema versions other than `0.1.0` was
  undefined.

You also requested five edge-case tests:

- measured `0` accepted;
- explicit `NaN`, `Infinity`, and `-Infinity` rejected;
- empty `limitationNotes` rejected;
- duplicate limitation codes decided/tested;
- case/whitespace-sensitive enum rejection.

## Applied Revisions

### B1 Response

The spec now includes this compatibility table:

| `value.status` | Allowed `confidence.kind` |
| --- | --- |
| `measured` | `not-calibrated`, `low-evidence` |
| `missing` | `unavailable` |
| `unsupported` | `unavailable` |
| `not-reviewed` | `unavailable` |

Any other pairing is invalid. The validator and tests must reject `measured`
with `unavailable` and missing/unavailable statuses with `not-calibrated` or
`low-evidence`.

### B2 Response

The spec now requires every payload to include:

```ts
caddieSetEquivalence: "not-equivalent";
```

Rules:

- This field is required on every payload.
- It must equal exactly `"not-equivalent"`.
- It is payload-level metadata, not a per-metric limitation.
- It does not approve any CaddieSet formula, dataset, code, model, media, or
  benchmark reuse.

`caddieset-not-equivalent` is removed from allowed limitation codes. The
payload-level field above is the only CaddieSet disclaimer mechanism.

### B3 Response

The spec now requires recursive case-sensitive exact-key rejection for this
list:

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

The spec says this exact-key list is conservative and testable, not a guarantee
against every possible synonym. Tests must include nested prohibited keys,
including nested `observedSeekTimestampMs` and `runGeneration`.

### B4 Response

The spec now says:

- `isSwingMetricPayload` accepts only exact string literal `"0.1.0"`.
- It rejects `0.1.1`, `1.0.0`, empty strings, numbers, and range-like strings.
- No SemVer range parsing or compatibility inference is approved.

### Additional Test Responses

The spec now requires:

- finite measured `0` accepted;
- explicit `NaN`, `Infinity`, and `-Infinity` rejected;
- empty `limitationNotes` rejected;
- duplicate limitation codes rejected;
- non-canonical casing and whitespace in enum values rejected.

## Current Candidate Implementation Scope

SS-008 remains schema/test-only:

- no metric calculation;
- no runtime UI behavior;
- no export;
- no persistence;
- no remote review;
- no telemetry or remote logging;
- no new dependencies;
- no model/provider/SDK/asset changes;
- no public schema serving.

Candidate artifacts:

- `docs/schemas/swing-metric-payload-v0.1.0.schema.json`
- `src/metric-contract.ts`
- `test/fixtures/metrics/valid-payload.json`
- `test/fixtures/metrics/missing-payload.json`
- `test/fixtures/metrics/low-confidence-payload.json`
- `test/unit/metric-contract.test.ts`

## Focused Audit Questions

Please focus only on:

- whether B1-B4 are fully closed in the revised contract;
- whether the payload-level `caddieSetEquivalence` field is the right
  enforcement mechanism;
- whether the exact prohibited-key list is testable and sufficient for SS-008
  planning;
- whether removing `caddieset-not-equivalent` from limitation codes and using
  only payload-level `caddieSetEquivalence` closes B2 cleanly;
- whether the added edge-case tests close your missing-test concerns; and
- whether Codex may safely move to implementation after this re-review.

Return PASS only if implementation may start. If FAIL, list only blockers that
must be resolved before `3. In Development (ChatGPT)`.
