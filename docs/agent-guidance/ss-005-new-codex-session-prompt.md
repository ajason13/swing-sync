# SS-005 New Codex Session Prompt

Paste this prompt into a new Codex session started from:

`/Users/jasonalvarez/gitHubRepos/swing-sync`

## Prompt

You are Codex working in `/Users/jasonalvarez/gitHubRepos/swing-sync`.

Use `$swing-sync-story-delivery` to coordinate the story. Compose
`$multi-agent-sdlc-orchestration`, `$adversarial-review-handoff`,
`$audit-response`, `$project-context-sync`, and `$pr-prep` as directed by the
repo skill.

Read `AGENTS.md` and `CONTEXT.md` first.

## Current Repository State

- Start from updated `main`.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/5
- Latest merge commit:
  `1d4aaea207c57f93bf7aa3c96d56cf58059d603a`
- Current post-merge context commit: `57cda37`
- SS-004 is merged and marked `5. Done` in Notion.
- The worktree may contain the unrelated untracked file
  `docs/agent-guidance/ss-004-new-codex-session-prompt.md`. Preserve it unless
  the user explicitly directs otherwise.

Before creating the SS-005 branch:

1. Inspect the branch and worktree.
2. Fetch latest `origin/main` and fast-forward local `main`.
3. Confirm `main` includes PR #5 and the post-merge `CONTEXT.md` update.
4. Run `git diff --check`.
5. Preserve unrelated user changes.

## Next Story

Task: `SS-005 Integrate MediaPipe Pose Landmarker in browser video mode`

Expected branch: `ss-005-mediapipe-pose`

Current Notion status at handoff: `0. Backlog`

Current Notion PR field: empty

Acceptance criteria:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

## Important Tracker Mismatch

The Notion page titled `SS-TC-005` currently describes swing-phase detection
and manual correction of eight keyframes. That content does not match SS-005
Pose Landmarker integration.

Before implementation:

- Verify whether a correct Pose Landmarker test case exists elsewhere.
- Record the mismatch in Notion.
- Do not treat the current `SS-TC-005` page as valid acceptance coverage for
  this story.

## Sensitive Story Classification

SS-005 is privacy-, model-provider-, model-asset-, licensing-, and
compliance-sensitive because it introduces real local video-frame processing,
pose landmarks, an SDK/runtime dependency, and model assets.

Use the sensitive-story workflow:

- Gemini researches and drafts the specification.
- Codex verifies research, records Adopt / Revise / Defer / Reject decisions,
  implements, tests, and maintains repository state.
- Claude creates adversarial QA expectations and performs final audit and
  focused re-review after fixes.

Do not implement Pose Landmarker, add the MediaPipe dependency, download a
model, commit a fixture video, or fetch/serve/cache model assets until the
blocking specification and licensing questions are resolved.

## Required Pre-Implementation Work

1. Read:
   - `README.md`
   - `CONTEXT.md`
   - `package.json`
   - `src/main.ts`
   - `src/workflow.ts`
   - `public/sw.js`
   - `docs/licensing.md`
   - `docs/models-licensing.md`
   - `docs/privacy-architecture.md`
   - `docs/safety-terms.md`
   - `docs/ss-003-research-disposition.md`
   - existing test and compliance scripts
2. Fetch SS-005 from Notion and reconfirm acceptance criteria, branch, status,
   PR state, and the test-case mismatch.
3. Create branch `ss-005-mediapipe-pose`.
4. Move SS-005 to `1. Spec Drafting (Gemini)`.
5. Create a self-contained Gemini Deep Research prompt at
   `docs/ss-005-gemini-research-prompt.md`.
6. The Gemini prompt must research primary-source evidence for:
   - MediaPipe Tasks Vision JavaScript package name, supported version, source
     license, browser/video-mode API, threading/runtime behavior, and required
     WASM assets;
   - Pose Landmarker model name/version, model card, license/terms,
     redistribution rights, local serving/caching rights, attribution, and
     commercial-use restrictions;
   - whether runtime code or model assets make any network requests after local
     assets are available;
   - Content Security Policy, service-worker, worker, WASM, and deployment
     implications;
   - confidence, presence, and visibility metadata semantics;
   - browser/mobile performance constraints and non-blocking UI architecture;
   - deterministic fixture-video and expected-landmark testing approaches;
   - fixture video provenance, consent, licensing, and whether a synthetic or
     generated fixture is required;
   - privacy implications for raw frames and derived landmarks.
7. Treat Gemini output as research input, not authority. Verify important
   claims against official MediaPipe/Google documentation, package metadata,
   model cards, licenses, and terms.
8. Create `docs/ss-005-research-disposition.md` with explicit Adopt / Revise /
   Defer / Reject decisions.
9. Update `docs/models-licensing.md` and other licensing/privacy documentation
   with the exact approved SDK/model/asset decision before adding dependencies
   or model assets.
10. Create a self-contained Claude QA-planning prompt and move the task to
    `2. QA Planning (Claude)`. Resolve blocking QA/spec findings before
    implementation.

## Blocking Questions

Do not begin implementation until these have explicit, documented answers:

- Which exact MediaPipe Tasks Vision package and version is approved?
- Which exact Pose Landmarker model asset and version is approved?
- May the model asset be committed, vendored, served, cached, or downloaded?
- What notices, citations, attribution, or terms apply?
- Is the model fetched remotely, bundled locally, or provided by the user?
- How will the app prove that network activity is unnecessary after approved
  assets are available?
- What fixture video is approved, and what is its source/license/provenance?
- How will raw frames remain volatile and local?
- What landmark schema and confidence/visibility fields are retained?
- What test case replaces or corrects the mismatched `SS-TC-005` record?
- What performance approach keeps model loading/inference from blocking the UI?

## Implementation Boundaries

After specification and QA gates are resolved:

- Move the task to `3. In Development (ChatGPT)`.
- Draft a concise implementation plan before editing.
- Keep processing local-first.
- Do not add remote model APIs, telemetry, remote logging, cloud storage, or
  remote sharing.
- Do not persist raw video or derived frames.
- Revoke object URLs and release frame/runtime resources where applicable.
- Preserve the first-analysis safety acknowledgement and fail-closed behavior.
- Retain required landmark confidence/presence/visibility metadata without
  inventing guarantees.
- Use a non-blocking loading/inference design; confirm responsiveness through
  browser tests.
- Treat derived landmarks as sensitive user data.
- Keep observability local and privacy-preserving. Explicitly document whether
  diagnostics were added, intentionally unchanged, or deferred.
- Keep swing-phase detection, metrics, coaching, exports, and remote review out
  of SS-005 unless Notion acceptance criteria are explicitly changed.

## Testing Expectations

Add focused tests for:

- model/runtime initialization failure and useful local error state;
- UI responsiveness while loading;
- video-mode timestamp handling;
- landmark extraction from the approved fixture;
- confidence/presence/visibility metadata retention;
- no raw-frame persistence;
- resource cleanup;
- no unexpected network activity after approved assets are locally available;
- mobile and desktop browser behavior;
- protected safety/privacy boundaries.

Correct the Notion test-case mismatch or create an accurate SS-005 test case
before claiming acceptance coverage.

## Dependency And Verification Rules

Use Node 22 from `.nvmrc`.

Because SS-005 adds a production SDK/model boundary, at minimum run:

```bash
npm run test:unit
npm run test:smoke
npm run build
npm run compliance:verify
npm run safety:verify
npm run privacy:verify
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
git diff --check
```

Also run all new targeted model/fixture/network tests and inspect the production
bundle notices/SBOM. Confirm any production dependency appears correctly.

## Audit, PR, And Completion

- Create a self-contained Claude adversarial audit prompt before PR creation.
- Move SS-005 to `4. Final Audit (Claude)` when implementation is ready.
- Address all blocking findings, rerun verification, and create a separate
  focused re-review prompt after fixes.
- Do not claim Done without Claude PASS, green verification, PR merge, accurate
  licensing/model documentation, corrected QA coverage, and synchronized Notion
  plus `CONTEXT.md`.
- Complete `.github/pull_request_template.md`.
- Record scope, model/SDK terms, fixture provenance, verification, network
  behavior, deferred work, and observability impact in the PR.
- After merge, update local `main`, `CONTEXT.md`, and Notion; move the task to
  `5. Done` and identify the next task.

Continue autonomously through research/specification handoff and repository
coordination. Stop before implementation if external Gemini or Claude Chat
responses are required, and clearly identify the exact prompt file to paste and
the response needed to continue.
