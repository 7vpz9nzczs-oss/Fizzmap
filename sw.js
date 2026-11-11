/* FIZZMAP 6.5: network-first app shell; personal data remains in IndexedDB/Supabase. */
const FIZZ_CACHE = 'fizzmap-release-6-5-public-news';
const FIZZ_SHELL = ['./','./index.html','./fizzmap-config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => { event.waitUntil((async () => {
  const cache=await caches.open(FIZZ_CACHE);
  await Promise.allSettled(FIZZ_SHELL.map(async path=>{const response=await fetch(path,{cache:'reload'});if(response.ok)await cache.put(path,response)}));
  await self.skipWaiting();
})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('fizzmap-')&&k!==FIZZ_CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})());});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  event.respondWith(fetch(req).then(response=>{if(response.ok){const clone=response.clone();caches.open(FIZZ_CACHE).then(c=>c.put(req,clone)).catch(()=>{})}return response}).catch(async()=>{
    const cached=await caches.match(req);if(cached)return cached;
    if(req.mode==='navigate')return (await caches.match('./index.html'))||Response.error();
    return Response.error();
  }));
});
