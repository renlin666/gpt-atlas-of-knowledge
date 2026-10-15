import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { startServer } from './server.mjs';
import { launchBrowser } from './browser.mjs';
import { version } from '../src/scenes/s001-boot.js';

const { server, url }=await startServer(0);
let browser;
try {
  browser=await launchBrowser();
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
  await page.goto(`${url}/?mode=export`);
  await page.waitForFunction(()=>window.__atlas?.ready);
  await mkdir('review/S001',{recursive:true});
  const capture=t=>page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},t);
  const hashes={};
  for(const t of [.8,2.6,5,7.6]){
    const png=Buffer.from(await capture(t),'base64');
    await writeFile(`review/S001/S001-${version}-${t.toFixed(1)}s.png`,png);
    hashes[t]=createHash('sha256').update(png).digest('hex');
  }
  const first=await capture(5);
  await capture(7.9);await capture(.1);
  assert.equal(await capture(5),first,'Seeking must reproduce the exact same image');
  assert.equal(await capture(-1),await capture(0),'Clamp before start');
  assert.equal(await capture(9),await capture(8),'Clamp after end');
  await page.reload();
  await page.waitForFunction(()=>window.__atlas?.ready);
  assert.equal(await capture(5),first,'Reload must reproduce the exact same image after fonts load');
  await page.goto(url);
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
  const report={shot:'S001',version,resolution:'1920x1080',checks:['absolute-time determinism after arbitrary seeking and reload','time bounds','timeline seeking','replay and pause','390px layout','browser resources'],hashes,errors};
  await writeFile('review/S001/verification.json',JSON.stringify(report,null,2)+'\n');
  console.log('PASS: determinism, time bounds, seek, replay/pause, mobile, resources. Four keyframes saved.');
} finally { if(browser)await browser.close();await new Promise(r=>server.close(r)); }
