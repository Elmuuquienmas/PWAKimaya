import { useEffect, useReducer } from 'react'

// El evento beforeinstallprompt puede llegar antes de que React monte, por eso se escucha aqui afuera.
let deferredPrompt = null
let installed = false
const listeners = new Set()
const notify = () => listeners.forEach((listener) => listener())

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  installed = true
  notify()
})

export const useInstallPrompt = () => {
  const [, rerender] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    listeners.add(rerender)
    return () => listeners.delete(rerender)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return 'manual'
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    deferredPrompt = null
    notify()
    return outcome
  }

  return {
    canPrompt: Boolean(deferredPrompt),
    installed,
    isIos: /iphone|ipad|ipod/i.test(navigator.userAgent),
    install,
  }
}
