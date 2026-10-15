import {ease,clamp} from './knowledge-sequence.js';
import graph from '../../data/knowledge-graph.json' with {type:'json'};
export {graph};
const tau=Math.PI*2,mix=(a,b,p)=>a+(b-a)*p;
export const sequence=[
  {id:'S010',start:90,end:102,chapter:'LIFE',title:'结构，组成生命',en:'A world|within.',zh:'微小之中，也有一个世界。',sub:'A world, contained within a cell.',foot:'真核细胞艺术示意 · 非实际尺度',footEn:'Eukaryotic cell · schematic, not to scale'},
  {id:'S011',start:102,end:114,chapter:'LIFE',title:'生命的多条路径',en:'Life takes|many paths.',zh:'分枝，延续，各自生长。',sub:'Branching. Continuing. Becoming.',foot:'生命分枝的艺术意象',footEn:'An artistic branching of life'},
  {id:'S012',start:114,end:126,chapter:'CIVILIZATION',title:'文字与记忆',en:'Memory,|made visible.',zh:'人类写下问题，也保存答案。',sub:'We write questions. We preserve answers.',foot:'读写之间，记忆跨越时间。',footEn:'Between reading and writing, memory crosses time.'},
  {id:'S013',start:126,end:138,chapter:'CIVILIZATION',title:'知识的旅行',en:'Knowledge|travels.',zh:'跨越地域，跨越世代。',sub:'Across places. Across generations.',foot:'知识交流的意象 · 相遇、翻译、分享',footEn:'An image of exchange · encounters, translation, sharing'},
  {id:'S014',start:138,end:147,chapter:'CREATION',title:'形式与韵律',en:'Every form|has a rhythm.',zh:'让问题有回声，让想象有形状。',sub:'An echo for questions. A form for imagination.',foot:'诗句、音符与解析波形的艺术转译',footEn:'An artistic translation between verse, notes and analytic waves'},
  {id:'S015',start:147,end:156,chapter:'CREATION',title:'规则与创造',en:'Patterns become|possibility.',zh:'规则，也可以是一种创造。',sub:'A rule can be a creative act.',foot:'利萨如曲线 · x = sin(3θ + φ)，y = sin(2θ)',footEn:'Lissajous figure · a changing phase, a changing form'},
  {id:'S016',start:156,end:165,chapter:'CONNECTION',title:'知识之间的联系',en:'Connections, revealed.',zh:'一门知识，可以打开另一扇门。',sub:'One idea opens a door to another.',foot:'从声音到路径，从分子到生命。',footEn:'From sound to routes. From molecules to life.'},
  {id:'S017',start:165,end:177,chapter:'CONNECTION',title:'知识宇宙图鉴',en:'',zh:'',sub:'',foot:'一个问题，通往无数种连接。',footEn:'One question. Countless connections.'},
  {id:'S018',start:177,end:186,chapter:'UNCERTAINTY',title:'未知与不确定',en:'Beyond|what we know.',zh:'并非每个问题，都已有答案。',sub:'Not every question has an answer yet.',foot:'保留未知，也保留继续探索的空间。',footEn:'Leave room for what remains unknown.'},
  {id:'S019',start:186,end:198,chapter:'UNCERTAINTY',title:'求证与来源',en:'A claim|needs a source.',zh:'让好奇继续，也让求证同行。',sub:'Stay curious. Keep checking.',foot:'来源、语境与证据，值得继续追问。',footEn:'Ask for sources. Consider context. Examine the evidence.'},
  {id:'S020',start:198,end:210,chapter:'DISCOVER',title:'下一次探索',en:'',zh:'',sub:'',foot:'',footEn:''}
];
export const fontSample=sequence.map(s=>Object.values(s).join('')).join('')+Object.values(graph.nodes).map(n=>n.zh+n.en).join('')+'数学物理生命文明创造计算多样字形韵律细胞核细胞膜核酸信息频率分析路径建模遗传信息查找来源交叉核对保留疑问未知不确定验证接下来你想探索什么下一次探索始于你的问题非官方原创数字艺术配乐原创程序绘制概念示意知识宇宙图鉴读写共享文字留存与交流';
const text=(c,s,x,y,size=24,color='#a6beb6',font='Noto Sans SC Variable',align='left')=>{c.textAlign=align;c.fillStyle=color;c.font=`400 ${size}px "${font}"`;c.fillText(s,x,y);};
function line(c,points,color='#8fd1e3',width=1.5,alpha=1){c.save();c.globalAlpha*=alpha;c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.restore();}
function dot(c,x,y,r=4,color='#e6e2c4'){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,tau);c.fill();}
function ring(c,x,y,r,color='#8fd1e3',width=1.2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,r,0,tau);c.stroke();}
const palette={LIFE:'#a6c6aa',CIVILIZATION:'#d9be8e',CREATION:'#c4b9d4',CONNECTION:'#9bc9ca',UNCERTAINTY:'#8c9aab',DISCOVER:'#d9d5b9'};
function background(c,s){
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);const light=c.createRadialGradient(1330,590,60,1330,590,1150);
  light.addColorStop(0,s.chapter==='LIFE'?'#20382f':s.chapter==='CIVILIZATION'?'#302d28':'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);c.globalAlpha=.028;c.fillStyle='#d8e5dd';
  const h=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};for(let i=0;i<500;i++)c.fillRect(Math.floor(h(i+1)*1920),Math.floor(h(i+1001)*1080),1,1);c.globalAlpha=1;
  text(c,'知识宇宙图鉴',252,165,23,'#b6c0b8');text(c,'GPT / THE ATLAS OF KNOWLEDGE',252,201,16,'#819a97','Space Grotesk');
  const ch={LIFE:['04','生命'],CIVILIZATION:['05','文明'],CREATION:['06','创造'],CONNECTION:['07','关联'],UNCERTAINTY:['08','边界'],DISCOVER:['09','探索']}[s.chapter];
  text(c,ch[0],1668,165,18,palette[s.chapter],'Space Grotesk','right');text(c,`${ch[1]} / ${s.chapter}`,1668,201,16,'#819a97','Noto Sans SC Variable','right');
  text(c,s.foot,258,930,17,'#6e8887');text(c,s.footEn,258,961,20,'#819a97','Cormorant Garamond');
  text(c,'配乐 / Music: Aphelion — Scott Buckley · CC BY 4.0 · scottbuckley.com.au',252,1020,14,'#7e918b');
}
function heading(c,s,t){
  if(!s.en)return;c.save();c.globalAlpha=ease(t,.4,1.5);const rows=s.en.split('|'),wide=rows.length===1;
  rows.forEach((v,i)=>text(c,v,252,wide?285:440+i*105,wide?86:92,'#eee9db','Cormorant Garamond'));
  text(c,s.zh,258,wide?333:627,wide?28:25);text(c,s.sub,258,wide?370:664,24,'#819a97','Cormorant Garamond');c.restore();
}
function cell(c,t){
  const p=ease(t,.5,3),cx=1300,cy=600,r=222;c.save();c.globalAlpha=p;
  for(const off of [0,7])line(c,Array.from({length:361},(_,i)=>{const a=i/360*tau,rad=r+off+Math.sin(a*5+t*.25)*5;return [cx+Math.cos(a)*rad,cy+Math.sin(a)*rad];}),'#a6c6aa',off?1:2,off?.28:.8);
  ring(c,cx-23,cy-8,76,'#c6d5bd',1.4);ring(c,cx-23,cy-8,81,'#a6c6aa',.6);dot(c,cx-35,cy-12,13,'#b9c3ac');
  for(let k=0;k<7;k++){const a=k/7*tau+t*.03,x=cx+Math.cos(a)*150,y=cy+Math.sin(a)*148;c.save();c.translate(x,y);c.rotate(a+.4);c.strokeStyle='#86b9bd';c.lineWidth=1.1;c.beginPath();c.ellipse(0,0,26,12,0,0,tau);c.stroke();line(c,[[-16,0],[-8,-5],[0,5],[8,-5],[16,0]],'#86b9bd',.8,.7);c.restore();}
  c.save();c.globalAlpha=ease(t,4.5,6);line(c,[[1280,525],[1450,425],[1580,425]],'#c6d5bd',1,.5);text(c,'细胞核 / NUCLEUS',1580,410,18,'#b8c9bb','Noto Sans SC Variable','right');
  line(c,[[1490,722],[1550,800],[1668,800]],'#a6c6aa',1,.5);text(c,'细胞膜 / MEMBRANE',1668,833,18,'#819a97','Noto Sans SC Variable','right');c.restore();c.restore();
}
export function branchSegments(depth=6){
  const segments=[];
  function branch(x,y,a,len,n,path){const end=[x+Math.cos(a)*len,y+Math.sin(a)*len];segments.push({a:[x,y],b:end,level:depth-n,path});if(n>0){branch(...end,a-.38,len*.72,n-1,path*2);branch(...end,a+.38,len*.72,n-1,path*2+1);}}
  branch(1270,850,-Math.PI/2,155,depth,1);return segments;
}
const branches=branchSegments();
function tree(c,t){
  for(const b of branches){const p=ease(t,.5+b.level*.65,1.8+b.level*.65);if(!p)continue;const end=b.a.map((v,i)=>mix(v,b.b[i],p));line(c,[b.a,end],'#a6c6aa',Math.max(.7,3-b.level*.38),.85-b.level*.07);if(b.level===6&&p===1)dot(c,...end,2.5,'#b8d3bb');}
  c.save();c.globalAlpha=ease(t,7.5,9);text(c,'多样 / DIVERSITY',1668,295,18,'#a6c6aa','Noto Sans SC Variable','right');c.restore();
}
function book(c,t){
  const p=ease(t,.5,3),cx=1270,cy=800;c.save();c.globalAlpha=p;
  for(let k=5;k>=0;k--){const o=k*5;c.strokeStyle=k?'#9c9b88':'#d9be8e';c.lineWidth=k?.7:1.6;c.globalAlpha=p*(k?.25:.9);c.beginPath();c.moveTo(cx,cy);c.bezierCurveTo(cx-100,cy-100-o,cx-230,cy-45-o,cx-330,cy-80-o);c.lineTo(cx-330,cy-410-o);c.bezierCurveTo(cx-200,cy-375-o,cx-90,cy-430-o,cx,cy-350);c.bezierCurveTo(cx+90,cy-430-o,cx+200,cy-375-o,cx+330,cy-410-o);c.lineTo(cx+330,cy-80-o);c.bezierCurveTo(cx+230,cy-45-o,cx+100,cy-100-o,cx,cy);c.stroke();}
  c.globalAlpha=p;line(c,[[cx,450],[cx,800]],'#d9be8e',1,.45);
  for(let page=-1;page<=1;page+=2)for(let row=0;row<5;row++){const y=620+row*24;line(c,[[cx+page*55,y],[cx+page*180,y-12],[cx+page*270,y-2]],'#b6b39e',1,.38);}
  c.globalAlpha=ease(t,2.25,4.5);text(c,'言',cx-170,577,92,'#d9cfb1','Noto Sans SC Variable','center');text(c,'Aa',cx+166,577,112,'#d9cfb1','Cormorant Garamond','center');
  c.globalAlpha=ease(t,6,7.5);text(c,'文字 · 留存 · 交流',1668,288,22,'#b6b39e','Noto Sans SC Variable','right');c.restore();
}
export function spherePoint(lat,lon,rotation=0){const a=lon+rotation;return {x:Math.cos(lat)*Math.sin(a),y:Math.sin(lat),z:Math.cos(lat)*Math.cos(a)};}
function globe(c,t){
  const cx=1300,cy=610,r=230,turn=t*.055,p=ease(t,.5,2.25);c.save();c.globalAlpha=p;
  ring(c,cx,cy,r,'#d9be8e',1.3);
  const draw=points=>{for(const front of [false,true]){let seg=[];const flush=()=>{if(seg.length>1)line(c,seg,'#b9bda7',.8,front?.4:.12);seg=[];};for(const q of points){if((q.z>=0)===front)seg.push([cx+q.x*r,cy-q.y*r]);else flush();}flush();}};
  for(let lat=-60;lat<=60;lat+=30)draw(Array.from({length:241},(_,i)=>spherePoint(lat*Math.PI/180,i/240*tau,turn)));
  for(let lon=0;lon<180;lon+=30)draw(Array.from({length:241},(_,i)=>{const a=i/240*tau;return {x:Math.cos(a)*Math.sin(lon*Math.PI/180+turn),y:Math.sin(a),z:Math.cos(a)*Math.cos(lon*Math.PI/180+turn)};}));
  const routes=[[-.5,-.8,.4,.55],[.4,-.6,-.3,.9],[.7,-.5,.1,1.25]];
  routes.forEach((v,k)=>{const start=spherePoint(v[0],v[1],turn),end=spherePoint(v[2],v[3],turn),a=[cx+start.x*r,cy-start.y*r],b=[cx+end.x*r,cy-end.y*r],q=ease(t,2.25+k*1.5,4.5+k*1.5);
    const arc=u=>[(1-u)**2*a[0]+2*(1-u)*u*(cx+(k-1)*80)+u*u*b[0],(1-u)**2*a[1]+2*(1-u)*u*(cy-300)+u*u*b[1]];
    line(c,Array.from({length:101},(_,i)=>arc(q*i/100)),'#e1c89f',1.8,.75);dot(c,...a,3);dot(c,...arc(q),4);
  });c.restore();
}
export function creativeWave(x,t){return Math.sin(x-t)+.42*Math.sin(2*x+t*.3)+.2*Math.sin(3*x-t*.2);}
function rhythm(c,t){
  const p=ease(t,.5,2),x0=900,w=750;c.save();c.globalAlpha=p;
  for(let row=0;row<5;row++)line(c,[[x0,455+row*20],[1650,455+row*20]],'#a69fb7',.8,.24);
  for(let k=0;k<6;k++){const x=x0+80+k*110,y=495-Math.sin(k*1.7)*30;c.save();c.translate(x,y);c.rotate(-.2);c.fillStyle='#c4b9d4';c.beginPath();c.ellipse(0,0,7,4,0,0,tau);c.fill();c.restore();line(c,[[x+6,y],[x+6,y-58]],'#c4b9d4',1.2);}
  for(let k=0;k<3;k++)line(c,Array.from({length:361},(_,i)=>{const u=i/360;return [x0+w*u,690+k*48-creativeWave(u*tau*2,t*.6+k*.4)*(34-k*7)];}),['#c4b9d4','#a6c6aa','#8fd1e3'][k],1.5,.8-k*.2);
  text(c,'字形 / LETTER',x0,390,17,'#a69fb7');text(c,'韵律 / RHYTHM',1650,852,17,'#a69fb7','Noto Sans SC Variable','right');c.restore();
}
export function lissajous(theta,phase){return [Math.sin(3*theta+phase),Math.sin(2*theta)];}
function codeArt(c,t){
  const p=ease(t,.5,2.25),phase=t*.22,cx=1280,cy=585;c.save();c.globalAlpha=p;
  for(let k=5;k>=0;k--)line(c,Array.from({length:601},(_,i)=>{const q=lissajous(i/600*tau,phase+k*.025);return [cx+q[0]*(290+k*5),cy+q[1]*(205+k*3)];}),k?'#c4b9d4':'#d8d2c3',k?.8:1.6,k?.16:.95);
  text(c,'x = sin(3θ + φ)',1668,290,39,'#c6d9d4','Cormorant Garamond','right');text(c,'y = sin(2θ)',1668,336,39,'#819a97','Cormorant Garamond','right');
  c.globalAlpha=ease(t,4.5,6);text(c,'for each angle, draw a point.',1280,865,25,'#b4aac2','Cormorant Garamond','center');c.restore();
}
function connections(c,t){
  graph.edges.forEach((e,k)=>{const a=graph.nodes[e.from],b=graph.nodes[e.to],y=465+k*163,p=ease(t,.6+k*1.5,2.1+k*1.5),color=['#8fd1e3','#d9be8e','#a6c6aa'][k];
    c.save();c.globalAlpha=p;line(c,[[600,y],[1320,y]],color,1,.45);dot(c,600,y,5,color);dot(c,1320,y,5,color);
    text(c,a.zh,570,y-12,27,color,'Noto Sans SC Variable','right');text(c,a.en,570,y+22,24,'#819a97','Cormorant Garamond','right');
    text(c,b.zh,1350,y-12,27,color);text(c,b.en,1350,y+22,24,'#819a97','Cormorant Garamond');
    text(c,e.zh,960,y-17,18,'#a4b5af','Noto Sans SC Variable','center');text(c,e.en,960,y+25,17,'#819a97','Cormorant Garamond','center');
    dot(c,mix(600,1320,clamp((t-(.6+k*1.5))/3)),y,4,color);c.restore();
  });
}
const disciplines=[['数学','MATHEMATICS'],['物理','PHYSICS'],['生命','LIFE'],['文明','CIVILIZATION'],['创造','CREATION'],['计算','COMPUTATION']];
export function constellationPoint(i,t){const cluster=i%6,a=cluster/6*tau-Math.PI/2,r=120+((i*47)%117),q=i*2.39996323,zoom=mix(1,.78,ease(t,0,10));return [960+(Math.cos(a)*390+Math.cos(q)*r)*zoom,590+(Math.sin(a)*210+Math.sin(q)*r*.7)*zoom];}
function atlas(c,t){
  const p=ease(t,.3,2.25),leave=1-ease(t,10.5,12);c.save();c.globalAlpha=p;
  for(let i=0;i<96;i++){const a=constellationPoint(i,t),b=constellationPoint((i+6)%96,t);line(c,[a,b],i%3?'#8fb8ba':'#c9bea2',.8,.09);dot(c,...a,i%13===0?3:1.4,i%3?'#8fb8ba':'#c9bea2');}
  disciplines.forEach(([zh,en],i)=>{const a=i/6*tau-Math.PI/2,x=960+Math.cos(a)*540,y=570+Math.sin(a)*240,color=['#8fd1e3','#97afdd','#a6c6aa','#d9be8e','#c4b9d4','#9bc9ca'][i];c.save();c.globalAlpha*=.7;ring(c,x,y-10,25,color,1);
    c.save();c.translate(x,y-10);
    if(i===0)line(c,Array.from({length:41},(_,j)=>{const q=(j-20)*.7;return [q,q*q/10-12];}),color,1);
    if(i===1){c.strokeStyle=color;c.beginPath();c.ellipse(0,0,19,9,-.4,0,tau);c.stroke();dot(c,0,0,2,color);}
    if(i===2){for(let s=0;s<2;s++)line(c,Array.from({length:41},(_,j)=>[Math.sin(j/40*tau+s*Math.PI)*9,(j/40-.5)*34]),color,1);}
    if(i===3){line(c,[[-16,-10],[-3,-6],[0,-2],[3,-6],[16,-10],[16,9],[3,13],[0,16],[-3,13],[-16,9],[-16,-10]],color,1);line(c,[[0,-2],[0,16]],color,1);}
    if(i===4)line(c,Array.from({length:41},(_,j)=>[(j/40-.5)*34,Math.sin(j/40*tau*1.5)*8]),color,1);
    if(i===5){line(c,[[-6,-10],[-16,0],[-6,10]],color,1);line(c,[[6,-10],[16,0],[6,10]],color,1);}
    c.restore();text(c,zh,x,y+49,19,'#b6c0b8','Noto Sans SC Variable','center');text(c,en,x,y+74,14,'#819a97','Space Grotesk','center');c.restore();});
  c.globalAlpha=p*leave;text(c,'THE ATLAS',960,530,108,'#eee9db','Cormorant Garamond','center');text(c,'OF KNOWLEDGE',960,635,91,'#eee9db','Cormorant Garamond','center');text(c,'知识宇宙图鉴',960,705,32,'#b7c9bf','Noto Sans SC Variable','center');c.restore();
}
function uncertainty(c,t){
  const cx=1290,cy=615,r=190;
  for(let i=0;i<32;i++){const a=i/32*tau,p=1-ease(t,1+(i%7)*.35,3+(i%7)*.35);c.save();c.globalAlpha=.15+.55*p;dot(c,cx+Math.cos(a)*r,cy+Math.sin(a)*r,2.5,'#8c9aab');if(i%4!==0)line(c,[[cx+Math.cos(a)*r,cy+Math.sin(a)*r],[cx+Math.cos(a+.15)*r,cy+Math.sin(a+.15)*r]],'#8c9aab',1,.3);c.restore();}
  c.save();c.globalAlpha=ease(t,1.5,3);text(c,'UNKNOWN',cx,577,42,'#a3afbd','Cormorant Garamond','center');text(c,'未知',cx,613,22,'#819a97','Noto Sans SC Variable','center');
  c.globalAlpha=ease(t,4.5,6);text(c,'UNCERTAIN',cx,686,39,'#a3afbd','Cormorant Garamond','center');text(c,'不确定',cx,722,22,'#819a97','Noto Sans SC Variable','center');c.restore();
}
function verify(c,t){
  const steps=[['查找来源','FIND SOURCES'],['交叉核对','COMPARE'],['保留疑问','KEEP ASKING']];
  steps.forEach(([zh,en],i)=>{const x=990+i*278,p=ease(t,.75+i*2.25,2.25+i*2.25);c.save();c.globalAlpha=p;if(i<2)line(c,[[x+35,565],[x+243,565]],'#8fa5aa',1,.4);ring(c,x,565,28,'#b7c9bf',1.3);
    if(i===0){line(c,[[x-12,575],[x-12,552],[x+9,552],[x+14,557],[x+14,575],[x-12,575]],'#b7c9bf',1);}
    if(i===1){ring(c,x-3,561,10,'#b7c9bf');line(c,[[x+4,568],[x+15,579]],'#b7c9bf');}
    if(i===2)text(c,'?',x,577,34,'#b7c9bf','Cormorant Garamond','center');
    text(c,zh,x,643,24,'#b7c9bf','Noto Sans SC Variable','center');text(c,en,x,678,15,'#819a97','Space Grotesk','center');c.restore();
  });
  const move=ease(t,9,12),x=mix(1546,960,move),y=mix(565,570,move);c.save();c.globalAlpha=ease(t,7.5,9);dot(c,x,y,mix(4,3.4,move));c.restore();
}
function discover(c,t){
  const p=ease(t,.5,1.5),typed=ease(t,1.5,5.25),english='What would you like to discover?',chinese='接下来，你想探索什么？';c.save();c.globalAlpha=p*(1-ease(t,8,9));
  const count=Math.floor(english.length*typed),row1='What would you',row2='like to discover?';
  text(c,row1.slice(0,Math.min(row1.length,count)),252,455,108,'#eee9db','Cormorant Garamond');
  text(c,row2.slice(0,Math.max(0,count-row1.length-1)),252,575,108,'#eee9db','Cormorant Garamond');
  text(c,chinese.slice(0,Math.floor(chinese.length*typed)),258,687,35,'#c7d2ca');
  const onSecond=count>row1.length,visible=onSecond?row2.slice(0,Math.max(0,count-row1.length-1)):row1.slice(0,count);
  c.font='400 108px "Cormorant Garamond"';const caretX=252+c.measureText(visible).width+12,baseline=onSecond?575:455;
  c.globalAlpha*=.55+.45*Math.cos(t*tau*.65)**2;line(c,[[caretX,baseline-76],[caretX,baseline+5]],'#d9d5b9',2);
  c.restore();
  const close=ease(t,8.25,9.25)*(1-ease(t,10.75,12));c.save();c.globalAlpha=close;
  text(c,'THE ATLAS OF KNOWLEDGE',960,440,68,'#eee9db','Cormorant Garamond','center');text(c,'知识宇宙图鉴',960,499,29,'#b7c9bf','Noto Sans SC Variable','center');
  text(c,'非官方原创数字艺术 / AN INDEPENDENT DIGITAL ART FILM',960,567,17,'#819a97','Noto Sans SC Variable','center');
  text(c,'原创程序绘制 · 概念示意 / ORIGINAL PROCEDURAL ART · CONCEPTUAL ILLUSTRATIONS',960,608,16,'#819a97','Noto Sans SC Variable','center');
  text(c,'Music: “Aphelion” — Scott Buckley',960,689,31,'#c7d2ca','Cormorant Garamond','center');text(c,'CC BY 4.0 · scottbuckley.com.au',960,726,19,'#819a97','Space Grotesk','center');c.restore();
  // Fade the complete frame, including the running credit, to a quiet final black.
  if(t>10.75){c.save();c.globalAlpha=ease(t,10.75,12);c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);c.restore();}
}
const painters=[cell,tree,book,globe,rhythm,codeArt,connections,atlas,uncertainty,verify,discover];
export function renderScene(canvas,index,time){const s=sequence[index],t=Math.max(0,Math.min(s.end-s.start,time)),c=canvas.getContext('2d');c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);background(c,s);heading(c,s,t);painters[index](c,t);c.restore();}
