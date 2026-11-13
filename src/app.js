// ===== ALKALMAZÁS =====
const STEPS=__STEPS__;
const TL={0:['kesztyu'],5:['kupak'],6:['feszito'],7:['racsnis','kisk','drotkefe'],8:['nagyk','pajszer','kesztyu'],9:['racsnis'],11:['pajszer'],12:['ek','pajszer'],13:['beuto','kisk','pajszer'],14:['csavarhuzo','benzin'],15:['porszivo','kompresszor'],18:['nagyk'],20:['nyomatek'],21:['pajszer'],22:['nyomatek'],24:['pajszer'],25:['osszehuzo'],26:['nyomatek'],27:['feszito'],32:['madzag','idomszer']};
const PH=[{t:'Előkészítés',a:0,b:4,d:'Biztonság, terület, szerszámok, a jármű elhelyezése.',sc:0},{t:'Lánc lazítása, nyitása',a:5,b:10,d:'Zárókupak, feszítő összehúzása, összekötők bontása, leállás a láncról.',sc:6},{t:'Betétcsere',a:11,b:19,d:'Lánc megfordítása, régi betét ki, fészek tisztítása, új betét be.',sc:18},{t:'Visszaszerelés',a:20,b:26,d:'Nyomatékolás, visszafordítás, visszaállás, lánc egyesítése.',sc:25},{t:'Feszítés, ellenőrzés',a:27,b:33,d:'Feszítés, zárókupak vissza, menetpróba, feszességmérés.',sc:32}];
const NAV='<div class="nav"><button class="mb" id="bk">⌂ Főmenü</button></div>';
const phOf=k=>PH.findIndex(p=>k>=p.a&&k<=p.b);
let i=-1,voiceOn=true,hu=null,done=new Set();
try{done=new Set(JSON.parse(localStorage.getItem('pzh2done')||'[]'))}catch(e){}
const saveDone=()=>{try{localStorage.setItem('pzh2done',JSON.stringify([...done]));localStorage.setItem('pzh2step',i)}catch(e){}};
function pickVoice(){try{const v=speechSynthesis.getVoices();hu=bestVoice();const m=document.getElementById('vmsg');if(m)m.textContent=hu?'':'Nincs magyar felolvasó hang ezen a telefonon: Beállítások → Szövegfelolvasás → Google → Magyar. Addig olvasd a szöveget.'}catch(e){}}
if('speechSynthesis' in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
const split=t=>t.replace(/(\d)\./g,'$1\u2024').match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(x=>x.trim().replace(/\u2024/g,'.')).filter(Boolean);
let spk=0;
const VX=__VOICE__;
const fnv=s=>{let h=0x811c9dc5;for(const c of s){h^=c.codePointAt(0);h=Math.imul(h,0x01000193)>>>0}return h.toString(16).padStart(8,'0')};
let AUD=null,curA=null;fetch('audio/manifest.json').then(r=>r.ok?r.json():null).then(j=>{AUD=j}).catch(()=>{});
let useFiles=true;try{useFiles=localStorage.getItem('pzh2files')!=='0'}catch(e){}
function hush(){spk++;try{speechSynthesis.cancel()}catch(e){}if(curA){try{curA.pause()}catch(e){}curA=null}}
function playFiles(key,n,spans,my,t,pre){let k=0;const mark=j=>{if(!spans)return;spans.forEach((e,x)=>{if(e){e.classList.toggle('on',x===j);e.classList.toggle('past',x<j)}})};
 const fb=()=>{curA=null;if(my===spk)ttsSpeak(t,spans,pre,k)};
 const next=()=>{if(my!==spk)return;if(k>=n){spans&&spans.forEach(e=>{if(e){e.classList.remove('on');e.classList.remove('past')}});return}const au=new Audio('audio/'+key+'-'+k+'.mp3');curA=au;mark(k);au.onended=()=>{k++;setTimeout(next,260)};au.onerror=fb;au.play().catch(fb)};next()}
function speak(t,spans,pre){if(!voiceOn)return;hush();const full=(pre?pre+' ':'')+t,key=fnv(full);
 if(useFiles&&AUD&&AUD[key]){playFiles(key,AUD[key],spans,spk,t,pre);return}ttsSpeak(t,spans,pre,0)}
function ttsSpeak(t,spans,pre,from){if(!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const my=spk;const ss=split(t);if(pre)ss[0]=pre+' '+ss[0];
 ss.forEach((x,k)=>{if(k<(from||0))return;const u=new SpeechSynthesisUtterance(x);u.lang='hu-HU';if(hu)u.voice=hu;u.rate=VS.rate;u.pitch=VS.pitch;u.volume=1;
  u.onstart=()=>{if(my!==spk||!spans)return;spans.forEach((e,j)=>{if(e){e.classList.toggle('on',j===k);e.classList.toggle('past',j<k)}})};
  u.onend=()=>{if(my!==spk||!spans)return;if(k===ss.length-1)spans.forEach(e=>{if(e){e.classList.remove('on');e.classList.remove('past')}})};
  speechSynthesis.speak(u);if(k<ss.length-1){const p=new SpeechSynthesisUtterance(' ');p.lang='hu-HU';p.volume=0;p.rate=0.6;speechSynthesis.speak(p)}})}catch(e){}}
let VS={rate:0.97,pitch:0.78,name:''};try{Object.assign(VS,JSON.parse(localStorage.getItem('pzh2voice')||'{}'))}catch(e){}
const huVoices=()=>{try{return speechSynthesis.getVoices().filter(x=>/^hu/i.test(x.lang))}catch(e){return[]}};
function bestVoice(){const v=huVoices();if(VS.name){const f=v.find(x=>x.name===VS.name);if(f)return f}const rank=x=>(/natural|neural|online/i.test(x.name)?4:0)+(/tamás|tamas|male|férfi/i.test(x.name)?3:0)+(/google/i.test(x.name)?2:0)+(x.localService?0:1);v.sort((a,b)=>rank(b)-rank(a));return v[0]||null}
function voicePanel(){const v=huVoices();return `<div class="vp"><b>Hang beállítása</b>${v.length?`<select id="vsel">${v.map(x=>`<option ${hu&&x.name===hu.name?'selected':''}>${x.name}</option>`).join('')}</select>`:''}
<label>Hangmagasság <input type="range" id="vpi" min="0.5" max="1.2" step="0.05" value="${VS.pitch}"></label><label>Tempó <input type="range" id="vra" min="0.7" max="1.3" step="0.05" value="${VS.rate}"></label><label class="chk"><input type="checkbox" id="vfile" ${useFiles?'checked':''}> Élethű hang (hangfájlok, ha vannak)</label><div class="vmsg" id="vfs"></div><button class="sec" id="vtest">Próba</button><p class="hint">Bluetooth hangszóró vagy fülhallgató: párosítsd a telefonnal, és az app hangja automatikusan azon szól.</p></div>`}
function bindVoice(){const sv=()=>{try{localStorage.setItem('pzh2voice',JSON.stringify(VS))}catch(e){}};const s=$('vsel');if(s)s.onchange=e=>{VS.name=e.target.value;hu=bestVoice();sv()};
 $('vpi').oninput=e=>{VS.pitch=+e.target.value;sv()};$('vra').oninput=e=>{VS.rate=+e.target.value;sv()};const vf=$('vfile');if(vf)vf.onchange=e=>{useFiles=e.target.checked;try{localStorage.setItem('pzh2files',useFiles?'1':'0')}catch(x){}};const vfs=$('vfs');if(vfs)vfs.textContent=AUD&&Object.keys(AUD).filter(k=>k!=='_').length?'Élethű hangfájlok elérhetők.':'Hangfájlok még nincsenek – a telefon gépi hangja szól.';$('vtest').onclick=()=>{voiceOn=true;speak(VX.test)}}
function fitText(){const w=document.getElementById('lvw'),p=document.getElementById('lv');if(!w||!p)return;if(p.classList.contains('chkpage'))return fitGrid();let lo=14,hi=40;while(hi-lo>1){const m=(lo+hi)>>1;p.style.fontSize=m+'px';if(p.scrollHeight<=w.clientHeight)lo=m;else hi=m}p.style.fontSize=lo+'px';w.style.overflowY=p.scrollHeight>w.clientHeight+2?'auto':'hidden'}
addEventListener('resize',fitText);
let ac=null;function beep(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();[[523,0],[784,0.11]].forEach(([f,t])=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.setValueAtTime(0.0001,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(0.35,ac.currentTime+t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+t+0.2);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.22)})}catch(e){}try{navigator.vibrate&&navigator.vibrate(70)}catch(e){}}
const app=document.getElementById('app');
const $=id=>document.getElementById(id);
function fit(){document.querySelectorAll('.pic svg').forEach(sv=>{try{const b=sv.getBBox(),p=14;let w=b.width+p*2,h=b.height+p*2,x=b.x-p,y=b.y-p;const r=4/3;if(w/h<r){x-=(h*r-w)/2;w=h*r}else{y-=(w/r-h)/2;h=w/r}sv.setAttribute('viewBox',`${x} ${y} ${w} ${h}`)}catch(e){}})}
function timeline(cur){return `<div class="tl" id="tlb">${PH.map((p,k)=>{let n=0;for(let j=p.a;j<=p.b;j++)if(done.has(j))n++;const tot=p.b-p.a+1,c=k===phOf(cur)?'cur':n===tot?'ok':'';
 return `<div class="ph ${c}" style="flex:${tot}"><div class="pf"><i style="width:${n/tot*100}%"></i>${k===phOf(cur)?`<b style="left:${(cur-p.a+0.5)/tot*100}%"></b>`:''}</div><span>${k+1}</span></div>`}).join('')}</div>`}
function home(){i=-1;hush();let last=-1;try{last=+(localStorage.getItem('pzh2step')??-1)}catch(e){}
 app.innerHTML=`<div class="home"> <div class="kick">PzH2000 · futómű</div><h1 class="ht">Gumibetét csere</h1>
 <p class="lead">${STEPS.length} lépés · hang · szerszámlista. Egyik oldal, majd a másik ugyanígy.</p>
 <button class="cta" id="b1">Eligazítás és indulás</button>
 ${last>=0&&last<STEPS.length&&done.size?`<button class="sec" id="b2">Folytatás: ${last+1}. lépés · ${done.size} kész</button>`:''}
 <div class="two"><button class="sec" id="b3">Alapismeretek</button><button class="sec" id="b4">Hol járunk?</button></div>
 <button class="sec" id="b5">Nyomtatható oktatóanyag</button>
 <div class="two"><button class="sec" id="b7">Munkanapló</button><button class="sec" id="b8">${document.documentElement.classList.contains('night')?'Nappali mód':'Éjszakai mód'}</button></div>
 <button class="sec" id="b6">QR-kód · Megosztás · Offline</button><div class="ost" id="ost0"></div>
 <label class="chk"><input type="checkbox" id="vc" ${voiceOn?'checked':''}> Hangbemondás</label><div class="vmsg" id="vmsg"></div>${musicPanel()}${voicePanel()}
 <p class="foot">Összeállította: Strasszer szkv. · Az értékeket a TM alapján ellenőrizd.</p></div>`;
 pickVoice();fit();
 $('b1').onclick=brief;const b2=$('b2');if(b2)b2.onclick=()=>go(last);$('b3').onclick=know;$('b4').onclick=list;$('b5').onclick=printView;$('b6').onclick=shareView;$('b7').onclick=logView;$('b8').onclick=()=>{setNight(!document.documentElement.classList.contains('night'));home()};offlineStatus($('ost0'));$('vc').onchange=e=>voiceOn=e.target.checked;bindVoice();bindMusic();}
function brief(){i=-1;
 app.innerHTML=`<div class="page">${NAV}<div class="kick">Eligazítás</div><h1 class="ht">Üdvözlöm az állományt!</h1>
 <p class="lead">Mai feladat: a <b>PzH2000 lánc gumibetéteinek cseréje</b> mindkét oldalon. Oldalanként <b>95 lánctag</b>, <b>190 betét</b> (2,5 kg/db).</p>
 <div class="route">${PH.map((p,k)=>`<div class="stop"><div class="dot">${k+1}</div><div class="st"><b>${p.t}</b><span>${p.d}</span><em>${p.a+1}–${p.b+1}. lépés</em></div></div>`).join('')}</div>
 <div class="warn"><i>!</i><div><b>Kesztyű kötelező.</b> Tiszta, egyértelmű parancsok. Hangosan szóljatok egymásnak. A lánc fordításához 15–18 fő kell.</div></div>
 <button class="cta" id="go2m">Indulás munkazenével ♪</button><button class="sec" id="go">Indulás zene nélkül</button></div>`;
 fit();$('bk').onclick=home;const startWork=m=>{done.clear();saveDone();WK.ki=0;WK.be=0;WK.mm=null;WK.start=Date.now();saveW();if(m){MZ.end=0;mzStart()}go(0)};$('go').onclick=()=>startWork(false);$('go2m').onclick=()=>startWork(true);window.scrollTo(0,0);
 speak(VX.brief);}
function know(){i=-1;
 app.innerHTML=`<div class="page">${NAV}<div class="kick">Alapismeretek</div><h1 class="ht">Lánctalp és feszítő</h1>
 <h2>A lánctalp tag</h2>
 <ol class="nl"><li>Gumibetét</li><li>Középső összekötő elem</li><li>Szélső összekötő elem (külső/belső)</li><li>Lánctalp összekötő rész – hosszanti furat, benne csapszeg</li><li>Téli fémbetét (télen a gumi helyett)</li></ol>
 <p>Oldalanként <b>95 tag</b> (+1 tartalék a páncéltesten), <b>190 gumibetét</b>, darabja <b>2,5 kg</b>. A betét védi az utat, csökkenti a kopást, a zajt és a rezonanciát.</p>
 <h2>Mikor kell cserélni?</h2><ul class="bl"><li>30%-nál nagyobb darab kitört a betétből</li><li>elérte a kopásjelzőt</li><li>ha a betétek több mint 30%-a rossz → <b>mind</b></li><li>együttes cserénél állj le a láncról: így az összekötők csavarjai is utánhúzhatók</li></ul>
 <div class="warn"><i>!</i><div><b>A lánctalp nem lehet zsíros, olajos!</b> Tisztításhoz tilos a kenőanyag – benzin vagy hígító. Inkább rozsdás, mint olajos.</div></div>
 <h2>A feszítő görgő pár</h2>
 <ol class="nl"><li>Zárókupak (porvédő)</li><li>Feszítő csavar</li><li>Feszítő berendezés</li><li>Feszítő görgő pár</li></ol>
 <p>Láncfeszességet ellenőrizni <b>minden 1. TK-nál</b> és hosszabb igénybevételnél (gyakorlat) <b>pár naponta</b>.</p><button class="cta" id="bk2">⌂ Főmenü</button></div>`;
 fit();$('bk').onclick=home;$('bk2').onclick=home;window.scrollTo(0,0);}

const TOOLS_ALL=[['Munkavédelmi kesztyű','mindenkinek'],['Nagy kalapács (5 kg)','min. 2 db'],['Kis kalapács','2 db'],['Laposfejű csavarhúzó','6–8 db'],['Beütőtüske','min. 2 db'],['Pajszer','2 db'],['Lánc-összehúzó (csigamenetes)','2 db'],['Nyomatékkulcs + 32-es dugófej','1 db'],['Racsnis dugókulcs','2 db'],['Láncfeszítő/lazító kulcs toldattal','1 db'],['Kupaklazító kulcs','1 db'],['Drótkefe, csavarlazító','szükség szerint'],['Fa ék','2 db'],['Porszívó','min. 1 db'],['Kompresszor','1 db'],['Madzag + C-kapcsok, idomszer (6/8 mm)','1 klt'],['Új gumibetét','190 db/oldal (94 tagnál 188)']];
function printView(){i=-1;const d=new Date().toLocaleDateString('hu-HU');
 app.innerHTML=`<div class="pr"><div class="noprint pbar"><button class="sec" id="bk">⌂ Főmenü</button><button class="cta" id="pp">Nyomtatás / PDF mentés</button><a class="sec dl" href="docs/oktatoanyag.pdf" download="PzH2000-gumibetet-csere-oktatoanyag.pdf">Kész PDF letöltése (A4)</a></div>
 <header class="ph1"><div class="kick">Oktatóanyag · PzH2000 futómű</div><h1>Lánc gumibetét csere</h1><p>Teljes munkafolyamat, egy oldalra. A másik oldal a 6. lépéstől ugyanígy. · Összeállította: Strasszer szkv. · Nyomtatva: ${d}</p></header>
 <section><h2>Biztonsági alapelvek</h2><ol><li>A biztonsági rendszabályok ismerete.</li><li>Tiszta, egyértelmű parancsok.</li><li>Hangos jelzés, egymás figyelmeztetése.</li><li><b>Munkavédelmi kesztyű kötelező.</b></li></ol></section>
 <section><h2>Szerszámok és anyagok</h2><table><tr><th>Megnevezés</th><th>Mennyiség</th></tr>${TOOLS_ALL.map(t=>`<tr><td>${t[0]}</td><td>${t[1]}</td></tr>`).join('')}</table></section>
 <section><h2>Nyomatékok és fő adatok</h2><table><tr><th>Tétel</th><th>Érték</th></tr><tr><td>Szélső (külső/belső) összekötő csavar</td><td>32-es kulcs, 520–550 Nm (nyúlt, 94 tagos láncnál 550 Nm)</td></tr><tr><td>Középső összekötő csavar</td><td>520–550 Nm (nyúlt láncnál 550 Nm)</td></tr><tr><td>Láncfeszítő kerék kerek csavarjai</td><td>30-as kulcs, 320 Nm</td></tr><tr><td>Lánctag / oldal</td><td>95 (+1 tartalék)</td></tr><tr><td>Gumibetét / oldal</td><td>190 db, 2,5 kg/db</td></tr><tr><td>Kiterített lánc tömege</td><td>kb. 1,5 t – 15–18 fő</td></tr><tr><td>Láncfeszesség</td><td>6–8 mm (7. összekötőnél)</td></tr><tr><td>Zárókupak</td><td>jobbra szorít, balra lazít</td></tr><tr><td>Feszítő lazítása (menetirány szerint)</td><td>jobb oldal: lefelé · bal oldal: felfelé</td></tr><tr><td>Feszítő feszítése</td><td>jobb oldal: felfelé · bal oldal: lefelé</td></tr></table></section>
 ${PH.map((p,k)=>`<section class="phs"><h2>${k+1}. szakasz – ${p.t}</h2>${STEPS.slice(p.a,p.b+1).map((s,j)=>{const n=p.a+j;return `<div class="ps"><div class="pn">${n+1}</div><div><h3>${s.t}</h3><p>${s.v}</p>${TL[n]?`<p class="pt"><b>Kell hozzá:</b> ${TL[n].map(x=>TOOL[x][0]).join(', ')}</p>`:''}${s.w?`<p class="pw">⚠ ${s.w}</p>`:''}<span class="cb">☐ kész</span></div></div>`}).join('')}</section>`).join('')}
 <section><h2>Alapismeretek</h2><h3>A lánctalp tag</h3><ol><li>Gumibetét</li><li>Középső összekötő elem</li><li>Szélső összekötő elem (külső/belső)</li><li>Lánctalp összekötő rész – hosszanti furat, benne csapszeg</li><li>Téli fémbetét</li></ol>
 <h3>Cserekritériumok</h3><ul><li>30%-nál nagyobb kitörés a betéten → csere.</li><li>Kopásjelző elérése → csere.</li><li>Ha a betétek több mint 30%-a rossz → az összes cseréje.</li><li>Együttes cserénél leállás a láncról – így az összekötők csavarjai is utánhúzhatók.</li></ul>
 <p class="pw">⚠ A lánctalp nem lehet zsíros, olajos! Tisztítás benzinnel vagy hígítóval – kenőanyag tilos.</p>
 <h3>A feszítő görgő pár</h3><ol><li>Zárókupak (porvédő kupak)</li><li>Feszítő csavar</li><li>Feszítő berendezés</li><li>Feszítő görgő pár</li></ol><p>Láncfeszesség-ellenőrzés: minden 1. TK-nál, hosszabb igénybevételnél (gyakorlat) pár naponta.</p></section>
 <section class="sig"><h2>Végrehajtás</h2><table><tr><td>Jármű:</td><td></td></tr><tr><td>Dátum:</td><td></td></tr><tr><td>Oldal:</td><td>☐ bal &nbsp; ☐ jobb</td></tr><tr><td>Cserélt betétek száma:</td><td></td></tr><tr><td>Mért feszesség (mm):</td><td></td></tr><tr><td>Végrehajtotta:</td><td></td></tr><tr><td>Ellenőrizte:</td><td></td></tr></table></section>
 ${LOG.length?`<section><h2>Munkanapló</h2><table><tr><th>Dátum</th><th>Oldal</th><th>Ki/Be</th><th>mm</th><th>perc</th></tr>${LOG.map(r=>`<tr><td>${r.d}</td><td>${r.side}</td><td>${r.ki}/${r.be}</td><td>${r.mm??'–'}</td><td>${r.min}</td></tr>`).join('')}</table></section>`:''}
 <p class="foot">Oktatási segédanyag. Az értékeket és eljárásokat a hatályos TM alapján ellenőrizd.</p></div>`;
 $('bk').onclick=home;$('pp').onclick=()=>{try{window.print()}catch(e){}};window.scrollTo(0,0);}

const QR=`__QR__`;
const APPURL='https://strattila90-hue.github.io/Pzh2000-gumibet-t-csere/';
function shareView(){i=-1;hush();
 app.innerHTML=`<div class="page">${NAV}<div class="kick">Megosztás</div><h1 class="ht">Add tovább!</h1>
 <p class="lead">Olvastasd be a kódot a másik telefon kamerájával.</p><div class="qrbox">${QR}</div><p class="url">${APPURL}</p>
 <button class="cta" id="sl">Link megosztása</button>
 <h2>Internet nélkül – Bluetooth</h2><p>Az egész app egyetlen fájl. Elküldheted Bluetooth-on vagy Quick Share-rel a másik telefonra; ott Chrome-mal megnyitva internet nélkül is működik (a gépi hanggal).</p>
 <button class="sec" id="sf">App-fájl küldése (Bluetooth / Quick Share)</button><a class="sec dl" href="index.html" download="PzH2000-gumibetet-csere.html">App-fájl letöltése</a>
 <div class="vmsg" id="smsg"></div>
 <h2>Offline állapot</h2><p id="ost">Ellenőrzés…</p></div>`;
 $('bk').onclick=home;
 $('sl').onclick=async()=>{try{if(navigator.share){await navigator.share({title:'PzH2000 gumibetét csere',text:'Lépésről lépésre, hangbemondással',url:APPURL});return}}catch(e){if(e.name==='AbortError')return}try{await navigator.clipboard.writeText(APPURL);($('smsg')||{textContent:{}}).textContent='A link a vágólapon.'}catch(e){($('smsg')||{textContent:{}}).textContent=APPURL}};
 $('sf').onclick=async()=>{try{let html;try{html=await (await fetch('index.html')).text()}catch(x){html='<!DOCTYPE html>\n'+document.documentElement.outerHTML}
  const f=new File([html],'PzH2000-gumibetet-csere.html',{type:'text/html'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'PzH2000 gumibetét csere'});return}
  ($('smsg')||{textContent:{}}).textContent='Ez a böngésző nem tud fájlt megosztani. Használd a Letöltés gombot, majd a Fájlkezelőből küldd el Bluetooth-on.'}catch(e){if(e.name!=='AbortError')($('smsg')||{textContent:{}}).textContent='Nem sikerült: '+e.message}};
 offlineStatus($('ost'));window.scrollTo(0,0);}
async function offlineStatus(el){if(!el)return;try{const ctl=navigator.serviceWorker&&navigator.serviceWorker.controller;let n=0;if(ctl&&window.caches){for(const k of await caches.keys()){const c=await caches.open(k);n+=(await c.keys()).filter(r=>/\.mp3$/.test(r.url)).length}}
 el.innerHTML=ctl?`<b style="color:#1F8A3B">✓ Offline használatra kész.</b>${n?` Hangfájlok tárolva: ${n} db.`:''}`:'Offline használathoz: nyisd meg egyszer interneten a QR-kód címét, és tedd ki a kezdőképernyőre.'}catch(e){el.textContent=''}}
let wl=null;async function wake(){try{if('wakeLock' in navigator&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>wl=null)}}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&i>=0)wake()});

// ===== MUNKA ÁLLAPOT, NAPLÓ, ESZKÖZÖK =====
let WK={side:'jobb',tags:95,ki:0,be:0,mm:null,tools:{},start:null};try{Object.assign(WK,JSON.parse(localStorage.getItem('pzh2work')||'{}'))}catch(e){}
const saveW=()=>{try{localStorage.setItem('pzh2work',JSON.stringify(WK))}catch(e){}};
const target=()=>WK.tags*2;
let LOG=[];try{LOG=JSON.parse(localStorage.getItem('pzh2log')||'[]')}catch(e){}
const saveLog=()=>{try{localStorage.setItem('pzh2log',JSON.stringify(LOG))}catch(e){}};
const dirTxt=(side,feszit)=>{const le=(side==='jobb')!==!!feszit;return le?'LEFELÉ':'FELFELÉ'};
function tick(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.setValueAtTime(0.25,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+0.08);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+0.09)}catch(e){}try{navigator.vibrate&&navigator.vibrate(35)}catch(e){}}
function counterW(key,label){const v=WK[key],t=target(),pc=Math.min(100,v/t*100);
 return `<div class="wg cnt"><div class="cl"><b>${label}</b><span><em id="cv">${v}</em> / ${t}</span></div><div class="cbar"><i id="cb" style="width:${pc}%"></i></div>
 <div class="cbt"><button class="sm" id="cm">−1</button><button class="plus" id="cp">+1</button></div></div>`}
function bindCounter(key){const upd=()=>{($('cv')||{textContent:{}}).textContent=WK[key];($('cb')||{style:{}}).style.width=Math.min(100,WK[key]/target()*100)+'%';saveW();fitText()};
 $('cp').onclick=()=>{WK[key]++;tick();upd();if(WK[key]===target()){beep();speak('Megvan mind a '+target()+' betét!')}else if(WK[key]%10===0&&voiceOn&&useFiles===false){}};
 $('cm').onclick=()=>{if(WK[key]>0){WK[key]--;upd()}}}
function measureW(){const b=[4,5,6,7,8,9,10];return `<div class="wg"><div class="cl"><b>Mért érték (mm)</b><span id="mv">${WK.mm??'–'}</span></div><div class="mm">${b.map(x=>`<button data-m="${x}" class="${WK.mm===x?'on':''}">${x}</button>`).join('')}</div><div id="mr" class="mr"></div></div>`}
function verdict(m){if(m==null)return'';if(m<6)return`<span class="bad">Túl feszes → LAZÍTANI (${WK.side} oldal: ${dirTxt(WK.side,0)})</span>`;if(m>8)return`<span class="bad">Túl laza → FESZÍTENI (${WK.side} oldal: ${dirTxt(WK.side,1)})</span>`;return`<span class="good">✓ Megfelel (6–8 mm)</span>`}
function bindMeasure(){$('mr').innerHTML=verdict(WK.mm);document.querySelectorAll('.mm button').forEach(bt=>bt.onclick=()=>{WK.mm=+bt.dataset.m;saveW();document.querySelectorAll('.mm button').forEach(x=>x.classList.toggle('on',x===bt));($('mv')||{textContent:{}}).textContent=WK.mm;$('mr').innerHTML=verdict(WK.mm);fitText();
 speak(WK.mm<6?'Túl feszes. Lazítani kell.':WK.mm>8?'Túl laza. Feszíteni kell.':'Megfelel.')})}
function toolsList(){const ss=split(STEPS[2].v),n0=2,nT=TOOLS_ALL.length;const done_=TOOLS_ALL.filter((t,k)=>WK.tools[k]).length;
 return `<div class="chkpage" id="lv"><p class="ci">${ss.slice(0,n0).map(x=>`<span data-sp>${x}</span>`).join(' ')} <b class="cc" id="cc">${done_}/${nT}</b></p><div class="tgrid">${TOOLS_ALL.map((t,k)=>`<button data-sp data-k="${k}" class="${WK.tools[k]?'ck':''}"><i>${WK.tools[k]?'✓':''}</i><span class="tn">${t[0]}</span><small>${t[1]}</small></button>`).join('')}</div><p class="ci"><span data-sp>${ss.slice(n0+nT).join(' ')}</span></p></div>`}
function bindToolsList(){document.querySelectorAll('.tgrid button').forEach(bt=>bt.onclick=()=>{const k=bt.dataset.k;WK.tools[k]=!WK.tools[k];saveW();tick();bt.classList.toggle('ck',!!WK.tools[k]);bt.querySelector('i').textContent=WK.tools[k]?'✓':'';($('cc')||{textContent:{}}).textContent=TOOLS_ALL.filter((t,x)=>WK.tools[x]).length+'/'+TOOLS_ALL.length})}
function fitGrid(){const g=document.querySelector('.chkpage');if(!g)return;const w=$('lvw');let lo=10,hi=22;while(hi-lo>0.5){const m=(lo+hi)/2;g.style.fontSize=m+'px';if(w.scrollHeight<=w.clientHeight)lo=m;else hi=m}g.style.fontSize=lo+'px';w.style.overflowY=w.scrollHeight>w.clientHeight+2?'auto':'hidden'}
function toolsW(){const n=TOOLS_ALL.filter((t,k)=>WK.tools[k]).length;return `<div class="wg"><div class="cl"><b>Kipipálás</b><span>${n} / ${TOOLS_ALL.length}</span></div><div class="tch">${TOOLS_ALL.map((t,k)=>`<button data-k="${k}" class="${WK.tools[k]?'on':''}">${WK.tools[k]?'✓ ':''}${t[0]} <small>${t[1]}</small></button>`).join('')}</div></div>`}
function bindTools(){document.querySelectorAll('.tch button').forEach(bt=>bt.onclick=()=>{const k=bt.dataset.k;WK.tools[k]=!WK.tools[k];saveW();tick();const w=bt.closest('.wg');w.outerHTML=toolsW();bindTools();fitText()})}
function dirW(feszit){const s=WK.side;return `<div class="wg dir"><div class="cl"><b>${s==='jobb'?'JOBB':'BAL'} oldal (menetirány szerint)</b><button class="chip" id="sw">oldalváltás</button></div><div class="arrow">${feszit?'Feszítés':'Lazítás'}: <b>${dirTxt(s,feszit)} ${dirTxt(s,feszit)==='LEFELÉ'?'↓':'↑'}</b></div></div>`}
function bindDir(feszit){$('sw').onclick=()=>{WK.side=WK.side==='jobb'?'bal':'jobb';saveW();go(i)}}
const WG={6:[()=>dirW(0),()=>bindDir(0)],13:[()=>counterW('ki','Régi betét kiszedve'),()=>bindCounter('ki')],18:[()=>counterW('be','Új betét beütve'),()=>bindCounter('be')],27:[()=>dirW(1),()=>bindDir(1)],32:[measureW,bindMeasure]};
function logView(){i=-1;hush();
 app.innerHTML=`<div class="page">${NAV}<div class="kick">Munkanapló</div><h1 class="ht">Elvégzett cserék</h1>
 ${LOG.length?LOG.slice().reverse().map(r=>`<div class="lg"><b>${r.d}</b> · ${r.side} oldal<br>Régi ki: ${r.ki} · Új be: ${r.be} · Feszesség: ${r.mm??'–'} mm · Idő: ${r.min} perc</div>`).join(''):'<p>Még nincs bejegyzés. Az oldal befejezésekor automatikusan rögzül.</p>'}
 <h2>Beállítás</h2><label class="chk"><input type="radio" name="tg" value="95" ${WK.tags==95?'checked':''}> 95 tagos lánc (190 betét)</label><label class="chk"><input type="radio" name="tg" value="94" ${WK.tags==94?'checked':''}> 94 tagos lánc (188 betét)</label>
 <label class="chk"><input type="radio" name="sd" value="jobb" ${WK.side==='jobb'?'checked':''}> Jobb oldalon kezdünk</label><label class="chk"><input type="radio" name="sd" value="bal" ${WK.side==='bal'?'checked':''}> Bal oldalon kezdünk</label>
 ${LOG.length?'<button class="sec" id="clr">Napló törlése</button>':''}</div>`;
 $('bk').onclick=home;document.querySelectorAll('input[name=tg]').forEach(x=>x.onchange=()=>{WK.tags=+x.value;saveW()});document.querySelectorAll('input[name=sd]').forEach(x=>x.onchange=()=>{WK.side=x.value;saveW()});
 const c=$('clr');if(c)c.onclick=()=>{c.textContent='Biztos? Koppints újra a törléshez';c.onclick=()=>{LOG=[];saveLog();logView()}};window.scrollTo(0,0);}
function setNight(on){document.documentElement.classList.toggle('night',on);try{localStorage.setItem('pzh2night',on?'1':'0')}catch(e){}}
try{setNight(localStorage.getItem('pzh2night')==='1')}catch(e){}
function media(){if(!('mediaSession' in navigator))return;try{const ms=navigator.mediaSession;ms.metadata=new MediaMetadata({title:(i+1)+'. '+STEPS[i].t,artist:'PzH2000 gumibetét csere',album:PH[phOf(i)].t});
 ms.setActionHandler('nexttrack',()=>{const b=$('dn');b&&b.click()});ms.setActionHandler('previoustrack',()=>{i>0&&go(i-1)});
 ms.setActionHandler('play',()=>{const b=$('rp');b&&b.click()});ms.setActionHandler('pause',()=>hush())}catch(e){}}
function list(){i=-1;hush();let cur=-1;try{cur=+(localStorage.getItem('pzh2step')??-1)}catch(e){}let mk=true;
 app.innerHTML=`<div class="page wh">${NAV}<div class="kick">Hol járunk?</div><h1 class="ht">Válaszd ki a lépést</h1>
 <div class="two sd"><button class="sec ${WK.side==='jobb'?'on':''}" data-s="jobb">Jobb oldal</button><button class="sec ${WK.side==='bal'?'on':''}" data-s="bal">Bal oldal</button></div>
 <div class="phj">${PH.map((p,k)=>`<button data-p="${k}" class="${phOf(cur)===k?'on':''}"><b>${k+1}</b>${p.t}</button>`).join('')}</div>
 <label class="chk"><input type="checkbox" id="mk" checked> Az előző lépéseket jelölje késznek</label>
 ${PH.map((p,k)=>`<h2 id="ph${k}">${k+1}. ${p.t}</h2>`+STEPS.slice(p.a,p.b+1).map((s,j)=>{const n=p.a+j;return `<a class="li${n===cur?' cur':''}" data-k="${n}"><b>${n+1}</b>${s.t}${n===cur?'<em class="here">itt tartunk</em>':done.has(n)?'<em>✓</em>':''}</a>`}).join('')).join('')}</div>`;
 $('bk').onclick=home;$('mk').onchange=e=>mk=e.target.checked;
 app.querySelectorAll('.sd button').forEach(b=>b.onclick=()=>{WK.side=b.dataset.s;saveW();app.querySelectorAll('.sd button').forEach(x=>x.classList.toggle('on',x===b))});
 app.querySelectorAll('.phj button').forEach(b=>b.onclick=()=>{const h=$('ph'+b.dataset.p);h&&h.scrollIntoView({behavior:'smooth',block:'start'})});
 app.querySelectorAll('.li').forEach(a=>a.onclick=()=>{const k=+a.dataset.k;if(mk){for(let j=0;j<STEPS.length;j++){j<k?done.add(j):done.delete(j)}}if(!WK.start)WK.start=Date.now();saveW();go(k)});
 const c=app.querySelector('.li.cur');c?c.scrollIntoView({block:'center'}):window.scrollTo(0,0);}
function go(n){i=Math.max(0,Math.min(STEPS.length-1,n));saveDone();const s=STEPS[i],last=i===STEPS.length-1,dn=done.has(i);
 app.innerHTML=`<div class="step"><div class="bar"><button class="mb" id="bk">⌂ Főmenü</button><span class="sp1"></span><button class="vb mzb" data-mz id="mzb">♪</button><button class="vb" id="vt">${voiceOn?'🔊':'🔇'}</button></div>${timeline(i)}
 <div class="top" id="tp"><div class="no${dn?' ok':''}">${i+1}</div><div class="tt"><small>${PH[phOf(i)].t} · ${WK.side==="jobb"?"jobb":"bal"} oldal <span class="chg">▾ hol járunk?</span></small><h1>${s.t}</h1></div></div>
 <div class="lvw" id="lvw">${i===2?toolsList():`<p class="lv" id="lv">${split(s.v).map(x=>`<span data-sp>${x}</span>`).join(' ')}</p>`}</div>
 ${WG[i]?WG[i][0]():''}
 ${TL[i]?`<div class="tools"><b>Kell hozzá:</b> ${TL[i].map(k=>`<span>${TOOL[k][0]}</span>`).join('')}</div>`:''}
 ${s.w?`<div class="warn"><i>!</i><div>${s.w}</div></div>`:''}
 <div class="dock"><button class="sm" id="pv">‹</button><button class="big ${dn?'is':''}" id="dn">${dn?'✓ Kész · tovább':last?'✓ Kész':'✓ Kész – jöhet a következő'}</button><button class="sm" id="rp">↻</button></div></div>`;
 fit();if(WG[i])WG[i][1]();media();
 $('bk').onclick=home;$('tlb').onclick=list;$('tp').onclick=list;$('mzb').onclick=()=>{MZ.on?mzStop():mzStart()};mzUI();
 $('pv').onclick=()=>i===0?home():go(i-1);
 const SP=()=>[...document.querySelectorAll('#lv [data-sp]')];if(i===2)bindToolsList();$('rp').onclick=()=>speak(s.v,SP(),(i+1)+'. lépés:');
 $('vt').onclick=e=>{voiceOn=!voiceOn;e.target.textContent=voiceOn?'🔊':'🔇';if(!voiceOn)hush()};
 $('dn').onclick=e=>{const bt=e.currentTarget;if(bt.dataset.busy)return;bt.dataset.busy=1;if(dn){last?finish():go(i+1);return}done.add(i);saveDone();beep();try{speechSynthesis.cancel()}catch(e){}
  document.querySelectorAll('.ov').forEach(x=>x.remove());const ov=document.createElement('div');ov.className='ov';ov.innerHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#1F8A3B"/><path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';document.body.appendChild(ov);
  setTimeout(()=>{ov.remove();if(!bt.isConnected)return;last?finish():go(i+1)},900)};
 window.scrollTo(0,0);i===2?fitGrid():fitText();wake();speak(s.v,SP(),(i+1)+'. lépés:');}
function finish(){i=-1;const min=WK.start?Math.round((Date.now()-WK.start)/60000):0;LOG.push({d:new Date().toLocaleString('hu-HU'),side:WK.side,ki:WK.ki,be:WK.be,mm:WK.mm,min});saveLog();const other=WK.side==='jobb'?'bal':'jobb';
 app.innerHTML=`<div class="page">${NAV}<h1 class="ht">${WK.side==='jobb'?'Jobb':'Bal'} oldal kész!</h1><div class="lg">Régi ki: <b>${WK.ki}</b> · Új be: <b>${WK.be}</b> / ${target()} · Feszesség: <b>${WK.mm??'–'} mm</b> · Idő: <b>${min} perc</b></div><p class="lead">Következik: <b>${other} oldal</b>, a zárókupaktól (6. lépés).</p><div class="warn"><i>!</i><div><b>A feszítő iránya ott fordított!</b> ${other==='jobb'?'Jobb':'Bal'} oldalon ${dirTxt(other,0).toLowerCase()} lazít.</div></div><button class="cta" id="o">${other==='jobb'?'Jobb':'Bal'} oldal indítása</button><button class="sec" id="h">Kezdőlap</button></div>`;
 fit();speak(VX.finish);$('o').onclick=()=>{[...done].forEach(k=>{if(k>=5)done.delete(k)});saveDone();WK.side=other;WK.ki=0;WK.be=0;WK.mm=null;WK.start=Date.now();saveW();go(5)};$('h').onclick=home;$('bk').onclick=home;}
let sx=null;document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});document.addEventListener('touchend',e=>{if(sx===null||i<0)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>80){dx<0?(i<STEPS.length-1&&go(i+1)):(i>0&&go(i-1))}sx=null});
location.hash==='#nyomtat'?printView():home();
