// Offline gyorsítótár. Új verzió kiadásakor növeld a VERSION számot!
const VERSION='v12';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./docs/oktatoanyag.pdf','./audio/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(VERSION);await c.addAll(FILES);
 try{const m=await (await fetch('./audio/manifest.json',{cache:'no-store'})).json();const fs=[];for(const k in m){if(k==='_')continue;for(let n=0;n<m[k];n++)fs.push('./audio/'+k+'-'+n+'.mp3')}
  for(let j=0;j<fs.length;j+=20)await c.addAll(fs.slice(j,j+20))}catch(x){}})());self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const c=n.clone();caches.open(VERSION).then(x=>x.put(e.request,c))}return n}).catch(()=>caches.match('./index.html'))))});
