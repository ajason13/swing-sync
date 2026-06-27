# SS-011 Claude QA Planning Response

Status: **Claude QA planning returned FAIL. Codex accepts all blockers as
valid specification defects.**

Claude reviewed `docs/ss-011-preimplementation-spec.md` and found ten
pre-implementation blockers. Implementation remains blocked at
`2. QA Planning (Claude)`.

## Findings And Resolution

| ID | Claude finding | Codex response |
| --- | --- | --- |
| B1 | `SwingCardPngResult` was referenced but not defined. | Fixed in `docs/ss-011-preimplementation-spec.md` with a discriminated union covering success and named failure reasons. |
| B2 | `SwingCardWarningCode` mixed pre-export content warnings with PNG export failures. | Fixed by splitting `SwingCardContentWarningCode` from `SwingCardPngFailureReason`; PNG failures now live only in `SwingCardPngResult`. |
| B3 | Metric contract prose contradicted the strict `SwingMetricPayload` type. | Fixed by requiring exact `SwingMetricPayload | undefined` and deleting the implicit view-model escape hatch. |
| B4 | Undefined overlay with defined preview had no required behavior. | Fixed by requiring `Keyframe unavailable` and forbidding bare-preview drawing without overlay result. |
| B5 | PNG/print content parity was not structurally enforced. | Fixed by adding `renderSwingCardPrintSurface(content)` and requiring print and PNG paths to consume the same `SwingCardContent`. |
| B6 | "Or equivalent" overlay wording permitted a parallel renderer. | Fixed by requiring direct reuse of SS-010 `renderPoseOverlayFrame` or a thin delegating wrapper. |
| B7 | Export canvas caps had no exact numeric values. | Fixed with exact CSS/backing-store caps and defined overflow-note behavior. |
| B8 | Object URL singleton lifecycle and ordering were underspecified. | Fixed with module-scoped `activeObjectUrl`, synchronous prior revocation before new URL creation, and sequential-call tests. |
| B9 | Filename date source was not pinned. | Fixed by requiring wall-clock `new Date()` captured at export click, never video/session-derived time. |
| B10 | `PoseOverlayRenderResult` reuse was not pinned to its source. | Fixed by requiring an import from `./pose-renderer` and prohibiting a shadow type. |

## Additional Test And Copy Updates

- Added content warning trigger table, deterministic order, deduplication, and
  co-occurrence rules.
- Added tests for warning derivation, overlay-missing fallback, PNG result
  variants, print/PDF parity, sequential object URL revocation, exact mobile
  viewport and touch target checks, print break-avoidance styles, and no
  persistent export canvas leakage.
- Added print CSS no-external-font/network rule.
- Added synchronous generation-in-progress guard requirement.
- Clarified the PNG overflow note is a presentation fallback, not a content
  warning.

## Verification

- Documentation/spec-only changes so far.
- `git diff --check` must pass before handoff completion.

## Next Step

Submit `docs/ss-011-claude-qa-rereview-prompt.md` to Claude for focused
re-review of B1-B10 closure. SS-011 must not move to
`3. In Development (ChatGPT)` until Claude returns PASS.
