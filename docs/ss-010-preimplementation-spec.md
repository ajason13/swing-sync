# SS-010 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This specification defines the
candidate implementation contract and may be used only after Claude QA planning
returns PASS or blocking findings are resolved.**

## Scope

SS-010 renders readable skeleton overlays on selected keyframes from the
existing local frame-processing output. The feature must preserve the raw-video
local-first boundary and must prepare a reusable annotated-frame render surface
without adding raw-video export, downloads, persistence, remote sharing, or
serialization in this story.

In scope:

- local zero-dependency Canvas 2D rendering for selected sampled keyframes;
- project-authored MediaPipe pose skeleton topology;
- deterministic coordinate mapping from normalized image landmarks to preview
  canvas coordinates;
- visibility and malformed-input warning states;
- mobile-legible review UI for static keyframe previews;
- a render contract that a future reviewed export story can reuse to produce
  annotated stills;
- unit tests with synthetic landmarks and mocked canvas operations;
- Playwright smoke tests for desktop/mobile preview, privacy boundaries, and
  cleanup; and
- documentation of privacy, safety, licensing, and observability boundaries.

Out of scope:

- raw swing video export;
- image download, `HTMLCanvasElement.toBlob()`, `toDataURL()`, `URL.createObjectURL()`,
  or Object URL lifecycle logic;
- remote sharing, cloud storage, telemetry, remote logging, hosted model APIs,
  coach review, public serving, new service-worker caching, or persistence;
- metric payload export or schema expansion;
- user-facing coaching advice, drills, swing-correction recommendations,
  medical or injury guidance;
- calibration, accuracy validation, biomechanical correctness claims,
  representative validation, benchmark comparison, or dataset claims;
- copied third-party drawing utilities, datasets, model outputs, media,
  fixtures, or identifiers;
- new dependencies, SDKs, workers, model assets, or provider changes; and
- real-time overlay rendering during video playback.

## Protected Contracts

SS-010 must preserve:

- SS-005 exact `@mediapipe/tasks-vision@0.10.35`, approved same-origin model and
  WASM assets, dedicated worker inference, complete landmark arrays, volatile
  raw frame/landmark handling, and fail-closed unexpected-network behavior;
- SS-006 fixed-budget ordered sample queue, volatile preview `ImageBitmap`
  outputs, cleanup, cancellation/retry, and exclusion of observed seek
  timestamps from diagnostics, persistence, network transit, and export;
- SS-007 phase vocabulary, explicit face-on/handedness/mirrored/setup
  declarations, manual-review-only readiness, evidence states, and no
  automatic confidence acceptance;
- SS-008 metric schema boundaries and prohibition on raw frames, previews,
  landmarks, timestamps, media characteristics, filenames, identifiers, unsafe
  vocabulary, persistence, telemetry, public serving, or export broadening; and
- SS-009 geometry utility boundaries, including no runtime coaching,
  no metric-payload generation, no export, no persistence, no telemetry, and no
  biomechanical correctness claims.

## Artifact Contract

Create:

- `src/pose-topology.ts`
- `src/pose-renderer.ts`
- `test/unit/pose-renderer.test.ts`

Modify:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`

Do not add a dependency. Do not add external fixtures. Do not add a new worker.

The renderer may import `PoseLandmark` from `src/pose-contract.ts` and
`SampledFrameOutput` from `src/frame-processing.ts`, but core topology and
coordinate helpers must remain testable with synthetic inputs and without a
browser video element.

## Public Renderer Contract

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

`poseOverlaySegments` must contain exactly these 18 segments in this order:

| ID | Start | End |
| --- | ---: | ---: |
| `shoulders` | 11 | 12 |
| `left-upper-arm` | 11 | 13 |
| `left-lower-arm` | 13 | 15 |
| `right-upper-arm` | 12 | 14 |
| `right-lower-arm` | 14 | 16 |
| `left-torso` | 11 | 23 |
| `right-torso` | 12 | 24 |
| `hips` | 23 | 24 |
| `left-upper-leg` | 23 | 25 |
| `left-lower-leg` | 25 | 27 |
| `right-upper-leg` | 24 | 26 |
| `right-lower-leg` | 26 | 28 |
| `left-heel` | 27 | 29 |
| `left-toe` | 27 | 31 |
| `left-foot` | 29 | 31 |
| `right-heel` | 28 | 30 |
| `right-toe` | 28 | 32 |
| `right-foot` | 30 | 32 |

Facial landmarks `0` through `10` must not be drawn in SS-010.

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

Codex may add internal helpers, but tests must exercise the public functions
above or a strictly equivalent public contract approved by Claude QA planning.

## Coordinate Mapping

Use only normalized image landmarks from `PoseFrameResult.landmarks[0]`.

### Function Ownership

`mapNormalizedPoint` is a pure coordinate mapper. It owns only:

- finite-number checks for `landmark.x`, `landmark.y`, `landmark.z`, and
  `landmark.visibility`;
- range checks for `landmark.x` and `landmark.y`; and
- mapping valid `x` and `y` values into CSS pixel coordinates.

`mapNormalizedPoint` returns `undefined` if and only if:

- `x`, `y`, `z`, or `visibility` is not a number or is not finite; or
- `x` or `y` is outside `[0, 1]`.

`mapNormalizedPoint` does not check missing landmark indices and does not apply
the visibility threshold. Missing-index and visibility-threshold checks are
owned by `renderPoseOverlayFrame` before it calls `mapNormalizedPoint`.

`z` is checked only for finite numeric validity because it is part of the
MediaPipe landmark contract; it is never used as a positional coordinate for
SS-010's 2D overlay.

### Mapping Rules

- `landmark.x` maps to `x * canvasCssWidth`.
- `landmark.y` maps to `y * canvasCssHeight`.
- Coordinates are in source-preview image space. Do not apply a handedness or
  mirroring transform in SS-010; transforming overlay coordinates separately
  from the decoded preview risks misalignment.
- Coordinates may be rounded to the nearest CSS pixel for deterministic tests,
  but the renderer must prioritize alignment to the preview bitmap over
  arbitrary anti-aliasing assumptions.

### Landmark Validation And Warning Precedence

For each landmark index needed by a configured segment, evaluate checks in this
exact order and emit at most one warning code per landmark index:

1. Missing required index or non-object value -> `MISSING_LANDMARK`.
2. Any of `x`, `y`, `z`, or `visibility` is not a number or is not finite ->
   `NON_FINITE_COORDINATE`.
3. `x` or `y` is outside `[0, 1]` -> `OUT_OF_FRAME_COORDINATE`.
4. `visibility < style.minVisibility` -> `LOW_VISIBILITY`.

Warnings are unique in the final warning array. If the same warning code occurs
for multiple landmarks, include it only once at the position where it was first
detected.

Landmark validation order must follow `poseOverlaySegments` order and segment
endpoint order (`start`, then `end`). Core-landmark validation for
`INSUFFICIENT_CORE_LANDMARKS` must use core landmark order `11`, `12`, `23`,
`24`, `25`, `26`, `27`, `28` after segment endpoint validation so warning
ordering remains stable.

## Canvas Rendering

Render the preview frame and skeleton into one canvas. This canvas is the
annotated still surface for review and future export reuse.

Rules:

- CSS display dimensions should match the `ImageBitmap` aspect ratio and remain
  responsive in the review layout.
- Backing-store dimensions must use CSS dimensions times an effective DPR.
- Effective DPR is
  `Math.min(window.devicePixelRatio || 1, resolvedStyle.maxDevicePixelRatio)`.
  `resolvedStyle.maxDevicePixelRatio` defaults to `2` and must be clamped to
  the range `[1, 2]`, so SS-010 cannot exceed a DPR cap of `2` even if callers
  pass a larger value.
- The renderer must call `ctx.setTransform(effectiveDpr, 0, 0, effectiveDpr, 0, 0)`
  or equivalent after resizing the backing store so drawing coordinates remain
  CSS pixels.
- Before each render, clear the canvas and draw the preview bitmap.
- Draw skeleton segments with a two-pass stroke:
  - outline pass: dark stroke, rounded caps and joins, wider line;
  - primary pass: light high-visibility stroke, rounded caps and joins.
- Draw joints only for valid endpoints used by at least one rendered segment.
  Draw joints after all segment outline and primary strokes complete so segment
  outlines do not overdraw joint markers.
- The default style should use project colors that are legible against varied
  video backgrounds, but must not claim guaranteed contrast against all pixels.
- If the 2D context is unavailable, return `status: "unavailable"` with
  `CANVAS_UNAVAILABLE`.
- `renderPoseOverlayFrame` must be synchronous from the caller's perspective.
  It must not schedule internal `requestAnimationFrame`, timer, promise, or
  microtask work that can paint after a later keyframe selection.
- The renderer never calls `close()` on `frame.preview`. `ImageBitmap`
  lifecycle ownership remains with the existing `FrameProcessingController`.

Default style:

```ts
const defaultPoseOverlayStyle: PoseOverlayStyle = {
  primaryStroke: "#00e5ff",
  outlineStroke: "#102018",
  primaryLineWidth: 3,
  outlineLineWidth: 7,
  jointRadius: 4,
  minVisibility: 0.5,
  maxDevicePixelRatio: 2
};
```

Mobile CSS may increase line widths through style options when the preview is
below `420px` wide, but must not use viewport-width font scaling.

## Warning And Status Semantics

Warnings must be deterministic, unique, and ordered by first detection.

Segment counts:

- `renderedSegments + skippedSegments` must always equal
  `poseOverlaySegments.length` (`18`).
- Each configured segment is counted exactly once.
- A segment is counted as rendered only when both endpoints pass the validation
  order above and the segment is drawn.
- Any segment with a missing, malformed, out-of-frame, or low-visibility
  endpoint is counted as skipped.
- If the landmarks array has fewer than 33 entries, indices beyond the array
  length are treated as `MISSING_LANDMARK` and their segments are skipped.
- `rendered` status requires `renderedSegments === 18`, `skippedSegments === 0`,
  and `warnings.length === 0`.

Status rules:

- `rendered`: all 18 configured segments are drawn and warnings is empty.
- `partial`: at least one segment is drawn and warnings is non-empty.
- `unavailable`: no segments can be drawn, fewer than four of the eight core
  landmarks are renderable, no pose exists, or the canvas context is
  unavailable.

Core landmarks are `11`, `12`, `23`, `24`, `25`, `26`, `27`, and `28`.

`NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS` are independent
warnings:

- Add `NO_RENDERABLE_SEGMENTS` when `renderedSegments === 0`.
- Add `INSUFFICIENT_CORE_LANDMARKS` when fewer than four core landmarks pass
  the full landmark validation order above, regardless of the segment count.
- Fixture that exercises `NO_RENDERABLE_SEGMENTS` without
  `INSUFFICIENT_CORE_LANDMARKS`: core landmarks `11`, `24`, `25`, and `28` are
  valid, and every other landmark referenced by `poseOverlaySegments` is
  invalid or missing. This satisfies the four-core-landmark threshold while
  leaving every configured segment with at least one invalid endpoint. This
  should be `unavailable` with `NO_RENDERABLE_SEGMENTS`.
- Fixture that exercises `INSUFFICIENT_CORE_LANDMARKS` with at least one
  renderable segment: landmarks `11`, `13`, and `15` are valid so the left arm
  can render, but only core landmark `11` is valid among the eight core
  landmarks. This should be `unavailable` with
  `INSUFFICIENT_CORE_LANDMARKS`.

The renderer must not fabricate geometry. It may draw a partial overlay when
some segments are valid, but unavailable or skipped segments must be reflected
in the result and in bounded UI copy where needed.

User-facing unavailable copy should be neutral, for example:

> Skeleton overlay unavailable for this keyframe.

Do not use blame-oriented or diagnostic text such as "poor lighting detected"
unless a future reviewed story adds evidence and copy for that claim.

## UI Integration Contract

After local frame processing completes, the review step should display selected
keyframes with skeleton overlays when `phaseOutputs.length > 0`.

Minimum UI behavior:

- show an ordered keyframe strip or grid for the eight sampled frames;
- include the phase labels already used by `phaseDefinitions`;
- render the currently selected keyframe as an annotated still canvas;
- allow switching selected keyframes without rerunning pose inference;
- keep mobile preview legible at `390px` width without horizontal page
  overflow;
- expose the canvas as non-interactive visual content with an accessible label;
- keep existing phase declaration and manual phase review controls usable; and
- keep the future export step disabled or placeholder-only in SS-010.

The implementation may render overlays before phase review is confirmed because
SS-010 draws pose evidence only; it must not imply metric readiness, coaching
correctness, or phase certainty.

Keyframe switching and caching:

- No caching of rendered canvas output across keyframe selections is required
  or permitted in SS-010.
- Each keyframe selection must call `renderPoseOverlayFrame` fresh against the
  already retained `SampledFrameOutput.preview` and normalized landmarks.
- The UI should reuse one primary preview canvas for the selected keyframe and
  redraw it synchronously on selection changes.
- Thumbnail/keyframe controls may use text, existing preview metadata, or
  lightweight non-sensitive UI state, but must not cache rendered annotated
  still pixels.
- Because rendering is synchronous by contract, no stale-selection guard is
  required inside the renderer. If implementation introduces any asynchronous
  paint path, it must add an explicit active-selection/run-generation guard and
  return to Claude QA before implementation continues.

Accessible label content:

- The visible canvas accessibility label must describe only the selected
  keyframe slot or phase label, for example
  `Annotated keyframe: Address`.
- It must not include handedness, view, mirroring, filenames, timestamps,
  warning codes, confidence values, landmark counts, metric readiness, coaching
  correctness, or safety/privacy/compliance claims.
- Unavailable overlay text and labels must use neutral copy such as
  `Skeleton overlay unavailable for this keyframe.`

## Export Reuse Boundary

SS-010 satisfies "Export pipeline can reuse rendered frames" by exposing a
reusable render function that draws the preview bitmap and skeleton overlay
into a caller-provided canvas and returns a structured render result.

SS-010 must not:

- call `canvas.toBlob()`;
- call `canvas.toDataURL()`;
- call `URL.createObjectURL()`;
- create downloads;
- persist annotated stills;
- add raw-video export;
- add remote sharing; or
- claim annotated stills are anonymous or non-sensitive.

A future reviewed export story may call the SS-010 renderer and then make an
explicit export/serialization decision with separate privacy, copy, storage,
cleanup, and verification requirements.

## Privacy, Safety, Licensing, And Observability

Privacy:

- Raw video remains local and volatile.
- Preview frames, annotated still canvases, landmarks, and phase labels are
  sensitive user data.
- Do not log, store, upload, serialize, or remotely share preview pixels,
  landmarks, timestamps, filenames, media characteristics, or render outputs.
- Existing object URL cleanup for selected video must remain intact.

Safety and copy:

- User-facing copy must remain educational and bounded.
- Do not add medical, injury, rehabilitation, professional coaching,
  guaranteed correctness, guaranteed privacy, guaranteed deletion, anonymity,
  legal, or compliance claims.

Licensing:

- Use project-authored rendering code only.
- Do not copy MediaPipe demo drawing utilities or third-party skeleton code.
- Do not add dependencies.

Observability:

- Observability is intentionally unchanged in SS-010.
- Do not add logs, analytics, metrics, traces, telemetry, debug payloads,
  storage writes, or console diagnostics.
- Existing sanitized UI status messages may report local render availability,
  but must not include landmarks, timestamps, filenames, media characteristics,
  or identifiers.

## Verification Requirements

Targeted unit tests:

- normalized point mapping maps `{ x: 0.5, y: 0.5 }` to the center of a
  bounded canvas;
- non-finite, missing, low-visibility, and out-of-frame landmarks produce the
  expected warning codes;
- a multi-failure landmark that is non-finite, out-of-frame, and low-visibility
  emits only the highest-precedence warning from the validation order;
- topology exports exactly the 18 expected non-facial segments in order;
- low-visibility endpoints skip only affected segments when enough core
  evidence remains;
- truncated landmark arrays treat indices beyond the array length as
  `MISSING_LANDMARK`;
- `renderedSegments + skippedSegments === 18` for rendered, partial, and
  unavailable results;
- boundary core evidence with exactly four valid core landmarks passes the core
  rule, while exactly three valid core landmarks produces
  `INSUFFICIENT_CORE_LANDMARKS`;
- `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS` each have a
  distinct fixture proving independent behavior;
- no renderable segments or insufficient core landmarks returns
  `status: "unavailable"`;
- render operation order clears canvas, draws preview, then draws outline and
  primary skeleton strokes, then draws joint markers;
- effective DPR is capped at `2`, including exact `2.0` and above-cap `2.5`
  inputs; and
- public renderer functions do not call `toBlob`, `toDataURL`, or
  `URL.createObjectURL`.

Playwright smoke tests:

- after local fixture analysis completes, review shows an annotated keyframe
  canvas and keyframe navigation;
- switching keyframes triggers a fresh synchronous render and does not create
  additional primary preview canvas elements or cached annotated pixel output;
- accessible label text omits handedness, view, mirroring, warning codes,
  confidence values, filenames, timestamps, and coaching/correctness claims;
- mobile viewport `390x844` shows a legible preview without horizontal page
  overflow;
- rendering does not trigger external network requests beyond existing
  same-origin assets and blob URLs already required for local selected video;
- console output does not contain landmarks, world landmarks, media
  characteristics, filenames, or raw render data;
- browser storage remains empty for IndexedDB and Cache API after rendering;
- switching away from analysis releases volatile frame resources through the
  existing controller cleanup; and
- export state remains disabled or placeholder-only with no raw-video or image
  download action.

Required checks before final implementation audit:

- targeted unit tests for `pose-renderer`;
- `npm run test:unit`;
- `npm run test:smoke`;
- `npm run build`;
- `npm run compliance:verify`;
- `npm run privacy:verify`;
- `npm run safety:verify`; and
- `git diff --check`.

## Current Gate

Claude QA planning must review this specification before implementation. Codex
must resolve any blocking QA findings, update this spec as needed, and obtain
Claude QA planning PASS before moving SS-010 to
`3. In Development (ChatGPT)`.
