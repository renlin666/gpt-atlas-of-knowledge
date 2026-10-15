import * as opening from './scenes/s001-boot.js';
import * as spark from './scenes/s002-spark.js';
import * as origin from './scenes/s003-origin.js';
import * as boot from './boot-score.js';
import * as math from './scenes/s004-curves.js';
import * as cut04 from './cut04.js';
import * as cut90 from './cut90.js';
import * as film from './film.js';
export const shots={
  FILM:{...film,id:'FILM',title:'GPT：知识宇宙图鉴 · 全片',chapter:'00:00–03:30 / THE ATLAS OF KNOWLEDGE',start:0,status:'全片待审 / Full film for review',note:'完整的九章叙事已连成全片：从人类的提问出发，穿越学科、连接与求证，最后回到下一次探索。请审看整体节奏、高潮与结尾。'},
  CUT90:{...cut90,id:'CUT90',title:'知识宇宙 · 90 秒连续预览',chapter:'00:00–01:30 / BOOT → MATHEMATICS → PHYSICS → LIFE',start:0,status:'已通过 / Approved',note:'沿着 Aphelion，从提问出发，经过数学与物理，抵达生命双螺旋。请集中审看整段的节奏、章节衔接和信息密度。'},
  S004:{...math,id:'S004',title:'一个规则，一条曲线',chapter:'02 / MATHEMATICS — 数学',start:24,status:'已通过 / Approved',note:'关注直线、抛物线与正弦曲线的描绘节奏，以及公式与曲线的关系。'},
  CUT04:{...cut04,id:'CUT04',title:'开场至数学 · 连续预览',chapter:'00:00–00:36 / S001–S004',start:0,status:'已通过 / Approved',note:'前三幕已通过。这里提供到第四镜的连续音画，便于检查 24 秒处的衔接。'},
  BOOT:{...boot,id:'BOOT',title:'前三幕 · Aphelion 节奏版',chapter:'BOOT / 唤醒 — 三幕连续审看',start:0,status:'已通过 / Approved',note:'已通过的前三幕配乐版，保留供对照。'},
  S001:{...opening,id:'S001',title:'光标与提问',chapter:'01 / BOOT — 唤醒',start:0,status:'已通过 / Approved',note:'已通过的 S001 v002，保留供对照。'},
  S002:{...spark,id:'S002',title:'提问汇聚成光',chapter:'01 / BOOT — 唤醒',start:8,status:'已通过 / Approved',note:'已通过的 S002 v001，保留供对照。'},
  S003:{...origin,id:'S003',title:'从光点到原点',chapter:'01 / BOOT → MATHEMATICS · 唤醒 → 数学',start:14,status:'待你审看 / For review',note:'关注轨道变成坐标轴的过程、字与图的平衡，以及从唤醒到数学的交接。'}
};
export function selectShot(id='FILM'){
  if(!shots[id])throw new Error(`Unknown shot: ${id}`);
  return shots[id];
}
