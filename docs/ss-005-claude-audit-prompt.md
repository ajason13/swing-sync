# SS-005 Claude Final Audit Prompt

Paste this prompt into Claude Chat for the adversarial final implementation
audit. Claude Chat has no filesystem or GitHub access; use only this embedded
context.

## Prompt

Role: You are the lead adversarial implementation auditor for Swing Sync
SS-005.

Stage: Final implementation audit before pull request creation.

Return:

- PASS or FAIL;
- blocking findings ordered by severity;
- non-blocking recommendations clearly separated;
- missing tests or boundary cases;
- whether SS-005 acceptance criteria and `SS-TC-009` are satisfied;
- whether licensing/model/fixture/network/privacy evidence is adequate; and
- explicit permission or prohibition to prepare the pull request.

Attack assumptions, identify fail-open behavior, and look for privacy,
licensing, worker lifecycle, network, timestamp, resource-cleanup, CSP,
mobile/browser, and test-contract defects. Do not expand scope into swing-phase
detection, metrics, coaching, exports, or remote review.

## Story And Scope

Story: `SS-005 Integrate MediaPipe Pose Landmarker in browser video mode`

Branch: `ss-005-mediapipe-pose`

Current tracker status: `4. Final Audit (Claude)`

Acceptance criteria:

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

Protected boundaries:

- Raw video and decoded frames remain volatile and local.
- Derived landmarks are sensitive user data.
- No remote model API, telemetry, remote logging, cloud storage, or remote
  sharing.
- Preserve the first-analysis safety acknowledgement and fail-closed behavior.
- Do not persist raw video, decoded frames, or landmarks.
- Service-worker model caching remains unapproved and is not implemented.

## Approved Provider, SDK, Model, And Fixture

- Exact production dependency: `@mediapipe/tasks-vision@0.10.35`.
- Exact model: Pose Landmarker Full float16 version 1.
- Model source:
  `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`
- Model SHA-256:
  `5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1`
- Model and WASM are vendored and served same-origin.
- Runtime provider model fetch is prohibited.
- Public Google evidence:
  `https://github.com/google-ai-edge/mediapipe/issues/6306#issuecomment-4673728357`
- Maintainer compliance approval and third focused Claude implementation-start
  PASS were recorded before dependency/model/runtime work began.

The exact npm package lacks packaged LICENSE/NOTICE files. Implementation adds
`docs/third-party-notices/mediapipe.md`, and the production notice aggregator
includes it in `dist/THIRD_PARTY_NOTICES.txt`. It records exact SDK/model,
Apache-2.0, source URLs, provider evidence, and the maintainer decision.

`scripts/verify-pose-assets.js` fails on any model/WASM absence or hash change.
`scripts/verify-compliance.js` requires the exact manual MediaPipe notice and
exact `@mediapipe/tasks-vision@0.10.35` SBOM component.

Approved fixture:

- `test/fixtures/pose-landmarker/mannequin-golf-address.webm`
- deterministic VP9 640 x 360, 10 fps, 2 seconds, no audio;
- derived with documented FFmpeg 8.1.1 command from committed AI-generated,
  faceless wooden-mannequin source;
- no real person or known biometric/personal data;
- fixture SHA-256:
  `e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390`;
- exact-model empirical validation returned one pose with 33 normalized and 33
  world landmarks at 0, 500, 1000, and 1500 ms; and
- OpenAI Terms of Use effective 2026-01-01 and Service Terms updated
  2026-06-02 were reviewed and recorded in `PROVENANCE.md`. The project
  compliance decision is not presented as legal advice or exclusive-rights
  guarantee.

## Implementation

### Worker Protocol And Result Contract

`src/pose-contract.ts` defines:

- fixed configured detection, presence, and tracking thresholds of `0.5`;
- normalized/world landmark output with returned `x`, `y`, `z`, and
  `visibility`;
- no invented per-landmark `presence`;
- result wrapper containing the exact input `timestampMs`;
- worker requests: `init`, transferable `frame`, `teardown`; and
- responses: `ready`, `result`, `frame-dropped`, `init-error`,
  `inference-error`, `torn-down`.

It accepts only finite, non-negative, strictly monotonically increasing
timestamps and copies complete detector arrays without filtering or rounding.

`src/pose-landmarker.worker.ts`:

- loads same-origin WASM with the module loader and same-origin model path;
- creates exact Pose Landmarker in `VIDEO` mode with one pose and no
  segmentation mask;
- runs synchronous `detectForVideo()` only inside the dedicated worker;
- validates timestamps before inference;
- closes every owned `ImageBitmap` in `finally`;
- emits sanitized stable error codes without frame/landmark/media details;
- closes the task and worker on teardown;
- handles teardown during asynchronous initialization without later emitting
  ready; and
- fails closed on worker CSP violations.

`src/pose-session.ts`:

- owns worker lifecycle on the main thread;
- allows one in-flight frame;
- closes and drops newly submitted frames while busy;
- terminates and enters error on worker crash, message error, init/inference
  error, or application-detected unexpected network activity; and
- terminates after worker teardown acknowledgement.

### User Flow And Privacy

`src/main.ts`:

- keeps the existing local safety acknowledgement gate;
- requires both acknowledgement and a selected local video before analysis;
- creates one local object URL and revokes it on replacement, stop, or unload;
- samples up to four monotonically ordered media-timeline timestamps;
- uses `createImageBitmap(video)` and transfers the frame to the worker;
- retains only counts in UI state, not landmark arrays or raw frames;
- exposes a stop control while model loading/inference is active;
- clears the video source and releases resources on stop/failure;
- handles document CSP violations by visibly failing the active pose session
  closed with sanitized code `UNEXPECTED_NETWORK_BLOCKED`; and
- logs no frames, landmarks, media characteristics, or user identifiers.

`index.html` adds production CSP:

`default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self'
blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self'
blob:; style-src 'self'; object-src 'none'; base-uri 'self'`

`public/sw.js` remains registration-only and does not cache model/WASM/video.

## Tests

Unit tests:

- valid/invalid/non-monotonic timestamp validation;
- complete returned coordinates/visibility and no invented presence;
- detector result copying;
- session initialize/ready/process/result/teardown lifecycle;
- one-frame backpressure and bitmap close;
- initialization error fail-closed behavior; and
- immediate unexpected-network abort.

Production-preview Playwright tests run on desktop Chromium and Pixel 5 mobile
Chromium:

- consent and selected-video gates;
- unavailable consent-storage fail-closed paths;
- runtime consent guard;
- workflow states and mobile overflow;
- real exact-model fixture inference with 33 landmarks and four processed
  frames;
- all observed requests limited to same-origin or required local `blob:` media;
- no requests after fixture extraction reaches its ready checkpoint;
- no landmark/media-characteristic console output;
- no IndexedDB or Cache API persistence;
- useful local model-initialization failure;
- UI stop interaction succeeds while model loading is artificially delayed;
- CSP-blocked external request visibly terminates the session fail closed; and
- object URL create/revoke parity.

The Playwright suite runs against `vite build` plus `vite preview`, not the dev
server, so production CSP and static asset paths are exercised.

## Verification Results

All passed on Node 22:

- `npm run test:unit` -> 9 passed.
- `npm run test:smoke` -> 22 passed across desktop and mobile Chromium.
- `npm run build` -> passed; dedicated worker bundle emitted.
- `npm run compliance:verify` -> passed.
- `npm run safety:verify` -> passed.
- `npm run privacy:verify` -> passed.
- `npm run license:audit` -> passed.
- `npm run verify:bundle-license-fixture` -> passed.
- `npm run pose-assets:verify` -> passed.
- `npm run sbom:generate` -> passed; exactly one production component,
  `@mediapipe/tasks-vision@0.10.35`.
- `git diff --check` -> passed.
- `npm audit --omit=dev --json` -> zero production vulnerabilities.

Production `dist/THIRD_PARTY_NOTICES.txt` contains the manual MediaPipe notice,
exact SDK/model, Apache-2.0 statement, source URLs, and provider evidence.

## Known Limits And Deferred Work

- Tests demonstrate controlled observed network behavior; they do not claim
  that future or intermittent provider behavior is impossible.
- Service-worker model caching is unapproved and intentionally absent.
- A non-gating inference benchmark and sustained WASM heap characterization are
  deferred.
- The UI samples four frames; continuous video processing and swing-phase
  analysis are outside SS-005.
- Browser coverage is Chromium desktop/mobile in this story; broader browser
  compatibility remains future work unless you identify it as a blocker.
- Observability is intentionally limited to local UI state and sanitized stable
  error codes. No telemetry or sensitive diagnostics were added.

End with an explicit PASS or FAIL and whether Codex may prepare the pull
request.
