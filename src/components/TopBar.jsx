import { useState } from 'react'
import { FlaskConical, Heart, Leaf, Moon, Sun } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { useOnline } from '../hooks/useOnline'
import { DemoPanel } from './DemoPanel'

const GAME_STATE_LABEL = { menu: 'En menú', playing: 'Jugando', paused: 'En pausa' }

export function TopBar() {
  const theme = useGameStore((s) => s.theme)
  const toggleTheme = useGameStore((s) => s.toggleTheme)
  const character = useGameStore((s) => s.activeCharacter)
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <header className="relative z-[25] flex items-center justify-between gap-3 px-4 pb-1 pt-3">
      <div className="flex items-center gap-2 font-black tracking-tight">
        <span className="neu text-accent flex h-8 w-8 items-center justify-center rounded-xl">
          <Leaf size={16} />
        </span>
        Kimaya
      </div>

      <StatusPill />

      <div className="relative flex items-center gap-2">
        <HealthBar />
        <span className="neu-sm flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold capitalize">
          <span className="bg-accent h-2.5 w-2.5 rounded-full" />
          {character}
        </span>
        <button
          type="button"
          onClick={() => setDemoOpen((o) => !o)}
          aria-label="Modo demo"
          className={`${demoOpen ? 'neu-pressed' : 'neu-sm'} flex h-9 w-9 items-center justify-center rounded-full`}
        >
          <FlaskConical size={17} />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="neu-sm flex h-9 w-9 items-center justify-center rounded-full"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {demoOpen && <DemoPanel onClose={() => setDemoOpen(false)} />}
      </div>
    </header>
  )
}

function StatusPill() {
  const online = useOnline()
  const ip = useGameStore((s) => s.ip)
  const wsStatus = useGameStore((s) => s.wsStatus)
  const demoConnected = useGameStore((s) => s.demoConnected)
  const gameState = useGameStore((s) => s.gameState)
  const connected = demoConnected || wsStatus === 'connected'

  let text = 'Sin conectar'
  let dot = 'bg-gray-400'
  if (!online) {
    text = 'Sin internet'
    dot = 'bg-red-500'
  } else if (connected) {
    text = `${demoConnected ? 'Demo' : 'Conectado'} · ${GAME_STATE_LABEL[gameState]}`
    dot = 'bg-emerald-500'
  } else if (wsStatus === 'connecting') {
    text = 'Conectando…'
    dot = 'bg-amber-400 animate-pulse'
  } else if (ip) {
    text = 'Se perdió la conexión'
    dot = 'bg-red-500'
  }

  return (
    <div className="neu-inset absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {text}
    </div>
  )
}

function HealthBar() {
  const health = useGameStore((s) => s.health)
  const maxHealth = useGameStore((s) => s.maxHealth)
  const pct = Math.round((health / maxHealth) * 100)
  const low = health <= 25

  return (
    <div className="hidden items-center gap-1.5 sm:flex" title={`Vida: ${health}`}>
      <Heart size={15} className={low ? 'animate-pulse text-red-500' : 'text-accent'} />
      <div className="neu-inset h-2.5 w-20 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${low ? 'bg-red-500' : 'bg-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
