// sw.js - Service Worker Corrigido
const CACHE_NAME = 'jarvis-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main-github-pages-fixed.js',
  '/assets/img/logo.ico'
];

// Instalação
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(urlsToCache).catch((err) => {
          console.warn('Service Worker: Erro ao cachear alguns arquivos', err);
        });
      })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - Estratégia: Network First, depois Cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para APIs externas
  if (event.request.url.includes('render.com') || 
      event.request.url.includes('groq.com') ||
      event.request.url.includes('api.')) {
    return; // Deixar passar direto
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta é válida, clonar e cachear
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tentar cache
        return caches.match(event.request);
      })
  );
});
