# Clarunio — Checklist de beta privada M8

Este checklist documenta la instalación y la observación de la beta privada de M8. No sustituye la evidencia de ejecución: cada casilla debe acompañarse de fecha, build, dispositivo y una referencia a la evidencia disponible.

## Identidad de la prueba

- Fecha de inicio: `2026-10-23`
- Fecha prevista de cierre (14 días): `2026-11-05`
- Fecha real de cierre: `____-__-__`
- APK / enlace de EAS: `https://expo.dev/accounts/esau_01/projects/clarunio/builds/37a27928-320c-4cb4-890c-f1cffc8a784b`
- Build ID de EAS: `37a27928-320c-4cb4-890c-f1cffc8a784b`
- Commit de origen: `________________________________________`
- Perfil EAS: `preview` — APK instalable de beta privada
- Versión visible de la app: `0.1.0`
- Dispositivo / modelo: `moto g54 5G`
- Versión de Android: `13`
- API level: `33` — derivado de Android 13
- Zona horaria: `GMT-5`
- Responsable: `pendiente`
- Evidencia general (capturas, exportaciones o notas): `________________________________________`

Estado actual: el propietario informó que instaló el APK y que los recorridos previstos funcionan. La matriz detallada y la cadencia de 14 días todavía deben completarse con los datos del dispositivo y del build.

## 1. Instalación y arranque

- [ ] Descargar el APK desde el artefacto autorizado de EAS.
- [ ] Registrar el enlace, Build ID, commit y checksum si está disponible.
- [ ] Instalar el APK en el dispositivo identificado arriba.
- [ ] Abrir la aplicación sin cuenta ni conexión de red.
- [ ] Confirmar que la pantalla inicial no presenta datos de prueba inventados.
- [ ] Confirmar que una reinstalación no se presenta como recuperación de datos anterior.

Evidencia / fecha / resultado: `____________________________________________________________`

## 2. Offline y captura

- [ ] Activar modo avión o retirar la conexión antes de probar.
- [ ] Abrir captura desde `Ahora`.
- [ ] Confirmar teclado visible, foco inicial y área segura.
- [ ] Guardar una frase libre en Bandeja sin fecha, proyecto, prioridad ni cuenta.
- [ ] Confirmar mensaje de guardado y contador actualizado.
- [ ] Intentar texto vacío o solo espacios y confirmar validación comprensible.
- [ ] Confirmar que la captura no ofrece voz, adjuntos ni decisiones GTD prematuras.

Evidencia / fecha / resultado: `____________________________________________________________`

## 3. Aclaración

- [ ] Abrir una entrada de Bandeja.
- [ ] Recorrer la pregunta «¿Esto requiere alguna acción?».
- [ ] Probar destino de siguiente acción con texto concreto.
- [ ] Probar proyecto con resultado deseado y siguiente acción vinculada.
- [ ] Probar Esperando con persona o resultado esperado.
- [ ] Probar Algún día, Referencia y Descartar cuando corresponda.
- [ ] Cancelar antes de confirmar y confirmar que no quedan cambios parciales.
- [ ] Confirmar la organización y verificar que la entrada sale de Bandeja.

Evidencia / fecha / resultado: `____________________________________________________________`

## 4. Proyectos y Esperando

- [ ] Crear o clasificar un proyecto con resultado deseado.
- [ ] Confirmar que aparece una siguiente acción o una espera/bloqueo honesto.
- [ ] Confirmar que no se muestra porcentaje de avance inventado.
- [ ] Registrar `waiting_for` y, si aplica, `follow_up_at`.
- [ ] Confirmar que una fecha de seguimiento no completa automáticamente la espera.
- [ ] Convertir una espera en siguiente acción o completarla mediante decisión explícita.

Evidencia / fecha / resultado: `____________________________________________________________`

## 5. Enfoque y fechas

- [ ] Añadir una acción `NEXT` al enfoque de la fecha local.
- [ ] Quitarla del enfoque y confirmar que permanece en Siguientes.
- [ ] Verificar que `focus_date`, `available_from`, `due_at` y `follow_up_at` no se mezclan.
- [ ] Activar una acción programada cuya `available_from` ya llegó.
- [ ] Reiniciar y confirmar que la activación es idempotente y no duplica elementos.
- [ ] Confirmar que una fecha límite no crea por sí sola una notificación.

Evidencia / fecha / resultado: `____________________________________________________________`

## 6. Revisión y recuperación

- [ ] Iniciar revisión semanal.
- [ ] Avanzar por Bandeja, Siguientes, Esperando, Proyectos y Programadas/Algún día.
- [ ] Cerrar la aplicación durante la revisión.
- [ ] Reabrir y confirmar que se puede continuar desde la etapa guardada.
- [ ] Confirmar que revisar no cambia estados automáticamente.
- [ ] Iniciar «Volver a organizarme».
- [ ] Confirmar que muestra números reales y no borra, completa ni reprograma masivamente.
- [ ] Elegir acciones de enfoque y terminar o cancelar de forma explícita.

Evidencia / fecha / resultado: `____________________________________________________________`

## 7. Búsqueda

- [ ] Buscar por texto una acción, un proyecto y una referencia.
- [ ] Confirmar resultados agrupados y legibles.
- [ ] Probar búsqueda sin resultados.
- [ ] Probar texto largo, mayúsculas/minúsculas y caracteres habituales.
- [ ] Confirmar que la búsqueda funciona sin conexión.

Evidencia / fecha / resultado: `____________________________________________________________`

## 8. Respaldo, importación y rollback

- [ ] Exportar un respaldo JSON completo desde Ajustes/Datos.
- [ ] Registrar `format`, `schemaVersion` y `exportedAt` del archivo.
- [ ] Confirmar que no se exportan credenciales ni tokens.
- [ ] Importar un respaldo válido y confirmar la vista previa y la advertencia de reemplazo total.
- [ ] Generar un respaldo antes de reemplazar los datos actuales.
- [ ] Intentar importar un JSON inválido, incompatible o con referencias corruptas.
- [ ] Confirmar error explícito y rollback completo: los datos anteriores permanecen íntegros.
- [ ] Confirmar que la operación funciona offline, salvo el selector/compartir del sistema.

Evidencia / fecha / resultado: `____________________________________________________________`

## 9. Ajustes, notificaciones y privacidad

- [ ] Cambiar tema claro, oscuro y sistema; comprobar legibilidad.
- [ ] Activar y desactivar ayudas contextuales.
- [ ] Solicitar permiso de notificaciones para un recordatorio explícito.
- [ ] Probar permiso concedido.
- [ ] Probar permiso denegado y confirmar que la app sigue siendo utilizable.
- [ ] Confirmar que no se presentan cuentas, sincronización, backend, analítica remota ni servicios de publicación.
- [ ] Confirmar que SQLite se describe como almacenamiento local, no como cifrado.

Evidencia / fecha / resultado: `____________________________________________________________`

## 10. Accesibilidad

- [ ] Revisar lector de pantalla y nombres de controles.
- [ ] Revisar foco y orden de navegación.
- [ ] Revisar escalado de fuente del sistema.
- [ ] Revisar controles táctiles y separación de acciones próximas.
- [ ] Revisar contraste en texto gris sobre lavanda, violeta sobre blanco y texto blanco sobre botón violeta.
- [ ] Confirmar que ningún estado depende solo del color, icono o barra de progreso.
- [ ] Revisar texto largo, desplazamiento, teclado y áreas seguras.
- [ ] Revisar reducción de movimiento si el sistema la solicita.

Evidencia / fecha / resultado: `____________________________________________________________`

## 11. Reinicio y persistencia

- [ ] Cerrar y reabrir después de una captura.
- [ ] Cerrar y reabrir después de aclarar una entrada.
- [ ] Cerrar y reabrir con proyecto, espera, enfoque y fechas registrados.
- [ ] Cerrar y reabrir durante una revisión iniciada.
- [ ] Confirmar que no hay pérdida reproducible ni duplicados.
- [ ] Registrar cualquier pérdida, inconsistencia o recuperación inesperada en `docs/FEEDBACK_LOG.md`.

Evidencia / fecha / resultado: `____________________________________________________________`

## 12. Cadencia de 14 días

Registrar una nota diaria, aunque no haya hallazgos. No declarar la beta completa antes de cerrar los 14 días.

| Día | Fecha | Uso / flujo observado | Fricción o hallazgo | Referencia |
|---:|---|---|---|---|
| 1 | `____-__-__` | `________________` | `________________` | `________________` |
| 2 | `____-__-__` | `________________` | `________________` | `________________` |
| 3 | `____-__-__` | `________________` | `________________` | `________________` |
| 4 | `____-__-__` | `________________` | `________________` | `________________` |
| 5 | `____-__-__` | `________________` | `________________` | `________________` |
| 6 | `____-__-__` | `________________` | `________________` | `________________` |
| 7 | `____-__-__` | `________________` | `________________` | `________________` |
| 8 | `____-__-__` | `________________` | `________________` | `________________` |
| 9 | `____-__-__` | `________________` | `________________` | `________________` |
| 10 | `____-__-__` | `________________` | `________________` | `________________` |
| 11 | `____-__-__` | `________________` | `________________` | `________________` |
| 12 | `____-__-__` | `________________` | `________________` | `________________` |
| 13 | `____-__-__` | `________________` | `________________` | `________________` |
| 14 | `____-__-__` | `________________` | `________________` | `________________` |

### Cierre pendiente de M8

- [ ] 14 días registrados.
- [ ] Hallazgos priorizados y correcciones separadas de la evidencia histórica.
- [ ] Decisión explícita: corregir y repetir / ampliar prueba cerrada / preparar M9.
- Fecha y decisión: `____________________________________________________________`
- Evidencia de cierre: `____________________________________________________________`
