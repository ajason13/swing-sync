import "./styles.css";
import { createBrowserFrameController } from "./browser-frame-processing";
import {
  type FrameProcessingController,
  type FrameProcessingState,
  type SampledFrameOutput
} from "./frame-processing";
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
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";
import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses
} from "./model-adapter-contract";
import { reviewedModelProviders } from "./model-consent";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  triggerSwingCardDownload
} from "./swing-card-generator";
import type { SwingCardContent, SwingCardKeyframe } from "./swing-card-contract";
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
let phaseOutputs: readonly SampledFrameOutput[] = [];
let phaseDeclarations: PhaseDeclarations = undeclaredPhaseDeclarations();
let phaseReviewState: PhaseReviewState | undefined;
let phaseDraft: PhaseAssignment[] = [];
let phaseConfirmation = false;
let selectedKeyframeIndex = 0;
let latestOverlayResult: PoseOverlayRenderResult | undefined;
let swingCardBusy = false;
let swingCardStatus = "Swing Card export is generated locally after review data exists.";

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
        <button class="primary-action" type="button" data-review-phases ${
          processingState === "completed" ? "" : "hidden"
        }>Review phase labels</button>
      </div>
    `;
  }

  if (activeStep === "review") {
    if (phaseOutputs.length > 0) return renderPhaseReview();
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

  if (phaseOutputs.length === 0) {
    return `
      <div class="export-placeholder" aria-label="Export placeholder">
        <p class="placeholder-kicker">Local Swing Card</p>
        <h3>Swing Card unavailable</h3>
        <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
      </div>
      <button class="secondary-action" type="button" disabled>Export is not available yet</button>
    `;
  }

  return renderSwingCardExport();
}

function renderPhaseReview(): string {
  const proposal = phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const ready = phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    proposal?.evidenceStatus === "unsupported-input"
      ? "Select every required declaration and provide a supported active eight-sample run."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview()}
      <div class="phase-warning" role="status" aria-live="polite">
        <strong id="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</strong>
        <p>${warning}</p>
      </div>
      <fieldset class="phase-declarations">
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", phaseDeclarations.view, [
          ["undeclared", "Select view"],
          ["face-on", "Face-on side view"]
        ])}
        ${renderDeclarationSelect("phase-handedness", "Handedness", phaseDeclarations.handedness, [
          ["undeclared", "Select handedness"],
          ["right", "Right-handed"],
          ["left", "Left-handed"]
        ])}
        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", phaseDeclarations.mirrored, [
          ["undeclared", "Select mirrored status"],
          ["no", "No"],
          ["yes", "Yes"]
        ])}
        <label class="phase-setup-confirmation">
          <input id="phase-setup" type="checkbox" ${phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
          <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
        </label>
      </fieldset>
      <div class="phase-assignment-list" aria-label="Swing phase assignments">
        ${phaseDefinitions
          .map((phase, index) => {
            const selected = phaseDraft[index]?.sampleIndex ?? index;
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
        <input id="phase-confirmation" type="checkbox" ${phaseConfirmation ? "checked" : ""} ${
          reviewRequired && !ready ? "" : "disabled"
        } />
        <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
      </label>
      <div class="action-row">
        <button class="primary-action" type="button" data-confirm-phase-review ${
          reviewRequired && phaseConfirmation && isValidCorrection(phaseDraft) && !ready ? "" : "disabled"
        }>Confirm phase review</button>
        <button class="secondary-action" type="button" data-open-export>Open Swing Card export</button>
        <p class="action-note">${ready ? "Future metric readiness is available for a separately reviewed story. No metrics are generated here." : "Future metric readiness remains locked until this review is valid and explicitly confirmed."}</p>
      </div>
    </section>
  `;
}

function renderSwingCardExport(): string {
  const phaseReady = phaseReviewState?.readyForFutureMetrics ?? false;
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
        <div><strong>${phaseOutputs.length}</strong><span>local keyframes</span></div>
        <div><strong>PNG</strong><span>download</span></div>
        <div><strong>Print</strong><span>save as PDF where supported</span></div>
      </div>
      <ul class="swing-card-warning-list" aria-label="Swing Card warnings">
        ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
      </ul>
      <div class="action-row swing-card-actions">
        <button class="primary-action" type="button" data-download-swing-card ${swingCardBusy ? "disabled" : ""}>Download PNG</button>
        <button class="secondary-action" type="button" data-print-swing-card ${swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
        <button class="secondary-action" type="button" data-copy-swing-card-prompt ${swingCardBusy ? "disabled" : ""}>Copy prompt</button>
        <p class="action-note" data-swing-card-status role="status">${escapeHtml(swingCardStatus)}</p>
      </div>
      <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
      ${renderRemoteModelReviewPanel()}
    </section>
  `;
}

function renderRemoteModelReviewPanel(): string {
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

function renderKeyframeOverlayReview(): string {
  const selectedOutput = phaseOutputs[selectedKeyframeIndex] ?? phaseOutputs[0];
  const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
  const overlayStatus =
    latestOverlayResult?.status === "unavailable"
      ? "Skeleton overlay unavailable for this keyframe."
      : latestOverlayResult?.status === "partial"
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
            const isSelected = selectedKeyframeIndex === index;
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

function formatRemoteDataClass(dataClass: string): string {
  return dataClass
    .split("-")
    .map((part, index) => (index > 0 && part === "and" ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
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
  renderSelectedKeyframeCanvas();
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
      const nextStep = button.dataset.step as WorkflowStepId;
      const opensCompletedReview =
        activeStep === "processing" && processingState === "completed" && nextStep === "review";
      const preservesReviewData =
        ["review", "export"].includes(activeStep) && ["review", "export"].includes(nextStep);
      if (
        ["processing", "review", "export"].includes(activeStep) &&
        nextStep !== activeStep &&
        !opensCompletedReview &&
        !preservesReviewData
      ) {
        void closeFrameAnalysis();
      }
      activeStep = nextStep;
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
    clearPhaseReview();
    void frameController?.retry();
  });
  document.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    activeStep = "review";
    renderApp("Review the provisional phase labels before future measurements become available.");
  });

  document.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
    phaseDeclarations.view = (event.currentTarget as HTMLSelectElement).value as PhaseDeclarations["view"];
    rebuildPhaseReview();
  });
  document.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
    phaseDeclarations.handedness = (event.currentTarget as HTMLSelectElement)
      .value as PhaseDeclarations["handedness"];
    rebuildPhaseReview();
  });
  document.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
    phaseDeclarations.mirrored = (event.currentTarget as HTMLSelectElement)
      .value as PhaseDeclarations["mirrored"];
    rebuildPhaseReview();
  });
  document.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
    phaseDeclarations.setup = (event.currentTarget as HTMLInputElement).checked
      ? "confirmed"
      : "undeclared";
    rebuildPhaseReview();
  });
  document.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
    select.addEventListener("change", () => {
      const index = Number(select.dataset.phaseIndex);
      phaseDraft[index] = { phaseId: phaseDefinitions[index].id, sampleIndex: Number(select.value) };
      phaseConfirmation = false;
      renderApp();
    });
  });
  document.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
    phaseConfirmation = (event.currentTarget as HTMLInputElement).checked;
    renderApp();
  });
  document.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
    if (!phaseReviewState) return;
    phaseReviewState = applyPhaseCorrection(
      phaseReviewState,
      phaseDraft,
      phaseConfirmation,
      phaseOutputs[0]?.runGeneration ?? -1
    );
    renderApp();
  });
  document.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
    activeStep = "export";
    renderApp("Swing Card export opened.");
  });
  document.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedKeyframeIndex = Number(button.dataset.keyframeIndex);
      latestOverlayResult = undefined;
      renderApp();
    });
  });
  document.querySelector<HTMLButtonElement>("[data-download-swing-card]")?.addEventListener("click", () => {
    void downloadSwingCard();
  });
  document.querySelector<HTMLButtonElement>("[data-print-swing-card]")?.addEventListener("click", () => {
    void printSwingCard();
  });
  document.querySelector<HTMLButtonElement>("[data-copy-swing-card-prompt]")?.addEventListener("click", () => {
    void copySwingCardPrompt();
  });
}

function handleProcessingState(state: FrameProcessingState, code?: string): void {
  processingState = state;
  poseStatusCode = code;
  if (state === "completed" && frameController) {
    phaseOutputs = frameController.getOutputs();
    selectedKeyframeIndex = 0;
    phaseDeclarations = undeclaredPhaseDeclarations();
    rebuildPhaseReview(false);
  }
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
  const review = document.querySelector<HTMLButtonElement>("[data-review-phases]");
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
  if (review) review.hidden = processingState !== "completed";
}

async function startFrameAnalysis(): Promise<void> {
  const video = document.querySelector<HTMLVideoElement>("#analysis-video");
  if (!video || !selectedVideo) return;

  extractedFrameCount = 0;
  totalFrameCount = 0;
  latestLandmarkCount = 0;
  clearPhaseReview();
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
  clearPhaseReview();
  await controller?.cancel();
  activeStep = "capture";
  renderApp("Local analysis stopped and volatile resources were released.");
}

async function closeFrameAnalysis(): Promise<void> {
  const controller = frameController;
  clearPhaseReview();
  await controller?.close();
  if (frameController === controller) {
    frameController = undefined;
    abortFrameController = undefined;
  }
}

function rebuildPhaseReview(shouldRender = true): void {
  const proposal = createPhaseProposal(phaseOutputs, phaseDeclarations);
  phaseReviewState = createPhaseReviewState(proposal);
  phaseDraft = proposal.assignments.map((assignment) => ({ ...assignment }));
  phaseConfirmation = false;
  if (shouldRender) renderApp();
}

function clearPhaseReview(): void {
  phaseOutputs = [];
  phaseDeclarations = undeclaredPhaseDeclarations();
  phaseReviewState = undefined;
  phaseDraft = [];
  phaseConfirmation = false;
  selectedKeyframeIndex = 0;
  latestOverlayResult = undefined;
  swingCardBusy = false;
  swingCardStatus = "Swing Card export is generated locally after review data exists.";
}

function renderSelectedKeyframeCanvas(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || phaseOutputs.length === 0) return;
  const output = phaseOutputs[selectedKeyframeIndex] ?? phaseOutputs[0];
  const status = document.querySelector<HTMLElement>("[data-overlay-status]");
  const result = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  latestOverlayResult = result;
  if (status) {
    status.textContent =
      result.status === "unavailable"
        ? "Skeleton overlay unavailable for this keyframe."
        : result.status === "partial"
          ? "Skeleton overlay partially available for this keyframe."
          : "Skeleton overlay rendered for this keyframe.";
  }
}

function undeclaredPhaseDeclarations(): PhaseDeclarations {
  return {
    view: "undeclared",
    handedness: "undeclared",
    mirrored: "undeclared",
    setup: "undeclared"
  };
}

async function downloadSwingCard(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing local Swing Card PNG.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    const result = await composeSwingCardPng(prepared.content);
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      swingCardStatus = "Swing Card PNG download started.";
    } else {
      swingCardStatus = `Swing Card PNG export stopped (${result.reason}).`;
    }
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function printSwingCard(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing browser print view.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    const host = document.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    swingCardStatus = "Browser print dialog opened. Save as PDF if your browser supports it.";
    window.print();
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function copySwingCardPrompt(): Promise<void> {
  if (swingCardBusy) return;
  swingCardBusy = true;
  swingCardStatus = "Preparing prompt text.";
  renderApp();
  const prepared = await prepareSwingCardContent();
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    swingCardStatus = "Prompt copied for manual use.";
  } catch {
    swingCardStatus = "Prompt copy unavailable in this browser.";
  } finally {
    prepared.release();
    swingCardBusy = false;
    renderApp();
  }
}

async function prepareSwingCardContent(): Promise<{ content: SwingCardContent; release(): void }> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments();

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframe(output) : undefined;
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
    phaseReviewConfirmed: (phaseReviewState?.readyForFutureMetrics ?? false) && !!assignments
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

function getCompleteSwingCardAssignments(): readonly PhaseAssignment[] | undefined {
  const assignments =
    phaseReviewState?.correction?.assignments ?? phaseReviewState?.automaticProposal.assignments;
  return assignments && isValidCorrection(assignments) ? assignments : undefined;
}

async function renderAnnotatedKeyframe(
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

function formatSwingCardWarning(warning: string): string {
  const labels: Record<string, string> = {
    NO_KEYFRAMES_SELECTED: "No keyframes were selected.",
    KEYFRAME_UNAVAILABLE: "One or more keyframes are unavailable.",
    METRICS_UNAVAILABLE: "Metrics are unavailable.",
    PHASE_REVIEW_REQUIRED: "Phase review is required before metrics should be interpreted.",
    PROMPT_LIMITED_EVIDENCE: "Evidence is limited; do not infer missing values."
  };
  return labels[warning] ?? warning;
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
