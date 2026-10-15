import { selectShot } from './shots.js';
import {fontSample} from './scenes/final-sequence.js';
import filmInfo from '../data/film.json' with {type:'json'};
const canvas=document.querySelector('#view');
canvas.getContext('2d',{willReadFrequently:true});
const qs=new URLSearchParams(location.search);
const shot=selectShot(qs.get('shot')||'FILM');
if(shot.id==='CUT90')canvas.getContext('2d',{willReadFrequently:true});
const {renderFrame,duration}=shot;
const withMusic=Boolean(shot.audioPath);
const isExport=qs.get('mode')==='export';
document.title=`${shot.id} ${shot.title} · GPT 知识宇宙图鉴`;
document.querySelector('.review-status').innerHTML=`<i></i>${shot.id} · ${shot.status}`;
document.querySelector('.intro .eyebrow').textContent=shot.chapter;
document.querySelector('h1').textContent=shot.title;
document.querySelector('.version').innerHTML=`${shot.id} / ${shot.version}<br>${shot.duration.toFixed(1)} 秒 · ${withMusic?'Aphelion / Scott Buckley':'无配乐 / Silent'}`;
document.querySelector('.notes p:not(.eyebrow)').textContent=shot.note;
document.querySelector('.notes div:last-child p:last-child').textContent={FILM:'0–24s 唤醒 · 24–54s 数学 · 54–78s 物理 · 78–114s 生命 · 114–138s 文明 · 138–156s 创造 · 156–177s 关联 · 177–198s 边界 · 198–210s 探索',CUT90:'0–24s 唤醒 · 24–54s 数学 · 54–78s 物理 · 78–90s 生命',S004:'0–0.4s 衔接 · 2.98s 直线 · 5.98s 抛物线 · 8.98s 正弦曲线 · 11.23s 追踪点停留',CUT04:'0–24s 已通过的前三幕 · 24–36s 第四镜（已通过）',BOOT:'9.73s 问题落定 · 15.73s 聚成核心 · 20.98s 横轴展开 · 23.23s 数学交接',S001:'0–1.4s 光标 · 1.4–3.1s 标题 · 3–6.2s 双语输入 · 6.2–8s 停留',S002:'0–0.4s 衔接 · 0.4–3.2s 汇聚 · 3.2–5s 光点 · 5–6s 停留',S003:'0–0.4s 衔接 · 0.4–3s 轨道变形 · 3–5s 坐标展开 · 5–6s 章节交接'}[shot.id];
if(qs.get('mode')==='export') {
  document.body.classList.add('export');
  canvas.width=Number(qs.get('w'))||1920;canvas.height=Number(qs.get('h'))||1080;
}
await Promise.all([
  document.fonts.load('400 37px "Noto Sans SC Variable"',fontSample+'。奏节圆的投影成为波旋转同一个角度两种表达重复之中秩序生长尺度谢尔宾斯基三角形递归构造物理相遇叠加再新的形状线性蓝与绿之和暖白曲线引力运动拥有轨迹开普勒椭圆轨道示意中心天体位于共同焦点质量生命结构信息延续双螺旋碱基互补配对你对我们的世界了解多少？知识宇宙图鉴唤醒始于好奇通往未知第一束光一个问题让连接开始数学从原点出发每种关系找到位置同一坐标不同规律一个规则一条曲线配乐 / Music: Aphelion — Scott Buckley · CC BY 4.0 · scottbuckley.com.au'),
  document.fonts.load('400 22px "Space Grotesk"'),
  document.fonts.load('400 119px "Cormorant Garamond"','Sierpiński θ y₁ y₂ Nₙ = 3ⁿ T² ∝ a³')
]);
await document.fonts.ready;
let t=Math.max(0,Math.min(duration,Number(qs.get('t'))||0)), playing=false, started=0, origin=0;
const seek=document.querySelector('#seek'),play=document.querySelector('#play');
const audio=document.querySelector('#sound'),volume=document.querySelector('#volume');
document.querySelector('.audio-level').hidden=!withMusic;
if(withMusic&&!isExport){
  audio.src=`/${shot.audioPath}`;audio.volume=Number(volume.value);audio.load();
  volume.oninput=()=>audio.volume=Number(volume.value);
  audio.onplay=()=>{playing=true;play.textContent='暂停';};
  audio.onpause=()=>{playing=false;play.textContent='播放';};
  audio.onended=()=>{playing=false;play.textContent='播放';draw(duration);};
  audio.onerror=()=>{play.disabled=true;document.querySelector('.notes p:not(.eyebrow)').textContent='配乐文件未就绪，请使用已导出的视频审看。';};
}
seek.max=duration;
const clock=v=>`${Math.floor(v/60).toString().padStart(2,'0')}:${(v%60).toFixed(2).padStart(5,'0')}`;
function draw(seconds){
  t=Math.max(0,Math.min(duration,seconds));renderFrame(canvas,t);
  seek.value=t;document.querySelector('#clock').value=`${clock(t)} / ${clock(duration)}`;
}
function stop(){if(withMusic&&!isExport){audio.pause();draw(Math.min(duration,audio.currentTime));}playing=false;play.textContent='播放';}
async function start(){
  if(t>=duration)setTime(0);
  if(withMusic&&!isExport){
    audio.currentTime=t;
    try{await audio.play();}catch{document.querySelector('.notes p:not(.eyebrow)').textContent='播放未能开始，请再次点击播放，或使用导出的视频。';}
  }else{origin=t;started=performance.now();playing=true;play.textContent='暂停';}
}
function setTime(value){stop();const next=Math.max(0,Math.min(duration,value));if(withMusic&&!isExport)audio.currentTime=next;draw(next);}
function toggle(){playing?stop():start();}
play.onclick=toggle;
document.querySelector('#restart').onclick=()=>{setTime(0);start();};
seek.oninput=()=>setTime(Number(seek.value));
document.querySelector('#fullscreen').onclick=()=>canvas.requestFullscreen();
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement)return;
  if(e.code==='Space'){e.preventDefault();toggle();}
  if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();setTime(t+(e.code==='ArrowRight'?.25:-.25));}
});
window.__atlas={ready:true,duration,renderFrame:draw,getTime:()=>t,shot:shot.id};
if(shot.id==='FILM'&&!isExport){
  const chapters=document.querySelector('#chapters');chapters.hidden=false;
  for(const chapter of filmInfo.chapters){const a=document.createElement('a');a.href=`/?shot=FILM&t=${chapter.start}`;a.textContent=`${clock(chapter.start).slice(0,5)} ${chapter.zh}`;a.onclick=e=>{e.preventDefault();setTime(chapter.start);};chapters.append(a);}
}
draw(t);
function tick(now){if(playing){draw(withMusic&&!isExport?audio.currentTime:origin+(now-started)/1000);if(t>=duration){stop();draw(duration);}}requestAnimationFrame(tick);}
requestAnimationFrame(tick);
