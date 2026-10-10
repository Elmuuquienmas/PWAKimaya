import { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'
import { parseConnectionFromQr } from '../services/qr'

// onDetected y onError tienen que ser estables, si no se reinicia la camara.
export function CameraFeed({ active, onDetected, onError }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!active || !videoRef.current) return

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        const connection = parseConnectionFromQr(result.data)
        if (connection) onDetected(connection)
      },
      { returnDetailedScanResult: true, preferredCamera: 'environment', maxScansPerSecond: 6 },
    )

    scanner.start().catch(() => onError('No se pudo abrir la cámara. Revisa los permisos del navegador.'))

    return () => {
      scanner.stop()
      scanner.destroy()
    }
  }, [active, onDetected, onError])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        active ? 'opacity-60' : 'opacity-0'
      }`}
    />
  )
}
