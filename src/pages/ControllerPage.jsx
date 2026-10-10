import { useCallback, useState } from 'react'
import { Keyboard, QrCode, WifiOff } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import { Gamepad } from '../components/Gamepad'
import { CameraFeed } from '../components/CameraFeed'
import { ManualIpDialog } from '../components/ManualIpDialog'

export function ControllerPage() {
  const ip = useGameStore((s) => s.ip)
  const wsStatus = useGameStore((s) => s.wsStatus)
  const demoConnected = useGameStore((s) => s.demoConnected)
  const setConnectionDetails = useGameStore((s) => s.setConnectionDetails)
  const clearConnection = useGameStore((s) => s.clearConnection)

  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [manualOpen, setManualOpen] = useState(false)

  const connected = demoConnected || wsStatus === 'connected'

  const handleDetected = useCallback(
    ({ ip, port }) => {
      setScanning(false)
      setConnectionDetails(ip, port)
    },
    [setConnectionDetails],
  )

  const startScan = () => {
    clearConnection()
    setCameraError('')
    setScanning(true)
  }

  return (
    <div className="absolute inset-0 px-[6vw] pb-3 pt-2">
      <div
        className={`relative h-full w-full overflow-hidden rounded-[32px] transition-colors duration-500 ${
          connected ? 'neu-inset' : 'bg-black'
        }`}
      >
        {!connected && <CameraFeed active={scanning} onDetected={handleDetected} onError={setCameraError} />}

        <Gamepad disabled={!connected} />

        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            {scanning ? (
              <ScanFrame error={cameraError} onCancel={() => setScanning(false)} />
            ) : ip ? (
              <ConnectionState ip={ip} wsStatus={wsStatus} onScan={startScan} onCancel={clearConnection} />
            ) : (
              <IdleState onScan={startScan} onManual={() => setManualOpen(true)} />
            )}
          </div>
        )}
      </div>

      {manualOpen && (
        <ManualIpDialog
          onClose={() => setManualOpen(false)}
          onConnect={(host, port) => {
            setManualOpen(false)
            setConnectionDetails(host, port)
          }}
        />
      )}
    </div>
  )
}

function IdleState({ onScan, onManual }) {
  return (
    <>
      <button
        type="button"
        onClick={onScan}
        className="neu text-accent flex h-[clamp(88px,30vh,140px)] w-[clamp(88px,30vh,140px)] flex-col items-center justify-center gap-1 rounded-full font-extrabold transition-transform active:scale-95"
      >
        <QrCode size={40} />
        <span className="text-xs">Escanear</span>
      </button>
      <p className="max-w-xs text-sm font-semibold text-white/80">Escanea el QR que aparece en la pantalla del juego</p>
      <button
        type="button"
        onClick={onManual}
        className="flex items-center gap-1.5 text-xs font-bold text-white/50 underline-offset-4 hover:underline"
      >
        <Keyboard size={14} /> o escribe la IP
      </button>
    </>
  )
}

function ScanFrame({ error, onCancel }) {
  const corner = 'absolute h-8 w-8 border-accent'
  return (
    <>
      <div className="relative h-[min(52vh,240px)] w-[min(52vh,240px)]">
        <span className={`${corner} left-0 top-0 rounded-tl-2xl border-l-4 border-t-4`} />
        <span className={`${corner} right-0 top-0 rounded-tr-2xl border-r-4 border-t-4`} />
        <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4`} />
        <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4`} />
      </div>
      <p className="text-sm font-semibold text-white/90">{error || 'Apunta al QR del juego'}</p>
      <button type="button" onClick={onCancel} className="rounded-full bg-white/15 px-5 py-1.5 text-xs font-bold text-white backdrop-blur">
        Cancelar
      </button>
    </>
  )
}

function ConnectionState({ ip, wsStatus, onScan, onCancel }) {
  const failed = wsStatus === 'closed' || wsStatus === 'error'
  return (
    <div className="neu flex max-w-sm flex-col items-center gap-3 rounded-[28px] px-7 py-6">
      {failed && <WifiOff className="text-red-500" />}
      <p className="font-extrabold">{failed ? `No se pudo conectar con ${ip}` : `Conectando con ${ip}…`}</p>
      <p className="text-muted text-xs">
        {failed ? 'Revisa que el juego esté abierto y que estés en la misma red. Seguimos intentando.' : 'Un momento.'}
      </p>
      <div className="mt-1 flex gap-3">
        <button type="button" onClick={onCancel} className="neu-sm text-muted rounded-full px-4 py-2 text-xs font-bold">
          Cancelar
        </button>
        <button type="button" onClick={onScan} className="neu-sm text-accent rounded-full px-4 py-2 text-xs font-extrabold">
          Escanear otro QR
        </button>
      </div>
    </div>
  )
}
