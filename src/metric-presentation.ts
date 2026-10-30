import type { PhaseDeclarations } from "./phase-review";
import { isSwingMetricPayload, type MetricLimitationCode, type SwingMetric, type SwingMetricPayload } from "./metric-contract";

export const metricNotice = "Experimental, unvalidated 2D image measurement";
export const metricLimits = "These describe the images assigned to Address and Top in your confirmed review; the labels may not be exact swing events. Assume a stationary, level, face-on camera. Camera angle, roll, occlusion and pose estimation error can change the values. Evidence is not calibrated and does not establish accuracy. These are not scores, ideal ranges, 3D rotation or performance assessments.";
export const deferredMetricNotice = "Impact and Finish measurements are unavailable: they are not supported. Impact remains unconfirmed.";
export const metricExplanations: Record<MetricLimitationCode, string> = {
  none: "",
  "phase-review-required": "Confirm the current phase review to see measurements.",
  "phase-unsupported": "Complete the face-on view, handedness, mirroring and setup declarations.",
  "metric-not-calculated": "This measurement is not supported in the current review.",
  "pose-evidence-low": "The reviewed image lacks usable pose evidence or paired image dimensions for this measurement. Choose another frame and confirm again.",
  "impact-not-directly-observed": "Impact is not directly observed and remains unconfirmed."
};

export type MetricUnavailableReason = "phase-review-required" | "phase-unsupported";

export function metricUnavailableReason(declarations: PhaseDeclarations): MetricUnavailableReason {
  return declarations.view === "face-on" && declarations.handedness !== "undeclared" &&
    declarations.mirrored !== "undeclared" && declarations.setup === "confirmed"
    ? "phase-review-required" : "phase-unsupported";
}

const definitions = [
  { name: "address-stance-ratio", label: "Address stance-width ratio (2D)", description: "Projected ankle separation relative to shoulder separation in the reviewed Address image." },
  { name: "top-shoulder-line-angle", label: "Top shoulder-line angle (2D)", description: "Projected shoulder line relative to image horizontal in the reviewed Top image. Zero is horizontal; positive rises along the axis adjusted for declared mirroring and handedness. The line wraps at ±90 degrees; this is not shoulder turn or anatomical tilt." }
] as const;

export function isEligibleMvpMetric(metric: SwingMetric): boolean {
  return definitions.some(definition => definition.name === metric.metricName) &&
    metric.value.status === "measured" && metric.confidence.kind === "not-calibrated" &&
    metric.limitationNotes.length === 1 && metric.limitationNotes[0] === "none";
}

export function presentMetrics(payload: SwingMetricPayload | undefined,
  fallback = metricExplanations["phase-review-required"]) {
  // Validate the exact payload at each presentation boundary, including extra/prohibited keys.
  const metrics = isSwingMetricPayload(payload) ? payload.metrics : undefined;
  return definitions.map(definition => {
    const matches = metrics?.filter(metric => metric.metricName === definition.name);
    const metric = matches?.length === 1 ? matches[0] : undefined;
    const measured = metric && isEligibleMvpMetric(metric);
    return {
      ...definition,
      value: measured ? `${metric.value.numericValue!.toFixed(2)} ${metric.units}` : "Unavailable",
      status: measured ? "Measured from the reviewed image; evidence is not calibrated." :
        metric?.limitationNotes.filter(code => code !== "none").map(code => metricExplanations[code]).join(" ") ||
        (metric ? "Eligible reviewed evidence is unavailable for this measurement." : fallback)
    };
  });
}

export function formatMetricSummary(payload: SwingMetricPayload | undefined, reason: MetricUnavailableReason = "phase-review-required"): readonly string[] {
  return [metricNotice, metricLimits,
    ...presentMetrics(payload, metricExplanations[reason]).flatMap(metric => [
      `${metric.label}: ${metric.value}. ${metric.status}`, metric.description
    ]), deferredMetricNotice];
}
