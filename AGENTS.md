# Swing Sync Repository Guidance

## Product boundaries

Swing Sync is local-first. Raw swing video is not uploaded by default; any
remote sharing requires a separate, explicit opt-in. Do not make absolute
privacy, safety, legal, deletion, anonymity, or compliance claims.

Follow `docs/privacy-architecture.md`, `docs/safety-terms.md`,
`docs/licensing.md`, and `docs/models-licensing.md` when the task touches their
subject. Any connected model or coaching feature must avoid medical diagnosis,
pain triage, and aggressive mechanical prescriptions.

## Working loop

1. Check `git status --short --branch`; inspect only task-relevant files.
2. Make the smallest complete change and preserve local-first constraints.
3. Run the checks that cover the changed surface and review the final diff.
4. Report verification, observability impact, assumptions, and residual risk.

Use a fresh-context Codex review after implementation for safety, privacy,
legal, licensing, model-provider, public-contract, release, or requested-review
work. Do not require Notion, Claude, Gemini, or another external-model handoff.

## Verification

Use Node 22 from `.nvmrc`.

- Baseline runtime or docs changes: `npm run build` and
  `npm run compliance:verify`.
- Dependency or licensing changes: also run `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.
- Safety or privacy changes: also run `npm run safety:verify` or
  `npm run privacy:verify`.
- Tests: `npm run test:unit` or `npm run test:smoke` when the changed surface
  requires them.

Historical handoffs live in `docs/history/` and are not default task context.
Read a specific record only when it is relevant to the task.
