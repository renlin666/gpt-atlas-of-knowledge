import {renderFrame as renderOpening} from './cut04.js';
import {renderScene,sequence,ease} from './scenes/knowledge-sequence.js';
export {sequence};
export const duration=90;
export const version='v001';
export const audioPath='assets/audio/CUT90-Aphelion-v001.m4a';
export const audioStart=0;
export const audioGainDb=3;
export const fadeOutSeconds=.75;
// One reusable offscreen canvas, always fully repainted from absolute score time.
let transition;
export function renderFrame(canvas,seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  if(t<36){renderOpening(canvas,t);return;}
  const i=sequence.findIndex(s=>t<s.end),index=i<0?sequence.length-1:i,s=sequence[index],local=t-s.start;
  if(local===0){index===0?renderOpening(canvas,36):renderScene(canvas,index-1,sequence[index-1].end-sequence[index-1].start);return;}
  renderScene(canvas,index,local);
  if(local<.75){
    transition??=document.createElement('canvas');transition.width=canvas.width;transition.height=canvas.height;transition.getContext('2d',{willReadFrequently:true});
    index===0?renderOpening(transition,36):renderScene(transition,index-1,sequence[index-1].end-sequence[index-1].start);
    const c=canvas.getContext('2d');c.save();c.globalAlpha=1-ease(local,0,.75);c.drawImage(transition,0,0);c.restore();
  }
}
