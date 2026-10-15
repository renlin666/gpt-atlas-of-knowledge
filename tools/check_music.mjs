import assert from 'node:assert/strict';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import { startServer } from './server.mjs';
import { launchBrowser } from './browser.mjs';
import { score,positionAt } from '../src/boot-score.js';

assert.equal(createHash('sha256').update(await readFile(score.track.localFile)).digest('hex'),score.track.sha256,'Verified soundtrack version');
assert.equal(score.shots[0].start,0);
assert.equal(score.shots.at(-1).end,score.duration);
for(let i=1;i<score.shots.length;i++)assert.equal(score.shots[i-1].end,score.shots[i].start,'No timeline gap');
for(const s of score.shots){
  let previous=-1;
  for(let t=s.start;t<s.end;t+=1/120){const p=positionAt(t);assert(p.localTime>=previous-1e-8&&p.localTime<=s.originalDuration);previous=p.localTime;}
}
const maxAlignmentError=Math.max(...score.cues.map(c=>Math.abs(c.time-c.onset)));
assert(maxAlignmentError<=1/120,'Cue-to-measured-onset error must stay within half a 60fps frame');
const audioCheck=spawnSync(ffmpeg,['-hide_banner','-i',score.track.previewFile,'-af','volumedetect','-f','null','-'],{encoding:'utf8',windowsHide:true});
assert.equal(audioCheck.status,0,audioCheck.stderr);
assert(/Duration: 00:00:24\.00/.test(audioCheck.stderr),'Audio clip duration');
const peak=Number(/max_volume: ([\d.-]+) dB/.exec(audioCheck.stderr)?.[1]);assert(Number.isFinite(peak)&&peak<0,'No soundtrack clipping');
let exportedAudioHash=null;
const exportedPath=`review/BOOT/BOOT-${score.version}-1080p60.mp4`;
if(existsSync(exportedPath)){
  const decodedHash=p=>{const r=spawnSync(ffmpeg,['-v','error','-i',p,'-map','0:a:0','-f','hash','-hash','sha256','-'],{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  exportedAudioHash=decodedHash(exportedPath);
  assert.equal(exportedAudioHash,decodedHash(score.track.previewFile),'Exported audio matches preview sample-for-sample');
}
const {server,url}=await startServer(0);let browser;
try{
  const range=await fetch(`${url}/${score.track.previewFile}`,{headers:{Range:'bytes=0-99'}});
  assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,100,'Audio byte-range seeking');
  browser=await launchBrowser();
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`${url}/?mode=export&shot=BOOT`);await page.waitForFunction(()=>window.__atlas?.ready);
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL().split(',')[1];},t);
  const digest=s=>createHash('sha256').update(s).digest('hex');
  await mkdir('review/BOOT',{recursive:true});const hashes={};
  for(const t of [3.7333333333,9.7333333333,15.7333333333,23.2333333333]){
    const first=await capture(t);await capture(23.9);await capture(.1);
    assert.equal(digest(await capture(t)),digest(first),`Deterministic score frame ${t}`);
    await writeFile(`review/BOOT/BOOT-music-v001-${t.toFixed(2)}s.png`,Buffer.from(first,'base64'));hashes[t]=digest(first);
  }
  for(const s of score.shots.slice(1))assert.equal(digest(await capture(s.start)),digest(await capture(s.start+.1)),'Pixel-exact boundary hold');
  await page.reload();await page.waitForFunction(()=>window.__atlas?.ready);
  assert.equal(digest(await capture(15.7333333333)),hashes[15.7333333333],'Score frame survives reload');
  await page.goto(`${url}/?shot=BOOT`);await page.waitForFunction(()=>window.__atlas?.ready&&document.querySelector('#sound').readyState>=2);
  await page.locator('#seek').fill('15.73');
  await page.waitForFunction(()=>Math.abs(document.querySelector('#sound').currentTime-15.73)<.02);
  assert.equal(await page.evaluate(()=>window.__atlas.getTime()),15.73);
  await page.getByRole('button',{name:'重播',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#sound').currentTime>.2&&!document.querySelector('#sound').paused);
  const skew=await page.evaluate(()=>Math.abs(window.__atlas.getTime()-document.querySelector('#sound').currentTime));assert(skew<.08,'Audio-clock preview sync');
  await page.getByRole('button',{name:'暂停',exact:true}).click();
  assert(await page.evaluate(()=>document.querySelector('#sound').paused));
  assert(await page.evaluate(()=>window.__atlas.getTime()<2),'Replay restarts soundtrack and image');
  await page.locator('#volume').fill('0.5');assert.equal(await page.evaluate(()=>document.querySelector('#sound').volume),.5);
  await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile layout');
  assert.deepEqual(errors,[]);
  await writeFile('review/BOOT/verification.json',JSON.stringify({version:score.version,duration:score.duration,trackSha256:score.track.sha256,maxCueAlignmentError:maxAlignmentError,previewClockSkew:skew,audioPeakDb:peak,exportedAudioHash,hashes,checks:['verified audio hash','monotonic time remap','gap-free timeline','cue alignment within half a frame','audio range requests','frame determinism after seeking/reload','pixel-exact scene boundary holds','audio-driven playback','soundtrack/image seek and replay','pause and volume','mobile layout','no browser/resource errors',...(exportedAudioHash?['exported audio equals preview sample-for-sample']:[])],errors},null,2)+'\n');
  console.log(`PASS: 24s score, audio clock, seeking/replay, boundaries, determinism. Peak ${peak}dB, max cue error ${(maxAlignmentError*1000).toFixed(2)}ms.`);
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
