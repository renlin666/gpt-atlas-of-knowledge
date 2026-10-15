import { renderFrame as renderSpark } from './s002-spark.js';
export const duration=6;
export const version='v001';
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p;
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};

export function renderFrame(canvas,seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  if(t<=.4){renderSpark(canvas,6);return;}
  const c=canvas.getContext('2d');
  c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);
  const light=c.createRadialGradient(1370,590,60,1370,590,1150);
  light.addColorStop(0,'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);
  c.fillStyle='#d8e5dd';c.globalAlpha=.028;
  for(let i=0;i<500;i++)c.fillRect(Math.floor(hash(i+1)*1920),Math.floor(hash(i+1001)*1080),1,1);
  c.globalAlpha=1;c.textBaseline='alphabetic';
  c.fillStyle='#b6c0b8';c.font='400 23px "Noto Sans SC Variable",sans-serif';c.fillText('知识宇宙图鉴',252,165);
  c.font='400 16px "Space Grotesk",sans-serif';c.fillStyle='#819a97';c.fillText('GPT / THE ATLAS OF KNOWLEDGE',252,201);
  const handoff=ease(t,4.7,5.8);
  c.save();c.textAlign='right';
  for(const [alpha,number,label,color] of [[1-handoff,'01','唤醒 / BOOT','#bda982'],[handoff,'02','数学 / MATHEMATICS','#8ebfce']]){
    c.globalAlpha=alpha;c.fillStyle=color;c.font='400 18px "Space Grotesk",sans-serif';c.fillText(number,1668,165);
    c.font='400 16px "Noto Sans SC Variable",sans-serif';c.fillStyle='#819a97';c.fillText(label,1668,201);
  }
  c.restore();

  // Carry the previous bilingual composition before releasing it into the new scene.
  c.save();c.globalAlpha=1-ease(t,.4,1.9);c.fillStyle='#eee9db';
  c.font='400 108px "Cormorant Garamond",serif';c.fillText('The first spark.',252,505);
  c.font='400 37px "Noto Sans SC Variable",sans-serif';c.fillStyle='#c7d2ca';c.fillText('第一束光。',258,604);
  c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillStyle='#6e8887';c.fillText('一个问题，让连接开始。',258,908);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('One question. The beginning of connection.',258,941);c.restore();

  const motion=ease(t,.7,3.4),morph=ease(t,1.3,4.2);
  const origin={x:mix(1350,1300,motion),y:mix(535,580,motion)};
  c.save();c.translate(origin.x,origin.y);
  // Elliptical paths flatten into two perpendicular axes, preserving one focal point.
  for(let i=0;i<2;i++){
    c.save();c.rotate(mix(-.315+i*.85,i?-Math.PI/2:0,morph));
    c.globalAlpha=(.35-i*.10)*(1-ease(morph,.72,1));c.strokeStyle=i?'#78988e':'#b2b69c';c.lineWidth=.8;
    c.beginPath();c.ellipse(0,0,mix(184,i?250:360,morph),mix(82+i*21,.1,morph),0,0,Math.PI*2);c.stroke();c.restore();
  }
  const axes=ease(t,2.8,4.8),labels=ease(t,4,5.3),blue=ease(t,3.5,5.5);
  const color=`rgb(${mix(178,97,blue)},${mix(182,200,blue)},${mix(156,242,blue)})`;
  c.strokeStyle=color;c.lineWidth=1;c.globalAlpha=axes*.62;
  c.beginPath();c.moveTo(-360*axes,0);c.lineTo(360*axes,0);c.stroke();
  const vertical=ease(t,3.2,5.1);
  c.beginPath();c.moveTo(0,250*vertical);c.lineTo(0,-250*vertical);c.stroke();
  c.fillStyle='#8eacb8';c.font='400 19px "Space Grotesk",sans-serif';c.globalAlpha=labels*.78;
  for(let n=-3;n<=3;n++){
    if(!n)continue;
    c.beginPath();c.moveTo(n*100,-4);c.lineTo(n*100,4);c.stroke();
    c.textAlign='center';c.fillText(String(n),n*100,31);
    if(Math.abs(n)<=2){
      c.beginPath();c.moveTo(-4,-n*100);c.lineTo(4,-n*100);c.stroke();
      c.textAlign='right';c.fillText(String(n),-16,-n*100+6);
    }
  }
  c.textAlign='left';c.fillText('0',15,31);
  c.font='400 32px "Cormorant Garamond",serif';c.fillStyle='#b3d1d8';c.fillText('x',378,9);c.fillText('y',-8,-270);
  const glow=c.createRadialGradient(0,0,0,0,0,96);
  glow.addColorStop(0,'rgba(225,220,177,.17)');glow.addColorStop(.15,'rgba(203,205,166,.065)');glow.addColorStop(1,'rgba(203,205,166,0)');
  c.globalAlpha=1;c.fillStyle=glow;c.fillRect(-96,-96,192,192);
  c.fillStyle='#e6e2c4';c.beginPath();c.arc(0,0,mix(3.5+.25*Math.sin(6*1.8),3.4,motion),0,Math.PI*2);c.fill();
  c.restore();

  c.save();c.globalAlpha=ease(t,2.5,4.2);c.fillStyle='#eee9db';
  c.font='400 108px "Cormorant Garamond",serif';c.fillText('A point of',252,476);c.fillText('departure.',252,596);
  c.font='400 37px "Noto Sans SC Variable",sans-serif';c.fillStyle='#c7d2ca';c.fillText('从一个原点出发。',258,710);
  c.globalAlpha=ease(t,4.1,5.4);c.fillStyle='#6e8887';
  c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillText('让每一种关系，找到位置。',258,908);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('A place for every relation.',258,941);
  c.restore();c.restore();
}
