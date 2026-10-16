import { useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsUp, Hand, Shrink, Wind } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { postCommand } from '../services/commandsApi'

const EXTRA_BUTTONS = {
  falin: [
    { btn: 'PUSH', label: 'Empujar', Icon: Hand },
    { btn: 'BOOST', label: 'Impulso', Icon: ChevronsUp },
  ],
  mia: [
    { btn: 'SMELL', label: 'Olfato', Icon: Wind },
    { btn: 'SQUEEZE', label: 'Escabullir', Icon: Shrink },
  ],
}

const CHARACTER_INFO = {
  falin: { name: 'Falin', role: 'Fuerza' },
  mia: { name: 'Mia', role: 'Exploración' },
}

const square = { width: 'var(--btn)', height: 'var(--btn)' }

export function Gamepad({ disabled }) {
  const character = useGameStore((s) => s.activeCharacter)
  const info = CHARACTER_INFO[character]

  return (
    <div
      className={`absolute inset-0 flex items-center justify-between px-[4vw] transition-opacity duration-500 ${
        disabled ? 'pointer-events-none opacity-25' : ''
      }`}
    >
      <DPad />

      <div className="flex h-full flex-col items-center justify-between py-[5vh]">
        <div className="text-center">
          <p className="text-accent text-[clamp(22px,7vh,40px)] font-black leading-none">{info.name}</p>
          <p className="text-muted mt-1 text-xs font-bold uppercase tracking-[0.3em]">{info.role}</p>
        </div>
        <div className="flex gap-4">
          <PadButton btn="SELECT" className="h-8 w-20 rounded-full text-[11px] font-bold tracking-widest">
            SELECT
          </PadButton>
          <PadButton btn="START" className="h-8 w-20 rounded-full text-[11px] font-bold tracking-widest">
            START
          </PadButton>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[3vh]">
        <div className="flex gap-3">
          {EXTRA_BUTTONS[character].map(({ btn, label, Icon }) => (
            <PadButton key={btn} btn={btn} className="flex-col gap-0.5 rounded-2xl px-3 py-1.5 text-[10px] font-bold">
              <Icon size={18} className="text-accent" />
              {label}
            </PadButton>
          ))}
        </div>
        <ActionButtons />
      </div>
    </div>
  )
}

function DPad() {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
      <span />
      <PadButton btn="UP" className="rounded-2xl" style={square}>
        <ChevronUp />
      </PadButton>
      <span />
      <PadButton btn="LEFT" className="rounded-2xl" style={square}>
        <ChevronLeft />
      </PadButton>
      <span className="neu-inset rounded-full" style={square} />
      <PadButton btn="RIGHT" className="rounded-2xl" style={square}>
        <ChevronRight />
      </PadButton>
      <span />
      <PadButton btn="DOWN" className="rounded-2xl" style={square}>
        <ChevronDown />
      </PadButton>
      <span />
    </div>
  )
}

function ActionButtons() {
  const letter = 'rounded-full text-xl font-black'
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
      <span />
      <PadButton btn="Y" tone="text-amber-500" className={letter} style={square}>Y</PadButton>
      <span />
      <PadButton btn="X" tone="text-sky-500" className={letter} style={square}>X</PadButton>
      <span />
      <PadButton btn="B" tone="text-rose-500" className={letter} style={square}>B</PadButton>
      <span />
      <PadButton btn="A" tone="text-emerald-500" className={letter} style={square}>A</PadButton>
      <span />
    </div>
  )
}

function PadButton({ btn, tone = 'text-ink', className = '', style, children }) {
  const send = useGameStore((s) => s.send)
  const pressedRef = useRef(false)
  const [pressed, setPressed] = useState(false)

  const press = (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pressedRef.current = true
    setPressed(true)
    send({ b: btn, s: 1 })
    postCommand(btn, { b: btn, s: 1 })
      .then((saved) => console.log('Mando -> API', saved))
      .catch((e) => console.warn('Sin red: el comando queda guardado para enviarse al volver internet.', e))
    navigator.vibrate?.(30)
  }

  const release = () => {
    if (!pressedRef.current) return
    pressedRef.current = false
    setPressed(false)
    send({ b: btn, s: 0 })
    postCommand(btn, { b: btn, s: 0 })
      .then((saved) => console.log('Mando -> API', saved))
      .catch((e) => console.warn('Sin red: el comando queda guardado para enviarse al volver internet.', e))
  }

  return (
    <button
      type="button"
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      className={`${pressed ? 'neu-pressed' : `neu ${tone}`} flex items-center justify-center transition-[box-shadow,color] duration-100 ${className}`}
      style={style}
    >
      {children}
    </button>
  )
}
