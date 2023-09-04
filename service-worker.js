// Define a cache name for your application
const CACHE_NAME = 'offline-notepad-cache-v2'; // Change the cache version

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
      return cache.addAll(cachedFiles)
        .catch(function(error) {
          console.error('Failed to cache one or more resources:', error);
        });
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
    // Check for requests to "https://nandha1607.github.io"
    // and redirect them to "https://nandha1607.github.io/offlinenotepad"
    redirectToOfflineNotepad(event)
  );
});

// Function to redirect requests to "https://nandha1607.github.io" to "https://nandha1607.github.io/offlinenotepad"
function redirectToOfflineNotepad(event) {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === 'https://nandha1607.github.io') {
    // Redirect the request to "https://nandha1607.github.io/offlinenotepad"
    const redirectedUrl = 'https://nandha1607.github.io/offlinenotepad' + requestUrl.pathname;
  
    return fetch(redirectedUrl, { mode: 'no-cors' })
      .then(function(response) {
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
      })
      .catch(function(error) {
        // Network request failed, respond with a custom error page
        return new Response('Network request failed.');
      });
  }

  // If the request doesn't match the condition, proceed with the regular caching logic
  return caches.match(event.request).then(function(cachedResponse) {
    let online = navigator.onLine;

    // Check network connectivity
    if (!online) {
      if (cachedResponse) {
        // Cache hit, return the cached response
        return cachedResponse;
      } else {
        // Network is offline, and no cached response available
        // Respond with a custom offline page or an error page
        return new Response('You are offline.');
      }
    }

    // Network is online, fetch from the network
    return fetch(event.request)
      .then(function(response) {
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
      })
      .catch(function(error) {
        // Network request failed, respond with a custom error page
        return new Response('Network request failed.');
      });
  });
}
