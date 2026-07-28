import { describe, expect, it, vi } from "vitest";
import { createInitialAppState } from "../../src/app-state";
import { renderSelectedKeyframeCanvas } from "../../src/keyframe-overlay-renderer";
import type { SampledFrameOutput } from "../../src/frame-processing";

describe("keyframe overlay announcement ownership", () => {
  it("keeps unrelated full-render canvas redraw silent and lets bounded keyframe intent own scoped status", () => {
    const state = createInitialAppState();
    state.phaseOutputs = [{ preview: {}, pose: { landmarks: [[]] } }] as unknown as SampledFrameOutput[];
    const status = { textContent: "Existing status." };
    const canvas = {};
    const root = {
      querySelector: (selector: string) => selector === "[data-keyframe-canvas]" ? canvas : status
    };
    const renderFrame = vi.fn(() => ({
      status: "partial" as const,
      renderedSegments: 1,
      skippedSegments: 1,
      warnings: [],
      width: 320,
      height: 180
    }));

    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, false, renderFrame);
    expect(status.textContent).toBe("Existing status.");
    expect(state.latestOverlayResult?.status).toBe("partial");

    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, true, renderFrame);
    expect(status.textContent).toBe("Skeleton overlay partially available for this keyframe.");
    expect(renderFrame).toHaveBeenCalledTimes(2);
  });
});
