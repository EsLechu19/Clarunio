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

- [ ] T1 — Crear migración de `review_sessions` y repositorio de sesiones reanudables.
- [ ] T2 — Implementar casos de uso para avanzar, pausar, cancelar y completar etapas sin mutar elementos por lectura.
- [ ] T3 — Crear pantalla Revisar con progreso por etapas, resumen y reanudación.
- [ ] T4 — Crear pantalla Volver a organizarme con contadores reales y procesamiento explícito.
- [ ] T5 — Conectar accesos desde Ahora y probar cierres/reinicios lógicos.
- [ ] T6 — Añadir pruebas de persistencia, reanudación, cancelación y no mutación implícita.
- [ ] T7 — Ejecutar verificaciones, actualizar evidencia y crear commits locales en español.

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

## Log

- 2026-10-22 — M5 autorizado mediante «prosigue». Se creó la rama `feature/m5-revision-recuperacion` y este documento.
