import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

// Barra para cuando se abre en el navegador del celular y no como app instalada.
export function InstallBanner({ className = '' }) {
  const { installed, isIos, install } = useInstallPrompt()
  const [helpOpen, setHelpOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  if (installed || isStandalone() || hidden) return null

  const handleClick = async () => {
    const result = await install()
    if (result === 'manual') setHelpOpen(true)
  }

  return (
    <>
      <div className={`fixed inset-x-3 bottom-3 z-[70] ${className}`}>
        <div className="neu flex items-center gap-3 rounded-2xl px-3 py-2.5">
          <img src="/icon-192.png" alt="" className="pixel h-11 w-11 rounded-xl" />
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-extrabold">Instala el control</p>
            <p className="text-muted truncate text-xs">Kimaya en tu pantalla de inicio</p>
          </div>
          <button type="button" onClick={handleClick} className="bg-accent rounded-full px-3 py-2 text-xs font-extrabold text-white">
            <Download size={14} className="mr-1 inline" />
            Instalar
          </button>
          <button type="button" onClick={() => setHidden(true)} aria-label="Cerrar" className="text-muted p-1">
            <X size={16} />
          </button>
        </div>
      </div>
      {helpOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-6" onClick={() => setHelpOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="neu w-full max-w-sm rounded-[28px] p-6 text-left">
            <h3 className="text-lg font-extrabold">Instalar el control</h3>
            {isIos ? (
              <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
                <li>Abre esta página en Safari.</li>
                <li>Toca Compartir y elige "Agregar a pantalla de inicio".</li>
              </ol>
            ) : (
              <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
                <li>Abre el menú del navegador (los tres puntos).</li>
                <li>Elige "Instalar app" o "Agregar a pantalla principal".</li>
              </ol>
            )}
          </div>
        </div>
      )}
    </>
  )
}
