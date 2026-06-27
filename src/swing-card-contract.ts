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

