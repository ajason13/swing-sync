# SS-010 Claude QA Planning Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Pre-implementation specification review for
`SS-010 Render skeleton-overlaid keyframes`.

Verdict required: Return **PASS** only if the specification is clear enough for
Codex to implement without creating privacy, export, accessibility, lifecycle,
or contract ambiguity. Return **FAIL** if any blocker should be resolved before
implementation.

## Project Context

Swing Sync is a local-first browser app for educational golf swing analysis.
The current implementation:

- processes selected local video with exact approved
  `@mediapipe/tasks-vision@0.10.35`;
- serves MediaPipe model and WASM assets from same-origin project assets;
- runs pose inference in a dedicated worker;
- samples up to eight ordered frames from the selected local video;
- keeps preview `ImageBitmap` frames and pose results in volatile memory;
- releases preview bitmaps through the existing `FrameProcessingController`;
- has phase review states for `address`, `toe-up`, `mid-backswing`, `top`,
  `mid-downswing`, `impact`, `mid-follow-through`, and `finish`;
- requires explicit user declarations for face-on view, handedness, mirrored
  orientation, and setup before future metric readiness; and
- currently adds no raw-video export, image export, remote sharing,
  persistence, telemetry, remote logging, cloud storage, or public serving.

Privacy and safety constraints:

- Raw swing video is local-first and is not uploaded by default.
- Preview frames, annotated still canvases, landmarks, phase labels, metrics,
  and movement patterns are sensitive user data.
- Remote sharing, cloud storage, telemetry, remote logging, hosted model APIs,
  public serving, raw-video export, image downloads, and persistence are not
  approved for SS-010.
- User-facing copy must not imply medical advice, injury prevention,
  rehabilitation, professional coaching, guaranteed correctness, guaranteed
  privacy, guaranteed deletion, anonymity, legal compliance, or regulatory
  compliance.
- Browser-chat prompts must be self-contained; do not assume filesystem or
  GitHub access.

## Story State

Task: `SS-010 Render skeleton-overlaid keyframes`

Branch: `ss-010-skeleton-overlays`

Current tracker status: `2. QA Planning (Claude)` after Codex prepared this
candidate spec.

Acceptance criteria:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Dedicated test case `SS-TC-014` requires:

- readable skeleton overlays on selected keyframes across desktop and mobile;
- privacy-preserving annotated still surfaces reusable by a future export
  pipeline without enabling raw-video export;
- bounded handling for empty, partial, low-confidence, malformed, or
  unavailable landmark/keyframe inputs;
- no remote upload, telemetry, model/provider changes, new dependencies,
  public serving, storage, or sensitive diagnostics; and
- user-facing copy within privacy and safety boundaries.

## Gemini Research Disposition Summary

Codex treated Gemini's report as input, not authority. Key decisions:

- Adopt zero-dependency Canvas 2D rendering.
- Adopt high-DPI backing-store scaling, but cap effective DPR at `2` for
  mobile memory bounds.
- Revise Gemini's "guaranteed contrast" claim: dark outline plus light inner
  stroke improves legibility but must not claim universal contrast against all
  video pixels.
- Adopt excluding facial landmarks `0` through `10`.
- Adopt the 18 non-facial body/foot segments listed below.
- Adopt segment-level visibility gating at `visibility >= 0.5`.
- Revise Gemini's arbitrary "over 40% core joints fail" rule into an explicit
  minimum core-evidence rule.
- Reject a handedness/mirroring transform for overlay coordinates because the
  overlay must align to decoded preview pixels; a separate transform risks
  misalignment.
- Reject `canvas.toBlob()`, `canvas.toDataURL()`, `URL.createObjectURL()`,
  downloads, and Object URL lifecycle logic in SS-010. MDN notes `toBlob()`
  output may be cached on disk or stored in memory at the user agent's
  discretion, so SS-010 keeps export reuse at the render-contract level.
- Defer actual image export serialization to a future reviewed export story.

## Candidate Specification To Audit

SS-010 should create:

- `src/pose-topology.ts`
- `src/pose-renderer.ts`
- `test/unit/pose-renderer.test.ts`

SS-010 should modify:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`

No dependency, external fixture, new worker, model/provider change, public
serving, persistence, telemetry, remote logging, or export/download behavior is
allowed.

### Topology Contract

`src/pose-topology.ts` exports:

```ts
export type PoseOverlayWarningCode =
  | "MISSING_POSE"
  | "MISSING_LANDMARK"
  | "NON_FINITE_COORDINATE"
  | "OUT_OF_FRAME_COORDINATE"
  | "LOW_VISIBILITY"
  | "INSUFFICIENT_CORE_LANDMARKS"
  | "NO_RENDERABLE_SEGMENTS"
  | "CANVAS_UNAVAILABLE";

export interface PoseSegment {
  id: string;
  start: number;
  end: number;
}

export const poseOverlaySegments: readonly PoseSegment[];
```

`poseOverlaySegments` must contain exactly these 18 segments in order:

```text
shoulders: 11-12
left-upper-arm: 11-13
left-lower-arm: 13-15
right-upper-arm: 12-14
right-lower-arm: 14-16
left-torso: 11-23
right-torso: 12-24
hips: 23-24
left-upper-leg: 23-25
left-lower-leg: 25-27
right-upper-leg: 24-26
right-lower-leg: 26-28
left-heel: 27-29
left-toe: 27-31
left-foot: 29-31
right-heel: 28-30
right-toe: 28-32
right-foot: 30-32
```

Facial landmarks `0` through `10` are not drawn in SS-010.

### Renderer Contract

`src/pose-renderer.ts` exports:

```ts
export interface PoseOverlayPoint {
  x: number;
  y: number;
}

export interface PoseOverlayStyle {
  primaryStroke: string;
  outlineStroke: string;
  primaryLineWidth: number;
  outlineLineWidth: number;
  jointRadius: number;
  minVisibility: number;
  maxDevicePixelRatio: number;
}

export type PoseOverlayStatus = "rendered" | "partial" | "unavailable";

export interface PoseOverlayRenderResult {
  status: PoseOverlayStatus;
  renderedSegments: number;
  skippedSegments: number;
  warnings: readonly PoseOverlayWarningCode[];
  width: number;
  height: number;
}

export interface PoseOverlayFrame {
  preview: ImageBitmap;
  landmarks: readonly PoseLandmark[] | undefined;
}

export function mapNormalizedPoint(
  landmark: PoseLandmark,
  bounds: { width: number; height: number }
): PoseOverlayPoint | undefined;

export function renderPoseOverlayFrame(
  canvas: HTMLCanvasElement,
  frame: PoseOverlayFrame,
  style?: Partial<PoseOverlayStyle>
): PoseOverlayRenderResult;
```

Coordinate and validation rules:

- Use only normalized image landmarks from `PoseFrameResult.landmarks[0]`.
- `x` maps to `x * canvasCssWidth`; `y` maps to `y * canvasCssHeight`.
- Do not apply handedness or mirroring transforms for overlay alignment.
- A landmark is valid only when `x`, `y`, `z`, and `visibility` are numbers,
  finite, `x` and `y` are in `[0, 1]`, and `visibility >= 0.5`.
- Missing indices produce `MISSING_LANDMARK`.
- Low visibility produces `LOW_VISIBILITY`.
- Out-of-frame coordinates produce `OUT_OF_FRAME_COORDINATE`.
- Non-finite or non-number fields on an existing landmark produce
  `NON_FINITE_COORDINATE`.
- Warning arrays must be deterministic, unique, and ordered by first
  detection.

Canvas rules:

- Render preview frame and skeleton into one canvas.
- CSS display dimensions match the `ImageBitmap` aspect ratio and remain
  responsive.
- Effective DPR is `Math.min(window.devicePixelRatio || 1, 2)`.
- After backing-store resize, use `ctx.setTransform(effectiveDpr, 0, 0,
  effectiveDpr, 0, 0)` or equivalent.
- Clear the canvas and draw the preview bitmap before drawing the skeleton.
- Draw skeleton with a dark outline stroke and light primary stroke.
- Draw joints only for valid endpoints used by at least one rendered segment.
- If 2D context is unavailable, return `status: "unavailable"` with
  `CANVAS_UNAVAILABLE`.

Status rules:

- `rendered`: every configured segment is drawn and warnings is empty.
- `partial`: at least one segment is drawn and warnings is non-empty.
- `unavailable`: no segments can be drawn, fewer than four of the eight core
  landmarks are renderable, no pose exists, or the canvas context is
  unavailable.
- Core landmarks are `11`, `12`, `23`, `24`, `25`, `26`, `27`, and `28`.
- Unavailable copy should be neutral, e.g. "Skeleton overlay unavailable for
  this keyframe."

### UI Contract

After local frame processing completes, the review step should display selected
keyframes with skeleton overlays when `phaseOutputs.length > 0`.

Minimum UI behavior:

- show an ordered keyframe strip or grid for the eight sampled frames;
- include existing phase labels;
- render the selected keyframe as an annotated still canvas;
- allow switching selected keyframes without rerunning pose inference;
- keep mobile preview legible at `390px` width with no horizontal overflow;
- expose the canvas as non-interactive visual content with an accessible label;
- keep existing phase declaration and manual phase review controls usable; and
- keep the future export step disabled or placeholder-only.

The implementation may show overlays before phase review is confirmed because
it is visual pose evidence only. It must not imply metric readiness, coaching
correctness, or phase certainty.

### Export Reuse Boundary

SS-010 satisfies export reuse by exposing a reusable function that draws the
preview bitmap and skeleton into a caller-provided canvas and returns a render
result.

SS-010 must not:

- call `canvas.toBlob()`;
- call `canvas.toDataURL()`;
- call `URL.createObjectURL()`;
- create downloads;
- persist annotated stills;
- add raw-video export;
- add remote sharing; or
- claim annotated stills are anonymous or non-sensitive.

### Verification Plan

Unit tests should cover:

- normalized point mapping;
- missing, non-finite, low-visibility, and out-of-frame warning codes;
- exact 18-segment topology and no facial segments;
- segment-level skipping with enough remaining core evidence;
- unavailable status for no renderable segments or insufficient core evidence;
- render operation order: clear, draw preview, draw outline, draw primary
  skeleton strokes;
- effective DPR cap at `2`; and
- no calls to `toBlob`, `toDataURL`, or `URL.createObjectURL`.

Playwright smoke tests should cover:

- annotated keyframe canvas and navigation after local fixture analysis;
- mobile viewport `390x844` legibility without horizontal overflow;
- no unexpected external network requests;
- no sensitive console output;
- no IndexedDB or Cache API persistence after rendering;
- existing frame cleanup when leaving analysis; and
- export state remains disabled or placeholder-only.

Required checks before final implementation audit:

- targeted `pose-renderer` unit tests;
- `npm run test:unit`;
- `npm run test:smoke`;
- `npm run build`;
- `npm run compliance:verify`;
- `npm run privacy:verify`;
- `npm run safety:verify`; and
- `git diff --check`.

Observability is intentionally unchanged: no logs, analytics, metrics, traces,
telemetry, debug payloads, storage writes, or console diagnostics.

## Your Review Task

Attack the specification before implementation. In particular, check for:

- ambiguous lifecycle ownership for preview `ImageBitmap` and canvas render
  surfaces;
- privacy leaks through canvas serialization, storage, console output, object
  URLs, DOM attributes, filenames, timestamps, or media characteristics;
- raw-video export or image-export behavior accidentally implied by "export
  reuse";
- inconsistencies between overlay rendering before phase confirmation and the
  phase-review readiness boundary;
- unclear status/warning rules for malformed, partial, or low-visibility
  landmarks;
- coordinate mapping mistakes, including aspect-ratio, DPR, resizing, and
  source-preview alignment;
- whether rejecting a mirroring transform is correct for overlay alignment;
- mobile legibility gaps that are testable pre-implementation;
- accessibility issues with a non-interactive canvas and keyframe controls;
- unsupported claims about privacy, contrast, safety, or correctness;
- missing unit/smoke tests needed for `SS-TC-014`; and
- any file, API, or contract choices that would make Codex implementation
  unsafe or underspecified.

## Required Output

Return:

- PASS/FAIL verdict.
- Blockers ordered by severity, each with a concrete spec change requested.
- Non-blocking recommendations, clearly separated from blockers.
- Missing tests or edge cases.
- Explicit sign-off status: either "QA planning PASS; Codex may move to
  implementation" or "QA planning FAIL; Codex must revise the spec before
  implementation."
