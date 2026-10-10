import { useEffect, useState } from 'react'
import { ScrollText, Smartphone, Trophy } from 'lucide-react'
import { useGameStore } from './store/gameStore'
import { useGameConnection } from './hooks/useGameConnection'
import { TopBar } from './components/TopBar'
import { SideDrawer, EdgeHandle } from './components/SideDrawer'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { ControllerPage } from './pages/ControllerPage'
import { LorePage } from './pages/LorePage'
import { StatsPage } from './pages/StatsPage'

function App() {
  useGameConnection()

  const theme = useGameStore((s) => s.theme)
  const character = useGameStore((s) => s.activeCharacter)
  const gameState = useGameStore((s) => s.gameState)
  const [drawer, setDrawer] = useState(null)

  // Lore e Historial solo se abren en el menu o en pausa
  const menusAllowed = gameState !== 'playing'

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.character = character
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#262a31' : '#e6ebf1')
  }, [theme, character])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <TopBar />

      <main className="relative min-h-0 flex-1">
        <ControllerPage />
      </main>

      {menusAllowed && (
        <>
          <EdgeHandle side="left" label="Lore" icon={ScrollText} onClick={() => setDrawer('lore')} />
          <EdgeHandle side="right" label="Historial" icon={Trophy} onClick={() => setDrawer('stats')} />
        </>
      )}

      <SideDrawer
        side="left"
        title="Lore del bosque"
        icon={ScrollText}
        open={menusAllowed && drawer === 'lore'}
        onClose={() => setDrawer(null)}
      >
        <LorePage />
      </SideDrawer>

      <SideDrawer
        side="right"
        title="Historial"
        icon={Trophy}
        open={menusAllowed && drawer === 'stats'}
        onClose={() => setDrawer(null)}
      >
        <StatsPage />
      </SideDrawer>

      <FeedbackOverlay />

      <div className="bg-surface fixed inset-0 z-[60] hidden flex-col items-center justify-center gap-3 text-center portrait:max-md:flex">
        <Smartphone size={44} className="text-accent rotate-90" />
        <p className="font-extrabold">Gira tu celular</p>
        <p className="text-muted text-sm">El control se usa en horizontal</p>
      </div>
    </div>
  )
}

export default App
