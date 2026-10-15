import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import ffmpeg from 'ffmpeg-static';
import edit from '../data/music-edit.json' with {type:'json'};

await mkdir('assets/audio',{recursive:true});
const track=edit.track;
if(!existsSync(track.localFile)){
  const response=await fetch(track.download);if(!response.ok)throw new Error(`Audio download: ${response.status}`);
  await writeFile(track.localFile,Buffer.from(await response.arrayBuffer()));
}
const hash=createHash('sha256').update(await readFile(track.localFile)).digest('hex');
if(hash!==track.sha256)throw new Error('The soundtrack differs from the verified source. Preserve the file and verify its version before continuing.');
const filters=`volume=${track.gainDb}dB,afade=t=out:st=${edit.duration-track.fadeOutSeconds}:d=${track.fadeOutSeconds}`;
const child=spawn(ffmpeg,['-y','-hide_banner','-loglevel','error','-i',track.localFile,'-t',String(edit.duration),'-af',filters,'-vn','-ar','48000','-ac','2','-c:a','aac','-b:a','192k','-metadata',`title=${track.title} — BOOT preview`,'-metadata',`artist=${track.author}`,'-metadata','comment=CC BY 4.0; excerpt, +4dB, end fade; scottbuckley.com.au',track.previewFile],{stdio:['ignore','ignore','pipe'],windowsHide:true});
let log='';child.stderr.on('data',d=>log+=d);
const [code]=await once(child,'close');if(code!==0)throw new Error(log);
console.log(`Verified ${track.title}: ${hash}. Prepared ${track.previewFile}, ${edit.duration}s, +${track.gainDb}dB, end fade ${track.fadeOutSeconds}s.`);
