// service-worker.js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('video-app-cache').then(cache => {
            return cache.addAll([
                '/', 
                '/index.html', 
                '/style.css',
                '/app.js',
                '/img/3d-lwl-166x44.png', 
             ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
