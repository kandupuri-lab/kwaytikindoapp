// KWAYTIKINDOapp: abre na hora com o que está guardado no celular e atualiza por trás.
const C="kwaytikindo-v2.6";
const F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
const HOME=new URL("./",self.location).href;
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==self.location.origin)return;
  const nav=r.mode==="navigate";
  const key=nav?HOME:r;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(nav?HOME:r.url,{cache:"no-cache"}).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    const res=await net;
    return res||(nav?c.match("index.html"):Response.error());
  }));
});
