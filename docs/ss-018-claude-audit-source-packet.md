# SS-018 Claude Implementation Audit Source Packet

Superseded for paste use after Claude's SS-018 implementation audit returned
FAIL with B9-B12. Use `docs/ss-018-claude-audit-rereview-prompt.md` for the
focused re-review instead.

This file fixes the first Claude audit handoff defect: the original prompt required source contents but did not include them in the pasted packet. Paste `docs/ss-018-claude-audit-prompt.md` first, then paste this source packet.

Generated from local branch `ss-018-frontend-architecture` on 2026-07-06. Intentional untracked `docs/agent-guidance/*new-codex-session-prompt.md` files are excluded because they predate SS-018 and are not part of this audit.

## Claude First Audit Response

Claude did not issue PASS/FAIL because only the prompt summary was pasted, not the complete branch diff or changed file contents. This packet provides the missing source evidence.

## Files Included

- `src/main.ts`
- `src/analysis-lifecycle.ts`
- `src/app-events.ts`
- `src/app-renderer.ts`
- `src/app-state.ts`
- `src/consent-state.ts`
- `src/keyframe-overlay-renderer.ts`
- `src/phase-review-renderer.ts`
- `src/remote-model-renderer.ts`
- `src/render-utils.ts`
- `src/swing-card-actions.ts`
- `scripts/verify-privacy-boundaries.js`
- `scripts/verify-safety-terms.js`
- `test/unit/analysis-lifecycle.test.ts`
- `test/unit/app-events.test.ts`
- `test/unit/app-renderer.test.ts`
- `test/unit/app-state.test.ts`
- `test/unit/consent-state.test.ts`
- `test/unit/render-utils.test.ts`
- `test/unit/swing-card-actions.test.ts`
- `.agents/skills/swing-sync-story-delivery/SKILL.md`
- `docs/ss-018-research-disposition.md`
- `docs/ss-018-preimplementation-spec.md`
- `docs/ss-018-claude-qa-planning-prompt.md`
- `docs/ss-018-claude-qa-response.md`
- `docs/ss-018-claude-qa-rereview-prompt.md`
- `docs/ss-018-claude-qa-rereview-response.md`
- `docs/ss-018-claude-qa-b7-b8-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-rereview-response.md`
- `docs/ss-018-claude-qa-b7-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-pass-response.md`
- `docs/ss-018-claude-audit-prompt.md`
- `CONTEXT.md`

## Complete File Contents


### src/main.ts

``````text
import "./styles.css";
import { AnalysisLifecycle } from "./analysis-lifecycle";
import { bindAppEvents } from "./app-events";
import { renderApp } from "./app-renderer";
import { createInitialAppState } from "./app-state";
import { createSafetyConsentStore } from "./consent-state";
import { renderSelectedKeyframeCanvas } from "./keyframe-overlay-renderer";

const app = document.querySelector<HTMLDivElement>("#app");
const state = createInitialAppState();
const consent = createSafetyConsentStore();

function requestRender(statusMessage?: string): void {
  if (!app) return;
  renderApp(app, state, consent.hasSafetyConsent(), statusMessage);
  bindAppEvents(app, {
    state,
    consent,
    lifecycle,
    requestRender
  });
  renderSelectedKeyframeCanvas(app, state);
}

const lifecycle = new AnalysisLifecycle({
  root: app ?? document,
  state,
  requestRender
});

requestRender();

window.addEventListener("beforeunload", () => {
  void lifecycle.closeActive();
});
document.addEventListener("securitypolicyviolation", () => {
  lifecycle.abortWithNetworkBlocked();
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

``````

### src/analysis-lifecycle.ts

``````text
import { updateProcessingProgressUi } from "./app-renderer";
import type { AppState } from "./app-state";
import {
  completeProcessingWithOutputs,
  recordProcessingOutput,
  resetPhaseReview,
  resetProcessingCounters,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "./app-state";
import { createBrowserFrameController } from "./browser-frame-processing";
import type {
  FrameProcessingController,
  FrameProcessingState,
  SampledFrameOutput
} from "./frame-processing";

export interface AnalysisLifecycleOptions {
  root: ParentNode;
  state: AppState;
  requestRender(statusMessage?: string): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;

  constructor(private readonly options: AnalysisLifecycleOptions) {}

  hasActiveController(): boolean {
    return !!this.frameController;
  }

  async startActive(): Promise<void> {
    const video = this.options.root.querySelector<HTMLVideoElement>("#analysis-video");
    const selectedVideo = this.options.state.selectedVideo;
    if (!video || !selectedVideo) return;

    resetProcessingCounters(this.options.state);
    resetPhaseReview(this.options.state);
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(completed, total),
      onOutput: (output) => this.handleProcessingOutput(output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    this.options.requestRender("Local analysis stopped and volatile resources were released.");
  }

  async closeActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
  }

  async retryActive(): Promise<void> {
    resetPhaseReview(this.options.state);
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(state: FrameProcessingState, code?: string): void {
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingProgress(completed: number, total: number): void {
    setProcessingProgress(this.options.state, completed, total);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingOutput(output: SampledFrameOutput): void {
    recordProcessingOutput(this.options.state, output);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
  }
}

``````

### src/app-events.ts

``````text
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

``````

### src/app-renderer.ts

``````text
import type { AppState } from "./app-state";
import { selectCanBeginAnalysis } from "./app-state";
import type { FrameProcessingState } from "./frame-processing";
import { phaseDefinitions } from "./phase-review";
import { renderPhaseReview } from "./phase-review-renderer";
import { renderRemoteModelReviewPanel } from "./remote-model-renderer";
import { escapeHtml, formatSwingCardWarning } from "./render-utils";
import { deriveSwingCardContentWarnings } from "./swing-card-generator";
import { getWorkflowStep, workflowSteps } from "./workflow";

export function renderApp(root: HTMLElement, state: AppState, consentAccepted: boolean, statusMessage?: string): void {
  const step = getWorkflowStep(state.activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Choose a local video to begin analysis."
      : "First analysis is blocked until this acknowledgement is checked.");

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="/" aria-label="Swing Sync home">Swing Sync</a>
        <span class="local-badge">Local-first analysis</span>
      </header>
      <main class="workspace">
        <section class="workflow" aria-labelledby="workflow-heading">
          <div class="workflow-intro">
            <div><p class="eyebrow">New analysis</p><h1 id="workflow-heading">Capture or choose your swing</h1></div>
            <p>Raw swing video stays on your device. No feature will send it elsewhere without a separate, explicit opt-in step you initiate.</p>
          </div>
          <nav class="step-nav" aria-label="Analysis workflow">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button class="step-button ${item.id === state.activeStep ? "is-active" : ""}" type="button"
                    data-step="${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
                    <span class="step-number">${index + 1}</span><span>${item.shortLabel}</span>
                  </button>`
              )
              .join("")}
          </nav>
          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading">${step.label}</h2></div>
              <span class="stage-status">${step.status}</span>
            </div>
            <p class="stage-description">${step.description}</p>
            ${renderWorkflowPanel(state, consentAccepted)}
          </section>
        </section>
        <aside class="consent-panel" aria-labelledby="consent-heading">
          <p class="eyebrow">Required before first analysis</p>
          <h2 id="consent-heading">Safety acknowledgement</h2>
          <p>Swing Sync is for educational use only. It is not medical advice, pain diagnosis, rehabilitation guidance, or professional athletic instruction.</p>
          <ul>
            <li>Golf practice and swing changes involve injury risk.</li>
            <li>Stop if you feel pain, dizziness, numbness, weakness, or unusual discomfort.</li>
            <li>Consult qualified medical or coaching professionals for personal concerns.</li>
          </ul>
          <label class="consent-check">
            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable or legally audited consent record.</p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;
}

export function renderWorkflowPanel(state: AppState, consentAccepted: boolean): string {
  if (state.activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Local video source">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture is not part of this story</span>
        </button>
        <button class="source-option" type="button" data-video-picker>
          <span class="source-option__title">Choose a video</span>
          <span>${state.selectedVideo ? escapeHtml(state.selectedVideo.name) : "Select a local video file"}</span>
        </button>
        <input id="video-file" class="visually-hidden" type="file" accept="video/*" />
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${
          selectCanBeginAnalysis(state, consentAccepted) ? "" : "disabled"
        }>
          Begin analysis
        </button>
        <p class="action-note">The selected video and decoded frames remain volatile and local.</p>
      </div>
    `;
  }

  if (state.activeStep === "processing") {
    return `
      <div class="processing-placeholder" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
          <p data-pose-summary>${processingSummaryText(state)}</p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
      <div class="action-row">
        <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
        <button class="secondary-action" type="button" data-retry-analysis hidden>Retry local analysis</button>
        <button class="primary-action" type="button" data-review-phases ${
          state.processingState === "completed" ? "" : "hidden"
        }>Review phase labels</button>
      </div>
    `;
  }

  if (state.activeStep === "review") {
    if (state.phaseOutputs.length > 0) return renderPhaseReview(state);
    return `
      <div class="review-placeholder" aria-label="Review placeholder">
        <div class="swing-frame"><span>Video and pose preview</span></div>
        <dl class="metric-list">
          <div><dt>Tempo</dt><dd>--</dd></div>
          <div><dt>Balance</dt><dd>--</dd></div>
          <div><dt>Rotation</dt><dd>--</dd></div>
        </dl>
      </div>
      <button class="secondary-action" type="button" data-next-step>Preview export state</button>
    `;
  }

  if (state.phaseOutputs.length === 0) {
    return `
      <div class="export-placeholder" aria-label="Export placeholder">
        <p class="placeholder-kicker">Local Swing Card</p>
        <h3>Swing Card unavailable</h3>
        <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
      </div>
      <button class="secondary-action" type="button" disabled>Export is not available yet</button>
    `;
  }

  return renderSwingCardExport(state);
}

export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
  const status = root.querySelector<HTMLElement>(".processing-placeholder strong");
  const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");

  if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
  if (summary) summary.textContent = processingSummaryText(state);
  if (retry) retry.hidden = state.processingState !== "failed";
  if (review) review.hidden = state.processingState !== "completed";
}

function renderSwingCardExport(state: AppState): string {
  const phaseReady = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warnings = deriveSwingCardContentWarnings({
    keyframes: phaseDefinitions.map((phase) => ({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: undefined,
      overlay: undefined
    })),
    metricPayload: undefined,
    phaseReviewConfirmed: phaseReady
  });

  return `
    <section class="swing-card-panel" aria-labelledby="swing-card-heading">
      <div class="swing-card-panel__header">
        <div>
          <p class="placeholder-kicker">Local Swing Card</p>
          <h3 id="swing-card-heading">Downloadable summary</h3>
        </div>
        <span class="stage-status">Manual sharing</span>
      </div>
      <p>This card can include annotated keyframes, unavailable metric states, warnings, and prompt text for a manual LLM chat upload. Raw swing video is not included.</p>
      <div class="swing-card-summary" aria-label="Swing Card contents">
        <div><strong>${state.phaseOutputs.length}</strong><span>local keyframes</span></div>
        <div><strong>PNG</strong><span>download</span></div>
        <div><strong>Print</strong><span>save as PDF where supported</span></div>
      </div>
      <ul class="swing-card-warning-list" aria-label="Swing Card warnings">
        ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
      </ul>
      <div class="action-row swing-card-actions">
        <button class="primary-action" type="button" data-download-swing-card ${state.swingCardBusy ? "disabled" : ""}>Download PNG</button>
        <button class="secondary-action" type="button" data-print-swing-card ${state.swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
        <button class="secondary-action" type="button" data-copy-swing-card-prompt ${state.swingCardBusy ? "disabled" : ""}>Copy prompt</button>
        <p class="action-note" data-swing-card-status role="status">${escapeHtml(state.swingCardStatus)}</p>
      </div>
      <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
      ${renderRemoteModelReviewPanel()}
    </section>
  `;
}

function processingStatusText(state: FrameProcessingState, code?: string): string {
  return state === "loading"
    ? "Loading the local pose model in a background worker."
    : state === "processing"
      ? "Processing a local video frame."
      : state === "completed"
        ? "Local frame processing completed."
        : state === "failed"
          ? `Local pose analysis stopped (${code ?? "UNKNOWN_ERROR"}).`
          : state === "cancelled"
            ? "Local frame processing cancelled."
            : state === "closed"
              ? "Local pose session closed."
              : "Preparing local pose analysis.";
}

function processingSummaryText(state: AppState): string {
  return `${state.extractedFrameCount} of ${state.totalFrameCount} video frames processed.${
    state.latestLandmarkCount > 0
      ? ` ${state.latestLandmarkCount} normalized landmarks retained in the latest result.`
      : ""
  }`;
}

``````

### src/app-state.ts

``````text
import type { FrameProcessingController, FrameProcessingState, SampledFrameOutput } from "./frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations,
  type PhaseReviewState
} from "./phase-review";
import type { PoseOverlayRenderResult } from "./pose-renderer";
import type { WorkflowStepId } from "./workflow";

export const initialSwingCardStatus = "Swing Card export is generated locally after review data exists.";

export interface AppState {
  activeStep: WorkflowStepId;
  selectedVideo: File | undefined;
  processingState: FrameProcessingState;
  poseStatusCode: string | undefined;
  extractedFrameCount: number;
  totalFrameCount: number;
  latestLandmarkCount: number;
  phaseOutputs: readonly SampledFrameOutput[];
  phaseDeclarations: PhaseDeclarations;
  phaseReviewState: PhaseReviewState | undefined;
  phaseDraft: PhaseAssignment[];
  phaseConfirmation: boolean;
  selectedKeyframeIndex: number;
  latestOverlayResult: PoseOverlayRenderResult | undefined;
  swingCardBusy: boolean;
  swingCardStatus: string;
}

export function createInitialAppState(): AppState {
  return {
    activeStep: "capture",
    selectedVideo: undefined,
    processingState: "idle",
    poseStatusCode: undefined,
    extractedFrameCount: 0,
    totalFrameCount: 0,
    latestLandmarkCount: 0,
    phaseOutputs: [],
    phaseDeclarations: undeclaredPhaseDeclarations(),
    phaseReviewState: undefined,
    phaseDraft: [],
    phaseConfirmation: false,
    selectedKeyframeIndex: 0,
    latestOverlayResult: undefined,
    swingCardBusy: false,
    swingCardStatus: initialSwingCardStatus
  };
}

export function undeclaredPhaseDeclarations(): PhaseDeclarations {
  return {
    view: "undeclared",
    handedness: "undeclared",
    mirrored: "undeclared",
    setup: "undeclared"
  };
}

export function selectCanBeginAnalysis(state: AppState, consentAccepted: boolean): boolean {
  return (
    state.activeStep === "capture" &&
    consentAccepted &&
    !!state.selectedVideo &&
    !["loading", "processing"].includes(state.processingState)
  );
}

export function selectWorkflowStep(state: AppState, step: WorkflowStepId): void {
  state.activeStep = step;
}

export function selectLocalVideo(state: AppState, video: File): void {
  state.selectedVideo = video;
}

export function setProcessingState(state: AppState, processingState: FrameProcessingState, code?: string): void {
  state.processingState = processingState;
  state.poseStatusCode = code;
}

export function setProcessingProgress(state: AppState, completed: number, total: number): void {
  state.extractedFrameCount = completed;
  state.totalFrameCount = total;
}

export function recordProcessingOutput(state: AppState, output: SampledFrameOutput): void {
  state.latestLandmarkCount = output.pose.landmarks[0]?.length ?? 0;
}

export function completeProcessingWithOutputs(
  state: AppState,
  controller: Pick<FrameProcessingController, "getOutputs">
): void {
  state.phaseOutputs = controller.getOutputs();
  state.selectedKeyframeIndex = 0;
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  rebuildPhaseReviewState(state);
}

export function resetProcessingCounters(state: AppState): void {
  state.extractedFrameCount = 0;
  state.totalFrameCount = 0;
  state.latestLandmarkCount = 0;
}

export function resetPhaseReview(state: AppState): void {
  state.phaseOutputs = [];
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  state.phaseReviewState = undefined;
  state.phaseDraft = [];
  state.phaseConfirmation = false;
  state.selectedKeyframeIndex = 0;
  state.latestOverlayResult = undefined;
  state.swingCardBusy = false;
  state.swingCardStatus = initialSwingCardStatus;
}

export function rebuildPhaseReviewState(state: AppState): void {
  const proposal = createPhaseProposal(state.phaseOutputs, state.phaseDeclarations);
  state.phaseReviewState = createPhaseReviewState(proposal);
  state.phaseDraft = proposal.assignments.map((assignment) => ({ ...assignment }));
  state.phaseConfirmation = false;
}

export function setPhaseDeclaration<K extends keyof PhaseDeclarations>(
  state: AppState,
  key: K,
  value: PhaseDeclarations[K]
): void {
  state.phaseDeclarations[key] = value;
}

export function setPhaseDraftAssignment(state: AppState, phaseIndex: number, sampleIndex: number): void {
  state.phaseDraft[phaseIndex] = {
    phaseId: phaseDefinitions[phaseIndex].id,
    sampleIndex
  };
  state.phaseConfirmation = false;
}

export function setPhaseConfirmation(state: AppState, confirmed: boolean): void {
  state.phaseConfirmation = confirmed;
}

export function confirmPhaseReview(state: AppState): void {
  if (!state.phaseReviewState) return;
  state.phaseReviewState = applyPhaseCorrection(
    state.phaseReviewState,
    state.phaseDraft,
    state.phaseConfirmation,
    state.phaseOutputs[0]?.runGeneration ?? -1
  );
}

export function selectKeyframe(state: AppState, keyframeIndex: number): void {
  state.selectedKeyframeIndex = keyframeIndex;
  state.latestOverlayResult = undefined;
}

export function setOverlayResult(state: AppState, overlayResult: PoseOverlayRenderResult): void {
  state.latestOverlayResult = overlayResult;
}

export function setSwingCardBusy(state: AppState, busy: boolean): void {
  state.swingCardBusy = busy;
}

export function setSwingCardStatus(state: AppState, status: string): void {
  state.swingCardStatus = status;
}

export function getCompleteSwingCardAssignments(state: AppState): readonly PhaseAssignment[] | undefined {
  const assignments = state.phaseReviewState?.correction?.assignments ?? state.phaseReviewState?.automaticProposal.assignments;
  return assignments && isValidCorrection(assignments) ? assignments : undefined;
}

``````

### src/consent-state.ts

``````text
export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SafetyConsentStore {
  hasSafetyConsent(): boolean;
  setSafetyConsent(accepted: boolean): void;
}

export const consentStorageKey = "swing-sync:safety-consent:v1";

export function createSafetyConsentStore(storage: ConsentStorage = window.localStorage): SafetyConsentStore {
  let storageFailed = false;

  return {
    hasSafetyConsent: () => {
      if (storageFailed) return false;

      try {
        return storage.getItem(consentStorageKey) === "accepted";
      } catch {
        storageFailed = true;
        return false;
      }
    },
    setSafetyConsent: (accepted: boolean) => {
      try {
        if (accepted) {
          storage.setItem(consentStorageKey, "accepted");
          return;
        }
        storage.removeItem(consentStorageKey);
      } catch {
        storageFailed = true;
      }
    }
  };
}

``````

### src/keyframe-overlay-renderer.ts

``````text
import type { AppState } from "./app-state";
import { setOverlayResult } from "./app-state";
import type { SampledFrameOutput } from "./frame-processing";
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";

export function renderSelectedKeyframeCanvas(root: ParentNode, state: AppState): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || state.phaseOutputs.length === 0) return;
  const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const status = root.querySelector<HTMLElement>("[data-overlay-status]");
  const result = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  setOverlayResult(state, result);
  if (status) {
    status.textContent =
      result.status === "unavailable"
        ? "Skeleton overlay unavailable for this keyframe."
        : result.status === "partial"
          ? "Skeleton overlay partially available for this keyframe."
          : "Skeleton overlay rendered for this keyframe.";
  }
}

export async function renderAnnotatedKeyframe(
  output: SampledFrameOutput
): Promise<{ preview?: ImageBitmap; overlay: PoseOverlayRenderResult } | undefined> {
  const canvas = document.createElement("canvas");
  const overlay = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  if (overlay.status === "unavailable") return { overlay };
  try {
    return { preview: await createImageBitmap(canvas), overlay };
  } catch {
    return { overlay };
  }
}

``````

### src/phase-review-renderer.ts

``````text
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

``````

### src/remote-model-renderer.ts

``````text
import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses
} from "./model-adapter-contract";
import { reviewedModelProviders } from "./model-consent";
import { formatRemoteDataClass } from "./render-utils";

export function renderRemoteModelReviewPanel(): string {
  const providerAvailable = reviewedModelProviders.length > 0;
  return `
    <section class="remote-model-panel" aria-labelledby="remote-model-heading">
      <div class="remote-model-panel__header">
        <div>
          <p class="placeholder-kicker">Optional remote review</p>
          <h4 id="remote-model-heading">Remote model review unavailable</h4>
        </div>
        <span class="stage-status">Off by default</span>
      </div>
      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
        <div>
          <dt>Provider registry</dt>
          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
        </div>
        <div>
          <dt>Would send after future consent</dt>
          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
        <div>
          <dt>Will not send in SS-013</dt>
          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
      </dl>
      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
    </section>
  `;
}

``````

### src/render-utils.ts

``````text
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return replacements[character] ?? character;
  });
}

export function formatRemoteDataClass(dataClass: string): string {
  return dataClass
    .split("-")
    .map((part, index) => (index > 0 && part === "and" ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

export function formatSwingCardWarning(warning: string): string {
  const labels: Record<string, string> = {
    NO_KEYFRAMES_SELECTED: "No keyframes were selected.",
    KEYFRAME_UNAVAILABLE: "One or more keyframes are unavailable.",
    METRICS_UNAVAILABLE: "Metrics are unavailable.",
    PHASE_REVIEW_REQUIRED: "Phase review is required before metrics should be interpreted.",
    PROMPT_LIMITED_EVIDENCE: "Evidence is limited; do not infer missing values."
  };
  return labels[warning] ?? warning;
}

``````

### src/swing-card-actions.ts

``````text
import type { AppState } from "./app-state";
import {
  getCompleteSwingCardAssignments,
  setSwingCardBusy,
  setSwingCardStatus
} from "./app-state";
import type { PhaseAssignment } from "./phase-review";
import { phaseDefinitions } from "./phase-review";
import type { SwingCardContent, SwingCardKeyframe } from "./swing-card-contract";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  triggerSwingCardDownload
} from "./swing-card-generator";
import type { SampledFrameOutput } from "./frame-processing";
import { renderAnnotatedKeyframe } from "./keyframe-overlay-renderer";

export interface PreparedSwingCardContent {
  content: SwingCardContent;
  release(): void;
}

export async function downloadSwingCard(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing local Swing Card PNG.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const result = await composeSwingCardPng(prepared.content);
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      setSwingCardStatus(state, "Swing Card PNG download started.");
    } else {
      setSwingCardStatus(state, `Swing Card PNG export stopped (${result.reason}).`);
    }
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function printSwingCard(
  root: ParentNode,
  state: AppState,
  requestRender: (statusMessage?: string) => void
): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing browser print view.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const host = root.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    setSwingCardStatus(state, "Browser print dialog opened. Save as PDF if your browser supports it.");
    window.print();
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function copySwingCardPrompt(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing prompt text.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    setSwingCardStatus(state, "Prompt copied for manual use.");
  } catch {
    setSwingCardStatus(state, "Prompt copy unavailable in this browser.");
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function prepareSwingCardContent(state: AppState): Promise<PreparedSwingCardContent> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments(state);

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? state.phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframeWithoutTiming(output) : undefined;
    if (rendered?.preview) createdBitmaps.push(rendered.preview);
    keyframes.push({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: rendered?.preview,
      overlay: rendered?.overlay
    });
  }

  const warnings = deriveSwingCardContentWarnings({
    keyframes,
    metricPayload: undefined,
    phaseReviewConfirmed: (state.phaseReviewState?.readyForFutureMetrics ?? false) && hasCompleteAssignments(assignments)
  });
  const base: SwingCardContent = {
    keyframes,
    metricPayload: undefined,
    warnings,
    analysisPrompt: ""
  };
  const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
  return {
    content,
    release: () => {
      for (const bitmap of createdBitmaps) bitmap.close();
    }
  };
}

async function renderAnnotatedKeyframeWithoutTiming(output: SampledFrameOutput) {
  return renderAnnotatedKeyframe(output);
}

function hasCompleteAssignments(assignments: readonly PhaseAssignment[] | undefined): boolean {
  return !!assignments;
}

``````

### scripts/verify-privacy-boundaries.js

``````text
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) {
    fail(`${path} is missing.`);
  }
  return readFileSync(path, "utf8");
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertHasTerms(text, terms, source, label) {
  const lower = text.toLowerCase();
  for (const term of terms) {
    if (!lower.includes(term.toLowerCase())) {
      fail(`${source} must include ${label}: ${term}`);
    }
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match prohibited privacy pattern: ${label}`);
  }
}

function listScannableFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listScannableFiles(path));
      continue;
    }

    if (/\.(html|js|jsx|ts|tsx|mjs|cjs)$/.test(path)) {
      files.push(path);
    }
  }
  return files;
}

const privacyDocPath = "docs/privacy-architecture.md";
const dispositionPath = "docs/ss-003-research-disposition.md";
const appSourcePaths = ["src/main.ts", "src/app-renderer.ts", "src/consent-state.ts"];
const packagePath = "package.json";
const indexPath = "index.html";
const privacyVerifierPath = "scripts/verify-privacy-boundaries.js";

const privacyDoc = readRequired(privacyDocPath);
const disposition = readRequired(dispositionPath);
const appSource = appSourcePaths.map((path) => readRequired(path)).join("\n");
const packageJson = JSON.parse(readRequired(packagePath));
const packageText = JSON.stringify(packageJson, null, 2);

for (const phrase of [
  "DRAFT - pending human/privacy review",
  "not legal advice",
  "separate, explicit opt-in",
  "Derived landmarks and metrics should be treated as sensitive user data",
  "must not promise",
  "Default analytical exports must not include raw swing video",
  "Exports must not be described as anonymous",
  "Optional remote sharing is not approved yet",
  "not device-level erasure"
]) {
  assertIncludes(privacyDoc, phrase, privacyDocPath);
}

assertHasTerms(
  privacyDoc,
  ["Raw swing video", "frame pixels", "must not be uploaded"],
  privacyDocPath,
  "raw media no-upload boundary"
);

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Defer",
  "Reject For Current Scope",
  "Source Checks",
  "Claude Review Checklist"
]) {
  assertIncludes(disposition, phrase, dispositionPath);
}

// Cross-check the current consent scaffold across its extracted runtime modules.
for (const phrase of [
  "explicit opt-in step you initiate",
  "Raw swing video stays on your",
  "Consent recorded locally"
]) {
  assertIncludes(appSource, phrase, appSourcePaths.join(", "));
}

const prohibitedClaims = [
  ["absolute privacy guarantee", /\b(guarantee[sd]?|ensure[sd]?)\s+(absolute|complete|total)\s+privacy\b/i],
  ["guaranteed local-only transit", /\bguarantee[sd]?\s+that\s+data\s+never\s+leaves\b/i],
  ["anonymous export claim", /\b(exports?|downloads?|swing cards?)\s+(are|is)\s+anonymous\b/i],
  ["forensic deletion guarantee", /\bguarantee[sd]?\s+.*\b(forensic|physical|permanent)\s+erasure\b/i],
  ["zero retention provider claim", /\bzero[- ]data[- ]retention\b/i],
  ["training-use provider guarantee", /\b(prohibited|forbidden)\s+from\s+.*\b(model\s+training|training)\b/i],
  ["secure storage absolute", /\b(secure|encrypted)\s+browser\s+storage\b/i]
];

for (const [label, pattern] of prohibitedClaims) {
  assertNotMatches(privacyDoc, pattern, privacyDocPath, label);
}

const prohibitedEndpointPatterns = [
  ["Google Analytics", /google-analytics\.com|googletagmanager\.com|gtag\(/i],
  ["DoubleClick", /doubleclick\.net/i],
  ["Amplitude", /amplitude\.com|amplitude-js|@amplitude\//i],
  ["Mixpanel", /mixpanel\.com|mixpanel-browser/i],
  ["Hotjar", /hotjar\.com|hotjar/i],
  ["Segment", /segment\.io|analytics-node|@segment\//i],
  // Blocked pending privacy review; not a permanent categorical ban.
  ["Sentry", /sentry\.io|@sentry\//i],
  ["FullStory", /fullstory\.com|@fullstory\//i]
];

const sourceFiles = [
  indexPath,
  ...listScannableFiles("src"),
  ...listScannableFiles("scripts").filter((path) => path !== privacyVerifierPath)
];

for (const [label, pattern] of prohibitedEndpointPatterns) {
  for (const sourcePath of sourceFiles) {
    assertNotMatches(readRequired(sourcePath), pattern, sourcePath, label);
  }
  assertNotMatches(packageText, pattern, packagePath, label);
}

console.log("Privacy architecture and boundary constraints verified.");

``````

### scripts/verify-safety-terms.js

``````text
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertNotIncludes(text, phrase, source) {
  if (text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must not include unsafe phrasing: ${phrase}`);
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match unsafe pattern: ${label}`);
  }
}

const safetyTermsPath = "docs/safety-terms.md";
const researchDispositionPath = "docs/ss-002-research-disposition.md";
const appSourcePaths = ["src/main.ts", "src/app-renderer.ts", "src/app-events.ts", "src/consent-state.ts"];
const safetyTerms = readFileSync(safetyTermsPath, "utf8");
const researchDisposition = readFileSync(researchDispositionPath, "utf8");
const appSource = appSourcePaths.map((path) => readFileSync(path, "utf8")).join("\n");
const combined = `${safetyTerms}\n${researchDisposition}\n${appSource}`;

for (const phrase of [
  "not legal advice",
  "educational",
  "not medical advice",
  "professional athletic instruction",
  "raw swing video must remain on the user's device by default",
  "consent gate",
  "assumption of risk",
  "release of liability",
  "prohibit diagnosing pain",
  "prohibit medical triage",
  "rehabilitation",
  "aggressive mechanical prescriptions",
  "defense-in-depth"
]) {
  assertIncludes(safetyTerms, phrase, safetyTermsPath);
}

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Reject For Current Draft",
  "Claude QA Handoff Checklist",
  "not legal advice",
  "approved implementation mandate"
]) {
  assertIncludes(researchDisposition, phrase, researchDispositionPath);
}

for (const phrase of [
  "localStorage",
  "swing-sync:safety-consent:v1",
  "not a durable or legally audited consent record",
  "explicit opt-in step you initiate",
  "physical risk I accept responsibility for",
  "Begin analysis",
  "stop if you feel pain",
  "qualified medical or coaching professionals",
  "Please acknowledge the safety terms before starting analysis"
]) {
  assertIncludes(appSource, phrase, appSourcePaths.join(", "));
}

for (const phrase of [
  "train through pain",
  "ignore pain",
  "diagnose your pain",
  "can diagnose",
  "provides medical advice",
  "guaranteed to prevent injury",
  "guaranteed improvement",
  "absolute ownership",
  "100% block rate",
  "rehab drill",
  "rotator cuff",
  "physical therapy exercises",
  "medical clearance",
  "medically cleared",
  "stretch to fix"
]) {
  assertNotIncludes(combined, phrase, "SS-002 safety content");
}

for (const [label, pattern] of [
  ["positive medical advice claim", /\b(provides?|offers?|gives?)\s+(medical|clinical)\s+advice\b/i],
  ["diagnosis capability claim", /\b(can|will|does)\s+diagnos(e|is)\b/i],
  ["injury prevention guarantee", /\bguarantee[sd]?\s+(to\s+)?(prevent|avoid)\s+injur/i],
  ["performance guarantee", /\bguarantee[sd]?\s+(performance|improvement|results?)\b/i],
  ["rehabilitation instruction", /\b(prescribes?|recommends?|gives?)\s+.*\b(rehab|rehabilitation|therapy)\b/i],
  ["unsafe pain compensation", /\b(swing|train|practice|move)\s+.*\b(through|despite|around)\s+pain\b/i]
]) {
  assertNotMatches(combined, pattern, "SS-002 safety content", label);
}

console.log("Safety terms and consent-gate constraints verified.");

``````

### test/unit/analysis-lifecycle.test.ts

``````text
import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import { createInitialAppState, selectWorkflowStep, setProcessingState } from "../../src/app-state";

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined
    });
    const abort = vi.fn();
    Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
      abortFrameController: abort
    });

    setProcessingState(state, "idle");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).not.toHaveBeenCalled();

    setProcessingState(state, "loading");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
  });

  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(
      lifecycle as unknown as {
        frameController?: { close: () => Promise<void> };
        abortFrameController?: (code: string) => void;
      },
      {
        frameController: { close },
        abortFrameController: vi.fn()
      }
    );
    setProcessingState(state, "processing");

    await lifecycle.closeActive();

    expect(close).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.processingState).toBe("idle");
  });

  it("stops active processing and requests an idle capture render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
      frameController: { cancel }
    });
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    await lifecycle.stopActive();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.activeStep).toBe("capture");
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
  });
});

``````

### test/unit/app-events.test.ts

``````text
import { describe, expect, it, vi } from "vitest";
import { bindAppEvents } from "../../src/app-events";
import { createInitialAppState } from "../../src/app-state";
import type { SafetyConsentStore } from "../../src/consent-state";

class FakeButton {
  private listeners: (() => void)[] = [];

  addEventListener(_event: "click", listener: () => void): void {
    this.listeners.push(listener);
  }

  click(): void {
    for (const listener of this.listeners) listener();
  }
}

class FakeRoot {
  constructor(private readonly button: FakeButton) {}

  querySelector(selector: string) {
    return selector === "[data-placeholder-action='camera']" ? this.button : null;
  }

  querySelectorAll() {
    return [];
  }
}

describe("app event binding", () => {
  it("binds fresh DOM after repeated renders without duplicate effects", () => {
    const requestRender = vi.fn();
    const consent: SafetyConsentStore = {
      hasSafetyConsent: () => false,
      setSafetyConsent: () => undefined
    };
    const dependencies = {
      state: createInitialAppState(),
      consent,
      lifecycle: {} as never,
      requestRender
    };

    const firstButton = new FakeButton();
    bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
    firstButton.click();
    expect(requestRender).toHaveBeenCalledTimes(1);

    const secondButton = new FakeButton();
    bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
    secondButton.click();
    expect(requestRender).toHaveBeenCalledTimes(2);
  });
});

``````

### test/unit/app-renderer.test.ts

``````text
import { describe, expect, it } from "vitest";
import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
import {
  createInitialAppState,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "../../src/app-state";

class FakeElement {
  innerHTML = "";
  textContent = "";
  hidden = false;
  private readonly selectors = new Map<string, FakeElement>();

  querySelector<T>(_selector: string): T | null {
    return (this.selectors.get(_selector) ?? null) as T | null;
  }

  set(selector: string, element: FakeElement): void {
    this.selectors.set(selector, element);
  }
}

describe("app renderer contracts", () => {
  it("preserves protected capture selectors and escapes selected file names", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectLocalVideo(state, new File(["video"], `<bad "name">.mp4`, { type: "video/mp4" }));

    renderApp(root, state, true);

    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).toContain('id="video-file"');
    expect(root.innerHTML).toContain("Local video source");
    expect(root.innerHTML).toContain("&lt;bad &quot;name&quot;&gt;.mp4");
    expect(root.innerHTML).not.toContain(`<bad "name">.mp4`);
  });

  it("updates current processing DOM by re-querying targets and no-ops when absent", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");
    setProcessingProgress(state, 1, 8);

    const detachedSummary = new FakeElement();
    const oldRoot = new FakeElement();
    oldRoot.set("[data-pose-summary]", detachedSummary);
    updateProcessingProgressUi(oldRoot as unknown as ParentNode, state);
    expect(detachedSummary.textContent).toContain("1 of 8");

    setProcessingProgress(state, 2, 8);
    const visibleSummary = new FakeElement();
    const nextRoot = new FakeElement();
    nextRoot.set("[data-pose-summary]", visibleSummary);
    updateProcessingProgressUi(nextRoot as unknown as ParentNode, state);

    expect(visibleSummary.textContent).toContain("2 of 8");
    expect(detachedSummary.textContent).toContain("1 of 8");
    expect(() => updateProcessingProgressUi(new FakeElement() as unknown as ParentNode, state)).not.toThrow();
  });
});

``````

### test/unit/app-state.test.ts

``````text
import { describe, expect, it } from "vitest";
import {
  createInitialAppState,
  resetPhaseReview,
  selectCanBeginAnalysis,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState,
  setSwingCardBusy,
  setSwingCardStatus
} from "../../src/app-state";

function file(): File {
  return new File(["video"], "swing.mp4", { type: "video/mp4" });
}

describe("app state transitions", () => {
  it("keeps Begin analysis gating in one selector", () => {
    const state = createInitialAppState();

    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    selectLocalVideo(state, file());
    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(true);

    setProcessingState(state, "processing");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    setProcessingState(state, "idle");
    selectWorkflowStep(state, "review");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);
  });

  it("resets phase and Swing Card volatile state without clearing selected video", () => {
    const state = createInitialAppState();
    const selected = file();
    selectLocalVideo(state, selected);
    setSwingCardBusy(state, true);
    setSwingCardStatus(state, "Preparing prompt text.");
    state.phaseConfirmation = true;
    state.selectedKeyframeIndex = 3;

    resetPhaseReview(state);

    expect(state.selectedVideo).toBe(selected);
    expect(state.phaseConfirmation).toBe(false);
    expect(state.selectedKeyframeIndex).toBe(0);
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardStatus).toBe("Swing Card export is generated locally after review data exists.");
  });
});

``````

### test/unit/consent-state.test.ts

``````text
import { describe, expect, it } from "vitest";
import { consentStorageKey, createSafetyConsentStore, type ConsentStorage } from "../../src/consent-state";

function storage(initial?: string): ConsentStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  if (initial) values.set(consentStorageKey, initial);
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

describe("safety consent storage", () => {
  it("reads accepted and missing local acknowledgement state", () => {
    expect(createSafetyConsentStore(storage("accepted")).hasSafetyConsent()).toBe(true);
    expect(createSafetyConsentStore(storage()).hasSafetyConsent()).toBe(false);
  });

  it("stores and removes only the accepted acknowledgement value", () => {
    const fakeStorage = storage();
    const consent = createSafetyConsentStore(fakeStorage);

    consent.setSafetyConsent(true);
    expect(fakeStorage.values.get(consentStorageKey)).toBe("accepted");
    expect(consent.hasSafetyConsent()).toBe(true);

    consent.setSafetyConsent(false);
    expect(fakeStorage.values.has(consentStorageKey)).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed when reading local acknowledgement throws", () => {
    const consent = createSafetyConsentStore({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined,
      removeItem: () => undefined
    });

    expect(consent.hasSafetyConsent()).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed through the public query after set or remove failures", () => {
    const setFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => undefined
    });
    setFailure.setSafetyConsent(true);
    expect(setFailure.hasSafetyConsent()).toBe(false);

    const removeFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => undefined,
      removeItem: () => {
        throw new Error("blocked");
      }
    });
    removeFailure.setSafetyConsent(false);
    expect(removeFailure.hasSafetyConsent()).toBe(false);
  });
});

``````

### test/unit/render-utils.test.ts

``````text
import { describe, expect, it } from "vitest";
import { escapeHtml, formatRemoteDataClass, formatSwingCardWarning } from "../../src/render-utils";

describe("render utilities", () => {
  it("escapes user-controlled text through one canonical helper", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;"
    );
  });

  it("formats remote data classes and Swing Card warnings consistently", () => {
    expect(formatRemoteDataClass("warnings-and-limitations")).toBe("Warnings and Limitations");
    expect(formatSwingCardWarning("PHASE_REVIEW_REQUIRED")).toBe(
      "Phase review is required before metrics should be interpreted."
    );
  });
});

``````

### test/unit/swing-card-actions.test.ts

``````text
import { describe, expect, it } from "vitest";
import { createInitialAppState } from "../../src/app-state";
import { prepareSwingCardContent } from "../../src/swing-card-actions";

describe("swing card actions", () => {
  it("keeps observedSeekTimestampMs out of prepared export content", async () => {
    const prepared = await prepareSwingCardContent(createInitialAppState());

    try {
      expect(JSON.stringify(prepared.content)).not.toContain("observedSeekTimestampMs");
      expect(prepared.content.analysisPrompt).not.toContain("observedSeekTimestampMs");
    } finally {
      prepared.release();
    }
  });
});

``````

### .agents/skills/swing-sync-story-delivery/SKILL.md

``````text
---
name: swing-sync-story-delivery
description: Execute or coordinate a Swing Sync user story from Notion task selection through research/specification, implementation, Claude adversarial audit, pull request, merge, and post-merge context synchronization. Use for Swing Sync story kickoff, delivery, audit response, PR preparation, merge readiness, or task-status handoff work.
---

# Swing Sync Story Delivery

Deliver one accepted Swing Sync story while keeping repository, Notion, audit,
and release state aligned. Read `AGENTS.md` for durable repository boundaries
and `CONTEXT.md` for current state before proceeding.

## Compose Generic Skills

Use the existing generic skills instead of duplicating their guidance:

- Use `$multi-agent-sdlc-orchestration` for role boundaries, handoff contracts,
  observability decisions, and completion discipline.
- Use `$adversarial-review-handoff` to prepare Claude audit prompts.
- Use `$audit-response` to assess and resolve Claude findings.
- Use `$project-context-sync` when repository, PR, audit, merge, or next-task
  state changes.
- Use `$pr-prep` to inspect the diff and prepare or create a PR.
- Use `$app-scaffold-review` for UI, PWA, frontend, or application-shell
  stories.

## Run The Story

1. **Establish current state**
   - Start from updated `main` unless the user explicitly directs otherwise.
   - Read `CONTEXT.md`, inspect the worktree, and preserve unrelated changes.
   - Fetch the next Swing Sync Notion task. Confirm acceptance criteria,
     `Branch`, `Handshake Status`, and any existing `Pull Request`.
   - Use the Notion handshake values exactly:
     `0. Backlog`, `1. Spec Drafting (Gemini)`, `2. QA Planning (Claude)`,
     `3. In Development (ChatGPT)`, `4. Final Audit (Claude)`, `5. Done`.

2. **Classify and plan**
   - Identify whether the story is safety, privacy, legal, medical,
     AI-coaching, model-provider, or compliance-sensitive.
   - Draft a concise implementation plan before editing.
   - Keep current acceptance criteria separate from future work.

3. **Prepare sensitive-story specification**
   - Keep roles explicit: Gemini researches/specifies, Codex implements and
     verifies, and Claude audits and signs off.
   - Create a self-contained browser-chat Gemini prompt before implementation,
     normally `docs/ss-###-gemini-research-prompt.md`.
   - Treat Gemini output as research input, not authority. Verify important
     claims against primary sources and record broad recommendations as Adopt,
     Revise, Defer, or Reject in `docs/ss-###-research-disposition.md`.
   - Do not implement until blocking specification or QA findings are resolved.

4. **Implement and verify**
   - Implement only the accepted scope and preserve the boundaries in
     `docs/privacy-architecture.md`, `docs/safety-terms.md`,
     `docs/licensing.md`, and `docs/models-licensing.md`.
   - Run targeted checks first, then the build/compliance checks required by
     `AGENTS.md` and the changed surface.
   - Record commands and results. For runtime work, explicitly document whether
     observability was added, unchanged, or deferred.

5. **Audit and respond**
   - For sensitive stories, create a self-contained Claude audit prompt,
     normally `docs/ss-###-claude-audit-prompt.md`, and move the task to
     `4. Final Audit (Claude)` when implementation is ready.
   - Browser-chat prompts must embed required repository context because Gemini
     and Claude Chat do not have filesystem or GitHub access.
   - Every Claude prompt, including QA planning, final audit, and focused
     re-review prompts, must use the standard adversarial-review skeleton:
     Role, Stage, Scope, Context, Acceptance criteria, Protected boundaries,
     Relevant source contents or focused diff, Verification, Known non-goals,
     and Output required.
   - For source-sensitive review, summaries alone are insufficient. Include the
     exact relevant file contents or a complete focused diff for every file
     Claude must evaluate. If full files are too large, include the smallest
     complete coherent excerpts with file paths and state what was omitted and
     why.
   - For browser-chat audits, create the source packet as a durable artifact
     before handoff when the prompt cannot inline the full diff. Do not mark the
     audit handoff ready if the prompt only instructs the user to paste source
     later but no packet exists.
   - Resolve findings with `$audit-response`, rerun relevant verification, and
     obtain Claude PASS before claiming the sensitive story is Done.
   - After fixes, create a separate focused
     `docs/ss-###-claude-rereview-prompt.md` containing prior findings, applied
     fixes, relevant current snippets, verification, and a focused diff. Mark
     superseded prompt files with a clear do-not-paste redirect.
   - When Claude flags a gap that is likely to recur, update the story spec,
     test plan, and durable guidance before implementation resumes. Do not
     depend on the current chat thread as the only memory of the rule.
   - For source-sensitive audits, enumerate every changed tracked file in the
     prompt. Include the full focused diff for coordination files such as
     `CONTEXT.md` when they changed, or state exactly why a changed file is
     outside the audit scope.
   - For verifier changes, specify the shared registration/config mechanism
     before implementation. Prefer extending existing declarative config and
     injected file-reader paths over one-off checks. If cross-file assertions
     are needed, name them in the config and test source-read, target-read,
     failure, and positive paths.
   - For parser or extractor logic in verification scripts, add adversarial
     unit tests for source formatting, missing inputs, empty values, embedded
     delimiters, and fail-closed behavior. Named verbose test output should be
     available when the audit depends on coverage evidence.

6. **Prepare PR and synchronize**
   - Use `$pr-prep`; include scope, verification, risk, deferred work, audit
     evidence, and observability impact. Complete
     `.github/pull_request_template.md`.
   - Record the PR URL and accurate handshake state in Notion and `CONTEXT.md`.
   - Do not set `5. Done` before required audit, verification, PR, and merge
     state are accurately recorded.
   - After merge, update local `main`, synchronize `CONTEXT.md` and Notion, mark
     the task Done, and identify the next task and branch.
   - Treat PR creation, merge, and post-merge context synchronization as
     separate state changes. Record the PR URL before merge, then record the
     merge commit and final Notion `5. Done` state after merge.

## Learn From Feedback

Use audit and reviewer feedback as process input:

- Convert one-off findings into the smallest durable rule that would have
  prevented the issue.
- Put behavior-specific protection in tests or verification scripts when
  possible; put workflow-specific protection in `AGENTS.md`, this skill, or
  `CONTEXT.md`.
- Keep blocker fixes separate from non-blocking recommendations and future
  hardening so current acceptance criteria do not silently expand.
- When a new helper, verifier category, parser, or checklist is introduced
  during implementation, either add it to the reviewed spec and test evidence
  or defer it. Unreviewed "helpful" mechanisms create avoidable audit churn.
- For sensitive documentation stories, prefer a single source of truth plus
  automated non-duplication checks over duplicating security, privacy, or
  deployment values in prose.

## Enforce Swing Sync Gates

- Never upload raw swing video by default; require separate explicit opt-in
  before remote sharing.
- Do not implement model assets, SDKs, or providers before license, terms, and
  privacy review.
- Do not make absolute safety, privacy, deletion, legal, anonymity, or
  compliance claims.
- Do not claim completion when tests, audit findings, PR state, or Notion state
  disagree.

``````

### docs/ss-018-research-disposition.md

``````text
# SS-018 Research And Disposition

Date: 2026-07-04

Task: SS-018 Refactor frontend app shell into maintainable UI/state modules.

## Classification

SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
accessibility/test-selector-, and user-facing-behavior-sensitive.

This is a runtime refactor story. It must preserve consent gating, local video
selection, local pose processing, phase review, Swing Card export, remote model
review unavailable behavior, accessibility labels, smoke-test selectors,
local-first raw-media handling, provider/model registry behavior,
service-worker behavior, and exported data classes.

## Source Checks

- Swing Sync task page, checked 2026-07-04:
  https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
- Dedicated test case created 2026-07-04:
  https://app.notion.com/p/393834a0c8a68126b03deeb86d5d67fa
- Current app shell: `src/main.ts`.
- Existing workflow model: `src/workflow.ts`.
- Current smoke contract: `test/smoke/app.spec.ts`.
- Current local-first and no-default-upload boundary:
  `docs/privacy-architecture.md`.
- Current safety and consent-gate boundary: `docs/safety-terms.md`.
- Current package scripts and dependency baseline: `package.json`.

## Current `src/main.ts` Responsibilities

`src/main.ts` is currently 869 lines and owns all browser-shell orchestration:

- module imports and initial app boot;
- local acknowledgement storage through `swing-sync:safety-consent:v1`;
- mutable workflow/session state for selected video, active step, frame
  processing, phase review, selected keyframe, overlay state, and Swing Card
  export status;
- capture, processing, review, export, remote-review, and keyframe HTML
  rendering;
- event binding for consent, local video picker, workflow navigation,
  analysis start/stop/retry, phase declarations, phase correction, keyframe
  selection, and Swing Card actions;
- local frame-processing lifecycle integration with
  `createBrowserFrameController`;
- phase proposal/review state rebuilds;
- selected keyframe overlay rendering;
- Swing Card content preparation, PNG download, print host rendering, prompt
  copying, and generated bitmap release;
- `beforeunload`, `securitypolicyviolation`, and production service-worker
  registration listeners.

## Existing Protected DOM/Test Surface

Smoke tests and accessibility checks currently depend on these user-facing
labels, selectors, and states:

- headings: `Capture or choose your swing`, `Capture or upload`, `Processing`,
  `Review`, `Export`, `Downloadable summary`, and
  `Remote model review unavailable`;
- controls: `Use camera`, `Choose a video`, `Begin analysis`,
  `Stop local analysis`, `Retry local analysis`, `Review phase labels`,
  `Confirm phase review`, `Open Swing Card export`, `Download PNG`,
  `Print / Save as PDF`, `Copy prompt`, and `Remote review unavailable`;
- selectors: `#video-file`, `#analysis-button`, `[data-pose-summary]`,
  `[data-keyframe-canvas]`, `[data-overlay-status]`,
  `[data-keyframe-index]`, `[data-phase-index]`,
  `[data-confirm-phase-review]`, `[data-open-export]`,
  `[data-download-swing-card]`, `[data-print-swing-card]`,
  `[data-copy-swing-card-prompt]`, `[data-swing-card-status]`,
  `[data-swing-card-print-host]`, and `[data-remote-model-send]`;
- labels: `Local video source`, `Local pose processing`,
  `Selected local video`, `Swing phase assignments`, `View`, `Handedness`,
  `Horizontally mirrored`, `Swing Card contents`, `Swing Card warnings`,
  `Remote model data disclosure`, and `Select keyframe`;
- privacy/safety status strings used by tests, including local-only analysis
  status, storage failure behavior, no-sensitive-console-output assertions,
  external-network blocking, and volatile resource release after stop.

## Adopt

- Split `src/main.ts` into focused modules while keeping the current Vite
  TypeScript stack and direct DOM rendering approach.
- Keep `src/main.ts` as a thin bootstrap that imports styles, creates the app
  shell, renders the initial state, and registers global lifecycle listeners.
- Extract consent storage into a small module with injectable storage-like
  behavior so storage failure and removal-failure paths can be unit tested
  without browser smoke setup.
- Extract app state/session defaults into a module that centralizes initial
  values and reset behavior for phase review and Swing Card status.
- Require app state mutation to flow through named transition functions or a
  reducer-style API. Other modules should not mutate state fields directly.
- Add a shared `render-utils.ts` module for `escapeHtml`,
  `formatRemoteDataClass`, and `formatSwingCardWarning` so security-relevant
  escaping and protected-boundary formatting are not copy-pasted.
- Extract renderers into modules that return existing HTML strings and keep
  stable labels/selectors intact.
- Assign remote-review-unavailable rendering to an explicit
  `remote-model-renderer.ts` module because provider/model registry behavior is
  a protected boundary.
- Extract app-event binding into a controller module that receives state,
  rendering, and lifecycle dependencies rather than relying on unrelated
  global functions.
- Extract frame-analysis lifecycle handling so `start`, `stop`, `close`,
  progress, output, and state transitions have a clear boundary around
  `FrameProcessingController`.
- Give the analysis lifecycle explicit `closeActive()` and
  `abortWithNetworkBlocked()` exports for the `beforeunload` and
  `securitypolicyviolation` paths.
- Extract Swing Card actions/content preparation into an export controller
  module while preserving local-only generation and downloaded/printed/copied
  behavior.
- Add `observedSeekTimestampMs` export-exclusion regression coverage when
  Swing Card content preparation moves, because that field is carried on
  `SampledFrameOutput` but must stay out of exported/serialized content.
- Add focused unit tests for pure extracted state and consent behavior, plus
  renderer selector/label preservation where useful.
- Keep the existing smoke suite as the behavioral gate for the primary
  browser workflow.
- Keep observability unchanged. This refactor does not add logs, telemetry,
  analytics, remote logging, cloud diagnostics, hidden identifiers, persistent
  debug artifacts, or new operator diagnostics.
- Add no dependency, framework, bundle-license, notice, or SBOM changes.

## Revise Before Adoption

- Avoid a broad component framework or virtual DOM abstraction. The repo
  currently uses plain TypeScript, Vite, string renderers, and direct DOM
  event binding; SS-018 should improve maintainability inside that pattern.
- Avoid splitting every small helper into its own file. The useful boundary is
  behavior ownership: consent, app state, rendering, event wiring, analysis
  lifecycle, and export controls.
- Treat renderer tests as contract checks for labels/selectors and branching,
  not pixel or layout tests. Layout remains covered by existing smoke/mobile
  checks.
- Keep event-binding tests focused on pure transition helpers or injected
  dependencies where practical. Do not re-create the full Playwright workflow
  in unit tests.
- If extraction reveals a behavior bug, record it as a separate issue or
  explicit spec change before fixing it in SS-018.

## Defer

- Framework migration, router introduction, state-management libraries, and
  component libraries are deferred.
- Design refresh, visual changes, copy rewrites, and new user-facing workflow
  states are deferred.
- New remote review, provider registry, model-provider configuration, API,
  cloud storage, persistence, telemetry, analytics, remote logging, and debug
  artifact behavior is deferred.
- Service-worker registration changes are deferred.
- Exported data class changes are deferred.
- Additional browser network guards or runtime diagnostics are deferred unless
  a later reviewed story approves them.

## Reject For Current Scope

- Reject any behavior change to consent gating, local video selection, local
  pose processing, phase review, Swing Card export, or remote-review disabled
  behavior.
- Reject any change to runtime privacy posture, raw-media handling, remote
  sharing, provider/model registry behavior, service-worker behavior, or
  exported data classes.
- Reject telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or expanded console output.
- Reject new framework or dependency additions.
- Reject changing smoke-test selectors or accessibility labels unless Claude
  QA planning and the task acceptance criteria explicitly approve the change.

## Observability Decision

Runtime observability remains intentionally unchanged for SS-018. The story
refactors ownership boundaries and does not add new externally observable
runtime behavior. Existing local UI status text and sanitized stable error
codes remain the only user-visible diagnostics in scope.

## Claude QA Planning Round 1 Disposition

Claude QA planning returned FAIL with six blockers. Codex accepts all six as
valid and revised `docs/ss-018-preimplementation-spec.md` accordingly.

- B1: Accepted. The spec now requires `src/app-state.ts` to own state mutation
  through named transition functions or a reducer-style API. Other modules must
  not mutate state fields directly, and `selectCanBeginAnalysis` is the single
  selector for the `#analysis-button` enablement decision.
- B2: Accepted. The spec now adds `src/render-utils.ts` as the canonical home
  for `escapeHtml`, `formatRemoteDataClass`, and `formatSwingCardWarning`.
  Renderer modules must import these helpers instead of duplicating them.
- B3: Accepted. The spec now assigns remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display
  to `src/remote-model-renderer.ts`.
- B4: Accepted. The spec now requires unit coverage proving
  `observedSeekTimestampMs` is absent from every serialized/exported Swing
  Card content shape produced by the extracted Swing Card action module.
- B5: Accepted. The spec now requires `src/consent-state.ts` to accept an
  injectable storage interface while defaulting production construction to
  `window.localStorage`.
- B6: Accepted. The spec now requires `analysisLifecycle.closeActive()` for
  `beforeunload` and `analysisLifecycle.abortWithNetworkBlocked()` for
  `securitypolicyviolation`, preserving the loading/processing-only guard and
  abort code `UNEXPECTED_NETWORK_BLOCKED`.

Claude non-blocking recommendations were also incorporated where they reduced
future ambiguity without expanding runtime behavior: `src/app-events.ts` is now
required instead of optional, smoke tests are required after protected-boundary
extraction milestones when practical, `npm run docs:verify` is explicit in
final verification, and imperative canvas helpers are split into
`src/keyframe-overlay-renderer.ts` rather than mixed with pure HTML renderers.

## Claude QA Planning Round 2 Disposition

Claude focused B1-B6 re-review returned FAIL after closing B1-B6. Claude
introduced two new blockers created by the revised module split. Codex accepts
B7-B8 as valid and revised `docs/ss-018-preimplementation-spec.md`
accordingly.

- B7: Accepted. The spec now defines the render-to-rebind control loop:
  `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure
  passed to `src/app-events.ts`; state-changing handlers call it after
  transitions; `requestRender` fully replaces the `#app` subtree via
  `app-renderer.renderApp(...)`, calls `app-events.bindAppEvents(...)` on the
  fresh DOM, and redraws the selected keyframe canvas. Since the subtree is
  replaced, old listeners are discarded with old DOM nodes. The spec now
  requires repeated render/bind unit coverage proving a single click produces
  a single effect after multiple re-renders.
- B8: Accepted. The spec now states that `src/app-state.ts` holds only
  serializable or UI-derived session state, while `src/analysis-lifecycle.ts`
  owns non-serializable `FrameProcessingController` and abort callback handles
  as an explicit scoped exception to the direct-state-mutation ban. Lifecycle
  code must call app-state transition functions so derived UI state stays in
  sync after close/abort, and unit tests must cover handle clearing plus app
  state synchronization.

Claude non-blocking recommendations were incorporated: the duplicated
`confirmation/confirmation` wording was cleaned up in the focused prompt,
`selectCanBeginAnalysis` full-matrix tests are required, and consent storage
failure tests must prove the public consent query function fails closed.

## Claude QA Planning Round 3 Disposition

Claude focused B7-B8 re-review returned FAIL after closing B8. B7 remains open
because the prior plan left frame-processing progress DOM updates as an
unspecified partial-render bypass. Codex accepts the residual B7 finding as
valid and revised `docs/ss-018-preimplementation-spec.md` accordingly.

- B7 residual: Accepted. The spec now assigns processing-progress DOM updates
  to `src/app-renderer.ts` through
  `updateProcessingProgressUi(root, state)`. `src/analysis-lifecycle.ts` owns
  frame-processing callbacks and controller handles, but it must call
  app-state transition functions and delegate processing-panel DOM updates to
  `app-renderer.updateProcessingProgressUi(...)`; it must not cache progress
  DOM nodes or write progress/status text directly.
- `updateProcessingProgressUi(root, state)` must re-query current DOM targets
  such as `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]` on every tick, so progress updates survive any
  intervening full `requestRender(...)` replacement.
- Required B7 regression: trigger an intervening full render during active
  processing and assert the next progress/output tick updates the visible
  `[data-pose-summary]` rather than a detached node.
- Required B7/B8 composition regression: stop during processing, clear
  lifecycle controller handles, drive app-state to `idle`, then call
  `requestRender(...)` and assert the rendered UI reflects the idle/capture
  state.

Claude's non-blocking throttling recommendation is deferred. SS-018 preserves
the current eight-sample processing cadence; throttling progress ticks would be
a behavior/performance change only if future profiling proves it necessary.

## Claude QA Planning Round 4 Disposition

Claude focused residual B7 re-review returned PASS. B1-B8 are closed, no new
blockers were introduced, and SS-018 is cleared for implementation.

Claude noted three non-blocking recommendations, which Codex folded into
`docs/ss-018-preimplementation-spec.md` before implementation:

- `#app` root stability is now explicit: `requestRender(...)` replaces only
  children, so a root reference may be held across processing partial-update
  calls.
- `updateProcessingProgressUi(...)` must no-op when processing selectors are
  absent, covering close/abort timing around late callbacks.
- Dynamic progress/status writes in `updateProcessingProgressUi(...)` must use
  `textContent` or element properties. Future user-influenced HTML in that
  helper must use `render-utils.escapeHtml`.

Implementation audit evidence must include executed named tests, not summary
claims, for render/rebind single-effect behavior,
`observedSeekTimestampMs` export exclusion, consent fail-closed behavior,
escaping regression coverage, processing-progress reattachment after
intervening full render, stop-during-processing composition, and no-op
missing-selector behavior.

``````

### docs/ss-018-preimplementation-spec.md

``````text
# SS-018 Preimplementation Spec

Date: 2026-07-04

Status: Candidate spec for Claude QA planning. Do not implement the runtime
refactor until Claude QA planning passes or blocking findings are resolved and
re-reviewed.

## Story

Reduce `src/main.ts` orchestration pressure before the next UI feature wave.
Keep behavior unchanged while separating workflow rendering, state
transitions, export controls, consent handling, and analysis lifecycle into
clearer modules.

## Acceptance Criteria

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

## Protected Boundaries

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- Preserve `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, and `docs/models-licensing.md` boundaries.

## Target Files

Expected runtime files:

- Keep `src/main.ts` as the app bootstrap and global listener registration
  entry point.
- Add `src/app-state.ts` for state shape, initial state, and reset helpers.
- Add `src/consent-state.ts` for local acknowledgement storage helpers and
  fail-closed storage behavior.
- Add `src/render-utils.ts` as the single canonical home for shared rendering
  helpers: `escapeHtml`, `formatRemoteDataClass`, and
  `formatSwingCardWarning`.
- Add `src/app-renderer.ts` for top-level shell rendering and workflow panel
  dispatch, plus processing-panel partial update helpers.
- Add `src/phase-review-renderer.ts` for phase review, declaration controls,
  and keyframe review HTML.
- Add `src/keyframe-overlay-renderer.ts` for imperative canvas drawing helpers
  such as selected keyframe rendering and annotated keyframe bitmap creation.
- Add `src/remote-model-renderer.ts` for remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.
- Add `src/swing-card-actions.ts` for Swing Card preparation and local export
  actions.
- Add `src/analysis-lifecycle.ts` for frame-processing lifecycle state
  handlers around `FrameProcessingController`.
- Add `src/app-events.ts` for `bindInteractions` ownership and cross-module
  event wiring.

Expected tests:

- Add focused unit tests for `consent-state` fail-closed behavior.
- Add focused unit tests for `app-state` reset behavior, especially phase
  review and Swing Card status reset.
- Add full-matrix `selectCanBeginAnalysis` tests covering consent true/false,
  selected video present/absent, and active processing states so the canonical
  gate cannot drift.
- Add consent-state tests proving get/set/remove storage failures propagate
  through the public consent query function as a fail-closed not-consented
  result, not only that fake storage methods threw.
- Add focused renderer tests that verify protected selectors and labels remain
  present for capture, processing, review, export, and remote-review-disabled
  branches without requiring Playwright.
- Add focused Swing Card action tests that assert `observedSeekTimestampMs` is
  absent from every serialized/exported Swing Card content shape produced by
  the extracted export-preparation module.
- Add focused lifecycle tests that assert `securitypolicyviolation` still maps
  an active loading/processing session to `UNEXPECTED_NETWORK_BLOCKED`.
- Keep the smoke suite as the end-to-end behavior gate.

No dependency, framework, package lock, SBOM, license policy, notice, provider,
model, worker asset, service-worker, telemetry, analytics, remote logging,
backend, or cloud-storage file should change.

## Module Requirements

### `src/main.ts`

- Import `./styles.css`.
- Select `#app`.
- Instantiate app state and dependencies.
- Render the initial app.
- Register `beforeunload`, `securitypolicyviolation`, and production
  service-worker listeners with the same conditions as today.
- Call `analysisLifecycle.closeActive()` from `beforeunload`.
- Call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`; the lifecycle method must preserve the current
  loading/processing-only guard and abort code `UNEXPECTED_NETWORK_BLOCKED`.
- Own a small `requestRender(statusMessage?: string)` coordinator closure that
  calls `app-renderer.renderApp(...)`, fully replaces the `#app` subtree, calls
  `app-events.bindAppEvents(...)` on the fresh DOM, and then calls
  `keyframe-overlay-renderer.renderSelectedKeyframeCanvas(...)`.
- Preserve the `#app` root element itself. `requestRender(...)` replaces only
  its children, so a reference to the root may be safely passed across
  lifecycle partial-update calls.
- Avoid owning detailed HTML rendering, Swing Card content construction, or
  frame-processing lifecycle internals after extraction.

### `src/consent-state.ts`

- Export a small injectable storage interface:

```ts
export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
```

- Default production construction must use `window.localStorage`.
- Unit tests must pass fake storage objects directly; they must not require a
  real browser storage implementation.
- Preserve storage key `swing-sync:safety-consent:v1`.
- Preserve fail-closed behavior:
  - if `localStorage.getItem` throws, consent is treated as not accepted;
  - after a storage failure, consent checks return false;
  - if `localStorage.setItem` or `removeItem` throws, future consent checks
    return false.
- Store only the existing local acknowledgement value `accepted`.
- Do not upload, log, persist extra data, or create durable legal/privacy
  consent claims.
- Unit tests must cover accepted, missing, get failure, set failure, and
  remove failure paths, and must assert those failures are observable through
  the public consent query function as `false`.

### `src/app-state.ts`

- Define the mutable app state shape currently represented by top-level
  variables in `src/main.ts`.
- Own all state mutation through named transition functions or a reducer-style
  API. Other modules must not mutate state fields directly.
- Export explicit transition functions for current behaviors, including at
  least:
  - `selectWorkflowStep`;
  - `selectLocalVideo`;
  - `setProcessingState`;
  - `setProcessingProgress`;
  - `recordProcessingOutput`;
  - `completeProcessingWithOutputs`;
  - `resetPhaseReview`;
  - `rebuildPhaseReviewState`;
  - `setPhaseDeclaration`;
  - `setPhaseDraftAssignment`;
  - `setPhaseConfirmation`;
  - `confirmPhaseReview`;
  - `selectKeyframe`;
  - `setOverlayResult`;
  - `setSwingCardBusy`;
  - `setSwingCardStatus`.
- Export a selector such as `selectCanBeginAnalysis(state, consentAccepted)`
  as the single source for the `#analysis-button` enablement decision.
- Keep only serializable or UI-derived session state in `AppState`, including
  `processingState`, `poseStatusCode`, frame counts, landmark count, selected
  video metadata/reference, phase review state, selected keyframe index,
  overlay result, and Swing Card busy/status.
- Do not store non-serializable frame-analysis resource handles such as
  `FrameProcessingController` or the abort callback in `AppState`. Those live
  in `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- Provide an initial state helper with current defaults:
  - active step `capture`;
  - processing state `idle`;
  - zero frame and landmark counts;
  - empty phase outputs and draft assignments;
  - undeclared phase declarations;
  - selected keyframe index `0`;
  - Swing Card status `Swing Card export is generated locally after review
    data exists.`;
  - no selected video, controller, abort handler, pose status code, review
    state, overlay result, or busy export state.
- Unit tests must verify transition functions preserve existing behavior,
  including that reset helpers clear volatile phase/export state without
  changing unrelated workflow fields.
- Unit tests must enumerate `selectCanBeginAnalysis(state, consentAccepted)`
  across consent true/false, selected video present/absent, and active
  processing states. It should only enable the start action when consent is
  accepted, a selected local video exists, and the workflow is in the current
  allowed pre-analysis state.

### `src/render-utils.ts`

- Export one `escapeHtml` helper used by every string renderer for
  user-controlled text such as selected file names, warnings, and status
  strings.
- Export one `formatRemoteDataClass` helper for
  `src/remote-model-renderer.ts`; do not duplicate remote data class
  formatting in renderer modules.
- Export one `formatSwingCardWarning` helper for Swing Card panel rendering;
  do not duplicate warning-label mapping in renderer or action modules.
- Renderer modules must import these helpers from `src/render-utils.ts`.
- Unit tests must include at least one escaping regression proving
  user-controlled selected file names render escaped.

### Renderers

- Renderer modules may continue returning HTML strings. They should receive
  explicit state and derived dependencies rather than reading unrelated module
  globals.
- Preserve HTML escaping for user-controlled values by importing
  `escapeHtml` from `src/render-utils.ts`.
- Preserve all accessibility labels, status roles, button names, IDs, and
  `data-*` selectors currently used by `test/smoke/app.spec.ts`.
- Preserve remote-review unavailable copy, empty provider registry behavior,
  and outbound/blocked data class rendering from the existing model-consent
  modules through `src/remote-model-renderer.ts`.
- Renderer tests must directly assert every protected label and selector from
  `docs/ss-018-research-disposition.md` at least once in the branch where it
  appears. This is required minimum coverage, not an alternative to smoke
  tests.
- Keep pure HTML-string renderers separate from imperative canvas drawing.
  `src/phase-review-renderer.ts` owns phase-review/keyframe HTML;
  `src/keyframe-overlay-renderer.ts` owns canvas drawing and bitmap creation.
- `src/app-renderer.ts` owns processing-progress DOM updates through exported
  partial-update functions. `analysis-lifecycle.ts` must not mutate processing
  DOM nodes directly.
- Required processing partial-update API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `updateProcessingProgressUi` must re-query current DOM targets on each call
  using selectors such as `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]`; it must not cache element references across ticks.
  This keeps progress updates attached to the visible DOM after any
  intervening full `requestRender(...)` replacement.
- If the processing-panel selectors are absent, `updateProcessingProgressUi`
  must no-op rather than throw. This covers close/abort timing where a late
  callback arrives after the processing panel has been replaced.
- `updateProcessingProgressUi` must use `textContent` or element properties for
  dynamic status/progress writes. If future user-influenced HTML is added to
  this function, it must route through `render-utils.escapeHtml`.
- Unit tests must trigger an intervening full render during active processing
  and then assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- Unit tests must cover no-op behavior when processing selectors are absent.

### Analysis Lifecycle

- Preserve `createBrowserFrameController(video, selectedVideo, callbacks)` as
  the runtime path for local pose processing.
- Preserve progress, output, completed, failed, cancelled, and closed status
  text.
- Own frame-processing callbacks and controller handles, but delegate every
  processing-panel DOM update to `app-renderer.updateProcessingProgressUi(...)`
  after calling app-state transition functions. `analysis-lifecycle.ts` must
  not cache progress DOM nodes or write progress/status text directly.
- Preserve behavior where completed processing captures outputs, resets
  selected keyframe index, clears declarations, and rebuilds phase review.
- Preserve `securitypolicyviolation` abort behavior while loading or
  processing with code `UNEXPECTED_NETWORK_BLOCKED`.
- Export `closeActive()` for the `beforeunload` path.
- Export `abortWithNetworkBlocked()` for the `securitypolicyviolation` path.
  It must check current processing state and only abort when state is
  `loading` or `processing`, preserving current behavior.
- Preserve close/cancel behavior that releases volatile resources and clears
  controller references when appropriate.
- Lifecycle unit tests must cover active loading/processing abort,
  non-active idle/completed no-op behavior, and controller-reference clearing
  after close.
- After lifecycle-owned controller handles are closed or cleared, lifecycle
  code must call app-state transition functions so derived UI state remains in
  sync with the lifecycle state. Unit tests must prove close clears lifecycle
  controller handles and drives the expected app-state transition, rather than
  leaving either side stale.
- Add a compose test for the stop-during-processing path: user action calls
  lifecycle stop/close, controller handles are cleared, app-state reaches
  `idle`, and a subsequent `requestRender(...)` reflects the idle/capture UI.
- Do not add persistence, network calls, telemetry, logging, or debug
  artifacts.

### Swing Card Actions

- Preserve local content preparation from phase definitions and selected
  assignments.
- Preserve generated bitmap release behavior.
- Preserve PNG download, print-host rendering, and clipboard prompt copy
  status strings.
- Preserve raw-video exclusion and manual-sharing-only behavior.
- Preserve disabled/busy behavior for Swing Card controls.
- Do not change `SwingCardContent`, `SwingCardKeyframe`, outbound data class
  unions, or exported report contents.
- Do not copy `observedSeekTimestampMs` from `SampledFrameOutput` into
  `SwingCardContent`, prompt text, PNG/print content, clipboard content, or
  any serialized/exported value. SS-018 touches export preparation by moving
  it, so this exclusion must be asserted in new unit coverage.
- Unit tests must serialize or inspect every produced Swing Card content shape
  from the extracted module and assert `observedSeekTimestampMs` is absent.

### `src/app-events.ts`

- Own DOM event binding currently in `bindInteractions`.
- Export `bindAppEvents(root, dependencies)` as the only event-binding entry
  point.
- Receive state transition functions, consent helpers, `requestRender`
  callback,
  analysis lifecycle, phase-review actions, and Swing Card actions as explicit
  dependencies.
- After every state-changing transition, handler code must call
  `requestRender(statusMessage?)`. Frame-processing progress/output ticks are
  the only partial-update path, and they are owned by `analysis-lifecycle.ts`
  delegating to `app-renderer.updateProcessingProgressUi(...)`.
- `requestRender(statusMessage?)` is owned by the bootstrap coordinator in
  `src/main.ts`: it fully replaces the `#app` subtree via
  `app-renderer.renderApp(...)`, calls `bindAppEvents(...)` against the fresh
  subtree, and then redraws the selected keyframe canvas when present.
- Because each render replaces `#app.innerHTML`, old event listeners are
  discarded with the old DOM nodes. No explicit listener teardown is required
  for the current direct-DOM pattern. If a future implementation changes to
  persistent DOM nodes, it must add teardown or delegated-listener coverage in
  the same reviewed change.
- Do not mutate state fields directly; call `src/app-state.ts` transition
  functions.
- Do not duplicate `selectCanBeginAnalysis`; use the selector from
  `src/app-state.ts`.
- Unit tests must cover repeated render/bind cycles for at least one
  state-changing control and one Swing Card action: after two re-renders,
  triggering the control once must produce a single effect, not a duplicate
  listener effect.

## Migration Steps

1. Add `src/app-state.ts`, transition functions/selectors, and
   `src/consent-state.ts` with injectable storage. Run targeted unit tests.
2. Add `src/render-utils.ts` and extract pure renderers, including
   `src/remote-model-renderer.ts`, while keeping protected labels/selectors
   equivalent. Add `app-renderer.updateProcessingProgressUi(...)` and run
   renderer/partial-update contract tests.
3. Add `src/keyframe-overlay-renderer.ts` for canvas/bitmap helpers.
4. Extract `src/analysis-lifecycle.ts` with `closeActive()` and
   `abortWithNetworkBlocked()`. Run lifecycle tests including the CSP abort
   path.
5. Extract `src/swing-card-actions.ts` and add the
   `observedSeekTimestampMs` exclusion regression.
6. Extract `src/app-events.ts` and keep `src/main.ts` as bootstrap only.
7. Run `npm run test:smoke` after each protected-boundary extraction
   milestone: consent/app-state, remote-model rendering, analysis lifecycle,
   and Swing Card actions.
8. Keep any behavior bug discovered during extraction out of scope unless it
   becomes a documented blocker and receives focused QA review.

## Test Plan

Targeted unit tests:

- `npm run test:unit -- consent-state`
- `npm run test:unit -- app-state`
- `npm run test:unit -- render-utils`
- `npm run test:unit -- app-renderer`
- `npm run test:unit -- phase-review-renderer`
- `npm run test:unit -- remote-model-renderer`
- `npm run test:unit -- analysis-lifecycle`
- `npm run test:unit -- app-events`
- `npm run test:unit -- swing-card-actions`
- Existing related tests such as `npm run test:unit -- workflow`,
  `npm run test:unit -- phase-review`, and
  `npm run test:unit -- swing-card-generator` as changed surfaces require.

Browser smoke:

- `npm run test:smoke`
- Run after each protected-boundary extraction milestone when practical, and
  always before final audit handoff.

Required final verification:

- `npm run build`
- `npm run docs:verify`
- `npm run compliance:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

No dependency, bundle, license-policy, notice, or SBOM changes are expected. If
that changes, run `npm run license:audit`,
`npm run verify:bundle-license-fixture`, and `npm run sbom:generate` before PR
handoff.

Test evidence for the final audit must map named tests to acceptance criteria,
protected boundaries, and any QA blockers, especially selector/label
preservation, consent fail-closed behavior, local-first processing,
`securitypolicyviolation` fail-closed behavior, remote-review-disabled
behavior, render/rebind single-effect behavior, processing-progress
partial-update survival after intervening full render, lifecycle handle
ownership sync with app-state transitions, stop-during-processing render
composition, `observedSeekTimestampMs` export exclusion, and no
dependency/telemetry changes.

## Rollback Risk

The primary risk is behavioral drift caused by moving shared mutable state and
DOM event binding across modules. Keep the migration reversible by preserving
plain TypeScript modules, direct imports, existing public function behavior,
and current smoke-test selectors.

The fallback is to keep a smaller extraction if a proposed module boundary
adds complexity without reducing `src/main.ts` orchestration pressure.

## Audit Packet Requirements

Claude QA planning and final audit packets must be self-contained. Include:

- every changed tracked file, or a concrete rationale for omission;
- focused diffs or complete coherent excerpts for runtime modules under
  review;
- named test results mapped to acceptance criteria and any audit blockers;
- explicit observability decision;
- protected no-telemetry/no-remote/no-dependency boundaries.

## Observability Decision

SS-018 intentionally leaves runtime observability unchanged. No logs,
telemetry, analytics, remote logging, cloud diagnostics, hidden identifiers,
persistent debug artifacts, or new operator diagnostics should be added.

``````

### docs/ss-018-claude-qa-planning-prompt.md

``````text
# SS-018 Claude QA Planning Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-rereview-prompt.md` after Claude Round 1 returned FAIL
with B1-B6. Keep this file as the original QA planning record.

Paste this prompt into Claude for preimplementation QA planning. Claude Chat
does not have repository, filesystem, GitHub, or Notion access, so this prompt
is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Pre-implementation QA planning.

Scope: Review the SS-018 candidate refactor plan before any runtime app-shell
refactor is implemented. Your job is to find blockers, behavior-preservation
risks, missing test contracts, protected-boundary gaps, and fail-open
verification requirements.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. The current app runs
local video selection, local Pose Landmarker inference on sampled frames,
phase review, selected keyframe overlay review, and local Swing Card export.
Raw swing video is not uploaded by default. Remote model review is unavailable
because the production reviewed-provider registry is empty. Manual Swing Card
export and Copy prompt do not require provider configuration. There is no app
backend, account system, telemetry, analytics, remote logging, cloud storage,
or configured remote model provider in the current app.

SS-018 intent:
Reduce `src/main.ts` orchestration pressure before the next UI feature wave.
Keep behavior unchanged while separating workflow rendering, state
transitions, export controls, consent handling, and analysis lifecycle into
clearer modules.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- Preserve local-first privacy architecture, safety terms, licensing, and
  model-licensing boundaries.

Relevant current source contents:

File: `src/main.ts` responsibility summary
```
Current file length: 869 lines.

Top-level state:
- consent storage key `swing-sync:safety-consent:v1`
- `consentStorageFailed`
- `activeStep`
- `selectedVideo`
- `frameController`
- `abortFrameController`
- `processingState`
- `poseStatusCode`
- extracted/total frame counts
- latest landmark count
- phase outputs/declarations/review state/draft/confirmation
- selected keyframe index
- latest overlay result
- Swing Card busy/status

Current functions:
- `hasSafetyConsent`
- `setSafetyConsent`
- `escapeHtml`
- `renderWorkflowPanel`
- `renderPhaseReview`
- `renderSwingCardExport`
- `renderRemoteModelReviewPanel`
- `renderKeyframeOverlayReview`
- `renderDeclarationSelect`
- `formatRemoteDataClass`
- `renderApp`
- `bindInteractions`
- `handleProcessingState`
- `handleProcessingProgress`
- `handleProcessingOutput`
- `updateProcessingUi`
- `startFrameAnalysis`
- `stopFrameAnalysis`
- `closeFrameAnalysis`
- `rebuildPhaseReview`
- `clearPhaseReview`
- `renderSelectedKeyframeCanvas`
- `undeclaredPhaseDeclarations`
- `downloadSwingCard`
- `printSwingCard`
- `copySwingCardPrompt`
- `prepareSwingCardContent`
- `getCompleteSwingCardAssignments`
- `renderAnnotatedKeyframe`
- `formatSwingCardWarning`

Global listeners:
- initial `renderApp()`
- `beforeunload` closes frame analysis
- `securitypolicyviolation` aborts active loading/processing with
  `UNEXPECTED_NETWORK_BLOCKED`
- production-only service worker registration for `/sw.js`
```

File: `src/workflow.ts`
```
export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Capture or upload",
    status: "Ready for consent",
    description: "Choose how a future local analysis session will begin."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    status: "Local only",
    description: "Load the approved local pose model and process selected video frames."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    status: "No results",
    description: "Preview the stable layout for future swing feedback and metrics."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    status: "Local download",
    description: "Download a local Swing Card or open the browser print dialog."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
```

Protected smoke-test labels and selectors:
```
Headings:
- Capture or choose your swing
- Capture or upload
- Processing
- Review
- Export
- Downloadable summary
- Remote model review unavailable

Controls:
- Use camera
- Choose a video
- Begin analysis
- Stop local analysis
- Retry local analysis
- Review phase labels
- Confirm phase review
- Open Swing Card export
- Download PNG
- Print / Save as PDF
- Copy prompt
- Remote review unavailable

Selectors:
- #video-file
- #analysis-button
- [data-pose-summary]
- [data-keyframe-canvas]
- [data-overlay-status]
- [data-keyframe-index]
- [data-phase-index]
- [data-confirm-phase-review]
- [data-open-export]
- [data-download-swing-card]
- [data-print-swing-card]
- [data-copy-swing-card-prompt]
- [data-swing-card-status]
- [data-swing-card-print-host]
- [data-remote-model-send]

Accessible labels:
- Local video source
- Local pose processing
- Selected local video
- Swing phase assignments
- View
- Handedness
- Horizontally mirrored
- Swing Card contents
- Swing Card warnings
- Remote model data disclosure
- Select keyframe
```

Current smoke coverage summary:
```
test/smoke/app.spec.ts verifies:
- opening capture flow and analysis disabled until consent and selected video;
- local consent storage unavailable and removal-failure paths fail closed;
- runtime consent guard focuses acknowledgement when disabled state is bypassed;
- placeholder states for processing, review, and export;
- local worker processing extracts 8 of 8 fixture frames and avoids external
  network requests, sensitive console output, IndexedDB, and Cache storage;
- accessible phase review, keyframe canvas labels, overlay status, and valid
  nondecreasing phase correction;
- Swing Card PNG download, print, prompt copy success and failure states;
- remote model review remains unavailable with empty reviewed-provider
  registry and expected outbound/blocked data class text;
- Swing Card keyframes remain unavailable until phase review is complete;
- pose model initialization failure, retry, cancel, and unexpected-network
  failure behavior;
- mobile layout keeps key controls visible and non-overlapping.
```

File: `docs/privacy-architecture.md` boundary excerpt
```
Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.
```

File: `docs/safety-terms.md` consent boundary excerpt
```
Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.
```

Candidate module plan:
- Keep `src/main.ts` as thin bootstrap for styles, app creation, initial render,
  global listeners, and production service-worker registration.
- Add `src/app-state.ts` for app state shape, initial state, and reset helpers.
- Add `src/consent-state.ts` for local acknowledgement storage and fail-closed
  behavior.
- Add `src/app-renderer.ts` for top-level shell rendering and workflow panel
  dispatch.
- Add `src/phase-review-renderer.ts` for phase review, declaration controls,
  and keyframe review HTML.
- Add `src/swing-card-actions.ts` for Swing Card preparation and local export
  actions.
- Add `src/analysis-lifecycle.ts` for frame-processing lifecycle state
  handlers around `FrameProcessingController`.
- Optionally add `src/app-events.ts` if event binding remains large after
  renderer and lifecycle extraction.

Candidate unit-test plan:
- Add `test/unit/consent-state.test.ts` for accepted, missing, get failure,
  set failure, and remove failure paths.
- Add `test/unit/app-state.test.ts` for initial defaults and phase/export reset
  behavior.
- Add `test/unit/app-renderer.test.ts` or focused renderer tests for protected
  selectors and labels across capture, processing, review, export, and
  remote-review-disabled branches.
- Continue relying on `test/smoke/app.spec.ts` for browser behavior,
  local-processing, no-network, storage, canvas, export, mobile, and
  accessibility checks.

Required final verification after implementation:
- targeted unit tests for extracted logic;
- `npm run test:smoke`;
- `npm run build`;
- `npm run compliance:verify`;
- `npm run safety:verify`;
- `npm run privacy:verify`;
- `git diff --check`.

No dependency, bundle, license-policy, notice, or SBOM changes are expected. If
that changes, the implementation must also run `npm run license:audit`,
`npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Output required:
- PASS/FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Any behavior-preservation risks in the proposed module boundaries.
- Any protected-boundary risks around privacy, safety, remote sharing,
  provider registry, service worker, exported data classes, dependencies, or
  observability.
- Explicit sign-off status for whether implementation may begin.
```

``````

### docs/ss-018-claude-qa-response.md

``````text
# SS-018 Claude QA Planning Response

Date: 2026-07-04

Stage: Pre-implementation QA planning.

Verdict: FAIL.

Claude found the refactor intent sound, but identified six blockers in the
module ownership plan. Codex accepts all six blockers as valid planning defects
and revised `docs/ss-018-preimplementation-spec.md` before implementation.

## Blockers

### B1: Missing State-Mutation Ownership Contract

Claude finding: `app-state.ts` had no explicit contract for whether consuming
modules mutate shared fields directly or use named transitions.

Disposition: Accepted.

Spec response:

- `src/app-state.ts` must own all state mutation through named transition
  functions or a reducer-style API.
- Other modules must not mutate state fields directly.
- The spec names required transition functions for workflow selection, local
  video selection, processing state/progress/output, phase review, keyframe
  selection, overlay result, and Swing Card busy/status.
- `selectCanBeginAnalysis(state, consentAccepted)` is now the single source
  for the `#analysis-button` enablement decision.

### B2: Shared Render Helpers Had No Owner

Claude finding: `escapeHtml`, `formatRemoteDataClass`, and
`formatSwingCardWarning` could be duplicated across renderer modules.

Disposition: Accepted.

Spec response:

- Added `src/render-utils.ts` as the canonical home for those helpers.
- Renderer/action modules must import helpers from `src/render-utils.ts`.
- Added a required escaping regression for user-controlled selected file names.

### B3: Remote-Review-Unavailable Rendering Was Unassigned

Claude finding: `renderRemoteModelReviewPanel` was not assigned to a target
module even though provider/model registry behavior is a protected boundary.

Disposition: Accepted.

Spec response:

- Added `src/remote-model-renderer.ts` for remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.

### B4: Missing `observedSeekTimestampMs` Export-Exclusion Test

Claude finding: moving `prepareSwingCardContent` into `swing-card-actions.ts`
touches a path that must keep `observedSeekTimestampMs` out of exported Swing
Card content.

Disposition: Accepted.

Spec response:

- Added required Swing Card action unit tests that serialize or inspect every
  produced Swing Card content shape and assert `observedSeekTimestampMs` is
  absent.
- The spec explicitly forbids copying `observedSeekTimestampMs` into
  `SwingCardContent`, prompt text, PNG/print content, clipboard content, or
  any serialized/exported value.

### B5: Consent Storage Injection Was Not Explicit

Claude finding: consent failure-path unit tests depend on injectable storage,
but the spec did not require it.

Disposition: Accepted.

Spec response:

- Added an explicit `ConsentStorage` interface with `getItem`, `setItem`, and
  `removeItem`.
- Production construction defaults to `window.localStorage`.
- Unit tests must pass fake storage objects directly.

### B6: Global Lifecycle Handler Contract Was Unspecified

Claude finding: `beforeunload` and `securitypolicyviolation` are
security/privacy-relevant global paths, but the plan did not name the exported
lifecycle methods `main.ts` should call after extraction.

Disposition: Accepted.

Spec response:

- `main.ts` must call `analysisLifecycle.closeActive()` from `beforeunload`.
- `main.ts` must call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`.
- `abortWithNetworkBlocked()` must preserve the current loading/processing-only
  guard and abort code `UNEXPECTED_NETWORK_BLOCKED`.
- Lifecycle unit tests must cover active loading/processing abort, inactive
  no-op behavior, and controller-reference clearing after close.

## Non-Blocking Recommendations Incorporated

- `src/app-events.ts` is now required instead of optional.
- `npm run test:smoke` is required after protected-boundary extraction
  milestones when practical.
- `npm run docs:verify` is explicit in required final verification.
- Imperative canvas helpers are assigned to `src/keyframe-overlay-renderer.ts`
  instead of being mixed into pure HTML renderers.
- Renderer contract tests must directly assert every protected label/selector
  at least once where it appears.

## Current Gate

Implementation remains blocked pending focused Claude B1-B6 re-review PASS.

``````

### docs/ss-018-claude-qa-rereview-prompt.md

``````text
# SS-018 Claude QA B1-B6 Re-Review Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-b7-b8-rereview-prompt.md` after Claude Round 2 closed
B1-B6 and returned FAIL with B7-B8. Keep this file as the Round 2 re-review
record.

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 1 FAIL.

Scope: Re-review only whether the SS-018 plan now closes Round 1 blockers
B1-B6 without introducing new planning blockers. Do not re-audit unrelated
future implementation details unless the revised plan creates a new blocker.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. SS-018 is a runtime
refactor story to reduce `src/main.ts` orchestration pressure while preserving
current behavior. Raw swing video is not uploaded by default. Remote model
review remains unavailable because the production reviewed-provider registry is
empty. There is no app backend, telemetry, analytics, remote logging, cloud
storage, or configured remote model provider in the current app.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

Prior Round 1 findings and applied plan fixes:

B1: No state-mutation ownership contract.
Applied fix:
- `src/app-state.ts` must own all state mutation through named transition
  functions or a reducer-style API.
- Other modules must not mutate state fields directly.
- Required transition functions are named for workflow selection, local video
  selection, processing state/progress/output, processing completion, phase
  reset/rebuild/declarations/draft/confirmation, keyframe
  selection, overlay result, and Swing Card busy/status.
- `selectCanBeginAnalysis(state, consentAccepted)` is the single source for
  the `#analysis-button` enablement decision.

B2: Shared render helpers had no assigned home.
Applied fix:
- `src/render-utils.ts` is the canonical home for `escapeHtml`,
  `formatRemoteDataClass`, and `formatSwingCardWarning`.
- Renderer modules must import these helpers from `src/render-utils.ts`.
- Unit tests must include at least one escaping regression proving
  user-controlled selected file names render escaped.

B3: Remote-review-unavailable rendering had no assigned module.
Applied fix:
- `src/remote-model-renderer.ts` owns remote-review-unavailable rendering,
  empty-provider registry disclosure, and outbound/blocked data class display.

B4: `observedSeekTimestampMs` exclusion had no export-module regression test.
Applied fix:
- `src/swing-card-actions.ts` must not copy `observedSeekTimestampMs` from
  `SampledFrameOutput` into `SwingCardContent`, prompt text, PNG/print
  content, clipboard content, or any serialized/exported value.
- New Swing Card action tests must serialize or inspect every produced Swing
  Card content shape from the extracted module and assert
  `observedSeekTimestampMs` is absent.

B5: Consent storage access was not specified as injectable.
Applied fix:
- `src/consent-state.ts` exports an injectable `ConsentStorage` interface with
  `getItem`, `setItem`, and `removeItem`.
- Production construction defaults to `window.localStorage`.
- Unit tests pass fake storage objects directly and cover accepted, missing,
  get failure, set failure, and remove failure paths.

B6: Cross-module contract for `beforeunload` and `securitypolicyviolation` was
unspecified.
Applied fix:
- `main.ts` must call `analysisLifecycle.closeActive()` from `beforeunload`.
- `main.ts` must call `analysisLifecycle.abortWithNetworkBlocked()` from
  `securitypolicyviolation`.
- `abortWithNetworkBlocked()` must check current processing state and only
  abort when state is `loading` or `processing`, preserving abort code
  `UNEXPECTED_NETWORK_BLOCKED`.
- Lifecycle unit tests must cover active loading/processing abort,
  non-active idle/completed no-op behavior, and controller-reference clearing
  after close.

Other incorporated recommendations:
- `src/app-events.ts` is required, not optional, for DOM event binding.
- `src/keyframe-overlay-renderer.ts` owns imperative canvas/bitmap helpers,
  while `src/phase-review-renderer.ts` owns pure phase-review/keyframe HTML.
- Renderer tests must directly assert every protected label and selector at
  least once in the branch where it appears.
- `npm run test:smoke` must run after protected-boundary extraction milestones
  when practical and before final audit.
- Final verification explicitly includes `npm run docs:verify`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run build`, `npm run test:smoke`, targeted
  unit tests, and `git diff --check`.

Relevant revised target modules:
- `src/main.ts`: bootstrap and global listener registration only.
- `src/app-state.ts`: state shape, initial state, selectors, and named
  transitions/reducer-style API.
- `src/consent-state.ts`: injectable local acknowledgement storage and
  fail-closed behavior.
- `src/render-utils.ts`: shared escaping and formatting helpers.
- `src/app-renderer.ts`: top-level shell and workflow dispatch.
- `src/phase-review-renderer.ts`: phase review, declaration controls, and
  keyframe HTML.
- `src/keyframe-overlay-renderer.ts`: selected keyframe canvas drawing and
  annotated keyframe bitmap creation.
- `src/remote-model-renderer.ts`: remote-review-unavailable panel and data
  class disclosure.
- `src/swing-card-actions.ts`: Swing Card content preparation and local export
  actions.
- `src/analysis-lifecycle.ts`: frame-processing lifecycle and global handler
  methods.
- `src/app-events.ts`: DOM event binding and cross-module event wiring.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Verification so far:
- Planning/spec-only changes.
- No runtime implementation has started.
- `git diff --check` will be run after this focused prompt is finalized.

Output required:
- PASS/FAIL verdict.
- For each prior blocker B1-B6, state closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```

``````

### docs/ss-018-claude-qa-rereview-response.md

``````text
# SS-018 Claude QA Focused Re-Review Response

Date: 2026-07-04

Stage: Focused pre-implementation QA re-review after Round 1 FAIL.

Verdict: FAIL.

Claude closed B1-B6 and introduced two new blockers, B7-B8. Codex accepts both
new blockers as valid planning defects and revised
`docs/ss-018-preimplementation-spec.md` before implementation.

## Closed Findings

- B1: Closed. State mutation ownership through named transitions and
  `selectCanBeginAnalysis(state, consentAccepted)` is accepted.
- B2: Closed. `src/render-utils.ts` is accepted as canonical shared render
  helper ownership.
- B3: Closed. `src/remote-model-renderer.ts` is accepted as the
  remote-review-unavailable owner.
- B4: Closed. Required `observedSeekTimestampMs` export-exclusion coverage is
  accepted.
- B5: Closed. Injectable `ConsentStorage` is accepted.
- B6: Closed. `closeActive()` and `abortWithNetworkBlocked()` lifecycle
  methods are accepted.

## New Blockers

### B7: Render-To-Rebind Control Loop Unspecified

Claude finding: splitting rendering into `app-renderer.ts` and event binding
into `app-events.ts` did not specify who triggers re-render after transitions
or how listener reattachment avoids stale UI or double-fired actions.

Disposition: Accepted.

Spec response:

- `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure.
- `src/app-events.ts` receives `requestRender` as an explicit dependency and
  calls it after every state-changing transition unless existing behavior only
  updates current processing DOM through lifecycle progress handlers.
- `requestRender` calls `app-renderer.renderApp(...)`, fully replaces the
  `#app` subtree, calls `app-events.bindAppEvents(...)` on the fresh DOM, and
  redraws the selected keyframe canvas when present.
- Because the subtree is replaced, old listeners are discarded with old nodes;
  no explicit teardown is required for the current direct-DOM pattern.
- Unit tests must cover repeated render/bind cycles and prove a single
  interaction produces a single effect after multiple re-renders.

### B8: Non-Serializable Frame Controller Handle Ownership Ambiguous

Claude finding: B1's app-state ownership rule conflicted with B6 lifecycle
tests because `frameController` and `abortFrameController` are live resource
handles that may not belong in reducer-style state.

Disposition: Accepted.

Spec response:

- `src/app-state.ts` holds only serializable or UI-derived session state.
- `FrameProcessingController` and abort callback handles are owned by
  `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- Lifecycle code must call app-state transition functions so derived UI state
  remains synchronized after close/abort.
- Unit tests must prove close clears lifecycle controller handles and drives
  the expected app-state transition.

## Non-Blocking Recommendations Incorporated

- Cleaned up duplicated `confirmation/confirmation` wording.
- Required full-matrix `selectCanBeginAnalysis` unit tests.
- Required consent storage failure tests proving the public consent query
  function fails closed after get/set/remove failures.

## Current Gate

Implementation remains blocked pending focused Claude B7-B8 re-review PASS.

``````

### docs/ss-018-claude-qa-b7-b8-rereview-prompt.md

``````text
# SS-018 Claude QA B7-B8 Re-Review Prompt

Superseded for paste use by
`docs/ss-018-claude-qa-b7-rereview-prompt.md` after Claude Round 3 closed B8
and returned FAIL on residual B7. Keep this file as the Round 3 re-review
record.

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 2 FAIL.

Scope: Re-review only whether the SS-018 plan now closes B7-B8 without
introducing new planning blockers. B1-B6 were closed in Round 2.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. SS-018 is a runtime
refactor story to reduce `src/main.ts` orchestration pressure while preserving
current behavior. Raw swing video is not uploaded by default. Remote model
review remains unavailable because the production reviewed-provider registry is
empty. There is no app backend, telemetry, analytics, remote logging, cloud
storage, or configured remote model provider in the current app.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

B1-B6 status from prior re-review:
- B1 state-mutation ownership: closed.
- B2 shared render helpers: closed.
- B3 remote-review rendering ownership: closed.
- B4 `observedSeekTimestampMs` export exclusion: closed.
- B5 injectable consent storage: closed.
- B6 global listener to lifecycle contract: closed.

Prior Round 2 findings and applied plan fixes:

B7: Render-to-rebind control-loop ownership was unspecified.
Applied fix:
- `src/main.ts` owns a `requestRender(statusMessage?)` coordinator closure.
- `src/app-events.ts` receives `requestRender` as an explicit dependency.
- After every state-changing transition, event handlers call
  `requestRender(statusMessage?)` unless the existing behavior only updates
  current processing DOM through lifecycle progress handlers.
- `requestRender` calls `app-renderer.renderApp(...)`, fully replaces the
  `#app` subtree, calls `app-events.bindAppEvents(...)` against the fresh DOM,
  and then calls `keyframe-overlay-renderer.renderSelectedKeyframeCanvas(...)`
  when a keyframe canvas is present.
- Because each render replaces `#app.innerHTML`, old event listeners are
  discarded with old DOM nodes. No explicit listener teardown is required for
  the current direct-DOM pattern. If a future implementation changes to
  persistent DOM nodes, it must add teardown or delegated-listener coverage in
  the same reviewed change.
- Unit tests must cover repeated render/bind cycles for at least one
  state-changing control and one Swing Card action: after two re-renders,
  triggering the control once must produce a single effect, not a duplicate
  listener effect.

B8: Ownership of `frameController` and `abortFrameController` as
non-serializable resource handles was ambiguous against the B1 state contract.
Applied fix:
- `src/app-state.ts` keeps only serializable or UI-derived session state:
  `processingState`, `poseStatusCode`, frame counts, landmark count, selected
  video metadata/reference, phase review state, selected keyframe index,
  overlay result, and Swing Card busy/status.
- `src/app-state.ts` does not store non-serializable frame-analysis resource
  handles such as `FrameProcessingController` or the abort callback.
- `FrameProcessingController` and abort callback handles live in
  `src/analysis-lifecycle.ts` as an explicit scoped exception to the
  direct-state-mutation ban.
- After lifecycle-owned controller handles are closed or cleared, lifecycle
  code must call app-state transition functions so derived UI state remains in
  sync with lifecycle state.
- Unit tests must prove close clears lifecycle controller handles and drives
  the expected app-state transition, rather than leaving either side stale.

Additional test-plan clarifications:
- `selectCanBeginAnalysis(state, consentAccepted)` must have full-matrix unit
  tests for consent true/false, selected video present/absent, and active
  processing states.
- Consent storage get/set/remove failure tests must prove the public consent
  query function returns false, not merely that fake storage methods throw.
- `src/app-events.ts` has a targeted unit test command:
  `npm run test:unit -- app-events`.
- Final audit evidence must map named tests to render/rebind single-effect
  behavior and lifecycle handle ownership sync.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Verification so far:
- Planning/spec-only changes.
- No runtime implementation has started.
- `git diff --check` will be run after this focused prompt is finalized.

Output required:
- PASS/FAIL verdict.
- For B7 and B8, state closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```

``````

### docs/ss-018-claude-qa-b7-rereview-response.md

``````text
# SS-018 Claude QA Focused B7/B8 Re-Review Response

Date: 2026-07-05

Stage: Focused pre-implementation QA re-review after Round 2 FAIL.

Verdict: FAIL.

Claude closed B8 and kept B7 open. Codex accepts the residual B7 finding as a
valid planning defect and revised `docs/ss-018-preimplementation-spec.md`
before implementation.

## Closed Finding

### B8: Controller-Handle Ownership

Status: Closed.

Claude accepted the plan that `src/app-state.ts` holds only serializable or
UI-derived fields while `src/analysis-lifecycle.ts` owns the non-serializable
`FrameProcessingController` and abort callback handles as a documented
exception to the app-state mutation rule.

## Open Finding

### B7: Processing Progress Partial-Update Ownership

Status: Still open in Claude Round 3; accepted by Codex.

Claude finding: the prior plan correctly specified the full render/rebind loop
for synchronous user-triggered transitions, but left a vague carve-out for
frame-processing progress/output ticks. That partial-update path could cache
detached DOM nodes or create a second renderer for processing-panel status.

Spec response:

- `src/app-renderer.ts` now owns processing-panel DOM partial updates.
- Required exported API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `src/analysis-lifecycle.ts` owns frame-processing callbacks and
  non-serializable controller handles, but after app-state transitions it must
  delegate processing-panel DOM updates to
  `app-renderer.updateProcessingProgressUi(...)`.
- `src/analysis-lifecycle.ts` must not cache processing DOM nodes or write
  progress/status text directly.
- `updateProcessingProgressUi` must re-query current DOM targets on each call,
  including `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]`, so updates continue to hit the visible DOM after any
  intervening full `requestRender(...)` replacement.
- Unit tests must trigger a full render during active processing and then
  assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- A composition test must cover stop during processing, controller handle
  clearing, app-state reaching `idle`, and a subsequent `requestRender(...)`
  reflecting the idle/capture UI.

## Non-Blocking Recommendation

Claude suggested considering progress-tick throttling. Codex defers this:
SS-018 preserves current behavior and the existing eight-sample processing
cadence. Throttling can be considered in a future performance story if
profiling shows a need.

## Current Gate

Implementation remains blocked pending focused Claude residual B7 re-review
PASS.

``````

### docs/ss-018-claude-qa-b7-rereview-prompt.md

``````text
# SS-018 Claude QA Residual B7 Re-Review Prompt

Paste this prompt into Claude for focused preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused pre-implementation QA re-review after Round 3 FAIL.

Scope: Re-review only whether the SS-018 plan now closes residual B7 without
introducing new planning blockers. B1-B6 were closed in Round 2. B8 was closed
in Round 3.

Context:
Swing Sync is a local-first Vite/TypeScript browser app. SS-018 is a runtime
refactor story to reduce `src/main.ts` orchestration pressure while preserving
current behavior. Raw swing video is not uploaded by default. Remote model
review remains unavailable because the production reviewed-provider registry is
empty. There is no app backend, telemetry, analytics, remote logging, cloud
storage, or configured remote model provider in the current app.

Acceptance criteria:
- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries:
- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

Prior status:
- B1 state-mutation ownership: closed.
- B2 shared render helpers: closed.
- B3 remote-review rendering ownership: closed.
- B4 `observedSeekTimestampMs` export exclusion: closed.
- B5 injectable consent storage: closed.
- B6 global listener to lifecycle contract: closed.
- B8 controller-handle ownership: closed.

Residual B7 finding:
The Round 2 plan specified the full render/rebind path, but left processing
progress/output updates as an unspecified partial-update bypass. Claude noted
that if lifecycle code caches DOM node references or mutates processing status
text directly, a full `requestRender(...)` between progress ticks could leave
the next tick writing to detached nodes or create a second processing-panel
renderer outside `app-renderer.ts`.

Applied B7 fix:
- `src/app-renderer.ts` owns processing-progress DOM updates through exported
  partial-update functions.
- Required API:

```ts
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void;
```

- `src/analysis-lifecycle.ts` owns frame-processing callbacks and controller
  handles, but it must delegate every processing-panel DOM update to
  `app-renderer.updateProcessingProgressUi(...)` after calling app-state
  transition functions.
- `src/analysis-lifecycle.ts` must not cache progress DOM nodes or write
  progress/status text directly.
- `updateProcessingProgressUi(root, state)` must re-query current DOM targets
  on each call using selectors such as `[data-pose-summary]`,
  `[data-retry-analysis]`, and `[data-review-phases]`.
- Re-querying on every tick is required so progress updates attach to the
  visible DOM after any intervening full `requestRender(...)` replacement.
- Unit tests must trigger an intervening full render during active processing
  and then assert the next progress/output tick updates the visible
  `[data-pose-summary]` text rather than a detached node.
- A composition test must cover stop during processing: user action calls
  lifecycle stop/close, controller handles are cleared, app-state reaches
  `idle`, and a subsequent `requestRender(...)` reflects the idle/capture UI.

Throttling note:
Progress-tick throttling is deferred. SS-018 preserves current behavior and
the existing eight-sample processing cadence; throttling can be considered in a
future performance story if profiling shows a need.

Known non-goals:
- No framework migration or new dependency.
- No design refresh, copy rewrite, or new user-facing workflow.
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud diagnostics, cloud storage, provider SDK, model provider, remote model
  review enablement, or remote sharing.
- No service-worker behavior change.
- No exported data class change.
- No additional console output, hidden identifiers, or persistent debug
  artifacts.

Observability decision:
Runtime observability remains intentionally unchanged. Existing local UI status
text and sanitized stable error codes remain the only diagnostics in scope.

Verification so far:
- Planning/spec-only changes.
- No runtime implementation has started.
- `git diff --check` will be run after this focused prompt is finalized.

Output required:
- PASS/FAIL verdict.
- State whether residual B7 is closed or still open.
- Any new blockers introduced by the revised plan.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether implementation may begin.
```

``````

### docs/ss-018-claude-qa-b7-pass-response.md

``````text
# SS-018 Claude QA Residual B7 Re-Review Response

Date: 2026-07-05

Stage: Focused pre-implementation QA re-review after Round 3 FAIL.

Verdict: PASS.

Claude closed residual B7. The full B1-B8 QA planning blocker set is closed,
and implementation may begin.

## Closed Finding

### B7: Processing Progress Partial-Update Ownership

Status: Closed.

Claude accepted that:

- `src/app-renderer.ts` is the sole owner of
  `updateProcessingProgressUi(root, state)`.
- `src/analysis-lifecycle.ts` delegates to the renderer helper and does not
  cache DOM nodes or write processing-panel text directly.
- `updateProcessingProgressUi(...)` re-queries visible DOM targets on every
  call, including `[data-pose-summary]`, `[data-retry-analysis]`, and
  `[data-review-phases]`.
- Required tests now cover an intervening full render during active processing
  followed by a progress tick updating live DOM, plus stop-during-processing
  composition across controller clearing, app-state `idle`, and subsequent
  render.
- Progress throttling remains deferred to preserve current eight-sample
  behavior.

## Non-Blocking Recommendations Folded Into Spec

- State that the `#app` root is stable and only its children are replaced.
- Specify that missing processing selectors are a no-op.
- Specify that dynamic progress/status writes use `textContent` or element
  properties, with future user-influenced HTML routed through
  `render-utils.escapeHtml`.

## Implementation Gate

Implementation may begin. Final implementation audit must include executed
named tests for render/rebind single-effect behavior,
`observedSeekTimestampMs` exclusion, consent fail-closed behavior, escaping
regression coverage, the B7 reattachment/composition tests, and required
`docs:verify`, `compliance:verify`, `safety:verify`, `privacy:verify`,
`test:smoke`, `build`, and `git diff --check` results.

``````

### docs/ss-018-claude-audit-prompt.md

``````text
# SS-018 Claude Implementation Audit Prompt

Do not treat any prior chat as authoritative. Audit only the packet below and
any complete file contents or diff pasted with it.

## Role

You are the lead adversarial auditor for Swing Sync.

## Stage

Implementation audit for SS-018 after Codex implementation and local
verification.

## Scope

Audit the SS-018 app-shell refactor on branch
`ss-018-frontend-architecture`.

The story intent is to reduce `src/main.ts` orchestration pressure before the
next UI feature wave while preserving existing user-facing behavior. The
refactor separates workflow rendering, state transitions, export controls,
consent handling, and analysis lifecycle into focused modules.

## Context

Swing Sync is a local-first golf swing analysis app. Runtime privacy and safety
boundaries are protected:

- Raw swing video is not uploaded by default.
- Remote sharing requires a separate explicit opt-in.
- Remote model review remains unavailable in the current app shell.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts may be added.
- Provider/model registry behavior, service-worker behavior, raw-media
  handling, and exported data classes must not change.
- User-facing coaching/safety language must remain bounded and avoid absolute
  medical, legal, deletion, anonymity, or compliance claims.

Claude QA planning previously failed and then passed after blockers B1-B8 were
resolved in the implementation plan. Implementation was not started until the
Round 4 QA planning PASS.

## Acceptance Criteria

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- Add no new framework or dependency unless separately reviewed and approved.

## Protected Boundaries

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

## Prior QA Planning Findings To Re-check

Confirm that the implementation actually satisfies the planning fixes:

- B1: `src/app-state.ts` owns state mutation through named transitions or
  selectors; other modules must not directly mutate state fields except through
  the documented lifecycle handle exception.
- B2: shared render helpers, especially `escapeHtml`, are canonical in
  `src/render-utils.ts`; renderer modules must not duplicate escaping logic.
- B3: remote-review-unavailable rendering is explicitly owned by
  `src/remote-model-renderer.ts` and does not alter provider/model registry
  behavior.
- B4: `observedSeekTimestampMs` is excluded from serialized/exported Swing
  Card content surfaces after export extraction.
- B5: consent storage uses an injectable storage interface and fails closed on
  get/set/remove errors.
- B6: `beforeunload` and `securitypolicyviolation` delegate to named lifecycle
  methods and preserve fail-closed `UNEXPECTED_NETWORK_BLOCKED` behavior.
- B7: render/rebind ownership is explicit. `src/main.ts` owns
  `requestRender(statusMessage?)`; `src/app-events.ts` calls it after
  state-changing handlers; `src/app-renderer.ts` owns
  `updateProcessingProgressUi(root, state)`, re-queries processing DOM targets
  on every tick, and no-ops on missing selectors. Lifecycle code must not cache
  progress DOM nodes or write processing UI text directly.
- B8: `src/app-state.ts` holds UI-derived/session state while
  `src/analysis-lifecycle.ts` owns non-serializable controller and abort
  handles as a scoped exception, then synchronizes back through app-state
  transitions.

## Implementation Summary

- `src/main.ts` is now a thin bootstrap/render coordinator.
- `src/app-state.ts` owns state shape, selectors, and named transitions.
- `src/consent-state.ts` owns injectable safety-consent storage and fail-closed
  consent reads/writes.
- `src/app-renderer.ts` owns workflow/export HTML rendering and the processing
  partial-update helper.
- `src/app-events.ts` owns DOM event binding and calls state transitions plus
  `requestRender`.
- `src/analysis-lifecycle.ts` owns frame-processing controller handles,
  lifecycle methods, global-handler methods, and delegates processing UI
  updates to `src/app-renderer.ts`.
- `src/keyframe-overlay-renderer.ts` owns imperative keyframe canvas drawing.
- `src/phase-review-renderer.ts` owns phase review rendering.
- `src/remote-model-renderer.ts` owns remote-review-unavailable rendering.
- `src/render-utils.ts` owns shared escaping and Swing Card warning/data-class
  formatting.
- `src/swing-card-actions.ts` owns Swing Card download, print, clipboard, and
  content preparation.
- `scripts/verify-safety-terms.js` and
  `scripts/verify-privacy-boundaries.js` were updated so safety/privacy
  verifiers follow the extracted app-shell modules.
- Runtime observability is intentionally unchanged.
- No dependency, framework, bundle, license-policy, notice, or SBOM changes
  were made.

## Changed-File Manifest

Runtime source files:

- `src/main.ts`
- `src/analysis-lifecycle.ts`
- `src/app-events.ts`
- `src/app-renderer.ts`
- `src/app-state.ts`
- `src/consent-state.ts`
- `src/keyframe-overlay-renderer.ts`
- `src/phase-review-renderer.ts`
- `src/remote-model-renderer.ts`
- `src/render-utils.ts`
- `src/swing-card-actions.ts`

Verifier files:

- `scripts/verify-privacy-boundaries.js`
- `scripts/verify-safety-terms.js`

Unit tests:

- `test/unit/analysis-lifecycle.test.ts`
- `test/unit/app-events.test.ts`
- `test/unit/app-renderer.test.ts`
- `test/unit/app-state.test.ts`
- `test/unit/consent-state.test.ts`
- `test/unit/render-utils.test.ts`
- `test/unit/swing-card-actions.test.ts`

Planning, audit, and context files:

- `.agents/skills/swing-sync-story-delivery/SKILL.md`
- `CONTEXT.md`
- `docs/ss-018-research-disposition.md`
- `docs/ss-018-preimplementation-spec.md`
- `docs/ss-018-claude-qa-planning-prompt.md`
- `docs/ss-018-claude-qa-response.md`
- `docs/ss-018-claude-qa-rereview-prompt.md`
- `docs/ss-018-claude-qa-rereview-response.md`
- `docs/ss-018-claude-qa-b7-b8-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-rereview-response.md`
- `docs/ss-018-claude-qa-b7-rereview-prompt.md`
- `docs/ss-018-claude-qa-b7-pass-response.md`
- `docs/ss-018-claude-audit-prompt.md`

The intentional untracked
`docs/agent-guidance/*new-codex-session-prompt.md` files predate SS-018 and are
not part of this audit.

## Source Packet Requirement

If this prompt is pasted into Claude Chat, paste
`docs/ss-018-claude-audit-source-packet.md` immediately after this prompt. That
packet contains the complete changed file contents for the runtime source,
verifier, unit-test, planning, audit, and context files listed in the manifest
above. Do not pass/fail from the summary alone.

Claude's first implementation-audit attempt returned no PASS/FAIL because only
this prompt was pasted and the source packet was omitted. Treat that as a
handoff defect already corrected by `docs/ss-018-claude-audit-source-packet.md`,
not as a runtime implementation finding.

For source-sensitive review, treat summaries as orientation only. The audit
should inspect the actual changed code for cross-module ownership violations,
selector/label regressions, privacy/safety boundary drift, and missing test
coverage.

## Verification Evidence

Executed local commands and results:

- `npm run test:unit -- consent-state app-state render-utils app-renderer app-events analysis-lifecycle swing-card-actions`
  passed: 7 files, 15 tests.
- `npm run test:unit` passed: 21 files, 176 tests.
- `npm run test:smoke` initially could not bind localhost in the managed
  sandbox and reported `listen EPERM: operation not permitted 127.0.0.1:4174`.
  The direct Playwright equivalent was rerun with approved local-server
  permissions:
  `DEBUG=pw:webserver node_modules/.bin/playwright test --reporter=line`
  passed: 32 desktop/mobile tests.
- `npm run build` passed.
- `npm run docs:verify` passed.
- `npm run compliance:verify` passed.
- `npm run safety:verify` passed.
- `npm run privacy:verify` passed.
- `git diff --check` passed.

Coverage mapping:

- Consent fail-closed and injectable storage:
  `test/unit/consent-state.test.ts`.
- Canonical `selectCanBeginAnalysis` gate selector:
  `test/unit/app-state.test.ts`.
- Escaping and canonical render helpers:
  `test/unit/render-utils.test.ts`.
- Protected selector/label preservation, processing progress re-query, and
  missing-selector no-op:
  `test/unit/app-renderer.test.ts`.
- Render/rebind single-effect behavior:
  `test/unit/app-events.test.ts`.
- Global handler/lifecycle/controller clearing and stop/idle composition:
  `test/unit/analysis-lifecycle.test.ts`.
- `observedSeekTimestampMs` export exclusion:
  `test/unit/swing-card-actions.test.ts`.
- Primary workflow selector/label preservation:
  full Playwright smoke suite.
- Protected safety/privacy text and local-first boundaries:
  `npm run safety:verify`, `npm run privacy:verify`, and
  `npm run compliance:verify`.

## Known Non-goals

- No UI copy, layout, or workflow behavior redesign.
- No framework migration.
- No progress throttling changes.
- No remote review enablement.
- No provider/model registry changes.
- No service-worker behavior changes.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or new operator diagnostics.
- No dependency, bundle, license-policy, notice, or SBOM changes.
- No PR has been created yet; this audit is the gate before PR preparation.

## Output Required

Return:

- PASS or FAIL verdict.
- Blockers ordered by severity, with file/line references where possible.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status: whether SS-018 may proceed to PR preparation, or
  whether fixes and focused re-review are required.

Focus especially on:

- Any hidden direct state mutation outside `src/app-state.ts`.
- Any duplicated or bypassed escaping/render-helper logic.
- Any stale-DOM or double-binding risk after render/rebind extraction.
- Any processing-progress path that writes DOM outside `src/app-renderer.ts`.
- Any controller-handle state sync bug in `src/analysis-lifecycle.ts`.
- Any consent fail-open behavior.
- Any `observedSeekTimestampMs` leak in export surfaces.
- Any selector/accessibility label regression that smoke tests could miss.
- Any verifier update that creates a false positive or false negative for
  safety/privacy boundaries.

``````

### CONTEXT.md

``````text
# Swing Sync Context

Last updated: 2026-07-06

## Current State

- Repository: https://github.com/ajason13/swing-sync
- Default branch: `main`
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/18
- Latest merge commit: `b59842940b7188c7b325a98e2b857e19b6eeadc3`
- Current `main` includes PR #18 merge commit
  `b59842940b7188c7b325a98e2b857e19b6eeadc3`. Local `main` was
  fast-forwarded to `origin/main` by the PR #18 merge flow before this
  post-merge context update.
- Latest post-merge guidance/context commit on `main`:
  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`.
- Current completed task:
  `SS-017 Document production deployment, backend boundary, and security-header
  posture`
- Active task:
  `SS-018 Refactor frontend app shell into maintainable UI/state modules`
- Active branch: `ss-018-frontend-architecture`
- Active handshake: `4. Final Audit (Claude)`
- Active Pull Request: none.
- Remaining visible non-Done backlog tasks: SS-018 through SS-022, created
  from the manual app-readiness gap review on 2026-07-03.

## SS-018 Coordination

SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
accessibility/test-selector-, and user-facing-behavior-sensitive because it
touches the app shell while preserving consent gating, local-first raw-media
handling, remote-review-disabled behavior, and exported data classes.

Acceptance criteria from Notion:

- Split the current app shell into focused modules without changing
  user-facing behavior.
- Keep consent gating, local video selection, local pose processing, phase
  review, Swing Card export, and remote-review-unavailable behavior intact.
- Preserve existing accessibility labels and test selectors used by smoke
  tests.
- Add or adjust unit tests around extracted state/renderer behavior where
  useful.
- No new framework or dependency unless separately reviewed and approved.

Protected boundaries from Notion:

- Do not change runtime privacy posture, raw-media handling, remote sharing,
  provider/model registry behavior, service-worker behavior, or exported data
  classes.
- Do not add telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.

Kickoff/spec state on 2026-07-04:

- Local `main` and `origin/main` were confirmed at
  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
- Branch from current `main`: `ss-018-frontend-architecture`.
- Pull Request: none.
- Task Type: `Refactor`.
- Notion task fields were verified before branching: Name
  `SS-018 Refactor frontend app shell into maintainable UI/state modules`,
  Branch `ss-018-frontend-architecture`, Handshake Status `0. Backlog`, Pull
  Request empty, Task Type `Refactor`, acceptance criteria, and protected
  boundaries.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex acting as research/spec owner under the current routing.
- Existing `SS-TC-018` was inspected and found to belong to SS-015 browser
  regression coverage, not SS-018 app-shell refactor coverage.
- Dedicated test case `SS-TC-022` was created:
  https://app.notion.com/p/393834a0c8a68126b03deeb86d5d67fa
- `SS-TC-022` covers app-shell behavior preservation, consent/local-first
  boundaries, smoke-test selector and accessibility-label preservation,
  unit-test expectations for extracted state/renderers, browser smoke
  expectations, and protected no-telemetry/no-remote/no-dependency boundaries.
- Codex-owned research/disposition note:
  `docs/ss-018-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-018-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-018-claude-qa-planning-prompt.md`.
- Source checks were recorded against `src/main.ts`, `src/workflow.ts`,
  `test/smoke/app.spec.ts`, `docs/privacy-architecture.md`,
  `docs/safety-terms.md`, and `package.json`.
- Current `src/main.ts` is 869 lines and owns consent storage, workflow
  session state, capture/processing/review/export rendering, event binding,
  local frame-analysis lifecycle, phase review, keyframe overlay rendering,
  Swing Card export actions, global security-policy handling, and production
  service-worker registration.
- Codex dispositions adopt focused module extraction for consent state, app
  state, renderers, analysis lifecycle, and Swing Card actions while keeping
  plain TypeScript/direct DOM patterns; revise any over-splitting into
  behavior-owned modules only; defer framework migration, design/copy changes,
  remote review, provider/model changes, service-worker changes, persistence,
  telemetry, analytics, remote logging, and exported data class changes; reject
  any user-facing behavior, selector/label, privacy, safety, dependency,
  telemetry, remote-sharing, provider registry, service-worker, or exported
  data-class change in this story unless separately reviewed.
- Observability decision: SS-018 intentionally leaves runtime observability
  unchanged. Do not add logs, telemetry, analytics, remote logging, cloud
  diagnostics, hidden identifiers, persistent debug artifacts, or new operator
  diagnostics.
- Notion moved to `2. QA Planning (Claude)` and updated with Round 1/Round 2
  QA planning notes after Notion OAuth access was restored on 2026-07-04.
- Claude QA planning returned FAIL with six blockers:
  - B1: `app-state.ts` needed a clear state-mutation ownership contract.
  - B2: shared render helpers, especially `escapeHtml`, needed a canonical
    module.
  - B3: remote-review-unavailable rendering needed an explicitly assigned
    module.
  - B4: moving Swing Card export preparation required an
    `observedSeekTimestampMs` exclusion regression.
  - B5: consent storage needed explicit injectable storage for failure-path
    unit tests.
  - B6: `beforeunload` and `securitypolicyviolation` needed named lifecycle
    methods to preserve close/abort behavior.
- Claude QA response record:
  `docs/ss-018-claude-qa-response.md`.
- Codex accepted B1-B6 as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/app-state.ts` must own state
  mutation through named transitions or a reducer-style API; `src/render-utils.ts`
  is the canonical home for `escapeHtml`, `formatRemoteDataClass`, and
  `formatSwingCardWarning`; `src/remote-model-renderer.ts` owns the
  remote-review-unavailable panel; `src/swing-card-actions.ts` must preserve
  `observedSeekTimestampMs` exclusion with unit coverage; `src/consent-state.ts`
  must accept an injectable `ConsentStorage`; `analysisLifecycle.closeActive()`
  and `analysisLifecycle.abortWithNetworkBlocked()` must preserve global close
  and fail-closed CSP abort behavior; `src/app-events.ts` is required; and
  imperative keyframe canvas helpers belong in `src/keyframe-overlay-renderer.ts`.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B6 re-review prompt, now also superseded:
  `docs/ss-018-claude-qa-rereview-prompt.md`.
- Claude focused B1-B6 re-review returned FAIL after closing B1-B6, with two
  new blockers:
  - B7: render-to-rebind control-loop ownership was unspecified.
  - B8: `frameController`/`abortFrameController` ownership was ambiguous under
    the app-state mutation contract.
- Claude focused re-review response record:
  `docs/ss-018-claude-qa-rereview-response.md`.
- Codex accepted B7-B8 as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/main.ts` owns a
  `requestRender(statusMessage?)` coordinator passed to `src/app-events.ts`;
  state-changing handlers call `requestRender`; each render fully replaces the
  `#app` subtree, binds events on the fresh DOM, and redraws selected keyframe
  canvas; repeated render/bind tests must prove single-effect behavior;
  `src/app-state.ts` holds only serializable or UI-derived session state;
  non-serializable `FrameProcessingController` and abort callback handles are
  owned by `src/analysis-lifecycle.ts` as an explicit scoped exception; and
  lifecycle tests must prove handle clearing stays synchronized with app-state
  transitions.
- Claude B1-B6 non-blocking recommendations incorporated: fixed duplicated
  `confirmation/confirmation` wording, required full-matrix
  `selectCanBeginAnalysis` tests, and required consent storage failure tests
  proving the public consent query function fails closed.
- Focused B7-B8 re-review prompt:
  `docs/ss-018-claude-qa-b7-b8-rereview-prompt.md`.
- Claude focused B7-B8 re-review returned FAIL after closing B8. B7 remains
  open because the prior plan left frame-processing progress/output DOM
  updates as an unspecified partial-render bypass.
- Claude B7/B8 re-review response record:
  `docs/ss-018-claude-qa-b7-rereview-response.md`.
- Codex accepted the residual B7 finding as valid and revised
  `docs/ss-018-preimplementation-spec.md`: `src/app-renderer.ts` owns
  processing-progress DOM updates through
  `updateProcessingProgressUi(root, state)`; `src/analysis-lifecycle.ts` owns
  frame-processing callbacks and controller handles but must call app-state
  transitions and delegate every processing-panel DOM update to
  `app-renderer.updateProcessingProgressUi(...)`; lifecycle code must not
  cache progress DOM nodes or write progress/status text directly;
  `updateProcessingProgressUi` must re-query visible DOM targets such as
  `[data-pose-summary]`, `[data-retry-analysis]`, and `[data-review-phases]`
  on every tick; and tests must prove progress updates survive an intervening
  full `requestRender(...)` plus stop-during-processing composes handle
  clearing, app-state `idle`, and subsequent render.
- Progress throttling is deferred as out of scope for SS-018; the story
  preserves current eight-sample processing behavior.
- The focused B7-B8 re-review prompt is superseded for paste use. Focused
  residual B7 re-review prompt:
  `docs/ss-018-claude-qa-b7-rereview-prompt.md`.
- Claude focused residual B7 re-review returned PASS. B1-B8 are closed, no
  new blockers were introduced, and SS-018 is cleared for implementation.
- Claude B7 PASS response record:
  `docs/ss-018-claude-qa-b7-pass-response.md`.
- Claude non-blocking recommendations were folded into
  `docs/ss-018-preimplementation-spec.md`: `#app` root stability is explicit,
  missing processing selectors no-op, and dynamic progress/status writes use
  `textContent` or element properties unless future user-influenced HTML
  routes through `render-utils.escapeHtml`.
- Notion moved to `3. In Development (ChatGPT)` on 2026-07-05.
- Implementation audit must include executed named tests for render/rebind
  single-effect behavior, `observedSeekTimestampMs` exclusion, consent
  fail-closed behavior, escaping regression coverage, processing-progress
  reattachment after intervening full render, stop-during-processing
  composition, missing-selector no-op behavior, and required
  docs/compliance/safety/privacy/smoke/build/diff checks.
- Codex implementation completed on 2026-07-05. `src/main.ts` is now a thin
  bootstrap/render coordinator; focused modules own state transitions
  (`src/app-state.ts`), consent storage (`src/consent-state.ts`), workflow and
  export rendering (`src/app-renderer.ts`), event binding (`src/app-events.ts`),
  frame-analysis lifecycle and non-serializable controller handles
  (`src/analysis-lifecycle.ts`), keyframe canvas drawing
  (`src/keyframe-overlay-renderer.ts`), phase review rendering
  (`src/phase-review-renderer.ts`), remote-review-unavailable rendering
  (`src/remote-model-renderer.ts`), shared escaping/format helpers
  (`src/render-utils.ts`), and Swing Card export actions
  (`src/swing-card-actions.ts`).
- Verifier maintenance: `scripts/verify-safety-terms.js` and
  `scripts/verify-privacy-boundaries.js` were updated so the protected consent,
  local-first, and no-remote posture checks follow the extracted app-shell
  modules instead of assuming all runtime copy remains in `src/main.ts`.
- Unit coverage added for extracted behavior:
  `test/unit/consent-state.test.ts`, `test/unit/app-state.test.ts`,
  `test/unit/render-utils.test.ts`, `test/unit/app-renderer.test.ts`,
  `test/unit/app-events.test.ts`, `test/unit/analysis-lifecycle.test.ts`, and
  `test/unit/swing-card-actions.test.ts`.
- Audit coverage mapping:
  - Consent fail-closed/injectable storage coverage:
    `test/unit/consent-state.test.ts`.
  - Canonical analysis gate selector coverage:
    `test/unit/app-state.test.ts`.
  - Escaping and shared render-helper coverage:
    `test/unit/render-utils.test.ts`.
  - Protected selector/label rendering, processing-progress re-query, and
    missing-selector no-op coverage: `test/unit/app-renderer.test.ts`.
  - Render/rebind single-effect coverage: `test/unit/app-events.test.ts`.
  - Global handler/lifecycle/controller-handle and stop/idle composition
    coverage: `test/unit/analysis-lifecycle.test.ts`.
  - `observedSeekTimestampMs` export-exclusion coverage:
    `test/unit/swing-card-actions.test.ts`.
- Verification evidence recorded for implementation audit:
  - `npm run test:unit -- consent-state app-state render-utils app-renderer app-events analysis-lifecycle swing-card-actions`
    passed: 7 files, 15 tests.
  - `npm run test:unit` passed: 21 files, 176 tests.
  - `npm run test:smoke` required escalated local-server permissions because
    the managed sandbox blocked localhost binding with `listen EPERM:
    operation not permitted 127.0.0.1:4174`; the direct Playwright equivalent
    with the full desktop/mobile suite then passed: 32 tests.
  - `npm run build` passed.
  - `npm run docs:verify` passed.
  - `npm run compliance:verify` passed.
  - `npm run safety:verify` passed.
  - `npm run privacy:verify` passed.
  - `git diff --check` passed.
- Observability decision remains unchanged after implementation: SS-018 added
  no telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, or new operator diagnostics.
- Dependency/licensing decision: SS-018 added no framework, dependency,
  bundle, license-policy, notice, or SBOM changes; license/SBOM-specific
  checks were not required.
- Claude implementation audit prompt prepared:
  `docs/ss-018-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)` on 2026-07-05 after local
  verification completed.
- Claude first implementation-audit attempt returned no PASS/FAIL because the
  browser-chat paste included the audit prompt but omitted the complete branch
  diff or changed source contents. Codex accepted this as a valid handoff
  defect, not a runtime code defect.
- Self-contained source packet prepared on 2026-07-06:
  `docs/ss-018-claude-audit-source-packet.md`. Paste
  `docs/ss-018-claude-audit-prompt.md` followed by this source packet for the
  next Claude implementation audit attempt.
- Durable workflow lesson captured in
  `.agents/skills/swing-sync-story-delivery/SKILL.md`: browser-chat audit
  handoffs must create the source packet before marking the handoff ready; a
  prompt that only instructs the user to paste source later is insufficient.
- Next owner: Claude final implementation audit. SS-018 must not move to
  `5. Done` or PR preparation until Claude returns PASS or any blockers are
  fixed and re-reviewed.

## SS-017 Coordination

SS-017 is privacy-, security-, deployment-, docs-claim-, compliance-, and
user-facing-copy-sensitive. It is a documentation and verification story to
capture the current frontend-only/no-backend production posture,
deployer-owned security-header requirements, and future backend architecture
review gates. Treat it as gated: Codex owns research/spec drafting under the
current routing, and Claude remains the independent QA planning and final
adversarial audit reviewer.

Acceptance criteria from Notion:

- Document the current no-backend production posture and what that means for
  auth, accounts, secrets, rate limiting, server logs, and data retention.
- Define the minimum production hosting requirements for security headers,
  including moving CSP from meta-only posture to deployer-owned HTTP headers
  where hosting supports them.
- Preserve the local-first rule: raw swing video is not uploaded by default
  and remote sharing requires separate explicit opt-in.
- Identify which future features would require a separate backend architecture
  review before implementation.
- Update README or deployment docs with clear local/dev versus
  production-hosting instructions.

Kickoff/spec state on 2026-07-03:

- Local `main` and `origin/main` were confirmed at
  `5ad008b1b2fb1695511dd7cafc24f4e43f2d9b72`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/392834a0c8a68182a201f7b30fa45954
- Branch from current `main`: `ss-017-production-deployment-boundary`.
- Pull Request: none.
- Task Type: `Feature`.
- Notion task fields were verified before branching: Name
  `SS-017 Document production deployment, backend boundary, and security-header
  posture`, Branch `ss-017-production-deployment-boundary`, Handshake Status
  `0. Backlog`, Pull Request empty, Task Type `Feature`, and the acceptance
  criteria above.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under current routing.
- Existing `SS-TC-017` was inspected and found to belong to SS-014 fixture
  policy coverage, not SS-017 deployment/security-header coverage.
- Dedicated test case `SS-TC-021` was created:
  https://app.notion.com/p/392834a0c8a68199983fc7bc1720ef2f
- `SS-TC-021` covers current frontend-only/no-backend posture,
  auth/accounts/secrets/rate-limiting/server-log/data-retention implications,
  deployer-owned HTTP security headers and CSP migration from meta-only
  posture, local-first raw-video/no-default-upload boundaries, future backend
  architecture review triggers, local/dev versus production-hosting
  instructions, and protected no-backend/no-remote-service/no-absolute-claim
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-017-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-017-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-017-claude-qa-planning-prompt.md`.
- Source checks were recorded against `README.md`, `index.html`,
  `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `scripts/verify-docs-claims.js`, MDN security-header references, and W3C CSP
  meta-policy delivery limitations.
- Codex dispositions adopt a new `docs/deployment.md`, README link/update,
  `docs:verify` enforcement for deployment docs, explicit no-backend
  implications, deployer-owned production HTTP security headers, and exact
  local-first no-default-upload/explicit-remote-opt-in wording; revise security
  header wording to defense-in-depth language without guarantees; defer real
  host configuration and backend/reporting architecture to future reviewed
  stories; reject adding backend, auth, accounts, secrets, telemetry,
  analytics, remote logging, cloud storage, provider SDKs, model providers,
  remote sharing, CSP reporting endpoints, NEL, or absolute privacy/security/
  compliance/deletion/anonymity/medical/trademark-clearance claims.
- Observability decision: SS-017 is docs-only. Do not implement runtime
  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
  collection, NEL, Reporting API endpoints, or persistent debug artifacts.
- Notion moved to `2. QA Planning (Claude)` after Codex completed the
  research/spec artifacts and Claude QA planning prompt.
- `git diff --check` PASS for the kickoff/spec package.
- Claude QA planning returned FAIL with five blockers:
  - B1: `docs/deployment.md` needed a required draft/pending-review
    disclaimer and canonical no-guarantee wording.
  - B2: the docs verifier needed a dedicated security-guarantee overclaim
    category.
  - B3: the verifier-extension mechanism needed to require the existing shared
    config path instead of bespoke deployment-doc logic.
  - B4: the verification plan needed to explicitly execute the new/updated
    docs-claim unit tests.
  - B5: the spec needed to prevent drift between deployment CSP prose and the
    actual meta CSP in `index.html`.
- Claude QA response record:
  `docs/ss-017-claude-qa-response.md`.
- Codex accepted B1-B5 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: `docs/deployment.md` now requires
  a canonical draft-review banner and no-guarantee string; `docs:verify` must
  add a separate security-guarantee prohibited-claim category with negative
  fixtures; deployment docs must be registered through the existing
  `files`/`requiredStrings`/`links`/`bannedPatterns`/`negativeFixtures`
  verifier config path; `npm run test:unit -- docs-claims` and
  `git diff --stat` are required verification evidence; and the deployment doc
  must not duplicate the literal `index.html` CSP directive string unless the
  verifier reads `index.html` and proves consistency.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B5 re-review prompt:
  `docs/ss-017-claude-qa-rereview-prompt.md`.
- Claude focused B1-B5 re-review returned FAIL with one new blocker after
  closing B1-B5:
  - B6: the cross-file CSP non-duplication check needed a named
    config-driven mechanism instead of leaving Codex to choose between
    declarative config and a bespoke one-off helper.
- Codex accepted B6 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: `docs:verify` must add a named
  declarative `crossFileChecks` config array; the SS-017 entry must read
  injected `index.html`, extract the CSP meta `content` attribute, require a
  non-empty extracted value, and reject that exact string in
  `docs/deployment.md`; `verifyDocsClaims(fileReader)` remains the single
  injection point and must cover injected `index.html` in unit tests. The spec
  also now requires deterministic draft-review banner placement under
  `## Draft Review Status`, varied-case/punctuation security-overclaim tests,
  and an approved-doc regression proving the no-guarantee string does not trip
  the security-overclaim category.
- The focused B1-B5 re-review prompt is superseded for paste use. Focused
  B6-only re-review prompt:
  `docs/ss-017-claude-qa-b6-rereview-prompt.md`.
- Claude focused B6 re-review returned FAIL with one new blocker after closing
  B6 at the architecture level:
  - B7: CSP extraction from `index.html` needed robust, fail-closed behavior
    for the actual multiline tag format, attribute order/whitespace variation,
    and no-match cases.
- Codex accepted B7 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: the `crossFileChecks` CSP
  extraction must tolerate `http-equiv` and `content` attributes in either
  order, arbitrary whitespace/newlines, and single- or double-quoted
  attributes; it must fail closed with a structured `docs:verify` error when
  no matching CSP meta tag is found, when `content` cannot be extracted, or
  when the extracted value is empty. Required tests now cover reordered/
  whitespace-varied fake `index.html`, missing CSP meta tag, empty `content`,
  and missing extractable `content` cases.
- The focused B6 re-review prompt is superseded for paste use. Focused
  B7-only re-review prompt:
  `docs/ss-017-claude-qa-b7-rereview-prompt.md`.
- Claude focused B7 re-review returned FAIL with one new blocker after closing
  B7:
  - B8: quote-tolerant CSP extraction needed matched-quote-pair behavior
    because the actual `index.html` CSP is a double-quoted attribute
    containing embedded single quotes such as `'self'`.
- Codex accepted B8 as valid and revised
  `docs/ss-017-preimplementation-spec.md`: CSP `content` extraction must use
  matched quote pairs, where the closing quote is the same character as the
  opening quote; double-quoted values containing embedded single quotes and
  single-quoted values containing embedded double quotes must extract the full
  value; duplication tests must use the full correctly extracted real-shaped
  CSP string; and exact extracted-string containment is the intentional
  automated scope for SS-017 while whitespace-normalized or semantic CSP
  equivalence remains manual review or future work.
- The focused B7 re-review prompt is superseded for paste use. Focused
  B8-only re-review prompt:
  `docs/ss-017-claude-qa-b8-rereview-prompt.md`.
- Claude focused B8 re-review returned PASS. B1-B8 are closed, no new blockers
  were introduced, and SS-017 was cleared for implementation.
- Notion moved to `3. In Development (ChatGPT)` after the B8 PASS.
- Codex implemented the approved docs/verifier/test scope:
  - `docs/deployment.md` documents current frontend-only/no-backend production
    posture, no-backend implications for auth/accounts/secrets/rate limiting/
    server logs/data retention, local development versus production hosting,
    deployer-owned HTTP security-header requirements, local-first data
    boundaries, backend architecture review gates, SS-017 non-goals, and
    verification commands.
  - `README.md` clarifies setup commands are local development commands and
    links `docs/deployment.md`.
  - `scripts/verify-docs-claims.js` registers `docs/deployment.md` in the
    shared file config, adds canonical deployment strings, README deployment
    link enforcement, required deployment terms, deterministic draft-banner
    placement, a dedicated security-guarantee prohibited-claim category,
    production-header overclaim checks, exact allowed units for approved
    protected-boundary lists, and declarative `crossFileChecks` for CSP
    non-duplication against `index.html`.
  - `test/unit/docs-claims.test.ts` covers approved docs success, missing
    deployment doc, missing heading/string/link/banner placement, security and
    production-header overclaims, fake injected CSP duplication, reordered/
    whitespace-varied CSP extraction, fail-closed missing/empty/unextractable
    CSP cases, and matched-quote extraction with embedded quotes.
- Runtime observability decision: SS-017 is docs/verifier-only. No runtime
  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
  collection, NEL, Reporting API endpoints, or persistent debug artifacts were
  added.
- No backend, auth, accounts, secrets, server routes, hosted functions, cloud
  storage, provider SDKs, model providers, remote sharing, runtime behavior,
  dependencies, bundle policy, license policy, notice, or SBOM changes were
  added.
- Verification on 2026-07-03 under Node v22.22.3:
  - `npm run test:unit -- docs-claims` PASS (13 tests).
  - `npm run docs:verify` PASS (`docs:verify passed`).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run build` PASS.
  - `git diff --check` PASS.
  - `git diff --stat` captured tracked-file scope. Note: untracked new files,
    including `docs/deployment.md` and SS-017 planning/audit prompts, are not
    listed by `git diff --stat`; preserved untracked
    `docs/agent-guidance/*new-codex-session-prompt.md` files remain untouched.
- Final Claude implementation audit handoff:
  `docs/ss-017-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL after confirming B1-B8 are
  correctly implemented. New audit-stage findings:
  - B9: `CONTEXT.md` diff was not included in the audit prompt and needed
    review or confirmation as internal tracking state.
  - B10: the new `terms` verifier mechanism needed explicit evidence/scope,
    and the production-header overclaim guard was too narrow.
  - B11: test evidence needed a named checklist mapped to B1-B8, not only a
    pass count.
- Claude audit response record:
  `docs/ss-017-claude-audit-response.md`.
- Codex accepted B9-B11 as valid and responded:
  - B9: `CONTEXT.md` is internal project memory required by AGENTS.md and the
    Swing Sync workflow, not public/user-facing documentation. The focused
    re-review prompt includes the full `CONTEXT.md` diff for audit.
  - B10: retained the `terms` verifier mechanism because required deployment
    term enforcement was part of the accepted spec; the spec now records it as
    a case-insensitive substring guard for the approved deployment doc, with
    future intentional rephrasing requiring verifier/test updates in the same
    reviewed change. Added a missing required deployment term regression and
    broadened production-header overclaim patterns to cover additional
    present-tense phrasings.
  - B11: captured verbose Vitest named test output and mapped every named test
    to B1-B8/B10 in the focused re-review prompt.
- Focused B9-B11 re-review prompt:
  `docs/ss-017-claude-rereview-prompt.md`.
- Verification after B9-B11 response under Node v22.22.3:
  - `npm run test:unit -- docs-claims -- --reporter verbose` PASS (14 tests).
  - `npx vitest run test/unit/docs-claims.test.ts --reporter verbose` PASS
    with full named test list.
  - `npm run docs:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run build` PASS.
  - `git diff --check` PASS.
  - `git diff --stat` captured tracked-file scope.
- Claude focused B9-B11 re-review returned PASS. B1-B11 are closed, no
  remaining blockers or B1-B8 regressions were identified, and SS-017 is
  cleared for PR preparation.
- SS-017 PR created on 2026-07-04:
  https://github.com/ajason13/swing-sync/pull/18
- Branch pushed at commit `d503a6f11b50df36f2952a5eed04686f7bef64e3`
  (`SS-017 document deployment boundary`).
- Notion Pull Request property was updated with PR #18 and a PR-created
  status comment was added. SS-017 remains in `4. Final Audit (Claude)` until
  the PR is merged and post-merge Notion/CONTEXT synchronization is complete.
- PR #18 merged on 2026-07-04:
  https://github.com/ajason13/swing-sync/pull/18
- Merge commit: `b59842940b7188c7b325a98e2b857e19b6eeadc3`.
- GitHub `compliance` check passed before merge.
- Local `main` was fast-forwarded to the merged `origin/main` state.
- Notion SS-017 Pull Request property points to PR #18, a merge-complete
  comment was added, and Handshake Status was moved to `5. Done`.
- Non-blocking Claude recommendations after sign-off: consider adding
  individual coverage for all production-header-overclaim phrases and future
  word-boundary anchoring for `terms`/`bannedPatterns`; neither is required
  for SS-017 sign-off.

SS-017 is complete. Next owner: Codex/user task selection from the remaining
backlog. Default next candidate is SS-018 unless the user selects a different
story.

## Delivery Learnings

SS-017 feedback-retention note, added 2026-07-04:

- Sensitive docs/verifier stories should specify verifier architecture before
  implementation. Name the shared config registration points, fixture paths,
  and injected file-reader behavior instead of leaving Codex to invent a
  bespoke check path during implementation.
- Cross-file documentation claims should prefer one canonical source plus an
  automated non-duplication check. SS-017 used `index.html` as the CSP source
  and verified that `docs/deployment.md` does not copy the literal policy.
- Parser or extractor logic in verification scripts needs adversarial tests
  for formatting variation, missing inputs, empty values, embedded delimiters,
  and fail-closed behavior. Named verbose test output should be captured when
  the audit depends on exact scenario coverage.
- Claude audit prompts for sensitive work must include every changed tracked
  file or explicitly justify omissions. Coordination files such as
  `CONTEXT.md` can contain scope-sensitive claims and should be included when
  they changed.
- New verifier helpers, banned-claim categories, or checklist mechanisms added
  during implementation should be added to the reviewed spec and backed by
  explicit tests, or deferred. Unreviewed helpful mechanisms create audit
  friction even when they are technically correct.
- PR creation, merge, and post-merge context synchronization are separate
  state transitions. Record the PR URL before merge, then record the merge
  commit, Notion `5. Done`, and post-merge `main` state after merge.
- Recommended self-improvement loop: classify feedback, fix the spec or tests
  before code when acceptance changes, implement the focused change, rerun
  relevant verification, get focused re-review for sensitive work, and capture
  the repeatable lesson in durable guidance instead of relying on chat memory.

## Current Backlog Snapshot

Created from the post-SS-016 manual readiness review on 2026-07-03. SS-017 is
Done via PR #18. The remaining items are in Notion with `Handshake Status`
`0. Backlog`, empty Pull Request, and the listed branch names:

- `SS-018 Refactor frontend app shell into maintainable UI/state modules`
  - Notion: https://app.notion.com/p/392834a0c8a68115b23bda9510e07958
  - Branch: `ss-018-frontend-architecture`
  - Task Type: `Refactor`
  - Scope: split `src/main.ts` orchestration pressure while preserving current
    consent, local processing, phase review, Swing Card, and remote-unavailable
    behavior.
- `SS-019 Perform accessibility and responsive design hardening`
  - Notion: https://app.notion.com/p/392834a0c8a6814db2f6ea28ae195f75
  - Branch: `ss-019-accessibility-design-hardening`
  - Task Type: `Feature`
  - Scope: keyboard, focus, screen-reader semantics, contrast, mobile layout,
    long text, and error-state review/hardening.
- `SS-020 Prepare human legal/privacy/safety release review gate`
  - Notion: https://app.notion.com/p/392834a0c8a6818b9f8cecd0debacbf6
  - Branch: `ss-020-release-review-gate`
  - Task Type: `Research`
  - Scope: human review package for public safety, privacy, medical-scope,
    non-affiliation, limitation, and SS-002 legal-review gates.
- `SS-021 Add clear-local-data UX and storage lifecycle controls`
  - Notion: https://app.notion.com/p/392834a0c8a6812a9e4af6cd4eeb8358
  - Branch: `ss-021-clear-local-data`
  - Task Type: `Feature`
  - Scope: clear Swing Sync app-level local state with accurate browser/device
    storage-limit copy and fail-closed storage-error handling.
- `SS-022 Define real-world pose, phase, and metric accuracy validation
  protocol`
  - Notion: https://app.notion.com/p/392834a0c8a681f798eafe66945041d6
  - Branch: `ss-022-accuracy-validation-protocol`
  - Task Type: `Research`
  - Scope: validation protocol and evidence language for real-world pose,
    phase, and metric review without overclaiming fixture coverage.

## SS-016 Coordination

SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. It is a
documentation-only story to publish README, limitations, and contributor
guidance while preserving Swing Sync's local-first, no-default-upload posture.
Treat it as gated: Codex owns research/spec drafting under the current
LLM-team routing update, and Claude remains the independent QA planning and
final adversarial audit reviewer.

Acceptance criteria from Notion:

- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Kickoff/spec state on 2026-07-01:

- Local `main` and `origin/main` were confirmed at
  `b03efbb46578c19119b4b7d286ebc8be97d6749f` after `git fetch origin`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a68152bee5f2842be6c6e0
- Branch from current `main`: `ss-016-docs`.
- Pull Request: none.
- Task Type: `Feature`.
- Notion task fields were verified before branching: Name
  `SS-016 Publish README, limitations, and contributor guide`, Branch
  `ss-016-docs`, Handshake Status `0. Backlog`, Pull Request empty, Task Type
  `Feature`, and the acceptance criteria above.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under current routing.
- Existing `SS-TC-016` was inspected and found to belong to SS-012 coaching
  prompt/schema coverage, not SS-016 docs coverage.
- Dedicated test case `SS-TC-020` was created:
  https://app.notion.com/p/390834a0c8a6810e85ccd2ffeff645bb
- `SS-TC-020` covers README purpose/local-first/setup/safety limits, limitations
  page pose/camera/non-medical scope, contributor workflow/testing/license/SBOM
  expectations, visible trademark/non-affiliation disclaimer, and protected
  no-runtime-change/no-telemetry/no-remote-sharing/no-new-dependency/no-unsafe-
  claim boundaries.
- Codex-owned research/disposition note:
  `docs/ss-016-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-016-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-016-claude-qa-planning-prompt.md`.
- Source checks were recorded against `README.md`,
  `docs/privacy-architecture.md`, `docs/safety-terms.md`,
  `docs/licensing.md`, `docs/models-licensing.md`,
  `docs/fixture-policy.md`, `package.json`, and
  `.github/pull_request_template.md`.
- Codex dispositions adopt current-MVP README updates, local-first/no-default-
  upload wording, a limitations page, contributor workflow/testing/license/SBOM
  documentation, and visible non-affiliation language; revise unqualified "AI
  coach" wording into educational/local-first copy; reject absolute privacy,
  deletion, anonymity, safety, medical, professional-coaching, correctness,
  legal, compliance, or trademark-clearance claims; reject telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, new dependencies, camera capture, SDK/provider/model assets,
  workers, and remote-sharing changes for SS-016.
- Observability decision: SS-016 is docs-only. Do not implement new runtime
  logging. Document the existing debugging model only: local test output,
  browser devtools, sanitized UI status/error codes, and CI/browser failure
  artifacts. Do not claim hidden logging, remote diagnostics, telemetry, or
  persistent debug artifacts exist.
- Notion moved to `2. QA Planning (Claude)` after Codex completed the
  research/spec artifacts and Claude QA planning prompt.
- Claude QA planning returned FAIL with five blockers:
  - B1: no draft copy existed for required sections except the trademark
    paragraph.
  - B2: no structural/automated prohibited-claim enforcement existed; manual
    review alone was fail-open for the sensitive docs story.
  - B3: capability-summary wording risked overclaiming active AI coaching
    because SS-013's remote model adapter remains an inactive scaffold with an
    empty production provider registry.
  - B4: contributor guide placement was unresolved.
  - B5: `SS-TC-020` was a single opaque test case instead of decomposed
    required-disclosure and prohibited-claim-category coverage.
- Claude QA response record:
  `docs/ss-016-claude-qa-response.md`.
- Codex accepted B1-B5 as valid and revised
  `docs/ss-016-preimplementation-spec.md` to include exact draft README,
  `docs/limitations.md`, and root-level `CONTRIBUTING.md` prose; lock the
  contributor path to root `CONTRIBUTING.md`; require dependency-free
  `scripts/verify-docs-claims.js`; add `npm run docs:verify`; wire
  `docs:verify` into `compliance:verify`; enforce required headings, canonical
  required strings, draft safety/privacy banners, required links, and
  prohibited-claim categories; and decompose `SS-TC-020` sub-cases.
- Codex revised `docs/ss-016-research-disposition.md` to reject manual-only
  claim enforcement, unresolved contributor-guide placement, a single opaque
  docs test case, and active-remote-AI-coach wording.
- `SS-TC-020` was revised in Notion with named sub-cases for required README,
  limitations, and `CONTRIBUTING.md` sections; canonical trademark,
  local-first, non-medical, and draft-review strings; negative
  privacy/anonymity, deletion/security, medical/injury, correctness/performance,
  legal/compliance/trademark-clearance, telemetry/analytics, and absolute
  remote-boundary claim checks; and `docs:verify` compliance wiring.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B5 re-review prompt:
  `docs/ss-016-claude-qa-rereview-prompt.md`.
- Claude focused B1-B5 re-review returned FAIL. B1, B3, and B4 are closed; B5
  is substantially closed but needed one addition; B2 remains blocking as B6.
  New blockers:
  - B6: the proposed `docs:verify` banned-pattern list would false-positive
    against three draft sentences (`anonymous`, `diagnosis`, and
    `hidden identifiers`) and the safety/privacy link rule was ambiguous.
  - B7: `SS-TC-020` needed a golden regression sub-case proving
    `docs:verify` exits zero against exact final approved public docs.
- Codex accepted B6-B7 as valid and revised
  `docs/ss-016-preimplementation-spec.md`: the three colliding draft sentences
  were reworded instead of adding bespoke exceptions; safety/privacy links are
  now required in all three public docs with explicit path forms for README,
  limitations, and `CONTRIBUTING.md`; and `SS-TC-020` now requires a golden
  `docs:verify` zero-exit regression against exact final approved README,
  limitations, and `CONTRIBUTING.md` content.
- `docs/ss-016-research-disposition.md` and
  `docs/ss-016-claude-qa-response.md` were updated with the B6-B7 disposition.
- The focused B1-B5 re-review prompt is superseded for paste use. Second
  focused B6-B7 re-review prompt:
  `docs/ss-016-claude-qa-second-rereview-prompt.md`.
- B6/B7 planning verification on 2026-07-01:
  - Targeted text check confirms the old B6 collision phrases are absent from
    `docs/ss-016-preimplementation-spec.md`. They remain only in the second
    re-review prompt as quoted previous-draft evidence.
  - Manual dry-run of the complete banned-pattern list against the exact
    revised final draft public docs text found zero unresolved matches. Allowed
    matches are limited to the canonical non-medical and draft-review exception
    sentences plus the future checker's own banned-term fixture strings.
  - `git diff --check` PASS.
- Claude second focused B6-B7 re-review returned FAIL with one new blocker:
  - B8: the `docs/limitations.md` intro paragraph still contained `diagnose`,
    colliding with the medical/injury banned-term list outside the canonical
    non-medical exception.
- Codex accepted B8 as valid and revised
  `docs/ss-016-preimplementation-spec.md` to trim the limitations intro instead
  of adding another exception or near-miss phrase. The revised intro says the
  page supports practice notes and visual inspection, then points to the
  detailed educational, safety, privacy, and fixture limits below.
- `docs/ss-016-research-disposition.md` and
  `docs/ss-016-claude-qa-response.md` were updated with the B8 disposition.
- The second focused B6-B7 re-review prompt is superseded for paste use. Final
  focused B8 re-review prompt:
  `docs/ss-016-claude-qa-b8-rereview-prompt.md`.
- B8 planning verification on 2026-07-01:
  - A full extracted-draft dry-run of the complete banned-pattern list against
    the exact revised final draft public docs text reported zero unresolved
    matches.
  - Allowed matches are limited to the exact canonical non-medical exception
    sentence variants, the exact canonical draft-review exception sentence
    variants, and future checker fixture strings.
  - `git diff --check` PASS.
- Claude focused B8 re-review returned PASS, closed B8, and cleared SS-016 for
  implementation.
- Codex implemented the approved docs-only scope:
  - `README.md` now explains current purpose, local-first design, setup,
    verification, safety/non-medical boundaries, current local capabilities,
    inactive SS-013 remote model scaffold state, documentation links, license,
    and visible trademark/non-affiliation disclaimer.
  - `docs/limitations.md` covers pose and metric limits, camera setup,
    educational/non-medical scope, privacy/export limits, remote-review limits,
    fixture/test limits, and draft-review status.
  - Root `CONTRIBUTING.md` covers environment setup, task workflow, Notion and
    `CONTEXT.md` sync, sensitive-story gates, Claude audit/re-review,
    testing, licensing/reference/fixture/model/SBOM expectations, safety/privacy
    claim boundaries, observability wording, and PR requirements.
  - `scripts/verify-docs-claims.js` enforces required docs, headings, canonical
    strings, safety/privacy links, safety/privacy draft banners, prohibited
    claim patterns, and negative fixture coverage.
  - `package.json` adds `npm run docs:verify` and wires it into
    `npm run compliance:verify`.
- Runtime observability decision: SS-016 is docs-only. No runtime
  observability, telemetry, remote logging, analytics, cloud diagnostics,
  persistent debug artifacts, or console logging was added. Public docs describe
  only existing local test output, browser devtools, sanitized UI status/error
  codes, and CI/browser failure artifacts.
- No runtime behavior, dependencies, SDK/provider/model assets, workers, camera
  capture, service workers, API routes, secrets, raw media fixtures, cloud
  storage, telemetry, hosted analytics, remote logging, cloud diagnostics,
  hidden identifiers, or remote-sharing behavior were added.
- Implementation verification on 2026-07-01:
  - `npm run docs:verify` PASS (`docs:verify passed`).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS, including `docs:verify` through the
    compliance path.
- Final Claude implementation audit handoff:
  `docs/ss-016-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL after confirming B1-B8 are
  correctly implemented. New blocker:
  - B9: `docs:verify` lacked negative-path test evidence for missing required
    public docs, missing headings, missing canonical strings, missing required
    links, and missing draft banners.
- Codex accepted B9 as valid and responded:
  - `scripts/verify-docs-claims.js` now exports pure `verifyDocsClaims` for
    injected file-reader tests while preserving CLI disk-read and exit-code
    behavior.
  - Missing safety/privacy draft banners now return structured errors instead
    of relying on unhandled `readFileSync` exceptions.
  - `test/unit/docs-claims.test.ts` covers current approved docs success,
    missing required public file, missing required heading, missing canonical
    string, missing required link, and missing draft banner negative paths.
- B9 verification on 2026-07-01:
  - `npm run test:unit -- docs-claims` PASS (6 tests).
  - `npm run docs:verify` PASS.
  - `npm run test:unit` PASS (153 tests across 14 test files).
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS, including `docs:verify`.
- The initial final audit prompt is superseded for paste use. Focused B9
  re-review prompt:
  `docs/ss-016-claude-rereview-prompt.md`.
- Claude focused B9 implementation re-review returned PASS. B1-B9 are closed,
  and SS-016 is cleared for PR preparation.
- Claude confirmed the `verifyDocsClaims(fileReader)` refactor preserves CLI
  behavior, the negative-path tests genuinely exercise the missing file,
  heading, canonical string, required link, and draft-banner branches, and no
  new protected-boundary regressions were introduced.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/17.
- Branch commit pushed for PR #17:
  `b5f7ea3f06674ae67170b7969afc909136da069f`.
- Notion Pull Request property was updated with PR #17, and a PR-created
  comment was added.
- PR body records that `npm run license:audit` and `npm run sbom:generate`
  were not run because SS-016 has no dependency, bundle, license-policy,
  notice, or SBOM changes.
- GitHub PR #17 merged on 2026-07-02 UTC with merge commit
  `60bda6967d34cdf619c3b3e58ba02e64497645f3`.
- Local `main` was fast-forwarded to `origin/main` at
  `60bda6967d34cdf619c3b3e58ba02e64497645f3`.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #17, the merge timestamp, the merge commit, and the local `main`
  fast-forward.
- Post-merge Notion query found no visible remaining non-Done tasks.

Next owner: Codex/user to create or select the next backlog task. No active
task is selected in `CONTEXT.md`; start from synchronized `main` and inspect
the Swing Sync Notion task database/board before any next implementation.

## SS-013 Coordination

SS-013 is safety-, privacy-, AI-coaching-, model-provider-, compliance-,
dependency/licensing-, user-facing-copy-, runtime-, and remote-API-sensitive.
It defines an optional model API adapter behind explicit remote-sharing consent
while preserving the local-first MVP and manual Swing Card workflow. Treat it
as gated: Codex owns research/spec drafting under the 2026-06-26 LLM-team
routing update, and Claude remains the independent QA planning and final
adversarial audit reviewer.

Acceptance criteria from Notion:

- API mode is disabled until explicit consent.
- Provider adapter is model-neutral.
- User sees what data will be sent.
- Manual Swing Card workflow remains available without keys or server config.

Kickoff/spec state on 2026-06-30:

- Local `main`, `origin/main`, and branch base were confirmed at
  `f5836311bdb1f871b965bda24ad55322b89817eb` after `git fetch origin`.
- Worktree was clean before selection except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a6816491e9d73a30dbf3d2
- Branch from current `main`: `ss-013-model-adapter`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/16.
- Task Type: `Feature`.
- User confirmed SS-013 over SS-016 after both backlog candidates were verified
  in Notion and ordering was ambiguous.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under the 2026-06-26 routing update.
- Dedicated test case `SS-TC-019` was created:
  https://app.notion.com/p/38f834a0c8a6812db4a5e98c2b01fd4d
- `SS-TC-019` covers API mode disabled until explicit remote-sharing consent,
  model-neutral adapter contract, pre-send data-class/destination disclosure,
  no raw video/frame pixel send by default, revocation/missing-configuration
  fail-closed behavior, manual Swing Card workflow without keys/server config/
  network, provider terms/licensing/privacy review, and protected no-telemetry/
  no-remote-logging/no-cloud-storage/no-unapproved-SDK/no-unsafe-claim
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-013-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-013-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-013-claude-qa-planning-prompt.md`.
- Source checks were recorded for OpenAI enterprise/API privacy handling,
  OpenAI consumer privacy/business-data boundary, Anthropic commercial terms,
  Anthropic privacy/retention materials, Gemini API unpaid-service data review
  warning, MDN Fetch API behavior, and MDN AbortController behavior, all
  checked on 2026-06-30.
- Codex dispositions defer real provider integration, reject provider SDKs/new
  dependencies by default, reject raw video/frame-pixel send, reject generic
  provider data-use equivalence, adopt provider-neutral adapter design, adopt
  fail-closed remote consent gating, adopt exact outbound data-class
  disclosure, and preserve manual Swing Card export/copy as the fallback.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with eight blockers:
  - B1 consent persistence was conditional instead of deterministic.
  - B2 reviewed-provider gating lacked an operational definition and zero-
    provider default.
  - B3 fail-closed checks lacked a single canonical enforcement point.
  - B4 per-error-code negative tests were not required.
  - B5 `UNSAFE_RESPONSE_CONTENT` and safe model-output rendering were
    undefined.
  - B6 `blockedDataClasses` was typed as an open `string[]`.
  - B7 mid-flight consent revocation was unaddressed.
  - B8 prohibited prompt checking had no named validation mechanism.
- Claude QA response record:
  `docs/ss-013-claude-qa-response.md`.
- Codex accepted B1-B8 as valid and revised
  `docs/ss-013-preimplementation-spec.md` to require in-memory-only remote
  consent with default-off reload behavior, no remote-consent storage key, an
  empty production provider registry and unavailable remote UI by default, a
  shared `canSendRemoteRequest` guard for UI and adapter send paths, a closed
  canonical remote-data-class union with typed blocked data classes, text-only
  model-output rendering, concrete `UNSAFE_RESPONSE_CONTENT` criteria,
  mid-flight revocation via `AbortController.abort()`, a named runtime
  `validateRemotePromptPreview`-style validator, explicit
  `observedSeekTimestampMs` exclusion, and required negative coverage for every
  `ModelAdapterErrorCode`.
- Codex revised `docs/ss-013-research-disposition.md` to explicitly reject
  shipping any `ModelProviderDescriptor` entries in production for SS-013.
- `SS-TC-019` was revised in Notion with itemized sub-cases for every adapter
  error code, empty production provider registry, typed blocked data classes,
  prompt-preview validation, mid-flight abort-on-revoke, text-only output
  rendering, and manual workflow regression coverage.
- The initial Claude QA planning prompt is superseded for paste use. Focused
  B1-B8 re-review prompt:
  `docs/ss-013-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS for implementation start and
  closed B1-B8. Claude noted two non-blocking recommendations: clarify
  `PROVIDER_NOT_REVIEWED` versus `PROVIDER_NOT_CONFIGURED`, and add an
  outbound prompt size bound.
- Focused re-review response record:
  `docs/ss-013-claude-qa-rereview-response.md`.
- Codex folded both non-blocking recommendations into the spec and
  implementation before coding: `PROVIDER_NOT_REVIEWED` means no descriptor is
  present in the reviewed provider registry; `PROVIDER_NOT_CONFIGURED` means a
  reviewed descriptor exists but runtime send configuration is absent; and
  `UNSAFE_REQUEST_CONTENT` plus `maxRemotePromptCharacters` cover outbound
  prompt size/content failures.
- Notion moved to `3. In Development (ChatGPT)`.
- Codex implemented SS-013 within the approved empty-registry/fail-closed
  scope:
  - `src/model-adapter-contract.ts` defines the provider-neutral data classes,
    provider descriptor, request preview, adapter request/result, and typed
    blocked outbound data class contract.
  - `src/model-consent.ts` ships an empty production `reviewedModelProviders`
    registry, shared `canSendRemoteRequest` guard, prompt/output validators,
    text-only model-output rendering helper, guarded adapter factory, and
    abort-on-consent-revoke helper.
  - `test/unit/model-consent.test.ts` covers empty registry, derived blocked
    data classes, every adapter error code including `UNSAFE_REQUEST_CONTENT`,
    prompt validator pattern families, unsafe output validation, transport
    failure/cancellation, and mid-flight abort-on-revoke.
  - `src/main.ts` and `src/styles.css` add a passive Remote model review panel
    to the Swing Card export surface. Because the production provider registry
    is empty, the panel remains unavailable/configuration-required and does not
    add a network-capable path.
  - `test/smoke/app.spec.ts` extends the Swing Card export regression to
    assert the unavailable remote panel, canonical send/blocked data-class
    disclosures, disabled remote-review button, absence of extra local storage,
    and unchanged manual Download PNG / Print / Copy prompt workflow.
- Runtime source files changed, but runtime observability remains intentionally
  limited to local UI status/error states. No telemetry, remote logging,
  analytics, cloud diagnostics, provider SDKs, provider descriptors, API routes,
  keys, remote calls, new workers, new dependencies, raw video/frame upload,
  camera capture, cloud storage, or model/provider assets were added.
- Verification on 2026-06-30 under Node v22.22.3:
  - `npm run test:unit` PASS (145 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run safety:verify` PASS.
  - `git diff --check` PASS.
  - `npm run test:smoke -- --project=desktop-chromium -g "downloads a local Swing Card PNG"` PASS (1 test).
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - After the remote data-class label cleanup, `npm run build` PASS,
    `git diff --check` PASS, and
    `npm run test:smoke -- --project=desktop-chromium -g "downloads a local Swing Card PNG"` PASS (1 test).
- Browser smoke attempts under Node v24.15.0 were interrupted after hanging
  with no output, matching the known Node-version issue already recorded for
  SS-011/SS-015. Required browser verification was rerun under Node v22.22.3
  from `.nvmrc`.
- Final Claude implementation audit handoff:
  `docs/ss-013-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL pending additional evidence,
  while confirming the structural implementation is correct and prior B1-B8 are
  closed. New blockers:
  - B9: audit prompt excerpt omitted full test evidence for
    `REMOTE_REQUEST_FAILED` and `UNSAFE_RESPONSE_CONTENT`, including text-only
    rendering coverage.
  - B10: `REMOTE_REQUEST_CANCELLED` evidence covered the standalone helper but
    not the mid-flight `send()` integration path.
  - B11: Claude needed confirmation that `SS-TC-019` accepts
    `UNSAFE_REQUEST_CONTENT` as the eighth adapter error code.
- Claude audit response record:
  `docs/ss-013-claude-audit-response.md`.
- Codex response:
  - `SS-TC-019` already included `UNSAFE_REQUEST_CONTENT` as a required
    negative sub-case and provider error-code semantics; the test-case current
    gate text was updated to final-audit state.
  - `test/unit/model-consent.test.ts` now includes a mid-flight send-path
    cancellation test where consent revocation aborts the request signal and
    `send()` returns `REMOTE_REQUEST_CANCELLED`.
  - `test/unit/model-consent.test.ts` now includes explicit
    `renderModelOutputText` text-only assignment coverage.
  - `src/model-adapter-contract.ts` now derives runtime blocked outbound data
    classes from `modelOutboundDataClasses`, matching the type-level canonical
    source.
  - The initial final audit prompt is superseded for paste use. Focused B9-B11
    re-review prompt:
    `docs/ss-013-claude-rereview-prompt.md`.
- Verification after B9-B11 response under Node v22.22.3:
  - `npm run test:unit -- model-consent` PASS (25 tests).
  - `npm run build` PASS.
- Claude focused implementation re-review returned PASS for SS-013 PR
  preparation and closed B9-B11. No new blocking findings were introduced.
- Focused implementation re-review response record:
  `docs/ss-013-claude-rereview-response.md`.
- Claude noted non-blocking follow-ups: post-transport
  `abortSignal.aborted` branch is not explicitly tested; full unit suite and
  `git diff --check` should be re-confirmed at PR preparation close; and
  `manualContentAvailable: false` remains bundled under
  `PROVIDER_NOT_CONFIGURED` for SS-013.
- PR-prep verification on 2026-07-01 under Node v22.22.3:
  - `npm run test:unit` PASS (147 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `npm run safety:verify` PASS.
  - `git diff --check` PASS.
  - `npm run license:audit` PASS.
  - `npm run sbom:generate` PASS. The generated SBOM changed only timestamp
    and serial metadata and was restored because SS-013 has no dependency
    changes.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/16.
- Branch commit pushed for PR #16:
  `bfc38c6f632f1caf13deace92add51680829a20e`.
- Notion Pull Request property was updated with PR #16, and a PR-created
  comment was added.
- Observability decision for the candidate spec: runtime observability should
  remain intentionally limited to stable local UI status/error codes. Do not add
  telemetry, remote logging, analytics, cloud diagnostics, or console logs
  containing prompts, outputs, metrics, landmarks, media details, provider keys,
  or hidden identifiers.

- GitHub PR #16 compliance check passed, and PR #16 merged on 2026-07-01 UTC
  with merge commit `a53203788e2cd3f65c25e95a271944b4fb677653`.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #16 and merge commit `a53203788e2cd3f65c25e95a271944b4fb677653`.
- Observability decision: runtime observability remains intentionally limited
  to local UI status/error states. No telemetry, remote logging, analytics,
  cloud diagnostics, provider SDKs, provider descriptors, API routes, keys,
  remote calls, new workers, new dependencies, raw video/frame upload, camera
  capture, cloud storage, or model/provider assets were added.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`. Start from synchronized `main`, inspect the Swing
Sync Notion task database/board, and ask the user to confirm the next task if
ordering is ambiguous. Current visible remaining non-Done backlog task is
`SS-016 Publish README, limitations, and contributor guide`.

## SS-015 Coordination

SS-015 is privacy-, browser-automation-, CI-, export-, and user-facing-copy
sensitive. It adds browser regression and CI coverage for the MVP local-first
flow. Treat it as gated: Codex owns research/spec drafting under the
2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Test upload/capture placeholder, processing, review, Swing Card export,
  consent gate, and mobile layout.
- Include no-network privacy regression where feasible.
- Capture artifacts for failed runs.
- Tests run in CI.

Kickoff/spec state on 2026-06-29:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `f8b9cd2724c84ffea2c3ba77ec6d1d782111feb0`, with a clean tracked worktree
  and only intentional untracked `docs/agent-guidance/*new-codex-session-prompt.md`
  files present.
- Notion page:
  https://app.notion.com/p/375834a0c8a6813fba47ed015c899a72
- Branch from current `main`: `ss-015-browser-tests`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/15.
- Task Type: `Feature`.
- Notion moved to `1. Spec Drafting (Gemini)` for board compatibility, with
  Codex noted as research/spec owner.
- Dedicated test case `SS-TC-018` was created:
  https://app.notion.com/p/38e834a0c8a681c3a146fae2d8c332cc
- `SS-TC-018` covers upload/capture placeholder, processing, review, Swing
  Card export, consent fail-closed behavior, mobile layout, no-network privacy
  regression, failed-run artifacts, CI execution, and protected no-telemetry/
  no-remote-sharing/no-new-dependency/no-unapproved-fixture boundaries.
- Codex-owned research/disposition note:
  `docs/ss-015-research-disposition.md`.
- Candidate preimplementation spec:
  `docs/ss-015-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-015-claude-qa-planning-prompt.md`.
- Source checks were recorded for Playwright configuration/artifact output,
  Playwright network routing/monitoring, Playwright CI guidance, and GitHub
  Actions artifact retention.
- Claude QA planning returned FAIL with seven blockers: no-network hooks can
  miss initial navigation/model-load requests; capture placeholder lacks
  explicit test coverage; CI/browser-artifact requirements were too soft;
  console sensitive-output assertions were incomplete and omitted hidden IDs;
  canvas nonblank rendering was not proven by pixel sampling; mobile
  overlap/truncation coverage was promised but underspecified; and Copy prompt
  usability/content-minimization needed source-backed test requirements.
- Claude QA response record:
  `docs/ss-015-claude-qa-response.md`.
- Codex accepted B1-B7 as valid and revised
  `docs/ss-015-preimplementation-spec.md` with mandatory context-level
  network hooks before navigation, explicit capture-placeholder and
  no-camera-permission coverage, blocking CI/no-soft-fail/browser-install/
  failure-artifact requirements, shared sensitive-output denylist coverage,
  pixel-content canvas nonblank checks, mobile overlap/clipping assertions, and
  clipboard Copy prompt usability plus content-minimization checks.
- The original Claude QA planning prompt is superseded for paste use. Focused
  B1-B7 re-review prompt:
  `docs/ss-015-claude-qa-rereview-prompt.md`.
- Claude focused B1-B7 re-review returned PASS and cleared SS-015 for
  implementation start.
- Claude QA re-review response record:
  `docs/ss-015-claude-qa-rereview-response.md`.
- Notion moved to `3. In Development (ChatGPT)`.
- Codex implemented SS-015 within the approved test/CI-only scope:
  `test/smoke/app.spec.ts` now includes early context-level request recording
  and route blocking before `beforeEach` navigation for the no-network test,
  suite-wide `getUserMedia` negative detection, capture-placeholder assertions,
  shared sensitive-output checks for console and clipboard text, browser
  storage checks, multi-point keyframe canvas pixel sampling, Copy prompt
  clipboard success and unavailable-path coverage, no-external-network checks,
  and mobile overlap/clipping assertions. `.github/workflows/compliance.yml`
  now installs Playwright Chromium, runs `npm run test:smoke` as a blocking CI
  step, and uploads `test-results/` only on failure with seven-day retention.
- Runtime source files were not changed. No telemetry, remote logging, remote
  sharing, camera capture, new workers, model/provider assets, new dependencies,
  or raw personal video fixtures were added.
- Verification on 2026-06-29 PDT under Node v22.22.3:
  - `npm run test:smoke -- --project=desktop-chromium` PASS (16 tests).
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Initial `npm run test:smoke` under Node v24.15.0 was interrupted after no
  output for several minutes and is not used as required verification evidence.
- Final Claude implementation audit handoff:
  `docs/ss-015-claude-audit-prompt.md`.
- Claude final implementation audit returned PASS and cleared SS-015 for PR
  preparation. Claude noted no blockers. The highest-value non-blocking
  recommendation was to strengthen hidden-ID coverage from literal phrase
  matching to include opaque identifier shapes such as UUIDs, long hashes, and
  long URL-safe tokens.
- Claude audit response record:
  `docs/ss-015-claude-audit-response.md`.
- Codex implemented the hidden-ID recommendation as a small test-only follow-up:
  the shared sensitive-output denylist in `test/smoke/app.spec.ts` now also
  matches UUID-shaped identifiers, long hex tokens, and long URL-safe opaque
  tokens.
- Verification after the hidden-ID denylist follow-up on 2026-06-29 PDT under
  Node v22.22.3:
  - `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile
    Chromium).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Focused Claude re-review prompt for the post-PASS denylist delta:
  `docs/ss-015-claude-rereview-prompt.md`.
- Claude focused implementation re-review returned PASS and confirmed the
  hidden-ID/token denylist concern is closed, with no new blockers. Claude
  cleared SS-015 for PR preparation.
- Focused re-review response record:
  `docs/ss-015-claude-rereview-response.md`.
- After the first focused PASS, the focused prompt was updated to include the
  full current `test/smoke/app.spec.ts` file contents. Claude re-reviewed the
  full-file prompt, confirmed the hidden-ID/token denylist concern remains
  closed, cross-checked that 16 smoke tests across two Playwright projects
  account for the reported 32 passing tests, found no new blockers, and again
  cleared SS-015 for PR preparation.
- Additional PR-template verification on 2026-06-29 PDT under Node v22.22.3:
  - `npm run license:audit` PASS.
  - `npm run sbom:generate` PASS. The generated SBOM timestamp/serial metadata
    changed only because of regeneration and was restored because SS-015 has no
    dependency changes.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/15.
- Branch commit pushed for PR #15:
  `bbe2d49b6b29f4be81f619fd7a4c7983869ae70f`.
- PR #15 context-sync commit pushed:
  `f2b82c7dfdb607d8a5ebd5a519e0db24e68e408f`.
- GitHub PR #15 compliance check passed in 1m18s.
- PR #15 merged on 2026-06-30 UTC with merge commit
  `ef19c5df819b37669533500fe4f86a031eb817df`.
- Notion moved to `4. Final Audit (Claude)`.
- Notion Pull Request property was updated with PR #15, and a PR-created
  comment was added.
- Notion moved to `5. Done` after merge, with a merge-state comment recording
  PR #15 and merge commit `ef19c5df819b37669533500fe4f86a031eb817df`.
- Observability decision: runtime observability should remain unchanged for
  SS-015. No runtime observability was added. Only local Playwright diagnostics
  and CI artifacts for failed browser runs were added.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`. Start from synchronized `main`, inspect the Swing
Sync Notion task database/board, and ask the user to confirm the next task if
ordering is ambiguous.

Next-task kickoff check on 2026-06-30:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `f5836311bdb1f871b965bda24ad55322b89817eb` after `git fetch origin`.
- Worktree is clean except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Swing Sync Tasks database still uses handshake values:
  `0. Backlog`, `1. Spec Drafting (Gemini)`,
  `2. QA Planning (Claude)`, `3. In Development (ChatGPT)`,
  `4. Final Audit (Claude)`, and `5. Done`. For board compatibility, use the
  literal `1. Spec Drafting (Gemini)` value after selection while treating
  Codex as research/spec owner under the 2026-06-26 routing update.
- Visible non-Done backlog candidates verified in Notion:
  - `SS-013 Add optional model API adapter behind consent gate`
    (https://app.notion.com/p/375834a0c8a6816491e9d73a30dbf3d2):
    branch `ss-013-model-adapter`, status `0. Backlog`, empty Pull Request,
    Task Type `Feature`. Acceptance: API mode disabled until explicit consent;
    provider adapter is model-neutral; user sees what data will be sent; manual
    Swing Card workflow remains available without keys or server config.
  - `SS-016 Publish README, limitations, and contributor guide`
    (https://app.notion.com/p/375834a0c8a68152bee5f2842be6c6e0):
    branch `ss-016-docs`, status `0. Backlog`, empty Pull Request,
    Task Type `Feature`. Acceptance: README explains purpose, local-first
    design, safety limits, and setup; limitations page covers pose accuracy,
    camera setup, and non-medical scope; contributor guide explains task
    workflow, testing, licenses, and SBOM expectations; trademark/
    non-affiliation disclaimer is visible.
- Sensitivity classification:
  - SS-013 is safety-, privacy-, AI-coaching-, model-provider-, compliance-,
    dependency/licensing-, user-facing-copy-, runtime-, and remote-API-
    sensitive. It requires Codex-owned research/spec drafting, primary-source
    checks for any provider/API facts, Adopt / Revise / Defer / Reject
    dispositions, a self-contained Claude QA planning handoff, and Claude gate
    clearance before implementation.
  - SS-016 is safety-, privacy-, legal/trademark-, medical-scope-,
    compliance-, licensing/SBOM-, and user-facing-copy-sensitive. It requires
    Codex-owned docs-claim research/spec drafting, protected-boundary language
    review, a self-contained Claude QA planning handoff, and Claude gate
    clearance before implementation.
- Notion search found prior `SS-TC-009` through `SS-TC-018` records and the
  Swing Sync Test Cases database, but no obvious dedicated SS-013 or SS-016
  test case. After task selection, create or reconcile a dedicated
  acceptance-aligned test case before implementation.
- User confirmed SS-013 as the next task. Branch `ss-013-model-adapter` was
  created from current `main`; Notion was moved through spec drafting to
  `2. QA Planning (Claude)` after Codex created `SS-TC-019` and the
  research/spec/Claude QA planning artifacts.

Next-task kickoff check on 2026-06-27:

- Local `main` was confirmed at
  `7399ea0403da4ad4da41f7d18cb1312e3445bcc7`, matching the post-SS-012
  context-sync handoff, with a clean tracked worktree and only intentional
  untracked `docs/agent-guidance/*new-codex-session-prompt.md` files present.
- Codex recorded on the SS-012 Notion page that it can emulate the former Deep
  Research workflow for Swing Sync kickoff/spec work: structured research
  questions, source discovery, primary-source verification where needed,
  source URLs/check dates, Adopt / Revise / Defer / Reject dispositions, and
  self-contained spec plus Claude QA planning handoff. This is a Codex-owned
  workflow using available tools, not a separate ChatGPT Deep Research product
  mode invocation in this environment.
- Swing Sync Tasks database view sorts by `Name`. Visible backlog candidates
  inspected in Notion:
  - `SS-014 Create fixture swing dataset policy and test fixtures`, branch
    `ss-014-fixtures-policy`, status `0. Backlog`, empty Pull Request, Task
    Type `Research`.
  - `SS-015 Add browser regression tests for MVP flow`, branch
    `ss-015-browser-tests`, status `0. Backlog`, empty Pull Request, Task Type
    `Feature`.
- SS-014 has a prior SS-007 Notion comment noting that moving side-on browser
  fixture policy, provenance, and coverage were deferred to SS-014 and that it
  is a prerequisite for future stories that make moving-side-on video phase
  accuracy or coverage claims.
- User confirmed SS-014 as the next task. Branch `ss-014-fixtures-policy` was
  created from `main` at `7399ea0403da4ad4da41f7d18cb1312e3445bcc7`.
- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as research/spec owner under the 2026-06-26 routing update.

## SS-014 Coordination

SS-014 is privacy-, licensing-, compliance-, export/test-fixture-, and future
user-facing-policy sensitive. It will define fixture consent, licensing,
provenance, preferred synthetic/derived landmark fixture usage, and blocked
repo-commit content. Treat it as gated: Codex owns research/spec drafting under
the 2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Define consent and licensing policy for fixture videos.
- Prefer synthetic/derived landmark fixtures when possible.
- Add at least one non-identifying fixture for math tests.
- Document what cannot be committed to the repo.

Kickoff/spec state on 2026-06-27:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `7399ea0403da4ad4da41f7d18cb1312e3445bcc7` after `git fetch origin`.
- Worktree was clean except for the SS-014 kickoff `CONTEXT.md` update and
  intentional untracked `docs/agent-guidance/*new-codex-session-prompt.md`
  files, which remain preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a681f08c96eeb40e2213f2
- Branch from current `main`: `ss-014-fixtures-policy`.
- Pull Request: none.
- Task Type: `Research`.
- Dedicated test case `SS-TC-017` was created:
  https://app.notion.com/p/38d834a0c8a681ffb241edf6cfe45788
- `SS-TC-017` covers allowed/blocked fixture classes, consent/licensing/
  provenance metadata, non-identifying synthetic or derived landmark fixture
  preference, at least one repo-committable non-identifying math-test fixture,
  protected no-raw-personal-video/no-unverified-third-party-media boundaries,
  no hidden identifiers, no telemetry/remote storage, and no overbroad privacy,
  deletion, anonymity, legal, compliance, safety, professional coaching, or
  moving-video phase-accuracy claims.
- Codex-owned research/disposition note:
  `docs/ss-014-research-disposition.md`.
- Candidate normative specification:
  `docs/ss-014-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-014-claude-qa-planning-prompt.md`.
- The Claude QA planning prompt embeds the exact current contents of
  `docs/ss-014-research-disposition.md`,
  `docs/ss-014-preimplementation-spec.md`, and the `SS-TC-017` Notion test
  case, plus a source-sensitive summary of the existing mannequin fixture
  provenance, so it can be pasted into Claude Chat without filesystem access.
- Source checks were recorded for Creative Commons license constraints, SPDX
  identifiers, GitHub large-file guidance, OpenAI output terms for the existing
  generated-fixture precedent, and current repo privacy/licensing/model/safety
  policies.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with eight blockers:
  unenumerated fixture classes lacked a default-deny rule; maintainer approval
  was only a free-text field; fixture classes risked prose/code drift; size
  thresholds were ambiguous; three validator error codes lacked explicit
  tests; AI-generation terms review was not a distinct provenance field; the
  validation contract did not restate zero-new-dependency implementation; and
  validator wiring used non-committal `likely` language.
- Claude QA response:
  `docs/ss-014-claude-qa-response.md`.
- Codex accepted B1-B8 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with a canonical
  `scripts/fixture-policy-data.mjs` source, `FIXTURE_CLASS_UNKNOWN`
  default-deny behavior, explicit PR-review/CODEOWNERS approval semantics,
  exact size threshold/error-code mapping, `FIXTURE_AI_TERMS_MISSING`,
  mandatory zero-new-dependency `npm run fixture:verify` wired into
  `npm run compliance:verify`, and explicit tests for every error code plus
  boundary/dependency/canonical-source drift checks.
- The original Claude QA planning prompt is superseded for paste use. Focused
  B1-B8 re-review prompt: `docs/ss-014-claude-qa-rereview-prompt.md`.
- Claude focused B1-B8 re-review confirmed B1-B8 are closed and returned FAIL
  with three narrow new blockers: no test proving the validator reads from the
  canonical source, no controlled mechanism to identify AI-generated fixtures,
  and ambiguous general approval versus AI-generated output-rights approval
  fields.
- Codex accepted NB1-NB3 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with validator-to-canonical-source
  test requirements, controlled `generationMethod` values from the canonical
  source, `unknown` generation method blocked by default, and distinct
  `maintainerApproval` versus `aiGeneratedOutputRightsApproval` fields.
- Focused NB1-NB3 re-review prompt:
  `docs/ss-014-claude-qa-rereview-2-prompt.md`.
- Claude focused NB1-NB3 re-review confirmed NB1-NB3 are closed and returned
  FAIL with one narrow new blocker: `generationMethod` lacked a value for
  first-party real-person recordings, leaving
  `maintainer-recorded-personal-media` unrepresentable without mislabeling it
  as `third-party-source` or `unknown`.
- Codex accepted NB4 as valid and revised
  `docs/ss-014-preimplementation-spec.md` with `recorded-real-person` as a
  controlled `generationMethod`, mapped `maintainer-recorded-personal-media` to
  it, and stated that `recorded-real-person` remains blocked in SS-014 through
  the `maintainer-recorded-personal-media` class until a future consent/release
  workflow is separately approved. Codex also incorporated Claude's
  non-blocking clarifications: prefer behavior-driving validator-to-canonical-
  source tests, map missing `aiGeneratedOutputRightsApproval` to
  `FIXTURE_AI_TERMS_MISSING`, and require a negative test showing non-AI
  `generationMethod` values do not trigger AI-terms errors.
- Focused NB4 confirmation prompt:
  `docs/ss-014-claude-qa-rereview-3-prompt.md`.
- Claude focused NB4 confirmation returned PASS. Claude explicitly cleared
  Codex to move SS-014 to implementation and stated that final implementation
  audit should include actual source for `scripts/fixture-policy-data.mjs`,
  `scripts/verify-fixtures.js`, and executed evidence for all eleven validator
  error codes plus validator-to-source behavior.
- Codex moved Notion to `3. In Development (ChatGPT)` and implemented SS-014:
  `docs/fixture-policy.md`, canonical `scripts/fixture-policy-data.mjs`,
  zero-dependency `scripts/verify-fixtures.js`, `npm run fixture:verify` wired
  into `npm run compliance:verify`, fixture manifests for
  `test/fixtures/math` and existing `test/fixtures/pose-landmarker`, a
  non-identifying synthetic math landmark fixture, fixture-policy unit
  coverage, and a geometry metric test that loads the committed fixture.
- Final Claude implementation audit handoff:
  `docs/ss-014-claude-audit-prompt.md`.
- The final audit prompt embeds the focused implementation diff for the policy,
  canonical policy data, verifier, manifests, synthetic math fixture, package
  scripts, fixture-policy tests, and geometry fixture-load test.
- Verification on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Dependency/license exception checks (`npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`) were not
  run because SS-014 added no dependency and no license exception. The new unit
  coverage asserts dependencies/devDependencies are unchanged and that
  `fixture:verify` is wired into `compliance:verify`.
- Observability/runtime state: no runtime app behavior was added. No telemetry,
  remote logging, storage, network behavior, SDK/provider/model asset, worker,
  dependency, or remote sharing was added. Only local developer verification
  output from `fixture:verify` is introduced, using sanitized paths and stable
  error codes.
- Notion was moved to `4. Final Audit (Claude)` and a comment recorded the
  implementation summary, final audit prompt path, verification evidence, and
  unchanged runtime/observability boundaries.
- Claude final implementation audit returned FAIL with four blockers:
  `recorded-real-person` generation method was documented as blocked but not
  enforced by the validator; `aiGeneratedOutputRightsApproval` was checked only
  for truthy presence instead of approver/date/mechanism shape; the
  zero-dependency guard used a hardcoded current dependency array rather than a
  pre-SS-014 baseline; and unsafe-claim detection missed several prohibited
  phrase variants including anonymity, legal compliance, qualified privacy
  guarantees, medical advice/diagnosis, and biomechanical correctness.
- Codex accepted all four findings as valid and fixed them:
  `scripts/fixture-policy-data.mjs` now exposes canonical
  `blockedGenerationMethods` with `recorded-real-person` and `unknown`;
  `scripts/verify-fixtures.js` enforces that canonical blocked-generation list;
  `aiGeneratedOutputRightsApproval` now uses the same approver/date/mechanism
  shape validation under `FIXTURE_AI_TERMS_MISSING`; unsafe-claim patterns were
  expanded for the audited phrase variants; manifest limitation wording was
  revised to avoid repeating prohibited phrases even in negated disclaimers;
  and the zero-dependency guard was revised again after focused review to
  compare current dependency sets against the branch-base `package.json`
  retrieved from git history.
- Focused Claude final audit re-review prompt:
  `docs/ss-014-claude-rereview-prompt.md`. The original
  `docs/ss-014-claude-audit-prompt.md` is now marked superseded for paste use.
- Verification after audit fixes on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Claude focused final audit re-review confirmed B1, B2, and B4 are closed and
  returned FAIL on one residual B3 issue: the checked-in dependency baseline
  file was not itself tied to actual pre-SS-014 git history.
- Codex accepted the residual B3 finding as valid, removed the checked-in
  `test/baselines/package-dependencies.pre-ss-014.json`, and changed the
  zero-dependency guard to compare current `package.json` dependency sets
  against `git show 7399ea0403da4ad4da41f7d18cb1312e3445bcc7:package.json`.
  That commit is the synchronized post-SS-012 main state recorded as the
  branch base for SS-014. The existing
  `@swing-sync-test/bundled-prohibited-package` dependency is therefore
  verified against the base commit as pre-existing bundled-license fixture
  tooling, not an SS-014 addition.
- Focused B3-only Claude re-review prompt:
  `docs/ss-014-claude-rereview-2-prompt.md`. The previous focused prompt is
  now marked superseded for paste use.
- Verification after the residual B3 fix on 2026-06-27 PDT:
  - `npm run fixture:verify` PASS.
  - `npm run test:unit -- fixture-policy geometry-metrics` PASS
    (2 files, 33 tests).
  - `npm run test:unit` PASS (12 files, 122 tests).
  - `npm run build` PASS.
  - `npm run compliance:verify` PASS.
  - `npm run safety:verify` PASS.
  - `npm run privacy:verify` PASS.
  - `git diff --check` PASS.
- Claude B3-only focused re-review returned PASS. Claude stated all
  implementation findings are closed and explicitly cleared Codex to prepare
  the PR. Claude's non-blocking PR notes: mention that
  `@swing-sync-test/bundled-prohibited-package` is pre-existing local
  bundled-license/prohibited-package fixture tooling, mention the fixture
  unsafe-claim scanner intentionally fails closed on risky words even in
  negated/disclaiming phrasing, and optionally add a future hardening check
  that the pinned branch-base commit remains an ancestor of `HEAD`.
- Claude final audit response record:
  `docs/ss-014-claude-audit-response.md`.
- Codex committed SS-014 implementation and audit artifacts at
  `54283df292272e6679ec8c0e65da46290ef168d1` and pushed branch
  `ss-014-fixtures-policy`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/14.
- Notion Pull Request property was updated with PR #14, and a Notion comment
  recorded the commit, PR URL, Claude PASS, verification evidence, unchanged
  runtime/observability boundaries, and non-blocking PR review notes.
- PR #14 GitHub compliance check completed successfully on head
  `88bf01bbd4c1d839dce13ec5ad14e4d4bdd8dc6e`; PR remained open and
  mergeable.
- PR #14 was merged on 2026-06-27 local time. Merge commit:
  `5e8c0c93b165806ad4911db6a0e53d2a6041f2da`.
- Local checkout is back on `main` at the PR #14 merge commit and matched
  `origin/main` before this post-merge context sync. The story branch was
  deleted on GitHub by `gh pr merge --merge --delete-branch`.
- SS-014 completed scope:
  - fixture consent/licensing/blocklist policy in `docs/fixture-policy.md`;
  - canonical fixture policy data and zero-dependency validator in
    `scripts/fixture-policy-data.mjs` and `scripts/verify-fixtures.js`;
  - `npm run fixture:verify` wired into `npm run compliance:verify`;
  - non-identifying synthetic math fixture plus provenance under
    `test/fixtures/math`;
  - provenance manifest for the existing mannequin pose-landmarker fixture;
  - fixture-policy unit coverage and geometry metric coverage loading the
    committed fixture.
- SS-014 Notion was updated with PR #14 and merge state and moved to `5. Done`.

Next owner: Codex/user to select the next backlog task. No active task is
selected in `CONTEXT.md`.

## SS-012 Coordination

SS-012 is safety-, AI-coaching-, model-provider-adjacent, export-adjacent, and
user-facing-copy sensitive. It will design a multimodal coaching prompt and
response schema for educational golf movement feedback grounded in approved
Swing Card evidence. Treat it as gated: Codex owns research/spec drafting under
the 2026-06-26 LLM-team routing update, and Claude remains the independent QA
planning and final adversarial audit reviewer.

Acceptance criteria from Notion:

- Prompt uses frames, metrics, confidence, and safety constraints.
- Response schema separates observations, likely causes, drills, cautions, and
  next focus.
- Prompt refuses medical diagnosis and overconfident biomechanical claims.
- Includes adversarial prompt tests.

Kickoff state on 2026-06-27:

- Local `main`, `origin/main`, and `HEAD` were confirmed at
  `ac5aed1b840a9f881b5875cca0b82cf2ac50d3f8` after `git fetch origin`.
- Worktree was clean except for intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
  preserved.
- Notion page:
  https://app.notion.com/p/375834a0c8a681659faaf9db57c6f759
- Branch from current `main`: `ss-012-coach-prompt`.
- Notion first moved to `1. Spec Drafting (Gemini)` for board compatibility,
  with Codex noted as the research/spec owner under the 2026-06-26 LLM-team
  routing update. After Codex-owned planning artifacts were drafted, Notion was
  moved to `2. QA Planning (Claude)`.
- Pull Request: https://github.com/ajason13/swing-sync/pull/13.
- Task Type: `Feature`.
- Dedicated test case `SS-TC-016` was created for acceptance-aligned coverage:
  prompt inputs from approved frames, metrics, confidence, warnings, and safety
  constraints; structured observations/likely-causes/drills/cautions/next-focus
  output; medical, rehabilitation, pain-triage, aggressive-prescription,
  overconfident-biomechanics, prompt-injection, fabricated-metric, and
  provider-specific adversarial cases; and protected no-raw-video, no-remote
  API, no-telemetry, no-persistence, no-new-SDK/provider/model/dependency
  boundaries.
- Codex-owned research/disposition note:
  `docs/ss-012-research-disposition.md`.
- Candidate normative specification:
  `docs/ss-012-preimplementation-spec.md`.
- Self-contained Claude QA planning handoff:
  `docs/ss-012-claude-qa-planning-prompt.md`.
- Claude QA planning returned FAIL with six specification blockers:
  unspecified item text length, unbounded response-section arrays,
  unconstrained `phaseId`, no structural unavailable/review-required text
  rule, missing validation error-code taxonomy, and unspecified unsafe-text
  detection.
- Codex accepted B1-B6 as valid and revised
  `docs/ss-012-preimplementation-spec.md` with exported text/count bounds,
  closed `PhaseId` use, exact unavailable/review-required templates,
  validation context for fabricated supported evidence, exhaustive
  `CoachingValidationErrorCode` values, exported prohibited text patterns, and
  explicit SS-006 `observedSeekTimestampMs` non-regression.
- Claude QA response:
  `docs/ss-012-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-012-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL after confirming B1-B6 are closed.
  New blocker B7 identified `CoachingValidationContext` as a potential second
  source of truth unless tied by construction to actual Swing Card evidence.
  Minor issue B8 asked for an explicit prohibited-text normalization floor and
  adversarial evasion test expectations.
- B7/B8 response: `docs/ss-012-claude-qa-rereview-response.md`.
- `docs/ss-012-preimplementation-spec.md` now requires
  `validateCoachingResponse(value, content: SwingCardContent)` to derive
  `CoachingValidationContext` internally from the same Swing Card content used
  for prompt generation; production validation must not accept caller-supplied
  context. The spec also requires NFKC normalization, zero-width character
  removal, Unicode whitespace collapse, and trim before prohibited-pattern
  matching, with adversarial tests for mixed case, whitespace padding,
  zero-width insertion, and a documented Unicode-lookalike limitation case.
- Focused B7/B8 re-review handoff:
  `docs/ss-012-claude-qa-rereview-2-prompt.md`.
- Claude focused B7/B8 QA re-review returned PASS. B7 and B8 are closed with no
  new blockers, and Claude cleared SS-012 to move to
  `3. In Development (ChatGPT)`.
- Claude B7/B8 PASS response:
  `docs/ss-012-claude-qa-rereview-2-response.md`.
- Non-blocking implementation audit watch items: confirm `limited` evidence
  status derives by elimination rather than a separate mutable list, and add a
  code comment that `coachingProhibitedTextPatterns.description` is
  developer/test-only and must not be surfaced through validation results or UI.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for approved prompt/schema scope only:
  `src/coaching-contract.ts`, `src/coaching-prompt.ts`, and
  `test/unit/coaching-prompt.test.ts`.
- The implementation adds a zero-dependency educational coaching prompt
  builder, versioned coaching response contract, deterministic validation
  result codes, Swing Card-derived validation context, exact unavailable and
  review-required templates, prohibited text pattern data, text normalization,
  and SS-TC-016 adversarial unit coverage.
- `limited` evidence status is derived by elimination from real
  `SwingCardContent` evidence and is not tracked in a separate mutable list.
  `coachingProhibitedTextPatterns.description` has a code comment documenting
  that descriptions are developer/test-only and must not surface through
  validation results or UI.
- No connected model API calls, provider SDKs, API keys, server config, remote
  sharing, cloud storage, telemetry, remote logging, public serving, model
  assets, new workers, new dependencies, raw swing video upload, persistence,
  or UI integration were added.
- Observability is intentionally unchanged; no logs, analytics, telemetry,
  traces, remote diagnostics, storage writes, console payload dumps, provider
  calls, or persistent debug artifacts were added.
- Verification passed: `npm run test:unit -- coaching-prompt` (12 tests),
  `npm run test:unit` (113 tests across 11 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Source-inclusive final audit prompt:
  `docs/ss-012-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL with B9/B10:
  `supported` was not rejected for limited-evidence phases, and the
  partial-overlay test only asserted the permissive `limited` path.
- B9/B10 response: `docs/ss-012-claude-audit-response.md`.
- `src/coaching-contract.ts` now derives `limitedPhaseIds` from
  `SwingCardContent` and rejects `supported` on limited-evidence phases with
  `LIMITED_EVIDENCE_REQUIRES_LIMITED_STATUS`. Limited evidence is present but
  incomplete evidence, such as partial overlay without measured metric,
  rendered keyframe without measured metric, or measured metric without rendered
  keyframe.
- `test/unit/coaching-prompt.test.ts` now asserts partial-overlay evidence
  accepts `limited` and rejects `supported`, and separately covers metric-only
  limited evidence plus missing-metric unavailable evidence.
- B9/B10 verification passed: `npm run test:unit -- coaching-prompt` (13
  tests), `npm run test:unit` (114 tests across 11 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- The original final audit prompt is superseded. Focused B9/B10 re-review
  prompt: `docs/ss-012-claude-final-rereview-prompt.md`.
- Claude focused B9/B10 final re-review returned PASS with no new blockers.
  Response: `docs/ss-012-claude-final-rereview-response.md`.
- Non-blocking recommendation from Claude: add a future regression test for a
  rendered-overlay phase with no measured metric to complete the evidence
  matrix. This does not block SS-012 PR preparation.

- Pull Request created: https://github.com/ajason13/swing-sync/pull/13.

- PR #13 merged on 2026-06-27 with merge commit
  `befbceda9a191c94e6090abd8d9f62b35b56f8f8`.
- Notion marked `5. Done`.
- Post-merge context sync pushed to `main`.

Next owner: Codex/user to select the next backlog task. No active task is
selected after SS-012.

## SS-009 Coordination

SS-009 is safety-, coaching-, and privacy-sensitive metric-calculation support
work. It will implement local joint angle and coordinate-normalization
utilities that consume pose landmark-like inputs and return bounded educational
metric primitives or warnings. Treat this as sensitive: Gemini researches and
drafts the specification, Codex verifies and implements only after approved
planning gates, and Claude performs adversarial QA planning plus final audit.

Acceptance criteria:

- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

Kickoff state on 2026-06-19:

- Local `main` and `origin/main` include post-SS-008 context sync and merge
  commit
  `35a569941b46744338f274f70d5eb826cfabdb1f`.
- SS-008 is merged and marked `5. Done` in Notion.
- SS-009 Notion page:
  https://app.notion.com/p/375834a0c8a68184b16fed21d44b5394
- Notion reconfirmed branch `ss-009-angle-utils`, initial `0. Backlog`
  status, empty PR, and the acceptance criteria above.
- Branch `ss-009-angle-utils` was created from current `main` at
  `8e2b44942a15fde9863853c6be30dc2b4ceaeb3d` after `git fetch origin`
  confirmed `HEAD` and `origin/main` matched.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No SS-009-specific test case existed in Notion. Dedicated `SS-TC-013` was
  created for deterministic synthetic coordinate coverage, left/right and
  mirrored handedness behavior, missing/invalid landmark warnings, edge cases,
  and protected local-first safety/privacy boundaries.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-009-gemini-chat-deep-research-prompt.md`. It uses a lean
  steering prompt, a 10-file maximum attachment list for Gemini Chat, embedded
  summaries of omitted prior-story artifacts, and a required task-specific
  research plan before the deep research run.
- Gemini Chat Deep Research returned a broad metric-utilities report. Codex
  dispositioned it in `docs/ss-009-research-disposition.md`, adopting the
  zero-dependency geometry direction while revising or rejecting the global 3D
  target-line transform, unverified world-axis claims, payload/schema expansion,
  diagnostic logging, absolute privacy claims, unsupported biological ranges,
  and CaddieSet formula/data reuse.
- The candidate normative specification is
  `docs/ss-009-preimplementation-spec.md`.
- The self-contained Claude QA planning handoff is
  `docs/ss-009-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with five specification blockers:
  underspecified lead-arm-plane landmarks/reference, missing ratio denominator
  guards, unclear mirroring rules for magnitude primitives, ambiguous malformed
  landmark handling, and undefined warning collection order.
- `docs/ss-009-preimplementation-spec.md` now addresses B1-B5 with explicit
  public functions, exact lead-arm-plane vectors/formula, cumulative warning
  order, malformed-landmark classification, warning-applicability and
  denominator-threshold tables, raw-distance-only ratio semantics, and expanded
  synthetic edge-case test requirements.
- Claude QA response: `docs/ss-009-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-009-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL with one new blocker, B6: warning
  results could be ambiguous if geometry was technically computable, and
  baseline landmark visibility scope was unclear for ratio primitives.
- B6 is now addressed in `docs/ss-009-preimplementation-spec.md`: any
  non-empty warning array forces `status: "unavailable"` and `value: null`;
  `measured` requires zero warnings; baseline landmarks use the same malformed,
  non-finite, and `MIN_LANDMARK_VISIBILITY` validation as active landmarks; and
  the test matrix covers warning-only unavailable results plus baseline
  low-visibility cases.
- Claude second focused QA re-review returned PASS. B1-B6 are closed, and
  Claude authorized moving SS-009 to `3. In Development (ChatGPT)`.
- Implementation completed for geometry utility/test scope only:
  `src/geometry-metrics.ts` and `test/unit/geometry-metrics.test.ts`.
- The implementation adds pure zero-dependency geometry primitives for
  shoulder angle, spine angle, lead/trail knee flex, lead arm plane, hip
  rotation proxy, and head displacement. Invalid, missing, low-visibility,
  undeclared, malformed, zero-length, missing-baseline, or insufficient-
  baseline inputs return deterministic warnings with `status: "unavailable"`
  and `value: null`.
- No metric payload generation, schema expansion, runtime UI, export,
  persistence, telemetry, remote logging, network behavior, dependencies,
  SDK/model/provider changes, workers, or public serving were added.
- Observability is intentionally unchanged; no logs, diagnostics, analytics,
  traces, telemetry, storage writes, or debug payloads were added.
- Pre-audit verification passed before the final audit: `npm run test:unit -- geometry-metrics`
  (21 tests), `npm run test:unit` (72 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Final audit prompt: `docs/ss-009-claude-audit-prompt.md`.
- Claude final implementation audit returned FAIL with B7: the audit prompt
  summarized `src/geometry-metrics.ts` and
  `test/unit/geometry-metrics.test.ts` instead of embedding the actual source,
  so Claude could not directly verify the implementation.
- B7 is accepted as a valid process blocker for this sensitive story.
  Response recorded in `docs/ss-009-claude-audit-response.md`.
- Codex added focused hardening tests for active low visibility, unused-array
  corruption independence for lead/trail knee flex, and single-warning-only
  unavailable results across all public primitives.
- Targeted verification after B7 response passed:
  `npm run test:unit -- geometry-metrics` (24 tests).
- Full verification after B7 response passed: `npm run test:unit` (75 tests
  across 8 files), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`, and `git diff --check`.
- Source-inclusive focused final re-review prompt:
  `docs/ss-009-claude-final-rereview-prompt.md`. It embeds the full current
  contents of `src/geometry-metrics.ts` and
  `test/unit/geometry-metrics.test.ts` for direct Claude audit.
- Claude source-inclusive focused final re-review returned FAIL. B7 was closed
  and C2-C4 were confirmed closed, but C1 remained blocking because `finalize`
  guessed `["ZERO_LENGTH_VECTOR"]` when a null or non-finite value reached
  finalization with no collected warnings.
- C1 is now addressed: `finalize` no longer fabricates a fallback warning;
  null or non-finite values without collected warnings throw an invariant error;
  and side selection now records `UNDECLARED_HANDEDNESS` at `leadSide` /
  `trailSide` through `sideIndex(..., collector)`.
- Added a focused cumulative-warning regression for low visibility plus
  zero-length geometry warnings.
- Verification after the C1 fix passed: `npm run test:unit -- geometry-metrics`
  (25 tests), `npm run test:unit` (76 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- Focused final re-review 2 prompt:
  `docs/ss-009-claude-final-rereview-2-prompt.md`.
- Claude second focused final re-review returned FAIL only pending explicit
  confirmation of the intentional `calculateSpineAngle` handedness-validation
  asymmetry. Claude retracted B10 and confirmed the C1 structural fix.
- B11/N13 response: `calculateSpineAngle` intentionally relies on standalone
  `validateHandedness` because it does not side-select and `signedHorizontal`
  has no undefined/error path where a warning can be emitted structurally. A
  code comment now records this at the validation call.
- Focused verification after the B11/N13 comment passed:
  `npm run test:unit -- geometry-metrics` (25 tests) and `git diff --check`.
- Focused final re-review 3 prompt:
  `docs/ss-009-claude-final-rereview-3-prompt.md`.
- Claude final implementation audit closing review returned PASS. All B1-B7,
  C1-C4, B10, and B11/N13 items are closed or confirmed, and Claude signed off
  that SS-009 is ready for PR preparation.
- Pre-PR verification passed: `npm run test:unit` (76 tests across 8 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`, `npm run sbom:generate`,
  and `git diff --check`. `docs/sbom.json` timestamp/serial churn from
  generation was restored because SS-009 adds no dependencies.
- Pull Request: https://github.com/ajason13/swing-sync/pull/10
- PR #10 merged on 2026-06-20 at merge commit
  `3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86`. Local `main` and `origin/main`
  both include that merge plus post-SS-009 context/prompt sync commits.
- Post-merge Notion sync is complete. Notion auth was restored, SS-009 is
  marked `5. Done`, PR #10 is recorded, and a comment records merge commit
  `3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86` plus post-merge context sync.
- A new Codex session prompt is available at
  `docs/agent-guidance/post-ss-009-next-codex-session-prompt.md`.
- Preserve the existing untracked agent-guidance prompt files unless the user
  explicitly asks to clean or commit them.

## SS-010 Coordination

SS-010 is a privacy- and export-sensitive rendering story. It will add readable
skeleton overlays to selected keyframes while preserving the local-first raw
video boundary and avoiding unapproved raw-video export. Treat it as gated:
Gemini researches and drafts the rendering/privacy specification, Codex verifies
and implements after approved planning gates, and Claude performs adversarial QA
planning plus final audit.

Acceptance criteria from Notion:

- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Kickoff state on 2026-06-20:

- Notion page:
  https://app.notion.com/p/375834a0c8a681c280ccc35381721a27
- Branch: `ss-010-skeleton-overlays`
- Handshake Status: `4. Final Audit (Claude)`
- Pull Request: https://github.com/ajason13/swing-sync/pull/11
- Task Type: `Feature`
- Local `main` and `origin/main` were confirmed at
  `850b012652ca4c1553f852aec48188c04bd49202` after `git fetch origin`.
- Worktree was clean except for intentional untracked
  `docs/agent-guidance/ss-00*-new-codex-session-prompt.md` files, which remain
  preserved.
- Branch `ss-010-skeleton-overlays` was created from current `main`.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No dedicated SS-010 test case existed in Notion. Dedicated `SS-TC-014` was
  created for readable skeleton overlays, mobile preview legibility,
  privacy-preserving annotated still output, reusable export-frame boundaries,
  malformed or unavailable landmark/keyframe handling, and protected
  local-first privacy/safety boundaries.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-010-gemini-chat-deep-research-prompt.md`. It uses a
  10-file maximum attachment list, embedded summaries of omitted prior-story
  artifacts, and a required task-specific research plan before the deep
  research run.
- Gemini Chat Deep Research returned a broad skeleton-overlay rendering report.
  Codex dispositioned it in `docs/ss-010-research-disposition.md`, adopting the
  zero-dependency Canvas 2D direction, DPR-aware rendering with a local cap,
  facial-landmark exclusion, explicit 18-segment topology, and segment-level
  visibility gating while revising or rejecting guaranteed-contrast claims,
  whole-overlay occlusion thresholds, mirroring transforms for overlay
  alignment, and `toBlob`/Object URL export serialization in SS-010.
- The candidate normative specification is
  `docs/ss-010-preimplementation-spec.md`. It defines `src/pose-topology.ts`,
  `src/pose-renderer.ts`, reusable caller-provided canvas rendering, review UI
  integration, mobile/desktop verification, and strict no-serialization,
  no-download, no-persistence, no-remote-sharing boundaries.
- The self-contained Claude QA planning handoff is
  `docs/ss-010-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with seven specification blockers:
  ambiguous `mapNormalizedPoint` validation ownership, missing warning
  precedence for multi-failure landmarks, underdetermined core-evidence versus
  no-renderable-segment status semantics, undefined segment count invariants,
  unconstrained accessible-label content, unstated canvas/`ImageBitmap`
  lifecycle ownership across keyframe switches, and unclear re-render versus
  caching expectations.
- `docs/ss-010-preimplementation-spec.md` now addresses B1-B7 with explicit
  mapper versus renderer validation ownership, exact per-landmark warning
  precedence, deterministic segment-count invariants, independent
  `NO_RENDERABLE_SEGMENTS` and `INSUFFICIENT_CORE_LANDMARKS` fixtures,
  accessible-label privacy/copy constraints, synchronous render semantics,
  `ImageBitmap` ownership retained by `FrameProcessingController`, and a
  no-cached-annotated-pixels rule for keyframe switching.
- Claude QA response: `docs/ss-010-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-010-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS. B1-B7 are closed, no new blockers
  were introduced, and Claude signed off that Codex may move to implementation.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for approved overlay-rendering scope only:
  `src/pose-topology.ts`, `src/pose-renderer.ts`,
  `test/unit/pose-renderer.test.ts`, plus focused integration changes in
  `src/main.ts`, `src/styles.css`, and `test/smoke/app.spec.ts`.
- The implementation adds a zero-dependency Canvas 2D annotated-still renderer
  for selected sampled keyframes, explicit 18-segment non-facial topology,
  deterministic warning/status semantics, DPR capping, one reused primary
  review canvas, bounded accessible labels, mobile keyframe controls, and
  no-cached-annotated-pixel keyframe switching.
- No raw-video export, image serialization, `toBlob`, `toDataURL`,
  `URL.createObjectURL`, downloads, persistence, remote sharing, telemetry,
  remote logging, dependencies, SDK/model/provider changes, workers, public
  serving, metric payload export, or coaching/correctness claims were added.
- Observability is intentionally unchanged; no logs, analytics, metrics,
  traces, telemetry, debug payloads, storage writes, or console diagnostics
  were added.
- Verification passed: `npm run test:unit` (88 tests across 9 files),
  `npm run build`, `npm run compliance:verify`, and `git diff --check`.
- Browser verification: direct built-preview Chromium overlay smoke check
  passed. It served the built app, selected the local fixture video, opened
  review after local inference, switched to the `Top` keyframe, verified one
  annotated canvas with positive dimensions and mobile layout, no horizontal
  overflow, no IndexedDB or Cache API entries, no external requests, no
  sensitive console logs matching landmarks/worldLandmarks/media
  characteristics/filename, and no forbidden export/privacy text matching
  download/raw video export/anonymous/guaranteed.
- `npm run test:smoke` was attempted in sandboxed and escalated modes but hung
  before Playwright emitted test progress. `node_modules/.bin/playwright test
  --list --no-deps` also hung, including after temporarily removing new smoke
  blocks, so Codex treated this as a local Playwright runner/environment issue
  and used the direct built-preview Chromium check as browser evidence.
- Source-inclusive final audit prompt:
  `docs/ss-010-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)`.
- Claude final implementation audit returned FAIL with three blockers:
  duplicated finite/range validation ownership between `classifyLandmark` and
  `mapNormalizedPoint`, hardcoded no-pose segment/core warning derivation, and
  incomplete direct browser smoke evidence for exact mobile viewport,
  touch-target, and keyframe-switch single-canvas assertions.
- Audit response: `docs/ss-010-claude-audit-response.md`.
- B1 is addressed in `src/pose-renderer.ts`: one `classifyCoordinate` helper
  now owns coordinate finite/range checks for both `mapNormalizedPoint` and
  `classifyLandmark`; `validateLandmark` calls non-validating
  `mapValidatedPoint` only after classification succeeds; and the dead
  `mapNormalizedPoint` fallback warning path is removed.
- B2 is addressed in `src/pose-renderer.ts`: the missing-pose path adds
  `MISSING_POSE`, uses an empty landmark array, and lets the standard segment
  and core loops derive `MISSING_LANDMARK`, `NO_RENDERABLE_SEGMENTS`, and
  `INSUFFICIENT_CORE_LANDMARKS`.
- B3 is addressed with expanded direct built-preview Chromium verification at
  exact viewport `390x844`, asserting one canvas after switching to `Top`,
  bounded accessible label, canvas rect `306x172`, no horizontal overflow,
  `minButtonHeight: 48`, no IndexedDB or Cache API entries, no external
  requests, no sensitive console logs, and no forbidden export/privacy text.
- Verification after the audit fixes passed:
  `npm run test:unit -- pose-renderer` (12 tests), `npm run test:unit` (88
  tests across 9 files), `npm run build`, `npm run compliance:verify`,
  expanded direct built-preview Chromium overlay smoke check, and
  `git diff --check`.
- Observability remains intentionally unchanged after the audit fixes; no logs,
  analytics, metrics, traces, telemetry, debug payloads, storage writes, or
  console diagnostics were added.
- The superseded final audit prompt now redirects to the source-focused
  re-review prompt:
  `docs/ss-010-claude-final-rereview-prompt.md`.
- Claude focused final re-review returned PASS. B1-B3 are closed, no new
  blockers were introduced, and Claude signed off that SS-010 may proceed to
  PR preparation.
- Claude final re-review response:
  `docs/ss-010-claude-final-rereview-response.md`.
- Final pre-PR verification passed after Claude PASS:
  `npm run test:unit` (88 tests across 9 files), `npm run build`,
  `npm run compliance:verify`, `npm run license:audit`,
  `npm run sbom:generate`, and `git diff --check`. `docs/sbom.json`
  changed only generated serial/timestamp metadata, so that churn was restored
  because SS-010 adds no dependencies.
- Pull Request opened:
  https://github.com/ajason13/swing-sync/pull/11. Notion Pull Request is
  recorded and a Notion comment records Claude PASS, final verification, the
  restored SBOM metadata churn, and the remaining local Playwright runner
  limitation.
- PR #11 merged on 2026-06-25 at merge commit
  `1bb76b1c9dbfd1943cb65ad0176f859417d52eec`. Local `main` and `origin/main`
  both resolve to that merge commit after fast-forward.
- Post-merge Notion sync is complete. SS-010 is marked `5. Done`, PR #11 is
  recorded, and a Notion comment records the merge commit and post-merge state.
- A new Codex session prompt for SS-011 is available at
  `docs/agent-guidance/ss-011-new-codex-session-prompt.md`.

SS-010 is complete.

## SS-011 Coordination

SS-011 is an export-, privacy-, safety/copy-, and AI-chat-prompt-sensitive
story. It will generate a downloadable Swing Card that can include selected
annotated keyframes, bounded metric outputs, warnings/limitations, and an
analysis prompt suitable for manual upload to an LLM chat interface. Treat it
as gated: Gemini researches and drafts the export/privacy/prompt
specification, Codex verifies and implements after approved planning gates, and
Claude performs adversarial QA planning plus final audit.

Acceptance criteria from Notion:

- Swing Card includes selected keyframes, metrics, warnings, and analysis
  prompt.
- Export works as PNG or PDF.
- No unapproved raw video is included.
- Output remains usable for manual upload to an LLM chat interface.

Kickoff state on 2026-06-25:

- Notion page:
  https://app.notion.com/p/375834a0c8a6813ba976c741f4837614
- Branch: `ss-011-swing-card`
- Handshake Status: `5. Done`
- Pull Request: https://github.com/ajason13/swing-sync/pull/12
- Task Type: `Feature`
- Local `main` and `origin/main` include SS-010 merge commit
  `1bb76b1c9dbfd1943cb65ad0176f859417d52eec` and post-SS-010 context/prompt
  sync commits.
- Existing untracked `docs/agent-guidance/ss-00*-new-codex-session-prompt.md`
  files remain preserved unless the user explicitly asks to clean or commit
  them.
- `git fetch origin` confirmed local `main` and `origin/main` matched at
  `c28ebbca5b0b60dc0cb54f3967e0d0150b7904c7`; branch
  `ss-011-swing-card` was created from that commit.
- Notion moved to `1. Spec Drafting (Gemini)`.
- No SS-011-specific test case existed in Notion. Dedicated `SS-TC-015` was
  created for downloadable PNG/PDF Swing Card export, selected annotated
  keyframes, bounded metric and warning inclusion, no raw-video inclusion,
  prompt-copy safety, privacy boundaries, and manual LLM upload usability.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-011-gemini-chat-deep-research-prompt.md`. It uses a
  10-file maximum attachment list, embedded summaries of omitted prior-story
  artifacts, and a required task-specific research plan before the deep
  research run.
- Gemini Chat Deep Research returned a broad export architecture report.
  Codex dispositioned it in `docs/ss-011-research-disposition.md`, adopting
  the zero-dependency Canvas 2D PNG direction, same-origin/local draw inputs,
  user-initiated Blob/Object URL downloads, bounded text wrapping, and
  browser-native print/save-to-PDF path while revising or rejecting hard memory
  cleanup timing guarantees, app-generated PDF binaries, `vitest-canvas-mock`,
  free-form metric schemas, numeric confidence values, `Math.random`
  filenames, absolute privacy/security claims, dependency additions,
  automatic AI upload, and local card history.
- The candidate normative specification is
  `docs/ss-011-preimplementation-spec.md`. It defines
  `src/swing-card-contract.ts`, `src/swing-card-generator.ts`, local PNG
  composition via `toBlob("image/png")`, browser print/save-to-PDF via
  `window.print()`, object URL cleanup, bounded prompt copy for manual LLM
  upload only, no raw-video inclusion, no persistence, no telemetry, no remote
  sharing, no provider changes, and no new dependencies.
- The self-contained Claude QA planning handoff is
  `docs/ss-011-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with ten specification blockers:
  undefined `SwingCardPngResult`, conflated content warnings versus PNG export
  failures, contradictory metric-payload prose, undefined missing-overlay
  behavior, unenforced PNG/print parity, permissive alternate overlay-renderer
  wording, unspecified canvas caps, underspecified object URL lifecycle,
  unpinned filename date source, and unpinned `PoseOverlayRenderResult` import.
- Claude QA response is recorded in
  `docs/ss-011-claude-qa-response.md`.
- `docs/ss-011-preimplementation-spec.md` now addresses B1-B10 with a
  discriminated PNG result union, separate content-warning and PNG-failure
  types, strict `SwingMetricPayload | undefined`, mandatory
  `renderPoseOverlayFrame` reuse, `Keyframe unavailable` fallback for missing
  overlays, shared `renderSwingCardPrintSurface(content)`, exact canvas caps,
  module-scoped object URL lifecycle rules, wall-clock export-click filename
  dates, imported SS-010 `PoseOverlayRenderResult`, a content warning decision
  table, and focused test requirements.
- Focused Claude QA re-review handoff:
  `docs/ss-011-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned FAIL with one narrow new blocker, B11:
  `SwingCardPngResult.warnings` lacked an explicit invariant requiring exact
  unchanged passthrough of `content.warnings`.
- Claude confirmed B1-B10 are closed.
- B11 response is recorded in
  `docs/ss-011-claude-qa-rereview-response.md`.
- `docs/ss-011-preimplementation-spec.md` now states that
  `SwingCardPngResult.warnings` must be exactly `content.warnings` in both
  success and error variants, and `composeSwingCardPng` must not add, remove,
  reorder, filter, or recompute warning codes before returning them. Unit test
  requirements now cover unchanged passthrough for both result branches.
- B11-only focused re-review handoff:
  `docs/ss-011-claude-qa-rereview-2-prompt.md`.
- Claude B11-only focused QA re-review returned PASS. B1-B11 are closed with
  concrete, testable mechanisms, and Claude authorized moving SS-011 to
  `3. In Development (ChatGPT)`.
- Notion moved to `3. In Development (ChatGPT)`.
- Implementation completed for the approved SS-011 scope:
  `src/swing-card-contract.ts`, `src/swing-card-generator.ts`,
  `test/unit/swing-card-generator.test.ts`, Swing Card export wiring in
  `src/main.ts`, print/export styles in `src/styles.css`, workflow copy in
  `src/workflow.ts`, and smoke coverage in `test/smoke/app.spec.ts`.
- The implementation adds local PNG composition, browser print/save-to-PDF,
  prompt copy, selected annotated keyframe rendering through SS-010
  `renderPoseOverlayFrame`, deterministic content warnings, exact PNG result
  failure variants, crypto-based sanitized filenames, module-scoped object URL
  cleanup, print-surface parity, and export-control busy guards.
- No raw-video export, remote sharing, telemetry, remote logging, remote review,
  cloud storage, SDK/provider/model/asset changes, new workers, new
  dependencies, local card history, or public serving behavior was added.
- Runtime observability is intentionally unchanged/deferred for SS-011: no new
  logs, traces, analytics, telemetry, or remote diagnostics were added because
  acceptance criteria cover local user-initiated export rather than diagnostics.
- Post-implementation verification passed after the final all-selected-keyframe
  renderer fix: `npm run test:unit -- swing-card-generator` (13 tests),
  `npm run test:unit` (101 tests across 10 files), `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.
- `npm run test:smoke` was attempted earlier but hung before useful progress in
  this local repo state. Codex also ran a built-preview Chromium verification
  against the current UI flow at `390x844`: sanitized PNG
  `swing-sync-card-20260626-f8a09047.png`, 398432 bytes, print invoked once,
  no horizontal overflow, minimum export button height 46px, zero external
  requests, zero export-time requests, zero IndexedDB/cache entries, and zero
  sensitive console output under the SS-011 check regex.
- Final Claude implementation audit handoff:
  `docs/ss-011-claude-audit-prompt.md`.
- Notion moved to `4. Final Audit (Claude)` with the implementation summary and
  verification evidence recorded in a comment.
- Claude final implementation audit returned FAIL with two implementation-stage
  blockers after confirming B1-B11 were correctly implemented:
  - B12: `prepareSwingCardContent` could silently fabricate phase-to-frame
    mappings on assignment length mismatch.
  - B13: the committed smoke suite was unconfirmed because prior
    `npm run test:smoke` attempts were run under shell-default Node 24 instead
    of repo-required Node 22 and appeared to hang.
- B12 fix: Swing Card export preparation now uses
  `getCompleteSwingCardAssignments()`, which returns assignments only when
  `isValidCorrection(assignments)` accepts them. Unsupported or incomplete
  review states now export `Keyframe unavailable` slots and force
  `PHASE_REVIEW_REQUIRED` rather than falling back to positional phase/sample
  mappings.
- B12 regression coverage: `test/smoke/app.spec.ts` now includes
  `keeps Swing Card keyframes unavailable until phase review is complete`,
  which opens export from an unsupported review state, checks phase-review
  warning copy, stubs `window.print`, inspects the print DOM at print-call time,
  and asserts eight unavailable keyframe placeholders.
- B13 fix: verification now runs with Node 22 from `.nvmrc`; under Node 22,
  `npm run test:smoke -- --list` completes and the full committed smoke suite
  passes. A stale smoke assertion after Export -> Review navigation was updated
  from removed copy (`Video and pose preview`) to the current `Review` heading
  and `Annotated keyframes` surface.
- Claude audit response: `docs/ss-011-claude-audit-response.md`.
- Focused Claude B12/B13 re-review handoff:
  `docs/ss-011-claude-audit-rereview-prompt.md`.
- Post-fix verification with Node 22 passed:
  `npm run test:unit -- swing-card-generator` (13 tests),
  `npm run test:unit` (101 tests across 10 files),
  `npm run test:smoke -- --list` (32 tests listed),
  `npm run test:smoke -- --project=desktop-chromium --grep "Swing Card"`
  (2 tests), `npm run test:smoke` (32 tests across desktop and mobile
  Chromium), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`, and `git diff --check`.
- Claude focused final-audit re-review returned PASS for B12 and B13. Claude
  confirmed B12 is closed by the `isValidCorrection` assignment gate plus
  unavailable-keyframe/`PHASE_REVIEW_REQUIRED` regression coverage, and B13 is
  closed by running the committed smoke suite under Node 22. No new blockers
  were introduced.
- Claude focused final-audit re-review response:
  `docs/ss-011-claude-audit-rereview-response.md`.
- Pull request created: https://github.com/ajason13/swing-sync/pull/12.
- Notion `Pull Request` property was updated to PR #12, with a PR-created
  comment recorded.
- GitHub compliance check passed for PR #12.
- PR #12 merged on 2026-06-27 at merge commit
  `31548a43421dcd45a469d4c6282a8c102b8f1185`. Local `main` and `origin/main`
  both resolve to this merge commit after fast-forward.
- Post-merge Notion sync is complete. SS-011 is marked `5. Done`, PR #12 is
  recorded, and a Notion comment records the merge commit and post-merge state.
- A Notion search for `SS-012 Swing Sync` did not surface a next SS-012 task
  page. The next task should be selected from the Notion board at the start of
  the next session instead of guessed from search results.

SS-011 is complete.

## SS-008 Coordination

SS-008 is safety- and coaching-sensitive schema work. It defines the contract
future metric generation and review features may consume. Gemini Chat Deep
Research performs research and draft-specification support with attached
repository files, Codex verifies research and implements only after approved
planning gates, and Claude performs adversarial QA planning plus final audit.
The Notion tracker status is `5. Done`.

Acceptance criteria:

- Schema includes metric name, value, units, phase, handedness, confidence, and
  limitation notes.
- Aligns naming with CaddieSet-inspired concepts without overclaiming
  equivalence.
- Has fixtures for valid, missing, and low-confidence data.

Kickoff state on 2026-06-18:

- Local `main` and `origin/main` were confirmed at `186ae4e`; PR #8 merge
  commit `3cd1d3eefe4af94d95369771d36d8c09d557f8c1` is an ancestor.
- `git diff --check` passed before branch creation.
- Branch `ss-008-metric-schema` was created from verified `main`.
- The intentional untracked story-guidance files for SS-004, SS-006, SS-007,
  and SS-008 are preserved.
- Notion reconfirmed branch `ss-008-metric-schema`, initial `0. Backlog`
  status, empty PR, and the acceptance criteria above. The task moved to
  `1. Spec Drafting (Gemini)`.
- No SS-008-specific test case existed in Notion. Dedicated `SS-TC-012` was
  created for accurate acceptance coverage of metric schema validation,
  bounded vocabulary, synthetic valid/missing/low-confidence fixtures,
  CaddieSet naming boundaries, and privacy/safety/protected-boundary checks.
- The first `agy`/Antigravity CLI route returned no artifacts before the user
  identified likely rate-limit exhaustion. Per the 2026-06-18 Multi-Agent SDLC
  Framework routing note, SS-008 is now routed through Gemini Chat Deep
  Research with attached files instead of local `agy`.
- The Gemini Chat Deep Research handoff is
  `docs/handoffs/ss-008-gemini-chat-deep-research-prompt.md`. It uses a lean
  steering prompt, explicit file-attachment list, and a required task-specific
  research plan before the deep research run.
- Gemini Chat Deep Research returned a broad report. Codex dispositioned it in
  `docs/ss-008-research-disposition.md`, rejecting the malformed schema and
  overclaims while revising the useful zero-dependency, versioned-payload, and
  synthetic-fixture recommendations.
- The candidate normative specification is
  `docs/ss-008-preimplementation-spec.md`.
- The self-contained Claude QA planning handoff is
  `docs/ss-008-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`.
- Claude QA planning returned FAIL with four blockers: missing
  status/confidence pairing, optional per-metric CaddieSet disclaimer, undefined
  recursive prohibited-key strategy, and undefined off-version validation.
- `docs/ss-008-preimplementation-spec.md` now addresses the blockers with an
  explicit status/confidence compatibility table, required payload-level
  `caddieSetEquivalence: "not-equivalent"`, exact case-sensitive recursive
  prohibited-key list, exact `schemaVersion: "0.1.0"` rejection rules, and
  required tests for finite zero, explicit non-finite values, empty/duplicate
  limitation notes, and case/whitespace-sensitive enum rejection.
- Claude QA response: `docs/ss-008-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-008-claude-qa-rereview-prompt.md`.
- Claude focused QA re-review returned PASS. B1-B4 are closed and Claude
  authorized moving to `3. In Development (ChatGPT)`.
- Implementation completed for schema/test scope only:
  `docs/schemas/swing-metric-payload-v0.1.0.schema.json`,
  `src/metric-contract.ts`, `test/fixtures/metrics/valid-payload.json`,
  `test/fixtures/metrics/missing-payload.json`,
  `test/fixtures/metrics/low-confidence-payload.json`, and
  `test/unit/metric-contract.test.ts`.
- The implementation adds a versioned payload wrapper, required
  `caddieSetEquivalence: "not-equivalent"`, bounded metric/unit/phase/
  handedness/value/confidence/limitation vocabularies, status/confidence
  pairing, exact `0.1.0` version acceptance, exact case-sensitive recursive
  prohibited-key rejection, and deterministic synthetic fixtures.
- Claude final implementation audit returned FAIL with three narrow blockers:
  unconstrained `impact-not-directly-observed` limitation-code usage, missing
  itemized negative tests for `caddieSetEquivalence`, and insufficiently
  explicit low-evidence impact fixture coverage.
- Final audit response: `docs/ss-008-claude-audit-response.md`.
- B5-B7 fixes are implemented: `impact-not-directly-observed` is valid only
  for `impact-spine-line-angle` in the TypeScript validator, JSON Schema,
  spec, and tests; `caddieSetEquivalence` now has omitted/wrong/empty/non-string
  rejection assertions; and the low-confidence fixture's
  `impact-spine-line-angle` entry is asserted directly.
- No runtime UI, metric calculation, export, persistence, telemetry, remote
  logging, remote review, dependency, model/SDK/asset, worker, or public schema
  serving behavior was added.
- Pre-audit verification passed: `npm run test:unit -- metric-contract`
  (10 tests), `npm run test:unit` (50 tests across 7 files),
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`,
  `npm audit --omit=dev` (0 vulnerabilities), and `git diff --check`.
- Focused post-fix verification passed: `npm run test:unit -- metric-contract`
  (11 tests), `npm run test:unit` (51 tests across 7 files), and
  `git diff --check`.
- `npm run sbom:generate` changed only generated metadata
  (UUID/timestamp/npm tool version) because no production dependency changed;
  that metadata churn was restored after verification.
- Final audit prompt: `docs/ss-008-claude-audit-prompt.md`.
- Focused final re-review prompt:
  `docs/ss-008-claude-final-rereview-prompt.md`.
- Claude focused final re-review returned PASS. B5-B7 are closed, no new
  blockers were introduced, and Claude signed off that Codex may prepare the
  PR. Response: `docs/ss-008-claude-final-rereview-response.md`.
- PR opened: https://github.com/ajason13/swing-sync/pull/9.
- Post-PASS PR verification passed: `npm run test:unit` (51 tests across
  7 files), `npm run build`, `npm run compliance:verify`,
  `npm run safety:verify`, `npm run privacy:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev` (0 vulnerabilities), and
  `git diff --check`. `npm run sbom:generate` again changed only generated
  SBOM serial/timestamp metadata, and that metadata churn was restored.
- Observability decision at kickoff: no runtime behavior is approved yet.
  Prefer no new observability; if diagnostics are proposed, they must not
  contain metric values, confidence values, limitation text, phase labels,
  handedness, timestamps, landmarks, media characteristics, or identifiers.

SS-008 is complete. PR #9 is merged, Notion is marked `5. Done`, and local
`main` has been fast-forwarded to the merge commit.

## SS-006 Coordination

SS-006 is privacy-sensitive runtime work controlling decoded frame images and
derived landmark sets. Gemini researches/specifies, Codex verifies and
implements, and Claude performs pre-implementation QA planning plus final
adversarial audit.

Acceptance criteria:

- Video frames are sampled deterministically.
- Processing can be cancelled or retried.
- Queue handles long, short, portrait, and landscape videos.
- Output includes timestamps, frame images, and landmark sets.

Kickoff state on 2026-06-12:

- Local and `origin/main` were confirmed at `2a48417`, including PR #6 merge
  `7678add`; `git diff --check` passed.
- The unrelated untracked
  `docs/agent-guidance/ss-004-new-codex-session-prompt.md` and intentional
  `docs/agent-guidance/ss-006-new-codex-session-prompt.md` are preserved.
- Notion reconfirmed branch `ss-006-frame-queue`, initial `0. Backlog` status,
  empty PR, and the acceptance criteria above. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-006` was confirmed invalid for SS-006 because it describes Swing Card
  export leakage. The mismatch was recorded in Notion. Dedicated `SS-TC-010`
  was created for deterministic bounded ordered processing, cancellation/retry,
  orientation/duration cases, output association, cleanup, stale-result
  rejection, and privacy-preserving diagnostics.
- The protected SS-005 boundary remains exact
  `@mediapipe/tasks-vision@0.10.35`, approved same-origin model/WASM assets,
  dedicated worker VIDEO-mode inference, complete returned landmark arrays,
  finite increasing timestamps, volatile local frames, resource cleanup,
  fail-closed unexpected requests, and no sensitive persistence or telemetry.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-006-gemini-research-prompt.md`.
- Implementation is blocked pending Gemini response disposition, a normative
  SS-006 specification, and Claude pre-implementation QA planning PASS.
- Observability decision at kickoff: retain only local sanitized lifecycle,
  progress, cancellation, retry, and error states. Do not log frame pixels,
  landmarks, media characteristics, or user identifiers.

Next owner: Gemini Deep Research. Paste
`docs/ss-006-gemini-research-prompt.md`, then return the complete response to
Codex for primary-source verification and Adopt / Revise / Defer / Reject
disposition. Do not begin implementation.

Gemini response disposition on 2026-06-12:

- Gemini recommended even spacing, a sequential queue, generation identifiers,
  explicit bitmap ownership, full retry reconstruction, and deterministic
  adapter-based tests. Codex adopted those concepts with revisions.
- `docs/ss-006-research-disposition.md` records primary-source verification and
  explicit Adopt / Revise / Defer / Reject decisions.
- Gemini's unsupported configurable `K=20`, one-millisecond clamp rationale,
  two-bitmap bound, random UUID generation, required
  `requestVideoFrameCallback()`, sensitive console diagnostics, OOM-elimination
  claim, and permanent-destruction claim were revised or rejected.
- `docs/ss-006-preimplementation-spec.md` defines the normative candidate:
  fixed budget `8`; unique integer-millisecond timestamps; one queued/in-flight
  inference item; separate aspect-preserving previews bounded to 640 px long
  edge; maximum nine application-owned bitmaps; monotonic run generations;
  fail-closed cancellation/retry/stale rejection; volatile ordered output; and
  sanitized local-only observability.
- Claude pre-implementation QA handoff:
  `docs/ss-006-claude-qa-planning-prompt.md`.

Next owner: Claude QA planning. SS-006 must remain
`2. QA Planning (Claude)` until explicit PASS and closure of any blocking
findings. Do not begin implementation.

Claude QA planning returned FAIL on 2026-06-12 with five specification
blockers: invalid-duration guard contradiction, queue-layer `NaN`/`Infinity`
defense, failure-path bitmap cleanup, stale-check placement, and prior-worker
teardown ordering before retry.

Codex accepted and fixed all five in
`docs/ss-006-preimplementation-spec.md`. The response is recorded in
`docs/ss-006-claude-qa-response.md`; `SS-TC-010` is refined with explicit
closure evidence. Focused re-review handoff:
`docs/ss-006-claude-qa-rereview-prompt.md`.

Next owner: Claude focused QA re-review. Keep SS-006 at
`2. QA Planning (Claude)` and do not begin implementation before explicit PASS.

Claude focused QA re-review returned PASS on 2026-06-12. B1-B5 are closed,
`SS-TC-010` is sufficient, and Claude granted permission to move to
`3. In Development (ChatGPT)`. Response:
`docs/ss-006-claude-qa-rereview-response.md`.

SS-006 implementation is in progress:

- `src/frame-processing.ts` implements fixed-budget timestamp sampling,
  aspect-preserving preview sizing, ordered volatile output, monotonic run
  generations, cancellation/retry, stale rejection, and exact bitmap cleanup.
- `src/browser-frame-processing.ts` adapts local video/object URLs and the
  protected SS-005 PoseSession without changing SDK/model/assets.
- `src/main.ts` replaces the ad hoc four-frame loop with local progress,
  cancellation, failure, completion, and retry behavior.
- Focused unit coverage pins timestamp arrays, invalid-duration no-work
  behavior, orientation sizing, output ordering, failure cleanup, stale seek
  cancellation, repeated-cancel idempotence, and non-overlapping retry.
- Browser coverage validates eight-frame desktop/mobile completion and real
  initialization failure/retry while preserving SS-005 network/privacy/safety
  behavior.
- Observability impact: added only local sanitized lifecycle, progress, retry,
  completion, and stable error states. No telemetry or sensitive diagnostics.

SS-006 implementation completed on 2026-06-12 and is ready for final Claude
audit:

- Fixed-budget eight-sample deterministic queue, bounded previews, ordered
  timestamp/frame/pose output, cancellation, failure cleanup, stale rejection,
  and clean retry are implemented.
- Protected SS-005 inference remains dedicated-worker, one-frame-in-flight,
  same-origin, fail-closed, and volatile. Transfer failure now closes the
  main-owned bitmap before failing closed.
- Final verification passed on Node 22: 25 unit tests, 26 desktop/mobile
  production browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, approved asset hashes, one-component production SBOM,
  zero production vulnerabilities, and `git diff --check`.
- Final audit prompt: `docs/ss-006-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Keep SS-006 at
`4. Final Audit (Claude)` until explicit PASS and any required focused
re-review.

Claude final audit returned FAIL with two focused blockers. B1 was an evidence
gap: `releaseOutputs()` already closes and clears the current uncommitted
preview during invalidating cleanup. A direct cancellation/post-inference race
test now proves that ownership path. B2 was valid and is fixed:
`VideoFrameSource.dispose()` now rejects pending metadata/seek operations and
removes their listeners before media teardown.

Codex also fixed retry-during-cancel serialization and added direct unit
evidence for source disposal, current-preview cleanup, and retry sequencing.
Post-fix verification passed: 29 unit tests, 26 desktop/mobile browser tests,
full required compliance/privacy/licensing/assets/SBOM checks, zero production
vulnerabilities, and `git diff --check`.

Final audit response: `docs/ss-006-claude-audit-response.md`.
Focused final re-review prompt:
`docs/ss-006-claude-final-rereview-prompt.md`.

Next owner: Claude focused final re-review. Keep SS-006 at
`4. Final Audit (Claude)` and do not prepare the PR until focused PASS.

Claude focused final re-review returned PASS on 2026-06-12:

- B1 and B2 are closed.
- N1-N3 are closed and N4 is appropriately deferred to a separately reviewed
  future export story.
- No new blocker was introduced and the protected SS-005 boundary remains
  intact.
- PR preparation is authorized.

Next owner: Codex PR preparation. Keep SS-006 at `4. Final Audit (Claude)`
until merge; record the PR URL in Notion and this context after creation.

SS-006 pull request created on 2026-06-12:

- PR: https://github.com/ajason13/swing-sync/pull/7
- Claude focused final re-review: PASS.
- Final local verification: 29 unit tests, 26 desktop/mobile browser tests,
  build, full compliance/privacy/safety/licensing/assets/SBOM checks, zero
  production vulnerabilities, and `git diff --check`.

Next owner: PR review and CI. Keep SS-006 at `4. Final Audit (Claude)` until PR
#7 is merged; after merge, update local `main`, synchronize Notion and this
context, mark SS-006 `5. Done`, and identify the next task.

SS-006 completed on 2026-06-12:

- PR #7 merged with required compliance CI passing:
  https://github.com/ajason13/swing-sync/pull/7
- Merge commit: `9d937745fe8e446769d6806c21f8e4635bc5ad04`.
- Local `main` was fast-forwarded to the merge commit.
- Claude focused final re-review PASS, final local verification, accurate
  SS-TC-010 coverage, and Notion synchronization are complete.
- SS-006 is `5. Done`.

Next task: `SS-007 Implement swing phase detector with manual correction`.

- Branch: `ss-007-phase-detector`
- Handshake: `0. Backlog`
- Pull request: none
- Revised acceptance after Claude QA: propose a deterministic initial phase
  assignment for explicit review; allow nondecreasing shared-sample correction
  with confirmation before future metric readiness; emit accessible
  `unsupported-input`/`review-required` warnings with no automatic acceptance;
  and cover the contract with deterministic programmatic pose fixtures.
- Moving side-on browser fixture coverage is deferred to existing `SS-014` and
  is not claimed as SS-007 coverage.

Next owner: start SS-007 from updated `main`, confirm tracker/test-case
coverage, classify its coaching/safety sensitivity, and begin the required
Gemini specification workflow before implementation.

## SS-007 Coordination

SS-007 is safety- and coaching-sensitive runtime work. It converts the
protected ordered SS-006 pose outputs into named swing phases, confidence and
warnings, and a manual-review gate before future metric generation. Gemini
researches/specifies, Codex independently dispositions and implements, and
Claude performs pre-implementation QA planning plus final adversarial audit.

Kickoff state on 2026-06-13:

- Local and `origin/main` were confirmed at `b261b29`, including PR #7 merge
  `9d937745fe8e446769d6806c21f8e4635bc5ad04`; `git diff --check` passed.
- Branch `ss-007-phase-detector` was created from the verified updated main.
- The unrelated intentional untracked guidance files for SS-004, SS-006, and
  SS-007 are preserved.
- Notion reconfirmed branch `ss-007-phase-detector`, initial `0. Backlog`
  status, empty PR, and the four SS-007 acceptance criteria. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-007` was confirmed invalid for SS-007 because it describes API-backed
  coaching consent/provider notice. The mismatch is recorded in Notion.
- Existing `SS-TC-005` remains complementary broad eight-keyframe/manual-
  correction coverage but is insufficient for confidence, ambiguity,
  ordering, stale-result, provenance, fixture, and protected-queue behavior.
- Dedicated `SS-TC-011` was created for accurate SS-007 acceptance coverage.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-007-gemini-research-prompt.md`.
- Implementation is blocked pending Gemini response disposition, a normative
  SS-007 specification, and Claude pre-implementation QA planning PASS.
- Observability decision at kickoff: retain local sanitized lifecycle/error
  state only. Do not add diagnostics containing landmarks, phase assignments,
  confidence, warnings, corrections, timestamps, media characteristics, or
  identifiers.

Next owner: Gemini Deep Research. Paste
`docs/ss-007-gemini-research-prompt.md`, then return the complete response to
Codex for primary-source verification and Adopt / Revise / Defer / Reject
disposition. Do not begin implementation.

Gemini response disposition on 2026-06-13:

- Gemini proposed GolfDB event vocabulary, posture-cost heuristics, dynamic-
  programming alignment, numeric confidence, a manual timeline, and synthetic
  pose fixtures. Codex adopted the bounded vocabulary, separate provenance,
  active-generation binding, fail-closed ambiguity, accessible review, and
  volatile local state with revisions.
- `docs/ss-007-research-disposition.md` records primary-source/repository
  verification and explicit Adopt / Revise / Defer / Reject decisions.
- Gemini's unsupported posture formulas, interpolation, clipping, closest-
  person selection, numeric thresholds, automatic metric-readiness unlock,
  worker/framework additions, and absolute performance/privacy claims were
  rejected.
- The protected eight-sample input exposes a blocking contradiction: eight
  unique ordered samples assigned to eight ordered phases permits only identity
  mapping and no meaningful correction.
- Numeric sufficient-confidence detection is also blocked because no approved
  moving side-on fixture, representative validation set, heuristic validation,
  or calibration evidence exists.
- `docs/ss-007-preimplementation-spec.md` defines the conservative blocked
  candidate and the required allocation, confidence/acceptance, and fixture
  decisions.
- Claude pre-implementation QA handoff:
  `docs/ss-007-claude-qa-planning-prompt.md`.

Next owner: Claude QA planning. SS-007 must remain
`2. QA Planning (Claude)` until explicit PASS and closure of the allocation,
confidence/acceptance, and moving side-on fixture blockers. Do not begin
implementation.

Claude first QA planning returned FAIL on 2026-06-13 with three blockers:
unresolved allocation/correction policy, unsatisfiable sufficient-confidence
acceptance, and unavailable moving side-on browser fixture coverage.

Codex accepted and revised all three:

- B1 adopts nondecreasing repeated sample references for meaningful correction
  while preserving ordered phases.
- B2 revises acceptance to a deterministic provisional initial assignment plus
  mandatory explicit review; numeric confidence and automatic acceptance remain
  prohibited.
- B3 revises SS-007 fixture acceptance to deterministic programmatic pose
  fixtures and explicitly defers moving side-on browser fixture policy and
  coverage to existing `SS-014`.
- `undeclared` inputs fail closed, unreachable `insufficient-evidence` was
  removed, and stale indices clear immediately with owning output release.
- Response: `docs/ss-007-claude-qa-response.md`.
- Focused re-review handoff:
  `docs/ss-007-claude-qa-rereview-prompt.md`.

Next owner: Claude focused QA re-review. Keep SS-007 at
`2. QA Planning (Claude)` and do not begin implementation before explicit PASS.

Claude focused QA re-review returned PASS on 2026-06-13:

- B1-B3 are closed and SS-007 may move to `3. In Development (ChatGPT)`.
- Required pre-merge revisions: enumerate stable sanitized warning codes; add
  matching/mismatched pose/request timestamp tests; and align `SS-TC-011` with
  those cases.
- Response: `docs/ss-007-claude-qa-rereview-response.md`.

SS-007 implementation is in progress under the approved manual-review-only
contract. Observability remains intentionally unchanged: local sanitized
lifecycle/error state only, with no phase assignments, evidence, warnings,
corrections, timestamps, landmarks, media characteristics, or identifiers in
diagnostics.

SS-007 implementation completed on 2026-06-13 and is ready for final Claude
audit:

- `src/phase-review.ts` implements deterministic identity initial review
  layout, typed stable warning codes, strict protected-input validation,
  nondecreasing shared-index correction, separate provenance, explicit
  confirmation, and generation-bound stale rejection.
- `src/main.ts` integrates explicit declarations and accessible review controls
  after completed SS-006 processing while clearing phase state before cancel,
  retry, new file, navigation, close, and owning-output release.
- No protected SS-005/SS-006 module, dependency, model, asset, network,
  persistence, export, metric, coaching, or observability boundary changed.
- R1-R3 are closed: warning codes are enumerated; matching/mismatched pose/
  request timestamps are tested; and `SS-TC-011` records those cases.
- Final clean verification passed: 40 unit tests, 28 desktop/mobile browser
  tests, build, compliance, safety, privacy, license audit, bundle-license
  fixture, approved asset hashes, one-component production SBOM, zero
  production vulnerabilities, and `git diff --check`.
- Final audit prompt: `docs/ss-007-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Keep SS-007 at
`4. Final Audit (Claude)` until explicit PASS and any required focused
re-review. Do not prepare the PR before audit PASS.

Claude final audit returned PASS on 2026-06-17 and cleared SS-007 for PR
preparation. Claude identified no blocking findings and five non-blocking
recommendations. Codex applied the cheap defensive/test clarifications before
PR:

- added an explicit finite guard for `requestedTimestampMs`;
- confirmed and tested the review status uses `aria-live="polite"`;
- added explicit over-count sample coverage;
- split setup confirmation into a named fail-closed unit test; and
- added explicit over-count correction coverage.

Final audit response: `docs/ss-007-claude-audit-response.md`.

Post-audit verification passed on Node 22: 40 unit tests, 28 desktop/mobile
browser tests, build, compliance, safety, privacy, license audit,
bundle-license fixture, approved asset hashes, one-component production SBOM,
zero production vulnerabilities, and `git diff --check`.

Next owner: Codex PR preparation. Keep SS-007 at `4. Final Audit (Claude)`
until PR checks and merge complete; record the PR URL in Notion and this
context after creation. Do not mark Done before post-merge repository, Notion,
and context synchronization.

SS-007 pull request created on 2026-06-17:

- PR: https://github.com/ajason13/swing-sync/pull/8
- Branch: `ss-007-phase-detector`
- Claude final implementation audit: PASS.
- Final local verification: 40 unit tests, 28 desktop/mobile browser tests,
  build, full compliance/privacy/safety/licensing/assets/SBOM checks, zero
  production vulnerabilities, and `git diff --check`.

Next owner: PR review and CI. Keep SS-007 at `4. Final Audit (Claude)` until
PR #8 is merged; after merge, update local `main`, synchronize Notion and this
context, mark SS-007 `5. Done`, and identify the next task.

SS-007 completed locally on 2026-06-17:

- PR #8 merged with required compliance CI passing:
  https://github.com/ajason13/swing-sync/pull/8
- Merge commit: `3cd1d3eefe4af94d95369771d36d8c09d557f8c1`.
- Local `main` is fast-forwarded to the merge commit.
- Claude final implementation audit returned PASS.
- Required local verification and GitHub compliance checks passed.
- Notion synchronization completed after OAuth reauthorization: SS-007 is
  marked `5. Done`, PR #8 is recorded, and merge/verification evidence is
  commented on the task.

Next task: `SS-008 Define Swing Sync metric JSON schema`.

- Branch: `ss-008-metric-schema`
- Handshake: `0. Backlog`
- Pull request: none
- Acceptance: schema includes metric name, value, units, phase, handedness,
  confidence, and limitation notes; naming aligns with CaddieSet-inspired
  concepts without overclaiming equivalence; fixtures cover valid, missing,
  and low-confidence data.
- Existing known deferred work includes `SS-014 Create fixture swing dataset
  policy and test fixtures`, which owns moving side-on browser fixture coverage
  deferred from SS-007.

## Completed Foundation

SS-001 established the project compliance baseline:

- Apache-2.0 root license and project NOTICE.
- Dependency license policy in `docs/licensing.md`.
- Model licensing placeholder and no-model-binary policy in `docs/models-licensing.md`.
- Root `THIRD_PARTY_NOTICES.md`.
- CycloneDX SBOM generation to `docs/sbom.json`.
- GitHub Actions compliance workflow on Node 22.
- Synthetic license fixtures for GPL, MPL, and MIT policy checks.
- Production-scoped NOTICE aggregation with deterministic fixture validation.
- Bundle license validation with a synthetic bundled GPL package.

## Verification Baseline

PR #1 passed GitHub Actions:

- Workflow: `Dependency and License Compliance`
- Run: https://github.com/ajason13/swing-sync/actions/runs/26996587662
- Result: success

Expected local commands:

```bash
nvm use
npm ci
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
npm run build
npm run compliance:verify
```

## Next Task

`SS-005 Integrate MediaPipe Pose Landmarker in browser video mode` is next in
the delivery workflow on branch `ss-005-mediapipe-pose`.

Acceptance criteria from Notion:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

SS-005 is a sensitive model/SDK, privacy, licensing, and compliance story.
Gemini research/spec disposition and Claude QA planning are required before
implementation. The current `SS-TC-005` Notion test case describes swing-phase
correction rather than Pose Landmarker integration and must be corrected or
replaced before claiming acceptance coverage.

SS-005 coordination status through 2026-06-07:

- Local `main` was confirmed current at `bf650f2`, including PR #5 merge
  `1d4aaea` and post-merge context commit `57cda37`.
- Branch `ss-005-mediapipe-pose` was created from updated `main`.
- Notion acceptance criteria, branch, empty PR field, and initial
  `0. Backlog` status were reconfirmed. The task moved to
  `1. Spec Drafting (Gemini)`.
- `SS-TC-005` was confirmed invalid for this story. `SS-TC-001` provides
  complementary local extraction/no-upload coverage but does not cover all
  SS-005 criteria. Dedicated `SS-TC-009` was created for non-blocking loading,
  metadata retention, timestamps, cleanup, and post-asset network assertions.
- The self-contained Gemini Deep Research handoff is
  `docs/ss-005-gemini-research-prompt.md`.
- `docs/ss-005-research-disposition.md` records initial primary-source checks
  and Codex Adopt / Revise / Defer / Reject decisions after the Gemini
  response.
- Research handoff commit: `b0a6dca` (`Prepare SS-005 research handoff`).
- Pre-handoff verification passed on Node 22: `npm run build`,
  `npm run compliance:verify`, and `git diff --check`.
- Gemini returned a conditional-GO proposal, but Codex rejected its conclusion
  that every blocker was resolved. Current MediaPipe terms explicitly describe
  provider metrics and informed-consent responsibility; the inspected exact
  0.10.35 npm tarball contains compiled WASM and lacks packaged LICENSE/NOTICE
  files; explicit model redistribution/local-serving/caching rights were not
  established; and no generated fixture/provenance exists.
- Exact `@mediapipe/tasks-vision@0.10.35` and Pose Landmarker Full float16
  version 1 are blocked candidates, not approved dependencies/assets.
- `docs/models-licensing.md`, `docs/licensing.md`, and
  `docs/privacy-architecture.md` record the current provider-metrics,
  compiled-binary, model-rights, consent, and network-behavior gates.
- Claude pre-implementation QA-planning handoff:
  `docs/ss-005-claude-qa-planning-prompt.md`.
- Notion moved to `2. QA Planning (Claude)`. Implementation remains blocked
  pending Claude's response and closure of every implementation-start blocker.
- Gemini disposition and Claude QA-planning handoff commit: `48a7376`.
- Claude QA Planning returned FAIL with six implementation-start blockers.
  Codex accepted the provider-metrics, compiled-binary, model-rights, fixture,
  worker-contract, responsiveness-contract, and tracker-coverage concerns while
  revising technically overbroad recommendations.
- `docs/ss-005-preimplementation-spec.md` now defines the normative scope,
  conservative maintainer decisions, exact candidate result schema, worker
  protocol, fixture provenance, network phases, responsiveness behavior, and
  implementation-start gate.
- Exact 0.10.35 API verification corrected the metadata contract: returned
  normalized/world landmarks expose `x`, `y`, `z`, and `visibility`, but not
  per-landmark `presence`. Presence remains a configured threshold.
- `docs/ss-005-claude-qa-response.md` records each finding as accepted, revised,
  or fixed. SS-005 remains `2. QA Planning (Claude)`.
- `SS-TC-009` was revised in Notion to match the exact candidate API, worker
  contract, network phases, fixture prerequisite, responsiveness behavior, and
  cleanup/privacy coverage.
- Focused Claude QA re-review handoff:
  `docs/ss-005-claude-qa-rereview-prompt.md`.
- Post-Claude-response Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Claude QA findings response and focused re-review handoff commit: `4d616ee`.
- Claude focused QA re-review returned FAIL while confirming the revised
  technical specification is sound. Worker contract, responsiveness contract,
  revised `SS-TC-009`, absence of returned per-landmark presence, and wrapper
  timestamp behavior are closed.
- Four blockers remain open: provider metrics decision, compiled-binary
  obligations/notices, model rights/delivery, and an approved empirically
  validated fixture/provenance record. Fixture validation depends on resolution
  of the provider/model blockers.
- On 2026-06-10, the maintainer supplied a response attributed to Google stating
  that the current Web SDK has no telemetry, future aggregated usage/performance
  telemetry is planned, current Web SDKs are Apache-2.0, and the exact Pose
  Landmarker Full float16 version 1 URL is Apache-2.0.
- `docs/ss-005-google-provider-response.md` records the response and Codex
  disposition. Public MediaPipe issue #6306 and collaborator response comment
  `4673728357` provide durable provenance and explicitly scope the questions to
  exact `@mediapipe/tasks-vision@0.10.35` and the exact model URL. Explicit
  maintainer compliance approval was recorded on 2026-06-11.
- Proposed exact-version policy: pin `@mediapipe/tasks-vision@0.10.35`, require
  fresh review for every upgrade, fail closed on any unexpected external
  request, distribute Apache-2.0 text and third-party attribution, and vendor
  the exact model same-origin with a pinned hash. Runtime provider fetch is not
  approved; service-worker caching remains separate.
- Google provider-response evidence/disposition commit: `5b22e5d`.
- On 2026-06-11, the maintainer explicitly approved reliance on Google's public
  response for exact `@mediapipe/tasks-vision@0.10.35`, its packaged compiled
  artifacts, and the exact Pose Landmarker Full float16 version 1 model. The
  maintainer approved same-origin model vendoring/serving, Apache-2.0 license
  and attribution handling, fail-closed unexpected-network behavior, and fresh
  review before every SDK upgrade. B-1, B-2, and B-3 are closed.
- Gate B-4 is closed. The approved fixture is
  `test/fixtures/pose-landmarker/mannequin-golf-address.webm`, deterministically
  derived from a committed AI-generated faceless wooden-mannequin source.
  `test/fixtures/pose-landmarker/PROVENANCE.md` records the prompt, no-real-
  person declaration, FFmpeg 8.1.1 derivation, hashes, Apache-2.0 output
  decision, and exact-model VIDEO-mode validation.
- Disposable validation with exact `@mediapipe/tasks-vision@0.10.35` and the
  exact approved model returned one complete 33-normalized-landmark and
  33-world-landmark pose at 0, 500, 1000, and 1500 ms. The dependency and model
  remained outside the repository during validation.
- Third focused pre-implementation Claude QA prompt:
  `docs/ss-005-claude-qa-third-review-prompt.md`. The prior focused re-review
  prompt is marked superseded and must not be pasted.
- `docs/ss-005-claude-qa-rereview-response.md` records the focused result.
- The pre-implementation spec now tracks the deferred production response to an
  observed provider-metrics request. No behavior may silently allow, block, or
  ignore it before the provider decision is approved.
- Post-focused-re-review Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- Focused Claude QA re-review result commit: `c4f961e`.
- Post-disposition Node 22 verification passed: `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, `npm run sbom:generate`, and
  `git diff --check`.
- No SDK dependency, model/WASM asset, fixture video, runtime implementation,
  or asset fetch/cache behavior has been added.
- Observability decision: use only local, sanitized lifecycle/error states
  needed to debug initialization and inference. Do not log raw frames,
  landmarks, media characteristics, or sensitive user data.

Next owner: Claude QA. Perform the third focused pre-implementation review of
the closed provider, licensing, model-delivery, and fixture gates. Do not begin
application implementation before Claude PASS.

Claude returned PASS on 2026-06-11. All implementation-start blockers B-1
through B-4 are closed and SS-005 may move to `3. In Development (ChatGPT)`.
The response is recorded in
`docs/ss-005-claude-qa-third-review-response.md`. Implementation must manually
provide auditable MediaPipe notice/attribution, verify the generated fixture
terms before release, preserve fail-closed unexpected-network handling, and
complete the full SS-TC-009 verification matrix before final audit.

Next owner: Codex implementation and verification on
`ss-005-mediapipe-pose`.

SS-005 implementation completed on 2026-06-11 and is ready for final Claude
audit:

- Exact `@mediapipe/tasks-vision@0.10.35`, packaged WASM, and approved Pose
  Landmarker Full float16 version 1 model are vendored and served same-origin.
- Dedicated worker VIDEO-mode inference preserves complete normalized/world
  landmarks and returned visibility, validates media timestamps, applies
  one-frame backpressure, closes transferred bitmaps, and fails closed.
- Existing safety acknowledgement remains required. Local video object URLs
  are revoked, video/frame/landmark persistence is absent, and CSP-blocked
  unexpected external requests visibly terminate the active session.
- Manual MediaPipe attribution is aggregated into production notices. Exact
  model/WASM hashes and the exact MediaPipe SBOM component are verified.
- Generated fixture terms review is recorded in its provenance file.
- Observability impact: intentionally limited to local UI state and sanitized
  stable error codes; no telemetry or sensitive diagnostics were added.
- Verification passed on Node 22: 9 unit tests, 22 desktop/mobile production
  browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, exact asset hashes, one-component production SBOM,
  production notice inspection, zero production audit vulnerabilities, and
  `git diff --check`.
- Final audit prompt: `docs/ss-005-claude-audit-prompt.md`.

Next owner: Claude final adversarial implementation audit. Story must remain
`4. Final Audit (Claude)` until explicit PASS.

Claude returned final-audit PASS on 2026-06-11 and permitted PR preparation,
with eight non-blocking findings. Codex applied focused fixes before PR:

- removed misleading unreachable worker-side backpressure code;
- removed the invented missing-visibility fallback;
- made repeated session failure signals idempotent;
- added worker `messageerror` and repeated-failure unit coverage;
- pinned Vite ES worker output;
- documented timestamp-deduplication and asynchronous teardown ownership; and
- added the missing offline-from-start positive browser test.

Post-fix verification passed: 11 unit tests, 24 desktop/mobile production
browser tests, build, compliance, safety, privacy, license audit,
bundle-license fixture, exact asset hashes, one-component production SBOM,
zero production vulnerabilities, and `git diff --check`.

Final audit response: `docs/ss-005-claude-audit-response.md`.
Focused re-review prompt: `docs/ss-005-claude-final-rereview-prompt.md`.

Next owner: Claude focused final re-review. Keep SS-005 at
`4. Final Audit (Claude)` and do not create the PR until focused PASS.

Claude returned focused final re-review PASS on 2026-06-11. All focused fixes
were accepted, no regression or new blocker was identified, the
offline-from-start positive test was accepted as closing the highest-priority
network gap, and Claude explicitly authorized PR preparation.

Focused response:
`docs/ss-005-claude-final-rereview-response.md`.

Next owner: Codex PR preparation. Keep SS-005 at `4. Final Audit (Claude)`
until PR checks and merge complete; do not mark Done before post-merge
repository, Notion, and context synchronization.

SS-005 PR created on 2026-06-11:

- PR #6: https://github.com/ajason13/swing-sync/pull/6
- Branch: `ss-005-mediapipe-pose`
- Claude final audit: PASS.
- Claude focused final re-review after fixes: PASS.
- Verification recorded in the PR: 11 unit tests, 24 desktop/mobile production
  browser tests, build, compliance, safety, privacy, license audit,
  bundle-license fixture, exact asset hashes, one-component production SBOM,
  zero production vulnerabilities, and `git diff --check`.
- PR records exact SDK/model terms, fixture provenance, observed network
  behavior, deferred work, and intentionally privacy-limited observability.

Next owner: GitHub PR checks and merge review. Keep SS-005 at
`4. Final Audit (Claude)` until PR #6 is merged, then update local `main`,
Notion, and this file before moving to `5. Done`.

SS-005 completed on 2026-06-11:

- PR #6 merged: https://github.com/ajason13/swing-sync/pull/6
- Merge commit: `7678add7de6b946cc00328d0bef83772b1a11576`
- Local `main` fast-forwarded to the merge commit.
- Claude final implementation audit and focused final re-review both returned
  PASS.
- Required local verification and GitHub compliance checks passed.
- Notion SS-005 moved to `5. Done`.
- The unrelated untracked
  `docs/agent-guidance/ss-004-new-codex-session-prompt.md` remains preserved.

Next task: `SS-006 Build frame processing queue and sampling strategy`.

- Expected branch: `ss-006-frame-queue`
- Notion status at handoff: `0. Backlog`
- Acceptance criteria: deterministic frame sampling; cancellation/retry;
  long/short/portrait/landscape handling; and output containing timestamps,
  frame images, and landmark sets.

Next owner: begin SS-006 from updated `main` using the Swing Sync story
delivery workflow.

## Completed Task

`SS-004 Scaffold mobile-first PWA and local analysis shell` merged in
[PR #5](https://github.com/ajason13/swing-sync/pull/5) on 2026-06-06.

Acceptance criteria from Notion:

- App opens directly to capture/upload analysis flow.
- Layout works on mobile and desktop.
- Includes placeholder states for capture, processing, review, and export.
- Basic unit and smoke test setup exists.

SS-004 implementation status through 2026-06-06:

- The app opens directly to a responsive capture/upload workflow rather than a
  marketing page.
- Capture/upload, processing, review, and export are clearly labeled
  placeholders and do not access, store, analyze, export, or remotely share
  video.
- The existing local safety acknowledgement and runtime guard continue to block
  the first analysis action path until consent is checked.
- PWA scaffold metadata and a same-origin navigation shell service worker are
  included without adding remote endpoints.
- Vitest unit coverage validates the workflow model. Playwright smoke coverage
  validates the fail-closed consent path, all placeholder states, and mobile
  viewport overflow across desktop and Pixel 5 projects.
- Desktop and Pixel 5 full-page screenshots were reviewed with no text/control
  overlap; the mobile workflow navigation was revised to show all four states.
- Final Node 22 verification passed: `npm run test:unit`,
  `npm run test:smoke`, `npm run build`, `npm run compliance:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev --audit-level=high`, and
  `git diff --check`.
- Observability is intentionally unchanged. SS-004 adds no telemetry, remote
  logging, remote calls, video handling, model behavior, or remote sharing.
- PR #5 created: https://github.com/ajason13/swing-sync/pull/5
- A self-contained voluntary Claude Chat adversarial audit handoff is available
  at `docs/ss-004-claude-audit-prompt.md`. It embeds the current runtime, PWA,
  test, configuration, protected-boundary, and verification context because
  Claude Chat has no filesystem or GitHub access.
- Claude returned `PASS WITH MINOR FIXES` and conditional merge approval. The
  three required fixes were applied: consent storage failures now fail closed,
  the runtime guard reports inline and focuses the acknowledgement, and the
  incomplete service-worker offline cache was removed.
- Blocker-linked Playwright coverage was added for storage denial and the
  accessible runtime guard. A storage-failure latch and removal-failure
  regression case ensure previously stored consent cannot remain active after a
  failed removal. Final verification after fixes passed with 12 smoke cases, 2
  unit cases, build, compliance, license, bundle-fixture, SBOM, and diff checks.
- The original audit prompt is marked superseded. Use the focused
  `docs/ss-004-claude-rereview-prompt.md` for Claude's final sign-off.
- Claude focused re-review returned PASS. All three prior blockers are closed,
  no new merge blockers were introduced, and Claude approved SS-004 for merge.
- The final GitHub Actions compliance run passed after Claude sign-off.
- PR #5 merged with merge commit
  `1d4aaea207c57f93bf7aa3c96d56cf58059d603a`.
- Observability remains unchanged because SS-004 adds no telemetry, remote
  logging, remote calls, real video handling, model behavior, or remote sharing.

## Completed Task

`SS-003 Define privacy architecture and video data lifecycle` merged in
[PR #3](https://github.com/ajason13/swing-sync/pull/3) on 2026-06-06.

SS-003 status through 2026-06-06:

- Gemini Deep Research response received and distilled into
  `docs/ss-003-research-disposition.md`.
- Primary-source checks were recorded for browser storage, OPFS, persistent
  storage, WebKit tracking prevention, CSP, and MediaPipe policy references.
- Initial Claude adversarial review returned PASS WITH MINOR FIXES: clarify the
  consent-copy cross-checks in `scripts/verify-privacy-boundaries.js` and widen
  prohibited-endpoint scanning beyond `src/main.ts`.
- Claude blocker fixes were applied: the verifier now labels inherited SS-002
  consent scaffold checks, recursively scans `src/**` and `scripts/**` while
  excluding its own pattern-list file, records Sentry as blocked pending privacy
  review, clarifies Class G scaffold scope, and defers fail-closed verifier
  assertions until a real network/API boundary exists.
- Claude focused re-review returned PASS. Both blockers are closed, no new
  blockers were introduced, and Claude approved SS-003 for PR creation.
- Final pre-PR verification passed: `npm run privacy:verify`,
  `npm run compliance:verify`, `npm run build`, and
  `git diff --cached --check`.
- PR #3 created: https://github.com/ajason13/swing-sync/pull/3
- PR #3 merged with merge commit
  `28341d6df34774805fab341f342500d583c0986b`.
- Observability remains unchanged because SS-003 adds no runtime video,
  storage, network, model, telemetry, or remote-sharing behavior.

`SS-002 Draft sports injury waiver and educational-use terms` merged in
[PR #2](https://github.com/ajason13/swing-sync/pull/2) on 2026-06-05.

Acceptance criteria from Notion:

- Draft assumption-of-risk and release-of-liability language for review.
- State feedback is educational and not medical or professional athletic instruction.
- Define consent gate before first analysis.
- Add prompt constraints that avoid diagnosing pain or prescribing unsafe movements.

Planned/active artifacts:

- `docs/safety-terms.md`: product-compliance draft language for human/legal
  review, including assumption of risk, release of liability, educational-use
  boundaries, local-first privacy, consent-gate requirements, prompt
  constraints, and a review checklist.
- `src/main.ts`: minimal first-analysis consent gate scaffold that stores only
  local acknowledgement state.
- `scripts/verify-safety-terms.js`: safety-boundary regression checks wired
  into `npm run compliance:verify`.
- `docs/ss-002-research-disposition.md`: Gemini Deep Research disposition,
  separating adopted guidance from revised, deferred, or rejected
  recommendations.

SS-002 verification on 2026-06-05:

- `npm run safety:verify` passed.
- `npm run build` passed.
- `npm run compliance:verify` passed.
- `git diff --check` passed.
- Gemini Deep Research response received and distilled into
  `docs/ss-002-research-disposition.md`.
- Initial Claude audit returned conditional pass with two blockers: add a runtime
  consent check in the analysis click handler, and strengthen
  `scripts/verify-safety-terms.js` to avoid false confidence.
- Claude re-review returned PASS and granted sign-off for PR creation after the
  blocker fixes.
- PR #2 created: https://github.com/ajason13/swing-sync/pull/2
- Claude PR review returned APPROVED FOR MERGE with no blockers. Remaining
  notes are future-story items: verifier regex maintenance, unit tests for
  consent helpers once a real analysis pipeline exists, adversarial prompt tests
  for the first AI coaching pipeline, and private-browsing consent UX.

Remaining SS-002 pre-release gate:

- Legal/human review of draft assumption-of-risk and release-of-liability copy
  remains pending before public release.

## Persistent Learnings

- For safety, legal, medical, or compliance-sensitive stories, keep
  multi-agent roles explicit: Gemini for research/spec disposition, Codex for
  implementation and repo hygiene, and Claude for adversarial audit/re-review.
- Treat external model research as input, not implementation authority. Record
  adopted, revised, deferred, and rejected recommendations in a disposition file
  when research is broad or over-scoped.
- Avoid absolute claims in product safety/privacy copy. Prefer scoped language:
  draft only, not legal advice, no enforceability guarantee, local-first by
  default, and separate explicit opt-in before any remote sharing.
- For consent gates, use both UI gating and a runtime guard on the action path.
  `localStorage` acknowledgement is acceptable only as a scaffold unless legal
  review asks for durable consent records.
- Safety verifiers should check required user-facing copy and prohibited claim
  patterns. Exact phrase checks alone create false confidence.
- Future AI-coaching stories should convert deferred adversarial prompts into
  tests before any model output is exposed.
- Browser-chat research and audit prompts must embed any required repository
  context because Gemini and Claude Chat do not have filesystem or GitHub
  access.
- Initial audit prompts may include broad context, but re-review prompts should
  contain only prior findings, applied fixes, relevant current snippets, and a
  focused diff. Duplicating full contents and a full diff can cause the auditor
  to treat the handoff as repeated stale input.
- Keep the original audit prompt and focused re-review prompt in separate,
  clearly named files. Mark superseded prompt files with a do-not-paste
  redirect.

## Operating Notes

- Keep legal language framed as product/compliance drafting, not legal advice.
- Preserve the local-first privacy posture: no raw swing video upload by default.
- User-facing safety copy should be clear, plain, and explicit before analysis.
- Any connected model or coaching prompt must avoid medical diagnosis, pain triage, or aggressive mechanical prescriptions.
- Observability: SS-002 adds no runtime logging, telemetry, remote calls, or raw
  video handling. Consent acknowledgement is local-only browser state.

``````
