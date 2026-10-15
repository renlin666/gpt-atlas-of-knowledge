import edit from '../data/music-edit.json' with {type:'json'};
import * as opening from './scenes/s001-boot.js';
import * as spark from './scenes/s002-spark.js';
import * as origin from './scenes/s003-origin.js';
const renderers={S001:opening.renderFrame,S002:spark.renderFrame,S003:origin.renderFrame};
export const duration=edit.duration;
export const version=edit.version;
export const audioPath=edit.track.previewFile;
export const score=edit;
export function positionAt(seconds){
  const t=Math.max(0,Math.min(duration,Number.isFinite(seconds)?seconds:0));
  const shot=edit.shots.find(s=>t<s.end)||edit.shots.at(-1);
  const keys=shot.map;
  if(t<=keys[0][0])return {shot,localTime:keys[0][1]};
  for(let i=1;i<keys.length;i++){
    const [end,value]=keys[i],[start,previous]=keys[i-1];
    if(t<=end)return {shot,localTime:previous+(value-previous)*(t-start)/(end-start)};
  }
  return {shot,localTime:keys.at(-1)[1]};
}
export function renderFrame(canvas,t){
  const {shot,localTime}=positionAt(t);renderers[shot.id](canvas,localTime);
  const c=canvas.getContext('2d');c.save();c.setTransform(canvas.width/1920,0,0,canvas.height/1080,0,0);
  c.font='400 14px "Noto Sans SC Variable",sans-serif';c.fillStyle='#7e918b';c.textBaseline='alphabetic';
  c.fillText('配乐 / Music: Aphelion — Scott Buckley · CC BY 4.0 · scottbuckley.com.au',252,1020);
  c.restore();
}
