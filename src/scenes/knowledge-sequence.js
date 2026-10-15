// All motion is evaluated from score time. No accumulated simulation state.
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p;
const tau=Math.PI*2;
export const sequence=[
  {id:'S005',start:36,end:48,title:'圆与波的同一个节奏',chapter:'MATHEMATICS',en:'A circle, unfolding.',zh:'圆的投影，成为波。',sub:'Rotation becomes a rhythm.',foot:'同一个角度，两种表达。',footEn:'One angle. Two expressions.'},
  {id:'S006',start:48,end:54,title:'重复之中，秩序生长',chapter:'MATHEMATICS',en:'Order, repeated.',zh:'同一个规则，不同的尺度。',sub:'The same rule, at every scale.',foot:'谢尔宾斯基三角形 · 递归构造',footEn:'Sierpiński triangle · a recursive construction'},
  {id:'S007',start:54,end:66,title:'波的相遇',chapter:'PHYSICS',en:'Waves,|in concert.',zh:'相遇，叠加，再成为新的形状。',sub:'Meet. Combine. Become.',foot:'线性叠加示意 · 蓝线与绿线之和为暖白曲线',footEn:'Linear superposition · the ivory curve is the sum'},
  {id:'S008',start:66,end:78,title:'轨道与尺度',chapter:'PHYSICS',en:'Across|the scales.',zh:'引力，让运动拥有轨迹。',sub:'Gravity gives motion a path.',foot:'开普勒椭圆轨道示意 · 中心天体位于共同焦点',footEn:'Keplerian orbits · the central body occupies a shared focus'},
  {id:'S009',start:78,end:90,title:'生命的双螺旋',chapter:'LIFE',en:'Life,|encoded.',zh:'结构之中，信息延续。',sub:'A structure that carries information.',foot:'DNA 双螺旋示意 · 碱基互补配对',footEn:'DNA double helix · complementary base pairing'}
];
function text(c,value,x,y,size=24,color='#a6beb6',font='Noto Sans SC Variable',align='left'){
  c.fillStyle=color;c.font=`400 ${size}px "${font}"`;c.textAlign=align;c.fillText(value,x,y);
}
function line(c,points,color='#8fd1e3',width=1.5,alpha=1){
  c.save();c.globalAlpha*=alpha;c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.restore();
}
function dot(c,x,y,r=4,color='#e6e2c4'){
  c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,tau);c.fill();
}
function backdrop(c,scene){
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);
  const light=c.createRadialGradient(1330,590,60,1330,590,1150);
  light.addColorStop(0,scene.chapter==='LIFE'?'#20382f':'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);c.globalAlpha=.028;c.fillStyle='#d8e5dd';
  for(let i=0;i<500;i++){const h=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};c.fillRect(Math.floor(h(i+1)*1920),Math.floor(h(i+1001)*1080),1,1);}c.globalAlpha=1;
  text(c,'知识宇宙图鉴',252,165,23,'#b6c0b8');text(c,'GPT / THE ATLAS OF KNOWLEDGE',252,201,16,'#819a97','Space Grotesk');
  const chapter={MATHEMATICS:['02','数学'],PHYSICS:['03','物理'],LIFE:['04','生命']}[scene.chapter];
  text(c,chapter[0],1668,165,18,'#8ebfce','Space Grotesk','right');text(c,`${chapter[1]} / ${scene.chapter}`,1668,201,16,'#819a97','Noto Sans SC Variable','right');
  text(c,scene.foot,258,930,17,'#6e8887');text(c,scene.footEn,258,961,20,'#819a97','Cormorant Garamond');
  text(c,'配乐 / Music: Aphelion — Scott Buckley · CC BY 4.0 · scottbuckley.com.au',252,1020,14,'#7e918b');
}
function heading(c,scene,t){
  c.save();c.globalAlpha=ease(t,.4,1.5);
  const lines=scene.en.split('|'),wide=lines.length===1;
  lines.forEach((s,i)=>text(c,s,252,wide?285:440+i*105,wide?86:100,'#eee9db','Cormorant Garamond'));
  const y=wide?333:627;text(c,scene.zh,258,y,wide?28:25);text(c,scene.sub,258,y+37,25,'#819a97','Cormorant Garamond');c.restore();
}
export function circlePoint(theta){return {x:Math.cos(theta),y:Math.sin(theta)};}
function circle(c,t){
  const p=ease(t,.5,2.25),theta=mix(-Math.PI/2,Math.PI*3.5,ease(t,2.25,10.4833333333)),r=180,cx=625,cy=620;
  c.save();c.globalAlpha=p;
  line(c,[[350,cy],[1668,cy]],'#6d949f',1,.4);line(c,[[cx,390],[cx,850]],'#6d949f',1,.4);
  c.strokeStyle='#8fd1e3';c.lineWidth=1.5;c.beginPath();c.arc(cx,cy,r,0,tau);c.stroke();
  const q=circlePoint(theta),px=cx+q.x*r,py=cy-q.y*r;
  line(c,[[cx,cy],[px,py]],'#e6e2c4',1.5);dot(c,cx,cy,2.5);dot(c,px,py,5);
  // A fixed sine curve and a synchronised ordinate make the projection explicit.
  const x0=1000,w=650,phase=-Math.PI/2,range=tau*2;
  const progress=clamp((theta-phase)/range),wx=x0+w*progress;
  line(c,Array.from({length:401},(_,i)=>{const k=i/400;return [x0+w*k,cy-r*Math.sin(phase+range*k)];}),'#8fd1e3',2,.3);
  line(c,Array.from({length:321},(_,i)=>{const k=progress*i/320;return [x0+w*k,cy-r*Math.sin(phase+range*k)];}),'#8fd1e3',2);
  c.setLineDash([3,8]);line(c,[[px,py],[wx,py]],'#b9cdb7',1,.6);c.setLineDash([]);dot(c,wx,py,4.5);
  text(c,'θ',cx+q.x*r*.48+12,cy-q.y*r*.48-12,30,'#e6e2c4','Cormorant Garamond');
  text(c,'x = cos θ',1668,284,37,'#c6d9d4','Cormorant Garamond','right');text(c,'y = sin θ',1668,329,37,'#c6d9d4','Cormorant Garamond','right');
  text(c,'旋转 / ROTATION',cx,870,17,'#819a97','Noto Sans SC Variable','center');text(c,'投影 / PROJECTION',1325,870,17,'#819a97','Noto Sans SC Variable','center');c.restore();
}
export function sierpinski(depth,a=[1180,375],b=[790,850],d=[1570,850]){
  if(depth===0)return [[a,b,d]];
  const mid=(u,v)=>[(u[0]+v[0])/2,(u[1]+v[1])/2],ab=mid(a,b),ad=mid(a,d),bd=mid(b,d);
  return [...sierpinski(depth-1,a,ab,ad),...sierpinski(depth-1,ab,b,bd),...sierpinski(depth-1,ad,bd,d)];
}
function fractal(c,t){
  // Crossfade successive exact constructions; the number of triangles is 3^n.
  const level=clamp((t-.7333333333)/3.75)*5,lo=Math.floor(level),f=level-lo;
  for(const [n,alpha] of [[lo,1-f],[Math.min(5,lo+1),f]]){
    c.save();c.globalAlpha=alpha*.72;
    for(const tri of sierpinski(n)){
      c.fillStyle='#8fd1e3';c.globalAlpha=alpha*.035;c.beginPath();tri.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
      c.globalAlpha=alpha*.8;line(c,[...tri,tri[0]],'#8fd1e3',n>3?.8:1.25);
    }c.restore();
  }
  text(c,`n = ${Math.min(5,Math.round(level))}`,1668,300,46,'#c6d9d4','Cormorant Garamond','right');
  text(c,'Nₙ = 3ⁿ',1668,352,37,'#819a97','Cormorant Garamond','right');
}
export function waveValues(x,t){const a=Math.sin(x-t),b=.65*Math.sin(1.5*x+t*.6);return [a,b,a+b];}
function waves(c,t){
  const enter=ease(t,.4,2.2333333333),shift=t*.8;
  const colors=['#8fd1e3','#a6c6aa','#eee9db'],rows=[425,590,790],amp=[48,48,48];
  c.save();c.globalAlpha=enter;
  for(let j=0;j<3;j++){
    line(c,[[875,rows[j]],[1668,rows[j]]],'#6d949f',1,.35);
    line(c,Array.from({length:401},(_,i)=>{const k=i/400;return [875+793*k,rows[j]-amp[j]*waveValues(k*tau*1.5,shift)[j]];}),colors[j],j===2?2.5:1.5);
    text(c,['y₁','y₂','y₁ + y₂'][j],875,rows[j]-80,30,colors[j],'Cormorant Garamond');
  }
  text(c,'y = y₁ + y₂',1668,289,42,'#c6d9d4','Cormorant Garamond','right');c.restore();
}
export function orbitPoint(meanAnomaly,a=480,e=.35){
  let E=meanAnomaly;for(let i=0;i<8;i++)E-=(E-e*Math.sin(E)-meanAnomaly)/(1-e*Math.cos(E));
  return {x:a*(Math.cos(E)-e),y:a*Math.sqrt(1-e*e)*Math.sin(E),E};
}
function orbits(c,t){
  const appear=ease(t,.5,2.25),cx=1330,cy=615;
  c.save();c.globalAlpha=appear;
  const halo=c.createRadialGradient(cx,cy,0,cx,cy,105);halo.addColorStop(0,'rgba(228,218,173,.22)');halo.addColorStop(1,'rgba(228,218,173,0)');c.fillStyle=halo;c.fillRect(cx-105,cy-105,210,210);dot(c,cx,cy,8);
  const config=[{a:405,e:.32,angle:-.16,period:10,color:'#8fd1e3'},{a:275,e:.24,angle:.28,period:10*Math.pow(275/405,1.5),color:'#a6c6aa'}];
  for(const o of config){
    const project=p=>[cx+p.x*Math.cos(o.angle)-p.y*.64*Math.sin(o.angle),cy+p.x*Math.sin(o.angle)+p.y*.64*Math.cos(o.angle)];
    const pts=Array.from({length:361},(_,i)=>project(orbitPoint(i/360*tau,o.a,o.e)));
    line(c,pts,o.color,1.2,.52);const m=(t-1.5)/o.period*tau;
    line(c,Array.from({length:70},(_,i)=>project(orbitPoint(m-.7+.7*i/69,o.a,o.e))),o.color,2.2);
    const [x,y]=project(orbitPoint(m,o.a,o.e));dot(c,x,y,5,o.color);
  }
  text(c,'T² ∝ a³',1668,289,48,'#c6d9d4','Cormorant Garamond','right');
  text(c,'共同中心质量 / SAME CENTRAL MASS',1668,328,16,'#819a97','Noto Sans SC Variable','right');c.restore();
}
export const complement={A:'T',T:'A',G:'C',C:'G'};
function dna(c,t){
  const turn=t*.35,progress=ease(t,.5,6.7333333333),x0=880,w=740,cy=615,r=142;
  const pos=(u,strand)=>{const p=u*tau*2+turn+strand*Math.PI;return {x:x0+w*u,y:cy+Math.sin(p)*r,z:Math.cos(p)};};
  // Parallel, antiparallel-labelled backbones and paired bases are a stylised structure, not an atom model.
  const sequence='ATGCCGTAACGTATGCCGTAACGT';
  for(const front of [false,true]){
    for(let i=0;i<24;i++){
      const u=i/23;if(u>progress)continue;const a=pos(u,0),b=pos(u,1);
      if((a.z>0)!==front)continue;
      line(c,[[a.x,a.y],[b.x,b.y]],'#a6c6aa',1,.26);
      if(Math.abs(a.y-b.y)<80)continue;
      const y1=mix(a.y,b.y,.32),y2=mix(a.y,b.y,.68);
      text(c,sequence[i],a.x-4,y1,17,'#c9d9b7','Space Grotesk','center');text(c,complement[sequence[i]],a.x+5,y2,17,'#8fd1e3','Space Grotesk','center');
    }
    for(let strand=0;strand<2;strand++){
      let segment=[];
      const flush=()=>{if(segment.length>1)line(c,segment,strand?'#8fd1e3':'#a6c6aa',front?2.5:1.5,front?.95:.35);segment=[];};
      for(let i=0;i<=500;i++){const u=progress*i/500,p=pos(u,strand);if((p.z>0)===front)segment.push([p.x,p.y]);else flush();}flush();
    }
  }
  c.save();c.globalAlpha=ease(t,6.7333333333,8.2333333333);text(c,'A · T    G · C',1668,288,40,'#c6d9d4','Cormorant Garamond','right');
  text(c,'5′ → 3′',870,850,22,'#a6c6aa','Space Grotesk');text(c,'3′ ← 5′',1620,850,22,'#8fd1e3','Space Grotesk','right');c.restore();
}
const painters=[circle,fractal,waves,orbits,dna];
export function renderScene(canvas,index,time){
  const scene=sequence[index],t=Math.max(0,Math.min(scene.end-scene.start,time)),c=canvas.getContext('2d');
  c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);backdrop(c,scene);heading(c,scene,t);painters[index](c,t);c.restore();
}
