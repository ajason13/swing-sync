# Model Licensing Policy

Swing Sync has not approved any model binaries, model weights, or model-hosting
terms yet.

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

The following candidates were reviewed on 2026-06-07 but are **not approved for
implementation or asset use**:

- SDK candidate: exact `@mediapipe/tasks-vision@0.10.35`.
- Model candidate: Pose Landmarker Full, float16, version 1,
  `pose_landmarker_full.task`.

The SDK package reports Apache-2.0 metadata and no declared dependencies.
However, the inspected npm tarball contains compiled WASM, lacks packaged
LICENSE and NOTICE files, and includes operational-metrics identifiers. Current
MediaPipe API terms state that Solution APIs contact Google servers and send
performance, utilization, app/input metadata, and system-environment metrics,
with informed-consent responsibility assigned to the app developer:

https://developers.google.com/edge/mediapipe/legal/tos

No primary source reviewed by Swing Sync explicitly grants the required rights
to commit, vendor, redistribute, locally serve, or cache the candidate model
bundle. Therefore:

- do not add the SDK dependency;
- do not commit, vendor, serve, cache, or download the model;
- do not copy the SDK WASM assets into the app;
- do not claim self-hosting prevents provider requests; and
- do not proceed until provider-metrics compatibility, compiled-binary
  obligations, model rights, notices, and required consent are resolved.

See `docs/ss-005-research-disposition.md` for the complete decision record.

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
