import {renderFrame as renderBoot} from '../boot-score.js';
import timing from '../../data/s004.json' with {type:'json'};
export const duration=timing.duration;
export const version=timing.version;
export const audioPath=timing.audioPath;
export const audioStart=timing.audioStart;
export const fadeInSeconds=timing.fadeInSeconds;
export const fadeOutSeconds=timing.fadeOutSeconds;
export const cues=timing.cues;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=(t,a,b)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
const mix=(a,b,p)=>a+(b-a)*p;
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export function curveValue(kind,x){return kind==='line'?x/2:kind==='parabola'?x*x/3:Math.sin(x);}

export function renderFrame(canvas,seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  if(t<=.4){renderBoot(canvas,24);return;}
  const c=canvas.getContext('2d');c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);
  const light=c.createRadialGradient(1370,590,60,1370,590,1150);
  light.addColorStop(0,'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);
  c.fillStyle='#d8e5dd';c.globalAlpha=.028;
  for(let i=0;i<500;i++)c.fillRect(Math.floor(hash(i+1)*1920),Math.floor(hash(i+1001)*1080),1,1);
  c.globalAlpha=1;c.textBaseline='alphabetic';
  c.fillStyle='#b6c0b8';c.font='400 23px "Noto Sans SC Variable",sans-serif';c.fillText('知识宇宙图鉴',252,165);
  c.fillStyle='#819a97';c.font='400 16px "Space Grotesk",sans-serif';c.fillText('GPT / THE ATLAS OF KNOWLEDGE',252,201);
  c.save();c.textAlign='right';c.fillStyle='#8ebfce';c.font='400 18px "Space Grotesk",sans-serif';c.fillText('02',1668,165);
  c.fillStyle='#819a97';c.font='400 16px "Noto Sans SC Variable",sans-serif';c.fillText('数学 / MATHEMATICS',1668,201);c.restore();

  c.save();c.globalAlpha=1-ease(t,.4,1.4833333333);c.fillStyle='#eee9db';c.font='400 108px "Cormorant Garamond",serif';
  c.fillText('A point of',252,476);c.fillText('departure.',252,596);
  c.fillStyle='#c7d2ca';c.font='400 37px "Noto Sans SC Variable",sans-serif';c.fillText('从一个原点出发。',258,710);
  c.fillStyle='#6e8887';c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillText('让每一种关系，找到位置。',258,908);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('A place for every relation.',258,941);c.restore();

  const move=ease(t,.4,2.2333333333),cx=mix(1300,960,move),unit=mix(100,130,move),halfW=mix(360,660,move),halfH=mix(250,275,move);
  c.save();c.translate(cx,580);c.lineWidth=1;c.strokeStyle='#61c8f2';c.globalAlpha=.62;
  c.beginPath();c.moveTo(-halfW,0);c.lineTo(halfW,0);c.moveTo(0,-halfH);c.lineTo(0,halfH);c.stroke();
  c.fillStyle='#8eacb8';c.font='400 19px "Space Grotesk",sans-serif';
  for(let n=-4;n<=4;n++){
    if(!n)continue;
    const alpha=Math.abs(n)>3?ease(t,1.5,2.2333333333):1;
    c.globalAlpha=.78*alpha;c.textAlign='center';c.beginPath();c.moveTo(n*unit,-4);c.lineTo(n*unit,4);c.stroke();c.fillText(String(n),n*unit,31);
    if(Math.abs(n)<=2){c.globalAlpha=.78;c.textAlign='right';c.beginPath();c.moveTo(-4,-n*unit);c.lineTo(4,-n*unit);c.stroke();c.fillText(String(n),-16,-n*unit+6);}
  }
  c.globalAlpha=.78;c.textAlign='left';c.fillText('0',15,31);c.font='400 32px "Cormorant Garamond",serif';c.fillStyle='#b3d1d8';c.fillText('x',halfW+18,9);c.fillText('y',-8,-halfH-20);

  const phases=[
    {kind:'line',extent:3.8,progress:ease(t,1.4833333333,2.9833333333),alpha:1-ease(t,3.75,4.5),color:'#bfcdbd'},
    {kind:'parabola',extent:2.5,progress:ease(t,3.75,5.9833333333),alpha:ease(t,3.75,4.5)*(1-ease(t,6.7333333333,7.4833333333)),color:'#b8ceba'},
    {kind:'sine',extent:4.8,progress:ease(t,6.7333333333,8.9833333333),alpha:ease(t,6.7333333333,7.4833333333),color:'#8fd1e3'}
  ];
  for(const p of phases){
    if(p.progress===0||p.alpha===0)continue;
    const extent=p.extent*p.progress;c.globalAlpha=.95*p.alpha;c.strokeStyle=p.color;c.lineWidth=2;
    c.beginPath();for(let i=0;i<=320;i++){const x=-extent+2*extent*i/320,y=curveValue(p.kind,x);i?c.lineTo(x*unit,-y*unit):c.moveTo(x*unit,-y*unit);}c.stroke();
    const tracing=p.kind==='sine'&&t>8.9833333333;
    const markers=tracing?[mix(-4.8,4.8,ease(t,8.9833333333,11.2333333333))]:[-extent,extent];
    c.fillStyle='#e6e2c4';for(const x of markers){c.beginPath();c.arc(x*unit,-curveValue(p.kind,x)*unit,3.5,0,Math.PI*2);c.fill();}
  }
  const glow=c.createRadialGradient(0,0,0,0,0,96);
  glow.addColorStop(0,'rgba(225,220,177,.17)');glow.addColorStop(.15,'rgba(203,205,166,.065)');glow.addColorStop(1,'rgba(203,205,166,0)');
  c.globalAlpha=1-ease(t,.4,2.2333333333);c.fillStyle=glow;c.fillRect(-96,-96,192,192);
  c.globalAlpha=1;c.fillStyle=move<1?'#e6e2c4':'#b3d1d8';c.beginPath();c.arc(0,0,mix(3.4,2.6,move),0,Math.PI*2);c.fill();c.restore();

  c.save();c.globalAlpha=ease(t,.9,2.2333333333);c.fillStyle='#eee9db';c.font='400 86px "Cormorant Garamond",serif';c.fillText('Mathematics',252,285);
  c.fillStyle='#a6beb6';c.font='400 28px "Noto Sans SC Variable",sans-serif';c.fillText('一个规则，一条曲线。',258,333);
  c.fillStyle='#819a97';c.font='400 24px "Cormorant Garamond",serif';c.fillText('One rule, one curve.',258,370);c.restore();
  const stage=t<3.75?0:t<6.7333333333?1:2;
  const formulaAlpha=stage===0?ease(t,1.4833333333,2.2333333333)*(1-ease(t,3,3.75)):stage===1?ease(t,3.75,4.5)*(1-ease(t,6,6.7333333333)):ease(t,6.7333333333,7.4833333333);
  c.save();c.globalAlpha=formulaAlpha;c.textAlign='right';c.fillStyle='#c6d9d4';c.font='400 58px "Cormorant Garamond",serif';c.fillText(['y = x / 2','y = x² / 3','y = sin(x)'][stage],1668,300);c.restore();
  c.save();c.globalAlpha=ease(t,2.2333333333,2.9833333333);c.fillStyle='#6e8887';c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillText('同一坐标，不同规律。',258,930);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('One plane. Different rules.',258,961);c.restore();
  c.fillStyle='#7e918b';c.font='400 14px "Noto Sans SC Variable",sans-serif';c.fillText('配乐 / Music: Aphelion — Scott Buckley · CC BY 4.0 · scottbuckley.com.au',252,1020);
  c.restore();
}
