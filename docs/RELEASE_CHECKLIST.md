# Checklist de release — Clarunio M7

## Comprobaciones reproducibles

- [ ] Ejecutar `npm install` y registrar el resultado.
- [ ] Ejecutar `npm run typecheck`.
- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npm test -- --run`.
- [ ] Ejecutar `npx expo-doctor` y adjuntar su salida completa, incluyendo advertencias.
- [ ] Revisar el workflow `.github/workflows/ci.yml`.
- [ ] Ejecutar el fixture local de 5.000 elementos y conservar su salida como medición orientativa, no como promesa de rendimiento.

## Matriz Android pendiente

- [ ] Arranque offline en Android.
- [ ] Captura con teclado visible y área segura.
- [ ] Texto largo y desplazamiento en captura, detalle, bandeja y proyectos.
- [ ] Lector de pantalla, etiquetas, foco y escalado de fuente.
- [ ] Tema claro y oscuro con contraste legible.
- [ ] Selector de archivos: exportación, importación válida y rollback inválido.
- [ ] Compartir un respaldo JSON.
- [ ] Permiso concedido y denegado para notificaciones.
- [ ] Borrado total confirmado y cancelado.

## Límites que deben permanecer explícitos

- No afirmar cifrado de SQLite.
- No afirmar sincronización, cuentas, backend o recuperación remota.
- No afirmar E2E Android ni artefacto publicado si no existe evidencia.
- No firmar producción, publicar ni abrir Play Console como parte de M7.
- Revisar las vulnerabilidades reportadas por `npm audit` antes de cualquier publicación.
