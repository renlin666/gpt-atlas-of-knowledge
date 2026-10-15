import {renderFrame as renderBoot} from './boot-score.js';
import {renderFrame as renderMath} from './scenes/s004-curves.js';
export const duration=36;
export const version='v001';
export const audioPath='assets/audio/CUT04-Aphelion-v001.m4a';
export const audioStart=0;
export const fadeOutSeconds=.45;
export function renderFrame(canvas,t){t=Math.max(0,Math.min(duration,Number.isFinite(t)?t:0));t<24?renderBoot(canvas,t):renderMath(canvas,t-24);}
