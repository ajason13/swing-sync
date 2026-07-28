# SS-019 Final Claude Implementation-Audit Source Packet

Generated from baseline `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1` on 2026-07-21 for the uncommitted `ss-019-accessibility-design-hardening` worktree. Paste `docs/ss-019-claude-audit-prompt.md` first, then paste this packet immediately afterward. Together they are one self-contained final-audit handoff.

Claude has no repository, filesystem, GitHub, Notion, CI, or external-source access. The exact blocks below, not summaries, are the review evidence.

## Completeness and omission rationale

Every changed tracked file is present as a complete per-file focused diff. New implementation/test/manual artifacts and the approved specification are complete current files. Governance and protected-boundary sources are complete current files. The final prompt and this packet are excluded from their own evidence to avoid circular serialization.

Immutable historical SS-019 planning prompts, source packets, raw Claude responses, lead dispositions, and research-disposition notes remain preserved in the worktree but are omitted because they are fixed planning history rather than implementation evidence; the final prompt and complete approved specification state the prior findings and accepted contracts. This omission includes all untracked `docs/ss-019-claude-qa-*` artifacts other than the final audit prompt/packet and `docs/ss-019-research-disposition.md`.

The nine intentional untracked agent-guidance prompts remain preserved and omitted as unrelated session-handoff history: `docs/agent-guidance/post-ss-011-next-codex-session-prompt.md`, `docs/agent-guidance/post-ss-012-next-codex-session-prompt.md`, `docs/agent-guidance/post-ss-014-next-codex-session-prompt.md`, `docs/agent-guidance/post-ss-015-next-codex-session-prompt.md`, `docs/agent-guidance/post-ss-018-next-codex-session-prompt.md`, `docs/agent-guidance/ss-004-new-codex-session-prompt.md`, `docs/agent-guidance/ss-006-new-codex-session-prompt.md`, `docs/agent-guidance/ss-007-new-codex-session-prompt.md`, `docs/agent-guidance/ss-008-new-codex-session-prompt.md`.

Unchanged source and tests outside the diff are omitted because the complete focused diffs, new complete artifacts, specification, and boundary documents contain the surfaces Claude must judge. Dependency, lockfile, licensing, notices, SBOM, service-worker, telemetry, provider/model, and remote-sharing absence is represented by an explicit record and is independently auditable against the manifest and diffs.

## Packet Manifest

| Kind | Path | Lines | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Complete focused diff | `git diff -- .agents/skills/swing-sync-story-delivery/SKILL.md` | 19 | 1079 | `7a51af5eb5d15dc281a6583d73f372437214865cba8974714ac31e592bb8e3d1` |
| Complete focused diff | `git diff -- CONTEXT.md` | 510 | 31234 | `2e5f814824f7418c1394319c8e9037d5337bb234faf419a76fc0063d005c7b11` |
| Complete focused diff | `git diff -- index.html` | 14 | 428 | `b3ddfdd419b9a86eea3bc47f0c93fa47742b0634df0d53d00e8030ace8904940` |
| Complete focused diff | `git diff -- src/analysis-lifecycle.ts` | 119 | 5142 | `98a093715e528633c3b0b2b0d4a5b1bd622ce5dff4b20f1923035138a07e5f09` |
| Complete focused diff | `git diff -- src/app-events.ts` | 215 | 11160 | `cef8921ecc692360635b6fd0e53e085834d9c246e1e6dfffd25b1319f1645279` |
| Complete focused diff | `git diff -- src/app-renderer.ts` | 205 | 13807 | `29ad57eadebfcbaa5d8b21b0a506b9ec504a7b1c8c31dd74f6783a83ac0fb0e5` |
| Complete focused diff | `git diff -- src/keyframe-overlay-renderer.ts` | 50 | 2282 | `a6cf6fecacb1ff55ed5badaa75d0db84219138f67d065da6ced25d8512ebc7ac` |
| Complete focused diff | `git diff -- src/main.ts` | 65 | 2095 | `5c87fc101c4130abc6f5c2ba1d831e7e62631c0c10c5186700611fd1aee08bf7` |
| Complete focused diff | `git diff -- src/phase-review-renderer.ts` | 143 | 9327 | `b3d39f01b186e5de1adff6aeab01a43a364b4ccb7c0423a69a88ac38e7f5704a` |
| Complete focused diff | `git diff -- src/remote-model-renderer.ts` | 26 | 1766 | `936a32d1e7cb443590b2c6ca0da8da13545895f588adbffe39acf8c799455722` |
| Complete focused diff | `git diff -- src/styles.css` | 235 | 4464 | `ac6a9d5f3eab2d77f0f69c5ea3fe8631124d32e0c913653ed52091a2a9751e29` |
| Complete focused diff | `git diff -- src/swing-card-actions.ts` | 108 | 3979 | `9d8209e08b1b61a5420c21fe064ded115a2bdea07b23896e2ce43d70e50450d4` |
| Complete focused diff | `git diff -- test/smoke/app.spec.ts` | 666 | 37296 | `796a6fd182a0c0d391533fcde7d12ec54eb12e245eeef5408d62825e0af5bb4b` |
| Complete focused diff | `git diff -- test/unit/analysis-lifecycle.test.ts` | 377 | 16845 | `a76c30393c6f362036787c2d9404113d5f100ebc16df0f699861d383bbcdb6e4` |
| Complete focused diff | `git diff -- test/unit/app-events.test.ts` | 459 | 22305 | `4aa03e7db0a7588478d3fd364101803735c52c728371e3ad5cac4e2d98fcd2b7` |
| Complete focused diff | `git diff -- test/unit/app-renderer.test.ts` | 167 | 8861 | `e46ccb3771dfa5ca7052f90d60a062c672fef51130e4eee43a018383a7060ddc` |
| Complete focused diff | `git diff -- test/unit/swing-card-actions.test.ts` | 202 | 8425 | `2405ae3e08180be6953b0c83217eedda7a06bb4a2ce5750592e0c611cf01b4fd` |
| Complete current file | `AGENTS.md` | 70 | 3301 | `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e` |
| Complete current file | `.nvmrc` | 1 | 3 | `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56` |
| Complete current file | `package.json` | 38 | 1777 | `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0` |
| Complete current file | `docs/privacy-architecture.md` | 200 | 9344 | `e27485d3cb6ba794866658ef7ba01f075ea3cf4601b08a7ae8bd95875fac5bb6` |
| Complete current file | `docs/safety-terms.md` | 117 | 5514 | `757c740e6908ebb9aa19e3e057d31c83a098d34aeb265338be4c0ee5a381e39f` |
| Complete current file | `docs/licensing.md` | 167 | 6882 | `6083f25daef2aef4a688b375c3f53b6171050f7d6cb6e4e10e370a1ea81d26a5` |
| Complete current file | `docs/models-licensing.md` | 56 | 2449 | `749b529d0139c82cafde7d4ac44e199245f99b7c5b7fa82bdf67770b58d7a4a0` |
| Complete current file | `src/app-accessibility.ts` | 114 | 4124 | `27fe1dfbce26be37a70aedffd3e306e454dec6730743f9d2ec6469ead662d45d` |
| Complete current file | `test/unit/accessibility-contrast.test.ts` | 35 | 2031 | `cad2cb85b5c15fb9326b3639184436f79a1c32b062c8df6b3d2a818bb1b6c681` |
| Complete current file | `test/unit/app-accessibility.test.ts` | 123 | 5948 | `a77d8d55d0a6e7301198eb76f14d3022b2bbe329f63c121375a690c45d3ffa0f` |
| Complete current file | `test/unit/keyframe-overlay-renderer.test.ts` | 32 | 1448 | `e97fbb2e8821061906f7ec42a7c83102c85f079590ed45952f75569aa2bd2421` |
| Complete current file | `docs/ss-019-manual-accessibility-qa.md` | 98 | 11606 | `506d5302d386f8124c7bf0371df37ea78f9ef03485ce7c24bd542037044632b8` |
| Complete current file | `docs/ss-019-preimplementation-spec.md` | 742 | 43785 | `3931bb6005720ddaf12672c7769abe6ac1824db1262382ecfc5a013d5d2d8b6c` |
| Explicit absent record | `SS-019 dependency/service-worker/telemetry/provider/model change absence` | 6 | 575 | `90e924c91f6021883a5758868695dcd7617cf28848c4eb03853aa5509ecd1629` |

## Mechanical Verification Contract

Readiness requires exactly 31 manifest rows and 31 unique sequential BEGIN/END evidence blocks: 17 complete focused diffs, 13 complete current files, and one explicit absent record. Re-extract every raw block before substantive review. For each row, match kind, path, line count, byte count, SHA-256, and exact bytes to the current file, freshly regenerated per-file `git diff -- <path>`, or declared absent record. Reject missing, duplicated, reordered, summarized, truncated, mismatched, or fence-colliding evidence.

## Exact Evidence Blocks

### 01 Complete focused diff: git diff -- .agents/skills/swing-sync-story-delivery/SKILL.md

Lines: 19  
Bytes: 1079  
SHA-256: `7a51af5eb5d15dc281a6583d73f372437214865cba8974714ac31e592bb8e3d1`

<!-- BEGIN EXACT BLOCK: 01 Complete focused diff: git diff -- .agents/skills/swing-sync-story-delivery/SKILL.md -->
````````````````````````````````````````````````
diff --git a/.agents/skills/swing-sync-story-delivery/SKILL.md b/.agents/skills/swing-sync-story-delivery/SKILL.md
index 01231b7..8b0a8e8 100644
--- a/.agents/skills/swing-sync-story-delivery/SKILL.md
+++ b/.agents/skills/swing-sync-story-delivery/SKILL.md
@@ -132,6 +132,14 @@ Use audit and reviewer feedback as process input:
 - For sensitive documentation stories, prefer a single source of truth plus
   automated non-duplication checks over duplicating security, privacy, or
   deployment values in prose.
+- Static callsite or source-string inventories do not substitute for behavioral
+  path tests when sign-off depends on exact typed payloads, announcement owners,
+  or failure-state assertions.
+- Live-region audits must target exact owner IDs and prove mutation
+  exclusivity for each semantic event; broad role counts alone do not prove
+  single-owner announcement behavior.
+- Refresh durable unit, smoke, build, verifier, and manual-risk evidence after
+  the final test additions and before serializing an audit source packet.
 
 ## Enforce Swing Sync Gates
 

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 01 Complete focused diff: git diff -- .agents/skills/swing-sync-story-delivery/SKILL.md -->

### 02 Complete focused diff: git diff -- CONTEXT.md

Lines: 510  
Bytes: 31234  
SHA-256: `2e5f814824f7418c1394319c8e9037d5337bb234faf419a76fc0063d005c7b11`

<!-- BEGIN EXACT BLOCK: 02 Complete focused diff: git diff -- CONTEXT.md -->
````````````````````````````````````````````````
diff --git a/CONTEXT.md b/CONTEXT.md
index 253ef3e..3b3887d 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -1,6 +1,6 @@
 # Swing Sync Context
 
-Last updated: 2026-07-19
+Last updated: 2026-07-21
 
 ## Current State
 
@@ -12,23 +12,486 @@ Last updated: 2026-07-19
   `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`. Local `main` was
   fast-forwarded to `origin/main` by the PR #19 merge flow before this
   post-merge context update.
-- Latest post-merge guidance/context commit before SS-018 delivery:
-  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`. This change records the SS-018
-  post-merge context sync.
+- Latest post-merge guidance/context commit:
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`. This change records the SS-018
+  merge state and is the confirmed SS-019 specification baseline.
 - Current completed task:
   `SS-018 Refactor frontend app shell into maintainable UI/state modules`
-- Active task: none selected for implementation.
-- Active branch: `main`
-- Active handshake: none.
+- Active task:
+  `SS-019 Perform accessibility and responsive design hardening`.
+- Active branch: `ss-019-accessibility-design-hardening`, created from
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.
+- Active handshake status: `4. Final Audit (Claude)`. Notion was successfully
+  moved to this configured board value and refetched for confirmation on
+  2026-07-21.
 - Active Pull Request: none.
-- Next task candidate:
-  `SS-019 Perform accessibility and responsive design hardening`
-- Next task branch: `ss-019-accessibility-design-hardening`
-- Next task handshake: `0. Backlog`
-- Next task Pull Request: empty.
+- Authorized story branch, now created at the confirmed baseline:
+  `ss-019-accessibility-design-hardening`.
+- Implementation status: uncommitted SS-019 runtime, accessibility,
+  responsive-design, unit, smoke, and manual-QA changes are present on the
+  story branch. Full Node 22 verification passes at 24 files / 217 unit tests
+  and 48 desktop/mobile smoke tests. Focused `deep-researcher` re-review passed,
+  closing all nine initial findings and R1/R2; the complete final Claude audit
+  prompt and packet are ready for the independent review.
 - Remaining visible non-Done backlog tasks: SS-019 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.
 
+## SS-019 Coordination
+
+SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
+privacy/safety-copy-sensitive, responsive-design-, smoke-test-selector-, and
+manual-QA-sensitive. It may harden DOM semantics, focus restoration, status
+announcements, responsive CSS, and test evidence while preserving local-first
+raw-media handling, consent, remote-review-disabled behavior, protected copy,
+labels, and selectors.
+
+Acceptance criteria from Notion:
+
+- Complete keyboard-only traversal for capture, consent, processing, review,
+  phase confirmation, and Swing Card export flows.
+- Verify visible focus states, labels, headings, status updates, and
+  disabled-control explanations are understandable.
+- Check desktop and mobile layouts for overlap, clipped text, unusable
+  controls, and export-panel readability.
+- Add automated smoke or unit coverage for the highest-risk accessibility and
+  responsive regressions where practical.
+- Document any remaining manual-only accessibility risks.
+
+Protected boundaries from Notion and the approved architecture:
+
+- Do not introduce decorative redesign that obscures the workflow.
+- Do not add runtime telemetry, remote logging, analytics, cloud diagnostics,
+  provider SDKs, model assets, or remote sharing.
+- Do not change safety, privacy, medical-scope, or non-affiliation claims
+  except through the sensitive-story review path.
+- Preserve local-first raw-media handling, explicit consent,
+  remote-review-disabled behavior, service-worker behavior, exported data
+  classes, protected labels, and smoke-test selectors.
+- No dependency, framework, bundle, license-policy, notice, or SBOM change is
+  expected.
+
+Kickoff/spec state on 2026-07-19:
+
+- `git fetch origin` completed successfully. Local `main`, refreshed
+  `origin/main`, and the live remote `refs/heads/main` were confirmed at
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`, which includes the SS-018 merge
+  commit `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`.
+- Worktree was clean before selection except for the nine intentional
+  untracked `docs/agent-guidance/*new-codex-session-prompt.md` files, which
+  remain preserved.
+- Notion page:
+  https://app.notion.com/p/392834a0c8a6814db2f6ea28ae195f75
+- Planned branch from confirmed `main` after QA-planning clearance:
+  `ss-019-accessibility-design-hardening`.
+- Pull Request: none.
+- Task Type: `Feature`.
+- Notion task fields were verified before selection: Name
+  `SS-019 Perform accessibility and responsive design hardening`, Branch
+  `ss-019-accessibility-design-hardening`, Handshake Status `0. Backlog`, Pull
+  Request empty, Task Type `Feature`, acceptance criteria, and protected
+  boundaries.
+- Notion moved to `1. Spec Drafting (Gemini)` for configured board
+  compatibility, with Codex recorded as the research/spec owner.
+- Existing `SS-TC-019` was inspected and belongs to SS-013 remote-model
+  adapter consent coverage; it is not reused for SS-019.
+- Dedicated test case `SS-TC-023` was created and related to SS-019:
+  https://app.notion.com/p/3a3834a0c8a6811ab10bfbf9a4651c8f
+- `SS-TC-023` covers keyboard traversal and focus order; accessible names,
+  headings, status semantics, and disabled explanations; desktop/mobile
+  reflow, long/error text, and export readability; named automated tests and
+  manual evidence; and protected no-telemetry/no-remote/no-dependency/no-claim-
+  drift boundaries.
+- Approved research/disposition note:
+  `docs/ss-019-research-disposition.md`.
+- Candidate preimplementation specification:
+  `docs/ss-019-preimplementation-spec.md`.
+- Self-contained Claude QA-planning prompt:
+  `docs/ss-019-claude-qa-planning-prompt.md`.
+- Complete Claude QA-planning source packet:
+  `docs/ss-019-claude-qa-planning-source-packet.md`.
+- The QA-planning handoff is ready as a required two-file paste: prompt first,
+  then source packet immediately after it. The packet manifest contains 33
+  complete current files plus the complete focused `git diff -- CONTEXT.md`,
+  with line counts, byte counts, and SHA-256 hashes. Mechanical verification
+  re-extracted every block and matched it byte-for-byte to the working file or
+  focused diff before status movement.
+- Current-main findings include nested main landmarks, full-render focus loss,
+  the visually hidden file input remaining in sequential focus, inconsistent
+  live/status semantics, insufficient `#d7972d` focus contrast (about 2.51:1
+  on white and 2.29:1 on `#f3f5f1`), low-contrast control boundaries,
+  long-text/reflow risks, and incomplete canvas description semantics.
+- Existing strengths to preserve include the real pose-fixture browser path,
+  protected selector/label assertions, desktop coverage, and the existing
+  390 CSS-pixel mobile checks.
+- Codex dispositions adopt a stable announcer outside `#app`, one main
+  landmark, a new typed `src/app-accessibility.ts` focus/announcement contract,
+  safe closed `data-focus-key` values, explicit/previous/fallback focus
+  restoration, dynamic workflow titles, intent-specific announcements,
+  renderer semantics and disabled descriptions, two-color focus styling,
+  required control-boundary contrast, scoped 44-pixel targets, 320-pixel
+  reflow, forced-color support, real-path automated tests, and a manual QA
+  artifact.
+- Revise broad recommendations to avoid blanket live regions, arbitrary CSS
+  focus selectors, positive tabindex, forced focus after every edit, global
+  target-size inflation, screenshot-only reflow claims, or automated-test-only
+  conformance conclusions.
+- Defer certification, unavailable assistive-technology combinations,
+  complete nonvisual equivalence for the annotated canvas, localization,
+  camera capture, remote review/sharing, providers/models, runtime diagnostics,
+  and decorative redesign.
+- Reject protected copy/selector drift, raw-media upload, remote/provider/model
+  enablement, persistence/service-worker/exported-data changes, telemetry,
+  remote logging, cloud diagnostics, new dependencies, or absolute
+  accessibility/privacy/safety/legal/compliance claims.
+- Observability decision: unchanged. SS-019 adds no telemetry, analytics,
+  remote logging, cloud diagnostics, hidden identifiers, persistent debug
+  artifacts, expanded console output, or runtime operator instrumentation.
+- Dependency decision: no dependency, framework, provider SDK, model asset,
+  bundle, license-policy, notice, or SBOM change is planned. Any scope change
+  requires renewed review and the additional `AGENTS.md` verification.
+- Required implementation-time manual evidence artifact:
+  `docs/ss-019-manual-accessibility-qa.md`. It must record commit/environment,
+  browser/OS/viewport/zoom/input/AT, expected/actual results, evidence,
+  defects, unavailable combinations, and residual risks without claiming
+  certification.
+- Notion moved to `2. QA Planning (Claude)` after the prompt and mechanically
+  verified source packet were persisted. Implementation and story branch
+  creation remain blocked.
+- Next owner: Claude as the independent QA-planning reviewer. Lead architect
+  must disposition any findings and obtain PASS or focused re-review clearance
+  before the builder is invoked.
+- Model/effort metadata exception: the original deep-researcher delegate
+  stalled and exposed no verifiable pinned model or reasoning-effort metadata.
+  The recovery research child also exposed no such metadata. No silent model
+  or effort substitution was selected by the coordinator; the availability
+  limitation is retained in the handoff.
+
+Claude QA-planning response on 2026-07-20:
+
+- Claude returned FAIL with B1-B6. Lead architect accepted all six as blockers;
+  response record: `docs/ss-019-claude-qa-response.md`.
+- B1: accepted. `src/app-accessibility.ts` must provide both post-render and
+  no-render intent application. Processing progress/output remains partial;
+  only processing state text is a scoped polite status. Each controller
+  callback captures its originating controller identity/token and checks it
+  before any state/output/DOM/focus/announcement mutation; stale callbacks
+  return immediately. Current-view completed/failed callbacks may no-render
+  focus the processing heading only when that token is still active. Stop and
+  close synchronously invalidate the active token before awaiting controller
+  cleanup while retaining a local controller reference for resource release,
+  so racing terminal callbacks are inert. Late/cancelled/closed callbacks do
+  not steal focus or duplicate announcements. Retry remains no-render and
+  preserves the controller-owned video node.
+- `closeActive()` ownership is exact: it performs cleanup/state reset only,
+  with no render, focus, or announcement. Workflow-navigation and picker-change
+  callers own the sole destination render; `beforeunload` performs cleanup with
+  no render. `stopActive()` alone owns the stopped/released render, global
+  announcement, and capture focus.
+- B2: accepted. `#video-file` uses `tabindex="-1"` and an accurate defensive
+  label but not `aria-hidden`; successful selection, native cancel, and browser
+  focus-return redirection all restore the visible picker through named
+  automated/manual cases.
+- B3: accepted. Every semantic event has exactly one polite announcement
+  channel. Global status owns full-render shell/workflow/phase/Swing events;
+  scoped live regions are limited to in-place processing state and imperative
+  overlay status. A complete callsite/channel inventory and duplicate-
+  announcement evidence are required.
+- B4: accepted. Capture, keyframe, assignment, and Swing Card summary
+  containers require named group/native semantics. Remote disclosure preserves
+  its native `<dl>` inside a named group wrapper.
+- B5: accepted. The revised spec enumerates every static key, permits only the
+  bounded workflow-step/phase-assignment/keyframe patterns, defines exact
+  per-view fallbacks, and inventories every events/lifecycle/Swing render and
+  no-render callsite including render-free close paths.
+- B6: accepted. Exact tokens are `--focus-inner: #ffffff`,
+  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`; exact ring
+  geometry, corrected surface ratios, >=3:1 threshold, CSS-reading unit tests,
+  computed-style smoke evidence, and forced-colors behavior are specified.
+- Claude's exact-title, exact-fallback, bounded-key, and polite-priority notes
+  are adopted as non-blocking precision within B1-B6, not expanded acceptance.
+- Exact runtime titles are `Swing Sync | Capture`,
+  `Swing Sync | Processing`, `Swing Sync | Review`, and
+  `Swing Sync | Export`.
+- No safety/privacy/non-affiliation claim, local-first/raw-media behavior,
+  remote/provider/model posture, dependency, data, service-worker,
+  observability, telemetry, logging, or cloud behavior changes.
+- Feedback-retention lessons: cross-cutting focus/live-region specs need a
+  complete callsite inventory and single-owner channel matrix; proxy file
+  controls need success/cancel/focus-return coverage; generic `aria-label`
+  needs a naming role or native structure; visual token fixes must quantify
+  exact tokens, surfaces, ratios, geometry, and executable thresholds.
+- Revised candidate spec: `docs/ss-019-preimplementation-spec.md`.
+- The original `docs/ss-019-claude-qa-planning-prompt.md` is superseded for
+  paste use; its original source packet remains unchanged as the exact
+  pre-review baseline record.
+- First focused re-review handoff paths, now superseded for paste use:
+  `docs/ss-019-claude-qa-rereview-prompt.md` and
+  `docs/ss-019-claude-qa-rereview-source-packet.md`.
+- Status remains `2. QA Planning (Claude)`. Pull Request remains empty; active
+  branch remains `main`; implementation and story-branch creation remain
+  blocked.
+- The first focused re-review returned FAIL. The exact second response and
+  lead disposition are recorded below. Builder may start only after another
+  focused PASS and explicit `CLEARED FOR IMPLEMENTATION`.
+
+Focused Claude B1-B6 re-review response on 2026-07-20:
+
+- Claude returned FAIL after mechanically accepting the 40-row/40-block
+  handoff. Exact raw response:
+  `docs/ss-019-claude-qa-second-raw-response.md`. Lead disposition:
+  `docs/ss-019-claude-qa-second-response.md`.
+- B2 is CLOSED and regression-protected: `#video-file` remains outside
+  sequential order without `aria-hidden`; successful selection, native cancel,
+  and defensive focus return restore the visible picker through named
+  automated/manual cases.
+- B5 is CLOSED and regression-protected: exact static/bounded dynamic focus
+  keys, per-view fallbacks, and the complete render/no-render callsite inventory
+  remain required.
+- B6 is CLOSED and regression-protected: exact tokens, two-layer geometry,
+  eleven enumerated surface ratios, `>= 3:1` threshold, CSS-reading unit tests,
+  computed-style smoke checks, and forced-colors behavior remain required.
+- B1 and the lead close/token-race precision remain OPEN via accepted N1. The
+  exact existing unit tests `clears lifecycle-owned controller handles and
+  syncs app-state idle on close` and `re-renders capture controls after async
+  close settles` assert lifecycle-owned rendering that the render-free
+  `closeActive()` contract forbids. The first test is renamed to
+  `clears lifecycle-owned controller handles and syncs app-state idle on close
+  without rendering` with zero render/intent calls; the second is replaced by
+  deferred-close app-events tests named `awaits closeActive before rendering
+  workflow navigation exactly once` and `awaits closeActive before selecting a
+  replacement video and renders exactly once`. Stop, camera, and all legacy
+  render mocks migrate to exact typed requests; old/new contradictory tests may
+  not coexist.
+- B3 remains OPEN via accepted N2. The non-live visible status IDs are exactly
+  `#app-visible-status`, `#phase-review-status`,
+  `#swing-card-action-status`, and `#remote-model-status`; scoped live status is
+  limited to `#processing-status` and `#keyframe-overlay-status`; the global
+  live region is `#app-announcer`. The three existing unscoped
+  `page.getByRole("status")` assertions migrate to direct announcer plus visible
+  non-live status assertions. Existing `.phase-warning` text checks remain,
+  while its live-role assertion becomes exact ID/no-live/description coverage.
+  Processing/review status queries must target exact owners. Phase semantic
+  keys are `unsupported-input`, `review-required`, and `confirmed`; one global
+  announcement occurs only when the key changes.
+- B4 remains OPEN via accepted N3. Exhaustive named semantics cover
+  `Local video source`, `Local pose processing`, `Review placeholder`,
+  `Swing Card contents`, `Swing phase assignments`, and `Select keyframe` as
+  named groups; the export placeholder becomes a native section labelled by
+  the existing `Swing Card unavailable` heading; and the named remote wrapper
+  retains its nested native `<dl>`. Renderer/smoke/manual inventory covers all
+  entries and rejects bare labelled generic containers.
+- Adopted retry precision: focus is idempotent when the target is already
+  active, so retry followed by terminal focus without intervening movement
+  invokes DOM focus once; terminal focus may occur once if the user moved.
+- Adopted description precision: visible description targets use exact unique
+  IDs, state-accurate text, direct relationship assertions, and manual
+  browse-mode verification for disabled controls.
+- Repeatable lesson: contract migrations must inventory and name every
+  superseded existing assertion; adding new tests without migrating old
+  contradictory tests is not implementation-ready.
+- Repeatable lesson: live-region changes must migrate role-based locators and
+  define visible-text ownership separately from scoped/global announcement
+  ownership.
+- Repeatable lesson: DOM anti-pattern audits must exhaustively inventory every
+  current instance rather than fixing only the first examples found.
+- Protected safety/privacy/non-affiliation copy, local-first media, consent,
+  remote-review-disabled behavior, service-worker/exported-data behavior,
+  observability, dependencies, licenses, notices, and SBOM remain unchanged.
+- The final handoff-time SS-019 and SS-TC-023 Notion refetches again failed
+  with `Auth error: OAuth authorization required`; no mutation occurred. Status
+  `2. QA Planning (Claude)`, Pull Request empty, and the SS-TC-023 relationship
+  are retained from the last verified state, not claimed as a fresh live
+  verification.
+- Revised N1-N3 specification:
+  `docs/ss-019-preimplementation-spec.md`. The original planning prompt and the
+  first focused re-review prompt are superseded for paste use; their source
+  packets remain unchanged as exact prior evidence.
+- Active branch remains `main`; no story branch, Pull Request, runtime/UI
+  implementation, or builder delegation exists. Builder remains blocked.
+- New self-contained N1-N3 focused re-review prompt:
+  `docs/ss-019-claude-qa-second-rereview-prompt.md` (123 lines, 5,670 bytes,
+  SHA-256
+  `f21839ef85ce326b9f14a139121c19d9b490a05671fed32e0b8f95b39b8b868d`).
+- New complete focused source packet:
+  `docs/ss-019-claude-qa-second-rereview-source-packet.md`. Its mechanically
+  verified pre-context-refresh build has 25 manifest rows and 25 unique
+  sequential evidence blocks: 22 complete files, two complete focused diffs,
+  and one explicit absent record. It is 4,401 lines and 220,246 bytes with
+  SHA-256
+  `89a024eba67d0a8eac155e91bdfb399f21dbee6fb4e3533f32a0bb3c02589ce0`.
+  Because the packet embeds the complete focused `CONTEXT.md` diff, that one
+  block and the packet digest must be regenerated after this context update;
+  the final post-refresh digest is reported in the handoff rather than embedded
+  recursively here.
+- Coordination exception: repeated workflow-coordinator `apply_patch` calls
+  for the new prompt/packet stalled and were interrupted without producing the
+  requested files. The lead architect completed the prompt and mechanically
+  generated packet as a bounded fallback. This was an orchestration exception,
+  not a role or model/effort substitution; the coordinator independently
+  confirmed the paths, header, sizes, hashes, and 25/25/25 manifest/BEGIN/END
+  counts before this context sync.
+- The final regenerated N1-N3 packet used for Claude review contains 25
+  manifest rows and 25 evidence blocks and has SHA-256
+  `3e27c1c5d029b480ba97788a6e4c2ecc4fe2f78c2fc290b78d5b7294e7726f86`.
+
+Claude QA-planning clearance on 2026-07-21:
+
+- Claude returned **PASS** and explicitly **CLEARED FOR IMPLEMENTATION**.
+  Exact raw response:
+  `docs/ss-019-claude-qa-second-rereview-raw-response.md`.
+- B1, B2, B3, B4, B5, B6, the lead close/token-race precision, N1, N2, and N3
+  are all CLOSED. B2/B5/B6 remain regression-protected. Claude found no new
+  blocker, acceptance gap, missing evidence blocker, or protected-boundary
+  drift.
+- Non-blocking implementation note: awaiting `closeActive()` before navigation
+  or replacement-video rendering intentionally leaves the old view visible
+  until local worker/bitmap cleanup resolves. The builder must preserve the
+  named deferred-close ordering tests and record this short interval in the
+  implementation notes; it does not block implementation.
+- Non-blocking manual-QA note: a phase-declaration edit that does not change the
+  semantic key (`unsupported-input`, `review-required`, or `confirmed`)
+  intentionally does not announce. Manual QA must confirm this anti-chatter
+  behavior so the deliberate silence is not mistaken for a missed
+  announcement.
+- Observability and dependencies remain unchanged. Do not add telemetry,
+  analytics, remote logging, cloud diagnostics, provider SDKs, model assets,
+  hidden identifiers, persistent debug artifacts, expanded console output,
+  dependencies, frameworks, bundle/license-policy changes, notices, or SBOM
+  changes.
+- Protected safety/privacy/non-affiliation copy, local-first raw-media handling,
+  consent, local processing, remote-review-disabled behavior, service-worker
+  and exported-data behavior, labels, selectors, and manual-evidence limits
+  remain unchanged.
+- A single post-clearance refetch/synchronization attempt for SS-019 and
+  SS-TC-023 failed for both pages with
+  `Auth error: OAuth authorization required`. No Notion mutation occurred and
+  no fresh board synchronization is claimed. The pending target state is
+  Handshake Status `3. In Development (ChatGPT)`, Branch
+  `ss-019-accessibility-design-hardening`, Pull Request empty, Claude PASS and
+  clearance recorded, SS-TC-023 aligned, and next owner builder. The last
+  verified live board value remains `2. QA Planning (Claude)` until OAuth access
+  is restored.
+- The active local branch remains `main` at the confirmed baseline. Branch
+  creation is authorized, but this coordinator did not create the story branch
+  and did not edit runtime or test files. Pull Request remains empty.
+- Model/effort metadata exception: Claude Chat exposed no verifiable pinned
+  model identifier or reasoning-effort metadata. No substitution was selected
+  or silently inferred.
+- Next owner: builder. Create `ss-019-accessibility-design-hardening` from
+  confirmed current `main`, implement only the approved specification, preserve
+  all protected boundaries, and complete the required Node 22 automated and
+  manual evidence before final Claude audit.
+
+Implementation orchestration exception on 2026-07-21:
+
+- Claude QA-planning PASS and explicit `CLEARED FOR IMPLEMENTATION` remain
+  valid. The story branch `ss-019-accessibility-design-hardening` was created
+  at base `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1` and is the current branch;
+  Pull Request remains empty.
+- Three builder delegate turns (`builder`, resumed builder, and
+  recovery/minimal variants) were interrupted after repeated non-response.
+  They produced zero runtime, test, or manual-QA edits. No implementation tests
+  ran. Do not claim implementation started or completed.
+- Notion was not retried during this exception handoff. Its last verified value
+  remains `2. QA Planning (Claude)`; target status
+  `3. In Development (ChatGPT)` remains blocked by OAuth authorization.
+- Pinned builder model and reasoning-effort metadata were unavailable for the
+  interrupted delegates. This is recorded as an availability exception, not a
+  model/effort or role substitution.
+- Next owner: a functioning named builder using the approved
+  `docs/ss-019-preimplementation-spec.md`. Preserve all existing SS-019
+  research, Claude handoff/response artifacts, and intentional untracked agent
+  prompts.
+
+SS-019 implementation and audit-preparation state on 2026-07-21:
+
+- A functioning builder retry implemented the approved SS-019 scope as
+  uncommitted changes on `ss-019-accessibility-design-hardening`, based on
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`. Pull Request remains empty.
+- Node `v22.22.3` verification passed:
+  - `npm run test:unit`: 24 files / 217 tests.
+  - `npm run test:smoke`: 48 tests across desktop and mobile Chromium.
+  - `npm run build`, `npm run compliance:verify`, `npm run safety:verify`,
+    `npm run privacy:verify`, and `npm run docs:verify`.
+  - `git diff --check`.
+- Automated browser coverage includes complete keyboard traversal through
+  Swing Card actions, exact live-region ownership, focus and forced-colors
+  behavior, 320 CSS-pixel real failure geometry, and a clean post-reload
+  review/confirmation/export path. A dedicated retry-recovery smoke scenario
+  passes separately.
+- Manual-only risks remain pending and are recorded without a certification
+  claim in `docs/ss-019-manual-accessibility-qa.md`: VoiceOver and NVDA,
+  browser zoom and text spacing, physical mobile and Windows High Contrast,
+  and manual print/download/clipboard inspection are unavailable or not run.
+- The first independent `deep-researcher` implementation review returned FAIL
+  with nine blockers covering stale processing and confirmed-state messaging,
+  invalid phase-assignment markup, overlay announcement ownership, interactive
+  boundary tokens, 320-pixel failure/retry coverage, lifecycle/callsite and
+  smoke-test completeness, and stale manual/context evidence. All nine have
+  been addressed in runtime, test, CSS, and evidence changes.
+- Focused `deep-researcher` re-review passed and closed all nine initial
+  findings plus R1/R2. Focused builder verification passed R1 at 27 of 27 unit
+  tests and R2 at 6 of 6 desktop/mobile smoke tests; the full suites pass at 24
+  files / 217 unit tests and 48 smoke tests. The implementation is ready for a
+  complete self-contained final Claude audit packet; Claude has not yet signed
+  off on the implementation.
+- Observability remains intentionally unchanged: no telemetry, analytics,
+  remote logging, cloud diagnostics, hidden identifiers, persistent debug
+  artifacts, expanded console output, or runtime operator instrumentation was
+  added.
+- Dependency posture remains unchanged: no dependency, framework, provider
+  SDK, model asset, bundle/license-policy, notice, or SBOM change was made.
+- Notion SS-019 was freshly fetched and successfully moved from
+  `2. QA Planning (Claude)` to `3. In Development (ChatGPT)` on 2026-07-21.
+  The correct branch and empty Pull Request were retained, and a concise
+  implementation, verification, boundary, manual-risk, and next-owner note was
+  appended.
+- Next owner: workflow-coordinator prepares the complete self-contained final
+  Claude audit packet, then Claude performs the final adversarial audit.
+- Model/effort metadata exception: the builder and independent
+  `deep-researcher` delegates exposed no verifiable pinned model identifier or
+  reasoning-effort metadata. No silent model, effort, or role substitution is
+  claimed.
+
+SS-019 final implementation-audit handoff on 2026-07-21:
+
+- The focused independent `deep-researcher` re-review PASS closed all nine
+  initial implementation findings and R1/R2. Full Node 22 evidence is 24 files
+  / 217 unit tests and 48 desktop/mobile smoke tests; focused closure evidence
+  is R1 27/27 unit tests and R2 6/6 smoke tests.
+- Final Claude prompt: `docs/ss-019-claude-audit-prompt.md`. Complete source
+  packet: `docs/ss-019-claude-audit-source-packet.md`. Paste the prompt first
+  and the packet immediately afterward; Claude has no repository, GitHub,
+  Notion, or filesystem access.
+- The final packet has 31 manifest rows and 31 unique sequential evidence
+  blocks: complete focused diffs for all 17 changed tracked files, 13 complete
+  current files, and one explicit absent-change record. Mechanical verification
+  re-extracted and byte-compared every block to its exact current file, freshly
+  generated per-file diff, or declared absent record and rechecked line counts,
+  byte counts, and SHA-256 values without summarization or truncation.
+- Immutable historical SS-019 planning prompts, packets, and responses remain
+  preserved as prior evidence but are omitted from the final implementation
+  packet with rationale. The nine intentional untracked agent-guidance prompts
+  remain preserved and omitted. The final prompt and packet exclude themselves
+  to avoid circular evidence.
+- Feedback-retention rules now require behavioral path tests when sign-off
+  depends on exact typed payloads/owners/failure assertions, exact live-region
+  owner IDs plus mutation exclusivity rather than broad role counts, and final
+  durable evidence-count refresh before packet serialization.
+- Manual VoiceOver/NVDA, physical-device/Windows High Contrast, browser zoom,
+  text-spacing, print-preview, generated-file, and clipboard-permission risks
+  remain pending and explicitly prevent any certification claim.
+- Observability and dependency posture remain unchanged. No telemetry,
+  analytics, remote logging, cloud diagnostics, provider/model asset,
+  dependency, bundle/license-policy, notice, lockfile, SBOM, service-worker, or
+  remote-sharing change is included.
+- Notion refetch confirmed Handshake Status `4. Final Audit (Claude)`, Branch
+  `ss-019-accessibility-design-hardening`, and an empty Pull Request after the
+  audit paths, final 217/48 evidence, manual-only risks, unchanged
+  observability/dependency posture, and next owner were recorded.
+- Next owner: Claude for the independent final implementation audit. Do not
+  prepare a PR until Claude returns PASS and explicitly clears PR preparation.
+
 ## SS-018 Coordination
 
 SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 02 Complete focused diff: git diff -- CONTEXT.md -->

### 03 Complete focused diff: git diff -- index.html

Lines: 14  
Bytes: 428  
SHA-256: `b3ddfdd419b9a86eea3bc47f0c93fa47742b0634df0d53d00e8030ace8904940`

<!-- BEGIN EXACT BLOCK: 03 Complete focused diff: git diff -- index.html -->
````````````````````````````````````````````````
diff --git a/index.html b/index.html
index b9d0605..0d408e0 100644
--- a/index.html
+++ b/index.html
@@ -16,7 +16,8 @@
     <title>Swing Sync | New analysis</title>
   </head>
   <body>
-    <main id="app"></main>
+    <div id="app"></div>
+    <div id="app-announcer" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"></div>
     <script type="module" src="/src/main.ts"></script>
   </body>
 </html>

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 03 Complete focused diff: git diff -- index.html -->

### 04 Complete focused diff: git diff -- src/analysis-lifecycle.ts

Lines: 119  
Bytes: 5142  
SHA-256: `98a093715e528633c3b0b2b0d4a5b1bd622ce5dff4b20f1923035138a07e5f09`

<!-- BEGIN EXACT BLOCK: 04 Complete focused diff: git diff -- src/analysis-lifecycle.ts -->
````````````````````````````````````````````````
diff --git a/src/analysis-lifecycle.ts b/src/analysis-lifecycle.ts
index 55ee32f..ad6b7f0 100644
--- a/src/analysis-lifecycle.ts
+++ b/src/analysis-lifecycle.ts
@@ -1,4 +1,5 @@
 import { updateProcessingProgressUi } from "./app-renderer";
+import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
 import type { AppState } from "./app-state";
 import {
   completeProcessingWithOutputs,
@@ -19,12 +20,14 @@ import type {
 export interface AnalysisLifecycleOptions {
   root: ParentNode;
   state: AppState;
-  requestRender(statusMessage?: string): void;
+  requestRender(request?: RenderRequest): void;
+  applyAccessibilityIntent(intent: AccessibilityIntent): void;
 }
 
 export class AnalysisLifecycle {
   private frameController: FrameProcessingController | undefined;
   private abortFrameController: ((code: string) => void) | undefined;
+  private activeCallbackToken: symbol | undefined;
 
   constructor(private readonly options: AnalysisLifecycleOptions) {}
 
@@ -39,10 +42,12 @@ export class AnalysisLifecycle {
 
     resetProcessingCounters(this.options.state);
     resetPhaseReview(this.options.state);
+    const token = Symbol("analysis-controller");
+    this.activeCallbackToken = token;
     const browserController = createBrowserFrameController(video, selectedVideo, {
-      onState: (state, code) => this.handleProcessingState(state, code),
-      onProgress: (completed, total) => this.handleProcessingProgress(completed, total),
-      onOutput: (output) => this.handleProcessingOutput(output)
+      onState: (state, code) => this.handleProcessingState(token, state, code),
+      onProgress: (completed, total) => this.handleProcessingProgress(token, completed, total),
+      onOutput: (output) => this.handleProcessingOutput(token, output)
     });
     this.frameController = browserController.controller;
     this.abortFrameController = browserController.abort;
@@ -51,26 +56,33 @@ export class AnalysisLifecycle {
 
   async stopActive(): Promise<void> {
     const controller = this.frameController;
+    this.activeCallbackToken = undefined;
     resetPhaseReview(this.options.state);
     await controller?.cancel();
     if (this.frameController === controller) this.clearControllerHandles();
     setProcessingState(this.options.state, "idle");
     selectWorkflowStep(this.options.state, "capture");
-    this.options.requestRender("Local analysis stopped and volatile resources were released.");
+    const message = "Local analysis stopped and volatile resources were released.";
+    this.options.requestRender({
+      focusKey: "stage-heading",
+      visibleStatusText: message,
+      announcement: message
+    });
   }
 
   async closeActive(): Promise<void> {
     const controller = this.frameController;
+    this.activeCallbackToken = undefined;
     resetPhaseReview(this.options.state);
     await controller?.close();
     if (this.frameController === controller) this.clearControllerHandles();
     setProcessingState(this.options.state, "idle");
-    this.options.requestRender();
   }
 
   async retryActive(): Promise<void> {
     // Retry progress is surfaced through the processing partial-update path.
     resetPhaseReview(this.options.state);
+    this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
     await this.frameController?.retry();
   }
 
@@ -80,20 +92,30 @@ export class AnalysisLifecycle {
     }
   }
 
-  private handleProcessingState(state: FrameProcessingState, code?: string): void {
+  private handleProcessingState(token: symbol, state: FrameProcessingState, code?: string): void {
+    if (token !== this.activeCallbackToken) return;
     setProcessingState(this.options.state, state, code);
     if (state === "completed" && this.frameController) {
       completeProcessingWithOutputs(this.options.state, this.frameController);
     }
     updateProcessingProgressUi(this.options.root, this.options.state);
+    if (
+      (state === "completed" || state === "failed") &&
+      this.options.state.activeStep === "processing" &&
+      token === this.activeCallbackToken
+    ) {
+      this.options.applyAccessibilityIntent({ focusKey: "stage-heading" });
+    }
   }
 
-  private handleProcessingProgress(completed: number, total: number): void {
+  private handleProcessingProgress(token: symbol, completed: number, total: number): void {
+    if (token !== this.activeCallbackToken) return;
     setProcessingProgress(this.options.state, completed, total);
     updateProcessingProgressUi(this.options.root, this.options.state);
   }
 
-  private handleProcessingOutput(output: SampledFrameOutput): void {
+  private handleProcessingOutput(token: symbol, output: SampledFrameOutput): void {
+    if (token !== this.activeCallbackToken) return;
     recordProcessingOutput(this.options.state, output);
     updateProcessingProgressUi(this.options.root, this.options.state);
   }
@@ -101,5 +123,6 @@ export class AnalysisLifecycle {
   private clearControllerHandles(): void {
     this.frameController = undefined;
     this.abortFrameController = undefined;
+    this.activeCallbackToken = undefined;
   }
 }

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 04 Complete focused diff: git diff -- src/analysis-lifecycle.ts -->

### 05 Complete focused diff: git diff -- src/app-events.ts

Lines: 215  
Bytes: 11160  
SHA-256: `cef8921ecc692360635b6fd0e53e085834d9c246e1e6dfffd25b1319f1645279`

<!-- BEGIN EXACT BLOCK: 05 Complete focused diff: git diff -- src/app-events.ts -->
````````````````````````````````````````````````
diff --git a/src/app-events.ts b/src/app-events.ts
index 92f082d..52ee2eb 100644
--- a/src/app-events.ts
+++ b/src/app-events.ts
@@ -1,4 +1,5 @@
 import type { AnalysisLifecycle } from "./analysis-lifecycle";
+import type { AccessibilityIntent, RenderRequest } from "./app-accessibility";
 import {
   confirmPhaseReview,
   rebuildPhaseReviewState,
@@ -19,34 +20,41 @@ export interface AppEventsDependencies {
   state: AppState;
   consent: SafetyConsentStore;
   lifecycle: AnalysisLifecycle;
-  requestRender(statusMessage?: string): void;
+  requestRender(request?: RenderRequest): void;
+  applyAccessibilityIntent(intent: AccessibilityIntent): void;
 }
 
 export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependencies): void {
-  const { state, consent, lifecycle, requestRender } = dependencies;
+  const { state, consent, lifecycle, requestRender, applyAccessibilityIntent } = dependencies;
 
   root.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
     consent.setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
-    requestRender();
+    const accepted = consent.hasSafetyConsent();
+    const message = accepted
+      ? "Safety acknowledgement recorded locally."
+      : "Safety acknowledgement is required before analysis.";
+    requestRender({ focusKey: "safety-consent", announcement: message });
   });
 
   root.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
     if (!consent.hasSafetyConsent()) {
-      requestRender("Please acknowledge the safety terms before starting analysis.");
-      root.querySelector<HTMLInputElement>("#safety-consent")?.focus();
+      const message = "Please acknowledge the safety terms before starting analysis.";
+      requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });
       return;
     }
     if (!state.selectedVideo) {
-      requestRender("Choose a local video before starting analysis.");
+      const message = "Choose a local video before starting analysis.";
+      requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });
       return;
     }
     selectWorkflowStep(state, "processing");
-    requestRender("Loading approved local pose assets. No video data leaves this device.");
+    const message = "Loading approved local pose assets. No video data leaves this device.";
+    requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
     void lifecycle.startActive();
   });
 
   root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
-    button.addEventListener("click", () => {
+    button.addEventListener("click", async () => {
       const nextStep = button.dataset.step as WorkflowStepId;
       const opensCompletedReview =
         state.activeStep === "processing" && state.processingState === "completed" && nextStep === "review";
@@ -58,32 +66,40 @@ export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependenc
         !opensCompletedReview &&
         !preservesReviewData
       ) {
-        void lifecycle.closeActive();
+        await lifecycle.closeActive();
       }
       selectWorkflowStep(state, nextStep);
-      requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
+      const message = `${getWorkflowStep(state.activeStep).label} opened.`;
+      requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
     });
   });
 
   root.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
     selectWorkflowStep(state, getNextWorkflowStep(state.activeStep).id);
-    requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
+    const message = `${getWorkflowStep(state.activeStep).label} opened.`;
+    requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });
   });
 
   root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
     root.querySelector<HTMLInputElement>("#video-file")?.click();
   });
 
-  root.querySelector<HTMLInputElement>("#video-file")?.addEventListener("change", (event) => {
+  const fileInput = root.querySelector<HTMLInputElement>("#video-file");
+  fileInput?.addEventListener("change", async (event) => {
     const file = (event.currentTarget as HTMLInputElement).files?.[0];
     if (!file) return;
-    void lifecycle.closeActive();
+    await lifecycle.closeActive();
     selectLocalVideo(state, file);
-    requestRender("Local video selected. It has not been analyzed or persisted.");
+    const message = "Local video selected. It has not been analyzed or persisted.";
+    requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });
   });
+  fileInput?.addEventListener("cancel", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
+  fileInput?.addEventListener("focus", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
+  fileInput?.addEventListener("focusin", () => applyAccessibilityIntent({ focusKey: "video-picker" }));
 
   root.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
-    requestRender("Camera capture remains out of scope. Choose a local video file.");
+    const message = "Camera capture remains out of scope. Choose a local video file.";
+    requestRender({ focusKey: "camera-placeholder", visibleStatusText: message, announcement: message });
   });
 
   root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
@@ -96,55 +112,67 @@ export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependenc
 
   root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
     selectWorkflowStep(state, "review");
-    requestRender("Review the provisional phase labels before future measurements become available.");
+    const message = "Review the provisional phase labels before future measurements become available.";
+    requestRender({ focusKey: "phase-review-heading", visibleStatusText: message, announcement: message });
   });
 
   root.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
+    const before = phaseSemanticKey(state);
     setPhaseDeclaration(state, "view", declarationValue((event.currentTarget as HTMLSelectElement).value, "view"));
     rebuildPhaseReviewState(state);
-    requestRender();
+    requestRender(phaseRenderRequest("phase-declaration:view", before, state));
   });
   root.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
+    const before = phaseSemanticKey(state);
     setPhaseDeclaration(
       state,
       "handedness",
       declarationValue((event.currentTarget as HTMLSelectElement).value, "handedness")
     );
     rebuildPhaseReviewState(state);
-    requestRender();
+    requestRender(phaseRenderRequest("phase-declaration:handedness", before, state));
   });
   root.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
+    const before = phaseSemanticKey(state);
     setPhaseDeclaration(state, "mirrored", declarationValue((event.currentTarget as HTMLSelectElement).value, "mirrored"));
     rebuildPhaseReviewState(state);
-    requestRender();
+    requestRender(phaseRenderRequest("phase-declaration:mirrored", before, state));
   });
   root.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
+    const before = phaseSemanticKey(state);
     setPhaseDeclaration(state, "setup", (event.currentTarget as HTMLInputElement).checked ? "confirmed" : "undeclared");
     rebuildPhaseReviewState(state);
-    requestRender();
+    requestRender(phaseRenderRequest("phase-setup", before, state));
   });
   root.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
     select.addEventListener("change", () => {
       setPhaseDraftAssignment(state, Number(select.dataset.phaseIndex), Number(select.value));
-      requestRender();
+      requestRender({ focusKey: `phase-assignment:${Number(select.dataset.phaseIndex)}` as RenderRequest["focusKey"] });
     });
   });
   root.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
     setPhaseConfirmation(state, (event.currentTarget as HTMLInputElement).checked);
-    requestRender();
+    requestRender({ focusKey: "phase-confirmation" });
   });
   root.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
+    const before = phaseSemanticKey(state);
     confirmPhaseReview(state);
-    requestRender();
+    const after = phaseSemanticKey(state);
+    const message = after === "confirmed" ? "Phase review confirmed." : "Phase review could not be confirmed.";
+    requestRender({
+      focusKey: "phase-review-heading",
+      ...(before !== after || after !== "confirmed" ? { visibleStatusText: message, announcement: message } : {})
+    });
   });
   root.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
     selectWorkflowStep(state, "export");
-    requestRender("Swing Card export opened.");
+    const message = "Swing Card export opened.";
+    requestRender({ focusKey: "swing-card-heading", visibleStatusText: message, announcement: message });
   });
   root.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
     button.addEventListener("click", () => {
       selectKeyframe(state, Number(button.dataset.keyframeIndex));
-      requestRender();
+      requestRender({ focusKey: `keyframe:${Number(button.dataset.keyframeIndex)}` as RenderRequest["focusKey"] });
     });
   });
   root.querySelector<HTMLButtonElement>("[data-download-swing-card]")?.addEventListener("click", () => {
@@ -157,3 +185,28 @@ export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependenc
     void copySwingCardPrompt(state, requestRender);
   });
 }
+
+type PhaseSemanticKey = "unsupported-input" | "review-required" | "confirmed";
+
+function phaseSemanticKey(state: AppState): PhaseSemanticKey {
+  if (state.phaseReviewState?.readyForFutureMetrics) return "confirmed";
+  return state.phaseReviewState?.automaticProposal.evidenceStatus === "review-required"
+    ? "review-required"
+    : "unsupported-input";
+}
+
+function phaseMessage(key: PhaseSemanticKey): string {
+  return key === "confirmed"
+    ? "Phase review confirmed."
+    : key === "review-required"
+      ? "Swing phase suggestions are ready for review."
+      : "Required video declarations and a supported eight-sample run are needed.";
+}
+
+function phaseRenderRequest(focusKey: RenderRequest["focusKey"], before: PhaseSemanticKey, state: AppState): RenderRequest {
+  const after = phaseSemanticKey(state);
+  return {
+    focusKey,
+    ...(before !== after ? { visibleStatusText: phaseMessage(after), announcement: phaseMessage(after) } : {})
+  };
+}

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 05 Complete focused diff: git diff -- src/app-events.ts -->

### 06 Complete focused diff: git diff -- src/app-renderer.ts

Lines: 205  
Bytes: 13807  
SHA-256: `29ad57eadebfcbaa5d8b21b0a506b9ec504a7b1c8c31dd74f6783a83ac0fb0e5`

<!-- BEGIN EXACT BLOCK: 06 Complete focused diff: git diff -- src/app-renderer.ts -->
````````````````````````````````````````````````
diff --git a/src/app-renderer.ts b/src/app-renderer.ts
index 1a8bb9b..81e2432 100644
--- a/src/app-renderer.ts
+++ b/src/app-renderer.ts
@@ -13,7 +13,9 @@ export function renderApp(root: HTMLElement, state: AppState, consentAccepted: b
   const currentStatus =
     statusMessage ??
     (consentAccepted
-      ? "Consent recorded locally. Choose a local video to begin analysis."
+      ? state.selectedVideo
+        ? "Local video selected. Begin analysis when ready."
+        : "Consent recorded locally. Choose a local video to begin analysis."
       : "First analysis is blocked until this acknowledgement is checked.");
 
   root.innerHTML = `
@@ -33,7 +35,7 @@ export function renderApp(root: HTMLElement, state: AppState, consentAccepted: b
               .map(
                 (item, index) => `
                   <button class="step-button ${item.id === state.activeStep ? "is-active" : ""}" type="button"
-                    data-step="${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
+                    data-step="${item.id}" data-focus-key="workflow-step:${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
                     <span class="step-number">${index + 1}</span><span>${item.shortLabel}</span>
                   </button>`
               )
@@ -41,7 +43,7 @@ export function renderApp(root: HTMLElement, state: AppState, consentAccepted: b
           </nav>
           <section class="stage" aria-labelledby="stage-heading">
             <div class="stage-heading">
-              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading">${step.label}</h2></div>
+              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading" tabindex="-1" data-focus-key="stage-heading">${step.label}</h2></div>
               <span class="stage-status">${step.status}</span>
             </div>
             <p class="stage-description">${step.description}</p>
@@ -58,11 +60,11 @@ export function renderApp(root: HTMLElement, state: AppState, consentAccepted: b
             <li>Consult qualified medical or coaching professionals for personal concerns.</li>
           </ul>
           <label class="consent-check">
-            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
+            <input id="safety-consent" type="checkbox" data-focus-key="safety-consent" ${consentAccepted ? "checked" : ""} />
             <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
           </label>
           <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable or legally audited consent record.</p>
-          <p class="status" role="status">${currentStatus}</p>
+          <p class="status" id="app-visible-status">${currentStatus}</p>
         </aside>
       </main>
     </div>
@@ -72,19 +74,19 @@ export function renderApp(root: HTMLElement, state: AppState, consentAccepted: b
 export function renderWorkflowPanel(state: AppState, consentAccepted: boolean): string {
   if (state.activeStep === "capture") {
     return `
-      <div class="capture-options" aria-label="Local video source">
-        <button class="source-option" type="button" data-placeholder-action="camera">
+      <div class="capture-options" role="group" aria-label="Local video source">
+        <button class="source-option" type="button" data-placeholder-action="camera" data-focus-key="camera-placeholder">
           <span class="source-option__title">Use camera</span>
           <span>Camera capture is not part of this story</span>
         </button>
-        <button class="source-option" type="button" data-video-picker>
+        <button class="source-option" type="button" data-video-picker data-focus-key="video-picker">
           <span class="source-option__title">Choose a video</span>
           <span>${state.selectedVideo ? escapeHtml(state.selectedVideo.name) : "Select a local video file"}</span>
         </button>
-        <input id="video-file" class="visually-hidden" type="file" accept="video/*" />
+        <input id="video-file" class="visually-hidden" type="file" accept="video/*" tabindex="-1" aria-label="Choose a local video file" />
       </div>
       <div class="action-row">
-        <button id="analysis-button" class="primary-action" type="button" ${
+        <button id="analysis-button" class="primary-action" type="button" data-focus-key="analysis-start" aria-describedby="app-visible-status" ${
           selectCanBeginAnalysis(state, consentAccepted) ? "" : "disabled"
         }>
           Begin analysis
@@ -96,20 +98,21 @@ export function renderWorkflowPanel(state: AppState, consentAccepted: boolean):
 
   if (state.activeStep === "processing") {
     return `
-      <div class="processing-placeholder" aria-label="Local pose processing">
+      <div class="processing-placeholder ${state.processingState === "failed" ? "is-failed" : ""}" role="group" aria-label="Local pose processing">
         <div class="processing-mark" aria-hidden="true"></div>
         <div>
-          <strong>${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
+          <strong id="processing-status" role="status" aria-live="polite" aria-atomic="true">${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
           <p data-pose-summary>${processingSummaryText(state)}</p>
         </div>
       </div>
       <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
       <div class="action-row">
-        <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
-        <button class="secondary-action" type="button" data-retry-analysis hidden>Retry local analysis</button>
-        <button class="primary-action" type="button" data-review-phases ${
+        <button class="secondary-action" type="button" data-cancel-analysis data-focus-key="stop-analysis">Stop local analysis</button>
+        <button class="secondary-action" type="button" data-retry-analysis data-focus-key="retry-analysis" hidden>Retry local analysis</button>
+        <button class="primary-action" type="button" data-review-phases data-focus-key="review-phases" aria-describedby="phase-review-status" ${
           state.processingState === "completed" ? "" : "hidden"
         }>Review phase labels</button>
+        <p class="action-note" id="phase-review-status">${processingReviewStatusText(state.processingState, state.poseStatusCode)}</p>
       </div>
     `;
   }
@@ -117,7 +120,7 @@ export function renderWorkflowPanel(state: AppState, consentAccepted: boolean):
   if (state.activeStep === "review") {
     if (state.phaseOutputs.length > 0) return renderPhaseReview(state);
     return `
-      <div class="review-placeholder" aria-label="Review placeholder">
+      <div class="review-placeholder" role="group" aria-label="Review placeholder">
         <div class="swing-frame"><span>Video and pose preview</span></div>
         <dl class="metric-list">
           <div><dt>Tempo</dt><dd>--</dd></div>
@@ -125,18 +128,19 @@ export function renderWorkflowPanel(state: AppState, consentAccepted: boolean):
           <div><dt>Rotation</dt><dd>--</dd></div>
         </dl>
       </div>
-      <button class="secondary-action" type="button" data-next-step>Preview export state</button>
+      <button class="secondary-action" type="button" data-next-step data-focus-key="workflow-next">Preview export state</button>
     `;
   }
 
   if (state.phaseOutputs.length === 0) {
     return `
-      <div class="export-placeholder" aria-label="Export placeholder">
+      <section class="export-placeholder" aria-labelledby="export-placeholder-heading">
         <p class="placeholder-kicker">Local Swing Card</p>
-        <h3>Swing Card unavailable</h3>
+        <h3 id="export-placeholder-heading">Swing Card unavailable</h3>
         <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
-      </div>
-      <button class="secondary-action" type="button" disabled>Export is not available yet</button>
+      </section>
+      <button class="secondary-action" type="button" disabled aria-describedby="phase-review-status">Export is not available yet</button>
+      <p class="action-note" id="phase-review-status">A valid, confirmed phase review is required before export is available.</p>
     `;
   }
 
@@ -144,15 +148,17 @@ export function renderWorkflowPanel(state: AppState, consentAccepted: boolean):
 }
 
 export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
-  const status = root.querySelector<HTMLElement>(".processing-placeholder strong");
+  const status = root.querySelector<HTMLElement>("#processing-status");
   const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
   const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
   const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");
+  const reviewStatus = root.querySelector<HTMLElement>("#phase-review-status");
 
   if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
   if (summary) summary.textContent = processingSummaryText(state);
   if (retry) retry.hidden = state.processingState !== "failed";
   if (review) review.hidden = state.processingState !== "completed";
+  if (reviewStatus) reviewStatus.textContent = processingReviewStatusText(state.processingState, state.poseStatusCode);
 }
 
 function renderSwingCardExport(state: AppState): string {
@@ -173,12 +179,12 @@ function renderSwingCardExport(state: AppState): string {
       <div class="swing-card-panel__header">
         <div>
           <p class="placeholder-kicker">Local Swing Card</p>
-          <h3 id="swing-card-heading">Downloadable summary</h3>
+          <h3 id="swing-card-heading" tabindex="-1" data-focus-key="swing-card-heading">Downloadable summary</h3>
         </div>
         <span class="stage-status">Manual sharing</span>
       </div>
       <p>This card can include annotated keyframes, unavailable metric states, warnings, and prompt text for a manual LLM chat upload. Raw swing video is not included.</p>
-      <div class="swing-card-summary" aria-label="Swing Card contents">
+      <div class="swing-card-summary" role="group" aria-label="Swing Card contents">
         <div><strong>${state.phaseOutputs.length}</strong><span>local keyframes</span></div>
         <div><strong>PNG</strong><span>download</span></div>
         <div><strong>Print</strong><span>save as PDF where supported</span></div>
@@ -187,10 +193,10 @@ function renderSwingCardExport(state: AppState): string {
         ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
       </ul>
       <div class="action-row swing-card-actions">
-        <button class="primary-action" type="button" data-download-swing-card ${state.swingCardBusy ? "disabled" : ""}>Download PNG</button>
-        <button class="secondary-action" type="button" data-print-swing-card ${state.swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
-        <button class="secondary-action" type="button" data-copy-swing-card-prompt ${state.swingCardBusy ? "disabled" : ""}>Copy prompt</button>
-        <p class="action-note" data-swing-card-status role="status">${escapeHtml(state.swingCardStatus)}</p>
+        <button class="primary-action" type="button" data-download-swing-card data-focus-key="swing-card-download" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Download PNG</button>
+        <button class="secondary-action" type="button" data-print-swing-card data-focus-key="swing-card-print" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Print / Save as PDF</button>
+        <button class="secondary-action" type="button" data-copy-swing-card-prompt data-focus-key="swing-card-copy" ${state.swingCardBusy ? 'disabled aria-describedby="swing-card-action-status"' : ""}>Copy prompt</button>
+        <p class="action-note" id="swing-card-action-status" data-swing-card-status tabindex="-1" data-focus-key="swing-card-status">${escapeHtml(state.swingCardStatus)}</p>
       </div>
       <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
       ${renderRemoteModelReviewPanel()}
@@ -214,6 +220,22 @@ function processingStatusText(state: FrameProcessingState, code?: string): strin
               : "Preparing local pose analysis.";
 }
 
+function processingReviewStatusText(state: FrameProcessingState, code?: string): string {
+  return state === "completed"
+    ? "Local processing output is ready for phase review."
+    : state === "failed"
+      ? `Phase review is unavailable because local pose analysis stopped (${code ?? "UNKNOWN_ERROR"}). Retry local analysis.`
+      : state === "cancelled"
+        ? "Phase review is unavailable because local processing was cancelled."
+        : state === "closed"
+          ? "Phase review is unavailable because the local pose session was closed."
+          : state === "loading"
+            ? "Phase review requires local pose model loading and processing to complete."
+            : state === "processing"
+              ? "Phase review requires local video frame processing to complete."
+              : "Phase review requires completed local processing output.";
+}
+
 function processingSummaryText(state: AppState): string {
   return `${state.extractedFrameCount} of ${state.totalFrameCount} video frames processed.${
     state.latestLandmarkCount > 0

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 06 Complete focused diff: git diff -- src/app-renderer.ts -->

### 07 Complete focused diff: git diff -- src/keyframe-overlay-renderer.ts

Lines: 50  
Bytes: 2282  
SHA-256: `a6cf6fecacb1ff55ed5badaa75d0db84219138f67d065da6ced25d8512ebc7ac`

<!-- BEGIN EXACT BLOCK: 07 Complete focused diff: git diff -- src/keyframe-overlay-renderer.ts -->
````````````````````````````````````````````````
diff --git a/src/keyframe-overlay-renderer.ts b/src/keyframe-overlay-renderer.ts
index 07584f6..db913e0 100644
--- a/src/keyframe-overlay-renderer.ts
+++ b/src/keyframe-overlay-renderer.ts
@@ -3,24 +3,34 @@ import { setOverlayResult } from "./app-state";
 import type { SampledFrameOutput } from "./frame-processing";
 import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";
 
-export function renderSelectedKeyframeCanvas(root: ParentNode, state: AppState): void {
+type OverlayFrameRenderer = typeof renderPoseOverlayFrame;
+
+export function renderSelectedKeyframeCanvas(
+  root: ParentNode,
+  state: AppState,
+  announceOverlayStatus = false,
+  renderFrame: OverlayFrameRenderer = renderPoseOverlayFrame
+): void {
   const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
   if (!canvas || state.phaseOutputs.length === 0) return;
   const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
-  const status = root.querySelector<HTMLElement>("[data-overlay-status]");
-  const result = renderPoseOverlayFrame(canvas, {
+  const status = root.querySelector<HTMLElement>("#keyframe-overlay-status");
+  const result = renderFrame(canvas, {
     preview: output.preview,
     landmarks: output.pose.landmarks[0]
   });
   setOverlayResult(state, result);
-  if (status) {
-    status.textContent =
-      result.status === "unavailable"
-        ? "Skeleton overlay unavailable for this keyframe."
-        : result.status === "partial"
-          ? "Skeleton overlay partially available for this keyframe."
-          : "Skeleton overlay rendered for this keyframe.";
-  }
+  if (status && announceOverlayStatus) status.textContent = overlayStatusText(result.status);
+}
+
+export function overlayStatusText(status: PoseOverlayRenderResult["status"] | undefined): string {
+  return status === "unavailable"
+    ? "Skeleton overlay unavailable for this keyframe."
+    : status === "partial"
+      ? "Skeleton overlay partially available for this keyframe."
+      : status === "rendered"
+        ? "Skeleton overlay rendered for this keyframe."
+        : "Skeleton overlay availability is determined locally for this keyframe.";
 }
 
 export async function renderAnnotatedKeyframe(

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 07 Complete focused diff: git diff -- src/keyframe-overlay-renderer.ts -->

### 08 Complete focused diff: git diff -- src/main.ts

Lines: 65  
Bytes: 2095  
SHA-256: `5c87fc101c4130abc6f5c2ba1d831e7e62631c0c10c5186700611fd1aee08bf7`

<!-- BEGIN EXACT BLOCK: 08 Complete focused diff: git diff -- src/main.ts -->
````````````````````````````````````````````````
diff --git a/src/main.ts b/src/main.ts
index 728fbe8..630e8b8 100644
--- a/src/main.ts
+++ b/src/main.ts
@@ -1,4 +1,11 @@
 import "./styles.css";
+import {
+  applyAccessibilityIntent as applyDomAccessibilityIntent,
+  applyPostRenderAccessibility,
+  capturePriorFocusKey,
+  type AccessibilityIntent,
+  type RenderRequest
+} from "./app-accessibility";
 import { AnalysisLifecycle } from "./analysis-lifecycle";
 import { bindAppEvents } from "./app-events";
 import { renderApp } from "./app-renderer";
@@ -7,25 +14,43 @@ import { createSafetyConsentStore } from "./consent-state";
 import { renderSelectedKeyframeCanvas } from "./keyframe-overlay-renderer";
 
 const app = document.querySelector<HTMLDivElement>("#app");
+const announcer = document.querySelector<HTMLDivElement>("#app-announcer");
 const state = createInitialAppState();
 const consent = createSafetyConsentStore();
 
-function requestRender(statusMessage?: string): void {
+function requestRender(request: RenderRequest = {}): void {
   if (!app) return;
-  renderApp(app, state, consent.hasSafetyConsent(), statusMessage);
+  const priorFocusKey = capturePriorFocusKey(app);
+  renderApp(app, state, consent.hasSafetyConsent(), request.visibleStatusText);
   bindAppEvents(app, {
     state,
     consent,
     lifecycle,
-    requestRender
+    requestRender,
+    applyAccessibilityIntent
   });
-  renderSelectedKeyframeCanvas(app, state);
+  renderSelectedKeyframeCanvas(app, state, /^keyframe:[0-7]$/.test(request.focusKey ?? ""));
+  document.title = `Swing Sync | ${state.activeStep[0].toUpperCase()}${state.activeStep.slice(1)}`;
+  applyPostRenderAccessibility(
+    app,
+    announcer,
+    state.activeStep,
+    state.phaseOutputs.length > 0,
+    request,
+    priorFocusKey
+  );
+}
+
+function applyAccessibilityIntent(intent: AccessibilityIntent): void {
+  if (!app) return;
+  applyDomAccessibilityIntent(app, announcer, intent);
 }
 
 const lifecycle = new AnalysisLifecycle({
   root: app ?? document,
   state,
-  requestRender
+  requestRender,
+  applyAccessibilityIntent
 });
 
 requestRender();

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 08 Complete focused diff: git diff -- src/main.ts -->

### 09 Complete focused diff: git diff -- src/phase-review-renderer.ts

Lines: 143  
Bytes: 9327  
SHA-256: `b3d39f01b186e5de1adff6aeab01a43a364b4ccb7c0423a69a88ac38e7f5704a`

<!-- BEGIN EXACT BLOCK: 09 Complete focused diff: git diff -- src/phase-review-renderer.ts -->
````````````````````````````````````````````````
diff --git a/src/phase-review-renderer.ts b/src/phase-review-renderer.ts
index 76b22c0..ec08907 100644
--- a/src/phase-review-renderer.ts
+++ b/src/phase-review-renderer.ts
@@ -1,4 +1,5 @@
 import type { AppState } from "./app-state";
+import { overlayStatusText } from "./keyframe-overlay-renderer";
 import { isValidCorrection, phaseDefinitions, type PhaseDeclarations } from "./phase-review";
 
 export function renderPhaseReview(state: AppState): string {
@@ -6,46 +7,50 @@ export function renderPhaseReview(state: AppState): string {
   const reviewRequired = proposal?.evidenceStatus === "review-required";
   const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
   const warning =
-    proposal?.evidenceStatus === "unsupported-input"
+    ready
+      ? "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here."
+      : proposal?.evidenceStatus === "unsupported-input"
       ? "Select every required declaration and provide a supported active eight-sample run."
       : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";
 
   return `
     <section class="phase-review" aria-labelledby="phase-review-heading">
       ${renderKeyframeOverlayReview(state)}
-      <div class="phase-warning" role="status" aria-live="polite">
-        <strong id="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</strong>
+      <div class="phase-warning" id="phase-review-status">
+        <h3 id="phase-review-heading" tabindex="-1" data-focus-key="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</h3>
         <p>${warning}</p>
       </div>
       <fieldset class="phase-declarations">
         <legend>Required video declarations</legend>
-        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, [
+        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, "phase-declaration:view", [
           ["undeclared", "Select view"],
           ["face-on", "Face-on side view"]
         ])}
-        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, [
+        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, "phase-declaration:handedness", [
           ["undeclared", "Select handedness"],
           ["right", "Right-handed"],
           ["left", "Left-handed"]
         ])}
-        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, [
+        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, "phase-declaration:mirrored", [
           ["undeclared", "Select mirrored status"],
           ["no", "No"],
           ["yes", "Yes"]
         ])}
         <label class="phase-setup-confirmation">
-          <input id="phase-setup" type="checkbox" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
+          <input id="phase-setup" type="checkbox" data-focus-key="phase-setup" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
           <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
         </label>
       </fieldset>
-      <div class="phase-assignment-list" aria-label="Swing phase assignments">
+      <div class="phase-assignment-list" role="group" aria-label="Swing phase assignments">
         ${phaseDefinitions
           .map((phase, index) => {
             const selected = state.phaseDraft[index]?.sampleIndex ?? index;
+            const controlId = `phase-assignment-${index}`;
             return `
-              <label class="phase-assignment">
-                <span><strong>${phase.label}</strong><small>Ordered phase ${index + 1}</small></span>
-                <select aria-label="${phase.label} sample" data-phase-index="${index}" ${reviewRequired && !ready ? "" : "disabled"}>
+              <div class="phase-assignment">
+                <div><h3>${phase.label}</h3><small>Ordered phase ${index + 1}</small></div>
+                <label class="visually-hidden" for="${controlId}">${phase.label} sample</label>
+                <select id="${controlId}" data-phase-index="${index}" data-focus-key="phase-assignment:${index}" ${reviewRequired && !ready ? "" : "disabled"}>
                   ${phaseDefinitions
                     .map(
                       (_, sampleIndex) =>
@@ -53,21 +58,21 @@ export function renderPhaseReview(state: AppState): string {
                     )
                     .join("")}
                 </select>
-              </label>`;
+              </div>`;
           })
           .join("")}
       </div>
       <label class="phase-confirmation">
-        <input id="phase-confirmation" type="checkbox" ${state.phaseConfirmation ? "checked" : ""} ${
+        <input id="phase-confirmation" type="checkbox" data-focus-key="phase-confirmation" ${state.phaseConfirmation ? "checked" : ""} ${
           reviewRequired && !ready ? "" : "disabled"
         } />
         <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
       </label>
       <div class="action-row">
-        <button class="primary-action" type="button" data-confirm-phase-review ${
+        <button class="primary-action" type="button" data-confirm-phase-review data-focus-key="phase-confirm" aria-describedby="phase-review-status" ${
           reviewRequired && state.phaseConfirmation && isValidCorrection(state.phaseDraft) && !ready ? "" : "disabled"
         }>Confirm phase review</button>
-        <button class="secondary-action" type="button" data-open-export>Open Swing Card export</button>
+        <button class="secondary-action" type="button" data-open-export data-focus-key="open-export">Open Swing Card export</button>
         <p class="action-note">${ready ? "Future metric readiness is available for a separately reviewed story. No metrics are generated here." : "Future metric readiness remains locked until this review is valid and explicitly confirmed."}</p>
       </div>
     </section>
@@ -77,12 +82,7 @@ export function renderPhaseReview(state: AppState): string {
 function renderKeyframeOverlayReview(state: AppState): string {
   const selectedOutput = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
   const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
-  const overlayStatus =
-    state.latestOverlayResult?.status === "unavailable"
-      ? "Skeleton overlay unavailable for this keyframe."
-      : state.latestOverlayResult?.status === "partial"
-        ? "Skeleton overlay partially available for this keyframe."
-        : "Skeleton overlay rendered for this keyframe.";
+  const overlayStatus = overlayStatusText(state.latestOverlayResult?.status);
 
   return `
     <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
@@ -94,14 +94,14 @@ function renderKeyframeOverlayReview(state: AppState): string {
         <span class="stage-status">Annotated still</span>
       </div>
       <div class="keyframe-canvas-wrap">
-        <canvas class="keyframe-canvas" data-keyframe-canvas aria-label="Annotated keyframe: ${selectedPhase.label}"></canvas>
+        <canvas class="keyframe-canvas" data-keyframe-canvas role="img" aria-label="Annotated keyframe: ${selectedPhase.label}" aria-describedby="keyframe-overlay-status"></canvas>
       </div>
-      <p class="action-note" data-overlay-status>${overlayStatus}</p>
-      <div class="keyframe-strip" aria-label="Select keyframe">
+      <p class="action-note" id="keyframe-overlay-status" data-overlay-status role="status" aria-live="polite" aria-atomic="true">${overlayStatus}</p>
+      <div class="keyframe-strip" role="group" aria-label="Select keyframe">
         ${phaseDefinitions
           .map((phase, index) => {
             const isSelected = state.selectedKeyframeIndex === index;
-            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" aria-pressed="${isSelected ? "true" : "false"}">
+            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" data-focus-key="keyframe:${index}" aria-pressed="${isSelected ? "true" : "false"}">
               <span>${index + 1}</span>
               <strong>${phase.label}</strong>
             </button>`;
@@ -116,9 +116,10 @@ function renderDeclarationSelect(
   id: string,
   label: string,
   selected: string,
+  focusKey: string,
   options: readonly (readonly [string, string])[]
 ): string {
-  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}">${options
+  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}" data-focus-key="${focusKey}">${options
     .map(([value, text]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${text}</option>`)
     .join("")}</select></label>`;
 }

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 09 Complete focused diff: git diff -- src/phase-review-renderer.ts -->

### 10 Complete focused diff: git diff -- src/remote-model-renderer.ts

Lines: 26  
Bytes: 1766  
SHA-256: `936a32d1e7cb443590b2c6ca0da8da13545895f588adbffe39acf8c799455722`

<!-- BEGIN EXACT BLOCK: 10 Complete focused diff: git diff -- src/remote-model-renderer.ts -->
````````````````````````````````````````````````
diff --git a/src/remote-model-renderer.ts b/src/remote-model-renderer.ts
index 76d4f33..5009910 100644
--- a/src/remote-model-renderer.ts
+++ b/src/remote-model-renderer.ts
@@ -17,7 +17,8 @@ export function renderRemoteModelReviewPanel(): string {
         <span class="stage-status">Off by default</span>
       </div>
       <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
-      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
+      <div role="group" aria-label="Remote model data disclosure">
+      <dl class="remote-model-disclosure">
         <div>
           <dt>Provider registry</dt>
           <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
@@ -31,8 +32,9 @@ export function renderRemoteModelReviewPanel(): string {
           <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
         </div>
       </dl>
-      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
-      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
+      </div>
+      <button class="secondary-action" type="button" disabled data-remote-model-send aria-describedby="remote-model-status">Remote review unavailable</button>
+      <p class="action-note" id="remote-model-status" data-remote-model-status>Remote model review is unavailable until a provider is separately reviewed and configured.</p>
     </section>
   `;
 }

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 10 Complete focused diff: git diff -- src/remote-model-renderer.ts -->

### 11 Complete focused diff: git diff -- src/styles.css

Lines: 235  
Bytes: 4464  
SHA-256: `ac6a9d5f3eab2d77f0f69c5ea3fe8631124d32e0c913653ed52091a2a9751e29`

<!-- BEGIN EXACT BLOCK: 11 Complete focused diff: git diff -- src/styles.css -->
````````````````````````````````````````````````
diff --git a/src/styles.css b/src/styles.css
index 0868a85..6e96766 100644
--- a/src/styles.css
+++ b/src/styles.css
@@ -1,4 +1,7 @@
 :root {
+  --focus-inner: #ffffff;
+  --focus-outer: #17211b;
+  --interactive-boundary: #607367;
   color: #17211b;
   background: #f3f5f1;
   font-family:
@@ -29,9 +32,11 @@ button {
 button:focus-visible,
 input:focus-visible,
 select:focus-visible,
-a:focus-visible {
-  outline: 3px solid #d7972d;
-  outline-offset: 3px;
+a:focus-visible,
+[tabindex="-1"]:focus-visible {
+  outline: 2px solid var(--focus-inner);
+  outline-offset: 2px;
+  box-shadow: 0 0 0 6px var(--focus-outer);
 }
 
 .visually-hidden {
@@ -87,6 +92,14 @@ a:focus-visible {
   align-items: start;
 }
 
+.workspace > *,
+.stage > *,
+.action-row > *,
+.swing-card-panel > *,
+.remote-model-panel > * {
+  min-width: 0;
+}
+
 .workflow {
   min-width: 0;
   display: grid;
@@ -164,7 +177,7 @@ li {
 }
 
 .step-button.is-active {
-  border-color: #276240;
+  border-color: var(--interactive-boundary);
   color: #173d29;
   background: #eaf3ec;
 }
@@ -206,6 +219,13 @@ li {
   gap: 16px;
 }
 
+.stage-heading > *,
+.keyframe-review__heading > *,
+.swing-card-panel__header > *,
+.remote-model-panel__header > * {
+  min-width: 0;
+}
+
 .stage-description {
   margin: 12px 0 22px;
 }
@@ -261,6 +281,7 @@ li {
 }
 
 .secondary-action {
+  border: 1px solid var(--interactive-boundary);
   align-self: flex-start;
   margin-top: auto;
   color: #214d33;
@@ -299,6 +320,24 @@ button:disabled {
   margin: 6px 0 0;
 }
 
+.processing-placeholder > div:last-child {
+  min-width: 0;
+}
+
+#processing-status {
+  overflow-wrap: anywhere;
+}
+
+.processing-placeholder.is-failed {
+  border-width: 2px;
+  border-style: solid;
+}
+
+.processing-placeholder.is-failed #processing-status::before {
+  content: "Analysis needs attention: ";
+  font-weight: 800;
+}
+
 .analysis-video {
   width: min(100%, 640px);
   max-height: 280px;
@@ -394,7 +433,7 @@ button:disabled {
 }
 
 .keyframe-button.is-selected {
-  border-color: #245b3b;
+  border-color: var(--interactive-boundary);
   background: #eaf3ec;
 }
 
@@ -452,8 +491,8 @@ button:disabled {
 
 .phase-declarations select,
 .phase-assignment select {
-  min-height: 42px;
-  border: 1px solid #b8c4ba;
+  min-height: 44px;
+  border: 1px solid var(--interactive-boundary);
   border-radius: 6px;
   padding: 0 10px;
   color: #173d29;
@@ -478,6 +517,11 @@ button:disabled {
   gap: 3px;
 }
 
+.phase-assignment h3 {
+  margin: 0;
+  font-size: 0.9rem;
+}
+
 .phase-assignment small {
   color: #68766d;
   font-weight: 600;
@@ -655,6 +699,15 @@ button:disabled {
   font-size: 0.86rem;
 }
 
+.remote-model-disclosure dd,
+.swing-card-summary span,
+.phase-warning,
+.action-note,
+.status,
+.stage-description {
+  overflow-wrap: anywhere;
+}
+
 .swing-card-print {
   color: #17211b;
   background: #ffffff;
@@ -736,6 +789,18 @@ button:disabled {
   font-weight: 700;
 }
 
+.source-option,
+.step-button,
+.keyframe-button {
+  border-color: var(--interactive-boundary);
+}
+
+.consent-check,
+.phase-setup-confirmation,
+.phase-confirmation {
+  min-height: 44px;
+}
+
 @keyframes rotate {
   to {
     transform: rotate(360deg);
@@ -801,6 +866,21 @@ button:disabled {
 }
 
 @media (max-width: 480px) {
+  .topbar,
+  .stage-heading,
+  .keyframe-review__heading,
+  .swing-card-panel__header,
+  .remote-model-panel__header {
+    align-items: stretch;
+    flex-direction: column;
+  }
+
+  .local-badge,
+  .stage-status {
+    align-self: flex-start;
+    white-space: normal;
+  }
+
   .stage {
     padding: 16px;
   }
@@ -812,6 +892,47 @@ button:disabled {
   .swing-card-summary {
     grid-template-columns: 1fr;
   }
+
+  .phase-assignment {
+    grid-template-columns: 1fr;
+  }
+
+  .primary-action,
+  .secondary-action,
+  .source-option,
+  .step-button,
+  .keyframe-button,
+  .phase-declarations select,
+  .phase-assignment select {
+    width: 100%;
+    max-width: 100%;
+  }
+}
+
+@media (forced-colors: active) {
+  button,
+  input,
+  select,
+  a,
+  .stage,
+  .consent-panel,
+  .processing-placeholder,
+  .review-placeholder,
+  .export-placeholder,
+  .swing-card-panel,
+  .keyframe-canvas-wrap {
+    border-color: CanvasText;
+  }
+
+  button:focus-visible,
+  input:focus-visible,
+  select:focus-visible,
+  a:focus-visible,
+  [tabindex="-1"]:focus-visible {
+    outline: 2px solid Highlight;
+    outline-offset: 2px;
+    box-shadow: none;
+  }
 }
 
 @media print {

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 11 Complete focused diff: git diff -- src/styles.css -->

### 12 Complete focused diff: git diff -- src/swing-card-actions.ts

Lines: 108  
Bytes: 3979  
SHA-256: `9d8209e08b1b61a5420c21fe064ded115a2bdea07b23896e2ce43d70e50450d4`

<!-- BEGIN EXACT BLOCK: 12 Complete focused diff: git diff -- src/swing-card-actions.ts -->
````````````````````````````````````````````````
diff --git a/src/swing-card-actions.ts b/src/swing-card-actions.ts
index b8a1e54..343ff98 100644
--- a/src/swing-card-actions.ts
+++ b/src/swing-card-actions.ts
@@ -1,4 +1,5 @@
 import type { AppState } from "./app-state";
+import type { RenderRequest } from "./app-accessibility";
 import {
   getCompleteSwingCardAssignments,
   setSwingCardBusy,
@@ -22,11 +23,15 @@ export interface PreparedSwingCardContent {
   release(): void;
 }
 
-export async function downloadSwingCard(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
+export async function downloadSwingCard(state: AppState, requestRender: (request?: RenderRequest) => void): Promise<void> {
   if (state.swingCardBusy) return;
   setSwingCardBusy(state, true);
   setSwingCardStatus(state, "Preparing local Swing Card PNG.");
-  requestRender();
+  requestRender({
+    focusKey: "swing-card-status",
+    visibleStatusText: state.swingCardStatus,
+    announcement: state.swingCardStatus
+  });
   const prepared = await prepareSwingCardContent(state);
   try {
     const result = await composeSwingCardPng(prepared.content);
@@ -36,40 +41,60 @@ export async function downloadSwingCard(state: AppState, requestRender: (statusM
     } else {
       setSwingCardStatus(state, `Swing Card PNG export stopped (${result.reason}).`);
     }
+  } catch {
+    setSwingCardStatus(state, "Swing Card PNG export stopped (LOCAL_EXPORT_FAILED).");
   } finally {
     prepared.release();
     setSwingCardBusy(state, false);
-    requestRender();
+    requestRender({
+      focusKey: "swing-card-download",
+      visibleStatusText: state.swingCardStatus,
+      announcement: state.swingCardStatus
+    });
   }
 }
 
 export async function printSwingCard(
   root: ParentNode,
   state: AppState,
-  requestRender: (statusMessage?: string) => void
+  requestRender: (request?: RenderRequest) => void
 ): Promise<void> {
   if (state.swingCardBusy) return;
   setSwingCardBusy(state, true);
   setSwingCardStatus(state, "Preparing browser print view.");
-  requestRender();
+  requestRender({
+    focusKey: "swing-card-status",
+    visibleStatusText: state.swingCardStatus,
+    announcement: state.swingCardStatus
+  });
   const prepared = await prepareSwingCardContent(state);
   try {
     const host = root.querySelector<HTMLElement>("[data-swing-card-print-host]");
     host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
     setSwingCardStatus(state, "Browser print dialog opened. Save as PDF if your browser supports it.");
     window.print();
+  } catch {
+    setSwingCardStatus(state, "Browser print view could not be prepared.");
   } finally {
     prepared.release();
     setSwingCardBusy(state, false);
-    requestRender();
+    requestRender({
+      focusKey: "swing-card-print",
+      visibleStatusText: state.swingCardStatus,
+      announcement: state.swingCardStatus
+    });
   }
 }
 
-export async function copySwingCardPrompt(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
+export async function copySwingCardPrompt(state: AppState, requestRender: (request?: RenderRequest) => void): Promise<void> {
   if (state.swingCardBusy) return;
   setSwingCardBusy(state, true);
   setSwingCardStatus(state, "Preparing prompt text.");
-  requestRender();
+  requestRender({
+    focusKey: "swing-card-status",
+    visibleStatusText: state.swingCardStatus,
+    announcement: state.swingCardStatus
+  });
   const prepared = await prepareSwingCardContent(state);
   try {
     await navigator.clipboard.writeText(prepared.content.analysisPrompt);
@@ -79,7 +104,11 @@ export async function copySwingCardPrompt(state: AppState, requestRender: (statu
   } finally {
     prepared.release();
     setSwingCardBusy(state, false);
-    requestRender();
+    requestRender({
+      focusKey: "swing-card-copy",
+      visibleStatusText: state.swingCardStatus,
+      announcement: state.swingCardStatus
+    });
   }
 }
 

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 12 Complete focused diff: git diff -- src/swing-card-actions.ts -->

### 13 Complete focused diff: git diff -- test/smoke/app.spec.ts

Lines: 666  
Bytes: 37296  
SHA-256: `796a6fd182a0c0d391533fcde7d12ec54eb12e245eeef5408d62825e0af5bb4b`

<!-- BEGIN EXACT BLOCK: 13 Complete focused diff: git diff -- test/smoke/app.spec.ts -->
````````````````````````````````````````````````
diff --git a/test/smoke/app.spec.ts b/test/smoke/app.spec.ts
index 9f14f42..7dd9234 100644
--- a/test/smoke/app.spec.ts
+++ b/test/smoke/app.spec.ts
@@ -91,6 +91,75 @@ async function expectNoBrowserStorage(page: Page): Promise<void> {
   expect(storage.caches).toEqual([]);
 }
 
+async function expectMeaningfulHeadingOrder(page: Page): Promise<void> {
+  const headings = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((elements) =>
+    elements.map((element) => ({
+      level: Number(element.tagName.slice(1)),
+      text: element.textContent?.trim() ?? ""
+    }))
+  );
+  expect(headings.filter((heading) => heading.level === 1)).toHaveLength(1);
+  expect(headings[0]?.level).toBe(1);
+  expect(headings.every((heading) => heading.text.length > 0)).toBe(true);
+  for (let index = 1; index < headings.length; index += 1) {
+    expect(headings[index].level - headings[index - 1].level).toBeLessThanOrEqual(1);
+  }
+}
+
+async function expectResponsiveGeometry(page: Page, textSelectors: readonly string[]): Promise<void> {
+  const result = await page.evaluate((selectors) => {
+    // Native checkboxes have intentionally compact glyphs with a >=44px labelled row;
+    // the defensive native file input is removed from sequential/visual flow.
+    const targetExceptions = ["input[type='checkbox']", "#video-file"];
+    const isVisible = (element: HTMLElement) => {
+      const style = getComputedStyle(element);
+      const rect = element.getBoundingClientRect();
+      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
+    };
+    const texts = selectors.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
+      .filter(isVisible)
+      .map((element) => ({
+        selector: element.id || element.getAttribute("data-focus-key") || element.className || element.tagName,
+        clipped: element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1,
+        rect: element.getBoundingClientRect().toJSON()
+      }));
+    const controls = [...document.querySelectorAll<HTMLElement>("button, select, input")]
+      .filter(isVisible)
+      .map((element) => {
+        const rect = element.getBoundingClientRect();
+        return {
+          name: element.getAttribute("data-focus-key") || element.id || element.tagName,
+          width: rect.width,
+          height: rect.height,
+          excepted: targetExceptions.some((selector) => element.matches(selector)),
+          rect: rect.toJSON()
+        };
+      });
+    const overlapControls = controls.filter((control) => !control.excepted);
+    const overlaps: string[] = [];
+    overlapControls.forEach((control, index) => {
+      for (const other of overlapControls.slice(index + 1)) {
+        if (
+          control.rect.left < other.rect.right && control.rect.right > other.rect.left &&
+          control.rect.top < other.rect.bottom && control.rect.bottom > other.rect.top
+        ) overlaps.push(`${control.name}/${other.name}`);
+      }
+    });
+    return {
+      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
+      clipped: texts.filter((item) => item.clipped),
+      outsideViewport: texts.filter((item) => item.rect.left < 0 || item.rect.right > document.documentElement.clientWidth + 1),
+      undersized: controls.filter((control) => !control.excepted && (control.width < 44 || control.height < 44)),
+      overlaps
+    };
+  }, textSelectors);
+  expect(result.pageOverflow).toBe(false);
+  expect(result.clipped).toEqual([]);
+  expect(result.outsideViewport).toEqual([]);
+  expect(result.undersized).toEqual([]);
+  expect(result.overlaps).toEqual([]);
+}
+
 async function completePhaseReview(page: Page): Promise<void> {
   await page.getByRole("button", { name: "Review phase labels" }).click();
   await page.getByLabel("View", { exact: true }).selectOption("face-on");
@@ -109,12 +178,131 @@ test("opens to capture flow and keeps analysis fail closed until consent and vid
 
   const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
   await expect(beginAnalysis).toBeDisabled();
+  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
+  await expect(page.locator("#app-visible-status")).toHaveText(
+    "First analysis is blocked until this acknowledgement is checked."
+  );
   await page.getByRole("checkbox").check();
   await expect(beginAnalysis).toBeDisabled();
+  await expect(beginAnalysis).toHaveAttribute("aria-describedby", "app-visible-status");
+  await expect(page.locator("#app-visible-status")).toHaveText(
+    "Consent recorded locally. Choose a local video to begin analysis."
+  );
   await page.locator("#video-file").setInputFiles(poseFixture);
   await expect(beginAnalysis).toBeEnabled();
+  await expect(page.locator("#app-visible-status")).toHaveText(
+    "Local video selected. It has not been analyzed or persisted."
+  );
   await page.getByRole("button", { name: "Use camera" }).click();
-  await expect(page.getByRole("status")).toContainText("Camera capture remains out of scope");
+  await expect(page.locator("#app-announcer")).toContainText("Camera capture remains out of scope");
+  await expect(page.locator("#app-visible-status")).toContainText("Camera capture remains out of scope");
+  await expect(page.locator("#app-visible-status")).not.toHaveAttribute("role", "status");
+  await expect(page.locator("#app-visible-status")).not.toHaveAttribute("aria-live");
+});
+
+test("keeps one main landmark dynamic titles and bounded focus targets", async ({ page }) => {
+  await expect(page.getByRole("main")).toHaveCount(1);
+  await expect(page).toHaveTitle("Swing Sync | Capture");
+  await page.getByRole("button", { name: /Process/ }).click();
+  await expect(page).toHaveTitle("Swing Sync | Processing");
+  await expect(page.locator("[data-focus-key='stage-heading']")).toBeFocused();
+  await page.getByRole("button", { name: /Review/ }).click();
+  await expect(page).toHaveTitle("Swing Sync | Review");
+  await page.getByRole("button", { name: /Export/ }).click();
+  await expect(page).toHaveTitle("Swing Sync | Export");
+});
+
+test("returns picker focus for success cancel and defensive hidden-input focus", async ({ page }) => {
+  const picker = page.locator("[data-video-picker]");
+  await picker.focus();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await expect(picker).toBeFocused();
+  await page.locator("#video-file").dispatchEvent("cancel");
+  await expect(picker).toBeFocused();
+  await page.locator("#video-file").evaluate((input: HTMLInputElement) => input.focus());
+  await expect(picker).toBeFocused();
+  await expect(page.locator("#video-file")).toHaveAttribute("tabindex", "-1");
+  await expect(page.locator("#video-file")).not.toHaveAttribute("aria-hidden", "true");
+});
+
+test("applies approved focus geometry tokens and forced-colors focus", async ({ page }) => {
+  const picker = page.locator("[data-video-picker]");
+  await picker.focus();
+  const styles = await picker.evaluate((element) => {
+    const computed = getComputedStyle(element);
+    const root = getComputedStyle(document.documentElement);
+    return {
+      inner: root.getPropertyValue("--focus-inner").trim(),
+      outer: root.getPropertyValue("--focus-outer").trim(),
+      boundary: root.getPropertyValue("--interactive-boundary").trim(),
+      outlineWidth: computed.outlineWidth,
+      outlineOffset: computed.outlineOffset,
+      boxShadow: computed.boxShadow
+    };
+  });
+  expect(styles).toMatchObject({ inner: "#ffffff", outer: "#17211b", boundary: "#607367", outlineWidth: "2px", outlineOffset: "2px" });
+  expect(styles.boxShadow).toContain("6px");
+  expect(await picker.evaluate((element) => getComputedStyle(element).borderColor)).toBe("rgb(96, 115, 103)");
+  await expect(page.locator("[data-step='capture']")).toHaveCSS("border-color", "rgb(96, 115, 103)");
+
+  await page.getByRole("checkbox").check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  const primary = page.locator("#analysis-button");
+  await expect(page.locator("[data-video-picker]")).toBeFocused();
+  await page.keyboard.press("Tab");
+  await expect(primary).toBeFocused();
+  await expect(primary).toHaveCSS("background-color", "rgb(36, 91, 59)");
+  const primaryFocus = await primary.evaluate((element) => ({
+    outline: getComputedStyle(element).outlineWidth,
+    offset: getComputedStyle(element).outlineOffset,
+    shadow: getComputedStyle(element).boxShadow
+  }));
+  expect(primaryFocus).toMatchObject({ outline: "2px", offset: "2px" });
+  expect(primaryFocus.shadow).toContain("6px");
+
+  await page.getByRole("button", { name: /Review/ }).click();
+  const secondary = page.locator("[data-next-step]");
+  await expect(secondary).toHaveCSS("border-color", "rgb(96, 115, 103)");
+  await page.getByRole("button", { name: /Capture/ }).click();
+  await page.emulateMedia({ forcedColors: "active" });
+  await picker.focus();
+  await page.keyboard.press("Tab");
+  await page.keyboard.press("Shift+Tab");
+  await expect(picker).toBeFocused();
+  const forced = await picker.evaluate((element) => {
+    const style = getComputedStyle(element);
+    return {
+      outlineStyle: style.outlineStyle,
+      outlineWidth: style.outlineWidth,
+      borderStyle: style.borderStyle,
+      borderWidth: style.borderWidth,
+      boxShadow: style.boxShadow,
+      forcedColorAdjust: style.forcedColorAdjust
+    };
+  });
+  expect(forced.outlineStyle).not.toBe("none");
+  expect(forced.outlineWidth).toBe("2px");
+  expect(forced.borderStyle).not.toBe("none");
+  expect(forced.borderWidth).not.toBe("0px");
+  expect(forced.boxShadow).toBe("none");
+  expect(forced.forcedColorAdjust).toBe("auto");
+});
+
+test("reflows long status text at 320 CSS pixels without clipping or overlap", async ({ page }) => {
+  await page.setViewportSize({ width: 320, height: 800 });
+  await page.locator("#app-visible-status").evaluate((element) => {
+    element.textContent = "A very long local-only prerequisite explanation that must wrap without clipping, overlap, or horizontal scrolling even when system text is enlarged.";
+  });
+  const layout = await page.evaluate(() => {
+    const status = document.querySelector("#app-visible-status") as HTMLElement;
+    const rect = status.getBoundingClientRect();
+    return {
+      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
+      clipped: status.scrollWidth > status.clientWidth || status.scrollHeight > status.clientHeight,
+      withinViewport: rect.left >= 0 && rect.right <= document.documentElement.clientWidth
+    };
+  });
+  expect(layout).toEqual({ pageOverflow: false, clipped: false, withinViewport: true });
 });
 
 test("fails closed when local consent storage is unavailable", async ({ page }) => {
@@ -163,14 +351,16 @@ test("runtime consent guard reports inline and focuses the acknowledgement", asy
   await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
   await beginAnalysis.click();
 
-  await expect(page.getByRole("status")).toContainText(
+  await expect(page.locator("#app-announcer")).toContainText(
     "Please acknowledge the safety terms before starting analysis"
   );
+  await expect(page.locator("#app-visible-status")).toContainText("Please acknowledge the safety terms");
   await expect(consent).toBeFocused();
   await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
 });
 
 test("shows every required placeholder state", async ({ page }) => {
+  await expect(page.getByRole("group", { name: "Local video source" })).toBeVisible();
   for (const [buttonName, headingName] of [
     ["Process", "Processing"],
     ["Review", "Review"],
@@ -180,6 +370,12 @@ test("shows every required placeholder state", async ({ page }) => {
     await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
     await expect(page.getByText("Local workflow")).toBeVisible();
   }
+  await page.getByRole("button", { name: /Process/ }).click();
+  await expect(page.getByRole("group", { name: "Local pose processing" })).toBeVisible();
+  await page.getByRole("button", { name: /Review/ }).click();
+  await expect(page.getByRole("group", { name: "Review placeholder" })).toBeVisible();
+  await page.getByRole("button", { name: /Export/ }).click();
+  await expect(page.getByRole("region", { name: "Swing Card unavailable" })).toBeVisible();
 });
 
 test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
@@ -206,6 +402,226 @@ test("loads locally in a worker and extracts complete fixture landmarks", async
   await expectNoBrowserStorage(page);
 });
 
+test("keeps completed and failed processing terminal updates scoped to processing status", async ({ page }) => {
+  let releaseSuccessfulModel!: () => void;
+  const successfulModelGate = new Promise<void>((resolveGate) => {
+    releaseSuccessfulModel = resolveGate;
+  });
+  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
+    await successfulModelGate;
+    await route.continue();
+  });
+  await page.getByRole("checkbox").check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.locator("#processing-status")).toContainText("Loading the local pose model");
+  const completedGlobalBefore = await page.locator("#app-announcer").textContent();
+  await page.evaluate(() => {
+    const counts = { global: 0, processing: 0 };
+    Object.assign(window, { __terminalStatusMutations: counts });
+    new MutationObserver(() => { counts.global += 1; }).observe(document.querySelector("#app-announcer")!, {
+      childList: true,
+      characterData: true,
+      subtree: true
+    });
+    new MutationObserver(() => { counts.processing += 1; }).observe(document.querySelector("#processing-status")!, {
+      childList: true,
+      characterData: true,
+      subtree: true
+    });
+  });
+  releaseSuccessfulModel();
+  await expect(page.locator("#processing-status")).toHaveText("Local frame processing completed.", {
+    timeout: 30_000
+  });
+  await expect(page.locator("#app-announcer")).toHaveText(completedGlobalBefore ?? "");
+  await expect.poll(() => page.evaluate(() =>
+    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
+      .__terminalStatusMutations
+  )).toMatchObject({ global: 0 });
+  expect(await page.evaluate(() =>
+    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
+      .__terminalStatusMutations.processing
+  )).toBeGreaterThan(0);
+
+  await page.unroute("**/models/pose_landmarker_full-float16-v1.task");
+  await page.reload();
+  let releaseFailedModel!: () => void;
+  const failedModelGate = new Promise<void>((resolveGate) => {
+    releaseFailedModel = resolveGate;
+  });
+  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
+    await failedModelGate;
+    await route.abort();
+  });
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.locator("#processing-status")).toContainText("Loading the local pose model");
+  const failedGlobalBefore = await page.locator("#app-announcer").textContent();
+  await page.evaluate(() => {
+    const counts = { global: 0, processing: 0 };
+    Object.assign(window, { __terminalStatusMutations: counts });
+    new MutationObserver(() => { counts.global += 1; }).observe(document.querySelector("#app-announcer")!, {
+      childList: true,
+      characterData: true,
+      subtree: true
+    });
+    new MutationObserver(() => { counts.processing += 1; }).observe(document.querySelector("#processing-status")!, {
+      childList: true,
+      characterData: true,
+      subtree: true
+    });
+  });
+  releaseFailedModel();
+  await expect(page.locator("#processing-status")).toHaveText(
+    "Local pose analysis stopped (LOCAL_MODEL_INIT_FAILED).",
+    { timeout: 20_000 }
+  );
+  await expect(page.locator("#app-announcer")).toHaveText(failedGlobalBefore ?? "");
+  await expect.poll(() => page.evaluate(() =>
+    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
+      .__terminalStatusMutations
+  )).toMatchObject({ global: 0 });
+  expect(await page.evaluate(() =>
+    (window as typeof window & { __terminalStatusMutations: { global: number; processing: number } })
+      .__terminalStatusMutations.processing
+  )).toBeGreaterThan(0);
+});
+
+test("traverses capture processing review confirmation and export with keyboard input", async ({ page }) => {
+  await expectMeaningfulHeadingOrder(page);
+  await expect(page.locator("[role='status']")).toHaveCount(1);
+  await expect(page.locator("#app-announcer")).toHaveAttribute("aria-live", "polite");
+  await page.getByRole("checkbox").focus();
+  await page.keyboard.press("Space");
+  const chooserPromise = page.waitForEvent("filechooser");
+  await page.locator("[data-video-picker]").focus();
+  await page.keyboard.press("Enter");
+  const chooser = await chooserPromise;
+  await chooser.setFiles(poseFixture);
+  await expect(page.locator("[data-video-picker]")).toBeFocused();
+  await page.getByRole("button", { name: "Begin analysis" }).focus();
+  await page.keyboard.press("Enter");
+  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
+  await expect(page.locator("#processing-status")).toContainText("completed");
+  await expect(page.locator("#app-announcer, #processing-status")).toHaveCount(2);
+  await expect(page.locator("#app-announcer")).toHaveAttribute("role", "status");
+  await expect(page.locator("#processing-status")).toHaveAttribute("role", "status");
+  await expect(page.locator("#processing-status")).toHaveAttribute("aria-live", "polite");
+  await expect(page.locator("[data-review-phases]")).toHaveAttribute("aria-describedby", "phase-review-status");
+  await expect(page.locator("#phase-review-status")).toHaveText(
+    "Local processing output is ready for phase review."
+  );
+  await page.getByRole("button", { name: "Review phase labels" }).focus();
+  await page.keyboard.press("Enter");
+  await expect(page.locator("[data-focus-key='phase-review-heading']")).toBeFocused();
+  await expectMeaningfulHeadingOrder(page);
+  await expect(page.locator("#app-announcer, #keyframe-overlay-status")).toHaveCount(2);
+  await expect(page.locator("#app-announcer")).toHaveAttribute("role", "status");
+  await expect(page.locator("#keyframe-overlay-status")).toHaveAttribute("role", "status");
+  await expect(page.locator("#keyframe-overlay-status")).toHaveAttribute("aria-live", "polite");
+  await expect(page.locator("#phase-review-status")).not.toHaveAttribute("role", "status");
+  await expect(page.locator("#phase-review-status")).not.toHaveAttribute("aria-live");
+
+  for (const [label, key] of [["View", "f"], ["Handedness", "r"], ["Horizontally mirrored", "n"]]) {
+    await page.getByLabel(label, { exact: true }).focus();
+    await page.keyboard.press(key);
+    await page.keyboard.press("Tab");
+  }
+  await page.getByLabel(/I confirm this is one trimmed/).focus();
+  await page.keyboard.press("Space");
+  await page.getByLabel(/I reviewed these provisional labels/).focus();
+  await page.keyboard.press("Space");
+  await page.getByRole("button", { name: "Confirm phase review" }).focus();
+  await page.keyboard.press("Enter");
+  await expect(page.locator("[data-focus-key='phase-review-heading']")).toBeFocused();
+  await page.getByRole("button", { name: "Open Swing Card export" }).focus();
+  await page.keyboard.press("Enter");
+  await expect(page.locator("[data-focus-key='swing-card-heading']")).toBeFocused();
+  await expect(page).toHaveTitle("Swing Sync | Export");
+  await expectMeaningfulHeadingOrder(page);
+  await expect(page.locator("#swing-card-action-status")).not.toHaveAttribute("role", "status");
+  await expect(page.locator("#swing-card-action-status")).not.toHaveAttribute("aria-live");
+  await expect(page.locator("#remote-model-status")).not.toHaveAttribute("role", "status");
+  await expect(page.locator("#remote-model-status")).not.toHaveAttribute("aria-live");
+  await expect(page.locator("[role='status']")).toHaveCount(1);
+
+  await page.evaluate(() => {
+    Object.assign(window, { __keyboardPrintCalls: 0 });
+    window.print = () => {
+      (window as typeof window & { __keyboardPrintCalls: number }).__keyboardPrintCalls += 1;
+    };
+  });
+  await page.evaluate(() => {
+    const originalCreateImageBitmap = window.createImageBitmap.bind(window);
+    let release!: () => void;
+    const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
+    Object.assign(window, { __releaseKeyboardPrint: release });
+    window.createImageBitmap = async (...arguments_) => {
+      await gate;
+      return originalCreateImageBitmap(...arguments_);
+    };
+  });
+  const print = page.locator("[data-print-swing-card]");
+  await print.focus();
+  await page.keyboard.press("Enter");
+  await expect(print).toBeDisabled();
+  await expect(print).toHaveAttribute("aria-describedby", "swing-card-action-status");
+  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing browser print view.");
+  await page.evaluate(() =>
+    (window as typeof window & { __releaseKeyboardPrint: () => void }).__releaseKeyboardPrint()
+  );
+  await expect.poll(() => page.evaluate(() => (window as typeof window & { __keyboardPrintCalls: number }).__keyboardPrintCalls)).toBe(1);
+  await expect(page.locator("#swing-card-action-status")).toContainText("Browser print dialog opened");
+  await expect(page.locator("#app-announcer")).toContainText("Browser print dialog opened");
+  await expect(print).toBeFocused();
+
+  await page.evaluate(() => {
+    let release!: () => void;
+    const gate = new Promise<void>((resolve) => { release = resolve; });
+    Object.assign(window, { __releaseKeyboardCopy: release });
+    Object.defineProperty(navigator, "clipboard", {
+      configurable: true,
+      value: { writeText: async () => gate }
+    });
+  });
+  const copy = page.locator("[data-copy-swing-card-prompt]");
+  await copy.focus();
+  await page.keyboard.press("Enter");
+  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing prompt text.");
+  await expect(page.locator("#app-announcer")).toHaveText("Preparing prompt text.");
+  await expect(copy).toBeDisabled();
+  await expect(copy).toHaveAttribute("aria-describedby", "swing-card-action-status");
+  await page.evaluate(() => (window as typeof window & { __releaseKeyboardCopy: () => void }).__releaseKeyboardCopy());
+  await expect(page.locator("#swing-card-action-status")).toHaveText("Prompt copied for manual use.");
+  await expect(copy).toBeFocused();
+
+  const downloadPromise = page.waitForEvent("download");
+  const downloadButton = page.locator("[data-download-swing-card]");
+  await page.evaluate(() => {
+    const originalCreateImageBitmap = window.createImageBitmap.bind(window);
+    let release!: () => void;
+    const gate = new Promise<void>((resolveGate) => { release = resolveGate; });
+    Object.assign(window, { __releaseKeyboardDownload: release });
+    window.createImageBitmap = async (...arguments_) => {
+      await gate;
+      return originalCreateImageBitmap(...arguments_);
+    };
+  });
+  await downloadButton.focus();
+  await page.keyboard.press("Enter");
+  await expect(downloadButton).toBeDisabled();
+  await expect(downloadButton).toHaveAttribute("aria-describedby", "swing-card-action-status");
+  await expect(page.locator("#swing-card-action-status")).toHaveText("Preparing local Swing Card PNG.");
+  await page.evaluate(() =>
+    (window as typeof window & { __releaseKeyboardDownload: () => void }).__releaseKeyboardDownload()
+  );
+  await downloadPromise;
+  await expect(page.locator("#swing-card-action-status")).toHaveText("Swing Card PNG download started.");
+  await expect(page.locator("#app-announcer")).toHaveText("Swing Card PNG download started.");
+  await expect(downloadButton).toBeFocused();
+});
+
 test("requires accessible explicit review and accepts only valid nondecreasing phase correction", async ({
   page
 }) => {
@@ -218,8 +634,13 @@ test("requires accessible explicit review and accepts only valid nondecreasing p
   await page.getByRole("button", { name: "Review phase labels" }).click();
 
   await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
-  await expect(page.locator(".phase-warning")).toHaveAttribute("aria-live", "polite");
+  await expect(page.locator(".phase-warning")).toHaveAttribute("id", "phase-review-status");
+  await expect(page.locator(".phase-warning")).not.toHaveAttribute("role", "status");
+  await expect(page.locator(".phase-warning")).not.toHaveAttribute("aria-live");
+  await expect(page.locator("[data-confirm-phase-review]")).toHaveAttribute("aria-describedby", "phase-review-status");
   const canvas = page.locator("[data-keyframe-canvas]");
+  await expect(page.getByRole("group", { name: "Swing phase assignments" })).toBeVisible();
+  await expect(page.getByRole("group", { name: "Select keyframe" })).toBeVisible();
   await expect(canvas).toHaveCount(1);
   await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address");
   await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
@@ -298,14 +719,70 @@ test("requires accessible explicit review and accepts only valid nondecreasing p
   await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeEnabled();
   await page.getByRole("button", { name: "Confirm phase review" }).click();
   await expect(page.locator(".phase-warning")).toContainText("Phase review confirmed");
-  await expect(page.getByText(/Future metric readiness is available/)).toBeVisible();
+  await expect(page.locator("#phase-review-status p")).toHaveText(
+    "Phase review is confirmed. Future metric readiness is available for a separately reviewed story; no metrics are generated here."
+  );
+  await expect(page.locator(".phase-review > .action-row .action-note")).toHaveText(
+    "Future metric readiness is available for a separately reviewed story. No metrics are generated here."
+  );
 
   await page.getByRole("button", { name: /Export/ }).click();
   await page.getByRole("button", { name: /Review/ }).click();
-  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
+  await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
   await expect(page.getByText("Annotated keyframes")).toBeVisible();
 });
 
+test("keeps phase semantic announcements and overlay ownership mutually exclusive", async ({ page }) => {
+  await page.getByRole("checkbox").check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
+  await page.getByRole("button", { name: "Review phase labels" }).click();
+
+  const announcer = page.locator("#app-announcer");
+  const overlay = page.locator("#keyframe-overlay-status");
+  const initialGlobal = await announcer.textContent();
+  await page.getByLabel("View", { exact: true }).selectOption("face-on");
+  await expect(announcer).toHaveText(initialGlobal ?? "");
+  const stableOverlay = await overlay.textContent();
+  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
+  await expect(announcer).toHaveText(initialGlobal ?? "");
+  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
+  await expect(announcer).toHaveText(initialGlobal ?? "");
+
+  await page.getByLabel(/I confirm this is one trimmed/).check();
+  await expect(announcer).toContainText("ready for review");
+  await expect(overlay).toHaveText(stableOverlay ?? "");
+  const reviewRequiredGlobal = await announcer.textContent();
+
+  const firstAssignment = page.locator("[data-phase-index='0']");
+  await firstAssignment.selectOption("1");
+  await expect(announcer).toHaveText(reviewRequiredGlobal ?? "");
+  await firstAssignment.selectOption("0");
+  await page.getByLabel(/I reviewed these provisional labels/).check();
+  await expect(announcer).toHaveText(reviewRequiredGlobal ?? "");
+  await page.getByRole("button", { name: "Confirm phase review" }).click();
+  await expect(announcer).toHaveText("Phase review confirmed.");
+  const confirmedGlobal = await announcer.textContent();
+
+  await page.evaluate(() => {
+    const counts = { global: 0, overlay: 0 };
+    Object.assign(window, { __semanticMutationCounts: counts });
+    new MutationObserver(() => { counts.global += 1; }).observe(
+      document.querySelector("#app-announcer")!,
+      { childList: true, characterData: true, subtree: true }
+    );
+    new MutationObserver((records) => {
+      counts.overlay += records.filter((record) => (record.target as Element).id === "keyframe-overlay-status").length;
+    }).observe(document.querySelector("#app")!, { childList: true, characterData: true, subtree: true });
+  });
+  await page.locator("[data-keyframe-index='3']").click();
+  await expect(announcer).toHaveText(confirmedGlobal ?? "");
+  await expect.poll(() => page.evaluate(() =>
+    (window as typeof window & { __semanticMutationCounts: { global: number; overlay: number } }).__semanticMutationCounts
+  )).toEqual({ global: 0, overlay: 1 });
+});
+
 test("downloads a local Swing Card PNG and exposes print and prompt controls", async ({ page }) => {
   await page.setViewportSize({ width: 390, height: 844 });
 
@@ -326,6 +803,9 @@ test("downloads a local Swing Card PNG and exposes print and prompt controls", a
 
   await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
   await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
+  await expect(page.getByRole("group", { name: "Swing Card contents" })).toBeVisible();
+  await expect(page.getByRole("group", { name: "Remote model data disclosure" })).toBeVisible();
+  await expect(page.locator("dl.remote-model-disclosure")).toHaveCount(1);
   await expect(page.getByText("No reviewed provider is configured for this story.")).toBeVisible();
   await expect(page.getByText("Metrics, Warnings and Limitations, Manual Swing Card Prompt")).toBeVisible();
   await expect(page.getByText("Raw Video, Frame Pixels, Selected Keyframe Images, Pose Landmarks")).toBeVisible();
@@ -494,7 +974,8 @@ test("keeps the UI responsive while the local model loads", async ({ page }) =>
   await page.getByRole("button", { name: "Stop local analysis" }).click();
 
   await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
-  await expect(page.getByRole("status")).toContainText("volatile resources were released");
+  await expect(page.locator("#app-announcer")).toContainText("volatile resources were released");
+  await expect(page.locator("#app-visible-status")).toContainText("volatile resources were released");
 });
 
 test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
@@ -616,3 +1097,86 @@ test("fits the mobile viewport without horizontal page overflow", async ({ page
   expect(layout.hasButtonOverlap).toBe(false);
   expect(layout.clippedCriticalText).toEqual([]);
 });
+
+test("keeps real failure review and confirmed export usable at 320 CSS pixels", async ({ page }) => {
+  await page.setViewportSize({ width: 320, height: 800 });
+  await expect(page.getByRole("group", { name: "Local video source" })).toBeVisible();
+  await page.locator("#app-visible-status").evaluate((element) => {
+    element.textContent = "A deliberately long local consent and video prerequisite that must wrap without clipping at the narrowest supported reflow width.";
+  });
+  await expectResponsiveGeometry(page, ["#app-visible-status", ".capture-options", ".source-option"]);
+
+  await page.getByRole("button", { name: /Review/ }).click();
+  await expect(page.getByRole("group", { name: "Review placeholder" })).toBeVisible();
+  await expectResponsiveGeometry(page, [".review-placeholder", ".metric-list"]);
+  await page.getByRole("button", { name: /Export/ }).click();
+  await expect(page.getByRole("region", { name: "Swing Card unavailable" })).toBeVisible();
+  await expectResponsiveGeometry(page, [".export-placeholder", "#phase-review-status"]);
+  await page.getByRole("button", { name: /Capture/ }).click();
+
+  let shouldFail = true;
+  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => {
+    if (shouldFail) {
+      void route.abort();
+      return;
+    }
+    void route.continue();
+  });
+  await page.getByRole("checkbox").check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.locator("#processing-status")).toContainText("LOCAL_MODEL_INIT_FAILED", { timeout: 20_000 });
+  await expect(page.getByRole("group", { name: "Local pose processing" })).toBeVisible();
+  await page.locator("#processing-status").evaluate((element) => {
+    element.textContent += " — LOCAL_MODEL_INITIALIZATION_FAILED_WITH_A_DELIBERATELY_LONG_UNBROKEN_DIAGNOSTIC_CODE";
+  });
+  await page.locator("#phase-review-status").evaluate((element) => {
+    element.textContent += " Retry remains local and this deliberately long prerequisite must stay readable.";
+  });
+  await expectResponsiveGeometry(page, [".processing-placeholder", "#processing-status", "#phase-review-status", "[data-pose-summary]"]);
+
+  await page.unroute("**/models/pose_landmarker_full-float16-v1.task");
+  await page.reload();
+  await page.setViewportSize({ width: 320, height: 800 });
+  const consent = page.getByRole("checkbox");
+  if (!(await consent.isChecked())) await consent.check();
+  await page.locator("#video-file").setInputFiles(poseFixture);
+  await page.getByRole("button", { name: "Begin analysis" }).click();
+  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({ timeout: 30_000 });
+  await page.getByRole("button", { name: "Review phase labels" }).click();
+  await expect(page.getByRole("group", { name: "Swing phase assignments" })).toBeVisible();
+  await expect(page.getByRole("group", { name: "Select keyframe" })).toBeVisible();
+  await expect(page.locator("[data-phase-index='0']")).toHaveCSS("border-color", "rgb(96, 115, 103)");
+  await expect(page.locator("[data-keyframe-index='0']")).toHaveCSS("border-color", "rgb(96, 115, 103)");
+  await page.locator("#phase-review-status p").evaluate((element) => {
+    element.textContent += " This deliberately extended validation explanation exercises wrapping without changing the protected workflow decision.";
+  });
+  await expectResponsiveGeometry(page, [
+    "#phase-review-status", ".phase-declarations", ".phase-assignment-list", ".phase-assignment",
+    "#keyframe-overlay-status", ".keyframe-strip", ".keyframe-button"
+  ]);
+
+  await page.getByLabel("View", { exact: true }).selectOption("face-on");
+  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
+  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
+  await page.getByLabel(/I confirm this is one trimmed/).check();
+  await page.getByLabel(/I reviewed these provisional labels/).check();
+  await page.getByRole("button", { name: "Confirm phase review" }).click();
+  await page.getByRole("button", { name: "Open Swing Card export" }).click();
+  await expect(page.getByRole("group", { name: "Swing Card contents" })).toBeVisible();
+  await expect(page.getByRole("group", { name: "Remote model data disclosure" })).toBeVisible();
+  await expect(page.locator("dl.remote-model-disclosure")).toHaveCount(1);
+  await page.locator(".swing-card-panel > p").evaluate((element) => {
+    element.textContent += " This deliberately long export explanation must remain readable without horizontal scrolling or an unusable panel.";
+  });
+  await page.locator("#swing-card-action-status").evaluate((element) => {
+    element.textContent = "A deliberately long local export status covering download, print, and copy preparation without claiming remote persistence.";
+  });
+  await page.locator("#remote-model-status").evaluate((element) => {
+    element.textContent += " This deliberately long unavailable-provider prerequisite must wrap and remain associated with the disabled control.";
+  });
+  await expectResponsiveGeometry(page, [
+    ".swing-card-panel", ".swing-card-summary", ".swing-card-warning-list", "#swing-card-action-status",
+    ".remote-model-panel", ".remote-model-disclosure", ".remote-model-disclosure dd", "#remote-model-status"
+  ]);
+});

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 13 Complete focused diff: git diff -- test/smoke/app.spec.ts -->

### 14 Complete focused diff: git diff -- test/unit/analysis-lifecycle.test.ts

Lines: 377  
Bytes: 16845  
SHA-256: `a76c30393c6f362036787c2d9404113d5f100ebc16df0f699861d383bbcdb6e4`

<!-- BEGIN EXACT BLOCK: 14 Complete focused diff: git diff -- test/unit/analysis-lifecycle.test.ts -->
````````````````````````````````````````````````
diff --git a/test/unit/analysis-lifecycle.test.ts b/test/unit/analysis-lifecycle.test.ts
index a0d54e2..9603d43 100644
--- a/test/unit/analysis-lifecycle.test.ts
+++ b/test/unit/analysis-lifecycle.test.ts
@@ -1,32 +1,40 @@
 import { describe, expect, it, vi } from "vitest";
 import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
-import {
-  createInitialAppState,
-  selectLocalVideo,
-  selectWorkflowStep,
-  setProcessingState
-} from "../../src/app-state";
-import { renderApp } from "../../src/app-renderer";
-
-class FakeElement {
-  innerHTML = "";
-}
+import { createInitialAppState, selectWorkflowStep, setProcessingState } from "../../src/app-state";
+import type { SampledFrameOutput } from "../../src/frame-processing";
 
 function deferred() {
   let resolve!: () => void;
-  const promise = new Promise<void>((done) => {
-    resolve = done;
-  });
+  const promise = new Promise<void>((done) => { resolve = done; });
   return { promise, resolve };
 }
 
+class ProcessingRoot {
+  readonly status = { textContent: "", hidden: false };
+  readonly summary = { textContent: "", hidden: false };
+  readonly retry = { textContent: "", hidden: false };
+  readonly review = { textContent: "", hidden: false };
+  readonly reviewStatus = { textContent: "", hidden: false };
+
+  querySelector(selector: string) {
+    return {
+      "#processing-status": this.status,
+      "[data-pose-summary]": this.summary,
+      "[data-retry-analysis]": this.retry,
+      "[data-review-phases]": this.review,
+      "#phase-review-status": this.reviewStatus
+    }[selector] ?? null;
+  }
+}
+
 describe("analysis lifecycle ownership", () => {
   it("keeps network-blocked abort scoped to active local processing", () => {
     const state = createInitialAppState();
     const lifecycle = new AnalysisLifecycle({
       root: {} as ParentNode,
       state,
-      requestRender: () => undefined
+      requestRender: () => undefined,
+      applyAccessibilityIntent: () => undefined
     });
     const abort = vi.fn();
     Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
@@ -42,14 +50,16 @@ describe("analysis lifecycle ownership", () => {
     expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
   });
 
-  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
+  it("clears lifecycle-owned controller handles and syncs app-state idle on close without rendering", async () => {
     const state = createInitialAppState();
     const requestRender = vi.fn();
     const close = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
     const lifecycle = new AnalysisLifecycle({
       root: {} as ParentNode,
       state,
-      requestRender
+      requestRender,
+      applyAccessibilityIntent
     });
     Object.assign(
       lifecycle as unknown as {
@@ -68,61 +78,266 @@ describe("analysis lifecycle ownership", () => {
     expect(close).toHaveBeenCalledTimes(1);
     expect(lifecycle.hasActiveController()).toBe(false);
     expect(state.processingState).toBe("idle");
-    expect(requestRender).toHaveBeenCalledTimes(1);
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
   });
 
-  it("re-renders capture controls after async close settles", async () => {
-    const root = new FakeElement() as unknown as HTMLElement;
+  it("keeps stopped announcement owned by stop and close cleanup silent until the caller destination render", async () => {
     const state = createInitialAppState();
-    const closeDeferred = deferred();
-    const requestRender = vi.fn(() => renderApp(root, state, true));
+    const requestRender = vi.fn();
+    const cancel = vi.fn();
     const lifecycle = new AnalysisLifecycle({
-      root: root as unknown as ParentNode,
+      root: {} as ParentNode,
       state,
-      requestRender
+      requestRender,
+      applyAccessibilityIntent: vi.fn()
     });
-    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
-      frameController: { close: () => closeDeferred.promise }
+    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
+      frameController: { cancel }
     });
-    selectLocalVideo(state, new File(["video"], "swing.mp4", { type: "video/mp4" }));
     selectWorkflowStep(state, "processing");
     setProcessingState(state, "processing");
 
-    const closePromise = lifecycle.closeActive();
-    selectWorkflowStep(state, "capture");
-    renderApp(root, state, true);
+    await lifecycle.stopActive();
 
-    expect(root.innerHTML).toMatch(/id="analysis-button"[\s\S]*disabled/);
+    expect(cancel).toHaveBeenCalledTimes(1);
+    expect(lifecycle.hasActiveController()).toBe(false);
+    expect(state.activeStep).toBe("capture");
+    expect(state.processingState).toBe("idle");
+    expect(requestRender).toHaveBeenCalledWith({
+      focusKey: "stage-heading",
+      visibleStatusText: "Local analysis stopped and volatile resources were released.",
+      announcement: "Local analysis stopped and volatile resources were released."
+    });
 
-    closeDeferred.resolve();
-    await closePromise;
+    requestRender.mockClear();
+    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
+      frameController: { close: vi.fn() }
+    });
+    await lifecycle.closeActive();
+    expect(requestRender).not.toHaveBeenCalled();
+    requestRender({ focusKey: "stage-heading", announcement: "Capture or upload opened." });
+    expect(requestRender).toHaveBeenCalledOnce();
+  });
 
-    expect(requestRender).toHaveBeenCalledTimes(1);
-    expect(root.innerHTML).toContain('id="analysis-button"');
-    expect(root.innerHTML).not.toMatch(/id="analysis-button"[\s\S]*disabled/);
+  it("keeps progress ticks partial without global announcements or focus changes", () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
+    const lifecycle = new AnalysisLifecycle({
+      root: { querySelector: () => null } as unknown as ParentNode,
+      state,
+      requestRender,
+      applyAccessibilityIntent
+    });
+    const token = Symbol("current");
+    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
+    (lifecycle as unknown as { handleProcessingProgress(token: symbol, complete: number, total: number): void })
+      .handleProcessingProgress(token, 3, 8);
+    (lifecycle as unknown as { handleProcessingOutput(token: symbol, output: SampledFrameOutput): void })
+      .handleProcessingOutput(token, {
+        pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
+      } as unknown as SampledFrameOutput);
+    expect(state.extractedFrameCount).toBe(3);
+    expect(state.latestLandmarkCount).toBe(33);
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
   });
 
-  it("stops active processing and requests an idle capture render", async () => {
+  it("keeps current loading processing cancelled and closed callbacks partial without focus or global announcements", () => {
     const state = createInitialAppState();
+    selectWorkflowStep(state, "processing");
+    const root = new ProcessingRoot();
     const requestRender = vi.fn();
-    const cancel = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
     const lifecycle = new AnalysisLifecycle({
-      root: {} as ParentNode,
+      root: root as unknown as ParentNode,
       state,
-      requestRender
+      requestRender,
+      applyAccessibilityIntent
     });
-    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
-      frameController: { cancel }
+    const token = Symbol("current");
+    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
+    const callback = lifecycle as unknown as {
+      handleProcessingState(token: symbol, state: "loading" | "processing" | "cancelled" | "closed"): void;
+    };
+
+    const cases = [
+      {
+        state: "loading",
+        status: "Loading the local pose model in a background worker.",
+        reviewStatus: "Phase review requires local pose model loading and processing to complete."
+      },
+      {
+        state: "processing",
+        status: "Processing a local video frame.",
+        reviewStatus: "Phase review requires local video frame processing to complete."
+      },
+      {
+        state: "cancelled",
+        status: "Local frame processing cancelled.",
+        reviewStatus: "Phase review is unavailable because local processing was cancelled."
+      },
+      {
+        state: "closed",
+        status: "Local pose session closed.",
+        reviewStatus: "Phase review is unavailable because the local pose session was closed."
+      }
+    ] as const;
+
+    for (const current of cases) {
+      callback.handleProcessingState(token, current.state);
+      expect(state.processingState).toBe(current.state);
+      expect(root.status.textContent).toBe(current.status);
+      expect(root.reviewStatus.textContent).toBe(current.reviewStatus);
+      expect(root.retry.hidden).toBe(true);
+      expect(root.review.hidden).toBe(true);
+    }
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
+  });
+
+  it("focuses the processing heading and uses only scoped status for current completed and failed terminal states", () => {
+    const state = createInitialAppState();
+    selectWorkflowStep(state, "processing");
+    const requestRender = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
+    const lifecycle = new AnalysisLifecycle({
+      root: { querySelector: () => null } as unknown as ParentNode,
+      state,
+      requestRender,
+      applyAccessibilityIntent
+    });
+    const token = Symbol("current");
+    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol; frameController: { getOutputs(): [] } }, {
+      activeCallbackToken: token,
+      frameController: { getOutputs: () => [] }
+    });
+    const terminal = lifecycle as unknown as { handleProcessingState(token: symbol, state: "completed" | "failed", code?: string): void };
+    terminal.handleProcessingState(token, "completed");
+    terminal.handleProcessingState(token, "failed", "LOCAL_FAILURE");
+    expect(applyAccessibilityIntent).toHaveBeenNthCalledWith(1, { focusKey: "stage-heading" });
+    expect(applyAccessibilityIntent).toHaveBeenNthCalledWith(2, { focusKey: "stage-heading" });
+    expect(requestRender).not.toHaveBeenCalled();
+  });
+
+  it("does not steal focus for late terminal callbacks outside the processing view", () => {
+    const state = createInitialAppState();
+    selectWorkflowStep(state, "review");
+    const applyAccessibilityIntent = vi.fn();
+    const lifecycle = new AnalysisLifecycle({
+      root: { querySelector: () => null } as unknown as ParentNode,
+      state,
+      requestRender: vi.fn(),
+      applyAccessibilityIntent
     });
+    const token = Symbol("current");
+    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol }, { activeCallbackToken: token });
+    (lifecycle as unknown as { handleProcessingState(token: symbol, state: "failed"): void })
+      .handleProcessingState(token, "failed");
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
+  });
+
+  it("binds terminal callback focus to the originating active controller token", () => {
+    const state = createInitialAppState();
     selectWorkflowStep(state, "processing");
     setProcessingState(state, "processing");
+    const applyAccessibilityIntent = vi.fn();
+    const lifecycle = new AnalysisLifecycle({
+      root: { querySelector: () => null } as unknown as ParentNode,
+      state,
+      requestRender: vi.fn(),
+      applyAccessibilityIntent
+    });
+    const activeToken = Symbol("active");
+    const staleToken = Symbol("stale");
+    Object.assign(lifecycle as unknown as { activeCallbackToken: symbol; frameController: { getOutputs(): [] } }, {
+      activeCallbackToken: activeToken,
+      frameController: { getOutputs: () => [] }
+    });
+    const terminal = lifecycle as unknown as { handleProcessingState(token: symbol, state: "failed"): void };
+    terminal.handleProcessingState(staleToken, "failed");
+    expect(state.processingState).toBe("processing");
+    expect(applyAccessibilityIntent).not.toHaveBeenCalled();
+    terminal.handleProcessingState(activeToken, "failed");
+    expect(state.processingState).toBe("failed");
+    expect(applyAccessibilityIntent).toHaveBeenCalledOnce();
+  });
 
-    await lifecycle.stopActive();
+  it("retries without replacing the video DOM and moves focus once", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
+    const retry = vi.fn();
+    const lifecycle = new AnalysisLifecycle({ root: {} as ParentNode, state, requestRender, applyAccessibilityIntent });
+    Object.assign(lifecycle as unknown as { frameController: { retry(): Promise<void> } }, {
+      frameController: { retry }
+    });
+    await lifecycle.retryActive();
+    expect(retry).toHaveBeenCalledOnce();
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).toHaveBeenCalledOnce();
+  });
 
-    expect(cancel).toHaveBeenCalledTimes(1);
-    expect(lifecycle.hasActiveController()).toBe(false);
-    expect(state.activeStep).toBe("capture");
-    expect(state.processingState).toBe("idle");
-    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
+  it("invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert", async () => {
+    for (const operation of ["stop", "close"] as const) {
+      const state = createInitialAppState();
+      selectWorkflowStep(state, "processing");
+      setProcessingState(state, "processing");
+      const gate = deferred();
+      const requestRender = vi.fn();
+      const applyAccessibilityIntent = vi.fn();
+      const lifecycle = new AnalysisLifecycle({
+        root: { querySelector: () => null } as unknown as ParentNode,
+        state,
+        requestRender,
+        applyAccessibilityIntent
+      });
+      const token = Symbol(operation);
+      const cleanup = () => gate.promise;
+      Object.assign(lifecycle as unknown as {
+        activeCallbackToken: symbol;
+        frameController: { cancel(): Promise<void>; close(): Promise<void> };
+      }, {
+        activeCallbackToken: token,
+        frameController: { cancel: cleanup, close: cleanup }
+      });
+      const pending = operation === "stop" ? lifecycle.stopActive() : lifecycle.closeActive();
+      const callbacks = lifecycle as unknown as {
+        handleProcessingState(token: symbol, state: "failed"): void;
+        handleProcessingProgress(token: symbol, complete: number, total: number): void;
+        handleProcessingOutput(token: symbol, output: SampledFrameOutput): void;
+      };
+      callbacks.handleProcessingState(token, "failed");
+      callbacks.handleProcessingProgress(token, 7, 8);
+      callbacks.handleProcessingOutput(token, {
+        pose: { landmarks: [Array.from({ length: 33 }, () => ({}))] }
+      } as unknown as SampledFrameOutput);
+      expect(state.processingState).toBe("processing");
+      expect(state.extractedFrameCount).toBe(0);
+      expect(state.latestLandmarkCount).toBe(0);
+      expect(applyAccessibilityIntent).not.toHaveBeenCalled();
+      gate.resolve();
+      await pending;
+      expect(state.processingState).toBe("idle");
+      expect(requestRender).toHaveBeenCalledTimes(operation === "stop" ? 1 : 0);
+    }
+  });
+
+  it("keeps closeActive cleanup render-free for navigation picker replacement and beforeunload", async () => {
+    for (const owner of ["navigation", "picker replacement", "beforeunload"]) {
+      const state = createInitialAppState();
+      const requestRender = vi.fn();
+      const applyAccessibilityIntent = vi.fn();
+      const lifecycle = new AnalysisLifecycle({ root: {} as ParentNode, state, requestRender, applyAccessibilityIntent });
+      const close = vi.fn();
+      Object.assign(lifecycle as unknown as { frameController: { close(): Promise<void> } }, {
+        frameController: { close }
+      });
+      await lifecycle.closeActive();
+      expect(close, owner).toHaveBeenCalledOnce();
+      expect(requestRender, owner).not.toHaveBeenCalled();
+      expect(applyAccessibilityIntent, owner).not.toHaveBeenCalled();
+    }
   });
 });

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 14 Complete focused diff: git diff -- test/unit/analysis-lifecycle.test.ts -->

### 15 Complete focused diff: git diff -- test/unit/app-events.test.ts

Lines: 459  
Bytes: 22305  
SHA-256: `4aa03e7db0a7588478d3fd364101803735c52c728371e3ad5cac4e2d98fcd2b7`

<!-- BEGIN EXACT BLOCK: 15 Complete focused diff: git diff -- test/unit/app-events.test.ts -->
````````````````````````````````````````````````
diff --git a/test/unit/app-events.test.ts b/test/unit/app-events.test.ts
index 3fcbf89..c49d550 100644
--- a/test/unit/app-events.test.ts
+++ b/test/unit/app-events.test.ts
@@ -1,7 +1,14 @@
+import { readFileSync } from "node:fs";
 import { describe, expect, it, vi } from "vitest";
 import { bindAppEvents } from "../../src/app-events";
-import { createInitialAppState } from "../../src/app-state";
+import {
+  completeProcessingWithOutputs,
+  createInitialAppState,
+  rebuildPhaseReviewState,
+  setPhaseDeclaration
+} from "../../src/app-state";
 import type { SafetyConsentStore } from "../../src/consent-state";
+import { poseThresholds } from "../../src/pose-contract";
 
 class FakeButton {
   private listeners: (() => void)[] = [];
@@ -27,6 +34,47 @@ class FakeRoot {
   }
 }
 
+class EventTargetStub {
+  dataset: Record<string, string> = {};
+  files?: File[];
+  checked = false;
+  value = "";
+  private readonly listeners = new Map<string, ((event: { currentTarget: EventTargetStub }) => unknown)[]>();
+  addEventListener(name: string, listener: (event: { currentTarget: EventTargetStub }) => unknown): void {
+    this.listeners.set(name, [...(this.listeners.get(name) ?? []), listener]);
+  }
+  click(): void { void this.dispatch("click"); }
+  async dispatch(name: string): Promise<void> {
+    await Promise.all((this.listeners.get(name) ?? []).map((listener) => listener({ currentTarget: this })));
+  }
+}
+
+class MapRoot {
+  constructor(
+    readonly singles: Record<string, EventTargetStub> = {},
+    readonly lists: Record<string, EventTargetStub[]> = {}
+  ) {}
+  querySelector(selector: string): EventTargetStub | null { return this.singles[selector] ?? null; }
+  querySelectorAll(selector: string): EventTargetStub[] { return this.lists[selector] ?? []; }
+}
+
+class PickerRoot {
+  readonly picker = new EventTargetStub();
+  readonly input = new EventTargetStub();
+  querySelector(selector: string): EventTargetStub | null {
+    if (selector === "[data-video-picker]") return this.picker;
+    if (selector === "#video-file") return this.input;
+    return null;
+  }
+  querySelectorAll(): EventTargetStub[] { return []; }
+}
+
+function deferred() {
+  let resolve!: () => void;
+  const promise = new Promise<void>((done) => { resolve = done; });
+  return { promise, resolve };
+}
+
 describe("app event binding", () => {
   it("binds fresh DOM after repeated renders without duplicate effects", () => {
     const requestRender = vi.fn();
@@ -38,17 +86,389 @@ describe("app event binding", () => {
       state: createInitialAppState(),
       consent,
       lifecycle: {} as never,
-      requestRender
+      requestRender,
+      applyAccessibilityIntent: vi.fn()
     };
 
     const firstButton = new FakeButton();
     bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
     firstButton.click();
     expect(requestRender).toHaveBeenCalledTimes(1);
+    expect(requestRender).toHaveBeenLastCalledWith({
+      focusKey: "camera-placeholder",
+      visibleStatusText: "Camera capture remains out of scope. Choose a local video file.",
+      announcement: "Camera capture remains out of scope. Choose a local video file."
+    });
 
     const secondButton = new FakeButton();
     bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
     secondButton.click();
     expect(requestRender).toHaveBeenCalledTimes(2);
   });
+
+  it("uses exactly one announcement channel for every mapped event", () => {
+    const events = readFileSync("src/app-events.ts", "utf8");
+    const lifecycle = readFileSync("src/analysis-lifecycle.ts", "utf8");
+    const actions = readFileSync("src/swing-card-actions.ts", "utf8");
+    const main = readFileSync("src/main.ts", "utf8");
+    const eventRenderCalls = events.split("\n").filter((line) => line.trim().startsWith("requestRender(")).map((line) => line.trim());
+    const eventIntentCalls = events.split("\n").filter((line) => line.includes("applyAccessibilityIntent({"));
+    const eventRenderOwners = [
+      ["dependency contract", "requestRender(request?: RenderRequest): void;"],
+      ["consent change", 'requestRender({ focusKey: "safety-consent", announcement: message });'],
+      ["consent guard", 'requestRender({ focusKey: "safety-consent", visibleStatusText: message, announcement: message });'],
+      ["video guard", 'requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });'],
+      ["begin accepted", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
+      ["workflow step", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
+      ["next step", 'requestRender({ focusKey: "stage-heading", visibleStatusText: message, announcement: message });'],
+      ["picker success", 'requestRender({ focusKey: "video-picker", visibleStatusText: message, announcement: message });'],
+      ["camera", 'requestRender({ focusKey: "camera-placeholder", visibleStatusText: message, announcement: message });'],
+      ["review entry", 'requestRender({ focusKey: "phase-review-heading", visibleStatusText: message, announcement: message });'],
+      ["view declaration", 'requestRender(phaseRenderRequest("phase-declaration:view", before, state));'],
+      ["handedness declaration", 'requestRender(phaseRenderRequest("phase-declaration:handedness", before, state));'],
+      ["mirrored declaration", 'requestRender(phaseRenderRequest("phase-declaration:mirrored", before, state));'],
+      ["setup declaration", 'requestRender(phaseRenderRequest("phase-setup", before, state));'],
+      ["phase assignment", 'requestRender({ focusKey: `phase-assignment:${Number(select.dataset.phaseIndex)}` as RenderRequest["focusKey"] });'],
+      ["confirmation choice", 'requestRender({ focusKey: "phase-confirmation" });'],
+      ["confirm review", "requestRender({"],
+      ["open export", 'requestRender({ focusKey: "swing-card-heading", visibleStatusText: message, announcement: message });'],
+      ["keyframe selection", 'requestRender({ focusKey: `keyframe:${Number(button.dataset.keyframeIndex)}` as RenderRequest["focusKey"] });']
+    ] as const;
+    expect(eventRenderCalls).toHaveLength(eventRenderOwners.length);
+    eventRenderOwners.forEach(([owner, expected], index) => expect(eventRenderCalls[index], owner).toBe(expected));
+    expect(eventIntentCalls).toHaveLength(3);
+    expect(lifecycle.match(/this\.options\.requestRender\(/g)).toHaveLength(1);
+    expect(lifecycle.match(/this\.options\.applyAccessibilityIntent\(/g)).toHaveLength(2);
+    expect(actions.match(/requestRender\(/g)).toHaveLength(6);
+    expect(main.match(/^requestRender\(\);$/gm)).toHaveLength(1);
+    expect(main.match(/lifecycle\.closeActive\(\)/g)).toHaveLength(1);
+
+    const mappedCallsites = [
+      ["consent", 'focusKey: "safety-consent", announcement: message'],
+      ["consent guard", 'focusKey: "safety-consent", visibleStatusText: message'],
+      ["video guard", 'focusKey: "video-picker", visibleStatusText: message'],
+      ["begin", 'focusKey: "stage-heading", visibleStatusText: message'],
+      ["workflow", 'getWorkflowStep(state.activeStep).label} opened.'],
+      ["next", 'getNextWorkflowStep(state.activeStep).id'],
+      ["picker success", 'Local video selected. It has not been analyzed or persisted.'],
+      ["picker cancel", 'addEventListener("cancel", () => applyAccessibilityIntent'],
+      ["picker focus", 'addEventListener("focus", () => applyAccessibilityIntent'],
+      ["picker focusin", 'addEventListener("focusin", () => applyAccessibilityIntent'],
+      ["camera", 'focusKey: "camera-placeholder"'],
+      ["review entry", 'focusKey: "phase-review-heading", visibleStatusText: message'],
+      ["view declaration", 'phaseRenderRequest("phase-declaration:view"'],
+      ["handedness declaration", 'phaseRenderRequest("phase-declaration:handedness"'],
+      ["mirrored declaration", 'phaseRenderRequest("phase-declaration:mirrored"'],
+      ["setup", 'phaseRenderRequest("phase-setup"'],
+      ["assignment", 'focusKey: `phase-assignment:'],
+      ["confirmation choice", 'focusKey: "phase-confirmation"'],
+      ["confirm", 'Phase review could not be confirmed.'],
+      ["export", 'focusKey: "swing-card-heading"'],
+      ["keyframe scoped", 'focusKey: `keyframe:'],
+      ["stop global", 'Local analysis stopped and volatile resources were released.'],
+      ["retry no render", 'applyAccessibilityIntent({ focusKey: "stage-heading" })'],
+      ["terminal scoped", '(state === "completed" || state === "failed")'],
+      ["close silent", 'async closeActive(): Promise<void>'],
+      ["download preparing/results", 'focusKey: "swing-card-download"'],
+      ["print preparing/results", 'focusKey: "swing-card-print"'],
+      ["copy preparing/results", 'focusKey: "swing-card-copy"'],
+      ["initial render", 'requestRender();'],
+      ["beforeunload", 'void lifecycle.closeActive();']
+    ] as const;
+    const allSources = `${events}\n${lifecycle}\n${actions}\n${main}`;
+    for (const [owner, needle] of mappedCallsites) expect(allSources, owner).toContain(needle);
+    expect(actions.match(/announcement: state\.swingCardStatus/g)).toHaveLength(6);
+    expect(lifecycle).not.toContain("announcement: processingStatusText");
+    expect(events).not.toContain("announceOverlayStatus");
+  });
+
+  it("returns focus to the picker after successful keyboard-opened selection", async () => {
+    const root = new PickerRoot();
+    const state = createInitialAppState();
+    const gate = deferred();
+    const requestRender = vi.fn();
+    root.input.files = [new File(["video"], "swing.mp4", { type: "video/mp4" })];
+    bindAppEvents(root as unknown as ParentNode, {
+      state,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: () => gate.promise } as never,
+      requestRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    const changing = root.input.dispatch("change");
+    expect(requestRender).not.toHaveBeenCalled();
+    gate.resolve();
+    await changing;
+    expect(requestRender).toHaveBeenCalledOnce();
+    expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "video-picker" }));
+  });
+
+  it("returns focus to the picker on native chooser cancel without rendering", async () => {
+    const root = new PickerRoot();
+    const requestRender = vi.fn();
+    const applyAccessibilityIntent = vi.fn();
+    bindAppEvents(root as unknown as ParentNode, {
+      state: createInitialAppState(),
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: vi.fn() } as never,
+      requestRender,
+      applyAccessibilityIntent
+    });
+    await root.input.dispatch("cancel");
+    expect(requestRender).not.toHaveBeenCalled();
+    expect(applyAccessibilityIntent).toHaveBeenCalledWith({ focusKey: "video-picker" });
+  });
+
+  it("redirects hidden file input focus to the picker without positive tabindex", async () => {
+    const root = new PickerRoot();
+    const applyAccessibilityIntent = vi.fn();
+    bindAppEvents(root as unknown as ParentNode, {
+      state: createInitialAppState(),
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: {} as never,
+      requestRender: vi.fn(),
+      applyAccessibilityIntent
+    });
+    await root.input.dispatch("focus");
+    expect(applyAccessibilityIntent).toHaveBeenCalledWith({ focusKey: "video-picker" });
+  });
+
+  it("awaits closeActive before rendering workflow navigation exactly once", async () => {
+    const button = new EventTargetStub();
+    button.dataset.step = "capture";
+    const root = {
+      querySelector: () => null,
+      querySelectorAll: (selector: string) => selector === "[data-step]" ? [button] : []
+    };
+    const state = createInitialAppState();
+    state.activeStep = "processing";
+    state.processingState = "processing";
+    const gate = deferred();
+    const requestRender = vi.fn();
+    bindAppEvents(root as unknown as ParentNode, {
+      state,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: () => gate.promise } as never,
+      requestRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    const navigating = button.dispatch("click");
+    expect(requestRender).not.toHaveBeenCalled();
+    gate.resolve();
+    await navigating;
+    expect(requestRender).toHaveBeenCalledOnce();
+    expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "stage-heading" }));
+  });
+
+  it("awaits closeActive before selecting a replacement video and renders exactly once", async () => {
+    const root = new PickerRoot();
+    const state = createInitialAppState();
+    const gate = deferred();
+    const requestRender = vi.fn();
+    root.input.files = [new File(["replacement"], "replacement.mp4", { type: "video/mp4" })];
+    bindAppEvents(root as unknown as ParentNode, {
+      state,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: () => gate.promise } as never,
+      requestRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    const selecting = root.input.dispatch("change");
+    expect(state.selectedVideo).toBeUndefined();
+    gate.resolve();
+    await selecting;
+    expect(state.selectedVideo?.name).toBe("replacement.mp4");
+    expect(requestRender).toHaveBeenCalledOnce();
+  });
+
+  it("lets navigation and picker callers own exactly one destination render", async () => {
+    const navigationButton = new EventTargetStub();
+    navigationButton.dataset.step = "capture";
+    const navigationRender = vi.fn();
+    const navigationState = createInitialAppState();
+    navigationState.activeStep = "processing";
+    navigationState.processingState = "processing";
+    bindAppEvents({
+      querySelector: () => null,
+      querySelectorAll: (selector: string) => selector === "[data-step]" ? [navigationButton] : []
+    } as unknown as ParentNode, {
+      state: navigationState,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: vi.fn() } as never,
+      requestRender: navigationRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    await navigationButton.dispatch("click");
+    expect(navigationRender).toHaveBeenCalledOnce();
+
+    const pickerRoot = new PickerRoot();
+    pickerRoot.input.files = [new File(["replacement"], "replacement.mp4", { type: "video/mp4" })];
+    const pickerRender = vi.fn();
+    bindAppEvents(pickerRoot as unknown as ParentNode, {
+      state: createInitialAppState(),
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { closeActive: vi.fn() } as never,
+      requestRender: pickerRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    await pickerRoot.input.dispatch("change");
+    expect(pickerRender).toHaveBeenCalledOnce();
+  });
+
+  it("executes typed consent guard begin workflow review declaration confirmation export and keyframe intents", async () => {
+    const consentControl = new EventTargetStub();
+    consentControl.checked = true;
+    let consentAccepted = false;
+    const consentRender = vi.fn();
+    bindAppEvents(new MapRoot({ "#safety-consent": consentControl }) as unknown as ParentNode, {
+      state: createInitialAppState(),
+      consent: {
+        hasSafetyConsent: () => consentAccepted,
+        setSafetyConsent: (value) => { consentAccepted = value; }
+      },
+      lifecycle: {} as never,
+      requestRender: consentRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    await consentControl.dispatch("change");
+    expect(consentRender).toHaveBeenCalledWith({
+      focusKey: "safety-consent",
+      announcement: "Safety acknowledgement recorded locally."
+    });
+
+    for (const guard of ["consent", "video"] as const) {
+      const begin = new EventTargetStub();
+      const requestRender = vi.fn();
+      bindAppEvents(new MapRoot({ "#analysis-button": begin }) as unknown as ParentNode, {
+        state: createInitialAppState(),
+        consent: { hasSafetyConsent: () => guard === "video", setSafetyConsent: () => undefined },
+        lifecycle: {} as never,
+        requestRender,
+        applyAccessibilityIntent: vi.fn()
+      });
+      await begin.dispatch("click");
+      expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({
+        focusKey: guard === "consent" ? "safety-consent" : "video-picker",
+        announcement: expect.any(String)
+      }));
+    }
+
+    const begin = new EventTargetStub();
+    const beginState = createInitialAppState();
+    beginState.selectedVideo = new File(["video"], "swing.mp4", { type: "video/mp4" });
+    const beginRender = vi.fn();
+    const startActive = vi.fn();
+    bindAppEvents(new MapRoot({ "#analysis-button": begin }) as unknown as ParentNode, {
+      state: beginState,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: { startActive } as never,
+      requestRender: beginRender,
+      applyAccessibilityIntent: vi.fn()
+    });
+    await begin.dispatch("click");
+    expect(beginRender).toHaveBeenCalledWith(expect.objectContaining({ focusKey: "stage-heading", announcement: expect.any(String) }));
+    expect(startActive).toHaveBeenCalledOnce();
+
+    for (const selector of ["[data-next-step]", "[data-review-phases]", "[data-open-export]"] as const) {
+      const control = new EventTargetStub();
+      const state = createInitialAppState();
+      if (selector === "[data-review-phases]") state.activeStep = "processing";
+      const requestRender = vi.fn();
+      bindAppEvents(new MapRoot({ [selector]: control }) as unknown as ParentNode, {
+        state,
+        consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+        lifecycle: {} as never,
+        requestRender,
+        applyAccessibilityIntent: vi.fn()
+      });
+      await control.dispatch("click");
+      expect(requestRender).toHaveBeenCalledWith(expect.objectContaining({
+        focusKey: selector === "[data-review-phases]"
+          ? "phase-review-heading"
+          : selector === "[data-open-export]"
+            ? "swing-card-heading"
+            : "stage-heading"
+      }));
+    }
+
+    const phaseState = createInitialAppState();
+    completeProcessingWithOutputs(phaseState, {
+      getOutputs: () => Array.from({ length: 8 }, (_, index) => {
+        const landmarks = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 1 }));
+        return {
+          runGeneration: 1,
+          index,
+          requestedTimestampMs: index * 100,
+          observedSeekTimestampMs: index * 100,
+          preview: { close: () => undefined },
+          pose: { timestampMs: index * 100, landmarks: [landmarks], worldLandmarks: [landmarks], thresholds: poseThresholds }
+        };
+      }) as never
+    });
+    setPhaseDeclaration(phaseState, "handedness", "right");
+    setPhaseDeclaration(phaseState, "mirrored", "no");
+    setPhaseDeclaration(phaseState, "setup", "confirmed");
+    rebuildPhaseReviewState(phaseState);
+    const view = new EventTargetStub();
+    view.value = "face-on";
+    const handedness = new EventTargetStub();
+    handedness.value = "left";
+    const mirrored = new EventTargetStub();
+    mirrored.value = "yes";
+    const setup = new EventTargetStub();
+    setup.checked = true;
+    const assignment = new EventTargetStub();
+    assignment.dataset.phaseIndex = "0";
+    assignment.value = "0";
+    const confirmation = new EventTargetStub();
+    const confirm = new EventTargetStub();
+    const keyframe = new EventTargetStub();
+    keyframe.dataset.keyframeIndex = "2";
+    const phaseRender = vi.fn();
+    const phaseIntent = vi.fn();
+    bindAppEvents(new MapRoot(
+      {
+        "#phase-view": view,
+        "#phase-handedness": handedness,
+        "#phase-mirrored": mirrored,
+        "#phase-setup": setup,
+        "#phase-confirmation": confirmation,
+        "[data-confirm-phase-review]": confirm
+      },
+      { "[data-phase-index]": [assignment], "[data-keyframe-index]": [keyframe] }
+    ) as unknown as ParentNode, {
+      state: phaseState,
+      consent: { hasSafetyConsent: () => true, setSafetyConsent: () => undefined },
+      lifecycle: {} as never,
+      requestRender: phaseRender,
+      applyAccessibilityIntent: phaseIntent
+    });
+    await view.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({
+      focusKey: "phase-declaration:view",
+      visibleStatusText: "Swing phase suggestions are ready for review.",
+      announcement: "Swing phase suggestions are ready for review."
+    });
+    await view.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:view" });
+    await handedness.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:handedness" });
+    await mirrored.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-declaration:mirrored" });
+    await setup.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-setup" });
+    await assignment.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-assignment:0" });
+    await confirmation.dispatch("change");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "phase-confirmation" });
+    await confirm.dispatch("click");
+    expect(phaseRender).toHaveBeenLastCalledWith({
+      focusKey: "phase-review-heading",
+      visibleStatusText: "Phase review could not be confirmed.",
+      announcement: "Phase review could not be confirmed."
+    });
+    expect(phaseIntent).not.toHaveBeenCalled();
+    await keyframe.dispatch("click");
+    expect(phaseRender).toHaveBeenLastCalledWith({ focusKey: "keyframe:2" });
+  });
 });

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 15 Complete focused diff: git diff -- test/unit/app-events.test.ts -->

### 16 Complete focused diff: git diff -- test/unit/app-renderer.test.ts

Lines: 167  
Bytes: 8861  
SHA-256: `e46ccb3771dfa5ca7052f90d60a062c672fef51130e4eee43a018383a7060ddc`

<!-- BEGIN EXACT BLOCK: 16 Complete focused diff: git diff -- test/unit/app-renderer.test.ts -->
````````````````````````````````````````````````
diff --git a/test/unit/app-renderer.test.ts b/test/unit/app-renderer.test.ts
index 162d15b..5ddc36d 100644
--- a/test/unit/app-renderer.test.ts
+++ b/test/unit/app-renderer.test.ts
@@ -1,17 +1,21 @@
+import { readFileSync } from "node:fs";
 import { describe, expect, it } from "vitest";
 import type { SampledFrameOutput } from "../../src/frame-processing";
 import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
 import {
   completeProcessingWithOutputs,
+  confirmPhaseReview,
   createInitialAppState,
   rebuildPhaseReviewState,
   selectLocalVideo,
   selectWorkflowStep,
   setPhaseDeclaration,
+  setPhaseConfirmation,
   setProcessingProgress,
   setProcessingState
 } from "../../src/app-state";
 import { phaseDefinitions } from "../../src/phase-review";
+import { renderSelectedKeyframeCanvas } from "../../src/keyframe-overlay-renderer";
 import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";
 
 class FakeElement {
@@ -77,6 +81,20 @@ describe("app renderer contracts", () => {
     expect(root.innerHTML).toContain("Local video source");
     expect(root.innerHTML).toContain("&lt;bad &quot;name&quot;&gt;.mp4");
     expect(root.innerHTML).not.toContain(`<bad "name">.mp4`);
+    expect(root.innerHTML).toContain('role="group" aria-label="Local video source"');
+    expect(root.innerHTML).toContain('accept="video/*" tabindex="-1" aria-label="Choose a local video file"');
+    expect(root.innerHTML).not.toContain('id="video-file" aria-hidden="true"');
+    expect(root.innerHTML).toContain('id="app-visible-status"');
+    expect(root.innerHTML).not.toMatch(/id="app-visible-status"[^>]*(?:role="status"|aria-live)/);
+  });
+
+  it("renders exactly one main landmark across the static host and shell", () => {
+    const root = new FakeElement() as unknown as HTMLElement;
+    renderApp(root, createInitialAppState(), false);
+    const index = readFileSync("index.html", "utf8");
+    expect(index).toContain('<div id="app"></div>');
+    expect(index).not.toContain('<main id="app"');
+    expect(root.innerHTML.match(/<main\b/g)).toHaveLength(1);
   });
 
   it("preserves protected phase-review selectors and labels", () => {
@@ -98,6 +116,18 @@ describe("app renderer contracts", () => {
     ]) {
       expect(root.innerHTML).toContain(value);
     }
+    expect(root.innerHTML).toContain('role="group" aria-label="Swing phase assignments"');
+    expect(root.innerHTML).toContain('role="group" aria-label="Select keyframe"');
+    expect(root.innerHTML).toContain('data-keyframe-canvas role="img"');
+    expect(root.innerHTML).toContain('aria-describedby="keyframe-overlay-status"');
+    expect(root.innerHTML).toContain('id="keyframe-overlay-status" data-overlay-status role="status" aria-live="polite"');
+    expect(root.innerHTML).toContain("Skeleton overlay availability is determined locally for this keyframe.");
+    expect(root.innerHTML).toContain('id="phase-review-status"');
+    expect(root.innerHTML).not.toMatch(/id="phase-review-status"[^>]*(?:role="status"|aria-live)/);
+    expect(root.innerHTML.match(/<h3>[^<]+<\/h3>/g)).toHaveLength(8);
+    expect(root.innerHTML).toContain('<label class="visually-hidden" for="phase-assignment-0">Address sample</label>');
+    expect(root.innerHTML).toContain('id="phase-assignment-0" data-phase-index="0" data-focus-key="phase-assignment:0"');
+    expect(root.innerHTML).not.toContain('<label class="phase-assignment">');
   });
 
   it("preserves protected export and remote-review-unavailable selectors and labels", () => {
@@ -120,6 +150,20 @@ describe("app renderer contracts", () => {
     ]) {
       expect(root.innerHTML).toContain(value);
     }
+    expect(root.innerHTML).toContain('role="group" aria-label="Swing Card contents"');
+    expect(root.innerHTML).toContain('role="group" aria-label="Remote model data disclosure"');
+    expect(root.innerHTML).toContain('<dl class="remote-model-disclosure">');
+    expect(root.innerHTML).toContain('id="remote-model-status" data-remote-model-status');
+    expect(root.innerHTML).not.toMatch(/id="remote-model-status"[^>]*(?:role="status"|aria-live)/);
+    expect(root.innerHTML).toContain('aria-describedby="remote-model-status"');
+  });
+
+  it("rejects bare labelled generic containers and keeps the exhaustive role inventory", () => {
+    const source = ["src/app-renderer.ts", "src/phase-review-renderer.ts", "src/remote-model-renderer.ts"]
+      .map((file) => readFileSync(file, "utf8")).join("\n");
+    const labelledGeneric = source.match(/<(?:div|span|p)\b[^>]*aria-label="[^"]+"[^>]*>/g) ?? [];
+    expect(labelledGeneric.length).toBeGreaterThan(0);
+    for (const element of labelledGeneric) expect(element).toContain('role="group"');
   });
 
   it("updates current processing DOM by re-querying targets and no-ops when absent", () => {
@@ -144,4 +188,79 @@ describe("app renderer contracts", () => {
     expect(detachedSummary.textContent).toContain("1 of 8");
     expect(() => updateProcessingProgressUi(new FakeElement() as unknown as ParentNode, state)).not.toThrow();
   });
+
+  it("updates the review description for completed and failed partial terminal states", () => {
+    const state = createInitialAppState();
+    const root = new FakeElement();
+    const reviewStatus = new FakeElement();
+    root.set("#phase-review-status", reviewStatus);
+    setProcessingState(state, "completed");
+    updateProcessingProgressUi(root as unknown as ParentNode, state);
+    expect(reviewStatus.textContent).toBe("Local processing output is ready for phase review.");
+    setProcessingState(state, "failed", "LOCAL_MODEL_INIT_FAILED");
+    updateProcessingProgressUi(root as unknown as ParentNode, state);
+    expect(reviewStatus.textContent).toBe(
+      "Phase review is unavailable because local pose analysis stopped (LOCAL_MODEL_INIT_FAILED). Retry local analysis."
+    );
+  });
+
+  it("uses confirmed-specific phase review copy without a review-needed contradiction", () => {
+    const root = new FakeElement() as unknown as HTMLElement;
+    const state = createReviewReadyState();
+    setPhaseConfirmation(state, true);
+    confirmPhaseReview(state);
+    selectWorkflowStep(state, "review");
+    renderApp(root, state, true);
+    expect(root.innerHTML).toContain("Phase review is confirmed.");
+    expect(root.innerHTML).not.toContain("Swing phase suggestions need review.");
+  });
+
+  it("keeps unrelated canvas redraws silent and lets mapped keyframe selection own scoped status", () => {
+    const state = createReviewReadyState();
+    const root = new FakeElement();
+    const canvas = new FakeElement();
+    const status = new FakeElement();
+    status.textContent = "Existing accurate status.";
+    root.set("[data-keyframe-canvas]", canvas);
+    root.set("#keyframe-overlay-status", status);
+    const partialResult = {
+      status: "partial" as const,
+      renderedSegments: 1,
+      skippedSegments: 1,
+      warnings: [],
+      width: 320,
+      height: 180
+    };
+    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, false, () => partialResult);
+    expect(state.latestOverlayResult).toEqual(partialResult);
+    expect(status.textContent).toBe("Existing accurate status.");
+
+    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, true, () => ({
+      ...partialResult,
+      status: "unavailable"
+    }));
+    expect(status.textContent).toBe("Skeleton overlay unavailable for this keyframe.");
+  });
+
+  it("owns processing scoped status and keeps numeric progress outside it", () => {
+    const root = new FakeElement() as unknown as HTMLElement;
+    const state = createInitialAppState();
+    selectWorkflowStep(state, "processing");
+    renderApp(root, state, true);
+    expect(root.innerHTML).toContain('role="group" aria-label="Local pose processing"');
+    expect(root.innerHTML).toContain('id="processing-status" role="status" aria-live="polite" aria-atomic="true"');
+    expect(root.innerHTML).toMatch(/<\/strong>\s*<p data-pose-summary>/);
+    expect(root.innerHTML).toContain('data-focus-key="stop-analysis"');
+    expect(root.innerHTML).toContain('data-focus-key="retry-analysis"');
+  });
+
+  it("labels the unavailable export section and describes its disabled control", () => {
+    const root = new FakeElement() as unknown as HTMLElement;
+    const state = createInitialAppState();
+    selectWorkflowStep(state, "export");
+    renderApp(root, state, true);
+    expect(root.innerHTML).toContain('<section class="export-placeholder" aria-labelledby="export-placeholder-heading">');
+    expect(root.innerHTML).toContain('<h3 id="export-placeholder-heading">Swing Card unavailable</h3>');
+    expect(root.innerHTML).toContain('disabled aria-describedby="phase-review-status"');
+  });
 });

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 16 Complete focused diff: git diff -- test/unit/app-renderer.test.ts -->

### 17 Complete focused diff: git diff -- test/unit/swing-card-actions.test.ts

Lines: 202  
Bytes: 8425  
SHA-256: `2405ae3e08180be6953b0c83217eedda7a06bb4a2ce5750592e0c611cf01b4fd`

<!-- BEGIN EXACT BLOCK: 17 Complete focused diff: git diff -- test/unit/swing-card-actions.test.ts -->
````````````````````````````````````````````````
diff --git a/test/unit/swing-card-actions.test.ts b/test/unit/swing-card-actions.test.ts
index 43c02e9..e8e75dc 100644
--- a/test/unit/swing-card-actions.test.ts
+++ b/test/unit/swing-card-actions.test.ts
@@ -1,4 +1,4 @@
-import { describe, expect, it, vi } from "vitest";
+import { beforeEach, describe, expect, it, vi } from "vitest";
 import type { SampledFrameOutput } from "../../src/frame-processing";
 import {
   completeProcessingWithOutputs,
@@ -8,7 +8,23 @@ import {
 } from "../../src/app-state";
 import { phaseDefinitions } from "../../src/phase-review";
 import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";
-import { prepareSwingCardContent } from "../../src/swing-card-actions";
+import {
+  copySwingCardPrompt,
+  downloadSwingCard,
+  prepareSwingCardContent,
+  printSwingCard
+} from "../../src/swing-card-actions";
+
+const generatorMocks = vi.hoisted(() => ({
+  composeSwingCardPng: vi.fn(),
+  renderSwingCardPrintSurface: vi.fn(),
+  triggerSwingCardDownload: vi.fn()
+}));
+
+vi.mock("../../src/swing-card-generator", async (importOriginal) => ({
+  ...(await importOriginal<typeof import("../../src/swing-card-generator")>()),
+  ...generatorMocks
+}));
 
 function landmark(): PoseLandmark {
   return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
@@ -35,6 +51,166 @@ function sampledOutputs(): SampledFrameOutput[] {
 }
 
 describe("swing card actions", () => {
+  beforeEach(() => {
+    generatorMocks.composeSwingCardPng.mockReset();
+    generatorMocks.renderSwingCardPrintSurface.mockReset();
+    generatorMocks.triggerSwingCardDownload.mockReset();
+    vi.unstubAllGlobals();
+  });
+
+  it("uses exact global start and completion requests for Swing Card download", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    const blob = new Blob(["png"], { type: "image/png" });
+    generatorMocks.composeSwingCardPng.mockResolvedValue({
+      status: "ok",
+      blob,
+      filename: "swing-card.png",
+      warnings: []
+    });
+
+    await downloadSwingCard(state, requestRender);
+
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing local Swing Card PNG.",
+      announcement: "Preparing local Swing Card PNG."
+    });
+    expect(generatorMocks.triggerSwingCardDownload).toHaveBeenCalledWith(blob, "swing-card.png");
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-download",
+      visibleStatusText: "Swing Card PNG download started.",
+      announcement: "Swing Card PNG download started."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    expect(state.swingCardStatus).toBe("Swing Card PNG download started.");
+    expect(state.swingCardBusy).toBe(false);
+  });
+
+  it("uses the exact download failure result and restores download focus", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    generatorMocks.composeSwingCardPng.mockResolvedValue({
+      status: "error",
+      reason: "CANVAS_UNAVAILABLE",
+      warnings: []
+    });
+
+    await downloadSwingCard(state, requestRender);
+
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing local Swing Card PNG.",
+      announcement: "Preparing local Swing Card PNG."
+    });
+    expect(generatorMocks.triggerSwingCardDownload).not.toHaveBeenCalled();
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-download",
+      visibleStatusText: "Swing Card PNG export stopped (CANVAS_UNAVAILABLE).",
+      announcement: "Swing Card PNG export stopped (CANVAS_UNAVAILABLE)."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    expect(state.swingCardStatus).toBe("Swing Card PNG export stopped (CANVAS_UNAVAILABLE).");
+    expect(state.swingCardBusy).toBe(false);
+  });
+
+  it("uses exact global start and completion requests for Swing Card print", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    const replaceChildren = vi.fn();
+    const printSurface = {} as HTMLElement;
+    const print = vi.fn();
+    generatorMocks.renderSwingCardPrintSurface.mockReturnValue(printSurface);
+    vi.stubGlobal("window", { print });
+
+    await printSwingCard({
+      querySelector: (selector: string) => selector === "[data-swing-card-print-host]" ? { replaceChildren } : null
+    } as unknown as ParentNode, state, requestRender);
+
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing browser print view.",
+      announcement: "Preparing browser print view."
+    });
+    expect(replaceChildren).toHaveBeenCalledWith(printSurface);
+    expect(print).toHaveBeenCalledOnce();
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-print",
+      visibleStatusText: "Browser print dialog opened. Save as PDF if your browser supports it.",
+      announcement: "Browser print dialog opened. Save as PDF if your browser supports it."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    expect(state.swingCardStatus).toBe("Browser print dialog opened. Save as PDF if your browser supports it.");
+    expect(state.swingCardBusy).toBe(false);
+  });
+
+  it("uses the exact print failure result and restores print focus", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    generatorMocks.renderSwingCardPrintSurface.mockReturnValue({} as HTMLElement);
+    vi.stubGlobal("window", { print: vi.fn() });
+
+    await printSwingCard({
+      querySelector: () => ({
+        replaceChildren: () => {
+          throw new Error("print surface unavailable");
+        }
+      })
+    } as unknown as ParentNode, state, requestRender);
+
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing browser print view.",
+      announcement: "Preparing browser print view."
+    });
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-print",
+      visibleStatusText: "Browser print view could not be prepared.",
+      announcement: "Browser print view could not be prepared."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    expect(state.swingCardStatus).toBe("Browser print view could not be prepared.");
+    expect(state.swingCardBusy).toBe(false);
+  });
+
+  it("uses global preparing and result announcements with exact action focus", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn() } });
+    await copySwingCardPrompt(state, requestRender);
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing prompt text.",
+      announcement: "Preparing prompt text."
+    });
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-copy",
+      visibleStatusText: "Prompt copied for manual use.",
+      announcement: "Prompt copied for manual use."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    vi.unstubAllGlobals();
+  });
+
+  it("uses the same sole global channel for copy failure", async () => {
+    const state = createInitialAppState();
+    const requestRender = vi.fn();
+    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn(() => Promise.reject(new Error("blocked"))) } });
+    await copySwingCardPrompt(state, requestRender);
+    expect(requestRender).toHaveBeenNthCalledWith(1, {
+      focusKey: "swing-card-status",
+      visibleStatusText: "Preparing prompt text.",
+      announcement: "Preparing prompt text."
+    });
+    expect(requestRender).toHaveBeenNthCalledWith(2, {
+      focusKey: "swing-card-copy",
+      visibleStatusText: "Prompt copy unavailable in this browser.",
+      announcement: "Prompt copy unavailable in this browser."
+    });
+    expect(requestRender).toHaveBeenCalledTimes(2);
+    vi.unstubAllGlobals();
+  });
+
   it("keeps observedSeekTimestampMs out of prepared export content from populated keyframes", async () => {
     vi.stubGlobal("document", {
       createElement: () => ({

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 17 Complete focused diff: git diff -- test/unit/swing-card-actions.test.ts -->

### 18 Complete current file: AGENTS.md

Lines: 70  
Bytes: 3301  
SHA-256: `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e`

<!-- BEGIN EXACT BLOCK: 18 Complete current file: AGENTS.md -->
````````````````````````````````````````````````
# Repository Guidelines

## Start With Current State

Read [`CONTEXT.md`](./CONTEXT.md) before starting work. Confirm the next task,
acceptance criteria, branch, and handshake status in the Swing Sync Notion task
database before implementation. After PR creation, audit results, or merge
state changes, keep Notion and `CONTEXT.md` synchronized.

Keep changes within the accepted story scope. For runtime changes, document
whether observability was added, intentionally unchanged, or deferred.

## Sensitive Story Rules

For safety, privacy, legal, medical, AI-coaching, model-provider, or
compliance-sensitive stories, keep roles explicit:

- Gemini researches and drafts specifications.
- Codex implements, verifies, and maintains repository state.
- Claude performs adversarial audit and re-review.

Treat Gemini research as input, not authority. Before implementation, classify
broad recommendations as Adopt, Revise, Defer, or Reject. Claude adversarial
review is required before a sensitive story is Done. After fixes, use a
separate focused re-review prompt containing prior findings, applied fixes,
relevant current context, verification, and a focused diff.

Browser-chat prompts must embed all required repository context; Gemini and
Claude Chat do not have filesystem or GitHub access.

After Claude or implementation feedback, convert repeatable lessons into
durable process updates. Prefer this loop: classify each finding as blocker,
non-blocking recommendation, or future work; update the spec and tests before
implementation when the finding changes acceptance or verification; get a
focused re-review for sensitive stories; then capture reusable rules in
`CONTEXT.md` and, when they affect future delivery, this file or the relevant
`.agents/skills/*/SKILL.md`. Do not rely on chat memory alone.

For sensitive verifier or documentation changes, audit packets should include
every changed tracked file or an explicit rationale for omission. Test evidence
should include named tests mapped to acceptance criteria or audit blockers when
coverage is part of the sign-off decision.

## Product And Compliance Boundaries

Preserve the local-first rules in
[`docs/privacy-architecture.md`](./docs/privacy-architecture.md): raw swing
video is not uploaded by default, and remote sharing requires a separate,
explicit opt-in. Do not make absolute privacy, safety, legal, deletion,
anonymity, or compliance claims.

Follow [`docs/safety-terms.md`](./docs/safety-terms.md) for user-facing and AI
coaching boundaries. Follow [`docs/licensing.md`](./docs/licensing.md) and
[`docs/models-licensing.md`](./docs/models-licensing.md) before adding
dependencies, reference-derived code, model assets, SDKs, or providers.

## Verification

Use Node 22 from `.nvmrc`. Run the checks required by the changed surface and
record results in the PR:

- Baseline runtime/docs changes: `npm run build` and
  `npm run compliance:verify`.
- Dependency, bundle, or licensing changes: also run `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.
- Targeted boundaries: run `npm run safety:verify` or
  `npm run privacy:verify` when those surfaces change.

Complete [`.github/pull_request_template.md`](./.github/pull_request_template.md)
and preserve required notices.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 18 Complete current file: AGENTS.md -->

### 19 Complete current file: .nvmrc

Lines: 1  
Bytes: 3  
SHA-256: `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56`

<!-- BEGIN EXACT BLOCK: 19 Complete current file: .nvmrc -->
````````````````````````````````````````````````
22

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 19 Complete current file: .nvmrc -->

### 20 Complete current file: package.json

Lines: 38  
Bytes: 1777  
SHA-256: `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0`

<!-- BEGIN EXACT BLOCK: 20 Complete current file: package.json -->
````````````````````````````````````````````````
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "docs:verify": "node scripts/verify-docs-claims.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "fixture:verify": "node scripts/verify-fixtures.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify && npm run docs:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  },
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  }
}

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 20 Complete current file: package.json -->

### 21 Complete current file: docs/privacy-architecture.md

Lines: 200  
Bytes: 9344  
SHA-256: `e27485d3cb6ba794866658ef7ba01f075ea3cf4601b08a7ae8bd95875fac5bb6`

<!-- BEGIN EXACT BLOCK: 21 Complete current file: docs/privacy-architecture.md -->
````````````````````````````````````````````````
# Privacy Architecture and Video Data Lifecycle

**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for future
video analysis work. It is product and engineering guidance, not legal advice
or a guarantee of privacy, security, deletion, or regulatory compliance.

## Default Privacy Posture

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.

## Data Classes

| Class | Data | Default storage | Default network policy |
| --- | --- | --- | --- |
| A | Raw swing video files | Future local browser storage or in-memory session state | Blocked by default |
| B | Derived frames or image pixels | Volatile in-memory processing state | Blocked by default |
| C | Pose landmarks and body keypoints | Future structured local storage | Explicit opt-in required |
| D | Computed metrics, angles, tempo, and phase labels | Future structured local storage | Explicit opt-in required |
| E | Swing Card exports and selected report files | User-initiated browser download | User controls downloaded file |
| F | Prompts, model inputs, and model outputs | Future local storage only if needed | Explicit opt-in required |
| G | Safety, educational-use, and privacy acknowledgement state | Minimal local browser scaffold state | Local only by default; not a reviewed durable privacy record |

Derived landmarks and metrics should be treated as sensitive user data. Even
without a face or background video, movement patterns, timing, body proportions,
and swing mechanics may be personal or identifying when combined with other
data.

## Local-First Processing Flow

Future video analysis should follow this default sequence:

1. The user selects or captures a swing video.
2. The app previews the video locally.
3. Frame extraction runs in browser execution context without default network
   upload.
4. Pose extraction runs locally only after model and asset rights are approved.
5. Volatile frame data is released after processing.
6. Derived landmarks and metrics are stored locally only if the feature needs a
   history or review state.
7. Reports or Swing Cards are generated locally and downloaded only after a
   user-initiated export action.
8. Optional remote model or coach review remains disabled unless the user makes
   a separate explicit opt-in decision.

Runtime implementation must fail closed. If remote sharing has not been
explicitly enabled for the specific data class and destination, the app should
block the action instead of silently sending data.

## Video Lifecycle

Future video lifecycle behavior should be documented and implemented before any
raw swing video storage ships:

- **Selection:** The app should hold only the file reference needed for the
  active local session.
- **Preview:** Any object URLs should be revoked when no longer needed.
- **Processing:** Frame buffers should remain volatile and should not be
  persisted unless a future reviewed feature requires it.
- **Analysis:** Landmarks and metrics may be persisted locally only when needed
  for review, history, or export.
- **Refresh or close:** Unsaved raw video and volatile frames should be treated
  as session state unless the user has chosen a feature that stores them.
- **Deletion:** A clear-local-data action should remove Swing Sync's app-level
  references and local browser storage for the current origin.
- **Uninstall or browser data clearing:** The browser or operating system may
  remove site data according to platform behavior and user settings.

Browser storage behavior varies by engine, device, available space, private
browsing mode, user settings, installed-PWA state, and whether storage is
best-effort or persistent. Swing Sync must not promise that local browser data
is permanent, encrypted, immune to browser eviction, or physically erased from
device storage after deletion.

## Export Policy

Manual exports should be user-initiated and data-minimized.

Default analytical exports may include:

- swing metrics;
- pose landmarks or keypoint-derived measurements;
- selected warnings or limitations;
- educational feedback text; and
- selected keyframes only if the user explicitly chooses an image export.

Default analytical exports must not include raw swing video. If a future raw
video export exists, it should be a separate explicit choice with clear copy
that the downloaded file is outside Swing Sync's local browser controls.

Exports must not be described as anonymous. Landmarks, metrics, images, and
feedback may still be sensitive or identifying.

## Optional Remote Model or Coach Sharing

Optional remote sharing is not approved yet. Before any remote model, hosted
model API, cloud storage, or coach-review feature is implemented, Swing Sync
must document:

- provider name and service terms;
- SDK source license;
- model or model-asset rights, if applicable;
- data classes transmitted;
- retention and training-use terms;
- whether human review may occur;
- destination origins;
- user opt-in and revocation UX; and
- privacy impact for raw video, frames, landmarks, metrics, prompts, and
  generated outputs.

Raw swing video and frame pixels remain blocked by default. Derived landmarks,
metrics, prompts, and reports require explicit opt-in before remote sharing.

## User-Facing Copy Drafts

First analysis privacy copy:

> Swing Sync processes swing feedback locally by default. Raw swing video stays
> on this device unless you separately choose a feature that sends it elsewhere.
> Derived landmarks, metrics, reports, or prompts may still be sensitive. Swing
> Sync is educational only and is not medical advice, diagnosis, rehabilitation,
> or professional athletic instruction.

Export copy:

> This export is generated in your browser and saved to your device. It may
> include sensitive swing metrics, landmarks, feedback, or selected images. You
> control what happens to the downloaded file after it leaves Swing Sync.

Optional remote sharing copy:

> Remote review is optional and off by default. If you enable it, Swing Sync
> will show what data is sent, where it is sent, and what provider terms apply
> before anything leaves your device.

Clear-local-data copy:

> Clearing local data removes Swing Sync's app data for this browser origin,
> including local acknowledgement state and future stored swing analysis data.
> Browser or device storage systems may retain lower-level remnants outside the
> app's control, so this is not device-level erasure.

## Future Implementation Gates

Before shipping video processing or remote analysis, add tests or verification
for:

- raw video upload blocked by default;
- frame pixels blocked from network transit;
- explicit opt-in before sharing landmarks, metrics, prompts, or reports;
- clear-local-data behavior for every storage API in use;
- private-browsing and storage-eviction copy;
- export contents and warnings;
- model SDK telemetry and destination origins; and
- CSP, service worker, and runtime network guard behavior if those controls are
  implemented.

## SS-005 MediaPipe Provider-Metrics Gate

On 2026-06-10, the maintainer provided a response attributed to Google stating
that the current Web SDK does not include telemetry, does not send input data,
and may add aggregated performance and usage telemetry in the future without a
planned opt-out. Google also stated that future outbound requests may be blocked
while continuing to use the SDK normally.

The maintainer approved exact `@mediapipe/tasks-vision@0.10.35` on 2026-06-11
as having no current provider-metrics consent requirement. This does not
approve future versions. Any SDK upgrade requires fresh privacy, terms, and
observed-network review.

SS-005 implements:

- the exact approved SDK version and public provider response in MediaPipe
  issue #6306;
- observed and attempted network requests during initialization and inference;
- whether the SDK remains functional when all external requests are blocked;
- fail-closed behavior for any unexpected external request; and
- a fresh consent/product decision before adopting any future version that
  includes provider telemetry;
- a dedicated worker for local model initialization and inference;
- volatile transferable `ImageBitmap` frames closed after inference;
- no raw-video, frame, or landmark persistence;
- same-origin WASM/model delivery without service-worker model caching;
- CSP blocking of unexpected external connections; and
- visible sanitized local error codes when initialization, inference, worker,
  or unexpected-network failures stop a session.

Observability is intentionally limited to local UI state and sanitized stable
error codes. Raw frames, landmarks, media characteristics, and user identifiers
must not be written to console output, logs, storage, or remote systems.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 21 Complete current file: docs/privacy-architecture.md -->

### 22 Complete current file: docs/safety-terms.md

Lines: 117  
Bytes: 5514  
SHA-256: `757c740e6908ebb9aa19e3e057d31c83a098d34aeb265338be4c0ee5a381e39f`

<!-- BEGIN EXACT BLOCK: 22 Complete current file: docs/safety-terms.md -->
````````````````````````````````````````````````
# Safety Terms and Educational Use Draft

**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

## Intended Use

Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Raw swing video must remain on the user's device by default. Any future remote
model, cloud storage, or coach-review feature must require a separate opt-in
flow before raw swing video leaves the device.

## Assumption of Risk Draft

Golf practice, swing changes, exercise, and physical movement involve risk.
Those risks may include soreness, strain, falls, impact injuries, equipment
injuries, aggravation of an existing condition, or other injury. Users should
practice in a safe location, warm up appropriately, stop if they feel pain,
dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
professional before changing activity if they have health, mobility, or injury
concerns.

By using Swing Sync for analysis, the user acknowledges that golf practice and
movement changes are voluntary activities and that they are responsible for
deciding whether to participate, how intensely to practice, and whether to seek
professional medical, fitness, or coaching guidance.

## Release of Liability Draft

To the maximum extent permitted by applicable law, the user agrees that Swing
Sync, its maintainers, contributors, and distributors are not responsible for
injury, loss, or damage arising from the user's practice, swing changes,
equipment use, training decisions, or reliance on educational feedback provided
by the app.

This draft release should not be read as waiving rights that cannot legally be
waived. It is intended as review-ready product language and must be evaluated
for the jurisdictions and release context where Swing Sync is offered.

## Educational Feedback Boundary

User-facing copy and AI coaching output must:

- describe feedback as educational information only;
- avoid presenting feedback as medical advice, pain diagnosis, rehabilitation,
  physical therapy, or professional athletic instruction;
- avoid guarantees of injury prevention, performance improvement, or swing
  correctness;
- encourage users to stop activity if pain or concerning symptoms occur; and
- direct users with pain, injury, medical conditions, or safety concerns to a
  qualified medical professional or qualified golf coach as appropriate.

## Consent Gate Requirement

Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.

The consent gate must be accessible and usable. It should not depend on rigid
scroll-completion mechanics as the only evidence of review unless legal/human
review specifically approves that interaction.

## AI Coach Prompt Constraints

Future AI coach prompts and system instructions must include constraints that:

- prohibit diagnosing pain, injuries, medical conditions, mobility limits, or
  causes of symptoms;
- prohibit medical triage, rehabilitation plans, therapy exercises, or
  treatment instructions;
- prohibit aggressive mechanical prescriptions such as forcing range of motion,
  training through pain, or making abrupt high-load changes;
- frame suggestions as optional, low-intensity, educational observations;
- recommend stopping activity when pain, numbness, dizziness, weakness, or
  unusual discomfort is present;
- recommend qualified medical review for pain, injury, or health concerns; and
- recommend qualified coaching review for sport-specific instruction beyond
  general educational feedback.

Automated guardrails, keyword filters, system prompts, or output checks should
be treated as defense-in-depth controls. They do not guarantee that all unsafe
or adversarial requests will be caught, especially in client-side or local-first
execution contexts.

## Review Checklist

- [ ] Legal/human reviewer approved assumption-of-risk language.
- [ ] Legal/human reviewer approved release-of-liability language.
- [ ] Consent gate blocks first analysis before acknowledgement.
- [ ] Consent gate does not upload raw swing video or consent records by
      default.
- [ ] AI coaching prompt constraints reject pain diagnosis and rehabilitation
      advice.
- [ ] AI coaching prompt constraints reject unsafe or aggressive movement
      prescriptions.
- [ ] Gemini research disposition reviewed and accepted, revised, deferred, or
      rejected for each major recommendation.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 22 Complete current file: docs/safety-terms.md -->

### 23 Complete current file: docs/licensing.md

Lines: 167  
Bytes: 6882  
SHA-256: `6083f25daef2aef4a688b375c3f53b6171050f7d6cb6e4e10e370a1ea81d26a5`

<!-- BEGIN EXACT BLOCK: 23 Complete current file: docs/licensing.md -->
````````````````````````````````````````````````
# Swing Sync Licensing and Dependency Policy

Swing Sync uses Apache-2.0 for project source code. This document records the
engineering compliance policy for dependencies, reference repositories, SBOMs,
and notices. It is not legal advice.

## Human License Decision

Apache-2.0 is the approved project license for SS-001 implementation. The
decision was made by the project maintainer, Jason Alvarez, after Claude QA gave
SS-001 a PASS on 2026-06-04.

## License Sets

Allowed in production bundles:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- CC0-1.0
- 0BSD

Blocked in production bundles:

- GPL-2.0-only / GPL-2.0-or-later
- GPL-3.0-only / GPL-3.0-or-later
- AGPL-3.0-only / AGPL-3.0-or-later
- LGPL-2.1-only / LGPL-2.1-or-later
- LGPL-3.0-only / LGPL-3.0-or-later
- unlicensed packages
- unknown, custom, or non-SPDX license identifiers
- proprietary packages without written permission or contract

Exception-required:

- MPL-2.0
- dual-license expressions that cannot be parsed cleanly by automation
- model weights, model assets, or SDKs with terms separate from source licenses

## MPL-2.0 Rule

MPL-2.0 is blocked from production bundles by default. An exception may be
approved only when `docs/licensing.md` records all of the following:

- package name and version;
- why the package is needed;
- evidence that the package is architecturally isolated or otherwise compliant;
- whether the package includes a secondary-license incompatibility notice;
- maintainer approval and approval date; and
- the exact CI allowlist/config exception.

No MPL-2.0 exceptions are currently approved.

## Synthetic Fixture Note

The synthetic packages in `test/fixtures/` intentionally omit `private: true`
because `@onebeyond/license-checker` reports private packages as `UNLICENSED`
instead of reading their SPDX `license` field. They are scoped under
`@swing-sync-test/`, are not referenced by publishing automation, and exist only
to validate compliance gates.

## Dual-License Rule

When a dependency is dual-licensed with only permissive options, such as
`MIT OR Apache-2.0`, Swing Sync may use the dependency without a special
exception if every branch is in the allowed set.

When a dual-license expression contains any blocked or exception-required
identifier, such as `GPL-3.0-only OR MIT` or `MPL-2.0 OR Apache-2.0`, automation
must fail the dependency until a maintainer records a documented exception here.
Swing Sync does not silently elect a permissive branch when the same expression
also contains GPL, AGPL, LGPL, MPL-2.0, unknown, custom, or non-SPDX terms.

## Dev-Only Tool Boundary

Dev-only copyleft tools may be considered only if they are not bundled, served,
linked into the application, required at runtime, or used to generate source,
code, model assets, or other files incorporated into the production output.

AGPL dependencies are blocked entirely until a maintainer explicitly approves a
documented exception.

## Reference Repository Reuse

Clean-room reimplementation is the default for reference repositories.

For unlicensed or copyleft references:

- do not copy, fork, port, or adapt code;
- do not copy model weights or datasets without explicit permission;
- high-level concepts may be summarized in a non-code functional specification;
- implementation must be written independently from that specification.

For MIT, Apache-2.0, BSD, ISC, CC0-1.0, or 0BSD references:

- clean-room reimplementation is preferred;
- derivative reuse requires explicit maintainer review in the pull request;
- the PR must identify source URL, file path, and license;
- original copyright/license notices must be preserved when required; and
- `THIRD_PARTY_NOTICES.md` must be updated.

## Reference Catalog

| Repository | License Status | Policy |
| --- | --- | --- |
| `HeleenaRobert/golf-swing-analysis` | MIT at time of SS-001 research | Clean-room preferred; derivative reuse requires notice preservation. |
| `damilab/CaddieSet` | MIT at time of SS-001 research | Cite paper/dataset; runtime code reuse requires notice preservation. |
| `tlouth19/analyze.golf` | No visible license during SS-001 research | Clean-room only; do not copy or adapt code. |
| `ryanboscobanze/GolfPosePro` | MIT at time of SS-001 research | Clean-room preferred; verify notebook/media provenance before reuse. |
| `MingHanLee/GolfPose` | No visible license during SS-001 research | Clean-room only; do not copy code or model weights. |

## SBOM Policy

`docs/sbom.json` is the CycloneDX dependency inventory generated from the npm
dependency graph. It is not proof that the built browser bundle is license-clean.
Bundle compliance is checked separately through a Vite/Rollup license gate that
must be validated against a synthetic prohibited package fixture installed as a
local dev package.

The current scaffold has no production runtime dependencies, so
`docs/sbom.json` may contain an empty `components` array after
`scripts/filter-sbom.js` removes dev-only and extraneous packages from the
CycloneDX generator output. Once runtime dependencies are added, production
components must appear in the SBOM and dev-only packages must remain absent.

The SBOM is stored in `docs/` and may also be attached to GitHub releases. It is
not served from `public/` by default.

## Apache NOTICE Obligations

Apache-2.0 dependencies may include upstream `NOTICE` files that must be
preserved. `scripts/aggregate-notices.js` must source NOTICE files from the
production-resolved dependency graph only, using one of:

- `npm ls --omit=dev --json`;
- `docs/sbom.json`; or
- a lockfile-derived production dependency graph.

The script must not crawl all of `node_modules` indiscriminately.

## Model and SDK Policy

See `docs/models-licensing.md`. No model binaries or model weights may be
committed, vendored, served, or fetched until per-model rights are documented.

Optional model API SDKs require two independent approvals:

- the SDK source license must satisfy this policy; and
- provider service terms must permit Swing Sync's intended local-first,
  opt-in data sharing behavior.

For SS-005, exact `@mediapipe/tasks-vision@0.10.35` is an approved pinned
production dependency. Google has stated that current Web SDKs are Apache-2.0
and that the current Web SDK does not include telemetry.
The inspected exact package contains compiled WASM and does not package LICENSE
or NOTICE files. On 2026-06-11, the maintainer approved reliance on Google's
SDK-wide license statement for packaged compiled artifacts and the plan to
distribute Apache-2.0 license text plus third-party attribution.
Any later SDK version requires a fresh license, privacy, provider-metrics, and
network review. See `docs/ss-005-google-provider-response.md`.

## Trademark Timing

The name "Swing Sync" requires a preliminary trademark search before the
repository is made broadly public or promoted.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 23 Complete current file: docs/licensing.md -->

### 24 Complete current file: docs/models-licensing.md

Lines: 56  
Bytes: 2449  
SHA-256: `749b529d0139c82cafde7d4ac44e199245f99b7c5b7fa82bdf67770b58d7a4a0`

<!-- BEGIN EXACT BLOCK: 24 Complete current file: docs/models-licensing.md -->
````````````````````````````````````````````````
# Model Licensing Policy

Swing Sync has approved one exact model and delivery decision for SS-005.

## Current Rule

Do not commit, vendor, serve, cache, or fetch model assets such as `.tflite`,
`.onnx`, WASM weights, or comparable model files until the project documents:

- model name and version;
- source URL;
- model card or license terms;
- redistribution and caching rights;
- commercial-use restrictions, if any;
- required citations or attribution; and
- privacy impact for any remote fetch or API call.

## SS-005 Approved MediaPipe Assets

The following exact assets were reviewed, approved, and added for SS-005:

- SDK candidate: exact `@mediapipe/tasks-vision@0.10.35`.
- Model candidate: Pose Landmarker Full, float16, version 1,
  `pose_landmarker_full.task`.

On 2026-06-10, the maintainer provided a response attributed to Google stating:

- the current Web SDK does not include telemetry;
- future aggregated performance/usage telemetry is planned, without a planned
  opt-out, although outbound requests may be blocked;
- the exact Pose Landmarker Full float16 version 1 URL is Apache-2.0; and
- current Web SDKs are Apache-2.0, with future npm packages expected to include
  NOTICE and LICENSE files.

The maintainer approved reliance on the Apache-2.0 model statement in public
MediaPipe issue #6306 on 2026-06-11. It supports commercial use,
redistribution, same-origin serving, and caching of the exact model. The
preferred SS-005 delivery is vendoring and same-origin serving of the exact
asset with a pinned SHA-256, source URL, license text, and attribution. Runtime
provider fetch is not approved. Service-worker caching remains separately
reviewed.

Claude returned implementation-start PASS on 2026-06-11. The exact dependency,
packaged WASM runtime, and exact model are vendored and served same-origin.
`scripts/verify-pose-assets.js` enforces their approved SHA-256 values.
`docs/model-assets/pose-landmarker-full-float16-v1.md` records the exact model
source and decision. Service-worker model caching remains unapproved and is not
implemented. Do not claim tests prove all future SDK versions lack telemetry.

See `docs/ss-005-google-provider-response.md` and
`docs/ss-005-research-disposition.md` for the complete decision record.

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 24 Complete current file: docs/models-licensing.md -->

### 25 Complete current file: src/app-accessibility.ts

Lines: 114  
Bytes: 4124  
SHA-256: `27fe1dfbce26be37a70aedffd3e306e454dec6730743f9d2ec6469ead662d45d`

<!-- BEGIN EXACT BLOCK: 25 Complete current file: src/app-accessibility.ts -->
````````````````````````````````````````````````
import type { WorkflowStepId } from "./workflow";

const staticFocusKeys = [
  "safety-consent",
  "camera-placeholder",
  "video-picker",
  "analysis-start",
  "stage-heading",
  "workflow-next",
  "stop-analysis",
  "retry-analysis",
  "review-phases",
  "phase-declaration:view",
  "phase-declaration:handedness",
  "phase-declaration:mirrored",
  "phase-setup",
  "phase-confirmation",
  "phase-confirm",
  "open-export",
  "phase-review-heading",
  "swing-card-heading",
  "swing-card-download",
  "swing-card-print",
  "swing-card-copy",
  "swing-card-status"
] as const;

type StaticFocusKey = (typeof staticFocusKeys)[number];
type DynamicFocusKey =
  | `workflow-step:${WorkflowStepId}`
  | `phase-assignment:${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`
  | `keyframe:${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`;

export type FocusKey = StaticFocusKey | DynamicFocusKey;

export interface AccessibilityIntent {
  focusKey?: FocusKey;
  announcement?: string;
}

export interface RenderRequest extends AccessibilityIntent {
  visibleStatusText?: string;
}

export function isFocusKey(value: unknown): value is FocusKey {
  if (typeof value !== "string") return false;
  if ((staticFocusKeys as readonly string[]).includes(value)) return true;
  if (/^workflow-step:(capture|processing|review|export)$/.test(value)) return true;
  return /^(phase-assignment|keyframe):[0-7]$/.test(value);
}

export function capturePriorFocusKey(root: ParentNode, activeElement: Element | null = document.activeElement): FocusKey | undefined {
  if (!activeElement || !root.contains(activeElement)) return undefined;
  const value = activeElement.getAttribute("data-focus-key");
  return isFocusKey(value) ? value : undefined;
}

export function findFocusTarget(root: ParentNode, key: FocusKey | undefined): HTMLElement | undefined {
  if (!key || !isFocusKey(key)) return undefined;
  const target = [...root.querySelectorAll<HTMLElement>("[data-focus-key]")].find(
    (element) => element.getAttribute("data-focus-key") === key
  );
  return target && isEligibleFocusTarget(target) ? target : undefined;
}

export function isEligibleFocusTarget(target: HTMLElement): boolean {
  if (!target.isConnected || target.hidden || target.getAttribute("aria-hidden") === "true") return false;
  if (target.tabIndex > 0 || "disabled" in target && Boolean((target as HTMLButtonElement).disabled)) return false;
  if (target.closest("[hidden], [inert], [aria-hidden='true']")) return false;
  const view = target.ownerDocument.defaultView;
  if (view) {
    const style = view.getComputedStyle(target);
    if (style.display === "none" || style.visibility === "hidden") return false;
  }
  return true;
}

export function viewFallbackKey(view: WorkflowStepId, hasPhaseOutputs: boolean): FocusKey {
  if (view === "review" && hasPhaseOutputs) return "phase-review-heading";
  if (view === "export" && hasPhaseOutputs) return "swing-card-heading";
  return "stage-heading";
}

function focusOnce(target: HTMLElement | undefined): void {
  if (target && target.ownerDocument.activeElement !== target) target.focus();
}

function announce(announcer: HTMLElement | null, message: string | undefined): void {
  if (announcer && message !== undefined) announcer.textContent = message;
}

export function applyPostRenderAccessibility(
  root: ParentNode,
  announcer: HTMLElement | null,
  view: WorkflowStepId,
  hasPhaseOutputs: boolean,
  intent: AccessibilityIntent = {},
  priorFocusKey?: FocusKey
): void {
  const explicit = isFocusKey(intent.focusKey) ? findFocusTarget(root, intent.focusKey) : undefined;
  const prior = explicit ? undefined : findFocusTarget(root, priorFocusKey);
  const fallback = explicit || prior ? undefined : findFocusTarget(root, viewFallbackKey(view, hasPhaseOutputs));
  focusOnce(explicit ?? prior ?? fallback);
  announce(announcer, intent.announcement);
}

export function applyAccessibilityIntent(
  root: ParentNode,
  announcer: HTMLElement | null,
  intent: AccessibilityIntent
): void {
  focusOnce(isFocusKey(intent.focusKey) ? findFocusTarget(root, intent.focusKey) : undefined);
  announce(announcer, intent.announcement);
}

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 25 Complete current file: src/app-accessibility.ts -->

### 26 Complete current file: test/unit/accessibility-contrast.test.ts

Lines: 35  
Bytes: 2031  
SHA-256: `cad2cb85b5c15fb9326b3639184436f79a1c32b062c8df6b3d2a818bb1b6c681`

<!-- BEGIN EXACT BLOCK: 26 Complete current file: test/unit/accessibility-contrast.test.ts -->
````````````````````````````````````````````````
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function luminance(hex: string): number {
  const values = hex.slice(1).match(/.{2}/g)!.map((item) => Number.parseInt(item, 16) / 255);
  const linear = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function ratio(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe("approved accessibility contrast tokens", () => {
  it("keeps exact token values and every enumerated surface above 3 to 1", () => {
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/--focus-inner:\s*#ffffff/);
    expect(css).toMatch(/--focus-outer:\s*#17211b/);
    expect(css).toMatch(/--interactive-boundary:\s*#607367/);
    expect(css).toMatch(/\.secondary-action\s*\{[^}]*border:\s*1px solid var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.source-option,\s*\.step-button,\s*\.keyframe-button\s*\{[^}]*border-color:\s*var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.phase-declarations select,\s*\.phase-assignment select\s*\{[^}]*border:\s*1px solid var\(--interactive-boundary\)/s);
    expect(css).toMatch(/\.primary-action\s*\{[^}]*color:\s*#ffffff;[^}]*background:\s*#245b3b/s);
    const pairs = [
      ["#17211b", "#ffffff"], ["#17211b", "#f3f5f1"], ["#17211b", "#f8faf7"],
      ["#17211b", "#e7f0e9"], ["#17211b", "#eaf3ec"], ["#ffffff", "#17211b"],
      ["#ffffff", "#245b3b"], ["#607367", "#ffffff"], ["#607367", "#f3f5f1"],
      ["#607367", "#f8faf7"], ["#607367", "#e7f0e9"], ["#607367", "#eaf3ec"]
    ];
    for (const [foreground, background] of pairs) expect(ratio(foreground, background)).toBeGreaterThanOrEqual(3);
    expect(css).not.toContain("forced-color-adjust: none");
    expect(css).toContain("@media (forced-colors: active)");
  });
});

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 26 Complete current file: test/unit/accessibility-contrast.test.ts -->

### 27 Complete current file: test/unit/app-accessibility.test.ts

Lines: 123  
Bytes: 5948  
SHA-256: `a77d8d55d0a6e7301198eb76f14d3022b2bbe329f63c121375a690c45d3ffa0f`

<!-- BEGIN EXACT BLOCK: 27 Complete current file: test/unit/app-accessibility.test.ts -->
````````````````````````````````````````````````
import { describe, expect, it, vi } from "vitest";
import {
  applyAccessibilityIntent,
  applyPostRenderAccessibility,
  findFocusTarget,
  isFocusKey,
  viewFallbackKey
} from "../../src/app-accessibility";

class FakeDocument {
  activeElement: FakeElement | null = null;
  defaultView = { getComputedStyle: (element: FakeElement) => ({ display: element.display, visibility: element.visibility }) };
}

class FakeElement {
  isConnected = true;
  hidden = false;
  disabled = false;
  hiddenAncestor = false;
  inertAncestor = false;
  ariaHidden = false;
  tabIndex = 0;
  display = "block";
  visibility = "visible";
  textContent = "";
  focus = vi.fn(() => { this.ownerDocument.activeElement = this; });
  constructor(readonly ownerDocument: FakeDocument, readonly key?: string) {}
  getAttribute(name: string): string | null {
    if (name === "data-focus-key") return this.key ?? null;
    if (name === "aria-hidden") return this.ariaHidden ? "true" : null;
    return null;
  }
  closest(): FakeElement | null { return this.hiddenAncestor || this.inertAncestor ? this : null; }
}

class FakeRoot {
  constructor(readonly elements: FakeElement[]) {}
  contains(element: FakeElement): boolean { return this.elements.includes(element); }
  querySelectorAll(): FakeElement[] { return this.elements; }
}

function fixture(...keys: string[]) {
  const document = new FakeDocument();
  const elements = keys.map((key) => new FakeElement(document, key));
  return { document, elements, root: new FakeRoot(elements) };
}

describe("app accessibility", () => {
  it("accepts only known data-focus-key values and rejects arbitrary selector strings", () => {
    for (const key of ["safety-consent", "workflow-step:review", "phase-assignment:7", "keyframe:0"]) expect(isFocusKey(key)).toBe(true);
    for (const key of ["#safety-consent", "[data-focus-key]", "workflow-step:settings", "phase-assignment:8", "keyframe:1.5"]) expect(isFocusKey(key)).toBe(false);
  });

  it("uses exact bounded dynamic-key rejection and exact per-view fallbacks", () => {
    expect(viewFallbackKey("capture", false)).toBe("stage-heading");
    expect(viewFallbackKey("processing", true)).toBe("stage-heading");
    expect(viewFallbackKey("review", true)).toBe("phase-review-heading");
    expect(viewFallbackKey("review", false)).toBe("stage-heading");
    expect(viewFallbackKey("export", true)).toBe("swing-card-heading");
    expect(viewFallbackKey("export", false)).toBe("stage-heading");
  });

  it("gives explicit focus precedence over prior and fallback targets", () => {
    const { root, elements } = fixture("stage-heading", "video-picker", "safety-consent");
    applyPostRenderAccessibility(root as never, null, "capture", false, { focusKey: "video-picker" }, "safety-consent");
    expect(elements[1].focus).toHaveBeenCalledOnce();
    expect(elements[0].focus).not.toHaveBeenCalled();
    expect(elements[2].focus).not.toHaveBeenCalled();
  });

  it("restores previous known focus and otherwise uses a visible enabled fallback", () => {
    const { root, elements } = fixture("stage-heading", "safety-consent");
    applyPostRenderAccessibility(root as never, null, "capture", false, {}, "safety-consent");
    expect(elements[1].focus).toHaveBeenCalledOnce();
    elements[1].disabled = true;
    applyPostRenderAccessibility(root as never, null, "capture", false);
    expect(elements[0].focus).toHaveBeenCalledOnce();
  });

  it("rejects hidden disconnected disabled aria-hidden inert hidden-ancestor invisible and positive-tabindex targets", () => {
    for (const state of ["hidden", "disconnected", "disabled", "aria-hidden", "inert", "ancestor", "display", "visibility", "positive"]) {
      const { root, elements } = fixture("video-picker");
      const target = elements[0];
      if (state === "hidden") target.hidden = true;
      if (state === "disconnected") target.isConnected = false;
      if (state === "disabled") target.disabled = true;
      if (state === "aria-hidden") target.ariaHidden = true;
      if (state === "inert") target.inertAncestor = true;
      if (state === "ancestor") target.hiddenAncestor = true;
      if (state === "display") target.display = "none";
      if (state === "visibility") target.visibility = "hidden";
      if (state === "positive") target.tabIndex = 1;
      expect(findFocusTarget(root as never, "video-picker")).toBeUndefined();
    }
  });

  it("allows tabindex -1 programmatic targets and safely no-ops without a target", () => {
    const { root, elements } = fixture("stage-heading");
    elements[0].tabIndex = -1;
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledOnce();
    expect(() => applyAccessibilityIntent(new FakeRoot([]) as never, null, { focusKey: "stage-heading" })).not.toThrow();
  });

  it("updates the stable announcer through textContent and not when announcement is absent", () => {
    const announcer = { textContent: "Existing" } as HTMLElement;
    const root = new FakeRoot([]);
    applyAccessibilityIntent(root as never, announcer, { announcement: "Ready <strong>now</strong>" });
    expect(announcer.textContent).toBe("Ready <strong>now</strong>");
    applyAccessibilityIntent(root as never, announcer, {});
    expect(announcer.textContent).toBe("Ready <strong>now</strong>");
  });

  it("keeps retry and terminal focus idempotent with and without intervening user focus", () => {
    const { document, root, elements } = fixture("stage-heading", "retry-analysis");
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledOnce();
    document.activeElement = elements[1];
    applyAccessibilityIntent(root as never, null, { focusKey: "stage-heading" });
    expect(elements[0].focus).toHaveBeenCalledTimes(2);
  });
});

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 27 Complete current file: test/unit/app-accessibility.test.ts -->

### 28 Complete current file: test/unit/keyframe-overlay-renderer.test.ts

Lines: 32  
Bytes: 1448  
SHA-256: `e97fbb2e8821061906f7ec42a7c83102c85f079590ed45952f75569aa2bd2421`

<!-- BEGIN EXACT BLOCK: 28 Complete current file: test/unit/keyframe-overlay-renderer.test.ts -->
````````````````````````````````````````````````
import { describe, expect, it, vi } from "vitest";
import { createInitialAppState } from "../../src/app-state";
import { renderSelectedKeyframeCanvas } from "../../src/keyframe-overlay-renderer";
import type { SampledFrameOutput } from "../../src/frame-processing";

describe("keyframe overlay announcement ownership", () => {
  it("keeps unrelated full-render canvas redraw silent and lets bounded keyframe intent own scoped status", () => {
    const state = createInitialAppState();
    state.phaseOutputs = [{ preview: {}, pose: { landmarks: [[]] } }] as unknown as SampledFrameOutput[];
    const status = { textContent: "Existing status." };
    const canvas = {};
    const root = {
      querySelector: (selector: string) => selector === "[data-keyframe-canvas]" ? canvas : status
    };
    const renderFrame = vi.fn(() => ({
      status: "partial" as const,
      renderedSegments: 1,
      skippedSegments: 1,
      warnings: [],
      width: 320,
      height: 180
    }));

    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, false, renderFrame);
    expect(status.textContent).toBe("Existing status.");
    expect(state.latestOverlayResult?.status).toBe("partial");

    renderSelectedKeyframeCanvas(root as unknown as ParentNode, state, true, renderFrame);
    expect(status.textContent).toBe("Skeleton overlay partially available for this keyframe.");
    expect(renderFrame).toHaveBeenCalledTimes(2);
  });
});

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 28 Complete current file: test/unit/keyframe-overlay-renderer.test.ts -->

### 29 Complete current file: docs/ss-019-manual-accessibility-qa.md

Lines: 98  
Bytes: 11606  
SHA-256: `506d5302d386f8124c7bf0371df37ea78f9ef03485ce7c24bd542037044632b8`

<!-- BEGIN EXACT BLOCK: 29 Complete current file: docs/ss-019-manual-accessibility-qa.md -->
````````````````````````````````````````````````
# SS-019 Manual Accessibility QA Record

Date prepared: 2026-07-21

Status: Manual execution pending. This document records automated evidence,
the required manual scenarios, and residual risk. It is not a conformance
statement.

## Build under review

- Repository base SHA: `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.
- Implementation state: uncommitted SS-019 working tree on
  `ss-019-accessibility-design-hardening`; no implementation commit SHA exists
  yet. Replace this line with the tested implementation SHA before final audit.
- Automated environment: Node `v22.22.3`, npm `10.9.8`.
- Automated commands actually completed:
  - Full unit: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit'`
    — PASS, 24 files and 217 tests.
  - Full browser smoke: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'`
    — PASS, 48 tests across desktop and mobile Chromium projects.
  - Build: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'`
    — PASS, 26 modules transformed; third-party notices generated.
  - `npm run compliance:verify` — PASS.
  - `npm run safety:verify` — PASS.
  - `npm run privacy:verify` — PASS.
  - `npm run docs:verify` — PASS.
  - `git diff --check` — PASS.

The 320 CSS-pixel automated path first verifies geometry in a real
`LOCAL_MODEL_INIT_FAILED` state, then reloads into a clean lifecycle and runs a
successful review, confirmation, and export path. Retry recovery is covered by
a separate passing smoke test. Neither automated path is manual AT evidence.

## Manual environment fields

No manual browser or assistive-technology run has been executed. For every
future run, record all fields below rather than inferring a PASS from automated
tests.

| Field | Current value |
| --- | --- |
| Tested implementation commit SHA | Unavailable; implementation is uncommitted |
| Date | Not run |
| OS and version | Not run / not recorded |
| Browser and version | Not run / not recorded |
| Viewport or physical device | Not run |
| Zoom | Not run |
| Text-spacing override | Not run |
| Input method | Playwright keyboard/mouse emulation completed; no manual input run |
| Assistive technology and version | VoiceOver unavailable/not run; NVDA unavailable/not run |
| Evidence reference | Full unit, smoke, build, and verifier output summarized above; no manual screenshot, recording, or observation |

## Scenario ledger

“Pending” means the expected behavior is implemented and may have automated
coverage, but a human has not verified it in the stated browser/AT setup.

| Workflow step / scenario | Expected result | Actual result and evidence | Residual risk / affected user / impact / workaround | Disposition |
| --- | --- | --- | --- | --- |
| Complete keyboard traversal: capture, consent, native picker, processing, review, confirmation, export, and Swing Card actions | Logical order, no keyboard trap, focus follows the approved target matrix | Pending manual. The full desktop/mobile Chromium smoke keyboard and Swing Card action path passed; bounded focus and event unit tests passed | Browser-native chooser and rerender timing can differ; keyboard and switch users; high impact; use visible controls and retry focus manually | Verify before sign-off |
| Visible two-layer focus on links, buttons, inputs, selects, and programmatic headings/status | White 2px inner outline at 2px offset plus dark outer ring; no obscured target | Pending manual. Exact tokens, geometry source, and contrast matrix have unit coverage | OS/browser rendering and clipping remain unobserved; keyboard users; medium-high impact | Verify before sign-off |
| VoiceOver announcements and landmarks | One main landmark; polite global/scoped ownership; no duplicate or missing announcements | Unavailable/not run. No VoiceOver version or browser combination was tested | Announcement timing varies by Safari/VoiceOver; screen-reader users; high impact; visible status remains available | Required manual run |
| NVDA announcements and landmarks | Same ownership and meaningful headings/groups in a supported Windows browser | Unavailable/not run. No Windows/NVDA environment was available | NVDA/browser combinations may expose different names or timing; screen-reader users; high impact | Required when environment is available |
| Consent guard and consent state change | Global announcer speaks once; visible `#app-visible-status` is accurate and non-live; focus returns to consent | Pending manual. Typed event and renderer ownership unit coverage passed | Storage failure and rapid toggles may change perceived timing; screen-reader users; medium impact | Verify before sign-off |
| Processing loading, progress, completion, failure, stop, and retry | `#processing-status` is the only scoped processing live region; numeric ticks do not chatter; terminal focus is current-token-only; stop uses the global owner once | Pending manual. Lifecycle partial-update, stale-token, stop, retry, and idempotency unit tests passed | Real worker timing and AT speech queue behavior remain untested; screen-reader and cognitive users; high impact | Verify before sign-off |
| Phase validation and confirmation | Global announcement occurs only when semantic key changes among `unsupported-input`, `review-required`, and `confirmed`; same-state rerenders are silent | Pending manual. Typed semantic-key implementation and event inventory are automated | A user may miss a repeated unchanged warning after moving elsewhere; visible `#phase-review-status` remains available | Adopt; verify timing |
| Duplicate announcements: consent, terminal completed/failed, phase validation/confirmation, download, print, copy | Exactly one declared live owner per event | Pending manual. Announcement inventory and typed action requests passed unit tests | AT may repeat names/status due to browser heuristics even with one DOM owner; screen-reader users; medium-high impact | Verify before sign-off |
| Native chooser cancel and focus return in each browser/AT | Cancel returns to visible `Choose a video`; hidden input focus redirects; successful selection returns to picker | Pending manual. Named success, cancel, and defensive-focus unit/smoke coverage is present | Native chooser cancel events and focus behavior vary by browser/OS; keyboard users; high impact | Required per tested browser |
| Disabled Begin, review/confirm, export, remote review, and busy Swing Card controls in browse mode | Each exposes its exact unique visible `aria-describedby` prerequisite/status | Pending manual. Renderer relationships are asserted in unit tests | Disabled-control descriptions are announced inconsistently across AT browse modes; screen-reader users; high impact | Required VoiceOver/NVDA check |
| Named structures: Local video source, Local pose processing, Review placeholder, Swing Card contents, Swing phase assignments, Select keyframe | Each generic container exposes its approved group name | Pending manual. Exhaustive labelled-generic inventory and renderer assertions passed | Role/name presentation varies by AT navigation mode; screen-reader users; medium impact | Verify before sign-off |
| Swing Card unavailable section and Remote model data disclosure | Labelled section is named by `Swing Card unavailable`; remote wrapper is a group and nested `.remote-model-disclosure` remains a native `dl` | Pending manual. Exact semantics and protected selector assertions passed | Nested group/list verbosity is browser/AT-dependent; screen-reader users; medium impact | Verify before sign-off |
| Annotated canvas | Canvas exposes its protected image name and scoped overlay description | Pending manual. Role/name/description relationships are automated | Pose geometry has no complete nonvisual equivalent; blind users; high impact; use textual phase/status information only | Defer complete equivalence; document limitation |
| 200% and 400% zoom or equivalent 320 CSS-pixel reflow | No page-level two-dimensional scroll, clipping, overlap, or unusable required control | Pending manual zoom verification. Automated 320px long-text, real-failure, and clean successful review, confirmation, and export geometry checks passed | Font metrics, browser zoom, and localization-like expansion remain unobserved; low-vision users; high impact | Required manual run |
| WCAG text-spacing override | Content and controls reflow without loss or overlap | Unavailable/not run | Custom text spacing can expose fixed-height issues; low-vision/dyslexic users; high impact | Required manual run |
| Forced colors/high contrast | System focus and semantic boundaries remain visible; no `forced-color-adjust: none` | Pending physical Windows High Contrast verification. Playwright forced-colors emulation and CSS checks passed | Emulation is not equivalent to Windows High Contrast on a physical system; low-vision users; high impact | Required when supported |
| Exact contrast surfaces and 44px scoped targets | All twelve approved token/surface pairs remain at least 3:1; practical interactive controls are at least 44 by 44 CSS pixels | Pending manual measurement. Exact token matrix passed unit computation | Device scaling and native form-control metrics may vary; motor/low-vision users; medium-high impact | Verify representative browsers |
| Long consent/status/error/prerequisite text and failed-processing distinctions | Text wraps; failure remains readable and distinguishable without color alone | Pending manual inspection. Automated 320px wrapping, failure, prerequisite, review, and export assertions passed | Extremely long translated/error strings were not manually inspected; cognitive/low-vision users; medium impact | Verify before sign-off |
| Desktop and actual mobile interaction | Desktop and physical mobile show no clipping/overlap and preserve focus/touch usability | Unavailable/not run on a physical mobile device; no desktop manual observation recorded | Mobile browser chrome, virtual keyboard, and touch target behavior remain unknown; mobile users; high impact | Required representative device run |
| Swing Card export panel, print preview, local download, and copy statuses | On-screen panel is readable; print/download/copy report accurate local status and restore initiating focus | Pending manual. Typed action focus/announcement tests passed; print preview and generated file were not manually inspected | Print drivers, download UI, clipboard permissions, and long export content vary; keyboard/screen-reader users; medium-high impact | Verify before sign-off |

## Approved non-blocking implementation notes

1. Awaited close preserves the old rendered view while controller cleanup is
   pending. Navigation and replacement-video callers render the destination
   exactly once only after cleanup settles. This prevents a premature render
   and stale callback mutation, but a slow cleanup can leave the old view
   visible briefly; manual testing should confirm the interval is understandable.
2. Phase announcements are intentionally keyed to semantic transitions, not
   every rerender. Repeated `unsupported-input`, `review-required`, or
   `confirmed` states remain silent to prevent chatter; the current visible
   warning remains available for review.

## Scope statement

SS-019 does not establish WCAG certification, legal compliance, universal
assistive-technology compatibility, or complete nonvisual equivalence. No
manual scenario may be marked PASS until its environment, expected and actual
result, evidence reference, and any defect or residual risk are recorded.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 29 Complete current file: docs/ss-019-manual-accessibility-qa.md -->

### 30 Complete current file: docs/ss-019-preimplementation-spec.md

Lines: 742  
Bytes: 43785  
SHA-256: `3931bb6005720ddaf12672c7769abe6ac1824db1262382ecfc5a013d5d2d8b6c`

<!-- BEGIN EXACT BLOCK: 30 Complete current file: docs/ss-019-preimplementation-spec.md -->
````````````````````````````````````````````````
# SS-019 Preimplementation Specification

Date: 2026-07-20

Status: Revised after the second Claude QA-planning FAIL. B2, B5, and B6 are
closed and regression-protected. B1, B3, B4, the lead close/token-race
precision, and accepted N1-N3 remain blocked pending focused Claude re-review.
Implementation and branch creation remain blocked until Claude returns PASS
and explicitly clears every open blocker.

Task: SS-019 Perform accessibility and responsive design hardening.

Branch after QA-planning clearance:
`ss-019-accessibility-design-hardening`, created from confirmed `main` at
`b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.

## Objective

Make the current MVP workflow a dependable keyboard, screen-reader,
manual-testing, responsive-layout, and public-demo surface without decorative
redesign or changes to product scope. Preserve the current local-first consent,
processing, phase-review, Swing Card, remote-review-unavailable, safety,
privacy, medical-scope, and non-affiliation contracts.

## Protected Baseline

- Preserve all existing protected user-facing labels, workflow copy, safety and
  privacy meaning, and smoke-test selectors unless this specification names the
  exact semantic-only addition.
- Preserve local-only raw-video/frame handling and explicit consent gating.
- Preserve remote review as unavailable; do not add remote sharing, providers,
  SDKs, model assets, cloud services, or hidden identifiers.
- Preserve app-state/exported-data contracts, service-worker behavior, CSP,
  manifest behavior, and persistence behavior.
- Add no telemetry, analytics, remote logging, cloud diagnostics, persistent
  debug artifacts, expanded console output, or runtime operator diagnostics.
- Add no dependency, framework, bundle-policy, license-policy, notice, or SBOM
  change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Approved File Scope And Ownership

### `index.html`

- Change only the `#app` host element from `<main id="app">` to
  `<div id="app"></div>` so `src/app-renderer.ts` supplies the page's one main
  landmark.
- Add a stable visually hidden sibling announcer:
  `<div id="app-announcer" class="visually-hidden" role="status"
  aria-live="polite" aria-atomic="true"></div>`.
- The announcer must remain outside the replace-on-render `#app` subtree.
- Keep the CSP meta content, manifest link, description, viewport metadata, and
  static `<title>Swing Sync | New analysis</title>` text otherwise unchanged.
  Runtime code updates it after render to exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` according to the active workflow view.

### New `src/app-accessibility.ts`

Own the DOM-only accessibility coordination contract. It must not import or
mutate app-state persistence.

- Define the exact contracts:

  ```ts
  interface AccessibilityIntent {
    focusKey?: FocusKey;
    announcement?: string;
  }

  interface RenderRequest extends AccessibilityIntent {
    visibleStatusText?: string;
  }
  ```

  A render request may contain a closed focus intent, non-live visible status
  text, and at most one global polite announcement. An absent request means an
  ordinary render with no announcement and the existing consent-derived
  visible status default.
- Own both post-render intent application and
  `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
  no-render path: it validates, focuses, or announces against the existing DOM
  only and must not replace DOM, mutate app state, rebind events, redraw the
  canvas, or touch controller-owned media.
- The closed static focus keys are exactly: `safety-consent`,
  `camera-placeholder`, `video-picker`, `analysis-start`, `stage-heading`,
  `workflow-next`, `stop-analysis`, `retry-analysis`, `review-phases`,
  `phase-declaration:view`, `phase-declaration:handedness`,
  `phase-declaration:mirrored`, `phase-setup`, `phase-confirmation`,
  `phase-confirm`, `open-export`, `phase-review-heading`,
  `swing-card-heading`, `swing-card-download`, `swing-card-print`,
  `swing-card-copy`, and `swing-card-status`.
- The only dynamic keys are exactly
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Validation must reject
  arbitrary strings, selector syntax, unknown prefixes, and out-of-range or
  non-integer indices.
- Capture the prior active element only when its `data-focus-key` passes that
  closed validator. Resolve known keys by comparing attribute values; never
  accept or persist caller-provided CSS selectors.
- Restore focus after render in this order: valid explicit target; valid prior
  target; exact per-view fallback. Capture and processing fall back to
  `stage-heading`; review falls back to `phase-review-heading` when phase
  outputs exist and otherwise `stage-heading`; export falls back to
  `swing-card-heading` when phase outputs exist and otherwise `stage-heading`.
- A target is focusable only when connected, visible, not hidden, not
  `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
  Programmatic headings/status targets may use `tabindex="-1"`; positive
  tabindex is prohibited.
- Focus application is idempotent. When the resolved target already equals
  `document.activeElement`, do not call `.focus()` again. Retry followed by a
  terminal callback without intervening user focus therefore invokes DOM focus
  once total; if the user moves focus after retry, the current terminal callback
  may focus the processing heading once.
- Update the stable `#app-announcer` using `textContent` only. All current
  announcements, including failures, use polite priority. Assertive is
  deliberately rejected because none of these events requires interruption.
- Export pure or DOM-injected seams sufficient for bounded-key, target-order,
  target-eligibility, exact fallback, text-only announcer, and no-render intent
  tests.

### `src/main.ts`

- Replace `requestRender(statusMessage?: string)` with
  `requestRender(request?: RenderRequest)` and expose/inject
  `applyAccessibilityIntent(intent: AccessibilityIntent)` alongside it.
- `requestRender` is the only full-render accessibility path.
  `applyAccessibilityIntent` delegates to the helper against the current root
  and stable announcer and must never replace DOM.
- Before replacing `#app.innerHTML`, capture the current valid focus key.
- Render the current view, bind fresh events, and redraw the selected keyframe
  canvas using the existing ownership order.
- Set `document.title` exactly to `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` for the active view without rewriting protected body
  copy.
- After render, binding, canvas redraw, and title update, restore focus using the
  request's explicit intent, then prior key, then safe current-view fallback.
- Send any explicit request announcement to the stable announcer. Do not
  announce on every full render.
- Pass `request.visibleStatusText` only to the non-live
  `#app-visible-status`. Pass `request.announcement` only to
  `#app-announcer`. An exact event message may populate both fields so the same
  information is visible and announced, but only `#app-announcer` is live.
  When `visibleStatusText` is absent, retain the current consent-derived
  visible default rather than clearing or fabricating status.
- Keep `#app` stable, keep global `beforeunload` and
  `securitypolicyviolation` listeners unchanged in behavior, and keep
  production service-worker registration unchanged.

### Announcement-Channel Invariant

Each semantic event uses exactly one announcement channel: global or scoped,
never both.

- The stable global announcer is canonical for full-render shell, workflow,
  consent, camera, video, phase-review, and Swing Card events.
- The non-live visible IDs are exactly `#app-visible-status`,
  `#phase-review-status`, `#swing-card-action-status`, and
  `#remote-model-status`. They retain state-accurate text from
  `request.visibleStatusText`, app state, or their existing renderer-owned
  paths, but have no `role="status"`, `aria-live`, or other live-region role.
- Scoped live regions exist only at `#processing-status` for in-place
  processing state and `#keyframe-overlay-status` for imperative overlay
  status. An event using either scoped channel passes no global announcement.
- The stable global live region is exactly `#app-announcer`.
- Processing/review tests must not use an unscoped status-role locator because
  the global announcer and a scoped processing status may coexist. Tests target
  the exact owning ID.
- Phase semantic state is keyed exactly as `unsupported-input`,
  `review-required`, or `confirmed`. A phase transition sends one global
  announcement only when the before/after semantic key changes. Rerenders that
  preserve the key do not announce again.
- All channels are polite. Assertive is rejected to avoid interrupting the
  current task.
- A named unit inventory test, `uses exactly one announcement channel for every
  mapped event`, must fail if a mapped callsite has both channels or no declared
  channel.

### Complete Focus And Announcement Callsite Matrix

Every current or approved `requestRender` and no-render accessibility callsite
in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` is
normative below. There may be no additional unmapped callsite or intent.

| Owner / event | Render path | Focus target | Sole announcement channel |
| --- | --- | --- | --- |
| Events: consent change | Full render | `safety-consent` | Global consent-ready/required message when meaning changes |
| Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
| Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
| Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
| Events: workflow step button | Await `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
| Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
| Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
| Events: picker `change` with a file | Await `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
| Events: picker `cancel` | No render | `video-picker` | None |
| Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
| Events: camera placeholder | Full render with typed visible text and announcement | `camera-placeholder` | Global camera-out-of-scope message |
| Events/lifecycle: Stop local analysis | Full render owned by `stopActive`, with exact typed visible text and announcement | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
| Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
| Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
| Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
| Events: handedness declaration | Full render | `phase-declaration:handedness` | None unless a new validation result requires one global message |
| Events: mirrored declaration | Full render | `phase-declaration:mirrored` | None unless a new validation result requires one global message |
| Events: setup declaration | Full render | `phase-setup` | None unless a new validation result requires one global message |
| Events: phase assignment | Full render | Exact bounded `phase-assignment:<0..7>` | None unless a new validation result requires one global message |
| Events: confirmation checkbox | Full render | `phase-confirmation` | None unless a new validation result requires one global message |
| Events: Confirm phase review | Full render | `phase-review-heading` | Global confirmation or validation-failure message |
| Events: Open Swing Card export | Full render | `swing-card-heading` | Global export-opened message |
| Events: keyframe selection | Full render and overlay redraw | Exact bounded `keyframe:<0..7>` | Scoped imperative overlay status only; no global message |
| Lifecycle: loading/processing state callback | Partial DOM update | No change | Scoped processing state only |
| Lifecycle: progress callback | Partial DOM update | No change | None when only numeric progress changes |
| Lifecycle: output callback | Partial DOM update | No change | None |
| Lifecycle: current-controller completed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: current-controller failed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: late/stale terminal callback or terminal callback outside processing view | Partial/no-op against current DOM | No change | None; no visible scoped target means no announcement |
| Lifecycle: cancelled/closed callback | Partial/no-op | No change | None; `stopActive` owns stopped status, while close and callback are silent |
| Lifecycle: `closeActive()` from workflow navigation | Cleanup and state reset only; no render | No change | None; navigation caller owns one destination render/message |
| Lifecycle: `closeActive()` from picker change | Cleanup and state reset only; no render | No change | None; picker caller owns one selection render/message |
| Lifecycle: `closeActive()` from `beforeunload` | Cleanup and state reset only; no render | No change | None |
| Swing download start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing download completion/failure | Full render | `swing-card-download` | Global result message |
| Swing print start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing print completion/failure | Full render | `swing-card-print` | Global result message |
| Swing copy start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing copy completion/failure | Full render | `swing-card-copy` | Global result message |

The inventory test must cover both runtime guard failures; consent; begin;
workflow and next-step controls; picker success/cancel/redirect; camera;
stop/retry; review; all declaration/setup/assignment/confirmation/confirm
paths; export; keyframe; every lifecycle callback; render-free `closeActive()`
for navigation, picker replacement, and `beforeunload`; and download/print/copy
start, completion, and failure. Delayed terminal callbacks and same-control
focus tests must prove an open phase select cannot lose focus to stale
processing.

### Analysis-Lifecycle Partial/Terminal Contract

- `updateProcessingProgressUi(root, state)` remains a partial renderer and may
  change only safe text and `hidden` properties. The processing **state text**
  element alone has `role="status" aria-live="polite" aria-atomic="true"`.
  Numeric `[data-pose-summary]` remains outside that live region so progress
  ticks are not announced.
- Loading, processing, progress, and output callbacks call the partial update
  only. They never call the global announcer and never move focus.
- Each controller's callback closures capture that originating controller's
  identity or an equivalent unique token. Every callback checks that token
  before any state, output, DOM, focus, or announcement mutation; a stale token
  returns immediately without changing anything. Completed/failed callbacks
  with a current token update state/output and current processing DOM, making
  the scoped processing state the sole announcement. They then call the
  no-render accessibility intent to focus `stage-heading` only when
  `state.activeStep === "processing"` and the captured controller/token still
  equals the active controller/token.
- A late/stale terminal callback, or any terminal callback after navigation
  away from processing, must not steal focus or announce.
- `stopActive()` synchronously invalidates the active callback token before it
  awaits `cancel()`, while retaining a local controller reference for resource
  release. It then owns the stopped/released full render, announcement, and
  capture-view focus. A terminal callback racing the await sees a stale token
  and returns before mutation; cancelled callbacks do not duplicate the owner.
- `closeActive()` performs controller cleanup, handle clearing, phase/
  processing state reset, and nothing else: no render, focus, or announcement.
  It synchronously invalidates the active callback token before awaiting
  `close()`, while retaining a local controller reference for resource release.
  A racing callback is therefore stale before any mutation. Workflow-navigation
  and picker-change callers await cleanup and then each own their single
  destination render/focus/announcement. They must not render before the close
  promise settles. `beforeunload` calls cleanup with no render.
  Closed callbacks remain silent.
- `retryActive` applies no-render focus to `stage-heading` once and relies on
  the subsequent scoped loading/failed/completed state. It must not full-render
  or replace the controller-owned `#analysis-video` node. If the terminal
  callback resolves the same already-active heading, the idempotent helper does
  not call `.focus()` again; if the user moved elsewhere, the current terminal
  callback may focus it once.
- Existing protected labels/selectors, local resource release, and
  remote-review-unavailable behavior remain unchanged.

### Adopted Claude Precision Notes (Non-Blocking)

The exact four document titles, exact per-view fallback targets, bounded
dynamic focus-key grammar, and polite-only announcement priority are adopted as
precision within B1-B6 remediation. They make the existing keyboard, focus,
status, and test contracts implementation-ready; they do not expand SS-019
acceptance criteria or product scope.

### Closed Findings Retained As Regression Contracts

- B2 is closed, not reopened: keep the file input out of sequential order
  without `aria-hidden`, and preserve named success, native-cancel, and
  defensive focus-return coverage.
- B5 is closed, not reopened: preserve the exact static/bounded dynamic key
  grammar, exact per-view fallbacks, and complete render/no-render callsite
  inventory.
- B6 is closed, not reopened: preserve the exact three tokens, two-layer focus
  geometry, eleven enumerated surface ratios, `>= 3:1` executable threshold,
  CSS-reading unit checks, computed-style smoke checks, and forced-colors
  behavior.

### Renderer Semantics

Apply changes in `src/app-renderer.ts`, `src/phase-review-renderer.ts`, and
`src/remote-model-renderer.ts` while keeping current protected copy, labels,
and selectors byte-for-byte unless an attribute-only change is required.

- Add stable `data-focus-key` attributes to every mapped focus target.
- Keep one renderer-owned `<main class="workspace">` landmark.
- Keep the visible `Choose a video` button as the keyboard trigger and give it
  `data-focus-key="video-picker"`. Give `#video-file` `tabindex="-1"` and the
  accurate defensive accessible label `Choose a local video file`; do **not**
  set `aria-hidden="true"`.
- Add picker `cancel` handling that no-render focuses the current visible
  picker. Add `focus` and/or `focusin` redirection from the file input to the
  visible picker for browsers that return focus to the input after chooser
  close. Successful `change` always full-renders with explicit picker focus.
- Use `role="group"` and retain the exact accessible name for every reviewed
  labelled generic container:
  - `.capture-options`: `Local video source`;
  - `.processing-placeholder`: `Local pose processing`;
  - `.review-placeholder`: `Review placeholder`;
  - `.swing-card-summary`: `Swing Card contents`;
  - `.phase-assignment-list`: `Swing phase assignments`;
  - `.keyframe-strip`: `Select keyframe`.
- Convert `.export-placeholder` to
  `<section class="export-placeholder" aria-labelledby="export-placeholder-heading">`.
  Preserve the existing visible `Swing Card unavailable` heading and give that
  heading stable `id="export-placeholder-heading"`.
- Preserve the native `<dl class="remote-model-disclosure">` role and protected
  class selector. Wrap it in a named `role="group"` container for
  `Remote model data disclosure`; never override the `<dl>` role.
- Render each phase's visible label as a real `<h3>` while preserving its text
  and association with its assignment control.
- Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
  relationship to a stable overlay-status element. Preserve the existing
  protected canvas label text.
- Give only the processing state text exact `id="processing-status"` and the
  imperative overlay status exact `id="keyframe-overlay-status"`, scoped polite
  status semantics, and `aria-atomic="true"`. Keep numeric
  `[data-pose-summary]` outside the processing live region.
- Give visible `.status` exact `id="app-visible-status"`, `.phase-warning`
  exact `id="phase-review-status"`, `[data-swing-card-status]` exact
  `id="swing-card-action-status"`, and `[data-remote-model-status]` exact
  `id="remote-model-status"`. Remove `role="status"`, `aria-live`, and other
  live-region roles from all four. They remain populated, visible,
  state-accurate text and valid `aria-describedby` targets.
- The complete renderer inventory must reject any bare `aria-label` on a
  generic element that lacks a naming role or equivalent native named
  structure. The listed groups/regions and the wrapped native `<dl>` are the
  exhaustive current-main remediation set.
- Do not add live-region semantics to static explanatory paragraphs.
- Keep dynamic status text on `textContent`/escaped paths.

Disabled controls must have both a visible dynamic prerequisite/explanation
and an exact `aria-describedby` relationship when disabled:

- `#analysis-button` describes `#app-visible-status`: explain whether safety
  acknowledgement, local video, or processing availability is the current
  prerequisite.
- `[data-review-phases]` and `[data-confirm-phase-review]`: explain whether
  processing output, declaration completeness, phase assignments, or explicit
  confirmation is missing through exact target `#phase-review-status`.
- Unavailable export/open-export controls describe exact target
  `#phase-review-status`, which explains which valid/confirmed phase state is
  required.
- `[data-remote-model-send]` describes exact target `#remote-model-status`,
  retaining the provider-review/configuration and explicit remote-sharing
  boundary explanation.
- Busy `[data-download-swing-card]`, `[data-print-swing-card]`, and
  `[data-copy-swing-card-prompt]` describe exact target
  `#swing-card-action-status`, which reports the current local export action;
  restore focus to the initiating action after completion or failure.

Descriptions must reflect current state and must not claim remote availability,
successful persistence, privacy guarantees, or completed analysis when those
states are not true. Every description ID is unique in the rendered document.
Unit and smoke tests directly assert the owning control-to-ID relationship and
the state-accurate visible text. Manual QA includes browse-mode verification
that disabled controls expose their descriptions in the tested AT/browser.

### `src/styles.css`

- Define exact custom properties `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`.
- The two-color `:focus-visible` geometry is exactly a 2 CSS-pixel white inner
  outline with 2-pixel offset plus a dark outer ring that leaves at least 2 CSS
  pixels visible beyond the inner ring; a 6-pixel outer spread is an approved
  implementation. Cover links, buttons, inputs, selects, and programmatically
  focused headings/status targets.
- Forced-colors mode must retain UA/system focus and semantic boundaries.
  `forced-color-adjust: none` is prohibited.
- Required computed contrast ratios are:

| Token pair | Required ratio |
| --- | ---: |
| `#17211b` vs `#ffffff` | 16.54:1 |
| `#17211b` vs `#f3f5f1` | 15.07:1 |
| `#17211b` vs `#f8faf7` | 15.76:1 |
| `#17211b` vs `#e7f0e9` | 14.21:1 |
| `#17211b` vs `#eaf3ec` | 14.59:1 |
| `#ffffff` vs `#17211b` | 16.54:1 |
| `#ffffff` vs `#245b3b` | 7.97:1 |
| `#607367` vs `#ffffff` | 5.07:1 |
| `#607367` vs `#f3f5f1` | 4.62:1 |
| `#607367` vs `#f8faf7` | 4.83:1 |
| `#607367` vs `#e7f0e9` | 4.35:1 |
| `#607367` vs `#eaf3ec` | 4.47:1 |

Every enumerated focus/interactive-boundary pair must remain at least 3:1.
- Give scoped interactive controls a 44-by-44 CSS-pixel minimum target where
  practical. Do not inflate passive content or apply a global layout minimum.
- Ensure programmatically focused stage/phase/export headings are visibly
  indicated and not obscured.
- Add `min-width: 0`, wrapping, flex/grid stacking, and `overflow-wrap` rules to
  action rows, disclosure/metadata values, phase assignments, keyframe controls,
  statuses/errors, and Swing Card controls as required.
- Add readable failed-processing styling that does not rely on color alone and
  preserves actionable retry/review distinctions.
- At 320 CSS pixels, the primary workflow must reflow without two-dimensional
  page scrolling, clipped text, overlapping controls, or an unreadable export
  panel, except for content that WCAG explicitly permits to remain two
  dimensional. No such exception is currently planned for the app workflow.
- Support forced-colors mode by retaining semantic borders/focus indicators and
  system color adaptation. Do not use `forced-color-adjust: none` to opt the app
  out.
- Preserve the existing reduced-motion behavior.
- Make no decorative redesign, workflow-obscuring restyle, or brand refresh.

## Automated Test Plan

All sign-off evidence must list named tests and map them to the acceptance
criterion and any future Claude blocker they cover.

### New `test/unit/app-accessibility.test.ts`

Add named tests for:

- accepting only known `data-focus-key` values and rejecting arbitrary selector
  strings;
- explicit focus target taking precedence over prior and fallback targets;
- previous known focus restoration when no explicit intent is supplied;
- visible/enabled fallback behavior when explicit/prior targets are absent;
- hidden, disconnected, disabled, `aria-hidden`, inert, and hidden-ancestor
  targets being rejected;
- no valid target producing a safe no-op;
- programmatic `tabindex="-1"` target focus with no positive tabindex;
- stable announcer update through `textContent`, including no update when the
  render request has no announcement.
- `applyAccessibilityIntent` operating without DOM replacement and sharing the
  same bounded-key/target validation as post-render intent application;
- exact bounded dynamic-key rejection and exact per-view fallbacks;
- file-picker cancel and hidden-input focus redirection to `video-picker`;
- every current mapped callsite using exactly one declared announcement
  channel.
- idempotent focus application that does not call `.focus()` when the resolved
  target already equals `document.activeElement`, including retry followed by
  terminal focus with and without intervening user focus.

Picker coverage must use the exact named tests
`returns focus to the picker after successful keyboard-opened selection`,
`returns focus to the picker on native chooser cancel without rendering`, and
`redirects hidden file input focus to the picker without positive tabindex`.

### New `test/unit/accessibility-contrast.test.ts`

Add a named unit suite that reads the exact CSS custom properties, asserts the
three required token values, computes the ratio matrix for every enumerated
surface, and fails below 3:1 or when a token/surface mapping changes.

### Renderer And Event Unit Tests

Extend existing focused unit suites to directly assert:

- exactly one main landmark across the static host and rendered shell;
- protected labels/selectors remain present;
- `#video-file` retains its selector/accept behavior but has
  `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
- stage, phase-review, Swing Card, same-control, and action-status focus keys;
- exact named group/native semantics for `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing Card contents`,
  `Swing phase assignments`, and `Select keyframe`; the named export-placeholder
  section and `Swing Card unavailable` heading relationship; and the named
  remote-disclosure wrapper with its nested native `<dl>` semantics;
- an exhaustive inventory test that rejects bare labelled generic containers;
- heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
  IDs, scoped status semantics, and removed live roles from global-owner text;
- exact disabled-control `aria-describedby` targets and visible dynamic
  prerequisite text for Begin analysis, review/confirm, export, remote review,
  and busy Swing Card actions;
- every event/lifecycle/export path in the complete callsite table issues the
  exact typed focus/announcement request and has no unmapped callsite;
- render/rebind behavior remains single-effect and progress ticks do not
  refocus or announce every tick.
- Exact migration of existing tests is mandatory:
  - rename `clears lifecycle-owned controller handles and syncs app-state idle
    on close` to `clears lifecycle-owned controller handles and syncs app-state
    idle on close without rendering`; assert zero `requestRender` and zero
    `applyAccessibilityIntent` calls;
  - remove/replace `re-renders capture controls after async close settles`;
    relocate its SS-018 stale-capture intent into app-events tests named
    `awaits closeActive before rendering workflow navigation exactly once` and
    `awaits closeActive before selecting a replacement video and renders
    exactly once`; both use a deferred close and prove no render before it
    settles followed by one caller-owned typed request;
  - update `stops active processing and requests an idle capture render` to
    assert the exact typed request containing `focusKey: "stage-heading"`, the
    existing stopped `visibleStatusText`, and the same `announcement`;
  - update all legacy `requestRender` mocks/types and the camera app-events
    assertion to the exact `RenderRequest` payload.
  No old and new contradictory test may coexist.
- named lifecycle tests exactly:
  - `keeps progress ticks partial without global announcements or focus changes`;
  - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
  - `does not steal focus for late terminal callbacks outside the processing view`;
  - `keeps stopped announcement owned by stop and close cleanup silent until the caller destination render`;
  - `retries without replacing the video DOM and moves focus once`.
- Additional named lifecycle/callsite tests:
  - `keeps closeActive cleanup render-free for navigation picker replacement and beforeunload`;
  - `lets navigation and picker callers own exactly one destination render`;
  - `binds terminal callback focus to the originating active controller token`;
  - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
- named renderer/smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`, expanded to every named group/region and the
  nested native `<dl>` listed above.

### Browser Smoke Tests In `test/smoke/app.spec.ts`

Add or extend named tests that:

- traverse the primary capture, consent, processing, review, phase-confirmation,
  and Swing Card export path with keyboard input only;
- open the native file chooser from the visible `Choose a video` button by
  keyboard, then inject the approved pose fixture through the test harness so
  the risky analysis path remains real without relying on a machine-specific
  chooser UI;
- cover successful keyboard-opened selection, a synthetic native `cancel`
  event returning focus, and defensive file-input focus redirection;
- verify focus continuity across consent, selection, begin, processing
  completion, review, same-control edits, confirmation, export, and local Swing
  Card actions after full rerenders;
- assert one main landmark, meaningful heading order, dynamic document titles,
  scoped status semantics, and no duplicate blanket live regions;
- replace all three reviewed unscoped `page.getByRole("status")` assertions —
  camera, consent guard, and stopped status — with direct `#app-announcer`
  assertions plus exact visible `#app-visible-status` text and assertions that
  the visible element has no status role or `aria-live`;
- retain every `.phase-warning` text assertion, but replace the reviewed
  `aria-live="polite"` assertion with exact `id="phase-review-status"`, no
  status role, no `aria-live`, and the exact `aria-describedby` relationship;
- prohibit unscoped status-role locators in processing/review smoke coverage;
  target `#app-announcer`, `#processing-status`, or
  `#keyframe-overlay-status` according to the declared owner;
- verify representative focus visibility and approved focus/control contrast
  tokens in rendered light and dark-adjacent states, the applied two-layer
  indicator geometry, and forced-colors emulation;
- assert scoped interactive targets are at least 44 CSS pixels in each required
  dimension, allowing only spec-reviewed exceptions;
- at desktop and 320 CSS-pixel viewports, exercise long status/error text,
  failed processing, phase review, keyframe controls, and Swing Card export;
  assert no viewport overflow, clipped required text, overlap, or unusable
  control geometry;
- preserve the existing 390-pixel mobile coverage, protected selectors/labels,
  external-network guard, no-sensitive-console-output checks, and real
  pose-fixture output assertions.
- assert exactly one announcement owner for consent, processing terminal,
  phase validation/confirmation, and each Swing action without claiming that
  Playwright substitutes for manual screen-reader evidence;
- assert phase announcements occur only when the semantic state key changes
  among `unsupported-input`, `review-required`, and `confirmed`;
- include named group/region assertions and 320-pixel/long-text geometry for
  every exhaustive renderer-semantic entry, including the nested native remote
  disclosure `<dl>`.

Geometry checks must identify the relevant elements and required relationships;
a screenshot alone or an empty-state-only page-width assertion is insufficient.

## Acceptance-Criteria Coverage Matrix

| Acceptance criterion | Automated evidence | Manual evidence |
| --- | --- | --- |
| Keyboard-only traversal through capture, consent, processing, review, phase confirmation, and export | Real keyboard-only pose-fixture smoke path; focus-request unit tests; event mapping tests | Full keyboard walkthrough, focus order/recovery, browser and input recorded |
| Understandable focus, labels, headings, statuses, and disabled explanations | Accessibility helper, renderer, event, lifecycle, and Swing Card tests; one-main/title/status smoke checks | Screen-reader/keyboard review, focus appearance, announcement timing, prerequisite clarity |
| No desktop/mobile overlap, clipping, unusable controls, or unreadable export | 320/390/desktop geometry, overflow, long/error/review/export, 44-pixel, and token tests | 200%/400% zoom or equivalent 320 reflow, text spacing, actual mobile, forced colors, print/export review |
| Practical automated regression coverage | Named unit/smoke tests mapped here and to Claude blockers | Record gaps that remain manual-only |
| Remaining manual-only risks documented | Artifact-presence/docs review where practical | Required `docs/ss-019-manual-accessibility-qa.md` risk table |

## Required Manual QA Artifact

Implementation must create `docs/ss-019-manual-accessibility-qa.md`. It is an
evidence record, not a conformance statement. For every run or scenario record:

- tested commit SHA and build/serve command;
- date, OS, browser/version, viewport or physical device, zoom, text-spacing
  override if used, input method, and assistive technology/version;
- workflow step and test scenario;
- expected result and actual result;
- evidence reference such as screenshot, recording, or concise observation;
- defect link/status when failed;
- residual risk, affected user/surface, severity or impact, workaround if any,
  and Adopt/Fix/Defer disposition.

Minimum manual scope:

- complete keyboard traversal, visible focus, logical order, and focus recovery;
- VoiceOver and/or NVDA announcements and landmarks where available; record an
  unavailable combination explicitly and do not claim it passed;
- consent, processing progress/failure/completion, phase-review validation,
  confirmation, and export announcements without over-announcement;
- actual native chooser cancel and focus return in every tested browser/AT
  environment;
- duplicate-announcement checks for consent, terminal completion/failure,
  phase validation/confirmation, and Swing actions;
- named-group checks for `Swing Card contents` and
  `Remote model data disclosure`, plus `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing phase assignments`,
  `Select keyframe`, the `Swing Card unavailable` labelled section, and the
  remote wrapper's retained nested `<dl>` semantics;
- browse-mode checks that each disabled control exposes its exact, unique,
  state-accurate visible `aria-describedby` target;
- 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
- WCAG text-spacing overrides;
- forced-colors/high-contrast behavior where the environment supports it;
- every exact focus/boundary token surface from the required ratio matrix;
- long consent/status/error/prerequisite text;
- representative actual mobile-device interaction where available;
- annotated-canvas name/description and the residual nonvisual-equivalence
  limitation;
- Swing Card on-screen export panel, print preview, and locally generated
  download/copy status.

The artifact must explicitly say that SS-019 does not establish WCAG
certification, legal compliance, universal assistive-technology compatibility,
or complete nonvisual equivalence.

## Migration And Rollback

This is a DOM, CSS, focus-coordination, test, and manual-evidence change only.
There is no persisted-state migration, data-schema migration, exported-data
change, dependency migration, service-worker migration, or remote-service
rollout.

Implementation order:

1. Add the stable host/announcer and `app-accessibility` unit contract.
2. Convert the render request and focus/announcement call sites with focused
   unit tests.
3. Add renderer semantics/descriptions while preserving protected
   labels/selectors/copy.
4. Apply scoped CSS focus, contrast, target-size, failure, reflow, forced-color,
   and wrapping changes.
5. Extend the real pose-fixture smoke suite and run targeted checks.
6. Complete the manual QA artifact against the implementation commit.
7. Run the full required verification and prepare a self-contained Claude final
   audit packet containing every changed tracked file or explicit omission
   rationale.

Rollback is a revert of the focused SS-019 implementation commit. Because no
schema, persistence, dependency, provider, or remote behavior changes, no data
rollback is required. Validate the restored baseline with the existing unit,
smoke, build, compliance, safety, and privacy gates.

Primary migration risks are:

- focus regression from stale/missing focus keys or incorrectly forced focus;
- over-announcement, duplicate status messages, or lost important status;
- protected selector, label, or sensitive-copy drift;
- layout regressions introduced by control sizing or wrap rules;
- false confidence from automation that does not match manual AT/browser
  behavior.

## Required Verification

Use Node 22 from `.nvmrc`. Record exact commands, versions, named test output,
and results in the final audit and PR handoffs.

Targeted tests, adjusted to the exact implemented files:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility accessibility-contrast app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
```

Required smoke command:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'
```

Required baseline and protected-boundary checks under Node 22:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run compliance:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run safety:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run privacy:verify'
```

Run when documentation or generated-document claims change, including the
required manual QA artifact:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run docs:verify'
```

Always run:

```sh
git diff --check
```

No dependency, bundle, license-policy, notice, or SBOM change is expected. If
that boundary changes, stop implementation, return to review, and additionally
run the dependency/licensing/SBOM checks required by `AGENTS.md`.

## Claude QA-Planning Gate

Before implementation, the lead architect and workflow coordinator must create
a durable, self-contained Claude prompt and source packet using the standard
adversarial-review skeleton: Role, Stage, Scope, Context, Acceptance criteria,
Protected boundaries, Relevant source contents or focused diff, Verification,
Known non-goals, and Output required.

Claude's first QA-planning review returned FAIL with B1-B6. The first focused
B1-B6 re-review also returned FAIL: B2, B5, and B6 closed, while B1, B3, B4,
the lead close/token-race precision, and accepted N1-N3 remain open. Exact
second-review artifacts are
`docs/ss-019-claude-qa-second-raw-response.md` and
`docs/ss-019-claude-qa-second-response.md`.

`docs/ss-019-claude-qa-rereview-prompt.md` is superseded for paste use. Its
existing source packet remains unchanged as the exact first-re-review evidence
record. A new prompt/packet is not part of this specification-revision step and
must be created only after these N1-N3 contracts and the corresponding durable
context are approved.

The next focused packet must include the prior raw response, lead disposition,
this complete revised specification, exact relevant current baseline sources
and tests, complete focused diffs, and explicit omission rationales. Claude
must independently close B1, B3, B4, the lead close/token-race precision, and
N1-N3 with PASS before the builder creates the story branch or changes runtime
UI. B2, B5, and B6 remain closed regression contracts and must not be reopened
by the N1-N3 corrections.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 30 Complete current file: docs/ss-019-preimplementation-spec.md -->

### 31 Explicit absent record: SS-019 dependency/service-worker/telemetry/provider/model change absence

Lines: 6  
Bytes: 575  
SHA-256: `90e924c91f6021883a5758868695dcd7617cf28848c4eb03853aa5509ecd1629`

<!-- BEGIN EXACT BLOCK: 31 Explicit absent record: SS-019 dependency/service-worker/telemetry/provider/model change absence -->
````````````````````````````````````````````````
Exact absence declaration for the current SS-019 worktree on 2026-07-21:
- No dependency manifest or lockfile change: package.json and package-lock.json are unchanged.
- No licensing-policy, model-licensing, third-party notice, generated notice, or SBOM change is present.
- No service-worker, persistence, telemetry, analytics, remote-logging, or cloud-diagnostics file change is present.
- No provider SDK, model asset, remote-sharing implementation, or raw-media upload change is present.
- No dependency/bundle/license/SBOM verification expansion is triggered by SS-019.

````````````````````````````````````````````````
<!-- END EXACT BLOCK: 31 Explicit absent record: SS-019 dependency/service-worker/telemetry/provider/model change absence -->
