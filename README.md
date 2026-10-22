# Clarunio

Clarunio is an Android-first personal productivity app. This workspace currently contains **M0 — Bootstrap** only: an Expo SDK 57 + TypeScript strict navigation shell with Clarunio light/dark tokens and honest empty states.

## Scope boundary

The capture button is an accessible placeholder. M0 does not persist data and does not include SQLite, GTD behavior, authentication, backend services, notifications, or fake seed data. Those require later authorization.

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
