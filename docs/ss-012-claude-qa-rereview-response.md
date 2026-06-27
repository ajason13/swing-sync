# SS-012 Claude QA Planning Re-Review Response

Status: **Response to Claude focused QA re-review round 2.**

Claude confirmed B1-B6 are closed and returned FAIL with one new blocker plus a
minor issue worth closing before implementation.

| ID | Claude finding | Codex response |
| --- | --- | --- |
| B7 | `CoachingValidationContext` could become a second source of truth because the spec did not require it to be derived from actual Swing Card evidence or make the context mandatory. | Addressed. The spec now requires `validateCoachingResponse(value, content: SwingCardContent)`, forbids production validation from accepting caller-supplied context, requires validators to call exported `buildCoachingValidationContext(content)` internally, and defines deterministic context derivation from Swing Card warnings, renderable keyframes, partial overlays, and measured metrics. |
| B8 | Prohibited text regex matching had no normalization floor, leaving easy evasion via case, whitespace, zero-width characters, or Unicode look-alikes. | Addressed. The spec now requires NFKC normalization, zero-width character removal, Unicode whitespace collapse, and trim before pattern matching, plus adversarial tests for mixed case, whitespace-padded phrases, zero-width insertion, and a documented Unicode-lookalike limitation case. |

Non-blocking recommendations:

- Pattern descriptions are intended for developer/test visibility only and must
  not be returned to end users or logged with raw response text.
- `git diff --check` remains an intentional whitespace-error verification
  command for documentation and future implementation diffs.

## Verification

- Documentation/spec-only response; no runtime implementation started.
- `git diff --check` must pass after this response and the second focused
  re-review prompt are updated.

## Next Gate

Submit `docs/ss-012-claude-qa-rereview-2-prompt.md` to Claude for focused
B7/B8 pre-implementation QA re-review. Keep SS-012 at
`2. QA Planning (Claude)` and do not move to implementation until Claude
returns PASS or all blockers are resolved and re-reviewed.
