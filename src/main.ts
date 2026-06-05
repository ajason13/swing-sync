const app = document.querySelector<HTMLDivElement>("#app");
// Minimal SS-002 scaffold state; not a durable or legally audited consent record.
const consentStorageKey = "swing-sync:safety-consent:v1";

function hasSafetyConsent(): boolean {
  return window.localStorage.getItem(consentStorageKey) === "accepted";
}

function setSafetyConsent(): void {
  window.localStorage.setItem(consentStorageKey, "accepted");
}

function renderApp(): void {
  if (!app) {
    return;
  }

  const consentAccepted = hasSafetyConsent();

  app.innerHTML = `
    <section class="app-shell">
      <header>
        <p class="eyebrow">Local-first golf swing analysis</p>
        <h1>Swing Sync</h1>
        <p>
          Swing feedback is educational only. Raw swing video stays on your
          device. No feature will send it elsewhere without a separate,
          explicit opt-in step you initiate.
        </p>
      </header>

      <section class="consent-panel" aria-labelledby="consent-heading">
        <h2 id="consent-heading">Safety and educational-use acknowledgement</h2>
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
        <button id="analysis-button" type="button" ${consentAccepted ? "" : "disabled"}>
          Begin analysis
        </button>
        <p class="status" role="status">
          ${
            consentAccepted
              ? "Consent recorded locally. Analysis can start when analysis features are implemented."
              : "First analysis is blocked until this acknowledgement is checked."
          }
        </p>
      </section>
    </section>
  `;

  const checkbox = document.querySelector<HTMLInputElement>("#safety-consent");
  const analysisButton = document.querySelector<HTMLButtonElement>("#analysis-button");

  checkbox?.addEventListener("change", () => {
    if (!checkbox.checked) {
      window.localStorage.removeItem(consentStorageKey);
      renderApp();
      return;
    }

    setSafetyConsent();
    renderApp();
  });

  analysisButton?.addEventListener("click", () => {
    if (!hasSafetyConsent()) {
      window.alert("Please acknowledge the safety terms before starting analysis.");
      return;
    }

    window.alert("Analysis engine is not implemented yet. Safety consent is recorded locally.");
  });
}

renderApp();
