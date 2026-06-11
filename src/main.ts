import "./styles.css";
import { type PoseFrameResult } from "./pose-contract";
import { PoseSession, type PoseSessionStatus } from "./pose-session";
import { getNextWorkflowStep, getWorkflowStep, workflowSteps, type WorkflowStepId } from "./workflow";

const app = document.querySelector<HTMLDivElement>("#app");
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";
let consentStorageFailed = false;
let activeStep: WorkflowStepId = "capture";
let selectedVideo: File | undefined;
let selectedVideoUrl: string | undefined;
let poseSession: PoseSession | undefined;
let poseStatus: PoseSessionStatus = "idle";
let poseStatusCode: string | undefined;
let extractedFrameCount = 0;
let latestLandmarkCount = 0;
let pendingTimestamps: number[] = [];

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
      poseStatus === "loading"
        ? "Loading the local pose model in a background worker."
        : poseStatus === "processing"
          ? "Processing a local video frame."
          : poseStatus === "ready"
            ? "Local pose worker ready."
            : poseStatus === "error"
              ? `Local pose analysis stopped (${poseStatusCode ?? "UNKNOWN_ERROR"}).`
              : poseStatus === "closed"
                ? "Local pose session closed."
                : "Preparing local pose analysis.";

    return `
      <div class="processing-placeholder" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>${statusText}</strong>
          <p data-pose-summary>
            ${extractedFrameCount} video frames processed.
            ${latestLandmarkCount > 0 ? `${latestLandmarkCount} normalized landmarks retained in the latest result.` : ""}
          </p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
      <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
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
    if (!selectedVideo || !selectedVideoUrl) {
      renderApp("Choose a local video before starting analysis.");
      return;
    }
    activeStep = "processing";
    renderApp("Loading approved local pose assets. No video data leaves this device.");
    startPoseAnalysis();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      if (activeStep === "processing") stopPoseAnalysis();
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
    releaseSelectedVideo();
    selectedVideo = file;
    selectedVideoUrl = URL.createObjectURL(file);
    renderApp("Local video selected. It has not been analyzed or persisted.");
  });

  document.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    renderApp("Camera capture remains out of scope. Choose a local video file.");
  });

  document.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    stopPoseAnalysis();
    activeStep = "capture";
    renderApp("Local analysis stopped and volatile resources were released.");
  });
}

function releaseSelectedVideo(): void {
  if (selectedVideoUrl) URL.revokeObjectURL(selectedVideoUrl);
  selectedVideo = undefined;
  selectedVideoUrl = undefined;
}

function handlePoseStatus(status: PoseSessionStatus, code?: string): void {
  poseStatus = status;
  poseStatusCode = code;
  if (status === "ready") void processNextFrame();
  updateProcessingUi();
}

function handlePoseResult(result: PoseFrameResult): void {
  extractedFrameCount += 1;
  latestLandmarkCount = result.landmarks[0]?.length ?? 0;
  updateProcessingUi();
}

function updateProcessingUi(): void {
  const status = document.querySelector<HTMLElement>(".processing-placeholder strong");
  const summary = document.querySelector<HTMLElement>("[data-pose-summary]");
  if (status) {
    status.textContent =
      poseStatus === "loading"
        ? "Loading the local pose model in a background worker."
        : poseStatus === "processing"
          ? "Processing a local video frame."
          : poseStatus === "ready"
            ? "Local pose worker ready."
            : poseStatus === "error"
              ? `Local pose analysis stopped (${poseStatusCode ?? "UNKNOWN_ERROR"}).`
              : "Local pose session closed.";
  }
  if (summary) {
    summary.textContent = `${extractedFrameCount} video frames processed.${
      latestLandmarkCount > 0
        ? ` ${latestLandmarkCount} normalized landmarks retained in the latest result.`
        : ""
    }`;
  }
}

function startPoseAnalysis(): void {
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (!video || !selectedVideoUrl) return;

  extractedFrameCount = 0;
  latestLandmarkCount = 0;
  pendingTimestamps = [];
  video.src = selectedVideoUrl;
  video.addEventListener(
    "loadedmetadata",
    () => {
      const finalSample = Math.max(0, Math.min(video.duration - 0.001, 1.5));
      pendingTimestamps = [...new Set([0, 0.5, 1, finalSample])]
        .filter((timestamp) => timestamp <= video.duration)
        .sort((a, b) => a - b);
      void processNextFrame();
    },
    { once: true }
  );

  poseSession = new PoseSession({ onStatus: handlePoseStatus, onResult: handlePoseResult });
  poseSession.initialize();
}

async function processNextFrame(): Promise<void> {
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (!video || poseStatus !== "ready" || pendingTimestamps.length === 0) return;

  const timestampSeconds = pendingTimestamps.shift();
  if (timestampSeconds === undefined) return;
  if (Math.abs(video.currentTime - timestampSeconds) > 0.001) {
    await new Promise<void>((resolve) => {
      video.addEventListener("seeked", () => resolve(), { once: true });
      video.currentTime = timestampSeconds;
    });
  }
  const bitmap = await createImageBitmap(video);
  poseSession?.submitFrame(bitmap, Math.round(timestampSeconds * 1000));
}

function stopPoseAnalysis(): void {
  poseSession?.teardown();
  poseSession = undefined;
  poseStatus = "closed";
  pendingTimestamps = [];
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  releaseSelectedVideo();
}

function failPoseAnalysis(code: string): void {
  poseSession?.abort(code);
  poseSession = undefined;
  pendingTimestamps = [];
  poseStatus = "error";
  poseStatusCode = code;
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  releaseSelectedVideo();
  updateProcessingUi();
}

renderApp();

window.addEventListener("beforeunload", stopPoseAnalysis);
document.addEventListener("securitypolicyviolation", () => {
  if (["loading", "ready", "processing"].includes(poseStatus)) {
    failPoseAnalysis("UNEXPECTED_NETWORK_BLOCKED");
  }
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
