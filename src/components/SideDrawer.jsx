import { X } from 'lucide-react'

export function SideDrawer({ side, open, onClose, title, icon: Icon, children }) {
  const isLeft = side === 'left'
  const hidden = isLeft ? '-translate-x-[110%]' : 'translate-x-[110%]'

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`neu fixed bottom-3 top-3 z-40 flex w-[min(420px,46vw)] flex-col rounded-[28px] transition-transform duration-300 ease-out ${
          isLeft ? 'left-3' : 'right-3'
        } ${open ? 'translate-x-0' : hidden}`}
      >
        <header className="flex items-center justify-between px-5 pb-3 pt-4">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Icon size={20} className="text-accent" />
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="neu-sm flex h-9 w-9 items-center justify-center rounded-full"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 touch-pan-y overflow-y-auto px-5 pb-5">{children}</div>
      </aside>
    </>
  )
}

export function EdgeHandle({ side, label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`neu fixed top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 px-2 py-4 ${
        side === 'left' ? 'left-0 rounded-r-2xl' : 'right-0 rounded-l-2xl'
      }`}
    >
      <Icon size={18} className="text-accent" />
      <span className="text-[11px] font-bold uppercase tracking-widest [writing-mode:vertical-rl]">{label}</span>
    </button>
  )
}
