import { updateProcessingProgressUi } from "./app-renderer";
import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
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
  requestRender(request?: RenderRequest): void;
  applyAccessibilityIntent(intent: AccessibilityIntent): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;
  private activeCallbackToken: symbol | undefined;

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
    const token = Symbol("analysis-controller");
    this.activeCallbackToken = token;
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(token, state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(token, completed, total),
      onOutput: (output) => this.handleProcessingOutput(token, output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
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
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
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
