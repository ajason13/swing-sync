Role: You are the lead adversarial implementation auditor for Swing Sync.

Stage: SS-011 focused final-audit re-review after Codex fixes.

Scope: Re-review only Claude final-audit blockers B12 and B13, plus any
cross-cutting regression introduced by the fixes. Do not re-audit B1-B11 unless
the B12/B13 changes reopen them; the prior final audit already confirmed B1-B11
were correctly implemented.

Repository/story context:
- Project: Swing Sync, local-first browser app.
- Branch: `ss-011-swing-card`.
- Story: SS-011 Generate downloadable Swing Card.
- Current Notion state: `4. Final Audit (Claude)`.
- Acceptance criteria:
  - Swing Card includes selected keyframes, metrics, warnings, and analysis prompt.
  - Export works as PNG or PDF.
  - No unapproved raw video is included.
  - Output remains usable for manual upload to an LLM chat interface.
- Dedicated test case: SS-TC-015.

Previously confirmed by Claude final audit:
- B1-B11 are correctly implemented.
- Contract types, warning/failure taxonomy, PNG result passthrough, object URL
  lifecycle, missing-overlay fallback, prompt safety, and raw-video exclusion
  were all confirmed good.

Claude final audit blockers to re-review:

## B12

Finding:

`prepareSwingCardContent` could silently fabricate phase-to-frame mappings on a
length mismatch:

```ts
const fallbackAssignments =
  assignments.length === phaseDefinitions.length
    ? assignments
    : phaseDefinitions.map((phase, index) => ({ phaseId: phase.id, sampleIndex: index }));
```

Risk:

If upstream review assignments were missing or incomplete, Swing Card export
could label sampled frames as phases without a validated assignment, producing
misleading PNG/print/prompt output.

Codex fix:

`prepareSwingCardContent` now requires a valid complete assignment set via
`isValidCorrection`. No positional fallback remains.

```ts
async function prepareSwingCardContent(): Promise<{ content: SwingCardContent; release(): void }> {
  const createdBitmaps: ImageBitmap[] = [];
  const keyframes: SwingCardKeyframe[] = [];
  const assignments = getCompleteSwingCardAssignments();

  for (const phase of phaseDefinitions) {
    const assignment = assignments?.find((item) => item.phaseId === phase.id);
    const output = assignment ? phaseOutputs[assignment.sampleIndex] : undefined;
    const rendered = output ? await renderAnnotatedKeyframe(output) : undefined;
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
    phaseReviewConfirmed: (phaseReviewState?.readyForFutureMetrics ?? false) && !!assignments
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

function getCompleteSwingCardAssignments(): readonly PhaseAssignment[] | undefined {
  const assignments =
    phaseReviewState?.correction?.assignments ?? phaseReviewState?.automaticProposal.assignments;
  return assignments && isValidCorrection(assignments) ? assignments : undefined;
}
```

B12 regression test added to `test/smoke/app.spec.ts`:

```ts
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
```

## B13

Finding:

The committed smoke suite was unconfirmed; prior evidence used a manual
built-preview Chromium script because `npm run test:smoke` appeared to hang.

Codex response:

- Root cause: the plain shell was using Node 24, while Swing Sync requires Node
  22 from `.nvmrc`.
- Under Node 22, `npm run test:smoke -- --list` completes and lists 32 tests.
- The full committed smoke suite now runs to completion.
- One stale assertion in the existing phase-review smoke test was updated from
  removed copy (`Video and pose preview`) to current review surface assertions:

```ts
await page.getByRole("button", { name: /Export/ }).click();
await page.getByRole("button", { name: /Review/ }).click();
await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
await expect(page.getByText("Annotated keyframes")).toBeVisible();
```

Verification evidence:

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

Protected boundaries to keep in mind:
- No raw-video export, remote upload, telemetry, remote logging, cloud storage,
  new dependencies, SDK/provider/model/asset changes, or persistent Swing Card
  history were added.
- B12 fix should make unsupported/incomplete review export fail closed with
  unavailable keyframes and `PHASE_REVIEW_REQUIRED`, not fabricate phase labels.
- B13 should be judged against the committed smoke suite now passing under the
  required Node 22 runtime.

Output required:
- PASS/FAIL verdict for focused re-review.
- Whether B12 is closed.
- Whether B13 is closed.
- Any new blockers introduced by the fixes, ordered by severity.
- Missing tests or residual risk.
- Explicit sign-off status: either "cleared to proceed to PR prep" or "must fix
  and request another focused re-review."
