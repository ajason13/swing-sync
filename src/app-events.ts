import type { AnalysisLifecycle } from "./analysis-lifecycle";
import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
import {
  confirmPhaseReview,
  rebuildPhaseReviewState,
  resetAppState,
  selectKeyframe,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseConfirmation,
  setPhaseDeclaration,
  setPhaseDraftAssignment,
  type AppState
} from "./app-state";
import type { SafetyConsentStore } from "./consent-state";
import { declarationValue } from "./phase-review-renderer";
import { copySwingCardPrompt, downloadSwingCard, printSwingCard } from "./swing-card-actions";
import { getNextWorkflowStep, getWorkflowStep, type WorkflowStepId } from "./workflow";

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
    consent.setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    const accepted = consent.hasSafetyConsent();
    const message = accepted
      ? "Safety acknowledgement recorded locally."
      : "Safety acknowledgement is required before analysis.";
    requestRender({ focusKey: "safety-consent", announcement: message });
  });

  root.querySelector<HTMLButtonElement>("#clear-local-data")?.addEventListener("click", async () => {
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
    selectWorkflowStep(state, "processing");
    const message = "Loading approved local pose assets. No video data leaves this device.";
    requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
    void lifecycle.startActive();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextStep = button.dataset.step as WorkflowStepId;
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
        await lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      const message = `${getWorkflowStep(state.activeStep).label} opened.`;
      requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
    });
  });

  root.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    selectWorkflowStep(state, getNextWorkflowStep(state.activeStep).id);
    const message = `${getWorkflowStep(state.activeStep).label} opened.`;
    requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
  });

  root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    root.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  const fileInput = root.querySelector<HTMLInputElement>("#video-file");
  fileInput?.addEventListener("change", async (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    await lifecycle.closeActive();
    selectLocalVideo(state, file);
    const message = "Local video selected. It has not been analyzed or persisted.";
    requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });
  });
  fileInput?.addEventListener("cancel", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
  fileInput?.addEventListener("focus", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
  fileInput?.addEventListener("focusin", () => applyAccessibilityIntent({ focusKey: "video-picker" }));

  root.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    const message = "Camera capture remains out of scope. Choose a local video file.";
    requestRender({ focusKey: "camera-placeholder", visibleStatusText: message, announcement: message });
  });

  root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void lifecycle.stopActive();
  });

  root.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void lifecycle.retryActive();
  });

  root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "review");
    const message = "Review the provisional phase labels before future measurements become available.";
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
      : "Required video declarations and a supported eight-sample run are needed.";
}

function phaseRenderRequest(focusKey: RenderRequest["focusKey"], before: PhaseSemanticKey, state: AppState): RenderRequest {
  const after = phaseSemanticKey(state);
  return {
    focusKey,
    ...(before !== after ? { visibleStatusText: phaseMessage(after), announcement: phaseMessage(after) } : {})
  };
}
