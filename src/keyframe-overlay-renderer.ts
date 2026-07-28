import type { AppState } from "./app-state";
import { setOverlayResult } from "./app-state";
import type { SampledFrameOutput } from "./frame-processing";
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";

type OverlayFrameRenderer = typeof renderPoseOverlayFrame;

export function renderSelectedKeyframeCanvas(
  root: ParentNode,
  state: AppState,
  announceOverlayStatus = false,
  renderFrame: OverlayFrameRenderer = renderPoseOverlayFrame
): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || state.phaseOutputs.length === 0) return;
  const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const status = root.querySelector<HTMLElement>("#keyframe-overlay-status");
  const result = renderFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  setOverlayResult(state, result);
  if (status && announceOverlayStatus) status.textContent = overlayStatusText(result.status);
}

export function overlayStatusText(status: PoseOverlayRenderResult["status"] | undefined): string {
  return status === "unavailable"
    ? "Skeleton overlay unavailable for this keyframe."
    : status === "partial"
      ? "Skeleton overlay partially available for this keyframe."
      : status === "rendered"
        ? "Skeleton overlay rendered for this keyframe."
        : "Skeleton overlay availability is determined locally for this keyframe.";
}

export async function renderAnnotatedKeyframe(
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
