# Clarunio — Notas de versión de beta privada M8

## Estado

Esta versión corresponde a una **beta privada y personal** de M8 para observar el uso real durante 14 días. No es M9, no es una publicación pública y no implica que la beta ya esté completa.

## Alcance actual

- Aplicación Android local-first, en español y sin cuenta obligatoria.
- Captura rápida en Bandeja y aclaración guiada.
- Siguientes acciones, proyectos, Esperando, Programadas, Algún día y Referencias.
- Enfoque en Ahora con fechas diferenciadas para disponibilidad, vencimiento, seguimiento y foco.
- Revisión semanal reanudable y recuperación «Volver a organizarme».
- Búsqueda local.
- Exportación e importación de respaldos JSON con validación, reemplazo total explícito y rollback ante error.
- Preferencias locales, ayudas contextuales, tema y notificaciones opcionales con permiso del sistema.
- Accesibilidad, persistencia tras reinicio y estados de error como recorridos de observación de M8.

## Límites conocidos y no incluidos

- No hay cuentas, inicio de sesión, sincronización ni colaboración.
- No hay backend, API remota, analítica remota ni servicios en la nube.
- No hay IA, voz, adjuntos, integraciones, calendario ni suscripciones.
- El APK de la beta no constituye una publicación en Google Play ni una firma de producción.
- La prueba inicial reportada por el propietario es una observación limitada; no sustituye la matriz Android ni la cadencia completa de 14 días.
- La disponibilidad, estabilidad, accesibilidad, permisos y rollback deben registrarse con evidencia en `docs/BETA_CHECKLIST.md` y `docs/FEEDBACK_LOG.md`.

## Privacidad y datos

Los datos de Clarunio se guardan localmente en el dispositivo durante esta beta. SQLite es almacenamiento local; **no se afirma que esté cifrado**. No se afirma sincronización, backend, recuperación remota ni envío de datos a un servidor. Los respaldos JSON deben tratarse como archivos que pueden contener el contenido personal de la app y compartirse solo por decisión del propietario.

## Cómo iniciar la prueba privada

1. Obtener el APK autorizado desde EAS.
2. Registrar el enlace, Build ID, commit, versión, dispositivo y versión de Android en `docs/BETA_CHECKLIST.md`.
3. Instalarlo en el dispositivo de prueba identificado.
4. Ejecutar los recorridos del checklist, empezando por instalación, offline y captura.
5. Registrar cada observación en `docs/FEEDBACK_LOG.md`, incluyendo los campos desconocidos como `pendiente`.
6. Mantener la cadencia diaria durante 14 días; registrar también los días sin hallazgos.
7. Antes de importar, crear un respaldo y probar el rollback con un archivo inválido o incompatible.
8. No publicar, enviar a Play, abrir una prueba pública ni agregar servicios remotos como parte de M8.

## Cierre de M8

La beta solo puede cerrarse después de registrar los 14 días, priorizar hallazgos y tomar una decisión explícita: corregir y repetir, ampliar la prueba cerrada o preparar M9. Hasta entonces, el estado correcto es **beta privada en curso**.
