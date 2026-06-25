# SS-011 New Codex Session Prompt

Use this prompt to start a fresh Codex session for the next Swing Sync task.

```text
You are Codex working in /Users/jasonalvarez/gitHubRepos/swing-sync.

Start by reading AGENTS.md and CONTEXT.md. Use the Swing Sync story-delivery
workflow and keep Notion plus CONTEXT.md synchronized.

Current repository state:
- Default branch: main
- local main and origin/main should both be at
  1bb76b1c9dbfd1943cb65ad0176f859417d52eec or a later post-SS-010 sync commit.
- main includes SS-010 merge commit
  1bb76b1c9dbfd1943cb65ad0176f859417d52eec.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/11
- Completed task: SS-010 Render skeleton-overlaid keyframes.
- SS-010 Notion page:
  https://app.notion.com/p/375834a0c8a681c280ccc35381721a27
- SS-010 Notion status is 5. Done. PR #11 is recorded, and a Notion comment
  records merge commit 1bb76b1c9dbfd1943cb65ad0176f859417d52eec.
- Preserve existing untracked docs/agent-guidance/ss-00*-new-codex-session-prompt.md
  files unless the user explicitly asks to clean or commit them.

Next task:
- Story: SS-011 Generate downloadable Swing Card
- Notion page:
  https://app.notion.com/p/375834a0c8a6813ba976c741f4837614
- Branch: ss-011-swing-card
- Expected initial status: 0. Backlog
- Pull Request: empty

Acceptance criteria:
- Swing Card includes selected keyframes, metrics, warnings, and analysis prompt.
- Export works as PNG or PDF.
- No unapproved raw video is included.
- Output remains usable for manual upload to an LLM chat interface.

Important sensitivity classification:
SS-011 is export-, privacy-, user-facing rendering/copy-, safety-, and
AI-chat-prompt-sensitive. It may package annotated stills, metric outputs,
warnings/limitations, and prompt text for manual sharing with an LLM chat
interface. Do not implement directly before the research/spec and Claude QA
planning gates are complete.

Required role boundaries:
- Gemini researches and drafts the specification.
- Codex verifies research, records Adopt / Revise / Defer / Reject decisions,
  implements after approved gates, runs verification, and maintains repo state.
- Claude performs adversarial QA planning and final implementation audit.

Start-of-task steps:
1. Confirm local main is clean except for intentional untracked agent-guidance
   prompt files.
2. Fetch/inspect SS-011 in Notion and verify branch, status, acceptance
   criteria, and empty PR.
3. Create branch ss-011-swing-card from current main.
4. Move SS-011 to 1. Spec Drafting (Gemini).
5. Search Notion for an existing SS-011-specific test case. If none exists or
   existing coverage is mismatched, create a dedicated test case for PNG/PDF
   Swing Card export, selected annotated keyframes, metric/warning inclusion,
   no raw-video inclusion, prompt-copy safety, privacy boundaries, and manual
   LLM upload usability.
6. Prepare a self-contained Gemini Chat prompt for SS-011 using attached
   repository files. Do not rely on Gemini having filesystem or GitHub access.
   Gemini Chat only allows 10 file uploads, so choose at most 10 files and
   embed concise summaries for any omitted prior-story artifacts.

Repository boundaries to preserve:
- Raw swing video is local-first and not uploaded by default.
- Do not add remote sharing, telemetry, remote logging, remote review, cloud
  storage, SDK/provider/model/asset changes, new workers, or new dependencies
  unless separately reviewed and approved.
- Do not include raw video in Swing Card output.
- Swing Card export may include annotated still/keyframe output only if the
  spec explicitly approves the surface and privacy copy.
- Do not imply automatic upload to an LLM or any remote service. The acceptance
  criterion is manual upload usability only.
- Do not persist private media, landmarks, metrics, prompts, or exported cards
  beyond explicit user-initiated download behavior approved by the spec.
- Follow docs/privacy-architecture.md, docs/safety-terms.md,
  docs/licensing.md, and docs/models-licensing.md.
- Do not make medical, injury, professional coaching, guaranteed correctness,
  guaranteed privacy, guaranteed deletion, anonymity, legal, or compliance
  claims.
- SS-008 created src/metric-contract.ts and
  docs/schemas/swing-metric-payload-v0.1.0.schema.json.
- SS-009 created src/geometry-metrics.ts and
  test/unit/geometry-metrics.test.ts.
- SS-010 created src/pose-topology.ts, src/pose-renderer.ts, and
  test/unit/pose-renderer.test.ts, and added selected keyframe skeleton overlay
  rendering in src/main.ts. SS-011 should reuse those boundaries where
  appropriate and should not add raw-video export, remote sharing, persistence,
  or public serving unless separately approved.

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
- src/frame-processing.ts
- src/pose-contract.ts
- src/phase-review.ts
- src/metric-contract.ts
- src/geometry-metrics.ts
- src/pose-topology.ts
- src/pose-renderer.ts
- docs/ss-008-preimplementation-spec.md
- docs/ss-009-preimplementation-spec.md
- docs/ss-010-preimplementation-spec.md
- docs/privacy-architecture.md
- docs/safety-terms.md
- docs/licensing.md
- docs/models-licensing.md
- test/smoke/app.spec.ts
- test/unit/metric-contract.test.ts
- test/unit/geometry-metrics.test.ts
- test/unit/pose-renderer.test.ts
- test/unit/workflow.test.ts

Suggested 10-file Gemini upload set:
1. AGENTS.md
2. CONTEXT.md
3. src/main.ts
4. src/styles.css
5. src/metric-contract.ts
6. src/geometry-metrics.ts
7. src/pose-renderer.ts
8. src/pose-contract.ts
9. docs/privacy-architecture.md
10. docs/safety-terms.md

Before ending the first turn:
- Create the Gemini handoff prompt file for SS-011.
- Update Notion with the kickoff/spec-drafting state.
- Update CONTEXT.md with branch, status, test-case state, and next owner.
- Do not implement Swing Card export yet.
```
