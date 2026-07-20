# SS-018 Claude Focused Implementation Re-review Prompt

Superseded for paste use after Claude closed B9-B11 and requested a short B13
plus smoke-evidence follow-up. Use
`docs/ss-018-claude-audit-b13-smoke-followup-prompt.md` instead.

Do not use prior chat as authoritative. This is a focused re-review after the
SS-018 implementation audit failed with B9-B12.

## Role

You are the lead adversarial auditor for Swing Sync.

## Stage

Focused implementation re-review after audit blockers B9-B12.

## Scope

Review only whether Codex correctly addressed:

- B9: `closeActive()` stale render / disabled `Begin analysis` regression.
- B10: missing renderer selector/label unit coverage for review, export, and
  remote-review-unavailable branches.
- B11: weak `observedSeekTimestampMs` exclusion test that used empty state.
- B12: safety/privacy verifier scan lists not following the extracted module
  split.

Also review whether the remaining smoke-test status is acceptable as a
temporary verification blocker or must remain a blocker for sign-off.

## Context

SS-018 refactors the frontend app shell into focused TypeScript modules while
preserving current user-facing behavior. Protected boundaries remain:

- raw swing video is not uploaded by default;
- remote sharing still requires separate explicit opt-in;
- remote model review remains unavailable;
- provider/model registry behavior, service-worker behavior, raw-media
  handling, and exported data classes must not change;
- no telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts may be added.

## Prior Audit Findings

### B9

`closeActive()` set `processingState` to `idle` after `await controller.close()`
but never called `requestRender()`. The two event call sites launched
`void lifecycle.closeActive()` and synchronously rendered a capture/video state
while processing was still active, so `#analysis-button` could remain disabled
until a later unrelated render.

### B10

Renderer unit coverage only asserted the capture branch. The approved spec
required direct unit assertions for protected selectors/labels in review,
export, and remote-review-unavailable branches.

### B11

The `observedSeekTimestampMs` exclusion test used `createInitialAppState()`,
so no sampled frame output was ever serialized.

### B12

Safety/privacy verifier app-source lists scanned only a subset of extracted
modules, so future protected-copy changes in new modules could evade checks.

## Applied Fixes

- `src/analysis-lifecycle.ts`: `closeActive()` now calls
  `this.options.requestRender()` after controller close, handle clearing, and
  `setProcessingState(..., "idle")`. `retryActive()` has a comment documenting
  why it still relies on the processing partial-update path.
- `test/unit/analysis-lifecycle.test.ts`: now asserts `closeActive()` calls
  `requestRender()` and includes a regression where capture renders while
  close is pending, then the close continuation re-renders with
  `#analysis-button` enabled.
- `test/unit/app-renderer.test.ts`: added real eight-sample review-ready state
  fixture and direct assertions for review branch selectors/labels plus
  export/remote-review-unavailable selectors/labels.
- `test/unit/swing-card-actions.test.ts`: now builds populated
  `SampledFrameOutput` fixtures containing `observedSeekTimestampMs`, drives
  the actual assignment/content path, and asserts the field/value are absent
  from produced keyframes and `analysisPrompt`.
- `scripts/verify-privacy-boundaries.js`: `appSourcePaths` now uses
  `listScannableFiles("src")`.
- `scripts/verify-safety-terms.js`: added `listScannableFiles("src")` and
  scans all runtime source modules. It normalizes explicit
  `Do not provide ...` prompt guardrail sentences before applying affirmative
  unsafe-claim regexes, so negated safety constraints do not fail as false
  positives.

## Relevant Source Contents

### `src/analysis-lifecycle.ts`

```ts
import { updateProcessingProgressUi } from "./app-renderer";
import type { AppState } from "./app-state";
import {
  completeProcessingWithOutputs,
  recordProcessingOutput,
  resetPhaseReview,
  resetProcessingCounters,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "./app-state";
import { createBrowserFrameController } from "./browser-frame-processing";
import type {
  FrameProcessingController,
  FrameProcessingState,
  SampledFrameOutput
} from "./frame-processing";

export interface AnalysisLifecycleOptions {
  root: ParentNode;
  state: AppState;
  requestRender(statusMessage?: string): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;

  constructor(private readonly options: AnalysisLifecycleOptions) {}

  hasActiveController(): boolean {
    return !!this.frameController;
  }

  async startActive(): Promise<void> {
    const video = this.options.root.querySelector<HTMLVideoElement>("#analysis-video");
    const selectedVideo = this.options.state.selectedVideo;
    if (!video || !selectedVideo) return;

    resetProcessingCounters(this.options.state);
    resetPhaseReview(this.options.state);
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(completed, total),
      onOutput: (output) => this.handleProcessingOutput(output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    this.options.requestRender("Local analysis stopped and volatile resources were released.");
  }

  async closeActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    this.options.requestRender();
  }

  async retryActive(): Promise<void> {
    // Retry progress is surfaced through the processing partial-update path.
    resetPhaseReview(this.options.state);
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(state: FrameProcessingState, code?: string): void {
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingProgress(completed: number, total: number): void {
    setProcessingProgress(this.options.state, completed, total);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingOutput(output: SampledFrameOutput): void {
    recordProcessingOutput(this.options.state, output);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
  }
}
```

### `src/app-events.ts` call-site context

These call sites are unchanged. They still intentionally launch
`closeActive()` without awaiting it, but `closeActive()` now owns its post-close
render after async teardown completes.

```ts
if (
  ["processing", "review", "export"].includes(state.activeStep) &&
  nextStep !== state.activeStep &&
  !opensCompletedReview &&
  !preservesReviewData
) {
  void lifecycle.closeActive();
}
selectWorkflowStep(state, nextStep);
requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
```

```ts
const file = (event.currentTarget as HTMLInputElement).files?.[0];
if (!file) return;
void lifecycle.closeActive();
selectLocalVideo(state, file);
requestRender("Local video selected. It has not been analyzed or persisted.");
```

### `test/unit/analysis-lifecycle.test.ts`

```ts
import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import {
  createInitialAppState,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState
} from "../../src/app-state";
import { renderApp } from "../../src/app-renderer";

class FakeElement {
  innerHTML = "";
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined
    });
    const abort = vi.fn();
    Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
      abortFrameController: abort
    });

    setProcessingState(state, "idle");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).not.toHaveBeenCalled();

    setProcessingState(state, "loading");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
  });

  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(
      lifecycle as unknown as {
        frameController?: { close: () => Promise<void> };
        abortFrameController?: (code: string) => void;
      },
      {
        frameController: { close },
        abortFrameController: vi.fn()
      }
    );
    setProcessingState(state, "processing");

    await lifecycle.closeActive();

    expect(close).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledTimes(1);
  });

  it("re-renders capture controls after async close settles", async () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    const closeDeferred = deferred();
    const requestRender = vi.fn(() => renderApp(root, state, true));
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
      frameController: { close: () => closeDeferred.promise }
    });
    selectLocalVideo(state, new File(["video"], "swing.mp4", { type: "video/mp4" }));
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    const closePromise = lifecycle.closeActive();
    selectWorkflowStep(state, "capture");
    renderApp(root, state, true);

    expect(root.innerHTML).toMatch(/id="analysis-button"[\s\S]*disabled/);

    closeDeferred.resolve();
    await closePromise;

    expect(requestRender).toHaveBeenCalledTimes(1);
    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).not.toMatch(/id="analysis-button"[\s\S]*disabled/);
  });

  it("stops active processing and requests an idle capture render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
      frameController: { cancel }
    });
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    await lifecycle.stopActive();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.activeStep).toBe("capture");
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
  });
});
```

### `test/unit/app-renderer.test.ts` new coverage

The file now contains two added branch tests:

```ts
it("preserves protected phase-review selectors and labels", () => {
  const root = new FakeElement() as unknown as HTMLElement;
  const state = createReviewReadyState();
  selectWorkflowStep(state, "review");

  renderApp(root, state, true);

  for (const value of [
    "Swing phase assignments",
    "View",
    "Handedness",
    "Horizontally mirrored",
    "Select keyframe",
    "data-confirm-phase-review",
    "data-phase-index",
    "data-open-export"
  ]) {
    expect(root.innerHTML).toContain(value);
  }
});

it("preserves protected export and remote-review-unavailable selectors and labels", () => {
  const root = new FakeElement() as unknown as HTMLElement;
  const state = createReviewReadyState();
  selectWorkflowStep(state, "export");

  renderApp(root, state, true);

  for (const value of [
    "Downloadable summary",
    "Remote model review unavailable",
    "Remote model data disclosure",
    "data-download-swing-card",
    "data-print-swing-card",
    "data-copy-swing-card-prompt",
    "data-swing-card-status",
    "data-swing-card-print-host",
    "data-remote-model-send"
  ]) {
    expect(root.innerHTML).toContain(value);
  }
});
```

The test fixture uses real `completeProcessingWithOutputs(...)`,
`setPhaseDeclaration(...)`, and `rebuildPhaseReviewState(...)` transitions with
eight `SampledFrameOutput` objects.

### `test/unit/swing-card-actions.test.ts`

```ts
import { describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  setPhaseDeclaration
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";
import { prepareSwingCardContent } from "../../src/swing-card-actions";

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function sampledOutputs(): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: 9,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: 12345 + index,
    preview: { close: vi.fn(), width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

describe("swing card actions", () => {
  it("keeps observedSeekTimestampMs out of prepared export content from populated keyframes", async () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        style: {},
        getBoundingClientRect: () => ({ width: 0, height: 0 }),
        getContext: () => null
      })
    });
    const state = createInitialAppState();
    completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
    setPhaseDeclaration(state, "view", "face-on");
    setPhaseDeclaration(state, "handedness", "right");
    setPhaseDeclaration(state, "mirrored", "no");
    setPhaseDeclaration(state, "setup", "confirmed");
    rebuildPhaseReviewState(state);

    const prepared = await prepareSwingCardContent(state);

    try {
      expect(state.phaseOutputs.map((output) => output.observedSeekTimestampMs)).toContain(12345);
      expect(prepared.content.keyframes).toHaveLength(phaseDefinitions.length);
      expect(prepared.content.keyframes.some((keyframe) => keyframe.overlay.status === "unavailable")).toBe(true);
      expect(JSON.stringify(prepared.content)).not.toContain("observedSeekTimestampMs");
      expect(JSON.stringify(prepared.content.keyframes)).not.toContain("12345");
      expect(prepared.content.analysisPrompt).not.toContain("observedSeekTimestampMs");
      expect(prepared.content.analysisPrompt).not.toContain("12345");
    } finally {
      prepared.release();
      vi.unstubAllGlobals();
    }
  });
});
```

### Verifier changes

`scripts/verify-privacy-boundaries.js` now uses:

```js
const appSourcePaths = listScannableFiles("src");
```

`scripts/verify-safety-terms.js` now imports directory traversal helpers,
defines `listScannableFiles("src")`, and uses:

```js
const appSourcePaths = listScannableFiles("src");
const appSource = appSourcePaths.map((path) => readFileSync(path, "utf8")).join("\n");
const combined = `${safetyTerms}\n${researchDisposition}\n${appSource}`;
const unsafePatternSource = combined.replace(/\bDo not provide[^.]*\./gi, "");
```

The `unsafePatternSource` normalization was required because broad `src`
scanning now includes prompt guardrails such as "Do not provide medical advice
..." and "Do not provide ... guaranteed performance improvement ...". Those
are negative safety constraints, not affirmative unsafe claims.

## Verification

Passed:

- `npm run test:unit -- analysis-lifecycle app-renderer swing-card-actions`
  passed: 3 files, 9 tests.
- `npm run test:unit` passed: 21 files, 179 tests.
- `npm run safety:verify` passed.
- `npm run privacy:verify` passed.
- `npm run compliance:verify` passed.
- `npm run build` passed.
- `git diff --check` passed before this prompt file was added.

Smoke status:

- `npm run test:smoke` initially hung before test output.
- Direct Playwright retries also hung before test output, including a run
  against a manually started Vite preview server.
- Escalated process inspection found orphaned Playwright/Chrome processes from
  an earlier `@playwright/cli` daemon; those specific PIDs were terminated and
  the process table was confirmed clean.
- A final clean `npm run test:smoke` retry still hung before Vite/browser child
  startup; it was interrupted and is not counted as passing evidence.
- No Playwright assertion failure or app smoke failure was observed in this
  pass; the blocker is the local Playwright runner hanging before startup.

## Known Non-goals

- No new dependencies.
- No framework migration.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, or persistent debug artifacts.
- No remote-review enablement.
- No provider/model registry, service-worker, raw-media handling, or exported
  data-class change beyond preserving `observedSeekTimestampMs` exclusion.

## Output Required

Return:

- PASS/FAIL for B9-B12 remediation.
- If FAIL, list remaining blockers with file/line references where possible.
- State whether the smoke-runner hang must remain a sign-off blocker even if
  B9-B12 code/test/verifier remediation is accepted.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status: whether SS-018 may proceed to PR preparation, or
  whether additional fixes/re-review are required.
