# SS-011 Claude Final Audit Response

Date: 2026-06-26

Claude final implementation audit returned **FAIL** after confirming B1-B11 were
implemented correctly. Two implementation-stage blockers remained:

- **B12:** `prepareSwingCardContent` could silently fabricate phase-to-frame
  mappings when assignment count did not match the phase definition count.
- **B13:** the committed smoke suite had not been shown passing; prior evidence
  used a manual built-preview Chromium check because `npm run test:smoke`
  appeared to hang.

## B12 Response

Status: fixed.

The audit finding was valid. The export-preparation path previously fell back
to positional assignments when upstream review assignments were missing or
incomplete:

```ts
phaseDefinitions.map((phase, index) => ({ phaseId: phase.id, sampleIndex: index }))
```

That was too permissive for an export surface because it could label sampled
frames as phases without a validated review assignment.

The fix removes the positional fallback from Swing Card export preparation.
`prepareSwingCardContent` now calls `getCompleteSwingCardAssignments()`, which
returns assignments only when `isValidCorrection(assignments)` accepts them. If
assignments are missing, incomplete, out of order, stale, or otherwise invalid,
each phase is exported as `Keyframe unavailable`, and
`phaseReviewConfirmed` is forced false so `PHASE_REVIEW_REQUIRED` remains in
the card warnings and prompt context.

Focused regression coverage was added to `test/smoke/app.spec.ts`:

- `keeps Swing Card keyframes unavailable until phase review is complete`
- The test opens Swing Card export from an unsupported review state, confirms
  the warning list includes phase-review-required copy, stubs `window.print`,
  inspects the print DOM at print-call time, and asserts all eight keyframe
  slots are `Keyframe unavailable`.

## B13 Response

Status: fixed / root-caused.

The earlier apparent smoke hang was caused by running Playwright through the
plain shell's Node 24 runtime. The repository requires Node 22 from `.nvmrc`.
Under Node 22, the committed smoke suite lists and runs normally.

During the full smoke run, one stale assertion failed in an existing
phase-review smoke test. The product was on the review screen, but the test
expected removed copy (`Video and pose preview`). The assertion now checks the
current review heading and annotated-keyframes surface instead.

The full committed smoke suite now passes under Node 22.

## Verification

All commands below were run with Node 22 through:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use >/dev/null
```

Passing verification:

- `npm run test:unit -- swing-card-generator` passed, 13 tests.
- `npm run test:unit` passed, 101 tests across 10 files.
- `npm run test:smoke -- --list` passed, listing 32 tests.
- `npm run test:smoke -- --project=desktop-chromium --grep "Swing Card"`
  passed, 2 tests.
- `npm run test:smoke` passed, 32 tests across desktop and mobile Chromium.
- `npm run build` passed.
- `npm run compliance:verify` passed.
- `npm run safety:verify` passed.
- `npm run privacy:verify` passed.
- `git diff --check` passed.

## Observability

No logs, telemetry, traces, analytics, remote diagnostics, or persistent debug
storage were added. The B12 fix changes fail-closed export behavior only; it
does not require new observability to preserve SS-011 acceptance criteria.

## Re-Review Scope

The focused Claude re-review should inspect only:

- B12 fail-closed assignment handling in `src/main.ts`.
- B12 regression coverage in `test/smoke/app.spec.ts`.
- B13 smoke-suite evidence and stale assertion update.
- Cross-cutting regressions introduced by those changes.

B1-B11 were already confirmed correctly implemented by the final audit and do
not need full re-audit unless the B12/B13 changes reopened one of them.
