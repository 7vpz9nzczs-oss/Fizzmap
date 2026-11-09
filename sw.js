// FIZZMAP 6.3 – network-first app shell; source-of-truth user data is in IndexedDB / Supabase.
const CACHE='fizzmap-release-6-4-ui';
const SHELL=['./','./index.html','./fizzmap-config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fizzmap-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;event.respondWith(fetch(req).then(resp=>{if(resp.ok){let clone=resp.clone();caches.open(CACHE).then(c=>c.put(req,clone)).catch(()=>{})}return resp}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))))});
