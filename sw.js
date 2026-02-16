const CACHE_NAME = 'resonancia-paz-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo en caché si existe, si no, lo busca en la red
        return response || fetch(event.request);
      })
  );
});
