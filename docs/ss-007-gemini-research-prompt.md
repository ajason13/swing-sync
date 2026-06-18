# SS-007 Gemini Deep Research Prompt

Paste this prompt into Gemini Deep Research before any SS-007 implementation.
Gemini provides research and a proposed specification; Codex must independently
verify and disposition the response before it becomes implementation authority.

## Prompt

You are Gemini in Deep Research mode acting as the research and specification
assistant for Swing Sync, an Apache-2.0, local-first progressive web app for
educational golf swing analysis.

Task: `SS-007 Implement swing phase detector with manual correction`.

Important: You do not have filesystem, Notion, or GitHub access. Treat the
embedded repository context below as authoritative. Use current primary
sources, link every material claim, give source access dates, distinguish
established evidence from provisional golf-domain heuristics, and state
uncertainty rather than guessing. Do not provide implementation code as the
primary deliverable.

## Roles And Implementation Gate

- Gemini researches and drafts the specification.
- Codex independently verifies claims, records Adopt / Revise / Defer / Reject
  decisions, implements only approved scope, verifies, and maintains repository
  and Notion state.
- Claude challenges the proposed specification and QA plan before
  implementation, then performs final adversarial audit and focused re-review.
- SS-007 is safety- and coaching-sensitive runtime work because it converts
  pose landmarks into named golf-swing phases, emits confidence/warnings, and
  gates later metric generation.
- Incorrect labels or overconfident output could mislead users. Biomechanical
  metrics, coaching recommendations, injury prevention, and guaranteed swing
  correctness remain out of scope.
- Do not recommend implementation until phase vocabulary, supported inputs,
  deterministic selection, confidence, ambiguity, correction, provenance,
  lifecycle, fixture, privacy, safety, and QA contracts have explicit answers.

## Current Repository And Tracker State

- Date at handoff: 2026-06-13.
- Current branch: `ss-007-phase-detector`, created from updated `main` commit
  `b261b290dd8bd9e52e99a48ca4b4f3a2226f133a`.
- Latest merged PR:
  https://github.com/ajason13/swing-sync/pull/7
- Latest merge commit:
  `9d937745fe8e446769d6806c21f8e4635bc5ad04`.
- Node 22; Vite 5; TypeScript; Vitest; Playwright.
- Exact approved production dependency:
  `@mediapipe/tasks-vision@0.10.35`.
- SS-007 Notion status: `1. Spec Drafting (Gemini)`.
- SS-007 expected branch: `ss-007-phase-detector`.
- SS-007 Pull Request field: empty.
- `SS-TC-007` is invalid SS-007 coverage. It describes API-backed coaching
  consent and provider/model data-sharing notice.
- Existing `SS-TC-005` broadly covers identifying or correcting eight MVP
  keyframes, but it does not cover confidence, ambiguity, ordering, stale
  results, provenance, fixture policy, or protected queue behavior.
- Dedicated `SS-TC-011` was created for accurate SS-007 acceptance coverage.

## Acceptance Criteria

- Detects the MVP eight swing frames when confidence is sufficient.
- Allows user correction before metric generation.
- Emits low-confidence warnings for ambiguous swings.
- Includes fixture tests for common side-on videos.

## Current Runtime Input Contract

SS-006 produces a volatile ordered array of up to eight sampled outputs:

```ts
interface SampledFrameOutput {
  runGeneration: number;
  index: number;
  requestedTimestampMs: number;
  observedSeekTimestampMs: number;
  preview: ImageBitmap;
  pose: PoseFrameResult;
}
```

The fixed sample budget is eight, but positive videos shorter than eight
milliseconds may produce fewer unique samples. Normal accepted videos produce
eight ordered samples. Each pose result contains:

```ts
interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface PoseFrameResult {
  timestampMs: number;
  landmarks: PoseLandmark[][];
  worldLandmarks: PoseLandmark[][];
  thresholds: {
    minPoseDetectionConfidence: 0.5;
    minPosePresenceConfidence: 0.5;
    minTrackingConfidence: 0.5;
  };
}
```

Important limitations:

- MediaPipe returns complete normalized/world landmark arrays with `x`, `y`,
  `z`, and `visibility`; it does not expose invented per-landmark `presence`.
- Configured detection/presence/tracking thresholds are not per-frame or
  per-phase confidence.
- Requested timestamps and ordering are deterministic for the same accepted
  duration, but decoded pixels, observed seek timestamps, and landmark values
  are not guaranteed identical across browsers/hardware.
- `observedSeekTimestampMs` is informational and is prohibited from
  diagnostics, persistence, network transit, and future export unless a
  separately reviewed story changes that boundary.
- The current approved real-browser fixture is a static, synthetic, faceless
  mannequin in golf address pose. It proves pose extraction only. It is not a
  swing sequence fixture and is not evidence of phase-detection,
  biomechanical, coaching, or golf-validity accuracy.

## Protected SS-005 And SS-006 Boundaries

Preserve SS-005:

- exact `@mediapipe/tasks-vision@0.10.35`;
- approved same-origin model and WASM assets with pinned hashes;
- dedicated worker VIDEO-mode inference;
- complete normalized/world landmark arrays with `x`, `y`, `z`, and
  `visibility`;
- input media timestamps wrapped onto results;
- no invented per-landmark `presence`;
- configured thresholds recorded separately;
- monotonic finite non-negative timestamps;
- local and volatile raw frames and landmarks;
- closed transferred `ImageBitmap` resources;
- revoked video object URLs and worker/task cleanup;
- fail-closed unexpected external requests;
- no telemetry, remote logging, raw-frame persistence, or landmark
  persistence; and
- the existing first-analysis safety acknowledgement.

Preserve SS-006:

- fixed-budget eight-sample integer-millisecond timestamp grid;
- sequential ordered processing with one inference frame in flight;
- ordered output associating requested/observed timestamps, volatile previews,
  and pose results;
- bounded aspect-preserving preview images;
- cancellation, failure, retry, stale-generation rejection, and pending media
  operation disposal;
- complete preview/object URL/PoseSession cleanup;
- local sanitized progress/error/cancel/retry state only;
- no persistence, transit, export, or diagnostics containing frame pixels,
  landmarks, observed timestamps, media characteristics, or identifiers; and
- `observedSeekTimestampMs` excluded from diagnostics, persistence, network
  transit, and future export unless separately reviewed.

Do not recommend replacing or weakening these integrations. Any SDK, model,
asset, provider, production dependency, externally derived algorithm, or
third-party fixture requires fresh licensing, safety, privacy, network,
provider, and compliance review.

## Product, Privacy, Safety, And Scope Boundaries

- Raw swing video, decoded frames, landmarks, derived phase labels,
  confidence, warnings, and corrections remain local, sensitive, volatile,
  and non-persistent.
- Remote APIs, telemetry, remote logging, cloud storage, remote sharing,
  provider calls, service-worker caching, and export are out of scope.
- User-facing wording must describe results as educational observations and
  avoid medical advice, diagnosis, rehabilitation, injury-prevention,
  professional-coaching, guaranteed-accuracy, or guaranteed-correctness
  claims.
- No new production dependency is preferred.
- Biomechanical metric calculation, coaching recommendations, overlays, dense
  or resampled frame analysis, and remote review are out of scope.
- Corrections should select only from the existing ordered SS-006 samples
  unless research demonstrates a blocking reason otherwise. Any resampling
  recommendation must be classified as requiring a separately reviewed story.
- Observability should remain local sanitized lifecycle/error state only.
  Diagnostics must not contain landmarks, phase assignments, confidence
  values, warnings, corrections, timestamps, media characteristics, or user
  identifiers.

## Required Research

Use primary sources where available. For golf phase terminology, include
peer-reviewed or otherwise authoritative domain sources, clearly identify
disagreement or weak evidence, and do not treat a reference implementation as
authority.

Research and propose a specification for:

1. The exact MVP eight named swing frames, their stable machine identifiers,
   user-facing names, definitions, and required temporal order. Explain how
   terms relate to common address, takeaway, backswing, top, downswing,
   impact, follow-through, and finish terminology without pretending universal
   terminology or biomechanical validity.
2. Whether exactly one phase label is assigned to each of the eight existing
   SS-006 samples, whether phases select a subset, and whether repeated or
   missing assignments are ever valid. Reconcile this with the acceptance
   phrase "MVP eight swing frames."
3. A deterministic phase-selection approach from exactly eight ordered pose
   outputs. Compare defensible rule-based/state-machine/optimization approaches
   that require no new model or dependency. Explain what can be deterministic
   without claiming the heuristic is golf-valid.
4. Which normalized and/or world landmarks and derived quantities may be used.
   Address coordinate-system limitations, camera perspective, scale,
   normalization, left/right image orientation, handedness, mirroring, and the
   reliability limits of sparse pose-only evidence without club/ball tracking.
5. A precise supported "common side-on video" input contract. Address full-body
   framing, mostly fixed camera, swing direction, landscape/portrait, camera
   angle tolerance, occlusion, visible hands/feet, club/ball absence, and
   whether left- and right-handed swings are supported or must be manually
   declared.
6. Visibility, missing poses, missing landmarks, multiple poses, low
   visibility, out-of-frame joints, occlusion, jitter, and malformed numeric
   values. Define validation before any phase calculation.
7. Confidence semantics. Separate MediaPipe configured thresholds from any
   phase confidence. Decide whether confidence is per-phase, run-level, or
   both; define what it measures, how it is bounded, how it is computed, and
   what it cannot claim.
8. Thresholds and calibration limits. Explain whether numeric automatic
   acceptance thresholds can be responsibly specified before a representative
   validated dataset exists. Prefer fail-closed manual review if calibration
   evidence is insufficient.
9. Ambiguity behavior for ties, near ties, repeated poses, static/no-swing
   input, missing phases, impossible temporal ordering, insufficient evidence,
   and malformed inputs. Define explicit warning/error representations and
   fail-closed behavior.
10. Manual correction UX before later metric generation. Define exactly what
    users may correct: phase-to-sample association, labels, ordering, or a
    constrained combination. Require accessible keyboard/touch controls,
    useful warnings, and confirmation without implying correctness.
11. Whether correction must select only existing sampled frames. Treat dense
    analysis or resampling as outside SS-007 unless a blocking need and
    protected SS-006-compatible separately reviewed design are established.
12. Correction invariants before exposing later metric readiness: all required
    phases present, unique sample association if required, strict temporal
    order, in-range references, active generation, and explicit user review
    when confidence is insufficient.
13. Immutable detector output versus corrected phase-label state. Define how
    original automatic output, confidence, warnings, corrections, and review
    status remain separate so provenance is not silently overwritten.
14. Cancellation, retry, new-file supersession, stale detector-result
    rejection, stale correction rejection, and cleanup. Phase work must bind
    to the active SS-006 run generation and must not outlive released outputs.
15. Volatile local lifecycle and privacy implications of phase labels,
    confidence, warnings, corrections, and any derived quantities. Define
    release timing and prohibited persistence/transmission/diagnostics.
16. Fixture provenance and licensing. Compare synthetic generated sequences,
    programmatic pose-result fixtures, permissively licensed footage, and
    maintainer-recorded footage with consent. Recommend the minimum
    representative side-on matrix without committing identifiable footage or
    claiming golf validity.
17. Deterministic unit/browser tests that prove contract behavior without
    claiming biomechanical, coaching, injury-prevention, or broad accuracy
    validity. Identify what must use controlled pose-result fixtures versus
    approved browser video fixtures.
18. Accessible user-facing warnings and correction controls, including safe
    educational wording for low confidence, unsupported views, and manual
    review.
19. Whether dedicated `SS-TC-011` is sufficient and how it should be refined.
    Do not claim API-consent-focused `SS-TC-007` as SS-007 coverage.
20. Local observability needed to debug the state machine without exposing
    sensitive phase data. Explicitly recommend whether observability is added,
    intentionally unchanged, or deferred.

## Blocking Questions To Answer Explicitly

- What exactly are the MVP eight swing frames, and what stable identifiers and
  user-facing names are used?
- Does the detector assign one phase label to each of the eight existing
  SS-006 samples, select a subset, or permit repeated/missing assignments?
- What deterministic algorithm or heuristic selects phases from ordered pose
  outputs?
- Which normalized/world landmarks and derived quantities may be used, and how
  are visibility, missing data, handedness, orientation, and jitter handled?
- What input assumptions define a supported common side-on video?
- What does confidence mean? Is it per-phase, run-level, or both? What
  thresholds trigger automatic acceptance versus warnings or fail-closed
  manual review?
- How are ambiguous phases, ties, impossible temporal ordering, insufficient
  evidence, missing poses, and malformed inputs represented?
- What safety limitations and non-coaching wording are shown to users?
- What may a user manually correct: phase-to-sample association, labels,
  ordering, or all of these?
- Must corrections select only existing sampled frames? If not, why is
  resampling required and why should it not be a separate reviewed story?
- Which invariants must corrected phases satisfy before later metric
  generation can proceed?
- How are original detector output, user corrections, confidence, and warnings
  represented without silently overwriting provenance?
- How are stale results/corrections rejected after cancel, retry, new file, or
  supersession?
- How long do phase labels, confidence, warnings, and corrections remain in
  memory, and what persistence/transmission remains prohibited?
- Which fixtures are allowed, how is provenance/license documented, and what
  is the minimum representative side-on matrix?
- How should dedicated `SS-TC-011` be refined into accurate acceptance
  coverage?

## Required Output

Return a self-contained report with:

1. Executive recommendation and explicit GO / NO-GO for implementation.
2. Primary-source evidence table with URLs, access dates, claim supported, and
   evidence limitations.
3. Exact proposed eight-phase vocabulary with stable identifiers,
   user-facing names, definitions, order, and terminology caveats.
4. Supported-input and unsupported-input contract.
5. Deterministic detector input, validation, algorithm, output, and error
   contract.
6. Landmark/derived-quantity selection and handling of visibility, missing
   data, handedness, orientation, jitter, and malformed input.
7. Per-phase/run-level confidence and warning contract, including calibration
   limitations and fail-closed behavior.
8. Ambiguity, ties, missing/impossible phases, static input, and malformed
   input behavior.
9. Manual correction UX, allowed correction surface, validation invariants,
   and metric-readiness gate.
10. Immutable automatic-output and correction-provenance state model.
11. Cancellation, retry, supersession, stale rejection, cleanup, privacy, and
    local observability contract.
12. Fixture provenance/license proposal and minimum representative side-on
    test matrix.
13. Deterministic unit/browser QA plan that avoids unsupported accuracy or
    coaching claims.
14. Accessible safe user-facing wording examples.
15. Recommended refinement for dedicated `SS-TC-011`.
16. A table of broad recommendations labeled Proposed Adopt, Proposed Revise,
    Proposed Defer, or Proposed Reject.
17. A final blocker checklist. Mark every blocking question Resolved, Human
    Decision Required, or Unresolved.

Do not claim that eight sparse samples are sufficient for broad golf-phase
accuracy without evidence. Do not conflate MediaPipe visibility/configuration
thresholds with phase confidence. Do not recommend fabricating confident phase
assignments when evidence is insufficient. Do not recommend new dependencies,
models, providers, assets, reference-derived code, identifiable footage,
resampling, persistence, remote transit, metrics, or coaching without clearly
marking them outside SS-007 and subject to separate review.
