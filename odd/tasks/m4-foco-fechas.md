# Clarunio M4 — Foco y fechas

## Objetivo

Permitir que la persona elija acciones `NEXT` para enfocarse en `Ahora`, manteniendo separados el foco, la disponibilidad y el vencimiento real.

## Specs

- **S1** — `focus_date` se persiste como fecha local `YYYY-MM-DD` y no modifica `due_at` ni `available_from`.
- **S2** — `Ahora` muestra las acciones elegidas para la fecha local actual y permite añadir/quitar foco manualmente.
- **S3** — Solo acciones `NEXT` disponibles pueden entrar en foco; `WAITING`, `DONE`, `TRASH` y `SCHEDULED` no aparecen como foco activo.
- **S4** — `SCHEDULED` exige `available_from` futura al programarse y se activa a `NEXT` de forma idempotente cuando llega su fecha.
- **S5** — `due_at` representa compromiso real independiente de foco y disponibilidad; no genera notificaciones automáticamente.
- **S6** — Completar una acción la quita del foco y permite deshacer mediante una transición explícita, sin completar proyectos automáticamente.
- **S7** — Las fechas se validan, se muestran con semántica local y sobreviven a reinicios sin reinterpretarse como UTC.

## Tasks

- [ ] T1 — Crear migración de `focus_selections` y ampliar dominio/repositorios con fechas separadas.
- [ ] T2 — Implementar activación idempotente de acciones programadas y consultas disponibles.
- [ ] T3 — Conectar `Ahora` a foco persistente y acciones NEXT disponibles.
- [ ] T4 — Añadir controles de enfoque, programación, vencimiento, completado y deshacer explícito.
- [ ] T5 — Añadir pruebas de fechas, zona local, foco y activación repetida.
- [ ] T6 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario después de probar manualmente Android.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No implementar M5: revisión semanal ni recuperación.

## Log

- 2026-10-22 — M4 autorizado mediante «prosigue». El propietario informó que probó la aplicación en Android real/emulador; se creó la rama `feature/m4-foco-fechas` y este documento.
