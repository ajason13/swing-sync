# SS-005 Gemini Deep Research Prompt

Paste this prompt into Gemini Deep Research before any SS-005 implementation.
Gemini provides research and a proposed specification; Codex must verify and
disposition the response before it becomes implementation authority.

## Prompt

You are Gemini in Deep Research mode acting as the research and specification
assistant for Swing Sync, an Apache-2.0, local-first progressive web app for
educational golf swing analysis.

Task: SS-005 Integrate MediaPipe Pose Landmarker in browser video mode.

Important: You do not have filesystem, Notion, or GitHub access. Treat the
embedded context below as authoritative. Use current primary sources, link every
material claim, distinguish source-code licensing from model/service terms, and
state uncertainty rather than guessing.

## Roles And Gate

- Gemini researches and drafts the specification.
- Codex independently verifies claims, records Adopt / Revise / Defer / Reject
  decisions, implements only approved scope, verifies, and maintains repo state.
- Claude performs pre-implementation QA planning and final adversarial audit.
- Do not provide implementation code as the primary deliverable.
- No SDK dependency, model asset, fixture video, asset fetch/cache behavior, or
  Pose Landmarker implementation may be added until the blocking questions
  below have explicit documented answers.

## Current Repository State

- Current branch: `ss-005-mediapipe-pose`, created from updated `main` at
  `bf650f2`.
- Latest merged PR: https://github.com/ajason13/swing-sync/pull/5
- Node 22; Vite 5; TypeScript; Vitest; Playwright.
- Production runtime dependencies: none.
- Existing app: a mobile-first PWA shell with capture/upload, processing,
  review, and export placeholders. It does not yet access, persist, analyze,
  export, or remotely share video.
- Existing service worker only calls `skipWaiting()` and `clients.claim()`; it
  does not cache or intercept requests.
- First analysis must remain blocked until the local safety acknowledgement is
  accepted, with a runtime guard that fails closed.
- Raw video and derived frames must remain local and volatile by default.
  Derived landmarks are sensitive user data. Remote sharing is out of scope.
- No model binary, model weight, model SDK/provider, or fixture video is
  approved yet.
- Swing-phase detection, metrics, coaching, exports, and remote review are out
  of SS-005 scope.
- Runtime observability must remain local and privacy-preserving. Recommend
  only diagnostics needed to debug loading/inference failures without logging
  raw frames, landmarks, or sensitive user data.

## Acceptance Criteria

- Pose Landmarker loads without blocking the UI.
- Landmarks are extracted for fixture video frames.
- Confidence/visibility metadata is retained.
- Network activity is not required after model assets are available.

## Tracker And Fixture Constraints

- `SS-TC-005` is invalid coverage for this story. It describes swing-phase
  detection and manual correction of eight keyframes.
- `SS-TC-001` is complementary but incomplete coverage: local fixture
  processing produces landmarks without raw video upload.
- Dedicated `SS-TC-009` now covers non-blocking initialization, approved local
  fixture processing, confidence/presence/visibility retention, timestamp
  handling, volatile-resource cleanup, and no unexpected network activity after
  approved assets are locally available.
- Future story SS-014 is intended to define a broader fixture dataset policy.
  SS-005 still needs one explicitly approved fixture approach. Do not assume a
  real person's video can be committed.

## Existing Policy Boundaries

`docs/licensing.md`:

- Production dependencies may use MIT, Apache-2.0, BSD-2-Clause,
  BSD-3-Clause, ISC, CC0-1.0, or 0BSD.
- Model weights, model assets, and SDKs with separate terms require explicit
  review.
- No model binary may be committed, vendored, served, cached, or fetched until
  rights and obligations are documented.
- Production dependencies must appear in the SBOM and pass source-license and
  bundle-license checks.

`docs/models-licensing.md` currently requires, before any model asset use:

- exact model name and version;
- source URL and model card/license terms;
- redistribution and caching rights;
- commercial-use restrictions;
- required citations or attribution; and
- privacy impact for remote fetch or API calls.

`docs/privacy-architecture.md`:

- Raw video and frame pixels are local by default and must not be uploaded.
- Frame buffers should remain volatile and be released after processing.
- Object URLs must be revoked when no longer needed.
- Landmarks are sensitive user data and require explicit opt-in before any
  remote sharing.
- Do not make absolute privacy, deletion, security, or anonymity claims.

## Initial Primary-Source Checks To Verify And Extend

These are leads, not approved decisions:

- Official Web guide:
  https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
  - identifies the npm package as `@mediapipe/tasks-vision`;
  - describes local project paths for WASM/model assets;
  - states `detect()` and `detectForVideo()` are synchronous and block the
    calling thread, recommending web workers;
  - shows video timestamps and result fields including `visibility` and
    `presence`.
- Official task overview:
  https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
  - lists lite, full, and heavy pose landmarker bundles and 33 landmarks.
- Official JavaScript API:
  https://ai.google.dev/edge/api/mediapipe/js/tasks-vision.poselandmarker
  - documents `detectForVideo(videoFrame, timestamp)` and result/callback
    behavior.
- Official MediaPipe API terms:
  https://ai.google.dev/edge/mediapipe/legal/tos
- Current npm registry metadata checked by Codex on 2026-06-07:
  `@mediapipe/tasks-vision` latest is `0.10.35`, with Apache-2.0 metadata.
  Latest is not automatically approved; recommend an exact version and explain
  why.

## Required Research

Research and cite primary-source evidence for:

1. The exact recommended `@mediapipe/tasks-vision` version for SS-005,
   package source license, included browser/WASM artifacts, transitive/runtime
   dependencies, notices, and whether additional provider terms apply.
2. The exact recommended Pose Landmarker bundle variant and immutable version:
   model name, file name, source URL, model card, license/terms, redistribution
   rights, local serving/caching rights, attribution/citation, commercial-use
   restrictions, and integrity/version pinning options.
3. Whether the SDK, WASM runtime, model, or default examples make network
   requests after all approved assets are locally available. Separate
   documented behavior from behavior that must be proven by browser tests.
4. A compliant asset strategy: committed/vendor-served, downloaded during
   build, downloaded at runtime then cached, or user-provided. Explain rights,
   reproducibility, offline behavior, service-worker implications, and failure
   modes for each. Recommend one, but flag any human/legal decision.
5. Browser architecture that keeps initialization and video-mode inference from
   blocking UI interactions. Address web workers, WASM loading, worker/module
   bundling, message contracts, cancellation, teardown, timestamps, backpressure,
   mobile constraints, and fallback/error behavior.
6. CSP and deployment requirements for workers, WASM, blob/object URLs,
   same-origin local assets, and GitHub Pages/Vite base paths. Avoid unnecessary
   remote origins.
7. The result schema and semantics for normalized landmarks, world landmarks,
   `presence`, `visibility`, and any detection/tracking confidence values.
   Clearly distinguish per-landmark fields from configuration thresholds or
   values not exposed in results.
8. A deterministic fixture/testing strategy. Cover expected-landmark assertions
   that tolerate model/runtime variation, video-mode timestamp tests,
   initialization failures, UI responsiveness, cleanup, no persistence, and
   browser network assertions after assets are available.
9. Fixture video provenance and consent/licensing. Compare synthetic/generated,
   maintainer-recorded-with-consent, permissively licensed third-party, and
   non-video alternatives. State whether SS-005 can meet its acceptance
   criterion without committing identifiable real-person footage.
10. Privacy implications for raw video, decoded frames, object URLs, worker
    messages, copied buffers, result landmarks, local diagnostics, and browser
    caches.
11. Mobile/desktop support and performance constraints. Do not invent latency
    targets; propose measurable responsiveness checks and supported-browser
    limitations.
12. Any preview/beta stability, deprecation, terms, or supply-chain risks that
    should block or constrain the story.

## Blocking Questions To Answer Explicitly

- Which exact SDK package and version should be approved?
- Which exact model asset and immutable version should be approved?
- May that model be committed, vendored, served, cached, or downloaded?
- What notices, citations, attribution, terms, or commercial restrictions apply?
- Is the model fetched remotely, bundled locally, or provided by the user?
- How will tests prove network activity is unnecessary after assets are local?
- Which fixture is approved, with what provenance/license/consent?
- How do raw frames remain volatile and local?
- Which landmark schema and confidence/presence/visibility fields are retained?
- How should `SS-TC-009` be refined to replace invalid `SS-TC-005` coverage?
- What architecture keeps loading and inference from blocking the UI?

## Required Output

Return a self-contained report with:

1. Executive recommendation and explicit GO / NO-GO for implementation.
2. Primary-source evidence table with URLs, access dates, and claim supported.
3. Exact SDK decision proposal.
4. Exact model/asset decision proposal.
5. Licensing, terms, notices, attribution, redistribution, caching, and
   commercial-use analysis, with unresolved human/legal decisions called out.
6. Network and offline behavior analysis plus a browser-test proof strategy.
7. Non-blocking worker/runtime architecture proposal.
8. Landmark/result schema proposal with metadata semantics.
9. Fixture provenance and deterministic testing proposal.
10. Privacy/data-lifecycle and local observability proposal.
11. CSP, service-worker, deployment, mobile, and performance implications.
12. Recommended refinement for `SS-TC-009`.
13. A table of broad recommendations labeled Proposed Adopt, Proposed Revise,
    Proposed Defer, or Proposed Reject.
14. A final blocker checklist. Mark every blocking question Resolved,
    Human Decision Required, or Unresolved.

Do not claim that source-code licensing automatically grants model-asset rights.
Do not claim no network activity solely because inference is on-device. Do not
recommend implementation until every blocker has evidence or is explicitly
identified for a human decision.
