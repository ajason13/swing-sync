# Contributing

This repository uses focused safety, privacy, and licensing constraints. Start
every change by reading `AGENTS.md` and the task-relevant policy documents.

## Environment

Use Node 22 from `.nvmrc`, matching CI:

```bash
nvm use
npm ci
```

Run the local app with:

```bash
npm run dev
```

If browser smoke tests are needed, install Chromium once:

```bash
npx playwright install chromium
```

Known local note: earlier work recorded Node 24 silent-hang risk for browser
smoke attempts. Use the pinned Node 22 environment unless a separate story
updates the project baseline.

### Automated host coverage

Pull requests and pushes to `main`/`master` run the same compliance workflow on
`ubuntu-latest` and `windows-2025` (GitHub-hosted Windows Server 2025 x64).
Both hosts use Node 22 and `npm ci`, then run typecheck, unit tests, license
audit, bundle-license fixtures, SBOM generation, build/compliance, and all three
Chromium smoke suites (standard, development CSP/styles, production-preview CSP).
Windows uses the runner's default PowerShell shell and repository-local tools;
Git Bash and a global Vite installation are not required.

The existing `compliance` check covers Ubuntu; `compliance-windows` covers
Windows. Matrix failures do not cancel the other host. Each job logs the head
SHA, checkout SHA, OS/image, architecture, Node/npm, Playwright and Chromium
versions. Failed browser runs upload all three smoke output directories in
separate OS-named artifacts retained for seven days. Use approved synthetic
fixtures only; these artifacts can contain browser traces and page content.

The selected Windows Server host is within
[Playwright's documented Windows requirements](https://playwright.dev/docs/intro#system-requirements);
the actual hosted image and tool versions are recorded per run. This automated
server coverage does not establish Windows 10/11 laptop, ARM64, or physical
mobile-device compatibility. Native Windows setup and laptop validation remain
tracked in [#96](https://github.com/ajason13/swing-sync/issues/96), and the broader
browser/device study remains in [#73](https://github.com/ajason13/swing-sync/issues/73).

## Task Workflow

Start from synchronized `main` unless the current task states otherwise. Put
acceptance criteria in the issue, pull request, or task prompt. For safety,
privacy, legal, medical, AI-coaching, model-provider, compliance, or licensing
changes, create a focused specification when the existing policy does not
already define the boundary, then run a fresh-context Codex review after
implementation.

Historical handoffs are archival evidence, not a workflow gate. Read one only
when it is directly relevant to the task.

## Testing

Baseline runtime or docs changes require:

```bash
npm run build
npm run compliance:verify
```

Useful targeted commands:

```bash
npm run test:unit
npm run test:smoke
npm run safety:verify
npm run privacy:verify
npm run docs:verify
git diff --check
```

Dependency, bundle, license-policy, notice, or SBOM changes also require:

```bash
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
```

Record command results in the PR. If `docs/sbom.json` changes only generated
metadata and no dependency changed, restore it and record why.

## Licensing, References, Fixtures, And Models

Follow `docs/licensing.md` before adding dependencies, adapting reference code,
or changing notices. Clean-room implementation is the default for reference
repositories. Preserve required notices for any approved permissive reuse.

Follow `docs/models-licensing.md` before adding model assets, SDKs, providers,
runtime fetches, or service-worker caching. The current production app has no
configured remote model provider.

Follow `docs/fixture-policy.md` before adding or changing fixtures. Do not
commit raw personal swing video, unidentified third-party media, unclear media
rights, personally identifying material, or fixtures that imply real-world
accuracy, safety, anonymity, deletion, or legal compliance.

## Safety, Privacy, And Claims

Swing Sync is for educational golf swing review. It is not medical advice, pain
diagnosis, rehabilitation guidance, physical therapy, or a substitute for
qualified medical care or professional golf coaching.

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human
review remains a pre-release gate for assumption-of-risk and
release-of-liability language.

See [Safety terms draft](docs/safety-terms.md) and
[Privacy architecture](docs/privacy-architecture.md) for the current project
boundaries. The [release review gate](docs/release-review-gate.md) records the
pending qualified-human review package for any future public release.

For runtime changes, state whether observability was added, intentionally
unchanged, or deferred. Docs-only workflow changes do not add runtime
observability. Existing debugging is local test output, browser devtools, sanitized
UI status/error codes, and CI/browser failure artifacts.

## Pull Requests

Use `.github/pull_request_template.md`. Confirm reference integrity, required
notices, and compliance artifact checks. Include scope, verification, risk,
audit status, observability impact, and any deferred work.
