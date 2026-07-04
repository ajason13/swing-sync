# SS-017 Claude QA B8 Re-Review Prompt

Paste this prompt into Claude for focused B8 preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused B8-only pre-implementation QA re-review.

Scope: Re-review only B8 and the spec changes made to close it, plus any
cross-cutting risk introduced by those changes. B1-B5 were closed in Round 2,
B6 was closed at the architecture level in Round 3, and B7 was closed in
Round 4.

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
- Round 4: B7 closed; B8 opened.
- B8: quote-tolerant CSP extraction needed matched-quote-pair behavior because
  the actual `index.html` CSP is a double-quoted attribute containing embedded
  single quotes such as `'self'`.

Applied B8 fix:
The `crossFileChecks` spec now requires the SS-017 entry to:

- tolerate single-quoted or double-quoted attribute values using
  matched-quote-pair extraction: the closing quote must be the same character
  as the opening quote, so a double-quoted CSP value containing embedded
  single quotes such as `default-src 'self'` extracts the full value instead
  of a truncated fragment;
- continue to fail closed with a structured `docs:verify` error if no matching
  CSP meta tag is found, if the `content` attribute cannot be extracted, or if
  the extracted value is empty;
- check target file `docs/deployment.md`;
- fail if the target file contains that exact extracted directive string.

The unit-test requirements now include:

- fake `index.html` with double-quoted `content` containing embedded single
  quotes, such as `content="default-src 'self'"`, extracts the full
  `default-src 'self'` value and detects duplication of the full value in
  `docs/deployment.md`;
- fake `index.html` with single-quoted `content` containing embedded double
  quotes extracts the full value and detects duplication of the full value in
  `docs/deployment.md`;
- duplication checking intentionally uses exact extracted-string containment
  for SS-017. Whitespace-normalized or substantively equivalent CSP rewrites
  are outside the automated scope for this story and remain manual review
  concerns unless a future story adds normalized CSP comparison.

Known non-goals:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, or remote sharing.
- No runtime behavior changes.
- No production hosting provider configuration files until a host is selected.
- No CSP reporting endpoints, NEL, Reporting API endpoints, or remote
  diagnostic collection.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.
- No whitespace-normalized or semantic CSP-equivalence comparison in SS-017.

Verification so far:
- Spec artifacts only; implementation has not started.
- `git diff --check` will be rerun after this prompt is saved.

Output required:
- PASS or FAIL verdict for whether B8 is closed.
- Any new blockers introduced by the B8 spec changes, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may implement.
```
