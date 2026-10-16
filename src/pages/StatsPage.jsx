import { Clock, Gamepad2, Trophy, WifiOff } from 'lucide-react'
import { getStats } from '../services/api'
import { getCommands } from '../services/commandsApi'
import { useApiList } from '../hooks/useApiList'
import { useOnline } from '../hooks/useOnline'

const CHARACTER_DOT = { falin: 'bg-amber-500', mia: 'bg-pink-500' }

function CommandsList() {
  const { data: commands, loading, error } = useApiList(getCommands)

  if (loading) return <p className="text-muted py-4 text-center text-xs">Cargando comandos…</p>
  if (error) {
    console.warn('GET /api/v1/commands fallo', error)
    return <p className="text-muted py-4 text-center text-xs">No se pudo consultar la API de comandos.</p>
  }

  const latest = [...commands].sort((a, b) => b.id - a.id).slice(0, 20)
  console.log(`API -> PWA: ${commands.length} comandos recibidos, mostrando ${latest.length}`, latest)

  return (
    <section className="neu-sm rounded-2xl p-4">
      <h3 className="flex items-center gap-2 text-sm font-extrabold">
        <Gamepad2 size={16} className="text-accent" /> Comandos registrados ({commands.length})
      </h3>
      <ul className="mt-3 space-y-1.5">
        {latest.map((cmd) => (
          <li key={cmd.id} className="neu-inset flex items-center justify-between rounded-xl px-3 py-1.5 text-xs">
            <span className="font-bold">
              #{cmd.id} · {cmd.actionType}
            </span>
            <span className="text-muted">{new Date(cmd.executedAt).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function StatsPage() {
  const { data: stats, loading, error } = useApiList(getStats)
  const online = useOnline()

  if (loading) return <p className="text-muted py-8 text-center text-sm">Cargando historial…</p>

  if (error) {
    return (
      <div className="space-y-4">
        <CommandsList />
        <div className="text-muted flex flex-col items-center gap-2 py-8 text-center text-sm">
          <WifiOff />
          No se pudo cargar el historial. Revisa tu conexión o juega una partida primero.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CommandsList />
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
