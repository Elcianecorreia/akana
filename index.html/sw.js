const CACHE_NAME = 'santuario-v1';
const assets = [
  './',
  './index.html',
  './foco.html',
  './loja.html',
  './style.css',
  './storage.js',
  './foco.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js' // Adicionei a biblioteca do gráfico para carregar rápido!
];

// Instalação: Salva os arquivos no celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Santuário Max: Arquivos armazenados com sucesso! 🏰");
      return cache.addAll(assets);
    })
  );
});

// Ativação: Limpa caches antigos se você atualizar o app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Busca: Tenta o cache primeiro, se não tiver, busca na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});