import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

// Pone la clase dark y el personaje en <html> para que cambien las variables de color.
export const useThemeEffect = () => {
  const theme = useGameStore((s) => s.theme)
  const character = useGameStore((s) => s.activeCharacter)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.dataset.character = character
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#262a31' : '#e6ebf1')
  }, [theme, character])
}
