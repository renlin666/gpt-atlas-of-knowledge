import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import {startServer} from './server.mjs';
import {launchBrowser} from './browser.mjs';
import timing from '../data/s004.json' with {type:'json'};
import {curveValue} from '../src/scenes/s004-curves.js';
import edit from '../data/music-edit.json' with {type:'json'};

// Known reference values verify signs, scale and the radian convention of the plotted rules.
assert.equal(curveValue('line',-2),-1);assert.equal(curveValue('parabola',3),3);
assert(Math.abs(curveValue('sine',Math.PI/2)-1)<1e-12);assert(Math.abs(curveValue('sine',Math.PI))<1e-12);
const cueError=Math.max(...timing.cues.map(c=>Math.abs(c.onset-(timing.start+c.time))));assert(cueError<=1/120);
const stats=spawnSync(ffmpeg,['-hide_banner','-i',timing.audioPath,'-af','volumedetect','-f','null','-'],{encoding:'utf8',windowsHide:true});
assert.equal(stats.status,0);assert(/Duration: 00:00:12\.00/.test(stats.stderr));
const peak=Number(/max_volume: ([\d.-]+) dB/.exec(stats.stderr)?.[1]);assert(Number.isFinite(peak)&&peak<0,'No audio clipping or silent file');
const samples=(file,start)=>{
  const r=spawnSync(ffmpeg,['-v','error','-i',file,'-ss',String(start),'-t','2','-ac','1','-ar','8000','-f','f32le','-'],{windowsHide:true,maxBuffer:1024*1024});
  assert.equal(r.status,0);return new Float32Array(r.stdout.buffer,r.stdout.byteOffset,r.stdout.byteLength/4);
};
const a=samples(timing.audioPath,.25),b=samples(edit.track.localFile,24.25),joined=samples('assets/audio/CUT04-Aphelion-v001.m4a',24.25);
function correlation(reference){
  let best={lag:0,correlation:-1};
  for(let lag=-80;lag<=80;lag++){
    let dot=0,aa=0,bb=0;
    for(let i=80;i<a.length-80;i++){const x=a[i],y=reference[i+lag];dot+=x*y;aa+=x*x;bb+=y*y;}
    const value=dot/Math.sqrt(aa*bb);if(value>best.correlation)best={lag,correlation:value};
  }
  assert(Math.abs(best.lag)<=1&&best.correlation>.98,'Audio excerpt starts at the intended song position');return best;
}
const alignment=correlation(b),continuousAlignment=correlation(joined);
const {server,url}=await startServer(0);let browser;
try{
  browser=await launchBrowser();const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${url}/?mode=export&shot=S004`);await page.waitForFunction(()=>window.__atlas?.ready);
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL().split(',')[1];},t);
  const digest=s=>createHash('sha256').update(s).digest('hex');
  const expected=await page.evaluate(async()=>{const {renderFrame}=await import('/src/boot-score.js');const c=document.querySelector('canvas');renderFrame(c,24);return c.toDataURL().split(',')[1];});
  assert.equal(digest(await capture(0)),digest(expected),'S004 starts at approved BOOT ending');assert.equal(digest(await capture(.4)),digest(expected));
  await mkdir('review/S004',{recursive:true});const hashes={};
  for(const t of [2.9833333333,5.9833333333,8.9833333333,11.2333333333]){
    const first=await capture(t);await capture(.1);await capture(12);
    assert.equal(digest(await capture(t)),digest(first),`Absolute-time determinism ${t}`);
    await writeFile(`review/S004/S004-v001-${t.toFixed(2)}s.png`,Buffer.from(first,'base64'));hashes[t]=digest(first);
  }
  await page.reload();await page.waitForFunction(()=>window.__atlas?.ready);assert.equal(digest(await capture(5.9833333333)),hashes[5.9833333333]);
  await page.goto(`${url}/?mode=export&shot=CUT04`);await page.waitForFunction(()=>window.__atlas?.ready);
  assert.equal(digest(await capture(24)),digest(expected));assert.equal(digest(await capture(29.9833333333)),hashes[5.9833333333]);
  await page.goto(`${url}/?shot=S004`);await page.waitForFunction(()=>window.__atlas?.ready&&document.querySelector('#sound').readyState>=2);
  await page.locator('#seek').fill('8.98');await page.waitForFunction(()=>Math.abs(document.querySelector('#sound').currentTime-8.98)<.02);
  assert.equal(await page.evaluate(()=>window.__atlas.getTime()),8.98);
  await page.getByRole('button',{name:'重播',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#sound').currentTime>.2);
  const skew=await page.evaluate(()=>Math.abs(window.__atlas.getTime()-document.querySelector('#sound').currentTime));assert(skew<.08);
  await page.getByRole('button',{name:'暂停',exact:true}).click();assert(await page.evaluate(()=>document.querySelector('#sound').paused));
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  await writeFile('review/S004/verification.json',JSON.stringify({shot:'S004',version:'v001',duration:12,songRange:[24,36],audioPeakDb:peak,maxCueError:cueError,audioSourceAlignment:alignment,continuousAudioAlignment:continuousAlignment,previewClockSkew:skew,hashes,checks:['known formula reference values','cue alignment within half a video frame','correct audio excerpt and no clipping','continuous score audio alignment','pixel-exact previous-shot boundary','determinism after random seeking and reload','continuous and single-shot image match','audio clock','seek replay pause','mobile layout','no browser errors'],errors},null,2)+'\n');
  console.log(`PASS S004: reference formula values, continuity, score alignment, deterministic frames, audio clock and controls. Audio peak ${peak}dB.`);
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
