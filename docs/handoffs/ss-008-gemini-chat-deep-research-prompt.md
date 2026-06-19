# SS-008 Gemini Chat Deep Research Prompt

Use this in **Gemini Chat Deep Research mode** with the attached files listed
below. Do not paste giant file bundles into chat. Attach the files, paste this
steering prompt, and require Gemini to produce a task-specific research plan
before it starts the deep research run.

## Files To Attach

Attach these repository files:

- `AGENTS.md`
- `CONTEXT.md`
- `README.md`
- `package.json`
- `src/main.ts`
- `src/workflow.ts`
- `src/phase-review.ts`
- `src/frame-processing.ts`
- `src/pose-contract.ts`
- `docs/ss-005-preimplementation-spec.md`
- `docs/ss-006-preimplementation-spec.md`
- `docs/ss-007-preimplementation-spec.md`
- `docs/ss-007-research-disposition.md`
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`
- `docs/licensing.md`
- `docs/models-licensing.md`
- `test/unit/phase-review.test.ts`
- `test/unit/frame-processing.test.ts`
- `test/unit/pose-contract.test.ts`
- `test/unit/pose-session.test.ts`
- `test/unit/browser-frame-processing.test.ts`
- `test/unit/workflow.test.ts`
- `test/smoke/app.spec.ts`
- `scripts/verify-compliance.js`
- `scripts/verify-safety-terms.js`
- `scripts/verify-privacy-boundaries.js`
- `scripts/verify-production-licenses.js`

## Role

You are Gemini Chat Deep Research supporting Swing Sync story
`SS-008 Define Swing Sync metric JSON schema`.

Your role is research and draft-specification support only. Codex remains the
spec owner and will independently verify important claims, record Adopt /
Revise / Defer / Reject decisions, correct weak assumptions, and decide what
becomes the implementation baseline. Claude remains the independent adversarial
QA planner and final auditor.

## Before Starting Deep Research

First return a concise, task-specific research plan. The plan must mention:

- the attached Swing Sync files you will use;
- primary-source categories you will check;
- how you will separate sourced facts from recommendations;
- how you will identify weak claims, browser-variable behavior, and maintainer
  choices; and
- how your final output will map to `SS-TC-012`.

Do not proceed with a generic plan about JSON schemas or golf metrics. If the
plan does not directly address SS-008, stop and ask for corrected context.

## Project Context

Swing Sync is a local-first browser app for educational golf swing analysis.
Current protected behavior:

- Raw swing video is processed locally by default and is not uploaded.
- Remote sharing, model-provider calls, cloud storage, telemetry, remote
  logging, exports, or persistence require separate reviewed stories.
- Current pose processing uses exact `@mediapipe/tasks-vision@0.10.35`,
  approved same-origin model/WASM assets, dedicated worker VIDEO-mode
  inference, and volatile frame/landmark handling.
- The app preserves complete normalized and world landmark arrays with `x`,
  `y`, `z`, and `visibility`; it must not invent per-landmark `presence`.
- Frame sampling uses an ordered fixed-budget eight-sample integer-millisecond
  grid. Outputs include requested and observed timestamps internally, preview
  bitmaps, and pose results, but downstream metric schema fixtures must not
  copy raw frames, previews, landmarks, timestamps, media characteristics,
  filenames, or user identifiers.
- Swing phase review currently has the stable ordered phase identifiers:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`.
- Phase review requires explicit user declarations for face-on view,
  handedness, mirrored orientation, and setup confirmation.
- Phase evidence states are only `unsupported-input` and `review-required`.
  SS-007 intentionally rejected numeric phase confidence, automatic acceptance,
  metric generation, coaching, export, persistence, telemetry, remote review,
  new dependencies, new workers, and new model/provider/assets.

Relevant policy boundaries:

- Metrics, phase labels, movement patterns, and derived measurements are
  sensitive user data.
- User-facing copy must be educational only and must not imply medical advice,
  injury prevention, professional athletic instruction, diagnosis,
  rehabilitation, guaranteed correctness, guaranteed privacy, or guaranteed
  deletion.
- CaddieSet is listed in the project licensing reference catalog as MIT at the
  time of earlier research. Clean-room concepts are preferred; derivative code,
  data, models, media, metric formulas, or fixtures require separate license
  and notice review. SS-008 may use CaddieSet-inspired naming only with cautious
  attribution and no equivalence, validation, dataset, or method-reuse claims.
- Adding a dependency, schema validator, SDK, model asset, external fixture,
  provider, or reference-derived algorithm requires fresh licensing, privacy,
  safety, provider, network, and compliance review. Prefer no new dependencies.

## Current Story State

Task: `SS-008 Define Swing Sync metric JSON schema`

Branch: `ss-008-metric-schema`

Tracker status: `1. Spec Drafting (Gemini)`

Acceptance criteria:

- Schema includes metric name, value, units, phase, handedness, confidence, and
  limitation notes.
- Aligns naming with CaddieSet-inspired concepts without overclaiming
  equivalence.
- Has fixtures for valid, missing, and low-confidence data.

Dedicated acceptance test case:

`SS-TC-012` requires deterministic schema validation for synthetic valid,
missing-value, and low-confidence fixtures; bounded metric names, phases,
handedness, confidence/quality states, units, and limitation codes; no
fabricated values for missing data; no CaddieSet equivalence claims; no raw
frames, previews, landmarks, requested/observed timestamps, media
characteristics, identifiers, or sensitive diagnostics; and no regression to
protected SS-005/SS-006/SS-007 boundaries.

## SS-008 Scope

Research and draft a conservative normative specification for a metric JSON
schema contract. Assume SS-008 should define schema/types/fixtures/tests only
unless you identify a blocker requiring a maintainer decision.

In scope:

- schema artifact name, file location, and versioning strategy;
- metric object identity and fixed MVP metric-name vocabulary;
- value, unit, missing-value, unsupported, low-confidence, and not-yet-reviewed
  representation;
- linkage to SS-007 phase identifiers and reviewed declarations without
  copying sensitive timestamps, landmarks, previews, frames, or media metadata;
- handedness field semantics, including whether `undeclared` is allowed;
- confidence or quality semantics that do not imply calibrated accuracy;
- stable sanitized limitation-note categories and safe wording;
- CaddieSet-inspired naming boundaries, attribution needs, and prohibited
  equivalence claims;
- synthetic fixture policy for valid, missing, and low-confidence data;
- deterministic schema validation test strategy using project-native
  TypeScript/manual validation unless a dependency is strongly justified;
- privacy, safety, observability, and future export/transmission boundaries.

Out of scope:

- metric calculation;
- coaching advice, drills, swing-correction recommendations, medical or injury
  guidance;
- dense resampling, calibration, accuracy validation, side-on video fixture
  validation, or representative dataset claims;
- export, persistence, remote review, telemetry, remote logging, cloud storage,
  service-worker caching, new model/provider/SDK/assets, new workers, or new
  dependencies.

## Research Questions

Answer these with primary-source support where possible. Clearly separate
sourced facts, repository observations, recommendations, assumptions, weak
claims, and unresolved maintainer decisions.

1. What schema artifact should SS-008 define: JSON Schema file, TypeScript
   literal schema plus manual validator, TypeScript types plus fixture tests, or
   another minimal artifact? What file locations fit the current Vite/
   TypeScript app with no existing schema library?
2. What versioning policy is appropriate for a local JSON contract: schema
   version field, semantic versioning, compatibility rules, and migration
   expectations?
3. What exact fields should every metric object require to satisfy name, value,
   units, phase, handedness, confidence/quality, and limitation-note acceptance
   without fabricating measurements?
4. Should value be a discriminated union such as numeric measured value versus
   missing/unsupported/not-reviewed state? How should units be represented when
   a value is missing?
5. What fixed MVP metric names are safe to include as placeholders or contract
   entries without implying Swing Sync has calculated or validated them?
6. What CaddieSet-inspired names can be referenced, what attribution or license
   review is needed, and what equivalence claims must be prohibited?
7. How should metric phase linkage reference the SS-007 phase vocabulary and
   reviewed provenance without storing timestamps, landmarks, previews, frames,
   media details, or identifiers?
8. How should handedness be represented? Should it be required on each metric,
   inherited from reviewed declarations, allowed as `undeclared`, or represented
   as unavailable when not reviewed?
9. What should `confidence` mean here if numeric calibration is not approved?
   Should SS-008 use categorical quality/evidence states, bounded numeric values
   with explicit non-calibration wording, or both?
10. How should missing, unsupported, low-confidence, ambiguous, or not-yet-
    reviewed values be represented without fabricating numbers?
11. What limitation-note categories and user-facing wording are stable,
    sanitized, local, non-identifying, and non-coaching?
12. What fixture policy should SS-008 use for valid, missing, and low-confidence
    data? What exact fixture contents should be allowed or prohibited?
13. What deterministic validation tests should be required for the schema and
    fixtures, including rejection cases for unknown vocabulary and prohibited
    sensitive fields?
14. What privacy/storage/transmission/export boundaries apply to metric schema
    instances now and in future stories?
15. Should SS-008 add any observability? If not, document that observability is
    intentionally unchanged. If yes, specify diagnostics that cannot leak metric
    values, confidence values, limitation text, phase labels, handedness,
    timestamps, landmarks, media characteristics, or identifiers.
16. What should SS-008 explicitly defer to future reviewed stories?

## Final Output Required

Return a structured report with these sections:

1. **Research Plan Used**: the specific plan you followed.
2. **Primary Sources Checked**: URLs, dates checked, and relevance. Prefer
   official JSON Schema documentation, semantic-versioning guidance, browser
   privacy/storage references if relevant, project-adjacent academic sources for
   CaddieSet/GolfDB terminology, and license/source repositories for CaddieSet.
3. **Repository Observations**: attached-file observations that affect SS-008.
4. **Sourced Facts**: concise statements tied to sources.
5. **Weak Claims And Uncertainties**: browser-variable, source-inferred,
   maintainer-choice, unvalidated, or ambiguous items. Claims such as "no
   blocking unknowns" require narrow proof.
6. **Recommended Schema Contract**: field names, required/optional status,
   allowed vocabularies, value/missing representation, units, phase,
   handedness, confidence/quality, limitations, provenance, and versioning.
7. **Fixture Contract**: valid, missing, and low-confidence fixture examples in
   minimal JSON-like form using synthetic non-identifying data.
8. **Validation And Test Plan**: deterministic tests and rejection cases mapped
   to `SS-TC-012`.
9. **Privacy, Safety, Licensing, And Observability Boundaries**: what is
   allowed, prohibited, and deferred.
10. **CaddieSet Naming Boundary**: what can be referenced, what requires
    attribution/license review, and what must not be claimed.
11. **Blocking Decisions For Codex/Maintainer**: unresolved questions requiring
    human or implementation decision.
12. **Adopt / Revise / Defer / Reject Candidate Table**: broad recommendations
    phrased so Codex can disposition them.

Avoid absolute privacy, safety, legal, deletion, accuracy, injury-prevention, or
professional-coaching claims. Do not recommend copying code, datasets, model
weights, metric formulas, or media from CaddieSet or any reference repository.
