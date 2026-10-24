# Clarunio — Mejora visual y motion

## Objetivo

Dar vida a la interfaz existente sin inventar negocio: mejorar jerarquía, tarjetas, iconografía, feedback y transiciones breves, manteniendo la estética lavanda/violeta y el respeto por reducción de movimiento.

## Specs

- **S1** — Existe un sistema pequeño de motion con duraciones, easings y feedback coherentes.
- **S2** — Captura, aclaración, completar, revisión, navegación y estados de carga tienen transiciones útiles y breves.
- **S3** — Las animaciones respetan la preferencia de movimiento reducido del sistema.
- **S4** — Las tarjetas y estados principales tienen jerarquía visual, iconografía y variantes sin cambiar reglas GTD.
- **S5** — La mejora no agrega cuentas, prioridades, estadísticas, porcentajes, IA ni funciones fuera de alcance.
- **S6** — El logo final se integra solo cuando el propietario entregue un asset válido.

## Tasks

- [x] T1 — Crear tokens de motion y componentes de feedback reutilizables.
- [x] T2 — Mejorar tarjetas, empty states, acciones principales e iconografía existente.
- [x] T3 — Aplicar transiciones a captura, aclaración, Ahora, revisión y feedback.
- [x] T4 — Revisar dark mode, accesibilidad y reducción de movimiento.
- [x] T5 — Ejecutar verificaciones y crear commits locales en español.
- [ ] T6 — Validar visualmente en Android y registrar hallazgos de beta.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test -- --run`
- `npx expo-doctor`
- Validación manual Android con movimiento reducido activado y desactivado.

## Alcance autorizado

- Autorizado por el propietario después de una auditoría visual crítica.
- Se usará React Native Reanimated ya alineado con Expo SDK 57.
- Commits locales por unidad, con mensajes convencionales en español.
- Comentarios naturales en español y sin referencias a IA.
- No integrar el logo hasta que el propietario entregue el archivo final.

## Decisiones

- Se eligieron tokens pequeños (`quick`, `standard`, `emphasis`) y `useReducedMotion` de Reanimated 4 para que el movimiento se omita completamente cuando el sistema lo solicita.
- Las primitivas `Card`, `ActionButton`, `ChoiceCard` y `Motion` reducen repetición sin mover reglas GTD fuera de repositorios.
- Se usaron Ionicons y colores provenientes del tema para conservar legibilidad en modo oscuro; no se añadieron porcentajes, categorías ni estados nuevos.
- La validación Android queda pendiente: el entorno disponible no reemplaza la prueba del APK solicitada al propietario.

## Evidencia

- `npm run typecheck` — ejecutado sin errores.
- `npm run lint` — ejecutado sin errores.
- `npm test -- --run` — 11 archivos, 33 pruebas aprobadas.
- `npx expo-doctor` — 19/21 comprobaciones aprobadas; 2 advertencias/fallos preexistentes y fuera de alcance: carpetas nativas junto con configuración de prebuild, y `expo-notifications` 57.0.23 frente a `~57.0.24`.
- `npm test -- --run tests/ui-motion.test.ts` — 1 archivo, 2 pruebas aprobadas.
- La prueba de movimiento importa únicamente tokens puros para evitar inicializar Reanimated en Vitest.

## Commits

- `e621ab8` — `feat(ui): crea sistema visual y motion accesible`
- `9e3bcf4` — `feat(ui): mejora Ahora bandeja y proyectos`
- `d06c5cf` — `feat(ui): mejora captura y aclaracion`
- `726f418` — `feat(ui): unifica feedback y estados restantes`
- `7890093` — `test(ui): cubre contratos visuales y movimiento`

## Log

- 2026-10-23 — Se autorizó una iteración visual y de motion para corregir la sensación de interfaz plana, sin cambiar el dominio del producto.
- 2026-10-24 — Se implementaron las cinco unidades locales de UI, motion, pantallas restantes y contratos puros de movimiento. La comprobación visual Android continúa bajo responsabilidad del propietario.
