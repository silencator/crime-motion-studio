import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed, CaseTag, Captions} from '../../kit/captions';
import {FilmFinish} from '../../kit/fx';
import {clamp, sec} from '../../kit/time';
import {ACCENTS, CLOSED_S, DURATION_S, SHOTS, SUBS} from './timeline';
import * as Sh from './shots';

export const CASE003_FRAMES = sec(DURATION_S);
const CLOSED_AT = sec(CLOSED_S);

const SHOT_LIST: [keyof typeof SHOTS, React.FC<Sh.ShotP>][] = [
  ['plan', Sh.PlanHook],
  ['store', Sh.StoreExt],
  ['watch', Sh.WatchInsert],
  ['zero', Sh.ZeroThief],
  ['guards', Sh.GuardsPOV],
  ['cams', Sh.CamsShot],
  ['prep', Sh.PrepTop],
  ['shoes', Sh.ShoesInsert],
  ['clock', Sh.ClockShot],
  ['walkin', Sh.WalkIn],
  ['split', Sh.SplitShot],
  ['walkout', Sh.WalkOut],
  ['pour', Sh.PourShot],
  ['gone', Sh.GoneShot],
  ['prints', Sh.PrintsShot],
  ['witness', Sh.WitnessShot],
  ['trace', Sh.TraceShot],
  ['perfect', Sh.PerfectShot],
  ['thought', Sh.ThoughtShot],
  ['knock', Sh.KnockShot],
  ['doorway', Sh.DoorwayShot],
  ['reason', Sh.ReasonShot],
  ['park', Sh.ParkShot],
  ['meter', Sh.MeterShot],
  ['card', Sh.CardShot],
  ['tiny', Sh.TinyShot],
  ['ruined', Sh.RuinedShot],
];

const ShotHost: React.FC<{C: React.FC<Sh.ShotP>; from: number}> = ({C, from}) => {
  const f = useCurrentFrame();
  return <C f={f} g={f + from} />;
};

/* ------------------------------ sound ------------------------------ */
type Cue = {at: number; src: string; vol: number; dur?: number};
const SFX: Cue[] = [
  // hook: quiet and low under the first words (no hiss)
  {at: 0.0, src: 'tock', vol: 0.18},
  {at: 1.9, src: 'tock', vol: 0.22},
  // store
  {at: 2.66, src: 'whoosh-low', vol: 0.3},
  // stopwatch
  {at: 4.44, src: 'watch-click', vol: 0.5},
  {at: 4.5, src: 'ticks-fast', vol: 0.3, dur: 1.0},
  // zero mistakes
  {at: 5.36, src: 'whoosh-low', vol: 0.3},
  {at: 6.14, src: 'sting', vol: 0.16},
  // binoculars, cameras
  {at: 7.12, src: 'whoosh-soft', vol: 0.2},
  {at: 8.7, src: 'servo', vol: 0.4},
  {at: 9.45, src: 'servo', vol: 0.3},
  // prep
  {at: 10.05, src: 'whoosh-soft', vol: 0.18},
  {at: 11.95, src: 'paper', vol: 0.16},
  {at: 12.86, src: 'paper', vol: 0.16},
  // shoes
  {at: 14.72, src: 'step-wood-0', vol: 0.32},
  // 3:12
  {at: 15.98, src: 'tick', vol: 0.35},
  {at: 16.6, src: 'watch-click', vol: 0.55},
  // walked in
  {at: 17.62, src: 'latch', vol: 0.3},
  {at: 17.66, src: 'door-creak', vol: 0.2},
  {at: 17.9, src: 'step-wood-1', vol: 0.3},
  {at: 18.45, src: 'step-wood-2', vol: 0.28},
  // split
  {at: 18.95, src: 'ticks-fast', vol: 0.35, dur: 1.25},
  {at: 19.0, src: 'diamonds', vol: 0.18, dur: 1.2},
  // walked out
  {at: 20.18, src: 'door-creak', vol: 0.18},
  {at: 20.5, src: 'step-wood-0', vol: 0.2},
  {at: 20.95, src: 'step-wood-1', vol: 0.2},
  // diamonds
  {at: 21.38, src: 'diamonds', vol: 0.55},
  // gone
  {at: 24.0, src: 'hit-deep', vol: 0.45},
  {at: 23.94, src: 'whoosh-low', vol: 0.3},
  // prints, witnesses
  {at: 24.82, src: 'whoosh-soft', vol: 0.18},
  {at: 26.38, src: 'tick', vol: 0.3},
  // perfect crime
  {at: 28.4, src: 'whoosh-soft', vol: 0.2},
  {at: 29.86, src: 'sting', vol: 0.22},
  // or so he thought: IF's fastback below lights up
  {at: 30.73, src: 'whoosh-low', vol: 0.32},
  {at: 31.85, src: 'car-ignition', vol: 0.26, dur: 1.5},
  // three days later: the knocks (twist hit)
  {at: 34.5, src: 'knock', vol: 1.0},
  {at: 34.5, src: 'hit-deep', vol: 0.75},
  {at: 34.7, src: 'knock', vol: 0.9},
  {at: 34.9, src: 'knock', vol: 1.0},
  // door opens
  {at: 34.98, src: 'latch', vol: 0.45},
  {at: 35.02, src: 'door-creak', vol: 0.25},
  // the reason
  {at: 36.3, src: 'paper', vol: 0.22},
  // flashback
  {at: 36.92, src: 'rewind', vol: 0.55},
  {at: 37.15, src: 'car-arrive', vol: 0.25, dur: 2.4},
  // meter + card
  {at: 41.28, src: 'card-in', vol: 0.5},
  {at: 41.9, src: 'riser', vol: 0.25},
  {at: 42.8, src: 'hit-deep', vol: 0.85},
  {at: 43.6, src: 'beep', vol: 0.55},
  // tiny mistake: evidence pinned
  {at: 44.26, src: 'whoosh-soft', vol: 0.25},
  {at: 45.5, src: 'tock', vol: 0.4},
  // ruined
  {at: 46.33, src: 'whoosh-low', vol: 0.3},
  {at: 46.55, src: 'cuffs', vol: 0.5},
  {at: 48.22, src: 'drop-plip', vol: 0.6},
  {at: 48.3, src: 'hit-deep', vol: 0.55},
  {at: CLOSED_S, src: 'stamp', vol: 1.0},
  {at: CLOSED_S, src: 'sting', vol: 0.45},
];
// steps: thief led out (wet pavement)
for (let i = 0; i < 4; i++) SFX.push({at: 46.6 + i * 0.5, src: `step-snow-${i % 4}`, vol: 0.22});

const inShots = (t: number, keys: (keyof typeof SHOTS)[]) => keys.some((k) => t >= SHOTS[k][0] && t < SHOTS[k][1]);
const RAIN_OUT: (keyof typeof SHOTS)[] = ['store', 'guards', 'walkout', 'witness', 'trace', 'thought', 'ruined'];
const RAIN_FLASH: (keyof typeof SHOTS)[] = ['park', 'meter', 'card'];
const ROOM: (keyof typeof SHOTS)[] = ['plan', 'zero', 'prep', 'shoes', 'clock', 'walkin', 'split', 'pour', 'gone', 'prints', 'perfect', 'knock', 'tiny'];

const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/case003_vo.wav')} volume={1} />
    {/* IF's theme, CASE 003 arrangement: ducking + silence on the knock baked in (scripts/make-music-case003.py) */}
    <Html5Audio src={staticFile('music/case003_music.wav')} volume={1} />
    <Html5Audio src={staticFile('sfx/bed-drone.wav')} loop volume={(fr) => 0.16 * clamp(fr / 30) * clamp((sec(DURATION_S) - fr) / 60) * (fr / 60 > 34.5 && fr / 60 < 44.3 ? 1.4 : 1)} />
    <Html5Audio
      src={staticFile('sfx/bed-rain.wav')}
      loop
      volume={(fr) => {
        const t = fr / 60;
        return (inShots(t, RAIN_OUT) ? 0.3 : inShots(t, RAIN_FLASH) ? 0.18 : 0.06) * clamp(fr / 20) * clamp((sec(DURATION_S) - fr) / 90);
      }}
    />
    <Html5Audio src={staticFile('sfx/bed-room.wav')} loop volume={(fr) => (inShots(fr / 60, ROOM) ? 0.16 : 0.04)} />
    <Html5Audio src={staticFile('sfx/bed-hum.wav')} loop volume={(fr) => (inShots(fr / 60, ['cams', 'walkin', 'split', 'meter', 'card']) ? 0.14 : 0.03)} />
    <Sequence from={sec(35.0)} durationInFrames={sec(2)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.16 * clamp(1 - fr / 120)} />
    </Sequence>
    <Sequence from={sec(46.33)} durationInFrames={sec(5.6)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.2 * clamp(fr / 30) * clamp((336 - fr) / 60)} />
    </Sequence>
    <Sequence from={sec(32.0)} durationInFrames={sec(0.7)}>
      <Html5Audio src={staticFile('sfx/car-idle.wav')} volume={(fr) => 0.14 * clamp(1 - fr / 42)} />
    </Sequence>
    {SFX.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur ?? 4)}>
        <Html5Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------ edit ------------------------------- */
export const Case003: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOT_LIST.map(([k, C]) => {
        const from = sec(SHOTS[k][0]);
        const to = sec(SHOTS[k][1]);
        return (
          <Sequence key={k} from={from} durationInFrames={to - from}>
            <ShotHost C={C} from={from} />
          </Sequence>
        );
      })}
      <FilmFinish f={f} />
      <Captions subs={SUBS} accents={ACCENTS} f={f} />
      {f < CLOSED_AT && <CaseTag n="003" f={f + 20} />}
      <CaseClosed f={f} at={CLOSED_AT} />
      <Sound />
    </AbsoluteFill>
  );
};
