import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { InstallButton } from './InstallButton'

// De atras para adelante, como el parallax del juego
const LAYERS = [
  { src: '/promo/bg-4.png', speed: '160s', depth: 0.1 },
  { src: '/promo/bg-3.png', speed: '120s', depth: 0.2 },
  { src: '/promo/bg-2.png', speed: '80s', depth: 0.3 },
  { src: '/promo/bg-vines.png', speed: '60s', depth: 0.35 },
  { src: '/promo/bg-1.png', speed: '40s', depth: 0.45, opacity: 0.55 },
]

export function Hero() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-svh overflow-hidden bg-[#63c0c2]">
      {LAYERS.map(({ src, speed, depth, opacity = 1 }) => (
        <div
          key={src}
          className="forest-layer"
          style={{ backgroundImage: `url(${src})`, '--speed': speed, translate: `0 ${scroll * depth}px`, opacity }}
        />
      ))}

      <div className="absolute left-0" style={{ bottom: '12%', animation: 'run-across 14s linear infinite' }}>
        <img src="/dogs/falin-walk.webp" alt="" className="pixel h-28 w-auto sm:h-40" />
      </div>
      <div
        className="absolute left-0"
        style={{ bottom: '13%', animation: 'run-across 14s linear infinite', animationDelay: '-1.6s' }}
      >
        <img src="/dogs/mia-walk.webp" alt="" className="pixel h-20 w-auto sm:h-28" />
      </div>

      <div className="absolute inset-0 bg-[#0b1a24]/0 transition-colors duration-500 dark:bg-[#0b1a24]/55" />
      <div className="to-surface absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent" />

      <div
        className="relative z-10 flex min-h-svh flex-col items-center justify-center px-5 py-24 text-center text-white"
        style={{ transform: `translateY(${scroll * -0.25}px)`, opacity: Math.max(0, 1 - scroll / 500) }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-white/80 drop-shadow">Plataformas 2D · PC</p>
        <h1 className="mt-3 pb-[0.16em] text-[clamp(64px,16vw,200px)] font-black leading-[1] tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]">
          Kimaya
        </h1>
        <p className="mt-2 text-[clamp(20px,3.4vw,40px)] font-extrabold drop-shadow">El Bosque del Eco</p>
        <p className="mt-5 max-w-xl text-base text-white/90 drop-shadow sm:text-lg">
          Dos compañeros. Un bosque que escucha. Y tu celular como control.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <InstallButton size="lg" />
          <a
            href="#personajes"
            className="rounded-full bg-white/20 px-6 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/30"
          >
            Conoce a Falin y Mia
          </a>
        </div>
      </div>

      <a href="#personajes" aria-label="Bajar" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/80">
        <ChevronDown size={32} />
      </a>
    </section>
  )
}
