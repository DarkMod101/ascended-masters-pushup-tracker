const CACHE_NAME = "ascended-masters-pushup-v18";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-new.png",
  "./assets/images/standard-pushup.png",
  "./assets/images/finger-root-pushup.png",
  "./assets/images/diamond-pushup.png",
  "./assets/images/decline-pushup.png",
  "./assets/images/incline-pushup.png",
  "./assets/images/explosive-pushup.png",
  "./assets/images/headstand-pushup-new.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
