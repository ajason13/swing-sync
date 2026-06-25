# SS-010 Research Disposition

Status: **Codex disposition of Gemini Chat Deep Research output.**

SS-010 is privacy-, export-, and user-facing rendering-sensitive. Gemini's
report is useful research input, not authority. Codex verified the important
browser, accessibility, and MediaPipe claims against project context and
primary sources before drafting the candidate specification.

## Primary Sources Checked

- MediaPipe Pose Landmarker for Web: the task outputs pose landmarks in image
  coordinates and world coordinates, and normalized landmark `x` and `y` are
  normalized by image width and height. The result example contains 33
  landmarks per pose.
  <https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js>
- MDN `Window.devicePixelRatio`: DPR is the ratio of physical pixels to CSS
  pixels, and MDN's canvas example sets backing-store dimensions to CSS size
  times DPR, then scales the context.
  <https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio>
- MDN `CanvasRenderingContext2D.scale()`: the Canvas 2D `scale()` transform
  changes canvas units and can scale the drawing coordinate system.
  <https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale>
- WCAG 2.2 SC 1.4.11 Non-text Contrast: graphical objects required to
  understand content should have at least 3:1 contrast against adjacent colors.
  <https://www.w3.org/TR/WCAG22/#non-text-contrast>
- WCAG 2.2 SC 2.5.8 Target Size (Minimum): pointer targets should be at least
  24 by 24 CSS pixels, with listed exceptions. WCAG 2.5.5 AAA uses 44 by 44 CSS
  pixels, which is useful as a conservative touch target goal but not required
  for a non-interactive canvas.
  <https://www.w3.org/TR/WCAG22/#target-size-minimum>
- MDN `HTMLCanvasElement.toBlob()`: `toBlob()` creates a `Blob` representing
  the canvas image, but that file may be cached on disk or stored in memory at
  the user agent's discretion. This contradicts Gemini's claim that canvas
  serialization is strictly memory-only.
  <https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob>
- MDN `URL.createObjectURL()`: object URLs should be released with
  `URL.revokeObjectURL()`, and the API is unavailable in Service Workers due to
  memory-leak potential.
  <https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static>
- MDN `ImageBitmap.close()`: `close()` disposes graphical resources associated
  with an `ImageBitmap`.
  <https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close>

## Disposition Table

| Gemini recommendation | Decision | Codex disposition |
| --- | --- | --- |
| Use a zero-dependency Canvas 2D renderer for skeleton keyframes. | Adopt | Canvas 2D fits existing browser APIs, can draw preview bitmap plus vector skeleton into one annotated still surface, and avoids SVG/DOM node churn and new dependencies. |
| Scale the canvas backing store using `window.devicePixelRatio` and render in CSS-pixel coordinates. | Adopt with cap | Use DPR for readability, but cap the effective DPR at `2` in SS-010 to avoid excessive memory on high-density mobile screens. The cap is a maintainer choice, not a sourced platform rule. |
| Draw a two-pass high-contrast skeleton stroke. | Revise | Use a dark outline plus light inner stroke and rounded caps to improve legibility, but do not claim guaranteed contrast on every possible video background. |
| Exclude facial landmarks 0 through 10 from overlay rendering. | Adopt | Omitting face points reduces visual clutter and avoids emphasizing facial keypoints. The overlay may still include sensitive body movement data and must not be described as anonymous. |
| Render exactly 18 body/foot segments. | Adopt with explicit topology | Use shoulders, arms, torso, hips, legs, and feet segments: 11-12, 11-13, 13-15, 12-14, 14-16, 11-23, 12-24, 23-24, 23-25, 25-27, 24-26, 26-28, 27-29, 27-31, 29-31, 28-30, 28-32, 30-32. |
| Omit segments when either endpoint has visibility below `0.5`. | Adopt | Align with existing `poseThresholds` and SS-009 `MIN_LANDMARK_VISIBILITY`. Missing, malformed, non-finite, out-of-range, or low-visibility endpoints produce skipped segments and bounded warnings. |
| Clear the whole overlay when more than 40% of core joints fail visibility. | Revise | Use a deterministic minimum core-evidence rule instead: overlay status is `unavailable` if fewer than four of eight core joints are renderable or no segments can be drawn. Avoid arbitrary percentage copy and avoid blaming lighting. |
| Apply a mirroring transform based on session configuration. | Reject for SS-010 | Overlay coordinates should map to the source preview pixels. Applying a separate mirroring transform risks misalignment because the preview bitmap already reflects the decoded source frame. Mirroring declarations remain relevant to future metrics, not overlay alignment. |
| Use `toBlob()` and Object URLs as the export-reuse interface. | Reject for SS-010 | `toBlob()` may cache to disk at the browser's discretion, and object URLs require lifecycle management. SS-010 should not serialize annotated stills or create Object URLs. Export reuse is limited to a pure render contract a future reviewed export story can call. |
| Add Blob expiry policy and Object URL cleanup now. | Defer | This belongs to a future explicit image-export story if it approves canvas serialization or downloads. |
| Store rendered frames persistently or cache overlaid bitmaps. | Reject | SS-010 must preserve volatile local-only behavior and must not add IndexedDB, localStorage, Cache API, downloads, persistent history, or raw-video export. |
| Add interactive joint adjustment anchors. | Defer | Calibration and user correction are out of scope. |
| Add real-time skeleton tracking during video playback. | Defer | SS-010 is limited to selected static keyframes. |
| Use MediaPipe drawing utilities or third-party rendering packages. | Reject | No new dependency, SDK, model, asset, provider, or copied reference-derived code is approved. |
| Add memory profiler verification. | Revise | Manual profiler runs are not required for SS-010. Automated tests should cover cleanup, no object URL creation, no storage writes, and no unexpected network requests. |

## Resulting Specification Direction

Codex will draft SS-010 around:

- `src/pose-topology.ts` for project-authored skeleton topology and validation
  helpers;
- `src/pose-renderer.ts` for pure Canvas 2D rendering of an annotated still
  from a `SampledFrameOutput`-like preview bitmap and normalized landmarks;
- UI integration that displays selected sampled keyframes in review state after
  local processing completes;
- a future-export-reuse boundary based on a renderable annotated-frame surface,
  not Blob/Object URL/download serialization;
- unit tests for mapping, topology, warnings, visibility, and canvas operation
  order with synthetic landmarks; and
- Playwright smoke coverage for desktop/mobile legibility, no external network
  requests, no sensitive console/storage output, and no raw-video export UI.

Implementation remains blocked until the candidate specification passes Claude
QA planning.
