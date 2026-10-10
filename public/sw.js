self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Un service worker mínimo requerido para que Android detecte la PWA
  e.respondWith(fetch(e.request).catch(() => new Response("Offline")));
});
