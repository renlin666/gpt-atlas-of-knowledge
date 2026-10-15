import { shots } from './shots.js';
const candidates=await fetch('/data/music-candidates.json').then(r=>r.json());
const canvas=document.querySelector('#music-view');
const state=document.querySelector('#music-state'),clock=document.querySelector('#music-clock');
const tracks=document.querySelector('#tracks');
await Promise.all([
  document.fonts.load('400 37px "Noto Sans SC Variable"','你对我们的世界了解多少？知识宇宙图鉴唤醒始于好奇通往未知第一束光一个问题让连接开始数学从原点出发每种关系找到位置'),
  document.fonts.load('400 22px "Space Grotesk"'),document.fonts.load('400 119px "Cormorant Garamond"')
]);
await document.fonts.ready;
let comparison=null;
const players=[];
function render(t){
  const shot=t<8?shots.S001:t<14?shots.S002:shots.S003;
  shot.renderFrame(canvas,Math.min(20,t)-shot.start);
  clock.value=`00:${Math.min(20,t).toFixed(1).padStart(4,'0')} / 00:20`;
}
for(const item of candidates){
  const row=document.createElement('article');row.className='track';row.dataset.id=item.id;
  const heading=document.createElement('div');heading.className='track-title';
  const id=document.createElement('span');id.className='track-id';id.textContent=item.id;
  const title=document.createElement('h2');title.textContent=item.title;
  heading.append(id,title);row.append(heading);
  for(const [className,text]of [['',item.character],['assessment',item.assessment]]){const p=document.createElement('p');p.className=className;p.textContent=text;row.append(p);}
  const audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';audio.src=item.audio;audio.setAttribute('aria-label',`${item.id} ${item.title} 试听`);players.push(audio);
  const actions=document.createElement('div');actions.className='track-actions';
  const compare=document.createElement('button');compare.className='secondary';compare.textContent='对照现有三幕';
  const link=document.createElement('a');link.href=item.source;link.target='_blank';link.rel='noreferrer';link.textContent='作者页面与授权';
  const message=document.createElement('p');message.className='assessment';message.textContent='Scott Buckley · CC BY 4.0 · 可拖动播放器试听全曲';
  audio.addEventListener('play',()=>{
    players.forEach(p=>{if(p!==audio)p.pause();});
    if(comparison?.audio!==audio)comparison=null;
    document.querySelectorAll('.track').forEach(r=>r.classList.remove('playing'));row.classList.add('playing');
    state.textContent=`正在试听 ${item.id} · ${item.title}`;
  });
  audio.addEventListener('error',()=>{message.className='music-error';message.textContent='音频连接未能加载，可打开作者页面试听。';});
  compare.onclick=async()=>{
    players.forEach(p=>p.pause());audio.currentTime=0;comparison={audio,item};render(0);
    try{await audio.play();state.textContent=`${item.id} · 原速画面对照 / 未卡点`;}catch{comparison=null;message.textContent='播放未成功，请使用原生播放器或作者页面。';}
  };
  actions.append(compare,link);row.append(audio,actions,message);tracks.append(row);
}
function tick(){
  if(comparison){
    render(comparison.audio.currentTime);
    if(comparison.audio.currentTime>=20){comparison.audio.pause();render(20);state.textContent='20 秒对照结束 · 可继续试听全曲';comparison=null;}
  }
  requestAnimationFrame(tick);
}
render(0);requestAnimationFrame(tick);
window.__musicReview={ready:true,candidateCount:candidates.length};
