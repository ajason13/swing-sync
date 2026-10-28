# Privacy Architecture and Video Data Lifecycle

**DRAFT - pending human/privacy review before public release.**

This document defines Swing Sync's local-first privacy architecture for current
local video analysis and future data-handling features. It is product and
engineering guidance, not legal advice or a guarantee of privacy, security,
deletion, or regulatory compliance.

The [release review gate](./release-review-gate.md) records the pending
qualified-human review package for any future public release.

## Default Privacy Posture

Swing Sync must process swing video locally by default. Raw swing video and
frame pixels must not be uploaded, sent to model providers, or shared with
remote services unless a future feature adds a separate, explicit opt-in flow
for that action.

The current application implements local file selection, local Pose Landmarker
inference, and user-initiated local Swing Card PNG, print/PDF, and prompt-copy
workflows. It does not implement camera capture, raw-video or landmark
persistence, remote sharing, or remote model APIs. The current consent
acknowledgement is a local scaffold, not a durable legal or privacy record.

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

### Implemented clear-local-data behavior

SS-021 shipped in [PR #22](https://github.com/ajason13/swing-sync/pull/22).
The current **Clear local app data** control cancels pending Swing Card actions,
closes active analysis, resets volatile app state (including selected video,
frames, phase review, and export state), and removes and verifies removal of
registered app-owned localStorage keys. The only registered persisted user key
is `swing-sync:safety-consent:v1`; unrelated origin keys are preserved.

If storage access, removal, or verification is blocked, the UI reports that it
could not clear all local app data and treats the acknowledgement as not
recorded. This is not device-level erasure. Browser or operating-system storage
behavior may vary; downloaded files and clipboard contents are outside this
control. New storage APIs or persisted analysis require explicit registration
and clear-path coverage before adoption.

Evidence: `src/app-events.ts`, `src/analysis-lifecycle.ts`, `src/app-state.ts`,
`src/consent-state.ts`; `test/unit/consent-state.test.ts`,
`test/unit/app-events.test.ts`, `test/unit/app-state.test.ts`, and the
clear-data/refresh and blocked-storage cases in `test/smoke/app.spec.ts`.
These checks cover named paths and environments, not every browser or failure.
Worker waits use per-operation watchdogs: 60 seconds for initialization, 30
seconds for each inference, and 2 seconds for shutdown. A timeout terminates
the worker; stop and clear-data settle pending processing before waiting for
bounded shutdown. Browser timer throttling or suspension may delay these
callbacks, so these are not wall-clock guarantees. Main-thread previews are
closed during cleanup; transferred inference bitmaps belong to the worker,
which closes them after inference or releases its resources on termination.
Late worker messages cannot revive a closed session. Sanitized local codes
include `WORKER_INIT_TIMEOUT`, `WORKER_INFERENCE_TIMEOUT`,
`WORKER_CONSTRUCTION_FAILED`, and `WORKER_MESSAGE_ERROR`; forced shutdown
reports `WORKER_SHUTDOWN_TIMEOUT` at the session boundary while preserving
the caller’s stop/clear-data destination. No diagnostics are transmitted.
Evidence: `test/unit/worker-recovery.test.ts` and injected silent-worker
recovery tests in `test/smoke/app.spec.ts`.

### Future storage requirements

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
- **Deletion:** Extend the implemented clear-local-data path to every new
  app-owned storage location; preserve unrelated origin data.
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
> including local acknowledgement state and future app-owned analysis state if
> registered. Downloaded files and clipboard contents are outside this control.
> Browser or device storage systems may retain lower-level remnants outside the
> app's control, so this is not device-level erasure.

## Future Implementation Gates

Current local processing has bounded verification in the named unit/smoke
suites and privacy verifier. Before extending storage, processing, or remote
analysis, retain or extend coverage for:

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
