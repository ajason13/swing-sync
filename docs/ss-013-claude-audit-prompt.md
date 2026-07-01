# SS-013 Claude Implementation Audit Prompt

**Superseded for paste use.** Claude returned FAIL pending additional
evidence on this initial final audit prompt. Use
`docs/ss-013-claude-rereview-prompt.md` for the focused B9-B11 re-review.

Paste everything between START and END into Claude Chat for final
implementation audit.

## START

Role: You are the independent adversarial implementation auditor for Swing
Sync.

Stage: Final implementation audit for SS-013.

Scope: Audit whether the SS-013 implementation matches the approved
empty-registry, fail-closed optional model API adapter contract. This is an
implementation audit, not a new product design pass.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex implemented SS-013 after Claude QA planning PASS. Assume you cannot read
the repository, GitHub, or Notion; all relevant implementation excerpts,
verification, and known non-goals are included below.

Acceptance criteria:
- API mode is disabled until explicit consent.
- Provider adapter is model-neutral.
- User sees what data will be sent.
- Manual Swing Card workflow remains available without keys or server config.

Protected boundaries:
- Raw swing video and frame pixels must not be uploaded, sent to model
  providers, or shared with remote services by default.
- Derived landmarks, metrics, prompts, reports, selected images, and model
  outputs may still be sensitive or identifying.
- Do not make absolute privacy, deletion, anonymity, legal, compliance, safety,
  medical, injury-prevention, professional coaching, or guaranteed correctness
  claims.
- Do not add telemetry, remote logging, hosted analytics, cloud storage, new
  workers, provider SDKs, provider/model assets, new dependencies, camera
  capture, raw personal video fixtures, server routes, proxy services, provider
  descriptors, API keys, or working hosted model calls for SS-013.
- Manual Swing Card export and Copy prompt must continue to work without API
  keys, server config, remote consent, provider credentials, or network.

Relevant source contents or focused diff:
The implementation changed `src/model-adapter-contract.ts`,
`src/model-consent.ts`, `src/main.ts`, `src/styles.css`,
`test/unit/model-consent.test.ts`, and `test/smoke/app.spec.ts`.
The following are exact focused excerpts. Omitted code is unrelated preexisting
local video processing, phase review, Swing Card rendering internals, or CSS
not touched by SS-013.

File: `src/model-adapter-contract.ts` (complete)

```ts
export const allModelRemoteDataClasses = [
  "raw-video",
  "frame-pixels",
  "selected-keyframe-images",
  "pose-landmarks",
  "metrics",
  "warnings-and-limitations",
  "manual-swing-card-prompt",
  "model-output"
] as const;

export type ModelRemoteDataClass = (typeof allModelRemoteDataClasses)[number];

export const modelOutboundDataClasses = [
  "metrics",
  "warnings-and-limitations",
  "manual-swing-card-prompt"
] as const satisfies readonly ModelRemoteDataClass[];

export type ModelOutboundDataClass = (typeof modelOutboundDataClasses)[number];

export type ModelBlockedOutboundDataClass = Exclude<
  ModelRemoteDataClass,
  ModelOutboundDataClass | "model-output"
>;

export const modelBlockedOutboundDataClasses = allModelRemoteDataClasses.filter(
  (dataClass): dataClass is ModelBlockedOutboundDataClass =>
    dataClass !== "metrics" &&
    dataClass !== "warnings-and-limitations" &&
    dataClass !== "manual-swing-card-prompt" &&
    dataClass !== "model-output"
);

export type ModelAdapterErrorCode =
  | "REMOTE_CONSENT_REQUIRED"
  | "PROVIDER_NOT_REVIEWED"
  | "PROVIDER_NOT_CONFIGURED"
  | "UNSUPPORTED_DATA_CLASS"
  | "UNSAFE_REQUEST_CONTENT"
  | "REMOTE_REQUEST_FAILED"
  | "REMOTE_REQUEST_CANCELLED"
  | "UNSAFE_RESPONSE_CONTENT";

export interface ModelProviderDescriptor {
  readonly id: string;
  readonly displayName: string;
  readonly destinationOrigin: string;
  readonly termsUrl: string;
  readonly privacyUrl: string;
  readonly checkedAt: string;
  readonly sdkRequired: false;
}

export interface ModelRequestPreview {
  readonly provider: ModelProviderDescriptor;
  readonly dataClasses: readonly ModelOutboundDataClass[];
  readonly promptPreview: string;
  readonly blockedDataClasses: readonly ModelBlockedOutboundDataClass[];
}
```

File: `src/model-consent.ts` (focused complete guard/validator excerpt)

```ts
export const reviewedModelProviders: readonly ModelProviderDescriptor[] = [] as const;
export const maxRemotePromptCharacters = 6_000 as const;
export const maxRemoteResponseCharacters = 8_000 as const;

export function canSendRemoteRequest(state: RemoteSendState): RemoteSendGuardResult {
  if (!state.remoteConsentGranted) return { ok: false, code: "REMOTE_CONSENT_REQUIRED" };
  if (!findReviewedProvider(state.providerId, state.reviewedProviders)) {
    return { ok: false, code: "PROVIDER_NOT_REVIEWED" };
  }
  if (!state.providerConfigured || !state.manualContentAvailable) {
    return { ok: false, code: "PROVIDER_NOT_CONFIGURED" };
  }
  const dataClasses = normalizeOutboundDataClasses(state.dataClasses);
  if (!dataClasses) return { ok: false, code: "UNSUPPORTED_DATA_CLASS" };
  if (!validateRemotePromptPreview(state.prompt).ok) return { ok: false, code: "UNSAFE_REQUEST_CONTENT" };
  return { ok: true, dataClasses };
}

export function validateRemotePromptPreview(prompt: string): RemotePromptValidationResult {
  if (prompt.length === 0 || prompt.length > maxRemotePromptCharacters) {
    return { ok: false, pattern: "prompt-size" };
  }
  for (const [name, pattern] of unsafePromptPatterns) {
    if (pattern.test(prompt)) return { ok: false, pattern: name };
  }
  return { ok: true };
}

export function validateRemoteModelOutput(
  body: string,
  contentType: string
): RemoteResponseValidationResult {
  if (body.length === 0 || body.length > maxRemoteResponseCharacters) {
    return { ok: false, reason: "response-size" };
  }
  const normalizedContentType = contentType.toLowerCase();
  const isText = normalizedContentType.startsWith("text/plain");
  const isJson = normalizedContentType.includes("application/json");
  if (!isText && !isJson) return { ok: false, reason: "content-type" };
  if (isJson) {
    try {
      const value = JSON.parse(body) as unknown;
      if (!isRecord(value) || typeof value.text !== "string") return { ok: false, reason: "json-shape" };
    } catch {
      return { ok: false, reason: "json-shape" };
    }
  }
  for (const [name, pattern] of unsafeResponsePatterns) {
    if (pattern.test(body)) return { ok: false, reason: name };
  }
  return { ok: true };
}

export function renderModelOutputText(target: Pick<Node, "textContent">, output: string): void {
  target.textContent = output;
}

export function createGuardedModelAdapter(
  provider: ModelProviderDescriptor,
  reviewedProviders: readonly ModelProviderDescriptor[],
  transport: ModelAdapterTransport,
  options: { readonly providerConfigured: boolean; readonly remoteConsentGranted(): boolean; readonly manualContentAvailable(): boolean }
): ModelAdapter {
  return {
    provider,
    preview: (request) => createModelRequestPreview(provider, request.prompt, request.dataClasses),
    send: async (request): Promise<ModelAdapterResult> => {
      const guard = canSendRemoteRequest({
        remoteConsentGranted: options.remoteConsentGranted(),
        providerId: request.providerId,
        reviewedProviders,
        providerConfigured: options.providerConfigured,
        dataClasses: request.dataClasses,
        prompt: request.prompt,
        manualContentAvailable: options.manualContentAvailable()
      });
      if (!guard.ok) return { status: "error", code: guard.code };
      try {
        const response = await transport({ ...request, dataClasses: guard.dataClasses });
        if (request.abortSignal?.aborted) return { status: "error", code: "REMOTE_REQUEST_CANCELLED" };
        if (!response.ok) return { status: "error", code: "REMOTE_REQUEST_FAILED" };
        const validation = validateRemoteModelOutput(response.body, response.contentType);
        if (!validation.ok) return { status: "error", code: "UNSAFE_RESPONSE_CONTENT" };
        return { status: "ok", text: response.body };
      } catch (error) {
        if (request.abortSignal?.aborted || (error instanceof DOMException && error.name === "AbortError")) {
          return { status: "error", code: "REMOTE_REQUEST_CANCELLED" };
        }
        return { status: "error", code: "REMOTE_REQUEST_FAILED" };
      }
    }
  };
}

export function abortRemoteRequestOnConsentRevoke(
  consentGranted: boolean,
  controller: Pick<AbortController, "abort">
): ModelAdapterErrorCode | undefined {
  if (consentGranted) return undefined;
  controller.abort();
  return "REMOTE_REQUEST_CANCELLED";
}
```

File: `src/main.ts` focused diff excerpt

```diff
+import {
+  modelBlockedOutboundDataClasses,
+  modelOutboundDataClasses
+} from "./model-adapter-contract";
+import { reviewedModelProviders } from "./model-consent";

 function renderSwingCardExport(): string {
   return `
     <section class="swing-card-panel" aria-labelledby="swing-card-heading">
       ...
       <button class="primary-action" type="button" data-download-swing-card ${swingCardBusy ? "disabled" : ""}>Download PNG</button>
       <button class="secondary-action" type="button" data-print-swing-card ${swingCardBusy ? "disabled" : ""}>Print / Save as PDF</button>
       <button class="secondary-action" type="button" data-copy-swing-card-prompt ${swingCardBusy ? "disabled" : ""}>Copy prompt</button>
       <p class="action-note" data-swing-card-status role="status">${escapeHtml(swingCardStatus)}</p>
       <div class="swing-card-print-host" data-swing-card-print-host aria-hidden="true"></div>
+      ${renderRemoteModelReviewPanel()}
     </section>
   `;
 }
+
+function renderRemoteModelReviewPanel(): string {
+  const providerAvailable = reviewedModelProviders.length > 0;
+  return `
+    <section class="remote-model-panel" aria-labelledby="remote-model-heading">
+      <div class="remote-model-panel__header">
+        <div>
+          <p class="placeholder-kicker">Optional remote review</p>
+          <h4 id="remote-model-heading">Remote model review unavailable</h4>
+        </div>
+        <span class="stage-status">Off by default</span>
+      </div>
+      <p>Remote model review is optional and requires a separately reviewed provider before any data can leave this device. Manual Swing Card export and Copy prompt do not require provider configuration.</p>
+      <dl class="remote-model-disclosure" aria-label="Remote model data disclosure">
+        <div>
+          <dt>Provider registry</dt>
+          <dd>${providerAvailable ? "Reviewed provider configured." : "No reviewed provider is configured for this story."}</dd>
+        </div>
+        <div>
+          <dt>Would send after future consent</dt>
+          <dd>${modelOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
+        </div>
+        <div>
+          <dt>Will not send in SS-013</dt>
+          <dd>${modelBlockedOutboundDataClasses.map(formatRemoteDataClass).join(", ")}</dd>
+        </div>
+      </dl>
+      <button class="secondary-action" type="button" disabled data-remote-model-send>Remote review unavailable</button>
+      <p class="action-note" data-remote-model-status role="status">Remote model review is unavailable until a provider is separately reviewed and configured.</p>
+    </section>
+  `;
+}
```

File: `test/unit/model-consent.test.ts` focused coverage excerpt

```ts
it("ships an empty reviewed provider registry in production", () => {
  expect(reviewedModelProviders).toEqual([]);
});

it("derives blocked outbound classes from the canonical data-class union", () => {
  const derived = allModelRemoteDataClasses.filter(
    (dataClass) => !modelOutboundDataClasses.includes(dataClass as never) && dataClass !== "model-output"
  );
  expect(modelBlockedOutboundDataClasses).toEqual(derived);
  expect(modelBlockedOutboundDataClasses).toEqual([
    "raw-video",
    "frame-pixels",
    "selected-keyframe-images",
    "pose-landmarks"
  ]);
});

it("rejects missing remote consent", () => {
  expect(guard({ remoteConsentGranted: false })).toEqual({ ok: false, code: "REMOTE_CONSENT_REQUIRED" });
});

it("rejects providers absent from the reviewed registry", () => {
  expect(guard({ reviewedProviders: [] })).toEqual({ ok: false, code: "PROVIDER_NOT_REVIEWED" });
});

it("rejects reviewed providers without runtime configuration", () => {
  expect(guard({ providerConfigured: false })).toEqual({ ok: false, code: "PROVIDER_NOT_CONFIGURED" });
  expect(guard({ manualContentAvailable: false })).toEqual({ ok: false, code: "PROVIDER_NOT_CONFIGURED" });
});

it("rejects blocked outbound data classes", () => {
  expect(guard({ dataClasses: ["metrics", "raw-video"] })).toEqual({
    ok: false,
    code: "UNSUPPORTED_DATA_CLASS"
  });
});

it("rejects unsafe outbound request content", () => {
  expect(guard({ prompt: "Here is observedSeekTimestampMs: 1234" })).toEqual({
    ok: false,
    code: "UNSAFE_REQUEST_CONTENT"
  });
});

it.each([
  ["raw payload key", "worldLandmarks are visible"],
  ["coordinate pair", "x: 0.42, y: 0.17"],
  ["object URL", "blob:http://127.0.0.1/video"],
  ["filename", "filename swing.mov"],
  ["timestamp", "observedSeekTimestampMs"],
  ["hidden identifier", "550e8400-e29b-41d4-a716-446655440000"],
  ["raw JSON dump", '{"schemaVersion":"0.1.0","metrics":[]}']
])("rejects %s", (_, prompt) => {
  expect(validateRemotePromptPreview(prompt).ok).toBe(false);
});

it("aborts in-flight requests and reports cancellation when consent is revoked", () => {
  let aborted = 0;
  const result = abortRemoteRequestOnConsentRevoke(false, {
    abort: () => {
      aborted += 1;
    }
  });
  expect(result).toBe("REMOTE_REQUEST_CANCELLED");
  expect(aborted).toBe(1);
});
```

File: `test/smoke/app.spec.ts` focused diff excerpt

```diff
   await expect(page.getByRole("heading", { name: "Downloadable summary" })).toBeVisible();
+  await expect(page.getByRole("heading", { name: "Remote model review unavailable" })).toBeVisible();
+  await expect(page.getByText("No reviewed provider is configured for this story.")).toBeVisible();
+  await expect(page.getByText("Metrics, Warnings and Limitations, Manual Swing Card Prompt")).toBeVisible();
+  await expect(page.getByText("Raw Video, Frame Pixels, Selected Keyframe Images, Pose Landmarks")).toBeVisible();
+  await expect(page.getByRole("button", { name: "Remote review unavailable" })).toBeDisabled();
   ...
   await expectNoBrowserStorage(page);
+  const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
+  expect(localStorageKeys).toEqual(["swing-sync:safety-consent:v1"]);
   expectNoSensitiveOutput(consoleMessagesFor(page).join("\n"));
```

Verification:
- Node version: `v22.22.3` from `.nvmrc`.
- `npm run test:unit` PASS (145 tests).
- `npm run build` PASS.
- `npm run compliance:verify` PASS.
- `npm run privacy:verify` PASS.
- `npm run safety:verify` PASS.
- `git diff --check` PASS.
- `npm run test:smoke -- --project=desktop-chromium -g "downloads a local Swing Card PNG"` PASS (1 test).
- `npm run test:smoke` PASS (32 tests across desktop Chromium and mobile Chromium).
- Browser smoke attempts under Node `v24.15.0` hung with no output and were interrupted. Required smoke verification was rerun under Node `v22.22.3`.

Known non-goals:
- No real provider launch.
- No production provider descriptors; registry is empty.
- No provider SDK, new dependency, API route, key handling, proxy, remote call,
  telemetry, remote logging, hosted analytics, cloud storage, new worker,
  camera capture, raw personal fixture, or model/provider asset.
- No raw video, frame pixel, selected keyframe image, pose landmark, coordinate,
  filename, timestamp, observed seek timestamp, media dimension, object URL, or
  hidden identifier transmission.
- No medical, legal, compliance, privacy, deletion, anonymity, professional
  coaching, injury-prevention, or guaranteed correctness claims.

Output required:
1. Verdict: PASS or FAIL for SS-013 PR preparation.
2. Blocking findings, each with severity, exact quoted evidence from this
   prompt, and required change.
3. Non-blocking recommendations, clearly separated.
4. Whether implementation satisfies SS-013 acceptance criteria and `SS-TC-019`.
5. Whether final audit needs exact additional file contents before sign-off.

## END
