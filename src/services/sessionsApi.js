// Clave publicable: el navegador puede leer partidas. La clave secreta no va aquí.
const SUPABASE_URL = 'https://cbunyolvkojbbstjylyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_6x1JiBKBMggKjRDemvrkQg_-TpyLaAs'

const LEVELS = {
  ascenso_vertical: 'Ascenso vertical',
  ascenso_jumpking_classic: 'Ascenso Jump King',
  test_mecanica_interaccion: 'Prueba de interacción',
}

const CHARACTERS = {
  falin: 'Falin',
  mia: 'Mia',
}

const RESULTS = {
  nivel_completado: 'Completado',
  game_over: 'Game over',
}

const rest = async (path) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const levelName = (id) => LEVELS[id] || id
export const characterName = (id) => CHARACTERS[id] || id
export const resultName = (id) => RESULTS[id] || id

export const formatDuration = (seconds) => {
  const total = Number(seconds) || 0
  const minutes = Math.floor(total / 60)
  const restSeconds = total % 60
  return `${minutes}m ${String(restSeconds).padStart(2, '0')}s`
}

export async function getHonorBoard() {
  const [sessions, players] = await Promise.all([
    rest('sessions?select=*&order=score.desc,time_played.asc,created_at.desc'),
    rest('players?select=id,name'),
  ])
  const names = Object.fromEntries(players.map((player) => [String(player.id), player.name]))

  return sessions.map((session, index) => ({
    ...session,
    rank: index + 1,
    playerName: names[String(session.player_id)] || `Jugador ${session.player_id}`,
  }))
}
