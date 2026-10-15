import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';
import {audioEdit} from '../src/film.js';
const file='review/FILM/FILM-v001-1080p60.mp4',audio='assets/audio/FILM-Aphelion-v001.m4a';
const run=args=>{const p=spawnSync(ffmpeg,['-v','error',...args],{windowsHide:true,maxBuffer:4*1024*1024});assert.equal(p.status,0,p.stderr.toString());return p.stdout;};
const hash=f=>run(['-i',f,'-map','0:a:0','-f','hash','-hash','sha256','-']).toString().trim();
assert.equal(hash(file),hash(audio),'Export must contain the identical decoded preview soundtrack');
const samples=(f,t)=>{const b=run(['-i',f,'-ss',String(t),'-t','1.5','-ac','1','-ar','8000','-f','f32le','-']);return new Float32Array(b.buffer,b.byteOffset,b.length/4);};
function align(a,b){
  let best={lag:0,correlation:-1};
  for(let lag=-8;lag<=8;lag++){let dot=0,aa=0,bb=0;for(let i=8;i<a.length-8;i++){const x=a[i],y=b[i+lag];dot+=x*y;aa+=x*x;bb+=y*y;}const value=dot/Math.sqrt(aa*bb);if(value>best.correlation)best={lag,correlation:value,gain:dot/bb,referenceRms:Math.sqrt(bb/(a.length-16))};}
  let residual=0;for(let i=8;i<a.length-8;i++)residual+=(a[i]-best.gain*b[i+best.lag])**2;best.residualRms=Math.sqrt(residual/(a.length-16));
  assert(Math.abs(best.lag)<=1);
  // Correlation becomes sensitive to lossy-codec noise in the nearly silent tail.
  // Require an absolute residual below -86dBFS there as well as correlation > .98.
  if(best.referenceRms<.001)assert(best.correlation>.98&&best.residualRms<.00005);
  else assert(best.correlation>.99);
  return best;
}
const alignment=[];
for(const time of [12,36,78,87,114,138,156,170,180,195,204]){
  const sourceTime=time<174?time:audioEdit.tailStart+(time-174);alignment.push({time,sourceTime,...align(samples(file,time),samples('assets/audio/Aphelion.mp3',sourceTime))});
}
const old=samples('assets/audio/CUT90-Aphelion-v001.m4a',87),now=samples(file,87);let maxDifference=0;
for(let i=0;i<old.length;i++)maxDifference=Math.max(maxDifference,Math.abs(now[i]-old[i]));assert(maxDifference<.001,'Approved opening score gain and position preserved before the removed preview-end fade');
const ending=samples(file,208.5),last=ending.slice(-800),rms=Math.sqrt(last.reduce((s,v)=>s+v*v,0)/last.length);assert(rms<.001,'Quiet ending without abrupt truncation');
const transitionTime=175,main=samples('assets/audio/Aphelion.mp3',transitionTime),tail=samples('assets/audio/Aphelion.mp3',audioEdit.tailStart+1),expected=new Float32Array(main.length);
for(let i=0;i<expected.length;i++){const f=(transitionTime+i/8000-174)/3;expected[i]=main[i]*(1-f)+tail[i]*f;}
const crossfadeAlignment=align(samples(file,transitionTime),expected);
const report=JSON.parse(await readFile('review/FILM/verification.json','utf8'));report.exportedAudioHash=hash(file);report.exportedAudioSourceAlignment=alignment;report.approvedOpeningPcmMaxDifference=maxDifference;report.final100msRms=rms;
report.crossfadeAlignment=crossfadeAlignment;
report.checks.push('full H.264 video decode and 12600-frame metadata verified by exporter','exported soundtrack identical to preview PCM','original source positioning before and after the tail edit','linear crossfade matches the two original source intervals','approved opening gain preserved','quiet final 100ms');
await writeFile('review/FILM/verification.json',JSON.stringify(report,null,2)+'\n');console.log('PASS FILM export: preview soundtrack identical, source alignment, approved opening gain and quiet ending.');
