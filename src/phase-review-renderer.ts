import type { AppState } from "./app-state";
import { isValidCorrection, phaseDefinitions, type PhaseDeclarations } from "./phase-review";

export function renderPhaseReview(state: AppState): string {
  const proposal = state.phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    proposal?.evidenceStatus === "unsupported-input"
      ? "Select every required declaration and provide a supported active eight-sample run."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview(state)}
      <div class="phase-warning" role="status" aria-live="polite">
        <strong id="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</strong>
        <p>${warning}</p>
      </div>
      <fieldset class="phase-declarations">
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, [
          ["undeclared", "Select view"],
          ["face-on", "Face-on side view"]
        ])}
        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, [
          ["undeclared", "Select handedness"],
          ["right", "Right-handed"],
          ["left", "Left-handed"]
        ])}
        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, [
          ["undeclared", "Select mirrored status"],
          ["no", "No"],
          ["yes", "Yes"]
        ])}
        <label class="phase-setup-confirmation">
          <input id="phase-setup" type="checkbox" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
          <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
        </label>
      </fieldset>
      <div class="phase-assignment-list" aria-label="Swing phase assignments">
        ${phaseDefinitions
          .map((phase, index) => {
            const selected = state.phaseDraft[index]?.sampleIndex ?? index;
            return `
              <label class="phase-assignment">
                <span><strong>${phase.label}</strong><small>Ordered phase ${index + 1}</small></span>
                <select aria-label="${phase.label} sample" data-phase-index="${index}" ${reviewRequired && !ready ? "" : "disabled"}>
                  ${phaseDefinitions
                    .map(
                      (_, sampleIndex) =>
                        `<option value="${sampleIndex}" ${sampleIndex === selected ? "selected" : ""}>Sample ${sampleIndex + 1}</option>`
                    )
                    .join("")}
                </select>
              </label>`;
          })
          .join("")}
      </div>
      <label class="phase-confirmation">
        <input id="phase-confirmation" type="checkbox" ${state.phaseConfirmation ? "checked" : ""} ${
          reviewRequired && !ready ? "" : "disabled"
        } />
        <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
      </label>
      <div class="action-row">
        <button class="primary-action" type="button" data-confirm-phase-review ${
          reviewRequired && state.phaseConfirmation && isValidCorrection(state.phaseDraft) && !ready ? "" : "disabled"
        }>Confirm phase review</button>
        <button class="secondary-action" type="button" data-open-export>Open Swing Card export</button>
        <p class="action-note">${ready ? "Future metric readiness is available for a separately reviewed story. No metrics are generated here." : "Future metric readiness remains locked until this review is valid and explicitly confirmed."}</p>
      </div>
    </section>
  `;
}

function renderKeyframeOverlayReview(state: AppState): string {
  const selectedOutput = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
  const overlayStatus =
    state.latestOverlayResult?.status === "unavailable"
      ? "Skeleton overlay unavailable for this keyframe."
      : state.latestOverlayResult?.status === "partial"
        ? "Skeleton overlay partially available for this keyframe."
        : "Skeleton overlay rendered for this keyframe.";

  return `
    <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
      <div class="keyframe-review__heading">
        <div>
          <p class="placeholder-kicker">Annotated keyframes</p>
          <h3 id="keyframe-review-heading">${selectedPhase.label}</h3>
        </div>
        <span class="stage-status">Annotated still</span>
      </div>
      <div class="keyframe-canvas-wrap">
        <canvas class="keyframe-canvas" data-keyframe-canvas aria-label="Annotated keyframe: ${selectedPhase.label}"></canvas>
      </div>
      <p class="action-note" data-overlay-status>${overlayStatus}</p>
      <div class="keyframe-strip" aria-label="Select keyframe">
        ${phaseDefinitions
          .map((phase, index) => {
            const isSelected = state.selectedKeyframeIndex === index;
            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" aria-pressed="${isSelected ? "true" : "false"}">
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
  options: readonly (readonly [string, string])[]
): string {
  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}">${options
    .map(([value, text]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${text}</option>`)
    .join("")}</select></label>`;
}

export function declarationValue<K extends keyof PhaseDeclarations>(
  value: string,
  _key: K
): PhaseDeclarations[K] {
  return value as PhaseDeclarations[K];
}
