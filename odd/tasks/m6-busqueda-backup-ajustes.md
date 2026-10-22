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

- [ ] T1 — Crear repositorios/consultas de búsqueda local y pantalla Buscar.
- [ ] T2 — Implementar contrato de exportación JSON completo y selector del sistema.
- [ ] T3 — Implementar importación con validación integral, vista previa y reemplazo transaccional con rollback.
- [ ] T4 — Crear ajustes persistentes de tema, ayudas y preferencias de revisión.
- [ ] T5 — Añadir notificaciones locales opt-in para recordatorios explícitos, sin texto sensible por defecto.
- [ ] T6 — Conectar completadas/papelera y borrado total seguro.
- [ ] T7 — Añadir pruebas de backup, rollback, búsqueda, preferencias y permiso denegado.
- [ ] T8 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

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
