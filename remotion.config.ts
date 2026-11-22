import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setConcurrency(4);

// The cloud container blocks Remotion's browser download, but ships a headless Chromium.
const browser =
  process.env.REMOTION_BROWSER ??
  ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'].find((p) => existsSync(p));
if (browser) Config.setBrowserExecutable(browser);
