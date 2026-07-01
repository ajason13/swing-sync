# SS-013 Preimplementation Spec

Status: candidate spec for Claude QA planning. Implementation remains blocked
until Claude QA planning returns PASS or blocking findings are resolved and
re-reviewed.

## Scope

SS-013 defines an optional model API adapter behind explicit remote-sharing
consent while preserving Swing Sync's local-first MVP and manual Swing Card
workflow.

In scope:

- provider-neutral TypeScript contracts for model requests, responses,
  provider configuration, consent state, and data-class disclosure;
- fail-closed gating before any remote send can be attempted;
- UI copy and controls that disclose what data would be sent before the user
  opts in;
- tests proving manual Swing Card export/copy remains available without keys,
  server config, provider credentials, remote consent, or network access; and
- documentation of provider-review requirements before any real provider is
  enabled.

Out of scope:

- enabling a real provider by default;
- provider SDKs, new runtime dependencies, provider/model assets, hosted
  analytics, telemetry, remote logging, cloud storage, new workers, camera
  capture, or raw personal video fixtures;
- committing API keys, server routes, proxy services, or environment-specific
  secrets;
- sending raw swing video or frame pixels;
- absolute privacy, deletion, anonymity, legal, compliance, medical,
  injury-prevention, professional coaching, or guaranteed correctness claims.

## Sensitivity Classification

SS-013 is safety-, privacy-, AI-coaching-, model-provider-, compliance-,
dependency/licensing-, user-facing-copy-, runtime-, and remote-API-sensitive.
It requires Codex-owned research/spec drafting, source-checked provider facts,
Adopt / Revise / Defer / Reject dispositions, a self-contained Claude QA
planning handoff, and Claude gate clearance before implementation.

## Proposed Artifacts

Candidate new files:

- `src/model-adapter-contract.ts`
- `src/model-consent.ts`
- `test/unit/model-adapter-contract.test.ts`
- `test/unit/model-consent.test.ts`

Candidate modified files:

- `src/main.ts`
- `src/styles.css`
- `test/smoke/app.spec.ts`
- `docs/privacy-architecture.md`
- `docs/models-licensing.md`

Do not add dependencies unless a later reviewed provider integration requires
them and the license/SBOM checks are updated.

## Data Classes

The consent disclosure must use one canonical closed union for every data class:

- `raw-video`
- `frame-pixels`
- `selected-keyframe-images`
- `pose-landmarks`
- `metrics`
- `warnings-and-limitations`
- `manual-swing-card-prompt`
- `model-output`

For SS-013, the allowed outbound subset is only `metrics`,
`warnings-and-limitations`, and `manual-swing-card-prompt`, and those classes
remain unavailable unless explicit remote consent and provider review gates are
met. `raw-video`, `frame-pixels`, `selected-keyframe-images`, and
`pose-landmarks` are blocked in SS-013. `model-output` is inbound only, treated
as sensitive, not persisted by default, and rendered only through text-only DOM
APIs if ever displayed.

The default SS-013 API request should be text-only and data-minimized:
Swing Card prompt text, bounded metric summaries, warning/limitation labels,
schema/version metadata, and no hidden filenames, object URLs, raw landmarks,
coordinates, timestamps, observed seek timestamps such as
`observedSeekTimestampMs`, media dimensions, user IDs, raw video, or frame
pixels.

## Provider-Neutral Contract

Candidate contract shape:

```ts
export type ModelRemoteDataClass =
  | "raw-video"
  | "frame-pixels"
  | "selected-keyframe-images"
  | "pose-landmarks"
  | "metrics"
  | "warnings-and-limitations"
  | "manual-swing-card-prompt"
  | "model-output";

export type ModelOutboundDataClass =
  | "metrics"
  | "warnings-and-limitations"
  | "manual-swing-card-prompt";

export type ModelBlockedOutboundDataClass = Exclude<
  ModelRemoteDataClass,
  ModelOutboundDataClass | "model-output"
>;

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
  readonly dataClasses: readonly ModelOutboundDataClass[];
  readonly abortSignal?: AbortSignal;
}

export type ModelAdapterResult =
  | { readonly status: "ok"; readonly text: string }
  | { readonly status: "error"; readonly code: ModelAdapterErrorCode };

export type ModelAdapterErrorCode =
  | "REMOTE_CONSENT_REQUIRED"
  | "PROVIDER_NOT_REVIEWED"
  | "PROVIDER_NOT_CONFIGURED"
  | "UNSUPPORTED_DATA_CLASS"
  | "UNSAFE_REQUEST_CONTENT"
  | "REMOTE_REQUEST_FAILED"
  | "REMOTE_REQUEST_CANCELLED"
  | "UNSAFE_RESPONSE_CONTENT";

export interface ModelAdapter {
  readonly provider: ModelProviderDescriptor;
  preview(request: Omit<ModelAdapterRequest, "abortSignal">): ModelRequestPreview;
  send(request: ModelAdapterRequest): Promise<ModelAdapterResult>;
}
```

Implementation may revise names if the final contract remains provider-neutral,
bounded, typed, and fail-closed.

## Provider Registry

SS-013 must ship with an empty production provider registry. The "Remote model
review" UI must therefore remain in an unavailable/configuration-required state
by default. Any non-empty registry, real destination origin, API route, API key
handling, provider SDK, provider model name, or working hosted call requires a
separately reviewed story and cannot be smuggled into SS-013 implementation.

## Consent Gate

Remote model consent must be separate from the existing local safety
acknowledgement. The current safety acknowledgement is not a durable legal or
privacy record and does not authorize remote sharing.

Rules:

- Remote consent state is in-memory only for SS-013.
- Default remote consent state is off on every page load, refresh, tab reopen,
  provider change, request content change, unsupported data-class detection, or
  missing provider/configuration state.
- SS-013 must not add a new storage key for remote consent and must not persist
  prompts, outputs, metrics, keys, provider secrets, or remote consent state.
- Remote send controls are disabled unless a reviewed provider is configured,
  a request preview exists, and the user explicitly opts in for that action.
- Consent copy must show the provider display name, destination origin when
  known, terms URL, privacy URL, data classes to be sent, and blocked data
  classes that will not be sent.
- Revoking consent, changing provider, changing request contents, missing
  provider config, missing API route/key, or unsupported data class resets or
  blocks send.
- Revoking consent while a request is in flight must immediately call
  `AbortController.abort()` for that request's `abortSignal` and surface
  `REMOTE_REQUEST_CANCELLED` with sanitized UI text.

## Enforcement

Both UI disable logic and any adapter `send()` implementation must call a
single canonical guard function, such as:

```ts
export type RemoteSendGuardResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: ModelAdapterErrorCode };

export function canSendRemoteRequest(state: RemoteSendState): RemoteSendGuardResult;
```

The guard owns checks for remote consent, provider review, provider
configuration, allowed data classes, prompt validation, and manual-content
availability. UI code may add presentation-only disabled states, but it must
not reimplement independent security decisions. Adapter `send()` must call the
guard before any network-capable operation and return the guard error code when
the guard fails.

`PROVIDER_NOT_REVIEWED` means no descriptor for the requested provider appears
in the reviewed provider registry. `PROVIDER_NOT_CONFIGURED` means a reviewed
descriptor exists but runtime send configuration, such as a reviewed API route
or key handling path, is absent. With the required empty SS-013 production
registry, the default user-facing state is `PROVIDER_NOT_REVIEWED`; tests may
use fixture descriptors to distinguish reviewed-but-unconfigured behavior.

## UI Contract

Add an optional "Remote model review" surface near the existing Swing Card
export area. It must be visually and behaviorally secondary to the manual
workflow.

Required UI behavior:

- Manual `Download PNG`, `Print / Save as PDF`, and `Copy prompt` remain
  visible and usable without provider configuration.
- Remote model controls show an unavailable/configuration-required state by
  default.
- Before consent, the UI says remote review is optional and off by default.
- The disclosure says what would be sent and what will not be sent.
- User-facing text says provider terms and privacy practices apply. It must not
  claim anonymity, guaranteed privacy, guaranteed deletion, legal compliance,
  medical safety, or professional coaching equivalence.
- Any model output that is ever displayed must be assigned through text-only
  rendering such as `textContent` or equivalent framework text binding. It must
  not be interpolated into `innerHTML`, parsed as trusted HTML, or rendered as
  markdown/HTML.

## Fail-Closed Behavior

The remote send path must fail before network when:

- remote consent is absent;
- no reviewed provider descriptor is available;
- provider config is missing;
- request includes blocked data classes;
- prompt preview contains prohibited raw payload keys, coordinate pairs, object
  URLs, filenames, timestamps, hidden identifiers, or raw JSON dumps;
- manual Swing Card content is unavailable; or
- the user revokes consent before or during send.

Network errors, aborts, or unsafe response validation failures must return
stable error codes and sanitized UI text. They must not log raw prompts,
metrics, landmarks, media details, provider keys, or user identifiers.

`UNSAFE_RESPONSE_CONTENT` must be returned when remote output violates the
bounded response contract. Candidate criteria:

- response body exceeds the implementation cap selected in tests;
- response content type is not a reviewed text or JSON type;
- JSON response lacks the expected top-level shape;
- response text contains unsafe medical, rehabilitation, aggressive movement,
  guarantee, privacy/legal/compliance, raw payload, coordinate, object URL,
  filename, timestamp, hidden identifier, or HTML/script content patterns; or
- response cannot be rendered safely as plain text.

`UNSAFE_REQUEST_CONTENT` must be returned when the outbound prompt exceeds the
implementation cap selected in tests or contains prohibited request content.
The prohibited prompt check must use a named runtime validator, such as
`validateRemotePromptPreview(prompt)`, with positive and negative tests. It
must reject raw payload keys, coordinate pairs, object URLs, filenames,
timestamps including `observedSeekTimestampMs`, hidden identifiers, and raw JSON
dumps. Structural construction from existing prompt builders is useful but not
sufficient for SS-013 because future UI paths could pass different text.

## Verification Plan

Required unit coverage before implementation can be considered complete:

- one explicit negative test for `REMOTE_CONSENT_REQUIRED`;
- one explicit negative test for `PROVIDER_NOT_REVIEWED`;
- one explicit negative test for `PROVIDER_NOT_CONFIGURED`;
- one explicit negative test for `UNSUPPORTED_DATA_CLASS`;
- one explicit negative test for `UNSAFE_REQUEST_CONTENT`;
- one explicit negative test for `REMOTE_REQUEST_FAILED`;
- one explicit negative test for `REMOTE_REQUEST_CANCELLED`, including
  mid-flight consent revocation calling `AbortController.abort()`;
- one explicit negative test for `UNSAFE_RESPONSE_CONTENT`;
- tests proving the production provider registry is empty by default;
- tests proving `blockedDataClasses` is derived from the canonical data-class
  union;
- prompt-preview validator positive/negative tests for every prohibited pattern
  family listed above; and
- manual Swing Card workflow regression coverage proving Download PNG,
  Print / Save as PDF, and Copy prompt remain available without provider
  configuration, API keys, remote consent, server config, or network.

Required before PR:

- `npm run test:smoke`
- `npm run build`
- `npm run compliance:verify`
- `npm run privacy:verify`
- `npm run safety:verify`
- `git diff --check`

If any dependency, provider SDK, model asset, bundle, or licensing-sensitive
surface is added unexpectedly, also run:

- `npm run license:audit`
- `npm run verify:bundle-license-fixture`
- `npm run sbom:generate`

## Observability Decision

Runtime observability should remain intentionally limited for SS-013. Use
stable local UI status/error codes for user-visible state. Do not add telemetry,
remote logging, analytics, cloud diagnostics, or console logs containing
prompts, outputs, metrics, landmarks, media details, provider keys, or hidden
identifiers.

## Current Gate

Implementation remains blocked pending Claude QA planning PASS against this
specification, `docs/ss-013-research-disposition.md`, and `SS-TC-019`.
