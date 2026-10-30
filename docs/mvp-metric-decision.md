# MVP metric decision

## Accepted scope and evidence

On 2026-10-29, the maintainer accepted the recommendation for
[issue #66](https://github.com/ajason13/swing-sync/issues/66): adopt Address
stance-width ratio and Top shoulder-line angle; defer the other metrics and
tempo. The acceptance was explicit: “Go with recommended decision.” The
definitions below make that selection implementable. This is a product/method
decision, not validation, qualified-human release approval, or permission to
handle real-person study media.

This document specifies future behavior. At baseline
`cfa4a933c94a42b608436499d5b6940e09bd072b`, the application calculates no metric
values. [#67](https://github.com/ajason13/swing-sync/issues/67) owns calculation
and payload production; #68 owns presentation and #69 export integration.
This decision changes no runtime, schema, model asset, dependency, persistence,
network behavior, or observability.

Both adopted metrics are experimental, unvalidated descriptions of a projected
image. No ideal ranges, scores, coaching prescriptions, anatomical rotation,
physical distances, or performance/health conclusions are adopted. The
[accuracy protocol](./accuracy-validation-protocol.md),
[privacy architecture](./privacy-architecture.md), and
[safety boundaries](./safety-terms.md) still apply. Synthetic method checks do
not establish real-world accuracy.

## Input and coordinate contract

Use only the active run's explicitly confirmed review assignments, retaining
the existing face-on view, declared handedness, declared mirroring, confirmed
setup, usable paired pose/image outputs, and source-time ordering requirements
in `src/phase-review.ts`. Confirmation does not establish exact event identity.
Resolve Address and Top from the corrected assignments, never from fixed array
positions or the original uniform samples. Reusing a time remains allowed and
does not establish distinct events; do not infer timing metrics from it.

Use normalized image landmarks from exactly one pose, with the current paired
output checks. Do not substitute model world coordinates or a different frame.
Relevant anatomical indices are shoulders 11/12 and ankles 27/28. Every required
landmark must exist, have finite coordinates and visibility, have x/y within
`[0,1]`, and have visibility within `[0.5,1]`. The lower visibility threshold
reuses `MIN_LANDMARK_VISIBILITY`; it is an engineering gate, not an accuracy
probability. Other landmarks remain subject to the existing output checks.

For the exact image supplied to inference, let its oriented width and height
be finite positive integers `W,H`, and `S = max(W,H)`. Convert each relevant
normalized landmark into aspect-corrected coordinates:

```text
P = (x * W / S, y * H / S)
distance(A,B) = hypot(B.x - A.x, B.y - A.y)
epsilon = 0.000001
```

Google's [Web Pose Landmarker output documentation](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js)
(checked 2026-10-29) specifies separate width/height normalization for x/y.
Consequently, applying Euclidean geometry directly to those normalized axes
distorts image angles and distances on non-square images. The common scale S
preserves image proportions and makes the degeneracy threshold independent of
uniform image resolution changes. It does not correct perspective or camera
roll. Assume a stationary, level, face-on camera; an unsupported or undeclared
view blocks values. These setup declarations are user attestations, not
automatic camera calibration.

`SampledFrameOutput` currently lacks exact inference dimensions; rounded preview
dimensions are insufficient evidence of that aspect ratio. #67 must retain the
oriented inference bitmap dimensions as bounded local metadata paired with its
pose for original and reassigned frames. Use those dimensions before bitmap
transfer/closure. Missing or mismatched dimensions must block a numeric result;
do not guess from CSS, displayed/exported images, or another run. That internal
metadata must not enter the metric payload, logs, persistence, or remote calls.

## Adopted definitions

### Address stance-width ratio

Canonical slot: `address-stance-ratio`; phase: `address`; units: `ratio`.
Display name for future UI: **Address stance-width ratio (2D)**.

In the reviewed Address image:

```text
shoulderSpan = distance(P11, P12)
ankleSpan = distance(P27, P28)
value = ankleSpan / shoulderSpan
```

Require both spans strictly greater than epsilon and a finite result. The
shoulder span is the same-frame reference, not an earlier frame or physical
calibration. This is projected ankle separation relative to projected shoulder
separation, not shoe-edge stance width or anatomical body proportions.
Mirroring and handedness do not change the ratio; declarations remain required
by the shared review/payload eligibility gate. It can change with camera angle,
occlusion, and pose estimation error. Do not compare against an ideal stance.
No existing primitive calculates this ratio; #67 adds a focused calculation.

### Top shoulder-line angle

Canonical slot: `top-shoulder-line-angle`; phase: `top`; units: `degrees`.
Display name for future UI: **Top shoulder-line angle (2D)**.

Use shoulders in the reviewed Top image. Lead shoulder is anatomical left (11)
for right-handed golfers and anatomical right (12) for left-handed golfers;
trail shoulder is the opposite. Landmark identities remain anatomical when the
image is mirrored; do not swap identities as well as reflecting coordinates.

```text
m = -1 if declared mirrored, otherwise +1
h = -1 if left-handed, otherwise +1
dx = m * h * (P_lead.x - P_trail.x)
dy = -(P_lead.y - P_trail.y)   # image y points down
theta = atan2(dy, dx) * 180 / pi
value = ((theta + 90) modulo 180) - 90
```

Use mathematical nonnegative modulo (JavaScript `%` needs normalization for
negative operands). This undirected line inclination is in `[-90,90)`;
horizontal is 0 and exactly vertical is -90. Positive means rising along the
canonical horizontal axis after the mirror/handedness transforms above. That
sign convention supports consistent synthetic comparisons, not a judgment of
movement quality. The +/-90 boundary is a wrap, not a sudden physical change.
Require shoulder distance strictly greater than epsilon and a finite result.
No cross-frame baseline is required; image horizontal is the reference.

Reuse `calculateShoulderAngle` where practical, but its current direct
normalized-coordinate calculation and directed-angle range do not implement
this definition. #67 must supply aspect correction and the specified line
wrapping with regression coverage, and inspect existing callers/tests before
changing utility semantics. Do not expose the current utility's result as this
metric unchanged. This measures the projected shoulder line, not shoulder turn,
3D rotation, or anatomical tilt; foreshortening and camera roll remain limits.

## Disposition of existing candidates

| Candidate | Decision and mapping |
| --- | --- |
| `address-stance-ratio` payload slot | Adopt using the new same-frame ratio above. |
| `top-shoulder-line-angle` payload slot | Adopt with corrected image geometry and explicit line-angle convention. |
| `impact-spine-line-angle` payload slot | Defer; Impact is not directly confirmed by the current body-pose workflow. |
| `finish-balance-line-angle` payload slot | Defer; an image line alone has no accepted balance interpretation. |
| `calculateShoulderAngle` primitive | Adopt as a reuse candidate subject to the changes above. |
| `calculateSpineAngle` primitive | Defer; no adopted spine metric/phase mapping. |
| `calculateLeadKneeFlex` primitive | Defer; model-world-coordinate method/reference and angle convention need a separate decision. |
| `calculateTrailKneeFlex` primitive | Defer for the same reasons as lead knee flex. |
| `calculateLeadArmPlane` primitive | Defer; no accepted arm-plane interpretation/reference. |
| `calculateHipRotationProxy` primitive | Defer; projected hip-width ratio is not an adopted rotation measurement. |
| `calculateHeadDisplacement` primitive | Defer; cross-frame baseline/camera-motion interpretation needs a separate decision. |
| Tempo | Defer; start/Top/contact definitions, distinct observed times, seek/frame uncertainty, units, and schema mapping need a later decision. |

Impact remains unconfirmed even after manual assignment and review. Do not
calculate its deferred metric or treat the selected time as verified contact.

## Payload, evidence, and invalidation

Retain `SwingMetricPayload` schema `0.1.0`, `caddieSetEquivalence:
"not-equivalent"`, canonical names, phase IDs, units, and the prohibited-key
policy in `src/metric-contract.ts` and its JSON Schema. No schema migration is
needed: the producer emits four entries in existing `metricNames` order, with
the two deferred slots explicitly unsupported. Existing fixtures remain schema
examples, not approved producer behavior. The validator currently allows some
numeric low-evidence/Impact examples; do not tighten that public validator in
#67 or treat those examples as permission to produce such values.

Apply the following precedence per entry; collect applicable allowed limitation
codes without duplicates. `none` is used alone only for an eligible value.

| Condition, in order | Value status / numeric value | Confidence kind | Limitation notes |
| --- | --- | --- | --- |
| Deferred slot | `unsupported` / null | `unavailable` | `metric-not-calculated`; also `impact-not-directly-observed` for Impact |
| Unsupported/undeclared view, handedness, mirroring, or setup | `unsupported` / null | `unavailable` | `phase-unsupported` |
| No current confirmed review, stale generation, or assignment invalidated | `not-reviewed` / null | `unavailable` | `phase-review-required` |
| Required evidence missing, non-finite, out of bounds, low visibility, wrong pairing/dimensions, or degenerate geometry | `missing` / null | `unavailable` | `pose-evidence-low` |
| All adopted-metric gates pass | `measured` / finite number | `not-calibrated` | `none` |

The display label for null is **Unavailable**, with the relevant explanation;
it must never become zero or a previous value. Low visibility never produces a
numeric MVP metric, even though the general schema permits a `low-evidence`
numeric value. `none` means no listed computational blocker, not absence of
scientific limitations. Future UI, PNG, print, and copied prompts must still
carry **Experimental, unvalidated 2D image measurement**, units, reviewed-phase
context, and camera/evidence limitations. #68/#69 own that presentation work.

Changing source clip, interval, declarations, or any assignment, starting/retrying
analysis, cancellation, and clearing local data invalidate the entire result.
Do not reuse results by sample index alone. Stale asynchronous work cannot
publish into a different review revision; payloads and prepared exports must
be cleared together by their respective integration tasks. Reconfirmation and
fresh eligible inputs are required for new values.

Dimensions, timestamps, landmarks, visibility values, identifiers, previews,
raw video, and diagnostic dumps are internal inputs, not payload fields. Respect
existing local-first cancellation/resource lifecycles. No new telemetry or
persistence is adopted. Later producers/exports must validate the exact payload
before consumption, and reject prohibited/extra keys.

## Independent synthetic reference cases for #67

These are project-authored mathematical specifications, not captured media or
new fixture assets. Expected values derive from the formulas here, independent
of the implementation. Reuse existing synthetic fixtures when compatible, and
add focused cases under the fixture policy if needed. Do not relabel existing
normalized-coordinate expectations as corrected image-angle ground truth.

For an 800 x 600 inference image, specify the following points in pixels, then
divide x/y by 800/600 to create normalized test inputs. Unless stated otherwise,
visibility is 1, declarations are right-handed/unmirrored/face-on/setup
confirmed, and paired outputs have a current confirmed review.

| Case | Required points or change | Independent expected result |
| --- | --- | --- |
| Address ratio | Shoulders 11=(300,200), 12=(500,200); ankles 27=(250,500), 28=(550,500) | 300/200 = 1.5 |
| Ratio uses 2D separation | Keep shoulders; ankles 27=(250,450), 28=(550,550) | sqrt(100000)/200 = 1.5811388300841898 |
| Horizontal Top | Shoulder 11=(600,200), 12=(400,200) | 0 degrees |
| Rising Top | Shoulder 11=(600,200), 12=(400,300) | atan(1/2) = 26.56505117707799 degrees |
| Falling Top | Shoulder 11=(600,300), 12=(400,200) | -26.56505117707799 degrees |
| Vertical Top | Shoulder 11=(400,200), 12=(400,400) | -90 degrees, finite |
| Reflection/declarations | Reflect every x to 800-x and declare mirrored; separately create a left-handed counterpart by reflecting x AND swapping anatomical side indices, with left-handed/unmirrored declarations; also mirror that counterpart and declare it mirrored | Same ratio and line angle as the original case |
| Resolution/translation | Uniformly scale pixels and W/H; separately translate all relevant points within image bounds | Same ratio and angle |
| Aspect correctness | Encode the rising-Top normalized points in a 600 x 800 image | atan(8/9) = 41.6335393365702 degrees; changing aspect is not uniform scaling |
| Visibility boundary | Relevant point visibility 0.5; then just below 0.5 | Eligible at 0.5; otherwise `missing`/null with `pose-evidence-low` |
| Invalid evidence | Remove relevant point, introduce NaN/Infinity, x/y outside [0,1], visibility outside [0,1], missing/invalid dimensions, or mismatched pose/image pairing | `missing`/null; no fabricated number |
| Degenerate | Coincident shoulders; coincident ankles for ratio; relevant span <= epsilon in corrected common-scale coordinates | Affected metric `missing`/null |
| Eligibility | Unsupported/undeclared declarations; then supported but unconfirmed review | `unsupported`/null; then `not-reviewed`/null |
| Revision | Change each invalidating input while calculation is pending; reuse a sample index in a new run | No stale metric or prepared export becomes current |
| Deferred slots | Any eligible reviewed input | Both `unsupported`/null; Impact retains its additional limitation |

Compare unrounded values with absolute tolerances of `1e-9` for ratios and
`1e-6` degrees for angles. These tolerances test numerical methods only, not
model accuracy or clinical/biomechanical margins. Test the modulo wrap around
both sides of vertical and spans below, at, and above epsilon separately.
Payloads must pass both intended contract checks and relevant regression tests,
with exact names/units/phases/statuses and no prohibited keys. Runtime
implementation must cover original/reassigned frames, cancellation/resource
release, low-evidence and stale-work cases. No real-person study is authorized.

## Delivery boundaries and reopening

#67 implements the adopted producer and necessary internal coordinate metadata;
#68/#69 consume it consistently without adding formulas or activating deferred
metrics. Each requires its own verification and fresh-context review under
repository instructions. This decision does not start those issues.

Reopen the method decision before adding a metric, changing formulas/sign/range,
using a new camera view or world-coordinate method, generating low-evidence
numbers, interpreting balance/rotation, claiming validated accuracy, or adding
tempo. A future incompatible public payload change requires an explicit schema
version/migration decision; do not silently repurpose the deferred names.
