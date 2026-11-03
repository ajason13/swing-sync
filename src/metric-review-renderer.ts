import type { AppState } from "./app-state";
import { isSwingMetricPayload } from "./metric-contract";
import { deferredMetricNotice, metricExplanations, metricLimits, metricNotice, metricUnavailableReason, presentMetrics } from "./metric-presentation";

export function renderMetricReview(state: AppState): string {
  // Consume the current validated payload; never recalculate geometry in the UI.
  const payload = state.phaseReviewState?.readyForFutureMetrics && isSwingMetricPayload(state.metricPayload)
    ? state.metricPayload : undefined;
  const fallback = metricExplanations[metricUnavailableReason(state.phaseDeclarations)];
  return `<section class="metric-review" aria-labelledby="metric-review-heading" aria-describedby="metric-review-limits">
    <h3 id="metric-review-heading">Image measurements</h3>
    <p><strong>${metricNotice}</strong></p>
    <p id="metric-review-limits">${metricLimits}</p>
    <dl class="metric-review__values">
      ${presentMetrics(payload, fallback).map(metric => `<div class="metric-review__item"><dt>${metric.label}</dt><dd><strong data-review-metric="${metric.name}">${metric.value}</strong><p>${metric.status}</p><p>${metric.description}</p></dd></div>`).join("")}
    </dl>
    <p class="action-note">${deferredMetricNotice} Swing Card exports include the current reviewed measurements and limitations.</p>
  </section>`;
}
