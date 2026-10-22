# Clarunio M3 — Proyectos y Esperando

## Objetivo

Representar resultados de varios pasos y dependencias externas sin inventar progreso: crear proyectos con resultado deseado, vincular una siguiente acción y registrar acciones `WAITING` con la respuesta esperada.

## Specs

- **S1** — Un proyecto exige resultado deseado, estado explícito y persistencia local.
- **S2** — Una acción puede vincularse a un proyecto; el proyecto muestra su siguiente acción disponible o una espera/bloqueo honesto.
- **S3** — Aclarar una entrada como proyecto crea el proyecto y su primera `NEXT` en una transacción; una falla no deja entidades parciales.
- **S4** — Una acción `WAITING` exige `waiting_for` no vacío y no aparece como siguiente acción ni foco.
- **S5** — Una acción `WAITING` puede volver a `NEXT` o marcarse `DONE` mediante decisión explícita; ninguna fecha la completa automáticamente.
- **S6** — La vista Proyectos muestra resultado, estado textual y siguiente acción/espera, sin porcentajes ni datos ficticios.

## Tasks

- [ ] T1 — Crear migración SQLite de proyectos, tipos de dominio y repositorios parametrizados.
- [ ] T2 — Añadir casos de uso/transacciones para proyecto con primera acción y acciones WAITING.
- [ ] T3 — Extender aclaración con proyecto y espera sin romper los flujos M2.
- [ ] T4 — Implementar listado y detalle básico de proyectos con estados honestos.
- [ ] T5 — Añadir pruebas de transacciones, invariantes, bloqueos y conversiones explícitas.
- [ ] T6 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario mediante «continua» después de M2.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No implementar M4: foco, fechas, activación programada ni vencimientos.

## Log

- 2026-10-22 — M3 autorizado. Se creó la rama `feature/m3-proyectos-espera` y este documento; exploración pendiente.
