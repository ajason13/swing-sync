# SS-015 Preimplementation Spec

Status: revised candidate spec for focused Claude QA planning re-review

## Task

`SS-015 Add browser regression tests for MVP flow`

Branch: `ss-015-browser-tests`

Acceptance criteria:

- Test upload/capture placeholder, processing, review, Swing Card export,
  consent gate, and mobile layout.
- Include no-network privacy regression where feasible.
- Capture artifacts for failed runs.
- Tests run in CI.

## Sensitivity Classification

SS-015 is privacy-, browser-automation-, CI-, export-, and user-facing-copy
sensitive. It touches tests around raw video handling, local inference, Swing
Card export, and consent gates. It is not expected to add safety/legal copy,
model/provider assets, dependencies, telemetry, remote sharing, or runtime
network behavior.

## Accepted Scope

- Add or refactor Playwright browser tests under `test/smoke`.
- Add helper functions only where they make the test contract clearer and keep
  failure output readable.
- Update `playwright.config.ts` only for artifact policy, CI reliability, or
  project configuration needed by the accepted browser suite.
- Update `.github/workflows/compliance.yml` or an equivalent workflow so CI runs
  the browser suite as a blocking check using Node 22 after dependencies and
  Playwright browser binaries are explicitly installed.
- Upload browser-test artifacts in CI, scoped to Playwright output such as
  `test-results` and reports. Upload artifacts only on failure with a fixed
  short retention period. Do not upload raw personal user media.

## Out of Scope

- Implementing camera capture.
- Adding remote sharing, telemetry, remote logging, hosted analytics, cloud
  storage, model APIs, new provider SDKs, model assets, new workers, or new
  dependencies.
- Changing product claims about privacy, safety, deletion, anonymity, legal
  compliance, coaching correctness, medical use, or injury prevention.
- Adding new raw personal video fixtures or unapproved third-party media.
- Making runtime network enforcement changes beyond test-only observation or
  request blocking.

## Required Browser Test Contracts

1. Consent gate
   - Analysis remains disabled before explicit acknowledgement.
   - Acknowledgement alone is insufficient without a selected local video.
   - Runtime guard remains fail-closed if the button is force-enabled.
   - Storage failure paths keep analysis blocked.

2. Upload and capture placeholder
   - Local file selection with the approved fixture enables analysis after
     consent.
   - The camera/capture placeholder is visible and reports that camera capture
     remains out of scope.
   - The test must not request camera permission or implement camera capture.
   - A negative assertion must fail if the test or app path calls
     `navigator.mediaDevices.getUserMedia` or otherwise requests camera
     permission during placeholder coverage.

3. Processing
   - Local analysis enters processing, exposes local progress, and completes
     against the approved fixture.
   - Retry/cancel surfaces that already exist remain covered where practical.
   - Console output must be checked with a shared sensitive-output denylist that
     includes raw landmarks, `worldLandmarks`, media characteristics, filenames,
     object URLs, metric payloads, timestamps, hidden IDs, and the
     forward-carried `observedSeekTimestampMs` field.
   - The same denylist must be reused for relevant console and clipboard
     content checks so enumerated protected terms do not drift between stages.

4. Review
   - Review flow exposes explicit phase-review controls.
   - Invalid nondecreasing corrections remain blocked.
   - Valid review confirmation unlocks future metric readiness and keeps
     warning/limitation language scoped.
   - Keyframe overlay canvas renders nonblank and exposes stable accessible
     labels without leaking unnecessary metadata.
   - Nonblank rendering must be proven with pixel-content sampling, not only
     nonzero canvas dimensions or status text.

5. Swing Card export
   - Export remains unavailable or warning-scoped until phase review is
     complete.
   - After valid review, Download PNG, Print / Save as PDF, and Copy prompt
     controls are present and usable.
   - Download filename remains stable and data-minimized.
   - Copy prompt must be clicked in a browser test. The test must stub or grant
     clipboard behavior as needed, verify that a clipboard write is attempted,
     verify success or unavailable status text, and assert copied text excludes
     the shared sensitive-output denylist terms.
   - Copied prompt text may contain approved safety/privacy limitation copy and
     bounded unavailable metric summaries. It must not contain filenames, raw
     video references, object URLs, requested/observed seek timestamps, raw
     landmarks, world landmarks, metric payload JSON, hidden IDs, or personal
     identifiers.
   - Raw swing video is not included in Swing Card export tests.

6. Mobile layout
   - Pixel-size mobile viewport has no horizontal document overflow.
   - Key buttons/controls meet at least 44 px touch target height where already
     expected.
   - Main workflow surfaces do not overlap or truncate critical text.
   - Mobile layout tests must include bounding-box overlap checks for adjacent
     critical controls and clipping checks for critical labels/status text, such
     as `scrollHeight <= clientHeight` and `scrollWidth <= clientWidth` on
     selected non-wrapping controls.

7. No-network privacy regression
   - Route or observe requests from navigation start. Install route/listener
     hooks at the browser context level before any `page.goto` or reload used
     by the test. Do not claim "from navigation start" for any test whose
     network hook is attached after the first navigation.
   - Allow only same-origin `http://127.0.0.1:4174/` preview requests and
     `blob:` URLs.
   - Unexpected external requests fail the test.
   - Assert no IndexedDB or Cache Storage entries are created by the MVP flow.
   - This test is evidence of the current local-first behavior, not a guarantee
     about all future SDK versions or browser behavior.

8. CI and artifacts
   - CI runs `npm run test:smoke` or an equivalent Playwright command.
   - CI explicitly installs Playwright Chromium/browser dependencies before the
     browser suite.
   - Browser tests are a blocking CI check: no `continue-on-error`, no `|| true`
     soft-fail patterns, and no detached non-gating browser-test job.
   - Failed runs retain Playwright artifacts by uploading `test-results` or an
     equivalent Playwright output directory with `if: failure()` and a fixed
     short retention period such as seven days.
   - CI must continue to run existing compliance steps.
   - If the browser suite runs in a separate job, the job must still be required
     for merge readiness and must not replace the existing compliance job.

## Network Enforcement Clarification

The `UNEXPECTED_NETWORK_BLOCKED` path is pre-existing runtime behavior in
`src/main.ts`: a `securitypolicyviolation` listener aborts active loading or
processing sessions with that sanitized status code. SS-015 may test that
pre-existing behavior but must not introduce new runtime network enforcement.

## Verification Plan

Before PR:

- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `git diff --check`

If dependencies, fixture policy, model/provider assets, or license-sensitive
surfaces change unexpectedly, also run:

- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run sbom:generate`

## Observability Decision

Runtime observability is intentionally unchanged. SS-015 should add only local
test diagnostics and CI artifacts for failed browser runs. It must not add
telemetry, remote logging, hosted reporting, production debug endpoints, or
storage of user media.

## Claude QA Planning Questions

- Are the above browser-test contracts sufficient for the SS-015 acceptance
  criteria?
- Is the route-based no-network contract strong enough without adding runtime
  enforcement?
- CI artifact policy is resolved: upload browser artifacts only on failure with
  short fixed retention.
- Are any existing browser tests over-claiming privacy, model telemetry, or
  fixture coverage?
- Are there missing mobile layout assertions that should block implementation?
