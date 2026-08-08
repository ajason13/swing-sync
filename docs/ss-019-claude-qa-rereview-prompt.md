# SS-019 Claude QA-Planning B1-B6 Focused Re-review Prompt

**Superseded for paste use after the second Claude FAIL.** Use
`docs/ss-019-claude-qa-second-rereview-prompt.md` followed by
`docs/ss-019-claude-qa-second-rereview-source-packet.md`. The prior source
packet remains unchanged as historical evidence.

Paste this prompt into Claude Chat first, followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md`. Together they are one
self-contained handoff. Assume no filesystem, repository, GitHub, Notion, or
prior-chat access. If the packet does not follow, return FAIL.

## Role

You are the independent lead adversarial QA planner for local-first Swing Sync.
Re-review the revised preimplementation plan after your B1-B6 FAIL and the lead
architect's close/token-race precision. Challenge closure and regressions; do
not implement code.

## Stage

Focused preimplementation QA-planning re-review. No SS-019 runtime/UI
implementation or story branch exists. Builder and branch creation remain
blocked until PASS, all blockers closed, and `CLEARED FOR IMPLEMENTATION`.

## Scope

Re-review B1-B6, the lead-found close/token race, new blockers, acceptance
coverage, protected boundaries, named automation, and manual evidence. Attack
stale focus, unmapped callsites, duplicate announcements, unsafe focus keys,
chooser cancel/focus return, semantic-role loss, contrast math, forced colors,
320px/long-text/error states, empty-path tests, and false conformance claims.

## Context

Swing Sync is a Vite/TypeScript local-first browser app. Raw swing video is not
uploaded by default; consent gates local analysis; pose processing, phase review,
and Swing Card export are local; remote review remains unavailable. No backend,
telemetry, remote logging, cloud diagnostics, provider, SDK, model, dependency,
or remote sharing is added.

Accepted corrections:

- **B1:** `src/app-accessibility.ts` owns post-render and no-render intents.
  Progress/output stays partial; only processing state is scoped polite live.
  Each controller callback captures an identity/token and checks it before any
  state/output/DOM/focus/announcement mutation; stale callbacks return. Current
  completed/failed callbacks may no-render focus the processing heading only
  when processing view and active token match. Retry preserves video DOM.
- **Lead precision:** stop/close synchronously invalidate the active callback
  token before awaiting cancel/close while retaining a local controller for
  resource release, making racing terminal callbacks inert. Stop owns the
  stopped render/announcement/capture focus. Close is cleanup/state-reset only:
  no render/focus/announcement. Navigation and picker callers own one
  destination render; `beforeunload` cleans up without rendering.
- **B2:** the file input has `tabindex="-1"` and a defensive label, not
  `aria-hidden`; selection, cancel, and focus/focusin redirect return focus to
  the visible picker without positive tabindex.
- **B3:** every event uses exactly one polite global or scoped channel. Global
  owns full-render workflow/consent/camera/video/phase/Swing events. Scoped live
  regions are only processing state and imperative overlay. Other visible
  status text is not live. Every callsite is inventoried.
- **B4:** capture, keyframe, assignment, and Swing summary use named group/native
  semantics. Remote disclosure keeps native `<dl>` inside a named group.
- **B5:** static focus keys are enumerated; dynamic keys are only
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Fallbacks and every
  event/lifecycle/Swing render/no-render callsite are exact.
- **B6:** exact tokens are `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, `--interactive-boundary: #607367`, with exact ring
  geometry, surface ratios, >=3:1 threshold, CSS-reading unit tests,
  computed-style smoke checks, and forced-color behavior.

Exact title/fallback/bounded-key/polite-priority notes are adopted non-blocking
precision, not expanded acceptance.

## Acceptance criteria

- Keyboard-only traversal covers capture, consent, processing, review, phase
  confirmation, and Swing Card export.
- Focus, labels, headings, status, and disabled explanations are understandable.
- Desktop/mobile layouts avoid overlap, clipping, unusable controls, and
  unreadable export.
- Add practical high-risk accessibility/responsive smoke or unit coverage.
- Document remaining manual-only accessibility risks.

## Protected boundaries

- No workflow-obscuring redesign; telemetry; remote logging; analytics; cloud
  diagnostics; provider SDK/model assets; remote sharing; identifiers; or debug
  artifacts.
- No safety/privacy/medical/non-affiliation claim change outside sensitive review.
- Preserve local-first media, consent, local processing, remote-review-disabled
  behavior, service worker, persistence, exported data, copy/labels/selectors.
- No dependency/framework/bundle/license/notice/SBOM change and no absolute
  accessibility/safety/privacy/legal/medical/compliance claim.

## Relevant source contents/focused diff

The immediately following packet must contain complete revised spec, Claude
response, research disposition, superseded original prompt, relevant baseline
sources/tests, an explicit absent record for unimplemented
`src/app-accessibility.ts`, complete focused `CONTEXT.md` diff, and complete
pre-review-to-revised-spec diff derived from the exact original packet block.

Mechanically verify manifest kind/path/line/byte/SHA-256 entries, exactly one
unique BEGIN/END pair per block, equal manifest/block counts, no truncation or
fence collision, no summary substituted for exact contents, and rationales for
omissions. Any mismatch is a FAIL handoff blocker.

## Verification

Current evidence is planning-only: B1-B6/lead precision are revised before
implementation; packet blocks are byte/hash checked; `git diff --check` passes;
tracker/context remain QA Planning with empty PR and `main`; nine unrelated
prompt files remain untouched. No implementation tests ran. Future Node 22
checks include named accessibility/contrast/renderer/events/lifecycle/phase/
remote/Swing unit tests, real keyboard-only pose-fixture Playwright, build,
compliance, safety, privacy, docs when applicable, and diff check.

## Known non-goals

No implementation/branch/builder before PASS; redesign/framework/localization/
camera/backend/account/cloud/remote/provider/model/service-worker/persistence/
exported-data/algorithm change; observability/dependency/license/SBOM change;
or certification, universal AT, legal/compliance, or complete nonvisual-canvas
claim.

## Output required

1. Start with exactly `PASS` or `FAIL`.
2. Mark B1-B6 and close/token-race precision `CLOSED` or `OPEN` with evidence.
3. List open/new blockers by severity with impact and exact correction.
4. Identify AC gaps, missing named automated/manual evidence, and boundary drift.
5. Report packet manifest/marker counts and mismatches.
6. Separate non-blocking recommendations from future work.
7. End `CLEARED FOR IMPLEMENTATION` only for PASS with zero blockers; otherwise
   end `NOT CLEARED FOR IMPLEMENTATION`.
8. Do not implement or direct builder work while any blocker remains.
