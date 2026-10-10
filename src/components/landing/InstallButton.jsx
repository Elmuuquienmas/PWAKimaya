import { useState } from 'react'
import { Gamepad2, X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export function InstallButton({ size = 'md', className = '' }) {
  const { installed, isIos, isInApp, openInChrome } = useInstallPrompt()
  const [helpOpen, setHelpOpen] = useState(false)
  const sizes = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-sm'

  if (installed) {
    return (
      <a href="/?app=1" className={`neu text-accent inline-flex items-center gap-2 rounded-full font-extrabold ${sizes} ${className}`}>
        <Gamepad2 size={20} /> Abrir el control
      </a>
    )
  }

  return (
    <span className="inline-flex flex-col items-center">
      <button
        type="button"
        data-install
        onClick={() => {
          if (window.__kimayaPrompt) return
          if (isInApp) openInChrome()
          else if (isIos) setHelpOpen(true)
        }}
        className={`bg-accent inline-flex items-center gap-2 rounded-full font-extrabold text-white shadow-lg transition-transform active:scale-95 ${sizes} ${className}`}
      >
        Instalar app
      </button>
      {helpOpen && <InstallHelp onClose={() => setHelpOpen(false)} />}
    </span>
  )
}

export function InstallHelp({ onClose }) {
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
        <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
          <li>Abre esta página en Safari.</li>
          <li>Toca Compartir y elige "Agregar a pantalla de inicio".</li>
        </ol>
      </div>
    </div>
  )
}
