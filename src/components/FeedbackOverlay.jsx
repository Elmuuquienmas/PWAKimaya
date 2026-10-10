import { Swords } from 'lucide-react'
import { useGameStore } from '../store/gameStore'

export function FeedbackOverlay() {
  const isHit = useGameStore((s) => s.isHit)
  const enemyDefeated = useGameStore((s) => s.enemyDefeated)
  const lowHealth = useGameStore((s) => s.health <= 25)

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-red-500 transition-opacity ${isHit ? 'opacity-40 duration-75' : 'opacity-0 duration-300'}`}
      />
      {lowHealth && <div className="low-health absolute inset-0" />}
      <div
        className={`neu text-accent absolute left-1/2 top-16 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2 font-extrabold transition-all duration-300 ${
          enemyDefeated ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <Swords size={18} />
        ¡Enemigo vencido!
      </div>
    </div>
  )
}
