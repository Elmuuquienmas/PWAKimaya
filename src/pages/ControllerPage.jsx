import { useGameConnection } from '../hooks/useGameConnection'
import { useGameStore } from '../store/gameStore'
import { useState } from 'react'

export const ControllerPage = () => {
  const { wsStatus, ip, activeCharacter } = useGameStore()
  const { sendInput } = useGameConnection()
  
  // Si no hay IP mostramos la página de conexión manual
  const [manualIp, setManualIp] = useState('')
  const { setConnectionDetails } = useGameStore()

  const handleManualConnect = () => {
    if (manualIp) setConnectionDetails(manualIp, '8080')
  }

  if (!ip) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-gray-950/80 border border-white/15 rounded-2xl px-8 py-8 max-w-md">
          <h1 className="text-3xl font-black mb-3">Kimaya Companion App</h1>
          <p className="mb-6 opacity-80">Escanea el QR del juego o escribe la IP de tu PC. Historial y Lore se pueden ver sin conectar.</p>
          <input 
            type="text" 
            placeholder="Ej: 192.168.1.15" 
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            className="p-3 text-xl rounded-lg bg-white text-gray-900 text-center mb-4 w-full border border-gray-300"
          />
          <button onClick={handleManualConnect} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform">
            Conectar Mando
          </button>
        </div>
      </div>
    )
  }

  // Mando Principal
  const btnColor = activeCharacter === 'falin' ? 'bg-yellow-600' : 'bg-pink-600'

  return (
    <div className="flex flex-row items-center justify-between w-full h-full p-4 md:p-10 select-none">
      
      {/* Indicador de estado flotante */}
      {wsStatus !== 'Conectado' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full text-xs font-bold text-red-400 border border-red-500 shadow-xl z-50">
          Estado: {wsStatus}
        </div>
      )}

      {/* D-PAD (Lado Izquierdo) */}
      <div className="w-1/3 flex items-center justify-center">
        <div className="relative w-40 h-40">
           <GamepadButton btn="UP" sendInput={sendInput} className={`absolute top-0 left-12 w-16 h-16 ${btnColor} rounded-t-lg shadow-[0_5px_0_rgba(0,0,0,0.5)]`} />
           <GamepadButton btn="LEFT" sendInput={sendInput} className={`absolute top-12 left-0 w-16 h-16 ${btnColor} rounded-l-lg shadow-[0_5px_0_rgba(0,0,0,0.5)]`} />
           <div className={`absolute top-12 left-12 w-16 h-16 ${btnColor}`}></div> {/* Centro */}
           <GamepadButton btn="RIGHT" sendInput={sendInput} className={`absolute top-12 right-0 w-16 h-16 ${btnColor} rounded-r-lg shadow-[0_5px_0_rgba(0,0,0,0.5)]`} />
           <GamepadButton btn="DOWN" sendInput={sendInput} className={`absolute bottom-0 left-12 w-16 h-16 ${btnColor} rounded-b-lg shadow-[0_5px_0_rgba(0,0,0,0.5)]`} />
        </div>
      </div>

      {/* Botones Centrales (SELECT / START) */}
      <div className="w-1/3 flex flex-col items-center justify-end h-full pb-8 space-y-4">
         <GamepadButton btn="SELECT" sendInput={sendInput} className="w-16 h-6 bg-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md" label="SELECT" />
         <GamepadButton btn="START" sendInput={sendInput} className="w-16 h-6 bg-gray-600 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md" label="START" />
      </div>

      {/* Botones de Acción (Lado Derecho) */}
      <div className="w-1/3 flex items-center justify-center">
        <div className="relative w-40 h-40">
           <GamepadButton btn="Y" sendInput={sendInput} className="absolute top-0 left-12 w-14 h-14 bg-yellow-500 text-black font-black rounded-full shadow-[0_5px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-xl" label="Y" />
           <GamepadButton btn="X" sendInput={sendInput} className="absolute top-12 left-0 w-14 h-14 bg-blue-600 text-white font-black rounded-full shadow-[0_5px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-xl" label="X" />
           <GamepadButton btn="B" sendInput={sendInput} className="absolute top-12 right-0 w-14 h-14 bg-red-600 text-white font-black rounded-full shadow-[0_5px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-xl" label="B" />
           <GamepadButton btn="A" sendInput={sendInput} className="absolute bottom-0 left-12 w-14 h-14 bg-green-600 text-white font-black rounded-full shadow-[0_5px_0_rgba(0,0,0,0.5)] flex items-center justify-center text-xl" label="A" />
        </div>
      </div>
    </div>
  )
}

function GamepadButton({ btn, label, className, sendInput }) {
  const handleStart = (e) => {
    if (e.cancelable) e.preventDefault() // Prevenir scroll/zoom
    sendInput(btn, 1)
  }
  const handleEnd = (e) => {
    if (e.cancelable) e.preventDefault()
    sendInput(btn, 0)
  }

  return (
    <div 
      className={`${className} active:scale-95 active:shadow-none active:translate-y-1 transition-all cursor-pointer`}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {label && <span>{label}</span>}
    </div>
  )
}
