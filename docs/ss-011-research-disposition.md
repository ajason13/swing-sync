# SS-011 Research Disposition

Status: **Codex disposition of Gemini Chat Deep Research response.**

Gemini's response is useful browser-API input, not implementation authority.
Codex verified the broad browser claims against primary sources and revised the
recommendations to preserve Swing Sync's local-first, safety, privacy,
licensing, and no-new-dependency boundaries.

## Primary Sources Checked

- MDN `HTMLCanvasElement.toBlob()`: creates a `Blob`, defaults to PNG when
  unsupported or unspecified, may store output in memory or disk at user-agent
  discretion, and throws `SecurityError` when the canvas is not origin-clean:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
- MDN `HTMLCanvasElement.toDataURL()`: warns that data URLs encode the whole
  image as an in-memory string and recommends `toBlob()` plus object URLs for
  larger images:
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
- MDN `URL.createObjectURL()` and `URL.revokeObjectURL()`: object URLs reference
  a `Blob` or `MediaSource`; callers should release object URLs when finished:
  https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
  and https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static
- MDN `<a download>`: download behavior varies by browser and user settings;
  the attribute works for same-origin, `blob:`, and `data:` URLs:
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#download
- MDN `window.print()`: opens the print dialog for the current document and
  blocks while the dialog is open:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/print
- MDN printing guide and `break-inside`: print styles can use media queries,
  and `break-inside: avoid` prevents page breaks inside an element where the
  engine can honor it:
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing
  and https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside
- MDN `CanvasRenderingContext2D.measureText()`: returns a `TextMetrics` object
  containing measured text information such as width:
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText
- Playwright downloads: tests can wait for `download`, then save with
  `download.saveAs()` and inspect the suggested filename:
  https://playwright.dev/docs/downloads

## Adopt / Revise / Defer / Reject

| Item | Gemini recommendation | Decision | Codex rationale |
| --- | --- | --- | --- |
| Canvas-derived PNG export | Use Canvas 2D composition and `toBlob("image/png")`. | Adopt with constraints | This is the smallest zero-dependency PNG path. Spec must catch null blob or `SecurityError`, avoid `toDataURL()`, and expose bounded UI errors. |
| Same-origin/local draw inputs | Draw only local `ImageBitmap` or same-origin canvas content. | Adopt | Current keyframes are volatile local `ImageBitmap` objects. No external images, remote assets, raw video, or CORS/proxy behavior are needed. |
| Object URL cleanup | Use `createObjectURL()` for downloads and revoke after download starts. | Revise | Adopt deferred cleanup, but do not promise 100 ms or memory freed within 200 ms. Spec requires cleanup scheduled after click and cleanup on next export/unload where possible. |
| Programmatic download anchor | Trigger user-initiated download with temporary anchor. | Adopt | Compatible with same-origin/blob URL download boundary. Button must be disabled during generation to prevent overlapping object URLs. |
| PDF via CSS print | Use browser print/save-to-PDF instead of a PDF library. | Revise | SS-011 can provide a print-optimized Swing Card and `window.print()` action. It cannot guarantee every browser exposes "Save as PDF" or produce an app-generated PDF blob without a library. Copy must describe this as browser print/save-to-PDF. |
| PDF library | Add `jsPDF` or equivalent for generated PDFs. | Reject | New dependency and PDF-generation surface require separate licensing, privacy, bundle, and security review. |
| `vitest-canvas-mock` | Add dependency for canvas tests. | Reject | Existing tests use fake canvas/context objects. No dependency change is needed. |
| Dynamic canvas text wrapping | Use `measureText()` based wrapping for PNG card text. | Adopt with constraints | Needed because Canvas 2D does not provide full text layout. Tests should cover long words, paragraph breaks, max line count or overflow fallback, and no text overlap. |
| Dynamic unbounded canvas height | Expand canvas height until content fits. | Revise | Spec must cap dimensions for mobile memory safety. If content exceeds the cap, render a bounded truncation/overflow note and include full prompt in adjacent UI copy, not a huge canvas. |
| High DPI scaling | Scale output for device pixel ratio. | Revise | Cap effective DPR at `2`, mirroring SS-010, and cap exported canvas dimensions. |
| Filename randomization | Use random alphanumeric hash. | Revise | Do not use `Math.random()`. Use `crypto.getRandomValues()` when available with a deterministic fallback only for tests, and avoid raw filename, phase, timestamp, or user identifiers. |
| Generated timestamp on card | Print ISO date/time in card. | Revise | Avoid full timestamps. If date is useful, use local date only or omit. Do not include millisecond timestamps or media timestamps. |
| New metric interface | Define free-form `BoundedMetricPayload` with numeric confidence. | Reject | SS-011 must consume SS-008 `SwingMetricPayload`/`SwingMetric` or a view model derived from it. Do not introduce incompatible confidence numbers or unbounded names. |
| Low visibility omits all metrics | Omit metrics when any keyframe is low confidence. | Revise | Metrics should reflect their own approved availability/status/warnings. Do not globally discard all metrics because one keyframe is partial. |
| "Raw biometric data remains secure" | Use strong security/privacy wording. | Reject | Repository rules prohibit absolute privacy/security claims. Use bounded local-first and user-control copy. |
| "Certified golf professional" wording | Mention certified professional in prompt. | Revise | Use existing safety language: qualified medical professional or qualified golf coach. Do not imply certification or professional replacement. |
| Automated AI API upload | Reject remote API upload. | Adopt rejection | Manual upload usability only. No automatic upload, provider SDK, hosted model, network request, or remote review. |
| Local file history | Defer persistence. | Adopt defer | SS-011 may only create user-initiated downloads. No card history or browser persistence. |

## Maintainer Questions Resolved

- **DPR above 2:** revise to `min(devicePixelRatio || 1, 2)` and enforce a
  maximum exported canvas dimension.
- **Keyframe source:** use existing capped preview `ImageBitmap` outputs and
  SS-010 overlay rendering. Do not reopen or reprocess raw video for export.
- **Missing setup confirmations:** allow export only after local processing has
  outputs; if phase/metric prerequisites are incomplete, include bounded
  unavailable/review-required states and prompt instructions not to infer
  missing values.

## Normative Direction For Spec

SS-011 should implement:

- a pure Swing Card content model derived from existing phase outputs, SS-010
  annotated still rendering, and SS-008 metric payload vocabulary;
- PNG export via local canvas composition and `toBlob("image/png")`;
- PDF path via print-optimized DOM and `window.print()`, explicitly described
  as browser print/save-to-PDF;
- temporary object URL download cleanup without hard memory-free guarantees;
- bounded prompt copy for manual LLM upload only; and
- tests for no raw-video inclusion, no external requests, no sensitive logs or
  storage, no new dependencies, bounded export filenames, and local cleanup.

SS-011 should not implement generated PDF binary files, remote upload,
provider SDKs, cloud storage, persistence/history, telemetry, new workers, raw
video export, raw landmarks/timestamps/filenames in exports, or new
dependencies.
