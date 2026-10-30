import { renderMetricReview } from "./metric-review-renderer";
import { calculateSampleTimestamps } from "./frame-processing";
import { getSelectedPhasePreview, type AppState } from "./app-state";
import { overlayStatusText } from "./keyframe-overlay-renderer";
import { isValidCorrection, phaseDefinitions, type PhaseDeclarations } from "./phase-review";

export function renderPhaseReview(state: AppState): string {
  const proposal = state.phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const busy = state.eventFrameBusy;
  const validOrder = isValidCorrection(state.phaseDraft, state.phaseOutputs);
  const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    ready
      ? "Phase review is confirmed. Open Swing Card export to save the reviewed keyframes. Labels remain provisional, Impact remains unconfirmed. Experimental image measurements are shown below and included in Swing Card exports."
      : proposal?.evidenceStatus === "unsupported-input"
      ? "Complete the video declarations below. Review requires eight supported pose samples; if samples are missing, choose a longer interval and analyze again."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview(state)}
      <div class="phase-warning" id="phase-review-status">
        <h3 id="phase-review-heading" tabindex="-1" data-focus-key="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</h3>
        <p>${warning}</p>
      </div>
      ${renderMetricReview(state)}
      <fieldset class="phase-declarations" ${busy ? "disabled" : ""}>
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, "phase-declaration:view", [
          ["undeclared", "Select view"],
          ["face-on", "Face-on side view"]
        ])}
        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, "phase-declaration:handedness", [
          ["undeclared", "Select handedness"],
          ["right", "Right-handed"],
          ["left", "Left-handed"]
        ])}
        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, "phase-declaration:mirrored", [
          ["undeclared", "Select mirrored status"],
          ["no", "No"],
          ["yes", "Yes"]
        ])}
        <label class="phase-setup-confirmation">
          <input id="phase-setup" type="checkbox" data-focus-key="phase-setup" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
          <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
        </label>
      </fieldset>
      <div class="phase-assignment-list" role="group" aria-label="Swing phase assignments">
        ${phaseDefinitions
          .map((phase, index) => {
            const selected = state.phaseDraft[index]?.sampleIndex ?? index;
            const controlId = `phase-assignment-${index}`;
            return `
              <div class="phase-assignment">
                <div><h3>${phase.label}</h3><small>Ordered phase ${index + 1}</small></div>
                <label class="visually-hidden" for="${controlId}">${phase.label} sample</label>
                <select id="${controlId}" data-phase-index="${index}" data-focus-key="phase-assignment:${index}" ${reviewRequired && !busy ? "" : "disabled"}>
                  ${state.phaseOutputs
                    .map(
                      (output, sampleIndex) => sampleIndex >= 8 && sampleIndex !== state.manualFrameIndices[index] ? "" :
                        `<option value="${sampleIndex}" ${sampleIndex === selected ? "selected" : ""}>${sampleIndex < 8 ? `Sample ${sampleIndex + 1}` : "Selected event"} · ${(output.requestedTimestampMs / 1000).toFixed(3)} s</option>`
                    )
                    .join("")}
                </select>
              </div>`;
          })
          .join("")}
      </div>
      <p class="action-note" id="phase-order-status">${validOrder ? "Assignments follow source-time order." : "Confirmation requires available poses and nondecreasing source times for all eight phases."} Reusing a time is allowed; it does not prove distinct events. Impact remains unconfirmed.</p>
      <label class="phase-confirmation">
        <input id="phase-confirmation" type="checkbox" data-focus-key="phase-confirmation" ${state.phaseConfirmation ? "checked" : ""} ${
          reviewRequired && !busy ? "" : "disabled"
        } />
        <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
      </label>
      <div class="action-row">
        <button class="primary-action" type="button" data-confirm-phase-review data-focus-key="phase-confirm" aria-describedby="phase-review-status" ${
          reviewRequired && state.phaseConfirmation && validOrder && !ready && !busy ? "" : "disabled"
        }>Confirm phase review</button>
        <button class="secondary-action" type="button" data-open-export data-focus-key="open-export" ${busy ? "disabled" : ""}>Open Swing Card export</button>
        <p class="action-note">${ready ? "Save a PNG, print a card, or copy its prompt from export. Current reviewed measurements and limitations are included." : "Complete the declarations, check assignments and time order, then acknowledge and confirm your review. You can export before confirmation with an unconfirmed-review warning."}</p>
      </div>
    </section>
  `;
}

function renderKeyframeOverlayReview(state: AppState): string {
  const { phase: selectedPhase, sampleIndex, output } = getSelectedPhasePreview(state);
  const sampleLabel = sampleIndex < 8 ? `Sample ${sampleIndex + 1}` : "Selected event";
  const times = output ? `Requested ${(output.requestedTimestampMs / 1000).toFixed(3)} s; observed seek ${(output.observedSeekTimestampMs / 1000).toFixed(3)} s.` : "Frame unavailable.";
  const bounds = state.videoDuration ? calculateSampleTimestamps(state.videoDuration, state.analysisInterval) : undefined;
  const overlayStatus = overlayStatusText(state.latestOverlayResult?.status);

  return `
    <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
      <div class="keyframe-review__heading">
        <div>
          <p class="placeholder-kicker">Annotated keyframes</p>
          <h3 id="keyframe-review-heading">${selectedPhase.label}</h3>
          <p class="action-note">${sampleLabel}</p>
          <p class="action-note">${times}</p>
        </div>
        <span class="stage-status">Annotated still</span>
      </div>
      <div class="keyframe-canvas-wrap">
        <canvas class="keyframe-canvas" data-keyframe-canvas role="img" aria-label="Annotated keyframe: ${selectedPhase.label}, ${sampleLabel}" aria-describedby="keyframe-overlay-status"></canvas>
      </div>
      <p class="action-note" id="keyframe-overlay-status" data-overlay-status role="status" aria-live="polite" aria-atomic="true">${overlayStatus}</p>
      ${bounds ? `<fieldset class="event-frame-controls" aria-describedby="event-frame-help event-frame-status" ${state.phaseReviewState?.automaticProposal.evidenceStatus === "review-required" ? "" : "disabled"}>
        <legend>Select a frame for ${selectedPhase.label}</legend>
        <p id="event-frame-help" class="action-note">Complete the required video declarations, then choose a source time within ${(bounds[0] / 1000).toFixed(3)}–${(bounds[bounds.length - 1] / 1000).toFixed(3)} s. Steps request 0.033 s, not an exact decoded frame. Observed seek time is the browser playback position, not a verified capture time. Each selection runs pose inference on that same local image. Missing poses prevent confirmation.</p>
        <label for="event-time">Source time (seconds)</label>
        <input id="event-time" type="number" min="${bounds[0] / 1000}" max="${bounds[bounds.length - 1] / 1000}" step="0.001" value="${(output?.requestedTimestampMs ?? bounds[0]) / 1000}" data-focus-key="event-time" ${state.eventFrameBusy ? "readonly" : ""} />
        <div class="action-row">
          <button type="button" class="secondary-action" data-event-select="-33" data-focus-key="event-earlier" ${state.eventFrameBusy ? "disabled" : ""}>Earlier (0.033 s)</button>
          <button type="button" class="secondary-action" data-event-select="33" data-focus-key="event-later" ${state.eventFrameBusy ? "disabled" : ""}>Later (0.033 s)</button>
          <button type="button" class="primary-action" data-event-select="0" data-focus-key="event-assign" ${state.eventFrameBusy ? "disabled" : ""}>Use time for ${selectedPhase.label}</button>
          ${state.eventFrameBusy ? `<button type="button" class="secondary-action" data-event-stop data-focus-key="event-stop">Stop frame selection</button>` : ""}
        </div>
        <p id="event-frame-status" class="action-note">${state.eventFrameStatus || "Original samples are provisional. Select event times and explicitly review their phase labels."}</p>
      </fieldset>` : ""}
      <div class="keyframe-strip" role="group" aria-label="Select keyframe">
        ${phaseDefinitions
          .map((phase, index) => {
            const isSelected = state.selectedKeyframeIndex === index;
            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" ${state.eventFrameBusy ? "disabled" : ""} data-keyframe-index="${index}" data-focus-key="keyframe:${index}" aria-pressed="${isSelected ? "true" : "false"}">
              <span>${index + 1}</span>
              <strong>${phase.label}</strong>
            </button>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderDeclarationSelect(
  id: string,
  label: string,
  selected: string,
  focusKey: string,
  options: readonly (readonly [string, string])[]
): string {
  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}" data-focus-key="${focusKey}">${options
    .map(([value, text]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${text}</option>`)
    .join("")}</select></label>`;
}

export function declarationValue<K extends keyof PhaseDeclarations>(
  value: string,
  _key: K
): PhaseDeclarations[K] {
  return value as PhaseDeclarations[K];
}
