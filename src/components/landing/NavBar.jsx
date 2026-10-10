import { useEffect, useState } from 'react'
import { Leaf, Moon, Sun } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const LINKS = [
  { href: '#personajes', label: 'Personajes' },
  { href: '#control', label: 'El control' },
  { href: '#como-funciona', label: 'Cómo funciona' },
]

export function NavBar() {
  const theme = useGameStore((s) => s.theme)
  const toggleTheme = useGameStore((s) => s.toggleTheme)
  const [scrolled, setScrolled] = useState(false)
  const { installed } = useInstallPrompt()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-surface/75 text-ink shadow-sm backdrop-blur-xl' : 'bg-transparent text-white'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2 font-black tracking-tight">
          <Leaf size={18} className={scrolled ? 'text-accent' : ''} /> Kimaya
        </a>
        <div className="hidden items-center gap-7 text-sm font-semibold sm:flex">
          {LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="opacity-80 transition-opacity hover:opacity-100">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="flex h-9 w-9 items-center justify-center rounded-full opacity-80 hover:opacity-100"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {installed ? (
            <a href="/?app=1" className="bg-accent rounded-full px-4 py-1.5 text-xs font-extrabold text-white">
              Abrir
            </a>
          ) : (
            <button
              type="button"
              onClick={() => window.installKimaya?.()}
              className="bg-accent rounded-full px-4 py-1.5 text-xs font-extrabold text-white"
            >
              Instalar
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
