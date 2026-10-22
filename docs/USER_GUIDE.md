# Guía de usuario de Clarunio

## Alcance actual

Clarunio es una aplicación Android-first local-first para organizar capturas, acciones, proyectos, esperas y revisiones. No requiere cuenta ni conexión para sus flujos locales.

La versión actual no ofrece sincronización, backend, IA, cuentas ni cifrado de la base SQLite. Los datos permanecen en el dispositivo salvo que el usuario exporte o comparta un respaldo.

## Flujos principales

1. **Capturar:** abre `+`, escribe una idea y elige `Guardar en bandeja`.
2. **Aclarar:** abre una captura y elige acción, proyecto, espera, algún día, referencia o descarte.
3. **Ahora:** elige manualmente acciones para tu foco del día. Completar ofrece deshacer.
4. **Revisión:** recorre las etapas guardadas y puede pausarse o cancelarse.
5. **Ajustes:** configura tema, ayudas y recordatorios locales; exporta o importa un respaldo JSON.

## Datos y operaciones destructivas

Importar reemplaza el conjunto local después de validar el archivo. `Borrar todos mis datos` exige doble confirmación y elimina elementos, proyectos, enfoques, revisiones y preferencias en una sola transacción. Cancelar no modifica datos.

## Validación local

```bash
npm install
npm run typecheck
npm run lint
npm test -- --run
npx expo-doctor
```

Estos comandos no sustituyen la prueba en un Android real. El selector de archivos, compartir, notificaciones y áreas seguras requieren validación manual en dispositivo o emulador.
