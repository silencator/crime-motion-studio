import type {Accent, Sub} from '../../kit/captions';

/**
 * CASE 002 · "The Missing Painting": word times from public/data/case002.transcript.json (sherpa-onnx),
 * checked against cases script (Arian's final text). Voice ends 37.88 s; stamp on "closed" (37.11).
 */
export const DURATION_S = 40.0;
export const CLOSED_S = 37.14;

/** Shot boundaries (seconds), cut on the phrase starts of the voice-over. */
export const SHOTS = {
  frame: [0, 1.95], // A priceless painting disappeared…
  museum: [1.95, 4.15], // …from a museum overnight. (IF's fastback pulls up)
  guard: [4.15, 5.95], // The night guard insisted
  log: [5.95, 7.45], // nobody had entered the building.
  walk: [7.45, 9.85], // Detective asked one question:
  ask: [9.85, 12.15], // "Did you notice anything unusual?"
  nothing: [12.15, 14.85], // "Nothing… except the thief must have used
  backdoor: [14.85, 16.2], // the back entrance."
  stopped: [16.2, 17.75], // Detective stopped.
  why: [17.75, 19.55], // "Why the back entrance?
  told: [19.55, 22.35], // We haven't told anyone how the painting disappeared."
  silent: [22.35, 24.3], // The guard went silent.
  thief: [24.3, 26.6], // Only the thief could know that.
  never: [26.6, 29.6], // Because the painting never left the building.
  hidden: [29.6, 32.3], // He'd hidden it by the back door himself.
  red: [32.3, 34.5], // He wasn't protecting the museum.
  secret: [34.5, 36.65], // He was protecting his secret.
  outro: [36.65, 40.0], // Case closed.
} as const;

export const SUBS: Sub[] = [
  {t0: 4.12, t1: 5.34, text: 'The night guard insisted'},
  {t0: 5.38, t1: 7.35, text: 'nobody had entered the building.'},
  {t0: 7.43, t1: 9.5, text: 'Detective asked one question:'},
  {t0: 9.87, t1: 10.62, text: '- Did you notice'},
  {t0: 10.67, t1: 12.0, text: 'anything unusual?'},
  {t0: 12.23, t1: 13.2, text: '- Nothing…'},
  {t0: 13.26, t1: 14.26, text: '- except the thief'},
  {t0: 14.3, t1: 16.05, text: 'must have used the back entrance.'},
  {t0: 16.23, t1: 17.6, text: 'Detective stopped.'},
  {t0: 17.78, t1: 19.4, text: '- Why the back entrance?'},
  {t0: 19.54, t1: 20.58, text: "- We haven't told anyone"},
  {t0: 20.62, t1: 22.25, text: 'how the painting disappeared.'},
  {t0: 22.4, t1: 24.15, text: 'The guard went silent.'},
  {t0: 26.64, t1: 27.72, text: 'Because the painting'},
  {t0: 27.76, t1: 29.45, text: 'never left the building.', red: ['never']},
  {t0: 29.62, t1: 30.3, text: "He'd hidden it"},
  {t0: 30.34, t1: 32.15, text: 'by the back door himself.'},
  {t0: 32.36, t1: 33.25, text: "He wasn't protecting"},
  {t0: 33.28, t1: 34.4, text: 'the museum.'},
];

export const ACCENTS: Accent[] = [
  {
    t0: 0.0,
    t1: 3.75,
    y: 1240,
    lines: [
      {text: 'A PRICELESS PAINTING', size: 34, kind: 'caps', at: 0.02},
      {text: 'disappeared', size: 150, at: 1.22},
      {text: 'from a museum overnight.', size: 64, at: 1.9},
    ],
  },
  {
    t0: 24.3,
    t1: 26.55,
    y: 1230,
    drift: 0.6,
    lines: [
      {text: 'ONLY THE', size: 34, kind: 'caps', at: 24.3},
      {text: 'thief', size: 200, at: 24.82, color: '#FF3B30', glow: 'rgba(255,40,20,0.55)'},
      {text: 'could know that.', size: 80, at: 25.3},
    ],
  },
  {
    t0: 34.5,
    t1: 36.62,
    y: 1240,
    drift: 0.7,
    lines: [
      {text: 'HE WAS PROTECTING', size: 34, kind: 'caps', at: 34.52},
      {text: 'his secret.', size: 150, at: 35.4},
    ],
  },
];
