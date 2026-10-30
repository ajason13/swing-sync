import { describe, expect, it } from "vitest";
import { completeProcessingWithOutputs, confirmPhaseReview, createInitialAppState, rebuildPhaseReviewState,
  setPhaseConfirmation, setPhaseDeclaration, setPhaseDraftAssignment, resetPhaseReview } from "../../src/app-state";
import { renderMetricReview } from "../../src/metric-review-renderer";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { poseThresholds } from "../../src/pose-contract";

function reviewed() {
  const state = createInitialAppState();
  const outputs: SampledFrameOutput[] = Array.from({ length: 8 }, (_, index) => {
    const points = Array.from({ length: 33 }, () => ({ x: .5, y: .5, z: 0, visibility: 1 }));
    points[11].x = .375; points[12].x = .625; points[27].x = .3125; points[28].x = .6875;
    const pose = { timestampMs: index * 100, landmarks: [points], worldLandmarks: [points], thresholds: poseThresholds };
    return { index, runGeneration: 1, requestedTimestampMs: index * 100, observedSeekTimestampMs: index * 100,
      pose, inferenceImage: { width: 800, height: 600, pose },
      preview: { width: 800, height: 600, close() {} } as unknown as ImageBitmap };
  });
  completeProcessingWithOutputs(state, { getOutputs: () => outputs });
  state.phaseDeclarations = { view: "face-on", handedness: "right", mirrored: "no", setup: "confirmed" };
  rebuildPhaseReviewState(state); setPhaseConfirmation(state, true); confirmPhaseReview(state);
  return state;
}

describe("metric review presentation", () => {
  it("renders current validated values, units, phase context and evidence limits as labeled text", () => {
    const state = reviewed();
    // Presentation must consume the payload rather than calculate from landmarks again.
    state.metricPayload!.metrics[0].value = { status: "measured", numericValue: 1.234567 };
    const html = renderMetricReview(state);
    expect(html).toContain('aria-labelledby="metric-review-heading" aria-describedby="metric-review-limits"');
    expect(html).toContain('<dt>Address stance-width ratio (2D)</dt>');
    expect(html).toContain('>1.23 ratio</strong>');
    expect(html).toContain('<dt>Top shoulder-line angle (2D)</dt>');
    expect(html).toContain('>0.00 degrees</strong>');
    for (const text of ["Experimental, unvalidated 2D image measurement", "confirmed review", "Camera angle, roll, occlusion", "not calibrated", "Impact remains unconfirmed", "not shoulder turn or anatomical tilt"]) expect(html).toContain(text);
    expect(html).not.toMatch(/data-review-metric="(?:impact|finish)/);
  });

  it("explains missing evidence without turning null into zero and keeps partial values", () => {
    const state = reviewed();
    state.phaseOutputs[0].pose.landmarks[0][27].visibility = .49;
    confirmPhaseReview(state);
    const html = renderMetricReview(state);
    expect(html).toContain('data-review-metric="address-stance-ratio">Unavailable</strong>');
    expect(html).toContain("lacks usable pose evidence or paired image dimensions");
    expect(html).toContain('data-review-metric="top-shoulder-line-angle">0.00 degrees</strong>');
    expect(html).not.toContain("null");
  });

  it.each([
    (s: ReturnType<typeof reviewed>) => setPhaseDeclaration(s, "mirrored", "yes"),
    (s: ReturnType<typeof reviewed>) => setPhaseDraftAssignment(s, 3, 2),
    (s: ReturnType<typeof reviewed>) => setPhaseConfirmation(s, false),
    (s: ReturnType<typeof reviewed>) => resetPhaseReview(s)
  ])("removes visible values after invalidation until reconfirmed", change => {
    const state = reviewed(); change(state);
    const html = renderMetricReview(state);
    expect(html.match(/>Unavailable<\/strong>/g)).toHaveLength(2);
    expect(html).not.toMatch(/>\d+\.\d+ (ratio|degrees)<\/strong>/);
  });

  it("explains declarations and review prerequisites", () => {
    const state = createInitialAppState();
    expect(renderMetricReview(state)).toContain("Complete the face-on view");
    state.phaseDeclarations = reviewed().phaseDeclarations;
    expect(renderMetricReview(state)).toContain("Confirm the current phase review");
  });

  it("rejects malformed, extra-key and low-evidence payloads and stale readiness", () => {
    for (const mutate of [
      (s: ReturnType<typeof reviewed>) => { Object.assign(s.metricPayload!, { filename: "sensitive<value>" }); },
      (s: ReturnType<typeof reviewed>) => { s.metricPayload!.metrics[0].value = { status: "measured", numericValue: NaN }; },
      (s: ReturnType<typeof reviewed>) => { s.phaseReviewState!.readyForFutureMetrics = false; }
    ]) {
      const state = reviewed(); mutate(state); const html = renderMetricReview(state);
      expect(html.match(/>Unavailable<\/strong>/g)).toHaveLength(2);
      expect(html).not.toContain("sensitive<value>");
    }
    const state = reviewed(); state.metricPayload!.metrics[0].confidence.kind = "low-evidence";
    expect(renderMetricReview(state)).toContain('data-review-metric="address-stance-ratio">Unavailable</strong>');
  });
});
