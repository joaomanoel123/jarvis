// Service Worker para J.A.R.V.I.S PWA
// Criado por João Manoel

const CACHE_NAME = 'jarvis-v1.0.0';
const urlsToCache = [
  '/jarvis/',
  '/jarvis/index.html',
  '/jarvis/style.css',
  '/jarvis/main.js',
  '/jarvis/main-github-pages.js',
  '/jarvis/controller.js',
  '/jarvis/eel.js',
  '/jarvis/manifest.json',
  '/jarvis/assets/img/logo.ico',
  // Adicionar outros recursos importantes
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
  console.log('🤖 JARVIS Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('❌ Erro ao cachear recursos:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', function(event) {
  console.log('🚀 JARVIS Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retornar resposta
        if (response) {
          console.log('📦 Servindo do cache:', event.request.url);
          return response;
        }

        // Fazer requisição de rede
        console.log('🌐 Buscando na rede:', event.request.url);
        return fetch(event.request).then(
          function(response) {
            // Verificar se recebemos uma resposta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(function(error) {
          console.error('❌ Erro na requisição:', error);
          
          // Retornar página offline se disponível
          if (event.request.destination === 'document') {
            return caches.match('/jarvis/index.html');
          }
        });
      })
  );
});

// Mensagens do cliente
self.addEventListener('message', function(event) {
  console.log('💬 Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificações push (futuro)
self.addEventListener('push', function(event) {
  console.log('🔔 Push recebido:', event);
  
  const options = {
    body: 'JARVIS tem uma nova mensagem para você!',
    icon: '/jarvis/assets/img/logo.ico',
    badge: '/jarvis/assets/img/logo.ico',
    tag: 'jarvis-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir JARVIS'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('J.A.R.V.I.S', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Notificação clicada:', event);
  
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('https://joaomanoel123.github.io/jarvis')
    );
  }
});

console.log('🤖 JARVIS Service Worker carregado - Criado por João Manoel');