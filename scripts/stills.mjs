#!/usr/bin/env node
/**
 * Render preview stills (bundles once).  node scripts/stills.mjs <CompositionId> <sec,sec,...> [outDir]
 * Also writes a contact sheet out/<id>-sheet.jpg via ffmpeg.
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import path from 'node:path';

const [id = 'Case001', list = '1', outDir = 'out/stills'] = process.argv.slice(2);
const secs = list.split(',').map(Number);
mkdirSync(outDir, {recursive: true});
const browserExecutable = ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find((p) => existsSync(p));
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
const files = [];
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = `${outDir}/${id}-${String(s).replace('.', '_')}.jpg`;
  await renderStill({serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  files.push(output);
  console.log('✔', output);
}
if (files.length > 1) {
  const cols = Math.min(files.length, 5);
  const args = files.flatMap((f) => ['-i', f]);
  const rows = Math.ceil(files.length / cols);
  const layout = files.map((_, i) => `${(i % cols) * 432}_${Math.floor(i / cols) * 768}`).join('|');
  const scaled = files.map((_, i) => `[${i}:v]scale=432:768[v${i}]`).join(';');
  const inputs = files.map((_, i) => `[v${i}]`).join('');
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...args, '-filter_complex', `${scaled};${inputs}xstack=inputs=${files.length}:layout=${layout}:fill=black`, '-q:v', '3', `out/${id}-sheet.jpg`]);
  console.log('✔ sheet', `out/${id}-sheet.jpg`, `${cols}x${rows}`);
}
