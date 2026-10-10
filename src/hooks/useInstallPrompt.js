import { useEffect, useReducer } from 'react'

const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

const ua = navigator.userAgent || ''

export const isInAppBrowser = () => /; wv\)|Instagram|FBAN|FBAV|WhatsApp|Line\//i.test(ua)

export const openInChrome = () => {
  const stripped = location.href.replace(/^https?:\/\//, '')
  location.href = `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(location.href)};end`
}

export const useInstallPrompt = () => {
  const [, rerender] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    window.addEventListener('kimaya-install', rerender)
    return () => window.removeEventListener('kimaya-install', rerender)
  }, [])

  return {
    canPrompt: Boolean(window.__kimayaPrompt),
    installed: Boolean(window.__kimayaInstalled) || standalone(),
    isIos: /iphone|ipad|ipod/i.test(ua),
    isInApp: isInAppBrowser(),
    openInChrome,
  }
}
