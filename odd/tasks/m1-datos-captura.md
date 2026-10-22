# Clarunio M1 — Datos y captura

## Objetivo

Hacer funcional la captura local y la Bandeja de Clarunio con SQLite como fuente de verdad, manteniendo el funcionamiento offline y sin ampliar el alcance a aclaración GTD, proyectos ni fechas.

## Specs

- **S1** — La app crea/migra una base SQLite local con la tabla `items` y estado `INBOX`.
- **S2** — La captura solicita únicamente texto libre, valida contenido significativo y guarda una sola entrada por acción confirmada.
- **S3** — La Bandeja lista entradas `INBOX` persistidas y muestra un contador real.
- **S4** — El guardado exitoso se confirma solamente después de persistir; un error conserva el texto y permite reintentar.
- **S5** — Cerrar y reabrir la app conserva las capturas; no se requiere red, cuenta, fecha ni proyecto.

## Tasks

- [ ] T1 — Añadir Expo SQLite SDK 57, migración inicial y tipos de dominio para Item.
- [ ] T2 — Implementar repositorio SQLite parametrizado con captura y consulta de bandeja.
- [ ] T3 — Conectar el FAB y la pantalla de captura; controlar carga, éxito, error y doble toque.
- [ ] T4 — Conectar Bandeja a datos reales con estados vacío, carga y error recuperable.
- [ ] T5 — Añadir pruebas de dominio/repositorio y actualizar documentación.
- [ ] T6 — Ejecutar verificaciones, registrar evidencia y crear commits locales por unidad.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario después de M0.
- Expo SDK 57 obligatorio.
- Commits locales obligatorios por unidad de trabajo, con mensajes convencionales en español.
- Comentarios de código solo cuando aporten contexto, escritos en español natural y sin referencias a IA.
- No implementar M2: aclaración, estados GTD adicionales, proyectos, espera, foco, búsqueda ni backups.

## Log

- 2026-10-22 — M1 autorizado. Se inicializó Git local y se creó la rama `feature/m1-datos-captura`; pendiente implementar.
