# Clarunio — M7 test plan

## Purpose

This plan records reproducible checks for the local-first MVP. It does not certify Android runtime behavior that was not exercised on a device or emulator.

## Commands and evidence

| Check | Command | M7 evidence |
|---|---|---|
| Install | `npm install` | Passed locally: 701 packages audited; npm reported 24 vulnerabilities (4 moderate, 18 high, 2 critical) |
| Type safety | `npm run typecheck` | Passed locally |
| Lint | `npm run lint` | Passed locally with `--max-warnings=0` |
| Domain/repository tests | `npm test -- --run` | Passed: 10 files, 31 tests |
| Expo configuration | `npx expo-doctor` | 20/21 checks passed; one known warning about native folders plus app.json prebuild fields |

## Test matrix M0–M7

| Milestone | Coverage | Evidence |
|---|---|---|
| M0 | Contracts, navigation shell and empty states | `tests/m0-contracts.test.ts` |
| M1 | Capture, validation and item transitions | `tests/m1-items.test.ts` |
| M2 | Inbox clarification and transactional decisions | `tests/m2-clarify.test.ts` |
| M3 | Projects and project-linked actions | `tests/m3-projects.test.ts` |
| M4 | Focus dates and scheduling semantics | `tests/m4-focus-dates.test.ts` |
| M5 | Review/recovery persistence and transitions | `tests/m5-review-recovery.test.ts` |
| M6 | Search, backup and settings contracts | `tests/m6-search-safety.test.ts`, `tests/m6-backup-settings.test.ts` |
| M7 | Delete-all settings cleanup, deterministic 5,000-item fixture, UI hardening | `tests/m7-data-delete.test.ts`, `tests/m7-performance.test.ts` |

## UX safety review

- Controls expose Spanish labels and selected/checked/progress state where applicable.
- Long item/detail and capture flows have scrolling, safe-area, keyboard-aware layout, or both.
- Loading, empty, recoverable error, retry, saving and disabled states are represented where implemented.
- Status is not communicated by color alone.
- Dark-theme text uses the theme text tokens rather than default black text.
- Manual screen-reader, font-scaling, small-screen and Android keyboard checks remain pending until a runtime target is available.

## Performance fixture

`tests/fixtures/m7-fixtures.ts` creates synthetic data only inside tests. The fixture is deterministic, never runs from the app, and never seeds the user's database. The benchmark reports one local filter duration for orientation; it is not a device performance claim or release threshold.

## Known gaps

- Native Android runtime, file picker, sharing and notifications were not certified by this repository test suite.
- No native E2E test is claimed.
- SQLite is local storage, not encryption. There is no sync or backend.
- `npm audit` currently reports dependency vulnerabilities and must be reviewed before publishing.
