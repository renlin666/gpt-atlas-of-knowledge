import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import {startServer} from './server.mjs';
import {launchBrowser} from './browser.mjs';
import {sequence,graph,branchSegments,spherePoint,lissajous,constellationPoint} from '../src/scenes/final-sequence.js';
import {duration,audioEdit} from '../src/film.js';
assert.equal(sequence[0].start,90);assert.equal(sequence.at(-1).end,210);assert.equal(duration,210);
assert.equal(audioEdit.mainEnd+audioEdit.tailDuration-audioEdit.crossfade,duration);
sequence.slice(1).forEach((s,i)=>assert.equal(s.start,sequence[i].end));
assert.equal(branchSegments(6).length,127);
for(const lat of [-1,0,.7])for(const lon of [-2,0,3]){const p=spherePoint(lat,lon,.3);assert(Math.abs(p.x*p.x+p.y*p.y+p.z*p.z-1)<1e-12);}
for(const phase of [0,1,3]){const a=lissajous(0,phase),b=lissajous(Math.PI*2,phase);assert(a.every((v,i)=>Math.abs(v-b[i])<1e-12));}
for(let i=0;i<96;i++){const p=constellationPoint(i,6);assert(p[0]>250&&p[0]<1670&&p[1]>220&&p[1]<930);}
for(const e of graph.edges){assert(graph.nodes[e.from]&&graph.nodes[e.to]);assert(e.verified&&e.source.startsWith('https://'));}
const digest=s=>createHash('sha256').update(s).digest('hex');
const stats=spawnSync(ffmpeg,['-hide_banner','-i','assets/audio/FILM-Aphelion-v001.m4a','-af','volumedetect','-f','null','-'],{encoding:'utf8',windowsHide:true});assert.equal(stats.status,0);
const peak=Number(/max_volume: ([\d.-]+) dB/.exec(stats.stderr)?.[1]);assert(peak<-.5&&peak>-3);assert(/Duration: 00:03:30\.00/.test(stats.stderr));
const analysis=JSON.parse(await readFile('data/film-audio-analysis.json','utf8'));
const cueTimes=[117,140.25,149.25,167.25];
const cueAlignment=cueTimes.map(time=>{const o=analysis.onsetCandidates.reduce((a,b)=>Math.abs(a.time-time)<Math.abs(b.time-time)?a:b);return {time,onset:o.time,error:Math.abs(time-o.time)};});assert(cueAlignment.every(c=>c.error<=1/120));
const {server,url}=await startServer(0);let browser;
try{
  browser=await launchBrowser();const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${url}/?mode=export&shot=FILM`);await page.waitForFunction(()=>window.__atlas?.ready);
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL().split(',')[1];},t);
  // Compare against archived approved CUT90 images, not just a re-render of the old module.
  const approved=JSON.parse(await readFile('review/CUT90/verification.json','utf8'));
  for(const [t,hash]of Object.entries(approved.hashes))assert.equal(digest(await capture(Number(t))),hash,`Approved CUT90 frame ${t}`);
  await mkdir('review/FILM',{recursive:true});const hashes={};
  for(const t of [96,110,122,134,143,152,161,171,183,194,204,207.8,210]){
    const a=await capture(t);await capture(210);await capture(5);assert.equal(digest(await capture(t)),digest(a),`Determinism ${t}`);
    hashes[t]=digest(a);await writeFile(`review/FILM/FILM-v001-${t.toFixed(2)}s.png`,Buffer.from(a,'base64'));
  }
  const boundaries=await page.evaluate(async()=>{
    const prev=await import('/src/cut90.js'),next=await import('/src/scenes/final-sequence.js'),canvas=document.querySelector('canvas'),results=[];
    window.__atlas.renderFrame(90);let first=canvas.toDataURL();prev.renderFrame(canvas,90);results.push(first===canvas.toDataURL());
    for(let i=1;i<next.sequence.length;i++){window.__atlas.renderFrame(next.sequence[i].start);first=canvas.toDataURL();next.renderScene(canvas,i-1,next.sequence[i-1].end-next.sequence[i-1].start);results.push(first===canvas.toDataURL());}
    for(const s of next.sequence)for(let i=-2;i<=46;i++)window.__atlas.renderFrame(s.start+i/60);return results;
  });assert(boundaries.every(Boolean));
  const overflow=await page.evaluate(()=>{
    const c=document.querySelector('canvas').getContext('2d'),original=c.fillText,bad=[];c.fillText=function(s,x,y,...rest){const width=this.measureText(s).width,left=this.textAlign==='center'?x-width/2:this.textAlign==='right'?x-width:x;if(left<0||left+width>1920||y>1080||y<0)bad.push({s,left,width,y});return original.call(this,s,x,y,...rest);};
    for(const t of [96,110,122,134,143,152,161,171,183,194,204,207.8])window.__atlas.renderFrame(t);c.fillText=original;return bad;
  });assert.deepEqual(overflow,[],'All bilingual text stays within frame');
  const end=await page.evaluate(()=>{window.__atlas.renderFrame(210);const d=document.querySelector('canvas').getContext('2d').getImageData(0,0,1920,1080).data;let error=0;for(let i=0;i<d.length;i+=4)error+=Math.abs(d[i]-11)+Math.abs(d[i+1]-18)+Math.abs(d[i+2]-24);return error;});assert.equal(end,0,'Clean final dark frame');
  await page.reload();await page.waitForFunction(()=>window.__atlas?.ready);assert.equal(digest(await capture(171)),hashes[171]);
  await page.goto(`${url}/?shot=FILM`);await page.waitForFunction(()=>window.__atlas?.ready&&document.querySelector('#sound').readyState>=2);
  await page.locator('#seek').fill('202');assert.equal(await page.locator('#clock').textContent(),'03:22.00 / 03:30.00');
  await page.getByRole('button',{name:'播放',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#sound').currentTime>202.25);
  const skew=await page.evaluate(()=>Math.abs(window.__atlas.getTime()-document.querySelector('#sound').currentTime));assert(skew<.08);await page.getByRole('button',{name:'暂停',exact:true}).click();
  await page.getByRole('button',{name:'重播',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#sound').currentTime>.1&&document.querySelector('#sound').currentTime<2);await page.getByRole('button',{name:'暂停',exact:true}).click();
  await page.locator('#seek').fill('209.5');await page.getByRole('button',{name:'播放',exact:true}).click();await page.waitForFunction(()=>window.__atlas.getTime()===210&&document.querySelector('#sound').paused);assert.equal(await page.evaluate(()=>window.__atlas.getTime()),210);
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  await writeFile('review/FILM/verification.json',JSON.stringify({id:'FILM',version:'v001',duration,frames:12600,audioPeakDb:peak,audioEdit,previewClockSkew:skew,cueAlignment,approvedCut90Frames:Object.keys(approved.hashes).length,hashes,checks:['210-second gap-free full narrative','archived approved CUT90 frames pixel-identical','11 boundary frames match preceding scene endpoints','539 transition frames rendered','reference branch count, sphere norm and closed Lissajous curve','curated relationship sources present','deterministic seeking and reload','bilingual text within frame','clean final dark frame','audio clock and end-of-film stop','seek pause replay minute display and mobile layout','no browser errors','audio headroom'],errors},null,2)+'\n');
  console.log(`PASS FILM: 210s, approved frames preserved, 11 transitions, deterministic bilingual frames, final closure, audio/UI. Peak ${peak} dB.`);
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
