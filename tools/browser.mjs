import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

export async function launchBrowser() {
  const candidates = [process.env.ATLAS_BROWSER, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'];
  const executablePath = candidates.find(p => p && existsSync(p));
  if (!executablePath) throw new Error('Set ATLAS_BROWSER to your Chrome/Edge executable.');
  return chromium.launch({ executablePath, headless:true, args:['--disable-background-timer-throttling'] });
}
