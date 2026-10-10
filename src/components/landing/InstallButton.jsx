import { useState } from 'react'
import { Gamepad2, X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export function InstallButton({ size = 'md', className = '' }) {
  const { installed, canPrompt, isIos, install, openInChrome } = useInstallPrompt()
  const [helpOpen, setHelpOpen] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const sizes = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-sm'

  if (installed) {
    return (
      <a href="/?app=1" className={`neu text-accent inline-flex items-center gap-2 rounded-full font-extrabold ${sizes} ${className}`}>
        <Gamepad2 size={20} /> Abrir el control
      </a>
    )
  }

  const handleClick = async () => {
    const result = await install()
    if (result === 'chrome') {
      openInChrome()
      return
    }
    if (result === 'accepted' || result === 'dismissed') {
      setWaiting(false)
      return
    }
    if (result === 'wait' && !waiting) {
      setWaiting(true)
      return
    }
    setHelpOpen(true)
  }

  const label = waiting && !canPrompt ? 'Toca otra vez para instalar' : 'Instalar app'

  return (
    <span className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        className={`bg-accent inline-flex items-center gap-2 rounded-full font-extrabold text-white shadow-lg transition-transform active:scale-95 ${sizes} ${className}`}
      >
        {label}
      </button>
      {waiting && !canPrompt && !helpOpen && (
        <p className="mt-3 max-w-xs text-center text-sm text-white/80">No baja un archivo. Toca otra vez y Android pide instalarla.</p>
      )}
      {helpOpen && <InstallHelp isIos={isIos} onClose={() => setHelpOpen(false)} onChrome={openInChrome} />}
    </span>
  )
}

export function InstallHelp({ isIos, onClose, onChrome }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="neu text-ink relative w-full max-w-sm rounded-[28px] p-6 text-left">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="neu-sm absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full"
        >
          <X size={16} />
        </button>
        <h3 className="text-lg font-extrabold">Instalar Kimaya</h3>
        <p className="text-muted mt-2 text-sm">No se descarga un archivo. Queda como app, con su ícono en la pantalla de inicio.</p>
        {isIos ? (
          <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>Abre esta página en Safari.</li>
            <li>Toca Compartir y elige "Agregar a pantalla de inicio".</li>
          </ol>
        ) : (
          <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>Ábrela en Chrome, no dentro de WhatsApp ni Instagram.</li>
            <li>Toca los tres puntos de arriba a la derecha.</li>
            <li>Elige "Instalar app". No toques "Descargar".</li>
          </ol>
        )}
        {!isIos && (
          <button type="button" onClick={onChrome} className="bg-accent mt-5 rounded-full px-4 py-2 text-sm font-extrabold text-white">
            Abrir en Chrome
          </button>
        )}
      </div>
    </div>
  )
}
