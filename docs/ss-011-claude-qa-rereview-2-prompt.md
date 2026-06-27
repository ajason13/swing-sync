# SS-011 Claude QA Focused Re-Review 2 Prompt

Role: You are the lead adversarial QA planner for Swing Sync.

Stage: B11-only focused pre-implementation specification re-review for
`SS-011 Generate downloadable Swing Card`.

Verdict required: Return **PASS** only if B11 is closed and no new blockers are
introduced by the B11 fix. Return **FAIL** if implementation should remain
blocked.

## Prior Focused Re-Review Result

You confirmed B1-B10 are closed and returned **FAIL** with one narrow new
blocker:

**B11 — `SwingCardPngResult.warnings` has no passthrough invariant.**

Both branches of `SwingCardPngResult` carry
`warnings: readonly SwingCardContentWarningCode[]`, but the spec did not state
that this must be exactly `content.warnings` unchanged. You identified this as
a small single-source-of-truth gap because `composeSwingCardPng` could
otherwise recompute, filter, reorder, or append warnings independently of
`SwingCardContent`.

## Applied B11 Fix

Codex revised `docs/ss-011-preimplementation-spec.md` to add this invariant:

```text
`SwingCardPngResult.warnings` must be exactly `content.warnings` passed
through unchanged in both success and error variants. `composeSwingCardPng`
may read `content.warnings` for rendering decisions, but it must never add,
remove, reorder, filter, or recompute warning codes before returning them.
```

Codex also revised the unit test requirements:

```text
`composeSwingCardPng` draws selected keyframes, placeholders, metrics,
warnings, and prompt text; caps DPR/dimensions at the exact values above;
returns each `SwingCardPngResult` success/error variant; never calls
`toDataURL`; passes through `content.warnings` unchanged in both success and
error variants; and does not close source `ImageBitmap` previews.
```

## Current Contract Excerpt

```ts
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

## Your Re-Review Task

Return:

- PASS/FAIL verdict.
- Whether B11 is closed.
- Any new blockers introduced by the B11 fix.
- Explicit sign-off status for moving SS-011 to
  `3. In Development (ChatGPT)`.

Focus only on B11 and the B11 patch. B1-B10 were already confirmed closed in
your prior focused re-review.
