# SS-011 Gemini Chat Deep Research Prompt

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
- `src/metric-contract.ts`
- `src/geometry-metrics.ts`
- `src/pose-renderer.ts`
- `src/pose-contract.ts`
- `docs/privacy-architecture.md`
- `docs/safety-terms.md`

Do not attach additional files unless the maintainer explicitly allows a
second Gemini pass. The omitted prior-story specs and test files are summarized
below. Codex will verify Gemini's conclusions against the repository before
implementation.

## Role

You are Gemini Chat Deep Research supporting Swing Sync story
`SS-011 Generate downloadable Swing Card`.

Your role is research and draft-specification support only. Codex remains the
spec owner and will independently verify important claims, record Adopt /
Revise / Defer / Reject decisions, correct weak assumptions, and decide what
becomes the implementation baseline. Claude remains the independent adversarial
QA planner and final implementation auditor.

## Before Starting Deep Research

First return a concise, task-specific research plan. The plan must mention:

- the attached Swing Sync files you will use;
- primary-source categories you will check;
- how you will separate sourced browser/platform facts from implementation
  recommendations;
- how you will evaluate PNG and PDF export paths without raw-video inclusion;
- how you will evaluate prompt-copy, privacy, safety, and manual LLM upload
  usability boundaries; and
- how your final output will map to `SS-TC-015`.

Do not proceed with a generic plan about golf coaching, computer vision, or
PDF generation libraries. If the plan does not directly address SS-011, stop
and ask for corrected context.

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
- The frame controller owns preview bitmap cleanup. Any Swing Card export must
  define if it consumes existing annotated render surfaces, creates new local
  render surfaces, or copies pixels, and must preserve cleanup ownership.
- Swing phase review currently has stable ordered phase identifiers:
  `address`, `toe-up`, `mid-backswing`, `top`, `mid-downswing`, `impact`,
  `mid-follow-through`, and `finish`.
- Phase review requires explicit user declarations for face-on view,
  handedness, mirrored orientation, and setup confirmation before future
  metrics are ready.
- SS-008 created a metric payload schema and TypeScript validator. SS-011 may
  package bounded metric outputs only if the spec defines how to avoid raw
  frames, landmarks, timestamps, media characteristics, filenames,
  identifiers, unsafe vocabulary, persistence, telemetry, public serving, and
  remote sharing.
- SS-009 created local geometry metric utilities. SS-011 may use metric
  results or unavailable/warning states, but must not claim biomechanical
  correctness, calibration, medical utility, injury prevention, or professional
  coaching equivalence.
- SS-010 created Canvas 2D selected-keyframe skeleton overlays in
  `src/pose-renderer.ts` and `src/pose-topology.ts`. SS-011 should reuse those
  annotated-still boundaries where appropriate and must not add raw-video
  export, remote sharing, persistence, public serving, provider changes, or
  dependency changes unless separately reviewed and approved.

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
- SS-010 protected overlay behavior: selected sampled keyframes render locally
  to one Canvas 2D annotated-still surface with an 18-segment non-facial
  skeleton, deterministic warning/status semantics, DPR capping, mobile
  keyframe controls, no cached annotated pixels across keyframe switches, and
  no serialization, image download, `toBlob`, `toDataURL`, Object URL export
  lifecycle, raw-video export, persistence, remote sharing, telemetry, remote
  logging, dependencies, SDK/model/provider changes, workers, public serving,
  metric payload export, or coaching/correctness claims.
- Current unit-test style is Vitest with deterministic synthetic inputs.
  Existing Playwright smoke tests verify local analysis flow, no unexpected
  network requests, no sensitive console/storage output, object URL cleanup,
  accessible phase review, and mobile viewport fit. Recent local Playwright
  runner behavior has been unreliable, so browser verification may require a
  direct built-preview Chromium script if the runner hangs again.

Relevant policy boundaries:

- Raw video frames, annotated stills, landmarks, metrics, phase labels,
  movement patterns, prompts, and derived measurements are sensitive user data.
- User-facing copy must be educational only and must not imply medical advice,
  injury prevention, rehabilitation, professional athletic instruction,
  diagnosis, guaranteed correctness, guaranteed privacy, guaranteed deletion,
  anonymity, legal compliance, or regulatory compliance.
- Default analytical exports may include selected keyframes only if the user
  explicitly chooses an image export in an approved story. SS-011 is the
  candidate story for a user-initiated Swing Card export, but it still must
  prohibit raw swing video inclusion.
- Do not imply automatic upload to an LLM or any remote service. The accepted
  product boundary is manual upload usability only, after the user controls the
  downloaded file.
- Adding a dependency, SDK, model asset, external fixture, provider, worker, or
  reference-derived algorithm requires fresh licensing, privacy, safety,
  provider, network, and compliance review. Prefer no new dependencies.

## Current Story State

Task: `SS-011 Generate downloadable Swing Card`

Branch: `ss-011-swing-card`

Tracker status: `1. Spec Drafting (Gemini)`

Acceptance criteria:

- Swing Card includes selected keyframes, metrics, warnings, and analysis
  prompt.
- Export works as PNG or PDF.
- No unapproved raw video is included.
- Output remains usable for manual upload to an LLM chat interface.

Dedicated acceptance test case:

`SS-TC-015` requires downloadable Swing Card export coverage for selected
annotated keyframes, bounded metrics, warnings or limitations, and a
manual-LLM-upload analysis prompt; PNG and PDF export paths that are locally
generated, user-initiated downloads; no raw video, hidden identifiers,
telemetry, remote sharing, persistence, unapproved provider behavior, or unsafe
copy; bounded unavailable states for missing keyframes or metrics; and
user-facing text that stays within privacy and safety boundaries.

## SS-011 Scope

Research and draft a conservative normative specification for generating a
downloadable Swing Card from the existing local browser workflow. Assume SS-011
should define a local export contract, content model, UI states, prompt text
boundaries, and tests only unless you identify a blocker requiring a maintainer
decision.

In scope:

- recommended artifact names and file locations;
- a local Swing Card content model containing selected annotated keyframes,
  bounded metrics, warnings or limitations, and analysis-prompt text;
- whether to generate PNG and PDF via existing browser APIs, Canvas 2D,
  print-to-PDF affordances, SVG/HTML composition, or a small zero-dependency
  helper, with explicit tradeoffs;
- user-initiated download behavior and object URL lifecycle if serialization is
  approved by the spec;
- privacy-preserving filename, metadata, prompt, and content boundaries;
- no raw video inclusion in visible card content, hidden metadata, filenames,
  logs, storage, network requests, or remote services;
- manual LLM upload usability, including prompt text that tells the user what
  the card contains and asks for bounded educational analysis without medical,
  injury, professional coaching, guaranteed correctness, or remote-service
  claims;
- handling of missing, unavailable, partial, or low-confidence keyframes,
  metrics, warnings, and declarations;
- tests for export content, PNG/PDF paths, local-only privacy boundaries,
  cleanup, no sensitive diagnostics, and prompt-copy safety;
- observability decision: likely unchanged or limited to existing sanitized UI
  state, unless you can justify a safer alternative; and
- privacy, safety, accessibility, licensing, and future remote-sharing
  boundaries.

Out of scope:

- raw swing video export or embedding;
- automatic LLM upload, remote sharing, cloud storage, telemetry, remote
  logging, hosted model APIs, coach review, or public serving;
- persistence/history features;
- expanding the metric schema beyond approved SS-008 boundaries unless the
  spec identifies a separate reviewed follow-up;
- user-facing coaching advice, drills, swing-correction recommendations,
  medical or injury guidance;
- calibration, accuracy validation, biomechanical correctness claims,
  representative validation, benchmark comparison, or dataset claims;
- copying third-party PDF/image-generation code, datasets, model outputs,
  media, fixtures, logos, or identifiers;
- new dependencies, SDKs, workers, model assets, or provider changes unless
  separately reviewed and approved; and
- any claim that downloaded files remain under Swing Sync control after export.

## Research Questions

Answer these with primary-source support where possible. Clearly separate
sourced facts, browser/platform constraints, and your recommendations.

1. What is the safest minimal local architecture for composing a Swing Card
   from selected annotated stills, bounded metrics, warnings, and prompt text
   in a Vite TypeScript browser app?
2. What browser APIs and constraints matter for PNG export from an annotated
   canvas or composed card surface, including `toBlob`, Object URLs, download
   anchors, cleanup, canvas tainting, and metadata limitations?
3. What browser APIs and constraints matter for PDF export without adding a
   dependency, including `window.print`, print CSS, browser "Save as PDF"
   behavior, canvas/image inclusion, and limitations versus generated PDF
   files?
4. If true generated PDF files require a library, should SS-011 reject or defer
   that path, or is there a zero-dependency alternative that satisfies
   acceptance without unsafe complexity?
5. How should selected keyframes be represented in the export: existing
   SS-010 annotated canvas, newly composed local canvas, HTML print layout, or
   another local surface? What cleanup and stale-selection risks exist?
6. How should metric outputs and warnings be included while preserving SS-008
   vocabulary, SS-009 unavailable/warning semantics, and no raw landmarks,
   timestamps, filenames, media characteristics, or identifiers?
7. What analysis prompt text should the card include for manual upload to an
   LLM chat interface, and what exact constraints should prevent medical,
   injury, professional coaching, guaranteed correctness, privacy, deletion,
   anonymity, legal, or compliance overclaims?
8. What user-facing copy is needed around local download, manual sharing, and
   the user's control after export without implying automatic upload or
   provider behavior?
9. What tests should Codex write to verify selected content inclusion, PNG/PDF
   export behavior, no raw-video inclusion, cleanup, no unexpected network
   behavior, no sensitive console/storage output, prompt-copy safety, and
   mobile/desktop usability?
10. What implementation choices should be Adopted, Revised, Deferred, or
    Rejected before Codex writes the normative spec?

## Required Output Format

After the task-specific research plan is accepted and the Deep Research run
completes, return:

1. **Executive Recommendation**: the smallest SS-011 implementation shape that
   satisfies the acceptance criteria while preserving protected boundaries.
2. **Primary Sources Checked**: concise citations or source categories for
   browser export APIs, Canvas/Blob/Object URL/download behavior, print/PDF
   behavior, accessibility, and privacy/safety copy constraints.
3. **Proposed Normative Specification**: concrete implementation contract with
   files, functions, UI states, content model, prompt text boundaries, export
   paths, cleanup behavior, and test expectations.
4. **Privacy And Safety Boundary Analysis**: explicit no-raw-video,
   no-automatic-upload, no-persistence, no-telemetry, no-remote-sharing, and
   copy-boundary decisions.
5. **PNG/PDF Export Tradeoffs**: whether each path should be generated in-app,
   implemented through browser print/save affordances, deferred, or rejected.
6. **Prompt-Copy Recommendation**: bounded text suitable for manual LLM upload,
   including prohibited claims and fallback wording for missing evidence.
7. **Test Plan Mapped To `SS-TC-015`**: unit, smoke, and manual/browser
   verification recommendations.
8. **Adopt / Revise / Defer / Reject Table**: each broad recommendation in a
   separate row, with rationale and any required Codex verification.
9. **Open Questions For Maintainer**: only questions that block a safe SS-011
   spec. Do not ask generic product questions that can be resolved from the
   attached context.

Keep the recommendation conservative. Do not propose remote model calls,
cloud upload, raw-video export, telemetry, persistent history, new dependencies,
new workers, SDK/model/provider changes, public serving, or unsafe coaching
copy unless you clearly mark them out of scope or reject/defer them.
