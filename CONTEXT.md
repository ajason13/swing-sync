# Swing Sync Context

Last updated: 2026-06-06

## Current State

- Repository: https://github.com/ajason13/swing-sync
- Default branch: `main`
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/4
- Latest merge commit: `d419e0242f783e626ce6d11951b0204ee7474a9c`
- Current completed task: `SS-003 Define privacy architecture and video data lifecycle`

## Completed Foundation

SS-001 established the project compliance baseline:

- Apache-2.0 root license and project NOTICE.
- Dependency license policy in `docs/licensing.md`.
- Model licensing placeholder and no-model-binary policy in `docs/models-licensing.md`.
- Root `THIRD_PARTY_NOTICES.md`.
- CycloneDX SBOM generation to `docs/sbom.json`.
- GitHub Actions compliance workflow on Node 22.
- Synthetic license fixtures for GPL, MPL, and MIT policy checks.
- Production-scoped NOTICE aggregation with deterministic fixture validation.
- Bundle license validation with a synthetic bundled GPL package.

## Verification Baseline

PR #1 passed GitHub Actions:

- Workflow: `Dependency and License Compliance`
- Run: https://github.com/ajason13/swing-sync/actions/runs/26996587662
- Result: success

Expected local commands:

```bash
nvm use
npm ci
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
npm run build
npm run compliance:verify
```

## Active Task

`SS-004 Scaffold mobile-first PWA and local analysis shell` is in development
on branch `ss-004-pwa-shell`.

Acceptance criteria from Notion:

- App opens directly to capture/upload analysis flow.
- Layout works on mobile and desktop.
- Includes placeholder states for capture, processing, review, and export.
- Basic unit and smoke test setup exists.

SS-004 implementation status through 2026-06-06:

- The app opens directly to a responsive capture/upload workflow rather than a
  marketing page.
- Capture/upload, processing, review, and export are clearly labeled
  placeholders and do not access, store, analyze, export, or remotely share
  video.
- The existing local safety acknowledgement and runtime guard continue to block
  the first analysis action path until consent is checked.
- PWA scaffold metadata and a same-origin navigation shell service worker are
  included without adding remote endpoints.
- Vitest unit coverage validates the workflow model. Playwright smoke coverage
  validates the fail-closed consent path, all placeholder states, and mobile
  viewport overflow across desktop and Pixel 5 projects.
- Desktop and Pixel 5 full-page screenshots were reviewed with no text/control
  overlap; the mobile workflow navigation was revised to show all four states.
- Final Node 22 verification passed: `npm run test:unit`,
  `npm run test:smoke`, `npm run build`, `npm run compliance:verify`,
  `npm run license:audit`, `npm run verify:bundle-license-fixture`,
  `npm run sbom:generate`, `npm audit --omit=dev --audit-level=high`, and
  `git diff --check`.
- Observability is intentionally unchanged. SS-004 adds no telemetry, remote
  logging, remote calls, video handling, model behavior, or remote sharing.
- PR #5 created: https://github.com/ajason13/swing-sync/pull/5
- A self-contained voluntary Claude Chat adversarial audit handoff is available
  at `docs/ss-004-claude-audit-prompt.md`. It embeds the current runtime, PWA,
  test, configuration, protected-boundary, and verification context because
  Claude Chat has no filesystem or GitHub access.
- Claude returned `PASS WITH MINOR FIXES` and conditional merge approval. The
  three required fixes were applied: consent storage failures now fail closed,
  the runtime guard reports inline and focuses the acknowledgement, and the
  incomplete service-worker offline cache was removed.
- Blocker-linked Playwright coverage was added for storage denial and the
  accessible runtime guard. Final verification after fixes passed with 10 smoke
  cases, 2 unit cases, build, compliance, license, bundle-fixture, SBOM, and
  diff checks.
- The original audit prompt is marked superseded. Use the focused
  `docs/ss-004-claude-rereview-prompt.md` for Claude's final sign-off.
- SS-004 is in final audit pending Claude's verdict and PR merge.

## Completed Task

`SS-003 Define privacy architecture and video data lifecycle` merged in
[PR #3](https://github.com/ajason13/swing-sync/pull/3) on 2026-06-06.

SS-003 status through 2026-06-06:

- Gemini Deep Research response received and distilled into
  `docs/ss-003-research-disposition.md`.
- Primary-source checks were recorded for browser storage, OPFS, persistent
  storage, WebKit tracking prevention, CSP, and MediaPipe policy references.
- Initial Claude adversarial review returned PASS WITH MINOR FIXES: clarify the
  consent-copy cross-checks in `scripts/verify-privacy-boundaries.js` and widen
  prohibited-endpoint scanning beyond `src/main.ts`.
- Claude blocker fixes were applied: the verifier now labels inherited SS-002
  consent scaffold checks, recursively scans `src/**` and `scripts/**` while
  excluding its own pattern-list file, records Sentry as blocked pending privacy
  review, clarifies Class G scaffold scope, and defers fail-closed verifier
  assertions until a real network/API boundary exists.
- Claude focused re-review returned PASS. Both blockers are closed, no new
  blockers were introduced, and Claude approved SS-003 for PR creation.
- Final pre-PR verification passed: `npm run privacy:verify`,
  `npm run compliance:verify`, `npm run build`, and
  `git diff --cached --check`.
- PR #3 created: https://github.com/ajason13/swing-sync/pull/3
- PR #3 merged with merge commit
  `28341d6df34774805fab341f342500d583c0986b`.
- Observability remains unchanged because SS-003 adds no runtime video,
  storage, network, model, telemetry, or remote-sharing behavior.

`SS-002 Draft sports injury waiver and educational-use terms` merged in
[PR #2](https://github.com/ajason13/swing-sync/pull/2) on 2026-06-05.

Acceptance criteria from Notion:

- Draft assumption-of-risk and release-of-liability language for review.
- State feedback is educational and not medical or professional athletic instruction.
- Define consent gate before first analysis.
- Add prompt constraints that avoid diagnosing pain or prescribing unsafe movements.

Planned/active artifacts:

- `docs/safety-terms.md`: product-compliance draft language for human/legal
  review, including assumption of risk, release of liability, educational-use
  boundaries, local-first privacy, consent-gate requirements, prompt
  constraints, and a review checklist.
- `src/main.ts`: minimal first-analysis consent gate scaffold that stores only
  local acknowledgement state.
- `scripts/verify-safety-terms.js`: safety-boundary regression checks wired
  into `npm run compliance:verify`.
- `docs/ss-002-research-disposition.md`: Gemini Deep Research disposition,
  separating adopted guidance from revised, deferred, or rejected
  recommendations.

SS-002 verification on 2026-06-05:

- `npm run safety:verify` passed.
- `npm run build` passed.
- `npm run compliance:verify` passed.
- `git diff --check` passed.
- Gemini Deep Research response received and distilled into
  `docs/ss-002-research-disposition.md`.
- Initial Claude audit returned conditional pass with two blockers: add a runtime
  consent check in the analysis click handler, and strengthen
  `scripts/verify-safety-terms.js` to avoid false confidence.
- Claude re-review returned PASS and granted sign-off for PR creation after the
  blocker fixes.
- PR #2 created: https://github.com/ajason13/swing-sync/pull/2
- Claude PR review returned APPROVED FOR MERGE with no blockers. Remaining
  notes are future-story items: verifier regex maintenance, unit tests for
  consent helpers once a real analysis pipeline exists, adversarial prompt tests
  for the first AI coaching pipeline, and private-browsing consent UX.

Remaining SS-002 pre-release gate:

- Legal/human review of draft assumption-of-risk and release-of-liability copy
  remains pending before public release.

## Persistent Learnings

- For safety, legal, medical, or compliance-sensitive stories, keep
  multi-agent roles explicit: Gemini for research/spec disposition, Codex for
  implementation and repo hygiene, and Claude for adversarial audit/re-review.
- Treat external model research as input, not implementation authority. Record
  adopted, revised, deferred, and rejected recommendations in a disposition file
  when research is broad or over-scoped.
- Avoid absolute claims in product safety/privacy copy. Prefer scoped language:
  draft only, not legal advice, no enforceability guarantee, local-first by
  default, and separate explicit opt-in before any remote sharing.
- For consent gates, use both UI gating and a runtime guard on the action path.
  `localStorage` acknowledgement is acceptable only as a scaffold unless legal
  review asks for durable consent records.
- Safety verifiers should check required user-facing copy and prohibited claim
  patterns. Exact phrase checks alone create false confidence.
- Future AI-coaching stories should convert deferred adversarial prompts into
  tests before any model output is exposed.
- Browser-chat research and audit prompts must embed any required repository
  context because Gemini and Claude Chat do not have filesystem or GitHub
  access.
- Initial audit prompts may include broad context, but re-review prompts should
  contain only prior findings, applied fixes, relevant current snippets, and a
  focused diff. Duplicating full contents and a full diff can cause the auditor
  to treat the handoff as repeated stale input.
- Keep the original audit prompt and focused re-review prompt in separate,
  clearly named files. Mark superseded prompt files with a do-not-paste
  redirect.

## Operating Notes

- Keep legal language framed as product/compliance drafting, not legal advice.
- Preserve the local-first privacy posture: no raw swing video upload by default.
- User-facing safety copy should be clear, plain, and explicit before analysis.
- Any connected model or coaching prompt must avoid medical diagnosis, pain triage, or aggressive mechanical prescriptions.
- Observability: SS-002 adds no runtime logging, telemetry, remote calls, or raw
  video handling. Consent acknowledgement is local-only browser state.
