# Post-SS-009 New Codex Session Prompt

Use this prompt to start a fresh Codex session for the next Swing Sync task.

```text
You are Codex working in /Users/jasonalvarez/gitHubRepos/swing-sync.

Start by reading AGENTS.md and CONTEXT.md. Use the Swing Sync story-delivery
workflow and keep Notion plus CONTEXT.md synchronized.

Current repository state:
- Default branch: main
- local main and origin/main should both point at SS-009 merge commit
  3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/10
- Completed task: SS-009 Implement joint angle and coordinate normalization
  utilities.
- PR #10 merged at 2026-06-20T00:10:14Z.
- SS-009 Notion page:
  https://app.notion.com/p/375834a0c8a68184b16fed21d44b5394
- SS-009 Notion status needs verification and, if not already updated, should
  be moved to 5. Done after Notion auth is restored.
- A Notion update attempt after merge returned "Auth required"; verify Notion
  auth before relying on task state or trying to update pages.
- Preserve existing untracked docs/agent-guidance/ss-00*-new-codex-session-prompt.md
  files unless the user explicitly asks to clean or commit them.

SS-009 completion summary:
- Added src/geometry-metrics.ts and test/unit/geometry-metrics.test.ts.
- Added zero-dependency geometry primitives for shoulder angle, spine angle,
  lead/trail knee flex, lead arm plane, hip rotation proxy, and head
  displacement.
- Invalid, missing, low-visibility, undeclared, malformed, zero-length,
  missing-baseline, or insufficient-baseline inputs return deterministic
  warnings with status "unavailable" and value null.
- No metric payload generation, schema expansion, runtime UI, export,
  persistence, telemetry, remote logging, network behavior, dependencies,
  SDK/model/provider changes, workers, or public serving were added.
- Observability intentionally unchanged: no logs, diagnostics, analytics,
  traces, telemetry, storage writes, or debug payloads were added.
- Claude final implementation audit closing review returned PASS.
- Local verification before PR passed: npm run test:unit, npm run build,
  npm run compliance:verify, npm run safety:verify, npm run privacy:verify,
  npm run license:audit, npm run sbom:generate, and git diff --check.
- GitHub Dependency and License Compliance check passed on PR #10.

Start-of-session steps:
1. Confirm current branch and worktree state:
   - git status --short --branch
   - git rev-parse HEAD
   - git rev-parse origin/main
   Expected: main at 3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86, clean except
   for intentional untracked agent-guidance prompt files.
2. Verify PR #10 is merged:
   - gh pr view 10 --json state,mergedAt,mergeCommit,url
3. Restore/confirm Notion auth.
4. Fetch SS-009 in Notion. If it is not already 5. Done, update:
   - Handshake Status: 5. Done
   - Pull Request: https://github.com/ajason13/swing-sync/pull/10
   Add a concise comment noting merge commit
   3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86 and post-merge context sync.
5. Query the Swing Sync task database for the next accepted Backlog task.
   Do not assume the next task from local notes alone. Confirm in Notion:
   - task name/story id
   - branch
   - Handshake Status
   - acceptance criteria
   - Pull Request field
6. Update CONTEXT.md with:
   - Latest merged PR #10 and merge commit
   - SS-009 marked complete
   - selected next task, branch, status, acceptance criteria, and next owner
7. Create the next story branch from current main only after the Notion task is
   confirmed.

Sensitivity and workflow rules:
- Treat safety, privacy, legal, medical, AI-coaching, model-provider, or
  compliance-sensitive stories as gated:
  - Gemini researches and drafts specifications.
  - Codex verifies research, records Adopt / Revise / Defer / Reject decisions,
    implements after approved gates, runs verification, and maintains repo
    state.
  - Claude performs adversarial QA planning and final implementation audit.
- Browser-chat prompts must embed all required repository context because
  Gemini and Claude Chat do not have filesystem or GitHub access.
- Do not implement sensitive-story runtime changes before the research/spec and
  Claude QA planning gates are complete.

Repository boundaries to preserve:
- Raw swing video is local-first and not uploaded by default.
- No export, persistence, telemetry, remote logging, remote review, cloud
  storage, SDK/provider/model/asset changes, new workers, or new dependencies
  unless separately reviewed and approved.
- Follow docs/privacy-architecture.md, docs/safety-terms.md,
  docs/licensing.md, and docs/models-licensing.md.
- Do not make medical, injury, professional coaching, guaranteed correctness,
  guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance
  claims.
- SS-008 created src/metric-contract.ts and
  docs/schemas/swing-metric-payload-v0.1.0.schema.json.
- SS-009 created src/geometry-metrics.ts and tests; future metric work should
  respect its warning/result contract and still avoid export/persistence/public
  serving unless separately approved.

Useful files to inspect before selecting or starting the next task:
- AGENTS.md
- CONTEXT.md
- README.md
- package.json
- src/pose-contract.ts
- src/phase-review.ts
- src/metric-contract.ts
- src/geometry-metrics.ts
- src/frame-processing.ts
- docs/ss-005-preimplementation-spec.md
- docs/ss-006-preimplementation-spec.md
- docs/ss-007-preimplementation-spec.md
- docs/ss-008-preimplementation-spec.md
- docs/ss-009-preimplementation-spec.md
- docs/ss-009-research-disposition.md
- docs/privacy-architecture.md
- docs/safety-terms.md
- docs/licensing.md
- docs/models-licensing.md
- test/unit/pose-contract.test.ts
- test/unit/phase-review.test.ts
- test/unit/metric-contract.test.ts
- test/unit/geometry-metrics.test.ts
- test/unit/frame-processing.test.ts

Before ending the first turn:
- SS-009 Notion status and CONTEXT.md must be synchronized with the merge.
- The next task must be selected from Notion, not guessed.
- Create a task-specific Codex prompt or Gemini/Claude handoff only after the
  next task's Notion details are verified.
```
