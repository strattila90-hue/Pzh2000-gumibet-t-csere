// ===== MUNKAZENE – saját, generált (WebAudio), induló jellegű ösztönző zene =====
// Nincs hangfájl, nincs szerzői jog: valós időben generálódik, a feladat becsült hosszáig szól.
// Beszéd közben automatikusan lehalkul.
const MZ={on:false,vol:0.55,mins:270,start:0,end:0,ctx:null,master:null,duck:null,timer:null,next:0,step:0,bar:0,seed:7,noise:null};
try{Object.assign(MZ,JSON.parse(localStorage.getItem('pzh2music')||'{}'),{on:false})}catch(e){}
const mzSave=()=>{try{localStorage.setItem('pzh2music',JSON.stringify({vol:MZ.vol,mins:MZ.mins}))}catch(e){}};
// becsült idők szakaszonként (perc / oldal): előkészítés, lazítás-nyitás, betétcsere, visszaszerelés, feszítés-ellenőrzés
const PHASE_MIN=[30,40,120,45,35];
const mzRnd=()=>{MZ.seed=(MZ.seed*1664525+1013904223)>>>0;return MZ.seed/4294967296};
const PROG=[[50,53,57],[46,50,53],[53,57,60],[48,52,55],[50,53,57],[45,49,52],[46,50,53],[45,49,52]]; // Dm Bb F C Dm A Bb A
const SCALE=[62,64,65,67,69,70,72,74,76,77];
const hz=m=>440*Math.pow(2,(m-69)/12);
function mzInit(){if(MZ.ctx)return;const C=new (window.AudioContext||window.webkitAudioContext)();MZ.ctx=C;
 MZ.master=C.createGain();MZ.master.gain.value=0;MZ.duck=C.createGain();MZ.duck.gain.value=1;
 const comp=C.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;
 MZ.duck.connect(MZ.master);MZ.master.connect(comp);comp.connect(C.destination);
 const b=C.createBuffer(1,C.sampleRate,C.sampleRate),d=b.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=Math.random()*2-1;MZ.noise=b;}
function env(g,t,a,peak,dcy){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dcy)}
function kick(t,v=1){const C=MZ.ctx,o=C.createOscillator(),g=C.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(42,t+0.12);env(g,t,0.003,0.9*v,0.28);o.connect(g).connect(MZ.duck);o.start(t);o.stop(t+0.35)}
function snare(t,v=1){const C=MZ.ctx,s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=MZ.noise;f.type='bandpass';f.frequency.value=1800;f.Q.value=0.8;env(g,t,0.002,0.45*v,0.14);s.connect(f).connect(g).connect(MZ.duck);s.start(t);s.stop(t+0.2);
 const o=C.createOscillator(),g2=C.createGain();o.frequency.value=190;env(g2,t,0.002,0.25*v,0.08);o.connect(g2).connect(MZ.duck);o.start(t);o.stop(t+0.12)}
function hat(t,v=1){const C=MZ.ctx,s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=MZ.noise;f.type='highpass';f.frequency.value=7000;env(g,t,0.001,0.12*v,0.04);s.connect(f).connect(g).connect(MZ.duck);s.start(t);s.stop(t+0.06)}
function bass(t,m,dur){const C=MZ.ctx,o=C.createOscillator(),f=C.createBiquadFilter(),g=C.createGain();o.type='sawtooth';o.frequency.value=hz(m-12);f.type='lowpass';f.frequency.value=420;env(g,t,0.01,0.32,dur);o.connect(f).connect(g).connect(MZ.duck);o.start(t);o.stop(t+dur+0.05)}
function pad(t,ch,dur,v){const C=MZ.ctx,f=C.createBiquadFilter(),g=C.createGain();f.type='lowpass';f.frequency.value=1100;g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.07*v,t+0.4);g.gain.linearRampToValueAtTime(0.0001,t+dur);f.connect(g).connect(MZ.duck);
 ch.forEach(m=>[-6,6].forEach(dt=>{const o=C.createOscillator();o.type='sawtooth';o.frequency.value=hz(m);o.detune.value=dt;o.connect(f);o.start(t);o.stop(t+dur+0.05)}))}
function brass(t,m,dur,v){const C=MZ.ctx,o=C.createOscillator(),f=C.createBiquadFilter(),g=C.createGain(),l=C.createOscillator(),lg=C.createGain();o.type='sawtooth';o.frequency.value=hz(m);l.frequency.value=5.5;lg.gain.value=3;l.connect(lg).connect(o.detune);
 f.type='lowpass';f.frequency.setValueAtTime(600,t);f.frequency.linearRampToValueAtTime(2400,t+0.08);f.frequency.linearRampToValueAtTime(1300,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.13*v,t+0.05);g.gain.setValueAtTime(0.11*v,t+dur*0.8);g.gain.linearRampToValueAtTime(0.0001,t+dur);
 o.connect(f).connect(g).connect(MZ.duck);o.start(t);l.start(t);o.stop(t+dur+0.05);l.stop(t+dur+0.05)}
let MEL=[];function newMelody(){MEL=[];let p=4;for(let k=0;k<16;k++){p=Math.max(0,Math.min(SCALE.length-1,p+[-2,-1,0,1,1,2][Math.floor(mzRnd()*6)]));MEL.push(mzRnd()<0.22?null:SCALE[p])}}
function intensity(){const ph=typeof i!=='undefined'&&i>=0&&typeof phOf==='function'?phOf(i):0;return [0.6,0.8,1,0.85,0.95][ph]||0.7}
function schedule(){const C=MZ.ctx;const bpm=104+Math.round(intensity()*14),q=60/bpm/2; // nyolcad
 while(MZ.next<C.currentTime+0.15){const t=MZ.next,s=MZ.step%16,bar=MZ.bar,ch=PROG[bar%8],I=intensity();
  if(s===0){if(bar%8===0)newMelody();pad(t,ch,q*16,I)}
  if(s%8===0)kick(t);if(s===6&&I>0.7)kick(t,0.6);if(s%8===4)snare(t);if(I>0.75&&s===14&&bar%4===3){snare(t,0.5);snare(t+q/2,0.6)}
  if(bar%4===3&&s>=12){snare(t,0.35+0.1*(s-12))}
  hat(t,s%2?0.6:1);
  if(s%2===0)bass(t,s%8===6?ch[2]:ch[0],q*1.6);
  if(I>=0.8&&bar%2===1&&s%2===0){const m=MEL[(s/2+(bar%4)*8/2)%16];if(m)brass(t,m,q*1.8,I)}
  MZ.next+=q;MZ.step++;if(MZ.step%16===0)MZ.bar++;}
 const speaking=(window.speechSynthesis&&speechSynthesis.speaking)||(typeof curA!=='undefined'&&curA&&!curA.paused);
 MZ.duck.gain.setTargetAtTime(speaking?0.18:1,C.currentTime,0.15);
 if(Date.now()>=MZ.end){mzStop(true)}mzUI()}
function mzStart(){mzInit();const C=MZ.ctx;if(C.state==='suspended')C.resume();MZ.on=true;if(!MZ.end||Date.now()>=MZ.end){MZ.start=Date.now();MZ.end=MZ.start+MZ.mins*60000}
 MZ.next=C.currentTime+0.05;MZ.master.gain.cancelScheduledValues(C.currentTime);MZ.master.gain.setTargetAtTime(MZ.vol*0.5,C.currentTime,0.6);clearInterval(MZ.timer);MZ.timer=setInterval(schedule,40);mzUI()}
function mzStop(fin){if(!MZ.ctx)return;MZ.on=false;clearInterval(MZ.timer);MZ.master.gain.setTargetAtTime(0,MZ.ctx.currentTime,fin?1.2:0.3);if(fin){MZ.end=0}mzUI()}
function mzVol(v){MZ.vol=v;mzSave();if(MZ.ctx&&MZ.on)MZ.master.gain.setTargetAtTime(v*0.5,MZ.ctx.currentTime,0.1)}
const fmtLeft=()=>{if(!MZ.end)return'';const m=Math.max(0,Math.round((MZ.end-Date.now())/60000));return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')};
function mzUI(){document.querySelectorAll('[data-mz]').forEach(e=>{e.classList.toggle('on',MZ.on);e.textContent=MZ.on?'♪ '+fmtLeft():'♪'});const s=document.getElementById('mzst');if(s)s.textContent=MZ.on?'Szól – hátralévő idő: '+fmtLeft()+' (óra:perc)':MZ.end?'Szünetel – hátralévő: '+fmtLeft():'Áll.'}
function musicPanel(){const h=Math.floor(MZ.mins/60),m=MZ.mins%60;return `<div class="vp"><b>Munkazene</b><p class="hint">Saját generált, induló jellegű ösztönző zene. Pontosan addig szól, ameddig a feladat becsült ideje tart; munka közben a szakaszhoz igazodik, beszédnél lehalkul.</p>
 <label>Becsült idő / oldal: <span id="mzt">${h} óra ${m} perc</span><input type="range" id="mzm" min="60" max="600" step="15" value="${MZ.mins}"></label>
 <label>Hangerő <input type="range" id="mzv" min="0" max="1" step="0.05" value="${MZ.vol}"></label>
 <div class="two"><button class="sec" id="mzgo">${MZ.on?'Szünet':'Indítás'}</button><button class="sec" id="mzrs">Újrakezd</button></div><div class="hint" id="mzst"></div></div>`}
function bindMusic(){$('mzm').oninput=e=>{MZ.mins=+e.target.value;mzSave();$('mzt').textContent=Math.floor(MZ.mins/60)+' óra '+MZ.mins%60+' perc';if(MZ.on){MZ.end=MZ.start+MZ.mins*60000}};
 $('mzv').oninput=e=>mzVol(+e.target.value);$('mzgo').onclick=e=>{MZ.on?mzStop():mzStart();e.target.textContent=MZ.on?'Szünet':'Indítás'};$('mzrs').onclick=()=>{MZ.end=0;mzStart();$('mzgo').textContent='Szünet'};mzUI()}
