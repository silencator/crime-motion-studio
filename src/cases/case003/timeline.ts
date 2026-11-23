import type {Accent, Sub} from '../../kit/captions';

/**
 * CASE 003 · "The Perfect Crime": word times from public/data/case003.transcript.json (sherpa-onnx),
 * checked against Arian's script. Voice ends ≈49.15 s ("Ruined."); stamp right after, hold to 52 s.
 */
export const DURATION_S = 52.0;
export const CLOSED_S = 49.4;

/** Shot boundaries (seconds), cut on the phrase starts of the voice-over. */
export const SHOTS = {
  plan: [0, 2.72], // He planned it for an entire year.
  store: [2.72, 4.42], // One jewellery store.
  watch: [4.42, 5.4], // Ten minutes.
  zero: [5.4, 7.15], // Zero mistakes.
  guards: [7.15, 8.66], // He studied the guards.
  cams: [8.66, 10.0], // Tracked the cameras.
  prep: [10.0, 13.55], // Prepared everything. Gloves. A mask.
  shoes: [13.55, 15.98], // Shoes two sizes too big.
  clock: [15.98, 17.62], // At 3:12 AM,
  walkin: [17.62, 18.95], // he walked in.
  split: [18.95, 20.18], // Ten minutes later,
  walkout: [20.18, 21.36], // he walked out.
  pour: [21.36, 23.96], // Two million dollars in diamonds.
  gone: [23.96, 24.82], // Gone.
  prints: [24.82, 25.88], // No fingerprints.
  witness: [25.88, 27.05], // No witnesses.
  trace: [27.05, 28.42], // No trace.
  perfect: [28.42, 30.75], // It was the perfect crime.
  thought: [30.75, 32.7], // Or so he thought.
  knock: [32.7, 34.98], // Three days later, the police knocked
  doorway: [34.98, 35.86], // on his door.
  reason: [35.86, 36.98], // And the reason?
  park: [36.98, 40.03], // Before the robbery, he'd parked across the street.
  meter: [40.03, 41.86], // And to pay for parking…
  card: [41.86, 44.28], // He used his own bank card.
  tiny: [44.28, 46.33], // One tiny mistake.
  ruined: [46.33, 52.0], // One perfect crime. Ruined. + CASE CLOSED
} as const;

export const SUBS: Sub[] = [
  {t0: 2.77, t1: 4.3, text: 'One jewellery store.'},
  {t0: 4.47, t1: 5.36, text: 'Ten minutes.'},
  {t0: 7.22, t1: 8.62, text: 'He studied the guards.'},
  {t0: 8.7, t1: 9.96, text: 'Tracked the cameras.'},
  {t0: 10.07, t1: 11.7, text: 'Prepared everything.'},
  {t0: 11.97, t1: 13.5, text: 'Gloves. A mask.'},
  {t0: 13.61, t1: 15.86, text: 'Shoes two sizes too big.'},
  {t0: 16.06, t1: 17.56, text: 'At 3:12 AM,'},
  {t0: 17.68, t1: 18.8, text: 'he walked in.'},
  {t0: 18.99, t1: 20.12, text: 'Ten minutes later,'},
  {t0: 20.21, t1: 21.28, text: 'he walked out.'},
  {t0: 21.39, t1: 23.88, text: 'Two million dollars in diamonds.'},
  {t0: 24.02, t1: 24.76, text: 'Gone.', red: ['gone']},
  {t0: 24.85, t1: 25.86, text: 'No fingerprints.'},
  {t0: 25.93, t1: 27.0, text: 'No witnesses.'},
  {t0: 27.1, t1: 28.34, text: 'No trace.'},
  {t0: 30.81, t1: 32.6, text: 'Or so he thought.'},
  {t0: 32.75, t1: 34.0, text: 'Three days later,'},
  {t0: 34.03, t1: 35.76, text: 'the police knocked on his door.', red: ['knocked']},
  {t0: 35.9, t1: 36.92, text: 'And the reason?'},
  {t0: 37.03, t1: 38.2, text: 'Before the robbery,'},
  {t0: 38.23, t1: 39.98, text: "he'd parked across the street."},
  {t0: 40.09, t1: 41.82, text: 'And to pay for parking…'},
  {t0: 44.32, t1: 46.25, text: 'One tiny mistake.'},
  {t0: 46.38, t1: 48.22, text: 'One perfect crime.'},
];

export const ACCENTS: Accent[] = [
  {
    t0: 0.0,
    t1: 2.66,
    y: 1250,
    lines: [
      {text: 'HE PLANNED IT FOR', size: 34, kind: 'caps', at: 0.02},
      {text: 'an entire year.', size: 128, at: 1.05},
    ],
  },
  {
    t0: 5.42,
    t1: 7.12,
    y: 1260,
    drift: 0.6,
    lines: [
      {text: 'Zero', size: 190, at: 5.44},
      {text: 'mistakes.', size: 110, at: 6.1},
    ],
  },
  {
    t0: 28.45,
    t1: 30.72,
    y: 1250,
    drift: 0.7,
    lines: [
      {text: 'IT WAS', size: 34, kind: 'caps', at: 28.48},
      {text: 'the perfect', size: 120, at: 28.92},
      {text: 'crime.', size: 150, at: 29.82},
    ],
  },
  {
    t0: 41.9,
    t1: 44.24,
    y: 1290,
    drift: 0.5,
    lines: [
      {text: 'HE USED', size: 34, kind: 'caps', at: 41.92},
      {text: 'his own', size: 120, at: 42.56},
      {text: 'bank card.', size: 140, at: 43.1, color: '#FF3B30', glow: 'rgba(255,40,20,0.55)'},
    ],
  },
  {
    t0: 48.3,
    t1: 49.36,
    y: 1250,
    drift: 0.4,
    lines: [{text: 'Ruined.', size: 200, at: 48.32, color: '#FF3B30', glow: 'rgba(255,40,20,0.6)'}],
  },
];
