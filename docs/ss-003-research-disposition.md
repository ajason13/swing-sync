# SS-003 Gemini Research Disposition

Gemini Deep Research produced a broad privacy architecture, storage lifecycle,
and network-boundary proposal for SS-003 on 2026-06-05. This file records what
Swing Sync should adopt, revise, defer, or reject before implementation and
Claude adversarial review.

The Gemini output is research input, not legal advice, privacy compliance
approval, or implementation authority.

## Source Checks

Primary-source checks performed on 2026-06-05:

- MDN, "Storage quotas and eviction criteria":
  https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN, "Origin private file system":
  https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- MDN, "StorageManager: persist() method":
  https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
- WebKit, "Tracking Prevention in WebKit":
  https://webkit.org/tracking-prevention/
- WebKit, "Full Third-Party Cookie Blocking and More":
  https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- MDN, "Content-Security-Policy header":
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
- Google AI Edge, "Pose landmark detection guide for Web":
  https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- Google AI Edge, "MediaPipe Solutions APIs Terms of Service":
  https://ai.google.dev/edge/mediapipe/legal/tos

Non-primary or unsupported Gemini sources, including Reddit, vendor blog
performance numbers, and uncited latency/quota tables, should not be treated as
authoritative for SS-003.

## Adopt

- Treat raw swing video, extracted frames, pose landmarks, computed metrics,
  Swing Card exports, prompts, model outputs, and consent state as distinct
  data classes with separate retention and transmission rules.
- Treat derived pose landmarks and movement metrics as sensitive user data even
  when they do not include photographic likenesses. They can encode body shape,
  movement patterns, timing, and coordination signals.
- Preserve local-first defaults: raw video and frame pixels must not be uploaded
  by default, and any remote sharing requires a separate explicit opt-in.
- Document a local-first lifecycle from selection/capture through preview,
  processing, review, export, deletion, browser refresh, and app uninstall.
- Use cautious deletion language. Browser storage cleanup can remove app-level
  references and origin data, but Swing Sync must not promise forensic,
  physical, or device-wide erasure.
- Add user-facing copy for first analysis, manual export, optional remote/model
  sharing, and local data deletion.
- Add compliance verification for prohibited analytics/telemetry domains and
  dependencies once SS-003 implementation begins.
- Add a Claude adversarial review checklist covering consent bypass, network
  exfiltration, misleading copy, derived-data sensitivity, storage eviction, and
  deletion overclaims.

## Revise Before Adoption

- Replace "absolute prevention of unauthorized data exfiltration" with scoped,
  defense-in-depth language. Browser controls, runtime guards, CSP, and tests
  reduce risk but cannot guarantee absolute prevention.
- Do not state OPFS is "secure", "encrypted", or accessible only through
  HTTPS without qualification. OPFS is origin-private browser storage; security
  context and browser support details require implementation-specific checks.
- Do not adopt Gemini's fixed storage quota and latency table. Browser quotas,
  persistence behavior, and performance vary by engine, device, free space,
  user settings, engagement, private browsing mode, and installed-PWA state.
- Do not adopt a default 14-day raw-video retention rule yet. SS-003 should
  document the lifecycle and proposed retention choices, but the actual window
  requires product and privacy review after real storage exists.
- Revise IndexedDB "durable consent ledger" language. Current consent remains a
  scaffold, and durable consent records should not be added unless legal/human
  review requests them.
- Revise remote model copy. Providers must be reviewed, but SS-003 cannot claim
  that third parties are "legally bound", provide "zero data retention", or
  purge data instantly unless contract terms have been reviewed and documented.
- Revise MediaPipe telemetry claims. Google MediaPipe Solution API terms state
  metrics use, but any implementation must verify the exact SDK, package, model
  asset, loading path, and service terms before asserting runtime telemetry
  behavior.
- Revise the proposed network guard code before use. The sample has type errors
  and should be adapted to this repo's eventual API boundaries instead of copied.

## Defer

- OPFS raw-video storage, IndexedDB landmark stores, storage cleanup jobs,
  quota-pressure handling, and private-browsing behavior tests until Swing Sync
  has an actual video ingestion and analysis pipeline.
- Service worker request interception until a PWA shell and offline behavior
  exist. A service worker can help enforce boundaries, but it is not required
  for a docs/spec story.
- CSP hardening until deployment shape is known. A meta CSP can be considered
  for the scaffold, but final CSP should be verified against Vite output,
  workers, WASM, model loading, and hosting headers.
- Face blur, ZIP export, Swing Card packaging, and raw-video export controls
  until export functionality exists.
- Persistent storage prompts via `navigator.storage.persist()` until the app
  stores user-created swing assets that need durability.
- WebGPU, WASM, MediaPipe, ONNX, model asset bundling, and self-hosted model
  review until the model-licensing and pose-extraction stories are active.
- Encryption at rest for local video storage until storage scope, threat model,
  key management, and performance constraints are specified.
- Verifier assertions for fail-closed network guard behavior until a real
  network/API boundary exists.

## Reject For Current Scope

- Do not implement model binaries, model SDKs, hosted model integrations,
  WebGPU/WASM inference, or pose workers in SS-003.
- Do not claim Swing Sync can guarantee that data never leaves the device. The
  approved claim is raw video is not uploaded by default and remote sharing
  requires explicit opt-in.
- Do not claim downloaded exports are anonymous. Landmark and metric exports may
  still be identifying or sensitive.
- Do not include raw swing video in standard exports by default.
- Do not rely on Reddit or uncited community guidance for GDPR, ePrivacy, CCPA,
  or other legal/privacy compliance conclusions.
- Do not add "cryptographic timestamps", legal consent ledgers, or billing-level
  remote consent requirements without human/legal review.
- Do not return mock success responses for blocked third-party telemetry unless
  a future implementation proves this is safe and does not hide failures that
  users or developers need to see.

## SS-003 Implementation Scope

SS-003 should remain a privacy architecture and lifecycle documentation story
unless the maintainer explicitly expands it. Appropriate current work:

- Add `docs/privacy-architecture.md` documenting data classes, default local
  lifecycle, export/model-sharing policy, deletion language, and future storage
  decisions.
- Add `scripts/verify-privacy-boundaries.js` to check for prohibited analytics,
  telemetry, and tracking domains/packages in source and dependency manifests.
- Wire the privacy verifier into `npm run compliance:verify`.
- Update `README.md` and `CONTEXT.md` to reference the new privacy architecture
  document and the remaining review gates.
- Preserve the existing SS-002 consent scaffold unless SS-003 explicitly needs
  a copy-only update for privacy/deletion language.

## Claude Review Checklist

Ask Claude to review:

- Whether `docs/privacy-architecture.md` avoids absolute privacy, security,
  deletion, legal, or anonymity claims.
- Whether raw video is consistently documented as local-first and not uploaded
  by default.
- Whether derived landmarks, metrics, prompts, and exports are treated as
  sensitive enough for explicit opt-in before remote sharing.
- Whether user-facing deletion copy distinguishes app-level logical deletion
  from forensic/device-level erasure.
- Whether optional remote/model sharing requires separate opt-in and provider
  terms review before any integration.
- Whether the privacy verifier checks meaningful prohibited patterns without
  creating false confidence.
- Whether future work is clearly separated from SS-003 acceptance criteria.
