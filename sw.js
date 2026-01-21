const CACHE_NAME = 'orla-codema-v1';
const urlsToCache = [
  './',
  './index.html',
  './Orla-Codema64.ico'
];

// Instalar el Service Worker y cachear contenido
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia de respuesta: primero red, si falla, caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});