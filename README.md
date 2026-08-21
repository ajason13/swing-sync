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

Vite prints the local URL when it starts (normally `http://localhost:5173`).

## Using Swing Sync

1. Open the local URL printed by `npm run dev`.
2. Read the safety acknowledgement and select its checkbox. Analysis remains
   unavailable until it is acknowledged.
3. Under **Capture or choose your swing**, select **Choose a video** and pick a
   local swing video file. Camera capture is not currently available.
4. Select **Begin analysis**. The app loads the local pose model and processes
   sampled video frames in the browser. You can stop the local analysis, or
   retry it if processing fails.
5. When processing completes, select **Review phase labels** to inspect the
   detected swing phases, keyframes, and available geometry and tempo metrics.
   Treat these as estimates for educational review, not medical, biomechanical,
   or professional-coaching conclusions.
6. Create a Swing Card from the completed review when useful:
   - **Download PNG** saves a local image summary.
   - **Print / Save as PDF** opens the browser print flow.
   - **Copy prompt** copies educational review context that you may choose to
     paste into another service yourself.
7. Use **Clear local app data** to remove Swing Sync's registered app data for
   this browser origin, including the safety acknowledgement. It does not erase
   downloaded files or guarantee device-level deletion.

Raw video is processed locally by default and is not included in Swing Card
exports. If you copy a prompt or share an exported card with another service,
that separate service's terms and privacy practices apply.

For more useful visual review, record with a stable camera, good lighting, and
your full body plus as much of the club path as practical in frame. Stop if you
feel pain or unusual discomfort, and consult qualified medical or golf coaching
professionals for personal concerns.

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
