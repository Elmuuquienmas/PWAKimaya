import { useState } from 'react'
import { X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

export function InstallBanner({ className = '' }) {
  const { installed } = useInstallPrompt()
  const [hidden, setHidden] = useState(false)

  if (installed || isStandalone() || hidden) return null

  return (
    <div className={`fixed inset-x-3 bottom-3 z-[70] ${className}`}>
      <div className="neu flex items-center gap-3 rounded-2xl px-3 py-2.5">
        <img src="/icon-192.png" alt="" className="pixel h-11 w-11 rounded-xl" />
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-extrabold">Instalar app</p>
          <p className="text-muted truncate text-xs">Kimaya en tu pantalla de inicio</p>
        </div>
        <button
          type="button"
          onClick={() => window.installKimaya?.()}
          className="bg-accent rounded-full px-3 py-2 text-xs font-extrabold text-white"
        >
          Instalar
        </button>
        <button type="button" onClick={() => setHidden(true)} aria-label="Cerrar" className="text-muted p-1">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
