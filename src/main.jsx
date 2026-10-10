import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LandingPage } from './pages/LandingPage.jsx'

// Instalada como app (o abierta desde el QR) va directo al control.
// En el navegador normal se ve la pagina del juego.
const params = new URLSearchParams(window.location.search)
const isInstalled =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  window.navigator.standalone === true
const Root = isInstalled || params.has('ip') || params.has('app') ? App : LandingPage

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
