// ===== ALKALMAZÁS =====
const STEPS=__STEPS__;
const TL={0:['kesztyu'],5:['kupak'],6:['feszito'],7:['racsnis','kisk','drotkefe'],8:['nagyk','pajszer','kesztyu'],9:['racsnis'],11:['pajszer'],12:['ek','pajszer'],13:['beuto','kisk','pajszer'],14:['csavarhuzo','benzin'],15:['porszivo','kompresszor'],18:['nagyk'],20:['nyomatek'],21:['pajszer'],22:['nyomatek'],24:['pajszer'],25:['osszehuzo'],26:['nyomatek'],27:['feszito'],32:['madzag','idomszer']};
const PH=[{t:'Előkészítés',a:0,b:4,d:'Biztonság, terület, szerszámok, a jármű elhelyezése.',sc:0},{t:'Lánc lazítása, nyitása',a:5,b:10,d:'Zárókupak, feszítő összehúzása, összekötők bontása, leállás a láncról.',sc:6},{t:'Betétcsere',a:11,b:19,d:'Lánc megfordítása, régi betét ki, fészek tisztítása, új betét be.',sc:18},{t:'Visszaszerelés',a:20,b:26,d:'Nyomatékolás, visszafordítás, visszaállás, lánc egyesítése.',sc:25},{t:'Feszítés, ellenőrzés',a:27,b:33,d:'Feszítés, zárókupak vissza, menetpróba, feszességmérés.',sc:32}];
const phOf=k=>PH.findIndex(p=>k>=p.a&&k<=p.b);
let i=-1,voiceOn=true,hu=null,done=new Set();
try{done=new Set(JSON.parse(localStorage.getItem('pzh2done')||'[]'))}catch(e){}
const saveDone=()=>{try{localStorage.setItem('pzh2done',JSON.stringify([...done]));localStorage.setItem('pzh2step',i)}catch(e){}};
function pickVoice(){try{const v=speechSynthesis.getVoices();hu=bestVoice();const m=document.getElementById('vmsg');if(m)m.textContent=hu?'':'Nincs magyar felolvasó hang ezen a telefonon: Beállítások → Szövegfelolvasás → Google → Magyar. Addig olvasd a szöveget.'}catch(e){}}
if('speechSynthesis' in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
const split=t=>t.match(/[^.!?]+[.!?]+|[^.!?]+$/g).map(x=>x.trim()).filter(Boolean);
let spk=0;
function speak(t,spans){if(!voiceOn||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const my=++spk;const ss=split(t);
 ss.forEach((x,k)=>{const u=new SpeechSynthesisUtterance(x);u.lang='hu-HU';if(hu)u.voice=hu;u.rate=0.9;u.pitch=0.95;u.volume=1;
  u.onstart=()=>{if(my!==spk||!spans)return;spans.forEach((e,j)=>{if(e){e.classList.toggle('on',j===k);e.classList.toggle('past',j<k)}})};
  u.onend=()=>{if(my!==spk||!spans)return;if(k===ss.length-1)spans.forEach(e=>{if(e){e.classList.remove('on');e.classList.remove('past')}})};
  speechSynthesis.speak(u)})}catch(e){}}
function bestVoice(){try{const v=speechSynthesis.getVoices().filter(x=>/^hu/i.test(x.lang));const rank=x=>(/natural|neural|online/i.test(x.name)?4:0)+(/google/i.test(x.name)?3:0)+(/tamás|tamas/i.test(x.name)?1:0)+(x.localService?0:1);v.sort((a,b)=>rank(b)-rank(a));return v[0]||null}catch(e){return null}}
function fitText(){const w=document.getElementById('lvw'),p=document.getElementById('lv');if(!w||!p)return;let lo=16,hi=40;while(hi-lo>1){const m=(lo+hi)>>1;p.style.fontSize=m+'px';if(p.scrollHeight<=w.clientHeight)lo=m;else hi=m}p.style.fontSize=lo+'px'}
addEventListener('resize',fitText);
let ac=null;function beep(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();[[523,0],[784,0.11]].forEach(([f,t])=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.setValueAtTime(0.0001,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(0.35,ac.currentTime+t+0.02);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+t+0.2);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+0.22)})}catch(e){}try{navigator.vibrate&&navigator.vibrate(70)}catch(e){}}
const app=document.getElementById('app');
const $=id=>document.getElementById(id);
function fit(){document.querySelectorAll('.pic svg').forEach(sv=>{try{const b=sv.getBBox(),p=14;let w=b.width+p*2,h=b.height+p*2,x=b.x-p,y=b.y-p;const r=4/3;if(w/h<r){x-=(h*r-w)/2;w=h*r}else{y-=(w/r-h)/2;h=w/r}sv.setAttribute('viewBox',`${x} ${y} ${w} ${h}`)}catch(e){}})}
function timeline(cur){return `<div class="tl" id="tlb">${PH.map((p,k)=>{let n=0;for(let j=p.a;j<=p.b;j++)if(done.has(j))n++;const tot=p.b-p.a+1,c=k===phOf(cur)?'cur':n===tot?'ok':'';
 return `<div class="ph ${c}" style="flex:${tot}"><div class="pf"><i style="width:${n/tot*100}%"></i>${k===phOf(cur)?`<b style="left:${(cur-p.a+0.5)/tot*100}%"></b>`:''}</div><span>${k+1}</span></div>`}).join('')}</div>`}
function home(){i=-1;let last=-1;try{last=+(localStorage.getItem('pzh2step')??-1)}catch(e){}
 app.innerHTML=`<div class="home"> <div class="kick">PzH2000 · futómű</div><h1 class="ht">Gumibetét csere</h1>
 <p class="lead">${STEPS.length} lépés · hang · szerszámlista. Egyik oldal, majd a másik ugyanígy.</p>
 <button class="cta" id="b1">Eligazítás és indulás</button>
 ${last>=0&&last<STEPS.length&&done.size?`<button class="sec" id="b2">Folytatás: ${last+1}. lépés · ${done.size} kész</button>`:''}
 <div class="two"><button class="sec" id="b3">Alapismeretek</button><button class="sec" id="b4">Lépések</button></div>
 <label class="chk"><input type="checkbox" id="vc" ${voiceOn?'checked':''}> Hangbemondás</label><div class="vmsg" id="vmsg"></div>
 <p class="foot">Összeállította: Strasszer szkv. · Az értékeket a TM alapján ellenőrizd.</p></div>`;
 pickVoice();fit();
 $('b1').onclick=brief;const b2=$('b2');if(b2)b2.onclick=()=>go(last);$('b3').onclick=know;$('b4').onclick=list;$('vc').onchange=e=>voiceOn=e.target.checked;}
function brief(){i=-1;
 app.innerHTML=`<div class="page"><button class="x" id="bk">‹</button><div class="kick">Eligazítás</div><h1 class="ht">Üdvözlöm az állományt!</h1>
 <p class="lead">Mai feladat: a <b>PzH2000 lánc gumibetéteinek cseréje</b> mindkét oldalon. Oldalanként <b>95 lánctag</b>, <b>190 betét</b> (2,5 kg/db).</p>
 <div class="route">${PH.map((p,k)=>`<div class="stop"><div class="dot">${k+1}</div><div class="st"><b>${p.t}</b><span>${p.d}</span><em>${p.a+1}–${p.b+1}. lépés</em></div></div>`).join('')}</div>
 <div class="warn"><i>!</i><div><b>Kesztyű kötelező.</b> Tiszta, egyértelmű parancsok. Hangosan szóljatok egymásnak. A lánc fordításához 15–18 fő kell.</div></div>
 <button class="cta" id="go">Indulás</button></div>`;
 fit();$('bk').onclick=home;$('go').onclick=()=>{done.clear();saveDone();go(0)};window.scrollTo(0,0);
 speak('Üdvözlöm az állományt! A mai feladat a PzH kétezer lánc gumibetéteinek cseréje, mindkét oldalon. Oldalanként százkilencven gumibetét. Öt szakasz: előkészítés, a lánc lazítása és nyitása, betétcsere, visszaszerelés, végül feszítés és ellenőrzés. Kesztyű kötelező, figyeljetek egymásra.');}
function know(){i=-1;
 app.innerHTML=`<div class="page"><button class="x" id="bk">‹</button><div class="kick">Alapismeretek</div><h1 class="ht">Lánctalp és feszítő</h1>
 <h2>A lánctalp tag</h2>
 <ol class="nl"><li>Gumibetét</li><li>Középső összekötő elem</li><li>Szélső összekötő elem (külső/belső)</li><li>Lánctalp összekötő rész – hosszanti furat, benne csapszeg</li><li>Téli fémbetét (télen a gumi helyett)</li></ol>
 <p>Oldalanként <b>95 tag</b> (+1 tartalék a páncéltesten), <b>190 gumibetét</b>, darabja <b>2,5 kg</b>. A betét védi az utat, csökkenti a kopást, a zajt és a rezonanciát.</p>
 <h2>Mikor kell cserélni?</h2><ul class="bl"><li>30%-nál nagyobb darab kitört a betétből</li><li>elérte a kopásjelzőt</li><li>ha a betétek több mint 30%-a rossz → <b>mind</b></li><li>együttes cserénél állj le a láncról: így az összekötők csavarjai is utánhúzhatók</li></ul>
 <div class="warn"><i>!</i><div><b>A lánctalp nem lehet zsíros, olajos!</b> Tisztításhoz tilos a kenőanyag – benzin vagy hígító. Inkább rozsdás, mint olajos.</div></div>
 <h2>A feszítő görgő pár</h2>
 <ol class="nl"><li>Zárókupak (porvédő)</li><li>Feszítő csavar</li><li>Feszítő berendezés</li><li>Feszítő görgő pár</li></ol>
 <p>Láncfeszességet ellenőrizni <b>minden 1. TK-nál</b> és hosszabb igénybevételnél (gyakorlat) <b>pár naponta</b>.</p><button class="cta" id="bk2">Vissza</button></div>`;
 fit();$('bk').onclick=home;$('bk2').onclick=home;window.scrollTo(0,0);}
function list(){i=-1;app.innerHTML=`<div class="page"><button class="x" id="bk">‹</button><div class="kick">Lépések</div><h1 class="ht">Mind a ${STEPS.length}</h1>${PH.map((p,k)=>`<h2>${k+1}. ${p.t}</h2>`+STEPS.slice(p.a,p.b+1).map((s,j)=>`<a class="li" data-k="${p.a+j}"><b>${p.a+j+1}</b>${s.t}${done.has(p.a+j)?'<em>✓</em>':''}</a>`).join('')).join('')}</div>`;
 $('bk').onclick=home;app.querySelectorAll('.li').forEach(a=>a.onclick=()=>go(+a.dataset.k));window.scrollTo(0,0);}
function go(n){i=Math.max(0,Math.min(STEPS.length-1,n));saveDone();const s=STEPS[i],last=i===STEPS.length-1,dn=done.has(i);
 app.innerHTML=`<div class="step">${timeline(i)}
 <div class="top"><button class="x" id="bk">‹</button><div class="no${dn?' ok':''}">${i+1}</div><div class="tt"><small>${PH[phOf(i)].t}</small><h1>${s.t}</h1></div><button class="vb" id="vt">${voiceOn?'🔊':'🔇'}</button></div>
 <div class="lvw" id="lvw"><p class="lv" id="lv">${split(s.v).map(x=>`<span>${x}</span>`).join(' ')}</p></div>
 ${TL[i]?`<div class="tools"><b>Kell hozzá:</b> ${TL[i].map(k=>`<span>${TOOL[k][0]}</span>`).join('')}</div>`:''}
 ${s.w?`<div class="warn"><i>!</i><div>${s.w}</div></div>`:''}
 <div class="dock"><button class="sm" id="pv">‹</button><button class="big ${dn?'is':''}" id="dn">${dn?'✓ Kész · tovább':last?'✓ Kész':'✓ Kész – jöhet a következő'}</button><button class="sm" id="rp">↻</button></div></div>`;
 fit();
 $('bk').onclick=home;$('tlb').onclick=list;
 $('pv').onclick=()=>i===0?home():go(i-1);
 const SP=()=>[...document.querySelectorAll('#lv span')];$('rp').onclick=()=>speak(s.v,SP());
 $('vt').onclick=e=>{voiceOn=!voiceOn;e.target.textContent=voiceOn?'🔊':'🔇';if(!voiceOn)try{speechSynthesis.cancel()}catch(x){}};
 $('dn').onclick=()=>{if(dn){last?finish():go(i+1);return}done.add(i);saveDone();beep();try{speechSynthesis.cancel()}catch(e){}
  const ov=document.createElement('div');ov.className='ov';ov.innerHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#1F8A3B"/><path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';document.body.appendChild(ov);
  setTimeout(()=>{ov.remove();last?finish():go(i+1)},900)};
 window.scrollTo(0,0);fitText();speak((i+1)+'. lépés. '+s.v,[null].concat(SP()));}
function finish(){app.innerHTML=`<div class="page"><h1 class="ht">Egyik oldal kész!</h1><p class="lead">A másik oldalon ugyanez, a zárókupaktól (6. lépés) kezdve.</p><button class="cta" id="o">Másik oldal indítása</button><button class="sec" id="h">Kezdőlap</button></div>`;
 fit();speak('Egyik oldal kész. A másik oldalon ugyanez, a zárókupaktól kezdve.');$('o').onclick=()=>{[...done].forEach(k=>{if(k>=5)done.delete(k)});saveDone();go(5)};$('h').onclick=home;}
let sx=null;document.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});document.addEventListener('touchend',e=>{if(sx===null||i<0)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>80){dx<0?(i<STEPS.length-1&&go(i+1)):(i>0&&go(i-1))}sx=null});
home();
