export const duration = 8;
export const version = 'v002';
export const question = '你对我们的世界了解多少？';
const clamp = v => Math.min(1, Math.max(0, v));
const ease = (t,a,b) => { const x=clamp((t-a)/(b-a)); return x*x*(3-2*x); };
const hash = n => { const x=Math.sin(n*127.1+311.7)*43758.5453; return x-Math.floor(x); };

export function renderFrame(canvas, seconds) {
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  const c=canvas.getContext('2d');
  c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
  c.fillStyle='#0b1218';c.fillRect(0,0,1920,1080);
  const light=c.createRadialGradient(1370,590,60,1370,590,1150);
  light.addColorStop(0,'#203339');light.addColorStop(.5,'#142328');light.addColorStop(1,'#0b1218');
  c.globalAlpha=.65;c.fillStyle=light;c.fillRect(0,0,1920,1080);c.globalAlpha=1;
  // A restrained orbital gesture suggests the world beyond the question.
  const atmosphere=ease(t,1.7,7.5);
  c.save();c.translate(1630,640);c.rotate(-.28+t*.003);
  for(let i=0;i<3;i++){
    c.globalAlpha=atmosphere*(.10-i*.025);c.strokeStyle='#9dbab5';c.lineWidth=.9;
    c.beginPath();c.ellipse(0,0,330+i*84,485+i*94,0,-1.8,1.6);c.stroke();
  }
  c.restore();
  c.fillStyle='#d8e5dd';c.globalAlpha=.028;
  for(let i=0;i<500;i++)c.fillRect(hash(i+1)*1920,hash(i+1001)*1080,1,1);
  c.globalAlpha=1;
  const reveal=ease(t,1.4,3.1), copy=ease(t,3.0,6.2);
  c.save();c.translate(0,-8*ease(t,3,8));
  c.globalAlpha=ease(t,1.8,3.5);c.textBaseline='alphabetic';
  c.fillStyle='#b6c0b8';c.font='400 23px "Noto Sans SC Variable",sans-serif';
  c.fillText('知识宇宙图鉴',252,173);
  c.font='400 16px "Space Grotesk",sans-serif';c.fillStyle='#819a97';
  c.fillText('GPT / THE ATLAS OF KNOWLEDGE',252,209);
  c.textAlign='right';c.fillStyle='#bda982';c.font='400 18px "Space Grotesk",sans-serif';
  c.fillText('01',1668,173);
  c.font='400 16px "Noto Sans SC Variable",sans-serif';c.fillStyle='#819a97';c.fillText('唤醒 / BOOT',1668,209);
  c.textAlign='left';c.globalAlpha=1;
  const lines=['What do you know','about our world?'];
  const total=lines.join('').length;
  const typed=Math.floor(copy*total);
  const first=lines[0].slice(0,typed);
  const second=lines[1].slice(0,Math.max(0,typed-lines[0].length));
  const x=252;
  c.font='400 119px "Cormorant Garamond",serif';c.fillStyle='#eee9db';
  c.fillText(first,x,476);c.fillText(second,x,604);
  const secondLine=typed>lines[0].length;
  const targetX=x+c.measureText(secondLine?second:first).width+9;
  const cursorX=960+(targetX-960)*reveal;
  const cursorY=520+((secondLine?523:395)-520)*reveal;
  c.save();c.globalAlpha=(.50+.50*ease(t,0,.65))*(typed>0&&typed<total?.85:.52+.22*Math.cos(t*2.4));
  c.fillStyle='#d7d5bd';c.fillRect(cursorX,cursorY,2,75);c.restore();
  c.globalAlpha=ease(t,3.1,4.0);c.font='400 37px "Noto Sans SC Variable",sans-serif';c.fillStyle='#c7d2ca';
  c.fillText(question.slice(0,Math.floor(copy*question.length)),258,710);
  c.globalAlpha=ease(t,6.1,7.3);c.fillStyle='#6e8887';
  c.font='400 17px "Noto Sans SC Variable",sans-serif';c.fillText('始于好奇，通往未知。',258,916);
  c.font='400 19px "Cormorant Garamond",serif';c.fillText('From curiosity, into the unknown.',258,949);
  c.restore();c.restore();
}
