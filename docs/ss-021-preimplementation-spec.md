# SS-021 Preimplementation Specification

## Scope

Provide one accessible control in the safety panel that clears registered Swing
Sync app-owned persisted data for the current browser origin and resets the
current volatile app session. It initially removes only
`swing-sync:safety-consent:v1` and verifies that the named key is absent. It
does not clear unrelated origin storage.

## UI and Failure Contract

- The control has a clear label, returns focus to the now-unchecked safety
  acknowledgement, and uses the existing global announcement owner plus the
  non-live visible status.
- Success says that local Swing Sync user state was cleared in the browser but
  is not device-level erasure.
- A storage failure or unverifiable removal says only that Swing Sync could not
  clear all local app data and treats the acknowledgement as not recorded. It must not
  expose exception text, keys, media metadata, landmarks, metrics, prompts, or
  identifiers.
- Nearby explanatory copy states that the action is not device-level erasure;
  browser and operating-system storage behavior varies, and downloaded files
  are outside this control.

## Acceptance and Verification Mapping

| Acceptance | Evidence |
| --- | --- |
| Visible app-owned clear control | Renderer and accessibility unit tests |
| Fail-closed sanitized blocked state | storage and event unit tests; smoke test |
| Bounded browser/device explanation | renderer unit test and existing privacy limits |
| Clear, blocked clear, and refresh behavior | storage/event unit tests and smoke tests |
| No new sensitive persistence | repository inventory plus smoke storage assertions |

Builder-owned files are limited to the consent storage contract, app-state
reset, event binding, renderer, directly related tests, and final
context/audit handoffs. No dependency, licensing, bundle, notice, SBOM,
service-worker, style, or verifier change is approved.
