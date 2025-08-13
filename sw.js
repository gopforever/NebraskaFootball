// Simple app-shell cache for offline use
const CACHE = "nu-history-shell-v1";
const ASSETS = ["./", "./index.html"];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE?null:caches.delete(k))))
  );
});

self.addEventListener("fetch", (e)=>{
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request))
    );
  }
  // API requests are handled in-page via IndexedDB (not cached here).
});
