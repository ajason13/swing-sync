# SS-005 Research Disposition

Status: **Pending Gemini Deep Research response and Codex primary-source
verification. Implementation is blocked.**

Use `docs/ss-005-gemini-research-prompt.md` to obtain the required research
response. Gemini research is input, not implementation or licensing authority.

## Verified Before Gemini Handoff

Checks performed by Codex on 2026-06-07:

- Official Google AI Edge Web guidance identifies
  `@mediapipe/tasks-vision`, local WASM/model paths, video-mode timestamps,
  `presence` and `visibility` output fields, and synchronous
  `detectForVideo()` behavior that can block the calling thread:
  https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- Official task guidance lists lite, full, and heavy model bundles and 33 pose
  landmarks:
  https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
- Official JavaScript API documentation requires a millisecond timestamp for
  video-mode detection:
  https://ai.google.dev/edge/api/mediapipe/js/tasks-vision.poselandmarker
- Official MediaPipe API terms require separate review:
  https://ai.google.dev/edge/mediapipe/legal/tos
- npm registry metadata reported `@mediapipe/tasks-vision` version `0.10.35`
  with Apache-2.0 license metadata. This is evidence to verify, not approval.

## Tracker Disposition

### Adopt

- Keep `SS-TC-001` as complementary local pose extraction/no-upload coverage.
- Use dedicated `SS-TC-009` for SS-005-specific non-blocking initialization,
  metadata retention, timestamps, cleanup, and post-asset network assertions.

### Reject

- Do not use current `SS-TC-005` as SS-005 acceptance coverage. It describes
  swing-phase detection and manual correction for a future story.

## Pending Decisions

The following sections must be completed after the Gemini response is received
and important claims are independently verified.

### Adopt

- Pending.

### Revise Before Adoption

- Pending.

### Defer

- Pending.

### Reject

- Pending.

## Blocking Decision Record

| Question | Status | Decision / Evidence |
| --- | --- | --- |
| Exact SDK package and version | Unresolved | `@mediapipe/tasks-vision` is a candidate; no version approved. |
| Exact Pose Landmarker model asset/version | Unresolved | No model approved. |
| Commit/vendor/serve/cache/download rights | Unresolved | No asset action permitted. |
| Notices, attribution, citations, terms | Unresolved | Requires separate SDK and model review. |
| Asset delivery strategy | Unresolved | No remote, bundled, or user-provided strategy approved. |
| No-network proof after local assets | Unresolved | Browser assertion boundary requires QA review. |
| Fixture provenance/license/consent | Unresolved | No video fixture approved or committed. |
| Volatile/local raw-frame lifecycle | Unresolved | Must be specified and tested. |
| Landmark and metadata schema | Unresolved | Presence/visibility are candidates; exact retained contract is unapproved. |
| Correct SS-005 test-case coverage | Partially resolved | `SS-TC-009` created; Claude QA refinement required. |
| Non-blocking loading/inference architecture | Unresolved | Worker-based design is a candidate; exact contract unapproved. |

## Implementation Gate

Do not add the MediaPipe dependency, model/WASM assets, fixture video, fetch or
cache behavior, or runtime implementation until:

- Gemini research has been received;
- Codex has completed this disposition and primary-source verification;
- exact SDK/model/asset and fixture decisions are documented in licensing and
  privacy policy;
- Claude QA planning has no unresolved blockers; and
- SS-005 is moved to `3. In Development (ChatGPT)`.
