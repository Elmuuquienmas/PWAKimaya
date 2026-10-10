import { useEffect, useState } from 'react'
import { ScrollText, WifiOff } from 'lucide-react'

export const LorePage = () => {
  const [lore, setLore] = useState([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    // Si estamos offline y falla la carga limpia, mostraremos el estado de caché
    if (!navigator.onLine) setOffline(true)

    window.addEventListener('offline', () => setOffline(true))
    window.addEventListener('online', () => setOffline(false))

    fetch('/api/lore.json')
      .then(res => res.json())
      .then(data => {
        setLore(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Fallo red, intentando leer caché...", err)
        setLoading(false)
      })

    return () => {
      window.removeEventListener('offline', () => setOffline(true))
      window.removeEventListener('online', () => setOffline(false))
    }
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <ScrollText className="text-blue-400" /> Lore Desbloqueado
        </h2>
        {offline && (
          <span className="flex items-center gap-1 text-xs text-red-400 font-bold bg-red-900/50 px-2 py-1 rounded-full">
            <WifiOff size={12} /> Offline Mode
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center opacity-50">Desempolvando tomos...</div>
      ) : (
        <div className="grid gap-6">
          {lore.map(doc => (
            <div key={doc.id_lore} className="bg-gray-800/60 p-5 rounded-lg border-l-4 border-blue-500 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-blue-100">{doc.title}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{doc.content}</p>
              <div className="text-[10px] opacity-40 mt-4 text-right">
                Descubierto: {new Date(doc.unlocked_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
