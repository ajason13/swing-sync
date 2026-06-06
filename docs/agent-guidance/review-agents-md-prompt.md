# Review Swing Sync AGENTS.md Prompt

Use this prompt with Codex from the Swing Sync repository root.

## Prompt

Review and tighten `AGENTS.md` for Swing Sync.

Goal: produce a concise repository-level instruction file that gives agents
durable project rules without duplicating `README.md`, `CONTEXT.md`, detailed
story workflows, or general software-engineering advice.

Before editing:

1. Read `AGENTS.md`, `README.md`, `CONTEXT.md`, `package.json`,
   `docs/safety-terms.md`, `docs/privacy-architecture.md`,
   `docs/licensing.md`, and `docs/models-licensing.md`.
2. Inspect the current repository structure and verify every referenced path,
   command, workflow, and pull-request template actually exists.
3. Check Notion only if needed to verify the current Swing Sync task workflow.

Keep `AGENTS.md` focused on stable repository rules:

- Read `CONTEXT.md` before starting and sync it after PR/merge state changes.
- Confirm the next task, branch, and handshake status in Notion.
- Keep Gemini, Codex, and Claude roles explicit for safety, privacy, legal,
  medical, AI-coaching, model-provider, or compliance-sensitive stories.
- Treat Gemini research as input; disposition broad recommendations as Adopt,
  Revise, Defer, or Reject before implementation.
- Require Claude adversarial review before Done for sensitive stories, and use a
  focused separate re-review prompt after fixes.
- Browser-chat prompts must embed required repository context because Gemini
  and Claude Chat do not have filesystem or GitHub access.
- Preserve local-first boundaries: raw swing video is not uploaded by default,
  and remote sharing requires separate explicit opt-in.
- Avoid absolute privacy, safety, legal, deletion, anonymity, or compliance
  claims.
- Run the commands required by the changed surface and record verification.
- Keep changes scoped and document observability impact for runtime work.

Do not put the full multi-agent story-delivery procedure in `AGENTS.md`; that
belongs in the repo skill at
`.agents/skills/swing-sync-story-delivery/SKILL.md`.

Remove inaccurate, redundant, overly specific, or speculative guidance. Keep
the final file short enough to scan quickly. Prefer links to authoritative repo
docs over copied policy text.

After editing:

- Run `git diff --check`.
- Report removed inaccuracies, retained rules, and any guidance intentionally
  delegated to the repo skill.
