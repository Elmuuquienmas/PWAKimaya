// El QR del juego trae la url de la app con ?ip=...&port=...
// Tambien aceptamos solo "192.168.1.20" o "192.168.1.20:8080".
export const parseConnectionFromQr = (text) => {
  try {
    const url = new URL(text)
    const ip = url.searchParams.get('ip')
    if (ip) return { ip, port: url.searchParams.get('port') || '8080' }
  } catch {
    // no era una url
  }

  const match = text.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?$/)
  if (match) {
    // 8090 es la pagina del control, no el mando. Si lo escriben tal cual, se usa el 8080.
    const port = match[2] && match[2] !== String(CONTROL_PORT) ? match[2] : '8080'
    return { ip: match[1], port }
  }

  return null
}

// El juego sirve esta misma app por http en este puerto (PadWebHost en Unity).
export const CONTROL_PORT = 8090

const isLocalHost = (host) => host === 'localhost' || host === '127.0.0.1' || host === '[::1]'

// Solo redes de casa u oficina. Evita que ?ip=... lleve a cualquier sitio de internet.
export const isPrivateIp = (host) => {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host || '')
  if (!match) return false
  const [a, b, c, d] = match.slice(1).map(Number)
  if ([a, b, c, d].some((n) => n > 255)) return false
  return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31)
}

// Una pagina https no puede abrir ws:// (el iPhone y Chrome lo bloquean).
// Para hablar con el juego hay que estar en la pagina http que sirve el propio juego.
export const needsHttpControl = (host) => window.location.protocol === 'https:' && !isLocalHost(host)

export const httpControlUrl = (ip, port) =>
  `http://${ip}:${CONTROL_PORT}/?ip=${encodeURIComponent(ip)}&port=${encodeURIComponent(port || '8080')}`
