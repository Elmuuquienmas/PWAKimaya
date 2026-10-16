# Laboratorio de Pruebas - PWA Kimaya

## Repositorios

- PWA (mando y companion): https://github.com/Elmuuquienmas/PWAKimaya
- API Spring Boot: https://github.com/Elmuuquienmas/Kimaya-api
- PWA publicada: https://kimaya-companion.pages.dev

## Descripción del Proyecto

Kimaya es una PWA que funciona como un mando/control de juego web. La interfaz del control se basa en `Gamepad.jsx` y `ControllerPage.jsx`. Este laboratorio valida su integración transaccional y su comportamiento offline frente a una API RESTful.

Cada botón del mando se manda por WebSocket al juego y además se registra con `POST /api/v1/commands` en la API. El panel de Historial consulta `GET /api/v1/commands` y muestra los últimos comandos guardados.

## Requisitos Técnicos

El entorno del laboratorio requiere:

- PostgreSQL 17 (Supabase)
- JDK 21
- Node 24

## Manejo Offline (PWA)

Si se pierde la conexión, las acciones del mando se almacenan temporalmente en IndexedDB usando el Service Worker. Cuando se recupera el internet, esas acciones se envían mediante Background Sync.

La cola se llama `kimaya-commands` y vive en la base de IndexedDB `workbox-background-sync`. Se configura en `vite.config.js` (ruta `NetworkOnly` con `backgroundSync` para el POST a la API).

## Scripts SQL

En `sql/` están los scripts de aprovisionamiento. Se corren en el SQL Editor de Supabase en este orden:

| Script | Para qué sirve |
| --- | --- |
| `01_esquema.sql` | Crea `game_sessions` y `command_logs` (la API usa `ddl-auto=validate`, no las crea sola). |
| `02_carga_inicial.sql` | Inserta la sesión de prueba `id = 1` que usa la PWA y un comando de ejemplo. |
| `03_limpieza.sql` | Vacía las tablas y reinicia los ids para repetir el laboratorio. |
| `04_consultas_verificacion.sql` | Consultas para las capturas de antes y después, y revisión de integridad. |

## Pasos para levantar el laboratorio

1. Correr `01_esquema.sql` y `02_carga_inicial.sql` en Supabase.
2. En `kimaya-api`, crear un `.env` con `DB_PASSWORD="..."` (no se sube al repo) y ejecutar:
   ```bash
   set -a && source .env && set +a && mvn spring-boot:run
   ```
   La API queda en `http://localhost:8080/api/v1/commands`.
3. En `PWA`, ejecutar `npm install` y `npm run dev` (http://localhost:5173).
4. Opcional, para que el mando también hable con un "juego": `npm run simulador` (WebSocket en `ws://localhost:8082/mando`) y activar "Simular conexión" en el panel de demo.
5. Para probar el Service Worker y el modo offline se usa la versión compilada: `npm run build` y `npm run preview` (http://127.0.0.1:4173).

## Casos de prueba

Pruebas de envío de comandos:

1. Envío de comandos del mando hacia la API y verificación de respuesta 201.
2. Comando con sesión inexistente: la API responde 404 y no inserta nada.
3. Sin conexión: el POST queda en la cola `kimaya-commands` de IndexedDB y se envía solo al volver la red.

Pruebas de renderizado:

1. Abrir el panel Historial: la PWA hace `GET /api/v1/commands` y muestra los últimos 20 comandos con su id, botón y hora.
2. En consola aparece `API -> PWA: N comandos recibidos` con los datos que se pintaron.
3. Con la API apagada, el panel muestra "No se pudo consultar la API de comandos." sin romper la pantalla.

## Explicación de evidencias

Las fotos de la carpeta `evidencias/` demuestran tres cosas: la persistencia en la base de datos (una captura de la tabla `command_logs` antes del envío y otra después, mostrando la fila nueva), el performance log que imprime Spring Boot en consola por cada petición (con el tiempo de respuesta en milisegundos y la memoria de la JVM consumida), y las métricas de red/offline capturadas desde las DevTools del navegador (pestaña Network y Application, para ver el registro del Service Worker y las peticiones encoladas cuando no hay conexión).

Capturas de pantalla de la base de datos:

1. `01_db_estado_inicial_antes_de_pruebas.png`: `command_logs` con una sola fila antes de las pruebas.
2. `03_db_despues_del_post.png`: la misma consulta después del POST, con la fila nueva.

Logs de Spring Boot:

1. `02_logs_springboot_post.png`: SQL de Hibernate y performance log del `POST /api/v1/commands` (201, tiempo en ms y memoria de la JVM).
2. `07_logs_springboot_get.png`: performance log del `GET /api/v1/commands` (200, tiempo y memoria).

PWA y DevTools del navegador:

1. `04_pwa_interfaz_consola.png`: consola con los comandos enviados al juego (`Mando -> juego`) y la respuesta de la API (`Mando -> API`).
2. `05_pwa_network.png`: pestaña Network con la petición POST, estado 201, encabezados, tamaño y tiempos.
3. `06_pwa_offline_indexeddb.png`: Application > Service Workers con `sw.js` activo (`activated and is running`) y, en el árbol, IndexedDB > `workbox-background-sync` > `requests`.
4. `08_pwa_listado_get.png`: panel Historial con la lista de comandos traída por GET y la consola con `API -> PWA`.
