import { useEffect, useState } from 'react'
import { ScrollText, Trophy } from 'lucide-react'
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
    <div className={`flex w-full flex-col overflow-hidden ${portraitPhone ? 'force-landscape' : 'relative h-full'}`}>
      <TopBar />

      <main className="relative min-h-0 flex-1">
        <ControllerPage />
      </main>

      {menusAllowed && (
        <>
          <EdgeHandle side="left" label="Lore" icon={ScrollText} onClick={() => setDrawer('lore')} />
          <EdgeHandle side="right" label="Honor" icon={Trophy} onClick={() => setDrawer('stats')} />
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
        title="Cuadro de honor"
        icon={Trophy}
        open={menusAllowed && drawer === 'stats'}
        onClose={() => setDrawer(null)}
      >
        <StatsPage />
      </SideDrawer>

      <FeedbackOverlay />
      <InstallBanner />
    </div>
  )
}

function usePortraitPhone() {
  const [portrait, setPortrait] = useState(false)

  useEffect(() => {
    const portraitQuery = window.matchMedia('(orientation: portrait)')
    const timers = []

    const update = () => {
      // Safari del iPhone cambia innerWidth/innerHeight un momento después del giro.
      // Se mide con el viewport visual y con la consulta de orientación para no quedarse con el dato viejo.
      const width = window.visualViewport?.width ?? window.innerWidth
      const height = window.visualViewport?.height ?? window.innerHeight
      const narrow = Math.min(width, height) < 768
      const portrait = narrow && height > width && portraitQuery.matches
      setPortrait(portrait)
      if (portrait && screen.orientation?.lock) {
        screen.orientation.lock('landscape').catch(() => {})
      }
    }

    // Tras girar el celular se vuelve a medir cuando el navegador ya terminó de acomodarse.
    const updateSoon = () => {
      update()
      timers.push(setTimeout(update, 150), setTimeout(update, 500))
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', updateSoon)
    window.visualViewport?.addEventListener('resize', update)
    portraitQuery.addEventListener?.('change', updateSoon)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', updateSoon)
      window.visualViewport?.removeEventListener('resize', update)
      portraitQuery.removeEventListener?.('change', updateSoon)
    }
  }, [])

  return portrait
}

export default App
