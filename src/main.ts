import "./styles.css";
import { createBrowserFrameController } from "./browser-frame-processing";
import {
  type FrameProcessingController,
  type FrameProcessingState,
  type SampledFrameOutput
} from "./frame-processing";
import { getNextWorkflowStep, getWorkflowStep, workflowSteps, type WorkflowStepId } from "./workflow";

const app = document.querySelector<HTMLDivElement>("#app");
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";
let consentStorageFailed = false;
let activeStep: WorkflowStepId = "capture";
let selectedVideo: File | undefined;
let frameController: FrameProcessingController | undefined;
let abortFrameController: ((code: string) => void) | undefined;
let processingState: FrameProcessingState = "idle";
let poseStatusCode: string | undefined;
let extractedFrameCount = 0;
let totalFrameCount = 0;
let latestLandmarkCount = 0;

function hasSafetyConsent(): boolean {
  if (consentStorageFailed) return false;

  try {
    return window.localStorage.getItem(consentStorageKey) === "accepted";
  } catch {
    consentStorageFailed = true;
    return false;
  }
}

function setSafetyConsent(accepted: boolean): void {
  try {
    if (accepted) {
      window.localStorage.setItem(consentStorageKey, "accepted");
      return;
    }
    window.localStorage.removeItem(consentStorageKey);
  } catch {
    consentStorageFailed = true;
  }
}

function escapeHtml(value: string): string {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function renderWorkflowPanel(consentAccepted: boolean): string {
  if (activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Local video source">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture is not part of this story</span>
        </button>
        <button class="source-option" type="button" data-video-picker>
          <span class="source-option__title">Choose a video</span>
          <span>${selectedVideo ? escapeHtml(selectedVideo.name) : "Select a local video file"}</span>
        </button>
        <input id="video-file" class="visually-hidden" type="file" accept="video/*" />
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${
          consentAccepted && selectedVideo ? "" : "disabled"
        }>
          Begin analysis
        </button>
        <p class="action-note">The selected video and decoded frames remain volatile and local.</p>
      </div>
    `;
  }

  if (activeStep === "processing") {
    const statusText =
      processingState === "loading"
        ? "Loading the local pose model in a background worker."
        : processingState === "processing"
          ? "Processing a local video frame."
          : processingState === "completed"
            ? "Local frame processing completed."
            : processingState === "failed"
              ? `Local pose analysis stopped (${poseStatusCode ?? "UNKNOWN_ERROR"}).`
              : processingState === "cancelled"
                ? "Local frame processing cancelled."
                : processingState === "closed"
                ? "Local pose session closed."
                : "Preparing local pose analysis.";

    return `
      <div class="processing-placeholder" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>${statusText}</strong>
          <p data-pose-summary>
            ${extractedFrameCount} of ${totalFrameCount} video frames processed.
            ${latestLandmarkCount > 0 ? `${latestLandmarkCount} normalized landmarks retained in the latest result.` : ""}
          </p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
      <div class="action-row">
        <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
        <button class="secondary-action" type="button" data-retry-analysis hidden>Retry local analysis</button>
      </div>
    `;
  }

  if (activeStep === "review") {
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

  return `
    <div class="export-placeholder" aria-label="Export placeholder">
      <p class="placeholder-kicker">Future local export</p>
      <h3>Swing summary</h3>
      <p>A future export may include selected metrics, feedback, or keyframes. Raw swing video will not be included by default.</p>
    </div>
    <button class="secondary-action" type="button" disabled>Export is not available yet</button>
  `;
}

function renderApp(statusMessage?: string): void {
  if (!app) return;

  const consentAccepted = hasSafetyConsent();
  const step = getWorkflowStep(activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Choose a local video to begin analysis."
      : "First analysis is blocked until this acknowledgement is checked.");

  app.innerHTML = `
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
                  <button class="step-button ${item.id === activeStep ? "is-active" : ""}" type="button"
                    data-step="${item.id}" aria-current="${item.id === activeStep ? "step" : "false"}">
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
            ${renderWorkflowPanel(consentAccepted)}
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
          <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable consent record.</p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;

  bindInteractions();
}

function bindInteractions(): void {
  document.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    renderApp();
  });

  document.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!hasSafetyConsent()) {
      renderApp("Please acknowledge the safety terms before starting analysis.");
      document.querySelector<HTMLInputElement>("#safety-consent")?.focus();
      return;
    }
    if (!selectedVideo) {
      renderApp("Choose a local video before starting analysis.");
      return;
    }
    activeStep = "processing";
    renderApp("Loading approved local pose assets. No video data leaves this device.");
    void startFrameAnalysis();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      if (activeStep === "processing") void closeFrameAnalysis();
      activeStep = button.dataset.step as WorkflowStepId;
      renderApp(`${getWorkflowStep(activeStep).label} opened.`);
    });
  });

  document.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    activeStep = getNextWorkflowStep(activeStep).id;
    renderApp(`${getWorkflowStep(activeStep).label} opened.`);
  });

  document.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    document.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  document.querySelector<HTMLInputElement>("#video-file")?.addEventListener("change", (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    void closeFrameAnalysis();
    selectedVideo = file;
    renderApp("Local video selected. It has not been analyzed or persisted.");
  });

  document.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    renderApp("Camera capture remains out of scope. Choose a local video file.");
  });

  document.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void stopFrameAnalysis();
  });

  document.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void frameController?.retry();
  });
}

function handleProcessingState(state: FrameProcessingState, code?: string): void {
  processingState = state;
  poseStatusCode = code;
  updateProcessingUi();
}

function handleProcessingProgress(completed: number, total: number): void {
  extractedFrameCount = completed;
  totalFrameCount = total;
  updateProcessingUi();
}

function handleProcessingOutput(output: SampledFrameOutput): void {
  latestLandmarkCount = output.pose.landmarks[0]?.length ?? 0;
  updateProcessingUi();
}

function updateProcessingUi(): void {
  const status = document.querySelector<HTMLElement>(".processing-placeholder strong");
  const summary = document.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = document.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  if (status) {
    status.textContent =
      processingState === "loading"
        ? "Loading the local pose model in a background worker."
        : processingState === "processing"
          ? "Processing a local video frame."
          : processingState === "completed"
            ? "Local frame processing completed."
            : processingState === "failed"
              ? `Local pose analysis stopped (${poseStatusCode ?? "UNKNOWN_ERROR"}).`
              : processingState === "cancelled"
                ? "Local frame processing cancelled."
                : "Local pose session closed.";
  }
  if (summary) {
    summary.textContent = `${extractedFrameCount} of ${totalFrameCount} video frames processed.${
      latestLandmarkCount > 0
        ? ` ${latestLandmarkCount} normalized landmarks retained in the latest result.`
        : ""
    }`;
  }
  if (retry) retry.hidden = processingState !== "failed";
}

async function startFrameAnalysis(): Promise<void> {
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (!video || !selectedVideo) return;

  extractedFrameCount = 0;
  totalFrameCount = 0;
  latestLandmarkCount = 0;
  const browserController = createBrowserFrameController(video, selectedVideo, {
    onState: handleProcessingState,
    onProgress: handleProcessingProgress,
    onOutput: handleProcessingOutput
  });
  frameController = browserController.controller;
  abortFrameController = browserController.abort;
  await frameController.start();
}

async function stopFrameAnalysis(): Promise<void> {
  const controller = frameController;
  await controller?.cancel();
  activeStep = "capture";
  renderApp("Local analysis stopped and volatile resources were released.");
}

async function closeFrameAnalysis(): Promise<void> {
  const controller = frameController;
  await controller?.close();
  if (frameController === controller) {
    frameController = undefined;
    abortFrameController = undefined;
  }
}

renderApp();

window.addEventListener("beforeunload", () => {
  void closeFrameAnalysis();
});
document.addEventListener("securitypolicyviolation", () => {
  if (["loading", "processing"].includes(processingState)) {
    abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
  }
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
