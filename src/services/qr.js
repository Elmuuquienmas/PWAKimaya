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
  if (match) return { ip: match[1], port: match[2] || '8080' }

  return null
}
