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

- [ ] T1 — Extender dominio y repositorio con transiciones `INBOX -> NEXT | SOMEDAY | REFERENCE | TRASH`.
- [ ] T2 — Añadir pruebas de invariantes y transiciones válidas/ inválidas.
- [ ] T3 — Implementar pantalla de aclaración con flujo no accionable y accionable.
- [ ] T4 — Conectar cada entrada de Bandeja al asistente y refrescar datos al volver.
- [ ] T5 — Actualizar documentación y evidencia ODD.
- [ ] T6 — Ejecutar verificaciones y crear commits locales en español por unidad.

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
