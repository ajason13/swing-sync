# SS-010 Claude QA Focused Re-Review Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Focused pre-implementation re-review for
`SS-010 Render skeleton-overlaid keyframes`.

Verdict required: Return **PASS** only if B1-B7 from the prior QA planning
review are closed and no new blocker was introduced by the revised
specification. Return **FAIL** if any blocker remains before implementation.

## Context

SS-010 is privacy-, export-, and user-facing rendering-sensitive. It will render
readable skeleton overlays on selected keyframes from existing local
frame-processing output.

Protected boundaries:

- Raw swing video is local-first and not uploaded by default.
- Preview frames, annotated still canvases, landmarks, phase labels, metrics,
  and movement patterns are sensitive user data.
- SS-010 does not approve remote sharing, cloud storage, telemetry, remote
  logging, hosted model APIs, public serving, raw-video export, image downloads,
  canvas serialization, persistence, new dependencies, new workers, model
  changes, or provider changes.
- SS-010 does not approve `canvas.toBlob()`, `canvas.toDataURL()`,
  `URL.createObjectURL()`, downloads, or Object URL lifecycle logic.
- Export reuse is limited to a reusable synchronous render function that draws
  an annotated still into a caller-provided canvas. A future reviewed story may
  decide whether and how to serialize or export rendered images.
- User-facing copy must not imply medical advice, injury prevention,
  rehabilitation, professional coaching, guaranteed correctness, guaranteed
  privacy, guaranteed deletion, anonymity, legal compliance, or regulatory
  compliance.
- No implementation has started.

Current task state:

- Branch: `ss-010-skeleton-overlays`
- Status: `2. QA Planning (Claude)`
- Candidate spec: `docs/ss-010-preimplementation-spec.md`
- QA response: `docs/ss-010-claude-qa-response.md`

Acceptance criteria:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

## Prior QA Findings

Claude returned FAIL with seven blockers:

- B1: `mapNormalizedPoint` did not specify which validation rules it enforces
  versus which belong to the caller.
- B2: warning code precedence was unspecified for landmarks that fail multiple
  checks simultaneously.
- B3: `INSUFFICIENT_CORE_LANDMARKS` and `NO_RENDERABLE_SEGMENTS` interaction
  with `partial` versus `unavailable` status was underdetermined.
- B4: `renderedSegments` and `skippedSegments` counting basis was undefined
  relative to the 18-segment topology.
- B5: accessible label content was unspecified, risking DOM privacy leaks or
  unsupported claims.
- B6: lifecycle ownership of the caller-provided canvas and `ImageBitmap`
  across keyframe switching was unstated.
- B7: switching selected keyframes did not state whether re-rendering was
  required, optional, or cached.

## Applied Spec Changes

### B1/B2: Mapping, validation ownership, and warning precedence

The spec now states:

```text
mapNormalizedPoint is a pure coordinate mapper. It owns only:
- finite-number checks for landmark.x, landmark.y, landmark.z, and landmark.visibility;
- range checks for landmark.x and landmark.y; and
- mapping valid x and y values into CSS pixel coordinates.

mapNormalizedPoint returns undefined if and only if:
- x, y, z, or visibility is not a number or is not finite; or
- x or y is outside [0, 1].

mapNormalizedPoint does not check missing landmark indices and does not apply
the visibility threshold. Missing-index and visibility-threshold checks are
owned by renderPoseOverlayFrame before it calls mapNormalizedPoint.

z is checked only for finite numeric validity because it is part of the
MediaPipe landmark contract; it is never used as a positional coordinate for
SS-010's 2D overlay.
```

Per-landmark validation order is now:

```text
For each landmark index needed by a configured segment, evaluate checks in this
exact order and emit at most one warning code per landmark index:

1. Missing required index or non-object value -> MISSING_LANDMARK.
2. Any of x, y, z, or visibility is not a number or is not finite ->
   NON_FINITE_COORDINATE.
3. x or y is outside [0, 1] -> OUT_OF_FRAME_COORDINATE.
4. visibility < style.minVisibility -> LOW_VISIBILITY.

Warnings are unique in the final warning array. If the same warning code occurs
for multiple landmarks, include it only once at the position where it was first
detected.

Landmark validation order must follow poseOverlaySegments order and segment
endpoint order (start, then end). Core-landmark validation for
INSUFFICIENT_CORE_LANDMARKS must use core landmark order 11, 12, 23, 24, 25,
26, 27, 28 after segment endpoint validation so warning ordering remains
stable.
```

### B3/B4: Status and segment count semantics

The spec now states:

```text
renderedSegments + skippedSegments must always equal poseOverlaySegments.length
(18). Each configured segment is counted exactly once.

A segment is counted as rendered only when both endpoints pass the validation
order above and the segment is drawn.

Any segment with a missing, malformed, out-of-frame, or low-visibility endpoint
is counted as skipped.

If the landmarks array has fewer than 33 entries, indices beyond the array
length are treated as MISSING_LANDMARK and their segments are skipped.

rendered status requires renderedSegments === 18, skippedSegments === 0, and
warnings.length === 0.
```

Status rules are now:

```text
rendered: all 18 configured segments are drawn and warnings is empty.
partial: at least one segment is drawn and warnings is non-empty.
unavailable: no segments can be drawn, fewer than four of the eight core
landmarks are renderable, no pose exists, or the canvas context is unavailable.

Core landmarks are 11, 12, 23, 24, 25, 26, 27, and 28.

NO_RENDERABLE_SEGMENTS and INSUFFICIENT_CORE_LANDMARKS are independent warnings:
- Add NO_RENDERABLE_SEGMENTS when renderedSegments === 0.
- Add INSUFFICIENT_CORE_LANDMARKS when fewer than four core landmarks pass the
  full landmark validation order above, regardless of the segment count.
```

The spec now gives one fixture for each independent branch:

```text
NO_RENDERABLE_SEGMENTS without INSUFFICIENT_CORE_LANDMARKS:
core landmarks 11, 24, 25, and 28 are valid, and every other landmark
referenced by poseOverlaySegments is invalid or missing. This satisfies the
four-core-landmark threshold while leaving every configured segment with at
least one invalid endpoint. This should be unavailable with
NO_RENDERABLE_SEGMENTS.

INSUFFICIENT_CORE_LANDMARKS with at least one renderable segment:
landmarks 11, 13, and 15 are valid so the left arm can render, but only core
landmark 11 is valid among the eight core landmarks. This should be unavailable
with INSUFFICIENT_CORE_LANDMARKS.
```

### B5: Accessible label content

The spec now states:

```text
The visible canvas accessibility label must describe only the selected keyframe
slot or phase label, for example Annotated keyframe: Address.

It must not include handedness, view, mirroring, filenames, timestamps, warning
codes, confidence values, landmark counts, metric readiness, coaching
correctness, or safety/privacy/compliance claims.

Unavailable overlay text and labels must use neutral copy such as Skeleton
overlay unavailable for this keyframe.
```

### B6/B7: Lifecycle, synchronous render, and no caching

The spec now states:

```text
renderPoseOverlayFrame must be synchronous from the caller's perspective. It
must not schedule internal requestAnimationFrame, timer, promise, or microtask
work that can paint after a later keyframe selection.

The renderer never calls close() on frame.preview. ImageBitmap lifecycle
ownership remains with the existing FrameProcessingController.

No caching of rendered canvas output across keyframe selections is required or
permitted in SS-010.

Each keyframe selection must call renderPoseOverlayFrame fresh against the
already retained SampledFrameOutput.preview and normalized landmarks.

The UI should reuse one primary preview canvas for the selected keyframe and
redraw it synchronously on selection changes.

Thumbnail/keyframe controls may use text, existing preview metadata, or
lightweight non-sensitive UI state, but must not cache rendered annotated still
pixels.

Because rendering is synchronous by contract, no stale-selection guard is
required inside the renderer. If implementation introduces any asynchronous
paint path, it must add an explicit active-selection/run-generation guard and
return to Claude QA before implementation continues.
```

### Non-blocking recommendations incorporated

- `z` is finite-checked but not used positionally.
- Skipped segments include missing, malformed, out-of-frame, and
  low-visibility endpoints.
- Joints are drawn after all segment strokes.
- `resolvedStyle.maxDevicePixelRatio` defaults to `2`, is clamped to `[1, 2]`,
  and SS-010 cannot exceed DPR `2`.

## Updated Test Requirements

The spec now requires tests for:

- multi-failure landmark warning precedence;
- truncated landmark arrays;
- `renderedSegments + skippedSegments === 18`;
- exactly four valid core landmarks and exactly three valid core landmarks;
- independent `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS`
  fixtures;
- render operation order including joints after segment strokes;
- exact `2.0` and above-cap `2.5` DPR inputs;
- fresh synchronous render on keyframe switch;
- no additional primary preview canvas elements or cached annotated pixel
  output; and
- accessible label content that omits handedness, view, mirroring, warning
  codes, confidence values, filenames, timestamps, and coaching/correctness
  language.

## Your Focused Review Task

Review only:

- whether B1-B7 are fully closed by the revised contract;
- whether the independent fixture examples for B3 are internally coherent;
- whether the added synchronous/no-cache/bitmap ownership constraints are
  enough to prevent stale canvas paints and ownership ambiguity;
- whether the accessible label rule closes DOM privacy leaks and unsupported
  claims; and
- whether any revised wording introduces a new blocker.

Do not re-open broad implementation scope unless the revised spec creates a new
privacy, safety, export, lifecycle, or testability blocker.

## Required Output

Return:

- PASS/FAIL verdict.
- Remaining blockers, if any, ordered by severity and tied to exact revised
  spec language.
- Non-blocking recommendations, clearly separated from blockers.
- Missing tests or edge cases, if any remain after the updated test matrix.
- Explicit sign-off status: either "QA planning PASS; Codex may move to
  implementation" or "QA planning FAIL; Codex must revise the spec before
  implementation."
