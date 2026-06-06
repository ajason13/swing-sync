import "./styles.css";
import {
  getNextWorkflowStep,
  getWorkflowStep,
  workflowSteps,
  type WorkflowStepId
} from "./workflow";

const app = document.querySelector<HTMLDivElement>("#app");
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";
let activeStep: WorkflowStepId = "capture";

function hasSafetyConsent(): boolean {
  try {
    return window.localStorage.getItem(consentStorageKey) === "accepted";
  } catch {
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
    // Storage failures intentionally leave the analysis path fail closed.
  }
}

function renderWorkflowPanel(consentAccepted: boolean): string {
  if (activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Capture and upload placeholders">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture placeholder</span>
        </button>
        <button class="source-option" type="button" data-placeholder-action="upload">
          <span class="source-option__title">Choose a video</span>
          <span>Local file selection placeholder</span>
        </button>
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${consentAccepted ? "" : "disabled"}>
          Begin analysis
        </button>
        <p class="action-note">No video is selected, stored, or analyzed in this scaffold.</p>
      </div>
    `;
  }

  if (activeStep === "processing") {
    return `
      <div class="processing-placeholder" aria-label="Processing placeholder">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>Local processing preview</strong>
          <p>Future analysis progress and cancellation controls will appear here.</p>
        </div>
      </div>
      <button class="secondary-action" type="button" data-next-step>
        Preview review state
      </button>
    `;
  }

  if (activeStep === "review") {
    return `
      <div class="review-placeholder" aria-label="Review placeholder">
        <div class="swing-frame">
          <span>Video and pose preview</span>
        </div>
        <dl class="metric-list">
          <div><dt>Tempo</dt><dd>--</dd></div>
          <div><dt>Balance</dt><dd>--</dd></div>
          <div><dt>Rotation</dt><dd>--</dd></div>
        </dl>
      </div>
      <button class="secondary-action" type="button" data-next-step>
        Preview export state
      </button>
    `;
  }

  return `
    <div class="export-placeholder" aria-label="Export placeholder">
      <p class="placeholder-kicker">Future local export</p>
      <h3>Swing summary</h3>
      <p>
        A future export may include selected metrics, feedback, or keyframes.
        Raw swing video will not be included by default.
      </p>
    </div>
    <button class="secondary-action" type="button" disabled>
      Export is not available yet
    </button>
  `;
}

function renderApp(statusMessage?: string): void {
  if (!app) {
    return;
  }

  const consentAccepted = hasSafetyConsent();
  const step = getWorkflowStep(activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Analysis can start when analysis features are implemented."
      : "First analysis is blocked until this acknowledgement is checked.");

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="/" aria-label="Swing Sync home">Swing Sync</a>
        <span class="local-badge">Local-first scaffold</span>
      </header>

      <main class="workspace">
        <section class="workflow" aria-labelledby="workflow-heading">
          <div class="workflow-intro">
            <div>
              <p class="eyebrow">New analysis</p>
              <h1 id="workflow-heading">Capture or choose your swing</h1>
            </div>
            <p>
              Preview the future local analysis flow. Raw swing video stays on your
              device. No feature will send it elsewhere without a separate,
              explicit opt-in step you initiate.
            </p>
          </div>

          <nav class="step-nav" aria-label="Analysis workflow placeholders">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button
                    class="step-button ${item.id === activeStep ? "is-active" : ""}"
                    type="button"
                    data-step="${item.id}"
                    aria-current="${item.id === activeStep ? "step" : "false"}"
                  >
                    <span class="step-number">${index + 1}</span>
                    <span>${item.shortLabel}</span>
                  </button>
                `
              )
              .join("")}
          </nav>

          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div>
                <p class="placeholder-kicker">Placeholder state</p>
                <h2 id="stage-heading">${step.label}</h2>
              </div>
              <span class="stage-status">${step.status}</span>
            </div>
            <p class="stage-description">${step.description}</p>
            ${renderWorkflowPanel(consentAccepted)}
          </section>
        </section>

        <aside class="consent-panel" aria-labelledby="consent-heading">
          <p class="eyebrow">Required before first analysis</p>
          <h2 id="consent-heading">Safety acknowledgement</h2>
          <p>
            Swing Sync is for educational use only. It is not medical advice,
            pain diagnosis, rehabilitation guidance, or professional athletic
            instruction.
          </p>
          <ul>
            <li>Golf practice and swing changes involve injury risk.</li>
            <li>Stop if you feel pain, dizziness, numbness, weakness, or unusual discomfort.</li>
            <li>Consult qualified medical or coaching professionals for personal concerns.</li>
          </ul>
          <label class="consent-check">
            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">
            Only this acknowledgement is stored locally. It is not a durable consent record.
          </p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;

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

    activeStep = "processing";
    renderApp("Processing preview opened. No analysis or video handling occurred.");
  });

  document.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStep = button.dataset.step as WorkflowStepId;
      renderApp(`${getWorkflowStep(activeStep).label} placeholder opened.`);
    });
  });

  document.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    activeStep = getNextWorkflowStep(activeStep).id;
    renderApp(`${getWorkflowStep(activeStep).label} placeholder opened.`);
  });

  document.querySelectorAll<HTMLButtonElement>("[data-placeholder-action]").forEach((button) => {
    button.addEventListener("click", () => {
      renderApp("Capture and file selection are placeholders. No video was accessed.");
    });
  });
}

renderApp();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
