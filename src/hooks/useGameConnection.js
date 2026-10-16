import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'

// Se usa una sola vez en App. Los botones mandan datos con `send` del store.
export const useGameConnection = () => {
  const ip = useGameStore((s) => s.ip)
  const port = useGameStore((s) => s.port)
  const [retry, setRetry] = useState(0)

  // Si la app se abrio desde el QR, la url trae ?ip=...&port=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ipParam = params.get('ip')
    if (ipParam) {
      useGameStore.getState().setConnectionDetails(ipParam, params.get('port') || '8080')
    }
  }, [])

  useEffect(() => {
    if (!ip) return

    const store = useGameStore.getState()
    let closedByUs = false
    let retryTimer
    let ws

    store.setWsStatus('connecting')
    try {
      ws = new WebSocket(`ws://${ip}:${port}/mando`)
    } catch (e) {
      console.error(e)
      store.setWsStatus('error')
      return
    }

    ws.onopen = () => {
      store.setWsStatus('connected')
      store.setSender((payload) => {
        console.log('Mando -> juego', `ws://${ip}:${port}/mando`, payload)
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
        else console.warn('No se mando al juego: el socket no esta abierto', payload)
      })
    }

    ws.onmessage = (event) => {
      let data
      try {
        data = JSON.parse(event.data)
      } catch (e) {
        console.error('Mensaje del juego que no es JSON', e)
        return
      }
      const s = useGameStore.getState()
      switch (data.event) {
        case 'damage_received':
          s.triggerHit()
          if (typeof data.health === 'number') s.setHealth(data.health)
          break
        case 'low_health':
          s.setHealth(data.health ?? 20)
          break
        case 'enemy_defeated':
          s.triggerEnemyDefeated()
          break
        case 'character_switch':
          s.setCharacter(data.character)
          break
        case 'game_state':
          s.setGameState(data.state)
          break
      }
    }

    ws.onerror = () => store.setWsStatus('error')

    ws.onclose = () => {
      store.setSender(() => {})
      if (closedByUs) return
      store.setWsStatus('closed')
      retryTimer = setTimeout(() => setRetry((r) => r + 1), 3000)
    }

    return () => {
      closedByUs = true
      clearTimeout(retryTimer)
      ws.close()
    }
  }, [ip, port, retry])
}
