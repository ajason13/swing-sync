# SS-005 Claude QA Planning Response

Claude returned **FAIL** on 2026-06-07 and instructed SS-005 to remain at
`2. QA Planning (Claude)`.

## Findings Addressed

- **B-1 provider metrics: accepted blocker.** MediaPipe provider metrics remain
  incompatible with the currently approved local-first boundary absent explicit
  human/legal approval. CSP blocking is not treated as terms compliance.
- **B-2 dependency/compiled binaries: accepted with revision.** The exact
  package remains blocked on compiled-binary obligations and notices. Claude's
  prediction that the current license audit will fail is not established:
  `npm run license:audit` evaluates npm metadata and would likely accept the
  package's Apache-2.0 declaration. Passing that automated check would still be
  insufficient approval. `verify:bundle-license-fixture` validates rejection of
  a synthetic GPL package; it does not require or validate a MediaPipe NOTICE.
- **B-3 model rights: accepted blocker.** No model asset action is approved.
- **B-4 fixture: accepted blocker.** A generated fixture requires reviewed,
  reproducible provenance before use. Claude's suggested FFmpeg/stick-figure
  path is not automatically approved and may not produce detectable landmarks.
- **B-5 worker contract: fixed in specification.**
  `docs/ss-005-preimplementation-spec.md` defines the normative state, protocol,
  failure, backpressure, and teardown contract.
- **B-6 responsiveness: fixed with revision.** The gate is a deterministic UI
  heartbeat/input behavior. Long-task entries are diagnostic; zero tasks over
  50 ms is not adopted as a universal hard gate because navigation/app work can
  create unrelated long tasks and CI/device behavior varies.
- **B-7 SS-TC-009: fixed in tracker.** Coverage is revised for the worker
  contract, network phases, cleanup, fixture prerequisite, and responsiveness.

## Additional Correction

The exact `@mediapipe/tasks-vision@0.10.35` declarations expose `x`, `y`, `z`,
and `visibility` for normalized/world landmarks, but do not expose
per-landmark `presence`. `minPosePresenceConfidence` is a configuration
threshold. The specification now prohibits inventing a returned presence field
and requires thresholds to be recorded separately.

## Maintainer Decisions

| Decision | Disposition |
| --- | --- |
| D-1 provider metrics | Blocked/incompatible absent human/legal approval or a different candidate. |
| D-2 model delivery | No mechanism approved until model rights are documented. |
| D-3 SDK version | Exact 0.10.35 remains a blocked candidate. |
| D-4 fixture generator | No tool/fixture approved; provenance contract adopted. |
| D-5 no-network precision | Adopt stronger product boundary: no unexpected external request may be required or attempted after approved assets are local, while evidence remains scoped to observed test runs. |
| D-6 responsiveness | Adopt behavioral heartbeat/input gate plus non-gating long-task diagnostics. |

## Remaining Blockers

- provider metrics terms and informed-consent/legal decision;
- exact SDK compiled-binary obligations and notices;
- exact model rights and delivery mechanism;
- approved fixture and provenance; and
- focused Claude PASS after those blockers are resolved.

Implementation remains prohibited.
