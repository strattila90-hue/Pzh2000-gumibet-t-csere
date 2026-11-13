// ===== IZOMETRIKUS RAJZMOTOR =====
const INK='#1b1b1b',OR='#F07D16',RD='#D62A1E',GN='#1F8A3B',BL='#1F6FD1';
const PAL={
 steel:['#eef0f2','#cfd3d8','#b3b8bf'],
 dsteel:['#c4c8ce','#a3a8b0','#888e97'],
 rub:['#4d4d4d','#333','#262626'],
 olive:['#a7b07a','#878f5c','#6c7448'],
 hull:['#dfe2d6','#c4c8b6','#a9ae99'],
 hl:['#ffc27a','#f59a3c','#dc7a17'],
 wood:['#e3c08a','#cfa465','#b88c4f'],
 mud:['#9c8463','#7e6a4d','#66563e'],
 conc:['#f2f1ec','#dddbd2','#c8c5b9'],
 grn:['#8fd19e','#4fb36b','#2f8a4a'],
 red:['#ff9a92','#e5483c','#bf2d22']
};
let OX=0,OY=0,SC=1;
const pj=(x,y,z)=>[OX+(x-y)*0.866*SC,OY+((x+y)*0.5-z)*SC];
const f1=n=>Math.round(n*10)/10;
const pts=a=>a.map(p=>f1(p[0])+','+f1(p[1])).join(' ');
const poly=(a,fill,sw=2,st=INK,extra='')=>`<polygon points="${pts(a)}" fill="${fill}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round" ${extra}/>`;
const poly3=(a,fill,sw=2,extra='')=>poly(a.map(p=>pj(...p)),fill,sw,INK,extra);
const line3=(a,sw=2,c=INK,extra='')=>`<polyline points="${pts(a.map(p=>pj(...p)))}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
function box(x,y,z,w,d,h,pal='steel',sw=2){const c=PAL[pal]||pal;
 return poly3([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],c[2],sw)+
  poly3([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],c[1],sw)+
  poly3([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],c[0],sw);}
function hull2(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
 for(const p of P.reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
 return lo.slice(0,-1).concat(up.slice(0,-1));}
// henger: tengely 'x'|'y'|'z', c = alap középpont, len a tengely mentén (+ irány a látható vég)
function ring(ax,c,r,n,off=0){const o=[];for(let k=0;k<n;k++){const a=k*2*Math.PI/n+off,u=r*Math.cos(a),v=r*Math.sin(a);
 o.push(ax==='x'?[c[0],c[1]+u,c[2]+v]:ax==='y'?[c[0]+u,c[1],c[2]+v]:[c[0]+u,c[1]+v,c[2]])}return o;}
function cyl(ax,c,r,len,pal='steel',n=28,sw=2,off=0){const col=PAL[pal]||pal;const e=ax==='x'?[c[0]+len,c[1],c[2]]:ax==='y'?[c[0],c[1]+len,c[2]]:[c[0],c[1],c[2]+len];
 const a=ring(ax,c,r,n,off),b=ring(ax,e,r,n,off);const side=hull2(a.concat(b).map(p=>pj(...p)));
 return poly(side,col[1],sw)+poly3(b,col[0],sw);}
const hex=(ax,c,r,len,pal='dsteel')=>cyl(ax,c,r,len,pal,6,2,Math.PI/6);
// ív nyíl tetszőleges síkban (forgásirány)
function arc3(ax,c,r,a0,a1,col=OR,sw=5){const P=[];const n=24;for(let k=0;k<=n;k++){const a=a0+(a1-a0)*k/n,u=r*Math.cos(a),v=r*Math.sin(a);
 P.push(ax==='x'?[c[0],c[1]+u,c[2]+v]:ax==='y'?[c[0]+u,c[1],c[2]+v]:[c[0]+u,c[1]+v,c[2]])}
 const s=P.map(p=>pj(...p));return `<polyline points="${pts(s)}" fill="none" stroke="#fff" stroke-width="${sw+5}" stroke-linecap="round"/><polyline points="${pts(s)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" marker-end="url(#m_${col.slice(1)})"/>`;}
function arr3(a,b,col=OR,sw=6){const A=pj(...a),B=pj(...b);return `<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="#fff" stroke-width="${sw+5}" stroke-linecap="round"/><line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" marker-end="url(#m_${col.slice(1)})"/>`;}
// 2D segédek
const L2=(d,w=2.5,c=INK)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const R2=(x,y,w,h,f='#fff',rx=4,sw=2.5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${INK}" stroke-width="${sw}"/>`;
const C2=(x,y,r,f='#fff',sw=2.5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${INK}" stroke-width="${sw}"/>`;
const TX=(x,y,t,s=15,a='middle',c=INK,w=800)=>`<text x="${x}" y="${y}" font-size="${s}" font-weight="${w}" text-anchor="${a}" fill="${c}" font-family="Inter,Helvetica Neue,Arial,sans-serif" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${t}</text>`;
const A2=(x1,y1,x2,y2,col=OR,sw=6)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="${sw+5}" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" marker-end="url(#m_${col.slice(1)})"/>`;
const G2=(tr,s)=>`<g transform="${tr}">${s}</g>`;
const tagN=(x,y,n,col=INK)=>C2(x,y,15,col,2)+`<text x="${x}" y="${y+6}" font-size="17" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">${n}</text>`;
const callout=(x,y,tx,ty,t,s=14)=>L2(`M${x} ${y} L${tx} ${ty}`,1.6)+C2(x,y,3.5,INK,0)+TX(tx,ty+(ty<y?-6:16),t,s);
const OK2=(x,y,r=20)=>C2(x,y,r,GN,2.5)+L2(`M${x-r*.45} ${y} L${x-r*.1} ${y+r*.38} L${x+r*.5} ${y-r*.35}`,r/4.5,'#fff');
const NO2=(x,y,r=22)=>C2(x,y,r,RD,2.5)+L2(`M${x-r*.4} ${y-r*.4} L${x+r*.4} ${y+r*.4} M${x+r*.4} ${y-r*.4} L${x-r*.4} ${y+r*.4}`,r/4.5,'#fff');
const WARN2=(x,y,s=1)=>G2(`translate(${x} ${y}) scale(${s})`,`<path d="M0 -24 L24 18 L-24 18 Z" fill="#FFD21F" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><text x="0" y="13" font-size="24" font-weight="900" text-anchor="middle" font-family="Arial">!</text>`);
const ZONE=(cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(214,42,30,.10)" stroke="${RD}" stroke-width="2.5" stroke-dasharray="9 6"/>`;
const groundIso=(x0,y0,x1,y1,pal='conc')=>poly3([[x0,y0,0],[x1,y0,0],[x1,y1,0],[x0,y1,0]],PAL[pal][0],1.5);
const DEFS=`<defs>${[OR,RD,GN,BL,INK].map(c=>`<marker id="m_${c.slice(1)}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${c}"/></marker>`).join('')}</defs>`;
const SVG=(inner,vb='0 0 400 300')=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;
function cam(ox,oy,sc=1){OX=ox;OY=oy;SC=sc;}

// ===== EMBER (egyszerű, barátságos figura, narancs kesztyű) =====
function man(x,y,s=1,pose='stand',flip=false){
 const P={stand:{b:[0,0],h:[0,-58],a:[[-14,-6],[14,-6]],f:[[-8,38],[8,38]]},
 signal:{b:[0,0],h:[0,-58],a:[[-30,-62],[30,-62]],f:[[-8,38],[8,38]]},
 point:{b:[0,0],h:[0,-58],a:[[-14,-6],[40,-36]],f:[[-8,38],[8,38]]},
 lift:{b:[6,8],h:[18,-40],a:[[26,22],[34,18]],f:[[-6,38],[20,38]],bend:1},
 push:{b:[4,0],h:[8,-56],a:[[40,-24],[40,-14]],f:[[-14,38],[12,38]]},
 hammer:{b:[0,0],h:[0,-58],a:[[22,-74],[18,-66]],f:[[-10,38],[10,38]]},
 hold:{b:[6,10],h:[14,-38],a:[[36,8],[30,16]],f:[[-6,38],[18,38]],bend:1},
 kneel:{b:[0,14],h:[6,-36],a:[[30,12],[26,18]],f:[[-14,38],[20,38]],bend:1}}[pose];
 const W='#ffffff',UN='#6f7a4a';
 const limb=(a,b,w,c)=>`<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${INK}" stroke-width="${w+5}" stroke-linecap="round"/><path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 const hip=[P.b[0],P.b[1]+4],sh=[ (P.h[0]+P.b[0])/2+(P.bend?6:0), P.h[1]+20];
 let g=P.f.map(f=>limb(hip,f,12,'#55603a')).join('')+P.f.map(f=>`<ellipse cx="${f[0]+3}" cy="${f[1]+3}" rx="9" ry="5" fill="${INK}"/>`).join('');
 g+=`<path d="M${sh[0]-15} ${sh[1]-4} Q${sh[0]} ${sh[1]-12} ${sh[0]+15} ${sh[1]-4} L${hip[0]+13} ${hip[1]} L${hip[0]-13} ${hip[1]} Z" fill="${UN}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
 g+=P.a.map(a=>limb(sh,a,9,UN)).join('');
 g+=`<circle cx="${P.h[0]}" cy="${P.h[1]}" r="13" fill="${W}" stroke="${INK}" stroke-width="2.5"/>`;
 g+=P.a.map(a=>`<circle cx="${a[0]}" cy="${a[1]}" r="7.5" fill="${OR}" stroke="${INK}" stroke-width="2.5"/>`).join('');
 return G2(`translate(${x} ${y}) scale(${flip?-s:s} ${s})`,g);
}

// ===== SZERSZÁMOK (2D ikon, tiszta vonal) =====
const TOOL={
 kesztyu:['Kesztyű',()=>`<path d="M-20 26 L-22 -6 Q-22 -12 -16 -12 L-16 -34 Q-16 -40 -11 -40 Q-6 -40 -6 -34 L-6 -42 Q-6 -48 -1 -48 Q4 -48 4 -42 L4 -38 Q4 -44 9 -44 Q14 -44 14 -38 L14 -30 Q14 -36 19 -36 Q24 -36 24 -30 L24 6 Q24 18 14 26 Z" fill="${OR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`+R2(-22,22,40,14,'#d76510',3,3)],
 nagyk:['Nagy kalapács',()=>R2(-40,-4,62,9,'#d9b27c',4)+`<path d="M18 -18 L42 -18 L46 -12 L46 12 L42 18 L18 18 Z" fill="#9aa0a8" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`],
 kisk:['Kis kalapács',()=>R2(-36,-3,54,7,'#d9b27c',3)+`<path d="M16 -11 L34 -11 L38 -6 L38 6 L34 11 L16 11 Z" fill="#9aa0a8" stroke="${INK}" stroke-width="3"/>`],
 csavarhuzo:['Csavarhúzó',()=>R2(-46,-8,32,16,'#2c2c2c',7)+R2(-40,-3,20,6,'#4fb36b',2,1.5)+L2('M-14 0 L34 0',5)+`<path d="M34 -3 L44 -2 L44 2 L34 3 Z" fill="#ccc" stroke="${INK}" stroke-width="2"/>`],
 beuto:['Beütőtüske',()=>`<path d="M-44 -7 L10 -7 L10 -4 L24 -4 L46 0 L24 4 L10 4 L10 7 L-44 7 Z" fill="#c4c8ce" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`],
 pajszer:['Pajszer',()=>`<path d="M-44 4 L34 4 Q44 4 46 -8" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M-44 4 L34 4 Q44 4 46 -8" fill="none" stroke="#7d5a45" stroke-width="6" stroke-linecap="round"/>`],
 nyomatek:['Nyomatékkulcs',()=>C2(-36,0,12,'#b3b8bf')+R2(-26,-6,46,12,'#e3e5e8',6)+R2(20,-8,26,16,'#2c2c2c',6)+R2(-6,-4,12,8,'#4fb36b',1,1.5)+TX(4,26,'520–550 Nm',12)],
 racsnis:['Racsnis 32',()=>C2(-34,0,13,'#b3b8bf')+R2(-22,-6,66,12,'#e3e5e8',6)+TX(-34,28,'32',12)],
 osszehuzo:['Összehúzó',()=>`<path d="M-44 -10 A10 10 0 1 0 -44 10" fill="none" stroke="${INK}" stroke-width="5"/><path d="M44 -10 A10 10 0 1 1 44 10" fill="none" stroke="${INK}" stroke-width="5"/>`+R2(-40,-7,80,14,'#a7b07a',3)+L2('M-30 0 '+[...Array(12)].map((_,k)=>`L${-27+k*5} ${k%2?-4:4}`).join(' '),1.5)],
 porszivo:['Porszívó',()=>R2(-26,-26,40,50,'#a7b07a',12)+C2(-16,28,5)+C2(4,28,5)+L2('M14 -6 C34 -6 30 24 46 24',6)],
 kompresszor:['Kompresszor',()=>R2(-40,-4,70,26,'#a7b07a',13)+R2(-20,-26,32,22,'#555',3)+C2(-28,26,6)+L2('M30 6 C40 6 40 -14 48 -14',3,BL)],
 feszito:['Láncfeszítő',()=>R2(-44,-5,72,10,'#6f7a4a',5)+C2(34,0,13,'#c4c8ce')+`<polygon points="${[0,1,2,3,4,5].map(k=>`${34+7*Math.cos(k*Math.PI/3)},${7*Math.sin(k*Math.PI/3)}`).join(' ')}" fill="#fff" stroke="${INK}" stroke-width="2"/>`],
 kupak:['Kupaklazító',()=>R2(-40,-5,56,10,'#6f7a4a',5)+C2(26,0,14,'#c4c8ce')+C2(26,0,7,'#fff',2)],
 ek:['Fa ék',()=>`<path d="M-40 18 L40 18 L40 -14 Z" fill="#e3c08a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`],
 madzag:['Madzag + C-kapocs',()=>L2('M-40 -10 L40 -10',3,BL)+L2('M-40 -10 l0 18 l8 0 l0 10 l-12 0',4)+L2('M40 -10 l0 18 l-8 0 l0 10 l12 0',4)],
 idomszer:['Idomszer 6/8',()=>`<path d="M-40 -16 L-24 -16 L-24 -10 L-14 -10 L-14 -16 L14 -16 L14 -8 L24 -8 L24 -16 L40 -16 L40 16 L-40 16 Z" fill="#e3e5e8" stroke="${INK}" stroke-width="3"/>`+TX(-19,10,'6',12)+TX(19,10,'8',12)],
 drotkefe:['Drótkefe',()=>R2(-40,-14,72,12,'#d9b27c',5)+[...Array(11)].map((_,k)=>L2(`M${-34+k*6} -2 l0 12`,1.6,'#666')).join('')],
 benzin:['Benzin / hígító',()=>R2(-18,-24,36,46,'#e5483c',5)+R2(-6,-32,12,8,'#555',2)+TX(0,6,'B',16,'middle','#fff')]
};
const toolSVG=k=>`<svg viewBox="-55 -50 110 90" xmlns="http://www.w3.org/2000/svg">${TOOL[k][1]()}</svg>`;

// ===== ALKATRÉSZEK IZOMETRIKUSAN =====
// lánctag: szélesség x irányban (W), haladási irány y; z felfelé. pads: 'ok' | 'none' | 'old' | 'hl' | 'lift'
const W=150,PIT=50;
function link(x,y,z,o={}){const p=o.pads||'ok';let g='';
 const pin=(yy)=>cyl('x',[x-8,yy,z+8],6.5,W+16,'dsteel',18);
 g+=pin(y);
 g+=box(x,y-2,z,W,34,16,o.body||'steel');
 g+=poly3([[x+8,y+4,z+16],[x+W-8,y+4,z+16],[x+W-8,y+28,z+16],[x+8,y+28,z+16]],'#b9bdc4',1.2);
 const pad=(px,pal,lift=0)=>box(px,y+2,z+16+lift,58,28,12,pal);
 const nest=(px,muddy)=>poly3([[px,y+2,z+16],[px+58,y+2,z+16],[px+58,y+30,z+16],[px,y+30,z+16]],muddy?PAL.mud[1]:'#7d8188',1.5)+(muddy?[[12,8],[30,18],[44,10]].map(([a,b])=>poly3([[px+a,y+b,z+16.5],[px+a+8,y+b,z+16.5],[px+a+8,y+b+5,z+16.5],[px+a,y+b+5,z+16.5]],PAL.mud[2],1)).join(''):'')+line3([[px+8,y+15,z+16],[px+50,y+15,z+16]],1.2,'#555');
 const L=p==='none'||p==='mud'?nest(x+8,p==='mud'):pad(x+8,p==='old'?'rub':p==='hl'?'hl':'rub');
 const Rr=p==='none'||p==='mud'?nest(x+W-66,p==='mud'):pad(x+W-66,p==='hl'?'hl':'rub',p==='lift'?18:0);
 g+=L+Rr;
 g+=pin(y+PIT-16);
 return g;}
function endConn(x,y,z,pal='steel'){ // szélső összekötő a +x oldalon, y..y+PIT között
 return box(x,y-12,z-2,14,PIT+8,20,pal)+cyl('x',[x+14,y+(PIT-16)/2,z+8],7,5,'dsteel',6,2,Math.PI/6);}
function centerConn(x,y,z,pal='steel'){return box(x-12,y-10,z+14,24,PIT+4,10,pal)+hex('z',[x,y+(PIT-16)/2,z+24],8,8);}
function trackPiece(n,o={}){ // n tag sorban, y irányban
 let g='';for(let k=0;k<n;k++){const yy=k*PIT;g+=link(0,yy,0,{pads:(o.pads&&o.pads[k])||o.pad||'ok',body:o.body});
  if(k<n-1&&o.conn!==false){g+=centerConn(W/2,yy+PIT-16+0,0,o.hlC===k?'hl':'steel');}}
 if(o.endR!==false)for(let k=0;k<n-1;k++)g+=endConn(W+8,k*PIT+PIT-16-8,0,o.hlE===k?'hl':'steel');
 return g;}

// ===== JÁRMŰ IZOMETRIKUSAN (x = haladási irány előre) =====
function trackSide(y0,near){let g='';const L0=-20,L1=380;
 g+=box(L0,y0,4,L1-L0,40,52,'rub');
 if(near){for(let k=0;k<7;k++)g+=cyl('y',[30+k*44,y0+40,34],21,6,'dsteel',22)+cyl('y',[30+k*44,y0+46,34],7,2,'steel',12);
  g+=cyl('y',[-6,y0+40,40],20,6,'dsteel',22)+cyl('y',[362,y0+40,44],22,6,'olive',12);
  for(let k=0;k<26;k++){const xx=L0+8+k*15;g+=line3([[xx,y0+40,4],[xx,y0+40,10]],1.3,'#888')}}
 return g;}
function vehicle(o={}){let g='';
 g+=trackSide(-40,false);
 g+=box(-10,0,30,370,150,40,'hull');
 g+=poly3([[360,0,70],[400,0,40],[400,150,40],[360,150,70]],PAL.hull[0])+poly3([[360,150,30],[400,150,40],[360,150,70]],PAL.hull[1])+poly3([[360,150,30],[400,150,30],[400,150,40]],PAL.hull[1]);
 g+=box(-10,150,30,370,10,40,'olive');
 g+=box(10,10,70,200,130,62,'hull');
 g+=poly3([[210,10,132],[250,20,100],[250,130,100],[210,140,132]],PAL.hull[0])+poly3([[210,140,70],[250,130,70],[250,130,100],[210,140,132]],PAL.hull[1]);
 g+=box(40,20,132,40,40,14,'hull')+box(120,90,132,50,30,8,'hull');
 g+=cyl('x',[250,75,104],10,60,'hull',16)+cyl('x',[310,75,104],6.5,190,'hull',14)+cyl('x',[400,75,104],10,30,'hull',14)+box(500,64,95,24,22,18,'dsteel');
 for(let k=0;k<5;k++)g+=poly3([[20+k*38,140,82],[52+k*38,140,82],[52+k*38,140,118],[20+k*38,140,118]],PAL.hull[1],1.5);
 g+=trackSide(160,true);
 if(o.skirt)g+=poly3([[-10,200,90],[360,200,90],[360,240,96],[-10,240,96]],PAL.olive[0])+'';
 return g;}
const vehSVG=(ox,oy,sc,o)=>{cam(ox,oy,sc);return vehicle(o);};

// ===== FESZÍTŐ (hátsó feszítőgörgő + feszítő berendezés), izometrikusan =====
function tensioner(o={}){let g='';const hc=[70,0,80]; // görgő agy (x,z), y=0 a külső sík
 g+=poly3([[150,-60,60],[330,-60,60],[330,-60,170],[150,-60,170]],'#e7e9e2',1.5);
 // lánc az ív mögött
 const R0=62,TH=14;const tPts=[];
 const slack=o.slack?18:0;
 // felső ág
 for(let k=0;k<9;k++){const xx=hc[0]+k*30;g+=box(xx,-14,hc[2]+R0-2+(o.slack&&k>2?-(k-2)*1.2:0),28,44,TH,'rub',1.5);}
 // ív (hátsó félkör) szegmensek
 for(let k=1;k<12;k++){const a=Math.PI/2+k*Math.PI/12;const cx=hc[0]+(R0+7)*Math.cos(a),cz=hc[2]+(R0+7)*Math.sin(a);
  const t=[-Math.sin(a),Math.cos(a)],nn=[Math.cos(a),Math.sin(a)];const hw=9,ht=7;
  const c4=[[cx-t[0]*hw-nn[0]*ht,cz-t[1]*hw-nn[1]*ht],[cx+t[0]*hw-nn[0]*ht,cz+t[1]*hw-nn[1]*ht],[cx+t[0]*hw+nn[0]*ht,cz+t[1]*hw+nn[1]*ht],[cx-t[0]*hw+nn[0]*ht,cz-t[1]*hw+nn[1]*ht]];
  g+=poly3(c4.map(p=>[p[0],30,p[1]]),PAL.rub[1],1.5)+poly3([[c4[2][0],-14,c4[2][1]],[c4[3][0],-14,c4[3][1]],[c4[3][0],30,c4[3][1]],[c4[2][0],30,c4[2][1]]],PAL.rub[0],1.2);}
 // alsó ág
 for(let k=0;k<9;k++){const xx=hc[0]+k*30;g+=box(xx,-14,hc[2]-R0-TH+2-(o.slack?Math.min(k,5)*3:0),28,44,TH,'rub',1.5);}
 // görgő
 g+=cyl('y',[hc[0],-6,hc[2]],R0-4,30,'dsteel',36)+cyl('y',[hc[0],24,hc[2]],R0-16,3,'steel',36)+cyl('y',[hc[0],27,hc[2]],16,6,'dsteel',20);
 // kar a feszítőhöz
 g+=poly3([[hc[0],30,hc[2]+6],[hc[0]+90,30,hc[2]+40],[hc[0]+96,30,hc[2]+26],[hc[0]+4,30,hc[2]-8]],PAL.olive[1]);
 // feszítő berendezés (a test mellett, kicsit kint)
 const tx=hc[0]+96+(o.slack?-16:0),tz=hc[2]+34;
 g+=box(tx,0,tz-18,70,34,36,o.hlBody?'hl':'olive');
 g+=cyl('x',[tx+70,17,tz],10,40,o.hlScrew?'hl':'steel',20);
 for(let k=0;k<5;k++)g+=line3(ring('x',[tx+76+k*7,17,tz],10.5,10).concat([ring('x',[tx+76+k*7,17,tz],10.5,10)[0]]).slice(0,6),1.2,'#666');
 g+=hex('x',[tx+82,17,tz],14,12,o.hlScrew?'hl':'dsteel');
 const capX=o.capOff?tx+150:tx+110;
 if(o.capOff)g+=cyl('x',[tx+110,17,tz],9,6,'steel',16);
 g+=cyl('x',[capX,17,tz],13,24,o.hlCap?'hl':'olive',24);
 g+=box(tx+40,-60,tz-14,40,60,10,'olive');
 return {g,cap:[capX+24,17,tz],nut:[tx+94,17,tz],hub:[hc[0],30,hc[2]]};}
