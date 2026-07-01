# SS-013 Claude QA Planning Response

Claude QA planning returned **FAIL** for implementation start.

Date recorded: 2026-06-30.

## Verdict

Implementation remains blocked. Claude agreed the high-risk options were
correctly rejected, but found eight blocking specification gaps around
fail-closed defaults, canonical enforcement, error-code coverage, provider
registry behavior, remote-output handling, and revocation semantics.

## Blocking Findings

| ID | Finding | Disposition | Resolution |
| --- | --- | --- | --- |
| B1 | Consent persistence was conditional instead of deterministic. | Accept | Revised spec requires in-memory-only remote consent for SS-013, default off on every page load/reload/tab reopen, and no new remote-consent storage key. |
| B2 | "Reviewed provider" was undefined and zero-provider default was not guaranteed. | Accept | Revised spec adds an empty production provider registry requirement and unavailable remote UI by default. Research disposition rejects shipping any `ModelProviderDescriptor` entries in SS-013. |
| B3 | Fail-closed checks lacked a single canonical enforcement point. | Accept | Revised spec adds `canSendRemoteRequest(state): RemoteSendGuardResult` as the shared guard for UI and adapter send paths. |
| B4 | No per-error-code negative test requirement. | Accept | Revised spec requires one explicit negative test for each `ModelAdapterErrorCode`, plus registry, blocked-data-class, validator, and manual fallback regression tests. |
| B5 | `UNSAFE_RESPONSE_CONTENT` and safe rendering were undefined. | Accept | Revised spec defines candidate unsafe response criteria and requires text-only output rendering, never `innerHTML`/trusted HTML/markdown rendering. |
| B6 | `blockedDataClasses` was loosely typed as `string[]`. | Accept | Revised contract defines a closed `ModelRemoteDataClass` union, allowed outbound subset, blocked outbound subset, and typed `blockedDataClasses`. |
| B7 | Mid-flight consent revocation was unaddressed. | Accept | Revised spec requires revocation during send to call `AbortController.abort()` and surface `REMOTE_REQUEST_CANCELLED`. |
| B8 | Prohibited prompt check had no named validation mechanism. | Accept | Revised spec requires a named runtime validator such as `validateRemotePromptPreview(prompt)` with positive/negative pattern-family tests. |

## Non-Blocking Recommendations

Claude recommended future CSP `connect-src` documentation, a future provider
descriptor staleness policy, explicit `observedSeekTimestampMs` exclusion, and
ARIA live-region alignment for new disclosure/consent UI. The revised spec
adds `observedSeekTimestampMs` to excluded fields. CSP/staleness/ARIA remain
non-blocking planning notes for implementation/future provider enablement.

## Current Gate

Implementation remains blocked pending focused Claude QA re-review PASS on the
revised `docs/ss-013-research-disposition.md`,
`docs/ss-013-preimplementation-spec.md`, and `SS-TC-019` revisions.

