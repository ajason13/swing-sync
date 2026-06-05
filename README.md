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
