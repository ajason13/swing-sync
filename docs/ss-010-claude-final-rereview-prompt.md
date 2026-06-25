# SS-010 Claude Focused Final Re-Review Prompt

Role: You are the lead adversarial implementation auditor for Swing Sync.

Stage: Focused final re-review after Claude final implementation audit FAIL for
`SS-010 Render skeleton-overlaid keyframes`.

Verdict required: Return **PASS** only if B1-B3 below are closed and no new
blockers were introduced by the fixes. Return **FAIL** for any blocker that
must be fixed before PR.

## Story Context

Swing Sync is a local-first browser app for educational golf swing analysis.
SS-010 is privacy-, export-, and user-facing rendering-sensitive.

Acceptance criteria:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Approved SS-010 scope:

- Zero-dependency Canvas 2D renderer for selected static keyframes.
- No new dependencies, SDKs, workers, model/provider changes, external
  fixtures, telemetry, remote logging, persistence, public serving, downloads,
  raw-video export, image export, `toBlob`, `toDataURL`, or Object URL
  creation.
- Export reuse means a synchronous renderer can draw an annotated still into a
  caller-provided canvas for a future reviewed export story.
- Renderer must not close caller-owned `ImageBitmap`; lifetime stays with
  `FrameProcessingController`.
- Accessible label content must not include handedness, view, mirroring,
  filenames, timestamps, warning codes, confidence values, landmark counts,
  metric readiness, coaching correctness, or safety/privacy/compliance claims.
- Observability remains intentionally unchanged: no logs, analytics, metrics,
  traces, telemetry, debug payloads, storage writes, or console diagnostics.

## Prior Audit Findings

Claude final implementation audit returned **FAIL** with three blockers:

- **B1**: `mapNormalizedPoint` and `validateLandmark` duplicated finite/range
  validation. The render path called `classifyLandmark` first, making
  `mapNormalizedPoint`'s validation unreachable from `renderPoseOverlayFrame`
  and leaving a dead fallback that attributed `undefined` to
  `OUT_OF_FRAME_COORDINATE`.
- **B2**: The missing-pose branch hardcoded
  `["MISSING_POSE", "NO_RENDERABLE_SEGMENTS",
  "INSUFFICIENT_CORE_LANDMARKS"]` instead of deriving the latter warnings
  through the standard segment/core logic.
- **B3**: `npm run test:smoke` hung, and the substitute browser evidence did
  not explicitly assert the exact `390x844` viewport,
  `minButtonHeight >= 44`, or single-canvas invariant after keyframe switching.

## Applied Fixes For Review

- Added one coordinate-validation helper:
  `classifyCoordinate(value: PoseLandmark)`.
- `mapNormalizedPoint` now delegates coordinate checks to
  `classifyCoordinate` and otherwise calls `mapValidatedPoint`.
- `classifyLandmark` now owns the full render precedence by checking:
  missing record, `classifyCoordinate`, then visibility.
- `validateLandmark` no longer calls `mapNormalizedPoint`; after
  `classifyLandmark` returns no warning, it calls the non-validating
  `mapValidatedPoint`.
- Removed the missing-pose early return. The no-pose path now adds
  `MISSING_POSE`, uses an empty landmarks array, and lets the normal
  segment/core loops derive `MISSING_LANDMARK`, `NO_RENDERABLE_SEGMENTS`, and
  `INSUFFICIENT_CORE_LANDMARKS`.
- Expanded direct built-preview Chromium evidence with the exact B3 assertions.

## Current Source: `src/pose-renderer.ts`

```ts
import type { PoseLandmark } from "./pose-contract";
import {
  poseOverlayCoreLandmarks,
  poseOverlaySegments,
  type PoseOverlayWarningCode
} from "./pose-topology";

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

interface ValidatedPoint {
  index: number;
  point?: PoseOverlayPoint;
  warning?: PoseOverlayWarningCode;
}

type CoordinateWarningCode = "NON_FINITE_COORDINATE" | "OUT_OF_FRAME_COORDINATE";

const DEFAULT_STYLE: PoseOverlayStyle = {
  primaryStroke: "#00e5ff",
  outlineStroke: "#102018",
  primaryLineWidth: 3,
  outlineLineWidth: 7,
  jointRadius: 4,
  minVisibility: 0.5,
  maxDevicePixelRatio: 2
};

export function mapNormalizedPoint(
  landmark: PoseLandmark,
  bounds: { width: number; height: number }
): PoseOverlayPoint | undefined {
  return classifyCoordinate(landmark) ? undefined : mapValidatedPoint(landmark, bounds);
}

export function renderPoseOverlayFrame(
  canvas: HTMLCanvasElement,
  frame: PoseOverlayFrame,
  style?: Partial<PoseOverlayStyle>
): PoseOverlayRenderResult {
  const resolvedStyle = resolveStyle(style);
  const dimensions = resolveCanvasDimensions(canvas, frame.preview);
  const context = canvas.getContext("2d");
  if (!context) {
    return result("unavailable", 0, poseOverlaySegments.length, ["CANVAS_UNAVAILABLE"], dimensions);
  }

  const effectiveDpr = resolveDevicePixelRatio(resolvedStyle.maxDevicePixelRatio);
  resizeCanvas(canvas, dimensions, effectiveDpr);
  context.setTransform(effectiveDpr, 0, 0, effectiveDpr, 0, 0);
  context.clearRect(0, 0, dimensions.width, dimensions.height);
  context.drawImage(frame.preview, 0, 0, dimensions.width, dimensions.height);

  const collector = new WarningCollector();
  if (!frame.landmarks) collector.add("MISSING_POSE");

  const landmarks = frame.landmarks ?? [];
  const cache = new Map<number, ValidatedPoint>();
  const rendered = [];
  let skippedSegments = 0;

  for (const segment of poseOverlaySegments) {
    const start = validateLandmark(
      segment.start,
      landmarks,
      dimensions,
      resolvedStyle.minVisibility,
      cache,
      collector
    );
    const end = validateLandmark(
      segment.end,
      landmarks,
      dimensions,
      resolvedStyle.minVisibility,
      cache,
      collector
    );

    if (start.point && end.point) {
      rendered.push({ start: start.point, end: end.point });
    } else {
      skippedSegments += 1;
    }
  }

  const renderedSegments = rendered.length;
  const validCore = poseOverlayCoreLandmarks.filter(
    (index) =>
      validateLandmark(
        index,
        landmarks,
        dimensions,
        resolvedStyle.minVisibility,
        cache,
        collector
      ).point
  ).length;

  if (renderedSegments === 0) collector.add("NO_RENDERABLE_SEGMENTS");
  if (validCore < 4) collector.add("INSUFFICIENT_CORE_LANDMARKS");

  drawSegments(context, rendered, resolvedStyle);
  drawJoints(context, rendered, resolvedStyle);

  const warnings = collector.values();
  const status =
    renderedSegments === poseOverlaySegments.length && skippedSegments === 0 && warnings.length === 0
      ? "rendered"
      : renderedSegments === 0 || validCore < 4
        ? "unavailable"
        : "partial";
  return result(status, renderedSegments, skippedSegments, warnings, dimensions);
}

function validateLandmark(
  index: number,
  landmarks: readonly PoseLandmark[],
  bounds: { width: number; height: number },
  minVisibility: number,
  cache: Map<number, ValidatedPoint>,
  collector: WarningCollector
): ValidatedPoint {
  const cached = cache.get(index);
  if (cached) return cached;

  const value = landmarks[index] as unknown;
  const warning = classifyLandmark(value, minVisibility);
  if (warning) {
    collector.add(warning);
    const validated = { index, warning };
    cache.set(index, validated);
    return validated;
  }

  const validated = { index, point: mapValidatedPoint(value as PoseLandmark, bounds) };
  cache.set(index, validated);
  return validated;
}

function classifyLandmark(value: unknown, minVisibility: number): PoseOverlayWarningCode | undefined {
  if (!isLandmarkRecord(value)) return "MISSING_LANDMARK";
  const coordinateWarning = classifyCoordinate(value);
  if (coordinateWarning) return coordinateWarning;
  if (value.visibility < minVisibility) return "LOW_VISIBILITY";
  return undefined;
}

function classifyCoordinate(value: PoseLandmark): CoordinateWarningCode | undefined {
  if (
    typeof value.x !== "number" ||
    typeof value.y !== "number" ||
    typeof value.z !== "number" ||
    typeof value.visibility !== "number" ||
    !Number.isFinite(value.x) ||
    !Number.isFinite(value.y) ||
    !Number.isFinite(value.z) ||
    !Number.isFinite(value.visibility)
  ) {
    return "NON_FINITE_COORDINATE";
  }
  if (value.x < 0 || value.x > 1 || value.y < 0 || value.y > 1) {
    return "OUT_OF_FRAME_COORDINATE";
  }
  return undefined;
}

function mapValidatedPoint(
  landmark: PoseLandmark,
  bounds: { width: number; height: number }
): PoseOverlayPoint {
  return {
    x: Math.round(landmark.x * bounds.width),
    y: Math.round(landmark.y * bounds.height)
  };
}

function resolveStyle(style: Partial<PoseOverlayStyle> | undefined): PoseOverlayStyle {
  const next = { ...DEFAULT_STYLE, ...style };
  return {
    ...next,
    minVisibility: Math.max(0, Math.min(1, next.minVisibility)),
    maxDevicePixelRatio: Math.max(1, Math.min(2, next.maxDevicePixelRatio))
  };
}

function resolveCanvasDimensions(
  canvas: HTMLCanvasElement,
  preview: ImageBitmap
): { width: number; height: number } {
  const rect = canvas.getBoundingClientRect();
  const previewWidth = Math.max(1, Math.round(preview.width));
  const previewHeight = Math.max(1, Math.round(preview.height));
  if (rect.width > 0) {
    const width = Math.round(rect.width);
    return { width, height: Math.max(1, Math.round((width * previewHeight) / previewWidth)) };
  }
  return { width: previewWidth, height: previewHeight };
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  dimensions: { width: number; height: number },
  effectiveDpr: number
): void {
  const backingWidth = Math.max(1, Math.round(dimensions.width * effectiveDpr));
  const backingHeight = Math.max(1, Math.round(dimensions.height * effectiveDpr));
  if (canvas.width !== backingWidth) canvas.width = backingWidth;
  if (canvas.height !== backingHeight) canvas.height = backingHeight;
  canvas.style.width = `${dimensions.width}px`;
  canvas.style.height = `${dimensions.height}px`;
}

function resolveDevicePixelRatio(maxDevicePixelRatio: number): number {
  const dprSource = globalThis as typeof globalThis & { devicePixelRatio?: number };
  const dpr = Number.isFinite(dprSource.devicePixelRatio) ? dprSource.devicePixelRatio : 1;
  return Math.max(1, Math.min(maxDevicePixelRatio, dpr || 1));
}

function isLandmarkRecord(value: unknown): value is PoseLandmark {
  return typeof value === "object" && value !== null;
}

function drawSegments(
  context: CanvasRenderingContext2D,
  segments: readonly { start: PoseOverlayPoint; end: PoseOverlayPoint }[],
  style: PoseOverlayStyle
): void {
  drawSegmentPass(context, segments, style.outlineStroke, style.outlineLineWidth);
  drawSegmentPass(context, segments, style.primaryStroke, style.primaryLineWidth);
}

function drawSegmentPass(
  context: CanvasRenderingContext2D,
  segments: readonly { start: PoseOverlayPoint; end: PoseOverlayPoint }[],
  strokeStyle: string,
  lineWidth: number
): void {
  if (segments.length === 0) return;
  context.beginPath();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  for (const segment of segments) {
    context.moveTo(segment.start.x, segment.start.y);
    context.lineTo(segment.end.x, segment.end.y);
  }
  context.stroke();
}

function drawJoints(
  context: CanvasRenderingContext2D,
  segments: readonly { start: PoseOverlayPoint; end: PoseOverlayPoint }[],
  style: PoseOverlayStyle
): void {
  const points = new Map<string, PoseOverlayPoint>();
  for (const segment of segments) {
    points.set(`${segment.start.x}:${segment.start.y}`, segment.start);
    points.set(`${segment.end.x}:${segment.end.y}`, segment.end);
  }
  if (points.size === 0) return;

  context.fillStyle = style.primaryStroke;
  context.strokeStyle = style.outlineStroke;
  context.lineWidth = Math.max(1, Math.round(style.outlineLineWidth / 2));
  for (const point of points.values()) {
    context.beginPath();
    context.arc(point.x, point.y, style.jointRadius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
}

function result(
  status: PoseOverlayStatus,
  renderedSegments: number,
  skippedSegments: number,
  warnings: readonly PoseOverlayWarningCode[],
  dimensions: { width: number; height: number }
): PoseOverlayRenderResult {
  return {
    status,
    renderedSegments,
    skippedSegments,
    warnings,
    width: dimensions.width,
    height: dimensions.height
  };
}

class WarningCollector {
  private readonly warnings: PoseOverlayWarningCode[] = [];

  add(warning: PoseOverlayWarningCode): void {
    if (!this.warnings.includes(warning)) this.warnings.push(warning);
  }

  values(): readonly PoseOverlayWarningCode[] {
    return this.warnings;
  }
}
```

## Current Test Excerpt: `test/unit/pose-renderer.test.ts`

```ts
it("rejects non-finite and out-of-frame coordinates without checking visibility", () => {
  expect(mapNormalizedPoint(landmark({ x: Number.NaN }), { width: 640, height: 480 })).toBeUndefined();
  expect(mapNormalizedPoint(landmark({ x: 1.1 }), { width: 640, height: 480 })).toBeUndefined();
  expect(mapNormalizedPoint(landmark({ visibility: 0.1 }), { width: 640, height: 480 })).toEqual({
    x: 320,
    y: 240
  });
});

it("uses warning precedence for multi-failure landmarks", () => {
  const result = renderPoseOverlayFrame(canvas(), {
    preview: preview(),
    landmarks: landmarks({ 11: { x: Number.NaN, y: 2, visibility: 0.1 } })
  });

  expect(result.warnings[0]).toBe("NON_FINITE_COORDINATE");
  expect(result.warnings).not.toContain("OUT_OF_FRAME_COORDINATE");
  expect(result.warnings).not.toContain("LOW_VISIBILITY");
});

it("returns unavailable for missing pose and unavailable canvas context", () => {
  expect(
    renderPoseOverlayFrame(canvas(), { preview: preview(), landmarks: undefined })
  ).toMatchObject({
    status: "unavailable",
    renderedSegments: 0,
    skippedSegments: 18,
    warnings: [
      "MISSING_POSE",
      "MISSING_LANDMARK",
      "NO_RENDERABLE_SEGMENTS",
      "INSUFFICIENT_CORE_LANDMARKS"
    ]
  });

  expect(
    renderPoseOverlayFrame(
      { ...canvas(), getContext: vi.fn(() => null) } as unknown as HTMLCanvasElement,
      { preview: preview(), landmarks: landmarks() }
    )
  ).toMatchObject({
    status: "unavailable",
    renderedSegments: 0,
    skippedSegments: 18,
    warnings: ["CANVAS_UNAVAILABLE"]
  });
});
```

## Browser Smoke Evidence

The direct built-preview Chromium check was expanded after B3. It passed with:

```json
{
  "passed": true,
  "viewportWidth": 390,
  "viewportHeight": 844,
  "canvasCount": 1,
  "label": "Annotated keyframe: Top",
  "width": 306,
  "height": 172,
  "rectWidth": 306,
  "rectHeight": 172,
  "hasOverflow": false,
  "minButtonHeight": 48,
  "indexedDb": [],
  "caches": [],
  "forbiddenText": false,
  "externalRequests": 0,
  "sensitiveConsole": 0
}
```

Committed Playwright smoke coverage also includes these assertions in
`test/smoke/app.spec.ts`, but `npm run test:smoke` remains blocked locally by
the Playwright runner hang described in the prior prompt.

## Verification Evidence After Fixes

Passed:

- `npm run test:unit -- pose-renderer`
  - 1 file passed.
  - 12 tests passed.
- `npm run test:unit`
  - 9 files passed.
  - 88 tests passed.
- `npm run build`.
- `npm run compliance:verify`.
- `git diff --check`.
- Expanded direct built-preview Chromium overlay smoke check with the JSON
  evidence above.

## Audit Focus

Please focus on:

- Whether B1 is structurally closed without duplicated finite/range ownership
  or dead warning-attribution fallback paths.
- Whether B2 is structurally closed by deriving no-pose segment/core warnings
  through the standard loops.
- Whether B3 is closed by the expanded executed browser evidence.
- Whether the fixes introduced any new blockers against the approved SS-010
  scope, privacy/export boundaries, accessibility-label constraints, bitmap
  ownership, synchronous rendering, no-caching rule, or observability decision.
