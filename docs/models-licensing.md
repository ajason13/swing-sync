# Model Licensing Policy

Swing Sync has not yet given final maintainer approval to a model binary, model
weight, or model-hosting decision.

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

## MediaPipe Placeholder

MediaPipe Tasks Vision / Pose Landmarker is a candidate dependency for future
Swing Sync pose extraction work. Its SDK and model assets must be reviewed
separately before implementation.

## SS-005 Candidate Review

The following candidates were reviewed beginning 2026-06-07 but are **not yet
approved for implementation or asset use**:

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

Subject to explicit maintainer compliance approval, the Apache-2.0 model
statement in public MediaPipe issue #6306 supports commercial use,
redistribution, same-origin serving, and caching of the exact model. The
preferred SS-005 delivery is vendoring and same-origin serving of the exact
asset with a pinned SHA-256, source URL, license text, and attribution. Runtime
provider fetch is not approved. Service-worker caching remains separately
reviewed.

Until the remaining approval gate closes:

- do not add the SDK dependency;
- do not commit, vendor, serve, cache, or download the model;
- do not copy the SDK WASM assets into the app;
- do not claim tests prove all future SDK versions lack telemetry; and
- do not proceed until maintainer approval, fixture approval, and focused
  Claude QA PASS are recorded.

See `docs/ss-005-google-provider-response.md` and
`docs/ss-005-research-disposition.md` for the complete decision record.

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
