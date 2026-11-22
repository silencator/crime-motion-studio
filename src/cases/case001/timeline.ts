import type {Accent, Sub} from '../../kit/captions';

/**
 * CASE 001 · "The Killer's One Mistake": word times come from public/data/case001.transcript.json
 * (sherpa-onnx), corrected against cases/case-001/script.txt.
 */
export const DURATION_S = 43.5;

/** Shot boundaries (seconds), cut on the phrase starts of the voice-over. */
export const SHOTS = {
  hook: [0, 1.35],
  mansion: [1.35, 3.05],
  lineup: [3.05, 7.65],
  body: [7.65, 9.85],
  walkIn: [9.85, 12.5],
  asked: [12.5, 13.95],
  question: [13.95, 16.0],
  silence: [16.0, 17.62],
  whisperPre: [17.62, 19.5],
  whisper: [19.5, 21.58],
  wait: [21.58, 24.35],
  sheet: [24.35, 25.95],
  report: [25.95, 28.2],
  turn: [28.2, 30.0],
  never: [30.0, 32.15],
  froze: [32.15, 33.98],
  reveal: [33.98, 37.4],
  outro: [37.4, 43.5],
} as const;

export const SUBS: Sub[] = [
  {t0: 2.98, t1: 3.7, text: 'His wife,'},
  {t0: 3.74, t1: 4.55, text: 'his driver,'},
  {t0: 4.58, t1: 5.8, text: 'and his assistant'},
  {t0: 5.82, t1: 6.62, text: 'were questioned'},
  {t0: 6.64, t1: 7.6, text: 'outside the room.'},
  {t0: 8.21, t1: 9.75, text: 'The body was still covered,'},
  {t0: 9.81, t1: 11.2, text: "and police hadn't revealed"},
  {t0: 11.22, t1: 12.4, text: 'how he died.', red: ['died']},
  {t0: 12.54, t1: 13.9, text: 'Detective asked,'},
  {t0: 13.98, t1: 14.84, text: '- Does anyone know'},
  {t0: 14.86, t1: 15.9, text: 'what happened?'},
  {t0: 16.12, t1: 17.45, text: 'Nobody answered.'},
  {t0: 17.67, t1: 18.6, text: 'Then the assistant'},
  {t0: 18.63, t1: 19.45, text: 'whispered,'},
  {t0: 21.64, t1: 22.5, text: 'Wait—'},
  {t0: 22.55, t1: 24.2, text: 'what had he just revealed?'},
  {t0: 24.42, t1: 25.9, text: 'No one had seen the body.'},
  {t0: 25.98, t1: 27.12, text: 'No one had mentioned'},
  {t0: 27.16, t1: 28.1, text: 'a knife.', red: ['knife']},
  {t0: 28.25, t1: 29.9, text: 'Detective turned to him.'},
  {t0: 32.21, t1: 33.9, text: 'The assistant froze.'},
  {t0: 33.99, t1: 34.9, text: 'He knew'},
  {t0: 34.98, t1: 35.66, text: 'because he was'},
  {t0: 35.7, t1: 37.3, text: 'the one who killed him.', red: ['killed']},
];

export const ACCENTS: Accent[] = [
  {
    t0: 0.0,
    t1: 2.9,
    y: 1240,
    lines: [
      {text: 'A MILLIONAIRE WAS', size: 34, kind: 'caps', at: 0.02},
      {text: 'found dead', size: 150, at: 0.8},
      {text: 'in his mansion.', size: 72, at: 1.85},
    ],
  },
  {
    t0: 19.5,
    t1: 21.5,
    y: 1230,
    drift: 0.6,
    lines: [
      {text: '- HE WAS', size: 34, kind: 'caps', at: 19.52},
      {text: 'stabbed', size: 190, at: 19.86, color: '#FF3B30', glow: 'rgba(255,40,20,0.55)'},
      {text: 'in the back.', size: 80, at: 20.36},
    ],
  },
  {
    t0: 30.0,
    t1: 32.05,
    y: 1330,
    lines: [
      {text: '- I never said', size: 96, at: 30.02},
      {text: 'he was stabbed.', size: 112, at: 30.72},
    ],
  },
  {
    t0: 37.42,
    t1: 41.0,
    y: 1230,
    drift: 0.7,
    lines: [
      {text: 'SOMETIMES,', size: 34, kind: 'caps', at: 37.44},
      {text: 'the smallest mistake', size: 92, at: 38.25},
      {text: 'reveals everything.', size: 104, at: 39.75},
    ],
  },
];
