# Clarunio M0 — Bootstrap

## Objective

Create the minimal runnable Android-first Expo application for Clarunio using Expo SDK 57, TypeScript strict mode, the approved lavanda/violet visual identity, and the contractual three-destination navigation shell. This milestone must not implement SQLite, GTD data, fake task content, or M1 behavior.

## Specs

- **S1** — The project starts with Expo SDK 57-compatible dependencies and TypeScript strict mode.
- **S2** — The app exposes the three primary destinations: `Ahora`, `Bandeja`, and `Proyectos`, plus an accessible capture FAB placeholder that does not persist data yet.
- **S3** — Shared Clarunio light/dark theme tokens cover background, surfaces, primary violet, text, outlines, spacing, and radii.
- **S4** — Initial screens show honest empty states and contractual Spanish microcopy; no fabricated user data is displayed.
- **S5** — Project commands are documented and a minimal automated test validates the stable theme/navigation contract.

## Tasks

- [x] T1 — Bootstrap Expo SDK 57 project metadata, scripts, TypeScript, lint, and test runner.
- [x] T2 — Add shared Clarunio theme tokens and reusable shell components.
- [x] T3 — Implement Expo Router layout and the `Ahora`, `Bandeja`, and `Proyectos` empty screens.
- [x] T4 — Add README, test coverage for M0 contracts, and CI workflow.
- [x] T5 — Run typecheck, lint, tests, and an Expo validation command; record actual results.

## Verification

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Authorized scope

- Authorized by the product owner on 2026-10-21.
- Expo SDK 57 is an explicit constraint.
- Route: delegated direct writer because M0 touches multiple non-trivial files; verification is a separate bounded action.
- ODD heuristic: keep the implementation coherent; do not remove documentation or tests to reduce line count.

## Log

- 2026-10-21 — Read the complete product specification and UI concept. Confirmed the workspace contains only the specification and reference image. M0 authorized; implementation pending.
- 2026-10-21 — Implemented T1–T4: Expo SDK 57 metadata, strict TypeScript, theme/shell, contractual routes, honest empty states, placeholder capture FAB, tests, README, and CI. Verification pending.
- 2026-10-21 — Verification: `npm install` completed successfully; `npm run typecheck` passed; `npm run lint` passed; `npm test -- --run` passed (1 file, 3 tests); `npx expo-doctor` passed (21/21 checks). No Android emulator/device runtime was available for a visual check.
