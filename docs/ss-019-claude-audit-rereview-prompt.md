# Superseded for paste use — SS-019 Focused Claude Final-Audit Re-review Prompt — B-NEW1

The two-file handoff remains preserved as complete evidence, but it exceeds the
current free-plan rate limit when pasted with its packet. Use the fully ready
single-paste compact handoff instead:
`docs/ss-019-claude-audit-rereview-compact.md`. Do not paste this prompt or its
packet for the compact review.

Paste this prompt first, then immediately paste
`docs/ss-019-claude-audit-rereview-source-packet.md`. Together they are one
self-contained handoff. Do not use the superseded original final-audit prompt
or its immutable source packet for this re-review. You have no repository,
filesystem, GitHub, Notion, CI, or external-source access; judge only the
evidence embedded here and in the companion packet.

## Role

You are the independent final auditor for Swing Sync SS-019. Be adversarial,
evidence-driven, and conservative about sign-off. Do not implement or broaden
the story.

## Stage

Focused follow-up to the final implementation audit. The workflow remains
`4. Final Audit (Claude)`, the branch is
`ss-019-accessibility-design-hardening`, and Pull Request is empty.

## Scope

Re-review accepted blocker B-NEW1 and only cross-cutting focus, status, and
protected-boundary risk that the repair could affect. Do not reopen unrelated
implemented SS-019 scope without evidence of a regression in this focused
packet.

## Context

The prior final audit returned FAIL. Lead disposition accepted B-NEW1 as the
sole blocker: active same-token processing callbacks may arrive after the app
has navigated from processing to review. State/progress/output recording must
continue for the active token, but processing-progress DOM updates must not
query or overwrite a mutually exclusive review DOM.

The approved repair changes only `src/analysis-lifecycle.ts` and
`test/unit/analysis-lifecycle.test.ts`: each `updateProcessingProgressUi` call
in `handleProcessingState`, `handleProcessingProgress`, and
`handleProcessingOutput` is gated by `activeStep === "processing"`. The named
test `keeps same-token trailing processing callbacks from overwriting confirmed
review DOM` proves that completed-review text survives while same-token state,
progress, and output remain recorded. A read-only deep-researcher PASS is
advisory evidence, not a substitute for your independent decision.

The original 31-block source packet is preserved byte-for-byte as the verified
pre-fix baseline. This focused packet identifies its SHA-256, derives exact
fix-only deltas from its embedded pre-fix versions, includes complete current
files needed to judge the fix, and includes post-audit coordination evidence.

## Acceptance criteria

1. Keyboard-only traversal covers capture, consent, processing, review, phase
   confirmation, and Swing Card export.
2. Focus states, labels, headings, status updates, and disabled-control
   explanations are understandable.
3. Desktop and mobile layouts have no overlap, clipped text, unusable controls,
   or unreadable export panel.
4. Practical automated smoke or unit coverage protects high-risk accessibility
   and responsive regressions.
5. Remaining manual-only accessibility risks are documented accurately.

For this focused review, map any B-NEW1 conclusion to AC2 and AC4, and identify
any evidenced cross-cutting impact on AC1, AC3, or AC5.

## Protected boundaries

- No decorative redesign, selector drift, or protected-copy change.
- Preserve local-first raw-media handling, explicit consent, local processing,
  remote-review-disabled behavior, service-worker/persistence behavior, and
  Swing Card data classes.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, provider/model assets, remote sharing, dependencies, framework,
  bundle, licensing, notice, lockfile, or SBOM changes.
- Do not make accessibility certification, universal AT compatibility, privacy,
  safety, legal, deletion, anonymity, or compliance claims.

## Relevant source contents or focused diff

Mechanically verify the companion packet before substantive review. It contains
complete fix-only deltas against the exact pre-fix versions serialized in the
original packet; complete current lifecycle, focused tests, and cross-module
focus/status sources; the manual record, audit response, relevant context,
and `.nvmrc`; explicit absence and omission records. Reject the handoff if a
declared block is missing, reordered, truncated, hash-mismatched, or not exact.

## Verification

Under Node `v22.22.3` from `.nvmrc`, lead evidence passed:

- focused lifecycle verification: 3 files / 32 tests;
- full unit suite: 24 files / 218 tests;
- full desktop/mobile Chromium smoke suite: 48 tests;
- build, compliance, safety, privacy, docs verification, and `git diff --check`.

No dependency/bundle/license/SBOM commands were required because those surfaces
did not change. Assess the packet evidence rather than accepting this claim.

## Known non-goals

Static source-string inventory cleanup, a CSS pseudo-element AT-risk note, and
an awaited-close loading indicator are deferred non-blocking recommendations.
They are not part of B-NEW1. No redesign, provider/model work, remote sharing,
new dependency, certification, or unexecuted manual AT/device evidence is in
scope.

## Output required

First report mechanical packet verification. Then provide:

1. A single **PASS** or **FAIL** verdict on B-NEW1 and any evidenced
   cross-cutting focus/status/boundary regression.
2. Blockers, if any, with exact block/file, failure mode, impact, affected
   acceptance criterion/boundary, minimum correction, and required regression.
3. A concise B-NEW1 closure assessment proving whether same-token recording is
   retained while review DOM cannot be overwritten.
4. Protected-boundary drift analysis.
5. Non-blocking recommendations clearly separate from blockers and deferred
   work.
6. Explicit sign-off: exactly `CLEARED FOR PR PREPARATION` or
   `NOT CLEARED FOR PR PREPARATION`.
