import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { startServer } from './server.mjs';
import { launchBrowser } from './browser.mjs';
import { selectShot } from '../src/shots.js';
const shot=selectShot(process.argv[2]||'S002');
const {version,duration,id}=shot;
const folder=`review/${id}`;

const { server, url }=await startServer(0);
let browser;
try {
  browser=await launchBrowser();
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
  await page.goto(`${url}/?mode=export&shot=${id}`);
  await page.waitForFunction(()=>window.__atlas?.ready);
  await mkdir(folder,{recursive:true});
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},t);
  const hashes={};
  for(const t of (id==='S001'?[.8,2.6,5,7.6]:[.6,2,4,5.6])){
    const png=Buffer.from(await capture(t),'base64');
    await writeFile(`${folder}/${id}-${version}-${t.toFixed(1)}s.png`,png);
    hashes[t]=createHash('sha256').update(png).digest('hex');
  }
  const first=await capture(5);
  await capture(7.9);await capture(.1);
  assert.equal(await capture(5),first,'Seeking must reproduce the exact same image');
  assert.equal(await capture(-1),await capture(0),'Clamp before start');
  assert.equal(await capture(duration+1),await capture(duration),'Clamp after end');
  if(id==='S002'){
    const previous=await page.evaluate(async()=>{const {renderFrame}=await import('/src/scenes/s001-boot.js');const c=document.querySelector('canvas');renderFrame(c,8);return c.toDataURL().split(',')[1];});
    assert.equal(await capture(0),previous,'S002 must begin exactly at approved S001 final frame');
  }
  await page.reload();
  await page.waitForFunction(()=>window.__atlas?.ready);
  assert.equal(await capture(5),first,'Reload must reproduce the exact same image after fonts load');
  await page.goto(`${url}/?shot=${id}`);
  await page.waitForFunction(()=>window.__atlas?.ready);
  await page.locator('#seek').fill('5');
  assert.equal(await page.evaluate(()=>window.__atlas.getTime()),5,'Timeline seek');
  await page.getByRole('button',{name:'重播',exact:true}).click();
  await page.waitForFunction(()=>window.__atlas.getTime()>.1);
  await page.getByRole('button',{name:'暂停',exact:true}).click();
  assert(await page.evaluate(()=>window.__atlas.getTime())<2,'Replay starts at zero');
  // A narrow viewport must keep the page usable without horizontal overflow.
  await page.setViewportSize({width:390,height:844});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile overflow');
  assert.deepEqual(errors,[],'Browser errors and missing resources');
  const report={shot:id,version,resolution:'1920x1080',checks:['absolute-time determinism after arbitrary seeking and reload','time bounds','timeline seeking','replay and pause','390px layout','browser resources',...(id==='S002'?['pixel-exact continuity with approved S001']:[])],hashes,errors};
  await writeFile(`${folder}/verification.json`,JSON.stringify(report,null,2)+'\n');
  console.log('PASS: determinism, time bounds, seek, replay/pause, mobile, resources. Four keyframes saved.');
} finally { if(browser)await browser.close();await new Promise(r=>server.close(r)); }
