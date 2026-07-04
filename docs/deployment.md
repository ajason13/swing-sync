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
