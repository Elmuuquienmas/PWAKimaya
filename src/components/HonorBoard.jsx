import { Clock, Coins, Heart, Medal, Trophy } from 'lucide-react'
import { getHonorBoard, characterName, formatDuration, levelName, resultName } from '../services/sessionsApi'
import { useApiList } from '../hooks/useApiList'

const RANK_TONE = {
  1: 'bg-amber-400 text-amber-950',
  2: 'bg-slate-300 text-slate-800',
  3: 'bg-orange-300 text-orange-950',
}

export function HonorBoard({ compact = false }) {
  const { data: sessions, loading, error } = useApiList(getHonorBoard)

  if (loading) return <p className="text-muted py-8 text-center text-sm">Cargando cuadro de honor…</p>
  if (error) {
    return (
      <p className="text-muted py-8 text-center text-sm">
        No se pudo leer las partidas. La base de datos no respondió.
      </p>
    )
  }
  if (sessions.length === 0) {
    return <p className="text-muted py-8 text-center text-sm">Todavía no hay partidas guardadas.</p>
  }

  const best = sessions[0]
  const completed = sessions.filter((session) => session.result === 'nivel_completado').length

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${compact ? 'grid-cols-3' : 'sm:grid-cols-3'}`}>
        <Summary label="Partidas" value={sessions.length} />
        <Summary label="Mejor puntaje" value={best.score} />
        <Summary label="Completadas" value={completed} />
      </div>

      <ol className="space-y-3">
        {sessions.map((session) => (
          <li key={session.id} className="neu-sm rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  RANK_TONE[session.rank] || 'neu-inset text-muted'
                }`}
              >
                {session.rank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">{characterName(session.character_id)}</p>
                    <p className="text-muted mt-0.5 text-xs">
                      Cuenta {session.playerName} · {levelName(session.level_id)} · {resultName(session.result)}
                    </p>
                  </div>
                  <p className="flex shrink-0 items-center gap-1 text-sm font-black">
                    {session.rank <= 3 ? <Medal size={14} className="text-accent" /> : <Trophy size={14} className="text-accent" />}
                    {session.score}
                  </p>
                </div>
                <div className="text-muted mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold">
                  <Stat icon={Clock} text={formatDuration(session.time_played)} />
                  <Stat icon={Coins} text={`${session.coins} monedas`} />
                  <Stat icon={Heart} text={`${session.lives_left} vidas`} />
                  <span>{session.jumps} saltos</span>
                  <span>{session.falls} caídas</span>
                  <span>{new Date(session.created_at).toLocaleString('es-MX')}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Summary({ label, value }) {
  return (
    <div className="neu-inset rounded-2xl px-3 py-3 text-center">
      <p className="text-lg font-black leading-none">{value}</p>
      <p className="text-muted mt-1 text-[10px] font-bold uppercase tracking-wider">{label}</p>
    </div>
  )
}

function Stat({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon size={12} />
      {text}
    </span>
  )
}
