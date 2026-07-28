# SS-019 Manual Accessibility QA Record

Date prepared: 2026-07-21

Status: Manual execution pending. This document records automated evidence,
the required manual scenarios, and residual risk. It is not a conformance
statement.

## Build under review

- Repository base SHA: `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.
- Implementation state: uncommitted SS-019 working tree on
  `ss-019-accessibility-design-hardening`; no implementation commit SHA exists
  yet. The final audit reviewed this uncommitted worktree through exact hashed
  evidence blocks and packets, including compact packet SHA-256
  `9f65d37449bfb614e9433b4f7a35126f8e856577fb759a6bb17bff5618767cc0`;
  see `docs/ss-019-claude-audit-rereview-raw-response.md`. PR preparation will
  commit the audited runtime/test contents. Any later runtime/test change
  requires renewed verification and audit; no manual execution is claimed.
- Automated environment: Node `v22.22.3`, npm `10.9.8`.
- Automated commands actually completed:
  - Full unit: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit'`
    — PASS, 24 files and 218 tests after the focused B-NEW1 repair.
  - Full browser smoke: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'`
    — PASS, 48 tests across desktop and mobile Chromium projects.
  - Build: `/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'`
    — PASS, 26 modules transformed; third-party notices generated.
  - `npm run compliance:verify` — PASS.
  - `npm run safety:verify` — PASS.
  - `npm run privacy:verify` — PASS.
  - `npm run docs:verify` — PASS.
  - `git diff --check` — PASS.

The 320 CSS-pixel automated path first verifies geometry in a real
`LOCAL_MODEL_INIT_FAILED` state, then reloads into a clean lifecycle and runs a
successful review, confirmation, and export path. Retry recovery is covered by
a separate passing smoke test. Neither automated path is manual AT evidence.

## Manual environment fields

No manual browser or assistive-technology run has been executed. For every
future run, record all fields below rather than inferring a PASS from automated
tests.

| Field | Current value |
| --- | --- |
| Tested implementation commit SHA | Unavailable; implementation is uncommitted |
| Date | Not run |
| OS and version | Not run / not recorded |
| Browser and version | Not run / not recorded |
| Viewport or physical device | Not run |
| Zoom | Not run |
| Text-spacing override | Not run |
| Input method | Playwright keyboard/mouse emulation completed; no manual input run |
| Assistive technology and version | VoiceOver unavailable/not run; NVDA unavailable/not run |
| Evidence reference | Full unit, smoke, build, and verifier output summarized above; no manual screenshot, recording, or observation |

## Scenario ledger

“Pending” means the expected behavior is implemented and may have automated
coverage, but a human has not verified it in the stated browser/AT setup.

| Workflow step / scenario | Expected result | Actual result and evidence | Residual risk / affected user / impact / workaround | Disposition |
| --- | --- | --- | --- | --- |
| Complete keyboard traversal: capture, consent, native picker, processing, review, confirmation, export, and Swing Card actions | Logical order, no keyboard trap, focus follows the approved target matrix | Pending manual. The full desktop/mobile Chromium smoke keyboard and Swing Card action path passed; bounded focus and event unit tests passed | Browser-native chooser and rerender timing can differ; keyboard and switch users; high impact; use visible controls and retry focus manually | Verify before sign-off |
| Visible two-layer focus on links, buttons, inputs, selects, and programmatic headings/status | White 2px inner outline at 2px offset plus dark outer ring; no obscured target | Pending manual. Exact tokens, geometry source, and contrast matrix have unit coverage | OS/browser rendering and clipping remain unobserved; keyboard users; medium-high impact | Verify before sign-off |
| VoiceOver announcements and landmarks | One main landmark; polite global/scoped ownership; no duplicate or missing announcements | Unavailable/not run. No VoiceOver version or browser combination was tested | Announcement timing varies by Safari/VoiceOver; screen-reader users; high impact; visible status remains available | Required manual run |
| NVDA announcements and landmarks | Same ownership and meaningful headings/groups in a supported Windows browser | Unavailable/not run. No Windows/NVDA environment was available | NVDA/browser combinations may expose different names or timing; screen-reader users; high impact | Required when environment is available |
| Consent guard and consent state change | Global announcer speaks once; visible `#app-visible-status` is accurate and non-live; focus returns to consent | Pending manual. Typed event and renderer ownership unit coverage passed | Storage failure and rapid toggles may change perceived timing; screen-reader users; medium impact | Verify before sign-off |
| Processing loading, progress, completion, failure, stop, and retry | `#processing-status` is the only scoped processing live region; numeric ticks do not chatter; terminal focus is current-token-only; stop uses the global owner once | Pending manual. Lifecycle partial-update, stale-token, stop, retry, and idempotency unit tests passed | Real worker timing and AT speech queue behavior remain untested; screen-reader and cognitive users; high impact | Verify before sign-off |
| Phase validation and confirmation | Global announcement occurs only when semantic key changes among `unsupported-input`, `review-required`, and `confirmed`; same-state rerenders are silent | Pending manual. Typed semantic-key implementation and event inventory are automated | A user may miss a repeated unchanged warning after moving elsewhere; visible `#phase-review-status` remains available | Adopt; verify timing |
| Duplicate announcements: consent, terminal completed/failed, phase validation/confirmation, download, print, copy | Exactly one declared live owner per event | Pending manual. Announcement inventory and typed action requests passed unit tests | AT may repeat names/status due to browser heuristics even with one DOM owner; screen-reader users; medium-high impact | Verify before sign-off |
| Native chooser cancel and focus return in each browser/AT | Cancel returns to visible `Choose a video`; hidden input focus redirects; successful selection returns to picker | Pending manual. Named success, cancel, and defensive-focus unit/smoke coverage is present | Native chooser cancel events and focus behavior vary by browser/OS; keyboard users; high impact | Required per tested browser |
| Disabled Begin, review/confirm, export, remote review, and busy Swing Card controls in browse mode | Each exposes its exact unique visible `aria-describedby` prerequisite/status | Pending manual. Renderer relationships are asserted in unit tests | Disabled-control descriptions are announced inconsistently across AT browse modes; screen-reader users; high impact | Required VoiceOver/NVDA check |
| Named structures: Local video source, Local pose processing, Review placeholder, Swing Card contents, Swing phase assignments, Select keyframe | Each generic container exposes its approved group name | Pending manual. Exhaustive labelled-generic inventory and renderer assertions passed | Role/name presentation varies by AT navigation mode; screen-reader users; medium impact | Verify before sign-off |
| Swing Card unavailable section and Remote model data disclosure | Labelled section is named by `Swing Card unavailable`; remote wrapper is a group and nested `.remote-model-disclosure` remains a native `dl` | Pending manual. Exact semantics and protected selector assertions passed | Nested group/list verbosity is browser/AT-dependent; screen-reader users; medium impact | Verify before sign-off |
| Annotated canvas | Canvas exposes its protected image name and scoped overlay description | Pending manual. Role/name/description relationships are automated | Pose geometry has no complete nonvisual equivalent; blind users; high impact; use textual phase/status information only | Defer complete equivalence; document limitation |
| 200% and 400% zoom or equivalent 320 CSS-pixel reflow | No page-level two-dimensional scroll, clipping, overlap, or unusable required control | Pending manual zoom verification. Automated 320px long-text, real-failure, and clean successful review, confirmation, and export geometry checks passed | Font metrics, browser zoom, and localization-like expansion remain unobserved; low-vision users; high impact | Required manual run |
| WCAG text-spacing override | Content and controls reflow without loss or overlap | Unavailable/not run | Custom text spacing can expose fixed-height issues; low-vision/dyslexic users; high impact | Required manual run |
| Forced colors/high contrast | System focus and semantic boundaries remain visible; no `forced-color-adjust: none` | Pending physical Windows High Contrast verification. Playwright forced-colors emulation and CSS checks passed | Emulation is not equivalent to Windows High Contrast on a physical system; low-vision users; high impact | Required when supported |
| Exact contrast surfaces and 44px scoped targets | All twelve approved token/surface pairs remain at least 3:1; practical interactive controls are at least 44 by 44 CSS pixels | Pending manual measurement. Exact token matrix passed unit computation | Device scaling and native form-control metrics may vary; motor/low-vision users; medium-high impact | Verify representative browsers |
| Long consent/status/error/prerequisite text and failed-processing distinctions | Text wraps; failure remains readable and distinguishable without color alone | Pending manual inspection. Automated 320px wrapping, failure, prerequisite, review, and export assertions passed | Extremely long translated/error strings were not manually inspected; cognitive/low-vision users; medium impact | Verify before sign-off |
| Desktop and actual mobile interaction | Desktop and physical mobile show no clipping/overlap and preserve focus/touch usability | Unavailable/not run on a physical mobile device; no desktop manual observation recorded | Mobile browser chrome, virtual keyboard, and touch target behavior remain unknown; mobile users; high impact | Required representative device run |
| Swing Card export panel, print preview, local download, and copy statuses | On-screen panel is readable; print/download/copy report accurate local status and restore initiating focus | Pending manual. Typed action focus/announcement tests passed; print preview and generated file were not manually inspected | Print drivers, download UI, clipboard permissions, and long export content vary; keyboard/screen-reader users; medium-high impact | Verify before sign-off |

## Approved non-blocking implementation notes

1. Awaited close preserves the old rendered view while controller cleanup is
   pending. Navigation and replacement-video callers render the destination
   exactly once only after cleanup settles. This prevents a premature render
   and stale callback mutation, but a slow cleanup can leave the old view
   visible briefly; manual testing should confirm the interval is understandable.
2. Phase announcements are intentionally keyed to semantic transitions, not
   every rerender. Repeated `unsupported-input`, `review-required`, or
   `confirmed` states remain silent to prevent chatter; the current visible
   warning remains available for review.

## Scope statement

SS-019 does not establish WCAG certification, legal compliance, universal
assistive-technology compatibility, or complete nonvisual equivalence. No
manual scenario may be marked PASS until its environment, expected and actual
result, evidence reference, and any defect or residual risk are recorded.
