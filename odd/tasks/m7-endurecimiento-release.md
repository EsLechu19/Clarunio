# Clarunio M7 — Endurecimiento y release

## Objetivo

Preparar la aplicación para pruebas de campo con cobertura funcional, accesibilidad, estados de error, rendimiento medible y documentación honesta de release, sin publicar ni introducir cuenta o backend.

## Specs

- **S1** — Los recorridos críticos tienen pruebas automatizadas y una matriz explícita de validación Android.
- **S2** — Las pantallas MVP tratan estados vacío, carga, error recuperable, texto largo, teclado y permiso denegado cuando aplican.
- **S3** — Los controles esenciales tienen etiquetas accesibles, áreas táctiles adecuadas y no dependen solo del color.
- **S4** — Existe una medición reproducible de búsqueda/listado con datos semilla de prueba, sin presentar esos datos como reales.
- **S5** — CI ejecuta typecheck, lint y pruebas; la documentación refleja límites reales y riesgos abiertos.
- **S6** — La checklist de release no afirma cifrado, sincronización, IA ni disponibilidad de artefactos no generados.
- **S7** — La app conserva privacidad local y permisos mínimos; no se añaden servicios remotos.

## Tasks

- [x] T1 — Auditar estados y accesibilidad de pantallas críticas; corregir bloqueadores comprobables.
- [x] T2 — Añadir pruebas de componentes/contratos y fixtures de rendimiento sin datos de usuario.
- [x] T3 — Reforzar CI y comandos reproducibles de validación.
- [x] T4 — Crear `docs/TEST_PLAN.md` con resultados reales y pendientes Android.
- [x] T5 — Crear `docs/USER_GUIDE.md` y `docs/RELEASE_CHECKLIST.md` honestos.
- [x] T6 — Revisar README, límites de privacidad y build nativo sin publicar ni firmar producción.
- [x] T7 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`
- Validación Android manual cuando exista dispositivo/emulador disponible.

## Alcance autorizado

- Continuación autorizada por el propietario mediante «prosigue» después de M6.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No publicar, subir, firmar producción, abrir Play Console ni crear servicios remotos.

## Log

- 2026-10-22 — M7 autorizado mediante «prosigue». Se creó la rama `feature/m7-endurecimiento-release` y este documento.
- 2026-10-22 — Accesibilidad, safe areas, teclado, scroll, estados de carga/error y semántica de progreso: `8e85a25`, `cfa5a42`.
- 2026-10-22 — Borrado transaccional de datos y preferencias, con regresiones de cancelación: `47d5db2`.
- 2026-10-22 — Fixture determinista de 5.000 elementos y medición orientativa: `7f26c79`.
- 2026-10-22 — Validación local: `npm install` pasó con 24 vulnerabilidades; typecheck, lint y 31 tests pasaron. `npx expo-doctor`: 20/21 checks passed; queda advertencia de configuración nativa/prebuild.
- 2026-10-22 — Pendiente: validación Android real de runtime, selector/compartir de archivos, notificaciones y accesibilidad; no se afirma E2E ni rendimiento de dispositivo.
- 2026-10-22 — Comprobación independiente: `npm test -- --run` pasó con 10 archivos y 31 pruebas; el fixture de 5.000 elementos registró 3.73 ms de búsqueda local, medición orientativa fuera de dispositivo.
- 2026-10-22 — Los cambios nativos locales (`android/`, `app.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `expo-env.d.ts`) se conservaron sin incluirlos en commits funcionales.
