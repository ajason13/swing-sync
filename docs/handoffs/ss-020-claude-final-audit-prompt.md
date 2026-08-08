# SS-020 Claude Final Audit Prompt

Paste this prompt, followed immediately by
`docs/handoffs/ss-020-claude-final-audit-source-packet.md`, into Claude Chat.
The source packet is required: Claude has no repository, GitHub, or Notion
access. Do not treat this handoff as human, legal, privacy, safety, medical,
trademark, compliance, or public-release clearance.

## Role

You are the independent adversarial auditor for Swing Sync. Challenge the
release-review package and its verifier changes; do not implement, redesign,
or provide legal advice. Claude is not a qualified human reviewer and cannot
grant legal, privacy, safety, medical, trademark, compliance, or release
clearance.

## Stage

Final implementation audit before PR preparation for sensitive story SS-020.

## Scope

Review the complete focused diff from baseline
`0509999e7de5e609787fe53e8bdac2747aa0be64` to implementation commit
`eb9b7cb`, plus the post-implementation coordination update included in the
packet. Audit every changed tracked file: the 13 substantive baseline-relative
files enumerated and fully diffed by the packet (`CONTEXT.md`; SS-020 research
notes, disposition, preimplementation spec, and superseded Gemini prompt; and
the eight approved implementation files), plus these two delivery wrappers:
this prompt and the entire companion packet supplied verbatim in the chat.
Confirm the package operationalizes a future qualified-human release gate
without claiming that it, automated verification, Lead approval, research, or
Claude has cleared release.

## Context

SS-020 is a docs-only, legal/privacy/safety/medical-scope/trademark/release-
governance-sensitive story in Gated Delivery Mode. Codex research passed and
the Internal Lead marked the implementation `APPROVED FOR CLAUDE AUDIT`; those
are engineering inputs only. Qualified humans alone own future legal, privacy,
safety, medical-scope, trademark, and public-release decisions. The board must
remain `4. Final Audit (Claude)` until this audit has an appropriate verdict.

The baseline is `0509999e7de5e609787fe53e8bdac2747aa0be64`; implementation is
`eb9b7cb`; prior SS-020 commits are `845a532`, `03f18d4`, `913718c`, and
`a802532`. There is no PR and no human sign-off. The historical Gemini prompt
is intentionally retained as superseded evidence, not an active gate.

## Acceptance criteria

- Inventory public safety, privacy, export, medical-scope, non-affiliation,
  and limitation language.
- Provide a qualified-human checklist with open decisions and required
  sign-off before public release.
- Keep SS-002 assumption-of-risk and release-of-liability language flagged for
  qualified legal/human review.
- Avoid absolute privacy, safety, deletion, anonymity, medical, legal,
  compliance, and trademark-clearance claims.
- Record whether README, limitations, and contributor wording require separate
  human review before broader publication.

## Protected boundaries

- Do not convert drafts, AI output, or verifier results into approved policy or
  clearance; do not give legal advice.
- No runtime feature, dependency, licensing, SBOM, bundle, model/provider,
  telemetry, logging, diagnostics, cloud storage, remote sharing, persistence,
  data-flow, export-format, or deployment change is authorized.
- Raw swing video remains local by default; remote sharing needs separate,
  explicit opt-in. Preserve existing consent and protected safety/privacy copy.
- Runtime observability is unchanged. The nine untracked
  `docs/agent-guidance/` files are protected, intentionally excluded, and must
  remain untouched.
- The verifier may extend only existing declarative registries and injected
  reader paths; no parallel verifier or policy parser. Historical packets are
  repository evidence and must not be normalized.

## Relevant source contents or complete focused diffs

The companion source packet contains a manifest, SHA-256/line/byte metadata,
and the complete focused unified diff for the 13 substantive baseline-relative
files. The two wrapper artifacts are supplied verbatim: this prompt first and
then the complete packet itself, avoiding a circular self-diff. Assess the
source itself, not summaries alone. It also records the protected unchanged
runtime/observability boundary and excluded untracked files.

## Verification

Node `22.22.3` evidence, supplied by the implementation owner:

- `npm run test:unit -- docs-claims --reporter=verbose` — PASS, 36/36 targeted
  docs-claims tests.
- `npm run docs:verify` — PASS.
- `npm run safety:verify` — PASS.
- `npm run privacy:verify` — PASS.
- `npm run compliance:verify` — PASS.
- `npm run build` — PASS.
- `git diff --check` — PASS.

Test evidence is intended to cover declarative registration, missing inputs,
formatting changes, empty values, embedded delimiters, fail-closed behavior,
and positive paths. Verify whether the provided diff actually supports that
claim and identify gaps.

## Known non-goals

No qualified-human decision/signature; no SS-002 rewrite; no jurisdiction,
territory, audience, business, host, trademark, or publication decision; no
SS-021 deletion UX; no SS-022 accuracy validation; no runtime-copy changes
beyond the approved bounded documentation correction; and no PR, merge, or
release action.

## Output required

Return exactly one verdict: `PASS`, `PASS WITH MINOR FIXES`, or `FAIL`.

- List blockers first, ordered by severity, with file/line evidence and minimal
  remediation. State `none` when there are none.
- List non-blocking recommendations separately from future work.
- Identify missing or weak test/verification evidence and any fail-open,
  cross-file, claim-drift, protected-boundary, or human-clearance risk.
- State explicitly whether PR preparation is permitted: only `PASS` with no
  blockers may say `PR PREPARATION PERMITTED`; otherwise say `PR PREPARATION
  NOT PERMITTED`.
- Reiterate that this is not human/legal/privacy/safety/medical/trademark/
  compliance/public-release clearance.
