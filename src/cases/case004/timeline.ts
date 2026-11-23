import type {Accent, Sub} from '../../kit/captions';

/**
 * CASE 004 · "The Proof Is in the Snow": word times from public/data/case004.transcript.json
 * (sherpa-onnx), corrected against cases/case-004/script.txt. Voice ends 40.59 s.
 */
export const DURATION_S = 43.0;
export const CLOSED_S = 39.27; // stamp lands on "CASE"

export const SHOTS = {
  hook: [0, 2.5],
  snowHook: [2.5, 4.42],
  ifAsk: [4.42, 5.92],
  facade: [5.92, 7.62],
  clock: [7.62, 8.72],
  safe: [8.72, 10.4],
  window: [10.4, 12.5],
  ownerA: [12.5, 14.52],
  ownerB: [14.52, 16.4],
  stepOut: [16.4, 18.52],
  alley: [18.52, 20.74],
  crouch: [20.74, 22.06],
  smooth: [22.06, 23.4],
  topDown: [23.4, 25.84],
  glass: [25.84, 29.22],
  ifEyes: [29.22, 30.6],
  burst: [30.6, 32.06],
  noThief: [32.06, 33.66],
  robbed: [33.66, 35.58],
  claim: [35.58, 37.08],
  outro: [37.08, 43.0],
} as const;

export const SUBS: Sub[] = [
  {t0: 2.56, t1: 4.35, text: 'The proof is in the snow.'},
  {t0: 4.48, t1: 5.5, text: 'Can you catch it?'},
  {t0: 5.96, t1: 7.5, text: 'His pawn shop was robbed'},
  {t0: 7.52, t1: 8.6, text: 'at 2 AM.'},
  {t0: 8.76, t1: 10.25, text: 'The safe was empty.'},
  {t0: 10.42, t1: 12.4, text: 'The back window was smashed.', red: ['smashed']},
  {t0: 12.53, t1: 14.45, text: '- The thief came in through the window.'},
  {t0: 14.57, t1: 16.2, text: '- I heard the glass break.'},
  {t0: 16.45, t1: 18.4, text: 'Detective IF stepped outside.'},
  {t0: 18.57, t1: 20.6, text: 'The snow had stopped at midnight.'},
  {t0: 20.79, t1: 21.95, text: 'Under the window,'},
  {t0: 22.07, t1: 23.2, text: 'it was smooth.'},
  {t0: 23.43, t1: 24.45, text: 'Untouched.'},
  {t0: 25.89, t1: 27.3, text: 'And the broken glass'},
  {t0: 27.33, t1: 29.0, text: 'lay on top of the snow.', red: ['top']},
  {t0: 29.26, t1: 30.55, text: 'The window was smashed'},
  {t0: 32.13, t1: 33.5, text: 'There was no thief.'},
  {t0: 33.74, t1: 35.45, text: 'He robbed his own shop,'},
  {t0: 35.62, t1: 37.0, text: 'for the insurance.', red: ['insurance']},
];

export const ACCENTS: Accent[] = [
  {
    t0: 0.0,
    t1: 2.4,
    y: 1230,
    lines: [
      {text: 'THIS MAN JUST', size: 34, kind: 'caps', at: 0.02},
      {text: 'lied', size: 190, at: 0.9},
      {text: 'to the police.', size: 84, at: 1.5},
    ],
  },
  {
    t0: 24.6,
    t1: 25.82,
    y: 1290,
    drift: 0.5,
    lines: [{text: 'No footprints.', size: 124, at: 24.62}],
  },
  {
    t0: 30.6,
    t1: 32.0,
    y: 1260,
    drift: 0.6,
    lines: [
      {text: 'FROM THE', size: 36, kind: 'caps', at: 30.62},
      {text: 'inside.', size: 200, at: 30.98, color: '#FF3B30', glow: 'rgba(255,40,20,0.55)'},
    ],
  },
  {
    t0: 37.12,
    t1: 39.2,
    y: 1230,
    drift: 0.7,
    lines: [
      {text: 'THE PROOF WAS', size: 34, kind: 'caps', at: 37.14},
      {text: 'in the snow.', size: 130, at: 38.05},
    ],
  },
];
