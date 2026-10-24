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

- [ ] T1 — Crear tokens de motion y componentes de feedback reutilizables.
- [ ] T2 — Mejorar tarjetas, empty states, acciones principales e iconografía existente.
- [ ] T3 — Aplicar transiciones a captura, aclaración, Ahora, revisión y feedback.
- [ ] T4 — Revisar dark mode, accesibilidad y reducción de movimiento.
- [ ] T5 — Ejecutar verificaciones y crear commits locales en español.
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

## Log

- 2026-10-23 — Se autorizó una iteración visual y de motion para corregir la sensación de interfaz plana, sin cambiar el dominio del producto.
