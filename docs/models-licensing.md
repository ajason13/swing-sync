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
