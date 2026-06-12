# SS-005 Pose Landmarker Fixture Provenance

## Approval

This fixture was approved for SS-005 pre-implementation QA planning on
2026-06-11 after empirical validation against exact
`@mediapipe/tasks-vision@0.10.35` and the exact Pose Landmarker Full float16
version 1 model.

The fixture is limited to deterministic pose-extraction integration tests. It
is not evidence of golf-swing accuracy, phase detection, biomechanical
correctness, or performance across devices.

## Non-Identifying Source

`mannequin-source.png` is an AI-generated image of a clearly synthetic,
faceless wooden artist mannequin. It contains no recording of a real person,
no real-person face, and no known biometric or personal data.

Generator: OpenAI image generation through the Codex `imagegen` tool on
2026-06-11.

Prompt:

> Create a clean testing fixture image, 16:9 landscape, full-body clearly
> synthetic faceless wooden artist mannequin in a golf address stance, viewed
> mostly from the side with slight three-quarter angle so both arms and legs
> are visible, holding a simple non-branded golf club. Entire body including
> head, hands, and feet fully inside frame with generous margins. Neutral light
> gray studio background, high contrast, even lighting, no text, no logos, no
> real person, no facial features, no photorealistic skin, no extra objects.

No seed was exposed by the generation tool. The committed source PNG is the
fixed deterministic input for reproducing the WebM fixture.

OpenAI's Terms of Use effective 2026-01-01 were reviewed on 2026-06-11:
`https://openai.com/policies/terms-of-use/`. They state that, as between the
user and OpenAI and to the extent permitted by applicable law, the user owns
Output and OpenAI assigns its rights in Output to the user. They also make the
user responsible for Content and warn that Output may not be unique. The
Service Terms updated 2026-06-02 were also reviewed:
`https://openai.com/policies/service-terms/`. The fixture depicts no person and
does not use third-party source material supplied as input. The maintainer
approved distributing this committed source and derived fixture under the
project's Apache-2.0 license. This record is a project compliance decision, not
legal advice or a guarantee of exclusive rights.

## Deterministic Video Derivation

Tool: FFmpeg 8.1.1 with `libvpx-vp9`.

Command, run from the repository root:

```bash
ffmpeg -y -loop 1 \
  -i test/fixtures/pose-landmarker/mannequin-source.png \
  -vf "scale=640:360:force_original_aspect_ratio=decrease,pad=640:360:(ow-iw)/2:(oh-ih)/2:color=white,format=yuv420p" \
  -r 10 -t 2 -an -c:v libvpx-vp9 -deadline best -cpu-used 0 -row-mt 0 \
  -threads 1 -tile-columns 0 -frame-parallel 0 -auto-alt-ref 0 \
  -lag-in-frames 0 -g 20 \
  test/fixtures/pose-landmarker/mannequin-golf-address.webm
```

Output properties:

- codec: VP9;
- dimensions: 640 x 360;
- frame rate: 10 fps;
- duration: 2 seconds;
- audio: none; and
- file size at approval: 8,697 bytes.

## Integrity

```text
b5d2a9d4eef284997d49826e1b177ecfa6cce7b439ae0973b307d65bf3e7c605  mannequin-source.png
e52dc416e1196ecd064972a606cc8e488cd46844a0644197735cca1c177ad390  mannequin-golf-address.webm
```

## Empirical Validation

Validation used a disposable browser harness outside the repository. The
harness loaded exact `@mediapipe/tasks-vision@0.10.35`, same-origin package
WASM, and the exact model URL approved in MediaPipe issue #6306:

`https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`

Downloaded model SHA-256 during validation:

```text
5134a3aad27a58b93da0088d431f366da362b44e3ccfbe3462b3827a839011b1
```

The harness configured `runningMode: "VIDEO"` and called `detectForVideo()` on
the WebM at monotonically increasing timestamps.

| Timestamp | Normalized landmarks | World landmarks | Observed normalized visibility range |
| --- | ---: | ---: | --- |
| 0 ms | 33 | 33 | 0.5057702661 to 0.9999644756 |
| 500 ms | 33 | 33 | 0.4956441224 to 0.9999638796 |
| 1000 ms | 33 | 33 | 0.4965527654 to 0.9999650121 |
| 1500 ms | 33 | 33 | 0.4880312681 to 0.9999654889 |

Expected structural test behavior:

- one detected pose at the four approved sample timestamps;
- exactly 33 normalized and 33 world landmarks for that pose;
- numeric returned `x`, `y`, `z`, and `visibility` fields retained without
  filtering or invented `presence`; and
- no assertion of fixed coordinate or minimum visibility values.

Observed validation requests were same-origin local harness, package/WASM,
model, and fixture requests. This gate did not attempt to prove the full
post-ready/offline network acceptance criterion; those tests remain required
during implementation.
