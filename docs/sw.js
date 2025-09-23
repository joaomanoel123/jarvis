const CACHE_NAME = 'jarvis-v2-local';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './assets/img/logo.ico',
  // Recursos locais - Bootstrap
  './assets/css/bootstrap.min.css',
  './assets/css/bootstrap-icons.min.css',
  './js/bootstrap.bundle.min.js',
  // Recursos locais - jQuery e bibliotecas
  './js/jquery-3.6.0.min.js',
  './js/jquery.lettering.min.js',
  './js/jquery.textillate.min.js',
  './js/siriwave.js',
  './js/lottie-player.js',
  // Scripts principais
  './js/core-js.min.js',
  './main-github-pages-fixed.js',
  './jarvis-speech-recognition.js',
  './jarvis-tts.js',
  './cache-buster.js',
  // Versão mobile
  './mobile/index.html',
  './mobile/mobile-main.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      console.log('🧹 Limpando caches antigos...');
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('✅ Cache atualizado para:', CACHE_NAME);
        // Forçar controle imediato de todas as abas
        return self.clients.claim();
      });
    })
  );
});

// Forçar atualização do Service Worker
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});