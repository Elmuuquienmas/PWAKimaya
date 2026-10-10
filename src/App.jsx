import { useState } from 'react'
import { ControllerPage } from './pages/ControllerPage'
import { LorePage } from './pages/LorePage'
import { StatsPage } from './pages/StatsPage'
import { Gamepad2, ScrollText, Trophy } from 'lucide-react'
import { useGameStore } from './store/gameStore'
import { useGameConnection } from './hooks/useGameConnection'

function App() {
  const [currentTab, setCurrentTab] = useState('controller')
  const { activeCharacter, isHit } = useGameStore()
  
  // Inicializa la conexion (se encarga del WS internamente)
  useGameConnection()

  // Tema dinamico basado en el personaje seleccionado
  const themeClasses = activeCharacter === 'falin' 
    ? 'bg-yellow-900 border-yellow-500 text-yellow-100' 
    : 'bg-pink-900 border-pink-500 text-pink-100'

  const highlightClass = activeCharacter === 'falin' ? 'bg-yellow-500' : 'bg-pink-500'

  // Efecto de parpadeo rojo si recibe daño
  const hitOverlay = isHit ? 'bg-red-500/50 absolute inset-0 z-50 pointer-events-none transition-colors duration-100' : ''

  return (
    <div className={`w-screen h-screen flex flex-col ${themeClasses} transition-colors duration-500 relative overflow-hidden`}>
      {/* Overlay de Daño */}
      <div className={hitOverlay}></div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto">
        {currentTab === 'controller' && <ControllerPage />}
        {currentTab === 'lore' && <LorePage />}
        {currentTab === 'stats' && <StatsPage />}
      </div>

      {/* Barra de Navegacion Bottom */}
      <div className="h-16 bg-gray-950 flex justify-around items-center border-t-2 border-gray-800 pb-safe">
        <button 
          onClick={() => setCurrentTab('controller')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'controller' ? highlightClass + ' text-black' : 'text-gray-400'}`}
        >
          <Gamepad2 size={24} />
          <span className="text-xs font-bold mt-1">Mando</span>
        </button>
        
        <button 
          onClick={() => setCurrentTab('stats')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'stats' ? highlightClass + ' text-black' : 'text-gray-400'}`}
        >
          <Trophy size={24} />
          <span className="text-xs font-bold mt-1">Historial</span>
        </button>

        <button 
          onClick={() => setCurrentTab('lore')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${currentTab === 'lore' ? highlightClass + ' text-black' : 'text-gray-400'}`}
        >
          <ScrollText size={24} />
          <span className="text-xs font-bold mt-1">Lore</span>
        </button>
      </div>
    </div>
  )
}

export default App
