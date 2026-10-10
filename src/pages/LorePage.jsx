import { WifiOff } from 'lucide-react'
import { getLore } from '../services/api'
import { useApiList } from '../hooks/useApiList'
import { useOnline } from '../hooks/useOnline'

export function LorePage() {
  const { data: lore, loading, error } = useApiList(getLore)
  const online = useOnline()

  if (loading) return <p className="text-muted py-8 text-center text-sm">Desempolvando tomos…</p>

  if (error) {
    return (
      <div className="text-muted flex flex-col items-center gap-2 py-8 text-center text-sm">
        <WifiOff />
        No hay lore guardado todavía. Ábrelo una vez con internet para que quede en el celular.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!online && <OfflineNote />}
      {lore.map((doc) => (
        <article key={doc.id_lore} className="neu-sm rounded-2xl p-4">
          <h3 className="text-accent font-extrabold">{doc.title}</h3>
          <p className="mt-2 text-sm leading-relaxed opacity-90">{doc.content}</p>
          <p className="text-muted mt-3 text-right text-[10px]">
            Descubierto el {new Date(doc.unlocked_at).toLocaleDateString()}
          </p>
        </article>
      ))}
    </div>
  )
}

function OfflineNote() {
  return (
    <p className="neu-inset text-muted flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold">
      <WifiOff size={14} /> Sin conexión, mostrando lo guardado
    </p>
  )
}
