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

export interface ModelAdapterRequest {
  readonly providerId: string;
  readonly prompt: string;
  readonly dataClasses: readonly ModelRemoteDataClass[];
  readonly abortSignal?: AbortSignal;
}

export type ModelAdapterResult =
  | { readonly status: "ok"; readonly text: string }
  | { readonly status: "error"; readonly code: ModelAdapterErrorCode };

export interface ModelAdapter {
  readonly provider: ModelProviderDescriptor;
  preview(request: Omit<ModelAdapterRequest, "abortSignal">): ModelRequestPreview;
  send(request: ModelAdapterRequest): Promise<ModelAdapterResult>;
}

export interface ModelAdapterTransportResponse {
  readonly ok: boolean;
  readonly contentType: string;
  readonly body: string;
}

export type ModelAdapterTransport = (
  request: ModelAdapterRequest & { readonly dataClasses: readonly ModelOutboundDataClass[] }
) => Promise<ModelAdapterTransportResponse>;
