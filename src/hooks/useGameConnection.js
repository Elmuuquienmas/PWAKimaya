import { useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'

export const useGameConnection = () => {
  const wsRef = useRef(null)
  
  const { ip, port, setConnectionDetails, setWsStatus, triggerHit, setCharacter } = useGameStore()

  useEffect(() => {
    // Buscar parametros de conexion (QR code)
    const params = new URLSearchParams(window.location.search)
    const ipParam = params.get('ip')
    const portParam = params.get('port') || '8080'

    if (ipParam && !ip) {
      setConnectionDetails(ipParam, portParam)
    }
  }, [ip, setConnectionDetails])

  useEffect(() => {
    if (!ip) return

    setWsStatus('Conectando...')
    const wsUrl = `ws://${ip}:${port}/mando`
    
    try {
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        setWsStatus('Conectado')
      }
      
      ws.onmessage = (event) => {
        // Recibir eventos de Unity (Opcional, para UI visual)
        try {
          const data = JSON.parse(event.data)
          if (data.event === 'damage_received') {
            triggerHit()
          } else if (data.event === 'character_switch') {
            setCharacter(data.character)
          }
        } catch (e) {
          console.error("Error parseando msj del WS", e)
        }
      }

      ws.onclose = () => {
        setWsStatus('Desconectado')
        // Intentar reconectar
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            setConnectionDetails(ip, port) // Refresca para forzar otro intento si es necesario
          }
        }, 3000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket Error:', error)
        setWsStatus('Error de conexión')
      }
      
      wsRef.current = ws
    } catch (e) {
      console.error(e)
      setWsStatus('Error al instanciar WS')
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [ip, port, setWsStatus, setConnectionDetails, triggerHit, setCharacter])

  const sendInput = useCallback((button, state) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ b: button, s: state })
      wsRef.current.send(payload)
    }
    
    // Haptic feedback (Vibración al pulsar botones)
    if (state === 1 && navigator.vibrate) {
      navigator.vibrate(50)
    }
  }, [])

  return { sendInput }
}
