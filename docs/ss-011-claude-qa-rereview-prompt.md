# SS-011 Claude QA Focused Re-Review Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Focused pre-implementation specification re-review for
`SS-011 Generate downloadable Swing Card`.

Verdict required: Return **PASS** only if the revised specification closes
B1-B10 from your prior QA planning review without introducing new blockers.
Return **FAIL** if any blocker remains before Codex can implement.

## Prior Verdict

You returned **FAIL** with ten blockers:

- B1: `SwingCardPngResult` referenced but never defined.
- B2: content warnings and PNG export failures were conflated in one warning
  enum.
- B3: `metricPayload` was strictly typed as `SwingMetricPayload | undefined`
  but prose allowed an undefined derived view model.
- B4: undefined overlay with defined preview had no required fallback behavior.
- B5: PNG/print content parity had no structural shared-rendering guarantee.
- B6: "or equivalent" overlay wording allowed a parallel renderer.
- B7: exported canvas dimension caps had no exact numeric values.
- B8: object URL singleton lifecycle and prior-revocation ordering were
  underspecified.
- B9: filename date source was not pinned to wall-clock export-click time.
- B10: `PoseOverlayRenderResult` import/reuse was not pinned to SS-010 source.

## Applied Fixes To Review

Codex revised `docs/ss-011-preimplementation-spec.md` as follows:

- Defined `SwingCardPngResult` as a discriminated union:
  - success: `{ status: "ok"; blob; filename; warnings }`
  - error: `{ status: "error"; reason; warnings }`
- Split `SwingCardContentWarningCode` from `SwingCardPngFailureReason`.
  Content warnings now cover only pre-export content availability:
  `NO_KEYFRAMES_SELECTED`, `KEYFRAME_UNAVAILABLE`, `METRICS_UNAVAILABLE`,
  `PHASE_REVIEW_REQUIRED`, and `PROMPT_LIMITED_EVIDENCE`.
  PNG failure reasons now cover only export failures:
  `CANVAS_UNAVAILABLE`, `PNG_NULL_BLOB`, `PNG_SECURITY_ERROR`, and
  `PNG_SERIALIZATION_FAILED`.
- Required `metricPayload: SwingMetricPayload | undefined` exactly and removed
  the implicit derived-view-model escape hatch.
- Required missing preview, missing keyframe, or missing overlay to render
  `Keyframe unavailable`; no renderer may draw a bare preview bitmap without a
  `renderPoseOverlayFrame` result.
- Added `renderSwingCardPrintSurface(content: SwingCardContent): HTMLElement`
  and required print and PNG paths to consume the exact same
  `SwingCardContent` value.
- Replaced "or equivalent" overlay wording with mandatory direct reuse of
  SS-010 `renderPoseOverlayFrame` or a thin delegating wrapper.
- Pinned export canvas caps:
  - CSS width: `960` px
  - CSS height cap: `1600` px
  - backing-store cap: `1920` px by `3200` px
  - DPR cap remains `2`
  - overflow note text:
    `Additional prompt details are available in the copy prompt.`
- Specified module-scoped `activeObjectUrl`, synchronous prior revocation
  before new object URL creation, harmless scheduled cleanup, and sequential
  call tests.
- Required filename date to come from wall-clock `new Date()` captured at
  export click, never from video/session/seek/media state.
- Required `PoseOverlayRenderResult` import from `./pose-renderer`; shadow
  re-declaration is prohibited.

Additional updates:

- Added deterministic content warning trigger table, warning order,
  deduplication, and co-occurrence rules.
- Added tests for PNG result branches, content warning triggers, undefined
  overlay fallback, print/PNG parity, sequential object URL revocation, exact
  mobile viewport and `minButtonHeight >= 44`, print break-avoidance styles,
  and no persistent export canvas leakage.
- Required print CSS to use only local/system fonts and no external print-only
  network dependencies.
- Required a synchronous generation-in-progress guard.
- Clarified the PNG overflow note is a rendering presentation fallback, not a
  content warning.

## Revised Specification Excerpts

Audit these excerpts as the source of truth for focused re-review:

```ts
import type { SwingMetric, SwingMetricPayload } from "./metric-contract";
import type { PoseOverlayRenderResult } from "./pose-renderer";

export type SwingCardExportFormat = "png" | "print-pdf";
export type SwingCardContentWarningCode =
  | "NO_KEYFRAMES_SELECTED"
  | "KEYFRAME_UNAVAILABLE"
  | "METRICS_UNAVAILABLE"
  | "PHASE_REVIEW_REQUIRED"
  | "PROMPT_LIMITED_EVIDENCE";

export type SwingCardPngFailureReason =
  | "CANVAS_UNAVAILABLE"
  | "PNG_NULL_BLOB"
  | "PNG_SECURITY_ERROR"
  | "PNG_SERIALIZATION_FAILED";

export interface SwingCardKeyframe {
  phaseId: SwingMetric["phaseId"];
  phaseLabel: string;
  preview: ImageBitmap | undefined;
  overlay: PoseOverlayRenderResult | undefined;
}

export interface SwingCardContent {
  keyframes: readonly SwingCardKeyframe[];
  metricPayload: SwingMetricPayload | undefined;
  warnings: readonly SwingCardContentWarningCode[];
  analysisPrompt: string;
}

export type SwingCardPngResult =
  | {
      status: "ok";
      blob: Blob;
      filename: string;
      warnings: readonly SwingCardContentWarningCode[];
    }
  | {
      status: "error";
      reason: SwingCardPngFailureReason;
      warnings: readonly SwingCardContentWarningCode[];
    };

export function renderSwingCardPrintSurface(content: SwingCardContent): HTMLElement;
```

Key revised rules:

- PNG export failure state must never be inserted into
  `SwingCardContent.warnings`.
- `src/swing-card-contract.ts` must import `PoseOverlayRenderResult` from
  `./pose-renderer`; it must not re-declare or shadow the SS-010 overlay type.
- Re-render annotated stills using the existing SS-010
  `renderPoseOverlayFrame` function. No alternate overlay implementation is
  allowed.
- If selected keyframe, preview, or overlay result is missing, render
  `Keyframe unavailable`; never draw bare `preview` without overlay result.
- Use exact `SwingMetricPayload | undefined`; do not define an implicit
  alternate metric view model.
- `renderSwingCardPrintSurface(content)` and `composeSwingCardPng(content)`
  consume the same `SwingCardContent`; no independent metric/warning/keyframe
  availability derivation may live in `main.ts` or print code.
- Object URL lifecycle uses module-scoped `activeObjectUrl`; each call revokes
  the prior URL synchronously before creating a new one.
- Filename date comes from wall-clock export-click `new Date()` only.

## Your Re-Review Task

Return:

- PASS/FAIL verdict.
- Whether each prior blocker B1-B10 is closed.
- Any new blockers introduced by the revised spec.
- Missing tests or edge cases that still block implementation.
- Explicit sign-off status for moving SS-011 to
  `3. In Development (ChatGPT)`.

Focus only on the revised spec and B1-B10 closure unless you find a new
blocking issue. Do not repeat non-blocking recommendations that are already
captured unless they remain implementation blockers.
