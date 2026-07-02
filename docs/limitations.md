# Limitations

Swing Sync provides educational golf swing review in a local-first browser app.
It is designed to support practice notes and visual inspection. The detailed
educational, safety, privacy, and fixture limits below define what the app does
and does not claim.

## Pose And Metric Limits

Pose estimation can be wrong or incomplete. Results may be affected by lighting,
motion blur, camera angle, distance from the camera, occlusion, loose clothing,
club visibility, background clutter, browser performance, device performance,
and dropped or low-quality frames.

Metrics and phase labels are derived from sampled video frames and pose
landmarks. They should be treated as estimates for review, not as proof of
biomechanical correctness, performance improvement, or injury risk.

Low-confidence, missing, or inconsistent landmarks should be interpreted as a
reason to review the video manually or record another clip, not as a statement
about the user's health or movement quality.

## Camera Setup

For clearer review, use a stable camera, good lighting, and enough space to keep
the whole body and as much of the club path as practical in frame. Avoid crowded
or identifying backgrounds when possible. Confirm the practice area is safe
before swinging.

These setup notes can improve review quality, but they do not guarantee accurate
pose detection, complete phase detection, safe movement, or useful feedback.

## Educational And Non-Medical Scope

Swing Sync is for educational golf swing review. It is not medical advice, pain
diagnosis, rehabilitation guidance, physical therapy, or a substitute for
qualified medical care or professional golf coaching.

Stop activity if you feel pain, dizziness, numbness, weakness, or unusual
discomfort. Consult a qualified medical professional for pain, injury, health,
or mobility concerns. Consult a qualified golf coach for sport-specific
instruction beyond general educational review.

## Privacy And Export Limits

Raw swing video is not uploaded by default. Any future feature that sends raw
video, frame pixels, landmarks, metrics, prompts, reports, or model outputs
outside the browser must use a separate, explicit opt-in flow.

Derived landmarks, metrics, selected images, prompts, reports, and model outputs
may still be sensitive or identifying. Browser storage and downloaded files are
affected by browser, operating-system, device, and user settings. Swing Sync
cannot guarantee that browser data is retained, erased, kept private, or
protected outside the app's controls.

Downloaded Swing Cards and copied prompts are controlled by the user after they
leave Swing Sync.

## Remote Review Limits

The production remote model provider registry is currently empty. SS-013 added
a provider-neutral adapter scaffold, but there are no configured remote model
providers, provider SDKs, API keys, server routes, or active hosted-model calls
in the current production app.

Any future remote review feature must identify the provider, destination, data
classes, terms, privacy practices, and opt-in/revocation flow before anything is
sent outside the browser.

## Fixture And Test Limits

Automated tests, synthetic fixtures, and the approved mannequin fixture validate
plumbing, contracts, deterministic behavior, and regression boundaries. They do
not prove real-world golf swing accuracy, phase accuracy, biomechanical
correctness, coaching correctness, safety, privacy, anonymity, deletion, or
legal compliance.

## Draft Review Status

The safety and privacy documents are engineering and product drafts pending
human/legal review; they are not legal advice and do not guarantee privacy,
safety, deletion, anonymity, or regulatory compliance.

See [Safety terms draft](./safety-terms.md) and
[Privacy architecture](./privacy-architecture.md) for the current project
boundaries.
