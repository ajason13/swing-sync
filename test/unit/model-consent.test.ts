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
