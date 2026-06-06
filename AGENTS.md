# Repository Guidelines

## Start With Current State

Read [`CONTEXT.md`](./CONTEXT.md) before starting work. Confirm the next task,
acceptance criteria, branch, and handshake status in the Swing Sync Notion task
database before implementation. After PR creation, audit results, or merge
state changes, keep Notion and `CONTEXT.md` synchronized.

Keep changes within the accepted story scope. For runtime changes, document
whether observability was added, intentionally unchanged, or deferred.

## Sensitive Story Rules

For safety, privacy, legal, medical, AI-coaching, model-provider, or
compliance-sensitive stories, keep roles explicit:

- Gemini researches and drafts specifications.
- Codex implements, verifies, and maintains repository state.
- Claude performs adversarial audit and re-review.

Treat Gemini research as input, not authority. Before implementation, classify
broad recommendations as Adopt, Revise, Defer, or Reject. Claude adversarial
review is required before a sensitive story is Done. After fixes, use a
separate focused re-review prompt containing prior findings, applied fixes,
relevant current context, verification, and a focused diff.

Browser-chat prompts must embed all required repository context; Gemini and
Claude Chat do not have filesystem or GitHub access.

## Product And Compliance Boundaries

Preserve the local-first rules in
[`docs/privacy-architecture.md`](./docs/privacy-architecture.md): raw swing
video is not uploaded by default, and remote sharing requires a separate,
explicit opt-in. Do not make absolute privacy, safety, legal, deletion,
anonymity, or compliance claims.

Follow [`docs/safety-terms.md`](./docs/safety-terms.md) for user-facing and AI
coaching boundaries. Follow [`docs/licensing.md`](./docs/licensing.md) and
[`docs/models-licensing.md`](./docs/models-licensing.md) before adding
dependencies, reference-derived code, model assets, SDKs, or providers.

## Verification

Use Node 22 from `.nvmrc`. Run the checks required by the changed surface and
record results in the PR:

- Baseline runtime/docs changes: `npm run build` and
  `npm run compliance:verify`.
- Dependency, bundle, or licensing changes: also run `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.
- Targeted boundaries: run `npm run safety:verify` or
  `npm run privacy:verify` when those surfaces change.

Complete [`.github/pull_request_template.md`](./.github/pull_request_template.md)
and preserve required notices.
