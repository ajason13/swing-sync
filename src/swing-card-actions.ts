import { metricUnavailableReason } from "./metric-presentation";
import { isSwingMetricPayload } from "./metric-contract";
import type { AppState } from "./app-state";
import type { RenderRequest } from "./app-accessibility";
import {
  getCompleteSwingCardAssignments,
  setSwingCardBusy,
  setSwingCardStatus
} from "./app-state";
import type { PhaseAssignment } from "./phase-review";
import { phaseDefinitions } from "./phase-review";
import type { SwingCardContent, SwingCardKeyframe } from "./swing-card-contract";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  triggerSwingCardDownload
} from "./swing-card-generator";
import type { SampledFrameOutput } from "./frame-processing";
import { renderAnnotatedKeyframe } from "./keyframe-overlay-renderer";

export interface PreparedSwingCardContent {
  content: SwingCardContent;
  release(): void;
}

export async function downloadSwingCard(state: AppState, requestRender: (request?: RenderRequest) => void): Promise<void> {
  if (state.swingCardBusy) return;
  const token = state.swingCardToken;
  const isCurrent = () => state.swingCardToken === token;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing local Swing Card PNG.");
  requestRender({
    focusKey: "swing-card-status",
    visibleStatusText: state.swingCardStatus,
    announcement: state.swingCardStatus
  });
  let prepared: PreparedSwingCardContent | undefined;
  try {
    prepared = await prepareSwingCardContent(state, isCurrent);
    if (!isCurrent()) return;
    const result = await composeSwingCardPng(prepared.content);
    if (!isCurrent()) return;
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      setSwingCardStatus(state, "Swing Card PNG download started.");
    } else {
      setSwingCardStatus(state, `Swing Card PNG export stopped (${result.reason}).`);
    }
  } catch {
    if (!isCurrent()) return;
    setSwingCardStatus(state, "Swing Card PNG export stopped (LOCAL_EXPORT_FAILED).");
  } finally {
    prepared?.release();
    if (isCurrent()) {
      setSwingCardBusy(state, false);
      requestRender({
        focusKey: "swing-card-download",
        visibleStatusText: state.swingCardStatus,
        announcement: state.swingCardStatus
      });
    }
  }
}

export async function printSwingCard(
  root: ParentNode,
  state: AppState,
  requestRender: (request?: RenderRequest) => void
): Promise<void> {
  if (state.swingCardBusy) return;
  const token = state.swingCardToken;
  const isCurrent = () => state.swingCardToken === token;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing browser print view.");
  requestRender({
    focusKey: "swing-card-status",
    visibleStatusText: state.swingCardStatus,
    announcement: state.swingCardStatus
  });
  let prepared: PreparedSwingCardContent | undefined;
  try {
    prepared = await prepareSwingCardContent(state, isCurrent);
    if (!isCurrent()) return;
    const host = root.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    setSwingCardStatus(state, "Browser print dialog opened. Save as PDF if your browser supports it.");
    window.print();
  } catch {
    if (!isCurrent()) return;
    setSwingCardStatus(state, "Browser print view could not be prepared.");
  } finally {
    prepared?.release();
    if (isCurrent()) {
      setSwingCardBusy(state, false);
      requestRender({
        focusKey: "swing-card-print",
        visibleStatusText: state.swingCardStatus,
        announcement: state.swingCardStatus
      });
    }
  }
}

export async function copySwingCardPrompt(state: AppState, requestRender: (request?: RenderRequest) => void): Promise<void> {
  if (state.swingCardBusy) return;
  const token = state.swingCardToken;
  const isCurrent = () => state.swingCardToken === token;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing prompt text.");
  requestRender({
    focusKey: "swing-card-status",
    visibleStatusText: state.swingCardStatus,
    announcement: state.swingCardStatus
  });
  let prepared: PreparedSwingCardContent | undefined;
  try {
    prepared = await prepareSwingCardContent(state, isCurrent);
    if (!isCurrent()) return;
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    if (!isCurrent()) return;
    setSwingCardStatus(state, "Prompt copied for manual use.");
  } catch {
    if (!isCurrent()) return;
    setSwingCardStatus(state, "Prompt copy unavailable in this browser.");
  } finally {
    prepared?.release();
    if (isCurrent()) {
      setSwingCardBusy(state, false);
      requestRender({
        focusKey: "swing-card-copy",
        visibleStatusText: state.swingCardStatus,
        announcement: state.swingCardStatus
      });
    }
  }
}

export async function prepareSwingCardContent(
  state: AppState,
  isCurrent: () => boolean = () => true
): Promise<PreparedSwingCardContent> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments(state);
  const outputs = state.phaseOutputs;
  const phaseReviewConfirmed = (state.phaseReviewState?.readyForFutureMetrics ?? false) && hasCompleteAssignments(assignments);
  // Snapshot only a validated current payload; never retain a live mutable export input.
  const metricPayload = phaseReviewConfirmed && isSwingMetricPayload(state.metricPayload)
    ? structuredClone(state.metricPayload) : undefined;
  const token = state.swingCardToken;
  const sourcePayload = state.metricPayload;
  const release = () => {
    for (const bitmap of createdBitmaps.splice(0)) bitmap.close();
  };
  const checkCurrent = () => {
    if (!isCurrent() || state.swingCardToken !== token || state.metricPayload !== sourcePayload) throw new Error("LOCAL_EXPORT_CANCELLED");
  };

  try {
    for (const phase of phaseDefinitions) {
      checkCurrent();
      const assignment = assignments?.find((item) => item.phaseId === phase.id);
      const output = assignment ? outputs[assignment.sampleIndex] : undefined;
      const rendered = output ? await renderAnnotatedKeyframeWithoutTiming(output) : undefined;
      if (rendered?.preview) createdBitmaps.push(rendered.preview);
      checkCurrent();
      keyframes.push({
        phaseId: phase.id,
        phaseLabel: phase.label,
        preview: rendered?.preview,
        overlay: rendered?.overlay
      });
    }

    const warnings = deriveSwingCardContentWarnings({
      keyframes,
      metricPayload,
      phaseReviewConfirmed
    });
    const base: SwingCardContent = {
      keyframes,
      metricPayload,
      metricUnavailableReason: metricUnavailableReason(state.phaseDeclarations),
      warnings,
      analysisPrompt: ""
    };
    const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
    return {
      content,
      release
    };
  } catch (error) {
    release();
    throw error;
  }
}

async function renderAnnotatedKeyframeWithoutTiming(output: SampledFrameOutput) {
  return renderAnnotatedKeyframe(output);
}

function hasCompleteAssignments(assignments: readonly PhaseAssignment[] | undefined): boolean {
  return !!assignments;
}
