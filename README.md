# Clarunio

Clarunio is an Android-first personal productivity app. This workspace contains the local-first M0–M7 implementation: capture, GTD clarification, projects, review/recovery, search, backups, preferences and release hardening on Expo SDK 57.

## Scope boundary

The app remains local-first and does not include accounts, backend services, synchronization, AI or analytics. SQLite is local storage, not encryption. Android runtime, file picker, sharing, notifications and production publishing remain validation/release work, not claims of completion. M7 synthetic fixtures run only in tests and never seed user data.

## Requirements

- Node.js compatible with Expo SDK 57
- npm
- Android emulator/device for the Android-first runtime

## Commands

```bash
npm install
npm start
npm run android
npm run typecheck
npm run lint
npm test -- --run
npx expo-doctor
```

Use `npm start` and press `a` to launch the Android development target.

See [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md), [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) and [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) for evidence commands, UX checks and pending Android validation.
