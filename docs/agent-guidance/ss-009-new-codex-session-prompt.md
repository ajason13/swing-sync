# SS-009 New Codex Session Prompt

Use this prompt to start a fresh Codex session for the next Swing Sync task.

```text
You are Codex working in /Users/jasonalvarez/gitHubRepos/swing-sync.

Start by reading AGENTS.md and CONTEXT.md. Use the Swing Sync story-delivery
workflow and keep Notion plus CONTEXT.md synchronized.

Current repository state:
- Default branch: main
- main/origin main should be at SS-008 merge commit
  35a569941b46744338f274f70d5eb826cfabdb1f.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/9
- Completed task: SS-008 Define Swing Sync metric JSON schema
- SS-008 Notion status should be 5. Done.
- Preserve existing untracked docs/agent-guidance/ss-00*-new-codex-session-prompt.md
  files unless the user explicitly asks to clean or commit them.

Next task:
- Story: SS-009 Implement joint angle and coordinate normalization utilities
- Notion page:
  https://app.notion.com/p/375834a0c8a68184b16fed21d44b5394
- Branch: ss-009-angle-utils
- Expected initial status: 0. Backlog
- Pull Request: empty

Acceptance criteria:
- Computes shoulder angle, spine angle, knee flex, arm plane, hip rotation
  proxy, and head displacement.
- Handles left/right handedness.
- Unit tests cover synthetic coordinates and edge cases.
- Invalid or missing landmarks return warnings, not fabricated metrics.

Important sensitivity classification:
SS-009 is safety-, privacy-, and coaching-sensitive. It introduces metric
calculation primitives over pose landmarks, so do not implement directly before
the research/spec and Claude QA planning gates are complete.

Required role boundaries:
- Gemini researches and drafts the specification.
- Codex verifies research, records Adopt / Revise / Defer / Reject decisions,
  implements after approved gates, runs verification, and maintains repo state.
- Claude performs adversarial QA planning and final implementation audit.

Start-of-task steps:
1. Confirm local main is clean except for intentional untracked agent-guidance
   prompt files.
2. Fetch/inspect SS-009 in Notion and verify branch, status, acceptance
   criteria, and empty PR.
3. Create branch ss-009-angle-utils from current main.
4. Move SS-009 to 1. Spec Drafting (Gemini).
5. Search Notion for an existing SS-009-specific test case. If none exists or
   existing coverage is mismatched, create a dedicated test case for the
   acceptance criteria.
6. Prepare a self-contained Gemini Chat Deep Research prompt for SS-009 using
   attached repository files. Do not rely on Gemini having filesystem or GitHub
   access.

Repository boundaries to preserve:
- Raw swing video is local-first and not uploaded by default.
- No export, persistence, telemetry, remote logging, remote review, cloud
  storage, SDK/provider/model/asset changes, new workers, or new dependencies
  unless separately reviewed and approved.
- Follow docs/privacy-architecture.md, docs/safety-terms.md,
  docs/licensing.md, and docs/models-licensing.md.
- Do not make medical, injury, professional coaching, guaranteed correctness,
  guaranteed privacy, or guaranteed deletion claims.
- SS-008 created src/metric-contract.ts and
  docs/schemas/swing-metric-payload-v0.1.0.schema.json. SS-009 should respect
  that contract but should not add export/persistence/public serving.

Likely files to inspect before drafting the Gemini handoff:
- AGENTS.md
- CONTEXT.md
- README.md
- package.json
- src/pose-contract.ts
- src/phase-review.ts
- src/metric-contract.ts
- src/frame-processing.ts
- docs/ss-005-preimplementation-spec.md
- docs/ss-006-preimplementation-spec.md
- docs/ss-007-preimplementation-spec.md
- docs/ss-008-preimplementation-spec.md
- docs/ss-008-research-disposition.md
- docs/privacy-architecture.md
- docs/safety-terms.md
- docs/licensing.md
- docs/models-licensing.md
- test/unit/pose-contract.test.ts
- test/unit/phase-review.test.ts
- test/unit/metric-contract.test.ts
- test/unit/frame-processing.test.ts

Before ending the first turn:
- Create the Gemini handoff prompt file for SS-009.
- Update Notion with the kickoff/spec-drafting state.
- Update CONTEXT.md with branch, status, test-case state, and next owner.
- Do not implement angle utilities yet.
```
