# SS-016 Claude QA Focused Re-Review Prompt

**Superseded for paste use.** Claude returned FAIL on this focused B1-B5
re-review. Use `docs/ss-016-claude-qa-second-rereview-prompt.md` for the
focused B6-B7 re-review.

Paste everything between START and END into Claude Chat for focused
preimplementation QA re-review.

## START

Role: You are the independent adversarial QA planner for Swing Sync.

Stage: Focused preimplementation QA re-review for SS-016 after an initial QA
planning FAIL.

Scope: Re-review only the B1-B5 blocker responses for the proposed README,
limitations page, contributor guide, `docs:verify` enforcement, contributor
path, and decomposed test-case coverage before Codex implements SS-016. This is
a planning gate, not an implementation audit.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex is acting as the SS-016 research/spec owner. Claude remains the
independent QA planning and final audit reviewer. Assume you cannot read the
repository, GitHub, or Notion; all relevant context is included below.

Current repository state:
- Default branch: `main`.
- SS-016 branch: `ss-016-docs`, created from `main` at
  `b03efbb46578c19119b4b7d286ebc8be97d6749f`.
- Latest merged PR before SS-016: PR #16 for SS-013, merge commit
  `a53203788e2cd3f65c25e95a271944b4fb677653`.
- SS-013 added a fail-closed, provider-neutral model adapter scaffold behind
  explicit consent. It ships with an empty production provider registry and no
  provider SDKs, keys, remote calls, telemetry, remote logging, cloud storage,
  raw media upload, new dependencies, or model/provider assets.
- Runtime observability remains local-only: sanitized UI status/error states,
  deterministic tests, and CI/browser failure artifacts. No production logging
  or telemetry was added.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

Prior findings:
- B1: No draft copy existed for any required section except the trademark
  paragraph.
- B2: No structural or automated enforcement existed for prohibited-claim
  language; manual review alone was fail-open.
- B3: Capability-summary wording risked overclaiming active AI coaching because
  the SS-013 remote model adapter remains an inactive scaffold with an empty
  production provider registry.
- B4: Contributor guide placement was unresolved.
- B5: `SS-TC-020` was a single opaque test case rather than decomposed
  per-required-disclosure and per-prohibited-claim-category coverage.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services unless a future separately reviewed
  feature adds explicit opt-in.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, trademark-clearance, or
  guaranteed correctness claims.
- Do not add telemetry, remote logging, hosted analytics, cloud diagnostics,
  cloud storage, hidden identifiers, new workers, provider SDKs,
  provider/model assets, new dependencies, camera capture, raw personal video
  fixtures, service workers, API routes, secrets, or remote-sharing behavior.
- Debugging/observability wording for SS-016 must describe only existing local
  test output, browser devtools, sanitized UI status/error codes, and
  CI/browser failure artifacts.
- The docs may say raw swing video is not uploaded by default and remote
  sharing requires separate explicit opt-in. They must not say raw swing video
  can never leave the device, that deletion is guaranteed, or that data is
  anonymous.

Relevant source contents or focused diff:
No SS-016 public docs implementation diff exists yet. Codex revised the planning
artifacts only. The exact proposed public docs prose and enforcement contract
are below.

## B1/B3 Response: Draft README Prose

````markdown
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
````

## B1 Response: Draft `docs/limitations.md` Prose

````markdown
# Limitations

Swing Sync provides educational golf swing review in a local-first browser app.
It is designed to support practice notes and visual inspection, not to certify
swing correctness, diagnose pain, prevent injury, or replace qualified medical
care or professional golf coaching.

## Pose And Metric Limits

Pose estimation can be wrong or incomplete. Results may be affected by lighting,
motion blur, camera angle, distance from the camera, occlusion, loose clothing,
club visibility, background clutter, browser performance, device performance,
and dropped or low-quality frames.

Metrics and phase labels are derived from sampled video frames and pose
landmarks. They should be treated as estimates for review, not as proof of
biomechanical correctness, performance improvement, or injury risk.

Low-confidence, missing, or inconsistent landmarks should be interpreted as a
reason to review the video manually or record another clip, not as a diagnosis
of the user's movement.

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
cannot guarantee that browser data is retained, erased, anonymous, or protected
outside the app's controls.

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
````

## B1/B4 Response: Draft `CONTRIBUTING.md` Prose

`CONTRIBUTING.md` is locked as a root-level file.

````markdown
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
rights, hidden identifiers, or fixtures that imply real-world accuracy, safety,
anonymity, deletion, or legal compliance.

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

For runtime changes, state whether observability was added, intentionally
unchanged, or deferred. For SS-016 docs-only work, no new runtime observability
is added. Existing debugging is local test output, browser devtools, sanitized
UI status/error codes, and CI/browser failure artifacts.

## Pull Requests

Use `.github/pull_request_template.md`. Confirm reference integrity, required
notices, and compliance artifact checks. Include scope, verification, risk,
audit status, observability impact, and any deferred work.
````

## B2 Response: `docs:verify` Design

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
- assert `README.md`, `docs/limitations.md`, and `CONTRIBUTING.md` link to
  `docs/safety-terms.md` and `docs/privacy-architecture.md` where applicable;
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
  the sentence that says Swing Sync is not those things;
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

## B5 Response: Decomposed SS-TC-020 Coverage

`SS-TC-020` is revised to require these sub-cases:

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

Verification:
- No SS-016 public docs implementation has started.
- Planning artifacts were revised only.
- `git diff --check` PASS after the initial planning artifacts; rerun is
  expected before implementation once this focused re-review is recorded.

Known non-goals:
- Do not implement README, limitations, CONTRIBUTING, or `docs:verify` before
  this focused QA planning gate passes or blockers are resolved and re-reviewed.
- Do not add runtime behavior, telemetry, logging, analytics, dependencies,
  model/provider integrations, camera capture, workers, service workers, cloud
  storage, remote sharing, raw media fixtures, or API routes.
- Do not convert draft safety/privacy/legal language into claims of legal
  approval or compliance.

Output required:
- PASS/FAIL verdict for implementation start.
- For each prior blocker B1-B5, state closed or still blocking.
- New blockers, if any, ordered by severity with exact required changes.
- Non-blocking recommendations separated from blockers.
- Missing protected-boundary checks or prohibited-claim risks.
- Required verification changes before implementation or PR.
- Explicit sign-off status for whether Codex may begin SS-016 docs and
  `docs:verify` implementation.

## END
