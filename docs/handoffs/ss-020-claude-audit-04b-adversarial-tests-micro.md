# SS-020 04B-MICRO

Tests; 04A identity prerequisite.

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
RESOLVED, verdict PASS, blockers/missing none. `03A-MICRO`: candidate exact,
AC3/AC4_PUBLIC_PRIVACY PASS, verdict PASS, blockers/missing none; body SHA-256
`720f75ed560ab679e570a7b83bad16bbc50bfe88df1425690f0cf53e42261eeb`.

`03B-MICRO-COMPACT-RESTATEMENT`: candidate exact, AC4_PROVIDER_SOURCES PASS,
verdict PASS, blockers/missing none, next 04; body SHA-256
`0e81372afc3e4530f683b3fceecfa776fff0aab624751be381765e627f46dfe4`.

`04A_RESPONSE_BODY_SHA256: REQUIRED BEFORE SUBMISSION`: insert after exact 04A
candidate-bound PASS, AC3/AC4/AC6 enforcement PASS, B1 RESOLVED,
blockers/missing none, next 04B.

Test blob `test/unit/docs-claims.test.ts` =
`a410460d44552ed7df4d28d262a75c841c3353ee`.

Audit AC1/AC3/AC4/AC6+B1. Positive pending config passes. Injected-reader tests
fail closed for:

- missing/empty gate; removed draft/PENDING/blocked/outcome or SS-002 blocker;
- removed exact accessibility checklist, PENDING row, blocker, reopening rule;
- missing heading/link; duplicate normalized blocked owner;
- premature canonical/supporting approvals (with/without copula), completed
  review/sign-off/public release; outcome duplication/contradiction/non-PENDING.

Allows future outcomes, negated no-clearance/approval across all scanned docs,
and normalized blocked-anchor whitespace.

Existing cases cover missing/empty/cross-file/format failures: public docs,
headings, strings, terms, links, banners/placement, banned claims, CSP
duplication, reordered attributes/whitespace, embedded quotes, and
missing/empty/unextractable CSP. `without()` first proves removed text exists.

Node `22.22.3`: docs-claims `40/40`; unit `244/244` (24 files); `npm run
docs:verify`, `safety:verify`, `privacy:verify`, `compliance:verify`, `build`, and
`git diff --check` PASS. Any discrepancy blocks. No parser/runtime/provider/
flow/observability change.

No implementation/human approval or PR/merge/release.

Return one <=1800-byte block exactly:
```text
STAGE_ID: 04B-MICRO
CANDIDATE_ID: e365204ecb763cf36f6663ac88e8f272744bf0fa
AC1_TEST_EVIDENCE: PASS|FAIL
AC3_TEST_EVIDENCE: PASS|FAIL
AC4_TEST_EVIDENCE: PASS|FAIL
AC6_TEST_EVIDENCE: PASS|FAIL
B1_TEST_EVIDENCE: RESOLVED|UNRESOLVED
VERDICT: PASS|PASS WITH MINOR FIXES|FAIL
BLOCKERS: none|numbered findings
NON-BLOCKERS: none|findings
MISSING: none|items
FUTURE: none|items
NO-CLEARANCE: engineering test audit only; no legal/privacy/safety/trademark/accessibility/release clearance granted
NEXT_STAGE: MAY PROCEED TO STAGE 05 PREFLIGHT|STOP
PR PREPARATION NOT PERMITTED
```
Proceed only for all PASS, B1 RESOLVED, blockers/missing none; else STOP.
