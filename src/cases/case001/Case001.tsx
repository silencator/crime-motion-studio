import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CaseClosed, CaseTag, Captions} from '../../kit/captions';
import {FilmFinish} from '../../kit/fx';
import {clamp, sec} from '../../kit/time';
import {ACCENTS, DURATION_S, SHOTS, SUBS} from './timeline';
import * as Sh from './shots';

export const CASE001_FRAMES = sec(DURATION_S);
const CLOSED_AT = sec(41.12);

const SHOT_LIST: [keyof typeof SHOTS, React.FC<Sh.ShotP>][] = [
  ['hook', Sh.Hook],
  ['mansion', Sh.MansionExt],
  ['lineup', Sh.LineupShot],
  ['body', Sh.BodyShot],
  ['walkIn', Sh.WalkIn],
  ['asked', Sh.IFAsked],
  ['question', Sh.IFQuestion],
  ['silence', Sh.Silence],
  ['whisperPre', Sh.WhisperPre],
  ['whisper', Sh.Whisper],
  ['wait', Sh.IFWait],
  ['sheet', Sh.SheetInsert],
  ['report', Sh.ReportInsert],
  ['turn', Sh.TurnOTS],
  ['never', Sh.IFNever],
  ['froze', Sh.Froze],
  ['reveal', Sh.Reveal],
  ['outro', Sh.Outro],
];

const ShotHost: React.FC<{C: React.FC<Sh.ShotP>; from: number}> = ({C, from}) => {
  const f = useCurrentFrame();
  return <C f={f} g={f + from} />;
};

/* ------------------------------ sound ------------------------------ */
type Cue = {at: number; src: string; vol: number; dur?: number};
const SFX: Cue[] = [
  // hook
  {at: 0.04, src: 'lighter-open', vol: 0.75},
  {at: 0.13, src: 'lighter-flame', vol: 0.7},
  {at: 0.62, src: 'inhale', vol: 0.35},
  {at: 1.3, src: 'whoosh-low', vol: 0.5},
  {at: 1.35, src: 'flash', vol: 0.4},
  // lineup light-ups
  {at: 3.0, src: 'whoosh-soft', vol: 0.35},
  {at: 3.2, src: 'tick', vol: 0.6},
  {at: 3.98, src: 'tick', vol: 0.6},
  {at: 5.02, src: 'tick', vol: 0.6},
  {at: 5.8, src: 'whoosh-low', vol: 0.3},
  // body
  {at: 7.6, src: 'door-creak', vol: 0.45},
  {at: 7.65, src: 'whoosh-low', vol: 0.45},
  // walk in
  {at: 9.8, src: 'whoosh-soft', vol: 0.3},
  // question, silence clock
  {at: 13.9, src: 'whoosh-soft', vol: 0.25},
  ...[16.0, 16.5, 17.0, 17.5].map((t, i) => ({at: t, src: i % 2 ? 'tock' : 'tick', vol: 0.55})),
  // whisper
  {at: 17.95, src: 'riser', vol: 0.55},
  {at: 19.5, src: 'whoosh-fast', vol: 0.45},
  {at: 19.9, src: 'hit-deep', vol: 0.95},
  // wait
  {at: 21.56, src: 'whoosh-fast', vol: 0.4},
  {at: 24.33, src: 'whoosh-soft', vol: 0.3},
  {at: 25.95, src: 'paper', vol: 0.6},
  {at: 27.2, src: 'paper', vol: 0.35},
  {at: 28.2, src: 'whoosh-low', vol: 0.4},
  {at: 29.95, src: 'hit-deep', vol: 0.35},
  // froze
  {at: 33.0, src: 'heartbeat', vol: 0.9},
  {at: 33.72, src: 'heartbeat', vol: 0.8},
  {at: 33.96, src: 'whoosh-low', vol: 0.4},
  {at: 35.5, src: 'riser', vol: 0.4},
  {at: 36.28, src: 'hit-deep', vol: 1.0},
  // outro
  {at: 37.38, src: 'whoosh-soft', vol: 0.35},
  {at: 41.12, src: 'stamp', vol: 1.0},
  {at: 41.12, src: 'sting', vol: 0.55},
];
// footsteps: corridor (wood) and street (snow), on the walk-cycle contacts (every 33 frames)
for (let i = 0; i < 4; i++) SFX.push({at: 9.95 + i * 0.55, src: `step-wood-${i % 3}`, vol: 0.5});
for (let i = 0; i < 7; i++) SFX.push({at: 37.55 + i * 0.55, src: `step-snow-${i % 4}`, vol: 0.45});

const inShots = (t: number, keys: (keyof typeof SHOTS)[]) => keys.some((k) => t >= SHOTS[k][0] && t < SHOTS[k][1]);
const EXTERIOR: (keyof typeof SHOTS)[] = ['mansion', 'outro'];

const Sound: React.FC = () => (
  <>
    <Html5Audio src={staticFile('audio/case001.mp3')} volume={1} />
    <Html5Audio src={staticFile('sfx/bed-drone.wav')} volume={(fr) => 0.2 * clamp(fr / 30) * clamp((sec(DURATION_S) - fr) / 60)} />
    <Html5Audio src={staticFile('sfx/bed-wind.wav')} volume={(fr) => (inShots(fr / 60, EXTERIOR) ? 0.42 : 0.07)} />
    <Html5Audio src={staticFile('sfx/bed-hum.wav')} volume={(fr) => (inShots(fr / 60, EXTERIOR) ? 0.16 : 0.05)} />
    <Html5Audio src={staticFile('sfx/bed-room.wav')} volume={(fr) => (inShots(fr / 60, EXTERIOR) || fr < 81 ? 0 : 0.22)} />
    <Sequence from={sec(1.3)} durationInFrames={sec(8)}>
      <Html5Audio src={staticFile('sfx/siren-far.wav')} volume={(fr) => 0.28 * (fr < 100 ? 1 : Math.max(0, 1 - (fr - 100) / 200))} />
    </Sequence>
    {SFX.map((c, i) => (
      <Sequence key={i} from={sec(c.at)} durationInFrames={sec(c.dur ?? 4)}>
        <Html5Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------ edit ------------------------------- */
export const Case001: React.FC = () => {
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
      {f >= 20 && f < CLOSED_AT && <CaseTag n="001" f={f} />}
      <CaseClosed f={f} at={CLOSED_AT} />
      <Sound />
    </AbsoluteFill>
  );
};
