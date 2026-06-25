> Superseded after Claude returned final audit FAIL. Do not paste this prompt
> for re-review. Use
> `docs/ss-010-claude-final-rereview-prompt.md` instead.

# SS-010 Claude Final Implementation Audit Prompt

Role: You are the lead adversarial implementation auditor for Swing Sync.

Stage: Final implementation audit for
`SS-010 Render skeleton-overlaid keyframes`.

Verdict required: Return **PASS** only if the implementation satisfies SS-010
acceptance criteria and preserves the approved privacy/export/safety
boundaries. Return **FAIL** for any blocker that must be fixed before PR.

## Story Context

Swing Sync is a local-first browser app for educational golf swing analysis.
SS-010 is privacy-, export-, and user-facing rendering-sensitive.

Acceptance criteria:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Approved implementation scope:

- Zero-dependency Canvas 2D renderer for selected static keyframes.
- No new dependencies, SDKs, workers, model/provider changes, external
  fixtures, telemetry, remote logging, persistence, public serving, downloads,
  raw-video export, image export, `toBlob`, `toDataURL`, or Object URL creation.
- Export reuse means a synchronous renderer can draw an annotated still into a
  caller-provided canvas for a future reviewed export story.
- Renderer must not close the caller-owned `ImageBitmap`; lifetime stays with
  `FrameProcessingController`.
- Accessible label content must not include handedness, view, mirroring,
  filenames, timestamps, warning codes, confidence values, landmark counts,
  metric readiness, coaching correctness, or safety/privacy/compliance claims.
- Observability remains intentionally unchanged: no logs, analytics, metrics,
  traces, telemetry, debug payloads, storage writes, or console diagnostics.

Claude QA planning history:

- Initial QA planning returned FAIL with B1-B7 around validation ownership,
  warning precedence, status semantics, segment counts, accessible labels,
  canvas/bitmap lifecycle, and keyframe caching.
- Codex revised `docs/ss-010-preimplementation-spec.md` and prepared
  `docs/ss-010-claude-qa-rereview-prompt.md`.
- Focused QA re-review returned PASS: B1-B7 closed, no new blockers, and Claude
  signed off that Codex may move to implementation.

## Implementation Summary

Created:

- `src/pose-topology.ts`
- `src/pose-renderer.ts`
- `test/unit/pose-renderer.test.ts`

Modified:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`
- `CONTEXT.md`

Implementation behavior:

- Review state renders one selected annotated keyframe canvas after local frame
  processing completes.
- Keyframe buttons switch the selected phase slot and synchronously redraw the
  same primary canvas; no annotated-pixel caching is added.
- Renderer draws the `ImageBitmap` preview and a two-pass skeleton overlay into
  the caller-provided canvas.
- Renderer returns deterministic status, segment counts, and warnings.
- Renderer checks DPR with a hard cap of `2`.
- Renderer does not call `close()` on the preview bitmap and does not call
  `toBlob`, `toDataURL`, or `URL.createObjectURL`.
- Export state remains placeholder/disabled.

## Verification Evidence

Passed:

- `npm run test:unit`:
  - 9 files passed.
  - 88 tests passed.
- `npm run build`.
- `npm run compliance:verify`.
- `git diff --check`.
- Direct built-preview Chromium overlay smoke check:
  - built preview server served `dist`;
  - selected local fixture video;
  - waited for local inference and opened review;
  - switched keyframe selection to `Top`;
  - asserted one canvas, label `Annotated keyframe: Top`, positive canvas
    backing dimensions, mobile rect greater than `300x160`, no horizontal
    overflow, no IndexedDB or Cache API storage, no external requests, no
    sensitive console logs matching landmarks/worldLandmarks/media
    characteristics/filename, and no forbidden text matching download/raw video
    export/anonymous/guaranteed.

Not completed:

- `npm run test:smoke` was attempted in sandboxed and escalated modes but hung
  before emitting Playwright test progress. `node_modules/.bin/playwright test
  --list --no-deps` also hung, including after temporarily removing the new
  smoke blocks, so this appears to be a Playwright runner/environment issue
  rather than an SS-010 test failure. A direct built-preview Chromium script was
  used as browser verification evidence instead.

## Source: `src/pose-topology.ts`

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

export const poseOverlaySegments = [
  { id: "shoulders", start: 11, end: 12 },
  { id: "left-upper-arm", start: 11, end: 13 },
  { id: "left-lower-arm", start: 13, end: 15 },
  { id: "right-upper-arm", start: 12, end: 14 },
  { id: "right-lower-arm", start: 14, end: 16 },
  { id: "left-torso", start: 11, end: 23 },
  { id: "right-torso", start: 12, end: 24 },
  { id: "hips", start: 23, end: 24 },
  { id: "left-upper-leg", start: 23, end: 25 },
  { id: "left-lower-leg", start: 25, end: 27 },
  { id: "right-upper-leg", start: 24, end: 26 },
  { id: "right-lower-leg", start: 26, end: 28 },
  { id: "left-heel", start: 27, end: 29 },
  { id: "left-toe", start: 27, end: 31 },
  { id: "left-foot", start: 29, end: 31 },
  { id: "right-heel", start: 28, end: 30 },
  { id: "right-toe", start: 28, end: 32 },
  { id: "right-foot", start: 30, end: 32 }
] as const satisfies readonly PoseSegment[];

export const poseOverlayCoreLandmarks = [11, 12, 23, 24, 25, 26, 27, 28] as const;
```

## Source: `src/pose-renderer.ts`

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
  if (
    !Number.isFinite(landmark.x) ||
    !Number.isFinite(landmark.y) ||
    !Number.isFinite(landmark.z) ||
    !Number.isFinite(landmark.visibility) ||
    landmark.x < 0 ||
    landmark.x > 1 ||
    landmark.y < 0 ||
    landmark.y > 1
  ) {
    return undefined;
  }

  return {
    x: Math.round(landmark.x * bounds.width),
    y: Math.round(landmark.y * bounds.height)
  };
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

  if (!frame.landmarks) {
    return result(
      "unavailable",
      0,
      poseOverlaySegments.length,
      ["MISSING_POSE", "NO_RENDERABLE_SEGMENTS", "INSUFFICIENT_CORE_LANDMARKS"],
      dimensions
    );
  }

  const landmarks = frame.landmarks;
  const collector = new WarningCollector();
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

  const point = mapNormalizedPoint(value as PoseLandmark, bounds);
  const validated = point ? { index, point } : { index, warning: "OUT_OF_FRAME_COORDINATE" as const };
  if (!point) collector.add("OUT_OF_FRAME_COORDINATE");
  cache.set(index, validated);
  return validated;
}

function classifyLandmark(value: unknown, minVisibility: number): PoseOverlayWarningCode | undefined {
  if (!isLandmarkRecord(value)) return "MISSING_LANDMARK";
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
  if (value.visibility < minVisibility) return "LOW_VISIBILITY";
  return undefined;
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

## Unit Test Coverage

`test/unit/pose-renderer.test.ts` covers:

- exact 18-segment non-facial topology;
- normalized coordinate mapping and visibility-independent mapper behavior;
- render operation order and `ImageBitmap` ownership;
- DPR cap at exact `2` and above-cap `2.5`;
- multi-failure warning precedence;
- skipped segment count and `renderedSegments + skippedSegments === 18`;
- truncated landmark arrays;
- core-landmark boundary behavior;
- independent `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS`;
- missing pose and unavailable canvas context; and
- no calls to `toBlob`, `toDataURL`, or `URL.createObjectURL`.

## Focused UI/Smoke Diff

```diff
diff --git a/src/main.ts b/src/main.ts
@@
+import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";
+let selectedKeyframeIndex = 0;
+let latestOverlayResult: PoseOverlayRenderResult | undefined;
+      ${renderKeyframeOverlayReview()}
+function renderKeyframeOverlayReview(): string {
+  const selectedOutput = phaseOutputs[selectedKeyframeIndex] ?? phaseOutputs[0];
+  const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
+  const overlayStatus =
+    latestOverlayResult?.status === "unavailable"
+      ? "Skeleton overlay unavailable for this keyframe."
+      : latestOverlayResult?.status === "partial"
+        ? "Skeleton overlay partially available for this keyframe."
+        : "Skeleton overlay rendered for this keyframe.";
+  return `
+    <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
+      <div class="keyframe-review__heading">
+        <div>
+          <p class="placeholder-kicker">Annotated keyframes</p>
+          <h3 id="keyframe-review-heading">${selectedPhase.label}</h3>
+        </div>
+        <span class="stage-status">Annotated still</span>
+      </div>
+      <div class="keyframe-canvas-wrap">
+        <canvas class="keyframe-canvas" data-keyframe-canvas aria-label="Annotated keyframe: ${selectedPhase.label}"></canvas>
+      </div>
+      <p class="action-note" data-overlay-status>${overlayStatus}</p>
+      <div class="keyframe-strip" aria-label="Select keyframe">
+        ${phaseDefinitions
+          .map((phase, index) => {
+            const isSelected = selectedKeyframeIndex === index;
+            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" aria-pressed="${isSelected ? "true" : "false"}">
+              <span>${index + 1}</span>
+              <strong>${phase.label}</strong>
+            </button>`;
+          })
+          .join("")}
+      </div>
+    </section>
+  `;
+}
+  renderSelectedKeyframeCanvas();
+  document.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
+    button.addEventListener("click", () => {
+      selectedKeyframeIndex = Number(button.dataset.keyframeIndex);
+      latestOverlayResult = undefined;
+      renderApp();
+    });
+  });
+    selectedKeyframeIndex = 0;
+  selectedKeyframeIndex = 0;
+  latestOverlayResult = undefined;
+function renderSelectedKeyframeCanvas(): void {
+  const canvas = document.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
+  if (!canvas || phaseOutputs.length === 0) return;
+  const output = phaseOutputs[selectedKeyframeIndex] ?? phaseOutputs[0];
+  const status = document.querySelector<HTMLElement>("[data-overlay-status]");
+  const result = renderPoseOverlayFrame(canvas, {
+    preview: output.preview,
+    landmarks: output.pose.landmarks[0]
+  });
+  latestOverlayResult = result;
+  if (status) {
+    status.textContent =
+      result.status === "unavailable"
+        ? "Skeleton overlay unavailable for this keyframe."
+        : result.status === "partial"
+          ? "Skeleton overlay partially available for this keyframe."
+          : "Skeleton overlay rendered for this keyframe.";
+  }
+}
diff --git a/src/styles.css b/src/styles.css
@@
+.keyframe-review { display: grid; gap: 12px; }
+.keyframe-review__heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
+.keyframe-canvas-wrap { border: 1px solid #d6ddd6; border-radius: 8px; padding: 8px; background: #17211b; }
+.keyframe-canvas { width: 100%; max-height: 520px; border-radius: 6px; display: block; background: #17211b; }
+.keyframe-strip { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
+.keyframe-button { min-height: 48px; border: 1px solid #d5dbd4; border-radius: 7px; padding: 8px; color: #3d5547; background: #ffffff; display: grid; grid-template-columns: 24px minmax(0, 1fr); align-items: center; gap: 8px; text-align: left; }
+.keyframe-button span { width: 24px; height: 24px; border-radius: 50%; color: #ffffff; background: #607367; display: grid; place-items: center; font-size: 0.72rem; font-weight: 800; }
+.keyframe-button strong { min-width: 0; color: #173d29; font-size: 0.8rem; line-height: 1.2; }
+.keyframe-button.is-selected { border-color: #245b3b; background: #eaf3ec; }
+.keyframe-button.is-selected span { background: #245b3b; }
+@media (min-width: 720px) { .keyframe-strip { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
+@media (max-width: 480px) { .stage { padding: 16px; } .keyframe-canvas-wrap { padding: 4px; } }
diff --git a/test/smoke/app.spec.ts b/test/smoke/app.spec.ts
@@
+  const canvas = page.locator("[data-keyframe-canvas]");
+  await expect(canvas).toHaveCount(1);
+  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address");
+  await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
+  await page.locator("[data-keyframe-index='3']").click();
+  await expect(canvas).toHaveCount(1);
+  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top");
+  const canvasState = await page.evaluate(() => {
+    const element = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
+    const label = element.getAttribute("aria-label") ?? "";
+    return {
+      width: element.width,
+      height: element.height,
+      label,
+      canvasCount: document.querySelectorAll("[data-keyframe-canvas]").length
+    };
+  });
+  expect(canvasState.width).toBeGreaterThan(0);
+  expect(canvasState.height).toBeGreaterThan(0);
+  expect(canvasState.canvasCount).toBe(1);
+  expect(canvasState.label).not.toMatch(/right|left|face-on|mirrored|warning|confidence|filename|timestamp|correct/i);
+  await expect(page.locator(".phase-assignment").getByText(phase, { exact: true })).toBeVisible();
+  await page.getByRole("checkbox").check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
+    timeout: 30_000
+  });
+  await page.getByRole("button", { name: "Review phase labels" }).click();
+  const layout = await page.evaluate(() => {
+    const canvas = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
+    const canvasRect = canvas.getBoundingClientRect();
+    const buttonRects = [...document.querySelectorAll("[data-keyframe-index]")].map((button) =>
+      button.getBoundingClientRect()
+    );
+    return {
+      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
+      canvasWidth: canvasRect.width,
+      canvasHeight: canvasRect.height,
+      minButtonHeight: Math.min(...buttonRects.map((rect) => rect.height))
+    };
+  });
+  expect(layout.hasOverflow).toBe(false);
+  expect(layout.canvasWidth).toBeGreaterThan(300);
+  expect(layout.canvasHeight).toBeGreaterThan(160);
+  expect(layout.minButtonHeight).toBeGreaterThanOrEqual(44);
```

## Audit Tasks

Attack the implementation. In particular, check:

- Does renderer behavior match the B1-B7 QA-planning contract?
- Is warning precedence deterministic and test-covered?
- Do `renderedSegments` and `skippedSegments` always sum to 18?
- Are `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS` independent?
- Does the renderer avoid `toBlob`, `toDataURL`, `URL.createObjectURL`, storage,
  downloads, remote sharing, or raw-video export?
- Does the renderer avoid closing caller-owned `ImageBitmap` previews?
- Does keyframe switching reuse one primary canvas and avoid cached annotated
  pixels?
- Are accessible labels bounded and free of orientation, confidence, warning,
  timestamp, filename, or correctness claims?
- Does UI copy avoid medical, coaching, guaranteed privacy/deletion/anonymity,
  legal, or compliance claims?
- Are tests sufficient for SS-TC-014 given the full smoke runner hang and direct
  built-preview smoke check?

## Required Output

Return:

- PASS/FAIL verdict.
- Blockers ordered by severity, each tied to exact source/test behavior.
- Non-blocking recommendations.
- Missing tests or residual risk.
- Explicit sign-off status: either "Final audit PASS; Codex may prepare PR" or
  "Final audit FAIL; Codex must fix blockers before PR."
