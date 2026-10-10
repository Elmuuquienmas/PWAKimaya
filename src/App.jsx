import { useEffect, useState } from 'react'
import { ScrollText, Smartphone, Trophy } from 'lucide-react'
import { useGameStore } from './store/gameStore'
import { useGameConnection } from './hooks/useGameConnection'
import { useThemeEffect } from './hooks/useThemeEffect'
import { TopBar } from './components/TopBar'
import { SideDrawer, EdgeHandle } from './components/SideDrawer'
import { FeedbackOverlay } from './components/FeedbackOverlay'
import { InstallBanner } from './components/landing/InstallBanner'
import { ControllerPage } from './pages/ControllerPage'
import { LorePage } from './pages/LorePage'
import { StatsPage } from './pages/StatsPage'

function App() {
  useGameConnection()
  useThemeEffect()

  const gameState = useGameStore((s) => s.gameState)
  const [drawer, setDrawer] = useState(null)
  const portraitPhone = usePortraitPhone()

  // Lore e Historial solo se abren en el menu o en pausa
  const menusAllowed = gameState !== 'playing'

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

      <div className={`bg-surface fixed inset-0 z-[60] flex-col items-center justify-center gap-3 px-8 text-center ${portraitPhone ? 'flex' : 'hidden'}`}>
        <Smartphone size={44} className="text-accent rotate-90" />
        <p className="font-extrabold">Gira tu celular</p>
        <p className="text-muted text-sm">El control se usa en horizontal</p>
        <InstallBanner className="mt-4" />
      </div>
      <InstallBanner className={portraitPhone ? 'hidden' : ''} />
    </div>
  )
}

function usePortraitPhone() {
  const [portrait, setPortrait] = useState(false)

  useEffect(() => {
    const update = () => {
      const narrow = Math.min(window.innerWidth, window.innerHeight) < 768
      setPortrait(narrow && window.innerHeight > window.innerWidth)
      document.documentElement.style.height = `${window.innerHeight}px`
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      document.documentElement.style.height = ''
    }
  }, [])

  return portrait
}

export default App
