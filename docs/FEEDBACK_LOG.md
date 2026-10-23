# Clarunio — Bitácora de feedback de beta privada M8

Esta bitácora conserva observaciones de la prueba personal de 14 días. Cada entrada debe describir lo observado sin convertir una impresión individual en validación de mercado. La evidencia histórica no se reescribe: una corrección posterior se registra con otra entrada y su commit.

## Estados y severidad

- **Severidad:** `bloqueante`, `alta`, `media`, `baja`, `observación`.
- **Reproducibilidad:** `siempre`, `frecuente`, `ocasional`, `no reproducido`, `pendiente`.
- **Estado:** `abierto`, `en investigación`, `corregido`, `verificado`, `descartado`, `pendiente de beta`.

## Plantilla de observación

Copiar este bloque una vez por observación. Completar los valores desconocidos como `pendiente`; no inventar modelo de dispositivo, build ni resultado.

### OBS-____ — [título breve]

- **Fecha:** `____-__-__`
- **Build / EAS Build ID:** `________________`
- **Commit de origen:** `________________`
- **Dispositivo / modelo:** `________________`
- **Versión de Android / API:** `________________`
- **Flujo:** `captura | aclaración | proyectos | esperando | enfoque/fechas | revisión | recuperación | búsqueda | respaldo/importación | ajustes | notificaciones | accesibilidad | reinicio/persistencia | otro`
- **Pasos o contexto:** `____________________________________________________________`
- **Esperado:** `____________________________________________________________`
- **Observado:** `____________________________________________________________`
- **Severidad:** `bloqueante | alta | media | baja | observación`
- **Reproducibilidad:** `siempre | frecuente | ocasional | no reproducido | pendiente`
- **Evidencia:** `captura, archivo JSON, nota diaria o referencia`
- **Workaround:** `____________________________________________________________`
- **Estado:** `abierto | en investigación | corregido | verificado | descartado | pendiente de beta`
- **Commit / referencia de corrección:** `________________`
- **Notas:** `____________________________________________________________`

## Observaciones

### OBS-001 — Validación inicial de smoke reportada por el propietario

- **Fecha:** `2026-10-22`
- **Build / EAS Build ID:** `no informado`
- **Commit de origen:** `no informado`
- **Dispositivo / modelo:** `no informado`
- **Versión de Android / API:** `no informado`
- **Flujo:** `smoke M0–M7 informado por el propietario`
- **Pasos o contexto:** El propietario informó que instaló el APK generado por EAS y que los recorridos previstos funcionaban.
- **Esperado:** Contar con una señal inicial de que la instalación y los recorridos principales pueden ejecutarse.
- **Observado:** Se recibió un reporte positivo de instalación y funcionamiento de los recorridos.
- **Severidad:** `observación`
- **Reproducibilidad:** `pendiente`
- **Evidencia:** `reporte del propietario; sin modelo de dispositivo, build ni salida de ejecución adjunta`
- **Workaround:** `no aplica`
- **Estado:** `pendiente de beta`
- **Commit / referencia de corrección:** `no aplica`
- **Notas:** Esta observación es limitada y no demuestra cobertura Android, persistencia, accesibilidad, permisos, respaldo/rollback ni finalización de la cadencia de 14 días. No equivale a beta cerrada ni a publicación.
