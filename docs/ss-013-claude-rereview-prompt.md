# SS-013 Claude Implementation Re-Review Prompt

Paste everything between START and END into Claude Chat for focused
implementation re-review.

## START

Role: You are the independent adversarial implementation auditor for Swing
Sync.

Stage: Focused final implementation re-review for SS-013 after audit FAIL
pending additional evidence.

Scope: Re-review only whether Codex resolved B9-B11 from the SS-013
implementation audit. Do not reopen B1-B8 unless the new evidence introduces a
regression.

Context:
Swing Sync is a local-first browser app for educational golf swing analysis.
Codex implemented SS-013 after Claude QA planning PASS. Your prior final audit
found the structural implementation correct but blocked sign-off on missing
evidence for `REMOTE_REQUEST_FAILED`, `UNSAFE_RESPONSE_CONTENT`, mid-flight
`REMOTE_REQUEST_CANCELLED`, and tracker confirmation for `UNSAFE_REQUEST_CONTENT`.
Assume you cannot read the repository, GitHub, or Notion; all relevant current
content is included below.

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

Prior audit findings and applied fixes:
- B9: Missing test evidence for `REMOTE_REQUEST_FAILED` and
  `UNSAFE_RESPONSE_CONTENT`. Resolution: complete `test/unit/model-consent.test.ts`
  is included below. It shows send-path tests for both codes and a new
  `renderModelOutputText` text-only assignment test.
- B10: `REMOTE_REQUEST_CANCELLED` test did not show mid-flight `send()`
  integration. Resolution: added a test where `adapter.send()` is started with
  an `AbortController.signal`, consent revocation aborts the controller, the
  transport rejects with `AbortError`, and `send()` returns
  `REMOTE_REQUEST_CANCELLED`.
- B11: `UNSAFE_REQUEST_CONTENT` needed acceptance-record confirmation.
  Resolution: `SS-TC-019` includes `UNSAFE_REQUEST_CONTENT` as a required
  negative sub-case and explains `PROVIDER_NOT_REVIEWED` vs
  `PROVIDER_NOT_CONFIGURED` semantics.
- Non-blocking runtime-filter recommendation: fixed. Runtime
  `modelBlockedOutboundDataClasses` now derives from `modelOutboundDataClasses`
  instead of hardcoded allowed-class exclusions.
- Non-blocking positive-prompt-test recommendation: evidence supplied in the
  complete test file.

Relevant source contents or focused diff:
The following are the exact complete or focused contents needed for B9-B11.

File: `src/model-adapter-contract.ts` focused current excerpt

```ts
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
    !modelOutboundDataClasses.includes(dataClass as ModelOutboundDataClass) && dataClass !== "model-output"
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
```

File: `test/unit/model-consent.test.ts` (complete)

```ts
import { describe, expect, it } from "vitest";
import {
  allModelRemoteDataClasses,
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses,
  type ModelAdapterTransport,
  type ModelProviderDescriptor
} from "../../src/model-adapter-contract";
import {
  abortRemoteRequestOnConsentRevoke,
  canSendRemoteRequest,
  createGuardedModelAdapter,
  createModelRequestPreview,
  renderModelOutputText,
  reviewedModelProviders,
  validateRemoteModelOutput,
  validateRemotePromptPreview
} from "../../src/model-consent";

const provider: ModelProviderDescriptor = {
  id: "fixture-provider",
  displayName: "Fixture Provider",
  destinationOrigin: "https://api.fixture.example",
  termsUrl: "https://api.fixture.example/terms",
  privacyUrl: "https://api.fixture.example/privacy",
  checkedAt: "2026-06-30",
  sdkRequired: false
};

const validPrompt =
  "Use only the evidence shown in the Swing Card. Metrics are unavailable. Warnings and limitations are included.";

function guard(overrides: Partial<Parameters<typeof canSendRemoteRequest>[0]> = {}) {
  return canSendRemoteRequest({
    remoteConsentGranted: true,
    providerId: provider.id,
    reviewedProviders: [provider],
    providerConfigured: true,
    dataClasses: ["metrics", "warnings-and-limitations", "manual-swing-card-prompt"],
    prompt: validPrompt,
    manualContentAvailable: true,
    ...overrides
  });
}

describe("model remote data classes", () => {
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

  it("builds previews with canonical blocked data classes", () => {
    expect(createModelRequestPreview(provider, validPrompt, ["metrics"]).blockedDataClasses).toEqual(
      modelBlockedOutboundDataClasses
    );
  });
});

describe("remote send guard", () => {
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

  it("allows bounded prompts and approved outbound data classes", () => {
    expect(guard()).toEqual({
      ok: true,
      dataClasses: ["metrics", "warnings-and-limitations", "manual-swing-card-prompt"]
    });
  });
});

describe("remote prompt validation", () => {
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

  it("rejects overlong prompts and accepts bounded prompt text", () => {
    expect(validateRemotePromptPreview("a".repeat(6_001)).ok).toBe(false);
    expect(validateRemotePromptPreview(validPrompt)).toEqual({ ok: true });
  });
});

describe("remote output validation", () => {
  it("rejects unsafe response content", () => {
    expect(validateRemoteModelOutput("<script>alert(1)</script>", "text/plain")).toEqual({
      ok: false,
      reason: "html or script"
    });
    expect(validateRemoteModelOutput("a".repeat(8_001), "text/plain")).toEqual({
      ok: false,
      reason: "response-size"
    });
    expect(validateRemoteModelOutput("safe", "text/html")).toEqual({ ok: false, reason: "content-type" });
    expect(validateRemoteModelOutput('{"bad":true}', "application/json")).toEqual({
      ok: false,
      reason: "json-shape"
    });
  });

  it("accepts bounded plain text and json text output", () => {
    expect(validateRemoteModelOutput("General educational observation.", "text/plain")).toEqual({ ok: true });
    expect(validateRemoteModelOutput('{"text":"General educational observation."}', "application/json")).toEqual({
      ok: true
    });
  });
});

describe("guarded model adapter", () => {
  it("returns REMOTE_REQUEST_FAILED when transport fails", async () => {
    const adapter = createGuardedModelAdapter(
      provider,
      [provider],
      async () => ({ ok: false, contentType: "text/plain", body: "upstream failed" }),
      {
        providerConfigured: true,
        remoteConsentGranted: () => true,
        manualContentAvailable: () => true
      }
    );

    await expect(
      adapter.send({
        providerId: provider.id,
        prompt: validPrompt,
        dataClasses: ["metrics"]
      })
    ).resolves.toEqual({ status: "error", code: "REMOTE_REQUEST_FAILED" });
  });

  it("returns REMOTE_REQUEST_CANCELLED when transport is aborted", async () => {
    const controller = new AbortController();
    const transport: ModelAdapterTransport = async (request) => {
      request.abortSignal?.dispatchEvent(new Event("abort"));
      throw new DOMException("Aborted", "AbortError");
    };
    const adapter = createGuardedModelAdapter(provider, [provider], transport, {
      providerConfigured: true,
      remoteConsentGranted: () => true,
      manualContentAvailable: () => true
    });

    controller.abort();
    await expect(
      adapter.send({
        providerId: provider.id,
        prompt: validPrompt,
        dataClasses: ["metrics"],
        abortSignal: controller.signal
      })
    ).resolves.toEqual({ status: "error", code: "REMOTE_REQUEST_CANCELLED" });
  });

  it("returns REMOTE_REQUEST_CANCELLED when consent revocation aborts an in-flight send", async () => {
    const controller = new AbortController();
    const transport: ModelAdapterTransport = async (request) =>
      new Promise((_, reject) => {
        request.abortSignal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    const adapter = createGuardedModelAdapter(provider, [provider], transport, {
      providerConfigured: true,
      remoteConsentGranted: () => true,
      manualContentAvailable: () => true
    });

    const send = adapter.send({
      providerId: provider.id,
      prompt: validPrompt,
      dataClasses: ["metrics"],
      abortSignal: controller.signal
    });
    expect(abortRemoteRequestOnConsentRevoke(false, controller)).toBe("REMOTE_REQUEST_CANCELLED");

    await expect(send).resolves.toEqual({ status: "error", code: "REMOTE_REQUEST_CANCELLED" });
  });

  it("returns UNSAFE_RESPONSE_CONTENT for unsafe successful responses", async () => {
    const adapter = createGuardedModelAdapter(
      provider,
      [provider],
      async () => ({ ok: true, contentType: "text/plain", body: "This will prevent injury." }),
      {
        providerConfigured: true,
        remoteConsentGranted: () => true,
        manualContentAvailable: () => true
      }
    );

    await expect(
      adapter.send({
        providerId: provider.id,
        prompt: validPrompt,
        dataClasses: ["metrics"]
      })
    ).resolves.toEqual({ status: "error", code: "UNSAFE_RESPONSE_CONTENT" });
  });
});

describe("remote consent revocation", () => {
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
});

describe("model output rendering", () => {
  it("assigns model output through textContent only", () => {
    const target = { textContent: "" };

    renderModelOutputText(target, "<strong>Do not render as HTML</strong>");

    expect(target.textContent).toBe("<strong>Do not render as HTML</strong>");
  });
});
```

File: `SS-TC-019` current Notion excerpts

```markdown
## Required Sub-Cases
- Negative test for `REMOTE_CONSENT_REQUIRED`.
- Negative test for `PROVIDER_NOT_REVIEWED`.
- Negative test for `PROVIDER_NOT_CONFIGURED`.
- Negative test for `UNSUPPORTED_DATA_CLASS`.
- Negative test for `UNSAFE_REQUEST_CONTENT`, including outbound prompt size and prohibited request-content failures.
- Negative test for `REMOTE_REQUEST_FAILED`.
- Negative test for `REMOTE_REQUEST_CANCELLED`, including mid-flight consent revocation calling `AbortController.abort()`.
- Negative test for `UNSAFE_RESPONSE_CONTENT`, including unsafe output content and text-only rendering protections.
- Production provider registry is empty by default and remote UI remains unavailable/configuration-required.
- `blockedDataClasses` is typed/derived from the canonical data-class union, not an open string list.
- `PROVIDER_NOT_REVIEWED` means no descriptor is present in the reviewed provider registry; `PROVIDER_NOT_CONFIGURED` means a reviewed descriptor exists but runtime send configuration is absent.
- Prompt-preview validation rejects raw payload keys, coordinate pairs, object URLs, filenames, timestamps including `observedSeekTimestampMs`, hidden identifiers, and raw JSON dumps.
- Manual workflow regression proves Download PNG, Print / Save as PDF, and Copy prompt remain usable without provider config, API keys, remote consent, server config, or network.
```

Verification after fixes:
- Node version: `v22.22.3` from `.nvmrc`.
- `npm run test:unit -- model-consent` PASS (25 tests).
- `npm run build` PASS.

Known non-goals:
- No real provider launch.
- No production provider descriptors; registry is empty.
- No provider SDK, new dependency, API route, key handling, proxy, remote call,
  telemetry, remote logging, hosted analytics, cloud storage, new worker,
  camera capture, raw personal fixture, or model/provider asset.
- No raw video, frame pixel, selected keyframe image, pose landmark, coordinate,
  filename, timestamp, observed seek timestamp, media dimension, object URL, or
  hidden identifier transmission.

Output required:
1. Verdict: PASS or FAIL for SS-013 PR preparation.
2. For B9, B10, and B11, state closed or still blocking.
3. Any new blocking findings introduced by these fixes.
4. Non-blocking recommendations, clearly separated.
5. Whether any additional exact source content is required before sign-off.

## END

