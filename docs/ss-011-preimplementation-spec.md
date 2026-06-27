# SS-011 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)` once submitted. This
specification defines the candidate implementation contract and may be used
only after Claude QA planning returns PASS or blocking findings are resolved.**

## Scope

SS-011 generates a downloadable Swing Card from the existing local review
workflow. The card may include selected annotated keyframe stills, bounded
metric summaries, warnings or limitations, and manual LLM-upload prompt text.
It must preserve the local-first raw-video boundary and must not add automatic
remote upload, raw-video export, persistence, telemetry, remote logging,
provider SDKs, public serving, new workers, or new dependencies.

In scope:

- a zero-dependency Swing Card content model;
- local PNG export through Canvas 2D composition and `toBlob("image/png")`;
- browser-native print/save-to-PDF path through a print-optimized Swing Card
  DOM surface and `window.print()`;
- user-initiated download controls and temporary object URL cleanup;
- reuse of SS-010 selected annotated still rendering;
- bounded metric and warning presentation derived from SS-008/SS-009
  contracts;
- manual LLM-upload prompt text with safety and privacy constraints;
- mobile and desktop usable export UI; and
- unit and browser verification mapped to `SS-TC-015`.

Out of scope:

- raw swing video export or embedding;
- automatic LLM upload, hosted model APIs, remote sharing, cloud storage,
  telemetry, remote logging, public serving, or coach review;
- generated binary PDF files from an in-app PDF library;
- new dependencies, SDKs, workers, model assets, or provider changes;
- persisted card history, local database storage, or cache storage;
- metric schema expansion outside SS-008;
- raw landmarks, world landmarks, timestamps, media characteristics, selected
  filename, object URLs, user identifiers, or raw coordinate arrays in export
  content, prompt text, logs, filenames, or storage; and
- medical, injury, rehabilitation, professional coaching, guaranteed
  correctness, guaranteed privacy, guaranteed deletion, anonymity, legal, or
  compliance claims.

## Protected Contracts

SS-011 must preserve:

- SS-005 approved MediaPipe version, same-origin model/WASM assets, worker
  inference, volatile frame/landmark handling, and fail-closed unexpected
  network behavior;
- SS-006 fixed-budget ordered sample queue, capped preview `ImageBitmap`
  outputs, cleanup, cancellation/retry, and no sensitive diagnostics;
- SS-007 phase IDs, required user declarations, manual-review-only readiness,
  and no automatic confidence acceptance;
- SS-008 metric schema vocabulary, `caddieSetEquivalence: "not-equivalent"`,
  recursive prohibited-key strategy, and no sensitive metric-payload keys;
- SS-009 geometry unavailable/warning semantics and no correctness/coaching
  claims; and
- SS-010 annotated still renderer ownership: render from preview `ImageBitmap`
  objects, draw non-facial 18-segment overlays, do not close preview bitmaps in
  the renderer, and avoid cached annotated pixels across keyframe switches.

## Artifact Contract

Create:

- `src/swing-card-contract.ts`
- `src/swing-card-generator.ts`
- `test/unit/swing-card-generator.test.ts`

Modify:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`

Do not add a dependency. Do not add external fixtures. Do not add a new worker.

## Public Contract

`src/swing-card-contract.ts` exports:

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
```

Codex may add helper interfaces if they preserve the same constraints. Public
types must not include raw video, raw landmarks, world landmarks, timestamps,
observed seek timestamps, selected file names, media dimensions, object URLs,
or user identifiers.

`SwingCardContentWarningCode` is pre-export content availability state shared
by PNG, print, and prompt rendering. PNG export failure state must never be
inserted into `SwingCardContent.warnings`; it belongs only in the
`SwingCardPngResult` error variant.
`SwingCardPngResult.warnings` must be exactly `content.warnings` passed
through unchanged in both success and error variants. `composeSwingCardPng`
may read `content.warnings` for rendering decisions, but it must never add,
remove, reorder, filter, or recompute warning codes before returning them.

`src/swing-card-generator.ts` exports:

```ts
export function buildSwingCardPrompt(content: SwingCardContent): string;
export function sanitizeSwingCardFilename(now?: Date): string;
export function wrapCanvasText(
  context: Pick<CanvasRenderingContext2D, "measureText">,
  text: string,
  maxWidth: number
): readonly string[];
export function composeSwingCardPng(content: SwingCardContent): Promise<SwingCardPngResult>;
export function triggerSwingCardDownload(blob: Blob, filename: string): void;
export function renderSwingCardPrintSurface(content: SwingCardContent): HTMLElement;
```

`composeSwingCardPng` must create a detached canvas element in the main thread.
It must not use `OffscreenCanvas` unless separately approved, because a new
worker or cross-thread pixel lifecycle is not in scope.

`src/swing-card-contract.ts` must import
`PoseOverlayRenderResult` from `./pose-renderer`; it must not re-declare or
shadow the SS-010 overlay result type.

## Content Model

Keyframes:

- Use selected local `SampledFrameOutput.preview` `ImageBitmap` objects already
  owned by `FrameProcessingController`.
- Re-render annotated stills into the Swing Card composition using
  the existing SS-010 `renderPoseOverlayFrame` function on a detached canvas.
  No alternate overlay-rendering implementation is allowed; helper wrappers
  must delegate to `renderPoseOverlayFrame`.
- Do not read from the raw `File`, raw video element, or media stream during
  export.
- If a selected keyframe, preview, or overlay result is missing, render a
  bounded placeholder: `Keyframe unavailable`. A card renderer must never draw
  a bare `preview` bitmap into PNG or print output without a corresponding
  overlay result from `renderPoseOverlayFrame`.
- Include phase labels only from the approved phase vocabulary.
- Do not include media timestamps, sample indexes, requested/observed seek
  timestamps, filenames, or media dimensions in the visible card or prompt.

Metrics:

- Use an existing `SwingMetricPayload` exactly as typed in
  `src/metric-contract.ts`, or `undefined` when no approved metric payload is
  available.
- Preserve `schemaVersion: "0.1.0"` and
  `caddieSetEquivalence: "not-equivalent"` without transforming the payload
  into an alternate untyped view model.
- Display only bounded fields: metric name, value status/value, units, phase,
  handedness, confidence kind, and limitation notes.
- Do not introduce numeric confidence scores or free-form metric names.
- Do not recompute, override, relax, or fabricate metric availability. SS-011
  may read existing `SwingMetricPayload` values and statuses to format display
  text, but upstream SS-008/SS-009 validation owns metric validity.
- If metrics are missing or prerequisites are incomplete, show
  `Metrics unavailable` or `Review required` and add
  `METRICS_UNAVAILABLE`/`PHASE_REVIEW_REQUIRED`; do not fabricate values.

Warnings and limitations:

- Use bounded content warning codes and approved limitation codes.
- Content warning codes are unique and sorted in this order when present:
  `NO_KEYFRAMES_SELECTED`, `KEYFRAME_UNAVAILABLE`, `METRICS_UNAVAILABLE`,
  `PHASE_REVIEW_REQUIRED`, `PROMPT_LIMITED_EVIDENCE`.
- Warning trigger table:
  - `NO_KEYFRAMES_SELECTED`: `content.keyframes.length === 0`.
  - `KEYFRAME_UNAVAILABLE`: at least one selected keyframe has no `preview` or
    no `overlay`, or the overlay status is `unavailable`.
  - `METRICS_UNAVAILABLE`: `metricPayload` is `undefined`, has no metrics, or
    every metric value status is not `measured`.
  - `PHASE_REVIEW_REQUIRED`: phase review is missing, invalid, or not
    explicitly confirmed before export.
  - `PROMPT_LIMITED_EVIDENCE`: any selected keyframe overlay is `partial`, any
    metric confidence kind is `low-evidence`, or any displayed metric has
    limitation notes other than `none`.
- Multiple content warning codes may co-occur. Do not collapse
  `PHASE_REVIEW_REQUIRED` into `METRICS_UNAVAILABLE`; include both when both
  trigger conditions are true.
- Warnings must be visible in the PNG and print layout and represented in the
  prompt as constraints, not as coaching conclusions.
- Any low-confidence, partial, or unavailable evidence must instruct a manual
  LLM reviewer not to infer missing values.

Prompt:

- Include prompt text in the card and in adjacent UI copy for copying.
- The prompt must say manual upload is the user's separate action.
- The prompt must not imply automatic upload, remote review, provider behavior,
  guaranteed correctness, medical advice, injury prevention, rehabilitation,
  professional coaching, privacy guarantees, deletion guarantees, anonymity,
  legal compliance, or regulatory compliance.
- Required prompt baseline:

```text
Act as an educational golf movement assistant. I may manually upload a Swing
Sync Card that contains selected annotated keyframe stills, bounded local
metric summaries, and warnings or limitations from my swing review.

Use only the evidence shown in the card. If a metric or keyframe is marked
unavailable, review-required, low-evidence, or limited, do not guess or fill in
missing values.

Provide general educational observations by swing phase. Do not provide medical
advice, pain or injury diagnosis, rehabilitation guidance, aggressive movement
prescriptions, guaranteed injury prevention, guaranteed performance
improvement, or a replacement for a qualified golf coach or qualified medical
professional.

Do not claim the card is anonymous or that uploading it to another service is
private. After I upload or share the downloaded file, that service's terms and
privacy practices apply.
```

## PNG Export Rules

- `composeSwingCardPng` uses Canvas 2D and serializes with `canvas.toBlob()`.
- The requested MIME type must be `image/png`.
- If the canvas context is unavailable, return
  `{ status: "error", reason: "CANVAS_UNAVAILABLE", warnings: content.warnings }`.
- If `toBlob` calls back with `null`, return
  `{ status: "error", reason: "PNG_NULL_BLOB", warnings: content.warnings }`.
- If `toBlob` throws `SecurityError`, return
  `{ status: "error", reason: "PNG_SECURITY_ERROR", warnings: content.warnings }`.
- Other serialization failures return
  `{ status: "error", reason: "PNG_SERIALIZATION_FAILED", warnings: content.warnings }`.
- Do not call `toDataURL()`.
- Fill a solid background before drawing content so the PNG is legible in
  image viewers.
- Use `measureText()`-based wrapping for all canvas text.
- Preserve paragraph breaks.
- Export canvas CSS width is exactly `960` px.
- Export canvas CSS height is capped at `1600` px.
- Backing-store width and height are capped at `1920` px by `3200` px after DPR
  scaling.
- Effective DPR must be `min(devicePixelRatio || 1, 2)` and must not exceed
  SS-010's cap of `2`.
- If content would exceed `1600` CSS px height before footer/padding, stop
  rendering additional optional prompt/detail lines and render the visible
  overflow note: `Additional prompt details are available in the copy prompt.`
  This is a PNG presentation fallback only and must not add a content warning
  code.
- Use high-contrast text but do not claim guaranteed contrast against all
  backgrounds.

## Download And Filename Rules

- The PNG download action must be initiated from a user click.
- Disable PNG and print controls while PNG generation is in progress.
- `triggerSwingCardDownload` creates an object URL, appends a temporary anchor,
  sets `download`, clicks it, removes the anchor, and schedules
  `URL.revokeObjectURL`.
- `triggerSwingCardDownload` owns a module-scoped `activeObjectUrl` singleton.
  At the start of every call, it must synchronously call
  `URL.revokeObjectURL(activeObjectUrl)` and clear it before creating a new
  object URL.
- After clicking the temporary anchor, it removes the anchor and schedules
  revocation for the newly created object URL. If a later call already revoked
  that URL first, the scheduled cleanup must be harmless.
- Do not promise that memory is freed within a specific time; browsers control
  actual release behavior.
- Filename format:
  `swing-sync-card-YYYYMMDD-XXXXXXXX.png`
- The random suffix must be generated from `crypto.getRandomValues()` when
  available. Tests may inject a deterministic byte source. Do not use
  `Math.random()` in production.
- The `YYYYMMDD` date comes from wall-clock time captured at the export click
  with `new Date()`. It must never derive from video, frame, session,
  requested seek, observed seek, pose, or media metadata.
- Filenames must not include selected video filename, phase names, timestamps,
  user identifiers, or metric values.

## PDF Path Rules

SS-011 must not generate a binary PDF file in JavaScript. Instead:

- Add a visible `Print / Save as PDF` action that calls `window.print()`.
- Provide a print-only Swing Card DOM surface with the same selected keyframes,
  bounded metrics, warnings, and prompt text as the PNG card.
- The print surface must be produced by `renderSwingCardPrintSurface(content)`,
  using the exact same `SwingCardContent` value passed to
  `composeSwingCardPng`. No independent metric/warning/keyframe availability
  derivation may live in `main.ts` or the print code path.
- Use `@media print` styles to hide navigation, controls, and non-card UI.
- Use block layout for print surfaces and apply `break-inside: avoid` plus
  legacy `page-break-inside: avoid` to keyframe, metric, warning, and prompt
  sections.
- Print CSS must use only local/system fonts. Do not add external `@import`,
  CDN fonts, remote images, or other print-only network dependencies.
- Copy must say the user's browser print dialog can be used to print or save
  as PDF where supported. Do not claim Swing Sync creates a generated PDF file
  or controls printer/browser PDF behavior.

## UI Integration

- Export controls appear only when local analysis has completed and review data
  exists.
- The current export placeholder remains disabled before data is available.
- The Swing Card preview should be in the export step and not nested inside
  extra card-on-card containers.
- PNG generation must be guarded by synchronous module/UI state, not only by
  the DOM `disabled` attribute. A second PNG click while generation is in
  progress must return without starting another composition or object URL
  download.
- Buttons:
  - `Download PNG`
  - `Print / Save as PDF`
  - `Copy prompt`
- Copy prompt action copies only prompt text, not raw metrics JSON, landmarks,
  timestamps, filenames, or object URLs.
- Missing phase declarations or unconfirmed phase review should not block the
  export entirely if keyframes exist; instead, metrics are unavailable and the
  prompt/warnings instruct not to infer missing values.

## Privacy, Safety, And Observability

- No raw video is included in the PNG, print surface, prompt, filename, object
  URL text, logs, storage, network requests, or tests.
- No local persistence is added. Downloads are user-controlled files outside
  app storage.
- No telemetry, analytics, traces, debug payloads, remote logging, or console
  diagnostics are added.
- Observability is intentionally unchanged: existing sanitized UI states are
  sufficient for export success/failure.
- User-facing copy must use bounded language from `docs/privacy-architecture.md`
  and `docs/safety-terms.md`.

## Test Requirements

Unit tests:

- `wrapCanvasText` preserves paragraph breaks, wraps long text, handles
  single long words without infinite loops, and respects max width using a fake
  `measureText` context.
- `sanitizeSwingCardFilename` returns the approved format and excludes unsafe
  identifiers; production calls use wall-clock export-click time.
- `buildSwingCardPrompt` includes manual upload, evidence-only, unavailable
  metric, educational-use, qualified-professional, and external-service terms
  language; it excludes forbidden claims.
- Content warning derivation covers each trigger in the warning table,
  preserves deterministic order, deduplicates codes, and allows required
  co-occurrence.
- Undefined overlay with defined preview renders `Keyframe unavailable` and
  never draws the bare preview bitmap.
- `composeSwingCardPng` draws selected keyframes, placeholders, metrics,
  warnings, and prompt text; caps DPR/dimensions at the exact values above;
  returns each `SwingCardPngResult` success/error variant; never calls
  `toDataURL`; passes through `content.warnings` unchanged in both success and
  error variants; and does not close source `ImageBitmap` previews.
- `renderSwingCardPrintSurface` uses the same `SwingCardContent` as PNG and
  exposes equivalent keyframe count, content warnings, metric text, and prompt
  text for tests.
- `triggerSwingCardDownload` creates and revokes object URLs, removes temporary
  anchors, revokes prior active URLs synchronously before creating new ones,
  and covers sequential calls.

Smoke/browser verification:

- Local fixture analysis reaches review, export controls appear, `Download PNG`
  produces a non-empty `.png` with sanitized filename, and no unexpected
  external requests occur during export.
- The print action calls `window.print()` or exposes a print path in a
  testable way without generated PDF libraries.
- No IndexedDB or Cache API entries are created.
- Console output does not contain landmarks, world landmarks, timestamps,
  selected filename, media characteristics, metric JSON, object URLs, or raw
  prompt payload dumps.
- Mobile viewport `390x844` has no horizontal overflow, and each new export,
  print, and prompt button has computed minimum height of at least `44` px.
- The print stylesheet applies `break-inside: avoid` or
  `page-break-inside: avoid` to keyframe, metric, warning, and prompt sections
  under print-media emulation.
- Export composition does not leave extra persistent export canvases in the
  DOM after generation completes.
- `git diff --check`, `npm run test:unit`, `npm run build`,
  `npm run compliance:verify`, `npm run safety:verify`, and
  `npm run privacy:verify` must pass before final audit. Dependency-related
  checks are required if the implementation unexpectedly changes dependencies.
