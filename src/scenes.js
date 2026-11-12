// ===== JELENETEK =====
const tool=(k,x,y,rot=0,s=1)=>G2(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,TOOL[k][1]());
const at=(p)=>pj(...p);
const bubble=(x,y,t,w=120)=>`<path d="M${x-w/2} ${y-22} h${w} a8 8 0 0 1 8 8 v26 a8 8 0 0 1 -8 8 h-${w/2-12} l-12 14 l0 -14 h-${w/2} a8 8 0 0 1 -8 -8 v-26 a8 8 0 0 1 8 -8 Z" fill="#fff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`+TX(x,y+6,t,18);
const badge=(x,y,t,col=INK,fs=22)=>{const w=t.length*fs*0.62+24;return R2(x-w/2,y-fs,w,fs*1.6,col,8,2.5)+`<text x="${x}" y="${y+fs*0.32}" font-size="${fs}" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">${t}</text>`};
function sprocket3(c,r){const P=[];for(let k=0;k<26;k++){const a=k*Math.PI/13,rr=k%2?r:r+10;P.push([c[0]+rr*Math.cos(a),c[1],c[2]+rr*Math.sin(a)])}
 const back=P.map(p=>[p[0],p[1]-20,p[2]]);return poly(hull2(P.concat(back).map(at)),PAL.dsteel[1],2)+poly3(P,PAL.steel[0],2)+cyl('y',[c[0],c[1],c[2]],r*0.45,4,'dsteel',24)+cyl('y',[c[0],c[1]+4,c[2]],10,4,'steel',12);}
function trackStrip(x0,x1,y,z=0,pal='rub'){let g='';for(let x=x1;x>=x0;x-=26)g+=box(x,y,z,24,90,10,pal,1.5);return g;}
function vehTop2D(x,y,s=1,rot=0){return G2(`translate(${x} ${y}) rotate(${rot}) scale(${s})`,R2(-40,-90,80,180,'#dfe2d6',6)+R2(-54,-92,14,184,'#333',3)+R2(40,-92,14,184,'#333',3)+R2(-32,-10,64,80,'#c4c8b6',6)+L2('M0 -10 L0 -140',8)+L2('M0 -10 L0 -140',4,'#dfe2d6')+R2(-7,-150,14,14,'#999',2));}

const S=[];
// 0 Biztonság
S[0]=()=>man(110,200,1.45,'stand')+man(240,200,1.45,'signal')+bubble(250,46,'VIGYÁZZ!',130)+L2('M30 262 L370 262',3)+G2('translate(340 150) scale(1.25)',TOOL.kesztyu[1]())+OK2(370,96,18)+TX(200,292,'KESZTYŰ · HANGOS FIGYELMEZTETÉS',15);
// 1 Terület
S[1]=()=>{const mini=(cx,cy,rot)=>{cam(0,0,0.2);return G2(`translate(${cx} ${cy}) rotate(${rot})`,vehicle())};
 return mini(30,170,0)+L2('M10 202 L120 202',4)+OK2(66,80,24)+TX(66,240,'VÍZSZINTES',15)+
 mini(150,176,-16)+L2('M140 214 L254 178',4)+NO2(200,80,24)+TX(200,240,'LEJTŐS',15)+
 mini(282,162,10)+L2('M272 200 Q288 180 304 200 Q318 214 332 192 Q346 162 362 194 Q374 208 390 198',4)+NO2(334,80,24)+TX(334,240,'GÖRÖNGYÖS',15)+
 L2('M134 60 L134 250 M266 60 L266 250',1.5,'#bbb')+TX(200,290,'BETON, VÍZSZINTES',17);};
// 2 Szerszámok
S[2]=()=>{const it=[['nagyk','2'],['kisk','2'],['csavarhuzo','6-8'],['beuto','2+'],['pajszer','2'],['osszehuzo','2'],['nyomatek','1'],['racsnis','2'],['feszito','1'],['kupak','1'],['porszivo','1'],['kompresszor','1']];
 return it.map(([k,q],i)=>{const x=55+(i%4)*97,y=48+Math.floor(i/4)*98;return R2(x-44,y-38,88,84,'#f6f6f4',10,1.5)+G2(`translate(${x} ${y-2}) scale(.72)`,TOOL[k][1]())+TX(x,y+36,TOOL[k][0],11)+C2(x+38,y-34,13,OR,2)+`<text x="${x+38}" y="${y-29}" font-size="${q.length>2?10:13}" font-weight="900" text-anchor="middle" fill="#fff" font-family="Arial">${q}</text>`}).join('');};
// 3 Jármű elhelyezése
S[3]=()=>{cam(150,120,0.5);let g=poly3([[-60,-150,0],[460,-150,0],[460,-40,0],[-60,-40,0]],'rgba(240,125,22,.18)',2,'stroke-dasharray="8 6"')+poly3([[-60,200,0],[460,200,0],[460,320,0],[-60,320,0]],'rgba(240,125,22,.18)',2,'stroke-dasharray="8 6"');
 g+=vehicle();const a=at([200,260,0]),b=at([200,-100,0]);g+=man(a[0],a[1]-40,0.75,'stand')+man(b[0],b[1]-40,0.75,'stand');g+=arr3([-80,75,0],[-80,75,0])+arr3([480,75,0],[600,75,0],INK,6);
 const t1=at([150,320,0]),t2=at([150,-150,0]);return g+TX(t1[0]-30,t1[1]+24,'SZABAD HELY',14)+TX(t2[0]+10,t2[1]-10,'SZABAD HELY',14)+TX(330,286,'ELŐRE ↘',14);};
// 4 Kézifék
S[4]=()=>R2(90,214,220,40,'#d9dccf',8)+`<path d="M170 232 L246 84" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M170 232 L246 84" stroke="#b3b8bf" stroke-width="13" stroke-linecap="round"/>`+R2(226,52,46,46,'#2c2c2c',12)+C2(170,232,14,'#888')+NO2(300,90,40)+TX(200,292,'KÉZIFÉKET NE HÚZD BE!',19);
// 5 Zárókupak ki
S[5]=()=>{cam(60,210,0.74);const t=tensioner({hlCap:1});const c=at(t.cap);return t.g+arc3('x',[t.cap[0]+4,17,t.cap[2]],26,-0.3,4.4,RD,5)+G2(`translate(${c[0]+20} ${c[1]-44}) rotate(-60) scale(.9)`,TOOL.kupak[1]())+callout(c[0]-8,c[1]+10,c[0]-30,c[1]+70,'ZÁRÓKUPAK')+TX(200,24,'BALRA (LE) – KITEKERNI',17,'middle',RD);};
// 6 Feszítő összehúzása
S[6]=()=>{cam(60,210,0.74);const t=tensioner({capOff:1,slack:1,hlScrew:1});const n=at(t.nut),h=at(t.hub);return t.g+arc3('x',[t.nut[0],17,t.nut[2]],28,0.3,4.6,OR,5)+G2(`translate(${n[0]+10} ${n[1]-60}) rotate(-75) scale(.9)`,TOOL.feszito[1]())+A2(h[0]+30,h[1]-120,h[0]+90,h[1]-90,OR,7)+TX(h[0]+40,h[1]-140,'GÖRGŐ ELŐRE',14)+TX(200,292,'ÖSSZEHÚZNI VÉGÁLLÁSIG → LÁNC LAZA',16);};
// 7 Szélső összekötő csavarjai ki
S[7]=()=>{cam(150,80,1.0);const g=trackPiece(2,{hlE:0});const b=at([W+22,PIT-16+(PIT-16)/2-8,8]);return g+arc3('x',[W+26,PIT-16+(PIT-16)/2-8,8],22,0.2,4.5,RD,5)+G2(`translate(${b[0]+52} ${b[1]-6}) rotate(-20) scale(.85)`,TOOL.racsnis[1]())+callout(b[0]-6,b[1]+18,b[0]-40,b[1]+70,'SZÉLSŐ ÖSSZEKÖTŐ')+badge(70,40,'32')+TX(200,292,'KÍVÜL ÉS BELÜL IS',17);};
// 8 Szélső összekötő leütése
S[8]=()=>{cam(150,80,1.0);let g=trackPiece(2,{endR:false});g+=endConn(W+60,PIT-24,0,'hl');const a=at([W+14,PIT+10,8]),b=at([W+56,PIT+10,8]);
 return g+A2(a[0],a[1]+40,b[0]+30,b[1]+40,OR,7)+G2(`translate(${a[0]-6} ${a[1]-30}) rotate(30)`,TOOL.pajszer[1]())+G2(`translate(${a[0]-58} ${a[1]-70}) rotate(-35) scale(.9)`,TOOL.nagyk[1]())+man(60,250,0.75,'hold')+WARN2(40,46)+TX(200,292,'BELÜLRŐL KIFELÉ LEÜTNI',17);};
// 9 Középső összekötő csavarja ki
S[9]=()=>{cam(150,80,1.0);const g=trackPiece(2,{hlC:0,endR:false});const c=at([W/2,(PIT-16)/2+PIT-16,24]);return ZONE(c[0],c[1]+10,150,95)+g+arc3('z',[W/2,PIT-16+(PIT-16)/2,34],20,0,4.5,RD,5)+arr3([W/2,-20,10],[W/2,-80,10],RD,7)+arr3([W/2,2*PIT+10,10],[W/2,2*PIT+70,10],RD,7)+WARN2(40,46,1.1)+man(370,240,0.7,'stand')+OK2(386,150,13)+TX(200,292,'FESZÜLHET! SENKI NE ÁLLJON ITT',16,'middle',RD);};
// 10 Leállás előre
S[10]=()=>{cam(130,170,0.42);let g=trackStrip(-520,380,150,0);g+=vehicle();const a=at([460,75,0]),b=at([620,75,0]);return g+A2(a[0],a[1]-40,b[0],b[1]-40,OR,8)+TX(b[0]-30,b[1]-70,'ELŐRE, LASSAN',16)+man(60,200,0.75,'signal');};
// 11 1,5 t
S[11]=()=>{cam(40,150,0.62);let g='';for(let x=420;x>=-40;x-=26)g+=box(x,0,0,24,150,12,'rub',1.5);let m='';for(let k=0;k<5;k++){const p=at([20+k*92,150,0]);m+=man(p[0]+8,p[1]-40,0.8,'lift')}
 return g+m+badge(110,46,'1,5 t',INK,28)+badge(300,46,'15–18 fő',OR,20);};
// 12 Kiékelés
S[12]=()=>{cam(130,110,1.05);const w=(x)=>poly3([[x,-10,-24],[x+30,-10,-24],[x+30,40,-24],[x,40,-24]],PAL.wood[0])+poly3([[x,40,-24],[x+30,40,-24],[x+30,40,0],[x,40,-24]],PAL.wood[1]);
 return w(-10)+w(W-20)+link(0,0,0)+callout(at([-8,40,-12])[0],at([-8,40,-12])[1],60,250,'FA ÉK')+callout(at([W+5,40,-12])[0],at([W+5,40,-12])[1],330,250,'FA ÉK')+TX(200,30,'BETÉT FELÜL',18);};
// 13 Régi betét kiemelése
S[13]=()=>{cam(120,120,1.15);const g=link(0,0,0,{pads:'lift'});const gap=at([W-66,30,20]),o=at([W-8,14,38]);return g+G2(`translate(${gap[0]-36} ${gap[1]+12}) rotate(-28) scale(.8)`,TOOL.beuto[1]())+G2(`translate(${gap[0]-80} ${gap[1]+36}) rotate(-60) scale(.7)`,TOOL.kisk[1]())+
 arr3([W-40,16,60],[W+60,16,60],OR,7)+G2(`translate(${at([W-80,16,40])[0]-40} ${at([W-80,16,40])[1]-30}) rotate(25) scale(.8)`,TOOL.pajszer[1]())+callout(gap[0],gap[1],80,250,'TÜSKE A RÉSBE')+TX(300,40,'KI A SÍNBŐL',17);};
// 14 Fészek tisztítása
S[14]=()=>{cam(110,110,1.25);const g=link(0,0,0,{pads:'mud'});const n=at([40,16,16]);return g+G2(`translate(${n[0]+40} ${n[1]-40}) rotate(-55) scale(.9)`,TOOL.csavarhuzo[1]())+callout(at([10,4,16])[0],at([10,4,16])[1],60,40,'OLDALSÓ SÍN')+callout(at([40,20,16])[0],at([40,20,16])[1],120,250,'FÉSZEK ALJA')+callout(at([66,4,16])[0],at([66,4,16])[1],260,40,'KÖRMÖK')+TX(330,270,'ELLENŐRIZD!',16,'middle',RD);};
// 15 Porszívó + kompresszor
S[15]=()=>{cam(150,120,1.15);const g=link(0,0,0,{pads:'none'});const n=at([40,16,16]);return g+G2(`translate(60 230) scale(1.1)`,TOOL.porszivo[1]())+L2(`M110 254 C150 254 ${n[0]-20} ${n[1]+40} ${n[0]} ${n[1]+6}`,7)+G2('translate(330 230)',TOOL.kompresszor[1]())+L2(`M370 216 C370 160 ${n[0]+120} ${n[1]-20} ${n[0]+90} ${n[1]}`,3,BL)+[0,1,2].map(k=>L2(`M${n[0]+84-k*10} ${n[1]+4+k*6} l-16 6`,3,BL)).join('')+TX(200,30,'POR ÉS SÁR KI',18);};
// 16 Új betétek odakészítése
S[16]=()=>{cam(150,160,1.0);let g='';for(let r=0;r<3;r++)for(let c=2;c>=0;c--)for(let z=0;z<4;z++)g+=box(c*64,r*34,z*12,58,28,12,'rub',1.5);return g+badge(320,60,'190 db',OR,22)+TX(320,100,'oldalanként',15)+TX(320,124,'2,5 kg / db',15);};
// 17 Új betét behelyezése
S[17]=()=>{cam(110,140,1.2);const g=link(0,0,0,{pads:'ok'}).replace(box(W-66,2,16,58,28,12,'rub'),'');return link(0,0,0,{pads:'none'})+box(8,2,16,58,28,12,'rub')+box(W-66,2,56,58,28,12,'rub')+arr3([W-37,16,52],[W-37,16,32],OR,7)+TX(200,30,'A HELYÉRE ILLESZTVE',17);};
// 18 Beütés KLIKK
S[18]=()=>{cam(110,150,1.2);const g=link(0,0,0);const p=at([W-37,16,28]);return g+G2(`translate(${p[0]} ${p[1]-70}) rotate(90) scale(1.4)`,TOOL.nagyk[1]())+L2(`M${p[0]-40} ${p[1]-14} l-14 -10 M${p[0]+40} ${p[1]-14} l14 -10`,3)+bubble(320,60,'KLIKK!',110)+
 G2('translate(70 210)',C2(0,0,52,'#fff',3)+R2(-40,6,80,22,'#cfd3d8',2,2)+`<path d="M-10 6 L10 6 L4 -10 L-4 -10 Z" fill="#8a9099" stroke="${INK}" stroke-width="2"/>`+R2(-40,-26,80,16,'#333',3,2)+OK2(34,-34,12))+TX(70,282,'nyelv a horonyban',13);};
// 19 Betétek bent
S[19]=()=>{cam(150,70,0.95);return trackPiece(3)+OK2(330,60,26)+TX(330,110,'MIND KATTANT',15);};
// 20 Szélső 550 Nm
S[20]=()=>{cam(150,80,1.0);const g=trackPiece(2,{hlE:0});const b=at([W+22,PIT-16+(PIT-16)/2-8,8]);return g+arc3('x',[W+26,PIT-16+(PIT-16)/2-8,8],22,4.5,0.2,GN,5)+G2(`translate(${b[0]+58} ${b[1]-4}) rotate(-15) scale(.9)`,TOOL.nyomatek[1]())+badge(320,250,'550 Nm',INK,24)+badge(70,40,'32');};
// 21 Visszafordítás
S[21]=()=>{cam(60,130,0.75);const a=link(0,0,0);cam(250,130,0.75);const b=box(0,-2,0,W,34,16,'steel')+cyl('x',[-8,0,8],6.5,W+16,'dsteel',18)+cyl('x',[-8,PIT-16,8],6.5,W+16,'dsteel',18);
 return a+b+`<path d="M120 60 Q200 0 280 60" fill="none" stroke="${OR}" stroke-width="6" marker-end="url(#m_${OR.slice(1)})"/>`+TX(110,240,'BETÉT FELÜL',15)+TX(300,240,'BETÉT ALUL',15)+man(200,250,0.6,'lift');};
// 22 Középső 550 Nm
S[22]=()=>{cam(150,80,1.0);const g=trackPiece(2,{hlC:0});const c=at([W/2,PIT-16+(PIT-16)/2,34]);return g+arc3('z',[W/2,PIT-16+(PIT-16)/2,34],20,4.5,0,GN,5)+G2(`translate(${c[0]+10} ${c[1]-60}) rotate(-80) scale(.9)`,TOOL.nyomatek[1]())+badge(320,250,'550 Nm',INK,24);};
// 23 Visszaállás tolatva
S[23]=()=>{cam(170,170,0.42);let g=trackStrip(-300,600,150,0);g+=vehicle();const a=at([-60,75,0]),b=at([-220,75,0]);return g+A2(a[0],a[1]-40,b[0],b[1]-40,OR,8)+TX(b[0]+40,b[1]-70,'TOLATVA, LASSAN',16)+man(330,240,0.75,'signal');};
// 24 Csillagkerék
S[24]=()=>{cam(140,150,1.0);let g=sprocket3([0,0,60],56);for(let k=0;k<6;k++)g+=box(40+k*30,-16,-4-k*3,28,36,12,'rub',1.5);const p=at([120,0,10]);return g+G2(`translate(${p[0]+20} ${p[1]+20}) rotate(-40)`,TOOL.pajszer[1]())+arr3([140,10,30],[80,10,60],OR,7)+callout(at([0,0,120])[0],at([0,0,120])[1],80,30,'CSILLAGKERÉK')+man(330,250,0.75,'push');};
// 25 Összehúzó
S[25]=()=>{cam(150,70,0.95);let g=link(0,0,0)+link(0,PIT+40,0);const p1=at([W+12,PIT-16,8]),p2=at([W+12,PIT+40,8]);const c1=at([W/2,PIT-16,24]),c2=at([W/2,PIT+40,24]);
 const pull=(a,b)=>{const ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,len=Math.hypot(b[0]-a[0],b[1]-a[1]);return G2(`translate(${a[0]} ${a[1]}) rotate(${ang})`,R2(0,-8,len,16,'#a7b07a',3,2)+L2(`M8 0 ${[...Array(Math.floor(len/6))].map((_,k)=>`L${10+k*6} ${k%2?-5:5}`).join(' ')}`,1.4)+C2(0,0,9,'none',4)+C2(len,0,9,'none',4))};
 return g+pull(c1,c2)+pull(p1,p2)+tagN(c1[0]-30,(c1[1]+c2[1])/2,1,OR)+tagN(p1[0]+30,(p1[1]+p2[1])/2,2)+TX(200,286,'1. KÖZÉPSŐ → 2. SZÉLSŐK',17);};
// 26 Csavarok nyomatékra
S[26]=()=>{cam(150,70,0.95);return trackPiece(3,{hlC:0,hlE:0})+OK2(330,50,22)+badge(320,250,'550 Nm',INK,24)+badge(70,40,'32');};
// 27 Lánc visszafeszítése
S[27]=()=>{cam(60,210,0.74);const t=tensioner({capOff:1,hlScrew:1});const n=at(t.nut),h=at(t.hub);return t.g+arc3('x',[t.nut[0],17,t.nut[2]],28,4.6,0.3,GN,5)+G2(`translate(${n[0]+10} ${n[1]-60}) rotate(-75) scale(.9)`,TOOL.feszito[1]())+A2(h[0]+60,h[1]-90,h[0]+10,h[1]-120,GN,7)+TX(200,292,'FESZÍTÉS → LÁNC FESZES',17);};
// 28 Zárókupak vissza
S[28]=()=>{cam(60,210,0.74);const t=tensioner({hlCap:1});const c=at(t.cap);return t.g+arc3('x',[t.cap[0]+4,17,t.cap[2]],26,4.4,-0.3,GN,5)+G2(`translate(${c[0]+10} ${c[1]-56}) scale(.9)`,TOOL.kesztyu[1]())+TX(200,292,'KÉZZEL VISSZA – VÉDI A MENETET',16);};
// 29 Gyorsítás, satufék
S[29]=()=>{cam(120,190,0.42);const g=vehicle();return g+[0,1,2].map(k=>L2(`M${20+k*8} ${110+k*22} l-50 25`,4,'#999')).join('')+badge(100,40,'30–40 km/h',INK,20)+bubble(310,50,'SATUFÉK!',130);};
// 30 Kígyózás hátramenetben
S[30]=()=>vehTop2D(200,100,0.5,0)+`<path d="M200 150 C130 175 270 200 200 225 S130 255 200 280" fill="none" stroke="${OR}" stroke-width="6" stroke-dasharray="14 9" marker-end="url(#m_${OR.slice(1)})"/>`+`<path d="M340 40 L340 280" stroke="${INK}" stroke-width="2.5" marker-start="url(#m_1b1b1b)" marker-end="url(#m_1b1b1b)"/>`+TX(346,166,'~100 m',15,'start')+TX(70,200,'HÁTRA',17)+TX(70,224,'jobbra–balra',13);
// 31 Kigurítás üresben
S[31]=()=>{const p=(x,t,body)=>R2(x,30,118,220,'#f6f6f4',10,1.5)+TX(x+59,58,t,14)+body;
 return p(8,'1. ELŐRE',A2(30,150,100,150,OR,8))+p(141,'2. MEGÁLL',`<polygon points="${[...Array(8)].map((_,k)=>`${200+34*Math.cos(k*Math.PI/4+Math.PI/8)},${150+34*Math.sin(k*Math.PI/4+Math.PI/8)}`).join(' ')}" fill="${RD}" stroke="${INK}" stroke-width="3"/>`+TX(200,157,'STOP',14,'middle','#fff'))+
 p(274,'3. HÁTRA 1-ES',A2(366,120,300,120,OR,8)+R2(304,160,64,64,'#fff',8,3)+`<text x="336" y="207" font-size="38" font-weight="900" text-anchor="middle" font-family="Arial">N</text>`)+TX(200,290,'ÜRESBE → KIGURUL → LÁNC TEHERMENTES',14);};
// 32 Feszességmérés
S[32]=()=>{let g=C2(30,120,26,'#cfd3d8')+`<path d="M30 94 Q200 116 380 94" fill="none" stroke="${INK}" stroke-width="3"/>`;for(let k=0;k<13;k++){const x=40+k*27,tt=k/12,y=96+44*tt*(1-tt);g+=R2(x-9,y-7,18,14,k===6?OR:'#d9dccf',3,2)}
 g+=L2('M31 90 L381 90',2.5,BL)+L2('M31 90 l0 26 l10 0 l0 12 l-14 0',4)+L2('M381 90 l0 26 l-10 0 l0 12 l14 0',4)+TX(202,80,'7.',16)+TX(206,150,'13 külső összekötő',13);
 g+=G2('translate(270 220)',C2(0,0,62,'#fff',3)+R2(-50,8,100,50,'#d9dccf',4,2)+R2(-14,-8,28,16,'#b3b8bf',2,2)+L2('M-60 -34 L60 -34',3,BL)+`<path d="M30 -30 L30 -10" stroke="${INK}" stroke-width="2.5" marker-start="url(#m_1b1b1b)" marker-end="url(#m_1b1b1b)"/>`)+L2('M202 112 L240 166',1.5);
 return g+badge(100,230,'6–8 mm',GN,24)+TX(100,276,'6 alatt lazíts · 8 felett feszíts',12);};
// 33 Kész
S[33]=()=>{cam(80,210,0.4);return vehicle()+OK2(300,90,60)+TX(200,286,'EGYIK OLDAL KÉSZ – JÖHET A MÁSIK',16);};

// ===== ISMERTETŐ RAJZOK =====
const KN_LINK=()=>{cam(150,90,1.0);const g=trackPiece(2,{endR:true});const p=(a,n,tx,ty)=>{const q=at(a);return L2(`M${q[0]} ${q[1]} L${tx} ${ty}`,1.6)+tagN(tx,ty,n,OR)};
 return g+p([30,16,28],1,40,40)+p([W/2,PIT-8,26],2,200,24)+p([W+16,PIT-14,10],3,370,150)+p([60,PIT-16,8],4,60,250)+'';};
const KN_TENS=()=>{cam(60,210,0.74);const t=tensioner({});const p=(a,n,tx,ty)=>{const q=at(a);return L2(`M${q[0]} ${q[1]} L${tx} ${ty}`,1.6)+tagN(tx,ty,n,OR)};
 return t.g+p([t.cap[0]-10,17,t.cap[2]+10],1,370,60)+p([t.nut[0]-6,17,t.nut[2]+12],2,300,40)+p([t.nut[0]-50,17,t.nut[2]+16],3,220,40)+p([70,30,150],4,60,40);};
