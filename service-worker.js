self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('notes-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/app.js',
          '/js/jquery.min.js',
          '/css/style.css',
          '/manifest.json',
          // ... Add other files to cache ...
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  