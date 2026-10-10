import { create } from 'zustand'

export const useGameStore = create((set) => ({
  // Estado Global del Personaje y UI
  activeCharacter: 'falin', // 'falin' o 'mia'
  health: 100,
  maxHealth: 100,
  isHit: false, // Flag para destellos rojos cuando recibe daño

  // Acciones de UI
  setCharacter: (char) => set({ activeCharacter: char }),
  setHealth: (hp) => set({ health: hp }),
  triggerHit: () => {
    set({ isHit: true })
    setTimeout(() => set({ isHit: false }), 300) // 300ms de feedback visual
  },

  // Networking WebSockets
  wsStatus: 'Desconectado',
  ip: '',
  port: '',
  setConnectionDetails: (ip, port) => set({ ip, port }),
  setWsStatus: (status) => set({ wsStatus: status }),
}))
