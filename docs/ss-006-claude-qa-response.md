# SS-006 Claude QA Planning Response

Claude returned **FAIL** on 2026-06-12 and instructed SS-006 to remain at
`2. QA Planning (Claude)`.

## Findings Addressed

- **B1 negative-duration contradiction: fixed.** The normative algorithm now
  validates finite positive duration before `floor`/`max` timestamp
  calculations and produces no timestamps on invalid input.
- **B2 queue-layer invalid-duration defense: fixed.** `NaN`, `Infinity`, zero,
  and negative duration fail in the queue/controller before seeking, bitmap
  creation, PoseSession initialization, or worker calls.
- **B3 failure-path bitmap cleanup: fixed.** Failure invalidates first and
  closes the current uncommitted preview, all accumulated previews, and any
  application-owned untransferred inference bitmap. Per-sample preview-first
  creation and atomic output assembly define exception ownership.
- **B4 stale-check placement: fixed.** Every asynchronous media, bitmap, status,
  and result callback validates generation and expected state before any state
  transition, bitmap creation, output/progress mutation, or follow-on work.
- **B5 retry worker coexistence: fixed.** Retry waits for the prior PoseSession
  to reach confirmed terminal `closed` or `error` before constructing a new
  session. Two controller PoseSessions must never coexist.

## Non-Blocking Recommendations Addressed

- Per-sample creation order is preview first, then separate natural-frame
  inference bitmap, immediate submission, result acceptance, and atomic output
  append. Any later failure closes the uncommitted preview.
- Retry revokes the prior active object URL and creates a fresh URL from the
  intentionally retained local `File`.
- `cancelling` is an internal cleanup phase; the UI exposes `cancelled`.
- Inference uses the natural browser video frame and is not governed by preview
  scaling.
- The raw preview output field documents current-owner close responsibility.
- Programmatically generated canvas sources are preferred for orientation
  bitmap tests.
- The spec records conservative floating-point duration conversion and keeps
  observed seek timestamps out of diagnostics, persistence, transit, and
  future exports absent a reviewed change.

## Tracker Response

Dedicated `SS-TC-010` is updated with explicit closure evidence for:

- negative, `NaN`, and infinite duration queue-layer rejection before work;
- sub-eight-millisecond deduplication;
- current and accumulated preview cleanup on all failure paths;
- stale checks before state/output/bitmap mutation;
- stale `seeked` behavior;
- prior-session terminal completion before retry session creation; and
- observed seek timestamps excluded from diagnostics/storage/transit.

## Gate

Implementation remains blocked pending focused Claude QA re-review PASS.
