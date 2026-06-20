# SS-010 New Codex Session Prompt

Use this prompt to start a fresh Codex session for the next Swing Sync task.

```text
You are Codex working in /Users/jasonalvarez/gitHubRepos/swing-sync.

Start by reading AGENTS.md and CONTEXT.md. Use the Swing Sync story-delivery
workflow and keep Notion plus CONTEXT.md synchronized.

Current repository state:
- Default branch: main
- local main and origin/main should both be at
  b1a8a722f681cc0a60d643cb95fa0d8f1b83e05a or a later post-SS-009 sync commit.
- main includes SS-009 merge commit
  3d7ad6cb0c0b8b7d18baf36a3079c6bd6666bb86 and post-SS-009 context/prompt
  sync commits.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/10
- Completed task: SS-009 Implement joint angle and coordinate normalization
  utilities.
- SS-009 Notion page:
  https://app.notion.com/p/375834a0c8a68184b16fed21d44b5394
- SS-009 Notion status is 5. Done. PR #10 is recorded, and a Notion comment
  records the merge commit and post-merge context sync.
- Preserve existing untracked docs/agent-guidance/ss-00*-new-codex-session-prompt.md
  files unless the user explicitly asks to clean or commit them.

Next task:
- Story: SS-010 Render skeleton-overlaid keyframes
- Notion page:
  https://app.notion.com/p/375834a0c8a681c280ccc35381721a27
- Branch: ss-010-skeleton-overlays
- Expected initial status: 0. Backlog
- Pull Request: empty

Acceptance criteria:
- Keyframes render with readable skeleton overlays.
- Overlays preserve user privacy by favoring annotated stills over raw video
  export.
- Mobile preview is legible.
- Export pipeline can reuse rendered frames.

Important sensitivity classification:
SS-010 is privacy-, export-, and user-facing rendering-sensitive. It may create
annotated stills from user video frames and prepare reusable export surfaces, so
do not implement directly before the research/spec and Claude QA planning gates
are complete.

Required role boundaries:
- Gemini researches and drafts the specification.
- Codex verifies research, records Adopt / Revise / Defer / Reject decisions,
  implements after approved gates, runs verification, and maintains repo state.
- Claude performs adversarial QA planning and final implementation audit.

Start-of-task steps:
1. Confirm local main is clean except for intentional untracked agent-guidance
   prompt files.
2. Fetch/inspect SS-010 in Notion and verify branch, status, acceptance
   criteria, and empty PR.
3. Create branch ss-010-skeleton-overlays from current main.
4. Move SS-010 to 1. Spec Drafting (Gemini).
5. Search Notion for an existing SS-010-specific test case. If none exists or
   existing coverage is mismatched, create a dedicated test case for readable
   skeleton overlays, mobile preview legibility, privacy-preserving annotated
   still output, and export-reuse boundaries.
6. Prepare a self-contained Gemini Chat prompt for SS-010 using attached
   repository files. Do not rely on Gemini having filesystem or GitHub access.
   Gemini Chat only allows 10 file uploads, so choose at most 10 files and
   embed concise summaries for any omitted prior-story artifacts.

Repository boundaries to preserve:
- Raw swing video is local-first and not uploaded by default.
- Do not add export of raw video, remote sharing, telemetry, remote logging,
  remote review, cloud storage, SDK/provider/model/asset changes, new workers,
  or new dependencies unless separately reviewed and approved.
- Annotated still/keyframe output must avoid raw-video export claims unless the
  story explicitly approves the export surface and its privacy copy.
- Follow docs/privacy-architecture.md, docs/safety-terms.md,
  docs/licensing.md, and docs/models-licensing.md.
- Do not make medical, injury, professional coaching, guaranteed correctness,
  guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance
  claims.
- SS-008 created src/metric-contract.ts and
  docs/schemas/swing-metric-payload-v0.1.0.schema.json.
- SS-009 created src/geometry-metrics.ts and test/unit/geometry-metrics.test.ts.
  SS-010 should respect those contracts but should not add payload export,
  persistence, public serving, or remote sharing unless separately approved.

Likely files to inspect before drafting the Gemini handoff:
- AGENTS.md
- CONTEXT.md
- README.md
- package.json
- src/main.ts
- src/styles.css
- src/workflow.ts
- src/pose-session.ts
- src/browser-frame-processing.ts
- src/pose-contract.ts
- src/phase-review.ts
- src/geometry-metrics.ts
- src/frame-processing.ts
- docs/ss-004-claude-audit-prompt.md
- docs/ss-005-preimplementation-spec.md
- docs/ss-006-preimplementation-spec.md
- docs/ss-007-preimplementation-spec.md
- docs/ss-008-preimplementation-spec.md
- docs/ss-009-preimplementation-spec.md
- docs/privacy-architecture.md
- docs/safety-terms.md
- docs/licensing.md
- docs/models-licensing.md
- test/smoke/app.spec.ts
- test/unit/browser-frame-processing.test.ts
- test/unit/pose-session.test.ts
- test/unit/workflow.test.ts

Suggested 10-file Gemini upload set:
1. AGENTS.md
2. CONTEXT.md
3. src/main.ts
4. src/styles.css
5. src/workflow.ts
6. src/pose-session.ts
7. src/browser-frame-processing.ts
8. src/pose-contract.ts
9. docs/privacy-architecture.md
10. docs/safety-terms.md

Before ending the first turn:
- Create the Gemini handoff prompt file for SS-010.
- Update Notion with the kickoff/spec-drafting state.
- Update CONTEXT.md with branch, status, test-case state, and next owner.
- Do not implement skeleton overlay rendering yet.
```
