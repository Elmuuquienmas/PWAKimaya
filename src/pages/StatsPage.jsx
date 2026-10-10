import { Clock, Trophy, WifiOff } from 'lucide-react'
import { getStats } from '../services/api'
import { useApiList } from '../hooks/useApiList'
import { useOnline } from '../hooks/useOnline'

const CHARACTER_DOT = { falin: 'bg-amber-500', mia: 'bg-pink-500' }

export function StatsPage() {
  const { data: stats, loading, error } = useApiList(getStats)
  const online = useOnline()

  if (loading) return <p className="text-muted py-8 text-center text-sm">Cargando historial…</p>

  if (error) {
    return (
      <div className="text-muted flex flex-col items-center gap-2 py-8 text-center text-sm">
        <WifiOff />
        No se pudo cargar el historial. Revisa tu conexión o juega una partida primero.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!online && (
        <p className="neu-inset text-muted flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold">
          <WifiOff size={14} /> Sin conexión, mostrando lo guardado
        </p>
      )}
      {stats.map((session) => (
        <article key={session.id_session} className="neu-sm rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-extrabold">{session.player_name}</span>
            <span className="neu-inset flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
              <span className={`h-2 w-2 rounded-full ${CHARACTER_DOT[session.character_used]}`} />
              {session.character_used}
            </span>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Trophy size={14} className="text-accent" /> {session.score} pts
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-accent" />
              {Math.floor(session.time_played / 60)}m {session.time_played % 60}s
            </span>
          </div>
          <p className="text-muted mt-3 text-right text-[10px]">{new Date(session.session_date).toLocaleString()}</p>
        </article>
      ))}
    </div>
  )
}
