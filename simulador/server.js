// Simula al juego: muestra un QR para conectar el celular
// y imprime que boton se esta presionando.
import http from 'node:http'
import os from 'node:os'
import QRCode from 'qrcode'
import { WebSocketServer } from 'ws'

// 8080 lo ocupa el backend de Spring Boot (kimaya-api) y 8081 lo reserva Windows.
// El simulador usa otro puerto.
const PORT = 8082
const APP_PORT = 5173
const presionados = new Set()

const ips = Object.values(os.networkInterfaces())
  .flat()
  .filter((n) => n && n.family === 'IPv4' && !n.internal)
  .map((n) => n.address)

// 172.x suele ser una red virtual, no la del wifi
const lanIp = ips.find((ip) => ip.startsWith('192.168.') || ip.startsWith('10.')) || ips[0] || '127.0.0.1'
const appUrl = `http://${lanIp}:${APP_PORT}/?ip=${lanIp}&port=${PORT}`

const page = async () => {
  const qr = await QRCode.toString(appUrl, { type: 'svg', margin: 1, width: 320 })
  return `<!doctype html>
<html lang="es">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QR de Kimaya</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#111;color:#fff;font-family:system-ui">
  <main style="text-align:center;padding:24px">
    <p style="letter-spacing:.2em;font-size:12px;opacity:.6">ESCANEA CON EL CELULAR</p>
    <h1 style="margin:8px 0 20px">Conectar el control</h1>
    <div style="background:#fff;padding:16px;border-radius:24px;display:inline-block">${qr}</div>
    <p style="margin-top:20px;opacity:.8">El celular y esta PC tienen que estar en el mismo wifi.</p>
    <p style="font-size:13px;opacity:.5;word-break:break-all">${appUrl}</p>
  </main>
</body>`
}

const httpServer = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(await page())
})

const sockets = new WebSocketServer({ server: httpServer, path: '/mando' })

sockets.on('connection', (ws) => {
  console.log('Se conecto un control')
  ws.on('message', (raw) => {
    let data
    try {
      data = JSON.parse(raw.toString())
    } catch {
      console.log('Llego algo que no es JSON:', raw.toString())
      return
    }
    if (!data.b) {
      console.log('Otro mensaje:', data)
      return
    }
    if (data.s === 1) {
      presionados.add(data.b)
      console.log(`Presiono ${data.b}`)
    } else {
      presionados.delete(data.b)
      console.log(`Solto ${data.b}`)
    }
    console.log(`  ahora tiene: ${[...presionados].join(', ') || 'nada'}`)
  })
  ws.on('close', () => {
    presionados.clear()
    console.log('Se desconecto el control')
  })
})

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya esta ocupado. Cierra el simulador anterior y vuelve a correrlo.`)
  } else {
    console.error(err)
  }
  process.exit(1)
})

httpServer.listen(PORT, '0.0.0.0', async () => {
  console.log('Simulador de Kimaya')
  console.log(`QR para el celular: http://localhost:${PORT}`)
  console.log(`Ese QR abre: ${appUrl}`)
  console.log('')
  console.log(await QRCode.toString(appUrl, { type: 'terminal', small: true }))
})
