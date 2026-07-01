import {
  modelBlockedOutboundDataClasses,
  modelOutboundDataClasses,
  type ModelAdapter,
  type ModelAdapterErrorCode,
  type ModelAdapterRequest,
  type ModelAdapterResult,
  type ModelAdapterTransport,
  type ModelOutboundDataClass,
  type ModelProviderDescriptor,
  type ModelRemoteDataClass,
  type ModelRequestPreview
} from "./model-adapter-contract";

export const reviewedModelProviders: readonly ModelProviderDescriptor[] = [] as const;
export const maxRemotePromptCharacters = 6_000 as const;
export const maxRemoteResponseCharacters = 8_000 as const;

export type RemoteSendGuardResult =
  | { readonly ok: true; readonly dataClasses: readonly ModelOutboundDataClass[] }
  | { readonly ok: false; readonly code: ModelAdapterErrorCode };

export interface RemoteSendState {
  readonly remoteConsentGranted: boolean;
  readonly providerId: string;
  readonly reviewedProviders: readonly ModelProviderDescriptor[];
  readonly providerConfigured: boolean;
  readonly dataClasses: readonly ModelRemoteDataClass[];
  readonly prompt: string;
  readonly manualContentAvailable: boolean;
}

export interface RemotePromptValidationResult {
  readonly ok: boolean;
  readonly pattern?: string;
}

export interface RemoteResponseValidationResult {
  readonly ok: boolean;
  readonly reason?: string;
}

const outboundDataClassSet = new Set<ModelRemoteDataClass>(modelOutboundDataClasses);
const unsafePromptPatterns: readonly (readonly [string, RegExp])[] = [
  ["raw payload key", /\b(?:landmarks?|worldLandmarks|metricPayload|objectUrl|userId)\b/i],
  ["coordinate pair", /\b[xX]\s*:\s*-?\d+(?:\.\d+)?\s*,\s*[yY]\s*:\s*-?\d+(?:\.\d+)?/],
  ["object URL", /\bblob:https?:\/\/|\bobject\s+url\b/i],
  ["filename", /\bfile\s?name\b|\bfilename\b/i],
  ["timestamp", /\b(?:timestampMs|requestedTimestampMs|observedSeekTimestampMs|timestamp)\b/i],
  [
    "hidden identifier",
    /\b(?:hidden\s?(?:id|identifier)|trace\s?id|session\s?id|user\s?id|account\s?id|device\s?id|request\s?id)\b|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{24,}|[A-Za-z0-9_-]{32,}/i
  ],
  ["raw JSON dump", /[{[]\s*"(?:schemaVersion|metrics|landmarks|worldLandmarks|timestampMs)"/i]
];

const unsafeResponsePatterns: readonly (readonly [string, RegExp])[] = [
  ["unsafe medical content", /\b(?:diagnos(?:e|is|ed|ing)|rehab|rehabilitation|physical therapy|treatment plan)\b/i],
  ["aggressive movement prescription", /\b(?:play\s+through\s+pain|train\s+through\s+pain|force\s+your\s+range)\b/i],
  ["guarantee", /\b(?:guarantee|guaranteed|will\s+prevent\s+injury|will\s+fix|will\s+cure)\b/i],
  ["privacy or legal claim", /\b(?:anonymous|anonymized|guarantees\s+privacy|guaranteed\s+deletion|GDPR\s+compliant|HIPAA\s+compliant)\b/i],
  ["raw payload", /\b(?:landmarks?|worldLandmarks|objectUrl|observedSeekTimestampMs|timestampMs)\b/i],
  ["coordinate pair", /\b[xX]\s*:\s*-?\d+(?:\.\d+)?\s*,\s*[yY]\s*:\s*-?\d+(?:\.\d+)?/],
  ["html or script", /<\s*\/?\s*(?:script|iframe|img|svg|a|div|span|markdown)\b|javascript:/i]
];

export function findReviewedProvider(
  providerId: string,
  reviewedProviders: readonly ModelProviderDescriptor[] = reviewedModelProviders
): ModelProviderDescriptor | undefined {
  return reviewedProviders.find((provider) => provider.id === providerId);
}

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

export function createModelRequestPreview(
  provider: ModelProviderDescriptor,
  prompt: string,
  dataClasses: readonly ModelRemoteDataClass[]
): ModelRequestPreview {
  const outbound = normalizeOutboundDataClasses(dataClasses) ?? [];
  return {
    provider,
    dataClasses: outbound,
    promptPreview: prompt,
    blockedDataClasses: modelBlockedOutboundDataClasses
  };
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

function normalizeOutboundDataClasses(
  dataClasses: readonly ModelRemoteDataClass[]
): readonly ModelOutboundDataClass[] | undefined {
  if (dataClasses.some((dataClass) => !outboundDataClassSet.has(dataClass))) return undefined;
  return dataClasses as readonly ModelOutboundDataClass[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

