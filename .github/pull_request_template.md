## Reference Integrity

- [ ] I confirmed this PR does not copy or adapt code from unlicensed or copyleft reference repositories.
- [ ] If this PR adapts code from a permissively licensed reference, I preserved required notices and updated `THIRD_PARTY_NOTICES.md`.
- [ ] I confirmed no weak `test -f` assertion is used where `test -s` is required for compliance artifact checks.

## Verification

- [ ] `npm run license:audit`
- [ ] `npm run sbom:generate`
- [ ] `npm run build`
- [ ] `npm run compliance:verify`
