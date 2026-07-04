# SS-017 Claude QA B7 Re-Review Prompt

Superseded for paste use by
`docs/ss-017-claude-qa-b8-rereview-prompt.md` after Claude Round 4 closed B7
and returned FAIL on B8. Keep this file as the focused B7 re-review record.

Paste this prompt into Claude for focused B7 preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused B7-only pre-implementation QA re-review.

Scope: Re-review only B7 and the spec changes made to close it, plus any
cross-cutting risk introduced by those changes. B1-B5 were closed in Round 2,
and B6 was closed at the architecture level in Round 3.

Context:
Swing Sync is a local-first browser app. The current app has no application
backend, auth, accounts, server routes, API keys, cloud storage, hosted
analytics, telemetry, remote logging, configured remote model providers,
provider SDKs, or active hosted-model calls. SS-017 is a docs and verification
story only.

Acceptance criteria:
- Document the current no-backend production posture and what that means for
  auth, accounts, secrets, rate limiting, server logs, and data retention.
- Define the minimum production hosting requirements for security headers,
  including moving CSP from meta-only posture to deployer-owned HTTP headers
  where hosting supports them.
- Preserve the local-first rule: raw swing video is not uploaded by default
  and remote sharing requires separate explicit opt-in.
- Identify which future features would require a separate backend architecture
  review before implementation.
- Update README or deployment docs with clear local/dev versus
  production-hosting instructions.

Protected boundaries:
- Do not add a backend, auth, accounts, secrets, telemetry, analytics, remote
  logging, cloud storage, provider SDKs, model providers, or remote sharing.
- Do not make legal, compliance, security, privacy, deletion, anonymity,
  medical, or trademark-clearance guarantees.

Prior review status:
- Round 2: B1-B5 closed; B6 opened.
- Round 3: B6 closed at the architecture level; B7 opened.
- B7: CSP extraction from `index.html` was not specified to be robust or
  fail-closed against the actual multiline source format. The spec needed to
  state that extraction tolerates attribute order, whitespace/newlines, and
  quote-style variation, and that no match fails loudly instead of no-oping.

Applied B7 fix:
The `crossFileChecks` spec now requires the SS-017 entry to:

- read source file `index.html`;
- extract the literal `content` attribute from the
  `<meta http-equiv="Content-Security-Policy" ...>` tag;
- tolerate `http-equiv` and `content` attributes in either order, with
  arbitrary whitespace or newlines between attributes, matching the current
  multiline `index.html` tag format;
- tolerate single-quoted or double-quoted attribute values;
- fail closed with a structured `docs:verify` error if no matching CSP meta
  tag is found, if the `content` attribute cannot be extracted, or if the
  extracted value is empty;
- check target file `docs/deployment.md`;
- fail if the target file contains that exact extracted directive string.

The unit-test requirements now include:

- duplicating a fake injected `index.html` meta CSP directive string in
  `docs/deployment.md` fails through `verifyDocsClaims(fileReader)`, proving
  the cross-file check is independent of the real current CSP value;
- a reordered or whitespace-varied fake `index.html` CSP meta tag still
  extracts correctly, including `content` before `http-equiv`, extra
  newlines, and single-quoted or double-quoted attributes;
- fake `index.html` with no CSP meta tag fails loudly through
  `verifyDocsClaims(fileReader)`;
- fake `index.html` with a CSP meta tag but `content=""` fails loudly through
  `verifyDocsClaims(fileReader)`;
- fake `index.html` with the CSP meta tag present but no extractable `content`
  attribute fails loudly through `verifyDocsClaims(fileReader)`.

Known non-goals:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, or remote sharing.
- No runtime behavior changes.
- No production hosting provider configuration files until a host is selected.
- No CSP reporting endpoints, NEL, Reporting API endpoints, or remote
  diagnostic collection.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.

Verification so far:
- Spec artifacts only; implementation has not started.
- `git diff --check` will be rerun after this prompt is saved.

Output required:
- PASS or FAIL verdict for whether B7 is closed.
- Any new blockers introduced by the B7 spec changes, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may implement.
```
