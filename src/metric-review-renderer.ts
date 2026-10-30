import type { AppState } from "./app-state";
import { isSwingMetricPayload, type MetricLimitationCode, type SwingMetric } from "./metric-contract";

const explanations: Record<MetricLimitationCode, string> = {
  none: "",
  "phase-review-required": "Confirm the current phase review to see measurements.",
  "phase-unsupported": "Complete the face-on view, handedness, mirroring and setup declarations.",
  "metric-not-calculated": "This measurement is not supported in the current review.",
  "pose-evidence-low": "The reviewed image lacks usable pose evidence or paired image dimensions for this measurement. Choose another frame and confirm again.",
  "impact-not-directly-observed": "Impact is not directly observed and remains unconfirmed."
};

export function renderMetricReview(state: AppState): string {
  // Consume the current validated payload; never recalculate geometry in the UI.
  const payload = state.phaseReviewState?.readyForFutureMetrics && isSwingMetricPayload(state.metricPayload)
    ? state.metricPayload : undefined;
  const supported = state.phaseDeclarations.view === "face-on" && state.phaseDeclarations.handedness !== "undeclared" &&
    state.phaseDeclarations.mirrored !== "undeclared" && state.phaseDeclarations.setup === "confirmed";
  const fallback = explanations[supported ? "phase-review-required" : "phase-unsupported"];
  return `<section class="metric-review" aria-labelledby="metric-review-heading" aria-describedby="metric-review-limits">
    <h3 id="metric-review-heading">Image measurements</h3>
    <p><strong>Experimental, unvalidated 2D image measurement</strong></p>
    <p id="metric-review-limits">These describe the images assigned to Address and Top in your confirmed review; the labels may not be exact swing events. Assume a stationary, level, face-on camera. Camera angle, roll, occlusion and pose estimation error can change the values. Evidence is not calibrated and does not establish accuracy. These are not scores, ideal ranges, 3D rotation or performance assessments.</p>
    <dl class="metric-review__values">
      ${renderMetric("Address stance-width ratio (2D)", "address-stance-ratio", "Projected ankle separation relative to shoulder separation in the reviewed Address image.", payload?.metrics, fallback)}
      ${renderMetric("Top shoulder-line angle (2D)", "top-shoulder-line-angle", "Projected shoulder line relative to image horizontal in the reviewed Top image. Zero is horizontal; positive rises along the axis adjusted for declared mirroring and handedness. The line wraps at ±90 degrees; this is not shoulder turn or anatomical tilt.", payload?.metrics, fallback)}
    </dl>
    <p class="action-note">Impact and Finish measurements are unavailable: they are not supported. Impact remains unconfirmed. Measurements are shown only in review; Swing Card exports do not include these values.</p>
  </section>`;
}

function renderMetric(label: string, name: SwingMetric["metricName"], description: string,
  metrics: readonly SwingMetric[] | undefined, fallback: string): string {
  const matches = metrics?.filter(metric => metric.metricName === name);
  const metric = matches?.length === 1 ? matches[0] : undefined;
  // The general contract also accepts low-evidence examples; those are not eligible MVP values.
  const measured = metric?.value.status === "measured" && metric.confidence.kind === "not-calibrated" &&
    metric.limitationNotes.length === 1 && metric.limitationNotes[0] === "none";
  const value = measured ? `${metric.value.numericValue!.toFixed(2)} ${metric.units}` : "Unavailable";
  const reasons = metric?.limitationNotes.filter(code => code !== "none").map(code => explanations[code]).join(" ");
  const status = measured ? "Measured from the reviewed image; evidence is not calibrated." : reasons ||
    (metric ? "Eligible reviewed evidence is unavailable for this measurement." : fallback);
  return `<div class="metric-review__item"><dt>${label}</dt><dd><strong data-review-metric="${name}">${value}</strong><p>${status}</p><p>${description}</p></dd></div>`;
}
