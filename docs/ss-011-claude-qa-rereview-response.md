# SS-011 Claude QA Focused Re-Review Response

Status: **Claude focused QA re-review returned FAIL with one narrow new
blocker, B11. Codex accepts B11 as valid.**

Claude confirmed B1-B10 are closed in `docs/ss-011-preimplementation-spec.md`
and found one remaining specification gap:

- B11: `SwingCardPngResult.warnings` existed on both success and error
  variants, but the spec did not explicitly state that this field must be
  exactly `content.warnings` passed through unchanged. Without that invariant,
  `composeSwingCardPng` could independently recompute, filter, reorder, or
  append content warning codes, reopening a small version of the independent
  warning-derivation risk closed elsewhere.

## Resolution

`docs/ss-011-preimplementation-spec.md` now states:

- `SwingCardPngResult.warnings` must be exactly `content.warnings` passed
  through unchanged in both success and error variants.
- `composeSwingCardPng` may read `content.warnings` for rendering decisions,
  but it must never add, remove, reorder, filter, or recompute warning codes
  before returning them.
- Unit tests must assert unchanged warning passthrough for both success and
  error branches.

## Verification

- Documentation/spec-only changes so far.
- `git diff --check` must pass before handoff completion.

## Next Step

Submit `docs/ss-011-claude-qa-rereview-2-prompt.md` to Claude for focused
B11-only re-review. SS-011 must not move to `3. In Development (ChatGPT)`
until Claude returns PASS.
