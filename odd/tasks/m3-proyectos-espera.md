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

- [x] T1 — Crear migración SQLite de proyectos, tipos de dominio y repositorios parametrizados.
- [x] T2 — Añadir casos de uso/transacciones para proyecto con primera acción y acciones WAITING.
- [x] T3 — Extender aclaración con proyecto y espera sin romper los flujos M2.
- [x] T4 — Implementar listado y detalle básico de proyectos con estados honestos.
- [x] T5 — Añadir pruebas de transacciones, invariantes, bloqueos y conversiones explícitas.
- [x] T6 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

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
- 2026-10-22 — T1/T2 completados. `migrations.ts` versiona 0→1→2, crea `projects`, reconstruye `items` con FK `project_id` y conserva las columnas M1/M2. La creación de proyecto y primera `NEXT` usa una única transacción parametrizada. Commit `366ef27`.
- 2026-10-22 — T3 completado. La aclaración ofrece proyecto y espera; `WAITING` exige `waiting_for`, queda fuera de NEXT y solo permite conversiones explícitas a `NEXT` o `DONE`. Los flujos M2 existentes siguen pasando. Commit `ef29f4d`.
- 2026-10-22 — T4 completado. Proyectos carga datos persistidos, muestra carga/vacío/error y dispone de detalle con acciones, siguiente acción o espera honestas; no calcula progreso. Commit `68c2a4f`.
- 2026-10-22 — T5 completado. Tests M3 cubren transacción, vínculo de primera acción, validación de espera y conversión explícita. Commit `8f14be6`.
- 2026-10-22 — T6 completado. Evidencia: `npm install` OK (24 vulnerabilidades reportadas por npm audit), `npm run typecheck` OK, `npm run lint` OK, `npm test -- --run` OK (4 archivos, 13 tests), `npx expo-doctor` OK (21/21 checks). No se probó runtime Android nativo en este entorno.
- Decisión: el alcance M3 no usa `focus_date`, `due_at`, `available_from`, automatizaciones, porcentajes ni datos seed. Las tarjetas muestran únicamente estado textual y la información persistida disponible.
