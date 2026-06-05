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

## API SDK Placeholder

Optional model API SDKs must satisfy both code-license policy and provider
service terms. Raw swing video must not be sent to any model provider by default.
