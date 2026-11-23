"""CASE 004 arrangement of Theme 99 (IF's theme): a "frost waltz" (C minor, 78 BPM 3/4). Cold music-box intro,
mandolin-tremolo theme over a pizzicato waltz bass, muted trumpet takes the answer as IF steps outside, strings swell
under the glass, HARD CUT to silence on "inside" (twist hit), back for "The proof was in the snow", resolving on the
tonic exactly at the CASE CLOSED stamp. Ducking baked from the voice envelope; bed ~21 dB under the voice.
  python3 scripts/make-music-case004.py  ->  public/music/case004_music.wav
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import sosfilt, fftconvolve, butter

src = open('scripts/make-music.py').read()
g = {}
exec(compile(src[:src.index('# ------------------------------------------------------------------ score')], 'theme-instruments', 'exec'), g)
SR, lp, hp = g['SR'], g['lp'], g['hp']
add = lambda tr, x, t0: g['add'](tr, x, max(0.0, t0))
mandolin_trem, accordion, muted_trumpet, strings, bass_pizz, guitar, pluck = (g[k] for k in ['mandolin_trem', 'accordion', 'muted_trumpet', 'strings', 'bass_pizz', 'guitar', 'pluck'])
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(404)

DUR = 36.9
CUT = 27.88       # "inside": music to silence
CODA = 33.16      # "The proof was in the snow"
STAMP = 35.13     # CASE CLOSED
N = int(DUR * SR)
BPM = 78
BEAT = 60 / BPM
BAR = 3 * BEAT    # 2.31 s
jit = lambda: rng.normal(0, 0.007)
bt = lambda b: b * BAR

# C minor (theme material in D minor, down a whole tone)
CH = {'Cm': ([48, 51, 55], 36), 'Ab': ([48, 51, 56], 32), 'Fm': ([48, 53, 56], 29), 'G7': ([47, 50, 53], 31), 'Eb': ([46, 51, 55], 39)}
PROG = ['Cm', 'Ab', 'Fm', 'G7', 'Cm', 'Ab', 'Fm', 'G7', 'Cm', 'Eb', 'Fm', 'G7', 'Fm']
D2 = lambda bars: [[(m - 2, b) for m, b in bar] for bar in bars]
MEL_A = D2([[(69, 2), (67, .5), (65, .5)], [(65, 1), (64, 1), (62, 1)], [(70, 2), (69, 1)], [(67, 1), (64, 1), (61, 1)],
            [(62, 1), (65, 1), (69, 1)], [(72, 2), (70, .5), (69, .5)], [(67, 1), (70, 1), (64, 1)], [(69, 3)]])
INTRO = [67, 63, 65, 62]  # music-box fragments (C minor)

box = np.zeros(N); mand = np.zeros(N); tpt = np.zeros(N); pad = np.zeros(N); bass = np.zeros(N); acc = np.zeros(N)


def line(track, inst, bars, start_bar, vel=1.0, legato=1.0):
    for i, bar in enumerate(bars):
        t = bt(start_bar + i)
        for m, beats in bar:
            if t < CUT - 0.05:
                add(track, inst(m, min(beats * BEAT * legato, CUT - t), vel * rng.uniform(0.9, 1.0)), t + jit())
            t += beats * BEAT


musicbox = lambda m, d, vel=1.0: pluck(hz(m), min(d + 1.2, 2.5), bright=0.95, decay=0.9985) * vel
# --- part 1 (0 .. CUT) ---
for b, name in enumerate(PROG):
    t0 = bt(b)
    if t0 >= CUT: break
    tones, root = CH[name]
    lvl = 0.45 if b < 4 else 0.65 if b < 8 else 0.95
    add(pad, strings([root + 12] + tones, min(BAR * 1.02, CUT - t0), vel=lvl, attack=0.5, bright=1500 if b < 8 else 2100), t0)
    if b >= 2:
        add(bass, bass_pizz(root, vel=0.9), t0 + jit())
        if b >= 4: add(bass, bass_pizz(root + 7, vel=0.5), t0 + 2 * BEAT + jit())
    if b >= 4 and b < 12:
        for beat in (1, 2):
            add(acc, accordion(tones[beat] + 12, BEAT * 0.8, vel=0.35), t0 + beat * BEAT + jit())
# music-box intro: one high note per beat 1 + an echo an octave up (cold, sparse)
for i, m in enumerate(INTRO):
    add(box, musicbox(m + 12, BEAT * 2, 0.9), bt(i) + 0.02)
    add(box, musicbox(m + 24, BEAT, 0.45), bt(i) + 2 * BEAT)
# theme: mandolin tremolo bars 4-7, muted trumpet answer bars 8-11 (IF outside), music box doubles the last phrase
line(mand, lambda m, d, vel: mandolin_trem(m, d, vel), MEL_A[:4], 4, vel=0.75)
line(tpt, muted_trumpet, MEL_A[4:], 8, vel=0.95, legato=0.95)
line(box, lambda m, d, vel: musicbox(m + 12, d, vel * 0.5), MEL_A[4:], 8)
# tension into the twist: rising tremolo on the top of Fm, bar 12
add(mand, mandolin_trem(68, CUT - bt(12), vel=0.6), bt(12))
part1 = np.ones(N); c0 = int(CUT * SR); part1[c0:] = 0

# --- coda: "The proof was in the snow" -> C minor on the stamp ---
coda = {k: np.zeros(N) for k in ['box', 'mand', 'pad', 'bass']}
add(coda['pad'], strings([41, 48, 53, 56], 2.0, vel=0.5, attack=0.5, bright=1500), CODA)          # Fm
add(coda['box'], musicbox(80, 1.0, 0.6), CODA + 0.05)
add(coda['box'], musicbox(79, 1.0, 0.55), CODA + 0.85)
add(coda['pad'], strings([43, 47, 50, 53], STAMP - CODA - 1.9, vel=0.55, attack=0.4, bright=1500), CODA + 1.9)  # G7
add(coda['mand'], mandolin_trem(74, STAMP - CODA - 1.95, vel=0.45), CODA + 1.95)
add(coda['bass'], bass_pizz(24, vel=1.2), STAMP)
add(coda['bass'], bass_pizz(36, vel=0.8), STAMP + 0.01)
add(coda['pad'], strings([36, 48, 51, 55, 60], DUR - STAMP - 0.2, vel=1.0, attack=0.04, bright=2200), STAMP)
add(coda['mand'], mandolin_trem(72, DUR - STAMP - 0.4, vel=0.5), STAMP + 0.02)
add(coda['box'], musicbox(84, 1.5, 0.6), STAMP + 0.03)


def pan(x, p):
    l = np.cos((p + 1) * np.pi / 4); r = np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l, x * r], 1)


dry1 = (pan(box, 0.35) * 0.35 + pan(mand, -0.25) * 0.55 + pan(tpt, 0.2) * 2.2 + pan(pad, 0) * 0.9 + pan(bass, 0) * 1.0 + pan(acc, -0.1) * 0.35) * part1[:, None]
dry2 = pan(coda['box'], 0.35) * 0.35 + pan(coda['mand'], -0.2) * 0.5 + pan(coda['pad'], 0) * 0.9 + pan(coda['bass'], 0) * 1.1
dry = dry1 + dry2

L = int(2.6 * SR); ti = np.arange(L) / SR
ir = np.stack([sosfilt(lp(5000), rng.standard_normal(L)), sosfilt(lp(5000), rng.standard_normal(L))], 1) * np.exp(-ti * 2.8)[:, None]
ir[:int(0.02 * SR)] = 0
wet = np.stack([fftconvolve(dry[:, c], ir[:, c])[:N] for c in range(2)], 1)
wet /= np.max(np.abs(wet)) + 1e-9
mix = dry / (np.max(np.abs(dry)) + 1e-9) + wet * 0.36
gate = np.ones(N); c1 = int((CUT + 0.06) * SR); gate[c0:c1] = np.linspace(1, 0, c1 - c0); gate[c1:int((CODA - 0.05) * SR)] = 0
mix *= gate[:, None]
mix = np.stack([sosfilt(hp(60), mix[:, c]) for c in range(2)], 1)
dip = butter(2, [1500, 4000], 'band', fs=SR, output='sos')
mix = mix - 0.45 * np.stack([sosfilt(dip, mix[:, c]) for c in range(2)], 1)
fo = int(1.0 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2

tm = json.load(open('public/data/case004_vo.timing.json'))
env = np.array(tm['envelope'], float)
speech = (env > 0.06).astype(float)
duck = np.zeros_like(speech); v = 0.0
for i, s in enumerate(speech):
    v += (s - v) * (0.33 if s > v else 0.048)
    duck[i] = v
gain_s = np.interp(np.arange(N) / SR, np.arange(len(duck)) / 60.0, 1 - 0.5 * duck, right=1.0)
mix *= gain_s[:, None]

vo, vsr = sf.read('public/audio/case004_vo.wav')
vo = vo if vo.ndim == 1 else vo.mean(1)
vrms = np.sqrt(np.mean(vo[np.abs(vo) > 0.02] ** 2))
seg = mix[:c0]
mrms = np.sqrt(np.mean(seg[np.abs(seg).max(1) > 1e-4] ** 2))
mix *= (vrms * 10 ** (-21 / 20)) / (mrms + 1e-12)
print('peak', np.abs(mix).max(), 'voice rms', vrms)
sf.write('public/music/case004_music.wav', mix, SR, subtype='PCM_24')
print('ok', f'{len(mix) / SR:.2f}s')
