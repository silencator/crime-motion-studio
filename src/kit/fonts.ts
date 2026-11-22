import {continueRender, delayRender, staticFile} from 'remotion';

/** Studio fonts (all OFL). Sub = subtitles, Accent = motion-graphic titles, Type = typewriter/report, Stamp = block stamp. */
export const F = {
  sub: 'IFSans',
  accent: 'IFAccent',
  type: 'IFType',
  stamp: 'IFStamp',
};
const list: [string, string, string, string][] = [
  [F.sub, 'Inter-Bold.woff2', '700', 'normal'],
  [F.sub, 'Inter-ExtraBold.woff2', '800', 'normal'],
  [F.accent, 'Playfair-BoldItalic.woff2', '700', 'italic'],
  [F.accent, 'Playfair-SemiBoldItalic.woff2', '600', 'italic'],
  [F.type, 'SpecialElite-Regular.ttf', '400', 'normal'],
  [F.stamp, 'Anton-Regular.ttf', '400', 'normal'],
];
if (typeof window !== 'undefined' && typeof FontFace !== 'undefined') {
  const h = delayRender('fonts');
  Promise.all(
    list.map(([fam, file, weight, style]) =>
      new FontFace(fam, `url(${staticFile('fonts/' + file)})`, {weight, style}).load().then((f) => (document.fonts as unknown as {add: (x: FontFace) => void}).add(f)),
    ),
  )
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
}
