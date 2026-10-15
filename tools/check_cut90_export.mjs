import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import ffmpeg from 'ffmpeg-static';
const file='review/CUT90/CUT90-v001-1080p60.mp4',audio='assets/audio/CUT90-Aphelion-v001.m4a';
const run=args=>{const p=spawnSync(ffmpeg,['-v','error',...args],{windowsHide:true,maxBuffer:4*1024*1024});assert.equal(p.status,0,p.stderr.toString());return p.stdout;};
const hash=f=>run(['-i',f,'-map','0:a:0','-f','hash','-hash','sha256','-']).toString().trim();
assert.equal(hash(file),hash(audio),'Video contains the identical decoded preview soundtrack');
const samples=(f,t)=>{const b=run(['-i',f,'-ss',String(t),'-t','1.5','-ac','1','-ar','8000','-f','f32le','-']);return new Float32Array(b.buffer,b.byteOffset,b.length/4);};
const alignment=[];
for(const time of [12,24,36,48,54,66,78,87]){
  const a=samples(file,time-.25),b=samples('assets/audio/Aphelion.mp3',time-.25);let dot=0,aa=0,bb=0;
  for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}
  const correlation=dot/Math.sqrt(aa*bb);assert(correlation>.99,`Original soundtrack position and continuous audio at ${time}s`);alignment.push({time,zeroLagCorrelation:correlation});
}
const report=JSON.parse(await readFile('review/CUT90/verification.json','utf8'));report.exportedAudioHash=hash(file);report.exportedAudioSourceAlignment=alignment;report.checks.push('exported audio identical to preview PCM','original continuous source alignment across all chapter boundaries');
await writeFile('review/CUT90/verification.json',JSON.stringify(report,null,2)+'\n');console.log('PASS CUT90 export: identical soundtrack, original timing and continuous audio across all chapter boundaries.');
