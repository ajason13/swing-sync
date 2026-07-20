import type { AnalysisLifecycle } from "./analysis-lifecycle";
import {
  confirmPhaseReview,
  rebuildPhaseReviewState,
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
  consent: SafetyConsentStore;
  lifecycle: AnalysisLifecycle;
  requestRender(statusMessage?: string): void;
}

export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependencies): void {
  const { state, consent, lifecycle, requestRender } = dependencies;

  root.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    consent.setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });

  root.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!consent.hasSafetyConsent()) {
      requestRender("Please acknowledge the safety terms before starting analysis.");
      root.querySelector<HTMLInputElement>("#safety-consent")?.focus();
      return;
    }
    if (!state.selectedVideo) {
      requestRender("Choose a local video before starting analysis.");
      return;
    }
    selectWorkflowStep(state, "processing");
    requestRender("Loading approved local pose assets. No video data leaves this device.");
    void lifecycle.startActive();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
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
        void lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
    });
  });

  root.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    selectWorkflowStep(state, getNextWorkflowStep(state.activeStep).id);
    requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
  });

  root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    root.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  root.querySelector<HTMLInputElement>("#video-file")?.addEventListener("change", (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    void lifecycle.closeActive();
    selectLocalVideo(state, file);
    requestRender("Local video selected. It has not been analyzed or persisted.");
  });

  root.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    requestRender("Camera capture remains out of scope. Choose a local video file.");
  });

  root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void lifecycle.stopActive();
  });

  root.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void lifecycle.retryActive();
  });

  root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "review");
    requestRender("Review the provisional phase labels before future measurements become available.");
  });

  root.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "view", declarationValue((event.currentTarget as HTMLSelectElement).value, "view"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
    setPhaseDeclaration(
      state,
      "handedness",
      declarationValue((event.currentTarget as HTMLSelectElement).value, "handedness")
    );
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "mirrored", declarationValue((event.currentTarget as HTMLSelectElement).value, "mirrored"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "setup", (event.currentTarget as HTMLInputElement).checked ? "confirmed" : "undeclared");
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
    select.addEventListener("change", () => {
      setPhaseDraftAssignment(state, Number(select.dataset.phaseIndex), Number(select.value));
      requestRender();
    });
  });
  root.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
    setPhaseConfirmation(state, (event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
    confirmPhaseReview(state);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "export");
    requestRender("Swing Card export opened.");
  });
  root.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectKeyframe(state, Number(button.dataset.keyframeIndex));
      requestRender();
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
