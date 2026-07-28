# SS-019 Claude QA-Planning B1-B6 Focused Re-review Source Packet

Generated from the confirmed current main baseline at b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1 on 2026-07-20. Paste docs/ss-019-claude-qa-rereview-prompt.md first, then this packet immediately after it. Together they are one self-contained handoff.

No SS-019 runtime/UI implementation or story branch exists. Claude returned FAIL on the original planning packet; B1-B6 are accepted and revised, with additional lead-architect precision for closeActive ownership and synchronous callback-token invalidation. Builder remains blocked.

Notion synchronization could not be re-fetched or mutated during this response because the connector returned OAuth authorization required. The last verified intended board state remains 2. QA Planning (Claude), Pull Request empty, active branch main, planned branch unchanged. This packet does not claim a fresh live Notion verification.

The exact user-supplied Claude response was recovered from the local Codex session record, its outer Response from Claude quotation wrapper was removed, and a single conventional terminal newline was added when persisting docs/ss-019-claude-qa-raw-response.md; all response text and punctuation are otherwise byte-identical. The complete raw response and the complete lead disposition are both embedded. The nine pre-existing untracked docs/agent-guidance/*new-codex-session-prompt.md files are unrelated and intentionally omitted/preserved. Other unchanged files are omitted because B1-B6 concern the shell, focus/status lifecycle, named renderer groups, responsive CSS, and their direct tests. No dependency lockfile, generated bundle, notice, SBOM, service worker, manifest, model/provider, or remote-sharing file is in scope.

## Packet Manifest

| Kind | Path | Lines | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Complete current file | `AGENTS.md` | 70 | 3301 | `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e` |
| Complete current file | `.nvmrc` | 1 | 3 | `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56` |
| Complete current file | `index.html` | 22 | 820 | `786543eea8732ee944ca111dc0c3d908543fcfb08ff6e79252739907cb639365` |
| Complete current file | `package.json` | 38 | 1777 | `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0` |
| Complete current file | `playwright.config.ts` | 27 | 638 | `4675c312d39228c7a999af56869eaa4f4bb91883c0b0703c557259e3826d5fd6` |
| Complete current file | `docs/privacy-architecture.md` | 200 | 9344 | `e27485d3cb6ba794866658ef7ba01f075ea3cf4601b08a7ae8bd95875fac5bb6` |
| Complete current file | `docs/safety-terms.md` | 117 | 5514 | `757c740e6908ebb9aa19e3e057d31c83a098d34aeb265338be4c0ee5a381e39f` |
| Complete current file | `docs/licensing.md` | 167 | 6882 | `6083f25daef2aef4a688b375c3f53b6171050f7d6cb6e4e10e370a1ea81d26a5` |
| Complete current file | `docs/models-licensing.md` | 56 | 2449 | `749b529d0139c82cafde7d4ac44e199245f99b7c5b7fa82bdf67770b58d7a4a0` |
| Complete current file | `src/main.ts` | 44 | 1248 | `e6987db744a7e8c2724e63336d30b2500821a8f293437ff9af82f1d2f8be87d6` |
| Complete current file | `src/workflow.ts` | 41 | 1216 | `efa2763868e92a34d79662537705a6517246ae835bd1e1f7e47ba361411551a4` |
| Complete current file | `src/app-renderer.ts` | 223 | 10945 | `7705e320427a5142930188ed3cebe7e0fe5760d8958446d8de2ee487d4b9c4e8` |
| Complete current file | `src/app-events.ts` | 159 | 6822 | `6b9da4f5fd1aa8e45b6d14196b59082e0f45738bc5d6129c03334285e1e55b9e` |
| Complete current file | `src/app-state.ts` | 182 | 5834 | `c9ae9732cac6808173dd7d759099114f225915d2ca97b557478221e39ffb09c9` |
| Complete current file | `src/consent-state.ts` | 40 | 1002 | `40e62d53ab7b759065c4f4be2a90453caeb938ea62790066dd2ac32a0a6c0164` |
| Complete current file | `src/analysis-lifecycle.ts` | 105 | 3821 | `cde9a6f811927ff93b0312c8663fdae599ae810672ab45083dca9ecf783f6bf0` |
| Complete current file | `src/phase-review-renderer.ts` | 131 | 6420 | `8d92b88b4afeaa0d6757f7a4fe1cb3c65d026a4853bce94e7bd348199b915ef2` |
| Complete current file | `src/remote-model-renderer.ts` | 38 | 1856 | `83b30d3ae95f529fc58192224bb129d41dee4fb6fbd5bb09eb681ed8b878eaef` |
| Complete current file | `src/keyframe-overlay-renderer.ts` | 40 | 1627 | `7780ae6558db6ef02613072b8cc3037a5df98ee9b3d8ea0e65275dfdf4e086d9` |
| Complete current file | `src/swing-card-actions.ts` | 130 | 4493 | `e0ee4400bd5a15c995c56fe146518ad3746adf75b39cebb485caf024a2e020f3` |
| Complete current file | `src/render-utils.ts` | 30 | 1049 | `02080c21e9c8a2b86c60c61396e6241860e287c1ca379756c7c991f88d809853` |
| Complete current file | `src/styles.css` | 858 | 13229 | `c305b3f39d44495dec7e9bd47c36065923a5510cf9fa5d603f84aba3fb7d74a2` |
| Complete current file | `test/smoke/app.spec.ts` | 618 | 26942 | `bc22d1904050af53ec6d43845f3906c62cc9cf96779ac5af033fae2f8594835d` |
| Complete current file | `test/unit/app-renderer.test.ts` | 147 | 5007 | `a3b7d7f0e81c116082a134c53ac6a66fe378d14fb46b4265b6fa50dfca2b245b` |
| Complete current file | `test/unit/app-events.test.ts` | 54 | 1563 | `f3a5e94aff173401f31e5f2f1fc451f725524253bee092b6677d83194c71f2a7` |
| Complete current file | `test/unit/app-state.test.ts` | 53 | 1748 | `1e1eb4389468a887bc969f7028a289e258076bc81ad7aa09242d9756e615300f` |
| Complete current file | `test/unit/consent-state.test.ts` | 72 | 2380 | `8eaa2ce551f7872573a6496cd4b499d4f65a8dd7d851fc635d89f089d2143d5d` |
| Complete current file | `test/unit/analysis-lifecycle.test.ts` | 128 | 4238 | `f486920cc919b5f2e4a975745d697cde1d222278ca4f789fe51d82a3df3b33a5` |
| Complete current file | `test/unit/phase-review.test.ts` | 168 | 6762 | `45abf54863973aec701ea7348ffea85cd8fd74e2e177c70361c9699deb7bd611` |
| Complete current file | `test/unit/render-utils.test.ts` | 17 | 734 | `fc5bc303edd86ddbca276466ae72a1353458ba3352a4b06b89eee54016ad9060` |
| Complete current file | `test/unit/swing-card-actions.test.ts` | 71 | 2686 | `3c93b04e735c5f25bddbbdbb54a7a044af98ba6792ca2f435836776836870b60` |
| Complete current file | `docs/ss-019-research-disposition.md` | 289 | 16184 | `d63840bcdd0d36e3aa45968c3b8ac8961857d879db51ab24e4464f2c64b97e5f` |
| Complete current file | `docs/ss-019-preimplementation-spec.md` | 609 | 35860 | `a92cf0f244f5e5a7015cd9824c0648bf626e120ee0a22b0d8f64cce2bf5db7cd` |
| Complete current file | `docs/ss-019-claude-qa-response.md` | 253 | 12298 | `66ec05645941d4289f3a380e4d2022c0c0dc30ce1fc34857249a8588477d7990` |
| Complete current file | `docs/ss-019-claude-qa-planning-prompt.md` | 245 | 12825 | `0d53401576b4eb19d7e2dfb639598ee21e256cacb4357c66f78c20857da973f8` |
| Complete current file | `docs/ss-019-claude-qa-rereview-prompt.md` | 134 | 7015 | `ec67d0d790efa0d620c13984221cd83d994cc5a2b83a679acf2b5632915a0a30` |
| Complete current file | `docs/ss-019-claude-qa-raw-response.md` | 77 | 17232 | `4f7afede4006ee31a08b48aad44bfb17aff531c0da98468c3a7009e72c60d320` |
| Complete focused diff | `git diff -- CONTEXT.md` | 235 | 13758 | `9fc07f6b10c0b15d2817940f48fc0eee6c7ee66726e3fcb501bd29d8ae9f6d09` |
| Complete focused diff | `original-spec -> revised-spec` | 489 | 32045 | `3e448fb1008f0d68c0bc9270e4aad3c2c1a6c7267a01ea31fe1cf86deabd60a0` |
| Explicit absent record | `src/app-accessibility.ts` | 1 | 172 | `2704eb810adad2231e7ffd71ff3e91b17d7e173b51d49c1c9fdb11648f65da9e` |

## Mechanical Verification Contract

Every manifest row has exactly one unique BEGIN/END block below. Complete-file blocks are exact current bytes; diff blocks are exact generated outputs; the absent record is explicit. The fence was selected only after confirming it occurs in no payload. Readiness requires equal manifest/block counts, unique markers, byte/hash/line matches, terminating newlines, no truncation, and byte-for-byte re-extraction.

## Exact Evidence Blocks

### 01 Complete current file: AGENTS.md

Lines: 70  
Bytes: 3301  
SHA-256: `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e`

<!-- BEGIN EXACT BLOCK: 01 Complete current file: AGENTS.md -->
````````````````````````````````````````text
# Repository Guidelines

## Start With Current State

Read [`CONTEXT.md`](./CONTEXT.md) before starting work. Confirm the next task,
acceptance criteria, branch, and handshake status in the Swing Sync Notion task
database before implementation. After PR creation, audit results, or merge
state changes, keep Notion and `CONTEXT.md` synchronized.

Keep changes within the accepted story scope. For runtime changes, document
whether observability was added, intentionally unchanged, or deferred.

## Sensitive Story Rules

For safety, privacy, legal, medical, AI-coaching, model-provider, or
compliance-sensitive stories, keep roles explicit:

- Gemini researches and drafts specifications.
- Codex implements, verifies, and maintains repository state.
- Claude performs adversarial audit and re-review.

Treat Gemini research as input, not authority. Before implementation, classify
broad recommendations as Adopt, Revise, Defer, or Reject. Claude adversarial
review is required before a sensitive story is Done. After fixes, use a
separate focused re-review prompt containing prior findings, applied fixes,
relevant current context, verification, and a focused diff.

Browser-chat prompts must embed all required repository context; Gemini and
Claude Chat do not have filesystem or GitHub access.

After Claude or implementation feedback, convert repeatable lessons into
durable process updates. Prefer this loop: classify each finding as blocker,
non-blocking recommendation, or future work; update the spec and tests before
implementation when the finding changes acceptance or verification; get a
focused re-review for sensitive stories; then capture reusable rules in
`CONTEXT.md` and, when they affect future delivery, this file or the relevant
`.agents/skills/*/SKILL.md`. Do not rely on chat memory alone.

For sensitive verifier or documentation changes, audit packets should include
every changed tracked file or an explicit rationale for omission. Test evidence
should include named tests mapped to acceptance criteria or audit blockers when
coverage is part of the sign-off decision.

## Product And Compliance Boundaries

Preserve the local-first rules in
[`docs/privacy-architecture.md`](./docs/privacy-architecture.md): raw swing
video is not uploaded by default, and remote sharing requires a separate,
explicit opt-in. Do not make absolute privacy, safety, legal, deletion,
anonymity, or compliance claims.

Follow [`docs/safety-terms.md`](./docs/safety-terms.md) for user-facing and AI
coaching boundaries. Follow [`docs/licensing.md`](./docs/licensing.md) and
[`docs/models-licensing.md`](./docs/models-licensing.md) before adding
dependencies, reference-derived code, model assets, SDKs, or providers.

## Verification

Use Node 22 from `.nvmrc`. Run the checks required by the changed surface and
record results in the PR:

- Baseline runtime/docs changes: `npm run build` and
  `npm run compliance:verify`.
- Dependency, bundle, or licensing changes: also run `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.
- Targeted boundaries: run `npm run safety:verify` or
  `npm run privacy:verify` when those surfaces change.

Complete [`.github/pull_request_template.md`](./.github/pull_request_template.md)
and preserve required notices.
````````````````````````````````````````
<!-- END EXACT BLOCK: 01 Complete current file: AGENTS.md -->

### 02 Complete current file: .nvmrc

Lines: 1  
Bytes: 3  
SHA-256: `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56`

<!-- BEGIN EXACT BLOCK: 02 Complete current file: .nvmrc -->
````````````````````````````````````````text
22
````````````````````````````````````````
<!-- END EXACT BLOCK: 02 Complete current file: .nvmrc -->

### 03 Complete current file: index.html

Lines: 22  
Bytes: 820  
SHA-256: `786543eea8732ee944ca111dc0c3d908543fcfb08ff6e79252739907cb639365`

<!-- BEGIN EXACT BLOCK: 03 Complete current file: index.html -->
````````````````````````````````````````text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f3f5f1" />
    <meta
      name="description"
      content="A local-first golf swing analysis workflow scaffold."
    />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'"
    />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>Swing Sync | New analysis</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
````````````````````````````````````````
<!-- END EXACT BLOCK: 03 Complete current file: index.html -->

### 04 Complete current file: package.json

Lines: 38  
Bytes: 1777  
SHA-256: `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0`

<!-- BEGIN EXACT BLOCK: 04 Complete current file: package.json -->
````````````````````````````````````````text
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "docs:verify": "node scripts/verify-docs-claims.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "fixture:verify": "node scripts/verify-fixtures.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify && npm run docs:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  },
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 04 Complete current file: package.json -->

### 05 Complete current file: playwright.config.ts

Lines: 27  
Bytes: 638  
SHA-256: `4675c312d39228c7a999af56869eaa4f4bb91883c0b0703c557259e3826d5fd6`

<!-- BEGIN EXACT BLOCK: 05 Complete current file: playwright.config.ts -->
````````````````````````````````````````text
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/smoke",
  outputDir: "test-results",
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ],
  webServer: {
    command: "npm run build && node_modules/.bin/vite preview --host 127.0.0.1 --port 4174",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 60_000
  }
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 05 Complete current file: playwright.config.ts -->

### 06 Complete current file: docs/privacy-architecture.md

Lines: 200  
Bytes: 9344  
SHA-256: `e27485d3cb6ba794866658ef7ba01f075ea3cf4601b08a7ae8bd95875fac5bb6`

<!-- BEGIN EXACT BLOCK: 06 Complete current file: docs/privacy-architecture.md -->
````````````````````````````````````````text
# Privacy Architecture and Video Data Lifecycle

**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for future
video analysis work. It is product and engineering guidance, not legal advice
or a guarantee of privacy, security, deletion, or regulatory compliance.

## Default Privacy Posture

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection and local Pose
Landmarker inference for sampled video frames. It does not implement camera
capture, raw-video or landmark persistence, exports, remote sharing, or remote
model APIs. The current consent acknowledgement is a local scaffold, not a
durable legal or privacy record.

## Data Classes

| Class | Data | Default storage | Default network policy |
| --- | --- | --- | --- |
| A | Raw swing video files | Future local browser storage or in-memory session state | Blocked by default |
| B | Derived frames or image pixels | Volatile in-memory processing state | Blocked by default |
| C | Pose landmarks and body keypoints | Future structured local storage | Explicit opt-in required |
| D | Computed metrics, angles, tempo, and phase labels | Future structured local storage | Explicit opt-in required |
| E | Swing Card exports and selected report files | User-initiated browser download | User controls downloaded file |
| F | Prompts, model inputs, and model outputs | Future local storage only if needed | Explicit opt-in required |
| G | Safety, educational-use, and privacy acknowledgement state | Minimal local browser scaffold state | Local only by default; not a reviewed durable privacy record |

Derived landmarks and metrics should be treated as sensitive user data. Even
without a face or background video, movement patterns, timing, body proportions,
and swing mechanics may be personal or identifying when combined with other
data.

## Local-First Processing Flow

Future video analysis should follow this default sequence:

1. The user selects or captures a swing video.
2. The app previews the video locally.
3. Frame extraction runs in browser execution context without default network
   upload.
4. Pose extraction runs locally only after model and asset rights are approved.
5. Volatile frame data is released after processing.
6. Derived landmarks and metrics are stored locally only if the feature needs a
   history or review state.
7. Reports or Swing Cards are generated locally and downloaded only after a
   user-initiated export action.
8. Optional remote model or coach review remains disabled unless the user makes
   a separate explicit opt-in decision.

Runtime implementation must fail closed. If remote sharing has not been
explicitly enabled for the specific data class and destination, the app should
block the action instead of silently sending data.

## Video Lifecycle

Future video lifecycle behavior should be documented and implemented before any
raw swing video storage ships:

- **Selection:** The app should hold only the file reference needed for the
  active local session.
- **Preview:** Any object URLs should be revoked when no longer needed.
- **Processing:** Frame buffers should remain volatile and should not be
  persisted unless a future reviewed feature requires it.
- **Analysis:** Landmarks and metrics may be persisted locally only when needed
  for review, history, or export.
- **Refresh or close:** Unsaved raw video and volatile frames should be treated
  as session state unless the user has chosen a feature that stores them.
- **Deletion:** A clear-local-data action should remove Swing Sync's app-level
  references and local browser storage for the current origin.
- **Uninstall or browser data clearing:** The browser or operating system may
  remove site data according to platform behavior and user settings.

Browser storage behavior varies by engine, device, available space, private
browsing mode, user settings, installed-PWA state, and whether storage is
best-effort or persistent. Swing Sync must not promise that local browser data
is permanent, encrypted, immune to browser eviction, or physically erased from
device storage after deletion.

## Export Policy

Manual exports should be user-initiated and data-minimized.

Default analytical exports may include:

- swing metrics;
- pose landmarks or keypoint-derived measurements;
- selected warnings or limitations;
- educational feedback text; and
- selected keyframes only if the user explicitly chooses an image export.

Default analytical exports must not include raw swing video. If a future raw
video export exists, it should be a separate explicit choice with clear copy
that the downloaded file is outside Swing Sync's local browser controls.

Exports must not be described as anonymous. Landmarks, metrics, images, and
feedback may still be sensitive or identifying.

## Optional Remote Model or Coach Sharing

Optional remote sharing is not approved yet. Before any remote model, hosted
model API, cloud storage, or coach-review feature is implemented, Swing Sync
must document:

- provider name and service terms;
- SDK source license;
- model or model-asset rights, if applicable;
- data classes transmitted;
- retention and training-use terms;
- whether human review may occur;
- destination origins;
- user opt-in and revocation UX; and
- privacy impact for raw video, frames, landmarks, metrics, prompts, and
  generated outputs.

Raw swing video and frame pixels remain blocked by default. Derived landmarks,
metrics, prompts, and reports require explicit opt-in before remote sharing.

## User-Facing Copy Drafts

First analysis privacy copy:

> Swing Sync processes swing feedback locally by default. Raw swing video stays
> on this device unless you separately choose a feature that sends it elsewhere.
> Derived landmarks, metrics, reports, or prompts may still be sensitive. Swing
> Sync is educational only and is not medical advice, diagnosis, rehabilitation,
> or professional athletic instruction.

Export copy:

> This export is generated in your browser and saved to your device. It may
> include sensitive swing metrics, landmarks, feedback, or selected images. You
> control what happens to the downloaded file after it leaves Swing Sync.

Optional remote sharing copy:

> Remote review is optional and off by default. If you enable it, Swing Sync
> will show what data is sent, where it is sent, and what provider terms apply
> before anything leaves your device.

Clear-local-data copy:

> Clearing local data removes Swing Sync's app data for this browser origin,
> including local acknowledgement state and future stored swing analysis data.
> Browser or device storage systems may retain lower-level remnants outside the
> app's control, so this is not device-level erasure.

## Future Implementation Gates

Before shipping video processing or remote analysis, add tests or verification
for:

- raw video upload blocked by default;
- frame pixels blocked from network transit;
- explicit opt-in before sharing landmarks, metrics, prompts, or reports;
- clear-local-data behavior for every storage API in use;
- private-browsing and storage-eviction copy;
- export contents and warnings;
- model SDK telemetry and destination origins; and
- CSP, service worker, and runtime network guard behavior if those controls are
  implemented.

## SS-005 MediaPipe Provider-Metrics Gate

On 2026-06-10, the maintainer provided a response attributed to Google stating
that the current Web SDK does not include telemetry, does not send input data,
and may add aggregated performance and usage telemetry in the future without a
planned opt-out. Google also stated that future outbound requests may be blocked
while continuing to use the SDK normally.

The maintainer approved exact `@mediapipe/tasks-vision@0.10.35` on 2026-06-11
as having no current provider-metrics consent requirement. This does not
approve future versions. Any SDK upgrade requires fresh privacy, terms, and
observed-network review.

SS-005 implements:

- the exact approved SDK version and public provider response in MediaPipe
  issue #6306;
- observed and attempted network requests during initialization and inference;
- whether the SDK remains functional when all external requests are blocked;
- fail-closed behavior for any unexpected external request; and
- a fresh consent/product decision before adopting any future version that
  includes provider telemetry;
- a dedicated worker for local model initialization and inference;
- volatile transferable `ImageBitmap` frames closed after inference;
- no raw-video, frame, or landmark persistence;
- same-origin WASM/model delivery without service-worker model caching;
- CSP blocking of unexpected external connections; and
- visible sanitized local error codes when initialization, inference, worker,
  or unexpected-network failures stop a session.

Observability is intentionally limited to local UI state and sanitized stable
error codes. Raw frames, landmarks, media characteristics, and user identifiers
must not be written to console output, logs, storage, or remote systems.
````````````````````````````````````````
<!-- END EXACT BLOCK: 06 Complete current file: docs/privacy-architecture.md -->

### 07 Complete current file: docs/safety-terms.md

Lines: 117  
Bytes: 5514  
SHA-256: `757c740e6908ebb9aa19e3e057d31c83a098d34aeb265338be4c0ee5a381e39f`

<!-- BEGIN EXACT BLOCK: 07 Complete current file: docs/safety-terms.md -->
````````````````````````````````````````text
# Safety Terms and Educational Use Draft

**DRAFT - pending legal/human review; not for release.**

This document is product-compliance draft language for human and legal review.
It is not legal advice, does not guarantee enforceability, and should be
reviewed before release.

## Intended Use

Swing Sync provides local-first, educational golf swing feedback. It is designed
to help users observe movement patterns and practice general skill awareness.
It is not medical advice, physical therapy, rehabilitation guidance, injury
diagnosis, pain triage, or professional athletic instruction.

Raw swing video must remain on the user's device by default. Any future remote
model, cloud storage, or coach-review feature must require a separate opt-in
flow before raw swing video leaves the device.

## Assumption of Risk Draft

Golf practice, swing changes, exercise, and physical movement involve risk.
Those risks may include soreness, strain, falls, impact injuries, equipment
injuries, aggravation of an existing condition, or other injury. Users should
practice in a safe location, warm up appropriately, stop if they feel pain,
dizziness, numbness, weakness, or unusual discomfort, and consult a qualified
professional before changing activity if they have health, mobility, or injury
concerns.

By using Swing Sync for analysis, the user acknowledges that golf practice and
movement changes are voluntary activities and that they are responsible for
deciding whether to participate, how intensely to practice, and whether to seek
professional medical, fitness, or coaching guidance.

## Release of Liability Draft

To the maximum extent permitted by applicable law, the user agrees that Swing
Sync, its maintainers, contributors, and distributors are not responsible for
injury, loss, or damage arising from the user's practice, swing changes,
equipment use, training decisions, or reliance on educational feedback provided
by the app.

This draft release should not be read as waiving rights that cannot legally be
waived. It is intended as review-ready product language and must be evaluated
for the jurisdictions and release context where Swing Sync is offered.

## Educational Feedback Boundary

User-facing copy and AI coaching output must:

- describe feedback as educational information only;
- avoid presenting feedback as medical advice, pain diagnosis, rehabilitation,
  physical therapy, or professional athletic instruction;
- avoid guarantees of injury prevention, performance improvement, or swing
  correctness;
- encourage users to stop activity if pain or concerning symptoms occur; and
- direct users with pain, injury, medical conditions, or safety concerns to a
  qualified medical professional or qualified golf coach as appropriate.

## Consent Gate Requirement

Before the first swing analysis, the app must block analysis until the user has
explicitly acknowledged all of the following:

- Swing Sync is for educational use only.
- Swing Sync is not medical advice, pain diagnosis, rehabilitation guidance, or
  professional athletic instruction.
- Golf practice and movement changes involve risk, and the user accepts
  responsibility for deciding whether and how to practice.
- The user should stop if they feel pain or concerning symptoms and seek
  qualified help when appropriate.
- Raw swing video stays on the device by default unless the user separately
  opts in to a feature that sends it elsewhere.

The consent gate should store only the minimum local acknowledgement state
needed to avoid repeated prompts. It should not upload consent records or raw
video by default.

The consent gate must be accessible and usable. It should not depend on rigid
scroll-completion mechanics as the only evidence of review unless legal/human
review specifically approves that interaction.

## AI Coach Prompt Constraints

Future AI coach prompts and system instructions must include constraints that:

- prohibit diagnosing pain, injuries, medical conditions, mobility limits, or
  causes of symptoms;
- prohibit medical triage, rehabilitation plans, therapy exercises, or
  treatment instructions;
- prohibit aggressive mechanical prescriptions such as forcing range of motion,
  training through pain, or making abrupt high-load changes;
- frame suggestions as optional, low-intensity, educational observations;
- recommend stopping activity when pain, numbness, dizziness, weakness, or
  unusual discomfort is present;
- recommend qualified medical review for pain, injury, or health concerns; and
- recommend qualified coaching review for sport-specific instruction beyond
  general educational feedback.

Automated guardrails, keyword filters, system prompts, or output checks should
be treated as defense-in-depth controls. They do not guarantee that all unsafe
or adversarial requests will be caught, especially in client-side or local-first
execution contexts.

## Review Checklist

- [ ] Legal/human reviewer approved assumption-of-risk language.
- [ ] Legal/human reviewer approved release-of-liability language.
- [ ] Consent gate blocks first analysis before acknowledgement.
- [ ] Consent gate does not upload raw swing video or consent records by
      default.
- [ ] AI coaching prompt constraints reject pain diagnosis and rehabilitation
      advice.
- [ ] AI coaching prompt constraints reject unsafe or aggressive movement
      prescriptions.
- [ ] Gemini research disposition reviewed and accepted, revised, deferred, or
      rejected for each major recommendation.
````````````````````````````````````````
<!-- END EXACT BLOCK: 07 Complete current file: docs/safety-terms.md -->

### 08 Complete current file: docs/licensing.md

Lines: 167  
Bytes: 6882  
SHA-256: `6083f25daef2aef4a688b375c3f53b6171050f7d6cb6e4e10e370a1ea81d26a5`

<!-- BEGIN EXACT BLOCK: 08 Complete current file: docs/licensing.md -->
````````````````````````````````````````text
# Swing Sync Licensing and Dependency Policy

Swing Sync uses Apache-2.0 for project source code. This document records the
engineering compliance policy for dependencies, reference repositories, SBOMs,
and notices. It is not legal advice.

## Human License Decision

Apache-2.0 is the approved project license for SS-001 implementation. The
decision was made by the project maintainer, Jason Alvarez, after Claude QA gave
SS-001 a PASS on 2026-06-04.

## License Sets

Allowed in production bundles:

- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- CC0-1.0
- 0BSD

Blocked in production bundles:

- GPL-2.0-only / GPL-2.0-or-later
- GPL-3.0-only / GPL-3.0-or-later
- AGPL-3.0-only / AGPL-3.0-or-later
- LGPL-2.1-only / LGPL-2.1-or-later
- LGPL-3.0-only / LGPL-3.0-or-later
- unlicensed packages
- unknown, custom, or non-SPDX license identifiers
- proprietary packages without written permission or contract

Exception-required:

- MPL-2.0
- dual-license expressions that cannot be parsed cleanly by automation
- model weights, model assets, or SDKs with terms separate from source licenses

## MPL-2.0 Rule

MPL-2.0 is blocked from production bundles by default. An exception may be
approved only when `docs/licensing.md` records all of the following:

- package name and version;
- why the package is needed;
- evidence that the package is architecturally isolated or otherwise compliant;
- whether the package includes a secondary-license incompatibility notice;
- maintainer approval and approval date; and
- the exact CI allowlist/config exception.

No MPL-2.0 exceptions are currently approved.

## Synthetic Fixture Note

The synthetic packages in `test/fixtures/` intentionally omit `private: true`
because `@onebeyond/license-checker` reports private packages as `UNLICENSED`
instead of reading their SPDX `license` field. They are scoped under
`@swing-sync-test/`, are not referenced by publishing automation, and exist only
to validate compliance gates.

## Dual-License Rule

When a dependency is dual-licensed with only permissive options, such as
`MIT OR Apache-2.0`, Swing Sync may use the dependency without a special
exception if every branch is in the allowed set.

When a dual-license expression contains any blocked or exception-required
identifier, such as `GPL-3.0-only OR MIT` or `MPL-2.0 OR Apache-2.0`, automation
must fail the dependency until a maintainer records a documented exception here.
Swing Sync does not silently elect a permissive branch when the same expression
also contains GPL, AGPL, LGPL, MPL-2.0, unknown, custom, or non-SPDX terms.

## Dev-Only Tool Boundary

Dev-only copyleft tools may be considered only if they are not bundled, served,
linked into the application, required at runtime, or used to generate source,
code, model assets, or other files incorporated into the production output.

AGPL dependencies are blocked entirely until a maintainer explicitly approves a
documented exception.

## Reference Repository Reuse

Clean-room reimplementation is the default for reference repositories.

For unlicensed or copyleft references:

- do not copy, fork, port, or adapt code;
- do not copy model weights or datasets without explicit permission;
- high-level concepts may be summarized in a non-code functional specification;
- implementation must be written independently from that specification.

For MIT, Apache-2.0, BSD, ISC, CC0-1.0, or 0BSD references:

- clean-room reimplementation is preferred;
- derivative reuse requires explicit maintainer review in the pull request;
- the PR must identify source URL, file path, and license;
- original copyright/license notices must be preserved when required; and
- `THIRD_PARTY_NOTICES.md` must be updated.

## Reference Catalog

| Repository | License Status | Policy |
| --- | --- | --- |
| `HeleenaRobert/golf-swing-analysis` | MIT at time of SS-001 research | Clean-room preferred; derivative reuse requires notice preservation. |
| `damilab/CaddieSet` | MIT at time of SS-001 research | Cite paper/dataset; runtime code reuse requires notice preservation. |
| `tlouth19/analyze.golf` | No visible license during SS-001 research | Clean-room only; do not copy or adapt code. |
| `ryanboscobanze/GolfPosePro` | MIT at time of SS-001 research | Clean-room preferred; verify notebook/media provenance before reuse. |
| `MingHanLee/GolfPose` | No visible license during SS-001 research | Clean-room only; do not copy code or model weights. |

## SBOM Policy

`docs/sbom.json` is the CycloneDX dependency inventory generated from the npm
dependency graph. It is not proof that the built browser bundle is license-clean.
Bundle compliance is checked separately through a Vite/Rollup license gate that
must be validated against a synthetic prohibited package fixture installed as a
local dev package.

The current scaffold has no production runtime dependencies, so
`docs/sbom.json` may contain an empty `components` array after
`scripts/filter-sbom.js` removes dev-only and extraneous packages from the
CycloneDX generator output. Once runtime dependencies are added, production
components must appear in the SBOM and dev-only packages must remain absent.

The SBOM is stored in `docs/` and may also be attached to GitHub releases. It is
not served from `public/` by default.

## Apache NOTICE Obligations

Apache-2.0 dependencies may include upstream `NOTICE` files that must be
preserved. `scripts/aggregate-notices.js` must source NOTICE files from the
production-resolved dependency graph only, using one of:

- `npm ls --omit=dev --json`;
- `docs/sbom.json`; or
- a lockfile-derived production dependency graph.

The script must not crawl all of `node_modules` indiscriminately.

## Model and SDK Policy

See `docs/models-licensing.md`. No model binaries or model weights may be
committed, vendored, served, or fetched until per-model rights are documented.

Optional model API SDKs require two independent approvals:

- the SDK source license must satisfy this policy; and
- provider service terms must permit Swing Sync's intended local-first,
  opt-in data sharing behavior.

For SS-005, exact `@mediapipe/tasks-vision@0.10.35` is an approved pinned
production dependency. Google has stated that current Web SDKs are Apache-2.0
and that the current Web SDK does not include telemetry.
The inspected exact package contains compiled WASM and does not package LICENSE
or NOTICE files. On 2026-06-11, the maintainer approved reliance on Google's
SDK-wide license statement for packaged compiled artifacts and the plan to
distribute Apache-2.0 license text plus third-party attribution.
Any later SDK version requires a fresh license, privacy, provider-metrics, and
network review. See `docs/ss-005-google-provider-response.md`.

## Trademark Timing

The name "Swing Sync" requires a preliminary trademark search before the
repository is made broadly public or promoted.
````````````````````````````````````````
<!-- END EXACT BLOCK: 08 Complete current file: docs/licensing.md -->

### 09 Complete current file: docs/models-licensing.md

Lines: 56  
Bytes: 2449  
SHA-256: `749b529d0139c82cafde7d4ac44e199245f99b7c5b7fa82bdf67770b58d7a4a0`

<!-- BEGIN EXACT BLOCK: 09 Complete current file: docs/models-licensing.md -->
````````````````````````````````````````text
# Model Licensing Policy

Swing Sync has approved one exact model and delivery decision for SS-005.

## Current Rule

Do not commit, vendor, serve, cache, or fetch model assets such as `.tflite`,
`.onnx`, WASM weights, or comparable model files until the project documents:

- model name and version;
- source URL;
- model card or license terms;
- redistribution and caching rights;
- commercial-use restrictions, if any;
- required citations or attribution; and
- privacy impact for any remote fetch or API call.

## SS-005 Approved MediaPipe Assets

The following exact assets were reviewed, approved, and added for SS-005:

- SDK candidate: exact `@mediapipe/tasks-vision@0.10.35`.
- Model candidate: Pose Landmarker Full, float16, version 1,
  `pose_landmarker_full.task`.

On 2026-06-10, the maintainer provided a response attributed to Google stating:

- the current Web SDK does not include telemetry;
- future aggregated performance/usage telemetry is planned, without a planned
  opt-out, although outbound requests may be blocked;
- the exact Pose Landmarker Full float16 version 1 URL is Apache-2.0; and
- current Web SDKs are Apache-2.0, with future npm packages expected to include
  NOTICE and LICENSE files.

The maintainer approved reliance on the Apache-2.0 model statement in public
MediaPipe issue #6306 on 2026-06-11. It supports commercial use,
redistribution, same-origin serving, and caching of the exact model. The
preferred SS-005 delivery is vendoring and same-origin serving of the exact
asset with a pinned SHA-256, source URL, license text, and attribution. Runtime
provider fetch is not approved. Service-worker caching remains separately
reviewed.

Claude returned implementation-start PASS on 2026-06-11. The exact dependency,
packaged WASM runtime, and exact model are vendored and served same-origin.
`scripts/verify-pose-assets.js` enforces their approved SHA-256 values.
`docs/model-assets/pose-landmarker-full-float16-v1.md` records the exact model
source and decision. Service-worker model caching remains unapproved and is not
implemented. Do not claim tests prove all future SDK versions lack telemetry.

See `docs/ss-005-google-provider-response.md` and
`docs/ss-005-research-disposition.md` for the complete decision record.

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
````````````````````````````````````````
<!-- END EXACT BLOCK: 09 Complete current file: docs/models-licensing.md -->

### 10 Complete current file: src/main.ts

Lines: 44  
Bytes: 1248  
SHA-256: `e6987db744a7e8c2724e63336d30b2500821a8f293437ff9af82f1d2f8be87d6`

<!-- BEGIN EXACT BLOCK: 10 Complete current file: src/main.ts -->
````````````````````````````````````````text
import "./styles.css";
import { AnalysisLifecycle } from "./analysis-lifecycle";
import { bindAppEvents } from "./app-events";
import { renderApp } from "./app-renderer";
import { createInitialAppState } from "./app-state";
import { createSafetyConsentStore } from "./consent-state";
import { renderSelectedKeyframeCanvas } from "./keyframe-overlay-renderer";

const app = document.querySelector<HTMLDivElement>("#app");
const state = createInitialAppState();
const consent = createSafetyConsentStore();

function requestRender(statusMessage?: string): void {
  if (!app) return;
  renderApp(app, state, consent.hasSafetyConsent(), statusMessage);
  bindAppEvents(app, {
    state,
    consent,
    lifecycle,
    requestRender
  });
  renderSelectedKeyframeCanvas(app, state);
}

const lifecycle = new AnalysisLifecycle({
  root: app ?? document,
  state,
  requestRender
});

requestRender();

window.addEventListener("beforeunload", () => {
  void lifecycle.closeActive();
});
document.addEventListener("securitypolicyviolation", () => {
  lifecycle.abortWithNetworkBlocked();
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 10 Complete current file: src/main.ts -->

### 11 Complete current file: src/workflow.ts

Lines: 41  
Bytes: 1216  
SHA-256: `efa2763868e92a34d79662537705a6517246ae835bd1e1f7e47ba361411551a4`

<!-- BEGIN EXACT BLOCK: 11 Complete current file: src/workflow.ts -->
````````````````````````````````````````text
export const workflowSteps = [
  {
    id: "capture",
    shortLabel: "Capture",
    label: "Capture or upload",
    status: "Ready for consent",
    description: "Choose how a future local analysis session will begin."
  },
  {
    id: "processing",
    shortLabel: "Process",
    label: "Processing",
    status: "Local only",
    description: "Load the approved local pose model and process selected video frames."
  },
  {
    id: "review",
    shortLabel: "Review",
    label: "Review",
    status: "No results",
    description: "Preview the stable layout for future swing feedback and metrics."
  },
  {
    id: "export",
    shortLabel: "Export",
    label: "Export",
    status: "Local download",
    description: "Download a local Swing Card or open the browser print dialog."
  }
] as const;

export type WorkflowStepId = (typeof workflowSteps)[number]["id"];

export function getWorkflowStep(id: WorkflowStepId) {
  return workflowSteps.find((step) => step.id === id) ?? workflowSteps[0];
}

export function getNextWorkflowStep(id: WorkflowStepId) {
  const currentIndex = workflowSteps.findIndex((step) => step.id === id);
  return workflowSteps[Math.min(currentIndex + 1, workflowSteps.length - 1)];
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 11 Complete current file: src/workflow.ts -->

### 12 Complete current file: src/app-renderer.ts

Lines: 223  
Bytes: 10945  
SHA-256: `7705e320427a5142930188ed3cebe7e0fe5760d8958446d8de2ee487d4b9c4e8`

<!-- BEGIN EXACT BLOCK: 12 Complete current file: src/app-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { selectCanBeginAnalysis } from "./app-state";
import type { FrameProcessingState } from "./frame-processing";
import { phaseDefinitions } from "./phase-review";
import { renderPhaseReview } from "./phase-review-renderer";
import { renderRemoteModelReviewPanel } from "./remote-model-renderer";
import { escapeHtml, formatSwingCardWarning } from "./render-utils";
import { deriveSwingCardContentWarnings } from "./swing-card-generator";
import { getWorkflowStep, workflowSteps } from "./workflow";

export function renderApp(root: HTMLElement, state: AppState, consentAccepted: boolean, statusMessage?: string): void {
  const step = getWorkflowStep(state.activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Choose a local video to begin analysis."
      : "First analysis is blocked until this acknowledgement is checked.");

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="/" aria-label="Swing Sync home">Swing Sync</a>
        <span class="local-badge">Local-first analysis</span>
      </header>
      <main class="workspace">
        <section class="workflow" aria-labelledby="workflow-heading">
          <div class="workflow-intro">
            <div><p class="eyebrow">New analysis</p><h1 id="workflow-heading">Capture or choose your swing</h1></div>
            <p>Raw swing video stays on your device. No feature will send it elsewhere without a separate, explicit opt-in step you initiate.</p>
          </div>
          <nav class="step-nav" aria-label="Analysis workflow">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button class="step-button ${item.id === state.activeStep ? "is-active" : ""}" type="button"
                    data-step="${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
                    <span class="step-number">${index + 1}</span><span>${item.shortLabel}</span>
                  </button>`
              )
              .join("")}
          </nav>
          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading">${step.label}</h2></div>
              <span class="stage-status">${step.status}</span>
            </div>
            <p class="stage-description">${step.description}</p>
            ${renderWorkflowPanel(state, consentAccepted)}
          </section>
        </section>
        <aside class="consent-panel" aria-labelledby="consent-heading">
          <p class="eyebrow">Required before first analysis</p>
          <h2 id="consent-heading">Safety acknowledgement</h2>
          <p>Swing Sync is for educational use only. It is not medical advice, pain diagnosis, rehabilitation guidance, or professional athletic instruction.</p>
          <ul>
            <li>Golf practice and swing changes involve injury risk.</li>
            <li>Stop if you feel pain, dizziness, numbness, weakness, or unusual discomfort.</li>
            <li>Consult qualified medical or coaching professionals for personal concerns.</li>
          </ul>
          <label class="consent-check">
            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable or legally audited consent record.</p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;
}

export function renderWorkflowPanel(state: AppState, consentAccepted: boolean): string {
  if (state.activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Local video source">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture is not part of this story</span>
        </button>
        <button class="source-option" type="button" data-video-picker>
          <span class="source-option__title">Choose a video</span>
          <span>${state.selectedVideo ? escapeHtml(state.selectedVideo.name) : "Select a local video file"}</span>
        </button>
        <input id="video-file" class="visually-hidden" type="file" accept="video/*" />
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${
          selectCanBeginAnalysis(state, consentAccepted) ? "" : "disabled"
        }>
          Begin analysis
        </button>
        <p class="action-note">The selected video and decoded frames remain volatile and local.</p>
      </div>
    `;
  }

  if (state.activeStep === "processing") {
    return `
      <div class="processing-placeholder" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
          <p data-pose-summary>${processingSummaryText(state)}</p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
      <div class="action-row">
        <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
        <button class="secondary-action" type="button" data-retry-analysis hidden>Retry local analysis</button>
        <button class="primary-action" type="button" data-review-phases ${
          state.processingState === "completed" ? "" : "hidden"
        }>Review phase labels</button>
      </div>
    `;
  }

  if (state.activeStep === "review") {
    if (state.phaseOutputs.length > 0) return renderPhaseReview(state);
    return `
      <div class="review-placeholder" aria-label="Review placeholder">
        <div class="swing-frame"><span>Video and pose preview</span></div>
        <dl class="metric-list">
          <div><dt>Tempo</dt><dd>--</dd></div>
          <div><dt>Balance</dt><dd>--</dd></div>
          <div><dt>Rotation</dt><dd>--</dd></div>
        </dl>
      </div>
      <button class="secondary-action" type="button" data-next-step>Preview export state</button>
    `;
  }

  if (state.phaseOutputs.length === 0) {
    return `
      <div class="export-placeholder" aria-label="Export placeholder">
        <p class="placeholder-kicker">Local Swing Card</p>
        <h3>Swing Card unavailable</h3>
        <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
      </div>
      <button class="secondary-action" type="button" disabled>Export is not available yet</button>
    `;
  }

  return renderSwingCardExport(state);
}

export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
  const status = root.querySelector<HTMLElement>(".processing-placeholder strong");
  const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");

  if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
  if (summary) summary.textContent = processingSummaryText(state);
  if (retry) retry.hidden = state.processingState !== "failed";
  if (review) review.hidden = state.processingState !== "completed";
}

function renderSwingCardExport(state: AppState): string {
  const phaseReady = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warnings = deriveSwingCardContentWarnings({
    keyframes: phaseDefinitions.map((phase) => ({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: undefined,
      overlay: undefined
    })),
    metricPayload: undefined,
    phaseReviewConfirmed: phaseReady
  });

  return `
    <section class="swing-card-panel" aria-labelledby="swing-card-heading">
      <div class="swing-card-panel__header">
        <div>
          <p class="placeholder-kicker">Local Swing Card</p>
          <h3 id="swing-card-heading">Downloadable summary</h3>
        </div>
        <span class="stage-status">Manual sharing</span>
      </div>
      <p>This card can include annotated keyframes, unavailable metric states, warnings, and prompt text for a manual LLM chat upload. Raw swing video is not included.</p>
      <div class="swing-card-summary" aria-label="Swing Card contents">
        <div><strong>${state.phaseOutputs.length}</strong><span>local keyframes</span></div>
        <div><strong>PNG</strong><span>download</span></div>
        <div><strong>Print</strong><span>save as PDF where supported</span></div>
      </div>
      <ul class="swing-card-warning-list" aria-label="Swing Card warnings">
        ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
      </ul>
      <div class="action-row swing-card-actions">
        <button class="primary-action" type="button" data-download-swing-card ${state.swingCardBusy ? "disabled" : ""}>Download PNG</button>
        <button class="secondary-action" type="button" data-print-swing-card ${state.swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
        <button class="secondary-action" type="button" data-copy-swing-card-prompt ${state.swingCardBusy ? "disabled" : ""}>Copy prompt</button>
        <p class="action-note" data-swing-card-status role="status">${escapeHtml(state.swingCardStatus)}</p>
      </div>
      <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
      ${renderRemoteModelReviewPanel()}
    </section>
  `;
}

function processingStatusText(state: FrameProcessingState, code?: string): string {
  return state === "loading"
    ? "Loading the local pose model in a background worker."
    : state === "processing"
      ? "Processing a local video frame."
      : state === "completed"
        ? "Local frame processing completed."
        : state === "failed"
          ? `Local pose analysis stopped (${code ?? "UNKNOWN_ERROR"}).`
          : state === "cancelled"
            ? "Local frame processing cancelled."
            : state === "closed"
              ? "Local pose session closed."
              : "Preparing local pose analysis.";
}

function processingSummaryText(state: AppState): string {
  return `${state.extractedFrameCount} of ${state.totalFrameCount} video frames processed.${
    state.latestLandmarkCount > 0
      ? ` ${state.latestLandmarkCount} normalized landmarks retained in the latest result.`
      : ""
  }`;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 12 Complete current file: src/app-renderer.ts -->

### 13 Complete current file: src/app-events.ts

Lines: 159  
Bytes: 6822  
SHA-256: `6b9da4f5fd1aa8e45b6d14196b59082e0f45738bc5d6129c03334285e1e55b9e`

<!-- BEGIN EXACT BLOCK: 13 Complete current file: src/app-events.ts -->
````````````````````````````````````````text
import type { AnalysisLifecycle } from "./analysis-lifecycle";
import {
  confirmPhaseReview,
  rebuildPhaseReviewState,
  selectKeyframe,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseConfirmation,
  setPhaseDeclaration,
  setPhaseDraftAssignment,
  type AppState
} from "./app-state";
import type { SafetyConsentStore } from "./consent-state";
import { declarationValue } from "./phase-review-renderer";
import { copySwingCardPrompt, downloadSwingCard, printSwingCard } from "./swing-card-actions";
import { getNextWorkflowStep, getWorkflowStep, type WorkflowStepId } from "./workflow";

export interface AppEventsDependencies {
  state: AppState;
  consent: SafetyConsentStore;
  lifecycle: AnalysisLifecycle;
  requestRender(statusMessage?: string): void;
}

export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependencies): void {
  const { state, consent, lifecycle, requestRender } = dependencies;

  root.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    consent.setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });

  root.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!consent.hasSafetyConsent()) {
      requestRender("Please acknowledge the safety terms before starting analysis.");
      root.querySelector<HTMLInputElement>("#safety-consent")?.focus();
      return;
    }
    if (!state.selectedVideo) {
      requestRender("Choose a local video before starting analysis.");
      return;
    }
    selectWorkflowStep(state, "processing");
    requestRender("Loading approved local pose assets. No video data leaves this device.");
    void lifecycle.startActive();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextStep = button.dataset.step as WorkflowStepId;
      const opensCompletedReview =
        state.activeStep === "processing" && state.processingState === "completed" && nextStep === "review";
      const preservesReviewData =
        ["review", "export"].includes(state.activeStep) && ["review", "export"].includes(nextStep);
      if (
        ["processing", "review", "export"].includes(state.activeStep) &&
        nextStep !== state.activeStep &&
        !opensCompletedReview &&
        !preservesReviewData
      ) {
        void lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
    });
  });

  root.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    selectWorkflowStep(state, getNextWorkflowStep(state.activeStep).id);
    requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
  });

  root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    root.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  root.querySelector<HTMLInputElement>("#video-file")?.addEventListener("change", (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    void lifecycle.closeActive();
    selectLocalVideo(state, file);
    requestRender("Local video selected. It has not been analyzed or persisted.");
  });

  root.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    requestRender("Camera capture remains out of scope. Choose a local video file.");
  });

  root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void lifecycle.stopActive();
  });

  root.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void lifecycle.retryActive();
  });

  root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "review");
    requestRender("Review the provisional phase labels before future measurements become available.");
  });

  root.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "view", declarationValue((event.currentTarget as HTMLSelectElement).value, "view"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
    setPhaseDeclaration(
      state,
      "handedness",
      declarationValue((event.currentTarget as HTMLSelectElement).value, "handedness")
    );
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "mirrored", declarationValue((event.currentTarget as HTMLSelectElement).value, "mirrored"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "setup", (event.currentTarget as HTMLInputElement).checked ? "confirmed" : "undeclared");
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
    select.addEventListener("change", () => {
      setPhaseDraftAssignment(state, Number(select.dataset.phaseIndex), Number(select.value));
      requestRender();
    });
  });
  root.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
    setPhaseConfirmation(state, (event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
    confirmPhaseReview(state);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "export");
    requestRender("Swing Card export opened.");
  });
  root.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectKeyframe(state, Number(button.dataset.keyframeIndex));
      requestRender();
    });
  });
  root.querySelector<HTMLButtonElement>("[data-download-swing-card]")?.addEventListener("click", () => {
    void downloadSwingCard(state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-print-swing-card]")?.addEventListener("click", () => {
    void printSwingCard(root, state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-copy-swing-card-prompt]")?.addEventListener("click", () => {
    void copySwingCardPrompt(state, requestRender);
  });
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 13 Complete current file: src/app-events.ts -->

### 14 Complete current file: src/app-state.ts

Lines: 182  
Bytes: 5834  
SHA-256: `c9ae9732cac6808173dd7d759099114f225915d2ca97b557478221e39ffb09c9`

<!-- BEGIN EXACT BLOCK: 14 Complete current file: src/app-state.ts -->
````````````````````````````````````````text
import type { FrameProcessingController, FrameProcessingState, SampledFrameOutput } from "./frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations,
  type PhaseReviewState
} from "./phase-review";
import type { PoseOverlayRenderResult } from "./pose-renderer";
import type { WorkflowStepId } from "./workflow";

export const initialSwingCardStatus = "Swing Card export is generated locally after review data exists.";

export interface AppState {
  activeStep: WorkflowStepId;
  selectedVideo: File | undefined;
  processingState: FrameProcessingState;
  poseStatusCode: string | undefined;
  extractedFrameCount: number;
  totalFrameCount: number;
  latestLandmarkCount: number;
  phaseOutputs: readonly SampledFrameOutput[];
  phaseDeclarations: PhaseDeclarations;
  phaseReviewState: PhaseReviewState | undefined;
  phaseDraft: PhaseAssignment[];
  phaseConfirmation: boolean;
  selectedKeyframeIndex: number;
  latestOverlayResult: PoseOverlayRenderResult | undefined;
  swingCardBusy: boolean;
  swingCardStatus: string;
}

export function createInitialAppState(): AppState {
  return {
    activeStep: "capture",
    selectedVideo: undefined,
    processingState: "idle",
    poseStatusCode: undefined,
    extractedFrameCount: 0,
    totalFrameCount: 0,
    latestLandmarkCount: 0,
    phaseOutputs: [],
    phaseDeclarations: undeclaredPhaseDeclarations(),
    phaseReviewState: undefined,
    phaseDraft: [],
    phaseConfirmation: false,
    selectedKeyframeIndex: 0,
    latestOverlayResult: undefined,
    swingCardBusy: false,
    swingCardStatus: initialSwingCardStatus
  };
}

export function undeclaredPhaseDeclarations(): PhaseDeclarations {
  return {
    view: "undeclared",
    handedness: "undeclared",
    mirrored: "undeclared",
    setup: "undeclared"
  };
}

export function selectCanBeginAnalysis(state: AppState, consentAccepted: boolean): boolean {
  return (
    state.activeStep === "capture" &&
    consentAccepted &&
    !!state.selectedVideo &&
    !["loading", "processing"].includes(state.processingState)
  );
}

export function selectWorkflowStep(state: AppState, step: WorkflowStepId): void {
  state.activeStep = step;
}

export function selectLocalVideo(state: AppState, video: File): void {
  state.selectedVideo = video;
}

export function setProcessingState(state: AppState, processingState: FrameProcessingState, code?: string): void {
  state.processingState = processingState;
  state.poseStatusCode = code;
}

export function setProcessingProgress(state: AppState, completed: number, total: number): void {
  state.extractedFrameCount = completed;
  state.totalFrameCount = total;
}

export function recordProcessingOutput(state: AppState, output: SampledFrameOutput): void {
  state.latestLandmarkCount = output.pose.landmarks[0]?.length ?? 0;
}

export function completeProcessingWithOutputs(
  state: AppState,
  controller: Pick<FrameProcessingController, "getOutputs">
): void {
  state.phaseOutputs = controller.getOutputs();
  state.selectedKeyframeIndex = 0;
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  rebuildPhaseReviewState(state);
}

export function resetProcessingCounters(state: AppState): void {
  state.extractedFrameCount = 0;
  state.totalFrameCount = 0;
  state.latestLandmarkCount = 0;
}

export function resetPhaseReview(state: AppState): void {
  state.phaseOutputs = [];
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  state.phaseReviewState = undefined;
  state.phaseDraft = [];
  state.phaseConfirmation = false;
  state.selectedKeyframeIndex = 0;
  state.latestOverlayResult = undefined;
  state.swingCardBusy = false;
  state.swingCardStatus = initialSwingCardStatus;
}

export function rebuildPhaseReviewState(state: AppState): void {
  const proposal = createPhaseProposal(state.phaseOutputs, state.phaseDeclarations);
  state.phaseReviewState = createPhaseReviewState(proposal);
  state.phaseDraft = proposal.assignments.map((assignment) => ({ ...assignment }));
  state.phaseConfirmation = false;
}

export function setPhaseDeclaration<K extends keyof PhaseDeclarations>(
  state: AppState,
  key: K,
  value: PhaseDeclarations[K]
): void {
  state.phaseDeclarations[key] = value;
}

export function setPhaseDraftAssignment(state: AppState, phaseIndex: number, sampleIndex: number): void {
  state.phaseDraft[phaseIndex] = {
    phaseId: phaseDefinitions[phaseIndex].id,
    sampleIndex
  };
  state.phaseConfirmation = false;
}

export function setPhaseConfirmation(state: AppState, confirmed: boolean): void {
  state.phaseConfirmation = confirmed;
}

export function confirmPhaseReview(state: AppState): void {
  if (!state.phaseReviewState) return;
  state.phaseReviewState = applyPhaseCorrection(
    state.phaseReviewState,
    state.phaseDraft,
    state.phaseConfirmation,
    state.phaseOutputs[0]?.runGeneration ?? -1
  );
}

export function selectKeyframe(state: AppState, keyframeIndex: number): void {
  state.selectedKeyframeIndex = keyframeIndex;
  state.latestOverlayResult = undefined;
}

export function setOverlayResult(state: AppState, overlayResult: PoseOverlayRenderResult): void {
  state.latestOverlayResult = overlayResult;
}

export function setSwingCardBusy(state: AppState, busy: boolean): void {
  state.swingCardBusy = busy;
}

export function setSwingCardStatus(state: AppState, status: string): void {
  state.swingCardStatus = status;
}

export function getCompleteSwingCardAssignments(state: AppState): readonly PhaseAssignment[] | undefined {
  const assignments = state.phaseReviewState?.correction?.assignments ?? state.phaseReviewState?.automaticProposal.assignments;
  return assignments && isValidCorrection(assignments) ? assignments : undefined;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 14 Complete current file: src/app-state.ts -->

### 15 Complete current file: src/consent-state.ts

Lines: 40  
Bytes: 1002  
SHA-256: `40e62d53ab7b759065c4f4be2a90453caeb938ea62790066dd2ac32a0a6c0164`

<!-- BEGIN EXACT BLOCK: 15 Complete current file: src/consent-state.ts -->
````````````````````````````````````````text
export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SafetyConsentStore {
  hasSafetyConsent(): boolean;
  setSafetyConsent(accepted: boolean): void;
}

export const consentStorageKey = "swing-sync:safety-consent:v1";

export function createSafetyConsentStore(storage: ConsentStorage = window.localStorage): SafetyConsentStore {
  let storageFailed = false;

  return {
    hasSafetyConsent: () => {
      if (storageFailed) return false;

      try {
        return storage.getItem(consentStorageKey) === "accepted";
      } catch {
        storageFailed = true;
        return false;
      }
    },
    setSafetyConsent: (accepted: boolean) => {
      try {
        if (accepted) {
          storage.setItem(consentStorageKey, "accepted");
          return;
        }
        storage.removeItem(consentStorageKey);
      } catch {
        storageFailed = true;
      }
    }
  };
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 15 Complete current file: src/consent-state.ts -->

### 16 Complete current file: src/analysis-lifecycle.ts

Lines: 105  
Bytes: 3821  
SHA-256: `cde9a6f811927ff93b0312c8663fdae599ae810672ab45083dca9ecf783f6bf0`

<!-- BEGIN EXACT BLOCK: 16 Complete current file: src/analysis-lifecycle.ts -->
````````````````````````````````````````text
import { updateProcessingProgressUi } from "./app-renderer";
import type { AppState } from "./app-state";
import {
  completeProcessingWithOutputs,
  recordProcessingOutput,
  resetPhaseReview,
  resetProcessingCounters,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "./app-state";
import { createBrowserFrameController } from "./browser-frame-processing";
import type {
  FrameProcessingController,
  FrameProcessingState,
  SampledFrameOutput
} from "./frame-processing";

export interface AnalysisLifecycleOptions {
  root: ParentNode;
  state: AppState;
  requestRender(statusMessage?: string): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;

  constructor(private readonly options: AnalysisLifecycleOptions) {}

  hasActiveController(): boolean {
    return !!this.frameController;
  }

  async startActive(): Promise<void> {
    const video = this.options.root.querySelector<HTMLVideoElement>("#analysis-video");
    const selectedVideo = this.options.state.selectedVideo;
    if (!video || !selectedVideo) return;

    resetProcessingCounters(this.options.state);
    resetPhaseReview(this.options.state);
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(completed, total),
      onOutput: (output) => this.handleProcessingOutput(output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    this.options.requestRender("Local analysis stopped and volatile resources were released.");
  }

  async closeActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    this.options.requestRender();
  }

  async retryActive(): Promise<void> {
    // Retry progress is surfaced through the processing partial-update path.
    resetPhaseReview(this.options.state);
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(state: FrameProcessingState, code?: string): void {
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingProgress(completed: number, total: number): void {
    setProcessingProgress(this.options.state, completed, total);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingOutput(output: SampledFrameOutput): void {
    recordProcessingOutput(this.options.state, output);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 16 Complete current file: src/analysis-lifecycle.ts -->

### 17 Complete current file: src/phase-review-renderer.ts

Lines: 131  
Bytes: 6420  
SHA-256: `8d92b88b4afeaa0d6757f7a4fe1cb3c65d026a4853bce94e7bd348199b915ef2`

<!-- BEGIN EXACT BLOCK: 17 Complete current file: src/phase-review-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { isValidCorrection, phaseDefinitions, type PhaseDeclarations } from "./phase-review";

export function renderPhaseReview(state: AppState): string {
  const proposal = state.phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    proposal?.evidenceStatus === "unsupported-input"
      ? "Select every required declaration and provide a supported active eight-sample run."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview(state)}
      <div class="phase-warning" role="status" aria-live="polite">
        <strong id="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</strong>
        <p>${warning}</p>
      </div>
      <fieldset class="phase-declarations">
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, [
          ["undeclared", "Select view"],
          ["face-on", "Face-on side view"]
        ])}
        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, [
          ["undeclared", "Select handedness"],
          ["right", "Right-handed"],
          ["left", "Left-handed"]
        ])}
        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, [
          ["undeclared", "Select mirrored status"],
          ["no", "No"],
          ["yes", "Yes"]
        ])}
        <label class="phase-setup-confirmation">
          <input id="phase-setup" type="checkbox" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
          <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
        </label>
      </fieldset>
      <div class="phase-assignment-list" aria-label="Swing phase assignments">
        ${phaseDefinitions
          .map((phase, index) => {
            const selected = state.phaseDraft[index]?.sampleIndex ?? index;
            return `
              <label class="phase-assignment">
                <span><strong>${phase.label}</strong><small>Ordered phase ${index + 1}</small></span>
                <select aria-label="${phase.label} sample" data-phase-index="${index}" ${reviewRequired && !ready ? "" : "disabled"}>
                  ${phaseDefinitions
                    .map(
                      (_, sampleIndex) =>
                        `<option value="${sampleIndex}" ${sampleIndex === selected ? "selected" : ""}>Sample ${sampleIndex + 1}</option>`
                    )
                    .join("")}
                </select>
              </label>`;
          })
          .join("")}
      </div>
      <label class="phase-confirmation">
        <input id="phase-confirmation" type="checkbox" ${state.phaseConfirmation ? "checked" : ""} ${
          reviewRequired && !ready ? "" : "disabled"
        } />
        <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
      </label>
      <div class="action-row">
        <button class="primary-action" type="button" data-confirm-phase-review ${
          reviewRequired && state.phaseConfirmation && isValidCorrection(state.phaseDraft) && !ready ? "" : "disabled"
        }>Confirm phase review</button>
        <button class="secondary-action" type="button" data-open-export>Open Swing Card export</button>
        <p class="action-note">${ready ? "Future metric readiness is available for a separately reviewed story. No metrics are generated here." : "Future metric readiness remains locked until this review is valid and explicitly confirmed."}</p>
      </div>
    </section>
  `;
}

function renderKeyframeOverlayReview(state: AppState): string {
  const selectedOutput = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
  const overlayStatus =
    state.latestOverlayResult?.status === "unavailable"
      ? "Skeleton overlay unavailable for this keyframe."
      : state.latestOverlayResult?.status === "partial"
        ? "Skeleton overlay partially available for this keyframe."
        : "Skeleton overlay rendered for this keyframe.";

  return `
    <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
      <div class="keyframe-review__heading">
        <div>
          <p class="placeholder-kicker">Annotated keyframes</p>
          <h3 id="keyframe-review-heading">${selectedPhase.label}</h3>
        </div>
        <span class="stage-status">Annotated still</span>
      </div>
      <div class="keyframe-canvas-wrap">
        <canvas class="keyframe-canvas" data-keyframe-canvas aria-label="Annotated keyframe: ${selectedPhase.label}"></canvas>
      </div>
      <p class="action-note" data-overlay-status>${overlayStatus}</p>
      <div class="keyframe-strip" aria-label="Select keyframe">
        ${phaseDefinitions
          .map((phase, index) => {
            const isSelected = state.selectedKeyframeIndex === index;
            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" aria-pressed="${isSelected ? "true" : "false"}">
              <span>${index + 1}</span>
              <strong>${phase.label}</strong>
            </button>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderDeclarationSelect(
  id: string,
  label: string,
  selected: string,
  options: readonly (readonly [string, string])[]
): string {
  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}">${options
    .map(([value, text]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${text}</option>`)
    .join("")}</select></label>`;
}

export function declarationValue<K extends keyof PhaseDeclarations>(
  value: string,
  _key: K
): PhaseDeclarations[K] {
  return value as PhaseDeclarations[K];
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 17 Complete current file: src/phase-review-renderer.ts -->

### 18 Complete current file: src/remote-model-renderer.ts

Lines: 38  
Bytes: 1856  
SHA-256: `83b30d3ae95f529fc58192224bb129d41dee4fb6fbd5bb09eb681ed8b878eaef`

<!-- BEGIN EXACT BLOCK: 18 Complete current file: src/remote-model-renderer.ts -->
````````````````````````````````````````text
import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses
} from "./model-adapter-contract";
import { reviewedModelProviders } from "./model-consent";
import { formatRemoteDataClass } from "./render-utils";

export function renderRemoteModelReviewPanel(): string {
  const providerAvailable = reviewedModelProviders.length > 0;
  return `
    <section class="remote-model-panel" aria-labelledby="remote-model-heading">
      <div class="remote-model-panel__header">
        <div>
          <p class="placeholder-kicker">Optional remote review</p>
          <h4 id="remote-model-heading">Remote model review unavailable</h4>
        </div>
        <span class="stage-status">Off by default</span>
      </div>
      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
        <div>
          <dt>Provider registry</dt>
          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
        </div>
        <div>
          <dt>Would send after future consent</dt>
          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
        <div>
          <dt>Will not send in SS-013</dt>
          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
      </dl>
      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
    </section>
  `;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 18 Complete current file: src/remote-model-renderer.ts -->

### 19 Complete current file: src/keyframe-overlay-renderer.ts

Lines: 40  
Bytes: 1627  
SHA-256: `7780ae6558db6ef02613072b8cc3037a5df98ee9b3d8ea0e65275dfdf4e086d9`

<!-- BEGIN EXACT BLOCK: 19 Complete current file: src/keyframe-overlay-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { setOverlayResult } from "./app-state";
import type { SampledFrameOutput } from "./frame-processing";
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";

export function renderSelectedKeyframeCanvas(root: ParentNode, state: AppState): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || state.phaseOutputs.length === 0) return;
  const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const status = root.querySelector<HTMLElement>("[data-overlay-status]");
  const result = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  setOverlayResult(state, result);
  if (status) {
    status.textContent =
      result.status === "unavailable"
        ? "Skeleton overlay unavailable for this keyframe."
        : result.status === "partial"
          ? "Skeleton overlay partially available for this keyframe."
          : "Skeleton overlay rendered for this keyframe.";
  }
}

export async function renderAnnotatedKeyframe(
  output: SampledFrameOutput
): Promise<{ preview?: ImageBitmap; overlay: PoseOverlayRenderResult } | undefined> {
  const canvas = document.createElement("canvas");
  const overlay = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  if (overlay.status === "unavailable") return { overlay };
  try {
    return { preview: await createImageBitmap(canvas), overlay };
  } catch {
    return { overlay };
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 19 Complete current file: src/keyframe-overlay-renderer.ts -->

### 20 Complete current file: src/swing-card-actions.ts

Lines: 130  
Bytes: 4493  
SHA-256: `e0ee4400bd5a15c995c56fe146518ad3746adf75b39cebb485caf024a2e020f3`

<!-- BEGIN EXACT BLOCK: 20 Complete current file: src/swing-card-actions.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import {
  getCompleteSwingCardAssignments,
  setSwingCardBusy,
  setSwingCardStatus
} from "./app-state";
import type { PhaseAssignment } from "./phase-review";
import { phaseDefinitions } from "./phase-review";
import type { SwingCardContent, SwingCardKeyframe } from "./swing-card-contract";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  triggerSwingCardDownload
} from "./swing-card-generator";
import type { SampledFrameOutput } from "./frame-processing";
import { renderAnnotatedKeyframe } from "./keyframe-overlay-renderer";

export interface PreparedSwingCardContent {
  content: SwingCardContent;
  release(): void;
}

export async function downloadSwingCard(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing local Swing Card PNG.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const result = await composeSwingCardPng(prepared.content);
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      setSwingCardStatus(state, "Swing Card PNG download started.");
    } else {
      setSwingCardStatus(state, `Swing Card PNG export stopped (${result.reason}).`);
    }
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function printSwingCard(
  root: ParentNode,
  state: AppState,
  requestRender: (statusMessage?: string) => void
): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing browser print view.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const host = root.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    setSwingCardStatus(state, "Browser print dialog opened. Save as PDF if your browser supports it.");
    window.print();
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function copySwingCardPrompt(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing prompt text.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    setSwingCardStatus(state, "Prompt copied for manual use.");
  } catch {
    setSwingCardStatus(state, "Prompt copy unavailable in this browser.");
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function prepareSwingCardContent(state: AppState): Promise<PreparedSwingCardContent> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments(state);

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? state.phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframeWithoutTiming(output) : undefined;
    if (rendered?.preview) createdBitmaps.push(rendered.preview);
    keyframes.push({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: rendered?.preview,
      overlay: rendered?.overlay
    });
  }

  const warnings = deriveSwingCardContentWarnings({
    keyframes,
    metricPayload: undefined,
    phaseReviewConfirmed: (state.phaseReviewState?.readyForFutureMetrics ?? false) && hasCompleteAssignments(assignments)
  });
  const base: SwingCardContent = {
    keyframes,
    metricPayload: undefined,
    warnings,
    analysisPrompt: ""
  };
  const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
  return {
    content,
    release: () => {
      for (const bitmap of createdBitmaps) bitmap.close();
    }
  };
}

async function renderAnnotatedKeyframeWithoutTiming(output: SampledFrameOutput) {
  return renderAnnotatedKeyframe(output);
}

function hasCompleteAssignments(assignments: readonly PhaseAssignment[] | undefined): boolean {
  return !!assignments;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 20 Complete current file: src/swing-card-actions.ts -->

### 21 Complete current file: src/render-utils.ts

Lines: 30  
Bytes: 1049  
SHA-256: `02080c21e9c8a2b86c60c61396e6241860e287c1ca379756c7c991f88d809853`

<!-- BEGIN EXACT BLOCK: 21 Complete current file: src/render-utils.ts -->
````````````````````````````````````````text
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return replacements[character] ?? character;
  });
}

export function formatRemoteDataClass(dataClass: string): string {
  return dataClass
    .split("-")
    .map((part, index) => (index > 0 && part === "and" ? part : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

export function formatSwingCardWarning(warning: string): string {
  const labels: Record<string, string> = {
    NO_KEYFRAMES_SELECTED: "No keyframes were selected.",
    KEYFRAME_UNAVAILABLE: "One or more keyframes are unavailable.",
    METRICS_UNAVAILABLE: "Metrics are unavailable.",
    PHASE_REVIEW_REQUIRED: "Phase review is required before metrics should be interpreted.",
    PROMPT_LIMITED_EVIDENCE: "Evidence is limited; do not infer missing values."
  };
  return labels[warning] ?? warning;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 21 Complete current file: src/render-utils.ts -->

### 22 Complete current file: src/styles.css

Lines: 858  
Bytes: 13229  
SHA-256: `c305b3f39d44495dec7e9bd47c36065923a5510cf9fa5d603f84aba3fb7d74a2`

<!-- BEGIN EXACT BLOCK: 22 Complete current file: src/styles.css -->
````````````````````````````````````````text
:root {
  color: #17211b;
  background: #f3f5f1;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  margin: 0;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
a:focus-visible {
  outline: 3px solid #d7972d;
  outline-offset: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  min-height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid #d9ded7;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wordmark {
  color: #173d29;
  font-size: 1.1rem;
  font-weight: 800;
  text-decoration: none;
}

.local-badge,
.stage-status {
  border: 1px solid #cfd8d0;
  border-radius: 999px;
  padding: 5px 9px;
  color: #3d5646;
  background: #f3f7f3;
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
}

.workspace {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 28px 20px 48px;
  display: grid;
  gap: 24px;
  align-items: start;
}

.workflow {
  min-width: 0;
  display: grid;
  gap: 20px;
}

.workflow-intro {
  display: grid;
  gap: 12px;
}

.workflow-intro p:last-child {
  max-width: 68ch;
}

.eyebrow,
.placeholder-kicker {
  margin: 0 0 7px;
  color: #566c5d;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 8vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
}

h2 {
  margin-bottom: 0;
  font-size: 1.35rem;
}

h3 {
  margin-bottom: 8px;
}

p,
li {
  color: #405047;
  line-height: 1.55;
}

.step-nav {
  padding: 2px 2px 8px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.step-button {
  min-height: 54px;
  border: 1px solid #d5dbd4;
  border-radius: 6px;
  padding: 8px 10px;
  color: #526157;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 750;
  text-align: left;
}

.step-button.is-active {
  border-color: #276240;
  color: #173d29;
  background: #eaf3ec;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #ffffff;
  background: #607367;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  font-size: 0.72rem;
}

.step-button.is-active .step-number {
  background: #245b3b;
}

.stage,
.consent-panel {
  border: 1px solid #d5dbd4;
  border-radius: 8px;
  background: #ffffff;
}

.stage {
  min-height: 430px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.stage-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.stage-description {
  margin: 12px 0 22px;
}

.capture-options {
  display: grid;
  gap: 12px;
}

.source-option {
  min-height: 116px;
  border: 1px dashed #9dac9f;
  border-radius: 8px;
  padding: 20px;
  color: #526157;
  background: #f8faf7;
  display: grid;
  align-content: center;
  gap: 6px;
  text-align: left;
}

.source-option:hover {
  border-color: #245b3b;
  background: #f0f6f1;
}

.source-option__title {
  color: #173d29;
  font-size: 1.05rem;
  font-weight: 800;
}

.action-row {
  margin-top: auto;
  padding-top: 24px;
  display: grid;
  gap: 10px;
}

.primary-action,
.secondary-action {
  min-height: 46px;
  border: 0;
  border-radius: 6px;
  padding: 0 18px;
  font-weight: 800;
}

.primary-action {
  color: #ffffff;
  background: #245b3b;
}

.secondary-action {
  align-self: flex-start;
  margin-top: auto;
  color: #214d33;
  background: #e7f0e9;
}

button:disabled {
  color: #778179;
  background: #e3e7dd;
  cursor: not-allowed;
}

.action-note {
  margin: 0;
  font-size: 0.83rem;
}

.processing-placeholder,
.review-placeholder,
.export-placeholder {
  min-height: 230px;
  border: 1px solid #e0e5de;
  border-radius: 8px;
  background: #f8faf7;
}

.processing-placeholder {
  padding: 28px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-content: center;
  gap: 18px;
}

.processing-placeholder p {
  margin: 6px 0 0;
}

.analysis-video {
  width: min(100%, 640px);
  max-height: 280px;
  margin-top: 14px;
  border-radius: 8px;
  background: #17211b;
}

.processing-mark {
  width: 40px;
  height: 40px;
  border: 4px solid #d7e2da;
  border-top-color: #39724d;
  border-radius: 50%;
  animation: rotate 1.2s linear infinite;
}

.review-placeholder {
  padding: 14px;
  display: grid;
  gap: 14px;
}

.phase-review {
  display: grid;
  gap: 16px;
}

.keyframe-review {
  display: grid;
  gap: 12px;
}

.keyframe-review__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.keyframe-canvas-wrap {
  border: 1px solid #d6ddd6;
  border-radius: 8px;
  padding: 8px;
  background: #17211b;
}

.keyframe-canvas {
  width: 100%;
  max-height: 520px;
  border-radius: 6px;
  display: block;
  background: #17211b;
}

.keyframe-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.keyframe-button {
  min-height: 48px;
  border: 1px solid #d5dbd4;
  border-radius: 7px;
  padding: 8px;
  color: #3d5547;
  background: #ffffff;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  text-align: left;
}

.keyframe-button span {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #ffffff;
  background: #607367;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 800;
}

.keyframe-button strong {
  min-width: 0;
  color: #173d29;
  font-size: 0.8rem;
  line-height: 1.2;
}

.keyframe-button.is-selected {
  border-color: #245b3b;
  background: #eaf3ec;
}

.keyframe-button.is-selected span {
  background: #245b3b;
}

.phase-warning {
  border: 1px solid #d7b56e;
  border-radius: 8px;
  padding: 14px;
  background: #fff8e8;
}

.phase-warning p {
  margin: 5px 0 0;
}

.phase-declarations {
  border: 1px solid #d5dbd4;
  border-radius: 8px;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.phase-declarations legend {
  padding: 0 5px;
  color: #173d29;
  font-weight: 800;
}

.phase-declarations label,
.phase-assignment {
  display: grid;
  gap: 5px;
  color: #294b36;
  font-size: 0.84rem;
  font-weight: 750;
}

.phase-declarations .phase-setup-confirmation {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  line-height: 1.45;
}

.phase-setup-confirmation input {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  accent-color: #245b3b;
}

.phase-declarations select,
.phase-assignment select {
  min-height: 42px;
  border: 1px solid #b8c4ba;
  border-radius: 6px;
  padding: 0 10px;
  color: #173d29;
  background: #ffffff;
}

.phase-assignment-list {
  display: grid;
  gap: 8px;
}

.phase-assignment {
  border: 1px solid #dce2dc;
  border-radius: 7px;
  padding: 10px;
  grid-template-columns: minmax(0, 1fr) minmax(120px, 0.45fr);
  align-items: center;
}

.phase-assignment span {
  display: grid;
  gap: 3px;
}

.phase-assignment small {
  color: #68766d;
  font-weight: 600;
}

.phase-confirmation {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #243b2d;
  font-weight: 750;
  line-height: 1.45;
}

.phase-confirmation input {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  accent-color: #245b3b;
}

.swing-frame {
  min-height: 154px;
  border-radius: 6px;
  color: #607166;
  background:
    linear-gradient(135deg, rgb(36 91 59 / 8%), transparent),
    #e9eee9;
  display: grid;
  place-items: center;
  font-weight: 750;
}

.metric-list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-list div {
  border-left: 2px solid #b7c5ba;
  padding-left: 9px;
}

.metric-list dt {
  color: #617067;
  font-size: 0.75rem;
}

.metric-list dd {
  margin: 3px 0 0;
  color: #173d29;
  font-size: 1.15rem;
  font-weight: 800;
}

.export-placeholder {
  padding: 24px;
}

.export-placeholder p:last-child {
  max-width: 52ch;
}

.swing-card-panel {
  min-height: 280px;
  border: 1px solid #dce2dc;
  border-radius: 8px;
  padding: 18px;
  background: #f8faf7;
  display: grid;
  gap: 14px;
}

.swing-card-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.swing-card-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.swing-card-summary div {
  min-width: 0;
  border-left: 2px solid #b7c5ba;
  padding-left: 10px;
}

.swing-card-summary strong,
.swing-card-summary span {
  display: block;
}

.swing-card-summary strong {
  color: #173d29;
  font-size: 1rem;
}

.swing-card-summary span {
  color: #566c5d;
  font-size: 0.78rem;
  line-height: 1.35;
}

.swing-card-warning-list {
  margin: 0;
  padding-left: 18px;
}

.swing-card-warning-list li {
  font-size: 0.86rem;
}

.swing-card-actions {
  margin-top: 0;
  padding-top: 8px;
}

.swing-card-print-host {
  display: none;
}

.remote-model-panel {
  border-top: 1px solid #dce2dc;
  padding-top: 16px;
  display: grid;
  gap: 12px;
}

.remote-model-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.remote-model-panel h4 {
  margin: 0;
  color: #17211b;
  font-size: 1rem;
}

.remote-model-panel p {
  margin: 0;
  max-width: 68ch;
}

.remote-model-disclosure {
  margin: 0;
  display: grid;
  gap: 8px;
}

.remote-model-disclosure div {
  min-width: 0;
  border-left: 2px solid #b7c5ba;
  padding-left: 10px;
}

.remote-model-disclosure dt {
  color: #617067;
  font-size: 0.76rem;
  font-weight: 800;
}

.remote-model-disclosure dd {
  margin: 3px 0 0;
  color: #243b2d;
  font-size: 0.86rem;
}

.swing-card-print {
  color: #17211b;
  background: #ffffff;
}

.swing-card-print__section,
.swing-card-print__keyframe {
  break-inside: avoid;
  page-break-inside: avoid;
}

.swing-card-print__keyframes {
  display: block;
}

.swing-card-print__keyframe {
  margin: 0 0 16px;
}

.swing-card-print__keyframe canvas,
.swing-card-print__placeholder {
  width: 100%;
  max-width: 420px;
  border: 1px solid #b8c4ba;
}

.swing-card-print__placeholder {
  min-height: 180px;
  padding: 72px 16px 0;
  color: #405047;
  background: #eef2ed;
  font-weight: 800;
}

.consent-panel {
  padding: 20px;
}

.consent-panel > p,
.consent-panel li {
  font-size: 0.9rem;
}

.consent-panel ul {
  margin: 16px 0;
  padding-left: 20px;
}

.consent-check {
  border-top: 1px solid #e1e5df;
  padding-top: 18px;
  display: flex;
  gap: 11px;
  align-items: flex-start;
  color: #243b2d;
  font-size: 0.9rem;
  font-weight: 750;
  line-height: 1.45;
}

.consent-check input {
  width: 20px;
  height: 20px;
  margin: 1px 0 0;
  accent-color: #245b3b;
  flex: 0 0 auto;
}

.privacy-note {
  margin: 16px 0 0;
  padding: 10px;
  border-radius: 6px;
  background: #f3f5f1;
}

.status {
  margin: 12px 0 0;
  color: #294b36;
  font-weight: 700;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 720px) {
  .workspace {
    padding: 40px 28px 64px;
  }

  .workflow-intro {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.8fr);
    align-items: end;
  }

  .step-nav {
    grid-template-columns: repeat(4, minmax(108px, 1fr));
  }

  .capture-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .review-placeholder {
    grid-template-columns: minmax(0, 1fr) 180px;
  }

  .keyframe-strip {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .metric-list {
    grid-template-columns: 1fr;
    align-content: center;
  }

  .swing-card-actions {
    grid-template-columns: repeat(3, max-content);
    align-items: center;
  }

  .swing-card-actions .action-note {
    grid-column: 1 / -1;
  }
}

@media (min-width: 980px) {
  .workspace {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .consent-panel {
    position: sticky;
    top: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .processing-mark {
    animation: none;
  }
}

@media (max-width: 480px) {
  .stage {
    padding: 16px;
  }

  .keyframe-canvas-wrap {
    padding: 4px;
  }

  .swing-card-summary {
    grid-template-columns: 1fr;
  }
}

@media print {
  body {
    color: #000000;
    background: #ffffff;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .topbar,
  .workflow-intro,
  .step-nav,
  .stage-heading,
  .stage-description,
  .consent-panel,
  .swing-card-panel > :not(.swing-card-print-host) {
    display: none !important;
  }

  .workspace,
  .workflow,
  .stage,
  .swing-card-panel,
  .swing-card-print-host {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    display: block !important;
    background: #ffffff !important;
  }

  .swing-card-print-host[aria-hidden="true"] {
    display: block !important;
  }

  .swing-card-print__section,
  .swing-card-print__keyframe {
    display: block !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 22 Complete current file: src/styles.css -->

### 23 Complete current file: test/smoke/app.spec.ts

Lines: 618  
Bytes: 26942  
SHA-256: `bc22d1904050af53ec6d43845f3906c62cc9cf96779ac5af033fae2f8594835d`

<!-- BEGIN EXACT BLOCK: 23 Complete current file: test/smoke/app.spec.ts -->
````````````````````````````````````````text
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");
const allowedRequestPattern = /^http:\/\/127\.0\.0\.1:4174\/|^blob:/;
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b|\b[0-9a-f]{24,}\b|\b[A-Za-z0-9_-]{32,}\b|blob:http/i;

const requestLogByContext = new WeakMap<BrowserContext, string[]>();
const blockedExternalByContext = new WeakMap<BrowserContext, string[]>();
const consoleLogByPage = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }, testInfo) => {
  const context = page.context();
  const requests: string[] = [];
  const blockedExternal: string[] = [];
  const consoleMessages: string[] = [];
  requestLogByContext.set(context, requests);
  blockedExternalByContext.set(context, blockedExternal);
  consoleLogByPage.set(page, consoleMessages);

  context.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  if (testInfo.title.includes("external network is blocked from navigation start")) {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (allowedRequestPattern.test(url)) {
        void route.continue();
        return;
      }
      blockedExternal.push(url);
      void route.abort();
    });
  }

  await page.addInitScript(() => {
    const calls: string[] = [];
    Object.assign(window, { __swingSyncCameraCalls: calls });
    const existingMediaDevices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        ...existingMediaDevices,
        getUserMedia: () => {
          calls.push("getUserMedia");
          return Promise.reject(new DOMException("Camera capture is out of scope", "NotAllowedError"));
        }
      }
    });
  });

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.afterEach(async ({ page }) => {
  const cameraCalls = await page.evaluate(
    () => ((window as typeof window & { __swingSyncCameraCalls?: string[] }).__swingSyncCameraCalls ?? [])
  );
  expect(cameraCalls).toEqual([]);
});

function requestsFor(page: Page): string[] {
  return requestLogByContext.get(page.context()) ?? [];
}

function blockedExternalFor(page: Page): string[] {
  return blockedExternalByContext.get(page.context()) ?? [];
}

function consoleMessagesFor(page: Page): string[] {
  return consoleLogByPage.get(page) ?? [];
}

function externalRequests(urls: readonly string[]): readonly string[] {
  return urls.filter((url) => !allowedRequestPattern.test(url));
}

function expectNoSensitiveOutput(output: string): void {
  expect(output).not.toMatch(sensitiveOutputPattern);
}

async function expectNoBrowserStorage(page: Page): Promise<void> {
  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
}

async function completePhaseReview(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
}

test("opens to capture flow and keeps analysis fail closed until consent and video", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use camera" })).toBeVisible();
  await expect(page.getByText("Camera capture is not part of this story")).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
  await page.getByRole("button", { name: "Use camera" }).click();
  await expect(page.getByRole("status")).toContainText("Camera capture remains out of scope");
});

test("fails closed when local consent storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("fails closed when stored consent cannot be removed", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).toBeChecked();
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });

  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
  await beginAnalysis.click();

  await expect(page.getByRole("status")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});

test("shows every required placeholder state", async ({ page }) => {
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
  }
});

test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByRole("button", { name: "Stop local analysis" })).toBeEnabled();
  await expect(page.locator("[data-pose-summary]")).toContainText(
    "33 normalized landmarks retained",
    { timeout: 30_000 }
  );
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });

  const requests = requestsFor(page);
  const requestsAtReady = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtReady);
  expect(externalRequests(requests)).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));

  await expectNoBrowserStorage(page);
});

test("requires accessible explicit review and accepts only valid nondecreasing phase correction", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await expect(page.locator(".phase-warning")).toHaveAttribute("aria-live", "polite");
  const canvas = page.locator("[data-keyframe-canvas]");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address");
  await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
  await page.locator("[data-keyframe-index='3']").click();
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top");
  const canvasState = await page.evaluate(() => {
    const element = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const label = element.getAttribute("aria-label") ?? "";
    const context = element.getContext("2d");
    const samples: number[] = [];
    if (context) {
      const image = context.getImageData(0, 0, element.width, element.height).data;
      const points = [
        [0.25, 0.25],
        [0.5, 0.5],
        [0.75, 0.75],
        [0.25, 0.75],
        [0.75, 0.25]
      ];
      for (const [xRatio, yRatio] of points) {
        const x = Math.min(element.width - 1, Math.max(0, Math.floor(element.width * xRatio)));
        const y = Math.min(element.height - 1, Math.max(0, Math.floor(element.height * yRatio)));
        const offset = (y * element.width + x) * 4;
        samples.push(image[offset] ?? 0, image[offset + 1] ?? 0, image[offset + 2] ?? 0, image[offset + 3] ?? 0);
      }
    }
    return {
      width: element.width,
      height: element.height,
      label,
      canvasCount: document.querySelectorAll("[data-keyframe-canvas]").length,
      nonTransparentSamples: samples.filter((_, index) => index % 4 === 3 && samples[index] > 0).length,
      uniqueSampleValues: new Set(samples.join(",").split(",")).size
    };
  });
  expect(canvasState.width).toBeGreaterThan(0);
  expect(canvasState.height).toBeGreaterThan(0);
  expect(canvasState.canvasCount).toBe(1);
  expect(canvasState.nonTransparentSamples).toBeGreaterThan(0);
  expect(canvasState.uniqueSampleValues).toBeGreaterThan(1);
  expect(canvasState.label).not.toMatch(/right|left|face-on|mirrored|warning|confidence|filename|timestamp|correct/i);
  await expect(page.getByLabel("View", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Handedness", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Horizontally mirrored", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel(/I confirm this is one trimmed/)).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();

  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();

  await expect(page.locator(".phase-warning")).toContainText("Review required");
  for (const phase of [
    "Address",
    "Toe-up",
    "Mid-backswing",
    "Top",
    "Mid-downswing",
    "Impact",
    "Mid-follow-through",
    "Finish"
  ]) {
    await expect(page.locator(".phase-assignment").getByText(phase, { exact: true })).toBeVisible();
  }

  const assignments = page.locator("[data-phase-index]");
  await assignments.nth(1).selectOption("2");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();
  await assignments.nth(1).selectOption("1");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeEnabled();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Phase review confirmed");
  await expect(page.getByText(/Future metric readiness is available/)).toBeVisible();

  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(page.getByText("Annotated keyframes")).toBeVisible();
});

test("downloads a local Swing Card PNG and exposes print and prompt controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();

  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
  await expect(page.getByText("No reviewed provider is configured for this story.")).toBeVisible();
  await expect(page.getByText("Metrics, Warnings and Limitations, Manual Swing Card Prompt")).toBeVisible();
  await expect(page.getByText("Raw Video, Frame Pixels, Selected Keyframe Images, Pose Landmarks")).toBeVisible();
  await expect(page.getByRole("button", { name: "Remote review unavailable" })).toBeDisabled();
  const controlLayout = await page.evaluate(() => {
    const buttons = [
      ...document.querySelectorAll("[data-download-swing-card], [data-print-swing-card], [data-copy-swing-card-prompt]")
    ];
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      minButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height))
    };
  });
  expect(controlLayout.hasOverflow).toBe(false);
  expect(controlLayout.minButtonHeight).toBeGreaterThanOrEqual(44);

  await page.evaluate(() => {
    Object.assign(window, { __swingCardPrintCalls: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls += 1;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls)).toBe(1);

  await page.evaluate(() => {
    const writes: string[] = [];
    Object.assign(window, { __swingCardClipboardWrites: writes });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          writes.push(text);
        }
      }
    });
  });
  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copied for manual use");
  const copiedPrompts = await page.evaluate(
    () =>
      (window as typeof window & { __swingCardClipboardWrites?: string[] }).__swingCardClipboardWrites ?? []
  );
  expect(copiedPrompts).toHaveLength(1);
  expect(copiedPrompts[0]).toContain("Metric summary:");
  expect(copiedPrompts[0]).toContain("unavailable");
  expectNoSensitiveOutput(copiedPrompts[0]);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException("Clipboard unavailable", "NotAllowedError");
        }
      }
    });
  });
  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copy unavailable in this browser");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^swing-sync-card-\d{8}-[a-f0-9]{8}\.png$/);

  const requests = requestsFor(page);
  const requestsAtDownload = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtDownload);
  expect(externalRequests(requests)).toEqual([]);

  await expectNoBrowserStorage(page);
  const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(localStorageKeys).toEqual(["swing-sync:safety-consent:v1"]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

test("keeps Swing Card keyframes unavailable until phase review is complete", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  await expect(page.getByLabel("Swing Card warnings")).toContainText("Phase review is required");

  await page.evaluate(() => {
    Object.assign(window, { __swingCardUnavailablePrintKeyframes: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes =
        document.querySelectorAll(".swing-card-print__placeholder").length;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();

  const unavailableCount = await page.evaluate(
    () => (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes
  );
  expect(unavailableCount).toBe(8);
});

test("completes local inference when external network is blocked from navigation start", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternalFor(page)).toEqual([]);
  expect(externalRequests(requestsFor(page))).toEqual([]);
});

test("reports a useful local error when model initialization fails", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => route.abort());
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  await expect(page.locator("[data-pose-summary]")).toContainText("0 of 8 video frames processed");
  await expect(page.getByRole("button", { name: "Retry local analysis" })).toBeVisible();
});

test("retries with a fresh local session after initialization failure", async ({ page }) => {
  let shouldFail = true;
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => {
    if (shouldFail) {
      void route.abort();
      return;
    }
    void route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  shouldFail = false;
  await page.getByRole("button", { name: "Retry local analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
});

test("keeps the UI responsive while the local model loads", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("volatile resources were released");
});

test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.evaluate(() => {
    void fetch("https://example.com/blocked-by-swing-sync-csp").catch(() => undefined);
  });

  await expect(page.getByText(/Local pose analysis stopped \(UNEXPECTED_NETWORK_BLOCKED\)/)).toBeVisible();
});

test("releases the selected object URL when analysis stops", async ({ page }) => {
  await page.addInitScript(() => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
      originalRevoke(url);
    };
    Object.assign(window, { __poseObjectUrls: { created, revoked } });
  });
  await page.reload();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  const urls = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __poseObjectUrls: { created: string[]; revoked: string[] };
        }
      ).__poseObjectUrls
  );
  expect(urls.revoked).toEqual(urls.created);
});

test("fits the mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  expect(hasOverflow).toBe(false);
  await expect(page.getByRole("checkbox")).toBeVisible();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  const layout = await page.evaluate(() => {
    const canvas = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRects = [...document.querySelectorAll("[data-keyframe-index]")].map((button) =>
      button.getBoundingClientRect()
    );
    const criticalTextSelectors = [
      ".phase-warning",
      ".keyframe-review__heading",
      "[data-overlay-status]",
      "[data-confirm-phase-review]",
      "[data-open-export]"
    ];
    const criticalText = criticalTextSelectors
      .flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => ({
        selector: element.matches("[data-confirm-phase-review]")
          ? "confirm"
          : element.matches("[data-open-export]")
            ? "export"
            : element.className || element.tagName,
        clipped:
          Math.ceil(element.scrollHeight) > Math.ceil(element.clientHeight) ||
          Math.ceil(element.scrollWidth) > Math.ceil(element.clientWidth)
      }));
    const overlaps = buttonRects.some((rect, index) =>
      buttonRects.slice(index + 1).some(
        (other) =>
          rect.left < other.right &&
          rect.right > other.left &&
          rect.top < other.bottom &&
          rect.bottom > other.top
      )
    );
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      canvasWidth: canvasRect.width,
      canvasHeight: canvasRect.height,
      minButtonHeight: Math.min(...buttonRects.map((rect) => rect.height)),
      hasButtonOverlap: overlaps,
      clippedCriticalText: criticalText.filter((item) => item.clipped)
    };
  });

  expect(layout.hasOverflow).toBe(false);
  expect(layout.canvasWidth).toBeGreaterThan(300);
  expect(layout.canvasHeight).toBeGreaterThan(160);
  expect(layout.minButtonHeight).toBeGreaterThanOrEqual(44);
  expect(layout.hasButtonOverlap).toBe(false);
  expect(layout.clippedCriticalText).toEqual([]);
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 23 Complete current file: test/smoke/app.spec.ts -->

### 24 Complete current file: test/unit/app-renderer.test.ts

Lines: 147  
Bytes: 5007  
SHA-256: `a3b7d7f0e81c116082a134c53ac6a66fe378d14fb46b4265b6fa50dfca2b245b`

<!-- BEGIN EXACT BLOCK: 24 Complete current file: test/unit/app-renderer.test.ts -->
````````````````````````````````````````text
import { describe, expect, it } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseDeclaration,
  setProcessingProgress,
  setProcessingState
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";

class FakeElement {
  innerHTML = "";
  textContent = "";
  hidden = false;
  private readonly selectors = new Map<string, FakeElement>();

  querySelector<T>(_selector: string): T | null {
    return (this.selectors.get(_selector) ?? null) as T | null;
  }

  set(selector: string, element: FakeElement): void {
    this.selectors.set(selector, element);
  }
}

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function sampledOutputs(): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: 1,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: index * 100 + 0.5,
    preview: { close: () => undefined, width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

function createReviewReadyState() {
  const state = createInitialAppState();
  completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
  setPhaseDeclaration(state, "view", "face-on");
  setPhaseDeclaration(state, "handedness", "right");
  setPhaseDeclaration(state, "mirrored", "no");
  setPhaseDeclaration(state, "setup", "confirmed");
  rebuildPhaseReviewState(state);
  return state;
}

describe("app renderer contracts", () => {
  it("preserves protected capture selectors and escapes selected file names", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectLocalVideo(state, new File(["video"], `<bad "name">.mp4`, { type: "video/mp4" }));

    renderApp(root, state, true);

    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).toContain('id="video-file"');
    expect(root.innerHTML).toContain("Local video source");
    expect(root.innerHTML).toContain("&lt;bad &quot;name&quot;&gt;.mp4");
    expect(root.innerHTML).not.toContain(`<bad "name">.mp4`);
  });

  it("preserves protected phase-review selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "review");

    renderApp(root, state, true);

    for (const value of [
      "Swing phase assignments",
      "View",
      "Handedness",
      "Horizontally mirrored",
      "Select keyframe",
      "data-confirm-phase-review",
      "data-phase-index",
      "data-open-export"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("preserves protected export and remote-review-unavailable selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "export");

    renderApp(root, state, true);

    for (const value of [
      "Downloadable summary",
      "Remote model review unavailable",
      "Remote model data disclosure",
      "data-download-swing-card",
      "data-print-swing-card",
      "data-copy-swing-card-prompt",
      "data-swing-card-status",
      "data-swing-card-print-host",
      "data-remote-model-send"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("updates current processing DOM by re-querying targets and no-ops when absent", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");
    setProcessingProgress(state, 1, 8);

    const detachedSummary = new FakeElement();
    const oldRoot = new FakeElement();
    oldRoot.set("[data-pose-summary]", detachedSummary);
    updateProcessingProgressUi(oldRoot as unknown as ParentNode, state);
    expect(detachedSummary.textContent).toContain("1 of 8");

    setProcessingProgress(state, 2, 8);
    const visibleSummary = new FakeElement();
    const nextRoot = new FakeElement();
    nextRoot.set("[data-pose-summary]", visibleSummary);
    updateProcessingProgressUi(nextRoot as unknown as ParentNode, state);

    expect(visibleSummary.textContent).toContain("2 of 8");
    expect(detachedSummary.textContent).toContain("1 of 8");
    expect(() => updateProcessingProgressUi(new FakeElement() as unknown as ParentNode, state)).not.toThrow();
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 24 Complete current file: test/unit/app-renderer.test.ts -->

### 25 Complete current file: test/unit/app-events.test.ts

Lines: 54  
Bytes: 1563  
SHA-256: `f3a5e94aff173401f31e5f2f1fc451f725524253bee092b6677d83194c71f2a7`

<!-- BEGIN EXACT BLOCK: 25 Complete current file: test/unit/app-events.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import { bindAppEvents } from "../../src/app-events";
import { createInitialAppState } from "../../src/app-state";
import type { SafetyConsentStore } from "../../src/consent-state";

class FakeButton {
  private listeners: (() => void)[] = [];

  addEventListener(_event: "click", listener: () => void): void {
    this.listeners.push(listener);
  }

  click(): void {
    for (const listener of this.listeners) listener();
  }
}

class FakeRoot {
  constructor(private readonly button: FakeButton) {}

  querySelector(selector: string) {
    return selector === "[data-placeholder-action='camera']" ? this.button : null;
  }

  querySelectorAll() {
    return [];
  }
}

describe("app event binding", () => {
  it("binds fresh DOM after repeated renders without duplicate effects", () => {
    const requestRender = vi.fn();
    const consent: SafetyConsentStore = {
      hasSafetyConsent: () => false,
      setSafetyConsent: () => undefined
    };
    const dependencies = {
      state: createInitialAppState(),
      consent,
      lifecycle: {} as never,
      requestRender
    };

    const firstButton = new FakeButton();
    bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
    firstButton.click();
    expect(requestRender).toHaveBeenCalledTimes(1);

    const secondButton = new FakeButton();
    bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
    secondButton.click();
    expect(requestRender).toHaveBeenCalledTimes(2);
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 25 Complete current file: test/unit/app-events.test.ts -->

### 26 Complete current file: test/unit/app-state.test.ts

Lines: 53  
Bytes: 1748  
SHA-256: `1e1eb4389468a887bc969f7028a289e258076bc81ad7aa09242d9756e615300f`

<!-- BEGIN EXACT BLOCK: 26 Complete current file: test/unit/app-state.test.ts -->
````````````````````````````````````````text
import { describe, expect, it } from "vitest";
import {
  createInitialAppState,
  resetPhaseReview,
  selectCanBeginAnalysis,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState,
  setSwingCardBusy,
  setSwingCardStatus
} from "../../src/app-state";

function file(): File {
  return new File(["video"], "swing.mp4", { type: "video/mp4" });
}

describe("app state transitions", () => {
  it("keeps Begin analysis gating in one selector", () => {
    const state = createInitialAppState();

    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    selectLocalVideo(state, file());
    expect(selectCanBeginAnalysis(state, false)).toBe(false);
    expect(selectCanBeginAnalysis(state, true)).toBe(true);

    setProcessingState(state, "processing");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);

    setProcessingState(state, "idle");
    selectWorkflowStep(state, "review");
    expect(selectCanBeginAnalysis(state, true)).toBe(false);
  });

  it("resets phase and Swing Card volatile state without clearing selected video", () => {
    const state = createInitialAppState();
    const selected = file();
    selectLocalVideo(state, selected);
    setSwingCardBusy(state, true);
    setSwingCardStatus(state, "Preparing prompt text.");
    state.phaseConfirmation = true;
    state.selectedKeyframeIndex = 3;

    resetPhaseReview(state);

    expect(state.selectedVideo).toBe(selected);
    expect(state.phaseConfirmation).toBe(false);
    expect(state.selectedKeyframeIndex).toBe(0);
    expect(state.swingCardBusy).toBe(false);
    expect(state.swingCardStatus).toBe("Swing Card export is generated locally after review data exists.");
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 26 Complete current file: test/unit/app-state.test.ts -->

### 27 Complete current file: test/unit/consent-state.test.ts

Lines: 72  
Bytes: 2380  
SHA-256: `8eaa2ce551f7872573a6496cd4b499d4f65a8dd7d851fc635d89f089d2143d5d`

<!-- BEGIN EXACT BLOCK: 27 Complete current file: test/unit/consent-state.test.ts -->
````````````````````````````````````````text
import { describe, expect, it } from "vitest";
import { consentStorageKey, createSafetyConsentStore, type ConsentStorage } from "../../src/consent-state";

function storage(initial?: string): ConsentStorage & { values: Map<string, string> } {
  const values = new Map<string, string>();
  if (initial) values.set(consentStorageKey, initial);
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

describe("safety consent storage", () => {
  it("reads accepted and missing local acknowledgement state", () => {
    expect(createSafetyConsentStore(storage("accepted")).hasSafetyConsent()).toBe(true);
    expect(createSafetyConsentStore(storage()).hasSafetyConsent()).toBe(false);
  });

  it("stores and removes only the accepted acknowledgement value", () => {
    const fakeStorage = storage();
    const consent = createSafetyConsentStore(fakeStorage);

    consent.setSafetyConsent(true);
    expect(fakeStorage.values.get(consentStorageKey)).toBe("accepted");
    expect(consent.hasSafetyConsent()).toBe(true);

    consent.setSafetyConsent(false);
    expect(fakeStorage.values.has(consentStorageKey)).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed when reading local acknowledgement throws", () => {
    const consent = createSafetyConsentStore({
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined,
      removeItem: () => undefined
    });

    expect(consent.hasSafetyConsent()).toBe(false);
    expect(consent.hasSafetyConsent()).toBe(false);
  });

  it("fails closed through the public query after set or remove failures", () => {
    const setFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => undefined
    });
    setFailure.setSafetyConsent(true);
    expect(setFailure.hasSafetyConsent()).toBe(false);

    const removeFailure = createSafetyConsentStore({
      getItem: () => "accepted",
      setItem: () => undefined,
      removeItem: () => {
        throw new Error("blocked");
      }
    });
    removeFailure.setSafetyConsent(false);
    expect(removeFailure.hasSafetyConsent()).toBe(false);
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 27 Complete current file: test/unit/consent-state.test.ts -->

### 28 Complete current file: test/unit/analysis-lifecycle.test.ts

Lines: 128  
Bytes: 4238  
SHA-256: `f486920cc919b5f2e4a975745d697cde1d222278ca4f789fe51d82a3df3b33a5`

<!-- BEGIN EXACT BLOCK: 28 Complete current file: test/unit/analysis-lifecycle.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import {
  createInitialAppState,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState
} from "../../src/app-state";
import { renderApp } from "../../src/app-renderer";

class FakeElement {
  innerHTML = "";
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined
    });
    const abort = vi.fn();
    Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
      abortFrameController: abort
    });

    setProcessingState(state, "idle");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).not.toHaveBeenCalled();

    setProcessingState(state, "loading");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
  });

  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(
      lifecycle as unknown as {
        frameController?: { close: () => Promise<void> };
        abortFrameController?: (code: string) => void;
      },
      {
        frameController: { close },
        abortFrameController: vi.fn()
      }
    );
    setProcessingState(state, "processing");

    await lifecycle.closeActive();

    expect(close).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledTimes(1);
  });

  it("re-renders capture controls after async close settles", async () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    const closeDeferred = deferred();
    const requestRender = vi.fn(() => renderApp(root, state, true));
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
      frameController: { close: () => closeDeferred.promise }
    });
    selectLocalVideo(state, new File(["video"], "swing.mp4", { type: "video/mp4" }));
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    const closePromise = lifecycle.closeActive();
    selectWorkflowStep(state, "capture");
    renderApp(root, state, true);

    expect(root.innerHTML).toMatch(/id="analysis-button"[\s\S]*disabled/);

    closeDeferred.resolve();
    await closePromise;

    expect(requestRender).toHaveBeenCalledTimes(1);
    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).not.toMatch(/id="analysis-button"[\s\S]*disabled/);
  });

  it("stops active processing and requests an idle capture render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
      frameController: { cancel }
    });
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    await lifecycle.stopActive();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.activeStep).toBe("capture");
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 28 Complete current file: test/unit/analysis-lifecycle.test.ts -->

### 29 Complete current file: test/unit/phase-review.test.ts

Lines: 168  
Bytes: 6762  
SHA-256: `45abf54863973aec701ea7348ffea85cd8fd74e2e177c70361c9699deb7bd611`

<!-- BEGIN EXACT BLOCK: 29 Complete current file: test/unit/phase-review.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations
} from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";

const declarations: PhaseDeclarations = {
  view: "face-on",
  handedness: "right",
  mirrored: "no",
  setup: "confirmed"
};

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function outputs(generation = 4): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: generation,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: index * 100 + 0.25,
    preview: { close: vi.fn() } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

function identityAssignments(): PhaseAssignment[] {
  return phaseDefinitions.map((phase, sampleIndex) => ({ phaseId: phase.id, sampleIndex }));
}

describe("phase proposal", () => {
  it("creates the deterministic review-required identity layout with stable warnings", () => {
    const proposal = createPhaseProposal(outputs(), declarations);

    expect(proposal.evidenceStatus).toBe("review-required");
    expect(proposal.assignments).toEqual(identityAssignments());
    expect(proposal.warningCodes).toEqual(["PHASE_REVIEW_REQUIRED", "IMPACT_NOT_CONFIRMED"]);
    expect(createPhaseProposal(outputs(), declarations)).toEqual(proposal);
    expect(JSON.stringify(proposal)).not.toMatch(/timestamp|landmarks|preview|observed/i);
  });

  it.each([
    { view: "undeclared", handedness: "right", mirrored: "no", setup: "confirmed" },
    { view: "face-on", handedness: "undeclared", mirrored: "no", setup: "confirmed" },
    { view: "face-on", handedness: "right", mirrored: "undeclared", setup: "confirmed" }
  ] as PhaseDeclarations[])("rejects undeclared input %#", (value) => {
    expect(createPhaseProposal(outputs(), value).evidenceStatus).toBe("unsupported-input");
  });

  it("rejects undeclared setup confirmation", () => {
    expect(
      createPhaseProposal(outputs(), { ...declarations, setup: "undeclared" }).evidenceStatus
    ).toBe("unsupported-input");
  });

  it("rejects invalid sample count and generation", () => {
    expect(createPhaseProposal(outputs().slice(0, 7), declarations).evidenceStatus).toBe(
      "unsupported-input"
    );
    expect(
      createPhaseProposal([...outputs(), { ...outputs()[7], index: 8 }], declarations).evidenceStatus
    ).toBe("unsupported-input");
    const mismatched = outputs();
    mismatched[7].runGeneration = 5;
    expect(createPhaseProposal(mismatched, declarations).evidenceStatus).toBe("unsupported-input");
  });

  it("accepts matching pose/request timestamps and rejects mismatches", () => {
    expect(createPhaseProposal(outputs(), declarations).evidenceStatus).toBe("review-required");
    const mismatched = outputs();
    mismatched[3].pose = pose(301);
    expect(createPhaseProposal(mismatched, declarations).evidenceStatus).toBe("unsupported-input");
  });

  it("rejects malformed, incomplete, and non-finite poses", () => {
    const incomplete = outputs();
    incomplete[2].pose.landmarks[0].pop();
    expect(createPhaseProposal(incomplete, declarations).evidenceStatus).toBe("unsupported-input");

    const nonFinite = outputs();
    nonFinite[2].pose.worldLandmarks[0][0].x = Number.NaN;
    expect(createPhaseProposal(nonFinite, declarations).evidenceStatus).toBe("unsupported-input");

    const infiniteTimestamp = outputs();
    infiniteTimestamp[2].requestedTimestampMs = Number.POSITIVE_INFINITY;
    infiniteTimestamp[2].pose = pose(Number.POSITIVE_INFINITY);
    expect(createPhaseProposal(infiniteTimestamp, declarations).evidenceStatus).toBe(
      "unsupported-input"
    );

    const missing = outputs();
    missing[2].pose.landmarks = [];
    expect(createPhaseProposal(missing, declarations).evidenceStatus).toBe("unsupported-input");

    const sparse = outputs();
    delete sparse[2];
    expect(createPhaseProposal(sparse, declarations).evidenceStatus).toBe("unsupported-input");
  });
});

describe("phase correction", () => {
  it("accepts confirmed nondecreasing assignments with shared sample indices", () => {
    const proposal = createPhaseProposal(outputs(), declarations);
    const state = createPhaseReviewState(proposal);
    const assignments = identityAssignments();
    assignments[2].sampleIndex = 1;

    const corrected = applyPhaseCorrection(state, assignments, true, proposal.runGeneration);

    expect(corrected.readyForFutureMetrics).toBe(true);
    expect(corrected.correction?.assignments).toEqual(assignments);
    expect(corrected.automaticProposal.assignments).toEqual(identityAssignments());
  });

  it("rejects decreasing, missing, duplicate-phase, out-of-range, stale, and unconfirmed input", () => {
    const proposal = createPhaseProposal(outputs(), declarations);
    const state = createPhaseReviewState(proposal);
    const decreasing = identityAssignments();
    decreasing[2].sampleIndex = 0;
    decreasing[1].sampleIndex = 2;
    expect(isValidCorrection(decreasing)).toBe(false);

    const missing = identityAssignments().slice(0, 7);
    const duplicatePhase = identityAssignments();
    duplicatePhase[2] = { ...duplicatePhase[2], phaseId: "toe-up" };
    const outOfRange = identityAssignments();
    outOfRange[7].sampleIndex = 8;
    const tooMany = [...identityAssignments(), { phaseId: "finish", sampleIndex: 7 } as const];
    const sparse = identityAssignments();
    delete sparse[2];

    for (const assignments of [decreasing, missing, duplicatePhase, outOfRange, tooMany, sparse]) {
      expect(applyPhaseCorrection(state, assignments, true, proposal.runGeneration)).toBe(state);
    }
    expect(applyPhaseCorrection(state, identityAssignments(), false, proposal.runGeneration)).toBe(
      state
    );
    expect(applyPhaseCorrection(state, identityAssignments(), true, proposal.runGeneration + 1)).toBe(
      state
    );
  });

  it("keeps unsupported proposals unready", () => {
    const state = createPhaseReviewState(
      createPhaseProposal(outputs(), { ...declarations, view: "undeclared" })
    );
    expect(applyPhaseCorrection(state, identityAssignments(), true, state.runGeneration)).toBe(state);
    expect(state.readyForFutureMetrics).toBe(false);
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 29 Complete current file: test/unit/phase-review.test.ts -->

### 30 Complete current file: test/unit/render-utils.test.ts

Lines: 17  
Bytes: 734  
SHA-256: `fc5bc303edd86ddbca276466ae72a1353458ba3352a4b06b89eee54016ad9060`

<!-- BEGIN EXACT BLOCK: 30 Complete current file: test/unit/render-utils.test.ts -->
````````````````````````````````````````text
import { describe, expect, it } from "vitest";
import { escapeHtml, formatRemoteDataClass, formatSwingCardWarning } from "../../src/render-utils";

describe("render utilities", () => {
  it("escapes user-controlled text through one canonical helper", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;"
    );
  });

  it("formats remote data classes and Swing Card warnings consistently", () => {
    expect(formatRemoteDataClass("warnings-and-limitations")).toBe("Warnings and Limitations");
    expect(formatSwingCardWarning("PHASE_REVIEW_REQUIRED")).toBe(
      "Phase review is required before metrics should be interpreted."
    );
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 30 Complete current file: test/unit/render-utils.test.ts -->

### 31 Complete current file: test/unit/swing-card-actions.test.ts

Lines: 71  
Bytes: 2686  
SHA-256: `3c93b04e735c5f25bddbbdbb54a7a044af98ba6792ca2f435836776836870b60`

<!-- BEGIN EXACT BLOCK: 31 Complete current file: test/unit/swing-card-actions.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  setPhaseDeclaration
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";
import { prepareSwingCardContent } from "../../src/swing-card-actions";

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function sampledOutputs(): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: 9,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: 12345 + index,
    preview: { close: vi.fn(), width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

describe("swing card actions", () => {
  it("keeps observedSeekTimestampMs out of prepared export content from populated keyframes", async () => {
    vi.stubGlobal("document", {
      createElement: () => ({
        width: 0,
        height: 0,
        style: {},
        getBoundingClientRect: () => ({ width: 0, height: 0 }),
        getContext: () => null
      })
    });
    const state = createInitialAppState();
    completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
    setPhaseDeclaration(state, "view", "face-on");
    setPhaseDeclaration(state, "handedness", "right");
    setPhaseDeclaration(state, "mirrored", "no");
    setPhaseDeclaration(state, "setup", "confirmed");
    rebuildPhaseReviewState(state);

    const prepared = await prepareSwingCardContent(state);

    try {
      expect(state.phaseOutputs.map((output) => output.observedSeekTimestampMs)).toContain(12345);
      expect(prepared.content.keyframes).toHaveLength(phaseDefinitions.length);
      expect(prepared.content.keyframes.some((keyframe) => keyframe.overlay.status === "unavailable")).toBe(true);
      expect(JSON.stringify(prepared.content)).not.toContain("observedSeekTimestampMs");
      expect(JSON.stringify(prepared.content.keyframes)).not.toContain("12345");
      expect(prepared.content.analysisPrompt).not.toContain("observedSeekTimestampMs");
      expect(prepared.content.analysisPrompt).not.toContain("12345");
    } finally {
      prepared.release();
      vi.unstubAllGlobals();
    }
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 31 Complete current file: test/unit/swing-card-actions.test.ts -->

### 32 Complete current file: docs/ss-019-research-disposition.md

Lines: 289  
Bytes: 16184  
SHA-256: `d63840bcdd0d36e3aa45968c3b8ac8961857d879db51ab24e4464f2c64b97e5f`

<!-- BEGIN EXACT BLOCK: 32 Complete current file: docs/ss-019-research-disposition.md -->
````````````````````````````````````````text
# SS-019 Research And Disposition

Date: 2026-07-19

Task: SS-019 Perform accessibility and responsive design hardening.

Status: Approved research/disposition input for the candidate
preimplementation specification. Implementation remains blocked pending the
independent Claude QA-planning gate.

## Classification

SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
privacy/safety-copy-sensitive, responsive-design-, smoke-test-selector-, and
manual-QA-sensitive.

The story may change DOM semantics, focus restoration, live-region behavior,
control descriptions, responsive CSS, and browser-test coverage. It must not
change the workflow's safety/privacy/non-affiliation meaning, local-first
raw-media behavior, explicit consent gate, remote-review-disabled posture,
provider/model posture, exported data classes, persistence, service-worker
behavior, or runtime observability posture.

## Primary Sources

Checked 2026-07-19. These are direct W3C normative or WAI-ARIA Authoring
Practices sources, not secondary accessibility summaries:

- WCAG 2.2, 2.1.1 Keyboard:
  https://www.w3.org/TR/WCAG22/#keyboard
- WCAG 2.2, 2.4.3 Focus Order:
  https://www.w3.org/TR/WCAG22/#focus-order
- WCAG 2.2, 2.4.7 Focus Visible:
  https://www.w3.org/TR/WCAG22/#focus-visible
- WCAG 2.2, 2.4.2 Page Titled:
  https://www.w3.org/TR/WCAG22/#page-titled
- WCAG 2.2, 2.4.6 Headings and Labels:
  https://www.w3.org/TR/WCAG22/#headings-and-labels
- WCAG 2.2, 4.1.3 Status Messages:
  https://www.w3.org/TR/WCAG22/#status-messages
- WCAG 2.2, 1.4.3 Contrast (Minimum):
  https://www.w3.org/TR/WCAG22/#contrast-minimum
- WCAG 2.2, 1.4.11 Non-text Contrast:
  https://www.w3.org/TR/WCAG22/#non-text-contrast
- WCAG 2.2, 1.4.10 Reflow:
  https://www.w3.org/TR/WCAG22/#reflow
- WCAG 2.2, 1.4.12 Text Spacing:
  https://www.w3.org/TR/WCAG22/#text-spacing
- WCAG 2.2, 2.5.8 Target Size (Minimum):
  https://www.w3.org/TR/WCAG22/#target-size-minimum
- WAI-ARIA Authoring Practices, Developing a Keyboard Interface:
  https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

These sources define requirements and interaction guidance, but they do not by
themselves prove that Swing Sync conforms. SS-019 requires automated and manual
evidence for the implemented surface and records residual risks without making
a certification claim.

## Repository Sources And Current Ownership

- `index.html` owns the static document title, CSP meta policy, manifest link,
  viewport metadata, and the current `#app` host. It currently renders
  `<main id="app">`.
- `src/main.ts` owns the stable app-root lookup, full-render coordinator,
  renderer/event/lifecycle composition, selected-keyframe canvas redraw, global
  listeners, and production service-worker registration.
- `src/app-renderer.ts` owns the outer app shell and current inner
  `<main class="workspace">`, workflow navigation, active stage rendering,
  consent panel, capture/processing/review/export stage selection, processing
  partial updates, Swing Card panel, and several status regions.
- `src/app-events.ts` owns keyboard/click-triggered UI event wiring for consent,
  capture, file selection, workflow steps, analysis, phase review, keyframes,
  export, and remote-review-unavailable behavior. Its current
  `requestRender(statusMessage?)` contract cannot express focus intent.
- `src/app-state.ts` owns serializable/UI-derived workflow state and named state
  transitions/selectors. SS-019 does not move DOM focus state into app state.
- `src/consent-state.ts` owns fail-closed local acknowledgement storage; its
  storage and consent semantics remain unchanged.
- `src/analysis-lifecycle.ts` owns frame-processing controller handles,
  start/stop/close/network-blocked behavior, processing callbacks, and render
  requests caused by lifecycle transitions.
- `src/phase-review-renderer.ts` owns phase confirmation controls, assignment
  controls, provisional warnings, keyframe review markup, and the annotated
  keyframe canvas.
- `src/remote-model-renderer.ts` owns the unavailable remote-review panel,
  disclosure text, disabled control, and unavailable status.
- `src/keyframe-overlay-renderer.ts` owns selected-keyframe canvas drawing and
  overlay-status updates after render.
- `src/swing-card-actions.ts` owns local PNG, print, and clipboard action state,
  completion/failure status changes, and render callbacks.
- `src/render-utils.ts` owns canonical escaping and protected-boundary display
  formatting. New dynamic text must continue using safe text/escaping paths.
- `src/styles.css` owns focus styling, colors, responsive rules, layout,
  visually-hidden behavior, control sizing, status/error presentation,
  print/export styles, forced-color behavior, and reduced-motion behavior.
- `test/smoke/app.spec.ts` owns the current real-browser desktop/mobile workflow,
  real pose-fixture analysis path, protected network/local-first checks,
  selectors/labels, export behavior, and existing 390 CSS-pixel mobile layout
  assertions.
- Relevant `test/unit` files own renderer, event, lifecycle, state, escaping,
  phase-review, remote-model, overlay, and Swing Card contracts. SS-019 adds a
  focused `app-accessibility` unit surface rather than duplicating the full
  smoke workflow in unit tests.
- `docs/privacy-architecture.md`, `docs/safety-terms.md`, `docs/licensing.md`,
  and `docs/models-licensing.md` remain the protected product/compliance
  sources for local-first, consent, claim, dependency, SDK, and model-asset
  boundaries.

## Current-Main Findings

1. **Nested main landmarks.** `index.html` supplies `<main id="app">`, while
   `src/app-renderer.ts` supplies `<main class="workspace">`. The rendered page
   therefore has nested main landmarks instead of one main landmark.
2. **Full-render focus loss.** `src/main.ts` replaces `#app.innerHTML` on every
   `requestRender(...)`. The focused DOM node is removed and no explicit,
   previous, or fallback focus is restored after event binding and canvas
   redraw.
3. **Hidden file input remains a tab stop.** `#video-file` uses the current
   visually-hidden class, which hides it visually but does not remove it from
   sequential keyboard focus. The visible `Choose a video` button already owns
   the intended picker trigger.
4. **Inconsistent live/status semantics.** The shell status, processing status,
   phase warning, overlay status, Swing Card status, and remote-model status do
   not use one deliberate announcement contract. Some status text has
   `role="status"`, some has explicit `aria-live`, some has neither, and current
   render calls can announce routine rerenders rather than only meaningful
   transitions.
5. **Focus indicator contrast is insufficient.** The current `#d7972d` focus
   color has a measured contrast ratio of approximately 2.51:1 against white
   and 2.29:1 against `#f3f5f1`. A single-color outline therefore does not
   provide dependable separation across the app's adjacent light surfaces.
6. **Low-contrast interactive boundaries.** Several form/control borders rely
   on pale neutral colors that do not consistently reach 3:1 against adjacent
   surfaces where the boundary is required to identify the component.
7. **Long-text and reflow risks.** Action rows, metadata/disclosure layouts,
   phase assignment rows, keyframe controls, status/error strings, and Swing
   Card controls can receive long text or narrow widths without consistent
   `min-width: 0`, wrapping, overflow wrapping, or stacking rules. The current
   mobile rules do not prove 320 CSS-pixel reflow or text-spacing resilience.
8. **Existing useful coverage.** The smoke suite already covers desktop and a
   390 CSS-pixel mobile project, the real pose fixture, responsive workflow
   geometry, protected network behavior, Swing Card actions, and important
   selectors/labels. SS-019 should extend that real path rather than replace it
   with empty-state-only accessibility assertions.
9. **Canvas alternative remains limited.** The annotated keyframe canvas has an
   accessible label but not a stable description relationship to its overlay
   status. The canvas remains visual output; SS-019 can improve its name and
   description but cannot claim a fully equivalent nonvisual swing-analysis
   experience.

## Adopt

- Use one main landmark by changing only the static `#app` host element from
  `main` to `div` and retaining the renderer-owned workspace main.
- Add a stable announcer outside the replace-on-render subtree so meaningful
  status announcements survive full rerenders.
- Add `src/app-accessibility.ts` to own typed render/focus requests, a closed
  safe focus-key contract, focus capture/restore, focusability/fallback checks,
  and stable-announcer updates.
- Extend `requestRender` from an optional string to an object describing only
  approved focus and announcement intents.
- Use stable `data-focus-key` values. Compare attribute values and query the
  known attribute contract; never accept caller-provided CSS selectors.
- Restore focus only after render, event binding, and selected-keyframe canvas
  redraw. Prefer an explicit valid target, then the prior safe key, then a
  visible programmatic-focus fallback.
- Update `document.title` to the current workflow view after render while
  retaining the existing product/title wording pattern.
- Assign intent-specific focus and announcement behavior across events,
  lifecycle transitions, and Swing Card actions. Do not announce every render.
- Add semantic groups/headings/descriptions and scoped status regions while
  preserving protected copy, labels, and selectors.
- Remove `#video-file` from sequential keyboard focus with `tabindex="-1"` and
  `aria-hidden="true"`; keep the visible `Choose a video` button as the
  keyboard-operable trigger.
- Use a two-color focus treatment, stronger required control boundaries,
  scoped 44 CSS-pixel targets, wrapping/reflow hardening, readable failure
  styling, forced-color support, and existing reduced-motion behavior.
- Extend unit and Playwright coverage through the real pose-fixture path and
  add the required manual QA artifact during implementation.
- Keep runtime observability unchanged and add no dependencies.

## Revise Before Adoption

- Treat WCAG success criteria as design/test inputs, not as proof of project or
  product-wide conformance. Report what was tested, the environment, and
  residual limitations.
- Do not blanket every dynamic paragraph with `role="status"`. Use the stable
  announcer for concise workflow transitions and scoped local status regions
  where action-specific updates need proximity.
- Do not restore focus by replaying arbitrary selectors. The focus-key type and
  resolver must be internal and closed to known values.
- Do not force focus after same-control edits such as declarations, assignments,
  confirmations, or keyframe selection when the original control remains the
  clearest target; request that same control by key.
- Do not use positive `tabindex` or construct a parallel keyboard order. DOM
  order remains the source of sequential focus order.
- Do not set a global 44-pixel minimum on noninteractive layout elements.
  Apply target sizing to scoped controls and preserve usable dense desktop
  layouts.
- Do not treat 320-pixel screenshots alone as proof of reflow. Assert overflow,
  control usability, important geometry, long/error content, and review/export
  readability, then retain manual zoom/text-spacing checks.

## Defer

- Full accessibility certification, a formal WCAG conformance claim, and a
  third-party audit are deferred.
- Cross-browser/screen-reader combinations unavailable in the implementation
  environment are recorded as unavailable/residual risk, not claimed as
  passing.
- Complete nonvisual equivalence for pose-overlay canvas content is deferred;
  SS-019 improves its programmatic label/description and documents the limit.
- Localization and a production string-expansion system are deferred; long-text
  fixtures exercise structural resilience only.
- Camera capture, remote model review, remote sharing, providers, SDKs, model
  assets, telemetry, analytics, cloud diagnostics, and new operator diagnostics
  remain deferred.
- Broad design-system or decorative redesign work is deferred.

## Reject For Current Scope

- Reject positive `tabindex`, caller-provided focus selectors, focus traps, or
  focus changes that obscure the user's current task.
- Reject nested main landmarks, blanket live regions, or routine-rerender
  announcements.
- Reject changing protected user-facing safety, privacy, medical-scope,
  non-affiliation, consent, remote-review-unavailable, or local-first copy.
- Reject selector/label churn unless the approved spec names and directly
  updates the protected contract tests.
- Reject raw-media upload, remote sharing, provider/model registry enablement,
  service-worker changes, exported data-class changes, new persistence, or
  telemetry/logging/analytics/cloud diagnostics.
- Reject new dependencies, framework/component-library adoption, provider SDKs,
  model assets, bundle-policy changes, license-policy changes, notice changes,
  or SBOM changes.
- Reject claims that the story makes Swing Sync certified, fully accessible,
  universally screen-reader compatible, or compliant in every environment.

## Acceptance-Criteria Mapping

1. **Keyboard-only traversal:** typed focus intents, safe focus restoration,
   visible file-picker trigger, no positive tabindex, event/lifecycle/export
   focus mapping, a real keyboard-only smoke path, and manual keyboard evidence.
2. **Focus, labels, headings, status, disabled explanations:** one main,
   dynamic title, real stage/phase headings, grouped controls, canvas
   description, scoped live/status semantics, visible prerequisites, and direct
   renderer/event/unit assertions.
3. **Desktop/mobile layout:** focus/control contrast tokens, 44-pixel scoped
   targets, wrapping/flex/min-width hardening, readable failure styling,
   320-pixel and desktop long/error/review/export smoke checks, plus manual zoom,
   text-spacing, forced-colors, mobile, and print/export evidence.
4. **Practical automation:** new `app-accessibility` unit tests, focused
   renderer/event tests, and real pose-fixture Playwright coverage mapped by
   test name to acceptance criteria and future Claude blockers.
5. **Manual-only risks:** implementation must add
   `docs/ss-019-manual-accessibility-qa.md` with exact environment/evidence,
   defects, unavailable AT combinations, and residual-risk disclosures.

## Weak Claims And Evidence Limits

- Static source review identifies likely risks; it does not prove assistive
  technology behavior.
- Computed color ratios apply to the named color pairs only. Final rendered
  states, forced colors, opacity, antialiasing, and adjacent-color combinations
  still require implementation-time verification.
- Automated DOM, geometry, keyboard, and contrast-token checks can prevent
  known regressions but cannot establish full accessibility.
- A passing Playwright mobile viewport does not establish usability on every
  physical device, browser UI configuration, font setting, or input method.
- VoiceOver/NVDA evidence is recorded only when actually executed. An
  unavailable combination remains an explicit residual risk.
- Improved canvas semantics do not make the visual overlay fully equivalent for
  nonvisual users.
- The story must not claim WCAG certification, legal compliance, guaranteed
  accessibility, or universal compatibility.

## Observability And Dependency Decisions

Runtime observability remains intentionally unchanged. SS-019 may improve
existing local UI status text and announcement semantics, but it adds no
telemetry, analytics, remote logging, cloud diagnostics, hidden identifiers,
persistent debug artifacts, expanded console output, or new operator
instrumentation.

No dependency, framework, provider SDK, model asset, bundle, license-policy,
notice, or SBOM change is planned. If implementation changes that decision, the
story must return to specification review and run the additional licensing and
SBOM checks required by `AGENTS.md`.
````````````````````````````````````````
<!-- END EXACT BLOCK: 32 Complete current file: docs/ss-019-research-disposition.md -->

### 33 Complete current file: docs/ss-019-preimplementation-spec.md

Lines: 609  
Bytes: 35860  
SHA-256: `a92cf0f244f5e5a7015cd9824c0648bf626e120ee0a22b0d8f64cce2bf5db7cd`

<!-- BEGIN EXACT BLOCK: 33 Complete current file: docs/ss-019-preimplementation-spec.md -->
````````````````````````````````````````text
# SS-019 Preimplementation Specification

Date: 2026-07-19

Status: Revised after Claude QA-planning FAIL B1-B6. Candidate for focused
Claude re-review. Implementation and branch creation remain blocked until
Claude returns PASS and explicitly clears every blocker, or further findings
are resolved and independently re-reviewed.

Task: SS-019 Perform accessibility and responsive design hardening.

Branch after QA-planning clearance:
`ss-019-accessibility-design-hardening`, created from confirmed `main` at
`b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.

## Objective

Make the current MVP workflow a dependable keyboard, screen-reader,
manual-testing, responsive-layout, and public-demo surface without decorative
redesign or changes to product scope. Preserve the current local-first consent,
processing, phase-review, Swing Card, remote-review-unavailable, safety,
privacy, medical-scope, and non-affiliation contracts.

## Protected Baseline

- Preserve all existing protected user-facing labels, workflow copy, safety and
  privacy meaning, and smoke-test selectors unless this specification names the
  exact semantic-only addition.
- Preserve local-only raw-video/frame handling and explicit consent gating.
- Preserve remote review as unavailable; do not add remote sharing, providers,
  SDKs, model assets, cloud services, or hidden identifiers.
- Preserve app-state/exported-data contracts, service-worker behavior, CSP,
  manifest behavior, and persistence behavior.
- Add no telemetry, analytics, remote logging, cloud diagnostics, persistent
  debug artifacts, expanded console output, or runtime operator diagnostics.
- Add no dependency, framework, bundle-policy, license-policy, notice, or SBOM
  change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Approved File Scope And Ownership

### `index.html`

- Change only the `#app` host element from `<main id="app">` to
  `<div id="app"></div>` so `src/app-renderer.ts` supplies the page's one main
  landmark.
- Add a stable visually hidden sibling announcer:
  `<div id="app-announcer" class="visually-hidden" role="status"
  aria-live="polite" aria-atomic="true"></div>`.
- The announcer must remain outside the replace-on-render `#app` subtree.
- Keep the CSP meta content, manifest link, description, viewport metadata, and
  static `<title>Swing Sync | New analysis</title>` text otherwise unchanged.
  Runtime code updates it after render to exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` according to the active workflow view.

### New `src/app-accessibility.ts`

Own the DOM-only accessibility coordination contract. It must not import or
mutate app-state persistence.

- Define typed `RenderRequest` and `AccessibilityIntent` contracts. A render
  request may contain a closed focus intent and at most one global polite
  announcement. An absent request means ordinary render with no announcement.
- Own both post-render intent application and
  `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
  no-render path: it validates, focuses, or announces against the existing DOM
  only and must not replace DOM, mutate app state, rebind events, redraw the
  canvas, or touch controller-owned media.
- The closed static focus keys are exactly: `safety-consent`,
  `camera-placeholder`, `video-picker`, `analysis-start`, `stage-heading`,
  `workflow-next`, `stop-analysis`, `retry-analysis`, `review-phases`,
  `phase-declaration:view`, `phase-declaration:handedness`,
  `phase-declaration:mirrored`, `phase-setup`, `phase-confirmation`,
  `phase-confirm`, `open-export`, `phase-review-heading`,
  `swing-card-heading`, `swing-card-download`, `swing-card-print`,
  `swing-card-copy`, and `swing-card-status`.
- The only dynamic keys are exactly
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Validation must reject
  arbitrary strings, selector syntax, unknown prefixes, and out-of-range or
  non-integer indices.
- Capture the prior active element only when its `data-focus-key` passes that
  closed validator. Resolve known keys by comparing attribute values; never
  accept or persist caller-provided CSS selectors.
- Restore focus after render in this order: valid explicit target; valid prior
  target; exact per-view fallback. Capture and processing fall back to
  `stage-heading`; review falls back to `phase-review-heading` when phase
  outputs exist and otherwise `stage-heading`; export falls back to
  `swing-card-heading` when phase outputs exist and otherwise `stage-heading`.
- A target is focusable only when connected, visible, not hidden, not
  `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
  Programmatic headings/status targets may use `tabindex="-1"`; positive
  tabindex is prohibited.
- Update the stable `#app-announcer` using `textContent` only. All current
  announcements, including failures, use polite priority. Assertive is
  deliberately rejected because none of these events requires interruption.
- Export pure or DOM-injected seams sufficient for bounded-key, target-order,
  target-eligibility, exact fallback, text-only announcer, and no-render intent
  tests.

### `src/main.ts`

- Replace `requestRender(statusMessage?: string)` with
  `requestRender(request?: RenderRequest)` and expose/inject
  `applyAccessibilityIntent(intent: AccessibilityIntent)` alongside it.
- `requestRender` is the only full-render accessibility path.
  `applyAccessibilityIntent` delegates to the helper against the current root
  and stable announcer and must never replace DOM.
- Before replacing `#app.innerHTML`, capture the current valid focus key.
- Render the current view, bind fresh events, and redraw the selected keyframe
  canvas using the existing ownership order.
- Set `document.title` exactly to `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` for the active view without rewriting protected body
  copy.
- After render, binding, canvas redraw, and title update, restore focus using the
  request's explicit intent, then prior key, then safe current-view fallback.
- Send any explicit request announcement to the stable announcer. Do not
  announce on every full render.
- Keep `#app` stable, keep global `beforeunload` and
  `securitypolicyviolation` listeners unchanged in behavior, and keep
  production service-worker registration unchanged.

### Announcement-Channel Invariant

Each semantic event uses exactly one announcement channel: global or scoped,
never both.

- The stable global announcer is canonical for full-render shell, workflow,
  consent, camera, video, phase-review, and Swing Card events.
- Visible `.status`, `.phase-warning`, `[data-swing-card-status]`, and static
  `[data-remote-model-status]` keep their text/description functions but have
  no `role="status"`, `aria-live`, or other live-region role.
- Scoped live regions exist only for the in-place processing state text and the
  imperative overlay status. An event using either scoped channel passes no
  global announcement.
- All channels are polite. Assertive is rejected to avoid interrupting the
  current task.
- A named unit inventory test, `uses exactly one announcement channel for every
  mapped event`, must fail if a mapped callsite has both channels or no declared
  channel.

### Complete Focus And Announcement Callsite Matrix

Every current or approved `requestRender` and no-render accessibility callsite
in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` is
normative below. There may be no additional unmapped callsite or intent.

| Owner / event | Render path | Focus target | Sole announcement channel |
| --- | --- | --- | --- |
| Events: consent change | Full render | `safety-consent` | Global consent-ready/required message when meaning changes |
| Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
| Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
| Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
| Events: workflow step button | `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
| Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
| Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
| Events: picker `change` with a file | `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
| Events: picker `cancel` | No render | `video-picker` | None |
| Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
| Events: camera placeholder | Full render | `camera-placeholder` | Global camera-out-of-scope message |
| Events/lifecycle: Stop local analysis | Full render owned by `stopActive` | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
| Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
| Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
| Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
| Events: handedness declaration | Full render | `phase-declaration:handedness` | None unless a new validation result requires one global message |
| Events: mirrored declaration | Full render | `phase-declaration:mirrored` | None unless a new validation result requires one global message |
| Events: setup declaration | Full render | `phase-setup` | None unless a new validation result requires one global message |
| Events: phase assignment | Full render | Exact bounded `phase-assignment:<0..7>` | None unless a new validation result requires one global message |
| Events: confirmation checkbox | Full render | `phase-confirmation` | None unless a new validation result requires one global message |
| Events: Confirm phase review | Full render | `phase-review-heading` | Global confirmation or validation-failure message |
| Events: Open Swing Card export | Full render | `swing-card-heading` | Global export-opened message |
| Events: keyframe selection | Full render and overlay redraw | Exact bounded `keyframe:<0..7>` | Scoped imperative overlay status only; no global message |
| Lifecycle: loading/processing state callback | Partial DOM update | No change | Scoped processing state only |
| Lifecycle: progress callback | Partial DOM update | No change | None when only numeric progress changes |
| Lifecycle: output callback | Partial DOM update | No change | None |
| Lifecycle: current-controller completed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: current-controller failed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: late/stale terminal callback or terminal callback outside processing view | Partial/no-op against current DOM | No change | None; no visible scoped target means no announcement |
| Lifecycle: cancelled/closed callback | Partial/no-op | No change | None; `stopActive` owns stopped status, while close and callback are silent |
| Lifecycle: `closeActive()` from workflow navigation | Cleanup and state reset only; no render | No change | None; navigation caller owns one destination render/message |
| Lifecycle: `closeActive()` from picker change | Cleanup and state reset only; no render | No change | None; picker caller owns one selection render/message |
| Lifecycle: `closeActive()` from `beforeunload` | Cleanup and state reset only; no render | No change | None |
| Swing download start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing download completion/failure | Full render | `swing-card-download` | Global result message |
| Swing print start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing print completion/failure | Full render | `swing-card-print` | Global result message |
| Swing copy start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing copy completion/failure | Full render | `swing-card-copy` | Global result message |

The inventory test must cover both runtime guard failures; consent; begin;
workflow and next-step controls; picker success/cancel/redirect; camera;
stop/retry; review; all declaration/setup/assignment/confirmation/confirm
paths; export; keyframe; every lifecycle callback; render-free `closeActive()`
for navigation, picker replacement, and `beforeunload`; and download/print/copy
start, completion, and failure. Delayed terminal callbacks and same-control
focus tests must prove an open phase select cannot lose focus to stale
processing.

### Analysis-Lifecycle Partial/Terminal Contract

- `updateProcessingProgressUi(root, state)` remains a partial renderer and may
  change only safe text and `hidden` properties. The processing **state text**
  element alone has `role="status" aria-live="polite" aria-atomic="true"`.
  Numeric `[data-pose-summary]` remains outside that live region so progress
  ticks are not announced.
- Loading, processing, progress, and output callbacks call the partial update
  only. They never call the global announcer and never move focus.
- Each controller's callback closures capture that originating controller's
  identity or an equivalent unique token. Every callback checks that token
  before any state, output, DOM, focus, or announcement mutation; a stale token
  returns immediately without changing anything. Completed/failed callbacks
  with a current token update state/output and current processing DOM, making
  the scoped processing state the sole announcement. They then call the
  no-render accessibility intent to focus `stage-heading` only when
  `state.activeStep === "processing"` and the captured controller/token still
  equals the active controller/token.
- A late/stale terminal callback, or any terminal callback after navigation
  away from processing, must not steal focus or announce.
- `stopActive()` synchronously invalidates the active callback token before it
  awaits `cancel()`, while retaining a local controller reference for resource
  release. It then owns the stopped/released full render, announcement, and
  capture-view focus. A terminal callback racing the await sees a stale token
  and returns before mutation; cancelled callbacks do not duplicate the owner.
- `closeActive()` performs controller cleanup, handle clearing, phase/
  processing state reset, and nothing else: no render, focus, or announcement.
  It synchronously invalidates the active callback token before awaiting
  `close()`, while retaining a local controller reference for resource release.
  A racing callback is therefore stale before any mutation. Workflow-navigation
  and picker-change callers each own their single destination render/focus/
  announcement after cleanup. `beforeunload` calls cleanup with no render.
  Closed callbacks remain silent.
- `retryActive` applies no-render focus to `stage-heading` once and relies on
  the subsequent scoped loading/failed/completed state. It must not full-render
  or replace the controller-owned `#analysis-video` node.
- Existing protected labels/selectors, local resource release, and
  remote-review-unavailable behavior remain unchanged.

### Adopted Claude Precision Notes (Non-Blocking)

The exact four document titles, exact per-view fallback targets, bounded
dynamic focus-key grammar, and polite-only announcement priority are adopted as
precision within B1-B6 remediation. They make the existing keyboard, focus,
status, and test contracts implementation-ready; they do not expand SS-019
acceptance criteria or product scope.

### Renderer Semantics

Apply changes in `src/app-renderer.ts`, `src/phase-review-renderer.ts`, and
`src/remote-model-renderer.ts` while keeping current protected copy, labels,
and selectors byte-for-byte unless an attribute-only change is required.

- Add stable `data-focus-key` attributes to every mapped focus target.
- Keep one renderer-owned `<main class="workspace">` landmark.
- Keep the visible `Choose a video` button as the keyboard trigger and give it
  `data-focus-key="video-picker"`. Give `#video-file` `tabindex="-1"` and the
  accurate defensive accessible label `Choose a local video file`; do **not**
  set `aria-hidden="true"`.
- Add picker `cancel` handling that no-render focuses the current visible
  picker. Add `focus` and/or `focusin` redirection from the file input to the
  visible picker for browsers that return focus to the input after chooser
  close. Successful `change` always full-renders with explicit picker focus.
- `.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, and
  `.swing-card-summary` use `role="group"` with their retained accessible name,
  or an equivalently named native structure.
- Preserve the native `<dl class="remote-model-disclosure">` role and protected
  class selector. Wrap it in a named `role="group"` container for
  `Remote model data disclosure`; never override the `<dl>` role.
- Render each phase's visible label as a real `<h3>` while preserving its text
  and association with its assignment control.
- Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
  relationship to a stable overlay-status element. Preserve the existing
  protected canvas label text.
- Give only the processing state text and imperative overlay status stable IDs,
  scoped polite status semantics, and `aria-atomic="true"`. Keep numeric
  `[data-pose-summary]` outside the processing live region.
- Remove live-region roles/attributes from visible `.status`, `.phase-warning`,
  `[data-swing-card-status]`, and static `[data-remote-model-status]`. They
  remain visible text and valid `aria-describedby` targets.
- Do not add live-region semantics to static explanatory paragraphs.
- Keep dynamic status text on `textContent`/escaped paths.

Disabled controls must have both a visible dynamic prerequisite/explanation
and an exact `aria-describedby` relationship when disabled:

- `#analysis-button`: explain whether safety acknowledgement, local video, or
  processing availability is the current prerequisite.
- `[data-review-phases]` and `[data-confirm-phase-review]`: explain whether
  processing output, declaration completeness, phase assignments, or explicit
  confirmation is missing.
- Unavailable export/open-export controls: explain which valid/confirmed phase
  state is required.
- `[data-remote-model-send]`: retain the provider-review/configuration and
  explicit remote-sharing boundary explanation.
- Busy `[data-download-swing-card]`, `[data-print-swing-card]`, and
  `[data-copy-swing-card-prompt]`: describe the current local export action and
  restore focus to the initiating action after completion or failure.

Descriptions must reflect current state and must not claim remote availability,
successful persistence, privacy guarantees, or completed analysis when those
states are not true.

### `src/styles.css`

- Define exact custom properties `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`.
- The two-color `:focus-visible` geometry is exactly a 2 CSS-pixel white inner
  outline with 2-pixel offset plus a dark outer ring that leaves at least 2 CSS
  pixels visible beyond the inner ring; a 6-pixel outer spread is an approved
  implementation. Cover links, buttons, inputs, selects, and programmatically
  focused headings/status targets.
- Forced-colors mode must retain UA/system focus and semantic boundaries.
  `forced-color-adjust: none` is prohibited.
- Required computed contrast ratios are:

| Token pair | Required ratio |
| --- | ---: |
| `#17211b` vs `#ffffff` | 16.54:1 |
| `#17211b` vs `#f3f5f1` | 15.07:1 |
| `#17211b` vs `#f8faf7` | 15.76:1 |
| `#17211b` vs `#e7f0e9` | 14.21:1 |
| `#17211b` vs `#eaf3ec` | 14.59:1 |
| `#ffffff` vs `#17211b` | 16.54:1 |
| `#ffffff` vs `#245b3b` | 7.97:1 |
| `#607367` vs `#ffffff` | 5.07:1 |
| `#607367` vs `#f3f5f1` | 4.62:1 |
| `#607367` vs `#f8faf7` | 4.83:1 |
| `#607367` vs `#e7f0e9` | 4.35:1 |
| `#607367` vs `#eaf3ec` | 4.47:1 |

Every enumerated focus/interactive-boundary pair must remain at least 3:1.
- Give scoped interactive controls a 44-by-44 CSS-pixel minimum target where
  practical. Do not inflate passive content or apply a global layout minimum.
- Ensure programmatically focused stage/phase/export headings are visibly
  indicated and not obscured.
- Add `min-width: 0`, wrapping, flex/grid stacking, and `overflow-wrap` rules to
  action rows, disclosure/metadata values, phase assignments, keyframe controls,
  statuses/errors, and Swing Card controls as required.
- Add readable failed-processing styling that does not rely on color alone and
  preserves actionable retry/review distinctions.
- At 320 CSS pixels, the primary workflow must reflow without two-dimensional
  page scrolling, clipped text, overlapping controls, or an unreadable export
  panel, except for content that WCAG explicitly permits to remain two
  dimensional. No such exception is currently planned for the app workflow.
- Support forced-colors mode by retaining semantic borders/focus indicators and
  system color adaptation. Do not use `forced-color-adjust: none` to opt the app
  out.
- Preserve the existing reduced-motion behavior.
- Make no decorative redesign, workflow-obscuring restyle, or brand refresh.

## Automated Test Plan

All sign-off evidence must list named tests and map them to the acceptance
criterion and any future Claude blocker they cover.

### New `test/unit/app-accessibility.test.ts`

Add named tests for:

- accepting only known `data-focus-key` values and rejecting arbitrary selector
  strings;
- explicit focus target taking precedence over prior and fallback targets;
- previous known focus restoration when no explicit intent is supplied;
- visible/enabled fallback behavior when explicit/prior targets are absent;
- hidden, disconnected, disabled, `aria-hidden`, inert, and hidden-ancestor
  targets being rejected;
- no valid target producing a safe no-op;
- programmatic `tabindex="-1"` target focus with no positive tabindex;
- stable announcer update through `textContent`, including no update when the
  render request has no announcement.
- `applyAccessibilityIntent` operating without DOM replacement and sharing the
  same bounded-key/target validation as post-render intent application;
- exact bounded dynamic-key rejection and exact per-view fallbacks;
- file-picker cancel and hidden-input focus redirection to `video-picker`;
- every current mapped callsite using exactly one declared announcement
  channel.

Picker coverage must use the exact named tests
`returns focus to the picker after successful keyboard-opened selection`,
`returns focus to the picker on native chooser cancel without rendering`, and
`redirects hidden file input focus to the picker without positive tabindex`.

### New `test/unit/accessibility-contrast.test.ts`

Add a named unit suite that reads the exact CSS custom properties, asserts the
three required token values, computes the ratio matrix for every enumerated
surface, and fails below 3:1 or when a token/surface mapping changes.

### Renderer And Event Unit Tests

Extend existing focused unit suites to directly assert:

- exactly one main landmark across the static host and rendered shell;
- protected labels/selectors remain present;
- `#video-file` retains its selector/accept behavior but has
  `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
- stage, phase-review, Swing Card, same-control, and action-status focus keys;
- exact named group/native semantics for capture, keyframes, phase assignments,
  `Swing Card contents`, and the wrapper around native remote disclosure;
- heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
  IDs, scoped status semantics, and removed live roles from global-owner text;
- exact disabled-control `aria-describedby` targets and visible dynamic
  prerequisite text for Begin analysis, review/confirm, export, remote review,
  and busy Swing Card actions;
- every event/lifecycle/export path in the complete callsite table issues the
  exact typed focus/announcement request and has no unmapped callsite;
- render/rebind behavior remains single-effect and progress ticks do not
  refocus or announce every tick.
- named lifecycle tests exactly:
  - `keeps progress ticks partial without global announcements or focus changes`;
  - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
  - `does not steal focus for late terminal callbacks outside the processing view`;
  - `keeps stopped announcement owned by stop and close cleanup silent until the caller destination render`;
  - `retries without replacing the video DOM and moves focus once`.
- Additional named lifecycle/callsite tests:
  - `keeps closeActive cleanup render-free for navigation picker replacement and beforeunload`;
  - `lets navigation and picker callers own exactly one destination render`;
  - `binds terminal callback focus to the originating active controller token`;
  - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
- named renderer/smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`.

### Browser Smoke Tests In `test/smoke/app.spec.ts`

Add or extend named tests that:

- traverse the primary capture, consent, processing, review, phase-confirmation,
  and Swing Card export path with keyboard input only;
- open the native file chooser from the visible `Choose a video` button by
  keyboard, then inject the approved pose fixture through the test harness so
  the risky analysis path remains real without relying on a machine-specific
  chooser UI;
- cover successful keyboard-opened selection, a synthetic native `cancel`
  event returning focus, and defensive file-input focus redirection;
- verify focus continuity across consent, selection, begin, processing
  completion, review, same-control edits, confirmation, export, and local Swing
  Card actions after full rerenders;
- assert one main landmark, meaningful heading order, dynamic document titles,
  scoped status semantics, and no duplicate blanket live regions;
- verify representative focus visibility and approved focus/control contrast
  tokens in rendered light and dark-adjacent states, the applied two-layer
  indicator geometry, and forced-colors emulation;
- assert scoped interactive targets are at least 44 CSS pixels in each required
  dimension, allowing only spec-reviewed exceptions;
- at desktop and 320 CSS-pixel viewports, exercise long status/error text,
  failed processing, phase review, keyframe controls, and Swing Card export;
  assert no viewport overflow, clipped required text, overlap, or unusable
  control geometry;
- preserve the existing 390-pixel mobile coverage, protected selectors/labels,
  external-network guard, no-sensitive-console-output checks, and real
  pose-fixture output assertions.
- assert exactly one announcement owner for consent, processing terminal,
  phase validation/confirmation, and each Swing action without claiming that
  Playwright substitutes for manual screen-reader evidence;
- include named group assertions and 320-pixel/long-text geometry for
  `Swing Card contents` and `Remote model data disclosure`.

Geometry checks must identify the relevant elements and required relationships;
a screenshot alone or an empty-state-only page-width assertion is insufficient.

## Acceptance-Criteria Coverage Matrix

| Acceptance criterion | Automated evidence | Manual evidence |
| --- | --- | --- |
| Keyboard-only traversal through capture, consent, processing, review, phase confirmation, and export | Real keyboard-only pose-fixture smoke path; focus-request unit tests; event mapping tests | Full keyboard walkthrough, focus order/recovery, browser and input recorded |
| Understandable focus, labels, headings, statuses, and disabled explanations | Accessibility helper, renderer, event, lifecycle, and Swing Card tests; one-main/title/status smoke checks | Screen-reader/keyboard review, focus appearance, announcement timing, prerequisite clarity |
| No desktop/mobile overlap, clipping, unusable controls, or unreadable export | 320/390/desktop geometry, overflow, long/error/review/export, 44-pixel, and token tests | 200%/400% zoom or equivalent 320 reflow, text spacing, actual mobile, forced colors, print/export review |
| Practical automated regression coverage | Named unit/smoke tests mapped here and to Claude blockers | Record gaps that remain manual-only |
| Remaining manual-only risks documented | Artifact-presence/docs review where practical | Required `docs/ss-019-manual-accessibility-qa.md` risk table |

## Required Manual QA Artifact

Implementation must create `docs/ss-019-manual-accessibility-qa.md`. It is an
evidence record, not a conformance statement. For every run or scenario record:

- tested commit SHA and build/serve command;
- date, OS, browser/version, viewport or physical device, zoom, text-spacing
  override if used, input method, and assistive technology/version;
- workflow step and test scenario;
- expected result and actual result;
- evidence reference such as screenshot, recording, or concise observation;
- defect link/status when failed;
- residual risk, affected user/surface, severity or impact, workaround if any,
  and Adopt/Fix/Defer disposition.

Minimum manual scope:

- complete keyboard traversal, visible focus, logical order, and focus recovery;
- VoiceOver and/or NVDA announcements and landmarks where available; record an
  unavailable combination explicitly and do not claim it passed;
- consent, processing progress/failure/completion, phase-review validation,
  confirmation, and export announcements without over-announcement;
- actual native chooser cancel and focus return in every tested browser/AT
  environment;
- duplicate-announcement checks for consent, terminal completion/failure,
  phase validation/confirmation, and Swing actions;
- named-group checks for `Swing Card contents` and
  `Remote model data disclosure`;
- 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
- WCAG text-spacing overrides;
- forced-colors/high-contrast behavior where the environment supports it;
- every exact focus/boundary token surface from the required ratio matrix;
- long consent/status/error/prerequisite text;
- representative actual mobile-device interaction where available;
- annotated-canvas name/description and the residual nonvisual-equivalence
  limitation;
- Swing Card on-screen export panel, print preview, and locally generated
  download/copy status.

The artifact must explicitly say that SS-019 does not establish WCAG
certification, legal compliance, universal assistive-technology compatibility,
or complete nonvisual equivalence.

## Migration And Rollback

This is a DOM, CSS, focus-coordination, test, and manual-evidence change only.
There is no persisted-state migration, data-schema migration, exported-data
change, dependency migration, service-worker migration, or remote-service
rollout.

Implementation order:

1. Add the stable host/announcer and `app-accessibility` unit contract.
2. Convert the render request and focus/announcement call sites with focused
   unit tests.
3. Add renderer semantics/descriptions while preserving protected
   labels/selectors/copy.
4. Apply scoped CSS focus, contrast, target-size, failure, reflow, forced-color,
   and wrapping changes.
5. Extend the real pose-fixture smoke suite and run targeted checks.
6. Complete the manual QA artifact against the implementation commit.
7. Run the full required verification and prepare a self-contained Claude final
   audit packet containing every changed tracked file or explicit omission
   rationale.

Rollback is a revert of the focused SS-019 implementation commit. Because no
schema, persistence, dependency, provider, or remote behavior changes, no data
rollback is required. Validate the restored baseline with the existing unit,
smoke, build, compliance, safety, and privacy gates.

Primary migration risks are:

- focus regression from stale/missing focus keys or incorrectly forced focus;
- over-announcement, duplicate status messages, or lost important status;
- protected selector, label, or sensitive-copy drift;
- layout regressions introduced by control sizing or wrap rules;
- false confidence from automation that does not match manual AT/browser
  behavior.

## Required Verification

Use Node 22 from `.nvmrc`. Record exact commands, versions, named test output,
and results in the final audit and PR handoffs.

Targeted tests, adjusted to the exact implemented files:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility accessibility-contrast app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
```

Required smoke command:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'
```

Required baseline and protected-boundary checks under Node 22:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run compliance:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run safety:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run privacy:verify'
```

Run when documentation or generated-document claims change, including the
required manual QA artifact:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run docs:verify'
```

Always run:

```sh
git diff --check
```

No dependency, bundle, license-policy, notice, or SBOM change is expected. If
that boundary changes, stop implementation, return to review, and additionally
run the dependency/licensing/SBOM checks required by `AGENTS.md`.

## Claude QA-Planning Gate

Before implementation, the lead architect and workflow coordinator must create
a durable, self-contained Claude prompt and source packet using the standard
adversarial-review skeleton: Role, Stage, Scope, Context, Acceptance criteria,
Protected boundaries, Relevant source contents or focused diff, Verification,
Known non-goals, and Output required.

Claude's first QA-planning review returned FAIL with B1-B6. The source packet
for focused re-review must contain the prior response, this revised complete
specification, the exact diff from the pre-review specification extracted from
the original mechanically verified packet, relevant current baseline sources
and tests, and the focused `CONTEXT.md` diff. Claude must return PASS and
explicitly clear B1-B6, or new blockers must be incorporated and independently
re-reviewed, before the builder creates the story branch or changes runtime UI.
````````````````````````````````````````
<!-- END EXACT BLOCK: 33 Complete current file: docs/ss-019-preimplementation-spec.md -->

### 34 Complete current file: docs/ss-019-claude-qa-response.md

Lines: 253  
Bytes: 12298  
SHA-256: `66ec05645941d4289f3a380e4d2022c0c0dc30ce1fc34857249a8588477d7990`

<!-- BEGIN EXACT BLOCK: 34 Complete current file: docs/ss-019-claude-qa-response.md -->
````````````````````````````````````````text
# SS-019 Claude QA-Planning Response

Date: 2026-07-20

Claude verdict: **FAIL**.

Lead-architect disposition: **B1-B6 Accepted as blockers**. SS-019 remains at
`2. QA Planning (Claude)`. Runtime/UI implementation, story-branch creation,
and builder delegation remain blocked pending focused Claude re-review PASS.

## Finding Classification

All six findings expose missing architecture or verification contracts in the
candidate preimplementation specification. They are not implementation defects
because no SS-019 implementation exists. Each blocker changes the reviewed
plan and tests before builder work may begin.

Claude's precision notes about exact document titles, exact per-view fallback
targets, bounded dynamic focus keys, and one polite announcement policy are
adopted as non-blocking precision within B1-B6 remediation. They clarify the
existing acceptance criteria; they do not expand SS-019 product scope.

## B1 — Analysis-Lifecycle Terminal States Need A No-Render Accessibility Path

Claude finding, faithfully summarized:

The original plan prohibited full renders for processing progress but did not
define how current completed/failed callbacks could focus the processing
heading and announce a terminal state without replacing the controller-owned
video DOM. It also did not prevent stale terminal callbacks, cancelled/closed
callbacks, or retry behavior from stealing focus or duplicating announcements.

Disposition: **Accepted / blocker**.

Required correction:

- `src/app-accessibility.ts` owns both
  `applyAccessibilityIntent(root, announcer, intent)` for existing DOM and the
  post-render intent application path.
- `src/main.ts` injects both `requestRender(RenderRequest?)` and
  `applyAccessibilityIntent(AccessibilityIntent)`; the no-render function may
  only validate/focus/announce existing DOM.
- `updateProcessingProgressUi` stays partial and changes only safe text and
  `hidden` properties. The processing state text alone is a polite atomic
  status; numeric `[data-pose-summary]` stays outside it.
- Loading, processing, progress, and output callbacks perform partial DOM
  updates only, with no global announcement and no focus change.
- Each controller's callback closures capture that controller's identity or an
  equivalent unique token. Every callback checks the token before any state,
  output, DOM, focus, or announcement mutation; stale callbacks return
  immediately. Current-token completed/failed callbacks update state/output and
  the visible processing DOM, use the scoped processing status as the only
  announcement channel, then apply no-render focus to `stage-heading` only
  while the active view is processing and the captured controller/token equals
  the active controller/token.
- Late/stale terminal callbacks outside the current processing view neither
  focus nor announce. `stopActive()` alone owns the stopped/released full
  render, announcement, and focus. Both `stopActive()` and `closeActive()`
  synchronously invalidate the active callback token before awaiting
  `cancel()`/`close()`, while retaining a local controller reference for
  resource release; a racing terminal callback is inert before mutation.
  `closeActive()` performs cleanup/state reset only with no render, focus, or
  announcement; workflow-navigation and picker-change callers own one
  destination render, while `beforeunload` performs cleanup with no render.
  Cancelled/closed callbacks remain silent.
- `retryActive` focuses the stage heading through the no-render path and relies
  on subsequent scoped processing status without replacing the video node.
- Add the five named lifecycle tests required by the revised spec.

## B2 — Proxy File Input Needs Cancel And Browser Focus-Return Contracts

Claude finding, faithfully summarized:

The original `aria-hidden="true"` proposal could hide a file input that a
browser may focus after a native chooser closes, and the plan tested successful
selection but not cancel or defensive focus redirection. The proxy button/file
input pair therefore lacked a complete keyboard focus-return contract.

Disposition: **Accepted / blocker**.

Required correction:

- Remove the proposed `aria-hidden="true"`.
- Keep `#video-file` at `tabindex="-1"` with an accurate accessible label as a
  defensive fallback.
- Give the visible picker button a known focus key.
- Successful `change` always full-renders with explicit picker focus.
- A native `cancel` listener returns focus to the current visible picker
  without a render.
- Defensive `focus`/`focusin` handling redirects input focus to the visible
  picker after chooser close. Positive tabindex remains prohibited.
- Add named unit/smoke coverage for keyboard-opened success, cancel recovery,
  and hidden-input redirect, plus a manual native-chooser cancel row for each
  tested browser/AT environment.

## B3 — Every Semantic Event Needs One Announcement Owner

Claude finding, faithfully summarized:

The stable global announcer plus existing shell, phase-warning, Swing Card,
remote-model, processing, and overlay live regions could announce one semantic
event multiple times. The plan did not assign every callsite to exactly one
global, scoped, or no-announcement channel.

Disposition: **Accepted / blocker**.

Required correction:

- Enforce exactly one announcement channel per semantic event: global or
  scoped, never both.
- The stable global announcer owns full-render shell/workflow/consent/camera/
  video/phase/Swing Card events.
- Visible `.status`, `.phase-warning`, `[data-swing-card-status]`, and static
  `[data-remote-model-status]` lose live-region roles but remain visible text
  and descriptions.
- Scoped live regions are limited to in-place processing state and imperative
  overlay status; those events pass no global announcement.
- All announcements, including failures, are polite. Assertive announcement is
  rejected because none of the current events requires interruption.
- Add a complete channel/callsite matrix, a named one-channel inventory test,
  smoke checks, and manual duplicate-announcement evidence.

## B4 — Generic Labels Need A Naming Role Or Native Structure

Claude finding, faithfully summarized:

Adding `aria-label` to generic containers does not provide a reliable named
group unless the element also has an appropriate role/native semantic. Applying
`role="group"` directly to the remote-model `<dl>` would overwrite its native
list semantics.

Disposition: **Accepted / blocker**.

Required correction:

- `.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, and
  `.swing-card-summary` become named `role="group"` containers or named native
  equivalents.
- Preserve `<dl class="remote-model-disclosure">` semantics and its protected
  class/label by wrapping it in a named `role="group"` container.
- Add renderer and smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`, and include both in 320-pixel/long-text
  geometry evidence.

## B5 — Focus Keys And Every Render/No-Render Callsite Need A Closed Inventory

Claude finding, faithfully summarized:

The focus-key examples and event table were incomplete. They did not enumerate
all existing render/lifecycle/export callsites, bounded dynamic keys, the camera
placeholder, exact fallbacks, or guards against delayed terminal callbacks
stealing focus from open phase controls.

Disposition: **Accepted / blocker**.

Required correction:

- Enumerate all static keys for consent, camera, picker, analysis, stage,
  workflow, stop/retry/review, phase declarations/setup/assignment/
  confirmation/confirm, export, review/export headings, and each Swing action/
  status.
- Permit only these dynamic bounded forms:
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Reject arbitrary or
  out-of-range values.
- Give the camera placeholder a key; its full render returns to the same button
  and uses the global status.
- Inventory every current `requestRender` and no-render accessibility call in
  `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts`,
  including guard failures and every asynchronous Swing action phase.
- Use exact fallbacks: capture/processing `stage-heading`; review
  `phase-review-heading` when outputs exist else `stage-heading`; export
  `swing-card-heading` when outputs exist else `stage-heading`.
- Add a unit inventory test proving no unmapped callsite/intent exists, and
  guard same-control focus against delayed terminal focus theft.

## B6 — Focus And Boundary Styling Needs Exact Tokens, Geometry, And Ratios

Claude finding, faithfully summarized:

The visual plan described two-color focus and 3:1 boundaries but did not name
exact tokens, ring geometry, adjacent surfaces, computed ratios, or an
executable contrast contract. It was therefore not implementation- or
audit-ready.

Disposition: **Accepted / blocker**.

Required correction:

- Exact tokens: `--focus-inner: #ffffff`, `--focus-outer: #17211b`, and
  `--interactive-boundary: #607367`.
- Exact geometry: 2 CSS-pixel white outline with 2-pixel offset plus a dark
  outer ring that leaves at least 2 CSS pixels visible beyond the inner ring,
  such as a 6-pixel spread.
- Preserve UA/system forced-color focus and prohibit
  `forced-color-adjust: none`.
- Require the exact corrected contrast matrix in the revised spec: outer
  ratios 16.54/15.07/15.76/14.21/14.59 against white, `#f3f5f1`, `#f8faf7`,
  `#e7f0e9`, `#eaf3ec`; inner ratios 16.54 and 7.97 against `#17211b` and
  `#245b3b`; interactive-boundary ratios 5.07/4.62/4.83/4.35/4.47 against the
  same five light surfaces. Required threshold is at least 3:1.
- Add named `test/unit/accessibility-contrast.test.ts` that reads exact CSS
  custom properties and computes every ratio, plus smoke evidence for applied
  tokens, two-layer geometry, and forced-colors emulation.

## Adopted Non-Blocking Precision

- Runtime titles are exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, and
  `Swing Sync | Export`.
- Per-view fallbacks and dynamic key bounds are exact rather than illustrative.
- All current announcements use polite priority; assertive is deliberately
  rejected to prevent unnecessary interruption.
- Manual QA explicitly adds native chooser cancel, duplicate-announcement,
  terminal completion/failure, named group, and forced-colors/token-surface
  rows.

These decisions tighten the existing keyboard, semantics, status, responsive,
and manual-risk acceptance criteria. They add no product feature or public
claim.

## Protected-Boundary Disposition

- Safety/privacy/local-first copy and meaning: unchanged.
- Raw media, remote sharing, providers, SDKs, model assets, persistence,
  service worker, exported data, and analysis behavior: unchanged.
- Dependencies, bundle policy, license policy, notices, and SBOM: unchanged;
  no additions planned.
- Observability: unchanged. No telemetry, analytics, remote logging, cloud
  diagnostics, hidden identifiers, persistent debug artifacts, expanded
  console output, or runtime operator instrumentation is added.

## Process Lessons

- Cross-cutting focus and live-region specifications require complete callsite
  inventories plus a single-owner channel matrix before implementation.
- Proxy file controls require success, cancel, browser focus-return, and
  defensive redirect coverage; a successful selection test is insufficient.
- Generic `aria-label` requires a naming role or named native structure;
  protected native semantics such as `<dl>` must not be overwritten.
- Visual-token corrections must name exact tokens, geometry, adjacent surfaces,
  ratios, thresholds, and executable tests rather than relying on qualitative
  contrast language.
- Focused re-review packets must include prior findings, revised spec, exact
  spec diff, relevant current sources/tests, coordination diff, and explicit
  omission rationales before a blocker can be considered closed.

## Next Gate

Use `docs/ss-019-claude-qa-rereview-prompt.md` followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md`. Claude must return PASS and
explicitly clear B1-B6 without introducing an unresolved blocker before branch
creation or builder delegation.
````````````````````````````````````````
<!-- END EXACT BLOCK: 34 Complete current file: docs/ss-019-claude-qa-response.md -->

### 35 Complete current file: docs/ss-019-claude-qa-planning-prompt.md

Lines: 245  
Bytes: 12825  
SHA-256: `0d53401576b4eb19d7e2dfb639598ee21e256cacb4357c66f78c20857da973f8`

<!-- BEGIN EXACT BLOCK: 35 Complete current file: docs/ss-019-claude-qa-planning-prompt.md -->
````````````````````````````````````````text
# SS-019 Claude QA Planning Prompt

**Superseded for paste use.** Claude returned FAIL with B1-B6. Use
`docs/ss-019-claude-qa-rereview-prompt.md` followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md` for the focused re-review.
Keep this file as the original QA-planning record.

Paste this prompt into Claude Chat, followed immediately by
`docs/ss-019-claude-qa-planning-source-packet.md`. The two-file paste is one
self-contained handoff. Do not submit only this prompt: Claude has no
repository, filesystem, GitHub, or Notion access, and the source packet is the
required evidence.

## Role

You are the independent lead adversarial QA planner for Swing Sync, a
local-first browser app for educational golf swing review. Challenge the plan;
do not implement it, rewrite source files, or assume that summarized evidence
is sufficient when exact source is provided in the immediately following
packet.

## Stage

Preimplementation QA planning for SS-019. Runtime/UI implementation and story
branch creation are blocked. The builder must not start until you return PASS,
or every blocking finding is incorporated into the specification/tests and a
focused independent re-review clears it.

## Scope

Adversarially review the SS-019 research/disposition and candidate
preimplementation specification against the complete current source packet.
Challenge:

- the one-main/stable-announcer architecture;
- the typed render request and closed safe `data-focus-key` contract;
- explicit, previous, and fallback focus restoration after full rerenders;
- focus and announcement intent mapping across events, processing lifecycle,
  phase review, and Swing Card actions;
- live-region scope, semantic groups/headings, canvas descriptions, and exact
  disabled-control explanations;
- focus/control contrast, 44-pixel scoped targets, 320-pixel reflow, forced
  colors, reduced motion, long text, error states, and export readability;
- real keyboard-only automation through the risky pose-fixture path;
- named unit/smoke coverage mapped to acceptance and future blockers;
- the manual accessibility evidence format and honest residual-risk handling;
- migration/rollback safety and protected-boundary preservation.

Identify underspecified ownership, contradictory requirements, fail-open
behavior, stale-focus/selector injection risk, over-announcement, untestable
contracts, weak layout evidence, false conformance implications, or missing
source/test coverage before implementation.

## Context

Swing Sync is a Vite/TypeScript local-first browser app. Raw swing video is not
uploaded by default. Explicit safety acknowledgement gates local analysis.
Approved pose processing runs locally on sampled frames. Phase review and Swing
Card generation are local. Remote model review remains unavailable because no
provider is reviewed/configured. There is no app backend, account system,
remote sharing, telemetry, analytics, remote logging, cloud diagnostics, or
configured model provider.

Post-SS-018 ownership is modular:

- `index.html` owns the static host, title, CSP meta policy, and manifest link.
- `src/main.ts` owns the stable root and full render/bind/canvas-redraw
  coordinator plus global lifecycle/service-worker listeners.
- `src/app-renderer.ts` owns the outer shell, workflow stages, processing
  partial updates, and Swing Card panel.
- `src/app-events.ts` owns UI event wiring and render requests.
- `src/app-state.ts` owns serializable/UI state transitions and selectors.
- `src/consent-state.ts` owns fail-closed acknowledgement storage.
- `src/analysis-lifecycle.ts` owns frame-controller handles, processing
  callbacks, resource release, and lifecycle render requests.
- `src/phase-review-renderer.ts` owns phase assignments/confirmation and
  keyframe review markup.
- `src/remote-model-renderer.ts` owns the unavailable remote-review panel.
- `src/keyframe-overlay-renderer.ts` owns selected-keyframe canvas drawing and
  overlay status.
- `src/swing-card-actions.ts` owns local download/print/copy action state.
- `src/render-utils.ts` owns canonical escaping/formatting.
- `src/styles.css` owns focus, color, layout, responsive, print, forced-color,
  and reduced-motion behavior.
- Playwright smoke tests own the current desktop/390-pixel mobile, protected
  selector/label, network/local-first, real pose-fixture, and export paths.

Current-main findings:

- `index.html` renders `<main id="app">` while the app renderer supplies an
  inner `<main class="workspace">`, producing nested main landmarks.
- `requestRender` replaces `#app.innerHTML` and does not preserve focus.
- the visually hidden `#video-file` remains sequentially keyboard focusable
  even though the visible button is the intended trigger;
- status/live semantics are inconsistent and can become duplicate or overly
  broad if hardened without a deliberate announcement contract;
- current focus color `#d7972d` is approximately 2.51:1 on white and 2.29:1
  on `#f3f5f1`;
- some required form/control boundaries are low contrast;
- action rows, assignments, statuses/errors, narrow layouts, and Swing Card
  controls have long-text and 320-pixel reflow risks;
- existing 390-pixel mobile and real-path selector/label coverage is useful but
  does not satisfy the complete SS-019 evidence plan.

Approved architecture:

- change the static `#app` host to `div`, retain one renderer-owned main, and
  add a stable visually hidden `#app-announcer` outside the replaced subtree;
- add `src/app-accessibility.ts` with typed `RenderRequest`, an internal closed
  safe focus-key contract, active-focus capture, visibility/focusability
  validation, explicit/previous/fallback restoration, and text-only announcer
  updates;
- never accept caller-provided CSS focus selectors and never use positive
  tabindex;
- update `document.title` per current workflow view;
- map consent to consent control; video selection to the visible picker;
  begin/step/stop/retry/review transitions to the stage heading; declarations,
  assignments, confirmation choices, and keyframes to the same logical control;
  confirmed review to the phase-review heading; export to the Swing Card
  heading; and busy Swing Card actions to local status before returning to the
  initiating action;
- announce concise meaningful consent/workflow/failure/completion/export
  changes, not every render or progress tick;
- preserve all protected labels/selectors/copy while adding scoped semantics,
  focus keys, descriptions, and layout/focus styling;
- require a real keyboard-only pose-fixture smoke path, focused unit contracts,
  desktop/320/390 long/error/review/export checks, and a manual evidence
  artifact that records unavailable AT/browser combinations and residual risk
  without claiming certification.

## Acceptance criteria

- Complete keyboard-only traversal for capture, consent, processing, review,
  phase confirmation, and Swing Card export flows.
- Verify visible focus states, labels, headings, status updates, and
  disabled-control explanations are understandable.
- Check desktop and mobile layouts for overlap, clipped text, unusable
  controls, and export-panel readability.
- Add automated smoke or unit coverage for the highest-risk accessibility and
  responsive regressions where practical.
- Document any remaining manual-only accessibility risks.

## Protected boundaries

- Do not introduce decorative redesign that obscures the workflow.
- Do not add runtime telemetry, remote logging, analytics, cloud diagnostics,
  provider SDKs, model assets, or remote sharing.
- Do not change safety, privacy, medical-scope, or non-affiliation claims
  except through the sensitive-story review path.
- Preserve local-first raw-media handling, explicit consent, local pose
  processing, remote-review-disabled behavior, service-worker behavior,
  exported data classes, persistence behavior, protected labels, protected
  copy, and smoke-test selectors.
- Do not add a dependency, framework, provider SDK, model asset, bundle-policy,
  license-policy, notice, or SBOM change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Relevant source contents or focused diff

Paste `docs/ss-019-claude-qa-planning-source-packet.md` immediately after this
prompt. The prompt plus packet is one handoff. The packet contains a manifest
with line counts and SHA-256 hashes, exact complete contents for every listed
current source/spec/test/policy file, and the complete focused
`git diff -- CONTEXT.md` with an omission rationale for unrelated historical
context.

Do not review from this prompt alone. If the immediately following packet is
missing, truncated, has a manifest/block mismatch, replaces exact contents with
summaries, or omits a required file without rationale, return FAIL for a
handoff-completeness blocker before judging implementation readiness.

No SS-019 runtime implementation exists. Treat the current files as the
baseline and the research/specification as the proposed change.

## Verification

Current evidence only:

- `git fetch origin` completed successfully.
- local `main`, refreshed `origin/main`, and live remote main were confirmed at
  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`, including SS-018 merge commit
  `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`.
- `git diff --check` passed for the current planning artifacts.
- the source-packet generator recorded every required file's line count,
  byte count, and SHA-256 hash; a mechanical verification re-extracted every
  embedded block and compared it byte-for-byte with the working file, and did
  the same for the focused `CONTEXT.md` diff.
- the nine intentional untracked
  `docs/agent-guidance/*new-codex-session-prompt.md` files predate SS-019 and
  are explicitly excluded as unrelated.

No SS-019 implementation tests have run, and no test result should be inferred.
Future builder verification must use Node 22 from `.nvmrc` and include named
targeted unit tests, the real Playwright smoke path, `npm run build`,
`npm run compliance:verify`, `npm run safety:verify`,
`npm run privacy:verify`, `npm run docs:verify` when documentation/generated
claims change, and `git diff --check`. No dependency checks are expected unless
the protected no-dependency decision changes and returns to review.

## Known non-goals

- No decorative redesign, design-system migration, framework migration,
  routing/state library, or component library.
- No camera-capture implementation, localization system, backend, accounts,
  auth, cloud storage, remote sharing, provider/model configuration, SDK, or
  model asset.
- No telemetry, analytics, remote logging, cloud diagnostics, hidden
  identifiers, persistent debug artifacts, expanded console output, or new
  runtime operator instrumentation.
- No service-worker, persistence, exported-data-class, analysis algorithm,
  pose model, phase logic, metric, or Swing Card data-contract change.
- No new dependency, bundle/license policy, notice, or SBOM change.
- No formal accessibility certification, project-wide WCAG conformance claim,
  legal/compliance claim, universal assistive-technology guarantee, or complete
  nonvisual equivalence for the annotated canvas.
- No claim that unavailable VoiceOver/NVDA/browser/device combinations passed;
  unavailable combinations remain documented residual risks.

## Output required

Return a QA-planning decision, not implementation:

1. Start with exactly `PASS` or `FAIL`.
2. If FAIL, list blocking findings as `B1`, `B2`, and so on, ordered by
   severity. For each blocker give the exact file/spec section, failure mode,
   user/protected-boundary impact, and required architecture/spec/test
   correction before re-review.
3. Identify acceptance-criteria coverage gaps and map each gap to the missing
   unit, smoke, or manual evidence.
4. Provide adversarial cases for focus capture/restoration, stale or missing
   targets, safe-key validation, announcements/live regions, assistive
   technology semantics, keyboard order, contrast/focus visibility, 44-pixel
   targets, forced colors, 320-pixel reflow, zoom/text spacing, long text,
   error/failure states, review, canvas description, and export/print behavior.
5. Identify any safety/privacy/local-first/consent/remote-review/copy/selector/
   dependency/observability drift.
6. Identify missing named automated tests, real risky data paths, or manual QA
   fields/scenarios required for sign-off.
7. Separate non-blocking recommendations from future work; do not silently
   expand SS-019 acceptance criteria.
8. End with an explicit statement that SS-019 is either `CLEARED FOR
   IMPLEMENTATION` or `NOT CLEARED FOR IMPLEMENTATION`.
9. Do not write implementation code or instruct the builder to begin when any
   blocker remains.
````````````````````````````````````````
<!-- END EXACT BLOCK: 35 Complete current file: docs/ss-019-claude-qa-planning-prompt.md -->

### 36 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md

Lines: 134  
Bytes: 7015  
SHA-256: `ec67d0d790efa0d620c13984221cd83d994cc5a2b83a679acf2b5632915a0a30`

<!-- BEGIN EXACT BLOCK: 36 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md -->
````````````````````````````````````````text
# SS-019 Claude QA-Planning B1-B6 Focused Re-review Prompt

Paste this prompt into Claude Chat first, followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md`. Together they are one
self-contained handoff. Assume no filesystem, repository, GitHub, Notion, or
prior-chat access. If the packet does not follow, return FAIL.

## Role

You are the independent lead adversarial QA planner for local-first Swing Sync.
Re-review the revised preimplementation plan after your B1-B6 FAIL and the lead
architect's close/token-race precision. Challenge closure and regressions; do
not implement code.

## Stage

Focused preimplementation QA-planning re-review. No SS-019 runtime/UI
implementation or story branch exists. Builder and branch creation remain
blocked until PASS, all blockers closed, and `CLEARED FOR IMPLEMENTATION`.

## Scope

Re-review B1-B6, the lead-found close/token race, new blockers, acceptance
coverage, protected boundaries, named automation, and manual evidence. Attack
stale focus, unmapped callsites, duplicate announcements, unsafe focus keys,
chooser cancel/focus return, semantic-role loss, contrast math, forced colors,
320px/long-text/error states, empty-path tests, and false conformance claims.

## Context

Swing Sync is a Vite/TypeScript local-first browser app. Raw swing video is not
uploaded by default; consent gates local analysis; pose processing, phase review,
and Swing Card export are local; remote review remains unavailable. No backend,
telemetry, remote logging, cloud diagnostics, provider, SDK, model, dependency,
or remote sharing is added.

Accepted corrections:

- **B1:** `src/app-accessibility.ts` owns post-render and no-render intents.
  Progress/output stays partial; only processing state is scoped polite live.
  Each controller callback captures an identity/token and checks it before any
  state/output/DOM/focus/announcement mutation; stale callbacks return. Current
  completed/failed callbacks may no-render focus the processing heading only
  when processing view and active token match. Retry preserves video DOM.
- **Lead precision:** stop/close synchronously invalidate the active callback
  token before awaiting cancel/close while retaining a local controller for
  resource release, making racing terminal callbacks inert. Stop owns the
  stopped render/announcement/capture focus. Close is cleanup/state-reset only:
  no render/focus/announcement. Navigation and picker callers own one
  destination render; `beforeunload` cleans up without rendering.
- **B2:** the file input has `tabindex="-1"` and a defensive label, not
  `aria-hidden`; selection, cancel, and focus/focusin redirect return focus to
  the visible picker without positive tabindex.
- **B3:** every event uses exactly one polite global or scoped channel. Global
  owns full-render workflow/consent/camera/video/phase/Swing events. Scoped live
  regions are only processing state and imperative overlay. Other visible
  status text is not live. Every callsite is inventoried.
- **B4:** capture, keyframe, assignment, and Swing summary use named group/native
  semantics. Remote disclosure keeps native `<dl>` inside a named group.
- **B5:** static focus keys are enumerated; dynamic keys are only
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Fallbacks and every
  event/lifecycle/Swing render/no-render callsite are exact.
- **B6:** exact tokens are `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, `--interactive-boundary: #607367`, with exact ring
  geometry, surface ratios, >=3:1 threshold, CSS-reading unit tests,
  computed-style smoke checks, and forced-color behavior.

Exact title/fallback/bounded-key/polite-priority notes are adopted non-blocking
precision, not expanded acceptance.

## Acceptance criteria

- Keyboard-only traversal covers capture, consent, processing, review, phase
  confirmation, and Swing Card export.
- Focus, labels, headings, status, and disabled explanations are understandable.
- Desktop/mobile layouts avoid overlap, clipping, unusable controls, and
  unreadable export.
- Add practical high-risk accessibility/responsive smoke or unit coverage.
- Document remaining manual-only accessibility risks.

## Protected boundaries

- No workflow-obscuring redesign; telemetry; remote logging; analytics; cloud
  diagnostics; provider SDK/model assets; remote sharing; identifiers; or debug
  artifacts.
- No safety/privacy/medical/non-affiliation claim change outside sensitive review.
- Preserve local-first media, consent, local processing, remote-review-disabled
  behavior, service worker, persistence, exported data, copy/labels/selectors.
- No dependency/framework/bundle/license/notice/SBOM change and no absolute
  accessibility/safety/privacy/legal/medical/compliance claim.

## Relevant source contents/focused diff

The immediately following packet must contain complete revised spec, Claude
response, research disposition, superseded original prompt, relevant baseline
sources/tests, an explicit absent record for unimplemented
`src/app-accessibility.ts`, complete focused `CONTEXT.md` diff, and complete
pre-review-to-revised-spec diff derived from the exact original packet block.

Mechanically verify manifest kind/path/line/byte/SHA-256 entries, exactly one
unique BEGIN/END pair per block, equal manifest/block counts, no truncation or
fence collision, no summary substituted for exact contents, and rationales for
omissions. Any mismatch is a FAIL handoff blocker.

## Verification

Current evidence is planning-only: B1-B6/lead precision are revised before
implementation; packet blocks are byte/hash checked; `git diff --check` passes;
tracker/context remain QA Planning with empty PR and `main`; nine unrelated
prompt files remain untouched. No implementation tests ran. Future Node 22
checks include named accessibility/contrast/renderer/events/lifecycle/phase/
remote/Swing unit tests, real keyboard-only pose-fixture Playwright, build,
compliance, safety, privacy, docs when applicable, and diff check.

## Known non-goals

No implementation/branch/builder before PASS; redesign/framework/localization/
camera/backend/account/cloud/remote/provider/model/service-worker/persistence/
exported-data/algorithm change; observability/dependency/license/SBOM change;
or certification, universal AT, legal/compliance, or complete nonvisual-canvas
claim.

## Output required

1. Start with exactly `PASS` or `FAIL`.
2. Mark B1-B6 and close/token-race precision `CLOSED` or `OPEN` with evidence.
3. List open/new blockers by severity with impact and exact correction.
4. Identify AC gaps, missing named automated/manual evidence, and boundary drift.
5. Report packet manifest/marker counts and mismatches.
6. Separate non-blocking recommendations from future work.
7. End `CLEARED FOR IMPLEMENTATION` only for PASS with zero blockers; otherwise
   end `NOT CLEARED FOR IMPLEMENTATION`.
8. Do not implement or direct builder work while any blocker remains.
````````````````````````````````````````
<!-- END EXACT BLOCK: 36 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md -->

### 37 Complete current file: docs/ss-019-claude-qa-raw-response.md

Lines: 77  
Bytes: 17232  
SHA-256: `4f7afede4006ee31a08b48aad44bfb17aff531c0da98468c3a7009e72c60d320`

<!-- BEGIN EXACT BLOCK: 37 Complete current file: docs/ss-019-claude-qa-raw-response.md -->
````````````````````````````````````````text
**FAIL**

I verified the handoff mechanically before judging content. All 33 complete-file blocks and the one focused-diff block are present with matching BEGIN/END markers and no summarization. I re-derived byte counts and SHA-256 hashes for four files by hand-transcribing them into a container and hashing (`.nvmrc`, `src/render-utils.ts`, `src/consent-state.ts`, and — because it underpins my top blocker — `src/analysis-lifecycle.ts`); all four matched the manifest's line count, byte count, and hash exactly. That's a spot check, not exhaustive re-verification of all 34 blocks, but it found no truncation or mismatch, so I'm not failing on handoff-completeness grounds. I'm failing on architecture/spec-adequacy grounds instead.

## Blocking findings

**B1 — The intent-mapping table promises focus/announcement behavior that the actual processing code path structurally cannot deliver, for exactly the transitions that matter most (failed, completed, retry).**
File/section: `docs/ss-019-preimplementation-spec.md`, "Intent Mapping" table row *"Begin, workflow-step navigation, stop, retry, or transition to review"*; `src/analysis-lifecycle.ts` (verified byte-exact above).
Failure mode: Only `startActive`'s caller (in `app-events.ts`, on the Begin-analysis click) and `stopActive()`/`closeActive()` call `requestRender(...)`. Every other state transition — loading→processing→**completed**, →**failed**, and the entire `retryActive()` path — routes exclusively through `handleProcessingState` → `updateProcessingProgressUi`, a surgical DOM patch that only rewrites `textContent` and `.hidden` flags. It never touches focus and never touches the announcer. The spec's own rule for that function ("do not force full render, refocus, or stable-announcer updates on every progress tick") is written broadly enough to also legally cover completion and failure, since they arrive through the identical callback. But the mapping table simultaneously promises "failed" and "review-ready" get stage-heading focus and a status announcement. These two requirements contradict each other as currently specified, and nothing in the spec tells the implementer which one wins.
Impact: A keyboard/screen-reader user who starts analysis will get no focus movement and no announcement when processing fails (only the "Retry local analysis" button silently un-hides) or completes (only "Review phase labels" silently un-hides) or when retry itself fails again. This directly undermines acceptance criterion 1 (keyboard-only traversal) and criterion 2 (understandable status) for the two most consequential state changes in the whole workflow.
Required correction: The spec must explicitly decide whether `updateProcessingProgressUi` is extended to accept and apply a `RenderRequest`-style focus/announcement payload for the *terminal* states only (completed/failed/cancelled/closed), while continuing to suppress it for `loading`/`processing` progress ticks — and must add a named unit test in `test/unit/analysis-lifecycle.test.ts` that asserts this distinction (progress tick → no focus/announcement call; terminal state → exact focus key + announcement text).

**B2 — `#video-file` gets `aria-hidden="true"` + `tabindex="-1"`, but nothing addresses the case where the browser returns focus to it after the native file dialog closes, nor the cancel path.**
File/section: preimplementation spec, "Renderer Semantics" ("Add `tabindex="-1"` and `aria-hidden="true"` to `#video-file`"); `src/app-events.ts` `[data-video-picker]`/`#video-file` handlers.
Failure mode: `tabindex="-1"` removes the input from *sequential* tab order but does not prevent it from becoming the programmatically-focused element, which is exactly what many browsers do when a native file-chooser dialog closes (focus returns to the element that opened it). An `aria-hidden="true"` element that is also the actively focused element is a well-known ARIA anti-pattern (hidden-but-focused), and it produces a genuinely broken state for screen-reader users: the input is invisible to the accessibility tree yet holds focus. Separately, the `change` handler is the only file-input listener; if the user cancels the native dialog, no `change` fires, so there is no code path that moves focus back to the visible "Choose a video" button — the user is left in that same hidden-focused (or completely lost) state with a keyboard-only workflow.
Impact: Directly contradicts the story's own keyboard-traversal and focus-visibility acceptance criteria, on the exact interaction the spec calls out as the risky path to test.
Required correction: Spec must require an explicit "return focus to the visible file-picker trigger" step that runs both on `change` *and* on window regaining focus after the chooser closes without a `change` (e.g., a `focus`/`focusin` listener on `#video-file` that immediately redirects focus to the visible button), and the smoke-test plan must add a named cancel-path scenario, not just the successful-selection path.

**B3 — A new global `#app-announcer` is introduced without reconciling it against at least two, soon three, pre-existing local `role="status"` regions, creating a real risk of duplicate or conflicting announcements.**
File/section: `index.html` new `#app-announcer`; current `.phase-warning` (`role="status" aria-live="polite"`, already in `src/phase-review-renderer.ts`) and `[data-swing-card-status]` (`role="status"`, already in `src/app-renderer.ts`); spec's "Renderer Semantics" section, which adds `role="status"` to the overlay-status element too.
Failure mode: The mapping table's announcement column for "Declaration, phase assignment, confirmation choice, or keyframe selection" and for "Busy Swing Card action" describes *what* to announce but never states *which single mechanism* carries it — the pre-existing local live region, or the new global announcer, or (if the implementer isn't careful) both. Nothing in the spec establishes a structural, testable invariant that a given semantic event may update only one live-region mechanism.
Impact: Screen-reader users hearing the same status twice (or a stale local message contradicting a fresher global one) is worse than the current baseline, and it's exactly the "no false confidence" failure mode this project has flagged before (a mechanism that looks like it satisfies WCAG 4.1.3 but doesn't, because it wasn't checked against the other live regions already in the DOM).
Required correction: Spec must add an explicit rule — e.g., "the global announcer is silent for any event already covered by a scoped local `role=status` region; the two must never both update for the same state change" — plus a named unit/smoke test asserting mutual exclusivity per event.

**B4 — The "fix the mislabeled containers" list in the spec is incomplete; at least two containers with the identical defect are left out.**
File/section: preimplementation spec, "Renderer Semantics" bullet naming only capture-options, keyframe-strip, and phase-assignment-list for `role="group"`/native-group treatment; current `src/app-renderer.ts` (`<div class="swing-card-summary" aria-label="Swing Card contents">`) and `src/remote-model-renderer.ts` (`<dl class="remote-model-disclosure" aria-label="Remote model data disclosure">`).
Failure mode: A generic `<div>` and a `<dl>` do not support "name from author" via `aria-label` under the ARIA-in-HTML mapping rules unless they carry a role that supports naming. That means these two panels' `aria-label`s are very likely already being dropped by assistive technology on current `main`, and the SS-019 spec — despite being the accessibility-hardening story — doesn't list either one for a fix.
Impact: Acceptance criterion 2 ("labels... understandable") stays unmet for the Swing Card summary and the remote-model-disclosure panel even after this story ships.
Required correction: Add `.swing-card-summary` and `.remote-model-disclosure` to the group-semantics remediation list (e.g., `role="group"` + retained `aria-label`, or convert to a native `<section aria-labelledby>`), with a named renderer unit test asserting each has an accessible name.

**B5 — The closed focus-key registry and the intent-mapping table don't cover every `requestRender` call site; the "Use camera" placeholder click is a concrete gap.**
File/section: spec's `app-accessibility.ts` description ("consent... file-picker trigger... stage heading... phase-review heading... Swing Card heading... current declaration/assignment/confirmation/keyframe control... Swing Card action/status targets"); `src/app-events.ts` `[data-placeholder-action='camera']` handler, which calls `requestRender(...)` today and must convert to the typed contract.
Failure mode: The camera button isn't in the registry, so under "capture the prior active element only when it has a valid known `data-focus-key`," clicking it and getting a full re-render will not restore focus to it (no previous key captured) and isn't named as an explicit target either. Focus falls through to whatever the unspecified per-view "fallback" resolves to (see coverage gap below), which will very likely not be the button the user was just on.
Impact: A basic, low-risk-looking interaction (clicking a disabled-feature button) becomes a focus-order violation for keyboard users, and it's the kind of gap that's easy to miss precisely because the control is a "placeholder."
Required correction: Either add the camera button to the closed focus-key registry, or have the spec state explicitly that this event is exempt from full re-render entirely (a local status update would suffice, mirroring how `updateProcessingProgressUi` avoids full rerenders elsewhere) — and audit every remaining `requestRender` call site in `app-events.ts` against the registry rather than relying on the table's five illustrative rows.

**B6 — The "two-color focus indicator" requirement has no concrete colors, no enumerated list of adjacent surfaces to test against, and no named contrast-computation test — the same "untestable/vacuous verification" pattern this project has previously treated as a blocker.**
File/section: spec's CSS section ("Replace the insufficient single-color focus outline with a two-color focus indicator that remains discernible..."); research disposition's own precisely-computed baseline ratios (2.51:1 / 2.29:1) for the *current* defect.
Failure mode: The replacement requirement is qualitative ("discernible") where the defect it replaces was quantified. The smoke-test plan later refers to "approved focus/control contrast tokens" as if they already exist, but they're never defined in this spec — so either the implementer invents both the colors and the pass/fail threshold with no independent review, or the "verification" ends up checking against whatever the implementer happened to pick.
Impact: This can produce an implementation that visually "looks fixed" and passes an implementer-authored test while still failing 3:1 non-text contrast against one of the app's several adjacent surfaces (`#ffffff`, `#f3f5f1`, `#17211b` keyframe/canvas background, `#245b3b` primary-button background, `#e7f0e9`/`#eaf3ec` secondary/active backgrounds) — a false-conformance outcome.
Required correction: The spec must name the exact outline colors (or a formula) and the exact list of backgrounds it must be checked against, and require a named unit test that computes and records the resulting ratios the same way the research disposition did for the current defect, not just a visual "looks discernible" check.

## Acceptance-criteria coverage gaps

- **AC1 (keyboard-only traversal):** unresolved due to B1 (no focus movement on failure/completion/retry) and B2 (no tested recovery from a cancelled file chooser).
- **AC2 (understandable focus/labels/headings/status/disabled explanations):** unresolved for two panels due to B4; at risk of double or missing announcements due to B3; dynamic `document.title` strings per view are never enumerated in the spec, so no test can assert them precisely (non-blocking, see below, but still a real gap against "headings... understandable").
- **AC3 (desktop/mobile layout, contrast, export readability):** blocked from being objectively testable by B6; the two containers in B4 aren't included in any named 320px/overflow assertion either, so their layout risk (long text inside an unlabeled group) is untested as well as unlabeled.
- **AC4 (automated smoke/unit coverage mapped to acceptance and future blockers):** the test plan has no named test for the terminal-state focus/announcement behavior in B1, no named test for the live-region mutual-exclusivity rule in B3, and no named test for the two containers in B4.
- **AC5 (manual-only risk documentation):** reasonably well specified in form, but doesn't yet require rows for the B2 cancel-path scenario (which may not be reliably automatable through Playwright's file-chooser API) or the B3 duplicate-announcement scenario — both should be explicit manual-QA rows if the automated fixes above land only partially.

## Adversarial cases

- **Focus capture/restoration:** what happens if the user is mid-edit on a phase-assignment `<select>` (unsaved native `<select>` open state) when a controller callback (e.g., a delayed "completed" event landing late) fires a full render — does the open native dropdown get torn out from under the user? Not addressed.
- **Stale/missing targets:** if a user is on `[data-review-phases]` when `resetPhaseReview` runs (e.g., picking a new video mid-review), the target the "previous key" would resolve to no longer exists in the next render — spec's fallback-to-current-view default needs to be concretely named per view (capture/processing/review/export), not just "visible enabled fallback," or this can't be unit-tested precisely.
- **Safe-key validation:** the registry entries for phase assignment/keyframe controls appear to need per-index parameterization (8 rows), which is different from a flat closed enum — the spec should say explicitly whether keys are validated as a fixed set or a bounds-checked pattern, and a test should assert an out-of-range index is rejected.
- **Announcements/live regions:** covered in B3; additionally, should failure use `aria-live="assertive"` rather than sharing the same `polite` announcer as routine transitions? The spec doesn't decide this, and it's the kind of thing that should be an explicit author decision, not implementer discretion.
- **AT semantics:** `role="img"` + `aria-describedby` on the keyframe canvas is a reasonable, standard technique — no objection there.
- **Keyboard order:** DOM-order reliance is fine given no positive tabindex is proposed; the video-file/camera gaps (B2, B5) are the actual keyboard-order risks.
- **Contrast/focus visibility, 44px targets, forced colors:** all correctly *named* as requirements, but B6 makes the contrast piece untestable as written; forced-colors handling should specifically be tested with a forced-colors emulation pass to confirm the custom two-color outline doesn't get silently stripped by the browser's forced-colors override.
- **320px reflow / zoom / text spacing / long text:** the plan is reasonable in scope but doesn't call out the two mislabeled panels from B4 as needing overlap/clipping checks specifically, even though they're prime long-text candidates (disclosure `<dd>` values, warning list items).
- **Error/failure states:** this is the core of B1 — untested and, worse, unspecified.
- **Review / canvas description / export-print:** the review and export renderer semantics look sound; print-surface behavior isn't touched by this story's scope and correctly isn't claimed to be.

## Safety/privacy/local-first/consent/remote-review/copy/selector/dependency/observability drift

None found. Consent copy, remote-review-unavailable copy, local-first/raw-media claims, persistence behavior, service-worker behavior, and protected test selectors (including `#video-file`'s ID, which stays stable even though its attributes change) all appear preserved. No new dependency, SDK, model asset, or observability surface is introduced by the spec as written. The accessibility-semantics gaps above (B2, B3, B4) are quality/correctness issues, not scope or compliance drift.

## Non-blocking recommendations (future work, not expanded acceptance criteria)

- Enumerate the exact `document.title` string per workflow view rather than leaving it to the "established pattern."
- Name the exact default fallback focus target per workflow view (e.g., the view's stage/phase/export heading) instead of "visible enabled fallback."
- State explicitly that focus-key resolution must use fixed-set/attribute comparison rather than string-interpolated selectors, even though current injection risk is low (all keys are internal).
- Decide and document `polite` vs `assertive` per announcement category rather than leaving all announcements on one politeness level.

## Result

**NOT CLEARED FOR IMPLEMENTATION.** Six blockers (B1–B6) must be incorporated into the specification and/or test plan and independently re-reviewed before the builder creates the SS-019 branch or touches runtime UI.
````````````````````````````````````````
<!-- END EXACT BLOCK: 37 Complete current file: docs/ss-019-claude-qa-raw-response.md -->

### 38 Complete focused diff: git diff -- CONTEXT.md

Lines: 235  
Bytes: 13758  
SHA-256: `9fc07f6b10c0b15d2817940f48fc0eee6c7ee66726e3fcb501bd29d8ae9f6d09`

<!-- BEGIN EXACT BLOCK: 38 Complete focused diff: git diff -- CONTEXT.md -->
````````````````````````````````````````text
diff --git a/CONTEXT.md b/CONTEXT.md
index 253ef3e..4eb20b6 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -12,23 +12,220 @@ Last updated: 2026-07-19
   `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`. Local `main` was
   fast-forwarded to `origin/main` by the PR #19 merge flow before this
   post-merge context update.
-- Latest post-merge guidance/context commit before SS-018 delivery:
-  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`. This change records the SS-018
-  post-merge context sync.
+- Latest post-merge guidance/context commit:
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`. This change records the SS-018
+  merge state and is the confirmed SS-019 specification baseline.
 - Current completed task:
   `SS-018 Refactor frontend app shell into maintainable UI/state modules`
-- Active task: none selected for implementation.
+- Active task:
+  `SS-019 Perform accessibility and responsive design hardening`.
 - Active branch: `main`
-- Active handshake: none.
+- Active handshake: `2. QA Planning (Claude)`.
 - Active Pull Request: none.
-- Next task candidate:
-  `SS-019 Perform accessibility and responsive design hardening`
-- Next task branch: `ss-019-accessibility-design-hardening`
-- Next task handshake: `0. Backlog`
-- Next task Pull Request: empty.
+- Planned story branch after Claude QA-planning clearance:
+  `ss-019-accessibility-design-hardening`.
+- Implementation status: blocked pending a self-contained Claude QA-planning
+  source packet and Claude PASS or focused blocker resolution and re-review.
 - Remaining visible non-Done backlog tasks: SS-019 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.
 
+## SS-019 Coordination
+
+SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
+privacy/safety-copy-sensitive, responsive-design-, smoke-test-selector-, and
+manual-QA-sensitive. It may harden DOM semantics, focus restoration, status
+announcements, responsive CSS, and test evidence while preserving local-first
+raw-media handling, consent, remote-review-disabled behavior, protected copy,
+labels, and selectors.
+
+Acceptance criteria from Notion:
+
+- Complete keyboard-only traversal for capture, consent, processing, review,
+  phase confirmation, and Swing Card export flows.
+- Verify visible focus states, labels, headings, status updates, and
+  disabled-control explanations are understandable.
+- Check desktop and mobile layouts for overlap, clipped text, unusable
+  controls, and export-panel readability.
+- Add automated smoke or unit coverage for the highest-risk accessibility and
+  responsive regressions where practical.
+- Document any remaining manual-only accessibility risks.
+
+Protected boundaries from Notion and the approved architecture:
+
+- Do not introduce decorative redesign that obscures the workflow.
+- Do not add runtime telemetry, remote logging, analytics, cloud diagnostics,
+  provider SDKs, model assets, or remote sharing.
+- Do not change safety, privacy, medical-scope, or non-affiliation claims
+  except through the sensitive-story review path.
+- Preserve local-first raw-media handling, explicit consent,
+  remote-review-disabled behavior, service-worker behavior, exported data
+  classes, protected labels, and smoke-test selectors.
+- No dependency, framework, bundle, license-policy, notice, or SBOM change is
+  expected.
+
+Kickoff/spec state on 2026-07-19:
+
+- `git fetch origin` completed successfully. Local `main`, refreshed
+  `origin/main`, and the live remote `refs/heads/main` were confirmed at
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`, which includes the SS-018 merge
+  commit `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`.
+- Worktree was clean before selection except for the nine intentional
+  untracked `docs/agent-guidance/*new-codex-session-prompt.md` files, which
+  remain preserved.
+- Notion page:
+  https://app.notion.com/p/392834a0c8a6814db2f6ea28ae195f75
+- Planned branch from confirmed `main` after QA-planning clearance:
+  `ss-019-accessibility-design-hardening`.
+- Pull Request: none.
+- Task Type: `Feature`.
+- Notion task fields were verified before selection: Name
+  `SS-019 Perform accessibility and responsive design hardening`, Branch
+  `ss-019-accessibility-design-hardening`, Handshake Status `0. Backlog`, Pull
+  Request empty, Task Type `Feature`, acceptance criteria, and protected
+  boundaries.
+- Notion moved to `1. Spec Drafting (Gemini)` for configured board
+  compatibility, with Codex recorded as the research/spec owner.
+- Existing `SS-TC-019` was inspected and belongs to SS-013 remote-model
+  adapter consent coverage; it is not reused for SS-019.
+- Dedicated test case `SS-TC-023` was created and related to SS-019:
+  https://app.notion.com/p/3a3834a0c8a6811ab10bfbf9a4651c8f
+- `SS-TC-023` covers keyboard traversal and focus order; accessible names,
+  headings, status semantics, and disabled explanations; desktop/mobile
+  reflow, long/error text, and export readability; named automated tests and
+  manual evidence; and protected no-telemetry/no-remote/no-dependency/no-claim-
+  drift boundaries.
+- Approved research/disposition note:
+  `docs/ss-019-research-disposition.md`.
+- Candidate preimplementation specification:
+  `docs/ss-019-preimplementation-spec.md`.
+- Self-contained Claude QA-planning prompt:
+  `docs/ss-019-claude-qa-planning-prompt.md`.
+- Complete Claude QA-planning source packet:
+  `docs/ss-019-claude-qa-planning-source-packet.md`.
+- The QA-planning handoff is ready as a required two-file paste: prompt first,
+  then source packet immediately after it. The packet manifest contains 33
+  complete current files plus the complete focused `git diff -- CONTEXT.md`,
+  with line counts, byte counts, and SHA-256 hashes. Mechanical verification
+  re-extracted every block and matched it byte-for-byte to the working file or
+  focused diff before status movement.
+- Current-main findings include nested main landmarks, full-render focus loss,
+  the visually hidden file input remaining in sequential focus, inconsistent
+  live/status semantics, insufficient `#d7972d` focus contrast (about 2.51:1
+  on white and 2.29:1 on `#f3f5f1`), low-contrast control boundaries,
+  long-text/reflow risks, and incomplete canvas description semantics.
+- Existing strengths to preserve include the real pose-fixture browser path,
+  protected selector/label assertions, desktop coverage, and the existing
+  390 CSS-pixel mobile checks.
+- Codex dispositions adopt a stable announcer outside `#app`, one main
+  landmark, a new typed `src/app-accessibility.ts` focus/announcement contract,
+  safe closed `data-focus-key` values, explicit/previous/fallback focus
+  restoration, dynamic workflow titles, intent-specific announcements,
+  renderer semantics and disabled descriptions, two-color focus styling,
+  required control-boundary contrast, scoped 44-pixel targets, 320-pixel
+  reflow, forced-color support, real-path automated tests, and a manual QA
+  artifact.
+- Revise broad recommendations to avoid blanket live regions, arbitrary CSS
+  focus selectors, positive tabindex, forced focus after every edit, global
+  target-size inflation, screenshot-only reflow claims, or automated-test-only
+  conformance conclusions.
+- Defer certification, unavailable assistive-technology combinations,
+  complete nonvisual equivalence for the annotated canvas, localization,
+  camera capture, remote review/sharing, providers/models, runtime diagnostics,
+  and decorative redesign.
+- Reject protected copy/selector drift, raw-media upload, remote/provider/model
+  enablement, persistence/service-worker/exported-data changes, telemetry,
+  remote logging, cloud diagnostics, new dependencies, or absolute
+  accessibility/privacy/safety/legal/compliance claims.
+- Observability decision: unchanged. SS-019 adds no telemetry, analytics,
+  remote logging, cloud diagnostics, hidden identifiers, persistent debug
+  artifacts, expanded console output, or runtime operator instrumentation.
+- Dependency decision: no dependency, framework, provider SDK, model asset,
+  bundle, license-policy, notice, or SBOM change is planned. Any scope change
+  requires renewed review and the additional `AGENTS.md` verification.
+- Required implementation-time manual evidence artifact:
+  `docs/ss-019-manual-accessibility-qa.md`. It must record commit/environment,
+  browser/OS/viewport/zoom/input/AT, expected/actual results, evidence,
+  defects, unavailable combinations, and residual risks without claiming
+  certification.
+- Notion moved to `2. QA Planning (Claude)` after the prompt and mechanically
+  verified source packet were persisted. Implementation and story branch
+  creation remain blocked.
+- Next owner: Claude as the independent QA-planning reviewer. Lead architect
+  must disposition any findings and obtain PASS or focused re-review clearance
+  before the builder is invoked.
+- Model/effort metadata exception: the original deep-researcher delegate
+  stalled and exposed no verifiable pinned model or reasoning-effort metadata.
+  The recovery research child also exposed no such metadata. No silent model
+  or effort substitution was selected by the coordinator; the availability
+  limitation is retained in the handoff.
+
+Claude QA-planning response on 2026-07-20:
+
+- Claude returned FAIL with B1-B6. Lead architect accepted all six as blockers;
+  response record: `docs/ss-019-claude-qa-response.md`.
+- B1: accepted. `src/app-accessibility.ts` must provide both post-render and
+  no-render intent application. Processing progress/output remains partial;
+  only processing state text is a scoped polite status. Each controller
+  callback captures its originating controller identity/token and checks it
+  before any state/output/DOM/focus/announcement mutation; stale callbacks
+  return immediately. Current-view completed/failed callbacks may no-render
+  focus the processing heading only when that token is still active. Stop and
+  close synchronously invalidate the active token before awaiting controller
+  cleanup while retaining a local controller reference for resource release,
+  so racing terminal callbacks are inert. Late/cancelled/closed callbacks do
+  not steal focus or duplicate announcements. Retry remains no-render and
+  preserves the controller-owned video node.
+- `closeActive()` ownership is exact: it performs cleanup/state reset only,
+  with no render, focus, or announcement. Workflow-navigation and picker-change
+  callers own the sole destination render; `beforeunload` performs cleanup with
+  no render. `stopActive()` alone owns the stopped/released render, global
+  announcement, and capture focus.
+- B2: accepted. `#video-file` uses `tabindex="-1"` and an accurate defensive
+  label but not `aria-hidden`; successful selection, native cancel, and browser
+  focus-return redirection all restore the visible picker through named
+  automated/manual cases.
+- B3: accepted. Every semantic event has exactly one polite announcement
+  channel. Global status owns full-render shell/workflow/phase/Swing events;
+  scoped live regions are limited to in-place processing state and imperative
+  overlay status. A complete callsite/channel inventory and duplicate-
+  announcement evidence are required.
+- B4: accepted. Capture, keyframe, assignment, and Swing Card summary
+  containers require named group/native semantics. Remote disclosure preserves
+  its native `<dl>` inside a named group wrapper.
+- B5: accepted. The revised spec enumerates every static key, permits only the
+  bounded workflow-step/phase-assignment/keyframe patterns, defines exact
+  per-view fallbacks, and inventories every events/lifecycle/Swing render and
+  no-render callsite including render-free close paths.
+- B6: accepted. Exact tokens are `--focus-inner: #ffffff`,
+  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`; exact ring
+  geometry, corrected surface ratios, >=3:1 threshold, CSS-reading unit tests,
+  computed-style smoke evidence, and forced-colors behavior are specified.
+- Claude's exact-title, exact-fallback, bounded-key, and polite-priority notes
+  are adopted as non-blocking precision within B1-B6, not expanded acceptance.
+- Exact runtime titles are `Swing Sync | Capture`,
+  `Swing Sync | Processing`, `Swing Sync | Review`, and
+  `Swing Sync | Export`.
+- No safety/privacy/non-affiliation claim, local-first/raw-media behavior,
+  remote/provider/model posture, dependency, data, service-worker,
+  observability, telemetry, logging, or cloud behavior changes.
+- Feedback-retention lessons: cross-cutting focus/live-region specs need a
+  complete callsite inventory and single-owner channel matrix; proxy file
+  controls need success/cancel/focus-return coverage; generic `aria-label`
+  needs a naming role or native structure; visual token fixes must quantify
+  exact tokens, surfaces, ratios, geometry, and executable thresholds.
+- Revised candidate spec: `docs/ss-019-preimplementation-spec.md`.
+- The original `docs/ss-019-claude-qa-planning-prompt.md` is superseded for
+  paste use; its original source packet remains unchanged as the exact
+  pre-review baseline record.
+- Focused re-review handoff paths:
+  `docs/ss-019-claude-qa-rereview-prompt.md` and
+  `docs/ss-019-claude-qa-rereview-source-packet.md`.
+- Status remains `2. QA Planning (Claude)`. Pull Request remains empty; active
+  branch remains `main`; implementation and story-branch creation remain
+  blocked.
+- Next owner: Claude focused B1-B6 re-review. Builder may start only after PASS
+  and explicit `CLEARED FOR IMPLEMENTATION`.
+
 ## SS-018 Coordination
 
 SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
````````````````````````````````````````
<!-- END EXACT BLOCK: 38 Complete focused diff: git diff -- CONTEXT.md -->

### 39 Complete focused diff: original-spec -> revised-spec

Lines: 489  
Bytes: 32045  
SHA-256: `3e448fb1008f0d68c0bc9270e4aad3c2c1a6c7267a01ea31fe1cf86deabd60a0`

<!-- BEGIN EXACT BLOCK: 39 Complete focused diff: original-spec -> revised-spec -->
````````````````````````````````````````text
--- pre-review/docs/ss-019-preimplementation-spec.md
+++ revised/docs/ss-019-preimplementation-spec.md
@@ -2,9 +2,10 @@
 
 Date: 2026-07-19
 
-Status: Candidate for Claude QA planning. Implementation is blocked until
-Claude returns PASS or all blocking findings are resolved and independently
-re-reviewed.
+Status: Revised after Claude QA-planning FAIL B1-B6. Candidate for focused
+Claude re-review. Implementation and branch creation remain blocked until
+Claude returns PASS and explicitly clears every blocker, or further findings
+are resolved and independently re-reviewed.
 
 Task: SS-019 Perform accessibility and responsive design hardening.
 
@@ -50,49 +51,70 @@
 - The announcer must remain outside the replace-on-render `#app` subtree.
 - Keep the CSP meta content, manifest link, description, viewport metadata, and
   static `<title>Swing Sync | New analysis</title>` text otherwise unchanged.
-  Runtime code updates the title after rendering each workflow view.
+  Runtime code updates it after render to exactly `Swing Sync | Capture`,
+  `Swing Sync | Processing`, `Swing Sync | Review`, or
+  `Swing Sync | Export` according to the active workflow view.
 
 ### New `src/app-accessibility.ts`
 
 Own the DOM-only accessibility coordination contract. It must not import or
 mutate app-state persistence.
 
-- Define a typed `RenderRequest` object used by `requestRender`. It may carry a
-  closed focus intent and an optional concise announcement; an absent request
-  means ordinary render with no announcement.
-- Define an internal safe focus-key union/registry for known targets such as the
-  consent acknowledgement, file-picker trigger, stage heading, phase-review
-  heading, Swing Card heading, current declaration/assignment/confirmation/
-  keyframe control, and Swing Card action/status targets.
-- Capture the prior active element only when it has a valid known
-  `data-focus-key` value. Do not accept or persist caller-provided CSS selectors.
-- Resolve elements by comparing `data-focus-key` attribute values against the
-  internal contract. Escape/selector injection must not be possible.
-- Restore focus in this order after the new DOM exists: valid explicit focus
-  target; valid previous focus key; visible enabled fallback target for the
-  current view. If no safe target exists, no-op without throwing.
-- A candidate is focusable only when connected, visible, not hidden,
-  not `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
-  Programmatic heading/status fallbacks may use `tabindex="-1"`; positive
-  `tabindex` is prohibited.
-- Update the stable `#app-announcer` using `textContent`. Do not inject HTML.
-  A concise announcement is written only for an explicitly requested workflow,
-  failure, completion, consent, or export transition.
-- Export pure or DOM-injected seams sufficient for unit tests of safe focus-key
-  validation, explicit/previous/fallback ordering, hidden/disabled target
-  rejection, no-target no-op, and announcer text updates.
+- Define typed `RenderRequest` and `AccessibilityIntent` contracts. A render
+  request may contain a closed focus intent and at most one global polite
+  announcement. An absent request means ordinary render with no announcement.
+- Own both post-render intent application and
+  `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
+  no-render path: it validates, focuses, or announces against the existing DOM
+  only and must not replace DOM, mutate app state, rebind events, redraw the
+  canvas, or touch controller-owned media.
+- The closed static focus keys are exactly: `safety-consent`,
+  `camera-placeholder`, `video-picker`, `analysis-start`, `stage-heading`,
+  `workflow-next`, `stop-analysis`, `retry-analysis`, `review-phases`,
+  `phase-declaration:view`, `phase-declaration:handedness`,
+  `phase-declaration:mirrored`, `phase-setup`, `phase-confirmation`,
+  `phase-confirm`, `open-export`, `phase-review-heading`,
+  `swing-card-heading`, `swing-card-download`, `swing-card-print`,
+  `swing-card-copy`, and `swing-card-status`.
+- The only dynamic keys are exactly
+  `workflow-step:<capture|processing|review|export>`,
+  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Validation must reject
+  arbitrary strings, selector syntax, unknown prefixes, and out-of-range or
+  non-integer indices.
+- Capture the prior active element only when its `data-focus-key` passes that
+  closed validator. Resolve known keys by comparing attribute values; never
+  accept or persist caller-provided CSS selectors.
+- Restore focus after render in this order: valid explicit target; valid prior
+  target; exact per-view fallback. Capture and processing fall back to
+  `stage-heading`; review falls back to `phase-review-heading` when phase
+  outputs exist and otherwise `stage-heading`; export falls back to
+  `swing-card-heading` when phase outputs exist and otherwise `stage-heading`.
+- A target is focusable only when connected, visible, not hidden, not
+  `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
+  Programmatic headings/status targets may use `tabindex="-1"`; positive
+  tabindex is prohibited.
+- Update the stable `#app-announcer` using `textContent` only. All current
+  announcements, including failures, use polite priority. Assertive is
+  deliberately rejected because none of these events requires interruption.
+- Export pure or DOM-injected seams sufficient for bounded-key, target-order,
+  target-eligibility, exact fallback, text-only announcer, and no-render intent
+  tests.
 
 ### `src/main.ts`
 
 - Replace `requestRender(statusMessage?: string)` with
-  `requestRender(request?: RenderRequest)`.
+  `requestRender(request?: RenderRequest)` and expose/inject
+  `applyAccessibilityIntent(intent: AccessibilityIntent)` alongside it.
+- `requestRender` is the only full-render accessibility path.
+  `applyAccessibilityIntent` delegates to the helper against the current root
+  and stable announcer and must never replace DOM.
 - Before replacing `#app.innerHTML`, capture the current valid focus key.
 - Render the current view, bind fresh events, and redraw the selected keyframe
   canvas using the existing ownership order.
-- Update `document.title` to the current workflow view using the established
-  `Swing Sync | …` product/title pattern. The title must distinguish the active
-  Capture, Processing, Review, and Export views without rewriting protected
-  body copy.
+- Set `document.title` exactly to `Swing Sync | Capture`,
+  `Swing Sync | Processing`, `Swing Sync | Review`, or
+  `Swing Sync | Export` for the active view without rewriting protected body
+  copy.
 - After render, binding, canvas redraw, and title update, restore focus using the
   request's explicit intent, then prior key, then safe current-view fallback.
 - Send any explicit request announcement to the stable announcer. Do not
@@ -101,33 +123,128 @@
   `securitypolicyviolation` listeners unchanged in behavior, and keep
   production service-worker registration unchanged.
 
-### Intent Mapping For `src/app-events.ts`, `src/analysis-lifecycle.ts`, And
-### `src/swing-card-actions.ts`
-
-Every state-changing render call must use the typed object contract. The
-following mapping is normative:
-
-| Event or transition | Focus after render | Announcement policy |
-| --- | --- | --- |
-| Consent acknowledgement/change | Consent control | Concise consent-ready or consent-required status only when state meaning changes |
-| Choose-video button / picker return / local video selection | Visible file-picker trigger | Concise local-selection or selection-failure status |
-| Begin, workflow-step navigation, stop, retry, or transition to review | Current stage heading | Concise loading, stopped, failed, retry-ready, or review-ready status; not routine progress ticks |
-| Declaration, phase assignment, confirmation choice, or keyframe selection | The same logical control | Announce only a new validation/failure state that is not already clear from focus/context |
-| Confirm phase review | Phase-review heading | Concise confirmation/completion or validation-failure status |
-| Open export | Swing Card heading | Concise export-opened status |
-| Busy Swing Card download/print/copy action | Local action status while busy, then return to the initiating action | Concise busy completion/failure result; no duplicate shell announcement |
-
-Additional rules:
-
-- Existing protected labels and selectors remain unchanged.
-- Analysis progress DOM updates continue through
-  `app-renderer.updateProcessingProgressUi(...)`; do not force full render,
-  refocus, or stable-announcer updates on every progress tick.
-- Lifecycle close/stop/failure and Swing Card success/failure paths must issue
-  the mapped render request without weakening existing resource-release or
-  local-only behavior.
-- Remote-review-unavailable interaction may update its local status, but it
-  must not imply configuration or sending is available.
+### Announcement-Channel Invariant
+
+Each semantic event uses exactly one announcement channel: global or scoped,
+never both.
+
+- The stable global announcer is canonical for full-render shell, workflow,
+  consent, camera, video, phase-review, and Swing Card events.
+- Visible `.status`, `.phase-warning`, `[data-swing-card-status]`, and static
+  `[data-remote-model-status]` keep their text/description functions but have
+  no `role="status"`, `aria-live`, or other live-region role.
+- Scoped live regions exist only for the in-place processing state text and the
+  imperative overlay status. An event using either scoped channel passes no
+  global announcement.
+- All channels are polite. Assertive is rejected to avoid interrupting the
+  current task.
+- A named unit inventory test, `uses exactly one announcement channel for every
+  mapped event`, must fail if a mapped callsite has both channels or no declared
+  channel.
+
+### Complete Focus And Announcement Callsite Matrix
+
+Every current or approved `requestRender` and no-render accessibility callsite
+in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` is
+normative below. There may be no additional unmapped callsite or intent.
+
+| Owner / event | Render path | Focus target | Sole announcement channel |
+| --- | --- | --- | --- |
+| Events: consent change | Full render | `safety-consent` | Global consent-ready/required message when meaning changes |
+| Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
+| Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
+| Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
+| Events: workflow step button | `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
+| Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
+| Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
+| Events: picker `change` with a file | `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
+| Events: picker `cancel` | No render | `video-picker` | None |
+| Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
+| Events: camera placeholder | Full render | `camera-placeholder` | Global camera-out-of-scope message |
+| Events/lifecycle: Stop local analysis | Full render owned by `stopActive` | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
+| Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
+| Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
+| Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
+| Events: handedness declaration | Full render | `phase-declaration:handedness` | None unless a new validation result requires one global message |
+| Events: mirrored declaration | Full render | `phase-declaration:mirrored` | None unless a new validation result requires one global message |
+| Events: setup declaration | Full render | `phase-setup` | None unless a new validation result requires one global message |
+| Events: phase assignment | Full render | Exact bounded `phase-assignment:<0..7>` | None unless a new validation result requires one global message |
+| Events: confirmation checkbox | Full render | `phase-confirmation` | None unless a new validation result requires one global message |
+| Events: Confirm phase review | Full render | `phase-review-heading` | Global confirmation or validation-failure message |
+| Events: Open Swing Card export | Full render | `swing-card-heading` | Global export-opened message |
+| Events: keyframe selection | Full render and overlay redraw | Exact bounded `keyframe:<0..7>` | Scoped imperative overlay status only; no global message |
+| Lifecycle: loading/processing state callback | Partial DOM update | No change | Scoped processing state only |
+| Lifecycle: progress callback | Partial DOM update | No change | None when only numeric progress changes |
+| Lifecycle: output callback | Partial DOM update | No change | None |
+| Lifecycle: current-controller completed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
+| Lifecycle: current-controller failed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
+| Lifecycle: late/stale terminal callback or terminal callback outside processing view | Partial/no-op against current DOM | No change | None; no visible scoped target means no announcement |
+| Lifecycle: cancelled/closed callback | Partial/no-op | No change | None; `stopActive` owns stopped status, while close and callback are silent |
+| Lifecycle: `closeActive()` from workflow navigation | Cleanup and state reset only; no render | No change | None; navigation caller owns one destination render/message |
+| Lifecycle: `closeActive()` from picker change | Cleanup and state reset only; no render | No change | None; picker caller owns one selection render/message |
+| Lifecycle: `closeActive()` from `beforeunload` | Cleanup and state reset only; no render | No change | None |
+| Swing download start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
+| Swing download completion/failure | Full render | `swing-card-download` | Global result message |
+| Swing print start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
+| Swing print completion/failure | Full render | `swing-card-print` | Global result message |
+| Swing copy start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
+| Swing copy completion/failure | Full render | `swing-card-copy` | Global result message |
+
+The inventory test must cover both runtime guard failures; consent; begin;
+workflow and next-step controls; picker success/cancel/redirect; camera;
+stop/retry; review; all declaration/setup/assignment/confirmation/confirm
+paths; export; keyframe; every lifecycle callback; render-free `closeActive()`
+for navigation, picker replacement, and `beforeunload`; and download/print/copy
+start, completion, and failure. Delayed terminal callbacks and same-control
+focus tests must prove an open phase select cannot lose focus to stale
+processing.
+
+### Analysis-Lifecycle Partial/Terminal Contract
+
+- `updateProcessingProgressUi(root, state)` remains a partial renderer and may
+  change only safe text and `hidden` properties. The processing **state text**
+  element alone has `role="status" aria-live="polite" aria-atomic="true"`.
+  Numeric `[data-pose-summary]` remains outside that live region so progress
+  ticks are not announced.
+- Loading, processing, progress, and output callbacks call the partial update
+  only. They never call the global announcer and never move focus.
+- Each controller's callback closures capture that originating controller's
+  identity or an equivalent unique token. Every callback checks that token
+  before any state, output, DOM, focus, or announcement mutation; a stale token
+  returns immediately without changing anything. Completed/failed callbacks
+  with a current token update state/output and current processing DOM, making
+  the scoped processing state the sole announcement. They then call the
+  no-render accessibility intent to focus `stage-heading` only when
+  `state.activeStep === "processing"` and the captured controller/token still
+  equals the active controller/token.
+- A late/stale terminal callback, or any terminal callback after navigation
+  away from processing, must not steal focus or announce.
+- `stopActive()` synchronously invalidates the active callback token before it
+  awaits `cancel()`, while retaining a local controller reference for resource
+  release. It then owns the stopped/released full render, announcement, and
+  capture-view focus. A terminal callback racing the await sees a stale token
+  and returns before mutation; cancelled callbacks do not duplicate the owner.
+- `closeActive()` performs controller cleanup, handle clearing, phase/
+  processing state reset, and nothing else: no render, focus, or announcement.
+  It synchronously invalidates the active callback token before awaiting
+  `close()`, while retaining a local controller reference for resource release.
+  A racing callback is therefore stale before any mutation. Workflow-navigation
+  and picker-change callers each own their single destination render/focus/
+  announcement after cleanup. `beforeunload` calls cleanup with no render.
+  Closed callbacks remain silent.
+- `retryActive` applies no-render focus to `stage-heading` once and relies on
+  the subsequent scoped loading/failed/completed state. It must not full-render
+  or replace the controller-owned `#analysis-video` node.
+- Existing protected labels/selectors, local resource release, and
+  remote-review-unavailable behavior remain unchanged.
+
+### Adopted Claude Precision Notes (Non-Blocking)
+
+The exact four document titles, exact per-view fallback targets, bounded
+dynamic focus-key grammar, and polite-only announcement priority are adopted as
+precision within B1-B6 remediation. They make the existing keyboard, focus,
+status, and test contracts implementation-ready; they do not expand SS-019
+acceptance criteria or product scope.
 
 ### Renderer Semantics
 
@@ -137,21 +254,31 @@
 
 - Add stable `data-focus-key` attributes to every mapped focus target.
 - Keep one renderer-owned `<main class="workspace">` landmark.
-- Keep the visible `Choose a video` button as the keyboard trigger. Add
-  `tabindex="-1"` and `aria-hidden="true"` to `#video-file` so it is not a
-  duplicate sequential tab stop.
-- Give capture-option, keyframe-selection, and phase-assignment generic
-  labelled containers `role="group"` or equivalent native group semantics.
-  Do not add redundant roles where a native element already supplies the
-  required semantics.
+- Keep the visible `Choose a video` button as the keyboard trigger and give it
+  `data-focus-key="video-picker"`. Give `#video-file` `tabindex="-1"` and the
+  accurate defensive accessible label `Choose a local video file`; do **not**
+  set `aria-hidden="true"`.
+- Add picker `cancel` handling that no-render focuses the current visible
+  picker. Add `focus` and/or `focusin` redirection from the file input to the
+  visible picker for browsers that return focus to the input after chooser
+  close. Successful `change` always full-renders with explicit picker focus.
+- `.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, and
+  `.swing-card-summary` use `role="group"` with their retained accessible name,
+  or an equivalently named native structure.
+- Preserve the native `<dl class="remote-model-disclosure">` role and protected
+  class selector. Wrap it in a named `role="group"` container for
+  `Remote model data disclosure`; never override the `<dl>` role.
 - Render each phase's visible label as a real `<h3>` while preserving its text
   and association with its assignment control.
 - Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
   relationship to a stable overlay-status element. Preserve the existing
   protected canvas label text.
-- Give processing, overlay, and Swing Card export status elements stable IDs,
-  appropriate scoped `role="status"`, and `aria-atomic="true"` where the whole
-  message must be announced. Avoid nested, duplicate, or blanket live regions.
+- Give only the processing state text and imperative overlay status stable IDs,
+  scoped polite status semantics, and `aria-atomic="true"`. Keep numeric
+  `[data-pose-summary]` outside the processing live region.
+- Remove live-region roles/attributes from visible `.status`, `.phase-warning`,
+  `[data-swing-card-status]`, and static `[data-remote-model-status]`. They
+  remain visible text and valid `aria-describedby` targets.
 - Do not add live-region semantics to static explanatory paragraphs.
 - Keep dynamic status text on `textContent`/escaped paths.
 
@@ -177,13 +304,33 @@
 
 ### `src/styles.css`
 
-- Replace the insufficient single-color focus outline with a two-color focus
-  indicator that remains discernible against light and dark adjacent surfaces.
-  Cover `:focus-visible` for links, buttons, inputs, selects, and
-  programmatically focused headings/status targets without hiding browser
-  forced-color focus cues.
-- Use interactive boundary colors with at least 3:1 contrast against adjacent
-  colors wherever the boundary is necessary to identify the control.
+- Define exact custom properties `--focus-inner: #ffffff`,
+  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`.
+- The two-color `:focus-visible` geometry is exactly a 2 CSS-pixel white inner
+  outline with 2-pixel offset plus a dark outer ring that leaves at least 2 CSS
+  pixels visible beyond the inner ring; a 6-pixel outer spread is an approved
+  implementation. Cover links, buttons, inputs, selects, and programmatically
+  focused headings/status targets.
+- Forced-colors mode must retain UA/system focus and semantic boundaries.
+  `forced-color-adjust: none` is prohibited.
+- Required computed contrast ratios are:
+
+| Token pair | Required ratio |
+| --- | ---: |
+| `#17211b` vs `#ffffff` | 16.54:1 |
+| `#17211b` vs `#f3f5f1` | 15.07:1 |
+| `#17211b` vs `#f8faf7` | 15.76:1 |
+| `#17211b` vs `#e7f0e9` | 14.21:1 |
+| `#17211b` vs `#eaf3ec` | 14.59:1 |
+| `#ffffff` vs `#17211b` | 16.54:1 |
+| `#ffffff` vs `#245b3b` | 7.97:1 |
+| `#607367` vs `#ffffff` | 5.07:1 |
+| `#607367` vs `#f3f5f1` | 4.62:1 |
+| `#607367` vs `#f8faf7` | 4.83:1 |
+| `#607367` vs `#e7f0e9` | 4.35:1 |
+| `#607367` vs `#eaf3ec` | 4.47:1 |
+
+Every enumerated focus/interactive-boundary pair must remain at least 3:1.
 - Give scoped interactive controls a 44-by-44 CSS-pixel minimum target where
   practical. Do not inflate passive content or apply a global layout minimum.
 - Ensure programmatically focused stage/phase/export headings are visibly
@@ -223,6 +370,23 @@
 - programmatic `tabindex="-1"` target focus with no positive tabindex;
 - stable announcer update through `textContent`, including no update when the
   render request has no announcement.
+- `applyAccessibilityIntent` operating without DOM replacement and sharing the
+  same bounded-key/target validation as post-render intent application;
+- exact bounded dynamic-key rejection and exact per-view fallbacks;
+- file-picker cancel and hidden-input focus redirection to `video-picker`;
+- every current mapped callsite using exactly one declared announcement
+  channel.
+
+Picker coverage must use the exact named tests
+`returns focus to the picker after successful keyboard-opened selection`,
+`returns focus to the picker on native chooser cancel without rendering`, and
+`redirects hidden file input focus to the picker without positive tabindex`.
+
+### New `test/unit/accessibility-contrast.test.ts`
+
+Add a named unit suite that reads the exact CSS custom properties, asserts the
+three required token values, computes the ratio matrix for every enumerated
+surface, and fails below 3:1 or when a token/surface mapping changes.
 
 ### Renderer And Event Unit Tests
 
@@ -231,17 +395,32 @@
 - exactly one main landmark across the static host and rendered shell;
 - protected labels/selectors remain present;
 - `#video-file` retains its selector/accept behavior but has
-  `tabindex="-1"` and `aria-hidden="true"`;
+  `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
 - stage, phase-review, Swing Card, same-control, and action-status focus keys;
-- group, heading, canvas `role="img"`, `aria-describedby`, stable status IDs,
-  scoped `role="status"`, and `aria-atomic` semantics;
+- exact named group/native semantics for capture, keyframes, phase assignments,
+  `Swing Card contents`, and the wrapper around native remote disclosure;
+- heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
+  IDs, scoped status semantics, and removed live roles from global-owner text;
 - exact disabled-control `aria-describedby` targets and visible dynamic
   prerequisite text for Begin analysis, review/confirm, export, remote review,
   and busy Swing Card actions;
-- every event/lifecycle/export path in the normative focus table issues the
-  exact typed focus/announcement request;
+- every event/lifecycle/export path in the complete callsite table issues the
+  exact typed focus/announcement request and has no unmapped callsite;
 - render/rebind behavior remains single-effect and progress ticks do not
   refocus or announce every tick.
+- named lifecycle tests exactly:
+  - `keeps progress ticks partial without global announcements or focus changes`;
+  - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
+  - `does not steal focus for late terminal callbacks outside the processing view`;
+  - `keeps stopped announcement owned by stop and close cleanup silent until the caller destination render`;
+  - `retries without replacing the video DOM and moves focus once`.
+- Additional named lifecycle/callsite tests:
+  - `keeps closeActive cleanup render-free for navigation picker replacement and beforeunload`;
+  - `lets navigation and picker callers own exactly one destination render`;
+  - `binds terminal callback focus to the originating active controller token`;
+  - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
+- named renderer/smoke role/name assertions for `Swing Card contents` and
+  `Remote model data disclosure`.
 
 ### Browser Smoke Tests In `test/smoke/app.spec.ts`
 
@@ -253,13 +432,16 @@
   keyboard, then inject the approved pose fixture through the test harness so
   the risky analysis path remains real without relying on a machine-specific
   chooser UI;
+- cover successful keyboard-opened selection, a synthetic native `cancel`
+  event returning focus, and defensive file-input focus redirection;
 - verify focus continuity across consent, selection, begin, processing
   completion, review, same-control edits, confirmation, export, and local Swing
   Card actions after full rerenders;
 - assert one main landmark, meaningful heading order, dynamic document titles,
   scoped status semantics, and no duplicate blanket live regions;
 - verify representative focus visibility and approved focus/control contrast
-  tokens in rendered light and dark-adjacent states;
+  tokens in rendered light and dark-adjacent states, the applied two-layer
+  indicator geometry, and forced-colors emulation;
 - assert scoped interactive targets are at least 44 CSS pixels in each required
   dimension, allowing only spec-reviewed exceptions;
 - at desktop and 320 CSS-pixel viewports, exercise long status/error text,
@@ -269,6 +451,11 @@
 - preserve the existing 390-pixel mobile coverage, protected selectors/labels,
   external-network guard, no-sensitive-console-output checks, and real
   pose-fixture output assertions.
+- assert exactly one announcement owner for consent, processing terminal,
+  phase validation/confirmation, and each Swing action without claiming that
+  Playwright substitutes for manual screen-reader evidence;
+- include named group assertions and 320-pixel/long-text geometry for
+  `Swing Card contents` and `Remote model data disclosure`.
 
 Geometry checks must identify the relevant elements and required relationships;
 a screenshot alone or an empty-state-only page-width assertion is insufficient.
@@ -305,9 +492,16 @@
   unavailable combination explicitly and do not claim it passed;
 - consent, processing progress/failure/completion, phase-review validation,
   confirmation, and export announcements without over-announcement;
+- actual native chooser cancel and focus return in every tested browser/AT
+  environment;
+- duplicate-announcement checks for consent, terminal completion/failure,
+  phase validation/confirmation, and Swing actions;
+- named-group checks for `Swing Card contents` and
+  `Remote model data disclosure`;
 - 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
 - WCAG text-spacing overrides;
 - forced-colors/high-contrast behavior where the environment supports it;
+- every exact focus/boundary token surface from the required ratio matrix;
 - long consent/status/error/prerequisite text;
 - representative actual mobile-device interaction where available;
 - annotated-canvas name/description and the residual nonvisual-equivalence
@@ -363,7 +557,7 @@
 Targeted tests, adjusted to the exact implemented files:
 
 ```sh
-/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
+/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility accessibility-contrast app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
 ```
 
 Required smoke command:
@@ -406,8 +600,10 @@
 Protected boundaries, Relevant source contents or focused diff, Verification,
 Known non-goals, and Output required.
 
-The source packet must contain exact relevant file contents or a complete
-focused diff for every file Claude must evaluate. It must not merely instruct
-the user to paste source later. Claude must return PASS, or blocking findings
-must be incorporated into this specification/tests and independently
+Claude's first QA-planning review returned FAIL with B1-B6. The source packet
+for focused re-review must contain the prior response, this revised complete
+specification, the exact diff from the pre-review specification extracted from
+the original mechanically verified packet, relevant current baseline sources
+and tests, and the focused `CONTEXT.md` diff. Claude must return PASS and
+explicitly clear B1-B6, or new blockers must be incorporated and independently
 re-reviewed, before the builder creates the story branch or changes runtime UI.
````````````````````````````````````````
<!-- END EXACT BLOCK: 39 Complete focused diff: original-spec -> revised-spec -->

### 40 Explicit absent record: src/app-accessibility.ts

Lines: 1  
Bytes: 172  
SHA-256: `2704eb810adad2231e7ffd71ff3e91b17d7e173b51d49c1c9fdb11648f65da9e`

<!-- BEGIN EXACT BLOCK: 40 Explicit absent record: src/app-accessibility.ts -->
````````````````````````````````````````text
ABSENT ON PURPOSE: src/app-accessibility.ts does not exist on main. It is a planned SS-019 implementation file and must not be created before Claude QA-planning clearance.
````````````````````````````````````````
<!-- END EXACT BLOCK: 40 Explicit absent record: src/app-accessibility.ts -->


