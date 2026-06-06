# Swing Sync

Swing Sync is a local-first, open-source AI golf swing analysis coach. The first
project milestone establishes licensing, dependency governance, SBOM generation,
and third-party notice handling before analysis features are implemented.

## Project Status

SS-001 is complete and merged in
[PR #1](https://github.com/ajason13/swing-sync/pull/1). The repository now has
the Apache-2.0 license, dependency license policy, SBOM workflow, third-party
notice handling, synthetic license fixtures, and CI compliance gates.

Current project context and next-task handoff live in [CONTEXT.md](./CONTEXT.md).

## Compliance Commands

Use Node 22, matching CI:

```bash
nvm use
npm ci
```

```bash
npm run license:audit
npm run sbom:generate
npm run build
npm run compliance:verify
```

The project is licensed under Apache-2.0. Raw swing video handling, model terms,
and sports safety UX are tracked separately from this initial compliance setup.

## Safety Drafts

SS-002 safety and educational-use draft language lives in
[docs/safety-terms.md](./docs/safety-terms.md). The draft is product-compliance
language for human/legal review, not legal advice. The current app scaffold
blocks first analysis behind a local-only educational-use and assumption-of-risk
acknowledgement.

Gemini Deep Research disposition for SS-002 is tracked in
[docs/ss-002-research-disposition.md](./docs/ss-002-research-disposition.md)
so research recommendations stay separate from approved implementation scope.

## Privacy Architecture

SS-003 privacy architecture and video data lifecycle draft guidance lives in
[docs/privacy-architecture.md](./docs/privacy-architecture.md). It defines
local-first data classes, default no-upload behavior for raw swing video,
export and optional remote-sharing boundaries, and deletion-copy limits before
video analysis features are implemented.

Gemini Deep Research disposition for SS-003 is tracked in
[docs/ss-003-research-disposition.md](./docs/ss-003-research-disposition.md).
