# SS-017 Claude Implementation Audit Prompt

Superseded for paste use by `docs/ss-017-claude-rereview-prompt.md` after
Claude implementation audit returned FAIL with B9-B11. Keep this file as the
initial final-audit record.

Paste this prompt into Claude for final implementation audit. Claude Chat does
not have repository, filesystem, GitHub, or Notion access, so this prompt is
self-contained.

```text
Role: You are the lead implementation auditor for Swing Sync, a local-first
browser app for educational golf swing review.

Stage: Final implementation audit.

Scope: Audit SS-017 implementation after Claude QA planning closed B1-B8. The
implementation should be docs/verifier/tests only: `docs/deployment.md`,
README link/local-dev wording, `scripts/verify-docs-claims.js`, and
`test/unit/docs-claims.test.ts`, plus project tracking artifacts.

Context:
Swing Sync is a local-first browser app. The current app has no application
backend, auth, accounts, server routes, API keys, cloud storage, hosted
analytics, telemetry, remote logging, configured remote model providers,
provider SDKs, or active hosted-model calls. SS-017 documents current
frontend-only/no-backend production posture, deployer-owned security headers,
and future backend architecture gates before public hosting or backend feature
work.

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
- Preserve local-first raw-video/no-default-upload behavior and require a
  separate explicit opt-in before any future remote sharing.

Prior QA planning status:
- Round 1 FAIL: B1-B5 opened.
- Round 2 FAIL: B1-B5 closed; B6 opened.
- Round 3 FAIL: B6 architecture closed; B7 opened.
- Round 4 FAIL: B7 closed; B8 opened.
- Round 5 PASS: B8 closed, no new blockers. Claude cleared implementation.

Relevant source contents:

File: docs/deployment.md
```markdown
# Deployment

## Draft Review Status

**DRAFT - pending human security/privacy review before public production hosting.**

This deployment guidance is product and engineering documentation, not legal,
security, privacy, deletion, anonymity, medical, trademark-clearance, or
regulatory-compliance advice or a guarantee.

## Current Production Posture

Swing Sync is currently a static frontend browser app for deployment purposes.
SS-017 does not add an application backend, server routes, hosted functions,
accounts, authentication, server-side secrets, telemetry, analytics, remote
logging, cloud storage, model providers, provider SDKs, or remote sharing.

The current production bundle is expected to be built as static files and
served by a deployer-selected static host, CDN, or web server. Hosting
configuration is outside the frontend bundle and must be reviewed for the
chosen deployment environment before public hosting.

## No-Backend Implications

The current no-backend posture means Swing Sync does not provide an app-owned
account system, login flow, role model, server session, or account
authentication boundary. The frontend bundle does not store server-side
secrets, API keys, signing keys, or tokens for server features.

Swing Sync also does not provide an app-owned server-side rate limiter,
application server logs, or Swing Sync cloud data-retention and deletion
workflow. Hosting, CDN, and platform access logs, TLS configuration, redirects,
cache behavior, and retention settings are deployer-owned concerns and are not
controlled by the frontend bundle.

## Local Development

Use local development commands for development and verification only:

```bash
nvm use
npm ci
npm run dev
```

`npm run dev` starts a local Vite development server. It is not production
hosting configuration. `npm run build` creates static output for a selected
host or web server, but the deployer still owns HTTPS, redirects, response
headers, cache behavior, and platform logging or retention settings.

## Production Hosting Requirements

Before public hosting, choose a static host or web server that can serve the
built app over HTTPS and apply reviewed response headers. Production hosting
must keep the current frontend-only and local-first boundaries unless a
separate reviewed story adds backend behavior.

Do not place app secrets, provider keys, model-provider credentials, account
tokens, telemetry endpoints, analytics collectors, remote logging sinks, cloud
storage buckets, or remote sharing destinations into production hosting as part
of SS-017.

## Security Headers

The current app keeps a meta Content Security Policy in `index.html` as
local/static defense in depth. For production hosting where response headers
are supported, move CSP enforcement to deployer-owned HTTP
`Content-Security-Policy` headers instead of relying on a meta-only posture.

HTTP CSP can cover directives that a meta policy cannot fully cover, including
`frame-ancestors`, and it avoids relying on a policy parsed after earlier
resource handling. The exact local meta CSP directive value remains in
`index.html`; this deployment page intentionally does not duplicate it.

Minimum production header review should include:

- `Content-Security-Policy`
- `Strict-Transport-Security` for HTTPS production domains
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- restrictive `Permissions-Policy`

This minimum list is not exhaustive. Future features may require additional
review for `Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`, or
`Cross-Origin-Resource-Policy`. A `Permissions-Policy` value that disables
camera, microphone, and geolocation can be a useful starting example for the
current app, but the final value is deployer- and feature-dependent.

## Local-First Data Boundary

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model
outputs may still be sensitive or identifying. The privacy architecture
explains the local-first data lifecycle and remote-sharing gates in more
detail: [Privacy architecture](./privacy-architecture.md).

Safety and educational-use limits remain separate from hosting configuration:
[Safety terms draft](./safety-terms.md).

## Backend Architecture Review Gates

A separate backend architecture review is required before any future feature
adds or changes:

- auth, accounts, roles, sessions, identity providers, or account recovery;
- server APIs, hosted functions, queues, jobs, webhooks, or server middleware;
- server-side secrets, API keys, signing keys, tokens, credential storage, or
  key rotation;
- app-owned rate limiting, abuse controls, quotas, or enforcement logs;
- application server logs, CSP report collection, Network Error Logging,
  telemetry, analytics, cloud diagnostics, or remote error reporting;
- cloud storage, sync, backups, retention, deletion, export, or account data
  workflows;
- remote model providers, provider SDKs, model assets, hosted inference, or
  provider-specific terms;
- raw-video, frame-pixel, landmark, metric, prompt, report, or model-output
  remote sharing; or
- production host changes that alter security headers, origins, redirects,
  caching, service workers, or data flow.

Documenting these gates does not approve those future features. Each gate
requires separate scope, privacy and security review, verification, and audit.

## Non-Goals For SS-017

SS-017 does not add backend services, auth, accounts, secrets, telemetry,
analytics, remote logging, cloud storage, provider SDKs, model providers,
remote sharing, CSP reporting endpoints, Network Error Logging, or production
hosting provider configuration files.

SS-017 also does not claim legal, compliance, security, privacy, deletion,
anonymity, medical, or trademark-clearance status for any deployment.

## Verification

Docs changes for this story should run:

```bash
npm run test:unit -- docs-claims
npm run docs:verify
npm run safety:verify
npm run privacy:verify
npm run compliance:verify
npm run build
git diff --check
git diff --stat
```
```

Focused implementation diff for README, verifier, and tests:

```diff
diff --git a/README.md b/README.md
@@
-Use Node 22 from `.nvmrc`, matching CI:
+Use Node 22 from `.nvmrc`, matching CI. These commands are for local
+development, not production hosting configuration:
@@
 - [Limitations](./docs/limitations.md)
+- [Deployment](./docs/deployment.md)
 - [Contributor guide](./CONTRIBUTING.md)

diff --git a/scripts/verify-docs-claims.js b/scripts/verify-docs-claims.js
@@
+  deploymentDraft:
+    "**DRAFT - pending human security/privacy review before public production hosting.**",
+  deploymentNoGuarantee:
+    "This deployment guidance is product and engineering documentation, not legal,\n" +
+    "security, privacy, deletion, anonymity, medical, trademark-clearance, or\n" +
+    "regulatory-compliance advice or a guarantee.",
@@
+  "docs/deployment.md": {
+    headings: [
+      "# Deployment",
+      "## Draft Review Status",
+      "## Current Production Posture",
+      "## No-Backend Implications",
+      "## Local Development",
+      "## Production Hosting Requirements",
+      "## Security Headers",
+      "## Local-First Data Boundary",
+      "## Backend Architecture Review Gates",
+      "## Non-Goals For SS-017",
+      "## Verification",
+    ],
+    requiredStrings: ["deploymentDraft", "deploymentNoGuarantee", "localFirst"],
+    links: ["./privacy-architecture.md", "./safety-terms.md"],
+    terms: [
+      "auth",
+      "accounts",
+      "secrets",
+      "rate limiting",
+      "server logs",
+      "data-retention",
+      "Content-Security-Policy",
+      "Strict-Transport-Security",
+      "X-Content-Type-Options",
+      "Referrer-Policy",
+      "Permissions-Policy",
+      "APIs",
+      "remote model providers",
+      "cloud storage",
+      "telemetry",
+      "analytics",
+      "remote logging",
+      "CSP report collection",
+      "retention",
+      "deletion",
+      "raw swing video",
+    ],
+    placement: [
+      {
+        heading: "## Draft Review Status",
+        text: requiredStrings.deploymentDraft,
+        firstParagraph: true,
+      },
+    ],
+  },
@@
+  "security guarantee": [
+    "secures your data",
+    "prevents attacks",
+    "hack-proof",
+    "hack proof",
+    "breach-proof",
+    "breach proof",
+    "protected against breaches",
+    "stops attackers",
+    "guaranteed protection",
+  ],
+  "production header overclaim": [
+    "swing sync is deployed with hsts",
+    "swing sync is protected by production http security headers",
+  ],
@@
+const crossFileChecks = [
+  {
+    sourcePath: "index.html",
+    targetPath: "docs/deployment.md",
+    extract: extractCspMetaContent,
+    description: "CSP meta directive string",
+  },
+];
@@
+    for (const term of config.terms ?? []) {
+      if (!content.toLowerCase().includes(term.toLowerCase())) {
+        errors.push(`${filePath}: missing required term ${term}`);
+      }
+    }
+
+    for (const placement of config.placement ?? []) {
+      assertPlacement(filePath, content, placement, errors);
+    }
@@
+  for (const check of crossFileChecks) {
+    const source = fileReader(check.sourcePath);
+    const target = fileReader(check.targetPath);
+    if (source === null) {
+      errors.push(`${check.sourcePath}: required file is missing`);
+      continue;
+    }
+    if (target === null) {
+      errors.push(`${check.targetPath}: required file is missing`);
+      continue;
+    }
+    const extracted = check.extract(source);
+    if (!extracted) {
+      errors.push(
+        `${check.sourcePath}: could not extract non-empty ${check.description}`,
+      );
+      continue;
+    }
+    if (target.includes(extracted)) {
+      errors.push(
+        `${check.targetPath}: duplicates ${check.description} from ${check.sourcePath}`,
+      );
+    }
+  }
@@
+function assertPlacement(filePath, content, placement, errors) {
+  const headingIndex = content.indexOf(placement.heading);
+  if (headingIndex === -1) {
+    return;
+  }
+
+  const afterHeading = content.slice(headingIndex + placement.heading.length);
+  const nextHeadingIndex = afterHeading.search(/\n##?\s+/);
+  const section =
+    nextHeadingIndex === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIndex);
+
+  if (!section.includes(placement.text)) {
+    errors.push(
+      `${filePath}: missing required placement for "${placement.text}" under "${placement.heading}"`,
+    );
+    return;
+  }
+
+  if (placement.firstParagraph) {
+    const firstParagraph = section.trimStart().split(/\n\s*\n/)[0]?.trim();
+    if (firstParagraph !== placement.text) {
+      errors.push(
+        `${filePath}: "${placement.text}" must be the first paragraph under "${placement.heading}"`,
+      );
+    }
+  }
+}
+
+function extractCspMetaContent(html) {
+  const metaTags = html.match(/<meta\b[^>]*>/gis) ?? [];
+  for (const tag of metaTags) {
+    const attributes = parseAttributes(tag);
+    if (
+      attributes["http-equiv"]?.toLowerCase() === "content-security-policy" &&
+      Object.hasOwn(attributes, "content")
+    ) {
+      return attributes.content.trim() || null;
+    }
+  }
+  return null;
+}
+
+function parseAttributes(tag) {
+  const attributes = {};
+  const attributePattern = /([^\s=<>"'\/]+)\s*=\s*(["'])([\s\S]*?)\2/g;
+  let match;
+  while ((match = attributePattern.exec(tag)) !== null) {
+    attributes[match[1].toLowerCase()] = match[3];
+  }
+  return attributes;
+}

diff --git a/test/unit/docs-claims.test.ts b/test/unit/docs-claims.test.ts
@@
+  "docs/deployment.md": readFileSync("docs/deployment.md", "utf8"),
+  "index.html": readFileSync("index.html", "utf8")
@@
+  it("rejects deployment security overclaims", () => { ... });
+  it("rejects production header overclaims", () => { ... });
+  it("rejects duplicated CSP directives from an injected index file", () => { ... });
+  it("extracts CSP directives with reordered attributes and varied whitespace", () => { ... });
+  it("fails closed when CSP extraction cannot establish a source value", () => { ... });
+  it("extracts CSP directives with matched quote pairs around embedded quotes", () => { ... });
```

Verification executed under Node v22.22.3:

```text
$ npm run test:unit -- docs-claims
✓ test/unit/docs-claims.test.ts (13 tests)
Test Files  1 passed (1)
Tests  13 passed (13)

$ npm run docs:verify
docs:verify passed

$ npm run safety:verify
Safety terms and consent-gate constraints verified.

$ npm run privacy:verify
Privacy architecture and boundary constraints verified.

$ npm run compliance:verify
Compliance artifacts verified.
Fixture policy and provenance verified.
Approved pose asset hashes verified.
Safety terms and consent-gate constraints verified.
Privacy architecture and boundary constraints verified.
docs:verify passed

$ npm run build
vite v5.4.21 building for production...
✓ 15 modules transformed.
✓ built in 775ms
Wrote dist/THIRD_PARTY_NOTICES.txt

$ git diff --check
PASS

$ git diff --stat
CONTEXT.md                    | 165 +++++++++++++++++++++++++++++++++++++
README.md                     |   4 +-
scripts/verify-docs-claims.js | 187 +++++++++++++++++++++++++++++++++++++++++-
test/unit/docs-claims.test.ts | 177 ++++++++++++++++++++++++++++++++++++++-
4 files changed, 527 insertions(+), 6 deletions(-)
```

Note: `git diff --stat` does not list untracked new files in this working tree.
New untracked SS-017 files include `docs/deployment.md`,
`docs/ss-017-*-prompt.md`, `docs/ss-017-claude-qa-response.md`,
`docs/ss-017-preimplementation-spec.md`, and
`docs/ss-017-research-disposition.md`. Existing untracked
`docs/agent-guidance/*new-codex-session-prompt.md` files were preserved and
not modified.

Known non-goals:
- No backend, auth, accounts, secrets, telemetry, analytics, remote logging,
  cloud storage, provider SDKs, model providers, or remote sharing.
- No runtime behavior changes.
- No production hosting provider configuration files until a host is selected.
- No CSP reporting endpoints, NEL, Reporting API endpoints, or remote
  diagnostic collection.
- No legal, compliance, security, privacy, deletion, anonymity, medical, or
  trademark-clearance guarantees.
- No dependency, bundle, license-policy, notice, or SBOM changes.

Output required:
- PASS/FAIL verdict.
- Blockers ordered by severity.
- Non-blocking recommendations.
- Missing tests or edge cases.
- Explicit sign-off status for whether SS-017 may proceed to PR preparation.
```
