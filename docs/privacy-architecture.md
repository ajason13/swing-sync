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

The current application does not yet implement video capture, video storage,
pose extraction, model inference, exports, or remote model APIs. The current
consent acknowledgement is a local scaffold, not a durable legal or privacy
record.

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

Current MediaPipe API terms reviewed on 2026-06-07 state that Solution APIs
process input media on-device but contact Google servers from time to time and
send performance, utilization, app/input metadata, and system-environment
metrics. The terms assign informed-consent responsibility to the app developer.

This provider behavior is not approved for Swing Sync. Local WASM/model paths,
CSP, service-worker rules, and network tests may reduce or detect outbound
activity, but must not be described as proof that provider metrics can never
occur or that blocking them satisfies provider terms.

Before MediaPipe integration begins, Swing Sync must document:

- whether the provider metrics terms are compatible with the local-first
  product boundary;
- whether separate informed consent is required and approved;
- observed and attempted network requests during initialization and inference;
- whether the SDK remains functional when all external requests are blocked;
  and
- whether an alternative runtime is required if the provider boundary cannot be
  reconciled.
