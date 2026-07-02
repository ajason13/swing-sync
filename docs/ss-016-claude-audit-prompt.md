# SS-016 Claude Implementation Audit Prompt

**Superseded for paste use.** Claude returned FAIL on this implementation audit
with blocker B9. Use `docs/ss-016-claude-rereview-prompt.md` for the focused
B9 re-review.

Paste everything between START and END into Claude Chat for implementation
audit.

## START

Role: You are the independent adversarial implementation auditor for Swing Sync.

Stage: Implementation audit for SS-016.

Scope: Audit the SS-016 public docs implementation and `docs:verify` claim
checker. Review README, limitations, contributor guide, package-script wiring,
claim-safety enforcement, required disclosures, and verification evidence.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
SS-016 is safety-, privacy-, legal/trademark-, medical-scope-, compliance-,
licensing/SBOM-, docs-claim-, and user-facing-copy-sensitive. Claude QA
planning previously returned blockers B1-B8; all were closed at planning stage,
and Claude cleared implementation start. Codex has now implemented only the
approved docs and checker scope.

Acceptance criteria:
- README explains purpose, local-first design, safety limits, and setup.
- Limitations page covers pose accuracy, camera setup, and non-medical scope.
- Contributor guide explains task workflow, testing, licenses, and SBOM
  expectations.
- Trademark/non-affiliation disclaimer is visible.

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

Relevant source contents or focused diff:

File: `README.md`

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

File: `docs/limitations.md`

````markdown
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
````

File: `CONTRIBUTING.md`

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
````

File: `scripts/verify-docs-claims.js`

```js
import fs from "node:fs";

const requiredStrings = {
  nonAffiliation:
    "Swing Sync is an independent open-source project. It is not affiliated with,\n" +
    "endorsed by, sponsored by, or approved by any golf equipment maker, tour,\n" +
    "league, training organization, model provider, or platform vendor. Third-party\n" +
    "names, if referenced, belong to their respective owners.",
  localFirst:
    "Raw swing video is not uploaded by default. Any future feature that sends raw\n" +
    "video, frame pixels, landmarks, metrics, prompts, reports, or model outputs\n" +
    "outside the browser must use a separate, explicit opt-in flow.",
  nonMedical:
    "Swing Sync is for educational golf swing review. It is not medical advice, pain\n" +
    "diagnosis, rehabilitation guidance, physical therapy, or a substitute for\n" +
    "qualified medical care or professional golf coaching.",
  draftReview:
    "The safety and privacy documents are engineering and product drafts pending\n" +
    "human/legal review; they are not legal advice and do not guarantee privacy,\n" +
    "safety, deletion, anonymity, or regulatory compliance.",
};

const files = {
  "README.md": {
    headings: [
      "# Swing Sync",
      "## Current Capabilities",
      "## Local-First Design",
      "## Setup",
      "## Verification",
      "## Documentation",
      "## License",
      "## Non-Affiliation",
    ],
    requiredStrings: [
      "nonAffiliation",
      "localFirst",
      "draftReview",
      "readmeNonMedical",
    ],
    links: ["./docs/safety-terms.md", "./docs/privacy-architecture.md"],
  },
  "docs/limitations.md": {
    headings: [
      "# Limitations",
      "## Pose And Metric Limits",
      "## Camera Setup",
      "## Educational And Non-Medical Scope",
      "## Privacy And Export Limits",
      "## Remote Review Limits",
      "## Fixture And Test Limits",
      "## Draft Review Status",
    ],
    requiredStrings: ["localFirst", "nonMedical", "draftReview"],
    links: ["./safety-terms.md", "./privacy-architecture.md"],
  },
  "CONTRIBUTING.md": {
    headings: [
      "# Contributing",
      "## Environment",
      "## Task Workflow",
      "## Testing",
      "## Licensing, References, Fixtures, And Models",
      "## Safety, Privacy, And Claims",
      "## Pull Requests",
    ],
    requiredStrings: ["localFirst", "nonMedical"],
    links: ["docs/safety-terms.md", "docs/privacy-architecture.md"],
  },
};

const bannedPatterns = {
  "privacy/anonymity": [
    "anonymous",
    "anonymized",
    "de-identified",
    "private by default",
    "privacy guaranteed",
    "guaranteed privacy",
    "never leaves your device",
    "never leaves the device",
  ],
  "deletion/security": [
    "guaranteed deletion",
    "permanent deletion",
    "permanently deleted",
    "physically erased",
    "encrypted by default",
    "secure by default",
    "security guaranteed",
  ],
  "medical/injury": [
    "medical advice",
    "diagnosis",
    "diagnose",
    "rehabilitation plan",
    "physical therapy",
    "injury prevention",
    "prevents injury",
    "treats pain",
    "pain triage",
    "clinically",
  ],
  "correctness/performance": [
    "guaranteed correctness",
    "guaranteed accurate",
    "proves correctness",
    "guaranteed improvement",
    "guaranteed performance",
  ],
  "legal/compliance/trademark": [
    "legally compliant",
    "compliance guaranteed",
    "trademark cleared",
    "trademark-cleared",
    "legally approved",
    "legal advice",
  ],
  "telemetry/analytics": [
    "telemetry",
    "hosted analytics",
    "remote logging",
    "cloud diagnostics",
    "persistent debug artifact",
    "hidden identifier",
  ],
  "absolute remote boundary": [
    "cannot be uploaded",
    "can never be sent",
    "impossible to send",
    "no data ever leaves",
  ],
};

const allowedMatchUnits = new Set(
  [
    "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "Swing Sync is for educational golf swing review. It is not medical advice, pain diagnosis, rehabilitation guidance, physical therapy, or a substitute for qualified medical care or professional golf coaching.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance.",
    "The safety and privacy documents are engineering and product drafts pending human/legal review; they are not legal advice and do not guarantee privacy, safety, deletion, anonymity, or regulatory compliance. SS-002 legal/human review remains a pre-release gate for assumption-of-risk and release-of-liability language.",
  ].map(normalizeText),
);

const negativeFixtures = {
  "privacy/anonymity": "Swing Sync is anonymous and never leaves your device.",
  "deletion/security": "Swing Sync provides guaranteed deletion.",
  "medical/injury": "Swing Sync can diagnose pain and prevents injury.",
  "correctness/performance": "Swing Sync provides guaranteed accurate metrics.",
  "legal/compliance/trademark":
    "Swing Sync is legally compliant and trademark cleared.",
  "telemetry/analytics":
    "Swing Sync uses telemetry and remote logging with a hidden identifier.",
  "absolute remote boundary": "Raw video cannot be uploaded by the app.",
};

const errors = [];

for (const [filePath, config] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${filePath}: required file is missing`);
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.trim()) {
    errors.push(`${filePath}: required file is empty`);
    continue;
  }

  for (const heading of config.headings) {
    if (!content.includes(heading)) {
      errors.push(`${filePath}: missing required heading "${heading}"`);
    }
  }

  for (const stringKey of config.requiredStrings) {
    const expected =
      stringKey === "readmeNonMedical"
        ? "Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance,\nphysical therapy, or a substitute for qualified medical care or professional\ngolf coaching."
        : requiredStrings[stringKey];
    if (!content.includes(expected)) {
      errors.push(`${filePath}: missing canonical ${stringKey} string`);
    }
  }

  for (const link of config.links) {
    if (!content.includes(link)) {
      errors.push(`${filePath}: missing required link ${link}`);
    }
  }

  for (const unit of scanUnits(content)) {
    for (const [category, patterns] of Object.entries(bannedPatterns)) {
      for (const pattern of patterns) {
        if (unit.includes(pattern) && !allowedMatchUnits.has(unit)) {
          errors.push(
            `${filePath}: prohibited ${category} phrase "${pattern}" in "${unit}"`,
          );
        }
      }
    }
  }
}

assertDraftBanner(
  "docs/safety-terms.md",
  "DRAFT - pending legal/human review; not for release.",
);
assertDraftBanner(
  "docs/privacy-architecture.md",
  "DRAFT - pending human/privacy review before public release.",
);

for (const [category, fixture] of Object.entries(negativeFixtures)) {
  const fixtureMatches = [];
  for (const unit of scanUnits(fixture)) {
    for (const pattern of bannedPatterns[category]) {
      if (unit.includes(pattern)) {
        fixtureMatches.push(pattern);
      }
    }
  }
  if (fixtureMatches.length === 0) {
    errors.push(`negative fixture for ${category} did not trigger a pattern`);
  }
}

if (errors.length > 0) {
  console.error("docs:verify failed");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("docs:verify passed");

function assertDraftBanner(filePath, requiredBanner) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(requiredBanner)) {
    errors.push(`${filePath}: missing required draft banner`);
  }
}

function scanUnits(markdown) {
  return markdown
    .split(/\n(?=# )|\n(?=## )|\n\s*\n/g)
    .flatMap((chunk) =>
      chunk
        .replace(/^#+\s+.*$/gm, "")
        .split(/(?<=\.)\s+(?=[A-Z`])/),
    )
    .map(normalizeText)
    .filter(Boolean);
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}
```

File: `package.json` focused script diff

```diff
     "safety:verify": "node scripts/verify-safety-terms.js",
     "privacy:verify": "node scripts/verify-privacy-boundaries.js",
+    "docs:verify": "node scripts/verify-docs-claims.js",
     "pose-assets:verify": "node scripts/verify-pose-assets.js",
     "fixture:verify": "node scripts/verify-fixtures.js",
-    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify",
+    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify && npm run docs:verify",
```

Verification:
- `npm run docs:verify` PASS. Output ended with `docs:verify passed`.
- `npm run safety:verify` PASS. Output: `Safety terms and consent-gate constraints verified.`
- `npm run privacy:verify` PASS. Output: `Privacy architecture and boundary constraints verified.`
- `git diff --check` PASS.
- `npm run build` PASS. Vite built successfully and wrote
  `dist/THIRD_PARTY_NOTICES.txt`.
- `npm run compliance:verify` PASS, including `docs:verify` through the
  compliance path. Output included:
  - `Compliance artifacts verified.`
  - `Fixture policy and provenance verified.`
  - `Approved pose asset hashes verified.`
  - `Safety terms and consent-gate constraints verified.`
  - `Privacy architecture and boundary constraints verified.`
  - `docs:verify passed`

Known non-goals:
- No runtime behavior changes.
- No dependencies, SDKs, provider integrations, model/provider assets, workers,
  camera capture, service workers, API routes, secrets, telemetry, hosted
  analytics, remote logging, cloud diagnostics, cloud storage, hidden
  identifiers, raw media fixtures, or remote-sharing behavior.
- No PR has been opened yet.

Output required:
- PASS/FAIL verdict for SS-016 PR preparation.
- Blockers ordered by severity, with exact file/line or quoted source.
- Non-blocking recommendations separated from blockers.
- Missing tests, missing claim checks, or edge cases.
- Explicit review of whether B1-B8 are verified in implementation, especially
  B6/B7/B8 and the executed `docs:verify` evidence.
- Explicit sign-off status for whether Codex may prepare the SS-016 PR.

## END
