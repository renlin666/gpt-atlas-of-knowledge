import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import ffmpeg from 'ffmpeg-static';
import edit from '../data/music-edit.json' with {type:'json'};
import {selectShot} from '../src/shots.js';

await mkdir('assets/audio',{recursive:true});
const track=edit.track;
if(!existsSync(track.localFile)){
  const response=await fetch(track.download);if(!response.ok)throw new Error(`Audio download: ${response.status}`);
  await writeFile(track.localFile,Buffer.from(await response.arrayBuffer()));
}
const hash=createHash('sha256').update(await readFile(track.localFile)).digest('hex');
if(hash!==track.sha256)throw new Error('The soundtrack differs from the verified source. Preserve the file and verify its version before continuing.');
for(const id of (process.argv.slice(2).length?process.argv.slice(2):['BOOT'])){
  const shot=selectShot(id);if(!shot.audioPath)throw new Error(`${id} has no score audio.`);
  const fadeOut=shot.fadeOutSeconds??track.fadeOutSeconds;
  const filters=[`atrim=start=${shot.audioStart||0}:duration=${shot.duration}`,'asetpts=PTS-STARTPTS',`volume=${shot.audioGainDb??track.gainDb}dB`,...(shot.fadeInSeconds?[`afade=t=in:st=0:d=${shot.fadeInSeconds}`]:[]),`afade=t=out:st=${shot.duration-fadeOut}:d=${fadeOut}`].join(',');
  let processing=['-af',filters],changes=`excerpt, +${shot.audioGainDb??track.gainDb}dB, preview end fade`;
  if(shot.audioEdit){
    const e=shot.audioEdit;
    const graph=`[0:a]asplit=2[a][b];[a]atrim=start=0:end=${e.mainEnd},asetpts=PTS-STARTPTS,volume='pow(10,${e.initialGainDb}*clip((${e.gainRampEnd}-t)/${e.gainRampEnd-e.gainRampStart},0,1)/20)':eval=frame[main];[b]atrim=start=${e.tailStart}:duration=${e.tailDuration},asetpts=PTS-STARTPTS[tail];[main][tail]acrossfade=d=${e.crossfade}:c1=tri:c2=tri,afade=t=out:st=${shot.duration-fadeOut}:d=${fadeOut}[out]`;
    processing=['-filter_complex',graph,'-map','[out]'];changes=`score edit: 0-${e.mainEnd}s plus ${e.tailStart}s tail, ${e.crossfade}s crossfade, gain +3dB to 0dB, final fade`;
  }
  const child=spawn(ffmpeg,['-y','-hide_banner','-loglevel','error','-i',track.localFile,'-t',String(shot.duration),...processing,'-vn','-ar','48000','-ac','2','-c:a','aac','-b:a','192k','-metadata',`title=${track.title} — ${id} preview`,'-metadata',`artist=${track.author}`,'-metadata',`comment=CC BY 4.0; ${changes}; scottbuckley.com.au`,shot.audioPath],{stdio:['ignore','ignore','pipe'],windowsHide:true});
  let log='';child.stderr.on('data',d=>log+=d);
  const [code]=await once(child,'close');if(code!==0)throw new Error(log);
  console.log(`Verified ${track.title}: ${hash}. Prepared ${shot.audioPath}, ${shot.audioEdit?`edited score with a ${shot.audioEdit.crossfade}s tail crossfade`:`source ${shot.audioStart||0}–${(shot.audioStart||0)+shot.duration}s`}.`);
}
