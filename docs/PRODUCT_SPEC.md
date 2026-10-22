# Clarunio — Especificación maestra del producto (productividad GTD)

> **Nombre del producto:** Clarunio (nombre de trabajo; disponibilidad registral pendiente).  
> **Identificador provisional del repositorio:** `gtd-companion` (nombre técnico, no marca).  
> **Versión:** 1.1 — Especificación maestra con dirección UX/UI Clarunio.  
> **Fecha de actualización:** 21 de octubre de 2026.  
> **Estado:** propuesta lista para iniciar implementación por etapas; no equivale a funcionalidades implementadas.  
> **Plataforma inicial:** Android. **Idioma inicial:** español.  
> **Proceso de desarrollo:** Organic Driven Development (ODD) de Gentleman / Gentle AI, con pruebas orientadas a comportamiento.  
> **Objetivo de uso:** primero uso personal real; después beta cerrada y eventual Google Play.  
> **Propósito de este archivo:** fuente maestra de intención, alcance, reglas de negocio, UX/UI y criterios de aceptación que el agente debe leer ANTES de implementar.
> **Dirección visual elegida:** diseño claro de lavanda y violeta con tipografía contundente y tarjetas redondeadas; referencia conceptual del 21/10/2026. La imagen no es un contrato funcional ni un conjunto de pantallas pixel-perfect.

---

## 0. Instrucciones contractuales para el agente de IA

1. **Lee este documento completo antes de crear código.** Señala contradicciones reales, dependencias y decisiones que bloqueen la implementación; no inventes comportamientos de producto que cambien el alcance.
2. **Respeta ODD según la instalación existente de Gentle AI.** No sustituyas el protocolo por una estructura SDD rígida ni crees manualmente docenas de archivos `spec.md`, `plan.md` y `tasks.md` por defecto. Para cambios sustanciales autorizados, sigue la estructura ODD vigente y crea el documento de trabajo correspondiente en `odd/tasks/<feature-name>.md`, con `## Specs` (S#), `## Tasks` y `## Log`. Mantén sus evidencias y espejo Engram *si están disponibles* según la instalación real.
3. **No implementes todo de una sola vez.** Ejecuta los hitos en orden, crea cambios pequeños y verificables y solicita autorización antes de ampliar el alcance o de añadir servicios con costes recurrentes.
4. Prioriza un sistema **correcto, fácil de comprender, offline-first, accesible y confiable** sobre las animaciones o funcionalidades llamativas.
5. Aplica **test-first / RED → GREEN → REFACTOR** cuando exista un comportamiento comprobable y un runner de pruebas disponible. Nunca afirmes que una prueba pasó si no fue ejecutada. Para controles visuales realiza verificaciones de interfaz manuales o automatizadas proporcionadas por las herramientas existentes.
6. Antes de fijar dependencias verifica versiones publicadas, soporte del SDK, compatibilidad y políticas actuales; **no asumas** que una versión indicada en la investigación siga siendo la más reciente al ejecutar el proyecto.
7. Separa datos persistentes, lógica GTD y presentación. Ningún componente visual debe contener SQL ni las reglas principales de clasificación.
8. Todo dato mostrado como guardado debe estar persistido realmente. No construyas pantallas simuladas que se anuncien como funcionales.
9. Añade en cada hito: pruebas, documentación de los cambios, evidencia de validación, riesgo residual y siguiente paso.
10. Este archivo contiene requisitos **MVP** y requisitos **posteriores**. Implementa solo lo que corresponda al hito autorizado. Las funciones futuras son orientación de diseño, no permiso para construirlas ahora.
11. **Identidad UI vigente:** usar las reglas de las secciones 4, 5 y 14. El concepto visual tiene prioridad sobre el logotipo anterior azul/turquesa, pero **no** sustituye los flujos GTD ni autoriza funcionalidades mostradas solo a modo ilustrativo (voz, adjuntos, porcentajes, prioridades, equipos, estadísticas).
12. Ante una diferencia entre la imagen conceptual y el contrato escrito de comportamiento, **prevalecen los requisitos y flujos escritos**; mantener coherencia visual sin inventar negocio.

**Jerarquía documental:** (1) corrección o decisión explícita del propietario del producto; (2) esta especificación vigente; (3) documento ODD de la funcionalidad aprobado o autorizado; (4) código y tests actuales. Ante conflicto no silencioso, registrar y resolver antes de modificar datos existentes.

---

## 1. Resumen ejecutivo del producto

### 1.1 Visión

Crear una aplicación de productividad personal inspirada en *Getting Things Done* (GTD), que ayude a transformar pensamientos, preocupaciones y compromisos en siguientes acciones concretas, **sin exigir estudiar primero la metodología**.

**Promesa de valor:** «Saca las cosas de tu cabeza, decide qué significan y descubre qué puedes hacer ahora».

**Principio central:** por fuera, sencilla; por dentro, fiel al flujo GTD.

### 1.2 Problema

- Las ideas y compromisos se pierden entre notas, chats y recuerdos.
- Organizar un sistema de tareas puede convertirse en otra carga de trabajo.
- Muchos usuarios desconocen qué significa «siguiente acción», «proyecto», «esperando» o «revisión semanal».
- Los sistemas se abandonan cuando la bandeja crece y volver exige mucho esfuerzo.

**Aclaración de evidencia:** estos problemas son hipótesis informadas por metodología y características de productos existentes; no están cuantificados como validación de mercado de este producto.

### 1.3 Usuario objetivo inicial

Persona con estudios, trabajo o proyectos personales que necesita recordar pendientes y avanzar en ellos, pero no quiere configurar un sistema complejo. Primer usuario de prueba: el propio creador. Perfil secundario posterior: estudiantes, profesionales independientes y personas que comienzan con GTD.

### 1.4 Trabajos por resolver (Jobs to Be Done)

- Cuando recuerdo algo mientras hago otra actividad, quiero anotarlo en segundos para no olvidarlo.
- Cuando tengo pendientes ambiguos, quiero decidir qué significan sin leer un manual.
- Cuando dispongo de tiempo, quiero reconocer una acción ejecutable sin revisar docenas de listas.
- Cuando abandono la app unos días, quiero recuperar el control sin culpa ni una colección de fechas artificialmente vencidas.
- Cuando termino un proyecto o espero una respuesta, quiero que el sistema refleje esa situación con precisión.

### 1.5 Propuesta diferencial a validar

No reclamar novedad por tener GTD, IA, bandeja o revisión semanal: ya existen soluciones con esas características. La hipótesis a validar es una **experiencia guiada, opcional, gradual y reparadora**: aprendizaje contextual, decisiones simples y un flujo «Volver a organizarme» que no humille ni sature.

### 1.6 Objetivos de producto (hipótesis de éxito)

| Código | Indicador | Objetivo propuesto para prueba, NO resultado observado |
|---|---|---|
| KPI-01 | Tiempo mediano de captura sencilla | ≤ 5 segundos desde abrir la captura hasta guardar, en un dispositivo de prueba definido |
| KPI-02 | Captura inicial | Sin inicio de sesión ni tutorial obligatorio |
| KPI-03 | Aclaración autónoma | ≥ 80 % de participantes nuevos completan una aclaración de prueba sin ayuda externa |
| KPI-04 | Recuperación de un pendiente | Encontrar una tarea por búsqueda o sección en ≤ 15 segundos en pruebas controladas |
| KPI-05 | Persistencia | 0 pérdidas reproducibles de datos tras cierre forzado y reinicio en escenarios de prueba |
| KPI-06 | Uso real | Registrar durante 14 días fricciones y abandono; no fijar «retención lograda» antes de medir |

Estos objetivos pueden ajustarse con hallazgos de usabilidad documentados.

---

## 2. Investigación y decisiones de producto

### 2.1 Fundamento metodológico

La metodología GTD define **capturar → aclarar → organizar → reflexionar → ejecutar**. El modelo distingue las cosas que llaman nuestra atención, las acciones siguientes, los resultados de varios pasos (proyectos) y el material no accionable. Fuente primaria: [Getting Things Done — What is GTD?](https://gettingthingsdone.com/what-is-gtd/).

**Definiciones operativas para el software:**

- **Captura:** entrada cruda, sin compromiso de actuar ni completar campos.
- **Aclaración:** decisión consciente sobre el significado de la entrada.
- **Siguiente acción:** paso observable y ejecutable, no un objetivo vago.
- **Proyecto:** resultado deseado que requiere más de una acción; no es simplemente una categoría visual.
- **Esperando:** compromiso dependiente de tercero o evento externo; identificar qué se espera.
- **Algún día:** posibilidad sin compromiso actual.
- **Referencia:** información útil que no requiere acción.
- **Revisión:** comprobación para mantener vigentes los compromisos y siguientes acciones.
- **Ejecutar:** elegir entre acciones disponibles en función de la situación; no equivale a programarlo todo para hoy.

La sugerencia «¿puedes hacerlo en menos de dos minutos?» será **opcional**, nunca una regla que borre o complete tareas automáticamente.

### 2.2 Competencia y aprendizaje

| Producto | Patrón comprobado | Aprendizaje / límite para nuestro diseño |
|---|---|---|
| **Todoist** | Inbox, tareas y proyectos; guía oficial de configuración GTD | Buena captura y organización; aquí queremos minimizar la configuración previa al uso |
| **Nirvana** | Listas Next, Waiting, Scheduled, Someday, Reference, proyectos y revisión; ya explora asistentes con IA | El método está bien representado en un producto especializado: nuestra diferencia debe estar en la UX, no en inventar las listas |
| **Things 3** | Separación entre Inbox, Today, Upcoming, Anytime y Someday; distingue fecha de inicio y deadline | Inspirarse en la claridad visual y no confundir fecha de vencimiento con fecha sugerida de atención |

**Fuentes primarias:**
- [Todoist: el método GTD con Todoist](https://www.todoist.com/es/help/todoist/get-started/getting-things-done-gtd-with-todoist-e5j2h3)
- [Nirvana: Quick Guide](https://www.nirvanahq.com/help/quick-guide)
- [Nirvana: Weekly Review](https://www.nirvanahq.com/help/how-to/weekly-review)
- [Nirvana: AI assistant (beta)](https://www.nirvanahq.com/help/ai/using-the-chat-panel)
- [Things: Today, Upcoming, Anytime, Someday](https://culturedcode.com/things/support/articles/4001304/)
- [Things: Scheduling and deadlines](https://culturedcode.com/things/support/articles/2803579/)

### 2.3 Conclusiones para el MVP

1. No construir una app de «to-dos con 25 campos»; la captura solo necesita texto.
2. No esconder estados GTD importantes: se muestran con **lenguaje común** cuando el usuario los necesite.
3. No convertir «Hoy» en obligación ni duplicar el calendario.
4. Mantener **historial de decisiones y cambios** suficiente para restaurar o auditar acciones críticas.
5. Posponer cualquier IA generativa: el asistente de aclaración del MVP se implementará con reglas deterministas; **no necesita API, prompt ni coste recurrente**.
6. Facilitar que un usuario experimentado salte consejos y utilice las listas completas.

### 2.4 Incertidumbres reales y validación

- ¿Las personas comprenden «siguiente paso» mejor que «siguiente acción»? Probar ambos textos.
- ¿Prefieren tres pestañas o acceso directo a todas las listas? Evaluar prototipo.
- ¿Cuánto acompañamiento resulta útil antes de volverse intrusivo? Observar sesiones reales.
- ¿La revisión semanal guiada se completa o se abandona a mitad? Medir sin manipular al usuario.
- ¿«Volver a organizarme» resuelve una necesidad distinta a una revisión común? Probar específicamente.

Ninguna de estas preguntas debe bloquear un MVP local con textos y diseño configurables.

---

## 3. Alcance y planificación de versiones

### 3.1 MVP obligatorio (v0.1–v1.0 local)

- Aplicación Android, español, sin cuenta obligatoria.
- Captura rápida textual, disponible desde vistas principales.
- Bandeja de entrada persistente con contador.
- Aclaración guiada determinista, con acciones explícitas para cada destino.
- Siguientes acciones independientes y vinculadas a proyectos.
- Proyectos con resultado deseado, estado y una siguiente acción, salvo excepción explícita.
- Estados: siguiente, esperando, programado para revisar/activar, algún día, referencia, completado y papelera.
- «Ahora» como lista breve de enfoque seleccionada por el usuario, y acceso a todas las acciones disponibles.
- Vista de proyectos y listas secundarias accesibles.
- Revisión semanal guiada, reanudable.
- Flujo «Volver a organizarme», activado por el usuario o sugerido suavemente, siempre descartable.
- Edición, completado, deshacer, archivado, recuperación desde papelera y búsqueda básica.
- Notificaciones locales **opcionales y con consentimiento**, solo para recordatorios explícitos y revisión.
- Copia exportable e importación validada (JSON), sin transmisión a servidor.
- Preferencias básicas: tema claro/oscuro/sistema, semana de revisión, ayudas contextuales, notificaciones.
- Estado vacío, errores, confirmaciones y accesibilidad.
- Migraciones SQLite, tests, CI y artefacto Android de pruebas.

### 3.2 Fuera del MVP (no implementar por anticipado)

- Chat de IA, inferencia automática de todas las tareas o modelos en la nube.
- Inicio de sesión, sincronización, backend, colaboración, pagos o suscripción.
- Integraciones Gmail, Google Calendar, Notion, WhatsApp, etc.
- Calendario visual de eventos, time blocking o sincronización con agenda.
- Aplicación web, escritorio, iOS en la primera entrega.
- Voz, archivos adjuntos, subtareas arbitrariamente anidadas, recurrentes complejas.
- Clasificación por energía, ubicación o contextos avanzados; se reservan posibles campos del dominio para evolución, no se exponen ni se implementan aún.
- Algoritmos de puntuación «productividad» o rachas punitivas.
- Geolocalización, contactos, cámara, acceso a almacenamiento amplio o rastreo publicitario.

### 3.3 Roadmap posterior (sin compromiso de fecha)

- **v1.1:** pruebas de campo, accesos rápidos, tareas recurrentes sencillas, mejoras de navegación y búsqueda.
- **v1.2:** contextos opcionales, estimaciones de tiempo/energía, widgets Android.
- **v2.0 (decisión separada):** cuentas opcionales y sincronización; Supabase/PostgreSQL solo si está justificado por usuarios con varios dispositivos.
- **v2.1:** integraciones y recomendación asistida con consentimiento; IA solo si aporta valor medible.
- **iOS:** tras validar el producto y presupuesto.

---

## 4. Principios de diseño de experiencia

**Dirección UX elegida (21/10/2026):** interfaz de lectura inmediata, estilo visual amigable y moderno, con fondo lavanda casi blanco, títulos grandes en violeta oscuro, tarjetas blancas muy redondeadas, chips pastel e iconografía simple. La inspiración entregada por el propietario corresponde **solo al lenguaje visual** de una pantalla de una app educativa: no copiar sus contenidos, funcionalidades, categorías ni composición literal. El último mockup de Clarunio con tres móviles (Ahora / Captura / Proyectos) es **referencia estética**, no especificación funcional cerrada.

1. **Una acción principal por pantalla.** Minimizar decisiones y campos visibles; el CTA principal en violeta se distingue sin llenar la vista de botones.
2. **Capturar no es organizar.** Captura guarda en bandeja sin pedir categorías. El mockup conceptual que muestra captura y opciones GTD juntas **no cambia este contrato**.
3. **Revelación progresiva.** Enseñar conceptos GTD con tarjetas y preguntas breves solo cuando hagan falta; ayuda cerrable y desactivable.
4. **Navegación predecible.** Mantener tres secciones de producto («Ahora», «Bandeja», «Proyectos»), accesos secundarios y botón de captura visible; iconos importantes con etiqueta.
5. **Nada de culpa.** Evitar lenguaje de retraso, rachas o contadores punitivos; la iconografía suave no debe disfrazar advertencias graves.
6. **Acciones reversibles.** Deshacer clasificación, completado, borrado y movimientos cuando proceda.
7. **Fechas independientes.** `due_at` (compromiso), `available_from` (disponibilidad), `focus_date` (enfoque) no se mezclan visualmente ni en datos.
8. **Claridad antes que ornamentación.** Tipografía marcada para encabezados, densidad baja, separación consistente, ilustración secundaria, sin tarjetas excesivas.
9. **Local primero.** Confirmar guardado después de persistir; sin estados falsos de éxito ni dependencias de red.
10. **Lenguaje cotidiano, en español.** «Ahora», «Bandeja», «Proyectos», «Esperando», «Algún día», «Guardar como referencia»; el vocabulario GTD aparece en ayuda opcional.
11. **Elementos decorativos no semánticos.** Pasteles de mint, celeste, rosa y ámbar diferencian bloques, pero nunca sustituyen texto de estado ni implican importancia/urgencia.
12. **Jerarquía para Android real.** Inspirarse en el mockup de teléfonos iPhone únicamente en el diseño interior; producir barras de estado, navegación, teclado y áreas seguras compatibles con Android/Expo.

### 4.1 Microcopy obligatorio (ES)

| Contexto | Texto inicial sugerido |
|---|---|
| Encabezado de Ahora | «¿Qué sigue?» o «¿En qué avanzamos hoy?» (probar cuál se comprende mejor) |
| Subtítulo de Ahora | «Un paso a la vez, en lo que importa.» |
| Captura | «¿Qué tienes en mente?» |
| Guardar | «Guardar en bandeja» |
| Confirmación de captura | «Guardado en tu bandeja.» |
| Opción posterior no obligatoria | «Aclarar ahora» / «Seguir capturando» |
| Bandeja vacía | «Todo lo que capturaste ya tiene un lugar. Puedes anotar algo nuevo cuando quieras.» |
| Aclarar | «¿Esto requiere alguna acción?» |
| No accionable | «¿Quieres guardarlo para consultar, quizá hacerlo más adelante o descartarlo?» |
| Accionable | «¿Cuál es el siguiente paso concreto?» |
| Varios pasos | «¿Necesitas más de un paso para terminarlo?» |
| Esperando | «¿Qué respuesta o resultado estás esperando?» |
| Ahora vacío | «Todavía no elegiste en qué enfocarte. Explora tus siguientes acciones.» |
| Revisión | «Vamos a comprobar que tus pendientes siguen claros y actualizados.» |
| Recuperación | «Podemos poner tu sistema al día, sin empezar de cero.» |
| Error al guardar | «No se pudo guardar. Intenta otra vez; mantendremos tu texto en pantalla.» |
| Deshacer | «Deshacer» |

Microcopy ajustable tras pruebas, sin cambiar los significados del dominio. El diseño final del MVP no mezclará inglés y español de la imagen conceptual.

### 4.2 Aprendizaje progresivo de GTD y fricción

- **Primer inicio:** mostrar directamente Ahora, un estado vacío útil y el botón `+`; no exigir onboarding ilustrado, cuenta ni preferencias iniciales.
- **Primera captura:** modal/pantalla limpia, teclado inmediato, título libre, «Guardar en bandeja». No ofrecer cinco categorías antes de guardar.
- **Primera aclaración:** pregunta binaria inicial con respuesta legible; después presentar tarjetas de elección contextual (siguiente acción, proyecto, esperando, algún día, referencia), solo cuando corresponda al árbol de decisiones de FL-02.
- **Primer proyecto:** presentar tarjeta de resultado deseado y primera siguiente acción; no introducir progreso porcentual inventado.
- **Uso recurrente:** ofrecer suavemente revisión semanal y recuperación; el usuario puede continuar usando la app sin completar consejos.
- **Avanzado:** acceso directo a listas y edición sin repetir consejos; preferencia de ayuda contextual respetada.

### 4.3 Jerarquía de la interacción

1. **Nivel 1 — foco:** título grande, siguiente acción y CTA principal (capturar, guardar o continuar) con violeta de marca.
2. **Nivel 2 — orientación:** secciones y tarjetas de bandeja, proyectos, revisión, contadores reales o accesos «Ver todas».
3. **Nivel 3 — metadatos:** fechas verdaderas, estados, notas y etiquetas, en texto secundario legible.
4. **Nivel 4 — decoración:** símbolos, chips suaves, gradientes puntuales y animaciones discretas; nunca bloquear ni competir con el foco.

---

## 5. Mapa de información y pantallas

### 5.1 Navegación principal y coherencia con el mockup

**Navegación funcional del MVP:** tres destinos persistentes `Ahora | Bandeja | Proyectos` y un botón flotante circular violeta `+` para capturar. **Buscar** y **Ajustes** estarán en la cabecera o menú accesible. «Ver todas las listas» da acceso a `Siguientes | Esperando | Programadas | Algún día | Referencias | Completadas | Papelera | Revisar | Ajustes`.

La imagen de referencia muestra una barra con «Today», «Projects», «Search», «Settings» y un `+` central; **esa estructura se utiliza solo como inspiración de presentación**. No eliminar Bandeja ni crear tabs adicionales por copiarla. Para no tapar la pestaña central «Bandeja», el `+` flotará por encima de la barra inferior, en posición accesible, con separación de áreas táctiles. Un rediseño posterior de navegación solo puede aprobarse tras prueba de usabilidad.

Patrón visual común de pantalla: cabecera simple con símbolo de Clarunio y buscador/ajustes cuando aplique; título grande en dos niveles de jerarquía; tarjetas blancas redondeadas agrupadas sobre fondo lavanda muy claro; navegación inferior fija y captura destacada. Respetar teclado, safe areas y tamaño real de Android.

### 5.2 Inventario de pantallas y contrato visual

| ID | Pantalla | Comportamiento requerido (sin cambios de alcance) | Presentación UX/UI objetivo |
|---|---|---|---|
| UI-01 | Ahora | Enfoque elegido, todas las siguientes, bandeja y revisión | Encabezado «¿Qué sigue?», pequeño saludo opcional, fila compacta de hasta tres datos reales, tarjetas de acciones y una tarjeta lavanda para revisión |
| UI-02 | Captura rápida | Guardar texto en INBOX sin exigir aclaración | Hoja/modal limpio, título grande, área de texto redondeada, botón violeta «Guardar en bandeja»; nada de micrófono o adjuntos MVP |
| UI-03 | Bandeja | Listar capturas sin aclarar, abrir y procesar | Filas/tarjetas blancas con icono pastel, título y fecha relativa secundaria; contador claro |
| UI-04 | Asistente de aclaración | Una pregunta por paso; destinos GTD válidos | Pregunta grande y tarjetas seleccionables con borde violeta, icono, etiqueta y breve descripción; progreso pequeño y pasos reversibles |
| UI-05 | Detalle/edición de acción | Ver/editar, estado, fechas, foco y completar | Tarjeta principal y campos agrupados en secciones aireadas; CTA único y metadatos discretos |
| UI-06 | Proyectos | Estados y resultados, bloqueo y siguientes | Tarjetas verticales con iconos pastel, resultado, estado textual y siguiente acción/espera; **sin porcentajes calculados por cantidad de tareas** |
| UI-07 | Detalle de proyecto | Resultado deseado, acciones, bloqueo y completar correctamente | Cabecera amplia, tarjeta de objetivo y lista de acciones; CTA «Añadir siguiente paso» |
| UI-08 | Todas las listas | Acceso a estados GTD secundarios | Cuadrícula/listado de tarjetas con iconos simples, nombre y contador real (si existe) |
| UI-09 | Revisar | Revisión semanal por pasos reanudable | Encabezado sereno, barra de progreso **por etapas de revisión**, tarjetas con pendientes; CTA «Continuar revisión» |
| UI-10 | Volver a organizarme | Recuperación voluntaria, sin borrados automáticos | Tarjeta de bienvenida no punitiva, resumen de datos reales, una decisión por vez |
| UI-11 | Buscar | Búsqueda local en tareas, proyectos y referencia | Campo claro en cabecera, resultados agrupados, resaltado accesible y estados vacíos específicos |
| UI-12 | Ajustes / Datos | Preferencias, exportación, importación, eliminación | Agrupaciones blancas redondeadas, controles nativos visibles, advertencias inequívocas en operaciones destructivas |
| UI-13 | Completadas / Papelera | Ver/restaurar/purgar con confirmación | Filas discretas, acciones secundarias y confirmaciones explícitas; no utilizar verde solo como estado completado |

**Criterio transversal:** no añadir una pantalla o componente como funcional por aparecer en la referencia visual: gráficos, etiquetas de prioridad, adjuntos, dictado, puntuaciones, «due today» sin `due_at`, colaboración y estadísticas no están autorizados.

### 5.3 Wireframe conceptual: UI-01 Ahora

```text
┌──────────────────────────────────────────┐
│  [símbolo] Clarunio      [buscar] [ajustes]│
│                                          │
│  Buen día                                │
│  ¿Qué sigue?                             │
│  Un paso a la vez, en lo que importa.    │
│                                          │
│  [2 En enfoque] [3 Bandeja] [4 Proyectos] │
│                                          │
│  Siguientes acciones           Ver todas │
│  ┌────────────────────────────────────┐  │
│  │ ○ Preparar esquema de exposición   │  │
│  │   Proyecto · Disponible            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ ○ Revisar presupuesto              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Bandeja                        Abrir →  │
│  ┌────────────────────────────────────┐  │
│  │ ✦ 3 ideas por aclarar              │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Revisión semanal       Continuar → │  │
│  └────────────────────────────────────┘  │
│                        (+ Capturar)      │
│ [Ahora]       [Bandeja]    [Proyectos]   │
└──────────────────────────────────────────┘
```

El ASCII documenta jerarquía y contenido; **no** obliga a pixel-perfect ni a mantener una cantidad fija de tarjetas. Los contadores son valores de base de datos y desaparecen/cambian si no hay datos.

### 5.4 Estados de cada pantalla

Cada pantalla de lectura soporta **cargando local, vacío, contenido y error recuperable**. Pantallas de mutación: **reposo, cambios no guardados, guardando, éxito, error conservando texto**. El estado vacío tendrá una ilustración vectorial muy sutil o icono sencillo + texto útil + acción concreta; no cargar grandes ilustraciones animadas. En listas largas, preferir tarjetas compactas y virtualización en lugar de superficies infladas que obliguen a recorrer demasiado.

### 5.5 Accesibilidad y adaptación

- Controles táctiles habitualmente de al menos 48×48 dp; separaciones adecuadas entre acciones próximas.
- Contraste al menos WCAG AA donde corresponda, comprobar **texto gris sobre lavanda**, **violeta sobre blanco** y **texto blanco sobre botón violeta**. Los colores de la sección 14 son **tokens propuestos**, sujetos a medición.
- Escalado de fuente del sistema, lector de pantalla, foco accesible, etiquetas de botón y contenido largo.
- No usar color, icono o barra de progreso como única explicación de estado; mostrar texto («Esperando», «Bloqueado», «Siguiente acción»).
- Reducir movimiento si el SO así lo solicita; evitar flashes y animaciones distractoras.
- Fondo/dimensiones responsivas, teclado visible, barra de navegación Android, áreas seguras y orientación probada en teléfonos pequeños y grandes.
- Diseñar también el modo oscuro; jamás invertir automáticamente colores pastel creando contraste insuficiente.

### 5.6 Contrato preciso de interacción: UI-02 y UI-04

**UI-02 — Captura sin fricción**

1. Pulsar `+` abre una hoja o pantalla de captura con foco inmediato en el teclado.
2. Mostrar título «¿Qué tienes en mente?» y campo libre. CTA primario «Guardar en bandeja» fijo/visible por encima del teclado.
3. Al guardar correctamente, cerrar o mostrar confirmación discreta. Puede aparecer **después** un acceso opcional «Aclarar ahora»; no insertar decisiones GTD en el formulario de captura.
4. Si falla guardado, permanecer en la vista, conservar texto y permitir reintentar.

**UI-04 — Aclaración guiada separada**

1. Abrir un elemento persistido en Bandeja.
2. Mostrar «¿Esto requiere alguna acción?» con opciones claras.
3. En cada etapa mostrar solo alternativas válidas, como tarjetas seleccionables con iconos y descripciones cortas: `Siguiente acción`, `Proyecto`, `Esperando`, `Algún día`, `Guardar como referencia` o `Descartar`, según el flujo FL-02.
4. Solicitar texto de siguiente paso, resultado del proyecto o persona/resultado esperado **solo** cuando corresponda.
5. Mostrar resumen editable y CTA «Confirmar organización». Cancelar no mueve el elemento ni crea registros parciales.

**No fusionar estas dos vistas porque el mockup conceptual dibuje ambas en un mismo teléfono.**

### 5.7 Contrato de presentación: UI-06 Proyectos

- Cada tarjeta muestra: icono contextual genérico (opcional), **resultado deseado**, estado de proyecto y uno de estos datos honestos: siguiente acción disponible; dependencia/espera; o invitación a definir un paso.
- Los porcentajes y barras de progreso por «x tareas de y» del mockup son **solo recursos visuales ilustrativos**. GTD define proyectos por resultados; porcentaje de subtareas completadas no implica avance real. Para MVP, usar una línea de estado o chip de texto, sin progreso porcentual.
- Los filtros «Todos / Activos / Algún día» son compatibles con el dominio cuando se implementen sus vistas; «Pausado» solo si existe estado/regla aprobada. Evitar inventar nuevos estados por estética.

---

## 6. Flujos de usuario y reglas GTD

### FL-01 Capturar

1. Usuario pulsa `+` desde una vista principal.
2. Escribe una frase libre, por ejemplo «preparar exposición».
3. Pulsa «Guardar en bandeja».
4. Se valida que exista contenido significativo no vacío; se guarda localmente.
5. Vuelve al contexto previo; la bandeja muestra nuevo elemento y contador actualizado.
6. Si falla la persistencia, queda el texto en pantalla y se muestra un error recuperable.

**No** preguntar fecha, proyecto, prioridad ni cuenta en este flujo.

### FL-02 Aclarar entrada

1. Abrir un elemento `INBOX`.
2. Preguntar: «¿Esto requiere alguna acción?».
3. Si **no**: elegir **referencia**, **algún día**, **descartar**. Si se archiva referencia, conservar el texto y notas.
4. Si **sí**: solicitar el siguiente paso concreto (texto editable, no generar con IA).
5. Preguntar si es resultado de varios pasos. Si sí, crear o seleccionar proyecto y registrar el resultado deseado; vincular el paso.
6. Ofrecer destino **siguiente acción**, **esperando respuesta** o **programado** (solo si requiere activación posterior). Permitir «hacer ahora» y completar manualmente.
7. Confirmar; persistir todo como **una transacción** y retirar de bandeja.

**Regla:** cancelar antes de confirmar deja el elemento en bandeja sin pérdida ni proyecto parcialmente creado.

### FL-03 Hacer hoy

1. `Ahora` muestra las acciones que el usuario eligió enfocar para la fecha local actual.
2. Permitir añadir/quitar de enfoque acciones elegibles `NEXT`.
3. Mostrar el acceso «Todas las siguientes» para no esconder obligaciones.
4. Completar una acción actualiza su estado, la quita del enfoque y ofrece «Deshacer».
5. No trasladar automáticamente acciones no completadas a estados `DONE` ni inventar fecha límite.

### FL-04 Esperando

1. Al aclarar o editar, usuario marca «Esperando».
2. Registra `waiting_for` (persona, empresa o respuesta esperada; puede ser texto libre no necesariamente un contacto real), y opcionalmente `follow_up_at`.
3. Se muestra en la lista Esperando, no como acción ejecutable ahora.
4. Cuando llega respuesta, usuario selecciona «Ya recibí respuesta», elige marcar completado o convertir en una siguiente acción.
5. No se convierte automáticamente en completado al superar la fecha de seguimiento.

### FL-05 Programar / compromiso real

- `available_from`: fecha en la que una acción pasa de `SCHEDULED` a estar disponible para `NEXT`. Puede realizarse en consulta al abrir la app; no necesita job de fondo. Debe ser idempotente.
- `due_at`: fecha/hora de compromiso verdadero, **independiente** de la disponibilidad. Una fecha de vencimiento no es automáticamente una notificación.
- `follow_up_at`: fecha opcional de chequeo para `WAITING`, no marca la respuesta como recibida.
- `focus_date`: fecha local para la selección de `Ahora`, sin cambiar el vencimiento ni disponibilidad.
- Solo recordatorios locales explícitos notifican; en ajustes se puede desactivar todo.

### FL-06 Revisión semanal

Secuencia reanudable, editable y sin «aprobación» ficticia:

1. **Bandeja:** mostrar capturas pendientes y opción de aclararlas; ofrecer continuar con pendientes visibles, sin mentir que está vacía.
2. **Siguientes:** confirmar si siguen siendo acciones ejecutables o moverlas.
3. **Esperando:** revisar si corresponde seguimiento.
4. **Proyectos:** resaltar proyectos activos sin siguiente acción y sin bloqueo justificado; proponer crear acción o marcarlo en espera.
5. **Programadas / Algún día:** revisar lo que puede activarse o descartarse.
6. **Cierre:** resumen informativo, hora real de finalización; opción «Terminar» incluso si existen asuntos abiertos, con advertencia no bloqueante.

El progreso por etapa se guarda. Si la app se cierra, se puede continuar. La revisión no cambia los estados de las tareas por el simple hecho de verlas.

### FL-07 Volver a organizarme

Una recuperación voluntaria simplificada:

1. Mensaje amable «Podemos poner tu sistema al día».
2. Pantalla con números reales: capturas, acciones activas, proyectos sin siguiente, espera.
3. Procesar capturas una a una o dejar para después.
4. Revisar **solo** elementos que realmente necesitan decisión; no forzar a procesar todo.
5. Elegir de cero a tres acciones para enfocarse ahora (límite recomendado visual, **no una restricción de negocio**).
6. Confirmar y volver a Ahora; mostrar decisiones tomadas y pendientes restantes.

No borrar, completar, aplazar ni reprogramar masivamente sin selección/confirmación explícita.

### FL-08 Exportar e importar

- Exportación completa local en JSON UTF-8 con número de versión de formato y fecha de exportación; compartir/guardar mediante selector del sistema, sin requerir acceso amplio a archivos.
- Importación realiza lectura, validación del esquema y referencias, vista previa de totales, confirmación y operación transaccional.
- En MVP adoptar **reemplazo total** de datos locales (en vez de mezcla), con confirmación clara; documentar que se sobrescribirá el conjunto actual y permitir generar respaldo antes.
- Fallo de parseo, versión incompatible o integridad: **rollback completo**, ningún dato vigente debe borrarse.
- No exportar credenciales o tokens (en MVP no hay cuentas).

---

## 7. Requisitos funcionales (RF) y criterios de aceptación

**Convenio:** `MUST` = obligatorio MVP; `SHOULD` = deseable sin bloquear release; `LATER` = evolución. Los criterios pueden expresarse en lenguaje Given/When/Then en tests y documentos ODD.

| ID | Prioridad | Requisito verificable |
|---|---|---|
| RF-01 | MUST | El usuario puede abrir app local sin registro ni conexión |
| RF-02 | MUST | Capturar texto libre a bandeja desde cualquier tab principal |
| RF-03 | MUST | Guardar atómicamente y conservar la entrada ante error |
| RF-04 | MUST | Listar y abrir elementos pendientes de aclaración |
| RF-05 | MUST | Aclarar como accionable / no accionable con decisiones explícitas |
| RF-06 | MUST | Mover no accionables a Referencia, Algún día o Papelera |
| RF-07 | MUST | Convertir elemento a siguiente acción en forma transaccional |
| RF-08 | MUST | Crear proyecto con resultado deseado y vincular acciones |
| RF-09 | MUST | Editar, completar y restaurar acciones con confirmación apropiada |
| RF-10 | MUST | Distinguir NEXT / WAITING / SCHEDULED / SOMEDAY sin superposición en estado principal |
| RF-11 | MUST | Registrar persona/resultado esperado y seguimiento opcional en WAITING |
| RF-12 | MUST | Separar `available_from`, `due_at` y `focus_date` |
| RF-13 | MUST | Elegir acciones de enfoque manualmente y permitir quitarlas |
| RF-14 | MUST | Mostrar proyectos activos sin siguiente acción ejecutable o bloqueo justificado |
| RF-15 | MUST | Habilitar revisión semanal guiada reanudable |
| RF-16 | MUST | Habilitar recuperación voluntaria «Volver a organizarme» |
| RF-17 | MUST | Buscar por texto en títulos y notas de acciones, proyectos y referencias |
| RF-18 | MUST | Exportar respaldo completo JSON validado |
| RF-19 | MUST | Importar y restaurar un respaldo compatible con rollback en error |
| RF-20 | MUST | Ofrecer ajuste de tema y ayudas contextuales |
| RF-21 | MUST | Permitir programar recordatorios locales opcionales; manejar permiso denegado |
| RF-22 | MUST | Acceder a completadas y papelera; restaurar y purgar con confirmación |
| RF-23 | MUST | Borrar todos los datos de la app mediante doble confirmación |
| RF-24 | MUST | Operar offline en todos los casos anteriores, salvo interacción opcional con el selector de archivos del SO |
| RF-25 | SHOULD | Mostrar aviso de revisión semanal configurable, no intrusivo |
| RF-26 | SHOULD | Ofrecer sugerencias de próxima acción mediante ejemplos fijos, editables |
| RF-27 | LATER | Tareas recurrentes, contextos y widgets |
| RF-28 | LATER | Cuenta, sincronización, integraciones, IA, colaboración |

### Criterios de aceptación ilustrativos, normativos

**AC-01 Captura**

```gherkin
Dado que la app no tiene conexión de red
Cuando escribo "comprar materiales" y pulso "Guardar en bandeja"
Entonces se crea exactamente una entrada persistente con estado INBOX
Y no se me exige fecha, proyecto ni inicio de sesión
Y al cerrar y reabrir la app puedo encontrarla.
```

**AC-02 Error de persistencia**

```gherkin
Dado un error simulado de escritura en SQLite
Cuando intento guardar una captura
Entonces se muestra un mensaje recuperable
Y el campo conserva su texto
Y no se anuncia un guardado exitoso.
```

**AC-03 Clasificación de múltiples pasos**

```gherkin
Dado el elemento de bandeja "preparar exposición"
Cuando lo aclaro como proyecto con resultado "exposición lista"
Y defino la acción "redactar esquema"
Entonces existe un proyecto activo y una acción NEXT asociada
Y el elemento deja de aparecer en la bandeja
Y una falla de transacción no deja entidades parciales.
```

**AC-04 Vencimiento vs enfoque**

```gherkin
Dada una acción NEXT sin fecha límite
Cuando la elijo para enfocarme hoy
Entonces aparece en Ahora
Y su due_at sigue siendo nulo
Y al quitarla de Ahora continúa en Siguientes.
```

**AC-05 Esperando**

```gherkin
Dada una acción en WAITING que espera respuesta de "Ana"
Cuando llega follow_up_at
Entonces no se marca como hecha automáticamente
Y aparece como pendiente de seguimiento si se consulta la lista correspondiente.
```

**AC-06 Revisión reanudable**

```gherkin
Dada una revisión iniciada que terminó el paso Bandeja
Cuando cierro y reabro la app
Entonces puedo continuar por la etapa siguiente
Y ninguna tarea cambia de estado por haber sido simplemente revisada.
```

**AC-07 Importación segura**

```gherkin
Dado un respaldo JSON con referencias corruptas
Cuando intento importarlo
Entonces recibo un error explícito
Y el conjunto de datos previo permanece íntegro.
```

**AC-08 Reactivación programada**

```gherkin
Dada una acción SCHEDULED cuya fecha available_from ya llegó
Cuando abro la vista de siguientes acciones
Entonces queda disponible como NEXT una sola vez
Y no se crean duplicados después de varios reinicios.
```

**AC-09 Manejo de proyecto bloqueado**

```gherkin
Dado un proyecto activo sin acciones NEXT
Y con una dependencia WAITING documentada
Cuando lo reviso
Entonces se muestra como bloqueado o en espera
Y no se presenta falsamente como proyecto con siguiente acción disponible.
```

**AC-10 Borrado seguro**

```gherkin
Dado que hay datos locales
Cuando entro en "Borrar todos mis datos"
Entonces se exige una confirmación inequívoca
Y puedo cancelar sin alterar ningún registro.
```

---

## 8. Modelo de dominio y decisiones de negocio

### 8.1 Entidades principales

- **Item:** unidad capturada o aclarada; representa entrada, acción o referencia. Tiene un único estado de flujo actual.
- **Project:** resultado que puede agrupar varias acciones y tiene estado independiente.
- **FocusSelection:** relación entre una acción NEXT y una fecha local de enfoque.
- **ReviewSession:** sesión guiada con progreso y resultado; no constituye un estado de tarea.
- **AppSettings:** configuración local con valores por defecto seguros.
- **ChangeLog (ligero):** registro de cambios críticos para diagnóstico/recuperación, sin telemetría remota por defecto.

### 8.2 Estados de Item

`INBOX | NEXT | WAITING | SCHEDULED | SOMEDAY | REFERENCE | DONE | TRASH`

**Semántica:**

- `INBOX`: aún no aclarado.
- `NEXT`: acción disponible.
- `WAITING`: dependencia ajena; requiere descripción de lo esperado.
- `SCHEDULED`: acción diferida hasta `available_from` futura.
- `SOMEDAY`: opción sin compromiso presente.
- `REFERENCE`: información no accionable.
- `DONE`: acción completada por usuario o decisión explícita en el flujo.
- `TRASH`: elemento enviado a papelera con estado anterior recuperable.

### 8.3 Transiciones permitidas y restricciones

```text
CAPTURE -> INBOX
INBOX -> NEXT | WAITING | SCHEDULED | SOMEDAY | REFERENCE | TRASH | DONE (hacer ahora)
NEXT -> WAITING | SCHEDULED | SOMEDAY | DONE | TRASH
WAITING -> NEXT | DONE | SOMEDAY | TRASH
SCHEDULED -> NEXT (activación por fecha) | WAITING | SOMEDAY | DONE | TRASH
SOMEDAY -> NEXT | SCHEDULED | REFERENCE | TRASH
REFERENCE -> INBOX (reaclarar) | TRASH
DONE -> NEXT (reabrir) | TRASH
TRASH -> previous_state (restaurar) | purga definitiva
```

Cambios adicionales como `REFERENCE → NEXT` pueden implementar un paso «Volver a aclarar» que valide el nuevo siguiente paso, **no** reclasificación silenciosa. Toda transición debe pasar por una función de dominio común con validación y transacción.

### 8.4 Invariantes de dominio

- INV-01: cada Item posee **exactamente un estado** del enumerado.
- INV-02: un Item `INBOX` no exige fecha, proyecto ni tipo de acción.
- INV-03: una acción `NEXT` tiene título con significado para el usuario; el asistente lo solicita, pero no pretende validar semánticamente lenguaje natural con una expresión regular.
- INV-04: `WAITING` exige `waiting_for` no vacío; no se confunde con una acción activa.
- INV-05: `SCHEDULED` exige `available_from` futura al crear la programación; al alcanzar la fecha se activa de forma idempotente.
- INV-06: `REFERENCE` es consultable, pero no se presenta como siguiente acción.
- INV-07: `DONE` conserva información para historial; `TRASH` conserva el estado anterior hasta purga.
- INV-08: acciones completadas, esperando y programadas no aparecen como foco activo, salvo que el usuario las reactive como `NEXT`.
- INV-09: cada proyecto `ACTIVE` debe tener una `NEXT` o una justificación visible de bloqueo/espera; durante alta incompleta puede estar en modo borrador transaccional no expuesto en listados normales.
- INV-10: completar proyecto con acciones pendientes requiere elección explícita: completar acciones relacionadas, mantenerlas desvinculadas (si se justifica) o cancelar. Nunca borrarlas silenciosamente.
- INV-11: captura y clasificación no crean duplicados por doble toque.
- INV-12: horas/fechas almacenadas con semántica explícita de UTC vs fecha local; `focus_date` es `YYYY-MM-DD` según zona local del dispositivo y no un timestamp UTC reinterpretado.
- INV-13: importar una copia exige validación integral antes de reemplazar.
- INV-14: el cierre forzado en una transacción deja estado consistente.
- INV-15: todo cambio de fase en una revisión es guardado o no se muestra como terminado.
- INV-16: funciones educativas nunca impiden usar directamente las listas.

### 8.5 Proyectos

Estados: `ACTIVE | SOMEDAY | COMPLETED | ARCHIVED`.

Atributos: resultado deseado (texto obligatorio), notas opcionales, `blocked_reason` opcional, marcas de auditoría. Un proyecto puede contener acciones en estados distintos; el estado del proyecto no se infiere contando las tareas completadas. **No completar automáticamente el proyecto al completar la última acción:** preguntar si se alcanzó el resultado.

---

## 9. Modelo de datos SQLite (propuesto)

> **Nota:** es un diseño lógico de arranque, no una migración SQL definitiva. El agente puede afinar tipos/índices documentando razones, sin cambiar los contratos de dominio. Toda migración se versionará y probará contra datos anteriores.

### 9.1 Tablas

**`items`**

| Campo | Tipo lógico | Restricción / significado |
|---|---|---|
| `id` | TEXT UUID | PK; generado localmente |
| `title` | TEXT | NOT NULL; trim; límite de longitud razonable |
| `notes` | TEXT | Opcional; texto plano en MVP |
| `state` | TEXT | CHECK enum de estados |
| `project_id` | TEXT | FK nullable hacia projects; `ON DELETE` restringido o gestionado explícitamente |
| `waiting_for` | TEXT | Requerido en WAITING |
| `available_from` | TEXT | Fecha ISO local `YYYY-MM-DD` para SCHEDULED |
| `due_at` | TEXT | Fecha/hora de compromiso, zona inequívoca si hay hora |
| `follow_up_at` | TEXT | Fecha de seguimiento si WAITING |
| `created_at`, `updated_at` | TEXT | Marca UTC ISO-8601 |
| `completed_at` | TEXT | Marca UTC o null |
| `deleted_at` | TEXT | Papelera / null |
| `previous_state` | TEXT | Estado anterior a TRASH, nullable |
| `sort_order` | INTEGER | Orden manual determinista |

**`projects`**: `id`, `desired_outcome`, `notes`, `status`, `blocked_reason`, `created_at`, `updated_at`, `completed_at`, `sort_order`.

**`focus_selections`**: `item_id` FK, `focus_date` (`YYYY-MM-DD`), `created_at`; PK compuesta `(item_id, focus_date)`.

**`review_sessions`**: `id`, `kind` (`WEEKLY | RECOVERY`), `state` (`IN_PROGRESS | COMPLETED | CANCELLED`), `current_step`, `started_at`, `finished_at`, `summary_json` (solo indicadores, no duplicación de tareas).

**`settings`**: `key` PK, `value_json`, `updated_at`. Valores conocidos y versionados mediante validador.

**`change_log`** (recomendado): `id`, `entity_type`, `entity_id`, `operation`, `timestamp`, `details_json` reducido; limitar tamaño/retención y no registrar secretamente contenidos completos si no se necesita.

**`schema_migrations`**: versión, fecha, checksum o equivalente para migraciones seguras.

### 9.2 Índices / relaciones

- `items(state, updated_at)`; `items(project_id, state)`; `items(available_from, state)`; `items(follow_up_at, state)`; `items(due_at)`.
- `projects(status)`.
- `focus_selections(focus_date)`.
- FKs activas y validación con `PRAGMA foreign_keys = ON`.
- Preferir consultas parametrizadas, especialmente para búsqueda y escritura; nunca interpolar texto de usuario en SQL.
- Una sola conexión/control de transacciones coordinado desde repositorios.

### 9.3 Política de borrado y respaldo

- El borrado ordinario mueve a `TRASH`, salvo purga irreversible confirmada.
- El borrado de un proyecto con acciones vinculadas solicita elección explícita, no cascada accidental.
- Exportar incluye esquema, proyectos, items, focus, revisiones y configuración segura; puede excluir el change_log si se documenta y es irrelevante para restaurar.
- Importar una versión futura desconocida debe rechazar con mensaje claro.
- No utilizar `AsyncStorage` como fuente primaria de tareas estructuradas; SQLite es la fuente de verdad.

### 9.4 Contrato de exportación (ejemplo)

```json
{
  "format": "gtd-companion-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-10-19T15:00:00.000Z",
  "data": {
    "projects": [],
    "items": [],
    "focusSelections": [],
    "reviewSessions": [],
    "settings": {}
  }
}
```

No incluir nombres, claves ni otros datos de ejemplo como datos reales. Incluir un `exportedAt` fiable generado en ejecución. Versionar el contrato exportado por separado del número de migración interna si divergen.

---

## 10. Arquitectura técnica

### 10.1 Stack recomendado

| Capa | Elección | Justificación |
|---|---|---|
| Móvil | React Native + Expo + TypeScript estricto | Desarrollo Android reproducible y familiar |
| Navegación | Expo Router | Rutas por archivos, deep links futuros |
| Persistencia | `expo-sqlite` | DB relacional local persistente, transacciones y migraciones |
| Formularios | Inputs controlados; validador simple (p. ej. Zod si aporta valor) | Validación en frontera, sin sobreingeniería |
| Lógica | Casos de uso TS puros y repositorios con interfaces | Testeable y desacoplada de UI/SQLite |
| Tests unitarios | Vitest o Jest según compatibilidad real del proyecto | Contratos y reglas del dominio |
| Tests componentes | React Native Testing Library, si compatible | Flujos e interacción accesible |
| E2E Android | Maestro u otra herramienta integrada comprobada | Caminos críticos en dispositivo/emulador |
| CI | GitHub Actions | Lint, tipos, pruebas, validación de migraciones |
| Distribución | EAS Build / canal de pruebas Play Console | Artefacto Android firmado, reproducible |
| Backend MVP | Ninguno | Privacidad, funcionamiento offline y bajo coste |

**Versión de dependencias:** al iniciar, verificar la versión **estable** de Expo publicada y compatible con requisitos de Google Play; no combinar paquetes de SDKs diferentes. Instalar paquetes Expo mediante `npx expo install`. Para Google Play, desde el 31 de agosto de 2026 las nuevas apps/actualizaciones móviles convencionales deben apuntar a **Android 16 / API 36 o superior**, según el aviso de Google consultado (revalidar al publicar).

### 10.2 Arquitectura en capas

```text
┌─────────────────────────────────────────┐
│ UI / Expo Router / Componentes          │
│ pantallas, accesibilidad, microcopy     │
└───────────────────┬─────────────────────┘
                    ↓ comandos y consultas
┌─────────────────────────────────────────┐
│ Application / Use cases                │
│ captureItem, clarifyItem, focusAction,  │
│ conductReview, restoreBackup, etc.      │
└───────────────────┬─────────────────────┘
                    ↓ interfaces
┌─────────────────────────────────────────┐
│ Domain                                 │
│ entidades, transiciones, invariantes,   │
│ errores tipados, validaciones           │
└───────────────────┬─────────────────────┘
                    ↓ contratos
┌─────────────────────────────────────────┐
│ Data / SQLite repositories              │
│ migraciones, transacciones, backup      │
└─────────────────────────────────────────┘
```

**Reglas arquitectónicas:** el dominio no importa React, Expo ni librerías de SQLite; los casos de uso coordinan transacciones; los componentes no ejecutan SQL; y los repositorios producen objetos de dominio validados.

### 10.3 Estructura sugerida de repositorio

```text
gtd-companion/
├── app/                         # Expo Router: composición de pantallas
│   ├── _layout.tsx
│   ├── (tabs)/
│   └── ...
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── rules/
│   │   └── errors/
│   ├── application/
│   │   ├── use-cases/
│   │   ├── contracts/
│   │   └── queries/
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   └── repositories/
│   │   ├── backup/
│   │   └── notifications/
│   ├── features/
│   │   ├── capture/
│   │   ├── inbox/
│   │   ├── clarify/
│   │   ├── actions/
│   │   ├── projects/
│   │   ├── review/
│   │   ├── recovery/
│   │   └── settings/
│   └── shared/
│       ├── ui/
│       ├── theme/
│       └── utils/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── PRODUCT_SPEC.md          # copia de este documento
│   ├── decisions/
│   ├── TEST_PLAN.md
│   ├── USER_GUIDE.md
│   └── RELEASE_CHECKLIST.md
├── odd/
│   └── tasks/                  # generado y mantenido por ODD
├── .github/workflows/
├── app.json
├── eas.json
├── package.json
└── README.md
```

No crear carpetas vacías de forma artificial: generarlas al implementarse funcionalidad. No usar monorepo o backend preventivo.

### 10.4 API futura (no implementar)

Si se aprueba nube, mantener `Repository` como contrato e introducir adaptador de sincronización; diseñar por separado identidad de usuario, cifrado, versiones de registros, eliminación/tombstones, conflictos, política de reloj y migración de dispositivo. **No asumir que SQLite ↔ PostgreSQL sincroniza de manera automática**. Supabase es una opción evaluable, no una dependencia del MVP.

---

## 11. Requisitos no funcionales (RNF)

| ID | Área | Criterio de aceptación / medición |
|---|---|---|
| RNF-01 | Offline | Captura, clasificación, proyectos, búsqueda, revisión y respaldo operan sin red |
| RNF-02 | Persistencia | No perder contenido confirmado tras cierre forzado/reinicio en pruebas repetibles |
| RNF-03 | Rendimiento | En dispositivo de referencia, captura y listado fluido con datos semilla de ≥ 5 000 items; registrar medición, no prometer tiempo no medido |
| RNF-04 | Arranque | Medir tiempo hasta interactividad en dispositivo de gama media Android; objetivo a establecer con línea base antes de optimización |
| RNF-05 | UX | Captura mínima en ≤ 2 acciones principales tras escribir; cero campos accesorios requeridos |
| RNF-06 | Accesibilidad | Etiquetas de screen reader y navegación funcional en todos los flujos MVP; verificar manual y automatizado donde sea posible |
| RNF-07 | Integridad | FK, transacciones atómicas, migraciones idempotentes y rollback en importación fallida |
| RNF-08 | Seguridad | Sin secretos hardcoded; SQL parametrizado; permisos mínimos; no recopilar telemetría personal por defecto |
| RNF-09 | Privacidad | El contenido permanece local salvo exportación expresamente iniciada por el usuario |
| RNF-10 | Mantenibilidad | TypeScript strict, responsabilidades claras, comentarios para decisiones no obvias |
| RNF-11 | Calidad | CI verde para types/lint/tests relevantes antes de merge; regresiones importantes bloquean release |
| RNF-12 | Compatibilidad | Android/Expo/SDK y API target verificados para el build real en la fecha de publicación |
| RNF-13 | Localización | UI inicial es-PE; fechas y horas adaptadas a zona local; estructura lista para i18n posterior |
| RNF-14 | Resiliencia | No sobrescribir datos válidos al fallar backup/importación o migración |
| RNF-15 | Usabilidad | Cualquier flujo esencial sin gestos secretos; mensajes de error reparables y comprensibles |
| RNF-16 | Consumo | Sin polling de red, wake locks o notificaciones constantes en MVP |
| RNF-17 | Observabilidad | Errores de desarrollo detectables en logs locales saneados; sin contenido personal en servicios externos por defecto |
| RNF-18 | Distribución | Proyecto reproducible, metadatos Android y compilación de prueba firmada mediante proceso documentado |

### 11.1 Seguridad práctica

- Almacenar contenido en sandbox local. No asumir que SQLite está cifrada por defecto; **no prometer cifrado total**.
- Si la protección contra extracción física es un requisito posterior, evaluar cifrado real/SQLCipher, gestión segura de clave y riesgos de recuperación; Expo Go no permite probar todas las configuraciones nativas de SQLCipher.
- No mostrar títulos sensibles en contenido de notificaciones por defecto; texto genérico salvo opción explícita.
- No registrar texto de tareas en logs de errores o analítica por defecto.
- Para backups, advertir que el JSON exportado puede contener información sensible; nunca subirlo a la nube sin acción del usuario.
- Usar el selector de documentos del sistema para compartir/importar, no pedir acceso irrestricto a archivos.

### 11.2 Integridad ante cambios de fecha/zona

- Conservar fechas de compromiso correctamente; evitar recalcular vencimientos al cambiar la zona del teléfono.
- Acciones con fecha de disponibilidad (`YYYY-MM-DD`) dependen de fecha local, documentar comportamiento cuando cambia zona.
- Testear medianoche, cambio de mes/año, fechas en pasado, cambio de reloj, reinicios y doble ejecución de activación.

---

## 12. Estrategia de pruebas y calidad

### 12.1 Pirámide

1. **Unitarias de dominio**: todas las transiciones, invariantes, fechas, foco, proyectos y validaciones de entrada.
2. **Integración SQLite**: repositorios, migraciones, FK, transacciones, restauración de copia, integridad de datos y errores inyectados.
3. **Componentes**: estados vacío/error/cargando, accesibilidad, captura, aclaración, revisiones y diálogos.
4. **E2E Android**: recorridos de negocio y supervivencia ante reinicio/cierre.
5. **Pruebas exploratorias con personas reales**: intuición, descubrimiento y tasa de error.

### 12.2 Casos de prueba mínimos

| ID | Escenario | Resultado esperado |
|---|---|---|
| T-001 | Captura offline | Persiste y aparece una sola vez en inbox |
| T-002 | Doble toque Guardar | Una entrada, no duplicación |
| T-003 | Captura vacía / solo espacios | No se guarda, mensaje apropiado |
| T-004 | Falla de SQLite simulada | Conservar texto, no confirmar éxito |
| T-005 | Clasificar a referencia | Sale de inbox; aparece solo como referencia |
| T-006 | Clasificar a proyecto con acción | Transacción completa, relación íntegra |
| T-007 | Fallo a mitad de clasificar | No hay proyecto/acción parcial |
| T-008 | Acción WAITING | No aparece en NEXT/foco; conserva persona/resultado |
| T-009 | Activación por fecha | Ejecutada una sola vez, incluso en reinicios |
| T-010 | Fecha foco vs vencimiento | Foco no altera `due_at` |
| T-011 | Completar y deshacer | Estado/foco coherentes, historial consistente |
| T-012 | Completar proyecto con tareas pendientes | Solicita decisión, ninguna tarea desaparece |
| T-013 | Proyecto bloqueado | No afirma tener siguiente paso; invita a resolverlo |
| T-014 | Revisión interrumpida | Reanuda paso exacto |
| T-015 | Recuperación interrumpida | No cambia elementos no confirmados |
| T-016 | JSON válido exportar/importar | Restauración semántica completa |
| T-017 | JSON corrupto / versión futura | Se rechaza sin perder datos anteriores |
| T-018 | Migrate v1→v2 (cuando exista) | Preserva datos, índices e integridad |
| T-019 | Sin permisos de notificación | App sigue plenamente funcional |
| T-020 | Tema oscuro / textos largos / lector de pantalla | Flujos completos legibles y utilizables |
| T-021 | 5 000 elementos con búsqueda | Comportamiento correcto y rendimiento medido |
| T-022 | App reinstalada sin respaldo | Avisar del riesgo; no prometer restauración automática |
| T-023 | Cambio de zona horaria | Foco y fechas no se confunden con UTC |
| T-024 | Borrado total cancelado | Persisten todos los datos |
| T-025 | Borrado total confirmado | Limpieza completa comprobable |

### 12.3 Definition of Done por funcionalidad

- [ ] Criterios de aceptación `S#` relacionados implementados y rastreables.
- [ ] Pruebas pertinentes creadas primero donde corresponda y ejecutadas.
- [ ] `typecheck`, `lint` y suite afectada en verde o fallos transparentemente documentados.
- [ ] Operación probada en Android real/emulador cuando afecte comportamiento nativo.
- [ ] Estados vacío, error, permiso denegado y offline tratados si aplican.
- [ ] Accesibilidad relevante comprobada.
- [ ] Migración o cambio de datos cubierto por test cuando aplique.
- [ ] Documentación y changelog de decisión actualizados.
- [ ] Evidencia real de comprobaciones y commit registrado en documento ODD.
- [ ] UI alineada con tokens Clarunio, navegación contractual y pruebas UX-01 a UX-10 relevantes (sin copiar el contenido ilustrativo).
- [ ] Ninguna función fuera de alcance introducida sin autorización.

### 12.4 Pruebas de diseño UX/UI de Clarunio

| ID | Verificación visual / de interacción | Criterio |
|---|---|---|
| UX-01 | Primera apertura | Se comprende cómo capturar sin tutorial ni sesión |
| UX-02 | Captura rápida | Solo texto y guardar; ninguna clasificación obligatoria; se respeta el teclado |
| UX-03 | Aclaración | Las opciones GTD válidas se distinguen por texto + icono, con una pregunta por paso |
| UX-04 | Navegación | «Ahora», «Bandeja», «Proyectos», `+`, Buscar y Ajustes son localizables; ningún control se solapa |
| UX-05 | Proyectos | Estado y próximo paso son honestos; no hay porcentajes ficticios |
| UX-06 | Temas | Todas las pantallas tienen contraste y jerarquía coherentes en claro y oscuro |
| UX-07 | Accesibilidad | Fuente grande, lector de pantalla, áreas táctiles, reducción de movimiento y textos largos funcionan |
| UX-08 | Persistencia vs UI | Ningún toast/contador/chip anuncia acción o dato inexistente en SQLite |
| UX-09 | Recuperación | El lenguaje y el diseño no penalizan inactividad ni acciones pendientes |
| UX-10 | Consistencia de marca | Iconos/tokens violeta/lavanda, estados de componentes y microcopy español entre pantallas |

Los escenarios UX requieren evidencia observable en Android y pruebas humanas cuando sea necesario; no equivalen automáticamente a tests unitarios. No priorizar pixel-perfect sobre legibilidad y funcionamiento.

---

## 13. ODD de Gentleman: flujo de ejecución solicitado

**Fuente oficial consultada:** [Gentle AI — Usage: Organic Driven Development](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/usage.md). Esta referencia sigue `main` y puede diferir de la versión instalada; el agente debe comprobar **su instalación** en vez de copiar ciegamente instrucciones de otra versión.

### 13.1 Qué es ODD en este proyecto

ODD **no** significa que el agente implemente la app completa en un único prompt. El protocolo oficial distingue autorización, exploración, resolución de incertidumbres reales, clasificación por tamaño, seguimiento para trabajo sustancial, implementación por tareas con evidencia y cierre. En cambios grandes crea un documento de funcionalidad en `odd/tasks/<feature-name>.md`; en pequeños puede no requerir archivo de trabajo. La política de pruebas aplicable es test-first cuando existe resultado determinista comprobable.

### 13.2 Qué archivos gobiernan la implementación

- `docs/PRODUCT_SPEC.md`: **este documento**, visión maestra, límites e invariantes.
- `odd/tasks/<feature>.md`: artefacto ODD **de trabajo** creado por el agente para una funcionalidad autorizada; cada uno incorpora `## Specs`, `## Tasks` y `## Log`, IDs S#/tareas y evidencia observada.
- `docs/decisions/ADR-xxx.md`: solo para decisiones arquitectónicas con tradeoffs reales; no confundir con tareas ODD.
- `docs/TEST_PLAN.md`: matriz viva de pruebas y resultados por versión.
- `docs/RELEASE_CHECKLIST.md`: control de calidad/Play Store antes del lanzamiento.

### 13.3 Orden de implementación (hitos, no comandos mágicos)

| Hito | Resultado verificable | Dependencias | Puerta para cerrar |
|---|---|---|---|
| M0 — Bootstrap | Proyecto Expo arranca, TS strict, lint/tests, CI, README, navegación inicial, tokens mínimos de tema Clarunio | Ninguna | Build de desarrollo exitoso + comandos documentados |
| M1 — Datos y captura | SQLite migrado, repositorio Items, captura y bandeja funcionales con UI violeta/lavanda, persistencia offline | M0 | AC-01/02, T-001 a T-004 |
| M2 — Aclaración GTD | Asistente guiado con tarjetas de elección, estados y transiciones, referencia, siguiente, algún día, papelera | M1 | AC-03 parcial, T-005/07; tests de invariantes |
| M3 — Proyectos y espera | CRUD proyectos, tarjetas de resultado y siguiente paso, WAITING y bloqueos | M2 | AC-03/05/09, T-006/08/12/13 |
| M4 — Ahora y fechas | Foco, disponibilidad, vencimientos, completar/deshacer | M3 | AC-04/08, T-009/10/11/23 |
| M5 — Revisión y recuperación | Revisión reanudable y «Volver a organizarme» | M4 | AC-06, T-014/15 |
| M6 — Búsqueda, backups, ajustes | Búsqueda, export/import seguro, tema, ayuda, recordatorios | M5 | AC-07/10, T-016/17/19/24/25 |
| M7 — Endurecimiento | E2E, accesibilidad, UX-01 a UX-10, errores, datos semilla de pruebas, rendimiento y documentación | M6 | RNF verificables; 0 bloqueadores críticos |
| M8 — Beta privada | APK/AAB, instalación, uso personal real, feedback, correcciones | M7 | Checklist beta, hallazgos priorizados y pruebas repetidas |
| M9 — Publicación Play (solo con autorización) | Cuenta de desarrollador, política, Play Console, pruebas y lanzamiento | M8 | Cumplimiento actual verificado y consentimiento para gastos/publicación |

**Importante:** cada hito podrá dividirse en varios documentos ODD por característica cuando corresponda; la estrategia de PR/commit y de revisión la controla la versión instalada de ODD y las políticas reales del repositorio. No convertir «400 líneas» en límite rígido; en la documentación oficial se describe como heurística de planificación.

### 13.4 Cómo trabajar cada hito

1. Leer `PRODUCT_SPEC.md`, código existente y documentos ODD pertinentes.
2. Explorar riesgos concretos y dependencias; no interrogar por decisiones irrelevantes.
3. Verificar autorización para el hito y crear archivo ODD si el tamaño lo amerita.
4. Escribir especificaciones `S#` verificables, tareas pequeñas y tests del comportamiento.
5. Implementar cambios por porciones revisables y ejecutar checks reales.
6. Reportar pruebas que pasaron, fallaron o no se ejecutaron; no declarar verde por inferencia.
7. Actualizar `Log`/evidencia, commits y documentación afectada.
8. No comenzar por iniciativa propia el siguiente hito que implique cambio de alcance, gasto o publicación sin una instrucción del propietario.

### 13.5 Prompt inicial para tu agente con Gentleman ODD

Copiar y pegar **después de añadir este archivo como `docs/PRODUCT_SPEC.md` en el repositorio**:

> Lee íntegro `docs/PRODUCT_SPEC.md`; es la especificación maestra vigente. Trabajaremos con tu protocolo Organic Driven Development (ODD) instalado, no con un flujo SDD alternativo. **Te autorizo a implementar solo M0 — Bootstrap**. Primero explora el repositorio (si está vacío, documenta ese estado), comprueba versiones compatibles de Expo, React Native y TypeScript, revisa dependencias y los comandos de prueba disponibles. Prepara únicamente los **tokens mínimos de identidad violeta/lavanda Clarunio y la navegación base vacía**, conforme a las secciones 4, 5 y 14; **no** implementes pantallas con datos ficticios ni funcionalidades de M1. Para esta labor sustancial, crea el documento ODD de característica que corresponda según tu instalación. Desglosa specs y tasks con criterios comprobables, aplica test-first cuando haya un comportamiento determinista, implementa sin añadir funciones fuera de M0, ejecuta verificaciones y registra evidencia. Al cerrar, indica exactamente qué se implementó, comandos y resultados ejecutados, riesgos y qué falta para M1. No digas que M1 está implementado ni inicies M1 sin nueva autorización.

### 13.6 Ejemplo de prompt para continuar

> Lee `docs/PRODUCT_SPEC.md` y el estado actual de ODD/Engram que realmente esté disponible. **Te autorizo a implementar M1 — Datos y captura** con los requisitos RF-01 a RF-04 y los criterios AC-01/AC-02. Sigue ODD y prueba persistencia offline, doble guardado y fallo simulado de escritura. Conserva lo que M0 ya funciona, respeta los patrones visuales de las secciones 4, 5 y 14 y verifica UX-02/UX-04/UX-08 en lo que aplique; ejecuta las pruebas afectadas y no avances a M2 sin autorización.

---

## 14. Diseño visual, branding y sistema de componentes

### 14.1 Decisión visual aprobada y procedencia

**Estilo objetivo: Clarunio, UI violeta/lavanda (21/10/2026).** Inspiración exclusiva de la **estética** de la imagen que proporcionó el propietario (títulos gruesos en violeta, tarjetas y chips con bordes redondeados, fondos suaves, paneles limpios) y del mockup conceptual posterior de tres pantallas de Clarunio. El diseño final es **original** y orientado a GTD. No replicar contenido «Choose your Topic», categorías educativas, fotografías, ilustraciones ajenas o composición exacta.

**Prioridad visual:** (1) contratos escritos en este documento; (2) tokens y patrones de esta sección; (3) mockup opcional como inspiración; (4) gusto subjetivo del agente. La imagen no autoriza nuevas funciones y puede contener textos, indicadores o navegación erróneos para el MVP.

**Referencia adjuntable por el propietario:** `docs/design/clarunio-ui-concept.png` (archivo de inspiración, no es un asset de producción). Si no existe en el repositorio, **esta especificación textual es suficiente**. No detener el desarrollo ni inventar su existencia.

### 14.2 Identidad visual y logo

- Marca de trabajo: **Clarunio**, palabra limpia con C mayúscula y resto en minúsculas; su uso legal definitivo depende de comprobaciones de marca independientes.
- **Identidad actual propuesta:** monograma abstracto `C`/hoja plegada o check estilizado, limpio, reconocible a 48 dp; cuadrado redondeado violeta profundo con símbolo claro/lavanda. El mockup ya utiliza esta orientación.
- El logotipo anterior azul marino/cian y sus ondas de portada quedan como exploración histórica, **no** como paleta activa. No mezclar ambas identidades arbitrariamente.
- El monograma **no** debe parecer un check genérico de lista copiado de terceros. Simplificarlo a figura geométrica propia con suficiente espacio negativo.
- Sistema de marca: icono cuadrado, isotipo solo, logotipo horizontal con palabra «Clarunio» y variante monocroma; versiones para fondo claro y oscuro.
- **No utilizar un recorte de un mockup de IA como icono final de Play Store.** El asset final debe diseñarse/limpiarse como original de alta resolución y revisarse a tamaño pequeño; preparar Android adaptive icon con foreground y background separados, además de splash, cuando se implemente branding en M0/M8 según prioridad.
- Archivos deseados al materializar diseño: `src/assets/brand/` (PNG transparentes y, si se produce, SVG fuente), tokens en `src/shared/theme/`; no afirmar que están entregados solo por describirlos.

### 14.3 Tokens de diseño — propuesta inicial en hexadecimal

**Estos hex son especificación propuesta para la implementación, no una medición colorimétrica de la imagen generada.** Se pueden refinar por contraste y pruebas de dispositivo, documentando la modificación. El violeta es el acento predominante; colores secundarios solo en contenedores no críticos.

| Token | Claro | Uso previsto |
|---|---|---|
| `color.background` | `#FAF8FF` | Fondo general lavanda casi blanco |
| `color.surface` | `#FFFFFF` | Tarjetas, sheets y componentes |
| `color.surfaceSoft` | `#F3EEFF` | Tarjetas educativas/revisión, selección suave |
| `color.primary` | `#6526CF` | CTA, foco y selección |
| `color.primaryPressed` | `#4F1AA9` | Estado presionado |
| `color.primarySoft` | `#EDE4FF` | Iconos/fondos seleccionados |
| `color.text` | `#21133F` | Títulos y texto principal |
| `color.textSecondary` | `#655C78` | Metadatos legibles |
| `color.outline` | `#E7E0F2` | Contorno sutil de tarjeta/campo |
| `color.mintSoft` | `#E2F8F0` | Decoración contextual con iconos |
| `color.blueSoft` | `#E6F3FF` | Decoración contextual con iconos |
| `color.pinkSoft` | `#FFEAF2` | Decoración contextual con iconos |
| `color.amberSoft` | `#FFF3DE` | Decoración contextual con iconos |
| `color.error` | `#B42335` | Error real, siempre acompañado de texto |
| `color.success` | `#16794C` | Confirmación real, acompañada de texto |

**Modo oscuro — tokens iniciales:** `background: #151021`, `surface: #21192F`, `surfaceSoft: #2C2141`, `primary: #B69AFF`, `primaryPressed: #CDBAFF`, `text: #F7F2FF`, `textSecondary: #C9BFDC`, `outline: #463955`. Pasteles muy suaves se sustituyen por tonos semioscuros controlados, no se trasladan literalmente del tema claro. Colores semánticos error/éxito necesitarán variantes oscuras validadas.

**Condiciones:**

- No utilizar colores solo para estado; texto/código de icono accesible.
- Evitar más de un gran CTA saturado por pantalla y los gradientes intensos en listas.
- Gradientes violetas discretos solo en icono/hero o foco relevante, no en todos los componentes.
- Probar contrastes reales; si una combinación falla WCAG AA, cambiar tokens antes de release.

### 14.4 Tipografía, geometría y espaciado

- Tipografía: sans-serif moderna legible; preferir la del sistema o una fuente libre optimizada que se integre por `expo-font` **solo si se justifica**. No depender de una fuente usada en el mockup sin licencia.
- Jerarquía inicial Android (sp, respetando escala de fuente): título hero 30–34 / semibold-bold; título pantalla 25–28 / bold; sección 18–20 / semibold; cuerpo 15–16 / regular-medium; metadato 13–14 / regular. **No fijar tamaños absolutos no escalables**.
- Espaciado base de 4 dp, secuencia `4/8/12/16/20/24/32`; margen horizontal pantalla sugerido 20–24 dp en móvil típico.
- Radios sugeridos: input/chip 12–16 dp; tarjetas 18–22 dp; panel destacado 24–28 dp; pill y FAB con radio completo.
- Botones principales alto al menos 48–52 dp, FAB alrededor de 56 dp, áreas táctiles 48 dp o más; responsive ante fuentes grandes.
- Sombras muy suaves y bordes tenues en tema claro; en oscuro preferir elevación tonal/bordes y no sombras pesadas.
- Iconografía lineal, grosor consistente y tamaño 18–24 dp; una sola familia y buen uso de iconos accesibles.

### 14.5 Patrones visuales reutilizables

| Patrón | Contrato de diseño | Dónde se usa |
|---|---|---|
| `BrandHeader` | Logo pequeño, búsqueda o ajustes cuando aplica, sin barra saturada | Ahora / Proyectos |
| `PageHero` | Título contundente, subtítulo breve, sin más de dos bloques textuales | Ahora / Bandeja / Proyectos |
| `SummaryChip` | Icono y contador/etiqueta con número real, fondo pastel | Inicio, resúmenes de recuperación |
| `ActionCard` | Checkbox grande, título legible, metadato real y acción de detalle | Ahora / Siguientes |
| `InboxCard` | Icono contenedor pastel, texto crudo, información temporal discreta | Bandeja |
| `ProjectCard` | Resultado, estado textual, siguiente/esperando; icono pastel | Proyectos |
| `GuidedChoiceCard` | Selección con borde violeta y descripción corta, no solo color | Aclaración |
| `ReviewCard` | Tarjeta lavanda con CTA, contadores reales si aplica | Ahora / Revisar |
| `BottomTabs` | Tres destinos etiquetados siempre visibles y estado seleccionado | Pantallas principales |
| `CaptureFAB` | Botón `+` violeta con etiqueta accesible «Capturar», por encima de tabs sin solapamiento | Pantallas principales |
| `EmptyState` | Icono discreto, mensaje amable, CTA útil | Todas las listas |
| `ActionFeedback` | Snackbar/toast de éxito real o error con texto; opción deshacer cuando corresponda | Mutaciones |

No desarrollar un *design system* gigantesco durante M0. Crear componentes cuando su primera pantalla los necesite, con tokens compartidos desde el inicio.

### 14.6 Comportamiento y transiciones

- Captura: teclado abierto, CTA accesible y visible; evitar pérdida de texto por cerrar accidentalmente.
- Estados de botones: enabled, pressed, disabled, loading, error/success reales; prevenir doble toque.
- Controles seleccionados en asistente: borde violeta + ícono/marca + texto; no depender solo de tinte.
- Tarjetas con acción de toque distinguible de checkbox/completar; no hacer que tocar la tarjeta complete una tarea por error.
- Animaciones opcionales y breves (ej. 120–220 ms para entrar/salir de sheets), desactivadas/reducidas según preferencia del sistema; sin librería pesada por una transición simple.
- Preservar desplazamiento y foco tras regresar de detalle; teclado no tapará CTA.
- Confirmaciones destructivas inequívocas; en completado o movimiento reversible ofrecer «Deshacer».
- No volver a solicitar permiso de notificación en cada inicio tras denegación.

### 14.7 Anti-patrones: lo que NO debe copiarse del concepto visual

1. **No convertir «Hoy» en lista automática de tareas vencidas** ni marcar «Due today» salvo `due_at` real.
2. **No añadir prioridad alta o banderas** solo porque aparecen en el mockup.
3. **No implementar porcentajes de progreso de proyectos** a partir de cantidad de tareas; la barra del mockup no es un requisito.
4. **No introducir micrófono, adjuntos, estadísticas, gráfico de barras ni cuentas** durante MVP.
5. **No mezclar captura y aclaración en la misma obligación de guardar**; UI-02 y UI-04 son flujos separados.
6. **No cambiar a cuatro pestañas «Today/Projects/Search/Settings»** por copiar la imagen. Mantener Ahora/Bandeja/Proyectos + acceso rápido a Buscar/Ajustes.
7. **No crear contenido placeholder como si proviniera de SQLite real**; usar datos semilla solo en storybook/prototipo/pruebas explícitas, nunca presentarlos como datos del usuario.
8. **No conservar textos en inglés** ni pantallas hardware iOS en producto Android por fidelidad a la composición del mockup.
9. **No añadir nombres, ilustraciones, logotipos o iconos idénticos a terceros**; crear assets originales/licenciados.

### 14.8 Estados de diseño obligatorios y entrega por pantalla

Para cada UI implementada, el agente documentará (cuando aplique): **vacío**, **con datos**, **cargando**, **error**, **sin conexión (sin bloquear operaciones locales)**, **texto largo**, **fuente grande**, **modo oscuro** y **teclado visible**. No considerar terminada una vista únicamente porque coincide con una imagen estática.

**Evidencia mínima por pantalla terminada en ODD:** captura o grabación de emulador/dispositivo Android real mostrando contenido y vacío, comprobación de interacción real, accesibilidad básica, contraste revisado y enlaces a pruebas ejecutadas. Si no hay entorno visual disponible, reportar el límite y no inventar capturas.

### 14.9 Archivos y contratos visuales para el agente

Al implementar la primera pantalla, sugerencia incremental:

```text
src/shared/theme/
├── colors.ts              # tokens por tema
├── typography.ts          # escalas en sp y pesos
├── spacing.ts             # espaciado/radios
└── useAppTheme.ts         # sistema/claro/oscuro
src/shared/ui/             # componentes reales a medida que se necesitan
src/assets/brand/          # icono y logo finales solo cuando existan
```

**Definition of Done UX/UI:** patrón correcto, textos es-PE, estados y contraste, accesibilidad, sin funcionalidades inventadas, equivalencia en tema oscuro y sin cambio de semántica GTD. La imagen conceptual ayuda a revisar estética, **no** sirve como evidencia de una app funcionando.

---

## 15. Plan de validación con usuarios

### 15.1 Etapa personal (antes de Play Store)

- Usar la app durante **14 días** para capturar compromisos reales.
- Mantener un registro breve de fricciones: pasos innecesarios, ideas no encontradas, tareas confusas, bloqueos, fallos, recordatorios molestos.
- Al menos dos revisiones semanales o intentos de revisión durante el periodo, documentando el resultado real.
- Probar intencionalmente «Volver a organizarme» después de acumular entradas en un conjunto de prueba; no fabricar supuesta adopción general por una prueba individual.
- Practicar exportación y restauración en instalación de prueba antes de confiar datos importantes exclusivamente a la app.

### 15.2 Pruebas con principiantes

Entre 5 y 8 participantes en la primera ronda, idealmente algunos sin experiencia en GTD; esto es un **tamaño de prueba de usabilidad exploratoria**, no muestreo estadístico de mercado.

**Tareas observables sin explicar el producto previamente:**

1. Anota «recordar renovar documento».
2. Convierte «preparar una presentación» en proyecto y añade el primer paso.
3. Marca «esperando respuesta del profesor».
4. Elige qué hacer hoy sin fijar fecha límite.
5. Encuentra una tarea guardada y complétala.
6. Recorre una revisión y vuelve a ella tras salir.

**Registrar:** tasa de éxito, intentos, preguntas, textos malinterpretados, tiempo, uso de ayuda, errores de navegación, comprensión de tarjetas violeta/lavanda, detección del `+`, distinción entre capturar y aclarar, y valoración cualitativa. Ajustar producto según evidencia; no añadir funcionalidad compleja para resolver una etiqueta ambigua.

### 15.3 Validación de oportunidad comercial (futura)

Entrevistar personas distintas del creador: frecuencia de dolor, soluciones actuales, motivos para abandonar apps, necesidad de sincronización y disposición a pagar. No asumir monetización por instalar ni por número de características.

---

## 16. Privacidad, publicación y cumplimiento

### 16.1 Android/Google Play

**Checklist previo al release público (revalidar en la fecha exacta):**

- Target Android API actual exigido por Play. Consulta oficial al 19/10/2026: [Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878), requisito API 36 para apps nuevas/actualizaciones convencionales desde 31/08/2026.
- Generar artefacto **AAB** firmado para Play; usar APK para instalación directa/pruebas si corresponde, con versionado `versionCode`, `versionName`, identificador de paquete fijo y keystore custodiada.
- Revisar [Play Console User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311): política de privacidad aplicable y declaraciones coherentes con el comportamiento real.
- Completar el formulario [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469), aunque no se recojan datos remotos; considerar librerías/SDK de terceros y datos exportados según políticas exactas.
- Para cuentas personales de desarrollador creadas desde el 13/11/2023, Google indica prueba cerrada con al menos **12 testers durante 14 días continuos** antes de solicitar acceso a producción; verificar el estado de la cuenta y la política actual: [Play Console testing](https://support.google.com/googleplay/android-developer/answer/14151465).
- Si en el futuro se permite **crear una cuenta**, ofrecer solicitud de eliminación tanto dentro de la app como mediante recurso web y eliminar datos vinculados conforme a reglas aplicables: [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111). En el MVP sin cuenta no corresponde inventar pantalla de «eliminar cuenta».
- Solicitar permiso de notificaciones solo cuando el usuario active una función que lo necesite y ofrecer modo funcional sin ese permiso.
- Preparar icono, capturas de pantalla originales, descripción honesta, datos de contacto, clasificación de contenido, web de privacidad y prueba real en Android.
- No afirmar cifrado, respaldo automático, sincronización, IA ni disponibilidad en iOS si no existen.

### 16.2 Ley peruana de datos personales

Si se comercializa, recopilan datos personales o habilitan servicios remotos en Perú, analizar la **Ley N.° 29733** y el reglamento aprobado por **D. S. N.° 016-2024-JUS**, vigente desde el **31 de marzo de 2025**, además de requisitos aplicables de consentimiento, información, seguridad y atención de derechos. Fuente oficial: [Autoridad Nacional de Protección de Datos Personales — nuevo reglamento](https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales). Este apartado no sustituye asesoría jurídica antes de operar públicamente.

### 16.3 Derechos, marcas y propiedad intelectual

GTD® / Getting Things Done® son marcas identificadas por sus titulares. Evitar utilizar «GTD» en el **nombre comercial** o sugerir afiliación/aprobación oficial sin licencia; en descripciones educativas usar referencias correctas y revisar condiciones de marca. No copiar iconos, pantallas, textos extensos, assets ni identidad visual de Todoist, Nirvana o Things. Solo aprender de patrones generales de UX.

### 16.4 Política de contenidos y notificaciones

La app no debe enviar contenido de tareas al desarrollador en la versión offline. La exportación voluntaria a servicios externos pasa por elección del usuario. Los avisos no deben prometer resultados «científicamente garantizados», evitar mensajes culpabilizadores y no usar información sensible como texto de notificación predeterminado.

---

## 17. Riesgos, decisiones técnicas y mitigaciones

| ID | Riesgo | Impacto | Mitigación / evidencia requerida |
|---|---|---|---|
| R-01 | Pérdida de datos al cambiar celular | Alto | Export/import desde MVP; advertencia clara sin sync; pruebas de restauración |
| R-02 | Complejidad UX al mostrar GTD | Alto | Captura mínima; ayuda contextual; pruebas de novatos |
| R-03 | Proyecto sin próxima acción | Medio | Detector de bloqueos y revisión, sin autorellenar acciones |
| R-04 | Confundir foco con vencimiento | Alto | Campos y reglas separados, pruebas AC-04 |
| R-05 | Migración SQLite defectuosa | Alto | Versionado, pruebas con fixtures antiguos y rollback apropiado |
| R-06 | Dependencia de red/IA innecesaria | Medio | Algoritmos locales deterministas, servicios futuros opcionales |
| R-07 | Notificaciones intrusivas | Medio | Opt-in, recordatorios explícitos, opciones de desactivación |
| R-08 | Scope creep del agente | Alto | Hitos autorizados, ODD por funcionalidad, lista fuera de alcance |
| R-09 | Requisitos Play cambian | Medio | Revalidación documental al publicar |
| R-10 | Falsa afirmación de seguridad | Alto | Documentar persistencia local sin cifrado garantizado; evaluar protección posterior |
| R-11 | Clasificador semántico poco fiable | Medio | No decidir por IA ni regex; usuario elige y valida |
| R-12 | Código sobrediseñado | Medio | Una app Expo, repositorios solo necesarios, no backend preventivo |
| R-13 | Diferencias entre versión de Gentle AI y docs `main` | Medio | Inspeccionar versión instalada, adaptar sin romper protocolo |

### 17.1 Registro de decisiones iniciales (ADR candidates)

- ADR-001: Android primero, iOS después de validar.
- ADR-002: local-first sin autenticación ni backend MVP.
- ADR-003: SQLite como única fuente de verdad de datos de productividad.
- ADR-004: aclaración determinista guiada, no IA generativa.
- ADR-005: distinguir fecha de foco, disponibilidad y fecha límite.
- ADR-006: backup JSON completo e importación por reemplazo atómico.
- ADR-007: seguridad con mínimos permisos, sin claims de cifrado inexistente.

Crear ADRs solo si el agente necesita documentar una decisión de arquitectura; la tabla es registro inicial suficiente.

---

## 18. Plan de entregables y estructura documental final

Al terminar M8, el repositorio debe contener documentos **actuales y coherentes con código comprobado**:

1. `README.md`: qué es, alcance real, requisitos, instalación y comandos de desarrollo/validación.
2. `docs/PRODUCT_SPEC.md`: especificación maestra vigente y registro de cambios sustanciales.
3. Documentos ODD `odd/tasks/*.md` para funciones sustanciales implementadas, con evidencia.
4. `docs/TEST_PLAN.md`: escenarios, comandos, niveles y resultados reales.
5. `docs/USER_GUIDE.md`: guía breve para usuario común, sin jerga obligatoria.
6. `docs/RELEASE_CHECKLIST.md`: versiones, artefactos y requisitos verificados en fecha.
7. `docs/decisions/` únicamente decisiones arquitectónicas que ameriten historial.
8. Archivos de migraciones versionadas, tests y workflows CI.
9. Material de identidad Clarunio y referencia UX/UI (cuando exista con derechos de uso y exportación correcta); icono final y materiales originales de tienda **solo** cuando sean necesarios para compilar/publicar.

### 18.1 Evidencia esperada por hito

- Código de funcionalidad y tests que prueben criterios.
- Registro del resultado de los comandos ejecutados (no solo orden sugerida).
- Demostración reproducible cuando el hito afecta UI.
- Identificación de regresiones corregidas y problemas pendientes.
- Documento ODD de trabajo actualizado y commit(s) reales cuando corresponda.

### 18.2 Checklist de salida de MVP

- [ ] Se puede usar sin internet, sin registro y sin tutorial.
- [ ] Captura, bandeja y clasificación funcionan después de reiniciar.
- [ ] Proyectos, siguientes, esperando, algún día y referencias muestran estados correctos.
- [ ] Foco, vencimientos y fecha de activación no se mezclan.
- [ ] Revisión y recuperación son reanudables sin cambios involuntarios.
- [ ] Búsqueda, restauración y papelera son funcionales.
- [ ] Backup completo y restauración segura probados en instalación de prueba.
- [ ] Migraciones y cambios del dominio cubiertos por tests.
- [ ] UI Clarunio violeta/lavanda coherente con secciones 4, 5 y 14, en modo claro/oscuro, accesible y con estados de error y permisos denegados.
- [ ] Captura y aclaración siguen flujos separados; sin métricas, prioridades ni progresos inventados desde el mockup.
- [ ] Build Android instalable probado en dispositivo.
- [ ] No se afirma sincronización o cifrado no implementados.
- [ ] Uso personal documentado y principales fricciones resueltas.

---

## 19. Ejemplo completo de comportamiento de referencia

**Contexto:** alguien anota «entregar proyecto de programación».

1. Pulsa `+` y escribe la frase → `INBOX` sin fecha ni categoría.
2. Más tarde abre Bandeja, pulsa la entrada y responde «sí, requiere acción».
3. El sistema pregunta «¿cuál es el siguiente paso concreto?»; escribe «revisar requisitos pendientes».
4. Indica que necesita varios pasos → crea proyecto `Entregar proyecto de programación` con resultado `Proyecto entregado y validado`.
5. Guarda la siguiente acción `Revisar requisitos pendientes` como `NEXT` vinculada al proyecto.
6. En Ahora decide enfocar esa acción sin crear vencimiento.
7. La marca completa; la app pregunta si desea elegir otra acción del proyecto, pero no completa el proyecto automáticamente.
8. Crea `Pedir revisión al compañero`; al enviarla la mueve a `WAITING` con `waiting_for = revisión del compañero` y seguimiento opcional.
9. Durante la revisión semanal aparece el proyecto como bloqueado/esperando; no se inventa una acción ejecutable.
10. Cuando llega respuesta, convierte la espera en `NEXT` («corregir observaciones»), sigue avanzando y eventualmente marca el resultado del proyecto como alcanzado.

**Resultado UX:** la persona ejecutó un sistema GTD sin necesitar conocer las palabras técnicas al inicio.

---

## 20. Matriz básica de trazabilidad

| Capacidad | Requisitos | Flujos | Pruebas | Hito |
|---|---|---|---|---|
| Captura/bandeja | RF-01–04 | FL-01 | T-001–004 | M1 |
| Aclaración/no accionables | RF-05–07 | FL-02 | T-005, T-007 | M2 |
| Proyectos/espera | RF-08,10,11,14 | FL-02, FL-04 | T-006,08,12,13 | M3 |
| Fechas y enfoque | RF-09,12,13 | FL-03, FL-05 | T-009–011,023 | M4 |
| Revisión/recuperación | RF-15,16,25 | FL-06, FL-07 | T-014,015 | M5 |
| Búsqueda/backup/configuración | RF-17–23 | FL-08 | T-016–020,024,025 | M6 |
| Robustez y liberación | RF-24 + RNF | Todos | T-021–023 + E2E | M7–M9 |
| Dirección UX/UI Clarunio | RNF-05,06,15 + secciones 4/5/14 | UI-01–UI-13 | UX-01–10 + pruebas de componentes | M0–M8 (incremental) |

Esta matriz debe mantenerse actualizada cuando se modifican requisitos. No declarar requisitos implementados solo porque figuran en la matriz.

---

## 21. Bibliografía y fuentes verificables

**Método y comparadores:**

1. Getting Things Done, «What is GTD?»: https://gettingthingsdone.com/what-is-gtd/
2. Todoist, «El método GTD con Todoist»: https://www.todoist.com/es/help/todoist/get-started/getting-things-done-gtd-with-todoist-e5j2h3
3. Nirvana, «Quick Guide»: https://www.nirvanahq.com/help/quick-guide
4. Nirvana, «Do a weekly review»: https://www.nirvanahq.com/help/how-to/weekly-review
5. Nirvana, «Use the Nirvana AI assistant»: https://www.nirvanahq.com/help/ai/using-the-chat-panel
6. Things, «Today, Upcoming, Anytime and Someday»: https://culturedcode.com/things/support/articles/4001304/
7. Things, «Scheduling To-Dos»: https://culturedcode.com/things/support/articles/2803579/

**ODD y arquitectura:**

8. Gentleman Programming, Gentle AI ODD usage: https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/usage.md
9. Gentleman Programming, Intended Usage: https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/intended-usage.md
10. Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
11. Expo SDK reference: https://docs.expo.dev/versions/latest/
12. Android Developers, «Offline-first»: https://developer.android.com/topic/architecture/data-layer/offline-first
13. Android Developers, «Guide to app architecture»: https://developer.android.com/topic/architecture

**Publicación / privacidad:**

14. Google Play target API: https://support.google.com/googleplay/android-developer/answer/11926878
15. Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
16. Google Play User Data: https://support.google.com/googleplay/android-developer/answer/10144311
17. Google Play Account Deletion: https://support.google.com/googleplay/android-developer/answer/13327111
18. Google Play Testing Requirements: https://support.google.com/googleplay/android-developer/answer/14151465
19. Perú ANPD, nuevo reglamento de Protección de Datos Personales: https://www.gob.pe/institucion/anpd/campa%C3%B1as/128319-nuevo-reglamento-de-proteccion-de-datos-personales

**Nota de verificación:** contenidos consultados en torno al 19/10/2026. Los enlaces normativos y versiones deben revisarse **de nuevo antes de publicar**; los requisitos cambian con el tiempo. Las metas de UX y decisiones de arquitectura de este documento son propuestas de ingeniería, no hechos empíricos extraídos de esas fuentes.

---

## 22. Control de cambios

| Versión | Fecha | Descripción |
|---|---|---|
| 1.0 | 2026-10-19 | Especificación maestra inicial para implementación incremental con Gentleman ODD |
| 1.1 | 2026-10-21 | Marca de trabajo Clarunio; nueva dirección UI violeta/lavanda inspirada en referencia del propietario; actualizadas secciones 4, 5 y 14, navegación y flujos aclarados frente al mockup, tokens, componentes, estados, pruebas UX y trazabilidad; sin ampliar alcance funcional |

**Estado de autorización inicial:** se autoriza el uso de esta especificación para planificación y el trabajo que el propietario asigne expresamente. La entrega de este archivo **no significa** que el agente tenga autorización de comprar servicios, publicar en Play Store, recopilar datos personales ni implementar todas las versiones futuras de forma autónoma.
