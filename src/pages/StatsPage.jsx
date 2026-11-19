import { Gamepad2 } from 'lucide-react'
import { HonorBoard } from '../components/HonorBoard'
import { getCommands } from '../services/commandsApi'
import { useApiList } from '../hooks/useApiList'

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
  return (
    <div className="space-y-4">
      <CommandsList />
      <HonorBoard compact />
    </div>
  )
}
