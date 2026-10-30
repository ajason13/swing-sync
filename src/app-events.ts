import type { AnalysisLifecycle } from "./analysis-lifecycle";
import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
import {
  cancelSwingCardExport,
  confirmPhaseReview,
  rebuildPhaseReviewState,
  resetAppState,
  selectKeyframe,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseConfirmation,
  setPhaseDeclaration,
  setPhaseDraftAssignment,
  selectCanBeginAnalysis,
  setAnalysisInterval,
  type AppState
} from "./app-state";
import type { SafetyConsentStore } from "./consent-state";
import { calculateSampleTimestamps } from "./frame-processing";
import { declarationValue } from "./phase-review-renderer";
import { copySwingCardPrompt, downloadSwingCard, printSwingCard } from "./swing-card-actions";
import { getWorkflowStep, type WorkflowStepId } from "./workflow";

export interface AppEventsDependencies {
  state: AppState;
  consent: Pick<SafetyConsentStore, "hasSafetyConsent" | "setSafetyConsent"> & Partial<Pick<SafetyConsentStore, "clearAppLocalData">>;
  lifecycle: AnalysisLifecycle;
  requestRender(request?: RenderRequest): void;
  applyAccessibilityIntent(intent: AccessibilityIntent): void;
}

export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependencies): void {
  const { state, consent, lifecycle, requestRender, applyAccessibilityIntent } = dependencies;

  root.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    const requested = (event.currentTarget as HTMLInputElement).checked;
    consent.setSafetyConsent(requested);
    const accepted = consent.hasSafetyConsent();
    const message = accepted
      ? "Safety acknowledgement recorded locally."
      : requested
        ? "Safety acknowledgement could not be recorded in this browser. Check browser storage settings and try again."
        : "Safety acknowledgement is required before analysis.";
    requestRender({ focusKey: "safety-consent", announcement: message, ...(requested && !accepted ? { visibleStatusText: message } : {}) });
  });

  root.querySelector<HTMLButtonElement>("#clear-local-data")?.addEventListener("click", async () => {
    cancelSwingCardExport(state);
    await lifecycle.closeActive();
    resetAppState(state);
    const cleared = consent.clearAppLocalData?.() === "cleared";
    const message = cleared
      ? "Local Swing Sync user state was cleared in this browser. This is not device-level erasure, and browser or operating-system storage behavior may vary."
      : "Swing Sync could not clear all local app data in this browser. The safety acknowledgement is treated as not recorded. Check browser storage settings and try again.";
    requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });
  });

  root.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!consent.hasSafetyConsent()) {
      const message = "Please acknowledge the safety terms before starting analysis.";
      requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });
      return;
    }
    if (!state.selectedVideo) {
      const message = "Choose a local video before starting analysis.";
      requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });
      return;
    }
    if (!selectCanBeginAnalysis(state, true)) return;
    selectWorkflowStep(state, "processing");
    const message = "Loading approved local pose assets. No video data leaves this device.";
    requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
    void lifecycle.startActive();
  });

  const workflowButtons = [
    ...root.querySelectorAll<HTMLButtonElement>("[data-step]"),
    ...root.querySelectorAll<HTMLButtonElement>("[data-return-capture]")
  ];
  workflowButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const nextStep = (button.dataset.step ?? "capture") as WorkflowStepId;
      if (state.eventFrameBusy && nextStep !== state.activeStep) await lifecycle.stopEventFrame();
      const opensCompletedReview =
        state.activeStep === "processing" && state.processingState === "completed" && nextStep === "review";
      const preservesReviewData =
        ["review", "export"].includes(state.activeStep) && ["review", "export"].includes(nextStep);
      if (
        ["processing", "review", "export"].includes(state.activeStep) &&
        nextStep !== state.activeStep &&
        !opensCompletedReview &&
        !preservesReviewData
      ) {
        cancelSwingCardExport(state);
        await lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      const message = `${getWorkflowStep(state.activeStep).label} opened.`;
      requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
    });
  });

  root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    root.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  const fileInput = root.querySelector<HTMLInputElement>("#video-file");
  fileInput?.addEventListener("change", async (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    cancelSwingCardExport(state);
    await lifecycle.closeActive();
    selectLocalVideo(state, file);
    const message = "Local video selected. It has not been analyzed or persisted.";
    requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });
  });
  fileInput?.addEventListener("cancel", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
  fileInput?.addEventListener("focus", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
  fileInput?.addEventListener("focusin", () => applyAccessibilityIntent({ focusKey: "video-picker" }));

  for (const edge of ["start", "end"] as const) {
    root.querySelector<HTMLInputElement>(`#interval-${edge}`)?.addEventListener("change", async (event) => {
      if (!state.analysisInterval) return;
      const value = (event.currentTarget as HTMLInputElement).value;
      const interval = { ...state.analysisInterval, [`${edge}Seconds`]: value.trim() === "" ? NaN : Number(value) };
      // Invalidate pending exports before the asynchronous controller cleanup.
      setAnalysisInterval(state, interval);
      await lifecycle.closeActive();
      // change fires before blur. Let keyboard/mouse focus reach its destination
      // before replacing the controls and preserving their current focus key.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      if (state.activeStep !== "capture") return;
      requestRender({ announcement: "Analysis interval changed. Analyze again before reviewing or exporting." });
    });
  }

  root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void lifecycle.stopActive();
  });

  root.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void lifecycle.retryActive();
  });

  root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "review");
    const message = "Complete the video declarations, inspect the provisional labels, and select event times where needed. Experimental image measurements require confirmed phase review and can be included in Swing Card exports.";
    requestRender({ focusKey: "phase-review-heading", visibleStatusText: message, announcement: message });
  });

  root.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
    const before = phaseSemanticKey(state);
    setPhaseDeclaration(state, "view", declarationValue((event.currentTarget as HTMLSelectElement).value, "view"));
    rebuildPhaseReviewState(state);
    requestRender(phaseRenderRequest("phase-declaration:view", before, state));
  });
  root.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
    const before = phaseSemanticKey(state);
    setPhaseDeclaration(
      state,
      "handedness",
      declarationValue((event.currentTarget as HTMLSelectElement).value, "handedness")
    );
    rebuildPhaseReviewState(state);
    requestRender(phaseRenderRequest("phase-declaration:handedness", before, state));
  });
  root.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
    const before = phaseSemanticKey(state);
    setPhaseDeclaration(state, "mirrored", declarationValue((event.currentTarget as HTMLSelectElement).value, "mirrored"));
    rebuildPhaseReviewState(state);
    requestRender(phaseRenderRequest("phase-declaration:mirrored", before, state));
  });
  root.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
    const before = phaseSemanticKey(state);
    setPhaseDeclaration(state, "setup", (event.currentTarget as HTMLInputElement).checked ? "confirmed" : "undeclared");
    rebuildPhaseReviewState(state);
    requestRender(phaseRenderRequest("phase-setup", before, state));
  });
  root.querySelector<HTMLButtonElement>("[data-event-stop]")?.addEventListener("click", () => { void lifecycle.stopEventFrame(); });
  root.querySelectorAll<HTMLButtonElement>("[data-event-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = root.querySelector<HTMLInputElement>("#event-time");
      const value = input?.value.trim() ?? "";
      let timestamp = value === "" ? NaN : Number(value) * 1000;
      const delta = Number(button.dataset.eventSelect);
      if (delta && Number.isFinite(timestamp)) {
        const bounds = calculateSampleTimestamps(state.videoDuration ?? NaN, state.analysisInterval);
        timestamp = Math.max(bounds[0], Math.min(bounds[bounds.length - 1], Math.round(timestamp + delta)));
      }
      void lifecycle.assignEventFrame(state.selectedKeyframeIndex, timestamp);
    });
  });
  root.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
    select.addEventListener("change", () => {
      setPhaseDraftAssignment(state, Number(select.dataset.phaseIndex), Number(select.value));
      requestRender({ focusKey: `phase-assignment:${Number(select.dataset.phaseIndex)}` as RenderRequest["focusKey"] });
    });
  });
  root.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
    setPhaseConfirmation(state, (event.currentTarget as HTMLInputElement).checked);
    requestRender({ focusKey: "phase-confirmation" });
  });
  root.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
    const before = phaseSemanticKey(state);
    confirmPhaseReview(state);
    const after = phaseSemanticKey(state);
    const message = after === "confirmed" ? "Phase review confirmed." : "Phase review could not be confirmed.";
    requestRender({
      focusKey: "phase-review-heading",
      ...(before !== after || after !== "confirmed" ? { visibleStatusText: message, announcement: message } : {})
    });
  });
  root.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "export");
    const message = "Swing Card export opened.";
    requestRender({ focusKey: "swing-card-heading", visibleStatusText: message, announcement: message });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectKeyframe(state, Number(button.dataset.keyframeIndex));
      requestRender({ focusKey: `keyframe:${Number(button.dataset.keyframeIndex)}` as RenderRequest["focusKey"] });
    });
  });
  root.querySelector<HTMLButtonElement>("[data-download-swing-card]")?.addEventListener("click", () => {
    void downloadSwingCard(state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-print-swing-card]")?.addEventListener("click", () => {
    void printSwingCard(root, state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-copy-swing-card-prompt]")?.addEventListener("click", () => {
    void copySwingCardPrompt(state, requestRender);
  });
}

type PhaseSemanticKey = "unsupported-input" | "review-required" | "confirmed";

function phaseSemanticKey(state: AppState): PhaseSemanticKey {
  if (state.phaseReviewState?.readyForFutureMetrics) return "confirmed";
  return state.phaseReviewState?.automaticProposal.evidenceStatus === "review-required"
    ? "review-required"
    : "unsupported-input";
}

function phaseMessage(key: PhaseSemanticKey): string {
  return key === "confirmed"
    ? "Phase review confirmed."
    : key === "review-required"
      ? "Swing phase suggestions are ready for review."
      : "Complete the video declarations. Review requires eight supported pose samples.";
}

function phaseRenderRequest(focusKey: RenderRequest["focusKey"], before: PhaseSemanticKey, state: AppState): RenderRequest {
  const after = phaseSemanticKey(state);
  return {
    focusKey,
    ...(before !== after ? { visibleStatusText: phaseMessage(after), announcement: phaseMessage(after) } : {})
  };
}
