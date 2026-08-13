# Contributing

This repository uses a story-by-story workflow with explicit safety, privacy,
licensing, and audit gates. Start every change by reading `AGENTS.md` and
`CONTEXT.md`.

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

## Task Workflow

Before branching, confirm the selected Notion task's Name, Branch, Handshake
Status, Pull Request, Task Type, and acceptance criteria. Create the task branch
from synchronized `main` using the Notion Branch value.

Keep Notion and `CONTEXT.md` synchronized when a task is selected, status
changes, QA or audit results arrive, a PR is opened, a PR merges, or post-merge
state changes.

Sensitive stories must keep roles explicit:

- Codex implements, verifies, and maintains repository state.
- Codex may own research/spec drafting when the former Gemini route is
  unavailable, degraded, or explicitly bypassed.
- Claude remains the independent QA planning, adversarial audit, and re-review
  reviewer.

For sensitive stories, do not implement user-facing safety, privacy, legal,
medical, AI-coaching, model-provider, compliance, or licensing copy before the
research/disposition note, preimplementation spec, and self-contained Claude QA
planning prompt pass or blockers are resolved and re-reviewed.

Browser-chat prompts for Claude must be self-contained. Include role, stage,
scope, context, acceptance criteria, protected boundaries, relevant source
contents or focused diff, verification, known non-goals, and required output.

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
unchanged, or deferred. For SS-016 docs-only work, no new runtime observability
is added. Existing debugging is local test output, browser devtools, sanitized
UI status/error codes, and CI/browser failure artifacts.

## Pull Requests

Use `.github/pull_request_template.md`. Confirm reference integrity, required
notices, and compliance artifact checks. Include scope, verification, risk,
audit status, observability impact, and any deferred work.
