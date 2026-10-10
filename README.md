# Kimaya Companion — propuesta de PWA

Companion app para el juego de plataformas **Kimaya: El Bosque del Eco**. El celular se usa como mando y, cuando la partida está en pausa o todavía no empieza, también como bitácora: lore del bosque e historial de partidas.

El juego de PC vive en otro repositorio y no se modifica desde aquí. Este repo es solo la aplicación web.

## Por qué así

La rúbrica pide tres cosas: consumir una API y pintar listas, funcionar como PWA (service worker, manifest, offline) y una interfaz modular, hecha para celular.

Por eso la app no guarda las partidas dentro del teléfono como única fuente. El juego, al cerrar un nivel, escribe el resultado en Supabase. La PWA lee esa misma base. Así el historial y el lore se pueden ver aunque la computadora esté apagada.

El mando es otro canal. Los botones no pueden irse a la nube porque se sentirían tarde. Van por WebSocket, en la red local, directo a la PC donde está abierto el juego.

## Topología

```mermaid
flowchart LR
  telefono["Celular con la PWA"]
  pages["Cloudflare Pages"]
  supabase[("Supabase")]
  juego["Kimaya en la PC"]

  telefono -->|"abre la app por HTTPS"| pages
  telefono -->|"consulta partidas y lore"| supabase
  juego -->|"guarda la partida y lo desbloqueado"| supabase
  telefono -->|"WebSocket en la red local"| juego
```

El QR lo muestra el juego en la PC. Al escanearlo, el celular abre la PWA con la IP y el puerto de esa computadora:

`https://<dominio-de-la-pwa>/?ip=192.168.1.20&port=8080`

La persona escribe su nombre en la app. Con ese nombre se busca su fila en Supabase y, si no existe, se crea. A partir de ahí el historial y el lore son de esa persona.

## Qué ve el jugador

La ventana va siempre en horizontal, como un control.

- Si el juego **no ha empezado** o está **en pausa**, arriba hay dos menús desplegables: Lore e Historial.
- Si la partida **está corriendo**, esos menús se guardan y se queda el mando.
- **Falin** usa tema amarillo. Además de la cruceta y los botones de acción, tiene Empujar y Salto impulsado.
- **Mia** usa tema rosa. Sus botones extra son Olfato y Espacio estrecho.
- Si el personaje recibe daño, la pantalla destella. Si la vida queda baja, se nota en la interfaz. Si vence a un enemigo, también hay un aviso corto.
- Para la presentación, sin tener el juego conectado, hay botones de demo que disparan esos mismos avisos y el cambio de personaje.

```mermaid
stateDiagram-v2
  [*] --> SinPartida
  SinPartida --> Jugando: el juego avisa que empezó
  Jugando --> EnPausa: el juego avisa pausa
  EnPausa --> Jugando: el juego avisa que sigue
  SinPartida --> Desconectado: se pierde la red
  Jugando --> Desconectado: se pierde la red
  EnPausa --> Desconectado: se pierde la red
  Desconectado --> SinPartida: vuelve la red y aún no hay partida
```

En SinPartida y en EnPausa se pueden abrir Lore e Historial. En Jugando solo el mando. En Desconectado aparece la pantalla de sin conexión, pero los menús siguen disponibles con lo último que se guardó en caché, y desde ahí se puede volver a escribir la IP o escanear el QR del juego.

## API

La base está en Supabase (PostgreSQL). La PWA habla con la API REST que Supabase ya expone. No hace falta un backend nuestro para las listas.

### Tablas

| Tabla | Para qué |
| --- | --- |
| `players` | Nombre de quien juega |
| `sessions` | Una fila por partida: personaje, puntaje, tiempo y fecha |
| `lore` | Textos del bosque |
| `lore_unlocks` | Qué textos ya descubrió cada jugador |

```sql
create table players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id),
  character_used text not null check (character_used in ('falin', 'mia')),
  score int not null default 0,
  time_played int not null default 0,
  session_date timestamptz not null default now()
);

create table lore (
  id text primary key,
  title text not null,
  content text not null
);

create table lore_unlocks (
  lore_id text not null references lore(id),
  player_id uuid not null references players(id),
  unlocked_at timestamptz not null default now(),
  primary key (lore_id, player_id)
);
```

Para la demo de la escuela, la lectura con la llave pública (`anon`) queda permitida. La llave de servicio no se pone en el celular.

### Llamadas que hace la app

Buscar a la persona por nombre:

`GET /rest/v1/players?name=eq.<nombre>&select=*`

Crearla si no está:

`POST /rest/v1/players`

Historial, de la más nueva a la más vieja:

`GET /rest/v1/sessions?player_id=eq.<id>&select=*&order=session_date.desc`

Lore que ya desbloqueó, con el título y el texto:

`GET /rest/v1/lore_unlocks?player_id=eq.<id>&select=unlocked_at,lore(id,title,content)`

Esas respuestas son listas y la interfaz las pinta tal cual llegan. Hoy, mientras no existe el proyecto de Supabase, las pantallas leen `public/api/stats.json` y `public/api/lore.json` con la misma forma, para poder probar sin la nube.

El juego de PC escribe en las mismas tablas cuando termina un nivel. Esa parte se explica en `README_UNITY_DEV.md`.

## Mando en tiempo real

Canal: `ws://<ip-de-la-pc>:8080/mando`

La app manda cada botón así:

```json
{ "b": "A", "s": 1 }
```

`s` vale `1` al presionar y `0` al soltar.

Botones base: `UP`, `LEFT`, `RIGHT`, `DOWN`, `SELECT`, `START`, `A`, `B`, `X`, `Y`.

Extra de Falin: `PUSH`, `BOOST`. Extra de Mia: `SMELL`, `SQUEEZE`.

El juego le contesta a la app con eventos:

```json
{ "event": "game_state", "state": "menu" }
{ "event": "character_switch", "character": "mia" }
{ "event": "damage_received" }
{ "event": "low_health", "health": 20 }
{ "event": "enemy_defeated" }
```

`game_state` puede ser `menu`, `playing` o `paused`. Con eso la app decide si muestra los menús o solo el mando.

```mermaid
sequenceDiagram
  participant PC as Juego en la PC
  participant Cel as PWA
  PC->>Cel: QR con ip y puerto
  Cel->>PC: WebSocket /mando
  PC-->>Cel: game_state menu
  Note over Cel: Se pueden abrir Lore e Historial
  PC-->>Cel: game_state playing
  Cel->>PC: botones b y s
  PC-->>Cel: damage_received o character_switch
  PC-->>Cel: game_state paused
  Note over Cel: Vuelven los menús
```

## PWA y offline

Se usa `vite-plugin-pwa` con Workbox. El manifest pide pantalla completa y orientación horizontal.

| Qué | Estrategia | Si falla la red |
| --- | --- | --- |
| JS, CSS, iconos e imágenes | CacheFirst | Se sirven de caché |
| Llamadas a la API (`/api/` y Supabase) | NetworkFirst, con unos segundos de espera | Se muestra la última respuesta guardada |
| La página en sí | El service worker responde con la app | No sale el error crudo del navegador |

```mermaid
flowchart TD
  pedido["El celular pide datos"]
  red{"¿Hay red?"}
  api["Pedir a Supabase"]
  cache["Leer la última copia"]
  ui["Pintar la lista"]
  aviso["Pantalla de desconexión y menús con lo guardado"]

  pedido --> red
  red -->|sí| api
  api --> ui
  api -->|guardó copia| cache
  red -->|no| cache
  cache --> ui
  cache -->|no había copia| aviso
```

Comportamiento que tiene que notar quien use la app:

- Si se va el internet o la red local, no se queda la pantalla gris del navegador.
- Sale una vista de desconexión.
- Desde ahí se puede abrir el lore y el historial que ya estaban guardados.
- También se puede volver a conectar escaneando el QR o escribiendo la IP de la PC.

Hoy el repo todavía tiene un `public/sw.js` registrado a mano en `index.html`. Ese archivo solo responde "Offline" y estorba al service worker de Workbox. El paso siguiente es quitarlo y dejar un solo service worker, el que genera el plugin.

## Cómo está armado el código

```mermaid
flowchart TB
  app["App"]
  store["store/gameStore"]
  hook["hooks/useGameConnection"]
  mando["pages/ControllerPage"]
  lore["pages/LorePage"]
  stats["pages/StatsPage"]
  api["services/api  (siguiente paso)"]
  supabase[("Supabase")]
  ws["WebSocket del juego"]

  app --> store
  app --> hook
  app --> mando
  app --> lore
  app --> stats
  mando --> hook
  hook --> ws
  hook --> store
  lore --> api
  stats --> api
  api --> supabase
```

| Carpeta | Rol |
| --- | --- |
| `src/pages` | Mando, lore e historial |
| `src/hooks` | Conexión del WebSocket y lectura del QR |
| `src/store` | Personaje activo, vida, golpe y datos de conexión. Zustand |
| `src/services` | Todavía no está. Aquí van a vivir las llamadas a Supabase |
| `public/api` | JSON de prueba con la misma forma que va a tener la API |

La interfaz usa React y Tailwind. El fondo es oscuro. Falin va en amarillo y Mia en rosa.

## Dónde se publica

La PWA se publica en Cloudflare Pages, en la cuenta personal, para que el QR apunte a una dirección HTTPS fija. El WebSocket no pasa por Cloudflare: el celular y la PC tienen que estar en la misma red.

## Qué ya está y qué falta

Ya está en el repo:

- Vite, React, Tailwind y `vite-plugin-pwa`, con caché CacheFirst para assets y NetworkFirst para `/api/`.
- Mando con cruceta, botones y vibración corta al presionar.
- Lectura de `ip` y `port` desde el QR, o captura de la IP a mano.
- Pantallas de lore e historial leyendo los JSON de prueba.
- Tema amarillo o rosa según el personaje, y un destello cuando llega daño.
- Estado global en Zustand.

Falta para cerrar la propuesta en código:

- Crear el proyecto de Supabase con el SQL de arriba y cambiar los JSON de prueba por esas llamadas.
- Menús desplegables de lore e historial, visibles solo en menú o pausa.
- Botones extra de Falin y de Mia.
- Pantalla de desconexión que deje leer lo cacheado y reconectar.
- Botones de demo para daño, vida baja y enemigo vencido.
- Quitar el service worker manual y dejar solo Workbox.
- Un solo lugar donde se abra el WebSocket. Ahora el hook se usa dos veces.
