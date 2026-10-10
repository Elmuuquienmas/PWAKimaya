import { useGameStore } from '../store/gameStore'

const STATES = [
  { id: 'menu', label: 'Menú' },
  { id: 'playing', label: 'Jugando' },
  { id: 'paused', label: 'Pausa' },
]

// Para la presentacion: simula lo que mandaria el juego por el WebSocket.
export function DemoPanel({ onClose }) {
  const s = useGameStore()

  const damage = () => {
    s.triggerHit()
    s.setHealth(s.health - 20)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="neu absolute right-0 top-12 z-50 w-72 space-y-3 rounded-3xl p-4">
        <p className="text-muted text-[11px] font-bold uppercase tracking-widest">Modo demo</p>

        <button
          type="button"
          onClick={() => s.setDemoConnected(!s.demoConnected)}
          className="flex w-full items-center justify-between text-sm font-bold"
        >
          Simular conexión
          <span className="neu-inset relative h-6 w-11 rounded-full">
            <span
              className={`absolute top-1 h-4 w-4 rounded-full transition-all ${
                s.demoConnected ? 'bg-accent left-6' : 'left-1 bg-gray-400'
              }`}
            />
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <DemoButton onClick={s.toggleCharacter}>Cambiar personaje</DemoButton>
          <DemoButton onClick={damage}>Recibir daño</DemoButton>
          <DemoButton onClick={() => s.setHealth(s.maxHealth)}>Curar</DemoButton>
          <DemoButton onClick={s.triggerEnemyDefeated}>Enemigo vencido</DemoButton>
        </div>

        <p className="text-muted text-[11px] font-bold uppercase tracking-widest">Estado del juego</p>
        <div className="neu-inset flex rounded-full p-1 text-xs font-bold">
          {STATES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => s.setGameState(id)}
              className={`flex-1 rounded-full py-1.5 transition-all ${s.gameState === id ? 'neu-sm text-accent' : 'text-muted'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function DemoButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="neu-sm rounded-2xl px-2 py-2.5 active:shadow-none">
      {children}
    </button>
  )
}
