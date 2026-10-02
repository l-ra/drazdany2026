const CACHE='drazdany2026-v8';
const ASSETS=['./index.html','./app.css','./app.js','./manifest.webmanifest','./icon.svg','./invite.svg','./qrcode.js'];
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    for(const url of ASSETS){
      const response=await fetch(url,{cache:'reload'});
      if(!response.ok) throw new Error('Precache failed: '+url);
      await cache.put(url,response.clone());
    }
  })());
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(async response=>{
        if(response.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',response.clone())}
        return response;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(async response=>{
      if(response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone())}
      return response;
    }))
  );
});