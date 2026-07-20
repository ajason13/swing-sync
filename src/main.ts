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
