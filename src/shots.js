import * as opening from './scenes/s001-boot.js';
import * as spark from './scenes/s002-spark.js';
import * as origin from './scenes/s003-origin.js';
import * as boot from './boot-score.js';
export const shots={
  BOOT:{...boot,id:'BOOT',title:'前三幕 · Aphelion 节奏版',chapter:'BOOT / 唤醒 — 三幕连续审看',start:0,status:'有声节奏版待审 / Music edit for review',note:'关注问题落定、汇聚与坐标展开是否随音乐自然呼吸；整体确认后再继续后续分镜。'},
  S001:{...opening,id:'S001',title:'光标与提问',chapter:'01 / BOOT — 唤醒',start:0,status:'已通过 / Approved',note:'已通过的 S001 v002，保留供对照。'},
  S002:{...spark,id:'S002',title:'提问汇聚成光',chapter:'01 / BOOT — 唤醒',start:8,status:'已通过 / Approved',note:'已通过的 S002 v001，保留供对照。'},
  S003:{...origin,id:'S003',title:'从光点到原点',chapter:'01 / BOOT → MATHEMATICS · 唤醒 → 数学',start:14,status:'待你审看 / For review',note:'关注轨道变成坐标轴的过程、字与图的平衡，以及从唤醒到数学的交接。'}
};
export function selectShot(id='BOOT'){
  if(!shots[id])throw new Error(`Unknown shot: ${id}`);
  return shots[id];
}
