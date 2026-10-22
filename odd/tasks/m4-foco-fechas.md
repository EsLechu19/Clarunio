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

- [x] T1 — Crear migración de `focus_selections` y ampliar dominio/repositorios con fechas separadas.
- [x] T2 — Implementar activación idempotente de acciones programadas y consultas disponibles.
- [x] T3 — Conectar `Ahora` a foco persistente y acciones NEXT disponibles.
- [x] T4 — Añadir controles de enfoque, programación, vencimiento, completado y deshacer explícito.
- [x] T5 — Añadir pruebas de fechas, zona local, foco y activación repetida.
- [x] T6 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

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
- 2026-10-22 — La migración v3 conserva v1/v2, crea `focus_selections` con PK compuesta y añade índices de vencimiento y seguimiento.
- 2026-10-22 — `Ahora` activa programadas con un `UPDATE` filtrado por estado y fecha local, consulta foco y siguientes disponibles, y permite enfocar, quitar foco, completar y deshacer.
- 2026-10-22 — El detalle de acción separa programación futura de vencimiento; no se añadieron notificaciones ni cambios automáticos de proyecto.

## Evidencia

- Prueba enfocada: `npm test -- --run tests/m4-focus-dates.test.ts` — 5/5 pruebas correctas.
- Prueba completa: `npm test -- --run` — 18/18 pruebas correctas.
- `npm install` — dependencias actualizadas, sin cambios pendientes reportados por npm; npm informa 24 vulnerabilidades heredadas.
- `npm run typecheck` — correcto después del ajuste de tipos de prueba.
- `npm run lint` — correcto después de retirar un import no usado.
- `npx expo-doctor` — 20/21; falla el aviso de configuración de prebuild por carpetas nativas presentes junto con propiedades nativas en `app.json`, existente fuera del alcance de M4.
- Validación nativa Android: pendiente de ejecución manual del propietario para este hito.

## Decisiones

- Las fechas de foco y disponibilidad se validan como `YYYY-MM-DD` local; no se derivan de timestamps UTC.
- El foco solo se inserta para acciones `NEXT` disponibles y `INSERT OR IGNORE` hace idempotentes los reintentos.
- Completar elimina foco dentro de la misma transacción; deshacer vuelve a `NEXT` sin restaurarlo.
- El vencimiento se modifica por separado y nunca altera foco o disponibilidad.

## Commits

- `9a75e27` — `feat(foco): agrega migracion y reglas de fechas`
- `42a7a37` — `feat(foco): conecta Ahora con acciones persistidas`
- `722c7d8` — `feat(fechas): agrega programacion y vencimientos explicitos`
- `1d220c5` — `test(m4): cubre foco y activacion de fechas`
- `ed94cd5` — `fix(m4): corrige verificacion de ahora y fechas`
- Pendiente — `docs(m4): registra evidencia de foco y fechas`
