import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';
import { startServer } from './server.mjs';
import { launchBrowser } from './browser.mjs';
import { selectShot } from '../src/shots.js';
const shot=selectShot(process.argv[2]||'S002');
const {version,duration,id}=shot;
const folder=`review/${id}`;

const {server,url}=await startServer(0);
let browser, encoder;
const fps=60, frames=fps*duration;
const output=`${folder}/${id}-${version}-1080p60.mp4`;
try {
  await mkdir(folder,{recursive:true});
  browser=await launchBrowser();
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(`${url}/?mode=export&shot=${id}`);await page.waitForFunction(()=>window.__atlas?.ready);
  encoder=spawn(ffmpeg,['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:['pipe','ignore','pipe'],windowsHide:true});
  let encoderError='';encoder.stderr.on('data',d=>encoderError+=d);
  const completion=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',code=>code===0?resolve():reject(new Error(`FFmpeg ${code}: ${encoderError}`)));});
  // Attach immediately to avoid unhandled rejection if FFmpeg fails while frames are rendering.
  completion.catch(()=>{});
  for(let i=0;i<frames;i++){
    const png=await page.evaluate(t=>{window.__atlas.renderFrame(t);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},i/fps);
    if(!encoder.stdin.write(Buffer.from(png,'base64')))await once(encoder.stdin,'drain');
    if(i%60===0)console.log(`${id}: ${i}/${frames} frames`);
  }
  encoder.stdin.end();await completion;
  // Decode the exported file and inspect stream statistics using the same bundled FFmpeg.
  const probe=spawn(ffmpeg,['-hide_banner','-i',output,'-map','0:v:0','-f','null','-'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  let log='';probe.stderr.on('data',d=>log+=d);
  const [code]=await once(probe,'close');if(code!==0)throw new Error(log);
  if(!log.includes('1920x1080') || !/60 fps/.test(log) || !new RegExp(`frame=\\s*${frames}`).test(log))throw new Error(`Unexpected export metadata: ${log}`);
  await writeFile(`${folder}/video-verification.txt`,log);
  console.log(`Verified: ${output}, 1920×1080, 60fps, ${frames} frames, ${duration} seconds, no audio.`);
} finally {
  if(encoder && encoder.exitCode===null)encoder.kill();
  if(browser)await browser.close();await new Promise(r=>server.close(r));
}
