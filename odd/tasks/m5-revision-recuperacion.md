# Clarunio M5 — Revisión y recuperación

## Objetivo

Ofrecer una revisión semanal guiada y reanudable, junto con una recuperación voluntaria que ayude a volver al control sin castigo, borrados automáticos ni cambios silenciosos.

## Specs

- **S1** — Una sesión de revisión persiste su tipo, estado y etapa actual en SQLite.
- **S2** — La revisión recorre Bandeja, Siguientes, Esperando, Proyectos, Programadas/Algún día y Cierre; cerrar la app permite continuar en la etapa guardada.
- **S3** — Ver o revisar elementos no cambia estados por sí mismo; cada mutación requiere una decisión explícita.
- **S4** — El cierre muestra un resumen real, permite terminar con asuntos abiertos y no bloquea artificialmente.
- **S5** — Recuperación muestra contadores reales, permite procesar capturas una a una y elegir foco sin borrados ni aplazamientos masivos.
- **S6** — La recuperación es descartable y no obliga a procesar todo el sistema.
- **S7** — La interfaz mantiene estados vacío, cargando, error y reanudación, con lenguaje amable y accesible.

## Tasks

- [x] T1 — Crear migración de `review_sessions` y repositorio de sesiones reanudables.
- [x] T2 — Implementar casos de uso para avanzar, pausar, cancelar y completar etapas sin mutar elementos por lectura.
- [x] T3 — Crear pantalla Revisar con progreso por etapas, resumen y reanudación.
- [x] T4 — Crear pantalla Volver a organizarme con contadores reales y procesamiento explícito.
- [x] T5 — Conectar accesos desde Ahora y probar cierres/reinicios lógicos.
- [x] T6 — Añadir pruebas de persistencia, reanudación, cancelación y no mutación implícita.
- [x] T7 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

## Verificación

- `npm install`
- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`

## Alcance autorizado

- Continuación autorizada por el propietario mediante «prosigue» después de M4.
- Expo SDK 57 obligatorio.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios solo cuando aporten contexto y escritos en español natural.
- No implementar M6: búsqueda, backups, ajustes completos ni notificaciones.

## Decisiones y evidencia

- La migración v4 agrega `review_sessions` con restricciones explícitas para tipo, estado y etapa; las actualizaciones de etapa y finalización se ejecutan dentro de una transacción SQLite.
- La lectura de revisión usa consultas SELECT independientes: no llama a `activateScheduledItems`, `listNextActionsAvailableNow` ni `listFocusedNextActions`.
- Ahora solo consulta sesiones en curso; iniciar una revisión ocurre al entrar en su acción explícita, evitando sesiones o aprobaciones ficticias.
- Recuperación abre una aclaración existente, permite omitirla y solo añade foco después de una selección explícita. No realiza mutaciones masivas.
- Evidencia automatizada: `npm test -- --run` → 6 archivos, 22 pruebas aprobadas; incluye migración, reanudación, cancelación y ausencia de escrituras durante lecturas.
- Commits de la unidad: `12347d9`, `ae54fe8`, `f8e86d6`, `f16f427`, `9a11a58`.

## Log

- 2026-10-22 — M5 autorizado mediante «prosigue». Se creó la rama `feature/m5-revision-recuperacion` y este documento.
- 2026-10-22 — Implementación M5 validada con typecheck, lint y pruebas; `npx expo-doctor` mantiene una advertencia preexistente de configuración CNG/native folders y no se modificó `android/`.
