// Backend del laboratorio de pruebas (Spring Boot + Supabase).
// Cada boton del mando se registra aqui ademas de mandarse por WebSocket al juego.
// Correrlo localmente con: mvn spring-boot:run (carpeta kimaya-api).
const COMMANDS_API_URL = 'http://localhost:8080/api/v1/commands'

// Sesion de prueba creada a mano en Supabase (game_sessions.id = 1).
// Cuando la app mande el "identify" con el jugador real, este valor se reemplaza.
const DEFAULT_SESSION_ID = 1

export const postCommand = async (actionType, payload) => {
  const res = await fetch(COMMANDS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: DEFAULT_SESSION_ID,
      actionType,
      payload: JSON.stringify(payload),
    }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getCommands = async () => {
  const res = await fetch(COMMANDS_API_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
