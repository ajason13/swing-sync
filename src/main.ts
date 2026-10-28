import "./styles.css";
import {
  applyAccessibilityIntent as applyDomAccessibilityIntent,
  applyPostRenderAccessibility,
  capturePriorFocusKey,
  type AccessibilityIntent,
  type RenderRequest
} from "./app-accessibility";
import { AnalysisLifecycle } from "./analysis-lifecycle";
import { bindAppEvents } from "./app-events";
import { renderApp } from "./app-renderer";
import { createInitialAppState } from "./app-state";
import { createSafetyConsentStore } from "./consent-state";
import { LocalVideoPreview } from "./local-video-preview";
import { renderSelectedKeyframeCanvas } from "./keyframe-overlay-renderer";

const app = document.querySelector<HTMLDivElement>("#app");
const announcer = document.querySelector<HTMLDivElement>("#app-announcer");
const state = createInitialAppState();
const consent = createSafetyConsentStore();
const preview = new LocalVideoPreview();

function requestRender(request: RenderRequest = {}): void {
  if (!app) return;
  const priorFocusKey = capturePriorFocusKey(app);
  renderApp(app, state, consent.hasSafetyConsent(), request.visibleStatusText);
  preview.mount(app, state.activeStep === "capture" ? state.selectedVideo : undefined);
  bindAppEvents(app, {
    state,
    consent,
    lifecycle,
    requestRender,
    applyAccessibilityIntent
  });
  renderSelectedKeyframeCanvas(app, state, /^keyframe:[0-7]$/.test(request.focusKey ?? ""));
  document.title = `Swing Sync | ${state.activeStep[0].toUpperCase()}${state.activeStep.slice(1)}`;
  applyPostRenderAccessibility(
    app,
    announcer,
    state.activeStep,
    state.phaseOutputs.length > 0,
    request,
    priorFocusKey
  );
}

function applyAccessibilityIntent(intent: AccessibilityIntent): void {
  if (!app) return;
  applyDomAccessibilityIntent(app, announcer, intent);
}

const lifecycle = new AnalysisLifecycle({
  root: app ?? document,
  state,
  requestRender,
  applyAccessibilityIntent
});

requestRender();

window.addEventListener("beforeunload", () => {
  preview.close();
  void lifecycle.closeActive();
});
window.addEventListener("pagehide", () => preview.close());
window.addEventListener("pageshow", (event) => {
  if (event.persisted && app) preview.mount(app, state.activeStep === "capture" ? state.selectedVideo : undefined);
});
document.addEventListener("securitypolicyviolation", () => {
  lifecycle.abortWithNetworkBlocked();
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
