# SS-010 Claude QA Planning Response

Status: **Response to Claude QA planning FAIL.**

Claude returned **FAIL** for the first SS-010 QA planning review. Codex accepts
all seven blockers as valid specification gaps. No implementation has started.

## Findings Addressed

### B1 - `mapNormalizedPoint` ownership ambiguity

Accepted. `docs/ss-010-preimplementation-spec.md` now defines
`mapNormalizedPoint` as a pure coordinate mapper that owns finite-number checks,
`x`/`y` range checks, and mapping only. Missing-index and visibility-threshold
checks are owned by `renderPoseOverlayFrame`.

The spec now also states that `z` is checked for finite numeric validity because
it is part of the MediaPipe landmark contract, but `z` is never used as a
positional coordinate for the SS-010 2D overlay.

### B2 - Warning precedence for multi-failure landmarks

Accepted. The spec now defines exact per-landmark validation order and emits at
most one warning per landmark index:

1. missing or non-object -> `MISSING_LANDMARK`;
2. non-number or non-finite `x`, `y`, `z`, or `visibility` ->
   `NON_FINITE_COORDINATE`;
3. `x` or `y` outside `[0, 1]` -> `OUT_OF_FRAME_COORDINATE`;
4. `visibility < style.minVisibility` -> `LOW_VISIBILITY`.

It also defines segment endpoint traversal order and warning uniqueness.

### B3 - Core-evidence and no-segment status interaction

Accepted. The spec now states `NO_RENDERABLE_SEGMENTS` and
`INSUFFICIENT_CORE_LANDMARKS` are independent warning conditions and provides
one concrete fixture for each branch that the other condition would not catch.

### B4 - Segment count basis

Accepted. The spec now requires `renderedSegments + skippedSegments === 18` for
every result, treats truncated landmark arrays as `MISSING_LANDMARK`, and
requires `rendered` status to mean all 18 configured segments are drawn with no
warnings.

### B5 - Accessible label privacy/copy gap

Accepted. The spec now restricts accessible labels to the selected keyframe slot
or phase label only, for example `Annotated keyframe: Address`.

Accessible labels must not include handedness, view, mirroring, filenames,
timestamps, warning codes, confidence values, landmark counts, metric readiness,
coaching correctness, or safety/privacy/compliance claims.

### B6 - Canvas and `ImageBitmap` lifecycle ownership

Accepted. The spec now requires `renderPoseOverlayFrame` to be synchronous from
the caller's perspective, prohibits internal scheduling that could race a later
selection, and states the renderer never calls `close()` on the provided
`ImageBitmap`. Bitmap ownership remains with the existing
`FrameProcessingController`.

### B7 - Re-rendering versus caching on keyframe switch

Accepted. The spec now prohibits rendered canvas-output caching in SS-010. Each
keyframe selection must call `renderPoseOverlayFrame` fresh against retained
`SampledFrameOutput.preview` and landmarks, reusing one primary preview canvas.
Any future asynchronous paint path would require an active-selection or
run-generation guard and a return to Claude QA before implementation continues.

## Non-Blocking Recommendations Addressed

- Clarified that `z` is finite-checked but not used positionally.
- Stated skipped segments include missing, malformed, out-of-frame, and
  low-visibility endpoints.
- Required joint markers to be drawn after all segment strokes.
- Clarified `maxDevicePixelRatio`: default `2`, caller value clamped to
  `[1, 2]`, and SS-010 cannot exceed DPR `2`.

## Test Matrix Updates

The spec now requires additional targeted coverage for:

- multi-failure landmark warning precedence;
- truncated landmark arrays;
- the `renderedSegments + skippedSegments === 18` invariant;
- exact four-core and three-core boundary fixtures;
- independent `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS`
  fixtures;
- exact `2.0` and above-cap `2.5` DPR cases;
- fresh synchronous render on keyframe switch without additional primary
  preview canvases or cached annotated output; and
- accessible label content that excludes orientation, warning, confidence,
  filename, timestamp, and coaching/correctness language.

## Current Gate

Implementation remains blocked. The focused re-review prompt is
`docs/ss-010-claude-qa-rereview-prompt.md`.
