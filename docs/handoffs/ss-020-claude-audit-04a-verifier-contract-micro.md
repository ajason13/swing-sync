# SS-020 04A-MICRO

Verifier-contract audit only.

Task `SS-020`; candidate `e365204ecb763cf36f6663ac88e8f272744bf0fa`;
base `0509999e7de5e609787fe53e8bdac2747aa0be64`. Candidate manifest SHA-256
`50ac0f9fdbaa7be2288af5fa3f91436ae1be6f0bff5ddc32d61ecb83a660f442`.

Exact finite 21-path candidate manifest:
```text
{CONTEXT.md,CONTRIBUTING.md,README.md}
docs/handoffs/ss-020-claude-{audit-{01-governance.md,01-response.md,02-inventory-coverage.md,03-public-claims-sources.md,04-verifier-tests.md,05-final-synthesis.md},final-audit-{prompt.md,source-packet.md}}
docs/{limitations.md,privacy-architecture.md,release-review-gate.md,safety-terms.md,ss-020-{gemini-research-prompt.md,preimplementation-spec.md,research-{disposition.md,notes.md}}}
{scripts/verify-docs-claims.js,test/unit/docs-claims.test.ts}
```

Prerequisites: `02-MICRO-IDENTITY-BRIDGE`: candidate exact, AC1/AC5 PASS, B1
RESOLVED, verdict PASS, blockers/missing none, next 03. `03A-MICRO`: candidate
exact, AC3/AC4_PUBLIC_PRIVACY PASS, verdict PASS, blockers/missing none, next
03B; response-body SHA-256
  `720f75ed560ab679e570a7b83bad16bbc50bfe88df1425690f0cf53e42261eeb`.

`03B-MICRO-COMPACT-RESTATEMENT`: candidate exact, AC4_PROVIDER_SOURCES PASS,
verdict PASS, blockers/missing none, next 04; body SHA-256
`0e81372afc3e4530f683b3fceecfa776fff0aab624751be381765e627f46dfe4`.

Blobs: verifier `a14661d401f2ef2ce4204bc978e929b33e666827`; gate =
`50c552aed5627bea91f1f58733252ed7b3768e49`.

Audit AC3/AC4/AC6+B1. `files` assigns the gate four exact `requiredStrings`:
`releaseGateAccessibilityChecklist`, `releaseGateAccessibilityPending`,
`releaseGateAccessibilityBlocker`, `releaseGateAccessibilityReopening`.
They bind: evidence/manual-risk/copy checklist, accessibility+release owner,
`Blocking | Pending`; `Accessibility | PENDING` plus five `Not
recorded`; missing/unresolved accessibility evidence/reviewer as blocker; and
copy/UI/evidence/semantics/names/keyboard/focus/announcements/reflow/nonvisual/
AT changes as reopening. Confirm byte-exact registry+gate values and B1
resolution without certification.

Declarative `crossFileChecks`: `prematureCurrentApproval` rejects current
human/domain/release approvals but permits negations; `currentOutcome` reserves
exactly one PENDING declaration to the gate; `uniqueNormalizedOwner` gives
normalized blocked text one gate owner.

`verifyDocsClaims(fileReader = readFileFromDisk)` injects reads for configured
and cross-file paths. Missing/null or empty configured content; missing
cross-file source/target; and empty/failed extraction fail closed. Strings,
headings, links, ownership errors name paths. No parser/runtime/provider/flow/
observability/deployment/dependency/approval/clearance change.

Exclude tests (04B), approval, PR/merge/release, human decisions.

Return one <=1800-byte block exactly:
```text
STAGE_ID: 04A-MICRO
CANDIDATE_ID: e365204ecb763cf36f6663ac88e8f272744bf0fa
AC3_ENFORCEMENT: PASS|FAIL
AC4_ENFORCEMENT: PASS|FAIL
AC6_ENFORCEMENT: PASS|FAIL
B1_ENFORCEMENT: RESOLVED|UNRESOLVED
VERDICT: PASS|PASS WITH MINOR FIXES|FAIL
BLOCKERS: none|numbered findings
NON-BLOCKERS: none|findings
MISSING: none|items
FUTURE: none|items
NO-CLEARANCE: engineering verifier audit only; no legal/privacy/safety/trademark/accessibility/release clearance granted
NEXT_STAGE: MAY PROCEED TO STAGE 04B|STOP
PR PREPARATION NOT PERMITTED
```
Proceed only for all PASS, B1 RESOLVED, blockers/missing none; else STOP.
