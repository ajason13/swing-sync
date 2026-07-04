---
name: swing-sync-story-delivery
description: Execute or coordinate a Swing Sync user story from Notion task selection through research/specification, implementation, Claude adversarial audit, pull request, merge, and post-merge context synchronization. Use for Swing Sync story kickoff, delivery, audit response, PR preparation, merge readiness, or task-status handoff work.
---

# Swing Sync Story Delivery

Deliver one accepted Swing Sync story while keeping repository, Notion, audit,
and release state aligned. Read `AGENTS.md` for durable repository boundaries
and `CONTEXT.md` for current state before proceeding.

## Compose Generic Skills

Use the existing generic skills instead of duplicating their guidance:

- Use `$multi-agent-sdlc-orchestration` for role boundaries, handoff contracts,
  observability decisions, and completion discipline.
- Use `$adversarial-review-handoff` to prepare Claude audit prompts.
- Use `$audit-response` to assess and resolve Claude findings.
- Use `$project-context-sync` when repository, PR, audit, merge, or next-task
  state changes.
- Use `$pr-prep` to inspect the diff and prepare or create a PR.
- Use `$app-scaffold-review` for UI, PWA, frontend, or application-shell
  stories.

## Run The Story

1. **Establish current state**
   - Start from updated `main` unless the user explicitly directs otherwise.
   - Read `CONTEXT.md`, inspect the worktree, and preserve unrelated changes.
   - Fetch the next Swing Sync Notion task. Confirm acceptance criteria,
     `Branch`, `Handshake Status`, and any existing `Pull Request`.
   - Use the Notion handshake values exactly:
     `0. Backlog`, `1. Spec Drafting (Gemini)`, `2. QA Planning (Claude)`,
     `3. In Development (ChatGPT)`, `4. Final Audit (Claude)`, `5. Done`.

2. **Classify and plan**
   - Identify whether the story is safety, privacy, legal, medical,
     AI-coaching, model-provider, or compliance-sensitive.
   - Draft a concise implementation plan before editing.
   - Keep current acceptance criteria separate from future work.

3. **Prepare sensitive-story specification**
   - Keep roles explicit: Gemini researches/specifies, Codex implements and
     verifies, and Claude audits and signs off.
   - Create a self-contained browser-chat Gemini prompt before implementation,
     normally `docs/ss-###-gemini-research-prompt.md`.
   - Treat Gemini output as research input, not authority. Verify important
     claims against primary sources and record broad recommendations as Adopt,
     Revise, Defer, or Reject in `docs/ss-###-research-disposition.md`.
   - Do not implement until blocking specification or QA findings are resolved.

4. **Implement and verify**
   - Implement only the accepted scope and preserve the boundaries in
     `docs/privacy-architecture.md`, `docs/safety-terms.md`,
     `docs/licensing.md`, and `docs/models-licensing.md`.
   - Run targeted checks first, then the build/compliance checks required by
     `AGENTS.md` and the changed surface.
   - Record commands and results. For runtime work, explicitly document whether
     observability was added, unchanged, or deferred.

5. **Audit and respond**
   - For sensitive stories, create a self-contained Claude audit prompt,
     normally `docs/ss-###-claude-audit-prompt.md`, and move the task to
     `4. Final Audit (Claude)` when implementation is ready.
   - Browser-chat prompts must embed required repository context because Gemini
     and Claude Chat do not have filesystem or GitHub access.
   - Every Claude prompt, including QA planning, final audit, and focused
     re-review prompts, must use the standard adversarial-review skeleton:
     Role, Stage, Scope, Context, Acceptance criteria, Protected boundaries,
     Relevant source contents or focused diff, Verification, Known non-goals,
     and Output required.
   - For source-sensitive review, summaries alone are insufficient. Include the
     exact relevant file contents or a complete focused diff for every file
     Claude must evaluate. If full files are too large, include the smallest
     complete coherent excerpts with file paths and state what was omitted and
     why.
   - Resolve findings with `$audit-response`, rerun relevant verification, and
     obtain Claude PASS before claiming the sensitive story is Done.
   - After fixes, create a separate focused
     `docs/ss-###-claude-rereview-prompt.md` containing prior findings, applied
     fixes, relevant current snippets, verification, and a focused diff. Mark
     superseded prompt files with a clear do-not-paste redirect.
   - When Claude flags a gap that is likely to recur, update the story spec,
     test plan, and durable guidance before implementation resumes. Do not
     depend on the current chat thread as the only memory of the rule.
   - For source-sensitive audits, enumerate every changed tracked file in the
     prompt. Include the full focused diff for coordination files such as
     `CONTEXT.md` when they changed, or state exactly why a changed file is
     outside the audit scope.
   - For verifier changes, specify the shared registration/config mechanism
     before implementation. Prefer extending existing declarative config and
     injected file-reader paths over one-off checks. If cross-file assertions
     are needed, name them in the config and test source-read, target-read,
     failure, and positive paths.
   - For parser or extractor logic in verification scripts, add adversarial
     unit tests for source formatting, missing inputs, empty values, embedded
     delimiters, and fail-closed behavior. Named verbose test output should be
     available when the audit depends on coverage evidence.

6. **Prepare PR and synchronize**
   - Use `$pr-prep`; include scope, verification, risk, deferred work, audit
     evidence, and observability impact. Complete
     `.github/pull_request_template.md`.
   - Record the PR URL and accurate handshake state in Notion and `CONTEXT.md`.
   - Do not set `5. Done` before required audit, verification, PR, and merge
     state are accurately recorded.
   - After merge, update local `main`, synchronize `CONTEXT.md` and Notion, mark
     the task Done, and identify the next task and branch.
   - Treat PR creation, merge, and post-merge context synchronization as
     separate state changes. Record the PR URL before merge, then record the
     merge commit and final Notion `5. Done` state after merge.

## Learn From Feedback

Use audit and reviewer feedback as process input:

- Convert one-off findings into the smallest durable rule that would have
  prevented the issue.
- Put behavior-specific protection in tests or verification scripts when
  possible; put workflow-specific protection in `AGENTS.md`, this skill, or
  `CONTEXT.md`.
- Keep blocker fixes separate from non-blocking recommendations and future
  hardening so current acceptance criteria do not silently expand.
- When a new helper, verifier category, parser, or checklist is introduced
  during implementation, either add it to the reviewed spec and test evidence
  or defer it. Unreviewed "helpful" mechanisms create avoidable audit churn.
- For sensitive documentation stories, prefer a single source of truth plus
  automated non-duplication checks over duplicating security, privacy, or
  deployment values in prose.

## Enforce Swing Sync Gates

- Never upload raw swing video by default; require separate explicit opt-in
  before remote sharing.
- Do not implement model assets, SDKs, or providers before license, terms, and
  privacy review.
- Do not make absolute safety, privacy, deletion, legal, anonymity, or
  compliance claims.
- Do not claim completion when tests, audit findings, PR state, or Notion state
  disagree.
