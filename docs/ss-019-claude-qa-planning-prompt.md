# SS-019 Claude QA Planning Prompt

**Superseded for paste use.** Claude returned FAIL with B1-B6. Use
`docs/ss-019-claude-qa-rereview-prompt.md` followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md` for the focused re-review.
Keep this file as the original QA-planning record.

Paste this prompt into Claude Chat, followed immediately by
`docs/ss-019-claude-qa-planning-source-packet.md`. The two-file paste is one
self-contained handoff. Do not submit only this prompt: Claude has no
repository, filesystem, GitHub, or Notion access, and the source packet is the
required evidence.

## Role

You are the independent lead adversarial QA planner for Swing Sync, a
local-first browser app for educational golf swing review. Challenge the plan;
do not implement it, rewrite source files, or assume that summarized evidence
is sufficient when exact source is provided in the immediately following
packet.

## Stage

Preimplementation QA planning for SS-019. Runtime/UI implementation and story
branch creation are blocked. The builder must not start until you return PASS,
or every blocking finding is incorporated into the specification/tests and a
focused independent re-review clears it.

## Scope

Adversarially review the SS-019 research/disposition and candidate
preimplementation specification against the complete current source packet.
Challenge:

- the one-main/stable-announcer architecture;
- the typed render request and closed safe `data-focus-key` contract;
- explicit, previous, and fallback focus restoration after full rerenders;
- focus and announcement intent mapping across events, processing lifecycle,
  phase review, and Swing Card actions;
- live-region scope, semantic groups/headings, canvas descriptions, and exact
  disabled-control explanations;
- focus/control contrast, 44-pixel scoped targets, 320-pixel reflow, forced
  colors, reduced motion, long text, error states, and export readability;
- real keyboard-only automation through the risky pose-fixture path;
- named unit/smoke coverage mapped to acceptance and future blockers;
- the manual accessibility evidence format and honest residual-risk handling;
- migration/rollback safety and protected-boundary preservation.

Identify underspecified ownership, contradictory requirements, fail-open
behavior, stale-focus/selector injection risk, over-announcement, untestable
contracts, weak layout evidence, false conformance implications, or missing
source/test coverage before implementation.

## Context

Swing Sync is a Vite/TypeScript local-first browser app. Raw swing video is not
uploaded by default. Explicit safety acknowledgement gates local analysis.
Approved pose processing runs locally on sampled frames. Phase review and Swing
Card generation are local. Remote model review remains unavailable because no
provider is reviewed/configured. There is no app backend, account system,
remote sharing, telemetry, analytics, remote logging, cloud diagnostics, or
configured model provider.

Post-SS-018 ownership is modular:

- `index.html` owns the static host, title, CSP meta policy, and manifest link.
- `src/main.ts` owns the stable root and full render/bind/canvas-redraw
  coordinator plus global lifecycle/service-worker listeners.
- `src/app-renderer.ts` owns the outer shell, workflow stages, processing
  partial updates, and Swing Card panel.
- `src/app-events.ts` owns UI event wiring and render requests.
- `src/app-state.ts` owns serializable/UI state transitions and selectors.
- `src/consent-state.ts` owns fail-closed acknowledgement storage.
- `src/analysis-lifecycle.ts` owns frame-controller handles, processing
  callbacks, resource release, and lifecycle render requests.
- `src/phase-review-renderer.ts` owns phase assignments/confirmation and
  keyframe review markup.
- `src/remote-model-renderer.ts` owns the unavailable remote-review panel.
- `src/keyframe-overlay-renderer.ts` owns selected-keyframe canvas drawing and
  overlay status.
- `src/swing-card-actions.ts` owns local download/print/copy action state.
- `src/render-utils.ts` owns canonical escaping/formatting.
- `src/styles.css` owns focus, color, layout, responsive, print, forced-color,
  and reduced-motion behavior.
- Playwright smoke tests own the current desktop/390-pixel mobile, protected
  selector/label, network/local-first, real pose-fixture, and export paths.

Current-main findings:

- `index.html` renders `<main id="app">` while the app renderer supplies an
  inner `<main class="workspace">`, producing nested main landmarks.
- `requestRender` replaces `#app.innerHTML` and does not preserve focus.
- the visually hidden `#video-file` remains sequentially keyboard focusable
  even though the visible button is the intended trigger;
- status/live semantics are inconsistent and can become duplicate or overly
  broad if hardened without a deliberate announcement contract;
- current focus color `#d7972d` is approximately 2.51:1 on white and 2.29:1
  on `#f3f5f1`;
- some required form/control boundaries are low contrast;
- action rows, assignments, statuses/errors, narrow layouts, and Swing Card
  controls have long-text and 320-pixel reflow risks;
- existing 390-pixel mobile and real-path selector/label coverage is useful but
  does not satisfy the complete SS-019 evidence plan.

Approved architecture:

- change the static `#app` host to `div`, retain one renderer-owned main, and
  add a stable visually hidden `#app-announcer` outside the replaced subtree;
- add `src/app-accessibility.ts` with typed `RenderRequest`, an internal closed
  safe focus-key contract, active-focus capture, visibility/focusability
  validation, explicit/previous/fallback restoration, and text-only announcer
  updates;
- never accept caller-provided CSS focus selectors and never use positive
  tabindex;
- update `document.title` per current workflow view;
- map consent to consent control; video selection to the visible picker;
  begin/step/stop/retry/review transitions to the stage heading; declarations,
  assignments, confirmation choices, and keyframes to the same logical control;
  confirmed review to the phase-review heading; export to the Swing Card
  heading; and busy Swing Card actions to local status before returning to the
  initiating action;
- announce concise meaningful consent/workflow/failure/completion/export
  changes, not every render or progress tick;
- preserve all protected labels/selectors/copy while adding scoped semantics,
  focus keys, descriptions, and layout/focus styling;
- require a real keyboard-only pose-fixture smoke path, focused unit contracts,
  desktop/320/390 long/error/review/export checks, and a manual evidence
  artifact that records unavailable AT/browser combinations and residual risk
  without claiming certification.

## Acceptance criteria

- Complete keyboard-only traversal for capture, consent, processing, review,
  phase confirmation, and Swing Card export flows.
- Verify visible focus states, labels, headings, status updates, and
  disabled-control explanations are understandable.
- Check desktop and mobile layouts for overlap, clipped text, unusable
  controls, and export-panel readability.
- Add automated smoke or unit coverage for the highest-risk accessibility and
  responsive regressions where practical.
- Document any remaining manual-only accessibility risks.

## Protected boundaries

- Do not introduce decorative redesign that obscures the workflow.
- Do not add runtime telemetry, remote logging, analytics, cloud diagnostics,
  provider SDKs, model assets, or remote sharing.
- Do not change safety, privacy, medical-scope, or non-affiliation claims
  except through the sensitive-story review path.
- Preserve local-first raw-media handling, explicit consent, local pose
  processing, remote-review-disabled behavior, service-worker behavior,
  exported data classes, persistence behavior, protected labels, protected
  copy, and smoke-test selectors.
- Do not add a dependency, framework, provider SDK, model asset, bundle-policy,
  license-policy, notice, or SBOM change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Relevant source contents or focused diff

Paste `docs/ss-019-claude-qa-planning-source-packet.md` immediately after this
prompt. The prompt plus packet is one handoff. The packet contains a manifest
with line counts and SHA-256 hashes, exact complete contents for every listed
current source/spec/test/policy file, and the complete focused
`git diff -- CONTEXT.md` with an omission rationale for unrelated historical
context.

Do not review from this prompt alone. If the immediately following packet is
missing, truncated, has a manifest/block mismatch, replaces exact contents with
summaries, or omits a required file without rationale, return FAIL for a
handoff-completeness blocker before judging implementation readiness.

No SS-019 runtime implementation exists. Treat the current files as the
baseline and the research/specification as the proposed change.

## Verification

Current evidence only:

- `git fetch origin` completed successfully.
- local `main`, refreshed `origin/main`, and live remote main were confirmed at
  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`, including SS-018 merge commit
  `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`.
- `git diff --check` passed for the current planning artifacts.
- the source-packet generator recorded every required file's line count,
  byte count, and SHA-256 hash; a mechanical verification re-extracted every
  embedded block and compared it byte-for-byte with the working file, and did
  the same for the focused `CONTEXT.md` diff.
- the nine intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files predate SS-019 and
  are explicitly excluded as unrelated.

No SS-019 implementation tests have run, and no test result should be inferred.
Future builder verification must use Node 22 from `.nvmrc` and include named
targeted unit tests, the real Playwright smoke path, `npm run build`,
`npm run compliance:verify`, `npm run safety:verify`,
`npm run privacy:verify`, `npm run docs:verify` when documentation/generated
claims change, and `git diff --check`. No dependency checks are expected unless
the protected no-dependency decision changes and returns to review.

## Known non-goals

- No decorative redesign, design-system migration, framework migration,
  routing/state library, or component library.
- No camera-capture implementation, localization system, backend, accounts,
  auth, cloud storage, remote sharing, provider/model configuration, SDK, or
  model asset.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, expanded console output, or new
  runtime operator instrumentation.
- No service-worker, persistence, exported-data-class, analysis algorithm,
  pose model, phase logic, metric, or Swing Card data-contract change.
- No new dependency, bundle/license policy, notice, or SBOM change.
- No formal accessibility certification, project-wide WCAG conformance claim,
  legal/compliance claim, universal assistive-technology guarantee, or complete
  nonvisual equivalence for the annotated canvas.
- No claim that unavailable VoiceOver/NVDA/browser/device combinations passed;
  unavailable combinations remain documented residual risks.

## Output required

Return a QA-planning decision, not implementation:

1. Start with exactly `PASS` or `FAIL`.
2. If FAIL, list blocking findings as `B1`, `B2`, and so on, ordered by
   severity. For each blocker give the exact file/spec section, failure mode,
   user/protected-boundary impact, and required architecture/spec/test
   correction before re-review.
3. Identify acceptance-criteria coverage gaps and map each gap to the missing
   unit, smoke, or manual evidence.
4. Provide adversarial cases for focus capture/restoration, stale or missing
   targets, safe-key validation, announcements/live regions, assistive
   technology semantics, keyboard order, contrast/focus visibility, 44-pixel
   targets, forced colors, 320-pixel reflow, zoom/text spacing, long text,
   error/failure states, review, canvas description, and export/print behavior.
5. Identify any safety/privacy/local-first/consent/remote-review/copy/selector/
   dependency/observability drift.
6. Identify missing named automated tests, real risky data paths, or manual QA
   fields/scenarios required for sign-off.
7. Separate non-blocking recommendations from future work; do not silently
   expand SS-019 acceptance criteria.
8. End with an explicit statement that SS-019 is either `CLEARED FOR
   IMPLEMENTATION` or `NOT CLEARED FOR IMPLEMENTATION`.
9. Do not write implementation code or instruct the builder to begin when any
   blocker remains.
