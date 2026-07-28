# SS-019 Claude QA-Planning N1-N3 Second Focused Re-review Source Packet

Generated from confirmed main baseline b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1 on 2026-07-20. Paste docs/ss-019-claude-qa-second-rereview-prompt.md first, then this packet immediately after it. Together they are one self-contained handoff.

No SS-019 runtime/UI implementation, story branch, or PR exists. Claude closed B2/B5/B6 but left B1/B3/B4 and close/token precision open through N1-N3. This packet reviews specification and test-plan corrections only. Builder remains blocked.

Notion synchronization is not freshly claimed: SS-019 and SS-TC-023 refetches returned OAuth authorization required, and no mutation occurred. Last verified intended state remains 2. QA Planning (Claude), Pull Request empty, active branch main.

Omissions are deliberate. Unchanged policy documents are represented by complete AGENTS.md plus the protected boundaries embedded in the prompt/spec; no policy claim changed. Closed B2/B5/B6 implementation surfaces are regression contracts in the complete current spec and second response, and no implementation exists to diff. Unrelated source/tests, dependency lockfiles, generated bundles, service worker, manifest, notices, licenses, models, and SBOM are unchanged and outside N1-N3. Nine intentional untracked agent-guidance prompts remain preserved and omitted.

## Packet Manifest

| Kind | Path | Lines | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Complete current file | `AGENTS.md` | 70 | 3301 | `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e` |
| Complete current file | `.nvmrc` | 1 | 3 | `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56` |
| Complete current file | `index.html` | 22 | 820 | `786543eea8732ee944ca111dc0c3d908543fcfb08ff6e79252739907cb639365` |
| Complete current file | `package.json` | 38 | 1777 | `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0` |
| Complete current file | `docs/ss-019-claude-qa-second-raw-response.md` | 58 | 9541 | `bbb20afce2d73f3a7ff2fb86adf58458622041a192a3aa94c388f0fab3d15824` |
| Complete current file | `docs/ss-019-claude-qa-second-response.md` | 181 | 8608 | `7de75806560fad0a51538a712a8a6cb917950026d641e27791db2e3f4444fcb9` |
| Complete current file | `docs/ss-019-preimplementation-spec.md` | 742 | 43785 | `3931bb6005720ddaf12672c7769abe6ac1824db1262382ecfc5a013d5d2d8b6c` |
| Complete current file | `docs/ss-019-claude-qa-second-rereview-prompt.md` | 123 | 5670 | `f21839ef85ce326b9f14a139121c19d9b490a05671fed32e0b8f95b39b8b868d` |
| Complete current file | `docs/ss-019-claude-qa-rereview-prompt.md` | 139 | 7265 | `3437b7ff5fa2abaaf57f32f8df0f72598549a55ac515f0a448a1f2b339082f9f` |
| Complete current file | `src/main.ts` | 44 | 1248 | `e6987db744a7e8c2724e63336d30b2500821a8f293437ff9af82f1d2f8be87d6` |
| Complete current file | `src/app-events.ts` | 159 | 6822 | `6b9da4f5fd1aa8e45b6d14196b59082e0f45738bc5d6129c03334285e1e55b9e` |
| Complete current file | `src/app-renderer.ts` | 223 | 10945 | `7705e320427a5142930188ed3cebe7e0fe5760d8958446d8de2ee487d4b9c4e8` |
| Complete current file | `src/app-state.ts` | 182 | 5834 | `c9ae9732cac6808173dd7d759099114f225915d2ca97b557478221e39ffb09c9` |
| Complete current file | `src/analysis-lifecycle.ts` | 105 | 3821 | `cde9a6f811927ff93b0312c8663fdae599ae810672ab45083dca9ecf783f6bf0` |
| Complete current file | `src/phase-review-renderer.ts` | 131 | 6420 | `8d92b88b4afeaa0d6757f7a4fe1cb3c65d026a4853bce94e7bd348199b915ef2` |
| Complete current file | `src/remote-model-renderer.ts` | 38 | 1856 | `83b30d3ae95f529fc58192224bb129d41dee4fb6fbd5bb09eb681ed8b878eaef` |
| Complete current file | `src/keyframe-overlay-renderer.ts` | 40 | 1627 | `7780ae6558db6ef02613072b8cc3037a5df98ee9b3d8ea0e65275dfdf4e086d9` |
| Complete current file | `src/swing-card-actions.ts` | 130 | 4493 | `e0ee4400bd5a15c995c56fe146518ad3746adf75b39cebb485caf024a2e020f3` |
| Complete current file | `test/unit/analysis-lifecycle.test.ts` | 128 | 4238 | `f486920cc919b5f2e4a975745d697cde1d222278ca4f789fe51d82a3df3b33a5` |
| Complete current file | `test/unit/app-events.test.ts` | 54 | 1563 | `f3a5e94aff173401f31e5f2f1fc451f725524253bee092b6677d83194c71f2a7` |
| Complete current file | `test/unit/app-renderer.test.ts` | 147 | 5007 | `a3b7d7f0e81c116082a134c53ac6a66fe378d14fb46b4265b6fa50dfca2b245b` |
| Complete current file | `test/smoke/app.spec.ts` | 618 | 26942 | `bc22d1904050af53ec6d43845f3906c62cc9cf96779ac5af033fae2f8594835d` |
| Complete focused diff | `git diff -- CONTEXT.md` | 348 | 20905 | `f9baa3452684199b06e0dc725e1fb60cc16b42ac14ad0f747c7aa57cc9d2f5ca` |
| Complete focused diff | `first-rereview-spec -> second-rereview-spec` | 382 | 23605 | `dc2b3f970b700890a351d4383273ca8e4ed83d69ab655f52c8f21399ff93f12e` |
| Explicit absent record | `src/app-accessibility.ts` | 1 | 177 | `c905fe4751939fbd330f8f0c107b373b04eef1da1f42ca3c71b4d870cdab6ba9` |

## Mechanical Verification Contract

Every manifest row has exactly one sequential unique BEGIN/END block. Complete files are exact current bytes, diffs are freshly generated complete outputs, and the absent record is explicit. Readiness requires equal row/block counts, byte/hash/line matches, terminating newlines, no fence collision or truncation, raw-response session authenticity, and byte-for-byte diff regeneration.

## Exact Evidence Blocks

### 01 Complete current file: AGENTS.md

Lines: 70  
Bytes: 3301  
SHA-256: `ab89562e22eadc237987e6e34f16377ed9bf4d503af2e86d6939dff963a1b20e`

<!-- BEGIN EXACT BLOCK: 01 Complete current file: AGENTS.md -->
````````````````````````````````````````text
# Repository Guidelines

## Start With Current State

Read [`CONTEXT.md`](./CONTEXT.md) before starting work. Confirm the next task,
acceptance criteria, branch, and handshake status in the Swing Sync Notion task
database before implementation. After PR creation, audit results, or merge
state changes, keep Notion and `CONTEXT.md` synchronized.

Keep changes within the accepted story scope. For runtime changes, document
whether observability was added, intentionally unchanged, or deferred.

## Sensitive Story Rules

For safety, privacy, legal, medical, AI-coaching, model-provider, or
compliance-sensitive stories, keep roles explicit:

- Gemini researches and drafts specifications.
- Codex implements, verifies, and maintains repository state.
- Claude performs adversarial audit and re-review.

Treat Gemini research as input, not authority. Before implementation, classify
broad recommendations as Adopt, Revise, Defer, or Reject. Claude adversarial
review is required before a sensitive story is Done. After fixes, use a
separate focused re-review prompt containing prior findings, applied fixes,
relevant current context, verification, and a focused diff.

Browser-chat prompts must embed all required repository context; Gemini and
Claude Chat do not have filesystem or GitHub access.

After Claude or implementation feedback, convert repeatable lessons into
durable process updates. Prefer this loop: classify each finding as blocker,
non-blocking recommendation, or future work; update the spec and tests before
implementation when the finding changes acceptance or verification; get a
focused re-review for sensitive stories; then capture reusable rules in
`CONTEXT.md` and, when they affect future delivery, this file or the relevant
`.agents/skills/*/SKILL.md`. Do not rely on chat memory alone.

For sensitive verifier or documentation changes, audit packets should include
every changed tracked file or an explicit rationale for omission. Test evidence
should include named tests mapped to acceptance criteria or audit blockers when
coverage is part of the sign-off decision.

## Product And Compliance Boundaries

Preserve the local-first rules in
[`docs/privacy-architecture.md`](./docs/privacy-architecture.md): raw swing
video is not uploaded by default, and remote sharing requires a separate,
explicit opt-in. Do not make absolute privacy, safety, legal, deletion,
anonymity, or compliance claims.

Follow [`docs/safety-terms.md`](./docs/safety-terms.md) for user-facing and AI
coaching boundaries. Follow [`docs/licensing.md`](./docs/licensing.md) and
[`docs/models-licensing.md`](./docs/models-licensing.md) before adding
dependencies, reference-derived code, model assets, SDKs, or providers.

## Verification

Use Node 22 from `.nvmrc`. Run the checks required by the changed surface and
record results in the PR:

- Baseline runtime/docs changes: `npm run build` and
  `npm run compliance:verify`.
- Dependency, bundle, or licensing changes: also run `npm run license:audit`,
  `npm run verify:bundle-license-fixture`, and `npm run sbom:generate`.
- Targeted boundaries: run `npm run safety:verify` or
  `npm run privacy:verify` when those surfaces change.

Complete [`.github/pull_request_template.md`](./.github/pull_request_template.md)
and preserve required notices.
````````````````````````````````````````
<!-- END EXACT BLOCK: 01 Complete current file: AGENTS.md -->

### 02 Complete current file: .nvmrc

Lines: 1  
Bytes: 3  
SHA-256: `f14b4987904bcb5814e4459a057ed4d20f58a633152288a761214dcd28780b56`

<!-- BEGIN EXACT BLOCK: 02 Complete current file: .nvmrc -->
````````````````````````````````````````text
22
````````````````````````````````````````
<!-- END EXACT BLOCK: 02 Complete current file: .nvmrc -->

### 03 Complete current file: index.html

Lines: 22  
Bytes: 820  
SHA-256: `786543eea8732ee944ca111dc0c3d908543fcfb08ff6e79252739907cb639365`

<!-- BEGIN EXACT BLOCK: 03 Complete current file: index.html -->
````````````````````````````````````````text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f3f5f1" />
    <meta
      name="description"
      content="A local-first golf swing analysis workflow scaffold."
    />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' blob:; worker-src 'self' blob:; img-src 'self' blob: data:; media-src 'self' blob:; style-src 'self'; object-src 'none'; base-uri 'self'"
    />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>Swing Sync | New analysis</title>
  </head>
  <body>
    <main id="app"></main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
````````````````````````````````````````
<!-- END EXACT BLOCK: 03 Complete current file: index.html -->

### 04 Complete current file: package.json

Lines: 38  
Bytes: 1777  
SHA-256: `5b2b4c589f70cc27ebbd6be56eab4cf83e81ee814e1acbd0eef4b3c7934efeb0`

<!-- BEGIN EXACT BLOCK: 04 Complete current file: package.json -->
````````````````````````````````````````text
{
  "name": "swing-sync",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "description": "Local-first open-source AI golf swing analysis coach.",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/aggregate-notices.js",
    "build:bundle-license-fixture": "vite build --config vite.config.test.ts",
    "verify:bundle-license-fixture": "node scripts/verify-bundle-license-fixture.js",
    "license:audit": "npm run license:audit:fixtures && node scripts/verify-production-licenses.js",
    "license:audit:fixtures": "node scripts/verify-license-fixtures.js",
    "sbom:generate": "npx @cyclonedx/cyclonedx-npm --output-format JSON --output-file docs/sbom.json --omit dev --validate && node scripts/filter-sbom.js",
    "safety:verify": "node scripts/verify-safety-terms.js",
    "privacy:verify": "node scripts/verify-privacy-boundaries.js",
    "docs:verify": "node scripts/verify-docs-claims.js",
    "pose-assets:verify": "node scripts/verify-pose-assets.js",
    "fixture:verify": "node scripts/verify-fixtures.js",
    "compliance:verify": "node scripts/verify-compliance.js && npm run fixture:verify && npm run pose-assets:verify && npm run safety:verify && npm run privacy:verify && npm run docs:verify",
    "test:unit": "vitest run",
    "test:smoke": "playwright test"
  },
  "devDependencies": {
    "@cyclonedx/cyclonedx-npm": "^4.2.1",
    "@onebeyond/license-checker": "^2.2.0",
    "@playwright/test": "1.52.0",
    "@swing-sync-test/bundled-prohibited-package": "file:test/fixtures/bundled-prohibited-package",
    "rollup-plugin-license": "^3.7.1",
    "typescript": "^5.8.3",
    "vite": "^5.4.21",
    "vitest": "2.1.9"
  },
  "dependencies": {
    "@mediapipe/tasks-vision": "0.10.35"
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 04 Complete current file: package.json -->

### 05 Complete current file: docs/ss-019-claude-qa-second-raw-response.md

Lines: 58  
Bytes: 9541  
SHA-256: `bbb20afce2d73f3a7ff2fb86adf58458622041a192a3aa94c388f0fab3d15824`

<!-- BEGIN EXACT BLOCK: 05 Complete current file: docs/ss-019-claude-qa-second-raw-response.md -->
````````````````````````````````````````text
**FAIL**

Verification of this packet: 40 manifest rows (37 complete files, 2 focused diffs, 1 explicit-absent record) match 40 sequentially-numbered evidence blocks (01–40), no gaps or duplicates observed. I byte/hash-verified 6 blocks by hand-transcription (`.nvmrc`, `src/render-utils.ts`, `src/consent-state.ts`, `src/analysis-lifecycle.ts` in the prior round; the explicit-absent record and the full revised `docs/ss-019-preimplementation-spec.md` — 609 lines / 35,860 bytes — in this round). All 6 matched their manifest line count, byte count, and SHA-256 exactly. No handoff-completeness blocker.

I also independently recomputed the WCAG relative-luminance contrast ratios in B6's required matrix (11 token/surface pairs) using the standard formula. All 11 matched the spec's claimed values to two decimal places. That math is real, not asserted.

## B1–B6 and lead precision: status

**B1 (terminal-state focus/announcement) — OPEN.** The architecture itself is sound and directly answers the original failure: `applyAccessibilityIntent` gives a no-render path, controller-token identity checks make stale callbacks inert, and completed/failed callbacks now explicitly focus `stage-heading` through that no-render path while using the scoped processing-status channel for announcement. That resolves the original contradiction. But the fix changes two things the existing test suite still hard-codes: `closeActive()`'s render behavior and `requestRender`'s call signature. Two tests in `test/unit/analysis-lifecycle.test.ts` (verified byte-exact) directly contradict the new contract:
- `"clears lifecycle-owned controller handles and syncs app-state idle on close"` asserts `expect(requestRender).toHaveBeenCalledTimes(1)` immediately after calling `closeActive()` alone. The revised spec makes `closeActive()` cleanup-only with **no** render/focus/announcement — this assertion will fail (actual: 0 calls).
- `"re-renders capture controls after async close settles"` makes the same assertion after `lifecycle.closeActive()` resolves — same contradiction.

Neither test is named for removal or rewrite anywhere in the revised spec, the diff, or the "Additional named lifecycle/callsite tests" list (which only adds new tests alongside).

**Lead precision (close/token-race) — OPEN**, same root cause as B1: this is precisely the mechanism (`closeActive()` render ownership) the two tests above exercise.

**B2 (file-input cancel/focus-return) — CLOSED.** Removes the `aria-hidden` anti-pattern, adds `cancel` handling and `focus`/`focusin` redirection, and names exact tests for success, cancel, and redirect. No existing test asserted the old (now-removed) `aria-hidden="true"` behavior, so no conflict surfaces here.

**B3 (single announcement channel) — OPEN.** The architecture (exactly one polite channel per event, global vs. the two remaining scoped regions, inventory test) is structurally correct. But it requires stripping `role="status"`/`aria-live` from `.phase-warning`, `.status`, `[data-swing-card-status]`, and `[data-remote-model-status]`, and the existing, currently-passing `test/smoke/app.spec.ts` (verified byte-exact) contains:
```
await expect(page.locator(".phase-warning")).toHaveAttribute("aria-live", "polite");
```
This will fail once that attribute is removed, per the spec's own instruction. The spec never names this assertion for update. Separately, three existing smoke tests locate the visible `.status` paragraph via `page.getByRole("status")` (relying on its current `role="status"`); the spec doesn't say what populates that paragraph's text once its role is stripped, nor resolve the latent ambiguity that `#app-announcer` (always `role="status"`) and the scoped processing-status region can coexist with role="status" simultaneously during the processing view — a strict-mode-violation trap for any future test that queries `getByRole("status")` unscoped while on that step.

**B4 (mislabeled containers) — OPEN.** The fix list (`.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, `.swing-card-summary`, plus the wrapped `<dl>`) is correct as far as it goes, but it is still not exhaustive. I re-scanned every `aria-label` in the hash-verified `src/app-renderer.ts` against the same rule (bare `<div>`/non-naming-role elements don't expose `aria-label`) and found **three more unaddressed instances**: `<div class="processing-placeholder" aria-label="Local pose processing">`, `<div class="review-placeholder" aria-label="Review placeholder">`, and `<div class="export-placeholder" aria-label="Export placeholder">`. All three have the identical defect as the ones already fixed, and none appears in the revised spec's remediation list, test list, or manual-QA scope.

**B5 (closed focus-key registry / callsite completeness) — CLOSED.** I cross-checked literally every `requestRender` call site currently in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` (hash-verified) against the new complete callsite matrix — every one maps cleanly, including the previously-missing camera placeholder (now `camera-placeholder`). No unmapped callsite found.

**B6 (contrast tokens/geometry) — CLOSED.** Exact tokens, geometry, and 11 contrast ratios are specified and mathematically verified correct (computed independently above). Adjacent-surface coverage looks complete for reachable focusable states.

## Open/new blockers, by severity

**N1 (most severe) — `requestRender` signature migration and `closeActive()`'s new render-free contract leave two existing unit tests asserting behavior the spec explicitly forbids.**
Impact: guaranteed CI failure or, worse, an implementer silently deleting/rewriting protected test assertions without independent review — exactly the "test-selector churn without spec authorization" pattern this project's own process rules exist to prevent.
Correction: the spec must explicitly name `test/unit/analysis-lifecycle.test.ts`'s `"clears lifecycle-owned controller handles and syncs app-state idle on close"` and `"re-renders capture controls after async close settles"` tests, state exactly how each must be rewritten (removing the `requestRender` call-count assertion on `closeActive()` alone, or moving it to a caller-owned-render test), and fold that update into the already-listed `"keeps closeActive cleanup render-free for navigation picker replacement and beforeunload"` test rather than leaving both versions coexisting.

**N2 — B3's live-region consolidation isn't reconciled with existing protected smoke assertions.**
Impact: `test/smoke/app.spec.ts`'s `.phase-warning` aria-live assertion will fail as written; the visible `.status` paragraph's post-refactor text source and its interaction with the three existing `page.getByRole("status")` assertions is unspecified.
Correction: name the `.phase-warning` aria-live assertion for removal/replacement, state explicitly what text (if any) the visible `.status` paragraph shows after its role is stripped and whether the three existing `getByRole("status")` assertions are updated to target `#app-announcer` directly, and add a rule that any new test touching the processing view must scope status queries to avoid the announcer/scoped-region coexistence trap.

**N3 — B4's container-fix list is still incomplete.**
Impact: `.processing-placeholder`, `.review-placeholder`, and `.export-placeholder` ship with the same "aria-label silently dropped" defect this story exists to fix, in three of the four main workflow views.
Correction: add these three to the `role="group"`-or-equivalent remediation list, the renderer/smoke named-assertion list, and the manual-QA named-group checks (which currently name only `Swing Card contents` and `Remote model data disclosure`).

## AC gaps / missing evidence / boundary drift

- AC4 (automated regression coverage) has a concrete new gap: the test suite as specified would ship internally inconsistent (some tests assert the old `requestRender(string)`/render-on-close contract, others assert the new one) unless N1/N2 are resolved with named test updates, not just named test additions.
- AC2 (understandable labels) remains unmet for three more containers per N3.
- No safety/privacy/local-first/consent/remote-review/dependency/observability drift found — this remains clean.

## Non-blocking recommendations (unchanged from before, still valid)

- Clarify focus-idempotency: retry's own no-render focus-to-`stage-heading` call and the subsequent terminal callback's focus-to-`stage-heading` call target the same already-focused element, so no observable double-focus occurs — worth stating explicitly rather than leaving as an inference, since the named test `"retries without replacing the video DOM and moves focus once"` depends on that idempotency.
- Consider whether an assistive-technology-visible confirmation that the visible `.status`/`.phase-warning` paragraphs are still valid `aria-describedby` targets (per the spec's own claim) actually holds once their live-region roles are stripped — this is implied but not tested anywhere in the new plan.

## Result

**NOT CLEARED FOR IMPLEMENTATION.** B1, B3, B4, and the lead's close/token-race precision remain OPEN due to three concrete, verified test-suite contradictions (N1–N3) that the revised specification does not name or resolve. B2, B5, and B6 are CLOSED. Builder work and story-branch creation remain blocked until N1–N3 are incorporated into the specification and test plan and independently re-reviewed.
````````````````````````````````````````
<!-- END EXACT BLOCK: 05 Complete current file: docs/ss-019-claude-qa-second-raw-response.md -->

### 06 Complete current file: docs/ss-019-claude-qa-second-response.md

Lines: 181  
Bytes: 8608  
SHA-256: `7de75806560fad0a51538a712a8a6cb917950026d641e27791db2e3f4444fcb9`

<!-- BEGIN EXACT BLOCK: 06 Complete current file: docs/ss-019-claude-qa-second-response.md -->
````````````````````````````````````````text
# SS-019 Claude QA-Planning Second Response

Date: 2026-07-20

Claude verdict: **FAIL**.

Raw response: `docs/ss-019-claude-qa-second-raw-response.md`.

Lead-architect disposition: **B2, B5, and B6 are CLOSED and remain
regression-protected. B1, B3, B4, and the lead close/token-race precision are
OPEN through accepted blockers N1-N3.** Runtime/UI implementation, story-branch
creation, and builder delegation remain blocked pending specification/test-plan
correction and another independent Claude re-review.

## Finding Classification

| Prior finding | Second-review status | Lead disposition |
| --- | --- | --- |
| B1 terminal-state focus/announcement | OPEN via N1 | Accept N1 as blocker |
| Lead close/token-race precision | OPEN via N1 | Accept N1 as blocker |
| B2 file-input cancel/focus return | CLOSED | Preserve and regression-protect |
| B3 single announcement channel | OPEN via N2 | Accept N2 as blocker |
| B4 named container semantics | OPEN via N3 | Accept N3 as blocker |
| B5 focus-key/callsite inventory | CLOSED | Preserve and regression-protect |
| B6 contrast tokens/geometry | CLOSED | Preserve and regression-protect |

Claude found no handoff-completeness blocker and no safety, privacy,
local-first, consent, remote-review, dependency, or observability drift.

## N1 — Existing Test Migration For Render-Free Close Ownership

N1 is accepted. The revised `closeActive()` contract is cleanup-only and
render-free, but two existing tests still require a lifecycle-owned render.
The specification must authorize the exact migration instead of leaving old
and new contradictory tests together.

Lead decision:

- Rename `clears lifecycle-owned controller handles and syncs app-state idle on
  close` to `clears lifecycle-owned controller handles and syncs app-state idle
  on close without rendering`; assert zero `requestRender` and zero
  `applyAccessibilityIntent` calls.
- Remove/replace `re-renders capture controls after async close settles`.
  Relocate its SS-018 stale-capture intent into app-events tests named
  `awaits closeActive before rendering workflow navigation exactly once` and
  `awaits closeActive before selecting a replacement video and renders exactly
  once`. Both use a deferred close and prove the caller owns one typed
  destination render only after cleanup resolves.
- Update `stops active processing and requests an idle capture render` to assert
  the exact typed object with `focusKey: "stage-heading"` plus the existing
  stopped visible status text and announcement.
- Update every legacy `requestRender` mock/type and the camera app-events
  assertion to the exact typed payload. No old/new contradictory tests may
  coexist.

The exact accessibility types are:

```ts
interface AccessibilityIntent {
  focusKey?: FocusKey;
  announcement?: string;
}

interface RenderRequest extends AccessibilityIntent {
  visibleStatusText?: string;
}
```

`requestRender` passes `visibleStatusText` only to the non-live visible
`#app-visible-status` and passes `announcement` only to `#app-announcer`.
When visible text is absent, the existing consent-derived visible default is
used. An event may populate both fields with exact messages; only the announcer
is live.

## N2 — Live-Region And Existing Smoke-Locator Migration

N2 is accepted. The single-announcement-channel architecture is sound, but the
specification must explicitly migrate existing role-based smoke assertions and
close visible/scoped ownership ambiguity.

Lead decision:

- The non-live visible IDs are exactly `#app-visible-status`,
  `#phase-review-status`, `#swing-card-action-status`, and
  `#remote-model-status`.
- The only scoped live IDs are `#processing-status` and
  `#keyframe-overlay-status`.
- The stable global live region is `#app-announcer`.
- Stable visible text remains populated by `request.visibleStatusText`, app
  state, or the existing owning renderer path. Removing a live role must not
  remove state-accurate visible content.
- Replace all three existing unscoped `page.getByRole("status")` assertions —
  camera at line 117, consent guard at line 166, and stopped status at line 497
  of the reviewed smoke baseline — with direct `#app-announcer` assertions plus
  visible `#app-visible-status` text and no-role assertions.
- Retain every `.phase-warning` text assertion. Replace the reviewed line 221
  `aria-live="polite"` assertion with assertions for no status role, no
  `aria-live`, stable `id="phase-review-status"`, and the exact
  `aria-describedby` relationship.
- Unscoped status-role locators are prohibited in processing/review tests
  because global and scoped live regions coexist. Target exact IDs.
- Define the phase semantic transition key as exactly
  `unsupported-input | review-required | confirmed`. Send one global
  announcement only when the before/after key changes.
- The one-channel-per-event inventory must prove that each event has exactly
  one declared announcement owner.

## N3 — Exhaustive Generic-Container Naming Remediation

N3 is accepted. The semantic inventory must cover every reviewed instance of
the same unsupported generic-container naming pattern, not only the instances
identified in the first review.

Lead decision:

- Add `role="group"` while retaining the exact accessible name for:
  - `.capture-options`: `Local video source`;
  - `.processing-placeholder`: `Local pose processing`;
  - `.review-placeholder`: `Review placeholder`;
  - `.swing-card-summary`: `Swing Card contents`;
  - `.phase-assignment-list`: `Swing phase assignments`;
  - `.keyframe-strip`: `Select keyframe`.
- Convert `.export-placeholder` to
  `<section aria-labelledby="export-placeholder-heading">`, using the existing
  `Swing Card unavailable` heading with stable
  `id="export-placeholder-heading"`.
- Wrap the native `.remote-model-disclosure` `<dl>` in a named
  `role="group"` with exact name `Remote model data disclosure`; retain the
  nested native `<dl>` semantics.
- Add named renderer, smoke, and manual assertions for every listed group or
  region and the nested `<dl>`.
- Add an inventory test that rejects bare labelled generic containers.

## Adopted Precision

Retry focus is idempotent: the focus helper does not call `.focus()` when the
target is already `document.activeElement`. Retry followed by a terminal state
without intervening focus therefore invokes DOM focus once total; a terminal
state may focus once when the user has moved elsewhere.

Every visible description target has an exact, unique ID, retains
state-accurate text, and has direct relationship assertions from the described
control. Manual QA includes browse-mode verification for disabled controls.

## Closed Findings Retained As Regression Contracts

- B2 remains closed: `#video-file` is not `aria-hidden`, and success, native
  cancel, and defensive focus return restore the visible picker through named
  automated/manual cases.
- B5 remains closed: the static and bounded dynamic focus-key grammar, exact
  fallbacks, and complete render/no-render callsite inventory remain required.
- B6 remains closed: exact focus/boundary tokens, two-layer geometry, eleven
  enumerated surface ratios, the `>= 3:1` threshold, CSS-reading unit coverage,
  computed-style smoke checks, and forced-colors behavior remain required.

## Protected Boundaries And Observability

Protected safety/privacy/non-affiliation copy, local-first raw-media handling,
consent, remote-review-disabled behavior, service-worker behavior, exported
data classes, protected labels, and smoke selectors remain unchanged.

Observability remains intentionally unchanged. Do not add telemetry, analytics,
remote logging, cloud diagnostics, provider SDKs, model assets, hidden
identifiers, persistent debug artifacts, or expanded console output. No
dependency, framework, bundle, license-policy, notice, or SBOM change is
approved.

## Notion Synchronization Exception

Live refetches of SS-019 and SS-TC-023 failed on 2026-07-20 because the Notion
connector returned `Auth error: OAuth authorization required`. No Notion
mutation occurred. The last verified status remains `2. QA Planning (Claude)`,
but that is not a fresh live tracker verification.

## Next Gate

The lead architect must revise the preimplementation specification and exact
named test-migration contracts for N1-N3. The workflow coordinator must then
persist a new self-contained focused re-review prompt and complete source packet.
Claude must independently close B1, B3, B4, the lead close/token-race precision,
and N1-N3 before implementation, story-branch creation, or builder delegation.
````````````````````````````````````````
<!-- END EXACT BLOCK: 06 Complete current file: docs/ss-019-claude-qa-second-response.md -->

### 07 Complete current file: docs/ss-019-preimplementation-spec.md

Lines: 742  
Bytes: 43785  
SHA-256: `3931bb6005720ddaf12672c7769abe6ac1824db1262382ecfc5a013d5d2d8b6c`

<!-- BEGIN EXACT BLOCK: 07 Complete current file: docs/ss-019-preimplementation-spec.md -->
````````````````````````````````````````text
# SS-019 Preimplementation Specification

Date: 2026-07-20

Status: Revised after the second Claude QA-planning FAIL. B2, B5, and B6 are
closed and regression-protected. B1, B3, B4, the lead close/token-race
precision, and accepted N1-N3 remain blocked pending focused Claude re-review.
Implementation and branch creation remain blocked until Claude returns PASS
and explicitly clears every open blocker.

Task: SS-019 Perform accessibility and responsive design hardening.

Branch after QA-planning clearance:
`ss-019-accessibility-design-hardening`, created from confirmed `main` at
`b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`.

## Objective

Make the current MVP workflow a dependable keyboard, screen-reader,
manual-testing, responsive-layout, and public-demo surface without decorative
redesign or changes to product scope. Preserve the current local-first consent,
processing, phase-review, Swing Card, remote-review-unavailable, safety,
privacy, medical-scope, and non-affiliation contracts.

## Protected Baseline

- Preserve all existing protected user-facing labels, workflow copy, safety and
  privacy meaning, and smoke-test selectors unless this specification names the
  exact semantic-only addition.
- Preserve local-only raw-video/frame handling and explicit consent gating.
- Preserve remote review as unavailable; do not add remote sharing, providers,
  SDKs, model assets, cloud services, or hidden identifiers.
- Preserve app-state/exported-data contracts, service-worker behavior, CSP,
  manifest behavior, and persistence behavior.
- Add no telemetry, analytics, remote logging, cloud diagnostics, persistent
  debug artifacts, expanded console output, or runtime operator diagnostics.
- Add no dependency, framework, bundle-policy, license-policy, notice, or SBOM
  change.
- Do not make absolute accessibility, safety, privacy, legal, deletion,
  anonymity, medical, or compliance claims.

## Approved File Scope And Ownership

### `index.html`

- Change only the `#app` host element from `<main id="app">` to
  `<div id="app"></div>` so `src/app-renderer.ts` supplies the page's one main
  landmark.
- Add a stable visually hidden sibling announcer:
  `<div id="app-announcer" class="visually-hidden" role="status"
  aria-live="polite" aria-atomic="true"></div>`.
- The announcer must remain outside the replace-on-render `#app` subtree.
- Keep the CSP meta content, manifest link, description, viewport metadata, and
  static `<title>Swing Sync | New analysis</title>` text otherwise unchanged.
  Runtime code updates it after render to exactly `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` according to the active workflow view.

### New `src/app-accessibility.ts`

Own the DOM-only accessibility coordination contract. It must not import or
mutate app-state persistence.

- Define the exact contracts:

  ```ts
  interface AccessibilityIntent {
    focusKey?: FocusKey;
    announcement?: string;
  }

  interface RenderRequest extends AccessibilityIntent {
    visibleStatusText?: string;
  }
  ```

  A render request may contain a closed focus intent, non-live visible status
  text, and at most one global polite announcement. An absent request means an
  ordinary render with no announcement and the existing consent-derived
  visible status default.
- Own both post-render intent application and
  `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
  no-render path: it validates, focuses, or announces against the existing DOM
  only and must not replace DOM, mutate app state, rebind events, redraw the
  canvas, or touch controller-owned media.
- The closed static focus keys are exactly: `safety-consent`,
  `camera-placeholder`, `video-picker`, `analysis-start`, `stage-heading`,
  `workflow-next`, `stop-analysis`, `retry-analysis`, `review-phases`,
  `phase-declaration:view`, `phase-declaration:handedness`,
  `phase-declaration:mirrored`, `phase-setup`, `phase-confirmation`,
  `phase-confirm`, `open-export`, `phase-review-heading`,
  `swing-card-heading`, `swing-card-download`, `swing-card-print`,
  `swing-card-copy`, and `swing-card-status`.
- The only dynamic keys are exactly
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Validation must reject
  arbitrary strings, selector syntax, unknown prefixes, and out-of-range or
  non-integer indices.
- Capture the prior active element only when its `data-focus-key` passes that
  closed validator. Resolve known keys by comparing attribute values; never
  accept or persist caller-provided CSS selectors.
- Restore focus after render in this order: valid explicit target; valid prior
  target; exact per-view fallback. Capture and processing fall back to
  `stage-heading`; review falls back to `phase-review-heading` when phase
  outputs exist and otherwise `stage-heading`; export falls back to
  `swing-card-heading` when phase outputs exist and otherwise `stage-heading`.
- A target is focusable only when connected, visible, not hidden, not
  `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
  Programmatic headings/status targets may use `tabindex="-1"`; positive
  tabindex is prohibited.
- Focus application is idempotent. When the resolved target already equals
  `document.activeElement`, do not call `.focus()` again. Retry followed by a
  terminal callback without intervening user focus therefore invokes DOM focus
  once total; if the user moves focus after retry, the current terminal callback
  may focus the processing heading once.
- Update the stable `#app-announcer` using `textContent` only. All current
  announcements, including failures, use polite priority. Assertive is
  deliberately rejected because none of these events requires interruption.
- Export pure or DOM-injected seams sufficient for bounded-key, target-order,
  target-eligibility, exact fallback, text-only announcer, and no-render intent
  tests.

### `src/main.ts`

- Replace `requestRender(statusMessage?: string)` with
  `requestRender(request?: RenderRequest)` and expose/inject
  `applyAccessibilityIntent(intent: AccessibilityIntent)` alongside it.
- `requestRender` is the only full-render accessibility path.
  `applyAccessibilityIntent` delegates to the helper against the current root
  and stable announcer and must never replace DOM.
- Before replacing `#app.innerHTML`, capture the current valid focus key.
- Render the current view, bind fresh events, and redraw the selected keyframe
  canvas using the existing ownership order.
- Set `document.title` exactly to `Swing Sync | Capture`,
  `Swing Sync | Processing`, `Swing Sync | Review`, or
  `Swing Sync | Export` for the active view without rewriting protected body
  copy.
- After render, binding, canvas redraw, and title update, restore focus using the
  request's explicit intent, then prior key, then safe current-view fallback.
- Send any explicit request announcement to the stable announcer. Do not
  announce on every full render.
- Pass `request.visibleStatusText` only to the non-live
  `#app-visible-status`. Pass `request.announcement` only to
  `#app-announcer`. An exact event message may populate both fields so the same
  information is visible and announced, but only `#app-announcer` is live.
  When `visibleStatusText` is absent, retain the current consent-derived
  visible default rather than clearing or fabricating status.
- Keep `#app` stable, keep global `beforeunload` and
  `securitypolicyviolation` listeners unchanged in behavior, and keep
  production service-worker registration unchanged.

### Announcement-Channel Invariant

Each semantic event uses exactly one announcement channel: global or scoped,
never both.

- The stable global announcer is canonical for full-render shell, workflow,
  consent, camera, video, phase-review, and Swing Card events.
- The non-live visible IDs are exactly `#app-visible-status`,
  `#phase-review-status`, `#swing-card-action-status`, and
  `#remote-model-status`. They retain state-accurate text from
  `request.visibleStatusText`, app state, or their existing renderer-owned
  paths, but have no `role="status"`, `aria-live`, or other live-region role.
- Scoped live regions exist only at `#processing-status` for in-place
  processing state and `#keyframe-overlay-status` for imperative overlay
  status. An event using either scoped channel passes no global announcement.
- The stable global live region is exactly `#app-announcer`.
- Processing/review tests must not use an unscoped status-role locator because
  the global announcer and a scoped processing status may coexist. Tests target
  the exact owning ID.
- Phase semantic state is keyed exactly as `unsupported-input`,
  `review-required`, or `confirmed`. A phase transition sends one global
  announcement only when the before/after semantic key changes. Rerenders that
  preserve the key do not announce again.
- All channels are polite. Assertive is rejected to avoid interrupting the
  current task.
- A named unit inventory test, `uses exactly one announcement channel for every
  mapped event`, must fail if a mapped callsite has both channels or no declared
  channel.

### Complete Focus And Announcement Callsite Matrix

Every current or approved `requestRender` and no-render accessibility callsite
in `app-events.ts`, `analysis-lifecycle.ts`, and `swing-card-actions.ts` is
normative below. There may be no additional unmapped callsite or intent.

| Owner / event | Render path | Focus target | Sole announcement channel |
| --- | --- | --- | --- |
| Events: consent change | Full render | `safety-consent` | Global consent-ready/required message when meaning changes |
| Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
| Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
| Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
| Events: workflow step button | Await `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
| Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
| Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
| Events: picker `change` with a file | Await `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
| Events: picker `cancel` | No render | `video-picker` | None |
| Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
| Events: camera placeholder | Full render with typed visible text and announcement | `camera-placeholder` | Global camera-out-of-scope message |
| Events/lifecycle: Stop local analysis | Full render owned by `stopActive`, with exact typed visible text and announcement | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
| Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
| Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
| Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
| Events: handedness declaration | Full render | `phase-declaration:handedness` | None unless a new validation result requires one global message |
| Events: mirrored declaration | Full render | `phase-declaration:mirrored` | None unless a new validation result requires one global message |
| Events: setup declaration | Full render | `phase-setup` | None unless a new validation result requires one global message |
| Events: phase assignment | Full render | Exact bounded `phase-assignment:<0..7>` | None unless a new validation result requires one global message |
| Events: confirmation checkbox | Full render | `phase-confirmation` | None unless a new validation result requires one global message |
| Events: Confirm phase review | Full render | `phase-review-heading` | Global confirmation or validation-failure message |
| Events: Open Swing Card export | Full render | `swing-card-heading` | Global export-opened message |
| Events: keyframe selection | Full render and overlay redraw | Exact bounded `keyframe:<0..7>` | Scoped imperative overlay status only; no global message |
| Lifecycle: loading/processing state callback | Partial DOM update | No change | Scoped processing state only |
| Lifecycle: progress callback | Partial DOM update | No change | None when only numeric progress changes |
| Lifecycle: output callback | Partial DOM update | No change | None |
| Lifecycle: current-controller completed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: current-controller failed callback | Originating controller/token identity check, partial DOM update, then no-render intent | Processing `stage-heading` only when the captured controller/token equals the active controller and the processing view is current | Scoped processing state only |
| Lifecycle: late/stale terminal callback or terminal callback outside processing view | Partial/no-op against current DOM | No change | None; no visible scoped target means no announcement |
| Lifecycle: cancelled/closed callback | Partial/no-op | No change | None; `stopActive` owns stopped status, while close and callback are silent |
| Lifecycle: `closeActive()` from workflow navigation | Cleanup and state reset only; no render | No change | None; navigation caller owns one destination render/message |
| Lifecycle: `closeActive()` from picker change | Cleanup and state reset only; no render | No change | None; picker caller owns one selection render/message |
| Lifecycle: `closeActive()` from `beforeunload` | Cleanup and state reset only; no render | No change | None |
| Swing download start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing download completion/failure | Full render | `swing-card-download` | Global result message |
| Swing print start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing print completion/failure | Full render | `swing-card-print` | Global result message |
| Swing copy start | Full render | `swing-card-status` | Global preparing message; visible status is not live |
| Swing copy completion/failure | Full render | `swing-card-copy` | Global result message |

The inventory test must cover both runtime guard failures; consent; begin;
workflow and next-step controls; picker success/cancel/redirect; camera;
stop/retry; review; all declaration/setup/assignment/confirmation/confirm
paths; export; keyframe; every lifecycle callback; render-free `closeActive()`
for navigation, picker replacement, and `beforeunload`; and download/print/copy
start, completion, and failure. Delayed terminal callbacks and same-control
focus tests must prove an open phase select cannot lose focus to stale
processing.

### Analysis-Lifecycle Partial/Terminal Contract

- `updateProcessingProgressUi(root, state)` remains a partial renderer and may
  change only safe text and `hidden` properties. The processing **state text**
  element alone has `role="status" aria-live="polite" aria-atomic="true"`.
  Numeric `[data-pose-summary]` remains outside that live region so progress
  ticks are not announced.
- Loading, processing, progress, and output callbacks call the partial update
  only. They never call the global announcer and never move focus.
- Each controller's callback closures capture that originating controller's
  identity or an equivalent unique token. Every callback checks that token
  before any state, output, DOM, focus, or announcement mutation; a stale token
  returns immediately without changing anything. Completed/failed callbacks
  with a current token update state/output and current processing DOM, making
  the scoped processing state the sole announcement. They then call the
  no-render accessibility intent to focus `stage-heading` only when
  `state.activeStep === "processing"` and the captured controller/token still
  equals the active controller/token.
- A late/stale terminal callback, or any terminal callback after navigation
  away from processing, must not steal focus or announce.
- `stopActive()` synchronously invalidates the active callback token before it
  awaits `cancel()`, while retaining a local controller reference for resource
  release. It then owns the stopped/released full render, announcement, and
  capture-view focus. A terminal callback racing the await sees a stale token
  and returns before mutation; cancelled callbacks do not duplicate the owner.
- `closeActive()` performs controller cleanup, handle clearing, phase/
  processing state reset, and nothing else: no render, focus, or announcement.
  It synchronously invalidates the active callback token before awaiting
  `close()`, while retaining a local controller reference for resource release.
  A racing callback is therefore stale before any mutation. Workflow-navigation
  and picker-change callers await cleanup and then each own their single
  destination render/focus/announcement. They must not render before the close
  promise settles. `beforeunload` calls cleanup with no render.
  Closed callbacks remain silent.
- `retryActive` applies no-render focus to `stage-heading` once and relies on
  the subsequent scoped loading/failed/completed state. It must not full-render
  or replace the controller-owned `#analysis-video` node. If the terminal
  callback resolves the same already-active heading, the idempotent helper does
  not call `.focus()` again; if the user moved elsewhere, the current terminal
  callback may focus it once.
- Existing protected labels/selectors, local resource release, and
  remote-review-unavailable behavior remain unchanged.

### Adopted Claude Precision Notes (Non-Blocking)

The exact four document titles, exact per-view fallback targets, bounded
dynamic focus-key grammar, and polite-only announcement priority are adopted as
precision within B1-B6 remediation. They make the existing keyboard, focus,
status, and test contracts implementation-ready; they do not expand SS-019
acceptance criteria or product scope.

### Closed Findings Retained As Regression Contracts

- B2 is closed, not reopened: keep the file input out of sequential order
  without `aria-hidden`, and preserve named success, native-cancel, and
  defensive focus-return coverage.
- B5 is closed, not reopened: preserve the exact static/bounded dynamic key
  grammar, exact per-view fallbacks, and complete render/no-render callsite
  inventory.
- B6 is closed, not reopened: preserve the exact three tokens, two-layer focus
  geometry, eleven enumerated surface ratios, `>= 3:1` executable threshold,
  CSS-reading unit checks, computed-style smoke checks, and forced-colors
  behavior.

### Renderer Semantics

Apply changes in `src/app-renderer.ts`, `src/phase-review-renderer.ts`, and
`src/remote-model-renderer.ts` while keeping current protected copy, labels,
and selectors byte-for-byte unless an attribute-only change is required.

- Add stable `data-focus-key` attributes to every mapped focus target.
- Keep one renderer-owned `<main class="workspace">` landmark.
- Keep the visible `Choose a video` button as the keyboard trigger and give it
  `data-focus-key="video-picker"`. Give `#video-file` `tabindex="-1"` and the
  accurate defensive accessible label `Choose a local video file`; do **not**
  set `aria-hidden="true"`.
- Add picker `cancel` handling that no-render focuses the current visible
  picker. Add `focus` and/or `focusin` redirection from the file input to the
  visible picker for browsers that return focus to the input after chooser
  close. Successful `change` always full-renders with explicit picker focus.
- Use `role="group"` and retain the exact accessible name for every reviewed
  labelled generic container:
  - `.capture-options`: `Local video source`;
  - `.processing-placeholder`: `Local pose processing`;
  - `.review-placeholder`: `Review placeholder`;
  - `.swing-card-summary`: `Swing Card contents`;
  - `.phase-assignment-list`: `Swing phase assignments`;
  - `.keyframe-strip`: `Select keyframe`.
- Convert `.export-placeholder` to
  `<section class="export-placeholder" aria-labelledby="export-placeholder-heading">`.
  Preserve the existing visible `Swing Card unavailable` heading and give that
  heading stable `id="export-placeholder-heading"`.
- Preserve the native `<dl class="remote-model-disclosure">` role and protected
  class selector. Wrap it in a named `role="group"` container for
  `Remote model data disclosure`; never override the `<dl>` role.
- Render each phase's visible label as a real `<h3>` while preserving its text
  and association with its assignment control.
- Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
  relationship to a stable overlay-status element. Preserve the existing
  protected canvas label text.
- Give only the processing state text exact `id="processing-status"` and the
  imperative overlay status exact `id="keyframe-overlay-status"`, scoped polite
  status semantics, and `aria-atomic="true"`. Keep numeric
  `[data-pose-summary]` outside the processing live region.
- Give visible `.status` exact `id="app-visible-status"`, `.phase-warning`
  exact `id="phase-review-status"`, `[data-swing-card-status]` exact
  `id="swing-card-action-status"`, and `[data-remote-model-status]` exact
  `id="remote-model-status"`. Remove `role="status"`, `aria-live`, and other
  live-region roles from all four. They remain populated, visible,
  state-accurate text and valid `aria-describedby` targets.
- The complete renderer inventory must reject any bare `aria-label` on a
  generic element that lacks a naming role or equivalent native named
  structure. The listed groups/regions and the wrapped native `<dl>` are the
  exhaustive current-main remediation set.
- Do not add live-region semantics to static explanatory paragraphs.
- Keep dynamic status text on `textContent`/escaped paths.

Disabled controls must have both a visible dynamic prerequisite/explanation
and an exact `aria-describedby` relationship when disabled:

- `#analysis-button` describes `#app-visible-status`: explain whether safety
  acknowledgement, local video, or processing availability is the current
  prerequisite.
- `[data-review-phases]` and `[data-confirm-phase-review]`: explain whether
  processing output, declaration completeness, phase assignments, or explicit
  confirmation is missing through exact target `#phase-review-status`.
- Unavailable export/open-export controls describe exact target
  `#phase-review-status`, which explains which valid/confirmed phase state is
  required.
- `[data-remote-model-send]` describes exact target `#remote-model-status`,
  retaining the provider-review/configuration and explicit remote-sharing
  boundary explanation.
- Busy `[data-download-swing-card]`, `[data-print-swing-card]`, and
  `[data-copy-swing-card-prompt]` describe exact target
  `#swing-card-action-status`, which reports the current local export action;
  restore focus to the initiating action after completion or failure.

Descriptions must reflect current state and must not claim remote availability,
successful persistence, privacy guarantees, or completed analysis when those
states are not true. Every description ID is unique in the rendered document.
Unit and smoke tests directly assert the owning control-to-ID relationship and
the state-accurate visible text. Manual QA includes browse-mode verification
that disabled controls expose their descriptions in the tested AT/browser.

### `src/styles.css`

- Define exact custom properties `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`.
- The two-color `:focus-visible` geometry is exactly a 2 CSS-pixel white inner
  outline with 2-pixel offset plus a dark outer ring that leaves at least 2 CSS
  pixels visible beyond the inner ring; a 6-pixel outer spread is an approved
  implementation. Cover links, buttons, inputs, selects, and programmatically
  focused headings/status targets.
- Forced-colors mode must retain UA/system focus and semantic boundaries.
  `forced-color-adjust: none` is prohibited.
- Required computed contrast ratios are:

| Token pair | Required ratio |
| --- | ---: |
| `#17211b` vs `#ffffff` | 16.54:1 |
| `#17211b` vs `#f3f5f1` | 15.07:1 |
| `#17211b` vs `#f8faf7` | 15.76:1 |
| `#17211b` vs `#e7f0e9` | 14.21:1 |
| `#17211b` vs `#eaf3ec` | 14.59:1 |
| `#ffffff` vs `#17211b` | 16.54:1 |
| `#ffffff` vs `#245b3b` | 7.97:1 |
| `#607367` vs `#ffffff` | 5.07:1 |
| `#607367` vs `#f3f5f1` | 4.62:1 |
| `#607367` vs `#f8faf7` | 4.83:1 |
| `#607367` vs `#e7f0e9` | 4.35:1 |
| `#607367` vs `#eaf3ec` | 4.47:1 |

Every enumerated focus/interactive-boundary pair must remain at least 3:1.
- Give scoped interactive controls a 44-by-44 CSS-pixel minimum target where
  practical. Do not inflate passive content or apply a global layout minimum.
- Ensure programmatically focused stage/phase/export headings are visibly
  indicated and not obscured.
- Add `min-width: 0`, wrapping, flex/grid stacking, and `overflow-wrap` rules to
  action rows, disclosure/metadata values, phase assignments, keyframe controls,
  statuses/errors, and Swing Card controls as required.
- Add readable failed-processing styling that does not rely on color alone and
  preserves actionable retry/review distinctions.
- At 320 CSS pixels, the primary workflow must reflow without two-dimensional
  page scrolling, clipped text, overlapping controls, or an unreadable export
  panel, except for content that WCAG explicitly permits to remain two
  dimensional. No such exception is currently planned for the app workflow.
- Support forced-colors mode by retaining semantic borders/focus indicators and
  system color adaptation. Do not use `forced-color-adjust: none` to opt the app
  out.
- Preserve the existing reduced-motion behavior.
- Make no decorative redesign, workflow-obscuring restyle, or brand refresh.

## Automated Test Plan

All sign-off evidence must list named tests and map them to the acceptance
criterion and any future Claude blocker they cover.

### New `test/unit/app-accessibility.test.ts`

Add named tests for:

- accepting only known `data-focus-key` values and rejecting arbitrary selector
  strings;
- explicit focus target taking precedence over prior and fallback targets;
- previous known focus restoration when no explicit intent is supplied;
- visible/enabled fallback behavior when explicit/prior targets are absent;
- hidden, disconnected, disabled, `aria-hidden`, inert, and hidden-ancestor
  targets being rejected;
- no valid target producing a safe no-op;
- programmatic `tabindex="-1"` target focus with no positive tabindex;
- stable announcer update through `textContent`, including no update when the
  render request has no announcement.
- `applyAccessibilityIntent` operating without DOM replacement and sharing the
  same bounded-key/target validation as post-render intent application;
- exact bounded dynamic-key rejection and exact per-view fallbacks;
- file-picker cancel and hidden-input focus redirection to `video-picker`;
- every current mapped callsite using exactly one declared announcement
  channel.
- idempotent focus application that does not call `.focus()` when the resolved
  target already equals `document.activeElement`, including retry followed by
  terminal focus with and without intervening user focus.

Picker coverage must use the exact named tests
`returns focus to the picker after successful keyboard-opened selection`,
`returns focus to the picker on native chooser cancel without rendering`, and
`redirects hidden file input focus to the picker without positive tabindex`.

### New `test/unit/accessibility-contrast.test.ts`

Add a named unit suite that reads the exact CSS custom properties, asserts the
three required token values, computes the ratio matrix for every enumerated
surface, and fails below 3:1 or when a token/surface mapping changes.

### Renderer And Event Unit Tests

Extend existing focused unit suites to directly assert:

- exactly one main landmark across the static host and rendered shell;
- protected labels/selectors remain present;
- `#video-file` retains its selector/accept behavior but has
  `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
- stage, phase-review, Swing Card, same-control, and action-status focus keys;
- exact named group/native semantics for `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing Card contents`,
  `Swing phase assignments`, and `Select keyframe`; the named export-placeholder
  section and `Swing Card unavailable` heading relationship; and the named
  remote-disclosure wrapper with its nested native `<dl>` semantics;
- an exhaustive inventory test that rejects bare labelled generic containers;
- heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
  IDs, scoped status semantics, and removed live roles from global-owner text;
- exact disabled-control `aria-describedby` targets and visible dynamic
  prerequisite text for Begin analysis, review/confirm, export, remote review,
  and busy Swing Card actions;
- every event/lifecycle/export path in the complete callsite table issues the
  exact typed focus/announcement request and has no unmapped callsite;
- render/rebind behavior remains single-effect and progress ticks do not
  refocus or announce every tick.
- Exact migration of existing tests is mandatory:
  - rename `clears lifecycle-owned controller handles and syncs app-state idle
    on close` to `clears lifecycle-owned controller handles and syncs app-state
    idle on close without rendering`; assert zero `requestRender` and zero
    `applyAccessibilityIntent` calls;
  - remove/replace `re-renders capture controls after async close settles`;
    relocate its SS-018 stale-capture intent into app-events tests named
    `awaits closeActive before rendering workflow navigation exactly once` and
    `awaits closeActive before selecting a replacement video and renders
    exactly once`; both use a deferred close and prove no render before it
    settles followed by one caller-owned typed request;
  - update `stops active processing and requests an idle capture render` to
    assert the exact typed request containing `focusKey: "stage-heading"`, the
    existing stopped `visibleStatusText`, and the same `announcement`;
  - update all legacy `requestRender` mocks/types and the camera app-events
    assertion to the exact `RenderRequest` payload.
  No old and new contradictory test may coexist.
- named lifecycle tests exactly:
  - `keeps progress ticks partial without global announcements or focus changes`;
  - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
  - `does not steal focus for late terminal callbacks outside the processing view`;
  - `keeps stopped announcement owned by stop and close cleanup silent until the caller destination render`;
  - `retries without replacing the video DOM and moves focus once`.
- Additional named lifecycle/callsite tests:
  - `keeps closeActive cleanup render-free for navigation picker replacement and beforeunload`;
  - `lets navigation and picker callers own exactly one destination render`;
  - `binds terminal callback focus to the originating active controller token`;
  - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
- named renderer/smoke role/name assertions for `Swing Card contents` and
  `Remote model data disclosure`, expanded to every named group/region and the
  nested native `<dl>` listed above.

### Browser Smoke Tests In `test/smoke/app.spec.ts`

Add or extend named tests that:

- traverse the primary capture, consent, processing, review, phase-confirmation,
  and Swing Card export path with keyboard input only;
- open the native file chooser from the visible `Choose a video` button by
  keyboard, then inject the approved pose fixture through the test harness so
  the risky analysis path remains real without relying on a machine-specific
  chooser UI;
- cover successful keyboard-opened selection, a synthetic native `cancel`
  event returning focus, and defensive file-input focus redirection;
- verify focus continuity across consent, selection, begin, processing
  completion, review, same-control edits, confirmation, export, and local Swing
  Card actions after full rerenders;
- assert one main landmark, meaningful heading order, dynamic document titles,
  scoped status semantics, and no duplicate blanket live regions;
- replace all three reviewed unscoped `page.getByRole("status")` assertions —
  camera, consent guard, and stopped status — with direct `#app-announcer`
  assertions plus exact visible `#app-visible-status` text and assertions that
  the visible element has no status role or `aria-live`;
- retain every `.phase-warning` text assertion, but replace the reviewed
  `aria-live="polite"` assertion with exact `id="phase-review-status"`, no
  status role, no `aria-live`, and the exact `aria-describedby` relationship;
- prohibit unscoped status-role locators in processing/review smoke coverage;
  target `#app-announcer`, `#processing-status`, or
  `#keyframe-overlay-status` according to the declared owner;
- verify representative focus visibility and approved focus/control contrast
  tokens in rendered light and dark-adjacent states, the applied two-layer
  indicator geometry, and forced-colors emulation;
- assert scoped interactive targets are at least 44 CSS pixels in each required
  dimension, allowing only spec-reviewed exceptions;
- at desktop and 320 CSS-pixel viewports, exercise long status/error text,
  failed processing, phase review, keyframe controls, and Swing Card export;
  assert no viewport overflow, clipped required text, overlap, or unusable
  control geometry;
- preserve the existing 390-pixel mobile coverage, protected selectors/labels,
  external-network guard, no-sensitive-console-output checks, and real
  pose-fixture output assertions.
- assert exactly one announcement owner for consent, processing terminal,
  phase validation/confirmation, and each Swing action without claiming that
  Playwright substitutes for manual screen-reader evidence;
- assert phase announcements occur only when the semantic state key changes
  among `unsupported-input`, `review-required`, and `confirmed`;
- include named group/region assertions and 320-pixel/long-text geometry for
  every exhaustive renderer-semantic entry, including the nested native remote
  disclosure `<dl>`.

Geometry checks must identify the relevant elements and required relationships;
a screenshot alone or an empty-state-only page-width assertion is insufficient.

## Acceptance-Criteria Coverage Matrix

| Acceptance criterion | Automated evidence | Manual evidence |
| --- | --- | --- |
| Keyboard-only traversal through capture, consent, processing, review, phase confirmation, and export | Real keyboard-only pose-fixture smoke path; focus-request unit tests; event mapping tests | Full keyboard walkthrough, focus order/recovery, browser and input recorded |
| Understandable focus, labels, headings, statuses, and disabled explanations | Accessibility helper, renderer, event, lifecycle, and Swing Card tests; one-main/title/status smoke checks | Screen-reader/keyboard review, focus appearance, announcement timing, prerequisite clarity |
| No desktop/mobile overlap, clipping, unusable controls, or unreadable export | 320/390/desktop geometry, overflow, long/error/review/export, 44-pixel, and token tests | 200%/400% zoom or equivalent 320 reflow, text spacing, actual mobile, forced colors, print/export review |
| Practical automated regression coverage | Named unit/smoke tests mapped here and to Claude blockers | Record gaps that remain manual-only |
| Remaining manual-only risks documented | Artifact-presence/docs review where practical | Required `docs/ss-019-manual-accessibility-qa.md` risk table |

## Required Manual QA Artifact

Implementation must create `docs/ss-019-manual-accessibility-qa.md`. It is an
evidence record, not a conformance statement. For every run or scenario record:

- tested commit SHA and build/serve command;
- date, OS, browser/version, viewport or physical device, zoom, text-spacing
  override if used, input method, and assistive technology/version;
- workflow step and test scenario;
- expected result and actual result;
- evidence reference such as screenshot, recording, or concise observation;
- defect link/status when failed;
- residual risk, affected user/surface, severity or impact, workaround if any,
  and Adopt/Fix/Defer disposition.

Minimum manual scope:

- complete keyboard traversal, visible focus, logical order, and focus recovery;
- VoiceOver and/or NVDA announcements and landmarks where available; record an
  unavailable combination explicitly and do not claim it passed;
- consent, processing progress/failure/completion, phase-review validation,
  confirmation, and export announcements without over-announcement;
- actual native chooser cancel and focus return in every tested browser/AT
  environment;
- duplicate-announcement checks for consent, terminal completion/failure,
  phase validation/confirmation, and Swing actions;
- named-group checks for `Swing Card contents` and
  `Remote model data disclosure`, plus `Local video source`,
  `Local pose processing`, `Review placeholder`, `Swing phase assignments`,
  `Select keyframe`, the `Swing Card unavailable` labelled section, and the
  remote wrapper's retained nested `<dl>` semantics;
- browse-mode checks that each disabled control exposes its exact, unique,
  state-accurate visible `aria-describedby` target;
- 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
- WCAG text-spacing overrides;
- forced-colors/high-contrast behavior where the environment supports it;
- every exact focus/boundary token surface from the required ratio matrix;
- long consent/status/error/prerequisite text;
- representative actual mobile-device interaction where available;
- annotated-canvas name/description and the residual nonvisual-equivalence
  limitation;
- Swing Card on-screen export panel, print preview, and locally generated
  download/copy status.

The artifact must explicitly say that SS-019 does not establish WCAG
certification, legal compliance, universal assistive-technology compatibility,
or complete nonvisual equivalence.

## Migration And Rollback

This is a DOM, CSS, focus-coordination, test, and manual-evidence change only.
There is no persisted-state migration, data-schema migration, exported-data
change, dependency migration, service-worker migration, or remote-service
rollout.

Implementation order:

1. Add the stable host/announcer and `app-accessibility` unit contract.
2. Convert the render request and focus/announcement call sites with focused
   unit tests.
3. Add renderer semantics/descriptions while preserving protected
   labels/selectors/copy.
4. Apply scoped CSS focus, contrast, target-size, failure, reflow, forced-color,
   and wrapping changes.
5. Extend the real pose-fixture smoke suite and run targeted checks.
6. Complete the manual QA artifact against the implementation commit.
7. Run the full required verification and prepare a self-contained Claude final
   audit packet containing every changed tracked file or explicit omission
   rationale.

Rollback is a revert of the focused SS-019 implementation commit. Because no
schema, persistence, dependency, provider, or remote behavior changes, no data
rollback is required. Validate the restored baseline with the existing unit,
smoke, build, compliance, safety, and privacy gates.

Primary migration risks are:

- focus regression from stale/missing focus keys or incorrectly forced focus;
- over-announcement, duplicate status messages, or lost important status;
- protected selector, label, or sensitive-copy drift;
- layout regressions introduced by control sizing or wrap rules;
- false confidence from automation that does not match manual AT/browser
  behavior.

## Required Verification

Use Node 22 from `.nvmrc`. Record exact commands, versions, named test output,
and results in the final audit and PR handoffs.

Targeted tests, adjusted to the exact implemented files:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:unit -- app-accessibility accessibility-contrast app-renderer app-events analysis-lifecycle phase-review-renderer remote-model-renderer swing-card-actions'
```

Required smoke command:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run test:smoke'
```

Required baseline and protected-boundary checks under Node 22:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run build'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run compliance:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run safety:verify'
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run privacy:verify'
```

Run when documentation or generated-document claims change, including the
required manual QA artifact:

```sh
/bin/zsh -lc 'source "$HOME/.nvm/nvm.sh" && nvm use && npm run docs:verify'
```

Always run:

```sh
git diff --check
```

No dependency, bundle, license-policy, notice, or SBOM change is expected. If
that boundary changes, stop implementation, return to review, and additionally
run the dependency/licensing/SBOM checks required by `AGENTS.md`.

## Claude QA-Planning Gate

Before implementation, the lead architect and workflow coordinator must create
a durable, self-contained Claude prompt and source packet using the standard
adversarial-review skeleton: Role, Stage, Scope, Context, Acceptance criteria,
Protected boundaries, Relevant source contents or focused diff, Verification,
Known non-goals, and Output required.

Claude's first QA-planning review returned FAIL with B1-B6. The first focused
B1-B6 re-review also returned FAIL: B2, B5, and B6 closed, while B1, B3, B4,
the lead close/token-race precision, and accepted N1-N3 remain open. Exact
second-review artifacts are
`docs/ss-019-claude-qa-second-raw-response.md` and
`docs/ss-019-claude-qa-second-response.md`.

`docs/ss-019-claude-qa-rereview-prompt.md` is superseded for paste use. Its
existing source packet remains unchanged as the exact first-re-review evidence
record. A new prompt/packet is not part of this specification-revision step and
must be created only after these N1-N3 contracts and the corresponding durable
context are approved.

The next focused packet must include the prior raw response, lead disposition,
this complete revised specification, exact relevant current baseline sources
and tests, complete focused diffs, and explicit omission rationales. Claude
must independently close B1, B3, B4, the lead close/token-race precision, and
N1-N3 with PASS before the builder creates the story branch or changes runtime
UI. B2, B5, and B6 remain closed regression contracts and must not be reopened
by the N1-N3 corrections.
````````````````````````````````````````
<!-- END EXACT BLOCK: 07 Complete current file: docs/ss-019-preimplementation-spec.md -->

### 08 Complete current file: docs/ss-019-claude-qa-second-rereview-prompt.md

Lines: 123  
Bytes: 5670  
SHA-256: `f21839ef85ce326b9f14a139121c19d9b490a05671fed32e0b8f95b39b8b868d`

<!-- BEGIN EXACT BLOCK: 08 Complete current file: docs/ss-019-claude-qa-second-rereview-prompt.md -->
````````````````````````````````````````text
# SS-019 Claude QA-Planning N1-N3 Focused Re-review Prompt

Paste this prompt into Claude Chat first, followed immediately by
docs/ss-019-claude-qa-second-rereview-source-packet.md. Together they are one
self-contained handoff. Assume no filesystem, repository, GitHub, Notion, or
prior-chat access. If the packet does not follow, return FAIL.

## Role

You are the independent lead adversarial QA planner for local-first Swing Sync.
Re-review the N1-N3 corrections after your second SS-019 FAIL. Challenge
closure and regressions; do not implement code.

## Stage

Second focused preimplementation QA-planning re-review. No SS-019 runtime/UI
implementation or story branch exists. Builder and branch creation remain
blocked until PASS with explicit CLEARED FOR IMPLEMENTATION.

## Scope

Decide whether N1, N2, and N3 close B1, B3, B4, and the lead close/token-race
precision. Regression-check already-closed B2, B5, and B6. Look for
contradictory legacy tests, incomplete selector migrations, missing text/live
ownership, non-exhaustive container semantics, unnamed test removals, or new
acceptance and protected-boundary gaps.

## Context

Claude mechanically accepted the previous 40-block packet, closed B2/B5/B6,
and left three blockers:

- N1: two closeActive tests still asserted lifecycle-owned rendering and the
  legacy string requestRender signature.
- N2: the live-region consolidation did not name the existing phase-warning
  aria-live assertion, three unscoped status-role locators, or visible status
  text ownership.
- N3: processing, review, and export placeholders had the same unsupported
  generic-container naming defect as the first reviewed set.

The revised plan now:

- Defines AccessibilityIntent as focusKey plus optional announcement, and
  RenderRequest as that intent plus optional visibleStatusText.
- Names each superseded lifecycle test, its exact rewrite or replacement, the
  typed stop/camera assertions, and deferred-close caller-owned render tests.
- Gives global, scoped-live, and visible non-live status surfaces exact IDs;
  migrates all existing role-dependent smoke assertions; defines phase
  transition keys and one announcement owner per event.
- Exhaustively remediates every reviewed labelled generic container, uses a
  labelled native section for export, and preserves the remote disclosure dl
  inside a named group.
- Makes focus idempotent and directly tests exact aria-describedby targets.
- Keeps B2/B5/B6 as explicit regression contracts.

## Acceptance criteria

- Keyboard-only traversal covers capture, consent, processing, review, phase
  confirmation, and Swing Card export.
- Focus, labels, headings, status, and disabled explanations are understandable.
- Desktop/mobile layouts avoid overlap, clipping, unusable controls, and an
  unreadable export surface.
- Practical high-risk accessibility/responsive automation is named and mapped.
- Remaining manual-only accessibility risks are documented.

## Protected boundaries

- Preserve local-first raw-media handling, consent, local processing,
  remote-review-disabled behavior, service worker, persistence, exported data,
  protected copy, labels, and selectors except the explicitly reviewed
  semantic/test migrations.
- No telemetry, analytics, remote logging, cloud diagnostics, provider SDK,
  model asset, remote sharing, hidden identifier, or debug artifact.
- No safety/privacy/medical/non-affiliation claim change.
- No dependency, framework, bundle, license, notice, or SBOM change.
- No absolute accessibility, safety, privacy, legal, medical, or compliance
  claim.

## Relevant source contents/focused diff

The following packet contains the exact second Claude response, lead
disposition, complete revised specification, directly implicated baseline
source/tests, the prior-reviewed-to-current specification diff, the complete
focused CONTEXT diff, and an explicit absent record for the planned
app-accessibility module.

Mechanically verify manifest metadata, sequential unique BEGIN/END markers,
equal row/block counts, byte/hash matches, regenerated diffs, absence record,
fence safety, and omission rationales. Any mismatch is a FAIL handoff blocker.

## Verification

Planning evidence only: N1-N3 are revised before implementation; packet blocks
are mechanically verified; git diff --check passes; main remains at the
confirmed baseline with no story branch or PR. Notion live synchronization is
not claimed because OAuth authorization is unavailable. No implementation tests
have run.

Future implementation uses Node 22 and must run the named targeted unit tests,
the real keyboard-only pose-fixture smoke suite, build, compliance, safety,
privacy, docs when applicable, and diff checks.

## Known non-goals

No implementation, builder, branch, redesign, framework, localization, camera,
backend, account, cloud, provider/model, service-worker, persistence,
exported-data, algorithm, observability, dependency, license, SBOM, or
certification expansion.

## Output required

1. Start with exactly PASS or FAIL.
2. Mark N1, N2, N3, B1, B3, B4, and close/token precision CLOSED or OPEN with
   exact evidence.
3. Confirm whether B2, B5, and B6 remain closed.
4. List new/open blockers by severity with impact and exact correction.
5. Identify acceptance gaps, missing named automated/manual evidence, or
   protected-boundary drift.
6. Report packet manifest/marker counts and mismatches.
7. Separate non-blocking recommendations and future work.
8. End CLEARED FOR IMPLEMENTATION only for PASS with zero blockers; otherwise
   end NOT CLEARED FOR IMPLEMENTATION.
9. Do not implement or direct builder work while any blocker remains.
````````````````````````````````````````
<!-- END EXACT BLOCK: 08 Complete current file: docs/ss-019-claude-qa-second-rereview-prompt.md -->

### 09 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md

Lines: 139  
Bytes: 7265  
SHA-256: `3437b7ff5fa2abaaf57f32f8df0f72598549a55ac515f0a448a1f2b339082f9f`

<!-- BEGIN EXACT BLOCK: 09 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md -->
````````````````````````````````````````text
# SS-019 Claude QA-Planning B1-B6 Focused Re-review Prompt

**Superseded for paste use after the second Claude FAIL.** Use
`docs/ss-019-claude-qa-second-rereview-prompt.md` followed by
`docs/ss-019-claude-qa-second-rereview-source-packet.md`. The prior source
packet remains unchanged as historical evidence.

Paste this prompt into Claude Chat first, followed immediately by
`docs/ss-019-claude-qa-rereview-source-packet.md`. Together they are one
self-contained handoff. Assume no filesystem, repository, GitHub, Notion, or
prior-chat access. If the packet does not follow, return FAIL.

## Role

You are the independent lead adversarial QA planner for local-first Swing Sync.
Re-review the revised preimplementation plan after your B1-B6 FAIL and the lead
architect's close/token-race precision. Challenge closure and regressions; do
not implement code.

## Stage

Focused preimplementation QA-planning re-review. No SS-019 runtime/UI
implementation or story branch exists. Builder and branch creation remain
blocked until PASS, all blockers closed, and `CLEARED FOR IMPLEMENTATION`.

## Scope

Re-review B1-B6, the lead-found close/token race, new blockers, acceptance
coverage, protected boundaries, named automation, and manual evidence. Attack
stale focus, unmapped callsites, duplicate announcements, unsafe focus keys,
chooser cancel/focus return, semantic-role loss, contrast math, forced colors,
320px/long-text/error states, empty-path tests, and false conformance claims.

## Context

Swing Sync is a Vite/TypeScript local-first browser app. Raw swing video is not
uploaded by default; consent gates local analysis; pose processing, phase review,
and Swing Card export are local; remote review remains unavailable. No backend,
telemetry, remote logging, cloud diagnostics, provider, SDK, model, dependency,
or remote sharing is added.

Accepted corrections:

- **B1:** `src/app-accessibility.ts` owns post-render and no-render intents.
  Progress/output stays partial; only processing state is scoped polite live.
  Each controller callback captures an identity/token and checks it before any
  state/output/DOM/focus/announcement mutation; stale callbacks return. Current
  completed/failed callbacks may no-render focus the processing heading only
  when processing view and active token match. Retry preserves video DOM.
- **Lead precision:** stop/close synchronously invalidate the active callback
  token before awaiting cancel/close while retaining a local controller for
  resource release, making racing terminal callbacks inert. Stop owns the
  stopped render/announcement/capture focus. Close is cleanup/state-reset only:
  no render/focus/announcement. Navigation and picker callers own one
  destination render; `beforeunload` cleans up without rendering.
- **B2:** the file input has `tabindex="-1"` and a defensive label, not
  `aria-hidden`; selection, cancel, and focus/focusin redirect return focus to
  the visible picker without positive tabindex.
- **B3:** every event uses exactly one polite global or scoped channel. Global
  owns full-render workflow/consent/camera/video/phase/Swing events. Scoped live
  regions are only processing state and imperative overlay. Other visible
  status text is not live. Every callsite is inventoried.
- **B4:** capture, keyframe, assignment, and Swing summary use named group/native
  semantics. Remote disclosure keeps native `<dl>` inside a named group.
- **B5:** static focus keys are enumerated; dynamic keys are only
  `workflow-step:<capture|processing|review|export>`,
  `phase-assignment:<0..7>`, and `keyframe:<0..7>`. Fallbacks and every
  event/lifecycle/Swing render/no-render callsite are exact.
- **B6:** exact tokens are `--focus-inner: #ffffff`,
  `--focus-outer: #17211b`, `--interactive-boundary: #607367`, with exact ring
  geometry, surface ratios, >=3:1 threshold, CSS-reading unit tests,
  computed-style smoke checks, and forced-color behavior.

Exact title/fallback/bounded-key/polite-priority notes are adopted non-blocking
precision, not expanded acceptance.

## Acceptance criteria

- Keyboard-only traversal covers capture, consent, processing, review, phase
  confirmation, and Swing Card export.
- Focus, labels, headings, status, and disabled explanations are understandable.
- Desktop/mobile layouts avoid overlap, clipping, unusable controls, and
  unreadable export.
- Add practical high-risk accessibility/responsive smoke or unit coverage.
- Document remaining manual-only accessibility risks.

## Protected boundaries

- No workflow-obscuring redesign; telemetry; remote logging; analytics; cloud
  diagnostics; provider SDK/model assets; remote sharing; identifiers; or debug
  artifacts.
- No safety/privacy/medical/non-affiliation claim change outside sensitive review.
- Preserve local-first media, consent, local processing, remote-review-disabled
  behavior, service worker, persistence, exported data, copy/labels/selectors.
- No dependency/framework/bundle/license/notice/SBOM change and no absolute
  accessibility/safety/privacy/legal/medical/compliance claim.

## Relevant source contents/focused diff

The immediately following packet must contain complete revised spec, Claude
response, research disposition, superseded original prompt, relevant baseline
sources/tests, an explicit absent record for unimplemented
`src/app-accessibility.ts`, complete focused `CONTEXT.md` diff, and complete
pre-review-to-revised-spec diff derived from the exact original packet block.

Mechanically verify manifest kind/path/line/byte/SHA-256 entries, exactly one
unique BEGIN/END pair per block, equal manifest/block counts, no truncation or
fence collision, no summary substituted for exact contents, and rationales for
omissions. Any mismatch is a FAIL handoff blocker.

## Verification

Current evidence is planning-only: B1-B6/lead precision are revised before
implementation; packet blocks are byte/hash checked; `git diff --check` passes;
tracker/context remain QA Planning with empty PR and `main`; nine unrelated
prompt files remain untouched. No implementation tests ran. Future Node 22
checks include named accessibility/contrast/renderer/events/lifecycle/phase/
remote/Swing unit tests, real keyboard-only pose-fixture Playwright, build,
compliance, safety, privacy, docs when applicable, and diff check.

## Known non-goals

No implementation/branch/builder before PASS; redesign/framework/localization/
camera/backend/account/cloud/remote/provider/model/service-worker/persistence/
exported-data/algorithm change; observability/dependency/license/SBOM change;
or certification, universal AT, legal/compliance, or complete nonvisual-canvas
claim.

## Output required

1. Start with exactly `PASS` or `FAIL`.
2. Mark B1-B6 and close/token-race precision `CLOSED` or `OPEN` with evidence.
3. List open/new blockers by severity with impact and exact correction.
4. Identify AC gaps, missing named automated/manual evidence, and boundary drift.
5. Report packet manifest/marker counts and mismatches.
6. Separate non-blocking recommendations from future work.
7. End `CLEARED FOR IMPLEMENTATION` only for PASS with zero blockers; otherwise
   end `NOT CLEARED FOR IMPLEMENTATION`.
8. Do not implement or direct builder work while any blocker remains.
````````````````````````````````````````
<!-- END EXACT BLOCK: 09 Complete current file: docs/ss-019-claude-qa-rereview-prompt.md -->

### 10 Complete current file: src/main.ts

Lines: 44  
Bytes: 1248  
SHA-256: `e6987db744a7e8c2724e63336d30b2500821a8f293437ff9af82f1d2f8be87d6`

<!-- BEGIN EXACT BLOCK: 10 Complete current file: src/main.ts -->
````````````````````````````````````````text
import "./styles.css";
import { AnalysisLifecycle } from "./analysis-lifecycle";
import { bindAppEvents } from "./app-events";
import { renderApp } from "./app-renderer";
import { createInitialAppState } from "./app-state";
import { createSafetyConsentStore } from "./consent-state";
import { renderSelectedKeyframeCanvas } from "./keyframe-overlay-renderer";

const app = document.querySelector<HTMLDivElement>("#app");
const state = createInitialAppState();
const consent = createSafetyConsentStore();

function requestRender(statusMessage?: string): void {
  if (!app) return;
  renderApp(app, state, consent.hasSafetyConsent(), statusMessage);
  bindAppEvents(app, {
    state,
    consent,
    lifecycle,
    requestRender
  });
  renderSelectedKeyframeCanvas(app, state);
}

const lifecycle = new AnalysisLifecycle({
  root: app ?? document,
  state,
  requestRender
});

requestRender();

window.addEventListener("beforeunload", () => {
  void lifecycle.closeActive();
});
document.addEventListener("securitypolicyviolation", () => {
  lifecycle.abortWithNetworkBlocked();
});

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 10 Complete current file: src/main.ts -->

### 11 Complete current file: src/app-events.ts

Lines: 159  
Bytes: 6822  
SHA-256: `6b9da4f5fd1aa8e45b6d14196b59082e0f45738bc5d6129c03334285e1e55b9e`

<!-- BEGIN EXACT BLOCK: 11 Complete current file: src/app-events.ts -->
````````````````````````````````````````text
import type { AnalysisLifecycle } from "./analysis-lifecycle";
import {
  confirmPhaseReview,
  rebuildPhaseReviewState,
  selectKeyframe,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseConfirmation,
  setPhaseDeclaration,
  setPhaseDraftAssignment,
  type AppState
} from "./app-state";
import type { SafetyConsentStore } from "./consent-state";
import { declarationValue } from "./phase-review-renderer";
import { copySwingCardPrompt, downloadSwingCard, printSwingCard } from "./swing-card-actions";
import { getNextWorkflowStep, getWorkflowStep, type WorkflowStepId } from "./workflow";

export interface AppEventsDependencies {
  state: AppState;
  consent: SafetyConsentStore;
  lifecycle: AnalysisLifecycle;
  requestRender(statusMessage?: string): void;
}

export function bindAppEvents(root: ParentNode, dependencies: AppEventsDependencies): void {
  const { state, consent, lifecycle, requestRender } = dependencies;

  root.querySelector<HTMLInputElement>("#safety-consent")?.addEventListener("change", (event) => {
    consent.setSafetyConsent((event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });

  root.querySelector<HTMLButtonElement>("#analysis-button")?.addEventListener("click", () => {
    if (!consent.hasSafetyConsent()) {
      requestRender("Please acknowledge the safety terms before starting analysis.");
      root.querySelector<HTMLInputElement>("#safety-consent")?.focus();
      return;
    }
    if (!state.selectedVideo) {
      requestRender("Choose a local video before starting analysis.");
      return;
    }
    selectWorkflowStep(state, "processing");
    requestRender("Loading approved local pose assets. No video data leaves this device.");
    void lifecycle.startActive();
  });

  root.querySelectorAll<HTMLButtonElement>("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextStep = button.dataset.step as WorkflowStepId;
      const opensCompletedReview =
        state.activeStep === "processing" && state.processingState === "completed" && nextStep === "review";
      const preservesReviewData =
        ["review", "export"].includes(state.activeStep) && ["review", "export"].includes(nextStep);
      if (
        ["processing", "review", "export"].includes(state.activeStep) &&
        nextStep !== state.activeStep &&
        !opensCompletedReview &&
        !preservesReviewData
      ) {
        void lifecycle.closeActive();
      }
      selectWorkflowStep(state, nextStep);
      requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
    });
  });

  root.querySelector<HTMLButtonElement>("[data-next-step]")?.addEventListener("click", () => {
    selectWorkflowStep(state, getNextWorkflowStep(state.activeStep).id);
    requestRender(`${getWorkflowStep(state.activeStep).label} opened.`);
  });

  root.querySelector<HTMLButtonElement>("[data-video-picker]")?.addEventListener("click", () => {
    root.querySelector<HTMLInputElement>("#video-file")?.click();
  });

  root.querySelector<HTMLInputElement>("#video-file")?.addEventListener("change", (event) => {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    void lifecycle.closeActive();
    selectLocalVideo(state, file);
    requestRender("Local video selected. It has not been analyzed or persisted.");
  });

  root.querySelector<HTMLButtonElement>("[data-placeholder-action='camera']")?.addEventListener("click", () => {
    requestRender("Camera capture remains out of scope. Choose a local video file.");
  });

  root.querySelector<HTMLButtonElement>("[data-cancel-analysis]")?.addEventListener("click", () => {
    void lifecycle.stopActive();
  });

  root.querySelector<HTMLButtonElement>("[data-retry-analysis]")?.addEventListener("click", () => {
    void lifecycle.retryActive();
  });

  root.querySelector<HTMLButtonElement>("[data-review-phases]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "review");
    requestRender("Review the provisional phase labels before future measurements become available.");
  });

  root.querySelector<HTMLSelectElement>("#phase-view")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "view", declarationValue((event.currentTarget as HTMLSelectElement).value, "view"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-handedness")?.addEventListener("change", (event) => {
    setPhaseDeclaration(
      state,
      "handedness",
      declarationValue((event.currentTarget as HTMLSelectElement).value, "handedness")
    );
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLSelectElement>("#phase-mirrored")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "mirrored", declarationValue((event.currentTarget as HTMLSelectElement).value, "mirrored"));
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelector<HTMLInputElement>("#phase-setup")?.addEventListener("change", (event) => {
    setPhaseDeclaration(state, "setup", (event.currentTarget as HTMLInputElement).checked ? "confirmed" : "undeclared");
    rebuildPhaseReviewState(state);
    requestRender();
  });
  root.querySelectorAll<HTMLSelectElement>("[data-phase-index]").forEach((select) => {
    select.addEventListener("change", () => {
      setPhaseDraftAssignment(state, Number(select.dataset.phaseIndex), Number(select.value));
      requestRender();
    });
  });
  root.querySelector<HTMLInputElement>("#phase-confirmation")?.addEventListener("change", (event) => {
    setPhaseConfirmation(state, (event.currentTarget as HTMLInputElement).checked);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-confirm-phase-review]")?.addEventListener("click", () => {
    confirmPhaseReview(state);
    requestRender();
  });
  root.querySelector<HTMLButtonElement>("[data-open-export]")?.addEventListener("click", () => {
    selectWorkflowStep(state, "export");
    requestRender("Swing Card export opened.");
  });
  root.querySelectorAll<HTMLButtonElement>("[data-keyframe-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectKeyframe(state, Number(button.dataset.keyframeIndex));
      requestRender();
    });
  });
  root.querySelector<HTMLButtonElement>("[data-download-swing-card]")?.addEventListener("click", () => {
    void downloadSwingCard(state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-print-swing-card]")?.addEventListener("click", () => {
    void printSwingCard(root, state, requestRender);
  });
  root.querySelector<HTMLButtonElement>("[data-copy-swing-card-prompt]")?.addEventListener("click", () => {
    void copySwingCardPrompt(state, requestRender);
  });
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 11 Complete current file: src/app-events.ts -->

### 12 Complete current file: src/app-renderer.ts

Lines: 223  
Bytes: 10945  
SHA-256: `7705e320427a5142930188ed3cebe7e0fe5760d8958446d8de2ee487d4b9c4e8`

<!-- BEGIN EXACT BLOCK: 12 Complete current file: src/app-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { selectCanBeginAnalysis } from "./app-state";
import type { FrameProcessingState } from "./frame-processing";
import { phaseDefinitions } from "./phase-review";
import { renderPhaseReview } from "./phase-review-renderer";
import { renderRemoteModelReviewPanel } from "./remote-model-renderer";
import { escapeHtml, formatSwingCardWarning } from "./render-utils";
import { deriveSwingCardContentWarnings } from "./swing-card-generator";
import { getWorkflowStep, workflowSteps } from "./workflow";

export function renderApp(root: HTMLElement, state: AppState, consentAccepted: boolean, statusMessage?: string): void {
  const step = getWorkflowStep(state.activeStep);
  const currentStatus =
    statusMessage ??
    (consentAccepted
      ? "Consent recorded locally. Choose a local video to begin analysis."
      : "First analysis is blocked until this acknowledgement is checked.");

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="wordmark" href="/" aria-label="Swing Sync home">Swing Sync</a>
        <span class="local-badge">Local-first analysis</span>
      </header>
      <main class="workspace">
        <section class="workflow" aria-labelledby="workflow-heading">
          <div class="workflow-intro">
            <div><p class="eyebrow">New analysis</p><h1 id="workflow-heading">Capture or choose your swing</h1></div>
            <p>Raw swing video stays on your device. No feature will send it elsewhere without a separate, explicit opt-in step you initiate.</p>
          </div>
          <nav class="step-nav" aria-label="Analysis workflow">
            ${workflowSteps
              .map(
                (item, index) => `
                  <button class="step-button ${item.id === state.activeStep ? "is-active" : ""}" type="button"
                    data-step="${item.id}" aria-current="${item.id === state.activeStep ? "step" : "false"}">
                    <span class="step-number">${index + 1}</span><span>${item.shortLabel}</span>
                  </button>`
              )
              .join("")}
          </nav>
          <section class="stage" aria-labelledby="stage-heading">
            <div class="stage-heading">
              <div><p class="placeholder-kicker">Local workflow</p><h2 id="stage-heading">${step.label}</h2></div>
              <span class="stage-status">${step.status}</span>
            </div>
            <p class="stage-description">${step.description}</p>
            ${renderWorkflowPanel(state, consentAccepted)}
          </section>
        </section>
        <aside class="consent-panel" aria-labelledby="consent-heading">
          <p class="eyebrow">Required before first analysis</p>
          <h2 id="consent-heading">Safety acknowledgement</h2>
          <p>Swing Sync is for educational use only. It is not medical advice, pain diagnosis, rehabilitation guidance, or professional athletic instruction.</p>
          <ul>
            <li>Golf practice and swing changes involve injury risk.</li>
            <li>Stop if you feel pain, dizziness, numbness, weakness, or unusual discomfort.</li>
            <li>Consult qualified medical or coaching professionals for personal concerns.</li>
          </ul>
          <label class="consent-check">
            <input id="safety-consent" type="checkbox" ${consentAccepted ? "checked" : ""} />
            <span>I understand Swing Sync is educational only and that golf practice involves physical risk I accept responsibility for.</span>
          </label>
          <p class="privacy-note">Only this acknowledgement is stored locally. It is not a durable or legally audited consent record.</p>
          <p class="status" role="status">${currentStatus}</p>
        </aside>
      </main>
    </div>
  `;
}

export function renderWorkflowPanel(state: AppState, consentAccepted: boolean): string {
  if (state.activeStep === "capture") {
    return `
      <div class="capture-options" aria-label="Local video source">
        <button class="source-option" type="button" data-placeholder-action="camera">
          <span class="source-option__title">Use camera</span>
          <span>Camera capture is not part of this story</span>
        </button>
        <button class="source-option" type="button" data-video-picker>
          <span class="source-option__title">Choose a video</span>
          <span>${state.selectedVideo ? escapeHtml(state.selectedVideo.name) : "Select a local video file"}</span>
        </button>
        <input id="video-file" class="visually-hidden" type="file" accept="video/*" />
      </div>
      <div class="action-row">
        <button id="analysis-button" class="primary-action" type="button" ${
          selectCanBeginAnalysis(state, consentAccepted) ? "" : "disabled"
        }>
          Begin analysis
        </button>
        <p class="action-note">The selected video and decoded frames remain volatile and local.</p>
      </div>
    `;
  }

  if (state.activeStep === "processing") {
    return `
      <div class="processing-placeholder" aria-label="Local pose processing">
        <div class="processing-mark" aria-hidden="true"></div>
        <div>
          <strong>${processingStatusText(state.processingState, state.poseStatusCode)}</strong>
          <p data-pose-summary>${processingSummaryText(state)}</p>
        </div>
      </div>
      <video id="analysis-video" class="analysis-video" muted playsinline aria-label="Selected local video"></video>
      <div class="action-row">
        <button class="secondary-action" type="button" data-cancel-analysis>Stop local analysis</button>
        <button class="secondary-action" type="button" data-retry-analysis hidden>Retry local analysis</button>
        <button class="primary-action" type="button" data-review-phases ${
          state.processingState === "completed" ? "" : "hidden"
        }>Review phase labels</button>
      </div>
    `;
  }

  if (state.activeStep === "review") {
    if (state.phaseOutputs.length > 0) return renderPhaseReview(state);
    return `
      <div class="review-placeholder" aria-label="Review placeholder">
        <div class="swing-frame"><span>Video and pose preview</span></div>
        <dl class="metric-list">
          <div><dt>Tempo</dt><dd>--</dd></div>
          <div><dt>Balance</dt><dd>--</dd></div>
          <div><dt>Rotation</dt><dd>--</dd></div>
        </dl>
      </div>
      <button class="secondary-action" type="button" data-next-step>Preview export state</button>
    `;
  }

  if (state.phaseOutputs.length === 0) {
    return `
      <div class="export-placeholder" aria-label="Export placeholder">
        <p class="placeholder-kicker">Local Swing Card</p>
        <h3>Swing Card unavailable</h3>
        <p>Complete local analysis before creating a Swing Card. Raw swing video is not included in Swing Card exports.</p>
      </div>
      <button class="secondary-action" type="button" disabled>Export is not available yet</button>
    `;
  }

  return renderSwingCardExport(state);
}

export function updateProcessingProgressUi(root: ParentNode, state: AppState): void {
  const status = root.querySelector<HTMLElement>(".processing-placeholder strong");
  const summary = root.querySelector<HTMLElement>("[data-pose-summary]");
  const retry = root.querySelector<HTMLButtonElement>("[data-retry-analysis]");
  const review = root.querySelector<HTMLButtonElement>("[data-review-phases]");

  if (status) status.textContent = processingStatusText(state.processingState, state.poseStatusCode);
  if (summary) summary.textContent = processingSummaryText(state);
  if (retry) retry.hidden = state.processingState !== "failed";
  if (review) review.hidden = state.processingState !== "completed";
}

function renderSwingCardExport(state: AppState): string {
  const phaseReady = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warnings = deriveSwingCardContentWarnings({
    keyframes: phaseDefinitions.map((phase) => ({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: undefined,
      overlay: undefined
    })),
    metricPayload: undefined,
    phaseReviewConfirmed: phaseReady
  });

  return `
    <section class="swing-card-panel" aria-labelledby="swing-card-heading">
      <div class="swing-card-panel__header">
        <div>
          <p class="placeholder-kicker">Local Swing Card</p>
          <h3 id="swing-card-heading">Downloadable summary</h3>
        </div>
        <span class="stage-status">Manual sharing</span>
      </div>
      <p>This card can include annotated keyframes, unavailable metric states, warnings, and prompt text for a manual LLM chat upload. Raw swing video is not included.</p>
      <div class="swing-card-summary" aria-label="Swing Card contents">
        <div><strong>${state.phaseOutputs.length}</strong><span>local keyframes</span></div>
        <div><strong>PNG</strong><span>download</span></div>
        <div><strong>Print</strong><span>save as PDF where supported</span></div>
      </div>
      <ul class="swing-card-warning-list" aria-label="Swing Card warnings">
        ${warnings.map((warning) => `<li>${escapeHtml(formatSwingCardWarning(warning))}</li>`).join("")}
      </ul>
      <div class="action-row swing-card-actions">
        <button class="primary-action" type="button" data-download-swing-card ${state.swingCardBusy ? "disabled" : ""}>Download PNG</button>
        <button class="secondary-action" type="button" data-print-swing-card ${state.swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
        <button class="secondary-action" type="button" data-copy-swing-card-prompt ${state.swingCardBusy ? "disabled" : ""}>Copy prompt</button>
        <p class="action-note" data-swing-card-status role="status">${escapeHtml(state.swingCardStatus)}</p>
      </div>
      <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
      ${renderRemoteModelReviewPanel()}
    </section>
  `;
}

function processingStatusText(state: FrameProcessingState, code?: string): string {
  return state === "loading"
    ? "Loading the local pose model in a background worker."
    : state === "processing"
      ? "Processing a local video frame."
      : state === "completed"
        ? "Local frame processing completed."
        : state === "failed"
          ? `Local pose analysis stopped (${code ?? "UNKNOWN_ERROR"}).`
          : state === "cancelled"
            ? "Local frame processing cancelled."
            : state === "closed"
              ? "Local pose session closed."
              : "Preparing local pose analysis.";
}

function processingSummaryText(state: AppState): string {
  return `${state.extractedFrameCount} of ${state.totalFrameCount} video frames processed.${
    state.latestLandmarkCount > 0
      ? ` ${state.latestLandmarkCount} normalized landmarks retained in the latest result.`
      : ""
  }`;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 12 Complete current file: src/app-renderer.ts -->

### 13 Complete current file: src/app-state.ts

Lines: 182  
Bytes: 5834  
SHA-256: `c9ae9732cac6808173dd7d759099114f225915d2ca97b557478221e39ffb09c9`

<!-- BEGIN EXACT BLOCK: 13 Complete current file: src/app-state.ts -->
````````````````````````````````````````text
import type { FrameProcessingController, FrameProcessingState, SampledFrameOutput } from "./frame-processing";
import {
  applyPhaseCorrection,
  createPhaseProposal,
  createPhaseReviewState,
  isValidCorrection,
  phaseDefinitions,
  type PhaseAssignment,
  type PhaseDeclarations,
  type PhaseReviewState
} from "./phase-review";
import type { PoseOverlayRenderResult } from "./pose-renderer";
import type { WorkflowStepId } from "./workflow";

export const initialSwingCardStatus = "Swing Card export is generated locally after review data exists.";

export interface AppState {
  activeStep: WorkflowStepId;
  selectedVideo: File | undefined;
  processingState: FrameProcessingState;
  poseStatusCode: string | undefined;
  extractedFrameCount: number;
  totalFrameCount: number;
  latestLandmarkCount: number;
  phaseOutputs: readonly SampledFrameOutput[];
  phaseDeclarations: PhaseDeclarations;
  phaseReviewState: PhaseReviewState | undefined;
  phaseDraft: PhaseAssignment[];
  phaseConfirmation: boolean;
  selectedKeyframeIndex: number;
  latestOverlayResult: PoseOverlayRenderResult | undefined;
  swingCardBusy: boolean;
  swingCardStatus: string;
}

export function createInitialAppState(): AppState {
  return {
    activeStep: "capture",
    selectedVideo: undefined,
    processingState: "idle",
    poseStatusCode: undefined,
    extractedFrameCount: 0,
    totalFrameCount: 0,
    latestLandmarkCount: 0,
    phaseOutputs: [],
    phaseDeclarations: undeclaredPhaseDeclarations(),
    phaseReviewState: undefined,
    phaseDraft: [],
    phaseConfirmation: false,
    selectedKeyframeIndex: 0,
    latestOverlayResult: undefined,
    swingCardBusy: false,
    swingCardStatus: initialSwingCardStatus
  };
}

export function undeclaredPhaseDeclarations(): PhaseDeclarations {
  return {
    view: "undeclared",
    handedness: "undeclared",
    mirrored: "undeclared",
    setup: "undeclared"
  };
}

export function selectCanBeginAnalysis(state: AppState, consentAccepted: boolean): boolean {
  return (
    state.activeStep === "capture" &&
    consentAccepted &&
    !!state.selectedVideo &&
    !["loading", "processing"].includes(state.processingState)
  );
}

export function selectWorkflowStep(state: AppState, step: WorkflowStepId): void {
  state.activeStep = step;
}

export function selectLocalVideo(state: AppState, video: File): void {
  state.selectedVideo = video;
}

export function setProcessingState(state: AppState, processingState: FrameProcessingState, code?: string): void {
  state.processingState = processingState;
  state.poseStatusCode = code;
}

export function setProcessingProgress(state: AppState, completed: number, total: number): void {
  state.extractedFrameCount = completed;
  state.totalFrameCount = total;
}

export function recordProcessingOutput(state: AppState, output: SampledFrameOutput): void {
  state.latestLandmarkCount = output.pose.landmarks[0]?.length ?? 0;
}

export function completeProcessingWithOutputs(
  state: AppState,
  controller: Pick<FrameProcessingController, "getOutputs">
): void {
  state.phaseOutputs = controller.getOutputs();
  state.selectedKeyframeIndex = 0;
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  rebuildPhaseReviewState(state);
}

export function resetProcessingCounters(state: AppState): void {
  state.extractedFrameCount = 0;
  state.totalFrameCount = 0;
  state.latestLandmarkCount = 0;
}

export function resetPhaseReview(state: AppState): void {
  state.phaseOutputs = [];
  state.phaseDeclarations = undeclaredPhaseDeclarations();
  state.phaseReviewState = undefined;
  state.phaseDraft = [];
  state.phaseConfirmation = false;
  state.selectedKeyframeIndex = 0;
  state.latestOverlayResult = undefined;
  state.swingCardBusy = false;
  state.swingCardStatus = initialSwingCardStatus;
}

export function rebuildPhaseReviewState(state: AppState): void {
  const proposal = createPhaseProposal(state.phaseOutputs, state.phaseDeclarations);
  state.phaseReviewState = createPhaseReviewState(proposal);
  state.phaseDraft = proposal.assignments.map((assignment) => ({ ...assignment }));
  state.phaseConfirmation = false;
}

export function setPhaseDeclaration<K extends keyof PhaseDeclarations>(
  state: AppState,
  key: K,
  value: PhaseDeclarations[K]
): void {
  state.phaseDeclarations[key] = value;
}

export function setPhaseDraftAssignment(state: AppState, phaseIndex: number, sampleIndex: number): void {
  state.phaseDraft[phaseIndex] = {
    phaseId: phaseDefinitions[phaseIndex].id,
    sampleIndex
  };
  state.phaseConfirmation = false;
}

export function setPhaseConfirmation(state: AppState, confirmed: boolean): void {
  state.phaseConfirmation = confirmed;
}

export function confirmPhaseReview(state: AppState): void {
  if (!state.phaseReviewState) return;
  state.phaseReviewState = applyPhaseCorrection(
    state.phaseReviewState,
    state.phaseDraft,
    state.phaseConfirmation,
    state.phaseOutputs[0]?.runGeneration ?? -1
  );
}

export function selectKeyframe(state: AppState, keyframeIndex: number): void {
  state.selectedKeyframeIndex = keyframeIndex;
  state.latestOverlayResult = undefined;
}

export function setOverlayResult(state: AppState, overlayResult: PoseOverlayRenderResult): void {
  state.latestOverlayResult = overlayResult;
}

export function setSwingCardBusy(state: AppState, busy: boolean): void {
  state.swingCardBusy = busy;
}

export function setSwingCardStatus(state: AppState, status: string): void {
  state.swingCardStatus = status;
}

export function getCompleteSwingCardAssignments(state: AppState): readonly PhaseAssignment[] | undefined {
  const assignments = state.phaseReviewState?.correction?.assignments ?? state.phaseReviewState?.automaticProposal.assignments;
  return assignments && isValidCorrection(assignments) ? assignments : undefined;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 13 Complete current file: src/app-state.ts -->

### 14 Complete current file: src/analysis-lifecycle.ts

Lines: 105  
Bytes: 3821  
SHA-256: `cde9a6f811927ff93b0312c8663fdae599ae810672ab45083dca9ecf783f6bf0`

<!-- BEGIN EXACT BLOCK: 14 Complete current file: src/analysis-lifecycle.ts -->
````````````````````````````````````````text
import { updateProcessingProgressUi } from "./app-renderer";
import type { AppState } from "./app-state";
import {
  completeProcessingWithOutputs,
  recordProcessingOutput,
  resetPhaseReview,
  resetProcessingCounters,
  selectWorkflowStep,
  setProcessingProgress,
  setProcessingState
} from "./app-state";
import { createBrowserFrameController } from "./browser-frame-processing";
import type {
  FrameProcessingController,
  FrameProcessingState,
  SampledFrameOutput
} from "./frame-processing";

export interface AnalysisLifecycleOptions {
  root: ParentNode;
  state: AppState;
  requestRender(statusMessage?: string): void;
}

export class AnalysisLifecycle {
  private frameController: FrameProcessingController | undefined;
  private abortFrameController: ((code: string) => void) | undefined;

  constructor(private readonly options: AnalysisLifecycleOptions) {}

  hasActiveController(): boolean {
    return !!this.frameController;
  }

  async startActive(): Promise<void> {
    const video = this.options.root.querySelector<HTMLVideoElement>("#analysis-video");
    const selectedVideo = this.options.state.selectedVideo;
    if (!video || !selectedVideo) return;

    resetProcessingCounters(this.options.state);
    resetPhaseReview(this.options.state);
    const browserController = createBrowserFrameController(video, selectedVideo, {
      onState: (state, code) => this.handleProcessingState(state, code),
      onProgress: (completed, total) => this.handleProcessingProgress(completed, total),
      onOutput: (output) => this.handleProcessingOutput(output)
    });
    this.frameController = browserController.controller;
    this.abortFrameController = browserController.abort;
    await this.frameController.start();
  }

  async stopActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.cancel();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    selectWorkflowStep(this.options.state, "capture");
    this.options.requestRender("Local analysis stopped and volatile resources were released.");
  }

  async closeActive(): Promise<void> {
    const controller = this.frameController;
    resetPhaseReview(this.options.state);
    await controller?.close();
    if (this.frameController === controller) this.clearControllerHandles();
    setProcessingState(this.options.state, "idle");
    this.options.requestRender();
  }

  async retryActive(): Promise<void> {
    // Retry progress is surfaced through the processing partial-update path.
    resetPhaseReview(this.options.state);
    await this.frameController?.retry();
  }

  abortWithNetworkBlocked(): void {
    if (["loading", "processing"].includes(this.options.state.processingState)) {
      this.abortFrameController?.("UNEXPECTED_NETWORK_BLOCKED");
    }
  }

  private handleProcessingState(state: FrameProcessingState, code?: string): void {
    setProcessingState(this.options.state, state, code);
    if (state === "completed" && this.frameController) {
      completeProcessingWithOutputs(this.options.state, this.frameController);
    }
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingProgress(completed: number, total: number): void {
    setProcessingProgress(this.options.state, completed, total);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private handleProcessingOutput(output: SampledFrameOutput): void {
    recordProcessingOutput(this.options.state, output);
    updateProcessingProgressUi(this.options.root, this.options.state);
  }

  private clearControllerHandles(): void {
    this.frameController = undefined;
    this.abortFrameController = undefined;
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 14 Complete current file: src/analysis-lifecycle.ts -->

### 15 Complete current file: src/phase-review-renderer.ts

Lines: 131  
Bytes: 6420  
SHA-256: `8d92b88b4afeaa0d6757f7a4fe1cb3c65d026a4853bce94e7bd348199b915ef2`

<!-- BEGIN EXACT BLOCK: 15 Complete current file: src/phase-review-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { isValidCorrection, phaseDefinitions, type PhaseDeclarations } from "./phase-review";

export function renderPhaseReview(state: AppState): string {
  const proposal = state.phaseReviewState?.automaticProposal;
  const reviewRequired = proposal?.evidenceStatus === "review-required";
  const ready = state.phaseReviewState?.readyForFutureMetrics ?? false;
  const warning =
    proposal?.evidenceStatus === "unsupported-input"
      ? "Select every required declaration and provide a supported active eight-sample run."
      : "Swing phase suggestions need review. Eight sampled frames may not contain each exact swing event. Impact cannot be confirmed from body landmarks alone.";

  return `
    <section class="phase-review" aria-labelledby="phase-review-heading">
      ${renderKeyframeOverlayReview(state)}
      <div class="phase-warning" role="status" aria-live="polite">
        <strong id="phase-review-heading">${ready ? "Phase review confirmed" : reviewRequired ? "Review required" : "Unsupported input"}</strong>
        <p>${warning}</p>
      </div>
      <fieldset class="phase-declarations">
        <legend>Required video declarations</legend>
        ${renderDeclarationSelect("phase-view", "View", state.phaseDeclarations.view, [
          ["undeclared", "Select view"],
          ["face-on", "Face-on side view"]
        ])}
        ${renderDeclarationSelect("phase-handedness", "Handedness", state.phaseDeclarations.handedness, [
          ["undeclared", "Select handedness"],
          ["right", "Right-handed"],
          ["left", "Left-handed"]
        ])}
        ${renderDeclarationSelect("phase-mirrored", "Horizontally mirrored", state.phaseDeclarations.mirrored, [
          ["undeclared", "Select mirrored status"],
          ["no", "No"],
          ["yes", "Yes"]
        ])}
        <label class="phase-setup-confirmation">
          <input id="phase-setup" type="checkbox" ${state.phaseDeclarations.setup === "confirmed" ? "checked" : ""} />
          <span>I confirm this is one trimmed, complete swing with the golfer substantially full-body visible and the camera reasonably stable.</span>
        </label>
      </fieldset>
      <div class="phase-assignment-list" aria-label="Swing phase assignments">
        ${phaseDefinitions
          .map((phase, index) => {
            const selected = state.phaseDraft[index]?.sampleIndex ?? index;
            return `
              <label class="phase-assignment">
                <span><strong>${phase.label}</strong><small>Ordered phase ${index + 1}</small></span>
                <select aria-label="${phase.label} sample" data-phase-index="${index}" ${reviewRequired && !ready ? "" : "disabled"}>
                  ${phaseDefinitions
                    .map(
                      (_, sampleIndex) =>
                        `<option value="${sampleIndex}" ${sampleIndex === selected ? "selected" : ""}>Sample ${sampleIndex + 1}</option>`
                    )
                    .join("")}
                </select>
              </label>`;
          })
          .join("")}
      </div>
      <label class="phase-confirmation">
        <input id="phase-confirmation" type="checkbox" ${state.phaseConfirmation ? "checked" : ""} ${
          reviewRequired && !ready ? "" : "disabled"
        } />
        <span>I reviewed these provisional labels. They may not represent each exact swing event.</span>
      </label>
      <div class="action-row">
        <button class="primary-action" type="button" data-confirm-phase-review ${
          reviewRequired && state.phaseConfirmation && isValidCorrection(state.phaseDraft) && !ready ? "" : "disabled"
        }>Confirm phase review</button>
        <button class="secondary-action" type="button" data-open-export>Open Swing Card export</button>
        <p class="action-note">${ready ? "Future metric readiness is available for a separately reviewed story. No metrics are generated here." : "Future metric readiness remains locked until this review is valid and explicitly confirmed."}</p>
      </div>
    </section>
  `;
}

function renderKeyframeOverlayReview(state: AppState): string {
  const selectedOutput = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const selectedPhase = phaseDefinitions[selectedOutput?.index ?? 0] ?? phaseDefinitions[0];
  const overlayStatus =
    state.latestOverlayResult?.status === "unavailable"
      ? "Skeleton overlay unavailable for this keyframe."
      : state.latestOverlayResult?.status === "partial"
        ? "Skeleton overlay partially available for this keyframe."
        : "Skeleton overlay rendered for this keyframe.";

  return `
    <section class="keyframe-review" aria-labelledby="keyframe-review-heading">
      <div class="keyframe-review__heading">
        <div>
          <p class="placeholder-kicker">Annotated keyframes</p>
          <h3 id="keyframe-review-heading">${selectedPhase.label}</h3>
        </div>
        <span class="stage-status">Annotated still</span>
      </div>
      <div class="keyframe-canvas-wrap">
        <canvas class="keyframe-canvas" data-keyframe-canvas aria-label="Annotated keyframe: ${selectedPhase.label}"></canvas>
      </div>
      <p class="action-note" data-overlay-status>${overlayStatus}</p>
      <div class="keyframe-strip" aria-label="Select keyframe">
        ${phaseDefinitions
          .map((phase, index) => {
            const isSelected = state.selectedKeyframeIndex === index;
            return `<button class="keyframe-button ${isSelected ? "is-selected" : ""}" type="button" data-keyframe-index="${index}" aria-pressed="${isSelected ? "true" : "false"}">
              <span>${index + 1}</span>
              <strong>${phase.label}</strong>
            </button>`;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderDeclarationSelect(
  id: string,
  label: string,
  selected: string,
  options: readonly (readonly [string, string])[]
): string {
  return `<label for="${id}">${label}<select id="${id}" aria-label="${label}">${options
    .map(([value, text]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${text}</option>`)
    .join("")}</select></label>`;
}

export function declarationValue<K extends keyof PhaseDeclarations>(
  value: string,
  _key: K
): PhaseDeclarations[K] {
  return value as PhaseDeclarations[K];
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 15 Complete current file: src/phase-review-renderer.ts -->

### 16 Complete current file: src/remote-model-renderer.ts

Lines: 38  
Bytes: 1856  
SHA-256: `83b30d3ae95f529fc58192224bb129d41dee4fb6fbd5bb09eb681ed8b878eaef`

<!-- BEGIN EXACT BLOCK: 16 Complete current file: src/remote-model-renderer.ts -->
````````````````````````````````````````text
import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses
} from "./model-adapter-contract";
import { reviewedModelProviders } from "./model-consent";
import { formatRemoteDataClass } from "./render-utils";

export function renderRemoteModelReviewPanel(): string {
  const providerAvailable = reviewedModelProviders.length > 0;
  return `
    <section class="remote-model-panel" aria-labelledby="remote-model-heading">
      <div class="remote-model-panel__header">
        <div>
          <p class="placeholder-kicker">Optional remote review</p>
          <h4 id="remote-model-heading">Remote model review unavailable</h4>
        </div>
        <span class="stage-status">Off by default</span>
      </div>
      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
        <div>
          <dt>Provider registry</dt>
          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
        </div>
        <div>
          <dt>Would send after future consent</dt>
          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
        <div>
          <dt>Will not send in SS-013</dt>
          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
        </div>
      </dl>
      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
    </section>
  `;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 16 Complete current file: src/remote-model-renderer.ts -->

### 17 Complete current file: src/keyframe-overlay-renderer.ts

Lines: 40  
Bytes: 1627  
SHA-256: `7780ae6558db6ef02613072b8cc3037a5df98ee9b3d8ea0e65275dfdf4e086d9`

<!-- BEGIN EXACT BLOCK: 17 Complete current file: src/keyframe-overlay-renderer.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import { setOverlayResult } from "./app-state";
import type { SampledFrameOutput } from "./frame-processing";
import { renderPoseOverlayFrame, type PoseOverlayRenderResult } from "./pose-renderer";

export function renderSelectedKeyframeCanvas(root: ParentNode, state: AppState): void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-keyframe-canvas]");
  if (!canvas || state.phaseOutputs.length === 0) return;
  const output = state.phaseOutputs[state.selectedKeyframeIndex] ?? state.phaseOutputs[0];
  const status = root.querySelector<HTMLElement>("[data-overlay-status]");
  const result = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  setOverlayResult(state, result);
  if (status) {
    status.textContent =
      result.status === "unavailable"
        ? "Skeleton overlay unavailable for this keyframe."
        : result.status === "partial"
          ? "Skeleton overlay partially available for this keyframe."
          : "Skeleton overlay rendered for this keyframe.";
  }
}

export async function renderAnnotatedKeyframe(
  output: SampledFrameOutput
): Promise<{ preview?: ImageBitmap; overlay: PoseOverlayRenderResult } | undefined> {
  const canvas = document.createElement("canvas");
  const overlay = renderPoseOverlayFrame(canvas, {
    preview: output.preview,
    landmarks: output.pose.landmarks[0]
  });
  if (overlay.status === "unavailable") return { overlay };
  try {
    return { preview: await createImageBitmap(canvas), overlay };
  } catch {
    return { overlay };
  }
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 17 Complete current file: src/keyframe-overlay-renderer.ts -->

### 18 Complete current file: src/swing-card-actions.ts

Lines: 130  
Bytes: 4493  
SHA-256: `e0ee4400bd5a15c995c56fe146518ad3746adf75b39cebb485caf024a2e020f3`

<!-- BEGIN EXACT BLOCK: 18 Complete current file: src/swing-card-actions.ts -->
````````````````````````````````````````text
import type { AppState } from "./app-state";
import {
  getCompleteSwingCardAssignments,
  setSwingCardBusy,
  setSwingCardStatus
} from "./app-state";
import type { PhaseAssignment } from "./phase-review";
import { phaseDefinitions } from "./phase-review";
import type { SwingCardContent, SwingCardKeyframe } from "./swing-card-contract";
import {
  buildSwingCardPrompt,
  composeSwingCardPng,
  deriveSwingCardContentWarnings,
  renderSwingCardPrintSurface,
  triggerSwingCardDownload
} from "./swing-card-generator";
import type { SampledFrameOutput } from "./frame-processing";
import { renderAnnotatedKeyframe } from "./keyframe-overlay-renderer";

export interface PreparedSwingCardContent {
  content: SwingCardContent;
  release(): void;
}

export async function downloadSwingCard(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing local Swing Card PNG.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const result = await composeSwingCardPng(prepared.content);
    if (result.status === "ok") {
      triggerSwingCardDownload(result.blob, result.filename);
      setSwingCardStatus(state, "Swing Card PNG download started.");
    } else {
      setSwingCardStatus(state, `Swing Card PNG export stopped (${result.reason}).`);
    }
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function printSwingCard(
  root: ParentNode,
  state: AppState,
  requestRender: (statusMessage?: string) => void
): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing browser print view.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    const host = root.querySelector<HTMLElement>("[data-swing-card-print-host]");
    host?.replaceChildren(renderSwingCardPrintSurface(prepared.content));
    setSwingCardStatus(state, "Browser print dialog opened. Save as PDF if your browser supports it.");
    window.print();
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function copySwingCardPrompt(state: AppState, requestRender: (statusMessage?: string) => void): Promise<void> {
  if (state.swingCardBusy) return;
  setSwingCardBusy(state, true);
  setSwingCardStatus(state, "Preparing prompt text.");
  requestRender();
  const prepared = await prepareSwingCardContent(state);
  try {
    await navigator.clipboard.writeText(prepared.content.analysisPrompt);
    setSwingCardStatus(state, "Prompt copied for manual use.");
  } catch {
    setSwingCardStatus(state, "Prompt copy unavailable in this browser.");
  } finally {
    prepared.release();
    setSwingCardBusy(state, false);
    requestRender();
  }
}

export async function prepareSwingCardContent(state: AppState): Promise<PreparedSwingCardContent> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments(state);

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? state.phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframeWithoutTiming(output) : undefined;
    if (rendered?.preview) createdBitmaps.push(rendered.preview);
    keyframes.push({
      phaseId: phase.id,
      phaseLabel: phase.label,
      preview: rendered?.preview,
      overlay: rendered?.overlay
    });
  }

  const warnings = deriveSwingCardContentWarnings({
    keyframes,
    metricPayload: undefined,
    phaseReviewConfirmed: (state.phaseReviewState?.readyForFutureMetrics ?? false) && hasCompleteAssignments(assignments)
  });
  const base: SwingCardContent = {
    keyframes,
    metricPayload: undefined,
    warnings,
    analysisPrompt: ""
  };
  const content = { ...base, analysisPrompt: buildSwingCardPrompt(base) };
  return {
    content,
    release: () => {
      for (const bitmap of createdBitmaps) bitmap.close();
    }
  };
}

async function renderAnnotatedKeyframeWithoutTiming(output: SampledFrameOutput) {
  return renderAnnotatedKeyframe(output);
}

function hasCompleteAssignments(assignments: readonly PhaseAssignment[] | undefined): boolean {
  return !!assignments;
}
````````````````````````````````````````
<!-- END EXACT BLOCK: 18 Complete current file: src/swing-card-actions.ts -->

### 19 Complete current file: test/unit/analysis-lifecycle.test.ts

Lines: 128  
Bytes: 4238  
SHA-256: `f486920cc919b5f2e4a975745d697cde1d222278ca4f789fe51d82a3df3b33a5`

<!-- BEGIN EXACT BLOCK: 19 Complete current file: test/unit/analysis-lifecycle.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import { AnalysisLifecycle } from "../../src/analysis-lifecycle";
import {
  createInitialAppState,
  selectLocalVideo,
  selectWorkflowStep,
  setProcessingState
} from "../../src/app-state";
import { renderApp } from "../../src/app-renderer";

class FakeElement {
  innerHTML = "";
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("analysis lifecycle ownership", () => {
  it("keeps network-blocked abort scoped to active local processing", () => {
    const state = createInitialAppState();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender: () => undefined
    });
    const abort = vi.fn();
    Object.assign(lifecycle as unknown as { abortFrameController?: (code: string) => void }, {
      abortFrameController: abort
    });

    setProcessingState(state, "idle");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).not.toHaveBeenCalled();

    setProcessingState(state, "loading");
    lifecycle.abortWithNetworkBlocked();
    expect(abort).toHaveBeenCalledWith("UNEXPECTED_NETWORK_BLOCKED");
  });

  it("clears lifecycle-owned controller handles and syncs app-state idle on close", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const close = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(
      lifecycle as unknown as {
        frameController?: { close: () => Promise<void> };
        abortFrameController?: (code: string) => void;
      },
      {
        frameController: { close },
        abortFrameController: vi.fn()
      }
    );
    setProcessingState(state, "processing");

    await lifecycle.closeActive();

    expect(close).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledTimes(1);
  });

  it("re-renders capture controls after async close settles", async () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    const closeDeferred = deferred();
    const requestRender = vi.fn(() => renderApp(root, state, true));
    const lifecycle = new AnalysisLifecycle({
      root: root as unknown as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { close: () => Promise<void> } }, {
      frameController: { close: () => closeDeferred.promise }
    });
    selectLocalVideo(state, new File(["video"], "swing.mp4", { type: "video/mp4" }));
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    const closePromise = lifecycle.closeActive();
    selectWorkflowStep(state, "capture");
    renderApp(root, state, true);

    expect(root.innerHTML).toMatch(/id="analysis-button"[\s\S]*disabled/);

    closeDeferred.resolve();
    await closePromise;

    expect(requestRender).toHaveBeenCalledTimes(1);
    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).not.toMatch(/id="analysis-button"[\s\S]*disabled/);
  });

  it("stops active processing and requests an idle capture render", async () => {
    const state = createInitialAppState();
    const requestRender = vi.fn();
    const cancel = vi.fn();
    const lifecycle = new AnalysisLifecycle({
      root: {} as ParentNode,
      state,
      requestRender
    });
    Object.assign(lifecycle as unknown as { frameController?: { cancel: () => Promise<void> } }, {
      frameController: { cancel }
    });
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");

    await lifecycle.stopActive();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(lifecycle.hasActiveController()).toBe(false);
    expect(state.activeStep).toBe("capture");
    expect(state.processingState).toBe("idle");
    expect(requestRender).toHaveBeenCalledWith("Local analysis stopped and volatile resources were released.");
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 19 Complete current file: test/unit/analysis-lifecycle.test.ts -->

### 20 Complete current file: test/unit/app-events.test.ts

Lines: 54  
Bytes: 1563  
SHA-256: `f3a5e94aff173401f31e5f2f1fc451f725524253bee092b6677d83194c71f2a7`

<!-- BEGIN EXACT BLOCK: 20 Complete current file: test/unit/app-events.test.ts -->
````````````````````````````````````````text
import { describe, expect, it, vi } from "vitest";
import { bindAppEvents } from "../../src/app-events";
import { createInitialAppState } from "../../src/app-state";
import type { SafetyConsentStore } from "../../src/consent-state";

class FakeButton {
  private listeners: (() => void)[] = [];

  addEventListener(_event: "click", listener: () => void): void {
    this.listeners.push(listener);
  }

  click(): void {
    for (const listener of this.listeners) listener();
  }
}

class FakeRoot {
  constructor(private readonly button: FakeButton) {}

  querySelector(selector: string) {
    return selector === "[data-placeholder-action='camera']" ? this.button : null;
  }

  querySelectorAll() {
    return [];
  }
}

describe("app event binding", () => {
  it("binds fresh DOM after repeated renders without duplicate effects", () => {
    const requestRender = vi.fn();
    const consent: SafetyConsentStore = {
      hasSafetyConsent: () => false,
      setSafetyConsent: () => undefined
    };
    const dependencies = {
      state: createInitialAppState(),
      consent,
      lifecycle: {} as never,
      requestRender
    };

    const firstButton = new FakeButton();
    bindAppEvents(new FakeRoot(firstButton) as unknown as ParentNode, dependencies);
    firstButton.click();
    expect(requestRender).toHaveBeenCalledTimes(1);

    const secondButton = new FakeButton();
    bindAppEvents(new FakeRoot(secondButton) as unknown as ParentNode, dependencies);
    secondButton.click();
    expect(requestRender).toHaveBeenCalledTimes(2);
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 20 Complete current file: test/unit/app-events.test.ts -->

### 21 Complete current file: test/unit/app-renderer.test.ts

Lines: 147  
Bytes: 5007  
SHA-256: `a3b7d7f0e81c116082a134c53ac6a66fe378d14fb46b4265b6fa50dfca2b245b`

<!-- BEGIN EXACT BLOCK: 21 Complete current file: test/unit/app-renderer.test.ts -->
````````````````````````````````````````text
import { describe, expect, it } from "vitest";
import type { SampledFrameOutput } from "../../src/frame-processing";
import { renderApp, updateProcessingProgressUi } from "../../src/app-renderer";
import {
  completeProcessingWithOutputs,
  createInitialAppState,
  rebuildPhaseReviewState,
  selectLocalVideo,
  selectWorkflowStep,
  setPhaseDeclaration,
  setProcessingProgress,
  setProcessingState
} from "../../src/app-state";
import { phaseDefinitions } from "../../src/phase-review";
import { poseThresholds, type PoseFrameResult, type PoseLandmark } from "../../src/pose-contract";

class FakeElement {
  innerHTML = "";
  textContent = "";
  hidden = false;
  private readonly selectors = new Map<string, FakeElement>();

  querySelector<T>(_selector: string): T | null {
    return (this.selectors.get(_selector) ?? null) as T | null;
  }

  set(selector: string, element: FakeElement): void {
    this.selectors.set(selector, element);
  }
}

function landmark(): PoseLandmark {
  return { x: 0.5, y: 0.5, z: 0, visibility: 1 };
}

function pose(timestampMs: number): PoseFrameResult {
  return {
    timestampMs,
    landmarks: [Array.from({ length: 33 }, landmark)],
    worldLandmarks: [Array.from({ length: 33 }, landmark)],
    thresholds: poseThresholds
  };
}

function sampledOutputs(): SampledFrameOutput[] {
  return phaseDefinitions.map((_, index) => ({
    runGeneration: 1,
    index,
    requestedTimestampMs: index * 100,
    observedSeekTimestampMs: index * 100 + 0.5,
    preview: { close: () => undefined, width: 320, height: 180 } as unknown as ImageBitmap,
    pose: pose(index * 100)
  }));
}

function createReviewReadyState() {
  const state = createInitialAppState();
  completeProcessingWithOutputs(state, { getOutputs: () => sampledOutputs() });
  setPhaseDeclaration(state, "view", "face-on");
  setPhaseDeclaration(state, "handedness", "right");
  setPhaseDeclaration(state, "mirrored", "no");
  setPhaseDeclaration(state, "setup", "confirmed");
  rebuildPhaseReviewState(state);
  return state;
}

describe("app renderer contracts", () => {
  it("preserves protected capture selectors and escapes selected file names", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createInitialAppState();
    selectLocalVideo(state, new File(["video"], `<bad "name">.mp4`, { type: "video/mp4" }));

    renderApp(root, state, true);

    expect(root.innerHTML).toContain('id="analysis-button"');
    expect(root.innerHTML).toContain('id="video-file"');
    expect(root.innerHTML).toContain("Local video source");
    expect(root.innerHTML).toContain("&lt;bad &quot;name&quot;&gt;.mp4");
    expect(root.innerHTML).not.toContain(`<bad "name">.mp4`);
  });

  it("preserves protected phase-review selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "review");

    renderApp(root, state, true);

    for (const value of [
      "Swing phase assignments",
      "View",
      "Handedness",
      "Horizontally mirrored",
      "Select keyframe",
      "data-confirm-phase-review",
      "data-phase-index",
      "data-open-export"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("preserves protected export and remote-review-unavailable selectors and labels", () => {
    const root = new FakeElement() as unknown as HTMLElement;
    const state = createReviewReadyState();
    selectWorkflowStep(state, "export");

    renderApp(root, state, true);

    for (const value of [
      "Downloadable summary",
      "Remote model review unavailable",
      "Remote model data disclosure",
      "data-download-swing-card",
      "data-print-swing-card",
      "data-copy-swing-card-prompt",
      "data-swing-card-status",
      "data-swing-card-print-host",
      "data-remote-model-send"
    ]) {
      expect(root.innerHTML).toContain(value);
    }
  });

  it("updates current processing DOM by re-querying targets and no-ops when absent", () => {
    const state = createInitialAppState();
    selectWorkflowStep(state, "processing");
    setProcessingState(state, "processing");
    setProcessingProgress(state, 1, 8);

    const detachedSummary = new FakeElement();
    const oldRoot = new FakeElement();
    oldRoot.set("[data-pose-summary]", detachedSummary);
    updateProcessingProgressUi(oldRoot as unknown as ParentNode, state);
    expect(detachedSummary.textContent).toContain("1 of 8");

    setProcessingProgress(state, 2, 8);
    const visibleSummary = new FakeElement();
    const nextRoot = new FakeElement();
    nextRoot.set("[data-pose-summary]", visibleSummary);
    updateProcessingProgressUi(nextRoot as unknown as ParentNode, state);

    expect(visibleSummary.textContent).toContain("2 of 8");
    expect(detachedSummary.textContent).toContain("1 of 8");
    expect(() => updateProcessingProgressUi(new FakeElement() as unknown as ParentNode, state)).not.toThrow();
  });
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 21 Complete current file: test/unit/app-renderer.test.ts -->

### 22 Complete current file: test/smoke/app.spec.ts

Lines: 618  
Bytes: 26942  
SHA-256: `bc22d1904050af53ec6d43845f3906c62cc9cf96779ac5af033fae2f8594835d`

<!-- BEGIN EXACT BLOCK: 22 Complete current file: test/smoke/app.spec.ts -->
````````````````````````````````````````text
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { resolve } from "node:path";

const poseFixture = resolve("test/fixtures/pose-landmarker/mannequin-golf-address.webm");
const allowedRequestPattern = /^http:\/\/127\.0\.0\.1:4174\/|^blob:/;
const sensitiveOutputPattern =
  /\b(?:landmarks?|worldLandmarks|media characteristics|file\s?name|object\s?url|objectUrl|metricPayload|requestedTimestampMs|observedSeekTimestampMs|timestamp|hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id|raw video)\b|\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b|\b[0-9a-f]{24,}\b|\b[A-Za-z0-9_-]{32,}\b|blob:http/i;

const requestLogByContext = new WeakMap<BrowserContext, string[]>();
const blockedExternalByContext = new WeakMap<BrowserContext, string[]>();
const consoleLogByPage = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }, testInfo) => {
  const context = page.context();
  const requests: string[] = [];
  const blockedExternal: string[] = [];
  const consoleMessages: string[] = [];
  requestLogByContext.set(context, requests);
  blockedExternalByContext.set(context, blockedExternal);
  consoleLogByPage.set(page, consoleMessages);

  context.on("request", (request) => requests.push(request.url()));
  page.on("console", (message) => consoleMessages.push(message.text()));

  if (testInfo.title.includes("external network is blocked from navigation start")) {
    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (allowedRequestPattern.test(url)) {
        void route.continue();
        return;
      }
      blockedExternal.push(url);
      void route.abort();
    });
  }

  await page.addInitScript(() => {
    const calls: string[] = [];
    Object.assign(window, { __swingSyncCameraCalls: calls });
    const existingMediaDevices = navigator.mediaDevices ?? {};
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        ...existingMediaDevices,
        getUserMedia: () => {
          calls.push("getUserMedia");
          return Promise.reject(new DOMException("Camera capture is out of scope", "NotAllowedError"));
        }
      }
    });
  });

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.afterEach(async ({ page }) => {
  const cameraCalls = await page.evaluate(
    () => ((window as typeof window & { __swingSyncCameraCalls?: string[] }).__swingSyncCameraCalls ?? [])
  );
  expect(cameraCalls).toEqual([]);
});

function requestsFor(page: Page): string[] {
  return requestLogByContext.get(page.context()) ?? [];
}

function blockedExternalFor(page: Page): string[] {
  return blockedExternalByContext.get(page.context()) ?? [];
}

function consoleMessagesFor(page: Page): string[] {
  return consoleLogByPage.get(page) ?? [];
}

function externalRequests(urls: readonly string[]): readonly string[] {
  return urls.filter((url) => !allowedRequestPattern.test(url));
}

function expectNoSensitiveOutput(output: string): void {
  expect(output).not.toMatch(sensitiveOutputPattern);
}

async function expectNoBrowserStorage(page: Page): Promise<void> {
  const storage = await page.evaluate(async () => ({
    indexedDb: "databases" in indexedDB ? await indexedDB.databases() : [],
    caches: await caches.keys()
  }));
  expect(storage.indexedDb).toEqual([]);
  expect(storage.caches).toEqual([]);
}

async function completePhaseReview(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
}

test("opens to capture flow and keeps analysis fail closed until consent and video", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Capture or choose your swing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use camera" })).toBeVisible();
  await expect(page.getByText("Camera capture is not part of this story")).toBeVisible();

  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();
  await page.getByRole("checkbox").check();
  await expect(beginAnalysis).toBeDisabled();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await expect(beginAnalysis).toBeEnabled();
  await page.getByRole("button", { name: "Use camera" }).click();
  await expect(page.getByRole("status")).toContainText("Camera capture remains out of scope");
});

test("fails closed when local consent storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("fails closed when stored consent cannot be removed", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
  });
  await page.reload();

  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });
  await expect(consent).toBeChecked();
  await expect(beginAnalysis).toBeDisabled();

  await consent.click();
  await expect(consent).not.toBeChecked();
  await expect(beginAnalysis).toBeDisabled();
});

test("runtime consent guard reports inline and focuses the acknowledgement", async ({ page }) => {
  const consent = page.getByRole("checkbox");
  const beginAnalysis = page.getByRole("button", { name: "Begin analysis" });

  await beginAnalysis.evaluate((button) => button.removeAttribute("disabled"));
  await beginAnalysis.click();

  await expect(page.getByRole("status")).toContainText(
    "Please acknowledge the safety terms before starting analysis"
  );
  await expect(consent).toBeFocused();
  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
});

test("shows every required placeholder state", async ({ page }) => {
  for (const [buttonName, headingName] of [
    ["Process", "Processing"],
    ["Review", "Review"],
    ["Export", "Export"]
  ]) {
    await page.getByRole("button", { name: new RegExp(buttonName) }).click();
    await expect(page.getByRole("heading", { name: headingName })).toBeVisible();
    await expect(page.getByText("Local workflow")).toBeVisible();
  }
});

test("loads locally in a worker and extracts complete fixture landmarks", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByRole("button", { name: "Stop local analysis" })).toBeEnabled();
  await expect(page.locator("[data-pose-summary]")).toContainText(
    "33 normalized landmarks retained",
    { timeout: 30_000 }
  );
  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });

  const requests = requestsFor(page);
  const requestsAtReady = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtReady);
  expect(externalRequests(requests)).toEqual([]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));

  await expectNoBrowserStorage(page);
});

test("requires accessible explicit review and accepts only valid nondecreasing phase correction", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await expect(page.locator(".phase-warning")).toHaveAttribute("aria-live", "polite");
  const canvas = page.locator("[data-keyframe-canvas]");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Address");
  await expect(page.locator("[data-overlay-status]")).toContainText(/Skeleton overlay/);
  await page.locator("[data-keyframe-index='3']").click();
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("aria-label", "Annotated keyframe: Top");
  const canvasState = await page.evaluate(() => {
    const element = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const label = element.getAttribute("aria-label") ?? "";
    const context = element.getContext("2d");
    const samples: number[] = [];
    if (context) {
      const image = context.getImageData(0, 0, element.width, element.height).data;
      const points = [
        [0.25, 0.25],
        [0.5, 0.5],
        [0.75, 0.75],
        [0.25, 0.75],
        [0.75, 0.25]
      ];
      for (const [xRatio, yRatio] of points) {
        const x = Math.min(element.width - 1, Math.max(0, Math.floor(element.width * xRatio)));
        const y = Math.min(element.height - 1, Math.max(0, Math.floor(element.height * yRatio)));
        const offset = (y * element.width + x) * 4;
        samples.push(image[offset] ?? 0, image[offset + 1] ?? 0, image[offset + 2] ?? 0, image[offset + 3] ?? 0);
      }
    }
    return {
      width: element.width,
      height: element.height,
      label,
      canvasCount: document.querySelectorAll("[data-keyframe-canvas]").length,
      nonTransparentSamples: samples.filter((_, index) => index % 4 === 3 && samples[index] > 0).length,
      uniqueSampleValues: new Set(samples.join(",").split(",")).size
    };
  });
  expect(canvasState.width).toBeGreaterThan(0);
  expect(canvasState.height).toBeGreaterThan(0);
  expect(canvasState.canvasCount).toBe(1);
  expect(canvasState.nonTransparentSamples).toBeGreaterThan(0);
  expect(canvasState.uniqueSampleValues).toBeGreaterThan(1);
  expect(canvasState.label).not.toMatch(/right|left|face-on|mirrored|warning|confidence|filename|timestamp|correct/i);
  await expect(page.getByLabel("View", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Handedness", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel("Horizontally mirrored", { exact: true })).toHaveValue("undeclared");
  await expect(page.getByLabel(/I confirm this is one trimmed/)).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();

  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();

  await expect(page.locator(".phase-warning")).toContainText("Review required");
  for (const phase of [
    "Address",
    "Toe-up",
    "Mid-backswing",
    "Top",
    "Mid-downswing",
    "Impact",
    "Mid-follow-through",
    "Finish"
  ]) {
    await expect(page.locator(".phase-assignment").getByText(phase, { exact: true })).toBeVisible();
  }

  const assignments = page.locator("[data-phase-index]");
  await assignments.nth(1).selectOption("2");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeDisabled();
  await assignments.nth(1).selectOption("1");
  await assignments.nth(2).selectOption("1");
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await expect(page.getByRole("button", { name: "Confirm phase review" })).toBeEnabled();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Phase review confirmed");
  await expect(page.getByText(/Future metric readiness is available/)).toBeVisible();

  await page.getByRole("button", { name: /Export/ }).click();
  await page.getByRole("button", { name: /Review/ }).click();
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await expect(page.getByText("Annotated keyframes")).toBeVisible();
});

test("downloads a local Swing Card PNG and exposes print and prompt controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await page.getByLabel("View", { exact: true }).selectOption("face-on");
  await page.getByLabel("Handedness", { exact: true }).selectOption("right");
  await page.getByLabel("Horizontally mirrored", { exact: true }).selectOption("no");
  await page.getByLabel(/I confirm this is one trimmed/).check();
  await page.getByLabel(/I reviewed these provisional labels/).check();
  await page.getByRole("button", { name: "Confirm phase review" }).click();
  await page.getByRole("button", { name: "Open Swing Card export" }).click();

  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
  await expect(page.getByText("No reviewed provider is configured for this story.")).toBeVisible();
  await expect(page.getByText("Metrics, Warnings and Limitations, Manual Swing Card Prompt")).toBeVisible();
  await expect(page.getByText("Raw Video, Frame Pixels, Selected Keyframe Images, Pose Landmarks")).toBeVisible();
  await expect(page.getByRole("button", { name: "Remote review unavailable" })).toBeDisabled();
  const controlLayout = await page.evaluate(() => {
    const buttons = [
      ...document.querySelectorAll("[data-download-swing-card], [data-print-swing-card], [data-copy-swing-card-prompt]")
    ];
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      minButtonHeight: Math.min(...buttons.map((button) => button.getBoundingClientRect().height))
    };
  });
  expect(controlLayout.hasOverflow).toBe(false);
  expect(controlLayout.minButtonHeight).toBeGreaterThanOrEqual(44);

  await page.evaluate(() => {
    Object.assign(window, { __swingCardPrintCalls: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls += 1;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __swingCardPrintCalls: number }).__swingCardPrintCalls)).toBe(1);

  await page.evaluate(() => {
    const writes: string[] = [];
    Object.assign(window, { __swingCardClipboardWrites: writes });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          writes.push(text);
        }
      }
    });
  });
  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copied for manual use");
  const copiedPrompts = await page.evaluate(
    () =>
      (window as typeof window & { __swingCardClipboardWrites?: string[] }).__swingCardClipboardWrites ?? []
  );
  expect(copiedPrompts).toHaveLength(1);
  expect(copiedPrompts[0]).toContain("Metric summary:");
  expect(copiedPrompts[0]).toContain("unavailable");
  expectNoSensitiveOutput(copiedPrompts[0]);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException("Clipboard unavailable", "NotAllowedError");
        }
      }
    });
  });
  await page.getByRole("button", { name: "Copy prompt" }).click();
  await expect(page.locator("[data-swing-card-status]")).toContainText("Prompt copy unavailable in this browser");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^swing-sync-card-\d{8}-[a-f0-9]{8}\.png$/);

  const requests = requestsFor(page);
  const requestsAtDownload = requests.length;
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(requestsAtDownload);
  expect(externalRequests(requests)).toEqual([]);

  await expectNoBrowserStorage(page);
  const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(localStorageKeys).toEqual(["swing-sync:safety-consent:v1"]);
  expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
});

test("keeps Swing Card keyframes unavailable until phase review is complete", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();
  await expect(page.locator(".phase-warning")).toContainText("Unsupported input");
  await page.getByRole("button", { name: "Open Swing Card export" }).click();
  await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
  await expect(page.getByLabel("Swing Card warnings")).toContainText("Phase review is required");

  await page.evaluate(() => {
    Object.assign(window, { __swingCardUnavailablePrintKeyframes: 0 });
    window.print = () => {
      (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes =
        document.querySelectorAll(".swing-card-print__placeholder").length;
    };
  });
  await page.getByRole("button", { name: "Print / Save as PDF" }).click();

  const unavailableCount = await page.evaluate(
    () => (window as typeof window & { __swingCardUnavailablePrintKeyframes: number }).__swingCardUnavailablePrintKeyframes
  );
  expect(unavailableCount).toBe(8);
});

test("completes local inference when external network is blocked from navigation start", async ({
  page
}) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
  expect(blockedExternalFor(page)).toEqual([]);
  expect(externalRequests(requestsFor(page))).toEqual([]);
});

test("reports a useful local error when model initialization fails", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => route.abort());
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  await expect(page.locator("[data-pose-summary]")).toContainText("0 of 8 video frames processed");
  await expect(page.getByRole("button", { name: "Retry local analysis" })).toBeVisible();
});

test("retries with a fresh local session after initialization failure", async ({ page }) => {
  let shouldFail = true;
  await page.route("**/models/pose_landmarker_full-float16-v1.task", (route) => {
    if (shouldFail) {
      void route.abort();
      return;
    }
    void route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();

  await expect(page.getByText(/Local pose analysis stopped \(LOCAL_MODEL_INIT_FAILED\)/)).toBeVisible({
    timeout: 20_000
  });
  shouldFail = false;
  await page.getByRole("button", { name: "Retry local analysis" }).click();

  await expect(page.locator("[data-pose-summary]")).toContainText("8 of 8 video frames processed", {
    timeout: 30_000
  });
});

test("keeps the UI responsive while the local model loads", async ({ page }) => {
  await page.route("**/models/pose_landmarker_full-float16-v1.task", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  await expect(page.getByRole("heading", { name: "Capture or upload" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("volatile resources were released");
});

test("fails closed and reports a CSP-blocked outbound request", async ({ page }) => {
  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.evaluate(() => {
    void fetch("https://example.com/blocked-by-swing-sync-csp").catch(() => undefined);
  });

  await expect(page.getByText(/Local pose analysis stopped \(UNEXPECTED_NETWORK_BLOCKED\)/)).toBeVisible();
});

test("releases the selected object URL when analysis stops", async ({ page }) => {
  await page.addInitScript(() => {
    const created: string[] = [];
    const revoked: string[] = [];
    const originalCreate = URL.createObjectURL.bind(URL);
    const originalRevoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      const url = originalCreate(value);
      created.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      revoked.push(url);
      originalRevoke(url);
    };
    Object.assign(window, { __poseObjectUrls: { created, revoked } });
  });
  await page.reload();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await page.getByRole("button", { name: "Stop local analysis" }).click();

  const urls = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __poseObjectUrls: { created: string[]; revoked: string[] };
        }
      ).__poseObjectUrls
  );
  expect(urls.revoked).toEqual(urls.created);
});

test("fits the mobile viewport without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  expect(hasOverflow).toBe(false);
  await expect(page.getByRole("checkbox")).toBeVisible();

  await page.getByRole("checkbox").check();
  await page.locator("#video-file").setInputFiles(poseFixture);
  await page.getByRole("button", { name: "Begin analysis" }).click();
  await expect(page.getByRole("button", { name: "Review phase labels" })).toBeVisible({
    timeout: 30_000
  });
  await page.getByRole("button", { name: "Review phase labels" }).click();

  const layout = await page.evaluate(() => {
    const canvas = document.querySelector("[data-keyframe-canvas]") as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRects = [...document.querySelectorAll("[data-keyframe-index]")].map((button) =>
      button.getBoundingClientRect()
    );
    const criticalTextSelectors = [
      ".phase-warning",
      ".keyframe-review__heading",
      "[data-overlay-status]",
      "[data-confirm-phase-review]",
      "[data-open-export]"
    ];
    const criticalText = criticalTextSelectors
      .flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)])
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => ({
        selector: element.matches("[data-confirm-phase-review]")
          ? "confirm"
          : element.matches("[data-open-export]")
            ? "export"
            : element.className || element.tagName,
        clipped:
          Math.ceil(element.scrollHeight) > Math.ceil(element.clientHeight) ||
          Math.ceil(element.scrollWidth) > Math.ceil(element.clientWidth)
      }));
    const overlaps = buttonRects.some((rect, index) =>
      buttonRects.slice(index + 1).some(
        (other) =>
          rect.left < other.right &&
          rect.right > other.left &&
          rect.top < other.bottom &&
          rect.bottom > other.top
      )
    );
    return {
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      canvasWidth: canvasRect.width,
      canvasHeight: canvasRect.height,
      minButtonHeight: Math.min(...buttonRects.map((rect) => rect.height)),
      hasButtonOverlap: overlaps,
      clippedCriticalText: criticalText.filter((item) => item.clipped)
    };
  });

  expect(layout.hasOverflow).toBe(false);
  expect(layout.canvasWidth).toBeGreaterThan(300);
  expect(layout.canvasHeight).toBeGreaterThan(160);
  expect(layout.minButtonHeight).toBeGreaterThanOrEqual(44);
  expect(layout.hasButtonOverlap).toBe(false);
  expect(layout.clippedCriticalText).toEqual([]);
});
````````````````````````````````````````
<!-- END EXACT BLOCK: 22 Complete current file: test/smoke/app.spec.ts -->

### 23 Complete focused diff: git diff -- CONTEXT.md

Lines: 348  
Bytes: 20905  
SHA-256: `f9baa3452684199b06e0dc725e1fb60cc16b42ac14ad0f747c7aa57cc9d2f5ca`

<!-- BEGIN EXACT BLOCK: 23 Complete focused diff: git diff -- CONTEXT.md -->
````````````````````````````````````````text
diff --git a/CONTEXT.md b/CONTEXT.md
index 253ef3e..7c2df07 100644
--- a/CONTEXT.md
+++ b/CONTEXT.md
@@ -1,6 +1,6 @@
 # Swing Sync Context
 
-Last updated: 2026-07-19
+Last updated: 2026-07-20
 
 ## Current State
 
@@ -12,23 +12,325 @@ Last updated: 2026-07-19
   `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`. Local `main` was
   fast-forwarded to `origin/main` by the PR #19 merge flow before this
   post-merge context update.
-- Latest post-merge guidance/context commit before SS-018 delivery:
-  `8c8c400b02ccfd90d6c5e6a8aadc63604c881565`. This change records the SS-018
-  post-merge context sync.
+- Latest post-merge guidance/context commit:
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`. This change records the SS-018
+  merge state and is the confirmed SS-019 specification baseline.
 - Current completed task:
   `SS-018 Refactor frontend app shell into maintainable UI/state modules`
-- Active task: none selected for implementation.
+- Active task:
+  `SS-019 Perform accessibility and responsive design hardening`.
 - Active branch: `main`
-- Active handshake: none.
+- Active handshake: `2. QA Planning (Claude)`.
 - Active Pull Request: none.
-- Next task candidate:
-  `SS-019 Perform accessibility and responsive design hardening`
-- Next task branch: `ss-019-accessibility-design-hardening`
-- Next task handshake: `0. Backlog`
-- Next task Pull Request: empty.
+- Planned story branch after Claude QA-planning clearance:
+  `ss-019-accessibility-design-hardening`.
+- Implementation status: blocked after the second Claude QA-planning FAIL.
+  B2, B5, and B6 are closed; B1, B3, B4, the lead close/token-race precision,
+  and accepted N1-N3 require another focused Claude re-review PASS.
 - Remaining visible non-Done backlog tasks: SS-019 through SS-022, created
   from the manual app-readiness gap review on 2026-07-03.
 
+## SS-019 Coordination
+
+SS-019 is accessibility-, frontend-runtime-, user-facing-behavior-,
+privacy/safety-copy-sensitive, responsive-design-, smoke-test-selector-, and
+manual-QA-sensitive. It may harden DOM semantics, focus restoration, status
+announcements, responsive CSS, and test evidence while preserving local-first
+raw-media handling, consent, remote-review-disabled behavior, protected copy,
+labels, and selectors.
+
+Acceptance criteria from Notion:
+
+- Complete keyboard-only traversal for capture, consent, processing, review,
+  phase confirmation, and Swing Card export flows.
+- Verify visible focus states, labels, headings, status updates, and
+  disabled-control explanations are understandable.
+- Check desktop and mobile layouts for overlap, clipped text, unusable
+  controls, and export-panel readability.
+- Add automated smoke or unit coverage for the highest-risk accessibility and
+  responsive regressions where practical.
+- Document any remaining manual-only accessibility risks.
+
+Protected boundaries from Notion and the approved architecture:
+
+- Do not introduce decorative redesign that obscures the workflow.
+- Do not add runtime telemetry, remote logging, analytics, cloud diagnostics,
+  provider SDKs, model assets, or remote sharing.
+- Do not change safety, privacy, medical-scope, or non-affiliation claims
+  except through the sensitive-story review path.
+- Preserve local-first raw-media handling, explicit consent,
+  remote-review-disabled behavior, service-worker behavior, exported data
+  classes, protected labels, and smoke-test selectors.
+- No dependency, framework, bundle, license-policy, notice, or SBOM change is
+  expected.
+
+Kickoff/spec state on 2026-07-19:
+
+- `git fetch origin` completed successfully. Local `main`, refreshed
+  `origin/main`, and the live remote `refs/heads/main` were confirmed at
+  `b4db367bedcc0f7aefcbb55878ec7ec1a0f549a1`, which includes the SS-018 merge
+  commit `3e383bc21e7837a0b8fc057cb97fdd112375ed0b`.
+- Worktree was clean before selection except for the nine intentional
+  untracked `docs/agent-guidance/*new-codex-session-prompt.md` files, which
+  remain preserved.
+- Notion page:
+  https://app.notion.com/p/392834a0c8a6814db2f6ea28ae195f75
+- Planned branch from confirmed `main` after QA-planning clearance:
+  `ss-019-accessibility-design-hardening`.
+- Pull Request: none.
+- Task Type: `Feature`.
+- Notion task fields were verified before selection: Name
+  `SS-019 Perform accessibility and responsive design hardening`, Branch
+  `ss-019-accessibility-design-hardening`, Handshake Status `0. Backlog`, Pull
+  Request empty, Task Type `Feature`, acceptance criteria, and protected
+  boundaries.
+- Notion moved to `1. Spec Drafting (Gemini)` for configured board
+  compatibility, with Codex recorded as the research/spec owner.
+- Existing `SS-TC-019` was inspected and belongs to SS-013 remote-model
+  adapter consent coverage; it is not reused for SS-019.
+- Dedicated test case `SS-TC-023` was created and related to SS-019:
+  https://app.notion.com/p/3a3834a0c8a6811ab10bfbf9a4651c8f
+- `SS-TC-023` covers keyboard traversal and focus order; accessible names,
+  headings, status semantics, and disabled explanations; desktop/mobile
+  reflow, long/error text, and export readability; named automated tests and
+  manual evidence; and protected no-telemetry/no-remote/no-dependency/no-claim-
+  drift boundaries.
+- Approved research/disposition note:
+  `docs/ss-019-research-disposition.md`.
+- Candidate preimplementation specification:
+  `docs/ss-019-preimplementation-spec.md`.
+- Self-contained Claude QA-planning prompt:
+  `docs/ss-019-claude-qa-planning-prompt.md`.
+- Complete Claude QA-planning source packet:
+  `docs/ss-019-claude-qa-planning-source-packet.md`.
+- The QA-planning handoff is ready as a required two-file paste: prompt first,
+  then source packet immediately after it. The packet manifest contains 33
+  complete current files plus the complete focused `git diff -- CONTEXT.md`,
+  with line counts, byte counts, and SHA-256 hashes. Mechanical verification
+  re-extracted every block and matched it byte-for-byte to the working file or
+  focused diff before status movement.
+- Current-main findings include nested main landmarks, full-render focus loss,
+  the visually hidden file input remaining in sequential focus, inconsistent
+  live/status semantics, insufficient `#d7972d` focus contrast (about 2.51:1
+  on white and 2.29:1 on `#f3f5f1`), low-contrast control boundaries,
+  long-text/reflow risks, and incomplete canvas description semantics.
+- Existing strengths to preserve include the real pose-fixture browser path,
+  protected selector/label assertions, desktop coverage, and the existing
+  390 CSS-pixel mobile checks.
+- Codex dispositions adopt a stable announcer outside `#app`, one main
+  landmark, a new typed `src/app-accessibility.ts` focus/announcement contract,
+  safe closed `data-focus-key` values, explicit/previous/fallback focus
+  restoration, dynamic workflow titles, intent-specific announcements,
+  renderer semantics and disabled descriptions, two-color focus styling,
+  required control-boundary contrast, scoped 44-pixel targets, 320-pixel
+  reflow, forced-color support, real-path automated tests, and a manual QA
+  artifact.
+- Revise broad recommendations to avoid blanket live regions, arbitrary CSS
+  focus selectors, positive tabindex, forced focus after every edit, global
+  target-size inflation, screenshot-only reflow claims, or automated-test-only
+  conformance conclusions.
+- Defer certification, unavailable assistive-technology combinations,
+  complete nonvisual equivalence for the annotated canvas, localization,
+  camera capture, remote review/sharing, providers/models, runtime diagnostics,
+  and decorative redesign.
+- Reject protected copy/selector drift, raw-media upload, remote/provider/model
+  enablement, persistence/service-worker/exported-data changes, telemetry,
+  remote logging, cloud diagnostics, new dependencies, or absolute
+  accessibility/privacy/safety/legal/compliance claims.
+- Observability decision: unchanged. SS-019 adds no telemetry, analytics,
+  remote logging, cloud diagnostics, hidden identifiers, persistent debug
+  artifacts, expanded console output, or runtime operator instrumentation.
+- Dependency decision: no dependency, framework, provider SDK, model asset,
+  bundle, license-policy, notice, or SBOM change is planned. Any scope change
+  requires renewed review and the additional `AGENTS.md` verification.
+- Required implementation-time manual evidence artifact:
+  `docs/ss-019-manual-accessibility-qa.md`. It must record commit/environment,
+  browser/OS/viewport/zoom/input/AT, expected/actual results, evidence,
+  defects, unavailable combinations, and residual risks without claiming
+  certification.
+- Notion moved to `2. QA Planning (Claude)` after the prompt and mechanically
+  verified source packet were persisted. Implementation and story branch
+  creation remain blocked.
+- Next owner: Claude as the independent QA-planning reviewer. Lead architect
+  must disposition any findings and obtain PASS or focused re-review clearance
+  before the builder is invoked.
+- Model/effort metadata exception: the original deep-researcher delegate
+  stalled and exposed no verifiable pinned model or reasoning-effort metadata.
+  The recovery research child also exposed no such metadata. No silent model
+  or effort substitution was selected by the coordinator; the availability
+  limitation is retained in the handoff.
+
+Claude QA-planning response on 2026-07-20:
+
+- Claude returned FAIL with B1-B6. Lead architect accepted all six as blockers;
+  response record: `docs/ss-019-claude-qa-response.md`.
+- B1: accepted. `src/app-accessibility.ts` must provide both post-render and
+  no-render intent application. Processing progress/output remains partial;
+  only processing state text is a scoped polite status. Each controller
+  callback captures its originating controller identity/token and checks it
+  before any state/output/DOM/focus/announcement mutation; stale callbacks
+  return immediately. Current-view completed/failed callbacks may no-render
+  focus the processing heading only when that token is still active. Stop and
+  close synchronously invalidate the active token before awaiting controller
+  cleanup while retaining a local controller reference for resource release,
+  so racing terminal callbacks are inert. Late/cancelled/closed callbacks do
+  not steal focus or duplicate announcements. Retry remains no-render and
+  preserves the controller-owned video node.
+- `closeActive()` ownership is exact: it performs cleanup/state reset only,
+  with no render, focus, or announcement. Workflow-navigation and picker-change
+  callers own the sole destination render; `beforeunload` performs cleanup with
+  no render. `stopActive()` alone owns the stopped/released render, global
+  announcement, and capture focus.
+- B2: accepted. `#video-file` uses `tabindex="-1"` and an accurate defensive
+  label but not `aria-hidden`; successful selection, native cancel, and browser
+  focus-return redirection all restore the visible picker through named
+  automated/manual cases.
+- B3: accepted. Every semantic event has exactly one polite announcement
+  channel. Global status owns full-render shell/workflow/phase/Swing events;
+  scoped live regions are limited to in-place processing state and imperative
+  overlay status. A complete callsite/channel inventory and duplicate-
+  announcement evidence are required.
+- B4: accepted. Capture, keyframe, assignment, and Swing Card summary
+  containers require named group/native semantics. Remote disclosure preserves
+  its native `<dl>` inside a named group wrapper.
+- B5: accepted. The revised spec enumerates every static key, permits only the
+  bounded workflow-step/phase-assignment/keyframe patterns, defines exact
+  per-view fallbacks, and inventories every events/lifecycle/Swing render and
+  no-render callsite including render-free close paths.
+- B6: accepted. Exact tokens are `--focus-inner: #ffffff`,
+  `--focus-outer: #17211b`, and `--interactive-boundary: #607367`; exact ring
+  geometry, corrected surface ratios, >=3:1 threshold, CSS-reading unit tests,
+  computed-style smoke evidence, and forced-colors behavior are specified.
+- Claude's exact-title, exact-fallback, bounded-key, and polite-priority notes
+  are adopted as non-blocking precision within B1-B6, not expanded acceptance.
+- Exact runtime titles are `Swing Sync | Capture`,
+  `Swing Sync | Processing`, `Swing Sync | Review`, and
+  `Swing Sync | Export`.
+- No safety/privacy/non-affiliation claim, local-first/raw-media behavior,
+  remote/provider/model posture, dependency, data, service-worker,
+  observability, telemetry, logging, or cloud behavior changes.
+- Feedback-retention lessons: cross-cutting focus/live-region specs need a
+  complete callsite inventory and single-owner channel matrix; proxy file
+  controls need success/cancel/focus-return coverage; generic `aria-label`
+  needs a naming role or native structure; visual token fixes must quantify
+  exact tokens, surfaces, ratios, geometry, and executable thresholds.
+- Revised candidate spec: `docs/ss-019-preimplementation-spec.md`.
+- The original `docs/ss-019-claude-qa-planning-prompt.md` is superseded for
+  paste use; its original source packet remains unchanged as the exact
+  pre-review baseline record.
+- First focused re-review handoff paths, now superseded for paste use:
+  `docs/ss-019-claude-qa-rereview-prompt.md` and
+  `docs/ss-019-claude-qa-rereview-source-packet.md`.
+- Status remains `2. QA Planning (Claude)`. Pull Request remains empty; active
+  branch remains `main`; implementation and story-branch creation remain
+  blocked.
+- The first focused re-review returned FAIL. The exact second response and
+  lead disposition are recorded below. Builder may start only after another
+  focused PASS and explicit `CLEARED FOR IMPLEMENTATION`.
+
+Focused Claude B1-B6 re-review response on 2026-07-20:
+
+- Claude returned FAIL after mechanically accepting the 40-row/40-block
+  handoff. Exact raw response:
+  `docs/ss-019-claude-qa-second-raw-response.md`. Lead disposition:
+  `docs/ss-019-claude-qa-second-response.md`.
+- B2 is CLOSED and regression-protected: `#video-file` remains outside
+  sequential order without `aria-hidden`; successful selection, native cancel,
+  and defensive focus return restore the visible picker through named
+  automated/manual cases.
+- B5 is CLOSED and regression-protected: exact static/bounded dynamic focus
+  keys, per-view fallbacks, and the complete render/no-render callsite inventory
+  remain required.
+- B6 is CLOSED and regression-protected: exact tokens, two-layer geometry,
+  eleven enumerated surface ratios, `>= 3:1` threshold, CSS-reading unit tests,
+  computed-style smoke checks, and forced-colors behavior remain required.
+- B1 and the lead close/token-race precision remain OPEN via accepted N1. The
+  exact existing unit tests `clears lifecycle-owned controller handles and
+  syncs app-state idle on close` and `re-renders capture controls after async
+  close settles` assert lifecycle-owned rendering that the render-free
+  `closeActive()` contract forbids. The first test is renamed to
+  `clears lifecycle-owned controller handles and syncs app-state idle on close
+  without rendering` with zero render/intent calls; the second is replaced by
+  deferred-close app-events tests named `awaits closeActive before rendering
+  workflow navigation exactly once` and `awaits closeActive before selecting a
+  replacement video and renders exactly once`. Stop, camera, and all legacy
+  render mocks migrate to exact typed requests; old/new contradictory tests may
+  not coexist.
+- B3 remains OPEN via accepted N2. The non-live visible status IDs are exactly
+  `#app-visible-status`, `#phase-review-status`,
+  `#swing-card-action-status`, and `#remote-model-status`; scoped live status is
+  limited to `#processing-status` and `#keyframe-overlay-status`; the global
+  live region is `#app-announcer`. The three existing unscoped
+  `page.getByRole("status")` assertions migrate to direct announcer plus visible
+  non-live status assertions. Existing `.phase-warning` text checks remain,
+  while its live-role assertion becomes exact ID/no-live/description coverage.
+  Processing/review status queries must target exact owners. Phase semantic
+  keys are `unsupported-input`, `review-required`, and `confirmed`; one global
+  announcement occurs only when the key changes.
+- B4 remains OPEN via accepted N3. Exhaustive named semantics cover
+  `Local video source`, `Local pose processing`, `Review placeholder`,
+  `Swing Card contents`, `Swing phase assignments`, and `Select keyframe` as
+  named groups; the export placeholder becomes a native section labelled by
+  the existing `Swing Card unavailable` heading; and the named remote wrapper
+  retains its nested native `<dl>`. Renderer/smoke/manual inventory covers all
+  entries and rejects bare labelled generic containers.
+- Adopted retry precision: focus is idempotent when the target is already
+  active, so retry followed by terminal focus without intervening movement
+  invokes DOM focus once; terminal focus may occur once if the user moved.
+- Adopted description precision: visible description targets use exact unique
+  IDs, state-accurate text, direct relationship assertions, and manual
+  browse-mode verification for disabled controls.
+- Repeatable lesson: contract migrations must inventory and name every
+  superseded existing assertion; adding new tests without migrating old
+  contradictory tests is not implementation-ready.
+- Repeatable lesson: live-region changes must migrate role-based locators and
+  define visible-text ownership separately from scoped/global announcement
+  ownership.
+- Repeatable lesson: DOM anti-pattern audits must exhaustively inventory every
+  current instance rather than fixing only the first examples found.
+- Protected safety/privacy/non-affiliation copy, local-first media, consent,
+  remote-review-disabled behavior, service-worker/exported-data behavior,
+  observability, dependencies, licenses, notices, and SBOM remain unchanged.
+- The final handoff-time SS-019 and SS-TC-023 Notion refetches again failed
+  with `Auth error: OAuth authorization required`; no mutation occurred. Status
+  `2. QA Planning (Claude)`, Pull Request empty, and the SS-TC-023 relationship
+  are retained from the last verified state, not claimed as a fresh live
+  verification.
+- Revised N1-N3 specification:
+  `docs/ss-019-preimplementation-spec.md`. The original planning prompt and the
+  first focused re-review prompt are superseded for paste use; their source
+  packets remain unchanged as exact prior evidence.
+- Active branch remains `main`; no story branch, Pull Request, runtime/UI
+  implementation, or builder delegation exists. Builder remains blocked.
+- New self-contained N1-N3 focused re-review prompt:
+  `docs/ss-019-claude-qa-second-rereview-prompt.md` (123 lines, 5,670 bytes,
+  SHA-256
+  `f21839ef85ce326b9f14a139121c19d9b490a05671fed32e0b8f95b39b8b868d`).
+- New complete focused source packet:
+  `docs/ss-019-claude-qa-second-rereview-source-packet.md`. Its mechanically
+  verified pre-context-refresh build has 25 manifest rows and 25 unique
+  sequential evidence blocks: 22 complete files, two complete focused diffs,
+  and one explicit absent record. It is 4,401 lines and 220,246 bytes with
+  SHA-256
+  `89a024eba67d0a8eac155e91bdfb399f21dbee6fb4e3533f32a0bb3c02589ce0`.
+  Because the packet embeds the complete focused `CONTEXT.md` diff, that one
+  block and the packet digest must be regenerated after this context update;
+  the final post-refresh digest is reported in the handoff rather than embedded
+  recursively here.
+- Coordination exception: repeated workflow-coordinator `apply_patch` calls
+  for the new prompt/packet stalled and were interrupted without producing the
+  requested files. The lead architect completed the prompt and mechanically
+  generated packet as a bounded fallback. This was an orchestration exception,
+  not a role or model/effort substitution; the coordinator independently
+  confirmed the paths, header, sizes, hashes, and 25/25/25 manifest/BEGIN/END
+  counts before this context sync.
+- Status remains `2. QA Planning (Claude)` on `main` with Pull Request empty.
+  Builder, story-branch creation, and runtime/UI implementation remain blocked.
+- Next owner: Claude. Paste the new second-rereview prompt first and the final
+  regenerated source packet immediately after it. Claude must close N1-N3,
+  B1/B3/B4, and the lead close/token-race precision without reopening
+  B2/B5/B6 before builder delegation.
+
 ## SS-018 Coordination
 
 SS-018 is privacy-, safety-boundary-, frontend-runtime-, refactor-,
````````````````````````````````````````
<!-- END EXACT BLOCK: 23 Complete focused diff: git diff -- CONTEXT.md -->

### 24 Complete focused diff: first-rereview-spec -> second-rereview-spec

Lines: 382  
Bytes: 23605  
SHA-256: `dc2b3f970b700890a351d4383273ca8e4ed83d69ab655f52c8f21399ff93f12e`

<!-- BEGIN EXACT BLOCK: 24 Complete focused diff: first-rereview-spec -> second-rereview-spec -->
````````````````````````````````````````text
--- first-rereview/docs/ss-019-preimplementation-spec.md
+++ second-rereview/docs/ss-019-preimplementation-spec.md
@@ -1,11 +1,12 @@
 # SS-019 Preimplementation Specification
 
-Date: 2026-07-19
-
-Status: Revised after Claude QA-planning FAIL B1-B6. Candidate for focused
-Claude re-review. Implementation and branch creation remain blocked until
-Claude returns PASS and explicitly clears every blocker, or further findings
-are resolved and independently re-reviewed.
+Date: 2026-07-20
+
+Status: Revised after the second Claude QA-planning FAIL. B2, B5, and B6 are
+closed and regression-protected. B1, B3, B4, the lead close/token-race
+precision, and accepted N1-N3 remain blocked pending focused Claude re-review.
+Implementation and branch creation remain blocked until Claude returns PASS
+and explicitly clears every open blocker.
 
 Task: SS-019 Perform accessibility and responsive design hardening.
 
@@ -60,9 +61,23 @@
 Own the DOM-only accessibility coordination contract. It must not import or
 mutate app-state persistence.
 
-- Define typed `RenderRequest` and `AccessibilityIntent` contracts. A render
-  request may contain a closed focus intent and at most one global polite
-  announcement. An absent request means ordinary render with no announcement.
+- Define the exact contracts:
+
+  ```ts
+  interface AccessibilityIntent {
+    focusKey?: FocusKey;
+    announcement?: string;
+  }
+
+  interface RenderRequest extends AccessibilityIntent {
+    visibleStatusText?: string;
+  }
+  ```
+
+  A render request may contain a closed focus intent, non-live visible status
+  text, and at most one global polite announcement. An absent request means an
+  ordinary render with no announcement and the existing consent-derived
+  visible status default.
 - Own both post-render intent application and
   `applyAccessibilityIntent(root, announcer, intent)`. The latter is a
   no-render path: it validates, focuses, or announces against the existing DOM
@@ -93,6 +108,11 @@
   `aria-hidden`, not disabled, and not inside an inert or hidden ancestor.
   Programmatic headings/status targets may use `tabindex="-1"`; positive
   tabindex is prohibited.
+- Focus application is idempotent. When the resolved target already equals
+  `document.activeElement`, do not call `.focus()` again. Retry followed by a
+  terminal callback without intervening user focus therefore invokes DOM focus
+  once total; if the user moves focus after retry, the current terminal callback
+  may focus the processing heading once.
 - Update the stable `#app-announcer` using `textContent` only. All current
   announcements, including failures, use polite priority. Assertive is
   deliberately rejected because none of these events requires interruption.
@@ -119,6 +139,12 @@
   request's explicit intent, then prior key, then safe current-view fallback.
 - Send any explicit request announcement to the stable announcer. Do not
   announce on every full render.
+- Pass `request.visibleStatusText` only to the non-live
+  `#app-visible-status`. Pass `request.announcement` only to
+  `#app-announcer`. An exact event message may populate both fields so the same
+  information is visible and announced, but only `#app-announcer` is live.
+  When `visibleStatusText` is absent, retain the current consent-derived
+  visible default rather than clearing or fabricating status.
 - Keep `#app` stable, keep global `beforeunload` and
   `securitypolicyviolation` listeners unchanged in behavior, and keep
   production service-worker registration unchanged.
@@ -130,12 +156,22 @@
 
 - The stable global announcer is canonical for full-render shell, workflow,
   consent, camera, video, phase-review, and Swing Card events.
-- Visible `.status`, `.phase-warning`, `[data-swing-card-status]`, and static
-  `[data-remote-model-status]` keep their text/description functions but have
-  no `role="status"`, `aria-live`, or other live-region role.
-- Scoped live regions exist only for the in-place processing state text and the
-  imperative overlay status. An event using either scoped channel passes no
-  global announcement.
+- The non-live visible IDs are exactly `#app-visible-status`,
+  `#phase-review-status`, `#swing-card-action-status`, and
+  `#remote-model-status`. They retain state-accurate text from
+  `request.visibleStatusText`, app state, or their existing renderer-owned
+  paths, but have no `role="status"`, `aria-live`, or other live-region role.
+- Scoped live regions exist only at `#processing-status` for in-place
+  processing state and `#keyframe-overlay-status` for imperative overlay
+  status. An event using either scoped channel passes no global announcement.
+- The stable global live region is exactly `#app-announcer`.
+- Processing/review tests must not use an unscoped status-role locator because
+  the global announcer and a scoped processing status may coexist. Tests target
+  the exact owning ID.
+- Phase semantic state is keyed exactly as `unsupported-input`,
+  `review-required`, or `confirmed`. A phase transition sends one global
+  announcement only when the before/after semantic key changes. Rerenders that
+  preserve the key do not announce again.
 - All channels are polite. Assertive is rejected to avoid interrupting the
   current task.
 - A named unit inventory test, `uses exactly one announcement channel for every
@@ -154,14 +190,14 @@
 | Events: Begin guard, consent missing | Full render | `safety-consent` | Global guard failure |
 | Events: Begin guard, video missing | Full render | `video-picker` | Global guard failure |
 | Events: Begin accepted | Full render, then controller start | `stage-heading` | Global loading message; later processing callbacks use scoped channel only |
-| Events: workflow step button | `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
+| Events: workflow step button | Await `closeActive()` cleanup when needed, then one caller-owned full render | `stage-heading` | Global caller-owned `<view> opened` message; close has none |
 | Events: next-step button | Full render | `stage-heading` | Global `<view> opened` message |
 | Events: visible picker opens chooser | No render | Preserve `video-picker` | None |
-| Events: picker `change` with a file | `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
+| Events: picker `change` with a file | Await `closeActive()` cleanup, then one caller-owned full render | `video-picker` | Global caller-owned local-selection message; close has none |
 | Events: picker `cancel` | No render | `video-picker` | None |
 | Events: hidden-input `focus`/`focusin` redirect | No render | `video-picker` | None |
-| Events: camera placeholder | Full render | `camera-placeholder` | Global camera-out-of-scope message |
-| Events/lifecycle: Stop local analysis | Full render owned by `stopActive` | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
+| Events: camera placeholder | Full render with typed visible text and announcement | `camera-placeholder` | Global camera-out-of-scope message |
+| Events/lifecycle: Stop local analysis | Full render owned by `stopActive`, with exact typed visible text and announcement | Capture `stage-heading` | Global stopped/released message; cancelled callback has none |
 | Events/lifecycle: Retry | No render | Processing `stage-heading` once | Scoped subsequent loading/failed/completed processing state; retry call itself has none |
 | Events: Review phase labels | Full render | `phase-review-heading` | Global review-ready message |
 | Events: view declaration | Full render | `phase-declaration:view` | None unless a new validation result requires one global message |
@@ -229,12 +265,16 @@
   It synchronously invalidates the active callback token before awaiting
   `close()`, while retaining a local controller reference for resource release.
   A racing callback is therefore stale before any mutation. Workflow-navigation
-  and picker-change callers each own their single destination render/focus/
-  announcement after cleanup. `beforeunload` calls cleanup with no render.
+  and picker-change callers await cleanup and then each own their single
+  destination render/focus/announcement. They must not render before the close
+  promise settles. `beforeunload` calls cleanup with no render.
   Closed callbacks remain silent.
 - `retryActive` applies no-render focus to `stage-heading` once and relies on
   the subsequent scoped loading/failed/completed state. It must not full-render
-  or replace the controller-owned `#analysis-video` node.
+  or replace the controller-owned `#analysis-video` node. If the terminal
+  callback resolves the same already-active heading, the idempotent helper does
+  not call `.focus()` again; if the user moved elsewhere, the current terminal
+  callback may focus it once.
 - Existing protected labels/selectors, local resource release, and
   remote-review-unavailable behavior remain unchanged.
 
@@ -245,6 +285,19 @@
 precision within B1-B6 remediation. They make the existing keyboard, focus,
 status, and test contracts implementation-ready; they do not expand SS-019
 acceptance criteria or product scope.
+
+### Closed Findings Retained As Regression Contracts
+
+- B2 is closed, not reopened: keep the file input out of sequential order
+  without `aria-hidden`, and preserve named success, native-cancel, and
+  defensive focus-return coverage.
+- B5 is closed, not reopened: preserve the exact static/bounded dynamic key
+  grammar, exact per-view fallbacks, and complete render/no-render callsite
+  inventory.
+- B6 is closed, not reopened: preserve the exact three tokens, two-layer focus
+  geometry, eleven enumerated surface ratios, `>= 3:1` executable threshold,
+  CSS-reading unit checks, computed-style smoke checks, and forced-colors
+  behavior.
 
 ### Renderer Semantics
 
@@ -262,9 +315,18 @@
   picker. Add `focus` and/or `focusin` redirection from the file input to the
   visible picker for browsers that return focus to the input after chooser
   close. Successful `change` always full-renders with explicit picker focus.
-- `.capture-options`, `.keyframe-strip`, `.phase-assignment-list`, and
-  `.swing-card-summary` use `role="group"` with their retained accessible name,
-  or an equivalently named native structure.
+- Use `role="group"` and retain the exact accessible name for every reviewed
+  labelled generic container:
+  - `.capture-options`: `Local video source`;
+  - `.processing-placeholder`: `Local pose processing`;
+  - `.review-placeholder`: `Review placeholder`;
+  - `.swing-card-summary`: `Swing Card contents`;
+  - `.phase-assignment-list`: `Swing phase assignments`;
+  - `.keyframe-strip`: `Select keyframe`.
+- Convert `.export-placeholder` to
+  `<section class="export-placeholder" aria-labelledby="export-placeholder-heading">`.
+  Preserve the existing visible `Swing Card unavailable` heading and give that
+  heading stable `id="export-placeholder-heading"`.
 - Preserve the native `<dl class="remote-model-disclosure">` role and protected
   class selector. Wrap it in a named `role="group"` container for
   `Remote model data disclosure`; never override the `<dl>` role.
@@ -273,34 +335,49 @@
 - Give `[data-keyframe-canvas]` `role="img"` and an `aria-describedby`
   relationship to a stable overlay-status element. Preserve the existing
   protected canvas label text.
-- Give only the processing state text and imperative overlay status stable IDs,
-  scoped polite status semantics, and `aria-atomic="true"`. Keep numeric
+- Give only the processing state text exact `id="processing-status"` and the
+  imperative overlay status exact `id="keyframe-overlay-status"`, scoped polite
+  status semantics, and `aria-atomic="true"`. Keep numeric
   `[data-pose-summary]` outside the processing live region.
-- Remove live-region roles/attributes from visible `.status`, `.phase-warning`,
-  `[data-swing-card-status]`, and static `[data-remote-model-status]`. They
-  remain visible text and valid `aria-describedby` targets.
+- Give visible `.status` exact `id="app-visible-status"`, `.phase-warning`
+  exact `id="phase-review-status"`, `[data-swing-card-status]` exact
+  `id="swing-card-action-status"`, and `[data-remote-model-status]` exact
+  `id="remote-model-status"`. Remove `role="status"`, `aria-live`, and other
+  live-region roles from all four. They remain populated, visible,
+  state-accurate text and valid `aria-describedby` targets.
+- The complete renderer inventory must reject any bare `aria-label` on a
+  generic element that lacks a naming role or equivalent native named
+  structure. The listed groups/regions and the wrapped native `<dl>` are the
+  exhaustive current-main remediation set.
 - Do not add live-region semantics to static explanatory paragraphs.
 - Keep dynamic status text on `textContent`/escaped paths.
 
 Disabled controls must have both a visible dynamic prerequisite/explanation
 and an exact `aria-describedby` relationship when disabled:
 
-- `#analysis-button`: explain whether safety acknowledgement, local video, or
-  processing availability is the current prerequisite.
+- `#analysis-button` describes `#app-visible-status`: explain whether safety
+  acknowledgement, local video, or processing availability is the current
+  prerequisite.
 - `[data-review-phases]` and `[data-confirm-phase-review]`: explain whether
   processing output, declaration completeness, phase assignments, or explicit
-  confirmation is missing.
-- Unavailable export/open-export controls: explain which valid/confirmed phase
-  state is required.
-- `[data-remote-model-send]`: retain the provider-review/configuration and
-  explicit remote-sharing boundary explanation.
+  confirmation is missing through exact target `#phase-review-status`.
+- Unavailable export/open-export controls describe exact target
+  `#phase-review-status`, which explains which valid/confirmed phase state is
+  required.
+- `[data-remote-model-send]` describes exact target `#remote-model-status`,
+  retaining the provider-review/configuration and explicit remote-sharing
+  boundary explanation.
 - Busy `[data-download-swing-card]`, `[data-print-swing-card]`, and
-  `[data-copy-swing-card-prompt]`: describe the current local export action and
+  `[data-copy-swing-card-prompt]` describe exact target
+  `#swing-card-action-status`, which reports the current local export action;
   restore focus to the initiating action after completion or failure.
 
 Descriptions must reflect current state and must not claim remote availability,
 successful persistence, privacy guarantees, or completed analysis when those
-states are not true.
+states are not true. Every description ID is unique in the rendered document.
+Unit and smoke tests directly assert the owning control-to-ID relationship and
+the state-accurate visible text. Manual QA includes browse-mode verification
+that disabled controls expose their descriptions in the tested AT/browser.
 
 ### `src/styles.css`
 
@@ -376,6 +453,9 @@
 - file-picker cancel and hidden-input focus redirection to `video-picker`;
 - every current mapped callsite using exactly one declared announcement
   channel.
+- idempotent focus application that does not call `.focus()` when the resolved
+  target already equals `document.activeElement`, including retry followed by
+  terminal focus with and without intervening user focus.
 
 Picker coverage must use the exact named tests
 `returns focus to the picker after successful keyboard-opened selection`,
@@ -397,8 +477,12 @@
 - `#video-file` retains its selector/accept behavior but has
   `tabindex="-1"`, no `aria-hidden="true"`, and the exact defensive label;
 - stage, phase-review, Swing Card, same-control, and action-status focus keys;
-- exact named group/native semantics for capture, keyframes, phase assignments,
-  `Swing Card contents`, and the wrapper around native remote disclosure;
+- exact named group/native semantics for `Local video source`,
+  `Local pose processing`, `Review placeholder`, `Swing Card contents`,
+  `Swing phase assignments`, and `Select keyframe`; the named export-placeholder
+  section and `Swing Card unavailable` heading relationship; and the named
+  remote-disclosure wrapper with its nested native `<dl>` semantics;
+- an exhaustive inventory test that rejects bare labelled generic containers;
 - heading, canvas `role="img"`, `aria-describedby`, processing/overlay status
   IDs, scoped status semantics, and removed live roles from global-owner text;
 - exact disabled-control `aria-describedby` targets and visible dynamic
@@ -408,6 +492,23 @@
   exact typed focus/announcement request and has no unmapped callsite;
 - render/rebind behavior remains single-effect and progress ticks do not
   refocus or announce every tick.
+- Exact migration of existing tests is mandatory:
+  - rename `clears lifecycle-owned controller handles and syncs app-state idle
+    on close` to `clears lifecycle-owned controller handles and syncs app-state
+    idle on close without rendering`; assert zero `requestRender` and zero
+    `applyAccessibilityIntent` calls;
+  - remove/replace `re-renders capture controls after async close settles`;
+    relocate its SS-018 stale-capture intent into app-events tests named
+    `awaits closeActive before rendering workflow navigation exactly once` and
+    `awaits closeActive before selecting a replacement video and renders
+    exactly once`; both use a deferred close and prove no render before it
+    settles followed by one caller-owned typed request;
+  - update `stops active processing and requests an idle capture render` to
+    assert the exact typed request containing `focusKey: "stage-heading"`, the
+    existing stopped `visibleStatusText`, and the same `announcement`;
+  - update all legacy `requestRender` mocks/types and the camera app-events
+    assertion to the exact `RenderRequest` payload.
+  No old and new contradictory test may coexist.
 - named lifecycle tests exactly:
   - `keeps progress ticks partial without global announcements or focus changes`;
   - `focuses the processing heading and uses only scoped status for current completed and failed terminal states`;
@@ -420,7 +521,8 @@
   - `binds terminal callback focus to the originating active controller token`;
   - `invalidates the active callback token before awaited stop or close so racing terminal callbacks are inert`.
 - named renderer/smoke role/name assertions for `Swing Card contents` and
-  `Remote model data disclosure`.
+  `Remote model data disclosure`, expanded to every named group/region and the
+  nested native `<dl>` listed above.
 
 ### Browser Smoke Tests In `test/smoke/app.spec.ts`
 
@@ -439,6 +541,16 @@
   Card actions after full rerenders;
 - assert one main landmark, meaningful heading order, dynamic document titles,
   scoped status semantics, and no duplicate blanket live regions;
+- replace all three reviewed unscoped `page.getByRole("status")` assertions —
+  camera, consent guard, and stopped status — with direct `#app-announcer`
+  assertions plus exact visible `#app-visible-status` text and assertions that
+  the visible element has no status role or `aria-live`;
+- retain every `.phase-warning` text assertion, but replace the reviewed
+  `aria-live="polite"` assertion with exact `id="phase-review-status"`, no
+  status role, no `aria-live`, and the exact `aria-describedby` relationship;
+- prohibit unscoped status-role locators in processing/review smoke coverage;
+  target `#app-announcer`, `#processing-status`, or
+  `#keyframe-overlay-status` according to the declared owner;
 - verify representative focus visibility and approved focus/control contrast
   tokens in rendered light and dark-adjacent states, the applied two-layer
   indicator geometry, and forced-colors emulation;
@@ -454,8 +566,11 @@
 - assert exactly one announcement owner for consent, processing terminal,
   phase validation/confirmation, and each Swing action without claiming that
   Playwright substitutes for manual screen-reader evidence;
-- include named group assertions and 320-pixel/long-text geometry for
-  `Swing Card contents` and `Remote model data disclosure`.
+- assert phase announcements occur only when the semantic state key changes
+  among `unsupported-input`, `review-required`, and `confirmed`;
+- include named group/region assertions and 320-pixel/long-text geometry for
+  every exhaustive renderer-semantic entry, including the nested native remote
+  disclosure `<dl>`.
 
 Geometry checks must identify the relevant elements and required relationships;
 a screenshot alone or an empty-state-only page-width assertion is insufficient.
@@ -497,7 +612,12 @@
 - duplicate-announcement checks for consent, terminal completion/failure,
   phase validation/confirmation, and Swing actions;
 - named-group checks for `Swing Card contents` and
-  `Remote model data disclosure`;
+  `Remote model data disclosure`, plus `Local video source`,
+  `Local pose processing`, `Review placeholder`, `Swing phase assignments`,
+  `Select keyframe`, the `Swing Card unavailable` labelled section, and the
+  remote wrapper's retained nested `<dl>` semantics;
+- browse-mode checks that each disabled control exposes its exact, unique,
+  state-accurate visible `aria-describedby` target;
 - 200% and 400% zoom or an equivalent 320 CSS-pixel reflow setup;
 - WCAG text-spacing overrides;
 - forced-colors/high-contrast behavior where the environment supports it;
@@ -600,10 +720,23 @@
 Protected boundaries, Relevant source contents or focused diff, Verification,
 Known non-goals, and Output required.
 
-Claude's first QA-planning review returned FAIL with B1-B6. The source packet
-for focused re-review must contain the prior response, this revised complete
-specification, the exact diff from the pre-review specification extracted from
-the original mechanically verified packet, relevant current baseline sources
-and tests, and the focused `CONTEXT.md` diff. Claude must return PASS and
-explicitly clear B1-B6, or new blockers must be incorporated and independently
-re-reviewed, before the builder creates the story branch or changes runtime UI.
+Claude's first QA-planning review returned FAIL with B1-B6. The first focused
+B1-B6 re-review also returned FAIL: B2, B5, and B6 closed, while B1, B3, B4,
+the lead close/token-race precision, and accepted N1-N3 remain open. Exact
+second-review artifacts are
+`docs/ss-019-claude-qa-second-raw-response.md` and
+`docs/ss-019-claude-qa-second-response.md`.
+
+`docs/ss-019-claude-qa-rereview-prompt.md` is superseded for paste use. Its
+existing source packet remains unchanged as the exact first-re-review evidence
+record. A new prompt/packet is not part of this specification-revision step and
+must be created only after these N1-N3 contracts and the corresponding durable
+context are approved.
+
+The next focused packet must include the prior raw response, lead disposition,
+this complete revised specification, exact relevant current baseline sources
+and tests, complete focused diffs, and explicit omission rationales. Claude
+must independently close B1, B3, B4, the lead close/token-race precision, and
+N1-N3 with PASS before the builder creates the story branch or changes runtime
+UI. B2, B5, and B6 remain closed regression contracts and must not be reopened
+by the N1-N3 corrections.
````````````````````````````````````````
<!-- END EXACT BLOCK: 24 Complete focused diff: first-rereview-spec -> second-rereview-spec -->

### 25 Explicit absent record: src/app-accessibility.ts

Lines: 1  
Bytes: 177  
SHA-256: `c905fe4751939fbd330f8f0c107b373b04eef1da1f42ca3c71b4d870cdab6ba9`

<!-- BEGIN EXACT BLOCK: 25 Explicit absent record: src/app-accessibility.ts -->
````````````````````````````````````````text
ABSENT ON PURPOSE: src/app-accessibility.ts does not exist on main. It remains a planned SS-019 implementation file and must not be created before Claude QA-planning clearance.
````````````````````````````````````````
<!-- END EXACT BLOCK: 25 Explicit absent record: src/app-accessibility.ts -->


