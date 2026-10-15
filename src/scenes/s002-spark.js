import { renderFrame as renderOpening, question } from './s001-boot.js';
export const duration = 6;
export const version = 'v001';
const clamp = x => Math.max(0,Math.min(1,x));
const ease = (t,a,b) => {const x=clamp((t-a)/(b-a));return x*x*(3-2*x);};
const hash = n => {const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};

export function renderFrame(canvas,seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  // The first 0.4s is pixel-identical to the approved S001 final frame.
  if(t<=.4){renderOpening(canvas,8);return;}
  const c=canvas.getContext('2d');
  c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);
  const light=c.createRadialGradient(1370,590,60,1370,590,1150);
  light.addColorStop(0,'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);c.globalAlpha=1;
  c.save();c.translate(1630,640);c.rotate(-.28+(8+t-.4)*.003);
  for(let i=0;i<3;i++){
    c.globalAlpha=(.10-i*.025)*(1-ease(t,.6,3));c.strokeStyle='#9dbab5';c.lineWidth=.9;
    c.beginPath();c.ellipse(0,0,330+i*84,485+i*94,0,-1.8,1.6);c.stroke();
  }
  c.restore();c.fillStyle='#d8e5dd';c.globalAlpha=.028;
  for(let i=0;i<500;i++)c.fillRect(hash(i+1)*1920,hash(i+1001)*1080,1,1);
  c.globalAlpha=1;
  c.textBaseline='alphabetic';
  // Carry the approved bilingual title and chapter typography across the cut.
  c.fillStyle='#b6c0b8';c.font='400 23px "Noto Sans SC Variable",sans-serif';c.fillText('知识宇宙图鉴',252,165);
  c.font='400 16px "Space Grotesk",sans-serif';c.fillStyle='#819a97';c.fillText('GPT / THE ATLAS OF KNOWLEDGE',252,201);
  c.textAlign='right';c.fillStyle='#bda982';c.font='400 18px "Space Grotesk",sans-serif';c.fillText('01',1668,165);
  c.font='400 16px "Noto Sans SC Variable",sans-serif';c.fillStyle='#819a97';c.fillText('唤醒 / BOOT',1668,201);c.textAlign='left';

  const core={x:1350,y:535};
  const lines=[{text:'What do you know',font:'400 119px "Cormorant Garamond",serif',x:252,y:468},
    {text:'about our world?',font:'400 119px "Cormorant Garamond",serif',x:252,y:596},
    {text:question,font:'400 37px "Noto Sans SC Variable",sans-serif',x:258,y:702}];
  let n=0;
  for(const line of lines){
    c.font=line.font;
    for(let i=0;i<line.text.length;i++,n++){
      const glyph=line.text[i];
      const startX=line.x+c.measureText(line.text.slice(0,i+1)).width-c.measureText(glyph).width;
      const delay=(1-hash(n+33))*.45;
      const p=ease(t,.4+delay,2.6+delay);
      const x=startX+(core.x-startX)*p;
      const y=line.y+(core.y-line.y)*p+Math.sin(p*Math.PI)*(hash(n+73)-.5)*95;
      c.save();c.translate(x,y);c.scale(1-.94*p,1-.94*p);c.globalAlpha=(1-ease(p,.55,.99));
      c.fillStyle=p>.65?'#c5c6a6':(n<32?'#eee9db':'#c7d2ca');c.fillText(glyph,0,0);c.restore();
    }
  }
  // The caret joins the same focus, rather than introducing another UI object.
  c.font='400 119px "Cormorant Garamond",serif';
  const caretX=252+c.measureText('about our world?').width+9;
  const p=ease(t,.4,2.5);
  c.save();c.globalAlpha=(.52+.22*Math.cos(8*2.4))*(1-ease(t,1.3,2.4));c.fillStyle='#d7d5bd';
  c.fillRect(caretX+(core.x-caretX)*p,515+(core.y-515)*p,2,75*(1-p));c.restore();

  c.save();c.globalAlpha=1-ease(t,.4,1.4);c.fillStyle='#6e8887';
  c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillText('始于好奇，通往未知。',258,908);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('From curiosity, into the unknown.',258,941);c.restore();

  const spark=ease(t,1.3,3.2), spread=ease(t,2.8,5.1);
  c.save();c.translate(core.x,core.y);
  const glow=c.createRadialGradient(0,0,0,0,0,96);
  glow.addColorStop(0,'rgba(225,220,177,.17)');glow.addColorStop(.15,'rgba(203,205,166,.065)');glow.addColorStop(1,'rgba(203,205,166,0)');
  c.globalAlpha=spark;c.fillStyle=glow;c.fillRect(-96,-96,192,192);
  for(let i=0;i<2;i++){
    c.save();c.rotate(-.45+i*.85+(t-3)*.045);c.globalAlpha=spread*(.35-i*.10);
    c.strokeStyle=i?'#78988e':'#b2b69c';c.lineWidth=.8;c.beginPath();c.ellipse(0,0,184*spread,(82+i*21)*spread,0,0,Math.PI*2);c.stroke();c.restore();
  }
  c.globalAlpha=spark;c.fillStyle='#e6e2c4';c.beginPath();c.arc(0,0,3.5+.25*Math.sin(t*1.8),0,Math.PI*2);c.fill();
  c.restore();
  c.save();c.globalAlpha=ease(t,3.3,4.9);c.fillStyle='#eee9db';
  c.font='400 108px "Cormorant Garamond",serif';c.fillText('The first spark.',252,505);
  c.font='400 37px "Noto Sans SC Variable",sans-serif';c.fillStyle='#c7d2ca';c.fillText('第一束光。',258,604);
  c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillStyle='#6e8887';c.fillText('一个问题，让连接开始。',258,908);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('One question. The beginning of connection.',258,941);
  c.restore();c.restore();
}
