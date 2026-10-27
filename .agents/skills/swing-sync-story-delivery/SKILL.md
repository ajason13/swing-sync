---
name: swing-sync-story-delivery
description: Deliver a scoped Swing Sync feature or fix with its privacy, safety, licensing, and verification constraints.
---

# Swing Sync Delivery

Repository AGENTS.md owns the task loop and verification commands. Inspect
the relevant source and policies, state acceptance criteria, and implement one
behavior change per PR. Historical handoffs are read only when needed.

For coaching or external-model features, verify license/terms and explicit
opt-in data flows before adoption. Preserve local-first behavior and qualified
human/legal release gates. A fresh Codex review covers sensitive changes;
external auditors and tracker synchronization are optional user requests.

Run focused tests during iteration and required broader checks before the PR.
For verifier/parser changes, exercise malformed/missing inputs and positive
behavior rather than relying on source-string inventories. Describe runtime
observability when it changes. Use global standing authority for task branches,
PRs, and protected auto-merge. Record an interrupted task in a short local
checkpoint under the Git directory.
