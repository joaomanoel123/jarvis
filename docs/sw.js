// Service Worker for Jarvis PWA
const CACHE_NAME = 'jarvis-v1';
const BASE_PATH = '/jarvis';

const urlsToCache = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/style.css`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/main-github-pages.js`,
    `${BASE_PATH}/jarvis-tts.js`,
    `${BASE_PATH}/jarvis-google-tts.js`,
    `${BASE_PATH}/jarvis-speech-recognition.js`,
    `${BASE_PATH}/controller.js`,
    `${BASE_PATH}/core/core.js`,
    `${BASE_PATH}/eel.js`
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});