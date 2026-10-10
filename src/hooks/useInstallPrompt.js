import { useEffect, useReducer } from 'react'

const notify = () => window.dispatchEvent(new Event('kimaya-install'))

const standalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

const ua = navigator.userAgent || ''

// WebView de WhatsApp, Instagram, etc. Ahi Chrome no deja instalar la app.
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

  const install = async () => {
    if (isInAppBrowser()) return 'chrome'
    const event = window.__kimayaPrompt
    if (!event) return 'wait'
    try {
      await event.prompt()
      const { outcome } = await event.userChoice
      window.__kimayaPrompt = null
      if (outcome === 'accepted') window.__kimayaInstalled = true
      notify()
      return outcome
    } catch {
      return 'manual'
    }
  }

  return {
    canPrompt: Boolean(window.__kimayaPrompt),
    installed: Boolean(window.__kimayaInstalled) || standalone(),
    isIos: /iphone|ipad|ipod/i.test(ua),
    isAndroid: /android/i.test(ua),
    isInApp: isInAppBrowser(),
    install,
    openInChrome,
  }
}
