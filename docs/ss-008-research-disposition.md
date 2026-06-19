# SS-008 Research Disposition

Status: **Gemini Chat Deep Research response dispositioned. Implementation
remains blocked pending Claude QA planning PASS.**

Gemini recommended a zero-dependency TypeScript validator, a versioned JSON
payload wrapper, CaddieSet-inspired metric naming, synthetic valid/missing/low
confidence fixtures, and strict privacy/safety boundaries. The response is
research input, not implementation authority.

## Primary-Source And Repository Checks

Checked on 2026-06-18:

- JSON Schema Draft 2020-12 defines JSON Schema as a JSON-based format for
  describing the structure of JSON data, including validation constraints,
  schema dialects, identifiers, `$defs`, and assertion keywords:
  https://json-schema.org/draft/2020-12/json-schema-core and
  https://json-schema.org/draft/2020-12/json-schema-validation
- Semantic Versioning 2.0.0 defines `MAJOR.MINOR.PATCH`; major increments are
  for incompatible API changes, minor for backward-compatible functionality,
  and patch for backward-compatible fixes: https://semver.org/
- GolfDB defines golf swing sequencing and reports a benchmark over eight golf
  swing events, but it uses labeled videos and a learned temporal model rather
  than Swing Sync's eight volatile pose samples:
  https://arxiv.org/abs/1903.06528
- CaddieSet describes a dataset with joint information, ball information, eight
  swing phases, and expert-defined swing-related features. It supports
  inspiration for cautious metric names, not equivalence to Swing Sync's local
  browser pipeline: https://arxiv.org/abs/2508.20491
- The CaddieSet GitHub repository currently shows an MIT license and lists
  dataset fields and feature labels, including face-on and down-the-line views,
  golfer identifiers, ball-flight fields, and multiple joint-derived feature
  names. Swing Sync must not copy dataset data, media, formulas, model weights,
  code, or identifiers: https://github.com/damilab/CaddieSet
- The repository has no JSON Schema validator dependency. `package.json`
  currently uses Vite, TypeScript, Vitest, Playwright, compliance tooling, and
  exact `@mediapipe/tasks-vision@0.10.35`.
- `src/phase-review.ts` defines the approved SS-007 phase vocabulary and
  requires explicit review before future metric readiness.
- `docs/privacy-architecture.md` classifies metrics, phase labels, landmarks,
  and movement patterns as sensitive derived data. Remote sharing/export is not
  approved by default.
- `docs/safety-terms.md` requires educational-only wording and prohibits
  medical, injury-prevention, professional-coaching, diagnosis, rehabilitation,
  and aggressive movement-prescription claims.

## Adopt

- Define a versioned top-level metric payload object rather than a bare metric
  array.
- Use a JSON Schema artifact for documentation/review plus project-native
  TypeScript types and manual validation for runtime tests, with no new
  dependency in SS-008.
- Use a discriminated value object so missing, unsupported, low-confidence, and
  not-yet-reviewed cases cannot fabricate numeric values.
- Keep units populated even when the value is unavailable so consumers know the
  intended unit for a metric slot.
- Keep metric payloads free of raw frames, previews, landmarks, requested or
  observed timestamps, media characteristics, filenames, device/user
  identifiers, local wall-clock times, and performance timings.
- Use synthetic, minimal, project-authored JSON fixtures for valid,
  missing-value, and low-confidence cases.
- Use the SS-007 phase identifiers exactly and reject unknown phase values.
- Treat CaddieSet as naming inspiration only. Retain attribution in
  documentation, but do not claim equivalence to CaddieSet metrics, formulas,
  data, models, validation, or benchmark performance.
- Keep observability unchanged for SS-008. No runtime logs, metrics, traces, or
  diagnostics are needed for a schema/test-only story.

## Revise Before Adoption

- **Schema validity:** Gemini's JSON Schema and fixture blocks were malformed
  and cannot be adopted. SS-008 must produce syntactically valid schema and JSON
  fixtures.
- **Initial version:** use `0.1.0` for the first internal schema contract, not
  `1.0.0`, because the metric API is not stable or production-proven.
- **Artifact location:** keep the schema under `docs/schemas/`, not
  `public/`, because SS-008 does not approve public hosting, export, or
  runtime schema distribution.
- **Metric names:** use a small bounded set of future-compatible contract names
  that are explicitly not calculated by SS-008. Do not claim five baseline
  face-on metrics are already validated.
- **Confidence vocabulary:** replace Gemini's `high`/`low`/`unverified` with a
  non-calibrated status vocabulary that avoids saying any metric is high
  confidence. Low-confidence fixture coverage remains required through a
  `low-evidence` state.
- **Handedness:** allow `undeclared` only for unavailable/not-reviewed metric
  slots. Measured values require reviewed `right` or `left` handedness.
- **Limitation codes:** avoid environmental claims like `LOW_LIGHTING` unless
  the runtime can detect them. Use sanitized evidence/contract limitation codes
  tied to approved SS-005/SS-006/SS-007 boundaries.
- **Privacy language:** replace absolute claims such as "completely destroyed"
  or "absolute firewall" with scoped volatile-state and no-approved-persistence
  rules.
- **Validation language:** tests can provide deterministic evidence for the
  contract; they cannot guarantee "complete correctness across local browser
  executions."
- **Storage language:** do not mention React context; the current app is
  TypeScript/Vite without React.
- **CaddieSet count:** Gemini claimed "exactly 15" CaddieSet features, but the
  current repository README lists more feature labels, including repeated or
  phase-dependent labels. SS-008 should cite CaddieSet as a source of feature
  naming concepts without relying on an exact count.

## Defer

- Metric calculation formulas, thresholds, calibration, and representative
  validation.
- Any public schema hosting, export, persistence, remote review, analytics,
  telemetry, remote logging, provider calls, new SDKs, new model assets, or new
  dependencies.
- CaddieSet-derived formulas, target variables, ball-flight prediction,
  dataset reuse, model reuse, and benchmark comparisons.
- Side-on/down-the-line support beyond SS-007's current face-on declaration
  boundary.
- A schema-validation dependency such as AJV, Zod, Valibot, or TypeBox until a
  future story shows manual validation is insufficient and completes licensing,
  bundle, privacy, and compliance review.

## Reject

- Reject forwarding Gemini's raw report directly to Claude. It contains
  malformed schema/fixture examples, unsupported "absolute" privacy language,
  and implementation details outside the current app architecture.
- Reject adding Zod or any new schema library in SS-008.
- Reject `public/schemas/` placement in SS-008 because it implies a served
  public artifact/export surface that is not accepted.
- Reject `high` confidence terminology for measured metrics.
- Reject any metric payload field for coaching recommendations, corrective
  instructions, injury markers, diagnoses, medical terms, drills, or training
  plans.
- Reject copying CaddieSet code, formulas, datasets, model weights, media, or
  identifiers.
- Reject logging metric values, confidence/evidence states, limitation notes,
  phase labels, handedness, timestamps, landmarks, media characteristics, or
  identifiers.

## Blocking Decision Record

| Question | Codex decision for Claude QA candidate |
| --- | --- |
| Schema artifact and location | Add a reviewable JSON Schema at `docs/schemas/swing-metric-payload-v0.1.0.schema.json`, TypeScript types/validator under `src/metric-contract.ts`, and synthetic fixtures under `test/fixtures/metrics/`. |
| Runtime UI behavior | Out of scope. SS-008 defines schema, validator, fixtures, and tests only. |
| MVP metric names | Use bounded future-compatible names inspired by CaddieSet concepts: `address-stance-ratio`, `top-shoulder-line-angle`, `impact-spine-line-angle`, `finish-balance-line-angle`. They are contract entries, not calculated or validated metrics. |
| Required fields | Every metric object requires `metricName`, `value`, `units`, `phaseId`, `handedness`, `confidence`, and `limitationNotes`. |
| Missing values | `value` is a discriminated object. `measured` requires a finite number; `missing`, `unsupported`, and `not-reviewed` require `numericValue: null`. |
| Units | Units are a bounded enum and remain present even when `numericValue` is null. |
| Confidence semantics | Use non-calibrated categorical evidence: `not-calibrated`, `low-evidence`, and `unavailable`. Do not expose numeric confidence or "high confidence." |
| Phase linkage | Reference only SS-007 `phaseId`, not sample indices, timestamps, landmarks, previews, or generation IDs. |
| Handedness | `right`, `left`, or `undeclared`; measured values require `right` or `left`. |
| Limitation notes | Stable sanitized codes only, with no user identifiers or coaching advice. |
| CaddieSet boundary | Naming inspiration and citation are allowed. Equivalence, formula reuse, dataset reuse, model reuse, and validation claims are prohibited. |
| Validation library | No new dependency; use project-native TypeScript/manual validation plus static JSON fixtures. |
| Fixture contents | Synthetic JSON only; no real-person data, raw landmarks, frames, previews, timestamps, media characteristics, filenames, device/user identifiers, or local times. |
| Privacy/export boundary | Metric payloads remain sensitive local derived data. SS-008 adds no persistence, export, transit, telemetry, remote logging, or public schema serving. |
| Observability | Intentionally unchanged; no new runtime diagnostics. |
| Acceptance coverage | `SS-TC-012` must cover valid, missing, and low-confidence fixtures plus rejection of unknown vocabulary, malformed values, prohibited fields, unsafe wording, and protected-boundary regressions. |

## Implementation Gate

Implementation must not begin until Claude QA planning reviews
`docs/ss-008-preimplementation-spec.md`, confirms the revised contract closes
the risks above, and returns PASS or all blocking findings are addressed.
