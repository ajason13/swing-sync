Role: You are the lead adversarial implementation auditor for Swing Sync.

Stage: SS-011 final implementation audit.

Scope: Audit the implemented SS-011 Swing Card export feature against the approved preimplementation specification, prior Claude QA planning gates, Swing Sync privacy/safety boundaries, and SS-TC-015 acceptance coverage. Return a PASS/FAIL verdict. Findings must be ordered by severity and distinguish implementation blockers from non-blocking recommendations or future work.

Repository context:
- Project: Swing Sync, a local-first browser app for swing video analysis.
- Branch: `ss-011-swing-card`.
- Story: SS-011 Generate downloadable Swing Card.
- Acceptance criteria:
  - Swing Card includes selected keyframes, metrics, warnings, and analysis prompt.
  - Export works as PNG or PDF.
  - No unapproved raw video is included.
  - Output remains usable for manual upload to an LLM chat interface.
- Dedicated test case: SS-TC-015 covers PNG/PDF Swing Card export, selected annotated keyframes, metric/warning inclusion, no raw-video inclusion, prompt-copy safety, privacy boundaries, and manual LLM upload usability.
- Current status before this audit: `4. Final Audit (Claude)` after implementation and verification.

Protected boundaries:
- Raw swing video remains local-first and is not uploaded by default.
- No remote sharing, telemetry, remote logging, cloud storage, SDK/provider/model/asset changes, new workers, or new dependencies are allowed for SS-011.
- Swing Card export may include annotated still/keyframe output only; it must not include raw video files, raw landmarks, world landmarks, seek timestamps, selected file names, user identifiers, or raw video metadata.
- No automatic upload to an LLM or remote service. Manual upload usability only.
- Do not persist private media, landmarks, metrics, prompts, or exported cards beyond explicit user-initiated download/print/copy behavior.
- User-facing and prompt copy must not make medical, injury, professional-coaching replacement, guaranteed correctness, guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance claims.
- Follow `docs/privacy-architecture.md`, `docs/safety-terms.md`, `docs/licensing.md`, and `docs/models-licensing.md`.

Prior QA planning status:
- Gemini research was dispositioned by Codex into Adopt / Revise / Defer / Reject decisions in `docs/ss-011-research-disposition.md`.
- Claude initial QA planning returned FAIL with B1-B10:
  - B1 undefined `SwingCardPngResult`
  - B2 warning taxonomy lifecycle conflation
  - B3 metricPayload type/prose contradiction
  - B4 undefined missing-overlay behavior
  - B5 print/PNG content parity not structurally enforced
  - B6 permissive alternate overlay-rendering wording
  - B7 unspecified numeric canvas caps
  - B8 underspecified object URL singleton lifecycle
  - B9 filename timestamp source unspecified
  - B10 `PoseOverlayRenderResult` import/reuse not pinned
- Codex revised `docs/ss-011-preimplementation-spec.md`; Claude focused re-review confirmed B1-B10 closed but returned FAIL on B11:
  - B11 `SwingCardPngResult.warnings` needed exact unchanged passthrough from `content.warnings`.
- Codex revised the spec again; Claude B11-only re-review returned PASS:
  - `SwingCardPngResult.warnings` is exactly `content.warnings` in success and error variants.
  - `composeSwingCardPng` must not add, remove, reorder, filter, or recompute warning codes before returning them.
  - Implementation was authorized to move to `3. In Development (ChatGPT)`.

Approved implementation contract to audit:
- `src/swing-card-contract.ts` owns the public contract:
  - `SwingCardContentWarningCode` includes only content warnings:
    `NO_KEYFRAMES_SELECTED`, `KEYFRAME_UNAVAILABLE`, `METRICS_UNAVAILABLE`, `PHASE_REVIEW_REQUIRED`, `PROMPT_LIMITED_EVIDENCE`.
  - `SwingCardPngFailureReason` includes only PNG/export failure reasons:
    `CANVAS_UNAVAILABLE`, `PNG_NULL_BLOB`, `PNG_SECURITY_ERROR`, `PNG_SERIALIZATION_FAILED`.
  - `SwingCardKeyframe.preview` is an `ImageBitmap | undefined`; `overlay` is `PoseOverlayRenderResult | undefined`.
  - `SwingCardContent.metricPayload` is exactly `SwingMetricPayload | undefined`; no alternate metric view model.
  - `SwingCardPngResult` is a discriminated union. Both branches carry `warnings` that must be unchanged passthrough from `content.warnings`.
- `src/swing-card-generator.ts` owns:
  - deterministic content warning derivation and ordering;
  - prompt construction for manual LLM use;
  - sanitized filenames using wall-clock export-click date plus `crypto.getRandomValues()`;
  - Canvas PNG composition with `toBlob("image/png")`, no `toDataURL`;
  - fixed caps: 960 x 1600 CSS pixels, DPR cap 2, backing store max 1920 x 3200;
  - missing preview/overlay/unavailable overlay fallback to `Keyframe unavailable`;
  - all selected keyframes are drawn when they have approved overlays;
  - no source `ImageBitmap` previews are closed by the PNG composer;
  - `triggerSwingCardDownload` uses module-scoped `activeObjectUrl`, synchronously revokes any prior object URL before creating a new one, appends/clicks/removes a temporary anchor, and schedules cleanup;
  - `renderSwingCardPrintSurface(content)` consumes the same `SwingCardContent` as PNG.
- `src/main.ts` wires the feature:
  - builds Swing Card content only after local analysis/review output exists;
  - uses SS-010 `renderPoseOverlayFrame` to render annotated stills to a detached canvas, then `createImageBitmap(canvas)`;
  - does not read from raw file/video/media stream during export;
  - sets `metricPayload: undefined` because runtime metric generation is not approved yet, causing metrics to render as unavailable;
  - releases created export bitmaps after PNG/print/copy handling;
  - guards export actions with a synchronous `swingCardBusy` flag;
  - exposes `Download PNG`, `Print / Save as PDF`, and `Copy prompt`.
- `src/styles.css` adds Swing Card and print styles:
  - no external font imports;
  - print media hides interactive app controls;
  - print sections/keyframes use `break-inside: avoid` and `page-break-inside: avoid`.
- No dependencies, remote SDKs, telemetry, remote sharing, or persistent card storage were added.
- Observability: unchanged. No new logging, telemetry, traces, remote diagnostics, or analytics were added.

Source excerpts:

`src/swing-card-contract.ts`
```ts
import type { SwingMetric, SwingMetricPayload } from "./metric-contract";
import type { PoseOverlayRenderResult } from "./pose-renderer";

export type SwingCardExportFormat = "png" | "print-pdf";

export type SwingCardContentWarningCode =
  | "NO_KEYFRAMES_SELECTED"
  | "KEYFRAME_UNAVAILABLE"
  | "METRICS_UNAVAILABLE"
  | "PHASE_REVIEW_REQUIRED"
  | "PROMPT_LIMITED_EVIDENCE";

export type SwingCardPngFailureReason =
  | "CANVAS_UNAVAILABLE"
  | "PNG_NULL_BLOB"
  | "PNG_SECURITY_ERROR"
  | "PNG_SERIALIZATION_FAILED";

export interface SwingCardKeyframe {
  phaseId: SwingMetric["phaseId"];
  phaseLabel: string;
  preview: ImageBitmap | undefined;
  overlay: PoseOverlayRenderResult | undefined;
}

export interface SwingCardContent {
  keyframes: readonly SwingCardKeyframe[];
  metricPayload: SwingMetricPayload | undefined;
  warnings: readonly SwingCardContentWarningCode[];
  analysisPrompt: string;
}

export type SwingCardPngResult =
  | {
      status: "ok";
      blob: Blob;
      filename: string;
      warnings: readonly SwingCardContentWarningCode[];
    }
  | {
      status: "error";
      reason: SwingCardPngFailureReason;
      warnings: readonly SwingCardContentWarningCode[];
    };
```

`src/swing-card-generator.ts` key excerpts
```ts
const CARD_WIDTH = 960;
const CARD_MAX_HEIGHT = 1600;
const CARD_MAX_DPR = 2;
const CARD_PADDING = 40;
const KEYFRAME_WIDTH = 420;
const KEYFRAME_HEIGHT = 236;
const OVERFLOW_NOTE = "Additional prompt details are available in the copy prompt.";
const WARNING_ORDER: readonly SwingCardContentWarningCode[] = [
  "NO_KEYFRAMES_SELECTED",
  "KEYFRAME_UNAVAILABLE",
  "METRICS_UNAVAILABLE",
  "PHASE_REVIEW_REQUIRED",
  "PROMPT_LIMITED_EVIDENCE"
];

let activeObjectUrl: string | undefined;

export function deriveSwingCardContentWarnings(
  input: SwingCardWarningInput
): readonly SwingCardContentWarningCode[] {
  const warnings = new Set<SwingCardContentWarningCode>();
  if (input.keyframes.length === 0) warnings.add("NO_KEYFRAMES_SELECTED");
  if (
    input.keyframes.some(
      (keyframe) =>
        !keyframe.preview || !keyframe.overlay || keyframe.overlay.status === "unavailable"
    )
  ) {
    warnings.add("KEYFRAME_UNAVAILABLE");
  }
  if (
    !input.metricPayload ||
    input.metricPayload.metrics.length === 0 ||
    input.metricPayload.metrics.every((metric) => metric.value.status !== "measured")
  ) {
    warnings.add("METRICS_UNAVAILABLE");
  }
  if (!input.phaseReviewConfirmed) warnings.add("PHASE_REVIEW_REQUIRED");
  if (
    input.keyframes.some((keyframe) => keyframe.overlay?.status === "partial") ||
    input.metricPayload?.metrics.some(
      (metric) =>
        metric.confidence.kind === "low-evidence" ||
        metric.limitationNotes.some((note) => note !== "none")
    )
  ) {
    warnings.add("PROMPT_LIMITED_EVIDENCE");
  }
  return WARNING_ORDER.filter((warning) => warnings.has(warning));
}

export function buildSwingCardPrompt(content: SwingCardContent): string {
  const metrics = formatMetricsForPrompt(content.metricPayload);
  const warnings = content.warnings.map(labelContentWarning).join(", ") || "No card warnings.";
  return [
    "Act as an educational golf movement assistant. I may manually upload a Swing Sync Card that contains selected annotated keyframe stills, bounded local metric summaries, and warnings or limitations from my swing review.",
    "",
    "Use only the evidence shown in the card. If a metric or keyframe is marked unavailable, review-required, low-evidence, or limited, do not guess or fill in missing values.",
    "",
    "Provide general educational observations by swing phase. Do not provide medical advice, pain or injury diagnosis, rehabilitation guidance, aggressive movement prescriptions, guaranteed injury prevention, guaranteed performance improvement, or a replacement for a qualified golf coach or qualified medical professional.",
    "",
    "Do not claim the card is anonymous or that uploading it to another service is private. After I upload or share the downloaded file, that service's terms and privacy practices apply.",
    "",
    `Card warnings: ${warnings}`,
    "Metric summary:",
    metrics
  ].join("\n");
}

export function sanitizeSwingCardFilename(now = new Date()): string {
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `swing-sync-card-${year}${month}${day}-${randomSuffix()}.png`;
}

export async function composeSwingCardPng(content: SwingCardContent): Promise<SwingCardPngResult> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return pngError("CANVAS_UNAVAILABLE", content);

  const dpr = effectiveDevicePixelRatio();
  const height = CARD_MAX_HEIGHT;
  canvas.width = CARD_WIDTH * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${CARD_WIDTH}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawSwingCard(context, content, height);

  try {
    const blob = await canvasToPng(canvas);
    if (!blob) return pngError("PNG_NULL_BLOB", content);
    return {
      status: "ok",
      blob,
      filename: sanitizeSwingCardFilename(new Date()),
      warnings: content.warnings
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") {
      return pngError("PNG_SECURITY_ERROR", content);
    }
    return pngError("PNG_SERIALIZATION_FAILED", content);
  }
}

export function triggerSwingCardDownload(blob: Blob, filename: string): void {
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = undefined;
  }
  const url = URL.createObjectURL(blob);
  activeObjectUrl = url;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    if (activeObjectUrl === url) activeObjectUrl = undefined;
    URL.revokeObjectURL(url);
  }, 0);
}

export function renderSwingCardPrintSurface(content: SwingCardContent): HTMLElement {
  const root = document.createElement("section");
  root.className = "swing-card-print";
  root.dataset.swingCardPrint = "true";
  root.setAttribute("aria-label", "Swing Card print surface");
  root.append(
    textBlock("h2", "Swing Sync Card"),
    textBlock("p", "Browser print can be used to print or save as PDF where supported."),
    renderPrintKeyframes(content),
    renderPrintMetrics(content.metricPayload),
    renderPrintWarnings(content.warnings),
    renderPrintPrompt(content.analysisPrompt)
  );
  return root;
}
```

```ts
function drawSwingCard(
  context: CanvasRenderingContext2D,
  content: SwingCardContent,
  maxHeight: number
): void {
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, CARD_WIDTH, maxHeight);
  let y = CARD_PADDING;
  y = drawWrappedBlock(context, "Swing Sync Card", CARD_PADDING, y, 30, "#17211b", "700 28px sans-serif");
  y = drawWrappedBlock(
    context,
    "Generated in your browser for user-controlled download. Browser print can be used to print or save as PDF where supported.",
    CARD_PADDING,
    y + 4,
    19,
    "#405047",
    "16px sans-serif"
  );
  y += 18;
  y = drawKeyframes(context, content.keyframes, y);
  y = drawSectionTitle(context, "Metrics", y + 12);
  y = drawMetricLines(context, content.metricPayload, y);
  y = drawSectionTitle(context, "Warnings and limitations", y + 12);
  y = drawLines(context, content.warnings.map(labelContentWarning), y, 18, "#405047", "14px sans-serif");
  y = drawSectionTitle(context, "Manual LLM upload prompt", y + 12);
  const promptLines = wrapCanvasText(context, content.analysisPrompt, CARD_WIDTH - CARD_PADDING * 2);
  for (const line of promptLines) {
    if (y > CARD_MAX_HEIGHT - 70) {
      drawWrappedBlock(context, OVERFLOW_NOTE, CARD_PADDING, y, 17, "#6a4a12", "700 13px sans-serif");
      return;
    }
    context.fillStyle = "#405047";
    context.font = "13px sans-serif";
    context.fillText(line, CARD_PADDING, y);
    y += line === "" ? 10 : 17;
  }
}

function drawKeyframes(
  context: CanvasRenderingContext2D,
  keyframes: readonly SwingCardKeyframe[],
  startY: number
): number {
  if (keyframes.length === 0) {
    drawPlaceholder(context, CARD_PADDING, startY, CARD_WIDTH - CARD_PADDING * 2, KEYFRAME_HEIGHT, "Keyframe unavailable");
    return startY + KEYFRAME_HEIGHT + 22;
  }

  let y = startY;
  keyframes.forEach((keyframe, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = CARD_PADDING + column * (KEYFRAME_WIDTH + 40);
    const top = startY + row * (KEYFRAME_HEIGHT + 52);
    if (keyframe.preview && keyframe.overlay && keyframe.overlay.status !== "unavailable") {
      context.drawImage(keyframe.preview, x, top, KEYFRAME_WIDTH, KEYFRAME_HEIGHT);
    } else {
      drawPlaceholder(context, x, top, KEYFRAME_WIDTH, KEYFRAME_HEIGHT, "Keyframe unavailable");
    }
    context.fillStyle = "#17211b";
    context.font = "700 14px sans-serif";
    context.fillText(keyframe.phaseLabel, x, top + KEYFRAME_HEIGHT + 20);
    y = Math.max(y, top + KEYFRAME_HEIGHT + 34);
  });
  return y + 8;
}

function renderPrintKeyframes(content: SwingCardContent): HTMLElement {
  const section = printSection("Selected keyframes");
  section.dataset.swingCardPrintSection = "keyframes";
  const grid = document.createElement("div");
  grid.className = "swing-card-print__keyframes";
  for (const keyframe of content.keyframes) {
    const item = document.createElement("figure");
    item.className = "swing-card-print__keyframe";
    if (keyframe.preview && keyframe.overlay && keyframe.overlay.status !== "unavailable") {
      const canvas = document.createElement("canvas");
      canvas.width = KEYFRAME_WIDTH;
      canvas.height = KEYFRAME_HEIGHT;
      canvas.getContext("2d")?.drawImage(keyframe.preview, 0, 0, KEYFRAME_WIDTH, KEYFRAME_HEIGHT);
      item.append(canvas);
    } else {
      item.append(textBlock("div", "Keyframe unavailable", "swing-card-print__placeholder"));
    }
    item.append(textBlock("figcaption", keyframe.phaseLabel));
    grid.append(item);
  }
  if (content.keyframes.length === 0) {
    grid.append(textBlock("div", "Keyframe unavailable", "swing-card-print__placeholder"));
  }
  section.append(grid);
  return section;
}

function pngError(reason: SwingCardPngFailureReason, content: SwingCardContent): SwingCardPngResult {
  return { status: "error", reason, warnings: content.warnings };
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(resolve, "image/png");
    } catch (error) {
      reject(error);
    }
  });
}
```

`src/main.ts` key excerpts
```ts
async function downloadSwingCard(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing local Swing Card PNG.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    const result = await composeSwingCardPng(prepared.content);
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      swingCardStatus = "Swing Card PNG download started.";
    } else {
      swingCardStatus = `Swing Card PNG export stopped (${result.reason}).`;
    }
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function printSwingCard(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing browser print view.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    const host = document.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    swingCardStatus = "Browser print dialog opened. Save as PDF if your browser supports it.";
    window.print();
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function copySwingCardPrompt(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing prompt text.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    swingCardStatus = "Prompt copied for manual use.";
  } catch {
    swingCardStatus = "Prompt copy unavailable in this browser.";
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function prepareSwingCardContent(): Promise<{ content: SwingCardContent; release(): void }> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = phaseReviewState?.correction?.assignments ?? phaseReviewState?.automaticProposal.assignments ?? [];
  const fallbackAssignments =
    assignments.length === phaseDefinitions.length
      ? assignments
      : phaseDefinitions.map((phase, index) => ({ phaseId: phase.id, sampleIndex: index }));

  for (const phase of phaseDefinitions) {
    const assignment = fallbackAssignments.find((item) => item.phaseId === phase.id);
    const output = assignment ? phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframe(output) : undefined;
    if (rendered?.preview) createdBitmaps.push(rendered.preview);
    keyframes.push({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: rendered?.preview,
      overlay: rendered?.overlay
    });
  }

  const warnings = deriveSwingCardContentWarnings({
    keyframes,
    metricPayload: undefined,
    phaseReviewConfirmed: phaseReviewState?.readyForFutureMetrics ?? false
  });
  const base: SwingCardContent = {
    keyframes,
    metricPayload: undefined,
    warnings,
    analysisPrompt: ""
  };
  const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
  return {
    content,
    release: () => {
      for (const bitmap of createdBitmaps) bitmap.close();
    }
  };
}

async function renderAnnotatedKeyframe(
  output: SampledFrameOutput
): Promise<{ preview?: ImageBitmap; overlay: PoseOverlayRenderResult } | undefined> {
  const canvas = document.createElement("canvas");
  const overlay = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  if (overlay.status === "unavailable") return { overlay };
  try {
    return { preview: await createImageBitmap(canvas), overlay };
  } catch {
    return { overlay };
  }
}
```

`src/styles.css` print excerpt
```css
@media print {
  body {
    color: #000000;
    background: #ffffff;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .topbar,
  .workflow-intro,
  .step-nav,
  .stage-heading,
  .stage-description,
  .consent-panel,
  .swing-card-panel > :not(.swing-card-print-host) {
    display: none !important;
  }

  .workspace,
  .workflow,
  .stage,
  .swing-card-panel,
  .swing-card-print-host {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    display: block !important;
    background: #ffffff !important;
  }

  .swing-card-print-host[aria-hidden="true"] {
    display: block !important;
  }

  .swing-card-print__section,
  .swing-card-print__keyframe {
    display: block !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
```

Test coverage implemented:
- `test/unit/swing-card-generator.test.ts`:
  - deterministic warning order/deduplication/co-occurrence;
  - missing keyframes/metrics/phase review warnings;
  - partial overlay and low-evidence metrics warning;
  - paragraph-preserving canvas text wrapping;
  - wall-clock date plus crypto-based filename;
  - prompt bounded copy with forbidden claims absent;
  - PNG success branch returns unchanged warning array by identity and does not close source previews;
  - no `toDataURL`;
  - missing overlay draws placeholder instead of bare preview;
  - all eight selected keyframes with approved overlays are drawn;
  - null blob, missing canvas, and SecurityError branches return failure variants with unchanged warnings;
  - print surface parity for keyframe/warning/prompt sections;
  - sequential object URL revocation before next URL creation.
- `test/smoke/app.spec.ts`:
  - mobile Swing Card export controls after a real local fixture flow;
  - export controls min height >= 44 at 390 x 844;
  - print action invokes `window.print`;
  - PNG download filename matches `swing-sync-card-YYYYMMDD-XXXXXXXX.png` and is non-empty;
  - no external network request after export;
  - no IndexedDB/cache storage after export;
  - print break-avoidance styles apply to Swing Card sections.

Verification evidence:
- `npm run test:unit -- swing-card-generator` passed: 13 tests.
- `npm run test:unit` passed: 10 files, 101 tests.
- `npm run build` passed.
- `npm run compliance:verify` passed, including pose-assets, safety, and privacy checks.
- `npm run safety:verify` passed.
- `npm run privacy:verify` passed.
- `git diff --check` passed.
- `npm run test:smoke` was attempted earlier but the local Playwright smoke runner hung before useful progress in this repo state. To avoid masking SS-011 behavior, Codex also ran a built-preview Chromium verification against the current UI flow:
  - preview URL: `http://127.0.0.1:4174/`
  - mobile viewport: 390 x 844
  - local fixture: `test/fixtures/pose-landmarker/mannequin-golf-address.webm`
  - selected supported declarations, confirmed phase review, opened Swing Card export
  - invoked Print / Save as PDF with `window.print` stub
  - downloaded PNG
  - result:
```json
{
  "suggested": "swing-sync-card-20260626-f8a09047.png",
  "size": 398432,
  "printCount": 1,
  "layout": {
    "hasOverflow": false,
    "minButtonHeight": 46,
    "buttonCount": 3,
    "statusText": ""
  },
  "requestCount": 8,
  "afterExportRequests": 0,
  "externalRequests": 0,
  "afterExportExternalRequests": 0,
  "indexedDbs": 0,
  "cacheKeys": 0,
  "consoleMessages": 7,
  "sensitiveConsole": 0
}
```

Known non-goals / intentionally deferred:
- No runtime metric generation was added in SS-011. Existing approved metric contracts are consumed as a type boundary, but the app currently passes `metricPayload: undefined`; card output marks metrics unavailable.
- No generated binary PDF library was added. PDF acceptance is implemented through browser-native print/save-to-PDF.
- No local card history, remote upload, AI API integration, cloud sharing, telemetry, external logging, service change, dependency change, new worker, or public serving behavior was added.
- Observability remains unchanged/deferred because acceptance did not require runtime diagnostics.

Audit instructions:
1. Verify whether the implementation actually satisfies B1-B11 and the approved specification, not just whether the tests pass.
2. Attack the privacy boundary: look for raw video, raw landmarks, timestamps, filenames, object URLs, media metadata, or identifiers leaking into PNG, print DOM, prompt text, filename, console, storage, or network surfaces.
3. Attack the dual-rendering boundary: verify PNG and print derive from the same `SwingCardContent` and do not reimplement metric/warning/keyframe availability decisions independently.
4. Attack fail-closed behavior: missing overlay/preview/keyframes, unavailable metrics, unconfirmed phase review, low-evidence conditions, and export failures should be bounded and should not silently produce misleading output.
5. Attack browser lifecycle behavior: object URLs, source `ImageBitmap` ownership, created export bitmaps, print host cleanup, and rapid export actions.
6. Attack prompt copy for unsafe medical/coaching/privacy/anonymity/deletion/legal/compliance claims.
7. Review test coverage for gaps that could let SS-TC-015 pass while violating acceptance criteria.

Output required:
- PASS/FAIL verdict.
- Blockers ordered by severity with file/function references when possible.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status: either "cleared to proceed to PR prep" or "must fix and request focused re-review."
