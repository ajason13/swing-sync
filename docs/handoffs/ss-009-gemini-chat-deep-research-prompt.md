# SS-009 Gemini Chat Deep Research Prompt

Use this in **Gemini Chat Deep Research mode** with the attached files listed
below. Gemini Chat currently allows a maximum of 10 uploaded files, so this
handoff is intentionally capped at 10 attachments and embeds the key context
from omitted files. Do not paste giant file bundles into chat. Attach the files,
paste this steering prompt, and require Gemini to produce a task-specific
research plan before it starts the deep research run.

## Files To Attach (10 Maximum)

Attach exactly these 10 repository files:

- `AGENTS.md`
- `CONTEXT.md`
- `package.json`
- `src/pose-contract.ts`
- `src/phase-review.ts`
- `src/metric-contract.ts`
- `src/frame-processing.ts`
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`
- `docs/licensing.md`

Do not attach additional files unless the maintainer explicitly allows a
second Gemini pass. The omitted prior-story specs and test files are summarized
below and Codex will verify Gemini's conclusions against the repository before
implementation.

## Role

You are Gemini Chat Deep Research supporting Swing Sync story
`SS-009 Implement joint angle and coordinate normalization utilities`.

Your role is research and draft-specification support only. Codex remains the
spec owner and will independently verify important claims, record Adopt /
Revise / Defer / Reject decisions, correct weak assumptions, and decide what
becomes the implementation baseline. Claude remains the independent adversarial
QA planner and final implementation auditor.

## Before Starting Deep Research

First return a concise, task-specific research plan. The plan must mention:

- the attached Swing Sync files you will use;
- primary-source categories you will check;
- how you will separate sourced facts from recommendations;
- how you will identify weak claims, coordinate-system assumptions, and
  maintainer choices; and
- how your final output will map to `SS-TC-013`.

Do not proceed with a generic plan about computer vision, golf coaching, or
biomechanics. If the plan does not directly address SS-009, stop and ask for
corrected context.

## Project Context

Swing Sync is a local-first browser app for educational golf swing analysis.
Current protected behavior:

- Raw swing video is processed locally by default and is not uploaded.
- Remote sharing, model-provider calls, cloud storage, telemetry, remote
  logging, exports, or persistence require separate reviewed stories.
- Current pose processing uses exact `@mediapipe/tasks-vision@0.10.35`,
  approved same-origin model/WASM assets, dedicated worker VIDEO-mode
  inference, and volatile frame/landmark handling.
- Pose results preserve complete normalized and world landmark arrays with
  `x`, `y`, `z`, and `visibility`; do not invent per-landmark `presence`.
- Frame sampling uses an ordered fixed-budget eight-sample integer-millisecond
  grid. Outputs include requested and observed timestamps internally, preview
  bitmaps, and pose results, but SS-009 utilities must not add export,
  persistence, telemetry, remote logging, or public serving.
- Swing phase review currently has the stable ordered phase identifiers:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`.
- Phase review requires explicit user declarations for face-on view,
  handedness, mirrored orientation, and setup confirmation before future
  metrics are ready.
- SS-008 created a metric payload schema and TypeScript validator under
  `src/metric-contract.ts` plus
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`. SS-009 should respect
  that boundary but should not broaden it into export, persistence, public
  schema serving, or user-facing coaching.

Embedded summaries of omitted prior-story artifacts:

- SS-005 protected MediaPipe Pose behavior: exact
  `@mediapipe/tasks-vision@0.10.35`, exact approved same-origin model and WASM
  assets, dedicated worker VIDEO-mode inference, complete returned landmark
  arrays, finite increasing timestamps, volatile transferable `ImageBitmap`
  frames closed after inference, no raw-video/frame/landmark persistence,
  fail-closed unexpected network behavior, no service-worker model caching, and
  sanitized local error codes only.
- SS-006 protected frame queue behavior: fixed budget of 8 ordered samples,
  integer-millisecond requested timestamps, bounded local previews, one
  queued/in-flight inference item, generation-based stale-result rejection,
  cancellation/retry cleanup, volatile outputs, and no diagnostics containing
  frame pixels, landmarks, media characteristics, timestamps, or identifiers.
- SS-007 protected phase-review behavior: stable phase IDs are `address`,
  `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`; future metrics are blocked until the user
  provides face-on view, handedness, mirrored orientation, setup confirmation,
  and valid manual review. Phase evidence states are only
  `unsupported-input` and `review-required`; no numeric phase confidence,
  automatic acceptance, coaching, export, persistence, telemetry, remote review,
  new dependencies, new workers, or new model/provider/assets were approved.
- SS-008 protected metric-schema behavior: schema version is exactly `0.1.0`;
  payloads require `caddieSetEquivalence: "not-equivalent"`; metric fields are
  bounded to metric name, value, units, phase, handedness, confidence, and
  limitation notes; measured values require finite numbers and reviewed
  `right` or `left` handedness; missing/unsupported/not-reviewed values use
  `numericValue: null`; confidence is categorical and non-calibrated
  (`not-calibrated`, `low-evidence`, `unavailable`); metric payloads reject raw
  frames, previews, landmarks, timestamps, media characteristics, filenames,
  identifiers, and unsafe vocabulary; SS-008 added no calculation, export,
  persistence, telemetry, remote logging, remote review, dependencies, public
  serving, or runtime UI behavior.
- SS-008 Codex research disposition adopted zero-dependency TypeScript/manual
  validation, synthetic project-authored fixtures, SS-007 phase linkage, and
  CaddieSet naming inspiration only. It rejected malformed Gemini-generated
  schema examples, schema-validator dependencies, high-confidence terminology,
  public schema hosting, copied CaddieSet code/formulas/datasets/models/media,
  and logging metric values or sensitive derived data.
- Current unit-test style is Vitest with deterministic synthetic inputs.
  Existing tests prefer exact or tolerance-based assertions for small pure
  functions and explicit negative cases for malformed inputs. SS-009 should add
  focused unit tests for geometry utilities only after the Gemini disposition,
  normative spec, and Claude QA planning gate are complete.

Relevant policy boundaries:

- Landmarks, metric values, phase labels, movement patterns, and derived
  measurements are sensitive user data.
- User-facing copy must be educational only and must not imply medical advice,
  injury prevention, professional athletic instruction, diagnosis,
  rehabilitation, guaranteed correctness, guaranteed privacy, or guaranteed
  deletion.
- CaddieSet is listed in the project licensing reference catalog as MIT at the
  time of earlier research. Clean-room concepts are preferred; derivative code,
  data, models, media, metric formulas, or fixtures require separate license
  and notice review. SS-009 may use common geometry and independently authored
  formulas, but must not copy CaddieSet code, data, model weights, media,
  formulas, fixtures, or identifiers.
- Adding a dependency, SDK, model asset, external fixture, provider, worker, or
  reference-derived algorithm requires fresh licensing, privacy, safety,
  provider, network, and compliance review. Prefer no new dependencies.

## Current Story State

Task: `SS-009 Implement joint angle and coordinate normalization utilities`

Branch: `ss-009-angle-utils`

Tracker status: `1. Spec Drafting (Gemini)`

Acceptance criteria:

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

Dedicated acceptance test case:

`SS-TC-013` requires synthetic coordinate fixtures for shoulder angle, spine
angle, knee flex, arm plane, hip rotation proxy, and head displacement;
deterministic coordinate normalization; explicit left/right handedness and
mirrored-coordinate behavior; warnings or missing states for missing,
low-confidence, malformed, duplicated, non-finite, or anatomically insufficient
landmarks; bounded non-coaching warning language; synthetic project-authored
fixtures only; and no export, persistence, telemetry, remote logging, remote
review, SDK/model/provider changes, dependencies, public schema serving, or
worker behavior.

## SS-009 Scope

Research and draft a conservative normative specification for local TypeScript
geometry utilities over pose-landmark-like inputs. Assume SS-009 should define
calculation primitives, warning contracts, and unit tests only unless you
identify a blocker requiring a maintainer decision.

In scope:

- exact utility artifact names and file locations;
- coordinate normalization semantics for normalized and world landmark-like
  points;
- finite-number, landmark-count, visibility, missing-data, and zero-length
  vector validation;
- clean-room formulas for:
  - shoulder angle;
  - spine angle;
  - knee flex;
  - arm plane;
  - hip rotation proxy; and
  - head displacement;
- handedness and mirrored-orientation handling for left and right golfers;
- structured warnings or missing states instead of fabricated numeric metrics;
- deterministic synthetic fixture policy and unit-test cases;
- relationship to the SS-008 metric payload contract without emitting payloads
  unless explicitly accepted in this story;
- privacy, safety, observability, licensing, and future export/transmission
  boundaries.

Out of scope:

- user-facing coaching advice, drills, swing-correction recommendations,
  medical or injury guidance;
- calibration, accuracy validation, biomechanical correctness claims,
  representative side-on/down-the-line validation, benchmark comparison, or
  dataset claims;
- copying CaddieSet formulas, data, code, fixtures, model outputs, media, or
  identifiers;
- export, persistence, remote review, telemetry, remote logging, cloud storage,
  service-worker caching, public schema serving, new model/provider/SDK/assets,
  new workers, or new dependencies.

## Research Questions

Answer these with primary-source support where possible. Clearly separate
sourced facts, repository observations, recommendations, assumptions, weak
claims, and unresolved maintainer decisions.

1. Which MediaPipe Pose landmark indices and coordinate fields should SS-009
   use for shoulders, hips, knees, ankles, elbows, wrists, nose/head proxy, and
   any required centerline points?
2. Should SS-009 prefer normalized image landmarks, world landmarks, or a
   utility input type that can accept either? What differences, limitations,
   and validation requirements matter for 2D angle primitives versus 3D proxy
   calculations?
3. What exact coordinate normalization should be used for face-on swing
   analysis, including origin, axis orientation, handedness, mirrored
   orientation, scale reference, and whether z is preserved, ignored, or treated
   as low-evidence?
4. What clean-room vector formulas should compute shoulder angle, spine angle,
   knee flex, arm plane, hip rotation proxy, and head displacement from
   landmark coordinates?
5. For each metric primitive, which landmarks are required, which phase or
   frame context is required, what units should the primitive return, and what
   conditions make the result unavailable?
6. How should left-handed and right-handed golfers be normalized so equivalent
   body-side concepts use stable names without silently swapping or fabricating
   data?
7. How should mirrored camera declarations affect x-axis normalization and
   lead/trail side selection?
8. What warning codes should SS-009 define for missing landmarks, invalid
   coordinates, low visibility, zero-length vectors, unsupported view,
   undeclared handedness, missing baseline frame, and insufficient evidence?
9. How should utilities avoid fabricated metrics for `NaN`, `Infinity`,
   `null`, absent arrays, partial landmark sets, multiple poses, low visibility,
   coincident points, or anatomically insufficient inputs?
10. What minimum deterministic synthetic coordinate fixtures should unit tests
    include for expected values, handedness mirroring, missing inputs, and edge
    cases?
11. What numeric tolerance strategy is appropriate for tests without implying
    clinical, coaching, or biomechanical accuracy?
12. How should SS-009 relate to `src/metric-contract.ts` and the SS-008 metric
    names, statuses, units, handedness, confidence, and limitation codes?
13. Should SS-009 add or change any observability? If not, document that
    observability is intentionally unchanged. If yes, specify diagnostics that
    cannot leak raw landmarks, metric values, confidence values, limitation
    text, phase labels, handedness, timestamps, media characteristics, or
    identifiers.
14. What privacy/storage/transmission/export boundaries apply to landmark and
    metric primitive instances now and in future stories?
15. What licensing or attribution risks apply to implementing common geometry
    from scratch while using CaddieSet only as naming inspiration?
16. What should SS-009 explicitly defer to future reviewed stories?

## Expected Output

Return a structured report with:

- primary-source findings and links;
- repository-specific observations from the attached files;
- a proposed normative SS-009 implementation specification;
- a proposed utility API shape, warning-code vocabulary, and test matrix;
- explicit Adopt / Revise / Defer / Reject recommendations for Codex to
  disposition;
- unresolved decisions that require maintainer input; and
- a concise list of prohibited claims or behaviors that Claude should audit.

Do not include copied code from external repositories. If you include formulas,
describe them as common vector geometry and cite primary math or MediaPipe
coordinate documentation rather than reference-project source code.
