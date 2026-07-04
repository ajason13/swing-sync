# SS-017 Claude Focused Implementation Re-Review Prompt

Paste this prompt into Claude for focused implementation re-review. Claude Chat
does not have repository, filesystem, GitHub, or Notion access, so this prompt
is self-contained.

```text
Role: You are the lead implementation auditor for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Focused final-audit re-review after implementation audit FAIL.

Scope: Re-review only B9-B11, the applied fixes, and any cross-cutting risk
introduced by those fixes. B1-B8 were closed before implementation and do not
need reopening unless a B9-B11 response regresses them.

Context:
SS-017 documents current frontend-only/no-backend production posture,
deployer-owned security headers, and future backend architecture gates. The
implementation is docs/verifier/tests/project-memory only. It must not add
backend behavior, auth, accounts, secrets, telemetry, analytics, remote
logging, cloud storage, provider SDKs, model providers, remote sharing, or
runtime behavior.

Prior implementation audit findings:
- B9: `CONTEXT.md` had a substantial diff that was not included in the audit
  prompt.
- B10: the new `terms` verifier mechanism was not explained in audit evidence,
  and the production-header overclaim guard was too narrow.
- B11: test evidence was a pass count rather than a named checklist mapped to
  B1-B8.

Applied fixes:
- B9: `CONTEXT.md` is identified as internal project memory required by
  AGENTS.md and the Swing Sync workflow, not public/user-facing documentation.
  Its diff is included below for review.
- B10: `terms` remains in place because the accepted spec required deployment
  required-term enforcement. The spec now explicitly records the tradeoff:
  required deployment terms are case-insensitive substring checks for the
  approved doc, not a semantic language policy; future intentional rephrasing
  must update verifier and tests in the same reviewed change. Added a missing
  required deployment term test. Broadened production-header overclaim patterns
  to include:
  - `swing sync is deployed with hsts`
  - `swing sync is protected by production http security headers`
  - `swing sync ships with csp enforced in production`
  - `production headers are already configured`
  - `production security headers are configured`
  - `hsts is enabled in production`
  - `csp is enforced in production`
  - `content-security-policy is enforced in production`
- B11: Verbose named test output is included below and mapped to B1-B8/B10.

CONTEXT.md diff:
```diff
diff --git a/CONTEXT.md b/CONTEXT.md
index 8363e12..5da71cb 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -21,6 +21,217 @@ Last updated: 2026-07-03
 - Remaining visible non-Done backlog tasks: SS-017 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.

+## SS-017 Coordination
+
+SS-017 is privacy-, security-, deployment-, docs-claim-, compliance-, and
+user-facing-copy-sensitive. It is a documentation and verification story to
+capture the current frontend-only/no-backend production posture,
+deployer-owned security-header requirements, and future backend architecture
+review gates. Treat it as gated: Codex owns research/spec drafting under the
+current routing, and Claude remains the independent QA planning and final
+adversarial audit reviewer.
+
+Acceptance criteria from Notion:
+
+- Document the current no-backend production posture and what that means for
+  auth, accounts, secrets, rate limiting, server logs, and data retention.
+- Define the minimum production hosting requirements for security headers,
+  including moving CSP from meta-only posture to deployer-owned HTTP headers
+  where hosting supports them.
+- Preserve the local-first rule: raw swing video is not uploaded by default
+  and remote sharing requires separate explicit opt-in.
+- Identify which future features would require a separate backend architecture
+  review before implementation.
+- Update README or deployment docs with clear local/dev versus
+  production-hosting instructions.
+
+Kickoff/spec state on 2026-07-03:
+
+- Local `main` and `origin/main` were confirmed at
+  `5ad008b1b2fb1695511dd7cafc24f4e43f2d9b72`.
+- Worktree was clean before selection except for intentional untracked
+  `docs/agent-guidance/*new-codex-session-prompt.md` files, which remain
+  preserved.
+- Notion page:
+  https://app.notion.com/p/392834a0c8a68182a201f7b30fa45954
+- Branch from current `main`: `ss-017-production-deployment-boundary`.
+- Pull Request: none.
+- Task Type: `Feature`.
+- Notion task fields were verified before branching: Name
+  `SS-017 Document production deployment, backend boundary, and security-header
+  posture`, Branch `ss-017-production-deployment-boundary`, Handshake Status
+  `0. Backlog`, Pull Request empty, Task Type `Feature`, and the acceptance
+  criteria above.
+- Notion was moved to `1. Spec Drafting (Gemini)` for board compatibility,
+  with Codex noted as research/spec owner under current routing.
+- Existing `SS-TC-017` was inspected and found to belong to SS-014 fixture
+  policy coverage, not SS-017 deployment/security-header coverage.
+- Dedicated test case `SS-TC-021` was created:
+  https://app.notion.com/p/392834a0c8a68199983fc7bc1720ef2f
+- `SS-TC-021` covers current frontend-only/no-backend posture,
+  auth/accounts/secrets/rate-limiting/server-log/data-retention implications,
+  deployer-owned HTTP security headers and CSP migration from meta-only
+  posture, local-first raw-video/no-default-upload boundaries, future backend
+  architecture review triggers, local/dev versus production-hosting
+  instructions, and protected no-backend/no-remote-service/no-absolute-claim
+  boundaries.
+- Codex-owned research/disposition note:
+  `docs/ss-017-research-disposition.md`.
+- Candidate preimplementation spec:
+  `docs/ss-017-preimplementation-spec.md`.
+- Self-contained Claude QA planning handoff:
+  `docs/ss-017-claude-qa-planning-prompt.md`.
+- Source checks were recorded against `README.md`, `index.html`,
+  `docs/privacy-architecture.md`, `docs/safety-terms.md`,
+  `scripts/verify-docs-claims.js`, MDN security-header references, and W3C CSP
+  meta-policy delivery limitations.
+- Codex dispositions adopt a new `docs/deployment.md`, README link/update,
+  `docs:verify` enforcement for deployment docs, explicit no-backend
+  implications, deployer-owned production HTTP security headers, and exact
+  local-first no-default-upload/explicit-remote-opt-in wording; revise security
+  header wording to defense-in-depth language without guarantees; defer real
+  host configuration and backend/reporting architecture to future reviewed
+  stories; reject adding backend, auth, accounts, secrets, telemetry,
+  analytics, remote logging, cloud storage, provider SDKs, model providers,
+  remote sharing, CSP reporting endpoints, NEL, or absolute privacy/security/
+  compliance/deletion/anonymity/medical/trademark-clearance claims.
+- Observability decision: SS-017 is docs-only. Do not implement runtime
+  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
+  collection, NEL, Reporting API endpoints, or persistent debug artifacts.
+- Notion moved to `2. QA Planning (Claude)` after Codex completed the
+  research/spec artifacts and Claude QA planning prompt.
+- `git diff --check` PASS for the kickoff/spec package.
+- Claude QA planning returned FAIL with five blockers:
+  - B1: `docs/deployment.md` needed a required draft/pending-review
+    disclaimer and canonical no-guarantee wording.
+  - B2: the docs verifier needed a dedicated security-guarantee overclaim
+    category.
+  - B3: the verifier-extension mechanism needed to require the existing shared
+    config path instead of bespoke deployment-doc logic.
+  - B4: the verification plan needed to explicitly execute the new/updated
+    docs-claim unit tests.
+  - B5: the spec needed to prevent drift between deployment CSP prose and the
+    actual meta CSP in `index.html`.
+- Claude QA response record:
+  `docs/ss-017-claude-qa-response.md`.
+- Codex accepted B1-B5 as valid and revised
+  `docs/ss-017-preimplementation-spec.md`: `docs/deployment.md` now requires
+  a canonical draft-review banner and no-guarantee string; `docs:verify` must
+  add a separate security-guarantee prohibited-claim category with negative
+  fixtures; deployment docs must be registered through the existing
+  `files`/`requiredStrings`/`links`/`bannedPatterns`/`negativeFixtures`
+  verifier config path; `npm run test:unit -- docs-claims` and
+  `git diff --stat` are required verification evidence; and the deployment doc
+  must not duplicate the literal `index.html` CSP directive string unless the
+  verifier reads `index.html` and proves consistency.
+- The initial Claude QA planning prompt is superseded for paste use. Focused
+  B1-B5 re-review prompt:
+  `docs/ss-017-claude-qa-rereview-prompt.md`.
+- Claude focused B1-B5 re-review returned FAIL with one new blocker after
+  closing B1-B5:
+  - B6: the cross-file CSP non-duplication check needed a named
+    config-driven mechanism instead of leaving Codex to choose between
+    declarative config and a bespoke one-off helper.
+- Codex accepted B6 as valid and revised
+  `docs/ss-017-preimplementation-spec.md`: `docs:verify` must add a named
+  declarative `crossFileChecks` config array; the SS-017 entry must read
+  injected `index.html`, extract the CSP meta `content` attribute, require a
+  non-empty extracted value, and reject that exact string in
+  `docs/deployment.md`; `verifyDocsClaims(fileReader)` remains the single
+  injection point and must cover injected `index.html` in unit tests. The spec
+  also now requires deterministic draft-review banner placement under
+  `## Draft Review Status`, varied-case/punctuation security-overclaim tests,
+  and an approved-doc regression proving the no-guarantee string does not trip
+  the security-overclaim category.
+- The focused B1-B5 re-review prompt is superseded for paste use. Focused
+  B6-only re-review prompt:
+  `docs/ss-017-claude-qa-b6-rereview-prompt.md`.
+- Claude focused B6 re-review returned FAIL with one new blocker after closing
+  B6 at the architecture level:
+  - B7: CSP extraction from `index.html` needed robust, fail-closed behavior
+    for the actual multiline tag format, attribute order/whitespace variation,
+    and no-match cases.
+- Codex accepted B7 as valid and revised
+  `docs/ss-017-preimplementation-spec.md`: the `crossFileChecks` CSP
+  extraction must tolerate `http-equiv` and `content` attributes in either
+  order, arbitrary whitespace/newlines, and single- or double-quoted
+  attributes; it must fail closed with a structured `docs:verify` error when
+  no matching CSP meta tag is found, when `content` cannot be extracted, or
+  when the extracted value is empty. Required tests now cover reordered/
+  whitespace-varied fake `index.html`, missing CSP meta tag, empty `content`,
+  and missing extractable `content` cases.
+- The focused B6 re-review prompt is superseded for paste use. Focused
+  B7-only re-review prompt:
+  `docs/ss-017-claude-qa-b7-rereview-prompt.md`.
+- Claude focused B7 re-review returned FAIL with one new blocker after closing
+  B7:
+  - B8: quote-tolerant CSP extraction needed matched-quote-pair behavior
+    because the actual `index.html` CSP is a double-quoted attribute
+    containing embedded single quotes such as `'self'`.
+- Codex accepted B8 as valid and revised
+  `docs/ss-017-preimplementation-spec.md`: CSP `content` extraction must use
+  matched quote pairs, where the closing quote is the same character as the
+  opening quote; double-quoted values containing embedded single quotes and
+  single-quoted values containing embedded double quotes must extract the full
+  value; duplication tests must use the full correctly extracted real-shaped
+  CSP string; and exact extracted-string containment is the intentional
+  automated scope for SS-017 while whitespace-normalized or semantic CSP
+  equivalence remains manual review or future work.
+- The focused B7 re-review prompt is superseded for paste use. Focused
+  B8-only re-review prompt:
+  `docs/ss-017-claude-qa-b8-rereview-prompt.md`.
+- Claude focused B8 re-review returned PASS. B1-B8 are closed, no new blockers
+  were introduced, and SS-017 was cleared for implementation.
+- Notion moved to `3. In Development (ChatGPT)` after the B8 PASS.
+- Codex implemented the approved docs/verifier/test scope:
+  - `docs/deployment.md` documents current frontend-only/no-backend production
+    posture, no-backend implications for auth/accounts/secrets/rate limiting/
+    server logs/data retention, local development versus production hosting,
+    deployer-owned HTTP security-header requirements, local-first data
+    boundaries, backend architecture review gates, SS-017 non-goals, and
+    verification commands.
+  - `README.md` clarifies setup commands are local development commands and
+    links `docs/deployment.md`.
+  - `scripts/verify-docs-claims.js` registers `docs/deployment.md` in the
+    shared file config, adds canonical deployment strings, README deployment
+    link enforcement, required deployment terms, deterministic draft-banner
+    placement, a dedicated security-guarantee prohibited-claim category,
+    production-header overclaim checks, exact allowed units for approved
+    protected-boundary lists, and declarative `crossFileChecks` for CSP
+    non-duplication against `index.html`.
+  - `test/unit/docs-claims.test.ts` covers approved docs success, missing
+    deployment doc, missing heading/string/link/banner placement, security and
+    production-header overclaims, fake injected CSP duplication, reordered/
+    whitespace-varied CSP extraction, fail-closed missing/empty/unextractable
+    CSP cases, and matched-quote extraction with embedded quotes.
+- Runtime observability decision: SS-017 is docs/verifier-only. No runtime
+  logging, telemetry, analytics, remote logging, cloud diagnostics, CSP report
+  collection, NEL, Reporting API endpoints, or persistent debug artifacts were
+  added.
+- No backend, auth, accounts, secrets, server routes, hosted functions, cloud
+  storage, provider SDKs, model providers, remote sharing, runtime behavior,
+  dependencies, bundle policy, license policy, notice, or SBOM changes were
+  added.
+- Verification on 2026-07-03 under Node v22.22.3:
+  - `npm run test:unit -- docs-claims` PASS (13 tests).
+  - `npm run docs:verify` PASS (`docs:verify passed`).
+  - `npm run safety:verify` PASS.
+  - `npm run privacy:verify` PASS.
+  - `npm run compliance:verify` PASS.
+  - `npm run build` PASS.
+  - `git diff --check` PASS.
+  - `git diff --stat` captured tracked-file scope. Note: untracked new files,
+    including `docs/deployment.md` and SS-017 planning/audit prompts, are not
+    listed by `git diff --stat`; preserved untracked
+    `docs/agent-guidance/*new-codex-session-prompt.md` files remain untouched.
+- Final Claude implementation audit handoff:
+  `docs/ss-017-claude-audit-prompt.md`.
+- Notion moved to `4. Final Audit (Claude)`.
+
+Next owner: Claude final implementation audit. Keep SS-017 at
+`4. Final Audit (Claude)` until Claude PASS, any required fixes/re-review,
+PR preparation, and merge state are accurately recorded.
```

Verifier/test focused diff after B10:
```diff
diff --git a/scripts/verify-docs-claims.js b/scripts/verify-docs-claims.js
@@
   "production header overclaim": [
     "swing sync is deployed with hsts",
     "swing sync is protected by production http security headers",
+    "swing sync ships with csp enforced in production",
+    "production headers are already configured",
+    "production security headers are configured",
+    "hsts is enabled in production",
+    "csp is enforced in production",
+    "content-security-policy is enforced in production",
   ],
@@
   "production header overclaim":
-    "Swing Sync is deployed with HSTS and is protected by production HTTP security headers.",
+    "Swing Sync ships with CSP enforced in production and production headers are already configured.",

diff --git a/test/unit/docs-claims.test.ts b/test/unit/docs-claims.test.ts
@@
+  it("rejects missing required deployment terms", () => {
+    const content = without(currentDocs["docs/deployment.md"], "rate limiting");
+
+    expect(errorsFor({ "docs/deployment.md": content })).toContain(
+      "docs/deployment.md: missing required term rate limiting"
+    );
+  });
@@
   it("rejects production header overclaims", () => {
-    const content = `${currentDocs["docs/deployment.md"]}\n\nSwing Sync is protected by production HTTP security headers.`;
+    const content =
+      `${currentDocs["docs/deployment.md"]}\n\n` +
+      "Swing Sync is protected by production HTTP security headers. " +
+      "Swing Sync ships with CSP enforced in production. " +
+      "Production headers are already configured.";
```

Named test output after B10:
```text
$ npx vitest run test/unit/docs-claims.test.ts --reporter verbose
✓ test/unit/docs-claims.test.ts > docs claim verification > accepts the current approved public docs
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing required public docs
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing required headings
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing canonical strings
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing required deployment terms
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing required links
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects missing draft banners with structured errors
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects deployment draft banners outside the draft status section
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects deployment security overclaims
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects production header overclaims
✓ test/unit/docs-claims.test.ts > docs claim verification > rejects duplicated CSP directives from an injected index file
✓ test/unit/docs-claims.test.ts > docs claim verification > extracts CSP directives with reordered attributes and varied whitespace
✓ test/unit/docs-claims.test.ts > docs claim verification > fails closed when CSP extraction cannot establish a source value
✓ test/unit/docs-claims.test.ts > docs claim verification > extracts CSP directives with matched quote pairs around embedded quotes
Test Files  1 passed (1)
Tests  14 passed (14)
```

Test mapping:
- B1: `accepts the current approved public docs`, `rejects missing draft
  banners with structured errors`, `rejects deployment draft banners outside
  the draft status section`, `rejects missing canonical strings`.
- B2: `rejects deployment security overclaims`, plus `accepts the current
  approved public docs` proving the no-guarantee string does not trip the
  security-overclaim category.
- B3: `accepts the current approved public docs` and every `errorsFor(...)`
  negative test exercise the shared `verifyDocsClaims(fileReader)` injection
  path.
- B4: named test execution shown above.
- B5/B6: `rejects duplicated CSP directives from an injected index file`.
- B7: `extracts CSP directives with reordered attributes and varied whitespace`
  and `fails closed when CSP extraction cannot establish a source value`.
- B8: `extracts CSP directives with matched quote pairs around embedded
  quotes`.
- B10: `rejects missing required deployment terms` and `rejects production
  header overclaims`.

Verification after B9-B11 response under Node v22.22.3:
```text
npm run test:unit -- docs-claims -- --reporter verbose  PASS (14 tests)
npx vitest run test/unit/docs-claims.test.ts --reporter verbose  PASS (14 tests with names)
npm run docs:verify  PASS
npm run safety:verify  PASS
npm run privacy:verify  PASS
npm run compliance:verify  PASS
npm run build  PASS
git diff --check  PASS
git diff --stat  captured tracked-file scope
```

Known non-goals still preserved:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, remote sharing, or runtime
  behavior.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.
- No dependency, bundle, license-policy, notice, or SBOM changes.

Output required:
- PASS/FAIL verdict for B9-B11.
- Any remaining blockers, ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether SS-017 may proceed to PR preparation.
```
