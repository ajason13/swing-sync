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
