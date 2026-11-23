import type {Accent, Sub} from '../../kit/captions';

/**
 * CASE 004 · "The Proof Is in the Snow" (retention-trial cut, CLAUDE.md §17).
 * Voice = public/audio/case004_vo.wav: Arian's take with the pauses tightened (scripts/tighten-vo.py), words untouched.
 * Word times: public/data/case004_vo.transcript.json, corrected against cases/case-004/script.txt.
 */
export const DURATION_S = 36.9;
export const CLOSED_S = 35.13; // stamp lands on "CASE"
export const HIT_S = 27.88; // "inside": glass bursts, music cuts

export const SHOTS = {
  hookFace: [0, 0.92], // 3 cuts in the first 2.5 s
  hookGlass: [0.92, 1.72],
  hookLights: [1.72, 2.46],
  snowGlide: [2.46, 4.05],
  lens: [4.05, 4.96],
  facade: [4.96, 6.62],
  clock: [6.62, 7.6],
  safe: [7.6, 9.02],
  window: [9.02, 10.9],
  ownerA: [10.9, 12.88],
  ownerB: [12.88, 14.48],
  stepOut: [14.48, 16.4],
  alley: [16.4, 18.52],
  crouch: [18.52, 19.76],
  smooth: [19.76, 20.86],
  topDown: [20.86, 23.06],
  shard: [23.06, 26.1],
  lookUp: [26.1, 27.72],
  burst: [27.72, 28.72],
  ghost: [28.72, 30.08],
  stash: [30.08, 31.9],
  typed: [31.9, 33.14],
  car: [33.14, 36.9],
} as const;

export const SUBS: Sub[] = [
  // hook: at most one short line (≤ 5 words) at a time, no title over it
  {t0: 0.02, t1: 0.94, text: 'This man just lied'},
  {t0: 0.96, t1: 2.36, text: 'to the police.', red: ['police']},
  {t0: 2.5, t1: 3.98, text: 'The proof is in the snow.'},
  {t0: 4.1, t1: 4.92, text: 'Can you catch it?'},
  {t0: 5.0, t1: 6.6, text: 'His pawn shop was robbed'},
  {t0: 6.62, t1: 7.5, text: 'at 2 AM.'},
  {t0: 7.65, t1: 8.92, text: 'The safe was empty.'},
  {t0: 9.07, t1: 10.82, text: 'The back window was smashed.'},
  {t0: 10.95, t1: 12.82, text: '- The thief came in through the window.'},
  {t0: 12.95, t1: 14.4, text: '- I heard the glass break.'},
  {t0: 14.54, t1: 16.32, text: 'Detective IF stepped outside.'},
  {t0: 16.45, t1: 18.42, text: 'The snow had stopped at midnight.'},
  {t0: 18.57, t1: 19.7, text: 'Under the window,'},
  {t0: 19.78, t1: 20.8, text: 'it was smooth.'},
  {t0: 20.9, t1: 21.8, text: 'Untouched.'},
  {t0: 23.11, t1: 24.45, text: 'And the broken glass'},
  {t0: 24.5, t1: 26.0, text: 'lay on top of the snow.', red: ['top']},
  {t0: 26.16, t1: 27.45, text: 'The window was smashed'},
  {t0: 28.77, t1: 30.02, text: 'There was no thief.'},
  {t0: 30.13, t1: 31.85, text: 'He robbed his own shop,'},
  {t0: 31.94, t1: 33.05, text: 'for the insurance.', red: ['insurance']},
];

export const ACCENTS: Accent[] = [
  {
    t0: 21.86,
    t1: 23.0,
    y: 1290,
    drift: 0.5,
    lines: [{text: 'No footprints.', size: 124, at: 21.88}],
  },
  {
    t0: 27.46,
    t1: 28.7,
    y: 1260,
    drift: 0.6,
    lines: [
      {text: 'FROM THE', size: 36, kind: 'caps', at: 27.48},
      {text: 'inside.', size: 200, at: 27.86, color: '#F6EFD8', glow: 'rgba(255,200,120,0.6)'},
    ],
  },
  {
    t0: 33.18,
    t1: 35.08,
    y: 1240,
    drift: 0.7,
    lines: [
      {text: 'THE PROOF WAS', size: 34, kind: 'caps', at: 33.2},
      {text: 'in the snow.', size: 130, at: 34.0},
    ],
  },
];
