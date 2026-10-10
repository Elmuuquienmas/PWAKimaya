import { useEffect, useReducer } from 'react'

const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

const ua = navigator.userAgent || ''

export const useInstallPrompt = () => {
  const [, rerender] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    window.addEventListener('kimaya-install', rerender)
    return () => window.removeEventListener('kimaya-install', rerender)
  }, [])

  return {
    installed: Boolean(window.__kimayaInstalled) || standalone(),
    isIos: /iphone|ipad|ipod/i.test(ua),
  }
}
