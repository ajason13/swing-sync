# SS-017 Claude QA B6 Re-Review Prompt

Superseded for paste use by
`docs/ss-017-claude-qa-b7-rereview-prompt.md` after Claude Round 3 closed B6
at the architecture level and returned FAIL on B7. Keep this file as the
focused B6 re-review record.

Paste this prompt into Claude for focused B6 preimplementation QA re-review.
Claude Chat does not have repository, filesystem, GitHub, or Notion access, so
this prompt is self-contained.

```text
Role: You are the lead adversarial QA planner for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused B6-only pre-implementation QA re-review.

Scope: Re-review only B6 and the spec changes made to close it, plus any
cross-cutting risk introduced by those changes. B1-B5 were closed in Round 2.

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
- Round 2 verdict: FAIL with one new blocker.
- B1-B5 status: closed.
- B6: Cross-file duplication check between `docs/deployment.md` and
  `index.html` was not placed inside the config-driven architecture that B3
  established. The spec needed to require a named declarative mechanism, not a
  one-off `checkCspNotDuplicated()` helper.

Applied B6 fix:
The spec now requires:

- Add a named declarative `crossFileChecks` config array for checks that derive
  a forbidden value from one file and assert it is absent from another file.
- The SS-017 `crossFileChecks` entry must:
  - read source file `index.html`;
  - extract the literal `content` attribute from the
    `<meta http-equiv="Content-Security-Policy" ...>` tag;
  - require that extracted CSP directive string to be non-empty;
  - check target file `docs/deployment.md`;
  - fail if the target file contains that exact extracted directive string.
- Keep `verifyDocsClaims(fileReader)` as the single unit-test injection point
  for positive, negative, and cross-file docs-claim tests. The injected
  `fileReader` must cover `index.html` as well as public docs in tests.
- Reject docs that duplicate the literal CSP directive string from
  `index.html` in `docs/deployment.md` through the declarative
  `crossFileChecks` entry. This avoids a second source of truth without adding
  a bespoke one-off verifier branch.

Additional B6-related test requirements now in the spec:
- duplicating a fake injected `index.html` meta CSP directive string in
  `docs/deployment.md` fails through `verifyDocsClaims(fileReader)`, proving
  the cross-file check is independent of the real current CSP value;
- deployment draft-review banner present outside `## Draft Review Status`
  fails;
- security-guarantee overclaim phrase in varied case or punctuation, such as
  `Hack-Proof` or `hack proof`, fails;
- approved `docs/deployment.md` text does not trip the security-guarantee
  category because of the required no-guarantee disclaimer.

Relevant revised spec excerpt:

```
Extend `docs:verify` through the existing shared config-driven verifier path,
not bespoke one-off logic:

- Register `docs/deployment.md` in the existing `files` object in
  `scripts/verify-docs-claims.js`.
- Register new canonical deployment strings in the existing `requiredStrings`
  object and reference them from the `docs/deployment.md` file config.
- Register deployment links from README through the existing `links` config.
- Register new prohibited security-overclaim checks in the existing
  `bannedPatterns` object.
- Register matching negative coverage in the existing `negativeFixtures`
  object.
- Add a named declarative `crossFileChecks` config array for checks that derive
  a forbidden value from one file and assert it is absent from another file.
  The SS-017 entry must:
  - read source file `index.html`;
  - extract the literal `content` attribute from the
    `<meta http-equiv="Content-Security-Policy" ...>` tag;
  - require that extracted CSP directive string to be non-empty;
  - check target file `docs/deployment.md`;
  - fail if the target file contains that exact extracted directive string.
- Keep `verifyDocsClaims(fileReader)` as the single unit-test injection point
  for positive, negative, and cross-file docs-claim tests. The injected
  `fileReader` must cover `index.html` as well as public docs in tests.
```

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
- PASS or FAIL verdict for whether B6 is closed.
- Any new blockers introduced by the B6 spec changes, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether Codex may implement.
```
