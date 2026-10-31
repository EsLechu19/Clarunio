# Clarunio

Clarunio es una aplicación Android-first de productividad personal basada en GTD. Ayuda a capturar ideas, aclararlas y convertirlas en acciones concretas sin cuentas, conexión permanente ni configuración compleja.

El proyecto demuestra una implementación local-first con React Native, Expo SDK 57, TypeScript y SQLite. Incluye captura, Bandeja, aclaración guiada, siguientes acciones, proyectos, esperas, revisión semanal, recuperación, búsqueda y respaldos JSON.

## Qué problema resuelve

Las ideas, compromisos y pendientes suelen quedar repartidos entre notas, chats y memoria. Clarunio propone un flujo simple:

```text
Capturar → Aclarar → Organizar → Revisar → Enfocar
```

La captura no obliga a clasificar. Primero guarda el pensamiento en Bandeja; después el usuario decide si es una siguiente acción, un proyecto, algo que está esperando, una referencia, algo para algún día o algo que debe descartar.

## Funcionalidades principales

- Captura rápida de texto directamente en Bandeja.
- Aclaración GTD determinista, sin IA ni servicios externos.
- Proyectos con resultado deseado y siguiente acción.
- Lista operativa de acciones en espera.
- Foco diario reversible y acciones completables con deshacer.
- Revisión semanal con decisiones persistentes, progreso y reanudación.
- Flujo de recuperación para volver a organizar el sistema.
- Búsqueda local de acciones y proyectos con debounce y consultas parametrizadas.
- Exportación e importación de respaldos JSON con validación y reemplazo transaccional.
- Tema claro, oscuro y del sistema.
- Estados vacíos, errores recuperables, reduced motion y accesibilidad inicial.
- Mascota visual de Clarunio integrada en estados de bienvenida, revisión, recuperación y estados vacíos.

## Decisiones técnicas

| Área | Decisión |
| --- | --- |
| Plataforma | Android-first con Expo Router |
| Lenguaje | TypeScript con comprobación estricta |
| Persistencia | SQLite como fuente de verdad local |
| Arquitectura | Dominio, repositorios de datos y composición UI separados |
| Motion | React Native Reanimated, con respeto por reduced motion |
| Pruebas | Vitest para contratos de dominio, presentación y repositorios |
| Privacidad | Sin cuentas, backend, sincronización, IA ni analítica remota |
| Respaldo | JSON local validado, sin transmisión automática |

## Arquitectura resumida

```text
app/                         Pantallas y rutas Expo Router
src/features/*/domain        Entidades, estados y reglas GTD
src/features/*/data          Repositorios SQLite y persistencia
src/shared                   Tema, componentes, navegación y motion
tests                        Contratos y pruebas de comportamiento
docs                         Especificación, plan de pruebas y release
odd/tasks                    Evidencia y unidades de trabajo
```

La UI no ejecuta SQL ni contiene las reglas principales de clasificación. Las operaciones críticas de creación de proyectos, completado, borrado e importación usan transacciones en los repositorios.

## Estado actual

Checks automatizados actuales:

- `npm run typecheck` — aprobado.
- `npm run lint` — aprobado.
- `npm test -- --run` — 20 archivos y 68 pruebas aprobadas.
- Exportación Android — aprobada.

La validación física de Android todavía debe cubrir lector de pantalla, fuentes grandes, teclado, safe areas, dark mode, reduced motion, selector de archivos, compartir y notificaciones.

## Instalación y desarrollo

### Requisitos

- Node.js compatible con Expo SDK 57.
- npm.
- Android Studio, emulador o dispositivo Android para validar el runtime.

### Comandos

```bash
npm install
npm start
npm run android
npm run typecheck
npm run lint
npm test -- --run
npx expo-doctor
```

Para abrir el destino Android desde Expo, ejecutá `npm start` y presioná `a`.

Si Metro conserva un bundle antiguo después de cambiar rutas o assets:

```bash
npx expo start -c
```

## Límites explícitos

- SQLite es almacenamiento local; no equivale a cifrado.
- No hay cuentas, sincronización, backend ni recuperación remota.
- Las notificaciones requieren un development build o APK compatible; Expo Go Android puede no incluir el módulo nativo.
- La exportación y el compartir dependen de APIs nativas del dispositivo.
- No se afirma soporte de producción ni publicación en Google Play sin completar la matriz Android.

## Documentación

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) — intención de producto y alcance GTD.
- [`docs/USER_GUIDE.md`](docs/USER_GUIDE.md) — flujos principales para usuarios.
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — checks reproducibles y límites de evidencia.
- [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) — validación pendiente para Android.
- [`docs/BETA_CHECKLIST.md`](docs/BETA_CHECKLIST.md) — matriz de beta privada.
- [`odd/tasks/ux-motion-clarunio.md`](odd/tasks/ux-motion-clarunio.md) — decisiones y unidades de trabajo de UI/motion.

## Próximos pasos

1. Completar la validación Android real.
2. Mejorar los flujos de seguimiento de esperas y recordatorios explícitos.
3. Fortalecer pruebas de integración contra SQLite real.
4. Evaluar virtualización para listas grandes.

El objetivo es priorizar una experiencia offline, comprensible y confiable antes que agregar servicios o funcionalidades llamativas.
