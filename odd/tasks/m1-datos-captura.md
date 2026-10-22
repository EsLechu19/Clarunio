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

- [x] T1 — Añadir Expo SQLite SDK 57, migración inicial y tipos de dominio para Item.
- [x] T2 — Implementar repositorio SQLite parametrizado con captura y consulta de bandeja.
- [x] T3 — Conectar el FAB y la pantalla de captura; controlar carga, éxito, error y doble toque.
- [x] T4 — Conectar Bandeja a datos reales con estados vacío, carga y error recuperable.
- [x] T5 — Añadir pruebas de dominio/repositorio y actualizar documentación.
- [x] T6 — Ejecutar verificaciones, registrar evidencia y crear commits locales por unidad.

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
- 2026-10-22 — Se añadió `expo-sqlite` compatible con Expo SDK 57, migración idempotente versión 1 para `items` e índices, dominio `Item` y repositorio parametrizado. Commit: `f4cc4b4 feat(datos): establece SQLite y repositorio de bandeja`.
- 2026-10-22 — Se conectó `SQLiteProvider`, captura rápida desde el FAB y Bandeja con carga, vacío, contenido, contador real y error reintentable. Commit: `44282bc feat(captura): conecta captura rápida y bandeja real`.
- 2026-10-22 — Evidencia: `npm install` correcto (696 paquetes auditados; 24 vulnerabilidades informadas por npm), `npm run typecheck` correcto, `npm run lint` correcto, `npm test -- --run` correcto (2 archivos, 6 pruebas), `npx expo-doctor` correcto (21/21 comprobaciones). No se ejecutó runtime nativo Android en este entorno.
