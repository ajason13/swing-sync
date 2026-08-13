# SS-021 Research Disposition

Date: 2026-08-13

## Facts

- The only current Swing Sync persisted browser value is
  `swing-sync:safety-consent:v1` in `localStorage`. Repository searches found
  no app-owned `sessionStorage`, IndexedDB, Cache Storage, OPFS, cookie, raw
  video, frame, landmark, metric, or prompt persistence.
- Web Storage is scoped to an origin. `Storage.removeItem()` removes a named
  key and does nothing when it is absent; access can be blocked by browser
  policy or origin/security conditions. See [WHATWG Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html),
  [MDN removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem),
  and [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- `localStorage.clear()` would also remove unrelated same-origin values, so it
  is not an app-owned lifecycle operation.

## Lead Disposition

- **Adopt:** a registered, exact-key local-data lifecycle contract. It owns
  only the acknowledgement key today; future app-owned persisted analysis
  state must register its exact remover before it is introduced.
- **Adopt:** report success only after named-key removal and an absent readback.
  A thrown operation or unreadable verification returns a sanitized blocked
  result and leaves analysis blocked for the current session. Before the
  persisted operation, active volatile work is closed and app state is reset so
  selected files, frames, landmarks, metrics, phase state, exports, and prompts
  are released even when browser storage is blocked.
- **Adopt:** use the existing visible-status, global-announcer, and focus path.
  Runtime observability is intentionally unchanged: no logs, telemetry,
  diagnostics, or persisted failure data are added.
- **Defer:** clearing volatile in-memory analysis state, downloaded files, and
  any future IndexedDB, Cache Storage, or OPFS implementation. Each future
  store needs a reviewed adapter and failure contract.
- **Reject:** origin-wide clearing, deletion/physical-erasure claims, and any
  new storage, remote, dependency, provider, sharing, or service-worker work.

Independent Lead Architect approval arrived after the initial research handoff
and is the Builder authorization for this exact scope. It is not human legal,
privacy, safety, accessibility, compliance, or release clearance.
