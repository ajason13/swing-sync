# SS-019 Claude QA-Planning N1-N3 Focused Re-review Prompt

Paste this prompt into Claude Chat first, followed immediately by
docs/ss-019-claude-qa-second-rereview-source-packet.md. Together they are one
self-contained handoff. Assume no filesystem, repository, GitHub, Notion, or
prior-chat access. If the packet does not follow, return FAIL.

## Role

You are the independent lead adversarial QA planner for local-first Swing Sync.
Re-review the N1-N3 corrections after your second SS-019 FAIL. Challenge
closure and regressions; do not implement code.

## Stage

Second focused preimplementation QA-planning re-review. No SS-019 runtime/UI
implementation or story branch exists. Builder and branch creation remain
blocked until PASS with explicit CLEARED FOR IMPLEMENTATION.

## Scope

Decide whether N1, N2, and N3 close B1, B3, B4, and the lead close/token-race
precision. Regression-check already-closed B2, B5, and B6. Look for
contradictory legacy tests, incomplete selector migrations, missing text/live
ownership, non-exhaustive container semantics, unnamed test removals, or new
acceptance and protected-boundary gaps.

## Context

Claude mechanically accepted the previous 40-block packet, closed B2/B5/B6,
and left three blockers:

- N1: two closeActive tests still asserted lifecycle-owned rendering and the
  legacy string requestRender signature.
- N2: the live-region consolidation did not name the existing phase-warning
  aria-live assertion, three unscoped status-role locators, or visible status
  text ownership.
- N3: processing, review, and export placeholders had the same unsupported
  generic-container naming defect as the first reviewed set.

The revised plan now:

- Defines AccessibilityIntent as focusKey plus optional announcement, and
  RenderRequest as that intent plus optional visibleStatusText.
- Names each superseded lifecycle test, its exact rewrite or replacement, the
  typed stop/camera assertions, and deferred-close caller-owned render tests.
- Gives global, scoped-live, and visible non-live status surfaces exact IDs;
  migrates all existing role-dependent smoke assertions; defines phase
  transition keys and one announcement owner per event.
- Exhaustively remediates every reviewed labelled generic container, uses a
  labelled native section for export, and preserves the remote disclosure dl
  inside a named group.
- Makes focus idempotent and directly tests exact aria-describedby targets.
- Keeps B2/B5/B6 as explicit regression contracts.

## Acceptance criteria

- Keyboard-only traversal covers capture, consent, processing, review, phase
  confirmation, and Swing Card export.
- Focus, labels, headings, status, and disabled explanations are understandable.
- Desktop/mobile layouts avoid overlap, clipping, unusable controls, and an
  unreadable export surface.
- Practical high-risk accessibility/responsive automation is named and mapped.
- Remaining manual-only accessibility risks are documented.

## Protected boundaries

- Preserve local-first raw-media handling, consent, local processing,
  remote-review-disabled behavior, service worker, persistence, exported data,
  protected copy, labels, and selectors except the explicitly reviewed
  semantic/test migrations.
- No telemetry, analytics, remote logging, cloud diagnostics, provider SDK,
  model asset, remote sharing, hidden identifier, or debug artifact.
- No safety/privacy/medical/non-affiliation claim change.
- No dependency, framework, bundle, license, notice, or SBOM change.
- No absolute accessibility, safety, privacy, legal, medical, or compliance
  claim.

## Relevant source contents/focused diff

The following packet contains the exact second Claude response, lead
disposition, complete revised specification, directly implicated baseline
source/tests, the prior-reviewed-to-current specification diff, the complete
focused CONTEXT diff, and an explicit absent record for the planned
app-accessibility module.

Mechanically verify manifest metadata, sequential unique BEGIN/END markers,
equal row/block counts, byte/hash matches, regenerated diffs, absence record,
fence safety, and omission rationales. Any mismatch is a FAIL handoff blocker.

## Verification

Planning evidence only: N1-N3 are revised before implementation; packet blocks
are mechanically verified; git diff --check passes; main remains at the
confirmed baseline with no story branch or PR. Notion live synchronization is
not claimed because OAuth authorization is unavailable. No implementation tests
have run.

Future implementation uses Node 22 and must run the named targeted unit tests,
the real keyboard-only pose-fixture smoke suite, build, compliance, safety,
privacy, docs when applicable, and diff checks.

## Known non-goals

No implementation, builder, branch, redesign, framework, localization, camera,
backend, account, cloud, provider/model, service-worker, persistence,
exported-data, algorithm, observability, dependency, license, SBOM, or
certification expansion.

## Output required

1. Start with exactly PASS or FAIL.
2. Mark N1, N2, N3, B1, B3, B4, and close/token precision CLOSED or OPEN with
   exact evidence.
3. Confirm whether B2, B5, and B6 remain closed.
4. List new/open blockers by severity with impact and exact correction.
5. Identify acceptance gaps, missing named automated/manual evidence, or
   protected-boundary drift.
6. Report packet manifest/marker counts and mismatches.
7. Separate non-blocking recommendations and future work.
8. End CLEARED FOR IMPLEMENTATION only for PASS with zero blockers; otherwise
   end NOT CLEARED FOR IMPLEMENTATION.
9. Do not implement or direct builder work while any blocker remains.
