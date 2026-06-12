# SS-005 Claude Focused Final Re-Review Prompt

Paste this prompt into Claude Chat after the final-audit PASS and focused
non-blocking fixes. Claude Chat has no filesystem or GitHub access; all changed
file contents are embedded below.

## Prompt

Role: You are the lead adversarial auditor performing a focused re-review of
Swing Sync SS-005 after your final-audit PASS.

Stage: Focused re-review before pull-request creation.

Return:

- PASS or FAIL;
- whether each addressed finding is correctly resolved;
- any regression or new blocker introduced by the fixes;
- whether the updated verification closes the important missing-test gap; and
- explicit permission or prohibition to prepare the pull request.

Do not re-open accepted unchanged implementation areas unless a focused fix
creates a cross-cutting regression.

## Prior Verdict

You returned PASS and permitted PR preparation. You identified eight
non-blocking findings and highlighted the missing offline-from-start positive
test as the highest-priority forward item.

## Focused Fixes

- Removed the unreachable worker-side `state === "processing"` frame-drop
  branch. The main-thread session remains the backpressure owner.
- Removed the invented `visibility ?? 0` fallback. Returned visibility is now
  required and copied unchanged.
- Made repeated session failure signals idempotent.
- Added unit coverage for worker `messageerror` and repeated
  abort/inference-error signals.
- Pinned Vite worker output format to ES.
- Added comments clarifying fixed timestamp deduplication and asynchronous
  teardown ownership.
- Added an offline-from-start positive Playwright test that blocks every
  non-local request from navigation start while exact local fixture inference
  completes.

Deferred unchanged non-blocking items:

- conditional removal of the manual MediaPipe notice if MediaPipe is removed;
- replacing the post-ready 500 ms observation with a future session-completion
  signal;
- direct browser injection of a worker-context CSP violation;
- explicit double-revoke test;
- benchmarks, sustained WASM heap characterization, and non-root Vite base.

## Verification After Fixes

- `npm run test:unit` -> 11 passed.
- `npm run test:smoke` -> 24 passed across desktop/mobile Chromium, including
  offline-from-start inference.
- `npm run build` -> passed.
- `git diff --check` -> passed.

## Complete Changed File Contents

### `src/pose-contract.ts`

~~~~typescript
export const poseThresholds = {
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5
} as const;

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseFrameResult {
  timestampMs: number;
  landmarks: PoseLandmark[][];
  worldLandmarks: PoseLandmark[][];
  thresholds: typeof poseThresholds;
}

export type PoseWorkerRequest =
  | { type: "init" }
  | { type: "frame"; bitmap: ImageBitmap; timestampMs: number }
  | { type: "teardown" };

export type PoseWorkerResponse =
  | { type: "ready" }
  | ({ type: "result" } & PoseFrameResult)
  | { type: "frame-dropped"; reason: "BUSY"; timestampMs: number }
  | { type: "init-error"; code: string }
  | { type: "inference-error"; code: string; timestampMs?: number }
  | { type: "torn-down" };

interface ReturnedLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface ReturnedPoseResult {
  landmarks: ReturnedLandmark[][];
  worldLandmarks: ReturnedLandmark[][];
}

export function isValidNextTimestamp(timestampMs: number, previousTimestampMs?: number): boolean {
  return (
    Number.isFinite(timestampMs) &&
    timestampMs >= 0 &&
    (previousTimestampMs === undefined || timestampMs > previousTimestampMs)
  );
}

function copyLandmark(landmark: ReturnedLandmark): PoseLandmark {
  return {
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
    visibility: landmark.visibility
  };
}

export function createPoseFrameResult(
  result: ReturnedPoseResult,
  timestampMs: number
): PoseFrameResult {
  return {
    timestampMs,
    landmarks: result.landmarks.map((pose) => pose.map(copyLandmark)),
    worldLandmarks: result.worldLandmarks.map((pose) => pose.map(copyLandmark)),
    thresholds: poseThresholds
  };
}
~~~~

### `src/pose-session.ts`

~~~~typescript
import type { PoseFrameResult, PoseWorkerRequest, PoseWorkerResponse } from "./pose-contract";

export type PoseSessionStatus = "idle" | "loading" | "ready" | "processing" | "error" | "closed";

export interface PoseSessionEvents {
  onStatus(status: PoseSessionStatus, code?: string): void;
  onResult(result: PoseFrameResult): void;
}

export class PoseSession {
  private worker?: Worker;
  private status: PoseSessionStatus = "idle";
  private frameInFlight = false;

  constructor(
    private readonly events: PoseSessionEvents,
    private readonly createWorker: () => Worker = () =>
      new Worker(new URL("./pose-landmarker.worker.ts", import.meta.url), { type: "module" })
  ) {}

  initialize(): void {
    if (this.status !== "idle") return;
    this.setStatus("loading");
    this.worker = this.createWorker();
    this.worker.addEventListener("message", this.handleMessage);
    this.worker.addEventListener("error", () => this.fail("WORKER_CRASH"));
    this.worker.addEventListener("messageerror", () => this.fail("WORKER_MESSAGE_ERROR"));
    this.post({ type: "init" });
  }

  submitFrame(bitmap: ImageBitmap, timestampMs: number): boolean {
    if (this.status !== "ready" || this.frameInFlight) {
      bitmap.close();
      return false;
    }
    this.frameInFlight = true;
    this.setStatus("processing");
    this.post({ type: "frame", bitmap, timestampMs }, [bitmap]);
    return true;
  }

  teardown(): void {
    if (!this.worker || this.status === "closed") {
      this.setStatus("closed");
      return;
    }
    this.post({ type: "teardown" });
  }

  abort(code: string): void {
    this.fail(code);
  }

  private readonly handleMessage = (event: MessageEvent<PoseWorkerResponse>): void => {
    const message = event.data;
    if (message.type === "ready") {
      this.setStatus("ready");
      return;
    }
    if (message.type === "result") {
      this.frameInFlight = false;
      this.events.onResult(message);
      this.setStatus("ready");
      return;
    }
    if (message.type === "frame-dropped") {
      this.frameInFlight = false;
      this.setStatus("ready");
      return;
    }
    if (message.type === "torn-down") {
      this.worker?.terminate();
      this.worker = undefined;
      this.frameInFlight = false;
      this.setStatus("closed");
      return;
    }
    this.fail(message.code);
  };

  private fail(code: string): void {
    if (this.status === "error" || this.status === "closed") return;
    this.worker?.terminate();
    this.worker = undefined;
    this.frameInFlight = false;
    this.setStatus("error", code);
  }

  private post(message: PoseWorkerRequest, transfer?: Transferable[]): void {
    this.worker?.postMessage(message, transfer ?? []);
  }

  private setStatus(status: PoseSessionStatus, code?: string): void {
    this.status = status;
    this.events.onStatus(status, code);
  }
}
~~~~

### `src/pose-landmarker.worker.ts`

~~~~typescript
/// <reference lib="webworker" />

import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import {
  createPoseFrameResult,
  isValidNextTimestamp,
  poseThresholds,
  type PoseWorkerRequest,
  type PoseWorkerResponse
} from "./pose-contract";

declare const self: DedicatedWorkerGlobalScope;

const wasmRoot = "/mediapipe/wasm";
const modelPath = "/models/pose_landmarker_full-float16-v1.task";

let landmarker: PoseLandmarker | undefined;
let state: "uninitialized" | "initializing" | "ready" | "processing" | "error" | "torn-down" =
  "uninitialized";
let previousTimestampMs: number | undefined;

function respond(message: PoseWorkerResponse): void {
  self.postMessage(message);
}

function failInitialization(): void {
  state = "error";
  respond({ type: "init-error", code: "LOCAL_MODEL_INIT_FAILED" });
}

function failInference(code: string, timestampMs?: number): void {
  state = "error";
  respond({ type: "inference-error", code, timestampMs });
}

async function initialize(): Promise<void> {
  if (state !== "uninitialized") {
    failInitialization();
    return;
  }

  state = "initializing";

  try {
    const vision = await FilesetResolver.forVisionTasks(wasmRoot, true);
    const createdLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelPath },
      runningMode: "VIDEO",
      numPoses: 1,
      outputSegmentationMasks: false,
      ...poseThresholds
    });
    if (state === "torn-down") {
      createdLandmarker.close();
      return;
    }
    landmarker = createdLandmarker;
    state = "ready";
    respond({ type: "ready" });
  } catch {
    failInitialization();
  }
}

function processFrame(bitmap: ImageBitmap, timestampMs: number): void {
  if (state !== "ready" || !landmarker) {
    bitmap.close();
    failInference("INVALID_WORKER_STATE", timestampMs);
    return;
  }

  if (!isValidNextTimestamp(timestampMs, previousTimestampMs)) {
    bitmap.close();
    failInference("INVALID_TIMESTAMP", timestampMs);
    return;
  }

  state = "processing";

  try {
    const result = landmarker.detectForVideo(bitmap, timestampMs);
    previousTimestampMs = timestampMs;
    respond({ type: "result", ...createPoseFrameResult(result, timestampMs) });
    state = "ready";
  } catch {
    failInference("LOCAL_INFERENCE_FAILED", timestampMs);
  } finally {
    bitmap.close();
  }
}

function teardown(): void {
  try {
    landmarker?.close();
  } finally {
    landmarker = undefined;
    state = "torn-down";
    respond({ type: "torn-down" });
    self.close();
  }
}

self.addEventListener("message", (event: MessageEvent<PoseWorkerRequest>) => {
  const message = event.data;

  if (message.type === "init") {
    void initialize();
    return;
  }

  if (message.type === "frame") {
    processFrame(message.bitmap, message.timestampMs);
    return;
  }

  if (message.type === "teardown") {
    teardown();
    return;
  }

  failInference("INVALID_PROTOCOL");
});

self.addEventListener("securitypolicyviolation", () => {
  failInference("UNEXPECTED_NETWORK_BLOCKED");
});
~~~~

### `src/main.ts`

~~~~typescript
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
      // Keep sampled media timestamps distinct before converting them to milliseconds.
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
  // PoseSession owns its worker through the asynchronous teardown acknowledgement.
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
~~~~

### `vite.config.ts`

~~~~typescript
import { defineConfig } from "vite";
import license from "rollup-plugin-license";

const allowedLicenses = "(MIT OR Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR ISC OR CC0-1.0 OR 0BSD)";

export default defineConfig({
  worker: {
    format: "es"
  },
  build: {
    rollupOptions: {
      plugins: [
        license({
          sourcemap: true,
          thirdParty: {
            includePrivate: true,
            multipleVersions: true,
            allow: {
              test: allowedLicenses,
              failOnUnlicensed: true,
              failOnViolation: true
            },
            output: {
              file: "dist/THIRD_PARTY_NOTICES.rollup.txt"
            }
          }
        })
      ]
    }
  }
});
~~~~

### `test/unit/pose-session.test.ts`

~~~~typescript
import { describe, expect, it, vi } from "vitest";
import { PoseSession, type PoseSessionStatus } from "../../src/pose-session";
import type { PoseWorkerRequest, PoseWorkerResponse } from "../../src/pose-contract";

class FakeWorker {
  readonly posted: PoseWorkerRequest[] = [];
  terminated = false;
  private listeners = new Map<string, ((event: MessageEvent<PoseWorkerResponse>) => void)[]>();

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    const callback = listener as (event: MessageEvent<PoseWorkerResponse>) => void;
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), callback]);
  }

  postMessage(message: PoseWorkerRequest): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(message: PoseWorkerResponse): void {
    for (const listener of this.listeners.get("message") ?? []) {
      listener({ data: message } as MessageEvent<PoseWorkerResponse>);
    }
  }

  emitEvent(type: "error" | "messageerror"): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({} as MessageEvent<PoseWorkerResponse>);
    }
  }
}

function createHarness() {
  const worker = new FakeWorker();
  const statuses: PoseSessionStatus[] = [];
  const onResult = vi.fn();
  const session = new PoseSession(
    { onStatus: (status) => statuses.push(status), onResult },
    () => worker as unknown as Worker
  );
  return { worker, statuses, onResult, session };
}

describe("pose session controller", () => {
  it("initializes, accepts one frame, returns a result, and tears down", () => {
    const { worker, statuses, onResult, session } = createHarness();
    const close = vi.fn();
    const bitmap = { close } as unknown as ImageBitmap;

    session.initialize();
    worker.emit({ type: "ready" });
    expect(session.submitFrame(bitmap, 0)).toBe(true);
    worker.emit({
      type: "result",
      timestampMs: 0,
      landmarks: [],
      worldLandmarks: [],
      thresholds: {
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      }
    });
    session.teardown();
    worker.emit({ type: "torn-down" });

    expect(worker.posted.map((message) => message.type)).toEqual(["init", "frame", "teardown"]);
    expect(statuses).toEqual(["loading", "ready", "processing", "ready", "closed"]);
    expect(onResult).toHaveBeenCalledOnce();
    expect(worker.terminated).toBe(true);
  });

  it("closes a frame instead of queueing while the worker is busy", () => {
    const { worker, session } = createHarness();
    const first = { close: vi.fn() } as unknown as ImageBitmap;
    const dropped = { close: vi.fn() } as unknown as ImageBitmap;

    session.initialize();
    worker.emit({ type: "ready" });
    expect(session.submitFrame(first, 0)).toBe(true);
    expect(session.submitFrame(dropped, 1)).toBe(false);

    expect(dropped.close).toHaveBeenCalledOnce();
    expect(worker.posted.filter((message) => message.type === "frame")).toHaveLength(1);
  });

  it("fails closed and terminates on initialization error", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    worker.emit({ type: "init-error", code: "LOCAL_MODEL_INIT_FAILED" });

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("aborts immediately when the application detects an unexpected request", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    session.abort("UNEXPECTED_NETWORK_BLOCKED");

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("fails closed on a worker messageerror", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    worker.emitEvent("messageerror");

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });

  it("keeps repeated failure signals idempotent", () => {
    const { worker, statuses, session } = createHarness();

    session.initialize();
    session.abort("UNEXPECTED_NETWORK_BLOCKED");
    worker.emit({ type: "inference-error", code: "UNEXPECTED_NETWORK_BLOCKED" });

    expect(statuses).toEqual(["loading", "error"]);
    expect(worker.terminated).toBe(true);
  });
});
~~~~

### `test/smoke/app.spec.ts`

~~~~typescript
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("opens to capture flow and keeps analysis fail closed until consent and video", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
});

test("fails closed when local consent storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("fails closed when stored consent cannot be removed", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).toBeChecked();
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });

  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
  await beginAnalysis.click();

  await expect(page.getByRole("status")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});

test("shows every required placeholder state", async ({ page }) => {
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
  }
});

test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
  const requests: string[] = [];
  const consoleMessages: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByRole("button", { name: "Stop local analysis" })).toBeEnabled();
  await expect(page.locator("[data-pose-summary]")).toContainText(
    "33 normalized landmarks retained",
    { timeout: 30_000 }
  );
  await expect(page.locator("[data-pose-summary]")).toContainText("4 video frames processed", {
    timeout: 30_000
  });

  const requestsAtReady = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtReady);
  const external = requests.filter(
    (url) => !url.startsWith("http://127.0.0.1:4174/") && !url.startsWith("blob:")
  );
  expect(external).toEqual([]);
  expect(consoleMessages.join("\n")).not.toMatch(/landmarks|worldLandmarks|media characteristics/i);

  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
});

test("completes local inference when external network is blocked from navigation start", async ({
  page
}) => {
  const blockedExternal: string[] = [];
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("http://127.0.0.1:4174/") || url.startsWith("blob:")) {
      void route.continue();
      return;
    }
    blockedExternal.push(url);
    void route.abort();
  });

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("4 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternal).toEqual([]);
});

test("reports a useful local error when model initialization fails", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => route.abort());
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  await expect(page.locator("[data-pose-summary]")).toContainText("0 video frames processed");
});

test("keeps the UI responsive while the local model loads", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("volatile resources were released");
});

test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.evaluate(() => {
    void fetch("https://example.com/blocked-by-swing-sync-csp").catch(() => undefined);
  });

  await expect(page.getByText(/Local pose analysis stopped \(UNEXPECTED_NETWORK_BLOCKED\)/)).toBeVisible();
});

test("releases the selected object URL when analysis stops", async ({ page }) => {
  await page.addInitScript(() => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
      originalRevoke(url);
    };
    Object.assign(window, { __poseObjectUrls: { created, revoked } });
  });
  await page.reload();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  const urls = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __poseObjectUrls: { created: string[]; revoked: string[] };
        }
      ).__poseObjectUrls
  );
  expect(urls.revoked).toEqual(urls.created);
});

test("fits the mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  expect(hasOverflow).toBe(false);
  await expect(page.getByRole("checkbox")).toBeVisible();
});
~~~~

End with explicit PASS or FAIL and whether Codex may prepare the pull request.
