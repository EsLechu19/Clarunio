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

- [ ] T1 — Auditar estados y accesibilidad de pantallas críticas; corregir bloqueadores comprobables.
- [ ] T2 — Añadir pruebas de componentes/contratos y fixtures de rendimiento sin datos de usuario.
- [ ] T3 — Reforzar CI y comandos reproducibles de validación.
- [ ] T4 — Crear `docs/TEST_PLAN.md` con resultados reales y pendientes Android.
- [ ] T5 — Crear `docs/USER_GUIDE.md` y `docs/RELEASE_CHECKLIST.md` honestos.
- [ ] T6 — Revisar README, límites de privacidad y build nativo sin publicar ni firmar producción.
- [ ] T7 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

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
