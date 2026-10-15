import { selectShot } from './shots.js';
const canvas=document.querySelector('#view');
const qs=new URLSearchParams(location.search);
const shot=selectShot(qs.get('shot')||'S002');
const {renderFrame,duration}=shot;
document.title=`${shot.id} ${shot.title} · GPT 知识宇宙图鉴`;
document.querySelector('.review-status').innerHTML=`<i></i>${shot.id} · ${shot.status}`;
document.querySelector('.intro .eyebrow').textContent=shot.chapter;
document.querySelector('h1').textContent=shot.title;
document.querySelector('.version').innerHTML=`${shot.id} / ${shot.version}<br>${shot.duration.toFixed(1)} 秒 · 无配乐 / Silent`;
document.querySelector('.notes p:not(.eyebrow)').textContent=shot.note;
document.querySelector('.notes div:last-child p:last-child').textContent=shot.id==='S002'?'0–0.4s 衔接 · 0.4–3.2s 汇聚 · 3.2–5s 光点 · 5–6s 停留':'0–1.4s 光标 · 1.4–3.1s 标题 · 3–6.2s 双语输入 · 6.2–8s 停留';
if(qs.get('mode')==='export') {
  document.body.classList.add('export');
  canvas.width=Number(qs.get('w'))||1920;canvas.height=Number(qs.get('h'))||1080;
}
await Promise.all([
  document.fonts.load('400 37px "Noto Sans SC Variable"','你对我们的世界了解多少？知识宇宙图鉴唤醒始于好奇通往未知第一束光一个问题让连接开始'),
  document.fonts.load('400 22px "Space Grotesk"'),
  document.fonts.load('400 119px "Cormorant Garamond"')
]);
await document.fonts.ready;
let t=Math.max(0,Math.min(duration,Number(qs.get('t'))||0)), playing=false, started=0, origin=0;
const seek=document.querySelector('#seek'),play=document.querySelector('#play');
seek.max=duration;
const clock=v=>`00:${v.toFixed(2).padStart(5,'0')}`;
function draw(seconds){
  t=Math.max(0,Math.min(duration,seconds));renderFrame(canvas,t);
  seek.value=t;document.querySelector('#clock').value=`${clock(t)} / ${clock(duration)}`;
}
function stop(){playing=false;play.textContent='播放';}
function start(){if(t>=duration)draw(0);origin=t;started=performance.now();playing=true;play.textContent='暂停';}
function toggle(){playing?stop():start();}
play.onclick=toggle;
document.querySelector('#restart').onclick=()=>{draw(0);start();};
seek.oninput=()=>{stop();draw(Number(seek.value));};
document.querySelector('#fullscreen').onclick=()=>canvas.requestFullscreen();
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement)return;
  if(e.code==='Space'){e.preventDefault();toggle();}
  if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();stop();draw(t+(e.code==='ArrowRight'?.25:-.25));}
});
window.__atlas={ready:true,duration,renderFrame:draw,getTime:()=>t};
draw(t);
function tick(now){if(playing){draw(origin+(now-started)/1000);if(t>=duration)stop();}requestAnimationFrame(tick);}
requestAnimationFrame(tick);
