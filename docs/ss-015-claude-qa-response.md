# SS-015 Claude QA Planning Response

Date: 2026-06-29

Stage: Preimplementation QA planning

Verdict: FAIL

Claude did not clear SS-015 for implementation start. Codex accepts all seven
blockers as valid planning gaps.

## Accepted Blockers

1. No-network regression can fail open because current request listeners and
   routes are installed after `beforeEach` navigation/reload, not before
   navigation start.
2. Capture placeholder lacks explicit acceptance-aligned test coverage.
3. CI requirements are too soft and must require blocking browser-test CI,
   explicit browser installation, and failure-only artifact upload with stated
   retention.
4. Console-leak assertions are incomplete and omit hidden-ID coverage.
5. Keyframe canvas nonblank rendering is not proven by width/height checks.
6. Mobile overlap and text-truncation coverage is promised but not specified
   concretely enough.
7. Copy-prompt usability and clipboard content-minimization are not specified;
   Claude requested exact copy-prompt source/template for re-review.

## Codex Disposition

- B1: Adopt. Revise spec to require context-level request observation/blocking
  before any page navigation and prohibit misleading "from navigation start"
  claims unless the route/listener is installed before `page.goto`.
- B2: Adopt. Revise spec to require visible capture placeholder copy and
  camera-permission/getUserMedia negative coverage.
- B3: Adopt. Revise spec to require blocking CI execution, no soft-fail
  patterns, explicit Playwright browser installation, and failure-only artifact
  upload with fixed retention.
- B4: Adopt. Revise spec to require one shared full sensitive-term denylist for
  console/clipboard checks, including landmarks, world landmarks, media
  characteristics, filenames, object URLs, metric payloads, timestamps, hidden
  IDs, and the forward-carried `observedSeekTimestampMs`.
- B5: Adopt. Revise spec to require pixel-content nonblank canvas assertion.
- B6: Adopt. Revise spec to require mobile bounding-box overlap and clipping
  assertions for critical workflow controls and labels.
- B7: Adopt. Revise spec to require clipboard functional test and content
  minimization. Provide source excerpts for `copySwingCardPrompt`,
  `prepareSwingCardContent`, and `buildSwingCardPrompt` in the focused
  re-review prompt.

## Current Gate

Implementation remains blocked pending focused Claude re-review PASS.
