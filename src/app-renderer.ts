import type { AppState } from "./app-state";
import { isValidAnalysisInterval } from "./analysis-interval";
import { selectCanBeginAnalysis } from "./app-state";
import type { FrameProcessingState } from "./frame-processing";
import { phaseDefinitions } from "./phase-review";
import { renderPhaseReview } from "./phase-review-renderer";
import { renderRemoteModelReviewPanel } from "./remote-model-renderer";
import { escapeHtml, formatSwingCardWarning } from "./render-utils";
import type { SwingCardContentWarningCode } from "./swing-card-contract";
import { getWorkflowStep, workflowSteps } from "./workflow";

export function renderApp(root: HTMLElement, state: AppState, consentAccepted: boolean, statusMessage?: string): void {
  const step = getWorkflowStep(state.activeStep);
  const currentStatus =
    statusMessage ??
    (state.activeStep !== "capture" ? step.description : consentAccepted
      ? state.selectedVideo
        ? "Local video selected. Begin analysis when ready."
        : "Consent recorded locally. Choose a local video to begin analysis."
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
            <div><p class="eyebrow">Local swing review</p><h1 id="workflow-heading">Review your swing</h1></div>
            <p>Raw swing video stays on your device. No feature will send it elsewhere without a separate, explicit opt-in step you initiate.</p>
          </div>
          <nav class="step-nav" aria-label="Analysis workflow">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button class="step-button ${item.id === state.activeStep ? "is-active" : ""}" type="button"
                    data-step="${item.id}" data-focus-key="workflow-step:${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
                    <span class="step-number">${index + 1}</span><span>${item.shortLabel}</span>
                  </button>`
              )
              .join("")}
          </nav>
          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading" tabindex="-1" data-focus-key="stage-heading">${step.label}</h2></div>
              <span class="stage-status" data-workflow-status>${workflowStatusText(state, consentAccepted)}</span>
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
            <input id="safety-consent" type="checkbox" data-focus-key="safety-consent" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable or legally audited consent record.</p>
          <section class="local-data-controls" aria-labelledby="local-data-heading">
            <h3 id="local-data-heading">Local app data</h3>
            <button id="clear-local-data" class="secondary-action clear-local-data" type="button" aria-describedby="clear-local-data-note">Clear local app data</button>
            <p class="privacy-note" id="clear-local-data-note">This clears Swing Sync's registered local user state in this browser, including the safety acknowledgement and future app-owned analysis state if registered. It is not device-level erasure, and browser or operating-system storage behavior may vary. Downloaded files are outside this control.</p>
          </section>
          <p class="status" id="app-visible-status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;
}

export function renderWorkflowPanel(state: AppState, consentAccepted: boolean): string {
  if (state.activeStep === "capture") {
    return `
      <div class="capture-options" role="group" aria-label="Local video source">
        <button class="source-option" type="button" data-video-picker data-focus-key="video-picker">
          <span class="source-option__title">Choose a video</span>
          <span>${state.selectedVideo ? escapeHtml(state.selectedVideo.name) : "Select a local video file"}</span>
        </button>
        <input id="video-file" class="visually-hidden" type="file" accept="video/*" tabindex="-1" aria-label="Choose a local video file" />
      </div>
      <p class="action-note">Camera recording is unavailable. Choose an existing video from your device.</p>
      ${state.selectedVideo ? `
      <section class="local-preview" aria-labelledby="local-preview-heading">
        <h3 id="local-preview-heading">Preview your local video</h3>
        <video id="local-video-preview" class="analysis-video" controls muted playsinline preload="auto" tabindex="0"
          aria-label="Local video preview" aria-describedby="local-preview-status"></video>
        <p id="local-preview-status" class="action-note" role="status" aria-live="polite">Loading local video preview…</p>
        <button class="secondary-action" type="button" data-preview-toggle data-focus-key="preview-toggle" disabled>Play preview</button>
        ${renderAnalysisInterval(state)}
      </section>` : ""}
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" data-focus-key="analysis-start" aria-describedby="app-visible-status" ${
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
      <div class="processing-placeholder ${state.processingState === "failed" ? "is-failed" : ""}" role="group" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true" ${["loading", "processing"].includes(state.processingState) ? "" : "hidden"}></div>
        <div>
          <strong id="processing-status" role="status" aria-live="polite" aria-atomic="true">${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
          <p data-pose-summary>${processingSummaryText(state)}</p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline preload="auto" aria-label="Selected local video" ${state.processingState === "idle" ? "hidden" : ""}></video>
      <div class="action-row">
        <button class="secondary-action" type="button" data-return-capture data-processing-return data-focus-key="return-capture" ${state.processingState === "idle" ? "" : "hidden"}>Choose a video to analyze</button>
        <button class="secondary-action" type="button" data-cancel-analysis data-focus-key="stop-analysis" ${state.processingState === "idle" ? "hidden" : ""}>Stop local analysis</button>
        <button class="secondary-action" type="button" data-retry-analysis data-focus-key="retry-analysis" ${state.processingState === "failed" ? "" : "hidden"}>Retry local analysis</button>
        <button class="primary-action" type="button" data-review-phases data-focus-key="review-phases" aria-describedby="phase-review-status" ${
          state.processingState === "completed" ? "" : "hidden"
        }>Review phase labels</button>
        <p class="action-note" id="phase-review-status">${processingReviewStatusText(state.processingState, state.poseStatusCode)}</p>
      </div>
    `;
  }

  if (state.activeStep === "review") {
    if (state.phaseOutputs.length > 0) return renderPhaseReview(state);
    return `
      <div class="review-placeholder" role="group" aria-label="No frames to review">
        <p>Complete local analysis to review sampled frames and provisional phase labels. No metrics are calculated.</p>
      </div>
      <button class="secondary-action" type="button" data-return-capture data-focus-key="return-capture">Choose a video to analyze</button>
    `;
  }

  if (state.phaseOutputs.length === 0) {
    return `
      <section class="export-placeholder" aria-labelledby="export-placeholder-heading">
        <p class="placeholder-kicker">Local Swing Card</p>
        <h3 id="export-placeholder-heading">Swing Card unavailable</h3>
        <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
      </section>
      <button class="secondary-action" type="button" disabled aria-describedby="phase-review-status">Export is not available yet</button>
      <p class="action-note" id="phase-review-status">Analyze a local video first. Cards made before phase confirmation include an unconfirmed-review warning.</p>
      <button class="secondary-action" type="button" data-return-capture data-focus-key="return-capture">Choose a video to analyze</button>
    `;
  }

  return renderSwingCardExport(state);
}

function renderAnalysisInterval(state: AppState): string {
  const interval = state.analysisInterval;
  const duration = state.videoDuration;
  const valid = !!interval && isValidAnalysisInterval(duration ?? NaN, interval);
  const value = (number: number | undefined) => Number.isFinite(number) ? String(number) : "";
  return `<fieldset class="analysis-interval" ${duration === undefined ? "disabled" : ""} aria-describedby="interval-status">
    <legend>Analysis interval</legend>
    <label for="interval-start">Start (seconds)
      <input id="interval-start" type="number" min="0" max="${value(duration)}" step="any" value="${value(interval?.startSeconds)}"
        data-focus-key="interval-start" aria-invalid="${!!interval && !valid}" />
    </label>
    <label for="interval-end">End (seconds)
      <input id="interval-end" type="number" min="0" max="${value(duration)}" step="any" value="${value(interval?.endSeconds)}"
        data-focus-key="interval-end" aria-invalid="${!!interval && !valid}" />
    </label>
    <p id="interval-status" class="action-note" role="status">${duration === undefined
      ? "Load the preview to choose an interval. Analysis uses the full clip unless you select an interval."
      : valid ? `Selected source time: ${value(interval?.startSeconds)}–${value(interval?.endSeconds)} seconds of ${value(duration)}. Analysis samples only this interval.`
        : `Enter a finite start and end with 0 ≤ start < end ≤ ${value(duration)} seconds. Analysis is blocked until the interval is valid.`}</p>
    <button class="secondary-action" type="button" data-interval-preview data-focus-key="interval-preview" disabled>Preview interval</button>
  </fieldset>`;
}

export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
  const status = root.querySelector<HTMLElement>("#processing-status");
  const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");
  const reviewStatus = root.querySelector<HTMLElement>("#phase-review-status");
  const badge = root.querySelector<HTMLElement>("[data-workflow-status]");
  const mark = root.querySelector<HTMLElement>(".processing-mark");
  const stop = root.querySelector<HTMLButtonElement>("[data-cancel-analysis]");
  const returnAction = root.querySelector<HTMLButtonElement>("[data-processing-return]");
  const video = root.querySelector<HTMLVideoElement>("#analysis-video");

  if (badge) badge.textContent = workflowStatusText(state, true);
  if (mark) mark.hidden = !["loading", "processing"].includes(state.processingState);
  if (stop) stop.hidden = state.processingState === "idle";
  if (returnAction) returnAction.hidden = state.processingState !== "idle";
  if (video) video.hidden = state.processingState === "idle";
  if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
  if (summary) summary.textContent = processingSummaryText(state);
  if (retry) retry.hidden = state.processingState !== "failed";
  if (review) review.hidden = state.processingState !== "completed";
  if (reviewStatus) reviewStatus.textContent = processingReviewStatusText(state.processingState, state.poseStatusCode);
}

function workflowStatusText(state: AppState, consentAccepted: boolean): string {
  if (state.activeStep === "capture") {
    if (!consentAccepted) return "Safety acknowledgement needed";
    if (!state.selectedVideo) return "Choose a video";
    return selectCanBeginAnalysis(state, consentAccepted) ? "Ready to analyze" : "Check analysis interval";
  }
  if (state.activeStep === "processing") {
    return {
      idle: "No analysis running",
      loading: "Loading local model",
      processing: "Processing frames",
      completed: "Ready for review",
      failed: "Analysis stopped",
      cancelled: "Analysis cancelled",
      closed: "Analysis closed"
    }[state.processingState];
  }
  if (!state.phaseOutputs.length) return state.activeStep === "review" ? "No frames to review" : "No card available";
  if (state.eventFrameBusy) return "Selecting a frame";
  if (state.activeStep === "export") return state.swingCardBusy ? "Preparing Swing Card" : "Ready to export";
  return state.phaseReviewState?.readyForFutureMetrics ? "Review confirmed" : "Review needed";
}

function renderSwingCardExport(state: AppState): string {
  const phaseReady = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warnings: SwingCardContentWarningCode[] = ["METRICS_UNAVAILABLE"];
  if (!phaseReady) warnings.push("PHASE_REVIEW_REQUIRED");

  return `
    <section class="swing-card-panel" aria-labelledby="swing-card-heading">
      <div class="swing-card-panel__header">
        <div>
          <p class="placeholder-kicker">Local Swing Card</p>
          <h3 id="swing-card-heading" tabindex="-1" data-focus-key="swing-card-heading">Downloadable summary</h3>
        </div>
        <span class="stage-status">Manual sharing</span>
      </div>
      <p>This card can include annotated keyframes, unavailable metric states, warnings, and prompt text for a manual LLM chat upload. Raw swing video is not included. Keyframes and their availability warnings are prepared when you download or print. Unavailable evidence remains marked in the card.</p>
      <div class="swing-card-summary" role="group" aria-label="Swing Card contents">
        <div><strong>${phaseDefinitions.length}</strong><span>phase labels</span></div>
        <div><strong>PNG</strong><span>download</span></div>
        <div><strong>Print</strong><span>save as PDF where supported</span></div>
      </div>
      <ul class="swing-card-warning-list" aria-label="Swing Card warnings">
        ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
      </ul>
      <div class="action-row swing-card-actions">
        <button class="primary-action" type="button" data-download-swing-card data-focus-key="swing-card-download" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Download PNG</button>
        <button class="secondary-action" type="button" data-print-swing-card data-focus-key="swing-card-print" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Print / Save as PDF</button>
        <button class="secondary-action" type="button" data-copy-swing-card-prompt data-focus-key="swing-card-copy" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Copy prompt</button>
        <p class="action-note" id="swing-card-action-status" data-swing-card-status tabindex="-1" data-focus-key="swing-card-status">${escapeHtml(state.swingCardStatus)}</p>
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
              : "No analysis running. Choose a video and begin analysis from the first step.";
}

function processingReviewStatusText(state: FrameProcessingState, code?: string): string {
  return state === "completed"
    ? "Local processing output is ready for phase review."
    : state === "failed"
      ? `Phase review is unavailable because local pose analysis stopped (${code ?? "UNKNOWN_ERROR"}). Retry local analysis.`
      : state === "cancelled"
        ? "Phase review is unavailable because local processing was cancelled."
        : state === "closed"
          ? "Phase review is unavailable because the local pose session was closed."
          : state === "loading"
            ? "Phase review requires local pose model loading and processing to complete."
            : state === "processing"
              ? "Phase review requires local video frame processing to complete."
              : "Phase review requires completed local processing output.";
}

function processingSummaryText(state: AppState): string {
  return `${state.extractedFrameCount} of ${state.totalFrameCount} video frames processed.${
    state.latestLandmarkCount > 0
      ? ` ${state.latestLandmarkCount} normalized landmarks retained in the latest result.`
      : ""
  }`;
}
