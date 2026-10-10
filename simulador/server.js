// Simula al juego: recibe los botones del control y los imprime.
// No guarda nada ni mueve personajes, solo dice que se esta presionando.
import os from 'node:os'
import { WebSocketServer } from 'ws'

const PORT = 8080
const presionados = new Set()

const server = new WebSocketServer({ port: PORT, path: '/mando', host: '0.0.0.0' })

const ips = Object.values(os.networkInterfaces())
  .flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal)
  .map((n) => n.address)

console.log('Simulador de Kimaya')
console.log(`Escuchando en ws://localhost:${PORT}/mando`)
if (ips.length) console.log(`Desde el celular, en la misma red: ${ips.map((ip) => `ws://${ip}:${PORT}/mando`).join('  ')}`)
console.log('Abre la app con npm run dev y conecta a 127.0.0.1')
console.log('')

server.on('connection', (ws) => {
  console.log('Se conecto un control')

  ws.on('message', (raw) => {
    let data
    try {
      data = JSON.parse(raw.toString())
    } catch {
      console.log('Llego algo que no es JSON:', raw.toString())
      return
    }

    if (data.b) {
      if (data.s === 1) {
        presionados.add(data.b)
        console.log(`Presiono ${data.b}`)
      } else {
        presionados.delete(data.b)
        console.log(`Solto ${data.b}`)
      }
      console.log(`  ahora tiene: ${[...presionados].join(', ') || 'nada'}`)
      return
    }

    console.log('Otro mensaje:', data)
  })

  ws.on('close', () => {
    presionados.clear()
    console.log('Se desconecto el control')
  })
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya esta ocupado. Cierra lo que lo este usando y vuelve a correr el simulador.`)
  } else {
    console.error(err)
  }
  process.exit(1)
})
