import type { AppState } from "./app-state";
import { setOverlayResult } from "./app-state";
import type { SampledFrameOutput } from "./frame-processing";
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";

export function renderSelectedKeyframeCanvas(root: ParentNode, state: AppState): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || state.phaseOutputs.length === 0) return;
  const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const status = root.querySelector<HTMLElement>("[data-overlay-status]");
  const result = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  setOverlayResult(state, result);
  if (status) {
    status.textContent =
      result.status === "unavailable"
        ? "Skeleton overlay unavailable for this keyframe."
        : result.status === "partial"
          ? "Skeleton overlay partially available for this keyframe."
          : "Skeleton overlay rendered for this keyframe.";
  }
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
