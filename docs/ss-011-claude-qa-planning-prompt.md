# SS-011 Claude QA Planning Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: Pre-implementation specification review for
`SS-011 Generate downloadable Swing Card`.

Verdict required: Return **PASS** only if the specification is clear enough for
Codex to implement without creating privacy, export, prompt-safety, PDF,
download-lifecycle, accessibility, or contract ambiguity. Return **FAIL** if
any blocker should be resolved before implementation.

## Project Context

Swing Sync is a local-first browser app for educational golf swing analysis.
The current implementation:

- processes selected local video with exact approved
  `@mediapipe/tasks-vision@0.10.35`;
- serves MediaPipe model and WASM assets from same-origin project assets;
- runs pose inference in a dedicated worker;
- samples up to eight ordered frames from the selected local video;
- keeps preview `ImageBitmap` frames and pose results in volatile memory;
- releases preview bitmaps through the existing `FrameProcessingController`;
- has phase review states for `address`, `toe-up`, `mid-backswing`, `top`,
  `mid-downswing`, `impact`, `mid-follow-through`, and `finish`;
- requires explicit user declarations for face-on view, handedness, mirrored
  orientation, and setup before future metric readiness;
- has SS-008 metric payload vocabulary and validation in `src/metric-contract.ts`;
- has SS-009 local geometry utilities that return measured or unavailable
  results with deterministic warnings; and
- has SS-010 selected keyframe Canvas 2D skeleton overlays in
  `src/pose-renderer.ts` and `src/pose-topology.ts`.

Privacy and safety constraints:

- Raw swing video is local-first and is not uploaded by default.
- Preview frames, annotated still canvases, landmarks, phase labels, metrics,
  prompts, and movement patterns are sensitive user data.
- Automatic remote upload, cloud storage, telemetry, remote logging, hosted
  model APIs, public serving, raw-video export, and persistence are not
  approved for SS-011.
- SS-011 may add user-initiated PNG download and browser print/save-to-PDF
  affordances only if the spec preserves protected boundaries.
- User-facing copy must not imply medical advice, injury prevention,
  rehabilitation, professional coaching, guaranteed correctness, guaranteed
  privacy, guaranteed deletion, anonymity, legal compliance, or regulatory
  compliance.
- Browser-chat prompts must be self-contained; do not assume filesystem or
  GitHub access.

## Story State

Task: `SS-011 Generate downloadable Swing Card`

Branch: `ss-011-swing-card`

Current tracker status: `2. QA Planning (Claude)` after Codex prepared this
candidate spec.

Acceptance criteria:

- Swing Card includes selected keyframes, metrics, warnings, and analysis
  prompt.
- Export works as PNG or PDF.
- No unapproved raw video is included.
- Output remains usable for manual upload to an LLM chat interface.

Dedicated test case `SS-TC-015` requires:

- selected annotated keyframes, bounded metrics, warnings or limitations, and
  manual-LLM-upload analysis prompt;
- PNG and PDF export paths that are locally generated or browser-native,
  user-initiated, and usable for manual LLM chat upload;
- no raw video, hidden identifiers, telemetry, remote sharing, persistence,
  unapproved provider behavior, unsafe copy, or sensitive diagnostics;
- bounded unavailable states for missing keyframes or metrics; and
- user-facing text within privacy and safety boundaries.

## Gemini Research Disposition Summary

Codex treated Gemini's report as input, not authority. Key decisions:

- Adopt Canvas 2D PNG composition through `toBlob("image/png")`.
- Adopt same-origin/local draw inputs, using existing volatile `ImageBitmap`
  previews and SS-010 overlay rendering.
- Revise object URL cleanup: require deferred cleanup and prior URL revocation,
  but do not promise memory frees within a fixed 100 ms or 200 ms window.
- Revise PDF: use browser `window.print()` and print CSS for print/save-to-PDF
  where supported. Do not generate binary PDFs in JavaScript.
- Reject a PDF generation library, `vitest-canvas-mock`, new dependencies,
  automatic AI API upload, and local card history.
- Reject Gemini's free-form metric interface with numeric confidence. SS-011
  must use SS-008 `SwingMetricPayload` vocabulary or a view model derived from
  it.
- Reject absolute privacy/security claims and `Math.random()` filename
  generation.
- Revise missing setup behavior: allow export if keyframes exist, but mark
  metrics unavailable/review-required and instruct prompt users not to infer
  missing values.

## Candidate Specification To Audit

SS-011 should create:

- `src/swing-card-contract.ts`
- `src/swing-card-generator.ts`
- `test/unit/swing-card-generator.test.ts`

SS-011 should modify:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`

No dependency, external fixture, new worker, model/provider change, public
serving, persistence, telemetry, remote logging, automatic upload, or
raw-video export is allowed.

### Public Contract

`src/swing-card-contract.ts` exports bounded types equivalent to:

```ts
export type SwingCardExportFormat = "png" | "print-pdf";
export type SwingCardWarningCode =
  | "NO_KEYFRAMES_SELECTED"
  | "KEYFRAME_UNAVAILABLE"
  | "METRICS_UNAVAILABLE"
  | "PHASE_REVIEW_REQUIRED"
  | "PROMPT_LIMITED_EVIDENCE"
  | "PNG_SERIALIZATION_FAILED"
  | "CANVAS_UNAVAILABLE";

export interface SwingCardKeyframe {
  phaseId: SwingMetric["phaseId"];
  phaseLabel: string;
  preview: ImageBitmap | undefined;
  overlay: PoseOverlayRenderResult | undefined;
}

export interface SwingCardContent {
  keyframes: readonly SwingCardKeyframe[];
  metricPayload: SwingMetricPayload | undefined;
  warnings: readonly SwingCardWarningCode[];
  analysisPrompt: string;
}
```

Public Swing Card types must not include raw video, raw landmarks, world
landmarks, timestamps, observed seek timestamps, selected file names, media
dimensions, object URLs, or user identifiers.

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
```

### Content Rules

- Use selected local `SampledFrameOutput.preview` `ImageBitmap` objects already
  owned by `FrameProcessingController`.
- Re-render annotated stills with `renderPoseOverlayFrame` or an equivalent
  project-owned local canvas surface.
- Do not read from the raw `File`, raw video element, or media stream during
  export.
- If a keyframe is missing, render `Keyframe unavailable`.
- Include only approved phase labels. Exclude media timestamps, sample indexes,
  requested/observed seek timestamps, filenames, and media dimensions.
- Use only existing `SwingMetricPayload`/`SwingMetric` vocabulary or a view
  model derived from it.
- Do not introduce numeric confidence scores, free-form metric names, or
  fabricated values.
- Missing prerequisites produce bounded unavailable/review-required states.

### Prompt Rules

The baseline prompt must tell the external reviewer:

- the user may manually upload a Swing Sync Card;
- use only evidence shown in the card;
- do not infer unavailable, review-required, low-evidence, or missing values;
- provide general educational observations by swing phase only;
- do not provide medical advice, pain or injury diagnosis, rehabilitation
  guidance, aggressive movement prescriptions, guaranteed injury prevention,
  guaranteed performance improvement, or a replacement for qualified golf or
  medical professionals; and
- do not claim the card is anonymous or that uploading it to another service is
  private.

### PNG Rules

- Use Canvas 2D and `canvas.toBlob()` with `image/png`.
- Treat null blob and `SecurityError` as bounded failure states.
- Never call `toDataURL()`.
- Fill a solid background.
- Use `measureText()` wrapping and preserve paragraph breaks.
- Cap effective DPR at `2` and cap exported canvas dimensions.
- Render an overflow note instead of creating unbounded canvas height.

### Download Rules

- Download is initiated by user click.
- Disable export controls during PNG generation.
- Create an object URL, append a temporary anchor, click it, remove it, and
  schedule `URL.revokeObjectURL`.
- Revoke any prior active object URL before creating a new one.
- Filename format is `swing-sync-card-YYYYMMDD-XXXXXXXX.png`.
- Use `crypto.getRandomValues()` for the suffix when available; tests may
  inject deterministic bytes. Do not use `Math.random()` in production.

### PDF Rules

- Do not generate a binary PDF file in JavaScript.
- Add `Print / Save as PDF` button that calls `window.print()`.
- Provide a print-only Swing Card DOM surface with the same selected
  keyframes, bounded metrics, warnings, and prompt text as the PNG card.
- Use `@media print`, hide controls, use block layout, and apply
  `break-inside: avoid` plus `page-break-inside: avoid` to keyframe, metric,
  warning, and prompt sections.
- Copy must describe browser print/save-to-PDF where supported, not guaranteed
  app-generated PDF behavior.

### Observability

Observability is intentionally unchanged. No logs, analytics, metrics, traces,
telemetry, debug payloads, storage writes, or console diagnostics are added.

### Test Requirements

- Unit tests for text wrapping, filename sanitization, prompt forbidden-copy
  boundaries, PNG composition, null blob failure, no `toDataURL`, image bitmap
  ownership, and object URL cleanup.
- Browser verification for fixture analysis, export control availability,
  sanitized PNG download, print action, no unexpected external requests, no
  IndexedDB or Cache API writes, no sensitive console output, mobile no
  horizontal overflow, and usable export controls.
- Required verification before final audit: `npm run test:unit`,
  `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
  `npm run privacy:verify`, and `git diff --check`.

## Your Audit Task

Attack this candidate spec before Codex implements it.

Return:

- PASS/FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Whether the PNG, PDF, prompt, privacy, and metric contracts are specific
  enough for implementation.
- Explicit sign-off status for moving SS-011 to
  `3. In Development (ChatGPT)`.

Focus especially on fail-open raw-video inclusion, hidden sensitive data in
exports or filenames, ambiguous PDF acceptance, prompt wording that invites
unsafe coaching or privacy claims, object URL lifecycle ambiguity, metric
schema drift, and tests that could pass while violating `SS-TC-015`.
