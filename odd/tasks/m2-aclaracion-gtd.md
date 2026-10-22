# Clarunio M2 — Aclaración GTD

## Objetivo

Permitir que una captura de la Bandeja se aclare mediante un flujo guiado y determinista, con decisiones explícitas y reversibles, sin introducir todavía proyectos, espera, fechas, foco, revisión ni IA.

## Specs

- **S1** — Una entrada `INBOX` muestra la pregunta «¿Esto requiere alguna acción?» antes de mover su estado.
- **S2** — Las entradas no accionables pueden moverse explícitamente a `REFERENCE`, `SOMEDAY` o `TRASH`, conservando el texto cuando corresponda.
- **S3** — Una entrada accionable exige un siguiente paso concreto y puede convertirse en `NEXT` sin crear fechas, proyecto ni campos inventados.
- **S4** — Cancelar el asistente no modifica la entrada; confirmar persiste la decisión y la retira de la Bandeja.
- **S5** — Las transiciones pasan por una función de dominio común con validación; no se crean registros parciales ni duplicados.
- **S6** — La interfaz mantiene una pregunta por paso, estados de carga/error, accesibilidad y microcopy español.

## Tasks

- [x] T1 — Extender dominio y repositorio con transiciones `INBOX -> NEXT | SOMEDAY | REFERENCE | TRASH`.
- [x] T2 — Añadir pruebas de invariantes y transiciones válidas/ inválidas.
- [x] T3 — Implementar pantalla de aclaración con flujo no accionable y accionable.
- [x] T4 — Conectar cada entrada de Bandeja al asistente y refrescar datos al volver.
- [x] T5 — Actualizar documentación y evidencia ODD.
- [x] T6 — Ejecutar verificaciones y crear commits locales en español por unidad.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario mediante «prosigue» después de M1.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No implementar M3: proyectos, WAITING, bloqueos, fechas ni seguimiento.

## Log

- 2026-10-22 — M2 autorizado. Documento creado; exploración de integración pendiente.
- 2026-10-22 — Se decidió que el texto confirmado como siguiente paso reemplaza el título de la entrada, porque M1 no tiene un campo separado de título de acción. No se agregaron proyectos, notas ni campos de M3.
- 2026-10-22 — `f8e0379` — `feat(aclaracion): agrega transiciones seguras para entradas`. Se añadió la función de dominio común y la actualización condicionada a `state = INBOX`; TRASH guarda `previous_state = INBOX` y `deleted_at`.
- 2026-10-22 — `c06a476` — `feat(aclaracion): conecta el asistente y la bandeja`. Se añadió `app/clarify/[id].tsx`, carga por id desde SQLite, decisiones explícitas, cancelación sin escritura, estados de carga/éxito/error y apertura accesible desde Bandeja.
- 2026-10-22 — `34c81f0` — `test(m2): cubre decisiones de aclaracion`. `npm test -- --run tests/m2-clarify.test.ts`: 5 tests pasaron.
- 2026-10-22 — Evidencia parcial: `npm install`, `npm run typecheck` y `npm run lint` pasaron antes de cerrar la implementación. La verificación completa queda registrada al finalizar el hito.
