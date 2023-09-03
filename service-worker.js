self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('notes-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/script.js',
          '/css/styles.css',
          '/manifest.json',
          '/libs/js/bootstrap.min.js', 
          '/libs/js/jquery-3.6.0.min.js',
          '/libs/css/bootstrap.min.css',
          '/libs/fontawesome-free-6.4.2-web/css/all.min.css',
          '/libs/fontawesome-free-6.4.2-web/webfonts/fa-solid-900.woff2',
          '/libs/fontawesome-free-6.4.2-web/LICENSE.txt',
          '/img/logo.png',
          '/img/github-icon.png',
          '/img/icon.png'
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
  