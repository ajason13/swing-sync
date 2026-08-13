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

Use Node 22 from `.nvmrc`, matching CI. These commands are for local
development, not production hosting configuration:

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

- [Release review gate](./docs/release-review-gate.md) — current public-release
  decision remains pending qualified-human review.
- [Limitations](./docs/limitations.md)
- [Deployment](./docs/deployment.md)
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
