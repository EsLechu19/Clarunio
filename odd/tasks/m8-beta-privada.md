# Clarunio M8 — Beta privada

## Objetivo

Usar el APK generado por EAS en un periodo personal de 14 días para observar fricciones reales, verificar persistencia y registrar correcciones sin confundir una prueba individual con validación de mercado.

## Specs

- **S1** — Existe un checklist reproducible de instalación y recorridos críticos Android.
- **S2** — El periodo de prueba registra durante 14 días capturas, revisiones, respaldos, errores y fricciones observadas.
- **S3** — Cada hallazgo conserva fecha, recorrido, comportamiento esperado, comportamiento observado, severidad y estado.
- **S4** — Las correcciones posteriores se autorizan y se registran como cambios separados, sin reescribir evidencia histórica.
- **S5** — La beta no activa cuentas, sincronización, analítica remota ni publicación pública.
- **S6** — El cierre de beta incluye decisión explícita: corregir y repetir, ampliar prueba cerrada o preparar M9.

## Tasks

- [x] T1 — Documentar instalación del APK y matriz de recorridos Android.
- [x] T2 — Registrar la validación inicial reportada por el propietario.
- [ ] T3 — Mantener bitácora diaria de uso real durante 14 días.
- [ ] T4 — Registrar y priorizar fricciones, errores y regresiones.
- [ ] T5 — Practicar exportación/restauración en instalación de prueba.
- [ ] T6 — Cerrar beta con métricas observadas, riesgos y decisión siguiente.

## Verificación

- Evidencia documental T1: `docs/BETA_CHECKLIST.md`, commit `faac265` (`docs(m8): agrega checklist de beta privada`).
- Evidencia documental T2: `docs/FEEDBACK_LOG.md`, observación `OBS-001`, commit de registro: este commit.
- El propietario informó instalación del APK desde EAS y funcionamiento de los recorridos M0–M7; no se inventan modelo, build ni resultados no adjuntados.
- Persistencia, exportación/importación, permisos y accesibilidad permanecen pendientes de ejecución y registro durante la beta.
- Bitácora de 14 días completada antes de declarar beta cerrada.

## Alcance autorizado

- Continuación autorizada por el propietario mediante «prosigue» después de M7.
- La beta es privada y personal; no implica publicación ni adquisición de usuarios.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios y documentos de producto en español natural.

## Log

- 2026-10-22 — M8 autorizado. El propietario informó que instaló el APK y que los recorridos funcionan; se creó la rama `feature/m8-beta-privada`.
- 2026-10-22 — T1 documentado en `docs/BETA_CHECKLIST.md` (commit `faac265`). T2 registrado como observación limitada `OBS-001` en `docs/FEEDBACK_LOG.md`; no equivale a completar la beta ni la cadencia de 14 días.
