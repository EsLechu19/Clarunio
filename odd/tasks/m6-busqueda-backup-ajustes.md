# Clarunio M6 — Búsqueda, backups y ajustes

## Objetivo

Permitir encontrar información local, protegerla mediante exportación/importación validada y configurar la experiencia básica sin introducir cuenta, servidor ni sincronización.

## Specs

- **S1** — La búsqueda local encuentra títulos y notas de items, resultados de proyectos y referencias, agrupados sin transmitir contenido.
- **S2** — La exportación genera un JSON versionado con datos restaurables y fecha real, sin credenciales ni tokens.
- **S3** — La importación valida formato, versión, entidades y referencias antes de reemplazar datos; cualquier fallo conserva intactos los datos actuales.
- **S4** — Ajustes persiste tema `system/light/dark`, ayudas contextuales y preferencias de revisión/notificaciones.
- **S5** — Las notificaciones son opt-in, solicitan permiso solo al activar recordatorios y mantienen la app funcional si el permiso es denegado.
- **S6** — Papelera, completadas y purga requieren acciones explícitas y confirmación apropiada.
- **S7** — Borrar todos los datos exige doble confirmación y deja la base consistente si se cancela.

## Tasks

- [x] T1 — Crear repositorios/consultas de búsqueda local y pantalla Buscar.
- [x] T2 — Implementar contrato de exportación JSON completo y selector del sistema.
- [x] T3 — Implementar importación con validación integral, vista previa y reemplazo transaccional con rollback.
- [x] T4 — Crear ajustes persistentes de tema, ayudas y preferencias de revisión.
- [x] T5 — Añadir notificaciones locales opt-in para recordatorios explícitos, sin texto sensible por defecto.
- [x] T6 — Conectar completadas/papelera y borrado total seguro.
- [x] T7 — Añadir pruebas de backup, rollback, búsqueda, preferencias y permiso denegado.
- [x] T8 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario mediante «prosigue» después de M5.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No implementar M7: E2E completo, rendimiento, endurecimiento final ni publicación.

## Log

- 2026-10-22 — M6 autorizado mediante «prosigue». Se creó la rama `feature/m6-busqueda-backup-ajustes` y este documento.
- 2026-10-22 — Decisión: el respaldo usa reemplazo total validado antes de abrir la transacción; los ajustes seguros se guardan como un único registro versionado en `settings`.
- 2026-10-22 — Decisión: las búsquedas usan `LIKE` parametrizado con escape de comodines y nunca transmiten contenido.
- 2026-10-22 — Evidencia: `npm install` terminó correctamente (24 vulnerabilidades reportadas por npm audit; no se ejecutó `npm audit fix`).
- 2026-10-22 — Evidencia: `npm run typecheck` ✅; `npm run lint` ✅; `npm test -- --run` ✅ (8 archivos, 27 tests); `npx expo-doctor` ⚠️ 20/21, falla por configuración nativa preexistente con campos de `app.json` no sincronizados automáticamente.
- 2026-10-22 — Evidencia de commits: `236e842`, `55aafd6`, `2e5a919`, `58a3f76`, `871bc21`, `55b29c2`, `8670c3b`.
- 2026-10-22 — Riesgo residual: no se afirma ejecución nativa real de selector, compartir o notificaciones; queda pendiente en dispositivo/emulador Android.
- 2026-10-22 — Comprobación independiente: `npm test -- --run` pasó con 8 archivos y 27 pruebas. Los cambios nativos locales (`android/`, `app.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `expo-env.d.ts`) se conservaron sin incluirlos en commits funcionales.
