import { useState } from 'react'
import { Download, Gamepad2, X } from 'lucide-react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export function InstallButton({ size = 'md', className = '' }) {
  const { canPrompt, installed, isIos, install } = useInstallPrompt()
  const [helpOpen, setHelpOpen] = useState(false)

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
    if (result === 'manual') setHelpOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`bg-accent inline-flex items-center gap-2 rounded-full font-extrabold text-white shadow-lg transition-transform active:scale-95 ${sizes} ${className}`}
      >
        <Download size={20} /> Instala el control
      </button>
      {helpOpen && <InstallHelp isIos={isIos} canPrompt={canPrompt} onClose={() => setHelpOpen(false)} />}
    </>
  )
}

function InstallHelp({ isIos, onClose }) {
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
        <h3 className="text-lg font-extrabold">Instalar el control</h3>
        {isIos ? (
          <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>Abre esta página en Safari.</li>
            <li>Toca el botón de Compartir (el cuadro con la flecha).</li>
            <li>Elige "Agregar a pantalla de inicio".</li>
          </ol>
        ) : (
          <ol className="text-muted mt-3 list-decimal space-y-2 pl-5 text-sm">
            <li>Abre el menú del navegador (los tres puntos).</li>
            <li>Elige "Instalar app" o "Agregar a pantalla principal".</li>
            <li>Ábrela desde el ícono de Kimaya en tu celular.</li>
          </ol>
        )}
        <a href="/?app=1" className="text-accent mt-5 inline-block text-sm font-bold">
          O úsalo directo en el navegador →
        </a>
      </div>
    </div>
  )
}
