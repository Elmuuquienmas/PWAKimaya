import { useEffect, useState } from 'react'
import { Trophy, Clock, Skull } from 'lucide-react'

export const StatsPage = () => {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Esto simula la conexión a Supabase, interceptada por el Service Worker
    fetch('/api/stats.json')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error cargando stats, revisa la conexión offline:", err)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center">Cargando Historial...</div>
  
  if (error) return (
    <div className="p-8 text-center text-red-400">
      <Skull size={48} className="mx-auto mb-4" />
      <p>Error conectando a la base de datos (Supabase).</p>
      <p className="text-xs mt-2 opacity-70">Nota: Revisa tu conexión a internet o asegúrate de haber jugado antes para guardar caché.</p>
    </div>
  )

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <Trophy className="text-yellow-400" /> Historial de Partidas
      </h2>
      <div className="grid gap-4">
        {stats.map(session => (
          <div key={session.id_session} className="bg-black/40 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg">{session.player_name}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider">
                {session.character_used}
              </span>
            </div>
            <div className="flex justify-between text-sm opacity-80">
              <span className="flex items-center gap-1"><Trophy size={14}/> {session.score} pts</span>
              <span className="flex items-center gap-1"><Clock size={14}/> {Math.floor(session.time_played / 60)}m {session.time_played % 60}s</span>
            </div>
            <div className="text-[10px] opacity-40 text-right mt-3">
              {new Date(session.session_date).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
