import {
  metricNames,
  type MetricLimitationCode,
  type SwingMetric,
  type SwingMetricPayload
} from "./metric-contract";
import type {
  SwingCardContent,
  SwingCardContentWarningCode,
  SwingCardKeyframe,
  SwingCardPngFailureReason,
  SwingCardPngResult
} from "./swing-card-contract";

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

export interface SwingCardWarningInput {
  keyframes: readonly SwingCardKeyframe[];
  metricPayload: SwingMetricPayload | undefined;
  phaseReviewConfirmed: boolean;
}

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

export function wrapCanvasText(
  context: Pick<CanvasRenderingContext2D, "measureText">,
  text: string,
  maxWidth: number
): readonly string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && context.measureText(candidate).width > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
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

function drawMetricLines(
  context: CanvasRenderingContext2D,
  metricPayload: SwingMetricPayload | undefined,
  y: number
): number {
  return drawLines(context, formatMetricLines(metricPayload), y, 19, "#405047", "14px sans-serif");
}

function drawSectionTitle(
  context: CanvasRenderingContext2D,
  label: string,
  y: number
): number {
  context.fillStyle = "#173d29";
  context.font = "700 18px sans-serif";
  context.fillText(label, CARD_PADDING, y);
  return y + 24;
}

function drawLines(
  context: CanvasRenderingContext2D,
  lines: readonly string[],
  y: number,
  lineHeight: number,
  color: string,
  font: string
): number {
  context.fillStyle = color;
  context.font = font;
  for (const line of lines.length > 0 ? lines : ["None."]) {
    for (const wrapped of wrapCanvasText(context, line, CARD_WIDTH - CARD_PADDING * 2)) {
      context.fillText(wrapped, CARD_PADDING, y);
      y += wrapped === "" ? Math.round(lineHeight / 2) : lineHeight;
    }
  }
  return y;
}

function drawWrappedBlock(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  lineHeight: number,
  color: string,
  font: string
): number {
  context.fillStyle = color;
  context.font = font;
  for (const line of wrapCanvasText(context, text, CARD_WIDTH - x - CARD_PADDING)) {
    context.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

function drawPlaceholder(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string
): void {
  context.fillStyle = "#eef2ed";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "#b8c4ba";
  context.lineWidth = 2;
  context.strokeRect(x, y, width, height);
  context.fillStyle = "#405047";
  context.font = "700 16px sans-serif";
  context.fillText(label, x + 18, y + height / 2);
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

function renderPrintMetrics(metricPayload: SwingMetricPayload | undefined): HTMLElement {
  const section = printSection("Metrics");
  section.dataset.swingCardPrintSection = "metrics";
  const list = document.createElement("ul");
  for (const line of formatMetricLines(metricPayload)) {
    const item = document.createElement("li");
    item.textContent = line;
    list.append(item);
  }
  section.append(list);
  return section;
}

function renderPrintWarnings(warnings: readonly SwingCardContentWarningCode[]): HTMLElement {
  const section = printSection("Warnings and limitations");
  section.dataset.swingCardPrintSection = "warnings";
  const list = document.createElement("ul");
  for (const warning of warnings) {
    const item = document.createElement("li");
    item.textContent = labelContentWarning(warning);
    list.append(item);
  }
  if (warnings.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No card warnings.";
    list.append(item);
  }
  section.append(list);
  return section;
}

function renderPrintPrompt(prompt: string): HTMLElement {
  const section = printSection("Manual LLM upload prompt");
  section.dataset.swingCardPrintSection = "prompt";
  section.append(textBlock("p", prompt));
  return section;
}

function printSection(title: string): HTMLElement {
  const section = document.createElement("section");
  section.className = "swing-card-print__section";
  section.append(textBlock("h3", title));
  return section;
}

function textBlock(tagName: string, text: string, className?: string): HTMLElement {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function formatMetricLines(metricPayload: SwingMetricPayload | undefined): readonly string[] {
  if (!metricPayload || metricPayload.metrics.length === 0) {
    return metricNames.map((name) => `${name}: unavailable`);
  }
  return metricPayload.metrics.map(formatMetric);
}

function formatMetricsForPrompt(metricPayload: SwingMetricPayload | undefined): string {
  return formatMetricLines(metricPayload).join("\n");
}

function formatMetric(metric: SwingMetric): string {
  const value =
    metric.value.status === "measured"
      ? `${metric.value.numericValue} ${metric.units}`
      : metric.value.status;
  const notes = formatLimitationNotes(metric.limitationNotes);
  return `${metric.metricName} (${metric.phaseId}, ${metric.handedness}): ${value}; confidence ${metric.confidence.kind}; limitations ${notes}`;
}

function formatLimitationNotes(notes: readonly MetricLimitationCode[]): string {
  return notes.join(", ");
}

function labelContentWarning(warning: SwingCardContentWarningCode): string {
  const labels: Record<SwingCardContentWarningCode, string> = {
    NO_KEYFRAMES_SELECTED: "No keyframes were selected.",
    KEYFRAME_UNAVAILABLE: "One or more selected keyframes are unavailable or incomplete.",
    METRICS_UNAVAILABLE: "Metrics are unavailable or not measured.",
    PHASE_REVIEW_REQUIRED: "Phase review is required before metrics should be interpreted.",
    PROMPT_LIMITED_EVIDENCE: "Evidence is limited; do not infer missing values."
  };
  return labels[warning];
}

function randomSuffix(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function effectiveDevicePixelRatio(): number {
  const dpr = Number.isFinite(globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1;
  return Math.max(1, Math.min(CARD_MAX_DPR, dpr || 1));
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
