# SS-015 Browser Regression Research and Disposition

Checked: 2026-06-29

## Scope

SS-015 adds browser regression coverage for the current MVP local-first flow:
upload/capture placeholder, processing, review, Swing Card export, consent
gate, mobile layout, no-network privacy coverage where feasible, failed-run
artifacts, and CI execution.

This story is privacy-, browser-automation-, CI-, export-, and user-facing-copy
sensitive. Codex is acting as the research/spec owner under the 2026-06-26
LLM-team routing update. Claude remains the independent QA planning and final
audit reviewer.

## Current Repository Baseline

- `playwright.config.ts` already uses `test-results` as the Playwright output
  directory and retains traces on failure.
- `test/smoke/app.spec.ts` already exercises consent fail-closed paths, local
  fixture upload, local MediaPipe inference, phase review, Swing Card export,
  selected mobile layout checks, and a route-based no-external-network
  inference case.
- `.github/workflows/compliance.yml` currently runs dependency/license checks,
  SBOM generation, build, and compliance verification, but does not run
  `npm run test:smoke`.
- The current privacy architecture requires raw swing video and frame pixels to
  remain local by default and blocks remote sharing unless a future feature adds
  separate explicit opt-in.

## Source Checks

- Playwright configuration docs, checked 2026-06-29:
  https://playwright.dev/docs/test-configuration
  - Relevant facts: Playwright supports `outputDir` for screenshots, videos,
    traces, and other artifacts; `webServer` can launch a local server; CI can
    use `forbidOnly`, retries, workers, and project configuration.
- Playwright network docs, checked 2026-06-29:
  https://playwright.dev/docs/network
  - Relevant facts: tests can monitor requests/responses and mock or abort
    requests with `context.route` or `page.route`.
- Playwright CI docs, checked 2026-06-29:
  https://playwright.dev/docs/ci
  - Relevant facts: Playwright suites can run in CI after browser dependencies
    are installed, and CI configuration should upload reports or artifacts when
    test diagnostics are needed.
- GitHub Actions artifact docs, checked 2026-06-29:
  https://docs.github.com/en/actions/tutorials/store-and-share-data
  - Relevant facts: workflow artifacts can persist generated files from jobs,
    including test outputs, for later inspection.

## Disposition

| Recommendation | Disposition | Reason |
| --- | --- | --- |
| Run the existing Playwright browser suite in CI. | Adopt | Directly satisfies "Tests run in CI" without changing runtime behavior. |
| Upload `test-results` or equivalent Playwright diagnostics from failed CI browser runs. | Adopt | Satisfies failed-run artifact acceptance and uses Playwright's existing output directory. |
| Strengthen no-network privacy coverage with request observation and route-based blocking from navigation start. | Adopt | Aligns with `docs/privacy-architecture.md` and current smoke-test patterns. Same-origin preview and `blob:` URLs remain allowed. |
| Add a separate browser fixture or external test dependency. | Defer | Current approved mannequin fixture already supports local browser flow coverage. SS-015 should not add dependencies or new fixture classes unless Claude QA identifies a gap. |
| Add camera capture behavior to make capture tests realistic. | Reject | Acceptance is for the capture placeholder. Camera capture remains out of scope and would add privacy/browser-permission behavior requiring separate review. |
| Add service-worker or network-layer runtime guards as part of SS-015. | Defer | SS-015 is test/CI coverage. Runtime network enforcement changes are broader than the accepted scope. |
| Add telemetry, remote logging, or hosted test reporting. | Reject | Conflicts with local-first privacy boundaries and is not needed for acceptance. |

## Implementation Boundary

SS-015 may change browser tests, Playwright configuration, CI workflow, and
test-facing helper code. It must not add remote sharing, telemetry, remote
logging, cloud storage, camera capture implementation, new workers, new
dependencies, SDK/provider/model assets, or raw personal video fixtures.
