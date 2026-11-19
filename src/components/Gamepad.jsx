import { useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { postCommand } from '../services/commandsApi'

// El ascenso solo lee izquierda, derecha, A (mantener = cargar, soltar = saltar) y START (pausa).
export function Gamepad({ disabled, embedded = false }) {
  if (disabled) return null

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center [container-type:size] ${embedded ? 'p-[4%]' : 'p-[3vh] px-[4vw]'}`}
    >
      <div
        className="grid h-full w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[2cqw] rounded-[28px] px-[3cqw] sm:rounded-[40px]"
        style={{
          '--dpad': 'min(70cqh, 22cqw)',
          '--face': 'min(32cqh, 10.5cqw)',
          background: 'linear-gradient(180deg, #ececf1 0%, #c5c5cc 42%, #9b9ba3 100%)',
          boxShadow:
            'inset 0 2px 0 rgba(255,255,255,0.85), inset 0 -8px 14px rgba(0,0,0,0.22), 0 12px 28px rgba(0,0,0,0.28)',
        }}
      >
        <DPad />
        <CenterCluster embedded={embedded} />
        <FaceButtons />
      </div>
    </div>
  )
}

function DPad() {
  return (
    <div className="relative shrink-0" style={{ width: 'var(--dpad)', height: 'var(--dpad)' }}>
      <div className="absolute left-1/2 top-0 h-full w-[34%] -translate-x-1/2 rounded-[8px] bg-[#1a1a1a] shadow-[inset_0_-3px_0_#000,0_2px_0_#3a3a3a]" />
      <div className="absolute left-0 top-1/2 h-[34%] w-full -translate-y-1/2 rounded-[8px] bg-[#1a1a1a] shadow-[inset_0_-3px_0_#000,0_2px_0_#3a3a3a]" />
      <span className="absolute left-1/2 top-1/2 z-[1] h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111]" />
      <DirButton btn="LEFT" className="absolute left-0 top-[33%] z-[2] h-[34%] w-[33%]">
        ‹
      </DirButton>
      <DirButton btn="RIGHT" className="absolute right-0 top-[33%] z-[2] h-[34%] w-[33%]">
        ›
      </DirButton>
    </div>
  )
}

function CenterCluster({ embedded }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-[1cqh]">
      {!embedded && (
        <p className="max-w-full truncate text-center text-[clamp(8px,3.2cqh,13px)] font-bold tracking-wide text-black/45">
          Mantén A para saltar
        </p>
      )}
      <div className="flex items-center gap-[1.5cqw]">
        <PlasticPill>SELECT</PlasticPill>
        <PadButton btn="START" className="plastic-pill">
          START
        </PadButton>
      </div>
    </div>
  )
}

function FaceButtons() {
  return (
    <div className="flex shrink-0 items-center gap-[1.6cqw]">
      <PlasticFace>B</PlasticFace>
      <PadButton btn="A" className="plastic-face">
        A
      </PadButton>
    </div>
  )
}

function DirButton({ btn, className, children }) {
  const pad = usePadPress(btn)
  return (
    <button
      type="button"
      aria-label={btn === 'LEFT' ? 'Izquierda' : 'Derecha'}
      {...pad.events}
      className={`${className} flex items-center justify-center text-[calc(var(--dpad)*0.22)] font-black leading-none text-white/80 ${
        pad.pressed ? 'bg-white/20' : ''
      }`}
    >
      {children}
    </button>
  )
}

function PlasticPill({ children }) {
  return (
    <span
      aria-hidden="true"
      className="plastic-pill inline-flex items-center justify-center text-white/80"
    >
      {children}
    </span>
  )
}

function PlasticFace({ children }) {
  return (
    <span aria-hidden="true" className="plastic-face inline-flex items-center justify-center text-white/80">
      {children}
    </span>
  )
}

function PadButton({ btn, className, children }) {
  const pad = usePadPress(btn)
  return (
    <button type="button" {...pad.events} className={`${className} ${pad.pressed ? 'is-down' : ''}`}>
      {children}
    </button>
  )
}

function usePadPress(btn) {
  const send = useGameStore((s) => s.send)
  const pressedRef = useRef(false)
  const [pressed, setPressed] = useState(false)

  const release = () => {
    if (!pressedRef.current) return
    pressedRef.current = false
    setPressed(false)
    send({ b: btn, s: 0 })
    postCommand(btn, { b: btn, s: 0 }).catch(() => {})
  }

  const press = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    pressedRef.current = true
    setPressed(true)
    send({ b: btn, s: 1 })
    postCommand(btn, { b: btn, s: 1 }).catch(() => {})
    navigator.vibrate?.(20)
  }

  return {
    pressed,
    events: {
      onPointerDown: press,
      onPointerUp: release,
      onPointerCancel: release,
      onLostPointerCapture: release,
    },
  }
}
