const CACHE_NAME = 'cc-cache-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/app.css',
  '/currencies.js',
  '/countries.js',
  '/favicon.png',
  '/manifest.json',
]

// Install service worker and cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)))
})

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
})

// Serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
})
