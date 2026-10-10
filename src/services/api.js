// Por ahora lee los JSON de prueba de public/api. Cuando este Supabase, solo cambia esto.
const BASE = '/api'

const getJson = async (path) => {
  const res = await fetch(`${BASE}/${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getStats = () => getJson('stats.json')
export const getLore = () => getJson('lore.json')
