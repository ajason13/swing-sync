import type { SampledFrameOutput } from "./frame-processing";
import { calculateShoulderLineAngle, calculateStanceWidthRatio } from "./geometry-metrics";
import {
  caddieSetEquivalence, isSwingMetricPayload, metricNames, metricSchemaVersion,
  type MetricLimitationCode, type MetricValueStatus, type SwingMetric, type SwingMetricPayload
} from "./metric-contract";
import { isUsablePhaseOutput, phaseDefinitions, type PhaseDeclarations, type PhaseReviewState } from "./phase-review";

export interface MetricProducerInput {
  outputs: readonly SampledFrameOutput[];
  declarations: PhaseDeclarations;
  review: PhaseReviewState | undefined;
  activeGeneration: number;
}

/** Synchronous and uncached: only the current confirmed revision can publish a value. */
export function produceMetricPayload(input: MetricProducerInput): SwingMetricPayload {
  const { declarations, review, outputs, activeGeneration } = input;
  const supported = declarations.view === "face-on" && declarations.setup === "confirmed" &&
    (declarations.handedness === "right" || declarations.handedness === "left") &&
    (declarations.mirrored === "yes" || declarations.mirrored === "no");
  const handedness = declarations.handedness === "right" || declarations.handedness === "left" ? declarations.handedness : "undeclared";
  const correction = review?.correction;
  const assignments = correction?.assignments;
  // Validate revision/assignment structure separately from evidence so bad pose data
  // yields missing, rather than pretending the user never reviewed the assignment.
  const reviewed = Number.isSafeInteger(activeGeneration) && activeGeneration >= 0 &&
    review?.runGeneration === activeGeneration && review.automaticProposal.runGeneration === activeGeneration &&
    review.automaticProposal.evidenceStatus === "review-required" && review.readyForFutureMetrics &&
    correction?.confirmed === true && correction.runGeneration === activeGeneration &&
    assignments?.length === phaseDefinitions.length &&
    phaseDefinitions.every((phase, index) => {
      const assignment = assignments[index];
      const previous = assignments[index - 1];
      return assignment?.phaseId === phase.id && Number.isInteger(assignment.sampleIndex) &&
        assignment.sampleIndex >= 0 && assignment.sampleIndex < outputs.length &&
        (!previous || !(outputs[previous.sampleIndex]?.requestedTimestampMs > outputs[assignment.sampleIndex]?.requestedTimestampMs));
    });

  const metrics = metricNames.map((metricName, index): SwingMetric => {
    const phaseId = (["address", "top", "impact", "finish"] as const)[index];
    const metric: SwingMetric = {
      metricName, phaseId, units: index === 0 ? "ratio" : "degrees", handedness,
      value: { status: "unsupported", numericValue: null },
      confidence: { kind: "unavailable" }, limitationNotes: []
    };
    const limitations = new Set<MetricLimitationCode>();
    const deferred = index >= 2;
    if (deferred) limitations.add("metric-not-calculated");
    if (phaseId === "impact") limitations.add("impact-not-directly-observed");
    if (!supported) limitations.add("phase-unsupported");
    if (!reviewed) limitations.add("phase-review-required");

    const assignment = assignments?.find((item) => item?.phaseId === phaseId);
    const output = assignment ? outputs[assignment.sampleIndex] : undefined;
    const image = output?.inferenceImage;
    const paired = output && output.runGeneration === activeGeneration && output.index === assignment?.sampleIndex &&
      isUsablePhaseOutput(output) && image?.pose === output.pose;
    const calculation = !deferred && supported && reviewed && paired && image
      ? (index === 0 ? calculateStanceWidthRatio : calculateShoulderLineAngle)({
        landmarks: output.pose.landmarks[0], worldLandmarks: output.pose.worldLandmarks[0],
        handedness: declarations.handedness, mirrored: declarations.mirrored,
        imageWidth: image.width, imageHeight: image.height
      }) : undefined;
    if (!deferred && supported && reviewed && calculation?.status !== "measured") limitations.add("pose-evidence-low");
    const status: MetricValueStatus = deferred || !supported ? "unsupported" : !reviewed ? "not-reviewed" :
      calculation?.status === "measured" ? "measured" : "missing";
    if (status === "measured" && calculation?.value !== null && calculation?.value !== undefined) {
      metric.value = { status, numericValue: calculation.value };
      metric.confidence = { kind: "not-calibrated" };
      metric.limitationNotes = ["none"];
    } else {
      metric.value = { status: status as Exclude<MetricValueStatus, "measured">, numericValue: null };
      metric.limitationNotes = [...limitations];
    }
    return metric;
  });
  const payload: SwingMetricPayload = { schemaVersion: metricSchemaVersion, caddieSetEquivalence, metrics };
  if (!isSwingMetricPayload(payload)) throw new Error("INVALID_METRIC_PAYLOAD");
  return payload;
}
