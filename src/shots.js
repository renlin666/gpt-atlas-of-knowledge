import * as opening from './scenes/s001-boot.js';
import * as spark from './scenes/s002-spark.js';
export const shots={
  S001:{...opening,id:'S001',title:'光标与提问',chapter:'01 / BOOT — 唤醒',start:0,status:'已通过 / Approved',note:'已通过的 S001 v002，保留供对照。'},
  S002:{...spark,id:'S002',title:'提问汇聚成光',chapter:'01 / BOOT — 唤醒',start:8,status:'待你审看 / For review',note:'关注双语文字的汇聚、知识核心的尺度，以及前后镜头的衔接。'}
};
export function selectShot(id='S002'){
  if(!shots[id])throw new Error(`Unknown shot: ${id}`);
  return shots[id];
}
