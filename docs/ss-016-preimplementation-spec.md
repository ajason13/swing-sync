# SS-016 Preimplementation Spec

Status: second revised candidate spec for focused Claude QA re-review.
Implementation remains blocked until Claude QA planning returns PASS or
blocking findings are resolved and re-reviewed.

## Claude QA Planning Response

Claude QA planning returned FAIL on the initial planning prompt. Codex accepts
B1-B5 as valid:

- B1: missing exact draft prose for required public docs.
- B2: missing structural enforcement for prohibited-claim language.
- B3: capability-summary wording risked overclaiming active AI coaching.
- B4: contributor-guide path was unresolved.
- B5: `SS-TC-020` lacked decomposed claim-safety sub-cases.

This revised spec responds before implementation. The draft prose below is
review input only and must not be copied into public docs until focused Claude
re-review passes or further blockers are resolved.

Claude focused B1-B5 re-review returned FAIL with B6 and B7. Codex accepts both
as valid:

- B6: the proposed `docs:verify` banned-pattern list would false-positive
  against three draft sentences and the link-presence rule was ambiguous.
- B7: `SS-TC-020` needed a golden regression sub-case proving `docs:verify`
  exits zero against the exact final approved docs.

This second revision resolves B6 by rewording the three colliding sentences
instead of adding bespoke exceptions, and by making link requirements uniform
across all three public docs. It resolves B7 by adding the golden
`docs:verify` zero-exit sub-case.

Claude second focused B6-B7 re-review returned FAIL with one new blocker. Codex
accepts B8 as valid:

- B8: the `docs/limitations.md` intro paragraph still contained `diagnose`,
  which collides with the medical/injury banned-term list outside the canonical
  non-medical exception.

This third revision resolves B8 by trimming the intro paragraph instead of
adding another exception or near-miss phrase.

## Scope

SS-016 publishes public-facing project documentation for Swing Sync without
changing runtime behavior.

In scope:

- update `README.md` with the approved draft contract below;
- add `docs/limitations.md` with the approved draft contract below;
- add root-level `CONTRIBUTING.md` with the approved draft contract below;
- add `scripts/verify-docs-claims.js`;
- add `npm run docs:verify` and wire it into `npm run compliance:verify`;
- update internal context and Notion state as the story progresses.

Out of scope:

- runtime behavior changes;
- new dependencies, SDKs, provider integrations, model/provider assets, workers,
  camera capture, service workers, API routes, secrets, telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, raw media fixtures, or remote-sharing changes;
- claiming legal approval, trademark clearance, medical safety, injury
  prevention, guaranteed correctness, guaranteed privacy, guaranteed deletion,
  anonymity, regulatory compliance, or professional coaching equivalence.

## Locked File Paths

- `README.md`
- `docs/limitations.md`
- `CONTRIBUTING.md`
- `scripts/verify-docs-claims.js`

`CONTRIBUTING.md` is root-level because GitHub auto-discovers that convention
and it belongs beside the root README and PR template.

## Canonical Required Strings

Use a single source of truth in `scripts/verify-docs-claims.js` for these
strings. Public docs should import the exact text by copy only after Claude
approves it.

Trademark/non-affiliation:

> Swing Sync is an independent open-source project. It is not affiliated with,
> endorsed by, sponsored by, or approved by any golf equipment maker, tour,
> league, training organization, model provider, or platform vendor. Third-party
> names, if referenced, belong to their respective owners.

Local-first remote-sharing boundary:

> Raw swing video is not uploaded by default. Any future feature that sends raw
> video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
> outside the browser must use a separate, explicit opt-in flow.

Non-medical educational boundary:

> Swing Sync is for educational golf swing review. It is not medical advice,
> pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for
> qualified medical care or professional golf coaching.

Draft-review boundary:

> The safety and privacy documents are engineering and product drafts pending
> human/legal review; they are not legal advice and do not guarantee privacy,
> safety, deletion, anonymity, or regulatory compliance.

## Draft README Prose

Target structure for `README.md`:

```markdown
# Swing Sync

Swing Sync is a local-first browser app for educational golf swing review. It
helps users inspect selected swing videos in the browser, review pose-derived
movement signals, and export a Swing Card for their own practice notes.

Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,
physical therapy, or a substitute for qualified medical care or professional
golf coaching.

## Current Capabilities

The current app runs local video selection, local Pose Landmarker inference on
sampled frames, swing phase detection, geometry and tempo metrics, visual
review surfaces, and local Swing Card export/copy workflows.

SS-012 added local-only educational coaching prompt and response contracts, but
no model call is made from those contracts. SS-013 added a provider-neutral
remote model adapter scaffold behind explicit consent, but the production
provider registry is empty. There are no configured remote model providers,
provider SDKs, API keys, server routes, or active hosted-model calls in the
current production app.

## Local-First Design

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model
outputs may still be sensitive or identifying. Downloaded exports are controlled
by the user after they leave the app.

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance.

## Setup

Use Node 22 from `.nvmrc`, matching CI:

```bash
nvm use
npm ci
npm run dev
```

Install the Playwright browser once per development environment when running
browser smoke tests:

```bash
npx playwright install chromium
```

## Verification

Baseline docs or runtime changes should run:

```bash
npm run build
npm run compliance:verify
```

Useful targeted checks:

```bash
npm run test:unit
npm run test:smoke
npm run safety:verify
npm run privacy:verify
npm run docs:verify
```

Dependency, bundle, license-policy, or SBOM changes also require:

```bash
npm run license:audit
npm run verify:bundle-license-fixture
npm run sbom:generate
```

## Documentation

- [Limitations](./docs/limitations.md)
- [Contributor guide](./CONTRIBUTING.md)
- [Privacy architecture](./docs/privacy-architecture.md)
- [Safety terms draft](./docs/safety-terms.md)
- [Licensing and dependency policy](./docs/licensing.md)
- [Model licensing policy](./docs/models-licensing.md)
- [Fixture policy](./docs/fixture-policy.md)
- [Current project context](./CONTEXT.md)

## License

Swing Sync source code is licensed under Apache-2.0. Dependency, model asset,
fixture, and reference-reuse rules are documented in the project policy files
linked above.

## Non-Affiliation

Swing Sync is an independent open-source project. It is not affiliated with,
endorsed by, sponsored by, or approved by any golf equipment maker, tour,
league, training organization, model provider, or platform vendor. Third-party
names, if referenced, belong to their respective owners.
```

## Draft Limitations Prose

Target file: `docs/limitations.md`.

```markdown
# Limitations

Swing Sync provides educational golf swing review in a local-first browser app.
It is designed to support practice notes and visual inspection. The detailed
educational, safety, privacy, and fixture limits below define what the app does
and does not claim.

## Pose And Metric Limits

Pose estimation can be wrong or incomplete. Results may be affected by lighting,
motion blur, camera angle, distance from the camera, occlusion, loose clothing,
club visibility, background clutter, browser performance, device performance,
and dropped or low-quality frames.

Metrics and phase labels are derived from sampled video frames and pose
landmarks. They should be treated as estimates for review, not as proof of
biomechanical correctness, performance improvement, or injury risk.

Low-confidence, missing, or inconsistent landmarks should be interpreted as a
reason to review the video manually or record another clip, not as a statement
about the user's health or movement quality.

## Camera Setup

For clearer review, use a stable camera, good lighting, and enough space to keep
the whole body and as much of the club path as practical in frame. Avoid crowded
or identifying backgrounds when possible. Confirm the practice area is safe
before swinging.

These setup notes can improve review quality, but they do not guarantee accurate
pose detection, complete phase detection, safe movement, or useful feedback.

## Educational And Non-Medical Scope

Swing Sync is for educational golf swing review. It is not medical advice, pain
diagnosis, rehabilitation guidance, physical therapy, or a substitute for
qualified medical care or professional golf coaching.

Stop activity if you feel pain, dizziness, numbness, weakness, or unusual
discomfort. Consult a qualified medical professional for pain, injury, health,
or mobility concerns. Consult a qualified golf coach for sport-specific
instruction beyond general educational review.

## Privacy And Export Limits

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model outputs
may still be sensitive or identifying. Browser storage and downloaded files are
affected by browser, operating-system, device, and user settings. Swing Sync
cannot guarantee that browser data is retained, erased, kept private, or
protected outside the app's controls.

Downloaded Swing Cards and copied prompts are controlled by the user after they
leave Swing Sync.

## Remote Review Limits

The production remote model provider registry is currently empty. SS-013 added
a provider-neutral adapter scaffold, but there are no configured remote model
providers, provider SDKs, API keys, server routes, or active hosted-model calls
in the current production app.

Any future remote review feature must identify the provider, destination, data
classes, terms, privacy practices, and opt-in/revocation flow before anything is
sent outside the browser.

## Fixture And Test Limits

Automated tests, synthetic fixtures, and the approved mannequin fixture validate
plumbing, contracts, deterministic behavior, and regression boundaries. They do
not prove real-world golf swing accuracy, phase accuracy, biomechanical
correctness, coaching correctness, safety, privacy, anonymity, deletion, or
legal compliance.

## Draft Review Status

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance.

See [Safety terms draft](./safety-terms.md) and
[Privacy architecture](./privacy-architecture.md) for the current project
boundaries.
```

## Draft CONTRIBUTING Prose

Target file: `CONTRIBUTING.md`.

```markdown
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
boundaries.

For runtime changes, state whether observability was added, intentionally
unchanged, or deferred. For SS-016 docs-only work, no new runtime observability
is added. Existing debugging is local test output, browser devtools, sanitized
UI status/error codes, and CI/browser failure artifacts.

## Pull Requests

Use `.github/pull_request_template.md`. Confirm reference integrity, required
notices, and compliance artifact checks. Include scope, verification, risk,
audit status, observability impact, and any deferred work.
```

## Docs Verification Design

Implementation must add `scripts/verify-docs-claims.js` and wire it into
`package.json`:

- add script: `"docs:verify": "node scripts/verify-docs-claims.js"`;
- update `compliance:verify` to include `npm run docs:verify`.

The script must be dependency-free Node code and must:

- assert `README.md`, `docs/limitations.md`, and `CONTRIBUTING.md` exist and
  are non-empty;
- assert required headings exist:
  - README: `# Swing Sync`, `## Current Capabilities`, `## Local-First Design`,
    `## Setup`, `## Verification`, `## Documentation`, `## License`,
    `## Non-Affiliation`;
  - limitations: `# Limitations`, `## Pose And Metric Limits`,
    `## Camera Setup`, `## Educational And Non-Medical Scope`,
    `## Privacy And Export Limits`, `## Remote Review Limits`,
    `## Fixture And Test Limits`, `## Draft Review Status`;
  - contributing: `# Contributing`, `## Environment`, `## Task Workflow`,
    `## Testing`, `## Licensing, References, Fixtures, And Models`,
    `## Safety, Privacy, And Claims`, `## Pull Requests`;
- define canonical required strings for trademark/non-affiliation,
  local-first remote-sharing boundary, non-medical educational boundary, and
  draft-review boundary, and assert the relevant docs contain those exact
  strings;
- assert all three public docs link to both `docs/safety-terms.md` and
  `docs/privacy-architecture.md`, with path forms appropriate to each file:
  - README: `./docs/safety-terms.md` and `./docs/privacy-architecture.md`;
  - limitations: `./safety-terms.md` and `./privacy-architecture.md`;
  - contributing: `docs/safety-terms.md` and
    `docs/privacy-architecture.md`;
- assert `docs/safety-terms.md` contains
  `DRAFT - pending legal/human review; not for release.`;
- assert `docs/privacy-architecture.md` contains
  `DRAFT - pending human/privacy review before public release.`;
- scan `README.md`, `docs/limitations.md`, and `CONTRIBUTING.md` with named
  banned-pattern categories and fail with category, file, and matched phrase.

Initial banned-pattern categories:

- privacy/anonymity: `anonymous`, `anonymized`, `de-identified`, `private by
  default`, `privacy guaranteed`, `guaranteed privacy`, `never leaves your
  device`, `never leaves the device`;
- deletion/security: `guaranteed deletion`, `permanent deletion`,
  `permanently deleted`, `physically erased`, `encrypted by default`,
  `secure by default`, `security guaranteed`;
- medical/injury: `medical advice`, `diagnosis`, `diagnose`, `rehabilitation
  plan`, `physical therapy`, `injury prevention`, `prevents injury`,
  `treats pain`, `pain triage`, `clinically`;
- correctness/performance: `guaranteed correctness`, `guaranteed accurate`,
  `proves correctness`, `guaranteed improvement`, `guaranteed performance`;
- legal/compliance/trademark: `legally compliant`, `compliance guaranteed`,
  `trademark cleared`, `trademark-cleared`, `legally approved`, `legal advice`;
- telemetry/analytics: `telemetry`, `hosted analytics`, `remote logging`,
  `cloud diagnostics`, `persistent debug artifact`, `hidden identifier`;
- absolute remote boundary: `cannot be uploaded`, `can never be sent`,
  `impossible to send`, `no data ever leaves`.

Allowed-context exceptions must be explicit, narrow, and justified in the
script. Initial expected exceptions:

- canonical non-medical boundary may contain prohibited medical terms only in
  the exact sentence `It is not medical advice, pain diagnosis, rehabilitation
  guidance, physical therapy, or a substitute for qualified medical care or
  professional golf coaching.` or the README variant prefixed with
  `Swing Sync is not`;
- draft-review boundary may contain `legal advice`, `guarantee`, `privacy`,
  `deletion`, `anonymity`, and `compliance` only in the sentence that says the
  docs do not provide or guarantee them;
- contributor guide may mention `telemetry`, `remote logging`, and related
  terms only in the sentence that says SS-016 does not add them;
- the phrase `not uploaded by default` is permitted; absolute variants like
  `never leaves the device` are not.

The script must include focused negative fixture strings in code so future
maintainers can see each banned category is intentionally covered without
creating public docs that contain those phrases.

## Protected Boundaries

- Raw swing video remains local-first and is not uploaded by default.
- Remote sharing remains off by default and requires separate explicit opt-in
  before any data leaves the device.
- No medical, injury, rehabilitation, pain-triage, professional coaching,
  guaranteed correctness, guaranteed privacy, guaranteed deletion, anonymity,
  legal, compliance, trademark-clearance, or injury-prevention claims.
- No new telemetry, remote logging, hosted analytics, cloud diagnostics, cloud
  storage, hidden identifiers, SDKs, providers, model assets, workers,
  dependencies, camera capture, service workers, API routes, secrets, raw media
  fixtures, or runtime network behavior.
- Debugging/observability wording is limited to existing local test output,
  browser devtools, sanitized UI status/error codes, and CI/browser failure
  artifacts.

## Test Case

Dedicated Notion test case:

- `SS-TC-020`
- https://app.notion.com/p/390834a0c8a6810e85ccd2ffeff645bb

Required decomposed sub-cases:

- required README section/header and setup/verification/link presence;
- required limitations section/header and pose/camera/non-medical presence;
- required `CONTRIBUTING.md` section/header and workflow/testing/license/SBOM
  presence;
- canonical trademark/non-affiliation string presence;
- canonical local-first remote-sharing string presence;
- canonical non-medical educational string presence;
- canonical draft-review string presence;
- negative privacy/anonymity claim checks;
- negative deletion/security claim checks;
- negative medical/injury claim checks with approved "not medical advice"
  exception;
- negative correctness/performance guarantee checks;
- negative legal/compliance/trademark-clearance claim checks;
- negative telemetry/analytics/remote-diagnostics claim checks;
- negative absolute remote-boundary claim checks; and
- verification that `docs:verify` is wired into `compliance:verify`.
- golden regression that `docs:verify` executes against the exact final
  approved content of `README.md`, `docs/limitations.md`, and
  `CONTRIBUTING.md` and exits zero, with no banned-pattern false positives and
  no missing-link failures.

## Verification Plan

Focused implementation verification:

- `npm run docs:verify`
- `npm run safety:verify`
- `npm run privacy:verify`
- `git diff --check`

Before PR:

- `npm run build`
- `npm run compliance:verify`

Run `npm run license:audit`, `npm run verify:bundle-license-fixture`, and
`npm run sbom:generate` only if dependency, bundle, notice, license-policy, or
SBOM behavior changes. If `docs/sbom.json` changes only generated metadata and
no dependency change occurred, restore it and record that in the PR.
