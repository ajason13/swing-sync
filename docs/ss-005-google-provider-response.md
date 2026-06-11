# SS-005 Google Provider Response

Status: **Maintainer-provided evidence awaiting durable source provenance and
explicit maintainer compliance approval.**

On 2026-06-10, the maintainer supplied the following response attributed to
Google regarding MediaPipe Tasks Vision Web, the exact Pose Landmarker model
candidate, and SDK licensing:

> The current version of the Web SDK does not include telemetry. We are however
> working on this at the moment, as API usage data is becoming more and more
> critical for our team, as it allows us to focus our development on areas that
> are popular with our customers. While we plan to collect performance and
> usage data we do not send your input data to our servers and only collect
> aggregated usage metrics. We currently are not planning to have an opt-out
> mechanism, as this will greatly skew the data we receive, which will no longer
> allow us to make informed decisions on what our customers are using. You can
> block outgoing requests, or block the destination host once we have telemetry
> enabled, and continue to use our SDK normally.
>
> Please review our privacy notice for more information:
> https://developers.google.com/edge/mediapipe/solutions/tasks#mediapipe_tasks_privacy_notice
>
> The
> https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task
> is released under Apache 2.
>
> The current version of the Web SDKs are released under Apache 2 as noted on
> NPM. We will ensure that future versions of our NPM packages include NOTICE
> and LICENSE files.

## Required Provenance

Before this response is treated as final rights evidence, record a durable
public issue URL or preserved private support/email thread identifier and the
Google responder's role or team. Do not record private email addresses,
authentication data, or unrelated correspondence in the repository.

## Codex Evidence Disposition

Subject to provenance and explicit maintainer compliance approval:

- **Provider metrics:** Adopt for exact current Web SDK candidate
  `@mediapipe/tasks-vision@0.10.35`. Google states the current Web SDK does not
  include telemetry. Any later version requires a fresh privacy, network, and
  terms review because Google states telemetry is planned.
- **Unexpected network behavior:** Revise. Tests must still observe and block
  unexpected external requests. Because current-version telemetry is stated to
  be absent, an unexpected external request during approved local operation
  fails closed and blocks release pending investigation.
- **SDK license:** Adopt for the exact current Web SDK candidate. Google's
  response says current Web SDKs are Apache-2.0, supplementing npm package
  metadata. The response does not separately enumerate each compiled WASM
  binary, so the maintainer compliance decision must explicitly state whether
  it reasonably relies on this SDK-wide statement for packaged compiled
  artifacts.
- **Missing package license files:** Revise. Google acknowledges future npm
  packages will include `NOTICE` and `LICENSE`, but the exact candidate does
  not. Swing Sync must distribute the Apache-2.0 license and a third-party
  attribution entry. No upstream `NOTICE` file exists in the inspected exact
  tarball to preserve; any contrary provider notice discovered later must be
  added before release.
- **Model rights:** Adopt for the exact model URL. Google's response says that
  exact model is Apache-2.0. Subject to maintainer approval, Apache-2.0 permits
  commercial use, copying, redistribution, local serving, and caching while
  requiring license/notice preservation as applicable.
- **Model delivery:** Adopt same-origin vendoring and serving for the exact
  approved model, with a pinned SHA-256, source URL, Apache-2.0 attribution,
  and no runtime provider fetch. Service-worker caching remains a separate
  implementation decision.

## Remaining Gate

This response does not approve a fixture or prove runtime behavior. Before
implementation:

1. record durable response provenance;
2. record explicit maintainer compliance approval of the decisions above;
3. approve and empirically validate a reproducibly generated, non-identifying
   fixture against the exact candidate;
4. obtain a third focused Claude QA PASS; and
5. move SS-005 to `3. In Development (ChatGPT)`.
