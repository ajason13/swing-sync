import { updateProcessingProgressUi } from "./app-renderer";
import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
import type { AppState } from "./app-state";
import {
  assignManualPhaseOutput,
  invalidatePhaseConfirmation,
  completeProcessingWithOutputs,
  recordProcessingOutput,
  resetPhaseReview,
  resetProcessingCounters,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "./app-state";
import { phaseDefinitions } from "./phase-review";
import { validateRequestedTimestamps } from "./frame-processing";
import { createBrowserFrameController } from "./browser-frame-processing";
import type {
  FrameProcessingController,
  FrameProcessingState,
  SampledFrameOutput
} from "./frame-processing";

export interface AnalysisLifecycleOptions {
  root: ParentNode;
  state: AppState;
  requestRender(request?: RenderRequest): void;
  applyAccessibilityIntent(intent: AccessibilityIntent): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;
  private activeCallbackToken: symbol | undefined;

  private eventController?: FrameProcessingController;
  private eventToken?: symbol;
  private manualOutputs = new Map<number, SampledFrameOutput>();

  constructor(private readonly options: AnalysisLifecycleOptions) {}

  async assignEventFrame(phaseIndex: number, timestampMs: number): Promise<void> {
    const { state } = this.options;
    if (state.eventFrameBusy || state.activeStep !== "review" || !state.selectedVideo ||
      state.phaseReviewState?.automaticProposal.evidenceStatus !== "review-required" || !phaseDefinitions[phaseIndex]) return;
    invalidatePhaseConfirmation(state);
    const report = (message: string) => {
      state.eventFrameStatus = message;
      this.options.requestRender({ focusKey: "event-time", announcement: message });
    };
    try {
      validateRequestedTimestamps(state.videoDuration ?? NaN, state.analysisInterval, [timestampMs]);
    } catch {
      report("Choose a finite source time within the analysis interval (INVALID_EVENT_TIME).");
      return;
    }
    const token = Symbol("event-frame");
    this.eventToken = token;
    state.eventFrameBusy = true;
    report("Selecting a local event frame. Review confirmation has been cleared.");
    let failureCode: string | undefined;
    // Detached from rendering: replacing controls cannot interrupt this media owner.
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    const { controller } = createBrowserFrameController(video, state.selectedVideo, {
      onState: (status, code) => { if (status === "failed") failureCode = code; },
      onProgress: () => undefined,
      onOutput: () => undefined
    }, state.analysisInterval, [timestampMs]);
    this.eventController = controller;
    await controller.start();
    const output = controller.takeOutputs()[0];
    await controller.close();
    if (this.eventToken !== token) {
      output?.preview.close();
      return;
    }
    this.eventController = undefined;
    this.eventToken = undefined;
    state.eventFrameBusy = false;
    if (!output) {
      report(`Event frame selection stopped (${failureCode ?? "LOCAL_EVENT_FRAME_FAILED"}). Previous assignments remain; choose a time and retry.`);
      return;
    }
    this.manualOutputs.get(phaseIndex)?.preview.close();
    this.manualOutputs.set(phaseIndex, output);
    assignManualPhaseOutput(state, phaseIndex, output);
    report("Selected event frame assigned. Check time order and pose availability, then review again. Impact remains unconfirmed.");
  }

  async stopEventFrame(): Promise<void> {
    const controller = this.eventController;
    this.eventToken = undefined;
    this.eventController = undefined;
    this.options.state.eventFrameBusy = false;
    await controller?.close();
    if (this.options.state.activeStep === "review") {
      this.options.state.eventFrameStatus = "Event frame selection stopped. Previous assignments remain; choose a time and retry.";
      this.options.requestRender({ focusKey: "event-time", announcement: this.options.state.eventFrameStatus });
    }
  }

  private async closeEventFrames(): Promise<void> {
    this.eventToken = undefined;
    const controller = this.eventController;
    this.eventController = undefined;
    for (const output of this.manualOutputs.values()) output.preview.close();
    this.manualOutputs.clear();
    await controller?.close();
  }

  hasActiveController(): boolean {
    return !!this.frameController;
  }

  async startActive(): Promise<void> {
    const video = this.options.root.querySelector<HTMLVideoElement>("#analysis-video");
    const selectedVideo = this.options.state.selectedVideo;
    if (!video || !selectedVideo) return;

    resetProcessingCounters(this.options.state);
    resetPhaseReview(this.options.state);
    const token = Symbol("analysis-controller");
    this.activeCallbackToken = token;
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(token, state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(token, completed, total),
      onOutput: (output) => this.handleProcessingOutput(token, output)
    }, this.options.state.analysisInterval);
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const eventCleanup = this.closeEventFrames();
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
    await eventCleanup;
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    const message = "Local analysis stopped and volatile resources were released.";
    this.options.requestRender({
      focusKey: "stage-heading",
      visibleStatusText: message,
      announcement: message
    });
  }

  async closeActive(): Promise<void> {
    const eventCleanup = this.closeEventFrames();
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
    await eventCleanup;
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
  }

  async retryActive(): Promise<void> {
    // Retry progress is surfaced through the processing partial-update path.
    resetPhaseReview(this.options.state);
    this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (this.options.state.eventFrameBusy) void this.eventController?.abort("UNEXPECTED_NETWORK_BLOCKED");
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(token: symbol, state: FrameProcessingState, code?: string): void {
    if (token !== this.activeCallbackToken) return;
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
    if (
      (state === "completed" || state === "failed") &&
      this.options.state.activeStep === "processing" &&
      token === this.activeCallbackToken
    ) {
      this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
    }
  }

  private handleProcessingProgress(token: symbol, completed: number, total: number): void {
    if (token !== this.activeCallbackToken) return;
    setProcessingProgress(this.options.state, completed, total);
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
  }

  private handleProcessingOutput(token: symbol, output: SampledFrameOutput): void {
    if (token !== this.activeCallbackToken) return;
    recordProcessingOutput(this.options.state, output);
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
    this.activeCallbackToken = undefined;
  }
}
