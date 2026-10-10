import { useState } from 'react'

export function ManualIpDialog({ onConnect, onClose }) {
  const [ip, setIp] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = ip.trim()
    if (!value) return
    const [host, port] = value.split(':')
    onConnect(host, port || '8080')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="neu w-[min(360px,80vw)] rounded-[28px] p-6">
        <h3 className="text-lg font-extrabold">Escribir la IP</h3>
        <p className="text-muted mt-1 text-sm">Viene abajo del QR en la pantalla del juego.</p>
        <input
          autoFocus
          inputMode="decimal"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="192.168.1.20"
          className="neu-inset text-ink placeholder:text-muted mt-4 w-full rounded-2xl px-4 py-3 text-center text-lg outline-none select-text"
        />
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="neu-sm text-muted rounded-full px-5 py-2 font-bold">
            Cancelar
          </button>
          <button type="submit" className="neu-sm text-accent rounded-full px-5 py-2 font-extrabold">
            Conectar
          </button>
        </div>
      </form>
    </div>
  )
}
