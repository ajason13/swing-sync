# SS-005 Claude Final Audit Prompt

Paste this prompt into Claude Chat for the adversarial final implementation
audit. Claude Chat has no filesystem or GitHub access; use only this embedded
context.

## Prompt

Role: You are the lead adversarial implementation auditor for Swing Sync
SS-005.

Stage: Final implementation audit before pull request creation.

Return:

- PASS or FAIL;
- blocking findings ordered by severity;
- non-blocking recommendations clearly separated;
- missing tests or boundary cases;
- whether SS-005 acceptance criteria and `SS-TC-009` are satisfied;
- whether licensing/model/fixture/network/privacy evidence is adequate; and
- explicit permission or prohibition to prepare the pull request.

Attack assumptions, identify fail-open behavior, and look for privacy,
licensing, worker lifecycle, network, timestamp, resource-cleanup, CSP,
mobile/browser, and test-contract defects. Do not expand scope into swing-phase
detection, metrics, coaching, exports, or remote review.

## Story And Scope

Story: `SS-005 Integrate MediaPipe Pose Landmarker in browser video mode`

Branch: `ss-005-mediapipe-pose`

Current tracker status: `4. Final Audit (Claude)`

Acceptance criteria:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

Protected boundaries:

- Raw video and decoded frames remain volatile and local.
- Derived landmarks are sensitive user data.
- No remote model API, telemetry, remote logging, cloud storage, or remote
  sharing.
- Preserve the first-analysis safety acknowledgement and fail-closed behavior.
- Do not persist raw video, decoded frames, or landmarks.
- Service-worker model caching remains unapproved and is not implemented.

## Approved Provider, SDK, Model, And Fixture

- Exact production dependency: `@mediapipe/tasks-vision@0.10.35`.
- Exact model: Pose Landmarker Full float16 version 1.
- Model source:
  `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`
- Model SHA-256:
  `5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1`
- Model and WASM are vendored and served same-origin.
- Runtime provider model fetch is prohibited.
- Public Google evidence:
  `https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357`
- Maintainer compliance approval and third focused Claude implementation-start
  PASS were recorded before dependency/model/runtime work began.

The exact npm package lacks packaged LICENSE/NOTICE files. Implementation adds
`docs/third-party-notices/mediapipe.md`, and the production notice aggregator
includes it in `dist/THIRD_PARTY_NOTICES.txt`. It records exact SDK/model,
Apache-2.0, source URLs, provider evidence, and the maintainer decision.

`scripts/verify-pose-assets.js` fails on any model/WASM absence or hash change.
`scripts/verify-compliance.js` requires the exact manual MediaPipe notice and
exact `@mediapipe/tasks-vision@0.10.35` SBOM component.

Approved fixture:

- `test/fixtures/pose-landmarker/mannequin-golf-address.webm`
- deterministic VP9 640 x 360, 10 fps, 2 seconds, no audio;
- derived with documented FFmpeg 8.1.1 command from committed AI-generated,
  faceless wooden-mannequin source;
- no real person or known biometric/personal data;
- fixture SHA-256:
  `e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390`;
- exact-model empirical validation returned one pose with 33 normalized and 33
  world landmarks at 0, 500, 1000, and 1500 ms; and
- OpenAI Terms of Use effective 2026-01-01 and Service Terms updated
  2026-06-02 were reviewed and recorded in `PROVENANCE.md`. The project
  compliance decision is not presented as legal advice or exclusive-rights
  guarantee.

## Implementation

### Worker Protocol And Result Contract

`src/pose-contract.ts` defines:

- fixed configured detection, presence, and tracking thresholds of `0.5`;
- normalized/world landmark output with returned `x`, `y`, `z`, and
  `visibility`;
- no invented per-landmark `presence`;
- result wrapper containing the exact input `timestampMs`;
- worker requests: `init`, transferable `frame`, `teardown`; and
- responses: `ready`, `result`, `frame-dropped`, `init-error`,
  `inference-error`, `torn-down`.

It accepts only finite, non-negative, strictly monotonically increasing
timestamps and copies complete detector arrays without filtering or rounding.

`src/pose-landmarker.worker.ts`:

- loads same-origin WASM with the module loader and same-origin model path;
- creates exact Pose Landmarker in `VIDEO` mode with one pose and no
  segmentation mask;
- runs synchronous `detectForVideo()` only inside the dedicated worker;
- validates timestamps before inference;
- closes every owned `ImageBitmap` in `finally`;
- emits sanitized stable error codes without frame/landmark/media details;
- closes the task and worker on teardown;
- handles teardown during asynchronous initialization without later emitting
  ready; and
- fails closed on worker CSP violations.

`src/pose-session.ts`:

- owns worker lifecycle on the main thread;
- allows one in-flight frame;
- closes and drops newly submitted frames while busy;
- terminates and enters error on worker crash, message error, init/inference
  error, or application-detected unexpected network activity; and
- terminates after worker teardown acknowledgement.

### User Flow And Privacy

`src/main.ts`:

- keeps the existing local safety acknowledgement gate;
- requires both acknowledgement and a selected local video before analysis;
- creates one local object URL and revokes it on replacement, stop, or unload;
- samples up to four monotonically ordered media-timeline timestamps;
- uses `createImageBitmap(video)` and transfers the frame to the worker;
- retains only counts in UI state, not landmark arrays or raw frames;
- exposes a stop control while model loading/inference is active;
- clears the video source and releases resources on stop/failure;
- handles document CSP violations by visibly failing the active pose session
  closed with sanitized code `UNEXPECTED_NETWORK_BLOCKED`; and
- logs no frames, landmarks, media characteristics, or user identifiers.

`index.html` adds production CSP:

`default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self'
blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self'
blob:; style-src 'self'; object-src 'none'; base-uri 'self'`

`public/sw.js` remains registration-only and does not cache model/WASM/video.

## Tests

Unit tests:

- valid/invalid/non-monotonic timestamp validation;
- complete returned coordinates/visibility and no invented presence;
- detector result copying;
- session initialize/ready/process/result/teardown lifecycle;
- one-frame backpressure and bitmap close;
- initialization error fail-closed behavior; and
- immediate unexpected-network abort.

Production-preview Playwright tests run on desktop Chromium and Pixel 5 mobile
Chromium:

- consent and selected-video gates;
- unavailable consent-storage fail-closed paths;
- runtime consent guard;
- workflow states and mobile overflow;
- real exact-model fixture inference with 33 landmarks and four processed
  frames;
- all observed requests limited to same-origin or required local `blob:` media;
- no requests after fixture extraction reaches its ready checkpoint;
- no landmark/media-characteristic console output;
- no IndexedDB or Cache API persistence;
- useful local model-initialization failure;
- UI stop interaction succeeds while model loading is artificially delayed;
- CSP-blocked external request visibly terminates the session fail closed; and
- object URL create/revoke parity.

The Playwright suite runs against `vite build` plus `vite preview`, not the dev
server, so production CSP and static asset paths are exercised.

## Verification Results

All passed on Node 22:

- `npm run test:unit` -> 9 passed.
- `npm run test:smoke` -> 22 passed across desktop and mobile Chromium.
- `npm run build` -> passed; dedicated worker bundle emitted.
- `npm run compliance:verify` -> passed.
- `npm run safety:verify` -> passed.
- `npm run privacy:verify` -> passed.
- `npm run license:audit` -> passed.
- `npm run verify:bundle-license-fixture` -> passed.
- `npm run pose-assets:verify` -> passed.
- `npm run sbom:generate` -> passed; exactly one production component,
  `@mediapipe/tasks-vision@0.10.35`.
- `git diff --check` -> passed.
- `npm audit --omit=dev --json` -> zero production vulnerabilities.

Production `dist/THIRD_PARTY_NOTICES.txt` contains the manual MediaPipe notice,
exact SDK/model, Apache-2.0 statement, source URLs, and provider evidence.

## Known Limits And Deferred Work

- Tests demonstrate controlled observed network behavior; they do not claim
  that future or intermittent provider behavior is impossible.
- Service-worker model caching is unapproved and intentionally absent.
- A non-gating inference benchmark and sustained WASM heap characterization are
  deferred.
- The UI samples four frames; continuous video processing and swing-phase
  analysis are outside SS-005.
- Browser coverage is Chromium desktop/mobile in this story; broader browser
  compatibility remains future work unless you identify it as a blocker.
- Observability is intentionally limited to local UI state and sanitized stable
  error codes. No telemetry or sensitive diagnostics were added.

End with an explicit PASS or FAIL and whether Codex may prepare the pull
request.

## Embedded File Contents

The following are the complete current text contents of the review-relevant authored files. Claude must audit these contents directly rather than assuming the preceding summary is accurate. Binary model, WASM, PNG, and WebM contents are not embedded; their exact paths, hashes, provenance, and verification logic are embedded above and below.

### package.json

~~~~json
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  },
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  }
}
~~~~

### index.html

~~~~html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f3f5f1" />
    <meta
      name="description"
      content="A local-first golf swing analysis workflow scaffold."
    />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'"
    />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>Swing Sync | New analysis</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
~~~~

### vite.config.ts

~~~~typescript
import { defineConfig } from "vite";
import license from "rollup-plugin-license";

const allowedLicenses = "(MIT OR Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR ISC OR CC0-1.0 OR 0BSD)";

export default defineConfig({
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

### playwright.config.ts

~~~~typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/smoke",
  outputDir: "test-results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ],
  webServer: {
    command: "npm run build && node_modules/.bin/vite preview --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 60_000
  }
});
~~~~

### .gitattributes

~~~~text
public/mediapipe/wasm/*.js whitespace=-trailing-space,-blank-at-eof
~~~~

### public/sw.js

~~~~javascript
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
~~~~

### src/pose-contract.ts

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
  visibility?: number;
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
    visibility: landmark.visibility ?? 0
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

### src/pose-session.ts

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
    if (this.status !== "idle") {
      return;
    }

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

### src/pose-landmarker.worker.ts

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
  if (state === "processing") {
    bitmap.close();
    respond({ type: "frame-dropped", reason: "BUSY", timestampMs });
    return;
  }

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

### src/main.ts

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
~~~~

### src/workflow.ts

~~~~typescript
export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Capture or upload",
    status: "Ready for consent",
    description: "Choose how a future local analysis session will begin."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    status: "Local only",
    description: "Load the approved local pose model and process selected video frames."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    status: "No results",
    description: "Preview the stable layout for future swing feedback and metrics."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    status: "Unavailable",
    description: "Review how future user-initiated local exports will be explained."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
~~~~

### src/styles.css

~~~~css
:root {
  color: #17211b;
  background: #f3f5f1;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 3px solid #d7972d;
  outline-offset: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  min-height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid #d9ded7;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wordmark {
  color: #173d29;
  font-size: 1.1rem;
  font-weight: 800;
  text-decoration: none;
}

.local-badge,
.stage-status {
  border: 1px solid #cfd8d0;
  border-radius: 999px;
  padding: 5px 9px;
  color: #3d5646;
  background: #f3f7f3;
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.workspace {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 28px 20px 48px;
  display: grid;
  gap: 24px;
  align-items: start;
}

.workflow {
  min-width: 0;
  display: grid;
  gap: 20px;
}

.workflow-intro {
  display: grid;
  gap: 12px;
}

.workflow-intro p:last-child {
  max-width: 68ch;
}

.eyebrow,
.placeholder-kicker {
  margin: 0 0 7px;
  color: #566c5d;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 8vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
}

h2 {
  margin-bottom: 0;
  font-size: 1.35rem;
}

h3 {
  margin-bottom: 8px;
}

p,
li {
  color: #405047;
  line-height: 1.55;
}

.step-nav {
  padding: 2px 2px 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.step-button {
  min-height: 54px;
  border: 1px solid #d5dbd4;
  border-radius: 6px;
  padding: 8px 10px;
  color: #526157;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 750;
  text-align: left;
}

.step-button.is-active {
  border-color: #276240;
  color: #173d29;
  background: #eaf3ec;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #ffffff;
  background: #607367;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  font-size: 0.72rem;
}

.step-button.is-active .step-number {
  background: #245b3b;
}

.stage,
.consent-panel {
  border: 1px solid #d5dbd4;
  border-radius: 8px;
  background: #ffffff;
}

.stage {
  min-height: 430px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.stage-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.stage-description {
  margin: 12px 0 22px;
}

.capture-options {
  display: grid;
  gap: 12px;
}

.source-option {
  min-height: 116px;
  border: 1px dashed #9dac9f;
  border-radius: 8px;
  padding: 20px;
  color: #526157;
  background: #f8faf7;
  display: grid;
  align-content: center;
  gap: 6px;
  text-align: left;
}

.source-option:hover {
  border-color: #245b3b;
  background: #f0f6f1;
}

.source-option__title {
  color: #173d29;
  font-size: 1.05rem;
  font-weight: 800;
}

.action-row {
  margin-top: auto;
  padding-top: 24px;
  display: grid;
  gap: 10px;
}

.primary-action,
.secondary-action {
  min-height: 46px;
  border: 0;
  border-radius: 6px;
  padding: 0 18px;
  font-weight: 800;
}

.primary-action {
  color: #ffffff;
  background: #245b3b;
}

.secondary-action {
  align-self: flex-start;
  margin-top: auto;
  color: #214d33;
  background: #e7f0e9;
}

button:disabled {
  color: #778179;
  background: #e3e7dd;
  cursor: not-allowed;
}

.action-note {
  margin: 0;
  font-size: 0.83rem;
}

.processing-placeholder,
.review-placeholder,
.export-placeholder {
  min-height: 230px;
  border: 1px solid #e0e5de;
  border-radius: 8px;
  background: #f8faf7;
}

.processing-placeholder {
  padding: 28px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: center;
  gap: 18px;
}

.processing-placeholder p {
  margin: 6px 0 0;
}

.analysis-video {
  width: min(100%, 640px);
  max-height: 280px;
  margin-top: 14px;
  border-radius: 8px;
  background: #17211b;
}

.processing-mark {
  width: 40px;
  height: 40px;
  border: 4px solid #d7e2da;
  border-top-color: #39724d;
  border-radius: 50%;
  animation: rotate 1.2s linear infinite;
}

.review-placeholder {
  padding: 14px;
  display: grid;
  gap: 14px;
}

.swing-frame {
  min-height: 154px;
  border-radius: 6px;
  color: #607166;
  background:
    linear-gradient(135deg, rgb(36 91 59 / 8%), transparent),
    #e9eee9;
  display: grid;
  place-items: center;
  font-weight: 750;
}

.metric-list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-list div {
  border-left: 2px solid #b7c5ba;
  padding-left: 9px;
}

.metric-list dt {
  color: #617067;
  font-size: 0.75rem;
}

.metric-list dd {
  margin: 3px 0 0;
  color: #173d29;
  font-size: 1.15rem;
  font-weight: 800;
}

.export-placeholder {
  padding: 24px;
}

.export-placeholder p:last-child {
  max-width: 52ch;
}

.consent-panel {
  padding: 20px;
}

.consent-panel > p,
.consent-panel li {
  font-size: 0.9rem;
}

.consent-panel ul {
  margin: 16px 0;
  padding-left: 20px;
}

.consent-check {
  border-top: 1px solid #e1e5df;
  padding-top: 18px;
  display: flex;
  gap: 11px;
  align-items: flex-start;
  color: #243b2d;
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.45;
}

.consent-check input {
  width: 20px;
  height: 20px;
  margin: 1px 0 0;
  accent-color: #245b3b;
  flex: 0 0 auto;
}

.privacy-note {
  margin: 16px 0 0;
  padding: 10px;
  border-radius: 6px;
  background: #f3f5f1;
}

.status {
  margin: 12px 0 0;
  color: #294b36;
  font-weight: 700;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 720px) {
  .workspace {
    padding: 40px 28px 64px;
  }

  .workflow-intro {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
    align-items: end;
  }

  .step-nav {
    grid-template-columns: repeat(4, minmax(108px, 1fr));
  }

  .capture-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .review-placeholder {
    grid-template-columns: minmax(0, 1fr) 180px;
  }

  .metric-list {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

@media (min-width: 980px) {
  .workspace {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .consent-panel {
    position: sticky;
    top: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .processing-mark {
    animation: none;
  }
}
~~~~

### test/unit/pose-contract.test.ts

~~~~typescript
import { describe, expect, it } from "vitest";
import {
  createPoseFrameResult,
  isValidNextTimestamp,
  poseThresholds,
  type ReturnedPoseResult
} from "../../src/pose-contract";

describe("pose result contract", () => {
  it("accepts only finite non-negative monotonically increasing timestamps", () => {
    expect(isValidNextTimestamp(0)).toBe(true);
    expect(isValidNextTimestamp(500, 0)).toBe(true);
    expect(isValidNextTimestamp(0, 0)).toBe(false);
    expect(isValidNextTimestamp(-1)).toBe(false);
    expect(isValidNextTimestamp(Number.NaN)).toBe(false);
    expect(isValidNextTimestamp(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it("retains complete returned coordinates and visibility without inventing presence", () => {
    const returned: ReturnedPoseResult = {
      landmarks: [[{ x: 0.1, y: 0.2, z: -0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1.1, y: 1.2, z: -1.3, visibility: 0.9 }]]
    };

    const result = createPoseFrameResult(returned, 500);

    expect(result).toEqual({
      timestampMs: 500,
      landmarks: [[{ x: 0.1, y: 0.2, z: -0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1.1, y: 1.2, z: -1.3, visibility: 0.9 }]],
      thresholds: poseThresholds
    });
    expect(result.landmarks[0][0]).not.toHaveProperty("presence");
  });

  it("copies detector results so downstream changes cannot mutate the source", () => {
    const returned: ReturnedPoseResult = {
      landmarks: [[{ x: 0.1, y: 0.2, z: 0.3, visibility: 0.4 }]],
      worldLandmarks: [[{ x: 1, y: 2, z: 3, visibility: 0.8 }]]
    };

    const result = createPoseFrameResult(returned, 0);
    result.landmarks[0][0].x = 9;

    expect(returned.landmarks[0][0].x).toBe(0.1);
  });
});
~~~~

### test/unit/pose-session.test.ts

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
});
~~~~

### test/smoke/app.spec.ts

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

### scripts/verify-pose-assets.js

~~~~javascript
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const approved = new Map([
  [
    "public/models/pose_landmarker_full-float16-v1.task",
    "5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_internal.js",
    "e7fd9858e8e8f221d9b96eddc11f8e077f263e0b7bbd79d3cbe882b134274f8c"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_internal.wasm",
    "6a5c64584c2ab61c763b6e204afbdbc7ce1caf7f5216187322bca8df94f646bc"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_module_internal.js",
    "1f1d6215324a1fe62f6742d49a3db911170987ca18ad8c1b75f1a1c82acf2b44"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_module_internal.wasm",
    "617b8e0248dbd27e9d7ece4218004eae4cefb499196d1bb4fa0e3fef21708756"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_nosimd_internal.js",
    "438d1fe8ff7f4d946025bc211c291543c037d8a3785ed4eee60f1f521b236296"
  ],
  [
    "public/mediapipe/wasm/vision_wasm_nosimd_internal.wasm",
    "8a3092d34c79d3f57e6ba8592105e8a90f6b07c27891ffecd14cca428bfd3e31"
  ]
]);

for (const [path, expected] of approved) {
  if (!existsSync(path)) {
    throw new Error(`Approved pose asset is missing: ${path}`);
  }
  const actual = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (actual !== expected) {
    throw new Error(`Approved pose asset hash mismatch: ${path}`);
  }
}

console.log("Approved pose asset hashes verified.");
~~~~

### scripts/aggregate-notices.js

~~~~javascript
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const NOTICE_NAMES = ["NOTICE", "NOTICE.txt", "NOTICE.md"];
const targetArg = process.argv.find((arg) => arg.startsWith("--target="));
const targetRoot = resolve(targetArg ? targetArg.slice("--target=".length) : ".");
const outputPath = resolve("dist/THIRD_PARTY_NOTICES.txt");
const rollupNoticePath = resolve("dist/THIRD_PARTY_NOTICES.rollup.txt");
const viteNoticePath = resolve("dist/.vite/license.md");
const manualNoticePath = resolve("docs/third-party-notices/mediapipe.md");

function collectProductionPackagesFromFixture(root) {
  const packageRoot = join(root, "packages");
  return existsSync(packageRoot)
    ? [{ name: "@swing-sync-test/notice-fixture", path: join(packageRoot, "notice-fixture") }]
    : [];
}

function flattenNpmTree(node, packages = []) {
  if (!node?.dependencies) return packages;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.path) {
      packages.push({ name, path: dependency.path });
    }
    flattenNpmTree(dependency, packages);
  }

  return packages;
}

function collectProductionPackages(root) {
  if (targetArg) {
    return collectProductionPackagesFromFixture(root);
  }

  const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0 && !result.stdout) {
    console.error(result.stderr);
    throw new Error("Unable to resolve production dependency tree.");
  }

  const tree = JSON.parse(result.stdout);
  return flattenNpmTree(tree);
}

function readExistingNotice() {
  const parts = [];

  for (const path of [viteNoticePath, rollupNoticePath, manualNoticePath]) {
    if (existsSync(path)) {
      parts.push(readFileSync(path, "utf8").trim());
    }
  }

  if (parts.length === 0) {
    parts.push("Swing Sync third-party notices.");
  }

  return parts.filter(Boolean).join("\n\n");
}

function readNoticeFiles(packages) {
  const seen = new Set();
  const notices = [];

  for (const pkg of packages) {
    for (const noticeName of NOTICE_NAMES) {
      const noticePath = join(pkg.path, noticeName);
      if (!existsSync(noticePath) || seen.has(noticePath)) continue;
      seen.add(noticePath);
      notices.push(`Package: ${pkg.name}\nSource: ${noticePath}\n\n${readFileSync(noticePath, "utf8").trim()}`);
    }
  }

  return notices;
}

const packages = collectProductionPackages(targetRoot);
const upstreamNotices = readNoticeFiles(packages);
const content = [
  readExistingNotice(),
  upstreamNotices.length > 0 ? "Apache NOTICE Aggregation\n\n" + upstreamNotices.join("\n\n---\n\n") : ""
]
  .filter(Boolean)
  .join("\n\n");

mkdirSync(resolve("dist"), { recursive: true });
writeFileSync(outputPath, content + "\n");
console.log(`Wrote ${outputPath}`);
~~~~

### scripts/filter-sbom.js

~~~~javascript
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sbomPath = "docs/sbom.json";

function flattenProductionNames(node, names = new Set()) {
  if (!node?.dependencies) return names;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.dev === true || dependency?.extraneous === true) continue;
    names.add(name);
    flattenProductionNames(dependency, names);
  }

  return names;
}

const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (result.status !== 0 && !result.stdout) {
  console.error(result.stderr);
  throw new Error("Unable to resolve production dependency tree for SBOM filtering.");
}

const productionNames = flattenProductionNames(JSON.parse(result.stdout));
const sbom = JSON.parse(readFileSync(sbomPath, "utf8"));
sbom.components = (sbom.components ?? []).filter((component) => {
  const packageName = component.group ? `${component.group}/${component.name}` : component.name;
  return productionNames.has(packageName);
});

writeFileSync(sbomPath, JSON.stringify(sbom, null, 2) + "\n");
console.log(`Filtered ${sbomPath} to ${sbom.components.length} production component(s).`);
~~~~

### scripts/verify-compliance.js

~~~~javascript
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertNonEmpty(path) {
  if (!existsSync(path) || readFileSync(path, "utf8").trim().length === 0) {
    fail(`${path} is missing or empty.`);
  }
}

function assertSbom() {
  assertNonEmpty("docs/sbom.json");
  const sbom = JSON.parse(readFileSync("docs/sbom.json", "utf8"));

  if (sbom.bomFormat !== "CycloneDX") {
    fail("docs/sbom.json is not a CycloneDX SBOM.");
  }

  // CycloneDX currently uses 1.x single-digit minor versions; keep this check
  // strict enough for CI while avoiding a dependency on jq in local scripts.
  if (!["1.4", "1.5", "1.6"].includes(sbom.specVersion)) {
    fail(`docs/sbom.json has unsupported CycloneDX specVersion: ${sbom.specVersion}`);
  }

  if (!Array.isArray(sbom.components)) {
    fail("docs/sbom.json components field is missing or not an array.");
  }

  const names = sbom.components.map((component) => component.name).filter(Boolean);
  for (const devOnly of ["vitest", "eslint", "playwright", "@playwright/test"]) {
    if (names.includes(devOnly)) {
      fail(`docs/sbom.json includes dev-only package: ${devOnly}`);
    }
  }

  const mediaPipe = sbom.components.find(
    (component) =>
      component.group === "@mediapipe" &&
      component.name === "tasks-vision" &&
      component.version === "0.10.35"
  );
  if (!mediaPipe) {
    fail("docs/sbom.json must include exact @mediapipe/tasks-vision@0.10.35.");
  }
}

function assertNoticeFixture() {
  const result = spawnSync("node", ["scripts/aggregate-notices.js", "--target=test/fixtures/compliance-notice"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    fail("NOTICE aggregation fixture failed.");
  }

  assertNonEmpty("dist/THIRD_PARTY_NOTICES.txt");
  const notices = readFileSync("dist/THIRD_PARTY_NOTICES.txt", "utf8");
  if (!notices.includes("Apache Notice Harness Test")) {
    fail("NOTICE aggregation did not include the deterministic fixture content.");
  }
  for (const devOnly of ["playwright", "vitest"]) {
    if (notices.includes(devOnly)) {
      fail(`NOTICE aggregation leaked dev-only package text: ${devOnly}`);
    }
  }
}

function assertMediaPipeNotice() {
  const noticePath = "docs/third-party-notices/mediapipe.md";
  assertNonEmpty(noticePath);
  const notice = readFileSync(noticePath, "utf8");
  for (const phrase of [
    "@mediapipe/tasks-vision@0.10.35",
    "Pose Landmarker Full float16 version 1",
    "Apache License 2.0",
    "mediapipe/issues/6306"
  ]) {
    if (!notice.includes(phrase)) {
      fail(`${noticePath} must include: ${phrase}`);
    }
  }
}

assertSbom();
assertNoticeFixture();
assertMediaPipeNotice();
console.log("Compliance artifacts verified.");
~~~~

### scripts/verify-production-licenses.js

~~~~javascript
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const allowed = new Set(["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "CC0-1.0", "0BSD"]);
const blocked = new Set([
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "MPL-2.0"
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function flattenDependencies(node, packages = []) {
  if (!node?.dependencies) return packages;

  for (const [name, dependency] of Object.entries(node.dependencies)) {
    if (dependency?.dev === true || dependency?.extraneous === true) continue;
    packages.push({
      name,
      version: dependency.version,
      license: dependency.license,
      path: dependency.path
    });
    flattenDependencies(dependency, packages);
  }

  return packages;
}

function normalizeLicense(license) {
  if (typeof license === "string") return license.trim();
  if (license?.type) return String(license.type).trim();
  return "";
}

function isAllowedExpression(expression) {
  if (allowed.has(expression)) return true;
  if (blocked.has(expression)) return false;

  const orParts = expression.split(/\s+OR\s+/);
  if (orParts.length > 1) {
    const trimmedParts = orParts.map((part) => part.trim());
    if (trimmedParts.some((part) => blocked.has(part))) {
      return false;
    }
    return trimmedParts.every((part) => allowed.has(part));
  }

  return false;
}

function selfTestLicenseExpressions() {
  const cases = [
    ["MIT", true],
    ["MIT OR Apache-2.0", true],
    ["GPL-3.0-only", false],
    ["GPL-3.0-only OR MIT", false],
    ["MPL-2.0 OR Apache-2.0", false],
    ["Custom-License", false]
  ];

  for (const [expression, expected] of cases) {
    const actual = isAllowedExpression(expression);
    if (actual !== expected) {
      fail(`License expression self-test failed for "${expression}". Expected ${expected}, got ${actual}.`);
    }
  }
}

const result = spawnSync("npm", ["ls", "--omit=dev", "--json", "--long"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (result.status !== 0 && !result.stdout) {
  console.error(result.stderr);
  fail("Unable to resolve production dependency tree.");
}

const tree = JSON.parse(result.stdout);
const packages = flattenDependencies(tree);

selfTestLicenseExpressions();

for (const pkg of packages) {
  const license = normalizeLicense(pkg.license);
  if (!license) {
    fail(`Production dependency ${pkg.name}@${pkg.version} has missing license metadata.`);
  }
  if (!isAllowedExpression(license)) {
    fail(`Production dependency ${pkg.name}@${pkg.version} has disallowed or exception-required license: ${license}`);
  }
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (Object.keys(packageJson.dependencies ?? {}).length === 0) {
  console.log("No production dependencies declared.");
}
console.log("Production dependency licenses passed policy.");
~~~~

### scripts/verify-privacy-boundaries.js

~~~~javascript
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) {
    fail(`${path} is missing.`);
  }
  return readFileSync(path, "utf8");
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertHasTerms(text, terms, source, label) {
  const lower = text.toLowerCase();
  for (const term of terms) {
    if (!lower.includes(term.toLowerCase())) {
      fail(`${source} must include ${label}: ${term}`);
    }
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match prohibited privacy pattern: ${label}`);
  }
}

function listScannableFiles(root) {
  if (!existsSync(root)) {
    return [];
  }

  const files = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listScannableFiles(path));
      continue;
    }

    if (/\.(html|js|jsx|ts|tsx|mjs|cjs)$/.test(path)) {
      files.push(path);
    }
  }
  return files;
}

const privacyDocPath = "docs/privacy-architecture.md";
const dispositionPath = "docs/ss-003-research-disposition.md";
const appPath = "src/main.ts";
const packagePath = "package.json";
const indexPath = "index.html";
const privacyVerifierPath = "scripts/verify-privacy-boundaries.js";

const privacyDoc = readRequired(privacyDocPath);
const disposition = readRequired(dispositionPath);
const appSource = readRequired(appPath);
const packageJson = JSON.parse(readRequired(packagePath));
const packageText = JSON.stringify(packageJson, null, 2);

for (const phrase of [
  "DRAFT - pending human/privacy review",
  "not legal advice",
  "separate, explicit opt-in",
  "Derived landmarks and metrics should be treated as sensitive user data",
  "must not promise",
  "Default analytical exports must not include raw swing video",
  "Exports must not be described as anonymous",
  "Optional remote sharing is not approved yet",
  "not device-level erasure"
]) {
  assertIncludes(privacyDoc, phrase, privacyDocPath);
}

assertHasTerms(
  privacyDoc,
  ["Raw swing video", "frame pixels", "must not be uploaded"],
  privacyDocPath,
  "raw media no-upload boundary"
);

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Defer",
  "Reject For Current Scope",
  "Source Checks",
  "Claude Review Checklist"
]) {
  assertIncludes(disposition, phrase, dispositionPath);
}

// Cross-check the current SS-002 consent scaffold while SS-003 is still a
// docs-only privacy story. TODO: migrate these checks when the consent gate
// becomes a component or a dedicated privacy/consent module.
for (const phrase of [
  "explicit opt-in step you initiate",
  "Raw swing video stays on your",
  "Consent recorded locally"
]) {
  assertIncludes(appSource, phrase, appPath);
}

const prohibitedClaims = [
  ["absolute privacy guarantee", /\b(guarantee[sd]?|ensure[sd]?)\s+(absolute|complete|total)\s+privacy\b/i],
  ["guaranteed local-only transit", /\bguarantee[sd]?\s+that\s+data\s+never\s+leaves\b/i],
  ["anonymous export claim", /\b(exports?|downloads?|swing cards?)\s+(are|is)\s+anonymous\b/i],
  ["forensic deletion guarantee", /\bguarantee[sd]?\s+.*\b(forensic|physical|permanent)\s+erasure\b/i],
  ["zero retention provider claim", /\bzero[- ]data[- ]retention\b/i],
  ["training-use provider guarantee", /\b(prohibited|forbidden)\s+from\s+.*\b(model\s+training|training)\b/i],
  ["secure storage absolute", /\b(secure|encrypted)\s+browser\s+storage\b/i]
];

for (const [label, pattern] of prohibitedClaims) {
  assertNotMatches(privacyDoc, pattern, privacyDocPath, label);
}

const prohibitedEndpointPatterns = [
  ["Google Analytics", /google-analytics\.com|googletagmanager\.com|gtag\(/i],
  ["DoubleClick", /doubleclick\.net/i],
  ["Amplitude", /amplitude\.com|amplitude-js|@amplitude\//i],
  ["Mixpanel", /mixpanel\.com|mixpanel-browser/i],
  ["Hotjar", /hotjar\.com|hotjar/i],
  ["Segment", /segment\.io|analytics-node|@segment\//i],
  // Blocked pending privacy review; not a permanent categorical ban.
  ["Sentry", /sentry\.io|@sentry\//i],
  ["FullStory", /fullstory\.com|@fullstory\//i]
];

const sourceFiles = [
  indexPath,
  ...listScannableFiles("src"),
  ...listScannableFiles("scripts").filter((path) => path !== privacyVerifierPath)
];

for (const [label, pattern] of prohibitedEndpointPatterns) {
  for (const sourcePath of sourceFiles) {
    assertNotMatches(readRequired(sourcePath), pattern, sourcePath, label);
  }
  assertNotMatches(packageText, pattern, packagePath, label);
}

console.log("Privacy architecture and boundary constraints verified.");
~~~~

### scripts/verify-safety-terms.js

~~~~javascript
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function assertIncludes(text, phrase, source) {
  if (!text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must include: ${phrase}`);
  }
}

function assertNotIncludes(text, phrase, source) {
  if (text.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`${source} must not include unsafe phrasing: ${phrase}`);
  }
}

function assertNotMatches(text, pattern, source, label) {
  if (pattern.test(text)) {
    fail(`${source} must not match unsafe pattern: ${label}`);
  }
}

const safetyTermsPath = "docs/safety-terms.md";
const researchDispositionPath = "docs/ss-002-research-disposition.md";
const appPath = "src/main.ts";
const safetyTerms = readFileSync(safetyTermsPath, "utf8");
const researchDisposition = readFileSync(researchDispositionPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const combined = `${safetyTerms}\n${researchDisposition}\n${appSource}`;

for (const phrase of [
  "not legal advice",
  "educational",
  "not medical advice",
  "professional athletic instruction",
  "raw swing video must remain on the user's device by default",
  "consent gate",
  "assumption of risk",
  "release of liability",
  "prohibit diagnosing pain",
  "prohibit medical triage",
  "rehabilitation",
  "aggressive mechanical prescriptions",
  "defense-in-depth"
]) {
  assertIncludes(safetyTerms, phrase, safetyTermsPath);
}

for (const phrase of [
  "Adopt",
  "Revise Before Adoption",
  "Reject For Current Draft",
  "Claude QA Handoff Checklist",
  "not legal advice",
  "approved implementation mandate"
]) {
  assertIncludes(researchDisposition, phrase, researchDispositionPath);
}

for (const phrase of [
  "localStorage",
  "swing-sync:safety-consent:v1",
  "not a durable or legally audited consent record",
  "explicit opt-in step you initiate",
  "physical risk I accept responsibility for",
  "Begin analysis",
  "stop if you feel pain",
  "qualified medical or coaching professionals",
  "Please acknowledge the safety terms before starting analysis"
]) {
  assertIncludes(appSource, phrase, appPath);
}

for (const phrase of [
  "train through pain",
  "ignore pain",
  "diagnose your pain",
  "can diagnose",
  "provides medical advice",
  "guaranteed to prevent injury",
  "guaranteed improvement",
  "absolute ownership",
  "100% block rate",
  "rehab drill",
  "rotator cuff",
  "physical therapy exercises",
  "medical clearance",
  "medically cleared",
  "stretch to fix"
]) {
  assertNotIncludes(combined, phrase, "SS-002 safety content");
}

for (const [label, pattern] of [
  ["positive medical advice claim", /\b(provides?|offers?|gives?)\s+(medical|clinical)\s+advice\b/i],
  ["diagnosis capability claim", /\b(can|will|does)\s+diagnos(e|is)\b/i],
  ["injury prevention guarantee", /\bguarantee[sd]?\s+(to\s+)?(prevent|avoid)\s+injur/i],
  ["performance guarantee", /\bguarantee[sd]?\s+(performance|improvement|results?)\b/i],
  ["rehabilitation instruction", /\b(prescribes?|recommends?|gives?)\s+.*\b(rehab|rehabilitation|therapy)\b/i],
  ["unsafe pain compensation", /\b(swing|train|practice|move)\s+.*\b(through|despite|around)\s+pain\b/i]
]) {
  assertNotMatches(combined, pattern, "SS-002 safety content", label);
}

console.log("Safety terms and consent-gate constraints verified.");
~~~~

### docs/third-party-notices/mediapipe.md

~~~~markdown
# MediaPipe Tasks Vision And Pose Landmarker Notice

Swing Sync includes:

- `@mediapipe/tasks-vision@0.10.35`, including its packaged WebAssembly
  runtime; and
- Pose Landmarker Full float16 version 1.

Copyright Google LLC.

License: Apache License 2.0. A copy is provided in the repository `LICENSE`
file.

SDK source and package:

- `https://www.npmjs.com/package/@mediapipe/tasks-vision/v/0.10.35`
- `https://github.com/google-ai-edge/mediapipe`

Model source:

- `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`

Provider rights and current-Web-SDK behavior evidence:

- `https://github.com/google-ai-edge/mediapipe/issues/6306`
- `https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357`

The exact npm package did not contain packaged LICENSE or NOTICE files. Swing
Sync's maintainer approved reliance on Google's public Apache-2.0 statement for
the exact SDK, packaged compiled artifacts, and exact model on 2026-06-11.
~~~~

### docs/model-assets/pose-landmarker-full-float16-v1.md

~~~~markdown
# Pose Landmarker Full Float16 Version 1

Approved for SS-005 on 2026-06-11.

- File: `public/models/pose_landmarker_full-float16-v1.task`
- Source:
  `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`
- SHA-256:
  `5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1`
- License: Apache-2.0
- Provider evidence:
  `https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357`
- Delivery: vendored and served same-origin; runtime provider fetch is not
  approved.
- Caching: service-worker model caching is not approved in SS-005.

Every replacement or upgrade requires a fresh model-rights, provider-metrics,
privacy, network, integrity, and fixture-validation review.
~~~~

### test/fixtures/pose-landmarker/PROVENANCE.md

~~~~markdown
# SS-005 Pose Landmarker Fixture Provenance

## Approval

This fixture was approved for SS-005 pre-implementation QA planning on
2026-06-11 after empirical validation against exact
`@mediapipe/tasks-vision@0.10.35` and the exact Pose Landmarker Full float16
version 1 model.

The fixture is limited to deterministic pose-extraction integration tests. It
is not evidence of golf-swing accuracy, phase detection, biomechanical
correctness, or performance across devices.

## Non-Identifying Source

`mannequin-source.png` is an AI-generated image of a clearly synthetic,
faceless wooden artist mannequin. It contains no recording of a real person,
no real-person face, and no known biometric or personal data.

Generator: OpenAI image generation through the Codex `imagegen` tool on
2026-06-11.

Prompt:

> Create a clean testing fixture image, 16:9 landscape, full-body clearly
> synthetic faceless wooden artist mannequin in a golf address stance, viewed
> mostly from the side with slight three-quarter angle so both arms and legs
> are visible, holding a simple non-branded golf club. Entire body including
> head, hands, and feet fully inside frame with generous margins. Neutral light
> gray studio background, high contrast, even lighting, no text, no logos, no
> real person, no facial features, no photorealistic skin, no extra objects.

No seed was exposed by the generation tool. The committed source PNG is the
fixed deterministic input for reproducing the WebM fixture.

OpenAI's Terms of Use effective 2026-01-01 were reviewed on 2026-06-11:
`https://openai.com/policies/terms-of-use/`. They state that, as between the
user and OpenAI and to the extent permitted by applicable law, the user owns
Output and OpenAI assigns its rights in Output to the user. They also make the
user responsible for Content and warn that Output may not be unique. The
Service Terms updated 2026-06-02 were also reviewed:
`https://openai.com/policies/service-terms/`. The fixture depicts no person and
does not use third-party source material supplied as input. The maintainer
approved distributing this committed source and derived fixture under the
project's Apache-2.0 license. This record is a project compliance decision, not
legal advice or a guarantee of exclusive rights.

## Deterministic Video Derivation

Tool: FFmpeg 8.1.1 with `libvpx-vp9`.

Command, run from the repository root:

```bash
ffmpeg -y -loop 1 \
  -i test/fixtures/pose-landmarker/mannequin-source.png \
  -vf "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=white,format=yuv420p" \
  -r 10 -t 2 -an -c:v libvpx-vp9 -deadline best -cpu-used 0 -row-mt 0 \
  -threads 1 -tile-columns 0 -frame-parallel 0 -auto-alt-ref 0 \
  -lag-in-frames 0 -g 20 \
  test/fixtures/pose-landmarker/mannequin-golf-address.webm
```

Output properties:

- codec: VP9;
- dimensions: 640 x 360;
- frame rate: 10 fps;
- duration: 2 seconds;
- audio: none; and
- file size at approval: 8,697 bytes.

## Integrity

```text
b5d2a9d4eef284997d49826e1b177ecfa6cce7b439ae0973b307d65bf3e7c605  mannequin-source.png
e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390  mannequin-golf-address.webm
```

## Empirical Validation

Validation used a disposable browser harness outside the repository. The
harness loaded exact `@mediapipe/tasks-vision@0.10.35`, same-origin package
WASM, and the exact model URL approved in MediaPipe issue #6306:

`https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`

Downloaded model SHA-256 during validation:

```text
5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1
```

The harness configured `runningMode: "VIDEO"` and called `detectForVideo()` on
the WebM at monotonically increasing timestamps.

| Timestamp | Normalized landmarks | World landmarks | Observed normalized visibility range |
| --- | ---: | ---: | --- |
| 0 ms | 33 | 33 | 0.5057702661 to 0.9999644756 |
| 500 ms | 33 | 33 | 0.4956441224 to 0.9999638796 |
| 1000 ms | 33 | 33 | 0.4965527654 to 0.9999650121 |
| 1500 ms | 33 | 33 | 0.4880312681 to 0.9999654889 |

Expected structural test behavior:

- one detected pose at the four approved sample timestamps;
- exactly 33 normalized and 33 world landmarks for that pose;
- numeric returned `x`, `y`, `z`, and `visibility` fields retained without
  filtering or invented `presence`; and
- no assertion of fixed coordinate or minimum visibility values.

Observed validation requests were same-origin local harness, package/WASM,
model, and fixture requests. This gate did not attempt to prove the full
post-ready/offline network acceptance criterion; those tests remain required
during implementation.
~~~~

### docs/sbom.json

~~~~json
{
  "$schema": "http://cyclonedx.org/schema/bom-1.6.schema.json",
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "version": 1,
  "serialNumber": "urn:uuid:2a8d22b7-80e2-4a06-a59a-361dcd44b093",
  "metadata": {
    "timestamp": "2026-06-11T19:58:13.489Z",
    "tools": {
      "components": [
        {
          "type": "application",
          "name": "npm",
          "version": "10.9.8"
        },
        {
          "type": "application",
          "name": "cyclonedx-npm",
          "group": "@cyclonedx",
          "version": "4.2.1",
          "author": "Jan Kowalleck",
          "description": "Create CycloneDX Software Bill of Materials (SBOM) from NPM projects.",
          "licenses": [
            {
              "license": {
                "id": "Apache-2.0"
              }
            }
          ],
          "externalReferences": [
            {
              "url": "git+https://github.com/CycloneDX/cyclonedx-node-npm.git",
              "type": "vcs",
              "comment": "as detected from PackageJson property \"repository.url\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-node-npm#readme",
              "type": "website",
              "comment": "as detected from PackageJson property \"homepage\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-node-npm/issues",
              "type": "issue-tracker",
              "comment": "as detected from PackageJson property \"bugs.url\""
            }
          ]
        },
        {
          "type": "library",
          "name": "cyclonedx-library",
          "group": "@cyclonedx",
          "version": "10.1.0",
          "author": "Jan Kowalleck",
          "description": "Core functionality of CycloneDX for JavaScript (Node.js or WebBrowser).",
          "licenses": [
            {
              "license": {
                "id": "Apache-2.0"
              }
            }
          ],
          "externalReferences": [
            {
              "url": "git+https://github.com/CycloneDX/cyclonedx-javascript-library.git",
              "type": "vcs",
              "comment": "as detected from PackageJson property \"repository.url\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-javascript-library#readme",
              "type": "website",
              "comment": "as detected from PackageJson property \"homepage\""
            },
            {
              "url": "https://github.com/CycloneDX/cyclonedx-javascript-library/issues",
              "type": "issue-tracker",
              "comment": "as detected from PackageJson property \"bugs.url\""
            }
          ]
        }
      ]
    },
    "component": {
      "type": "application",
      "name": "swing-sync",
      "version": "0.1.0",
      "bom-ref": "swing-sync@0.1.0",
      "description": "Local-first open-source AI golf swing analysis coach.",
      "licenses": [
        {
          "license": {
            "id": "Apache-2.0",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/swing-sync@0.1.0",
      "properties": [
        {
          "name": "cdx:npm:package:private",
          "value": "true"
        },
        {
          "name": "cdx:npm:package:path",
          "value": ""
        }
      ]
    }
  },
  "components": [
    {
      "type": "library",
      "name": "tasks-vision",
      "group": "@mediapipe",
      "version": "0.10.35",
      "bom-ref": "swing-sync@0.1.0|@mediapipe/tasks-vision@0.10.35",
      "author": "mediapipe@google.com",
      "description": "MediaPipe Vision Tasks",
      "licenses": [
        {
          "license": {
            "id": "Apache-2.0",
            "acknowledgement": "declared"
          }
        }
      ],
      "purl": "pkg:npm/%40mediapipe/tasks-vision@0.10.35",
      "externalReferences": [
        {
          "url": "http://mediapipe.dev",
          "type": "website",
          "comment": "as detected from PackageJson property \"homepage\""
        },
        {
          "url": "https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.35.tgz",
          "type": "distribution",
          "hashes": [
            {
              "alg": "SHA-512",
              "content": "1cebda77055113a242fb8e67c988669f2c27af987f27c299bce794355386f6aff4f3be6966022dce7141f5b453bcb736eb861226a899d4db08a424ad270fde82"
            }
          ],
          "comment": "as detected from npm-ls property \"resolved\" and property \"integrity\""
        }
      ],
      "properties": [
        {
          "name": "cdx:npm:package:path",
          "value": "node_modules/@mediapipe/tasks-vision"
        }
      ]
    }
  ],
  "dependencies": [
    {
      "ref": "swing-sync@0.1.0",
      "dependsOn": [
        "swing-sync@0.1.0|@mediapipe/tasks-vision@0.10.35"
      ]
    },
    {
      "ref": "swing-sync@0.1.0|@mediapipe/tasks-vision@0.10.35"
    }
  ]
}
~~~~

### docs/licensing.md

~~~~markdown
# Swing Sync Licensing and Dependency Policy

Swing Sync uses Apache-2.0 for project source code. This document records the
engineering compliance policy for dependencies, reference repositories, SBOMs,
and notices. It is not legal advice.

## Human License Decision

Apache-2.0 is the approved project license for SS-001 implementation. The
decision was made by the project maintainer, Jason Alvarez, after Claude QA gave
SS-001 a PASS on 2026-06-04.

## License Sets

Allowed in production bundles:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- CC0-1.0
- 0BSD

Blocked in production bundles:

- GPL-2.0-only / GPL-2.0-or-later
- GPL-3.0-only / GPL-3.0-or-later
- AGPL-3.0-only / AGPL-3.0-or-later
- LGPL-2.1-only / LGPL-2.1-or-later
- LGPL-3.0-only / LGPL-3.0-or-later
- unlicensed packages
- unknown, custom, or non-SPDX license identifiers
- proprietary packages without written permission or contract

Exception-required:

- MPL-2.0
- dual-license expressions that cannot be parsed cleanly by automation
- model weights, model assets, or SDKs with terms separate from source licenses

## MPL-2.0 Rule

MPL-2.0 is blocked from production bundles by default. An exception may be
approved only when `docs/licensing.md` records all of the following:

- package name and version;
- why the package is needed;
- evidence that the package is architecturally isolated or otherwise compliant;
- whether the package includes a secondary-license incompatibility notice;
- maintainer approval and approval date; and
- the exact CI allowlist/config exception.

No MPL-2.0 exceptions are currently approved.

## Synthetic Fixture Note

The synthetic packages in `test/fixtures/` intentionally omit `private: true`
because `@onebeyond/license-checker` reports private packages as `UNLICENSED`
instead of reading their SPDX `license` field. They are scoped under
`@swing-sync-test/`, are not referenced by publishing automation, and exist only
to validate compliance gates.

## Dual-License Rule

When a dependency is dual-licensed with only permissive options, such as
`MIT OR Apache-2.0`, Swing Sync may use the dependency without a special
exception if every branch is in the allowed set.

When a dual-license expression contains any blocked or exception-required
identifier, such as `GPL-3.0-only OR MIT` or `MPL-2.0 OR Apache-2.0`, automation
must fail the dependency until a maintainer records a documented exception here.
Swing Sync does not silently elect a permissive branch when the same expression
also contains GPL, AGPL, LGPL, MPL-2.0, unknown, custom, or non-SPDX terms.

## Dev-Only Tool Boundary

Dev-only copyleft tools may be considered only if they are not bundled, served,
linked into the application, required at runtime, or used to generate source,
code, model assets, or other files incorporated into the production output.

AGPL dependencies are blocked entirely until a maintainer explicitly approves a
documented exception.

## Reference Repository Reuse

Clean-room reimplementation is the default for reference repositories.

For unlicensed or copyleft references:

- do not copy, fork, port, or adapt code;
- do not copy model weights or datasets without explicit permission;
- high-level concepts may be summarized in a non-code functional specification;
- implementation must be written independently from that specification.

For MIT, Apache-2.0, BSD, ISC, CC0-1.0, or 0BSD references:

- clean-room reimplementation is preferred;
- derivative reuse requires explicit maintainer review in the pull request;
- the PR must identify source URL, file path, and license;
- original copyright/license notices must be preserved when required; and
- `THIRD_PARTY_NOTICES.md` must be updated.

## Reference Catalog

| Repository | License Status | Policy |
| --- | --- | --- |
| `HeleenaRobert/golf-swing-analysis` | MIT at time of SS-001 research | Clean-room preferred; derivative reuse requires notice preservation. |
| `damilab/CaddieSet` | MIT at time of SS-001 research | Cite paper/dataset; runtime code reuse requires notice preservation. |
| `tlouth19/analyze.golf` | No visible license during SS-001 research | Clean-room only; do not copy or adapt code. |
| `ryanboscobanze/GolfPosePro` | MIT at time of SS-001 research | Clean-room preferred; verify notebook/media provenance before reuse. |
| `MingHanLee/GolfPose` | No visible license during SS-001 research | Clean-room only; do not copy code or model weights. |

## SBOM Policy

`docs/sbom.json` is the CycloneDX dependency inventory generated from the npm
dependency graph. It is not proof that the built browser bundle is license-clean.
Bundle compliance is checked separately through a Vite/Rollup license gate that
must be validated against a synthetic prohibited package fixture installed as a
local dev package.

The current scaffold has no production runtime dependencies, so
`docs/sbom.json` may contain an empty `components` array after
`scripts/filter-sbom.js` removes dev-only and extraneous packages from the
CycloneDX generator output. Once runtime dependencies are added, production
components must appear in the SBOM and dev-only packages must remain absent.

The SBOM is stored in `docs/` and may also be attached to GitHub releases. It is
not served from `public/` by default.

## Apache NOTICE Obligations

Apache-2.0 dependencies may include upstream `NOTICE` files that must be
preserved. `scripts/aggregate-notices.js` must source NOTICE files from the
production-resolved dependency graph only, using one of:

- `npm ls --omit=dev --json`;
- `docs/sbom.json`; or
- a lockfile-derived production dependency graph.

The script must not crawl all of `node_modules` indiscriminately.

## Model and SDK Policy

See `docs/models-licensing.md`. No model binaries or model weights may be
committed, vendored, served, or fetched until per-model rights are documented.

Optional model API SDKs require two independent approvals:

- the SDK source license must satisfy this policy; and
- provider service terms must permit Swing Sync's intended local-first,
  opt-in data sharing behavior.

For SS-005, exact `@mediapipe/tasks-vision@0.10.35` is an approved pinned
production dependency. Google has stated that current Web SDKs are Apache-2.0
and that the current Web SDK does not include telemetry.
The inspected exact package contains compiled WASM and does not package LICENSE
or NOTICE files. On 2026-06-11, the maintainer approved reliance on Google's
SDK-wide license statement for packaged compiled artifacts and the plan to
distribute Apache-2.0 license text plus third-party attribution.
Any later SDK version requires a fresh license, privacy, provider-metrics, and
network review. See `docs/ss-005-google-provider-response.md`.

## Trademark Timing

The name "Swing Sync" requires a preliminary trademark search before the
repository is made broadly public or promoted.
~~~~

### docs/models-licensing.md

~~~~markdown
# Model Licensing Policy

Swing Sync has approved one exact model and delivery decision for SS-005.

## Current Rule

Do not commit, vendor, serve, cache, or fetch model assets such as `.tflite`,
`.onnx`, WASM weights, or comparable model files until the project documents:

- model name and version;
- source URL;
- model card or license terms;
- redistribution and caching rights;
- commercial-use restrictions, if any;
- required citations or attribution; and
- privacy impact for any remote fetch or API call.

## SS-005 Approved MediaPipe Assets

The following exact assets were reviewed, approved, and added for SS-005:

- SDK candidate: exact `@mediapipe/tasks-vision@0.10.35`.
- Model candidate: Pose Landmarker Full, float16, version 1,
  `pose_landmarker_full.task`.

On 2026-06-10, the maintainer provided a response attributed to Google stating:

- the current Web SDK does not include telemetry;
- future aggregated performance/usage telemetry is planned, without a planned
  opt-out, although outbound requests may be blocked;
- the exact Pose Landmarker Full float16 version 1 URL is Apache-2.0; and
- current Web SDKs are Apache-2.0, with future npm packages expected to include
  NOTICE and LICENSE files.

The maintainer approved reliance on the Apache-2.0 model statement in public
MediaPipe issue #6306 on 2026-06-11. It supports commercial use,
redistribution, same-origin serving, and caching of the exact model. The
preferred SS-005 delivery is vendoring and same-origin serving of the exact
asset with a pinned SHA-256, source URL, license text, and attribution. Runtime
provider fetch is not approved. Service-worker caching remains separately
reviewed.

Claude returned implementation-start PASS on 2026-06-11. The exact dependency,
packaged WASM runtime, and exact model are vendored and served same-origin.
`scripts/verify-pose-assets.js` enforces their approved SHA-256 values.
`docs/model-assets/pose-landmarker-full-float16-v1.md` records the exact model
source and decision. Service-worker model caching remains unapproved and is not
implemented. Do not claim tests prove all future SDK versions lack telemetry.

See `docs/ss-005-google-provider-response.md` and
`docs/ss-005-research-disposition.md` for the complete decision record.

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
~~~~

### docs/privacy-architecture.md

~~~~markdown
# Privacy Architecture and Video Data Lifecycle

**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for future
video analysis work. It is product and engineering guidance, not legal advice
or a guarantee of privacy, security, deletion, or regulatory compliance.

## Default Privacy Posture

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.

## Data Classes

| Class | Data | Default storage | Default network policy |
| --- | --- | --- | --- |
| A | Raw swing video files | Future local browser storage or in-memory session state | Blocked by default |
| B | Derived frames or image pixels | Volatile in-memory processing state | Blocked by default |
| C | Pose landmarks and body keypoints | Future structured local storage | Explicit opt-in required |
| D | Computed metrics, angles, tempo, and phase labels | Future structured local storage | Explicit opt-in required |
| E | Swing Card exports and selected report files | User-initiated browser download | User controls downloaded file |
| F | Prompts, model inputs, and model outputs | Future local storage only if needed | Explicit opt-in required |
| G | Safety, educational-use, and privacy acknowledgement state | Minimal local browser scaffold state | Local only by default; not a reviewed durable privacy record |

Derived landmarks and metrics should be treated as sensitive user data. Even
without a face or background video, movement patterns, timing, body proportions,
and swing mechanics may be personal or identifying when combined with other
data.

## Local-First Processing Flow

Future video analysis should follow this default sequence:

1. The user selects or captures a swing video.
2. The app previews the video locally.
3. Frame extraction runs in browser execution context without default network
   upload.
4. Pose extraction runs locally only after model and asset rights are approved.
5. Volatile frame data is released after processing.
6. Derived landmarks and metrics are stored locally only if the feature needs a
   history or review state.
7. Reports or Swing Cards are generated locally and downloaded only after a
   user-initiated export action.
8. Optional remote model or coach review remains disabled unless the user makes
   a separate explicit opt-in decision.

Runtime implementation must fail closed. If remote sharing has not been
explicitly enabled for the specific data class and destination, the app should
block the action instead of silently sending data.

## Video Lifecycle

Future video lifecycle behavior should be documented and implemented before any
raw swing video storage ships:

- **Selection:** The app should hold only the file reference needed for the
  active local session.
- **Preview:** Any object URLs should be revoked when no longer needed.
- **Processing:** Frame buffers should remain volatile and should not be
  persisted unless a future reviewed feature requires it.
- **Analysis:** Landmarks and metrics may be persisted locally only when needed
  for review, history, or export.
- **Refresh or close:** Unsaved raw video and volatile frames should be treated
  as session state unless the user has chosen a feature that stores them.
- **Deletion:** A clear-local-data action should remove Swing Sync's app-level
  references and local browser storage for the current origin.
- **Uninstall or browser data clearing:** The browser or operating system may
  remove site data according to platform behavior and user settings.

Browser storage behavior varies by engine, device, available space, private
browsing mode, user settings, installed-PWA state, and whether storage is
best-effort or persistent. Swing Sync must not promise that local browser data
is permanent, encrypted, immune to browser eviction, or physically erased from
device storage after deletion.

## Export Policy

Manual exports should be user-initiated and data-minimized.

Default analytical exports may include:

- swing metrics;
- pose landmarks or keypoint-derived measurements;
- selected warnings or limitations;
- educational feedback text; and
- selected keyframes only if the user explicitly chooses an image export.

Default analytical exports must not include raw swing video. If a future raw
video export exists, it should be a separate explicit choice with clear copy
that the downloaded file is outside Swing Sync's local browser controls.

Exports must not be described as anonymous. Landmarks, metrics, images, and
feedback may still be sensitive or identifying.

## Optional Remote Model or Coach Sharing

Optional remote sharing is not approved yet. Before any remote model, hosted
model API, cloud storage, or coach-review feature is implemented, Swing Sync
must document:

- provider name and service terms;
- SDK source license;
- model or model-asset rights, if applicable;
- data classes transmitted;
- retention and training-use terms;
- whether human review may occur;
- destination origins;
- user opt-in and revocation UX; and
- privacy impact for raw video, frames, landmarks, metrics, prompts, and
  generated outputs.

Raw swing video and frame pixels remain blocked by default. Derived landmarks,
metrics, prompts, and reports require explicit opt-in before remote sharing.

## User-Facing Copy Drafts

First analysis privacy copy:

> Swing Sync processes swing feedback locally by default. Raw swing video stays
> on this device unless you separately choose a feature that sends it elsewhere.
> Derived landmarks, metrics, reports, or prompts may still be sensitive. Swing
> Sync is educational only and is not medical advice, diagnosis, rehabilitation,
> or professional athletic instruction.

Export copy:

> This export is generated in your browser and saved to your device. It may
> include sensitive swing metrics, landmarks, feedback, or selected images. You
> control what happens to the downloaded file after it leaves Swing Sync.

Optional remote sharing copy:

> Remote review is optional and off by default. If you enable it, Swing Sync
> will show what data is sent, where it is sent, and what provider terms apply
> before anything leaves your device.

Clear-local-data copy:

> Clearing local data removes Swing Sync's app data for this browser origin,
> including local acknowledgement state and future stored swing analysis data.
> Browser or device storage systems may retain lower-level remnants outside the
> app's control, so this is not device-level erasure.

## Future Implementation Gates

Before shipping video processing or remote analysis, add tests or verification
for:

- raw video upload blocked by default;
- frame pixels blocked from network transit;
- explicit opt-in before sharing landmarks, metrics, prompts, or reports;
- clear-local-data behavior for every storage API in use;
- private-browsing and storage-eviction copy;
- export contents and warnings;
- model SDK telemetry and destination origins; and
- CSP, service worker, and runtime network guard behavior if those controls are
  implemented.

## SS-005 MediaPipe Provider-Metrics Gate

On 2026-06-10, the maintainer provided a response attributed to Google stating
that the current Web SDK does not include telemetry, does not send input data,
and may add aggregated performance and usage telemetry in the future without a
planned opt-out. Google also stated that future outbound requests may be blocked
while continuing to use the SDK normally.

The maintainer approved exact `@mediapipe/tasks-vision@0.10.35` on 2026-06-11
as having no current provider-metrics consent requirement. This does not
approve future versions. Any SDK upgrade requires fresh privacy, terms, and
observed-network review.

SS-005 implements:

- the exact approved SDK version and public provider response in MediaPipe
  issue #6306;
- observed and attempted network requests during initialization and inference;
- whether the SDK remains functional when all external requests are blocked;
- fail-closed behavior for any unexpected external request; and
- a fresh consent/product decision before adopting any future version that
  includes provider telemetry;
- a dedicated worker for local model initialization and inference;
- volatile transferable `ImageBitmap` frames closed after inference;
- no raw-video, frame, or landmark persistence;
- same-origin WASM/model delivery without service-worker model caching;
- CSP blocking of unexpected external connections; and
- visible sanitized local error codes when initialization, inference, worker,
  or unexpected-network failures stop a session.

Observability is intentionally limited to local UI state and sanitized stable
error codes. Raw frames, landmarks, media characteristics, and user identifiers
must not be written to console output, logs, storage, or remote systems.
~~~~

### docs/safety-terms.md

~~~~markdown
# Safety Terms and Educational Use Draft

**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

## Intended Use

Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Raw swing video must remain on the user's device by default. Any future remote
model, cloud storage, or coach-review feature must require a separate opt-in
flow before raw swing video leaves the device.

## Assumption of Risk Draft

Golf practice, swing changes, exercise, and physical movement involve risk.
Those risks may include soreness, strain, falls, impact injuries, equipment
injuries, aggravation of an existing condition, or other injury. Users should
practice in a safe location, warm up appropriately, stop if they feel pain,
dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
professional before changing activity if they have health, mobility, or injury
concerns.

By using Swing Sync for analysis, the user acknowledges that golf practice and
movement changes are voluntary activities and that they are responsible for
deciding whether to participate, how intensely to practice, and whether to seek
professional medical, fitness, or coaching guidance.

## Release of Liability Draft

To the maximum extent permitted by applicable law, the user agrees that Swing
Sync, its maintainers, contributors, and distributors are not responsible for
injury, loss, or damage arising from the user's practice, swing changes,
equipment use, training decisions, or reliance on educational feedback provided
by the app.

This draft release should not be read as waiving rights that cannot legally be
waived. It is intended as review-ready product language and must be evaluated
for the jurisdictions and release context where Swing Sync is offered.

## Educational Feedback Boundary

User-facing copy and AI coaching output must:

- describe feedback as educational information only;
- avoid presenting feedback as medical advice, pain diagnosis, rehabilitation,
  physical therapy, or professional athletic instruction;
- avoid guarantees of injury prevention, performance improvement, or swing
  correctness;
- encourage users to stop activity if pain or concerning symptoms occur; and
- direct users with pain, injury, medical conditions, or safety concerns to a
  qualified medical professional or qualified golf coach as appropriate.

## Consent Gate Requirement

Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.

The consent gate must be accessible and usable. It should not depend on rigid
scroll-completion mechanics as the only evidence of review unless legal/human
review specifically approves that interaction.

## AI Coach Prompt Constraints

Future AI coach prompts and system instructions must include constraints that:

- prohibit diagnosing pain, injuries, medical conditions, mobility limits, or
  causes of symptoms;
- prohibit medical triage, rehabilitation plans, therapy exercises, or
  treatment instructions;
- prohibit aggressive mechanical prescriptions such as forcing range of motion,
  training through pain, or making abrupt high-load changes;
- frame suggestions as optional, low-intensity, educational observations;
- recommend stopping activity when pain, numbness, dizziness, weakness, or
  unusual discomfort is present;
- recommend qualified medical review for pain, injury, or health concerns; and
- recommend qualified coaching review for sport-specific instruction beyond
  general educational feedback.

Automated guardrails, keyword filters, system prompts, or output checks should
be treated as defense-in-depth controls. They do not guarantee that all unsafe
or adversarial requests will be caught, especially in client-side or local-first
execution contexts.

## Review Checklist

- [ ] Legal/human reviewer approved assumption-of-risk language.
- [ ] Legal/human reviewer approved release-of-liability language.
- [ ] Consent gate blocks first analysis before acknowledgement.
- [ ] Consent gate does not upload raw swing video or consent records by
      default.
- [ ] AI coaching prompt constraints reject pain diagnosis and rehabilitation
      advice.
- [ ] AI coaching prompt constraints reject unsafe or aggressive movement
      prescriptions.
- [ ] Gemini research disposition reviewed and accepted, revised, deferred, or
      rejected for each major recommendation.
~~~~

### docs/ss-005-google-provider-response.md

~~~~markdown
# SS-005 Google Provider Response

Status: **Approved by the maintainer on 2026-06-11.**

Durable source:

- Issue: https://github.com/google-ai-edge/mediapipe/issues/6306
- Provider response:
  https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357
- Responder: `schmidt-sebastian`, a collaborator on
  `google-ai-edge/mediapipe`
- Response date: 2026-06-10

The issue explicitly identifies exact `@mediapipe/tasks-vision@0.10.35` and the
exact Pose Landmarker Full float16 version 1 URL before asking the telemetry,
compiled-artifact, and model-rights questions.

On 2026-06-10, the maintainer supplied the following response attributed to
Google regarding MediaPipe Tasks Vision Web, the exact Pose Landmarker model
candidate, and SDK licensing:

> The current version of the Web SDK does not include telemetry. We are however
> working on this at the moment, as API usage data is becoming more and more
> critical for our team, as it allows us to focus our development on areas that
> are popular with our customers. While we plan to collect performance and
> usage data we do not send your input data to our servers and only collect
> aggregated usage metrics. We currently are not planning to have an opt-out
> mechanism, as this will greatly skew the data we receive, which will no longer
> allow us to make informed decisions on what our customers are using. You can
> block outgoing requests, or block the destination host once we have telemetry
> enabled, and continue to use our SDK normally.
>
> Please review our privacy notice for more information:
> https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice
>
> The
> https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task
> is released under Apache 2.
>
> The current version of the Web SDKs are released under Apache 2 as noted on
> NPM. We will ensure that future versions of our NPM packages include NOTICE
> and LICENSE files.

## Codex Evidence Disposition

The maintainer explicitly approved reliance on Google's public response on
2026-06-11 for exact `@mediapipe/tasks-vision@0.10.35`, its packaged compiled
artifacts, and the exact Pose Landmarker Full float16 version 1 model. The
maintainer also approved same-origin model vendoring/serving, Apache-2.0 license
and attribution handling, fail-closed unexpected-network behavior, and fresh
review before every SDK upgrade.

Approved evidence disposition:

- **Provider metrics:** Adopt for exact current Web SDK candidate
  `@mediapipe/tasks-vision@0.10.35`. Google states the current Web SDK does not
  include telemetry. Any later version requires a fresh privacy, network, and
  terms review because Google states telemetry is planned.
- **Unexpected network behavior:** Revise. Tests must still observe and block
  unexpected external requests. Because current-version telemetry is stated to
  be absent, an unexpected external request during approved local operation
  fails closed and blocks release pending investigation.
- **SDK license:** Adopt for the exact current Web SDK candidate. Google's
  response says current Web SDKs are Apache-2.0, supplementing npm package
  metadata. The response does not separately enumerate each compiled WASM
  binary, so the maintainer compliance decision must explicitly state whether
  it reasonably relies on this SDK-wide statement for packaged compiled
  artifacts.
- **Missing package license files:** Revise. Google acknowledges future npm
  packages will include `NOTICE` and `LICENSE`, but the exact candidate does
  not. Swing Sync must distribute the Apache-2.0 license and a third-party
  attribution entry. No upstream `NOTICE` file exists in the inspected exact
  tarball to preserve; any contrary provider notice discovered later must be
  added before release.
- **Model rights:** Adopt for the exact model URL. Google's response says that
  exact model is Apache-2.0. Subject to maintainer approval, Apache-2.0 permits
  commercial use, copying, redistribution, local serving, and caching while
  requiring license/notice preservation as applicable.
- **Model delivery:** Adopt same-origin vendoring and serving for the exact
  approved model, with a pinned SHA-256, source URL, Apache-2.0 attribution,
  and no runtime provider fetch. Service-worker caching remains a separate
  implementation decision.

## Remaining Gate

This response does not approve a fixture or prove runtime behavior. Before
implementation:

1. approve and empirically validate a reproducibly generated, non-identifying
   fixture against the exact candidate;
2. obtain a third focused Claude QA PASS; and
3. move SS-005 to `3. In Development (ChatGPT)`.
~~~~

### docs/ss-005-preimplementation-spec.md

~~~~markdown
# SS-005 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This specification defines the
implementation contract that may be used only after the open gates are closed.**

## Scope

SS-005 may add browser video-mode pose landmark extraction while preserving the
existing first-analysis safety acknowledgement and local-first boundaries.

In scope:

- non-blocking runtime initialization and inference;
- approved fixture-frame extraction;
- complete pose landmark and visibility retention;
- same-origin approved asset loading;
- useful local failure states;
- no unexpected external network activity after approved assets are available;
  and
- volatile raw-frame/resource lifecycle.

Out of scope:

- swing phases, biomechanical metrics, coaching, overlays, exports, remote
  review, remote model APIs, telemetry, remote logging, and long-term landmark
  persistence.

## Blocking Maintainer Decisions

These decisions are recorded conservatively until stronger evidence is approved:

| Decision | Current decision |
| --- | --- |
| Provider metrics | Approved for exact `@mediapipe/tasks-vision@0.10.35` based on public issue #6306 stating that the current Web SDK does not include telemetry. Any upgrade requires fresh review. Unexpected external requests fail closed pending investigation. |
| SDK | Exact `@mediapipe/tasks-vision@0.10.35` is approved. The maintainer approved reliance on Google's SDK-wide Apache-2.0 statement for packaged compiled artifacts and the missing-package-files handling in `docs/ss-005-google-provider-response.md`. |
| Model and delivery | The exact Pose Landmarker Full float16 version 1 URL is approved based on Google's Apache-2.0 statement in public issue #6306. Vendor and serve the exact asset same-origin with a pinned hash and attribution. Runtime provider fetch is not approved. Service-worker caching remains a separate decision. |
| Fixture | Approved: `test/fixtures/pose-landmarker/mannequin-golf-address.webm`, deterministically derived from a committed AI-generated faceless wooden-mannequin source. `PROVENANCE.md` records generation, license decision, hashes, and empirical exact-model validation. |
| Network criterion | Successful initialization and inference must not require or attempt unexpected external network activity after approved same-origin assets are available. Tests report observed/attempted requests and do not claim impossibility. |
| Responsiveness | Use behavioral UI-heartbeat/input completion as the acceptance gate. Record browser long tasks as diagnostic evidence; do not require zero long tasks or fixed FPS/inference latency across hardware. |

## Candidate API Schema

For exact `@mediapipe/tasks-vision@0.10.35`, the inspected TypeScript
declarations expose:

- `PoseLandmarkerResult.landmarks: NormalizedLandmark[][]`;
- `PoseLandmarkerResult.worldLandmarks: Landmark[][]`; and
- `x`, `y`, `z`, and `visibility` on both landmark types.

The exact candidate declarations do **not** expose per-landmark `presence`.
`minPosePresenceConfidence` is an input option/threshold, not returned
per-landmark metadata. SS-005 must:

- preserve all returned poses and all 33 landmarks per detected pose;
- preserve returned `x`, `y`, `z`, and `visibility` values without filtering,
  rounding, or invented confidence guarantees;
- record configured detection, presence, and tracking thresholds separately;
- not invent a returned `presence` field; and
- wrap each result with the input `timestampMs` because the candidate result
  object does not itself carry that timestamp.

If a different SDK/version is proposed, this schema decision must be reverified.

## Worker Contract

### States

`uninitialized -> initializing -> ready -> processing -> ready`

Terminal states:

- `error`: initialization, inference, protocol, timestamp, or worker failure;
- `torn-down`: teardown completed and the worker is terminated.

Recovery from `error` requires creating a new worker. No degraded inference may
continue after an error.

### Main To Worker Messages

| Type | Required data | Valid state |
| --- | --- | --- |
| `init` | approved runtime/model configuration and asset integrity metadata | `uninitialized` |
| `frame` | transferable `ImageBitmap`, finite non-negative monotonically increasing `timestampMs` | `ready` |
| `teardown` | none | any non-terminal state |

The main thread owns backpressure. It may have at most one in-flight frame and
must close/drop a newly created bitmap instead of posting it while the worker is
busy.

### Worker To Main Messages

| Type | Required data |
| --- | --- |
| `ready` | sanitized runtime/version identifier |
| `result` | input `timestampMs`, complete normalized/world landmark arrays |
| `frame-dropped` | input `timestampMs`, sanitized reason |
| `init-error` | stable sanitized code |
| `inference-error` | stable sanitized code, optional input `timestampMs` |
| `torn-down` | none |

No message or diagnostic may contain raw frames, media characteristics, user
identifiers, or landmark values except the explicit `result` payload consumed
in memory by the app.

### Failure And Cleanup

- Invalid protocol or timestamp input fails closed and terminates the session.
- Main-thread `error` and `messageerror` worker events fail closed.
- Every owned `ImageBitmap` is closed in a `finally` path.
- Teardown closes the pose task, releases references, acknowledges completion,
  and terminates the worker.
- The main thread must not assume every frame produces a result.
- A watchdog may surface a sanitized local timeout state; its duration must be
  generous and must not be presented as an inference-performance guarantee.

## Fixture Contract

Before a fixture is committed or used, its provenance record must include:

- generator/tool name, exact version, and license;
- reproducible source/script or exact generation command;
- deterministic inputs/seed where applicable;
- dimensions, duration, frame rate, and SHA-256;
- declaration that it contains no recording of a real person;
- output copyright/license decision; and
- expected structural behavior used by tests.

Do not assert that a geometric/stick-figure fixture will necessarily produce
pose landmarks. The approved fixture must be empirically validated against the
approved model before its expected landmark behavior is recorded.

## Network Test Contract

Tests must distinguish:

1. **Load phase:** record every request and allow only the documented approved
   same-origin runtime/model/fixture assets.
2. **Post-ready phase:** block and record every request after the runtime reports
   ready; successful fixture inference must complete with no attempted request.
3. **Offline-from-start phase:** with approved assets already locally available,
   block external requests from navigation start and demonstrate successful
   initialization and fixture inference.
4. **Service-worker phase:** only if caching is later approved, repeat the
   assertion with the production service worker active.

The evidence proves behavior observed in controlled runs, not that an SDK can
never issue a request.

Google states that the current Web SDK does not include telemetry. Therefore,
for exact `@mediapipe/tasks-vision@0.10.35`, any unexpected external request
during approved local operation fails closed and blocks release pending
investigation. Do not silently allow or ignore it. Future SDK versions require
fresh provider-metrics, consent, privacy, and network review before upgrade.

## Responsiveness Contract

During initialization:

- a deterministic main-thread heartbeat/input action scheduled after
  initialization begins must complete before the worker emits `ready`;
- the UI must expose a loading state and remain interactive;
- browser `longtask` entries are captured for diagnosis; and
- tests must not fail solely because any long task exceeds 50 ms unless a
  separate reviewed CI threshold is later approved.

This verifies that initialization is delegated and the UI remains usable without
claiming fixed FPS or latency across devices.

## Required Test Coverage

Before implementation can be considered complete:

- worker state/protocol success and every fail-closed path;
- invalid/non-monotonic timestamps;
- complete 33-landmark arrays with exact returned fields;
- no filtering/rounding and wrapper timestamp preservation;
- initialization failure and useful local error state;
- UI heartbeat/input responsiveness while loading;
- approved fixture inference;
- two-phase and offline-from-start network assertions;
- object URL, bitmap, task, and worker cleanup;
- no raw-frame/model cache/storage persistence beyond explicitly approved asset
  behavior;
- no sensitive console/log output;
- production CSP/worker/WASM/base-path behavior; and
- desktop and mobile Chromium behavior.

## Implementation Start Gate

The implementation-start gate closed on 2026-06-11: the fixture/provenance is
approved, Claude returned PASS, and Notion moved to
`3. In Development (ChatGPT)`. This specification remains normative during
implementation and final audit.
~~~~

### docs/ss-005-research-disposition.md

~~~~markdown
# SS-005 Research Disposition

Status: **Durable Google response evidence, maintainer compliance approval,
fixture evidence, and focused Claude QA PASS recorded. Implementation is in
progress.**

Gemini recommended a conditional GO using `@mediapipe/tasks-vision@0.10.35`,
the Pose Landmarker Full float16 version 1 bundle, local WASM/model assets, a
worker, CSP restrictions, a synthetic mannequin fixture, and Playwright network
assertions. Gemini research is input, not implementation or licensing
authority.

## Primary-Source And Artifact Checks

- The official Web guide identifies `@mediapipe/tasks-vision`, supports project
  local model paths or model buffers, documents VIDEO mode and millisecond
  timestamps, and states `detect()` and `detectForVideo()` synchronously block
  the calling thread and should run in a worker:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- The official overview documents 33 normalized and world landmarks and lists
  lite, full, and heavy float16 versioned bundles. It does not establish that
  Full is required for golf, that Lite is insufficient, or that Heavy lacks
  meaningful benefit:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker
- The current MediaPipe terms language reviewed during planning did not
  establish exact Web Tasks Vision behavior. On 2026-06-10, the maintainer
  supplied a response attributed to Google stating that the current Web SDK
  does not include telemetry, future aggregated usage/performance telemetry is
  planned, and future outbound requests may be blocked:
  `docs/ss-005-google-provider-response.md`.
- npm registry metadata for `@mediapipe/tasks-vision@0.10.35` reports
  Apache-2.0, no declared dependencies, tarball integrity
  `sha512-HOvadwVRE6JC+45nyYhmnywnr5h/J8KZvOeUNVOG9q/0875pZgItznFB9bRTvLc264YSJqiZ1NsIpCStJw/egg==`,
  and tarball SHA-256
  `84597a25e13d123b5f4cbe768bb72e97a2c28c7a465f0ace287d8cbe5246bff0`.
- The inspected 0.10.35 tarball contains three JavaScript/WASM runtime pairs,
  not Gemini's claimed internal/SIMD pair:
  `vision_wasm_internal`, `vision_wasm_module_internal`, and
  `vision_wasm_nosimd_internal`.
- The inspected tarball does not contain a LICENSE or NOTICE file. Package
  metadata alone is insufficient to resolve all compiled-binary and notice
  obligations.
- Strings in all three inspected WASM binaries include Google operational
  metrics identifiers. This supports treating metrics/network behavior as a
  real risk, but does not prove the destination, timing, payload, or whether
  local paths or CSP fully suppress it.
- The same Google response states that the exact
  `pose_landmarker_full.task` URL is Apache-2.0 and that current Web SDKs are
  Apache-2.0. The response is durable public evidence in MediaPipe issue #6306;
  explicit maintainer compliance approval remains required before relying on
  those statements.

## Adopt

- Pin any approved production SDK/model/runtime assets exactly; do not use
  `latest`, caret, or tilde ranges.
- Keep all approved WASM and model loading same-origin. Tests must fail on any
  unexpected external request during initialization and inference.
- Run MediaPipe initialization and synchronous video-mode inference outside the
  UI thread. Define a bounded worker message contract, cancellation, teardown,
  failure states, and backpressure that prevents an unbounded frame queue.
- Use monotonically increasing millisecond timestamps derived from the
  pre-recorded video's media timeline. Reject or fail clearly on invalid or
  non-monotonic timestamps.
- Transfer `ImageBitmap` inputs where supported and close each bitmap in every
  success, failure, cancellation, and worker-termination path.
- Retain the complete 33-landmark normalized and world result arrays, including
  each returned `x`, `y`, `z`, and `visibility` value. Exact candidate
  declarations do not expose per-landmark `presence`; treat presence,
  detection, and tracking thresholds separately from returned metadata.
- Keep raw video references, decoded frames, and image buffers volatile and
  local. Revoke object URLs and close the task/worker resources.
- Use `SS-TC-001` as complementary local extraction/no-upload coverage and
  dedicated `SS-TC-009` for SS-005-specific loading, metadata, timestamps,
  cleanup, responsiveness, and network assertions.
- Keep diagnostics local and data-minimized. Useful states include loading,
  ready, processing, cancelled, and sanitized error category; do not log raw
  frames, landmarks, media characteristics, or user identifiers.

## Revise Before Adoption

- Treat `@mediapipe/tasks-vision@0.10.35` as the pinned candidate, not an
  approved dependency until explicit maintainer compliance approval is
  recorded. Approval must explicitly cover
  packaged compiled artifacts, missing package files, and demonstrated network
  behavior.
- Treat Pose Landmarker Full float16 version 1 as a candidate only. Model
  variant selection requires measured fixture/browser evidence; the Full model
  is not justified solely by Gemini's golf-accuracy assertion.
- Use CSP as defense in depth after implementation-specific browser testing.
  Do not claim CSP disables all SDK telemetry or makes privacy complete. Do not
  add `'unsafe-eval'`, `blob:`, or broad worker/connect permissions without
  proving each is required and scoped.
- Prove "network activity is not required after model assets are available" by
  first loading only approved same-origin assets, then blocking external
  requests and demonstrating successful initialization and fixture inference.
  Also record attempted blocked requests. A single passing run cannot disprove
  the terms' "from time to time" behavior.
- Prefer a generated, non-identifying fixture, but approve it only after the
  generation tool/source, license, provenance, reproducibility, and expected
  landmark behavior are documented. The proposed
  `fixture_swing_silhouette.webm` does not yet exist and is not approved.
- Measure UI responsiveness with deterministic heartbeat/input-latency checks.
  Do not require or promise 60 FPS, sub-100 ms latency, fixed 45 ms thresholds,
  or stable memory values without an approved benchmark contract.
- Treat service-worker caching as a separate design decision. Same-origin asset
  availability can satisfy SS-005 without claiming complete offline PWA
  capability.

## Defer

- Swing-phase detection, biomechanical accuracy, joint-angle/ground-reaction
  interpretation, metrics, coaching, overlays, exports, and remote review.
- Selecting or filtering to 12 "essential" joints. Downstream stories may
  derive subsets from the retained 33-landmark contract.
- Discarding landmarks based on hard-coded presence/visibility thresholds.
  Preserve raw returned metadata so later consumers can make explicit decisions.
- Segmentation masks, WebGL/GPU delegate policy, thermal-adaptation thresholds,
  long-term landmark persistence, and broad fixture dataset policy.
- A new privacy-consent screen. Preserve the existing first-analysis safety
  acknowledgement; any separate consent required by Google's metrics terms is a
  blocking product/privacy decision, not an assumption for SS-005.

## Reject

- Reject Gemini's assertion that all blockers are resolved.
- Reject committing, vendoring, serving, caching, or downloading a model asset
  before explicit model rights, obligations, and maintainer approval are
  documented.
- Reject the claim that self-hosting alone prevents external SDK requests.
- Reject absolute "complete privacy", "zero external network activity", and
  "complete offline capability" claims.
- Reject Gemini's unsupported claim that world landmarks are unaffected by
  camera distance, focal length, or perspective distortion.
- Reject treating CSP-blocked future provider metrics as automatically
  compliant or as a substitute for a fresh provider/consent review when
  upgrading beyond the exact approved SDK version.
- Reject the malformed example test code and any claim that proposed tests are
  already "Verified".

## Blocking Decision Record

| Question | Status | Decision / Evidence |
| --- | --- | --- |
| Exact SDK package and version | Approved | Exact `@mediapipe/tasks-vision@0.10.35`; public MediaPipe issue #6306 states current Web SDKs are Apache-2.0 and have no telemetry. Maintainer approved reliance including packaged compiled artifacts on 2026-06-11. |
| Exact Pose Landmarker model asset/version | Approved | Exact Pose Landmarker Full float16 version 1 URL; Google states it is Apache-2.0 and the maintainer approved reliance on 2026-06-11. |
| Commit/vendor/serve/cache/download rights | Approved for exact asset | Vendor and serve same-origin with pinned SHA-256 and attribution. Runtime provider fetch is not approved; service-worker caching remains separate. |
| Notices, attribution, citations, terms | Resolved for exact candidates | Distribute Apache-2.0 license text and third-party attribution. Exact tarball has no NOTICE to preserve. |
| Asset delivery strategy | Approved | Vendor and serve the exact model same-origin with pinned SHA-256 and attribution; no runtime provider fetch. Service-worker caching remains separate. |
| No-network proof after local assets | Partially resolved | Playwright must block/record external requests while initialization and inference still succeed; intermittent provider behavior remains a risk. |
| Fixture provenance/license/consent | Approved | `test/fixtures/pose-landmarker/mannequin-golf-address.webm` contains no real-person recording. Its committed source, deterministic derivation, hashes, output license decision, and exact-model VIDEO-mode validation are recorded in the adjacent `PROVENANCE.md`. |
| Volatile/local raw-frame lifecycle | Resolved for specification | Transfer/close bitmaps, revoke object URLs, close task/worker, and prohibit raw-frame persistence. |
| Landmark and metadata schema | Resolved for specification | Retain complete 33 normalized/world landmarks and returned `x`, `y`, `z`, and `visibility`; do not invent per-landmark presence. |
| Correct SS-005 test-case coverage | Closed by focused QA re-review | `SS-TC-009` has been revised; execution remains blocked on approved assets/fixture. |
| Non-blocking loading/inference architecture | Closed by focused QA re-review | Normative worker contract and behavioral responsiveness gate are in `docs/ss-005-preimplementation-spec.md`. |

## Implementation Gate

Claude returned PASS on 2026-06-11 and SS-005 moved to
`3. In Development (ChatGPT)`. The exact dependency, approved same-origin
model/WASM assets, fixture, CSP, worker runtime, and focused tests are now in
scope. Service-worker model caching remains deferred and unapproved.
~~~~

## Final Required Output

After reviewing the embedded file contents, end with an explicit PASS or FAIL and whether Codex may prepare the pull request. Do not rely on filesystem or GitHub access.
