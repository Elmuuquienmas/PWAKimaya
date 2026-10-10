import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LandingPage } from './pages/LandingPage.jsx'

// Solo cuenta como app instalada si se abrio desde el icono.
// En el navegador (aunque este en pantalla completa) se ve la pagina del juego.
const params = new URLSearchParams(window.location.search)
const isInstalled =
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
const Root = isInstalled || params.has('ip') || params.has('app') ? App : LandingPage
if (Root === LandingPage) document.documentElement.classList.add('landing')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
