import { useState } from 'react'
import { X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { InstallHelp } from './InstallButton'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

// Barra para cuando se abre en el navegador del celular y no como app instalada.
export function InstallBanner({ className = '' }) {
  const { installed, canPrompt, isIos, install, openInChrome } = useInstallPrompt()
  const [helpOpen, setHelpOpen] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  if (installed || isStandalone() || hidden) return null

  const handleClick = async () => {
    const result = await install()
    if (result === 'chrome') {
      openInChrome()
      return
    }
    if (result === 'accepted' || result === 'dismissed') return
    if (result === 'wait' && !waiting) {
      setWaiting(true)
      return
    }
    setHelpOpen(true)
  }

  return (
    <>
      <div className={`fixed inset-x-3 bottom-3 z-[70] ${className}`}>
        <div className="neu flex items-center gap-3 rounded-2xl px-3 py-2.5">
          <img src="/icon-192.png" alt="" className="pixel h-11 w-11 rounded-xl" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-extrabold">Instalar app</p>
            <p className="text-muted truncate text-xs">
              {waiting && !canPrompt ? 'Toca otra vez, no es un archivo' : 'Kimaya en tu pantalla de inicio'}
            </p>
          </div>
          <button type="button" onClick={handleClick} className="bg-accent rounded-full px-3 py-2 text-xs font-extrabold text-white">
            {waiting && !canPrompt ? 'Otra vez' : 'Instalar'}
          </button>
          <button type="button" onClick={() => setHidden(true)} aria-label="Cerrar" className="text-muted p-1">
            <X size={16} />
          </button>
        </div>
      </div>
      {helpOpen && <InstallHelp isIos={isIos} onClose={() => setHelpOpen(false)} onChrome={openInChrome} />}
    </>
  )
}
