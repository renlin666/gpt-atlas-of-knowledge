import {renderFrame as renderApproved} from './cut90.js';
import {renderScene,sequence} from './scenes/final-sequence.js';
import {ease} from './scenes/knowledge-sequence.js';
export {sequence};
export const duration=210;
export const version='v001';
export const audioPath='assets/audio/FILM-Aphelion-v001.m4a';
export const audioStart=0;
export const fadeOutSeconds=1.25;
export const audioEdit={mainEnd:177,tailStart:386.250023,tailDuration:36,crossfade:3,gainRampStart:90,gainRampEnd:102,initialGainDb:3};
let transition;
export function renderFrame(canvas,seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));if(t<90){renderApproved(canvas,t);return;}
  let i=sequence.findIndex(s=>t<s.end);if(i<0)i=sequence.length-1;const s=sequence[i],local=t-s.start;
  const previous=target=>i===0?renderApproved(target,90):renderScene(target,i-1,sequence[i-1].end-sequence[i-1].start);
  if(local===0){previous(canvas);return;}renderScene(canvas,i,local);
  if(local<.75){transition??=document.createElement('canvas');transition.width=canvas.width;transition.height=canvas.height;transition.getContext('2d',{willReadFrequently:true});previous(transition);const c=canvas.getContext('2d');c.save();c.globalAlpha=1-ease(local,0,.75);c.drawImage(transition,0,0);c.restore();}
}
