import type { WorkflowStepId } from "./workflow";

const staticFocusKeys = [
  "safety-consent",
  "camera-placeholder",
  "video-picker",
  "analysis-start",
  "stage-heading",
  "workflow-next",
  "stop-analysis",
  "retry-analysis",
  "review-phases",
  "phase-declaration:view",
  "phase-declaration:handedness",
  "phase-declaration:mirrored",
  "phase-setup",
  "phase-confirmation",
  "phase-confirm",
  "open-export",
  "phase-review-heading",
  "swing-card-heading",
  "swing-card-download",
  "swing-card-print",
  "swing-card-copy",
  "swing-card-status"
] as const;

type StaticFocusKey = (typeof staticFocusKeys)[number];
type DynamicFocusKey =
  | `workflow-step:${WorkflowStepId}`
  | `phase-assignment:${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`
  | `keyframe:${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`;

export type FocusKey = StaticFocusKey | DynamicFocusKey;

export interface AccessibilityIntent {
  focusKey?: FocusKey;
  announcement?: string;
}

export interface RenderRequest extends AccessibilityIntent {
  visibleStatusText?: string;
}

export function isFocusKey(value: unknown): value is FocusKey {
  if (typeof value !== "string") return false;
  if ((staticFocusKeys as readonly string[]).includes(value)) return true;
  if (/^workflow-step:(capture|processing|review|export)$/.test(value)) return true;
  return /^(phase-assignment|keyframe):[0-7]$/.test(value);
}

export function capturePriorFocusKey(root: ParentNode, activeElement: Element | null = document.activeElement): FocusKey | undefined {
  if (!activeElement || !root.contains(activeElement)) return undefined;
  const value = activeElement.getAttribute("data-focus-key");
  return isFocusKey(value) ? value : undefined;
}

export function findFocusTarget(root: ParentNode, key: FocusKey | undefined): HTMLElement | undefined {
  if (!key || !isFocusKey(key)) return undefined;
  const target = [...root.querySelectorAll<HTMLElement>("[data-focus-key]")].find(
    (element) => element.getAttribute("data-focus-key") === key
  );
  return target && isEligibleFocusTarget(target) ? target : undefined;
}

export function isEligibleFocusTarget(target: HTMLElement): boolean {
  if (!target.isConnected || target.hidden || target.getAttribute("aria-hidden") === "true") return false;
  if (target.tabIndex > 0 || "disabled" in target && Boolean((target as HTMLButtonElement).disabled)) return false;
  if (target.closest("[hidden], [inert], [aria-hidden='true']")) return false;
  const view = target.ownerDocument.defaultView;
  if (view) {
    const style = view.getComputedStyle(target);
    if (style.display === "none" || style.visibility === "hidden") return false;
  }
  return true;
}

export function viewFallbackKey(view: WorkflowStepId, hasPhaseOutputs: boolean): FocusKey {
  if (view === "review" && hasPhaseOutputs) return "phase-review-heading";
  if (view === "export" && hasPhaseOutputs) return "swing-card-heading";
  return "stage-heading";
}

function focusOnce(target: HTMLElement | undefined): void {
  if (target && target.ownerDocument.activeElement !== target) target.focus();
}

function announce(announcer: HTMLElement | null, message: string | undefined): void {
  if (announcer && message !== undefined) announcer.textContent = message;
}

export function applyPostRenderAccessibility(
  root: ParentNode,
  announcer: HTMLElement | null,
  view: WorkflowStepId,
  hasPhaseOutputs: boolean,
  intent: AccessibilityIntent = {},
  priorFocusKey?: FocusKey
): void {
  const explicit = isFocusKey(intent.focusKey) ? findFocusTarget(root, intent.focusKey) : undefined;
  const prior = explicit ? undefined : findFocusTarget(root, priorFocusKey);
  const fallback = explicit || prior ? undefined : findFocusTarget(root, viewFallbackKey(view, hasPhaseOutputs));
  focusOnce(explicit ?? prior ?? fallback);
  announce(announcer, intent.announcement);
}

export function applyAccessibilityIntent(
  root: ParentNode,
  announcer: HTMLElement | null,
  intent: AccessibilityIntent
): void {
  focusOnce(isFocusKey(intent.focusKey) ? findFocusTarget(root, intent.focusKey) : undefined);
  announce(announcer, intent.announcement);
}
