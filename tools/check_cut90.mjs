import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import {startServer} from './server.mjs';
import {launchBrowser} from './browser.mjs';
import {sequence,circlePoint,sierpinski,waveValues,orbitPoint,complement} from '../src/scenes/knowledge-sequence.js';
const digest=s=>createHash('sha256').update(s).digest('hex');
assert.equal(sequence[0].start,36);assert.equal(sequence.at(-1).end,90);
sequence.slice(1).forEach((s,i)=>assert.equal(s.start,sequence[i].end));
for(const angle of [0,.7,Math.PI/2,Math.PI]){const p=circlePoint(angle);assert(Math.abs(p.x*p.x+p.y*p.y-1)<1e-12);}
for(let n=0;n<=5;n++)assert.equal(sierpinski(n).length,3**n);
for(const x of [0,.7,2,3.1]){const [a,b,sum]=waveValues(x,2);assert.equal(sum,a+b);}
for(const m of [0,.7,2,Math.PI]){const p=orbitPoint(m);assert(Math.abs(p.E-.35*Math.sin(p.E)-m)<1e-12);assert(Math.abs((p.x+480*.35)**2/480**2+p.y**2/(480**2*(1-.35**2))-1)<1e-12);}
for(const b of 'ATGC')assert.equal(complement[complement[b]],b);
const analysis=JSON.parse(await readFile('data/audio-analysis-96.json','utf8'));
const cueTimes=[38.25,46.4833333333,52.4833333333,56.2333333333,68.2333333333,84.7333333333,86.2333333333,89.25];
const cueAlignment=cueTimes.map(time=>{const onset=analysis.onsetCandidates.reduce((a,b)=>Math.abs(a.time-time)<Math.abs(b.time-time)?a:b);return {time,onset:onset.time,error:Math.abs(time-onset.time)};});
assert(cueAlignment.every(c=>c.error<=1/120));
const stats=spawnSync(ffmpeg,['-hide_banner','-i','assets/audio/CUT90-Aphelion-v001.m4a','-af','volumedetect','-f','null','-'],{encoding:'utf8',windowsHide:true});
assert.equal(stats.status,0);const peak=Number(/max_volume: ([\d.-]+) dB/.exec(stats.stderr)?.[1]);assert(peak<-.5&&peak>-3);assert(/Duration: 00:01:30\.00/.test(stats.stderr));
const {server,url}=await startServer(0);let browser;
try{
  browser=await launchBrowser();const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${url}/?mode=export&shot=CUT90`);await page.waitForFunction(()=>window.__atlas?.ready);
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL().split(',')[1];},t);
  await mkdir('review/CUT90',{recursive:true});const hashes={};
  for(const t of [0,23.2333333333,29.9833333333,35.2333333333,41,46.4833333333,52.4833333333,60,71,84.7333333333,89.25]){
    const a=await capture(t);await capture(89);await capture(.5);const repeat=await capture(t);assert.equal(digest(repeat),digest(a),`determinism at ${t}`);
    hashes[t]=digest(a);await writeFile(`review/CUT90/CUT90-v001-${t.toFixed(2)}s.png`,Buffer.from(a,'base64'));
  }
  // Approved frames must match the previous cut; every new shot starts at the preceding endpoint.
  const approvedMatch=await page.evaluate(async()=>{
    const cut=await import('/src/cut04.js'),seq=await import('/src/scenes/knowledge-sequence.js');const canvas=document.querySelector('canvas');
    const check=[];
    for(const t of [0,23.2333333333,29.9833333333,35.2333333333,36]){window.__atlas.renderFrame(t);const a=canvas.toDataURL();cut.renderFrame(canvas,t);check.push(a===canvas.toDataURL());}
    for(let i=1;i<seq.sequence.length;i++){window.__atlas.renderFrame(seq.sequence[i].start);const a=canvas.toDataURL();seq.renderScene(canvas,i-1,seq.sequence[i-1].end-seq.sequence[i-1].start);check.push(a===canvas.toDataURL());}return check;
  });assert(approvedMatch.every(Boolean));
  // Scan every transition frame to catch missing resources and runtime errors.
  await page.evaluate(()=>{for(const boundary of [36,48,54,66,78])for(let i=-2;i<=47;i++)window.__atlas.renderFrame(boundary+i/60);});
  await page.reload();await page.waitForFunction(()=>window.__atlas?.ready);assert.equal(digest(await capture(60)),hashes[60]);
  await page.goto(`${url}/?shot=CUT90`);await page.waitForFunction(()=>window.__atlas?.ready&&document.querySelector('#sound').readyState>=2);
  await page.locator('#seek').fill('84.73');await page.waitForFunction(()=>Math.abs(document.querySelector('#sound').currentTime-84.73)<.02);assert.equal(await page.locator('#clock').textContent(),'01:24.73 / 01:30.00');
  await page.getByRole('button',{name:'播放',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#sound').currentTime>85);
  const skew=await page.evaluate(()=>Math.abs(window.__atlas.getTime()-document.querySelector('#sound').currentTime));assert(skew<.08);
  await page.getByRole('button',{name:'暂停',exact:true}).click();assert(await page.evaluate(()=>document.querySelector('#sound').paused));
  await page.getByRole('button',{name:'重播',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#sound').currentTime>.1&&document.querySelector('#sound').currentTime<2);
  await page.getByRole('button',{name:'暂停',exact:true}).click();await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  const report={id:'CUT90',version:'v001',duration:90,audioPeakDb:peak,audioGainDb:3,previewClockSkew:skew,cueAlignment,hashes,checks:['reference circle, recursion, superposition, Kepler equation and complementary pairs','contiguous timeline to exactly 90 seconds','approved previous frames preserved','all shot boundaries pixel-identical to preceding endpoint','absolute-time frame reproducibility after seeks and reload','250 transition frames scanned','audio master clock seek pause replay','correct minute display','mobile layout','no browser errors','audio headroom'],errors};
  await writeFile('review/CUT90/verification.json',JSON.stringify(report,null,2)+'\n');console.log(`PASS CUT90: 90s, deterministic, approved frames preserved, transitions, audio/UI. Peak ${peak} dB; max cue error ${(Math.max(...cueAlignment.map(c=>c.error))*1000).toFixed(2)}ms.`);
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
