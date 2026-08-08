# SS-019 Compact Single-Paste Claude Focused Re-review — B-NEW1

This is a single-paste, self-contained handoff for rate-limited Claude plans. Judge only this artifact. It is intentionally compact, not a substitute for the preserved full packets.

## Role

You are the independent final auditor for Swing Sync SS-019. Be adversarial and evidence-driven. Do not implement or broaden the story.

## Stage

Focused follow-up to final audit. The story remains `4. Final Audit (Claude)` on `ss-019-accessibility-design-hardening`; Pull Request is empty.

## Scope

Re-review accepted sole blocker B-NEW1 plus any evidenced cross-cutting focus, status, or protected-boundary risk caused by its repair. Do not reopen unrelated SS-019 work without evidence here.

## Context

Prior finding B-NEW1: active same-token processing callbacks can arrive after navigation from processing to review. The token's state, progress, and output must still be recorded, but `updateProcessingProgressUi` must not query or mutate the mutually exclusive review DOM. The repair changes only `src/analysis-lifecycle.ts` and `test/unit/analysis-lifecycle.test.ts`: it gates each processing-progress DOM update on `activeStep === "processing"`. The named regression `keeps same-token trailing processing callbacks from overwriting confirmed review DOM` proves completed-review text survives while same-token state/progress/output continue recording.

Provenance: immutable original 31-block pre-fix packet SHA-256 `e718f05e6acc6a6be6cc3dfdfa39eeb3ce398f73dd62abbca10aeebc5de93bdc`; verified focused 15-block packet SHA-256 `7efd908832a07c9a6bfe9bd9562f9b8be57843f1eb473a19e8baf8da59d4b525`. Its two exact reconstructed fix-only deltas are repeated below.

## Acceptance criteria

1. Keyboard traversal covers capture, consent, processing, review, confirmation, and export.
2. Focus, labels, headings, status, and disabled explanations are understandable.
3. Desktop/mobile layout remains usable.
4. Practical automation protects high-risk regressions.
5. Manual-only risks remain accurate.

For B-NEW1, assess AC2 and AC4; identify any evidenced impact on the others.

## Protected boundaries

No decorative redesign, protected-copy/selector drift, telemetry, analytics, remote logging, cloud diagnostics, provider/model assets, remote sharing, dependencies, licensing/bundle/notice/SBOM changes, or change to local-first raw-media handling, consent, local processing, remote-review-disabled, service-worker, persistence, or exported-data behavior is authorized. Do not infer certification or unexecuted manual AT/device evidence.

## Relevant source contents or focused diff

The manifest contains exactly 8 numbered exact blocks. Blocks 01–02 are complete fix-only diffs reconstructed against the verified pre-fix packet. Block 03 is complete current lifecycle code. Blocks 04–07 are the smallest coherent current excerpts proving the named regression, completed-review navigation ownership, the updater's `#phase-review-status` query, and review renderer ownership/content for that same ID. Block 08 records protected absence. Re-extract each raw block and match its bytes, line count, SHA-256, kind, and path.

Omitted deliberately: full CONTEXT, full unrelated files/tests, historical planning artifacts, and both larger packets, because they are unchanged or exceed the focused B-NEW1/rate-limit scope. The original and focused packets remain preserved byte-for-byte; this artifact and its predecessor prompt are excluded from evidence circularity. Intentional agent prompts remain preserved and omitted.

## Verification

Node `v22.22.3` evidence: focused lifecycle 3 files/32 tests PASS; full unit 24 files/218 tests PASS; desktop/mobile smoke 48 PASS; build, compliance, safety, privacy, docs, and `git diff --check` PASS. A read-only deep-researcher PASS is advisory only, not your sign-off.

## Known non-goals

Static source-string inventory cleanup, CSS pseudo-element AT-risk note, and awaited-close loading indicator are deferred non-blocking recommendations. No redesign, provider/model, remote-sharing, dependency, certification, or unexecuted manual evidence is in scope.

## Output required

First report mechanical manifest verification. Then provide: (1) one PASS or FAIL verdict; (2) blockers with exact evidence block, impact, minimum correction, and regression; (3) B-NEW1 closure assessment proving recording remains while review DOM cannot be overwritten; (4) protected-boundary drift analysis; (5) non-blockers separated from blockers; and (6) exactly `CLEARED FOR PR PREPARATION` or `NOT CLEARED FOR PR PREPARATION`.

## Evidence manifest

| Kind | Path | Lines | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Complete fix-only diff | `src/analysis-lifecycle.ts` | 35 | 1636 | `88a9e4c934b5a6ac70a419f8e8c28e6b3971cca4656e6f8bcba4568845f59c05` |
| Complete fix-only diff | `test/unit/analysis-lifecycle.test.ts` | 63 | 2851 | `9b79d6a0edb1d260480880cee7d2334d0f8f410fba733deba981f0cfc1cefe5c` |
| Complete current file | `src/analysis-lifecycle.ts` | 134 | 5063 | `84d6bc6dcc65628cbfc7c82975321ce73110c5f255dc4940f1e1dcdb03d81f14` |
| Complete coherent current excerpts | `test/unit/analysis-lifecycle.test.ts:12-28,147-197` | 69 | 2844 | `ee7847f3eb8c35fbdb2cfabdfb52663dc7e7cafd4245e86a9fa687aa3a8a3aef` |
| Complete coherent current excerpt | `src/app-events.ts:56-75` | 20 | 951 | `db682d62e3ec75d1edb4d7ccfa1235dbdd9469e98341717bcbf7e0226e377bf0` |
| Complete coherent current excerpt | `src/app-renderer.ts:150-162` | 13 | 897 | `438f359f30e87dfcb54d3d608404f9a4afc91a9d4df267f28864bde0841bfa89` |
| Complete coherent current excerpt | `src/phase-review-renderer.ts:5-25` | 21 | 1376 | `bd424c85946306c699b54fc79aa851da18f21ef08c0413b3586bf7d42989ad45` |
| Explicit absent-change record | `B-NEW1 protected-boundary delta` | 1 | 333 | `33634692c39bb032b04655557d49202f710de25a831dcf652db5b7657e2b85a7` |

### 01 Complete fix-only diff: src/analysis-lifecycle.ts

Lines: 35  
Bytes: 1636  
SHA-256: `88a9e4c934b5a6ac70a419f8e8c28e6b3971cca4656e6f8bcba4568845f59c05`  
Basis: exact pre-fix-to-current delta preserved from verified focused packet block 01

<!-- BEGIN EXACT BLOCK: 01 Complete fix-only diff: src/analysis-lifecycle.ts -->
````````````````````````````````````````````````
diff --git a/src/analysis-lifecycle.ts b/src/analysis-lifecycle.ts
index ad6b7f0..20d6b31 100644
--- a/src/analysis-lifecycle.ts
+++ b/src/analysis-lifecycle.ts
@@ -98,7 +98,9 @@ export class AnalysisLifecycle {
     if (state === "completed" && this.frameController) {
       completeProcessingWithOutputs(this.options.state, this.frameController);
     }
-    updateProcessingProgressUi(this.options.root, this.options.state);
+    if (this.options.state.activeStep === "processing") {
+      updateProcessingProgressUi(this.options.root, this.options.state);
+    }
     if (
       (state === "completed" || state === "failed") &&
       this.options.state.activeStep === "processing" &&
@@ -111,13 +113,17 @@ export class AnalysisLifecycle {
   private handleProcessingProgress(token: symbol, completed: number, total: number): void {
     if (token !== this.activeCallbackToken) return;
     setProcessingProgress(this.options.state, completed, total);
-    updateProcessingProgressUi(this.options.root, this.options.state);
+    if (this.options.state.activeStep === "processing") {
+      updateProcessingProgressUi(this.options.root, this.options.state);
+    }
   }
 
   private handleProcessingOutput(token: symbol, output: SampledFrameOutput): void {
     if (token !== this.activeCallbackToken) return;
     recordProcessingOutput(this.options.state, output);
-    updateProcessingProgressUi(this.options.root, this.options.state);
+    if (this.options.state.activeStep === "processing") {
+      updateProcessingProgressUi(this.options.root, this.options.state);
+    }
   }
 
   private clearControllerHandles(): void {
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 01 Complete fix-only diff: src/analysis-lifecycle.ts -->

### 02 Complete fix-only diff: test/unit/analysis-lifecycle.test.ts

Lines: 63  
Bytes: 2851  
SHA-256: `9b79d6a0edb1d260480880cee7d2334d0f8f410fba733deba981f0cfc1cefe5c`  
Basis: exact pre-fix-to-current delta preserved from verified focused packet block 02

<!-- BEGIN EXACT BLOCK: 02 Complete fix-only diff: test/unit/analysis-lifecycle.test.ts -->
````````````````````````````````````````````````
diff --git a/test/unit/analysis-lifecycle.test.ts b/test/unit/analysis-lifecycle.test.ts
index 9603d43..b3a836e 100644
--- a/test/unit/analysis-lifecycle.test.ts
+++ b/test/unit/analysis-lifecycle.test.ts
@@ -144,6 +144,58 @@ describe("analysis lifecycle ownership", () => {
     expect(applyAccessibilityIntent).not.toHaveBeenCalled();
   });
 
+  it("keeps same-token trailing processing callbacks from overwriting confirmed review DOM", () => {
+    const state = createInitialAppState();
+    selectWorkflowStep(state, "processing");
+    const root = new ProcessingRoot();
+    const requestRender = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
+    const lifecycle = new AnalysisLifecycle({
+      root: root as unknown as ParentNode,
+      state,
+      requestRender,
+      applyAccessibilityIntent
+    });
+    const token = Symbol("current");
+    Object.assign(lifecycle as unknown as {
+      activeCallbackToken: symbol;
+      frameController: { getOutputs(): [] };
+    }, {
+      activeCallbackToken: token,
+      frameController: { getOutputs: () => [] }
+    });
+    const callbacks = lifecycle as unknown as {
+      handleProcessingState(token: symbol, state: "completed"): void;
+      handleProcessingProgress(token: symbol, complete: number, total: number): void;
+      handleProcessingOutput(token: symbol, output: SampledFrameOutput): void;
+    };
+
+    callbacks.handleProcessingState(token, "completed");
+    expect(root.status.textContent).toBe("Local frame processing completed.");
+
+    selectWorkflowStep(state, "review");
+    root.reviewStatus.textContent =
+      "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here.";
+    const confirmedReviewStatus = root.reviewStatus.textContent;
+    const querySelector = vi.spyOn(root, "querySelector");
+    applyAccessibilityIntent.mockClear();
+
+    callbacks.handleProcessingProgress(token, 7, 8);
+    callbacks.handleProcessingOutput(token, {
+      pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
+    } as unknown as SampledFrameOutput);
+    callbacks.handleProcessingState(token, "completed");
+
+    expect(state.processingState).toBe("completed");
+    expect(state.extractedFrameCount).toBe(7);
+    expect(state.totalFrameCount).toBe(8);
+    expect(state.latestLandmarkCount).toBe(33);
+    expect(root.reviewStatus.textContent).toBe(confirmedReviewStatus);
+    expect(querySelector).not.toHaveBeenCalled();
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
+  });
+
   it("keeps current loading processing cancelled and closed callbacks partial without focus or global announcements", () => {
     const state = createInitialAppState();
     selectWorkflowStep(state, "processing");
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 02 Complete fix-only diff: test/unit/analysis-lifecycle.test.ts -->

### 03 Complete current file: src/analysis-lifecycle.ts

Lines: 134  
Bytes: 5063  
SHA-256: `84d6bc6dcc65628cbfc7c82975321ce73110c5f255dc4940f1e1dcdb03d81f14`  
Basis: complete current repair surface

<!-- BEGIN EXACT BLOCK: 03 Complete current file: src/analysis-lifecycle.ts -->
````````````````````````````````````````````````
import { updateProcessingProgressUi } from "./app-renderer";
import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
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
  requestRender(request?: RenderRequest): void;
  applyAccessibilityIntent(intent: AccessibilityIntent): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;
  private activeCallbackToken: symbol | undefined;

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
    const token = Symbol("analysis-controller");
    this.activeCallbackToken = token;
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(token, state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(token, completed, total),
      onOutput: (output) => this.handleProcessingOutput(token, output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    const message = "Local analysis stopped and volatile resources were released.";
    this.options.requestRender({
      focusKey: "stage-heading",
      visibleStatusText: message,
      announcement: message
    });
  }

  async closeActive(): Promise<void> {
    const controller = this.frameController;
    this.activeCallbackToken = undefined;
    resetPhaseReview(this.options.state);
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
  }

  async retryActive(): Promise<void> {
    // Retry progress is surfaced through the processing partial-update path.
    resetPhaseReview(this.options.state);
    this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(token: symbol, state: FrameProcessingState, code?: string): void {
    if (token !== this.activeCallbackToken) return;
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
    if (
      (state === "completed" || state === "failed") &&
      this.options.state.activeStep === "processing" &&
      token === this.activeCallbackToken
    ) {
      this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
    }
  }

  private handleProcessingProgress(token: symbol, completed: number, total: number): void {
    if (token !== this.activeCallbackToken) return;
    setProcessingProgress(this.options.state, completed, total);
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
  }

  private handleProcessingOutput(token: symbol, output: SampledFrameOutput): void {
    if (token !== this.activeCallbackToken) return;
    recordProcessingOutput(this.options.state, output);
    if (this.options.state.activeStep === "processing") {
      updateProcessingProgressUi(this.options.root, this.options.state);
    }
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
    this.activeCallbackToken = undefined;
  }
}
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 03 Complete current file: src/analysis-lifecycle.ts -->

### 04 Complete coherent current excerpts: test/unit/analysis-lifecycle.test.ts:12-28,147-197

Lines: 69  
Bytes: 2844  
SHA-256: `ee7847f3eb8c35fbdb2cfabdfb52663dc7e7cafd4245e86a9fa687aa3a8a3aef`  
Basis: exact current helper and named B-NEW1 regression ranges; the intervening tests are unrelated to this focused assertion

<!-- BEGIN EXACT BLOCK: 04 Complete coherent current excerpts: test/unit/analysis-lifecycle.test.ts:12-28,147-197 -->
````````````````````````````````````````````````
class ProcessingRoot {
  readonly status = { textContent: "", hidden: false };
  readonly summary = { textContent: "", hidden: false };
  readonly retry = { textContent: "", hidden: false };
  readonly review = { textContent: "", hidden: false };
  readonly reviewStatus = { textContent: "", hidden: false };

  querySelector(selector: string) {
    return {
      "#processing-status": this.status,
      "[data-pose-summary]": this.summary,
      "[data-retry-analysis]": this.retry,
      "[data-review-phases]": this.review,
      "#phase-review-status": this.reviewStatus
    }[selector] ?? null;
  }
}

  it("keeps same-token trailing processing callbacks from overwriting confirmed review DOM", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    const root = new ProcessingRoot();
    const requestRender = vi.fn();
    const applyAccessibilityIntent = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender,
      applyAccessibilityIntent
    });
    const token = Symbol("current");
    Object.assign(lifecycle as unknown as {
      activeCallbackToken: symbol;
      frameController: { getOutputs(): [] };
    }, {
      activeCallbackToken: token,
      frameController: { getOutputs: () => [] }
    });
    const callbacks = lifecycle as unknown as {
      handleProcessingState(token: symbol, state: "completed"): void;
      handleProcessingProgress(token: symbol, complete: number, total: number): void;
      handleProcessingOutput(token: symbol, output: SampledFrameOutput): void;
    };

    callbacks.handleProcessingState(token, "completed");
    expect(root.status.textContent).toBe("Local frame processing completed.");

    selectWorkflowStep(state, "review");
    root.reviewStatus.textContent =
      "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here.";
    const confirmedReviewStatus = root.reviewStatus.textContent;
    const querySelector = vi.spyOn(root, "querySelector");
    applyAccessibilityIntent.mockClear();

    callbacks.handleProcessingProgress(token, 7, 8);
    callbacks.handleProcessingOutput(token, {
      pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
    } as unknown as SampledFrameOutput);
    callbacks.handleProcessingState(token, "completed");

    expect(state.processingState).toBe("completed");
    expect(state.extractedFrameCount).toBe(7);
    expect(state.totalFrameCount).toBe(8);
    expect(state.latestLandmarkCount).toBe(33);
    expect(root.reviewStatus.textContent).toBe(confirmedReviewStatus);
    expect(querySelector).not.toHaveBeenCalled();
    expect(requestRender).not.toHaveBeenCalled();
    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
  });
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 04 Complete coherent current excerpts: test/unit/analysis-lifecycle.test.ts:12-28,147-197 -->

### 05 Complete coherent current excerpt: src/app-events.ts:56-75

Lines: 20  
Bytes: 951  
SHA-256: `db682d62e3ec75d1edb4d7ccfa1235dbdd9469e98341717bcbf7e0226e377bf0`  
Basis: exact completed-processing-to-review navigation ownership; preserves the active controller/token

<!-- BEGIN EXACT BLOCK: 05 Complete coherent current excerpt: src/app-events.ts:56-75 -->
````````````````````````````````````````````````
  root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextStep = button.dataset.step as WorkflowStepId;
      const opensCompletedReview =
        state.activeStep === "processing" && state.processingState === "completed" && nextStep === "review";
      const preservesReviewData =
        ["review", "export"].includes(state.activeStep) && ["review", "export"].includes(nextStep);
      if (
        ["processing", "review", "export"].includes(state.activeStep) &&
        nextStep !== state.activeStep &&
        !opensCompletedReview &&
        !preservesReviewData
      ) {
        await lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      const message = `${getWorkflowStep(state.activeStep).label} opened.`;
      requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
    });
  });
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 05 Complete coherent current excerpt: src/app-events.ts:56-75 -->

### 06 Complete coherent current excerpt: src/app-renderer.ts:150-162

Lines: 13  
Bytes: 897  
SHA-256: `438f359f30e87dfcb54d3d608404f9a4afc91a9d4df267f28864bde0841bfa89`  
Basis: exact partial updater showing its #phase-review-status query/mutation

<!-- BEGIN EXACT BLOCK: 06 Complete coherent current excerpt: src/app-renderer.ts:150-162 -->
````````````````````````````````````````````````
export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
  const status = root.querySelector<HTMLElement>("#processing-status");
  const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");
  const reviewStatus = root.querySelector<HTMLElement>("#phase-review-status");

  if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
  if (summary) summary.textContent = processingSummaryText(state);
  if (retry) retry.hidden = state.processingState !== "failed";
  if (review) review.hidden = state.processingState !== "completed";
  if (reviewStatus) reviewStatus.textContent = processingReviewStatusText(state.processingState, state.poseStatusCode);
}
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 06 Complete coherent current excerpt: src/app-renderer.ts:150-162 -->

### 07 Complete coherent current excerpt: src/phase-review-renderer.ts:5-25

Lines: 21  
Bytes: 1376  
SHA-256: `bd424c85946306c699b54fc79aa851da18f21ef08c0413b3586bf7d42989ad45`  
Basis: exact review renderer ownership and confirmed-review content for #phase-review-status

<!-- BEGIN EXACT BLOCK: 07 Complete coherent current excerpt: src/phase-review-renderer.ts:5-25 -->
````````````````````````````````````````````````
export function renderPhaseReview(state: AppState): string {
  const proposal = state.phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    ready
      ? "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here."
      : proposal?.evidenceStatus === "unsupported-input"
      ? "Select every required declaration and provide a supported active eight-sample run."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview(state)}
      <div class="phase-warning" id="phase-review-status">
        <h3 id="phase-review-heading" tabindex="-1" data-focus-key="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</h3>
        <p>${warning}</p>
      </div>
      <fieldset class="phase-declarations">
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, "phase-declaration:view", [
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 07 Complete coherent current excerpt: src/phase-review-renderer.ts:5-25 -->

### 08 Explicit absent-change record: B-NEW1 protected-boundary delta

Lines: 1  
Bytes: 333  
SHA-256: `33634692c39bb032b04655557d49202f710de25a831dcf652db5b7657e2b85a7`  
Basis: protected absence declaration

<!-- BEGIN EXACT BLOCK: 08 Explicit absent-change record: B-NEW1 protected-boundary delta -->
````````````````````````````````````````````````
No dependency, lockfile, bundle, license-policy, notice, SBOM, service-worker, telemetry, analytics, remote logging, cloud diagnostics, provider/model, remote-sharing, protected-copy, or selector change is included in the B-NEW1 repair. Only src/analysis-lifecycle.ts and test/unit/analysis-lifecycle.test.ts changed for the repair.
````````````````````````````````````````````````
<!-- END EXACT BLOCK: 08 Explicit absent-change record: B-NEW1 protected-boundary delta -->
