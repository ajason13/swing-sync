# SS-005 Pre-Implementation Specification

Status: **Blocked at `2. QA Planning (Claude)`. This specification defines the
implementation contract that may be used only after the open gates are closed.**

## Scope

SS-005 may add browser video-mode pose landmark extraction while preserving the
existing first-analysis safety acknowledgement and local-first boundaries.

In scope:

- non-blocking runtime initialization and inference;
- approved fixture-frame extraction;
- complete pose landmark and visibility retention;
- same-origin approved asset loading;
- useful local failure states;
- no unexpected external network activity after approved assets are available;
  and
- volatile raw-frame/resource lifecycle.

Out of scope:

- swing phases, biomechanical metrics, coaching, overlays, exports, remote
  review, remote model APIs, telemetry, remote logging, and long-term landmark
  persistence.

## Blocking Maintainer Decisions

These decisions are recorded conservatively until stronger evidence is approved:

| Decision | Current decision |
| --- | --- |
| Provider metrics | MediaPipe's documented provider metrics are incompatible with Swing Sync's currently approved local-first boundary. Do not integrate unless a human/legal review approves exact disclosure/consent terms or a candidate without that boundary is selected. CSP blocking is not approval. |
| SDK | Exact `@mediapipe/tasks-vision@0.10.35` remains a blocked candidate. It is not an approved production dependency. |
| Model and delivery | Pose Landmarker Full float16 version 1 remains a blocked candidate. No commit, vendor, serve, cache, or download path is approved without explicit model rights. |
| Fixture | Use only a reproducibly generated, non-identifying fixture with reviewed provenance and output license. No fixture or generation tool is approved yet. |
| Network criterion | Successful initialization and inference must not require or attempt unexpected external network activity after approved same-origin assets are available. Tests report observed/attempted requests and do not claim impossibility. |
| Responsiveness | Use behavioral UI-heartbeat/input completion as the acceptance gate. Record browser long tasks as diagnostic evidence; do not require zero long tasks or fixed FPS/inference latency across hardware. |

## Candidate API Schema

For exact `@mediapipe/tasks-vision@0.10.35`, the inspected TypeScript
declarations expose:

- `PoseLandmarkerResult.landmarks: NormalizedLandmark[][]`;
- `PoseLandmarkerResult.worldLandmarks: Landmark[][]`; and
- `x`, `y`, `z`, and `visibility` on both landmark types.

The exact candidate declarations do **not** expose per-landmark `presence`.
`minPosePresenceConfidence` is an input option/threshold, not returned
per-landmark metadata. SS-005 must:

- preserve all returned poses and all 33 landmarks per detected pose;
- preserve returned `x`, `y`, `z`, and `visibility` values without filtering,
  rounding, or invented confidence guarantees;
- record configured detection, presence, and tracking thresholds separately;
- not invent a returned `presence` field; and
- wrap each result with the input `timestampMs` because the candidate result
  object does not itself carry that timestamp.

If a different SDK/version is proposed, this schema decision must be reverified.

## Worker Contract

### States

`uninitialized -> initializing -> ready -> processing -> ready`

Terminal states:

- `error`: initialization, inference, protocol, timestamp, or worker failure;
- `torn-down`: teardown completed and the worker is terminated.

Recovery from `error` requires creating a new worker. No degraded inference may
continue after an error.

### Main To Worker Messages

| Type | Required data | Valid state |
| --- | --- | --- |
| `init` | approved runtime/model configuration and asset integrity metadata | `uninitialized` |
| `frame` | transferable `ImageBitmap`, finite non-negative monotonically increasing `timestampMs` | `ready` |
| `teardown` | none | any non-terminal state |

The main thread owns backpressure. It may have at most one in-flight frame and
must close/drop a newly created bitmap instead of posting it while the worker is
busy.

### Worker To Main Messages

| Type | Required data |
| --- | --- |
| `ready` | sanitized runtime/version identifier |
| `result` | input `timestampMs`, complete normalized/world landmark arrays |
| `frame-dropped` | input `timestampMs`, sanitized reason |
| `init-error` | stable sanitized code |
| `inference-error` | stable sanitized code, optional input `timestampMs` |
| `torn-down` | none |

No message or diagnostic may contain raw frames, media characteristics, user
identifiers, or landmark values except the explicit `result` payload consumed
in memory by the app.

### Failure And Cleanup

- Invalid protocol or timestamp input fails closed and terminates the session.
- Main-thread `error` and `messageerror` worker events fail closed.
- Every owned `ImageBitmap` is closed in a `finally` path.
- Teardown closes the pose task, releases references, acknowledges completion,
  and terminates the worker.
- The main thread must not assume every frame produces a result.
- A watchdog may surface a sanitized local timeout state; its duration must be
  generous and must not be presented as an inference-performance guarantee.

## Fixture Contract

Before a fixture is committed or used, its provenance record must include:

- generator/tool name, exact version, and license;
- reproducible source/script or exact generation command;
- deterministic inputs/seed where applicable;
- dimensions, duration, frame rate, and SHA-256;
- declaration that it contains no recording of a real person;
- output copyright/license decision; and
- expected structural behavior used by tests.

Do not assert that a geometric/stick-figure fixture will necessarily produce
pose landmarks. The approved fixture must be empirically validated against the
approved model before its expected landmark behavior is recorded.

## Network Test Contract

Tests must distinguish:

1. **Load phase:** record every request and allow only the documented approved
   same-origin runtime/model/fixture assets.
2. **Post-ready phase:** block and record every request after the runtime reports
   ready; successful fixture inference must complete with no attempted request.
3. **Offline-from-start phase:** with approved assets already locally available,
   block external requests from navigation start and demonstrate successful
   initialization and fixture inference.
4. **Service-worker phase:** only if caching is later approved, repeat the
   assertion with the production service worker active.

The evidence proves behavior observed in controlled runs, not that an SDK can
never issue a request.

Production behavior for an observed provider-metrics request remains deferred
until the provider-metrics blocker is resolved. When that decision closes, this
contract must specify whether the approved runtime fails closed, requires an
approved disclosure/consent path, or is replaced. Do not silently allow,
silently block, or silently ignore an unexpected provider request.

## Responsiveness Contract

During initialization:

- a deterministic main-thread heartbeat/input action scheduled after
  initialization begins must complete before the worker emits `ready`;
- the UI must expose a loading state and remain interactive;
- browser `longtask` entries are captured for diagnosis; and
- tests must not fail solely because any long task exceeds 50 ms unless a
  separate reviewed CI threshold is later approved.

This verifies that initialization is delegated and the UI remains usable without
claiming fixed FPS or latency across devices.

## Required Test Coverage

Before implementation can be considered complete:

- worker state/protocol success and every fail-closed path;
- invalid/non-monotonic timestamps;
- complete 33-landmark arrays with exact returned fields;
- no filtering/rounding and wrapper timestamp preservation;
- initialization failure and useful local error state;
- UI heartbeat/input responsiveness while loading;
- approved fixture inference;
- two-phase and offline-from-start network assertions;
- object URL, bitmap, task, and worker cleanup;
- no raw-frame/model cache/storage persistence beyond explicitly approved asset
  behavior;
- no sensitive console/log output;
- production CSP/worker/WASM/base-path behavior; and
- desktop and mobile Chromium behavior.

## Implementation Start Gate

Implementation remains prohibited until:

- provider-metrics terms and any consent/legal decision are approved;
- exact SDK compiled-binary obligations/notices are approved;
- exact model rights and delivery mechanism are approved;
- a fixture and provenance record are approved;
- Claude re-reviews the resolved blockers and returns PASS; and
- Notion moves to `3. In Development (ChatGPT)`.
