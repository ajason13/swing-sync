# Create Swing Sync Story Delivery Skill Prompt

Use this prompt with Codex from the Swing Sync repository root. Explicitly
invoke `$skill-creator`.

## Prompt

Use `$skill-creator` to create and validate a repo-scoped Codex skill:

`.agents/skills/swing-sync-story-delivery/`

Do not modify the existing home-directory generic skills. This Swing Sync skill
should compose and specialize them where useful:

- `multi-agent-sdlc-orchestration`
- `adversarial-review-handoff`
- `audit-response`
- `project-context-sync`
- `pr-prep`
- `app-scaffold-review` for relevant UI/application stories

The skill is repo-scoped because it contains Swing Sync-specific task statuses,
Notion workflow, safety/privacy boundaries, artifact names, and release gates
that should travel with this repository.

Before creating the skill:

1. Read `AGENTS.md`, `CONTEXT.md`, `README.md`, `package.json`,
   `docs/safety-terms.md`, `docs/privacy-architecture.md`,
   `docs/ss-002-research-disposition.md`, and
   `docs/ss-003-research-disposition.md`.
2. Inspect the Swing Sync Notion task database schema and recent completed task
   pages to confirm handshake statuses, branch fields, and role assignments.
3. Read the existing generic home skills listed above. Reference or compose
   their workflows; do not duplicate their full content.

Skill trigger:

Use for executing or coordinating a Swing Sync user story from task selection
through research/specification, implementation, adversarial audit, PR, merge,
and post-merge context synchronization.

Required workflow:

1. Start from updated `main`; read `CONTEXT.md` first.
2. Fetch the next Notion task and confirm acceptance criteria, branch, and
   handshake status.
3. Decide whether the story is safety, privacy, legal, medical, AI-coaching,
   model-provider, or compliance-sensitive.
4. For sensitive stories:
   - create a self-contained Gemini Deep Research prompt before implementation;
   - treat research as input, not authority;
   - create an Adopt / Revise / Defer / Reject disposition;
   - require Claude adversarial audit and final sign-off.
5. Draft a concise implementation plan before editing.
6. Implement within the accepted scope and preserve local-first boundaries.
7. Run targeted checks, then broader compliance/build checks appropriate to the
   changed surface.
8. Document observability impact, including an explicit unchanged/deferred
   decision when no runtime diagnostics are needed.
9. Prepare self-contained browser-chat audit prompts:
   - initial prompts may include broad necessary context;
   - re-review prompts must be separate files containing prior findings,
     applied fixes, relevant current snippets, verification, and a focused diff;
   - mark superseded prompt files with a do-not-paste redirect.
10. Address audit findings, rerun verification, and obtain Claude PASS before
    claiming Done for sensitive stories.
11. Prepare/create the PR with verification, risks, deferred work, and audit
    evidence.
12. After merge, update `main`, `CONTEXT.md`, and Notion; mark the task Done and
    identify the next task.

Boundaries:

- Never upload raw swing video by default.
- Require separate explicit opt-in before future remote sharing.
- Do not implement model assets or providers before licensing, terms, and
  privacy review.
- Do not make absolute safety, privacy, deletion, legal, anonymity, or
  compliance claims.
- Do not mark a task Done before required audit, verification, PR, and merge
  state are accurately recorded.
- Do not place generic reusable guidance in this repo skill when an existing
  home skill already owns it.

Keep `SKILL.md` concise and procedural. Add references only if they prevent
`SKILL.md` from becoming long; do not create a README or other auxiliary docs.
Create `agents/openai.yaml` with accurate UI metadata.

Validate the skill using the skill-creator validation script and run
`git diff --check`. Report:

- created files;
- trigger description;
- how the skill composes existing generic skills;
- validation results;
- any workflow detail intentionally left in `AGENTS.md` or `CONTEXT.md`.
