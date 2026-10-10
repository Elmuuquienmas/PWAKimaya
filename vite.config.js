import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-64.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'promo/*.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'Kimaya Companion App',
        short_name: 'Kimaya',
        description: 'Controlador interactivo y Companion App para Kimaya: El Bosque del Eco',
        // Sin ?app=1: con query en start_url Chrome Android dice "This app cannot be installed".
        // La app instalada se reconoce por display-mode standalone en main.jsx.
        id: '/',
        start_url: '/',
        scope: '/',
        theme_color: '#262a31',
        background_color: '#262a31',
        display: 'standalone',
        display_override: ['standalone', 'browser'],
        prefer_related_applications: false,
        // any: en iPhone la app instalada si puede girar. Si se omite, iOS la deja fija.
        orientation: 'any',
        lang: 'es',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ]
      },
      workbox: {
        globIgnores: ['**/manifest.json', '**/manifest.webmanifest', '**/icon-*.png'],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              (request.destination === 'image' && !url.pathname.startsWith('/icon-')) ||
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.includes('/api/'), // Asumiendo que simularemos la API aqui o llamaremos a endpoints locales
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 dia
              }
            }
          }
        ]
      }
    })
  ],
})
