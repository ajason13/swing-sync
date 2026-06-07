# SS-005 Research Disposition

Status: **Gemini response and Claude QA planning reviewed on 2026-06-07.
Claude returned FAIL. Implementation remains blocked on provider metrics,
compiled-binary obligations, model rights, and fixture approval.**

Gemini recommended a conditional GO using `@mediapipe/tasks-vision@0.10.35`,
the Pose Landmarker Full float16 version 1 bundle, local WASM/model assets, a
worker, CSP restrictions, a synthetic mannequin fixture, and Playwright network
assertions. Gemini research is input, not implementation or licensing
authority.

## Primary-Source And Artifact Checks

- The official Web guide identifies `@mediapipe/tasks-vision`, supports project
  local model paths or model buffers, documents VIDEO mode and millisecond
  timestamps, and states `detect()` and `detectForVideo()` synchronously block
  the calling thread and should run in a worker:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- The official overview documents 33 normalized and world landmarks and lists
  lite, full, and heavy float16 versioned bundles. It does not establish that
  Full is required for golf, that Lite is insufficient, or that Heavy lacks
  meaningful benefit:
  https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker
- Current MediaPipe API terms, last modified April 7, 2026, state that input
  processing happens on-device, but Solution APIs contact Google servers from
  time to time and send performance, utilization, app/input metadata, and
  system-environment metrics. The terms assign informed-consent responsibility
  to the app developer:
  https://developers.google.com/edge/mediapipe/legal/tos
- npm registry metadata for `@mediapipe/tasks-vision@0.10.35` reports
  Apache-2.0, no declared dependencies, tarball integrity
  `sha512-HOvadwVRE6JC+45nyYhmnywnr5h/J8KZvOeUNVOG9q/0875pZgItznFB9bRTvLc264YSJqiZ1NsIpCStJw/egg==`,
  and tarball SHA-256
  `84597a25e13d123b5f4cbe768bb72e97a2c28c7a465f0ace287d8cbe5246bff0`.
- The inspected 0.10.35 tarball contains three JavaScript/WASM runtime pairs,
  not Gemini's claimed internal/SIMD pair:
  `vision_wasm_internal`, `vision_wasm_module_internal`, and
  `vision_wasm_nosimd_internal`.
- The inspected tarball does not contain a LICENSE or NOTICE file. Package
  metadata alone is insufficient to resolve all compiled-binary and notice
  obligations.
- Strings in all three inspected WASM binaries include Google operational
  metrics identifiers. This supports treating metrics/network behavior as a
  real risk, but does not prove the destination, timing, payload, or whether
  local paths or CSP fully suppress it.
- No primary source reviewed by Codex grants explicit redistribution,
  vendoring, repository-commit, or caching rights for
  `pose_landmarker_full.task`. Model rights remain unresolved.

## Adopt

- Pin any approved production SDK/model/runtime assets exactly; do not use
  `latest`, caret, or tilde ranges.
- Keep all approved WASM and model loading same-origin. Tests must fail on any
  unexpected external request during initialization and inference.
- Run MediaPipe initialization and synchronous video-mode inference outside the
  UI thread. Define a bounded worker message contract, cancellation, teardown,
  failure states, and backpressure that prevents an unbounded frame queue.
- Use monotonically increasing millisecond timestamps derived from the
  pre-recorded video's media timeline. Reject or fail clearly on invalid or
  non-monotonic timestamps.
- Transfer `ImageBitmap` inputs where supported and close each bitmap in every
  success, failure, cancellation, and worker-termination path.
- Retain the complete 33-landmark normalized and world result arrays, including
  each returned `x`, `y`, `z`, and `visibility` value. Exact candidate
  declarations do not expose per-landmark `presence`; treat presence,
  detection, and tracking thresholds separately from returned metadata.
- Keep raw video references, decoded frames, and image buffers volatile and
  local. Revoke object URLs and close the task/worker resources.
- Use `SS-TC-001` as complementary local extraction/no-upload coverage and
  dedicated `SS-TC-009` for SS-005-specific loading, metadata, timestamps,
  cleanup, responsiveness, and network assertions.
- Keep diagnostics local and data-minimized. Useful states include loading,
  ready, processing, cancelled, and sanitized error category; do not log raw
  frames, landmarks, media characteristics, or user identifiers.

## Revise Before Adoption

- Treat `@mediapipe/tasks-vision@0.10.35` as the pinned candidate, not an
  approved dependency. Approval requires resolution of current provider metrics
  terms, compiled-binary rights/notices, and demonstrated network behavior.
- Treat Pose Landmarker Full float16 version 1 as a candidate only. Model
  variant selection requires measured fixture/browser evidence; the Full model
  is not justified solely by Gemini's golf-accuracy assertion.
- Use CSP as defense in depth after implementation-specific browser testing.
  Do not claim CSP disables all SDK telemetry or makes privacy complete. Do not
  add `'unsafe-eval'`, `blob:`, or broad worker/connect permissions without
  proving each is required and scoped.
- Prove "network activity is not required after model assets are available" by
  first loading only approved same-origin assets, then blocking external
  requests and demonstrating successful initialization and fixture inference.
  Also record attempted blocked requests. A single passing run cannot disprove
  the terms' "from time to time" behavior.
- Prefer a generated, non-identifying fixture, but approve it only after the
  generation tool/source, license, provenance, reproducibility, and expected
  landmark behavior are documented. The proposed
  `fixture_swing_silhouette.webm` does not yet exist and is not approved.
- Measure UI responsiveness with deterministic heartbeat/input-latency checks.
  Do not require or promise 60 FPS, sub-100 ms latency, fixed 45 ms thresholds,
  or stable memory values without an approved benchmark contract.
- Treat service-worker caching as a separate design decision. Same-origin asset
  availability can satisfy SS-005 without claiming complete offline PWA
  capability.

## Defer

- Swing-phase detection, biomechanical accuracy, joint-angle/ground-reaction
  interpretation, metrics, coaching, overlays, exports, and remote review.
- Selecting or filtering to 12 "essential" joints. Downstream stories may
  derive subsets from the retained 33-landmark contract.
- Discarding landmarks based on hard-coded presence/visibility thresholds.
  Preserve raw returned metadata so later consumers can make explicit decisions.
- Segmentation masks, WebGL/GPU delegate policy, thermal-adaptation thresholds,
  long-term landmark persistence, and broad fixture dataset policy.
- A new privacy-consent screen. Preserve the existing first-analysis safety
  acknowledgement; any separate consent required by Google's metrics terms is a
  blocking product/privacy decision, not an assumption for SS-005.

## Reject

- Reject Gemini's assertion that all blockers are resolved.
- Reject committing, vendoring, serving, caching, or downloading a model asset
  before explicit model rights and obligations are documented.
- Reject the claim that self-hosting alone prevents external SDK requests.
- Reject absolute "complete privacy", "zero external network activity", and
  "complete offline capability" claims.
- Reject Gemini's unsupported claim that world landmarks are unaffected by
  camera distance, focal length, or perspective distortion.
- Reject treating CSP-blocked provider metrics as automatically compliant with
  Google's terms or as a substitute for provider/consent review.
- Reject the malformed example test code and any claim that proposed tests are
  already "Verified".

## Blocking Decision Record

| Question | Status | Decision / Evidence |
| --- | --- | --- |
| Exact SDK package and version | Candidate selected, blocked | Candidate is exact `@mediapipe/tasks-vision@0.10.35`; provider metrics terms and compiled-binary obligations remain unresolved. |
| Exact Pose Landmarker model asset/version | Candidate selected, blocked | Candidate is Pose Landmarker Full float16 version 1; variant evidence and model rights remain unresolved. |
| Commit/vendor/serve/cache/download rights | Unresolved | No reviewed primary source grants the required model-asset rights. No asset action is approved. |
| Notices, attribution, citations, terms | Unresolved | npm metadata says Apache-2.0, but the tarball lacks LICENSE/NOTICE and current API terms impose metrics/consent obligations. |
| Asset delivery strategy | Blocked | Same-origin local delivery is the preferred architecture only after rights and provider behavior are approved. |
| No-network proof after local assets | Partially resolved | Playwright must block/record external requests while initialization and inference still succeed; intermittent provider behavior remains a risk. |
| Fixture provenance/license/consent | Unresolved | Generated non-identifying video is preferred, but no fixture or generation provenance is approved. |
| Volatile/local raw-frame lifecycle | Resolved for specification | Transfer/close bitmaps, revoke object URLs, close task/worker, and prohibit raw-frame persistence. |
| Landmark and metadata schema | Resolved for specification | Retain complete 33 normalized/world landmarks and returned `x`, `y`, `z`, and `visibility`; do not invent per-landmark presence. |
| Correct SS-005 test-case coverage | Closed by focused QA re-review | `SS-TC-009` has been revised; execution remains blocked on approved assets/fixture. |
| Non-blocking loading/inference architecture | Closed by focused QA re-review | Normative worker contract and behavioral responsiveness gate are in `docs/ss-005-preimplementation-spec.md`. |

## Implementation Gate

Do not add the MediaPipe dependency, model/WASM assets, fixture video, fetch or
cache behavior, CSP changes, service-worker caching, or runtime implementation
until:

- Claude re-reviews resolved blockers and returns PASS;
- the maintainer explicitly decides whether MediaPipe API metrics terms are
  compatible with Swing Sync, including any required user consent;
- exact SDK compiled-binary rights/notices and exact model redistribution/local
  serving/caching rights are documented;
- a generated fixture and its provenance/license are approved; and
- SS-005 is moved to `3. In Development (ChatGPT)`.
