import { create } from 'zustand'

const savedTheme = localStorage.getItem('kimaya-theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export const useGameStore = create((set, get) => ({
  // Tema
  theme: savedTheme || (prefersDark ? 'dark' : 'light'),
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('kimaya-theme', theme)
    set({ theme })
  },

  // Personaje y partida
  activeCharacter: 'falin', // 'falin' o 'mia'
  health: 100,
  maxHealth: 100,
  gameState: 'menu', // 'menu', 'playing' o 'paused'
  isHit: false,
  enemyDefeated: false,

  setCharacter: (activeCharacter) => set({ activeCharacter }),
  toggleCharacter: () => set({ activeCharacter: get().activeCharacter === 'falin' ? 'mia' : 'falin' }),
  setHealth: (hp) => set({ health: Math.max(0, Math.min(hp, get().maxHealth)) }),
  setGameState: (gameState) => set({ gameState }),
  triggerHit: () => {
    set({ isHit: true })
    setTimeout(() => set({ isHit: false }), 300)
  },
  triggerEnemyDefeated: () => {
    set({ enemyDefeated: true })
    setTimeout(() => set({ enemyDefeated: false }), 1400)
  },

  // Conexion con el juego
  ip: '',
  port: '',
  wsStatus: 'idle', // 'idle', 'connecting', 'connected', 'closed' o 'error'
  demoConnected: false,
  send: () => {},

  setConnectionDetails: (ip, port) => set({ ip, port }),
  clearConnection: () => set({ ip: '', port: '', wsStatus: 'idle' }),
  setWsStatus: (wsStatus) => set({ wsStatus }),
  setDemoConnected: (demoConnected) => set({ demoConnected }),
  setSender: (send) => set({ send }),
}))
