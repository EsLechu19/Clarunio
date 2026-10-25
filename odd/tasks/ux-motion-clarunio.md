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
- La nueva iteración autorizada integra el wordmark entregado en `img/Imagen de ChatGPT 24 oct 2026, 17_46_19-3.png`; mantiene fallback textual seguro si la imagen falla.

## Nueva decisión visual — 2026-10-24

- Se adopta como dirección principal la referencia del propietario: fondo lavanda casi blanco, superficies blancas, violeta intenso, títulos grandes y pesados, tarjetas redondeadas con sombra sutil, chips suaves, iconografía Ionicons y FAB circular violeta.
- `Ahora` prioriza saludo, «¿Qué sigue?», chips con datos reales, «Siguientes acciones» y una tarjeta de Bandeja distinguible. No se agregan porcentajes ni métricas inventadas.
- `Captura` mantiene el contrato de guardar directamente en `INBOX`, con input protagonista, CTA existente y ayuda visual separada.
- `Proyectos` usa filtros exclusivamente derivados de estados existentes (`Todos`, `Activos`, `Algún día`) y metadata honesta de siguiente acción/espera/bloqueo; no usa progreso calculado.

## Assets usados

- `img/Imagen de ChatGPT 24 oct 2026, 17_46_19-3.png` — wordmark oscuro horizontal en `BrandHeader`, con fallback `C`.
- El resto de variantes de `img/` queda disponible para futuras cabeceras o empty states, pero no se carga decorativamente en todas las pantallas.

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

- `6a253dc` — `feat(ui): aplica identidad visual Clarunio`
- `3208bb8` — `feat(ui): rediseña inicio y navegación`
- `e070542` — `feat(ui): rediseña captura aclaracion y proyectos`
- `bcc25f6` — `test(ui): verifica contratos del rediseño`

## Evidencia de esta iteración

- `npm run typecheck` — 0 errores.
- `npm run lint` — 0 errores.
- `npm test -- --run` — 11 archivos, 33 pruebas aprobadas.
- `npx expo-doctor` — 19/21 comprobaciones aprobadas; permanecen los 2 hallazgos fuera de alcance: carpetas nativas junto con configuración de prebuild, y `expo-notifications` 57.0.23 frente a `~57.0.24`.
- SHA-256 `img/Imagen de ChatGPT 24 oct 2026, 17_46_19-3.png`: `B2DE692072AF8CA7B14294C02BCA268B2A1BAC16E23FE513967D1B07459C856A`.

## Log

- 2026-10-23 — Se autorizó una iteración visual y de motion para corregir la sensación de interfaz plana, sin cambiar el dominio del producto.
- 2026-10-24 — Se implementaron las cinco unidades locales de UI, motion, pantallas restantes y contratos puros de movimiento. La comprobación visual Android continúa bajo responsabilidad del propietario.
- 2026-10-24 — Comprobación independiente: `npm test -- --run` pasó con 11 archivos y 33 pruebas. T6 queda pendiente hasta validar el APK con movimiento reducido activado y desactivado.
- 2026-10-24 — Se reemplazó el wordmark horizontal comprimido del encabezado por el isotipo cuadrado de `img/Imagen de ChatGPT 24 oct 2026, 17_46_18-1.png` junto al texto Clarunio, alineado con la referencia móvil.
- 2026-10-24 — Bug corregido: Expo Go Android fallaba al abrir Clarunio con `Cannot find native module 'ExpoTopicSubscriptionModule'` porque `notificationService.ts` importaba estáticamente `expo-notifications`. La solución detecta Expo Go con `expo-constants`, carga `expo-notifications` de forma dinámica solo cuando corresponde y captura fallos nativos; Ajustes informa que los recordatorios requieren un development build o APK compatible. Se agregaron pruebas unitarias de la política pura, sin inicializar módulos nativos.
- 2026-10-24 — Corrección visual estructural de `Ahora`: el saludo pasó al hero antes de «¿Qué sigue?», las acciones disponibles se deduplican contra el foco, las acciones usan filas compactas con iconos accesibles y los módulos de Bandeja/revisión dejaron un único CTA discreto. Se mantienen datos reales, fechas `dueAt`, repositorios, undo, errores, carga, dark mode y reduced motion.
- 2026-10-24 — Se rediseñó `Bandeja` como flujo de procesamiento GTD: hero orientado a acción, CTA `Capturar ahora`, resumen real, filas compactas de capturas con icono de bandeja, metadata relativa y acción explícita `Aclarar`, además de un estado vacío con CTA `Capturar algo`. Se mantiene navegación, carga, retry, dark mode, accesibilidad y reduced motion; `ItemList` no se eliminó porque no es necesario ampliar el alcance.

## Evidencia del rediseño de Proyectos

- **Decisión:** las tarjetas dejan de presentarse como CRUD estilizado y priorizan resultado deseado, estado semántico, cantidad real de acciones y metadata independiente de siguiente acción, espera y bloqueo. Archivados permanecen dentro de `Todos` porque el repositorio ya los excluye de la consulta normal y no se crea una promesa de filtro que la pantalla no pueda cumplir.
- **Patrones adaptados:** indicador de filtro con transición de layout, entrada/salida y reflow de tarjetas con Reanimated, iconos Ionicons por estado y affordance de chevron; no se agregaron CSS web, dependencias, progreso ni datos inventados.
- **Accesibilidad:** cada tarjeta completa abre el detalle existente, conserva la ruta `/project/[id]`, expone tabs con `selected`, conteos reales y respeta `useReducedMotion`.
- **Empty state:** explica que los proyectos nacen al aclarar una captura y enlaza a `/capture`; el estado de error conserva retry.
- **Tests:** `tests/project-presentation.test.ts` cubre conteos, filtros y prioridad honesta de metadata sin importar Reanimated.
- **Riesgos:** falta validación visual en Android pequeño y con lector de pantalla; la lista de proyectos sigue dependiendo del contrato actual del repositorio, sin cambios de SQLite.

## Evidencia de la mejora del flujo de captura

- **Archivos:** `src/shared/ui/CaptureFab.tsx`, `app/capture.tsx`, `src/shared/ui/Motion.tsx`.
- **Patrones adaptados:** `SlideInDown` para revelar la captura, `LinearTransition` para que el composer gane presencia al crecer el texto, estados `idle → saving → success` con iconos/indicador, y shake breve solo ante validación inválida. Son primitivas nativas de Reanimated; no se copiaron componentes ni CSS web de transitions.dev.
- **Contrato conservado:** el FAB sigue abriendo `/capture`, la captura persiste directamente en `INBOX`, se conserva el texto ante error, el CTA permanece asociado al campo, y la vuelta usa la ruta previa después de confirmar la persistencia.
- **Accesibilidad:** se eliminó la dependencia de `autoFocus`, se permite desplazar el contenido con teclado visible, se mantienen objetivos táctiles y etiquetas accesibles, y las animaciones se omiten con `useReducedMotion`.
- **Riesgos:** queda pendiente la validación visual en Android real con teclado y movimiento reducido; el retraso de éxito es únicamente el feedback breve posterior a una escritura ya confirmada.
- **Verificación:** `npm run typecheck` — 0 errores; `npm run lint` — 0 errores; `npm test -- --run` — 14 archivos, 39 pruebas aprobadas.
- **Commit:** `feat(ui): mejora flujo de captura` (hash registrado en Git al cerrar esta unidad).

## Evidencia del rediseño de Bandeja

- **Archivos:** `app/(tabs)/inbox.tsx`, `src/shared/ui/InboxItemRow.tsx`, `src/shared/ui/inboxPresentation.ts`, `src/shared/ui/EmptyState.tsx`, `tests/inbox-presentation.test.ts`.
- **Decisión:** la fecha relativa recibe `now` explícitamente para que la presentación sea pura y testeable con fecha fija; las filas siguen abriendo `/clarify/[id]` y conservan una acción visible independiente.
- **Verificación:** `npm run typecheck` — 0 errores; `npm run lint` — 0 errores; `npm test -- --run` — 14 archivos, 39 pruebas aprobadas.
- **Commit:** commit único `feat(ui): rediseña Bandeja para procesar capturas`.

## Evidencia de la corrección de Ahora

- `npm run typecheck` — 0 errores.
- `npm run lint` — 0 errores.
- `npm test -- --run` — 13 archivos, 37 pruebas aprobadas; incluye el contrato de deduplicación de acciones enfocadas.

## Evidencia del bug de Expo Go

- `npm run typecheck` — 0 errores.
- `npm run lint` — 0 errores.
- `npm test -- --run` — 12 archivos, 36 pruebas aprobadas.
- El contrato GTD y el almacenamiento de settings no fueron modificados; no se tocaron `app.json`, `eas.json`, `package.json`, Android, SQLite ni rutas.
