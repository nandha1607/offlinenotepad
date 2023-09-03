// Define a cache name for your application
const CACHE_NAME = 'offline-notepad-cache-v1';

// Files to cache
const cachedFiles = [
  '/',
  'index.html',
  'js/script.js',
  'css/styles.css',
  'manifest.json',
  'libs/js/bootstrap.min.js', 
  'libs/js/jquery-3.6.0.min.js',
  'libs/css/bootstrap.min.css',
  'libs/fontawesome-free-6.4.2-web/css/all.min.css',
  'libs/fontawesome-free-6.4.2-web/webfonts/fa-solid-900.woff2',
  'libs/fontawesome-free-6.4.2-web/LICENSE.txt',
  'img/logo.png',
  'img/github-icon.png',
  'img/icon.png'
  // Add other files to cache if needed...
];

// Service Worker Installation
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(cachedFiles);
    })
  );
});

// Service Worker Activation (Cleanup or Version Management)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Delete outdated caches (if any)
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Service Worker Fetch (Network Request Handling)
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        // Cache hit, return the cached response
        return cachedResponse;
      }

      // No cache match, fetch the request from the network
      return fetch(event.request).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response to store it in the cache
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
