import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Desconectado')
  const [ip, setIp] = useState('')
  const [port, setPort] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ipParam = params.get('ip')
    const portParam = params.get('port')

    if (ipParam && portParam) {
      setIp(ipParam)
      setPort(portParam)
      connectWebSocket(ipParam, portParam)
    }
    
    // Disable right click / context menu
    const handleContextMenu = (e) => e.preventDefault()
    window.addEventListener('contextmenu', handleContextMenu)

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const connectWebSocket = (hostIp, hostPort) => {
    setStatus('Conectando...')
    const wsUrl = `ws://${hostIp}:${hostPort}/mando`
    
    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        setStatus('Conectado')
      }
      
      ws.onclose = () => {
        setStatus('Desconectado')
        // Intento de reconexión
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            connectWebSocket(hostIp, hostPort)
          }
        }, 3000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket Error:', error)
        setStatus('Error de conexión')
      }
      
      wsRef.current = ws
    } catch (e) {
      console.error(e)
      setStatus('Error al instanciar WS')
    }
  }

  const sendInput = useCallback((button, state) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ b: button, s: state })
      wsRef.current.send(payload)
    }
    
    if (state === 1 && navigator.vibrate) {
      navigator.vibrate(50) // Haptic feedback
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
    } else {
      alert("La app ya está instalada o tu navegador no detectó el prompt nativo aún. Usa la opción 'Añadir a la pantalla de inicio' del menú.")
    }
  }

  const [manualIp, setManualIp] = useState('')

  const handleManualConnect = () => {
    if (manualIp) {
      setIp(manualIp)
      setPort('8080')
      connectWebSocket(manualIp, '8080')
    }
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (!ip || !port) {
    if (isStandalone) {
      // Estamos dentro de la PWA instalada, mostramos un menú para conectar manualmente
      return (
        <div className="landing-page">
          <h1>Mando Unity</h1>
          <p>La app está instalada. Escanea el QR del juego o ingresa la IP local de tu PC para jugar.</p>
          <div style={{ marginTop: '20px' }}>
            <input 
              type="text" 
              placeholder="Ej: 192.168.1.15" 
              value={manualIp}
              onChange={(e) => setManualIp(e.target.value)}
              style={{ padding: '10px', fontSize: '1.2rem', borderRadius: '5px', textAlign: 'center' }}
            />
            <br />
            <button className="install-btn" onClick={handleManualConnect} style={{ marginTop: '15px' }}>
              Conectar al Mando
            </button>
          </div>
        </div>
      )
    }

    // Página web normal para poder descargar la app
    return (
      <div className="landing-page">
        <h1>Doggy Gamepad</h1>
        <p>¡Bienvenido! Esta es la PWA para controlar el juego.</p>
        <div className="dog-images">
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Perrito 1" />
          <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Perrito 2" />
        </div>
        <div className="instructions">
          <p>Para usar el mando:</p>
          <ol>
            <li>Abre el juego en tu PC.</li>
            <li>Escanea el código QR que aparece en la pantalla.</li>
          </ol>
        </div>
        <button className="install-btn" onClick={handleInstallClick}>
          Instalar App
        </button>
      </div>
    )
  }

  // MANDO DE CONTROL (Cuando ya hay IP conectada)
  return (
    <div className="gamepad-container">
      {status !== 'Conectado' && (
        <div className="status-overlay">
          <p>Estado: {status}</p>
        </div>
      )}
      
      <div className="d-pad-section">
        <div className="d-pad">
          <div className="d-pad-row">
            <GamepadButton btn="UP" sendInput={sendInput} className="d-btn up" />
          </div>
          <div className="d-pad-row center-row">
            <GamepadButton btn="LEFT" sendInput={sendInput} className="d-btn left" />
            <div className="d-pad-center"></div>
            <GamepadButton btn="RIGHT" sendInput={sendInput} className="d-btn right" />
          </div>
          <div className="d-pad-row">
            <GamepadButton btn="DOWN" sendInput={sendInput} className="d-btn down" />
          </div>
        </div>
      </div>
      
      <div className="center-section">
        <GamepadButton btn="SELECT" sendInput={sendInput} className="sys-btn" label="SELECT" />
        <GamepadButton btn="START" sendInput={sendInput} className="sys-btn" label="START" />
      </div>

      <div className="action-section">
        <div className="action-buttons">
          <GamepadButton btn="Y" sendInput={sendInput} className="act-btn y" label="Y" />
          <GamepadButton btn="X" sendInput={sendInput} className="act-btn x" label="X" />
          <GamepadButton btn="B" sendInput={sendInput} className="act-btn b" label="B" />
          <GamepadButton btn="A" sendInput={sendInput} className="act-btn a" label="A" />
        </div>
      </div>
    </div>
  )
}

function GamepadButton({ btn, label, className, sendInput }) {
  const handleStart = (e) => {
    if (e.cancelable) e.preventDefault() // Prevenir scroll o zoom nativo
    sendInput(btn, 1)
  }

  const handleEnd = (e) => {
    if (e.cancelable) e.preventDefault()
    sendInput(btn, 0)
  }

  return (
    <div 
      className={`btn ${className}`}
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

export default App
