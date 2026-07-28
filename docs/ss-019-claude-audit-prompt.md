# Superseded for paste use — SS-019 Final Claude Implementation-Audit Prompt

This immutable pre-fix final-audit prompt is retained with its source packet as
the verified B-NEW1 baseline. Do not paste it for the focused re-review. Use
`docs/ss-019-claude-audit-rereview-prompt.md` first, followed immediately by
`docs/ss-019-claude-audit-rereview-source-packet.md`.

Paste this prompt into Claude Chat first, then paste
`docs/ss-019-claude-audit-source-packet.md` immediately after it. The two files
are one handoff. Do not begin the audit until both files are present. You have no
repository, filesystem, GitHub, Notion, CI, or external source access; judge only
the exact evidence embedded in the prompt and packet.

## Role

You are the independent final implementation auditor for Swing Sync SS-019,
“Perform accessibility and responsive design hardening.” Be adversarial and
evidence-driven. Challenge the implementation, tests, manual-risk record, and
protected-boundary claims. Do not implement, rewrite, or broaden the story.

## Stage

Final implementation audit before pull-request preparation. Claude previously
cleared the implementation plan after three QA-planning rounds. Codex then
implemented and verified the story. An independent deep-researcher found nine
implementation blockers; focused builder repairs plus a focused independent
re-review closed all nine and two follow-up findings, R1/R2. Your review is the
required independent final sign-off. The story is not Done and has no PR.

## Scope

Audit the complete SS-019 implementation diff, new accessibility helpers and
tests, approved specification conformance, responsive and error-state evidence,
manual-only risk record, and safety/privacy/local-first/dependency/observability
boundaries. Pay special attention to:

- real keyboard traversal from capture and consent through processing, phase
  review/confirmation, export, and all Swing Card actions;
- deterministic focus restoration, bounded focus keys, file-picker cancel and
  focus-return behavior, deferred-close ownership, retry, and stale controller
  callbacks;
- exact live-region owner IDs, event-to-owner mapping, mutation exclusivity,
  anti-chatter behavior, terminal completion/failure ownership, and visible
  non-live status text;
- accessible names, headings, labelled groups/sections, disabled-control
  descriptions, keyframe canvas semantics, and preserved selectors/labels;
- exact focus/boundary tokens, two-layer focus geometry, forced-colors behavior,
  scoped 44-pixel targets, 320/390 responsive layout, long/error text, and
  export-panel usability;
- whether behavioral tests actually exercise the risky runtime paths and exact
  typed payloads rather than relying on source-string or callsite inventories;
- whether automated evidence is accurately distinguished from unavailable
  manual assistive-technology/device/zoom/text-spacing/print evidence.

## Context

Repository baseline is
`b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`. The uncommitted implementation is
on `ss-019-accessibility-design-hardening`. Pull Request is empty. The configured
workflow stage for this handoff is `4. Final Audit (Claude)`.

Task intent: turn the MVP UI into a dependable manual-testing and public-demo
surface by hardening keyboard access, screen-reader semantics, contrast, mobile
layout, long text, focus order, and error-state readability without decorative
redesign or product-boundary drift.

Planning history:

- Initial Claude QA planning returned FAIL with B1-B6: terminal processing
  focus/announcement ownership; native file-input cancel/focus return; duplicate
  live regions; incomplete named-container semantics; incomplete focus-key and
  render-callsite coverage; and unquantified focus contrast.
- First focused re-review closed B2/B5/B6 but returned FAIL through N1-N3 for
  contradictory close/render tests, unreconciled smoke live-region assertions,
  and additional unnamed generic containers.
- The final focused QA-planning re-review returned PASS and explicitly cleared
  implementation. B1-B6, N1-N3, and close/token-race precision were closed.
- The approved full specification is embedded in the packet and remains the
  implementation authority.

Implementation-review history:

- The first independent deep-researcher implementation review returned FAIL
  with nine findings: stale terminal processing status; confirmed-state heading
  paired with review-required text; invalid label/heading nesting; overlay live
  status mutation on unrelated renders; the approved interactive boundary token
  not applied to all required controls; missing real failed-state 320-pixel
  coverage and processing overflow risk; incomplete lifecycle/callsite behavior
  tests; incomplete smoke coverage; and stale/overstated manual/context evidence.
- Repairs addressed all nine. Follow-up R1 required the missing behavioral
  lifecycle/callsite matrix: event declarations, setup and focus-key validation;
  download/print/copy start, success, and failure payloads; and
  loading/processing/cancelled/closed partial callbacks in addition to terminal
  paths. R2 required exact processing/review owner-ID assertions, completed and
  failed terminal mutation exclusivity, and runtime/browser proof of exact,
  unique, state-appropriate descriptions for disabled Begin/review and busy
  print/download controls.
- Focused builder evidence passed R1 at 27/27 unit tests and R2 at 6/6
  desktop/mobile smoke tests. Full suites then passed at 24 files/217 unit tests
  and 48 desktop/mobile smoke tests.
- Focused independent deep-researcher re-review returned PASS, closing all nine
  initial findings plus R1/R2. That PASS is input, not a substitute for your
  independent final audit.

Implementation design decisions include a typed `RenderRequest` and bounded
focus-key contract in `src/app-accessibility.ts`; exact per-view fallback focus;
render-free `closeActive()` with caller-owned destination render; current-token
terminal intents and stale-callback rejection; stable global announcer plus
exact scoped processing/overlay owners; non-live visible status IDs; semantic
phase announcement keys; proxy file-picker cancel/focus recovery; named group
and section semantics; exact contrast/focus tokens; responsive overflow and
wrapping rules; and no positive tabindex.

Manual-only risks remain explicitly open. No VoiceOver or NVDA run, physical
mobile-device run, physical Windows High Contrast run, manual 200/400-percent
zoom run, WCAG text-spacing override, print-preview inspection, generated-file
inspection, or clipboard-permission matrix is claimed. The manual record is not
a WCAG or legal conformance statement.

Observability is intentionally unchanged: no telemetry, analytics, remote
logging, cloud diagnostics, hidden identifiers, persistent debug artifacts,
expanded console output, or runtime operator instrumentation. Dependencies are
unchanged: no framework, dependency, provider SDK, model asset, bundle/license
policy, notice, lockfile, or SBOM change.

## Acceptance criteria

1. Keyboard-only traversal covers capture, consent, processing, review, phase
   confirmation, and Swing Card export.
2. Focus states, labels, headings, status updates, and disabled-control
   explanations are understandable.
3. Desktop and mobile layouts have no overlap, clipped text, unusable controls,
   or unreadable export panel.
4. Practical automated smoke or unit coverage protects the highest-risk
   accessibility and responsive regressions.
5. Remaining manual-only accessibility risks are documented accurately.

Map every blocker and every PASS claim to one or more criteria. Treat missing
evidence for a claimed automated behavior as a blocker; do not treat explicitly
documented manual-only residual risk as an automatic blocker unless the shipped
behavior, acceptance criteria, or risk description is inadequate.

## Protected boundaries

- No decorative redesign that obscures the workflow.
- No runtime telemetry, remote logging, analytics, cloud diagnostics, provider
  SDKs, model assets, or remote sharing.
- Do not change safety, privacy, medical-scope, or non-affiliation claims except
  through the sensitive-story review path.
- Preserve local-first raw-media handling: raw swing video is not uploaded by
  default, and remote sharing remains unavailable without separate explicit
  opt-in and future review.
- Preserve consent gating, local processing, remote-review-disabled behavior,
  service-worker and persistence behavior, Swing Card exported data classes,
  protected copy, labels, and smoke-test selectors.
- No dependency, framework, bundle, license-policy, notice, lockfile, SBOM,
  provider, or model change is authorized.
- Do not infer accessibility certification, universal AT compatibility, legal
  compliance, complete nonvisual canvas equivalence, or completed manual QA.

Any drift is a blocker even if automated tests pass.

## Relevant source contents or focused diff

The companion packet must be treated as the source of truth. Before judging the
implementation, mechanically verify its manifest and all sequential evidence
blocks. The packet contains:

- a complete per-file `git diff -- <path>` for every changed tracked file;
- complete current contents for the new runtime helper, three new unit-test
  files, manual QA record, and approved preimplementation specification;
- complete current governance and protected-boundary sources: `AGENTS.md`,
  `.nvmrc`, `package.json`, privacy architecture, safety terms, general
  licensing, and model licensing;
- an explicit absent-change record for dependency/lockfile/license/SBOM/notice,
  service-worker, telemetry, provider, model, and remote-sharing changes;
- explicit rationale for omitting immutable historical planning
  prompts/packets/responses, the nine intentional untracked agent-guidance
  prompts, unrelated unchanged source, and the prompt/packet themselves.

For every manifest row, independently confirm the kind, path, line count, byte
count, SHA-256, unique sequential BEGIN/END markers, and exact raw contents.
Reject the handoff as incomplete if any block is missing, duplicated,
summarized, truncated, hash/size mismatched, or does not match its declared
current file or focused diff. The prompt and packet are deliberately excluded
from their own packet to avoid circular evidence.

## Verification

Recorded final verification under Node `v22.22.3` from `.nvmrc`:

- `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit'`
  — PASS, 24 files / 217 tests.
- `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'`
  — PASS, 48 tests across desktop and mobile Chromium.
- Focused R1 unit verification — PASS, 27/27 tests.
- Focused R2 browser verification — PASS, 6/6 desktop/mobile smoke tests.
- `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'`
  — PASS.
- `npm run compliance:verify` — PASS.
- `npm run safety:verify` — PASS.
- `npm run privacy:verify` — PASS.
- `npm run docs:verify` — PASS.
- `git diff --check` — PASS.

No dependency/bundle/license/SBOM-specific commands were required because those
surfaces did not change. Audit whether that non-goal is borne out by the exact
packet.

## Known non-goals

- Decorative redesign, localization, camera capture, remote review/sharing,
  provider/model enablement, cloud services, runtime diagnostics, and new
  dependencies.
- WCAG certification, a legal-compliance opinion, universal browser/AT
  compatibility, complete nonvisual equivalence for annotated pose geometry,
  or manual evidence that was not executed.
- Changing safety, privacy, medical, non-affiliation, licensing, consent,
  service-worker, persistence, or exported-data claims/behavior.
- Treating non-blocking future hardening as current acceptance criteria.

## Output required

First report mechanical handoff verification. Then provide:

1. A single **PASS** or **FAIL** verdict.
2. Blocking findings ordered by severity. For each blocker give severity,
   exact file and line or packet block, failure mode, user/system impact,
   acceptance criterion or protected boundary affected, and the minimum
   concrete correction plus required regression evidence.
3. An acceptance-criteria coverage table for AC1-AC5, including whether the
   exact implementation and behavioral tests justify each result.
4. A prior-finding closure table for B1-B6, N1-N3, the nine independent
   implementation findings, and R1/R2. Reopen any item whose fix or evidence is
   incomplete.
5. Missing tests, missing evidence, contradictory assertions, stale durable
   claims, selector/label drift, and manual-risk omissions.
6. Safety, privacy, local-first, consent, remote-review, copy, dependency,
   licensing, service-worker, provider/model, observability, and telemetry drift
   analysis.
7. Non-blocking recommendations and future work clearly separated from
   blockers and current acceptance criteria.
8. Explicit sign-off: either `CLEARED FOR PR PREPARATION` or
   `NOT CLEARED FOR PR PREPARATION`.

Do not return PASS merely because tests passed or another reviewer passed.
Attack stale callbacks, wrong announcement owners, duplicate mutations,
failure/retry paths, missing description targets, focus loss, long text,
320-pixel reflow, forced-colors handling, protected selector/copy drift, and
false automated-conformance claims against the exact evidence.
