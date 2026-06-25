# SS-010 Gemini Chat Deep Research Prompt

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
- `src/main.ts`
- `src/styles.css`
- `src/workflow.ts`
- `src/pose-session.ts`
- `src/browser-frame-processing.ts`
- `src/pose-contract.ts`
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`

Do not attach additional files unless the maintainer explicitly allows a
second Gemini pass. The omitted prior-story specs and test files are summarized
below. Codex will verify Gemini's conclusions against the repository before
implementation.

## Role

You are Gemini Chat Deep Research supporting Swing Sync story
`SS-010 Render skeleton-overlaid keyframes`.

Your role is research and draft-specification support only. Codex remains the
spec owner and will independently verify important claims, record Adopt /
Revise / Defer / Reject decisions, correct weak assumptions, and decide what
becomes the implementation baseline. Claude remains the independent adversarial
QA planner and final implementation auditor.

## Before Starting Deep Research

First return a concise, task-specific research plan. The plan must mention:

- the attached Swing Sync files you will use;
- primary-source categories you will check;
- how you will separate sourced facts from implementation recommendations;
- how you will evaluate privacy-preserving annotated still output versus raw
  video export;
- how you will evaluate mobile overlay legibility and accessibility; and
- how your final output will map to `SS-TC-014`.

Do not proceed with a generic plan about computer vision, golf coaching, or
video editing. If the plan does not directly address SS-010, stop and ask for
corrected context.

## Project Context

Swing Sync is a local-first browser app for educational golf swing analysis.
Current protected behavior:

- Raw swing video is processed locally by default and is not uploaded.
- Remote sharing, cloud storage, telemetry, remote logging, provider calls,
  persistence, or exports require separate reviewed stories unless explicitly
  accepted for this story.
- Current pose processing uses exact `@mediapipe/tasks-vision@0.10.35`,
  approved same-origin model/WASM assets, dedicated worker VIDEO-mode
  inference, and volatile frame/landmark handling.
- Pose results preserve complete normalized and world landmark arrays with
  `x`, `y`, `z`, and `visibility`; do not invent per-landmark `presence`.
- Frame sampling uses an ordered fixed-budget eight-sample
  integer-millisecond grid. Outputs include requested and observed timestamps
  internally, preview `ImageBitmap` objects, and pose results.
- The frame controller owns preview bitmap cleanup. Any SS-010 rendered frame
  or overlay design must state ownership and cleanup behavior clearly.
- Swing phase review currently has stable ordered phase identifiers:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`.
- Phase review requires explicit user declarations for face-on view,
  handedness, mirrored orientation, and setup confirmation before future
  metrics are ready.
- SS-008 created a metric payload schema and TypeScript validator. SS-010 must
  not broaden metric payload export, persistence, public serving, or remote
  sharing.
- SS-009 created local geometry metric utilities. SS-010 may respect those
  contracts, but it should not create metric payloads, coaching copy, or
  biomechanical correctness claims.

Embedded summaries of omitted prior-story artifacts:

- SS-005 protected MediaPipe Pose behavior: exact
  `@mediapipe/tasks-vision@0.10.35`, exact approved same-origin model and WASM
  assets, dedicated worker VIDEO-mode inference, complete returned landmark
  arrays, finite increasing timestamps, volatile transferable `ImageBitmap`
  frames closed after inference, no raw-video/frame/landmark persistence,
  fail-closed unexpected network behavior, no service-worker model caching, and
  sanitized local error codes only.
- SS-006 protected frame queue behavior: fixed budget of 8 ordered samples,
  integer-millisecond requested timestamps, bounded local previews with long
  edge capped at 640 px, one queued/in-flight inference item,
  generation-based stale-result rejection, cancellation/retry cleanup,
  volatile outputs, and no diagnostics containing frame pixels, landmarks,
  media characteristics, timestamps, or identifiers.
- SS-007 protected phase-review behavior: stable phase IDs are `address`,
  `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`; future metrics are blocked until the user
  provides face-on view, handedness, mirrored orientation, setup confirmation,
  and valid manual review. Phase evidence states are only `unsupported-input`
  and `review-required`; no numeric phase confidence, automatic acceptance,
  coaching, export, persistence, telemetry, remote review, new dependencies,
  new workers, or new model/provider/assets were approved.
- SS-008 protected metric-schema behavior: schema version is exactly `0.1.0`;
  payloads require `caddieSetEquivalence: "not-equivalent"`; metric fields are
  bounded to metric name, value, units, phase, handedness, confidence, and
  limitation notes; payloads reject raw frames, previews, landmarks,
  timestamps, media characteristics, filenames, identifiers, and unsafe
  vocabulary; SS-008 added no calculation, export, persistence, telemetry,
  remote logging, remote review, dependencies, public serving, or runtime UI
  behavior.
- SS-009 protected geometry behavior: local zero-dependency TypeScript
  functions calculate educational metric primitives from pose landmarks and
  return deterministic warnings for invalid inputs. SS-009 added no runtime UI,
  export, persistence, telemetry, remote logging, network behavior, model
  changes, workers, dependencies, or public serving.
- Current unit-test style is Vitest with deterministic synthetic inputs.
  Existing Playwright smoke tests verify local analysis flow, no unexpected
  network requests, no sensitive console/storage output, object URL cleanup,
  accessible phase review, and mobile viewport fit.

Relevant policy boundaries:

- Raw video frames, annotated stills, landmarks, metrics, phase labels,
  movement patterns, and derived measurements are sensitive user data.
- User-facing copy must be educational only and must not imply medical advice,
  injury prevention, professional athletic instruction, diagnosis,
  rehabilitation, guaranteed correctness, guaranteed privacy, guaranteed
  deletion, anonymity, legal compliance, or regulatory compliance.
- Default analytical exports must not include raw swing video. Selected
  keyframes may be exported only if the user explicitly chooses an image export
  in an approved story. If SS-010 prepares export-reusable frame rendering, it
  must stay limited to rendered annotated still surfaces and must not implement
  raw-video export or remote sharing.
- Adding a dependency, SDK, model asset, external fixture, provider, worker, or
  reference-derived algorithm requires fresh licensing, privacy, safety,
  provider, network, and compliance review. Prefer no new dependencies.

## Current Story State

Task: `SS-010 Render skeleton-overlaid keyframes`

Branch: `ss-010-skeleton-overlays`

Tracker status: `1. Spec Drafting (Gemini)`

Acceptance criteria:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Dedicated acceptance test case:

`SS-TC-014` requires readable skeleton overlays on selected keyframes across
desktop and mobile preview; privacy-preserving annotated still surfaces that
can be reused by an export pipeline without enabling raw-video export; bounded
handling for empty, partial, low-confidence, malformed, or unavailable
landmark/keyframe inputs; no remote upload, telemetry, model/provider changes,
new dependencies, public serving, or sensitive diagnostics; and user-facing
copy that stays within privacy and safety boundaries.

## SS-010 Scope

Research and draft a conservative normative specification for rendering
readable skeleton overlays on selected keyframes in the existing local browser
workflow. Assume SS-010 should define rendering contracts, UI states, reusable
annotated-frame boundaries, and tests only unless you identify a blocker
requiring a maintainer decision.

In scope:

- recommended artifact names and file locations;
- whether to render overlays with DOM, CSS, Canvas 2D, SVG, or a small
  zero-dependency helper, with tradeoffs for bitmap keyframes and future export
  reuse;
- landmark-to-preview coordinate mapping for normalized MediaPipe landmarks;
- skeleton topology, joint visibility handling, partial-pose behavior, and
  bounded unavailable/warning states;
- readable overlay styling for desktop and mobile, including stroke width,
  contrast, scaling, line caps, joint markers, and reduced-motion/accessibility
  considerations;
- integration with current `SampledFrameOutput.preview` and pose results
  without adding persistence, raw-video export, remote upload, telemetry, or
  new provider behavior;
- a reusable rendered-frame interface suitable for a future reviewed export
  pipeline while avoiding actual raw-video export in SS-010;
- tests for rendering contract logic, mobile legibility, local-only privacy
  boundaries, cleanup, and no sensitive diagnostics;
- observability decision: likely unchanged or limited to existing sanitized UI
  state, unless you can justify a safer alternative; and
- privacy, safety, accessibility, licensing, and future export boundaries.

Out of scope:

- raw swing video export;
- remote sharing, cloud storage, telemetry, remote logging, hosted model APIs,
  coach review, or public serving;
- persistence/history features;
- metric payload export or schema expansion;
- user-facing coaching advice, drills, swing-correction recommendations,
  medical or injury guidance;
- calibration, accuracy validation, biomechanical correctness claims,
  representative side-on/down-the-line validation, benchmark comparison, or
  dataset claims;
- copying third-party skeleton-rendering code, datasets, model outputs, media,
  fixtures, or identifiers;
- new dependencies, SDKs, workers, model assets, or provider changes unless
  separately reviewed and approved.

## Research Questions

Answer these with primary-source support where possible. Clearly separate
sourced facts, browser/platform constraints, and your recommendations.

1. What is the safest minimal rendering architecture for overlaying a 33-point
   MediaPipe pose skeleton onto existing preview keyframes in a Vite
   TypeScript browser app?
2. For local still-frame rendering and future export reuse, what are the
   tradeoffs between Canvas 2D, SVG, DOM/CSS overlays, and pre-rendered bitmap
   data URLs or blobs?
3. How should normalized `x`/`y` landmarks map onto scaled preview bitmaps,
   including aspect-ratio preservation and high-DPI displays?
4. Which MediaPipe pose landmark connections should be rendered for readable
   golf-swing keyframes, and which points or connections should be omitted to
   reduce clutter on mobile?
5. What visibility and malformed-input thresholds should produce omitted
   joints/segments versus an unavailable overlay state?
6. What overlay styling guidance supports readability on small mobile screens
   and varied video backgrounds without relying on inaccessible color alone?
7. How should rendered annotated stills be represented so a future export
   pipeline can reuse them without exporting raw video or introducing
   persistence in SS-010?
8. What tests should Codex write to verify coordinate mapping, skeleton
   topology, partial/malformed landmark behavior, mobile legibility, cleanup,
   no unexpected network behavior, and no sensitive console/storage output?
9. What user-facing copy is needed, if any, and how should it avoid absolute
   privacy/safety/legal/compliance claims?
10. What implementation choices should be Adopted, Revised, Deferred, or
    Rejected before Codex writes the normative spec?

## Required Output Format

After the task-specific research plan is accepted and the Deep Research run
completes, return:

1. **Executive Recommendation**: the smallest SS-010 implementation shape that
   satisfies the acceptance criteria while preserving protected boundaries.
2. **Primary Sources Checked**: concise citations or source categories for
   browser rendering APIs, MediaPipe landmark topology or coordinate semantics,
   accessibility/mobile readability guidance, and privacy/export constraints.
3. **Proposed Normative Contract**: files, functions/types, UI states, render
   lifecycle, cleanup, privacy boundaries, and future export-reuse boundary.
4. **Test Matrix Mapped To SS-TC-014**: unit and smoke tests with expected
   assertions.
5. **Risk Register**: privacy, export, accessibility, rendering correctness,
   cleanup, browser compatibility, and licensing risks.
6. **Adopt / Revise / Defer / Reject Candidates**: broad recommendations Codex
   can disposition before writing the SS-010 specification.
7. **Open Maintainer Questions**: only questions that truly block a safe
   specification.

Keep recommendations conservative. Do not claim that annotated stills are
anonymous or non-sensitive. Do not recommend raw-video export, remote sharing,
new dependencies, provider changes, new workers, telemetry, persistence, or
public serving unless you clearly mark them out of scope for SS-010.
