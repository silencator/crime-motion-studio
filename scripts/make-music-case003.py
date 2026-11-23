"""CASE 003 arrangement of IF's theme: a heist re-arrangement (E minor, 126 BPM 3/4, pizzicato ostinato, ticking
pluck, accordion -> muted trumpet -> strings), scored to the CASE 003 voice-over timeline:
  0-34.5 s  plays (thins out on "Or so he thought"), HARD CUT to silence on the knock (34.5 s)
  44.35 s   returns softly for "One tiny mistake", resolves on the tonic exactly at the CASE CLOSED stamp (49.4 s)
Ducking is baked in from the voice loudness envelope (public/data/case003.timing.json): -6 dB under every word,
and the whole bed sits ~21 dB under the voice. Instruments come from scripts/make-music.py (same synth voices).
  python3 scripts/make-music-case003.py  ->  public/music/case003_music.wav
"""
import json
import numpy as np
import soundfile as sf
from scipy.signal import sosfilt, fftconvolve

src = open('scripts/make-music.py').read()
g = {}
exec(compile(src[:src.index('# ------------------------------------------------------------------ score')], 'theme-instruments', 'exec'), g)
SR, lp, hp = g['SR'], g['lp'], g['hp']
add = lambda tr, x, t0: g['add'](tr, x, max(0.0, t0))
mandolin_trem, accordion, muted_trumpet, strings, bass_pizz, guitar, pluck = (g[k] for k in ['mandolin_trem', 'accordion', 'muted_trumpet', 'strings', 'bass_pizz', 'guitar', 'pluck'])
rng = np.random.default_rng(303)

DUR = 52.0
CUT = 34.5        # knock: music to silence
CODA = 44.35      # "One tiny mistake"
STAMP = 49.4      # CASE CLOSED
N = int(DUR * SR)
BPM = 126
BEAT = 60 / BPM
BAR = 3 * BEAT    # 1.43 s
jit = lambda: rng.normal(0, 0.006)

# E minor (D-minor theme material transposed up a tone)
CH = {'Em': ([52, 55, 59], 40), 'C': ([52, 55, 60], 36), 'Am': ([52, 57, 60], 33), 'B7': ([51, 54, 57], 35), 'G': ([50, 55, 59], 43)}
PROG = ['Em', 'C', 'Am', 'B7'] * 2 + ['Em', 'G', 'Am', 'B7'] + ['Em', 'C', 'Am', 'B7'] + ['C', 'G', 'Am', 'B7'] + ['Em', 'Em', 'Am', 'Am']
T2 = lambda bars: [[(m + 2, b) for m, b in bar] for bar in bars]
MEL_A = T2([[(69, 2), (67, .5), (65, .5)], [(65, 1), (64, 1), (62, 1)], [(70, 2), (69, 1)], [(67, 1), (64, 1), (61, 1)],
            [(62, 1), (65, 1), (69, 1)], [(72, 2), (70, .5), (69, .5)], [(67, 1), (70, 1), (64, 1)], [(69, 3)]])
MEL_B = T2([[(74, 2), (72, 1)], [(72, 1), (69, 1), (65, 1)], [(67, 1), (70, 1), (74, 1)], [(76, 2), (73, 1)]])

mand = np.zeros(N); acc = np.zeros(N); tpt = np.zeros(N); strl = np.zeros(N); pad = np.zeros(N)
bass = np.zeros(N); gtr = np.zeros(N); tick = np.zeros(N)
bt = lambda b: b * BAR


def line(track, inst, bars, start_bar, vel=1.0, legato=1.0):
    for i, bar in enumerate(bars):
        t = bt(start_bar + i)
        for m, beats in bar:
            if t < CUT - 0.05:
                add(track, inst(m, min(beats * BEAT * legato, CUT - t), vel * rng.uniform(0.9, 1.0)), t + jit())
            t += beats * BEAT


# --- part 1 (0 .. CUT): planning -> heist -> perfect crime ---
for b, name in enumerate(PROG):
    t0 = bt(b)
    if t0 >= CUT: break
    tones, root = CH[name]
    lvl = 0.5 if b < 8 else 0.7 if b < 16 else 1.0 if b < 20 else 0.55
    add(pad, strings([root + 12] + tones, min(BAR * 1.02, CUT - t0), vel=lvl, attack=0.35, bright=1700), t0)
    if b < 20:
        # pizzicato waltz bass (root on 1, fifth on 3 from bar 4) — the "planning" pulse
        add(bass, bass_pizz(root, vel=0.9), t0 + jit())
        if b >= 4: add(bass, bass_pizz(root + 7, vel=0.55), t0 + 2 * BEAT + jit())
        if b >= 4:
            for beat in (1, 2):
                add(gtr, guitar([m + 12 for m in tones], vel=0.55 if beat == 1 else 0.45), t0 + beat * BEAT + jit())
        # clock-like ticking pluck on every beat (high E), from the cameras on
        if b >= 6:
            for beat in range(3):
                add(tick, pluck(659.3 * (2 if beat == 0 else 1), 0.18, bright=0.9, decay=0.99), t0 + beat * BEAT + jit())
# intro mandolin tremolo motif (bars 0-3), accordion theme (8-11), trumpet answer (12-15), strings climax (16-19)
for i, m in enumerate([71, 67, 69, 66]):
    add(mand, mandolin_trem(m, BAR * 0.95, vel=0.6), bt(i))
line(acc, accordion, MEL_A[:4], 8, vel=0.9)
line(tpt, muted_trumpet, MEL_A[4:], 12, vel=0.9, legato=0.95)
line(strl, lambda m, d, vel: strings([m], d, vel, attack=0.15, bright=3600) * 2.0, MEL_B, 16, vel=1.0)
line(tpt, muted_trumpet, [[(m - 12, b) for m, b in bar] for bar in MEL_B], 16, vel=0.4)
# "the perfect crime": smug high tremolo (bars 20-21), then only the pad holding Am under "or so he thought"
add(mand, mandolin_trem(83, BAR * 0.95, vel=0.55), bt(20))
add(mand, mandolin_trem(79, BAR * 0.95, vel=0.5), bt(21))
# fade the pad out over "or so he thought" toward the knock, then hard cut
part1 = np.ones(N)
a, b_ = int(30.8 * SR), int(CUT * SR)
part1[a:b_] = np.linspace(1, 0.35, b_ - a)
part1[b_:] = 0

# --- coda (CODA .. end): "One tiny mistake. One perfect crime. Ruined." -> tonic on the stamp ---
coda = {k: np.zeros(N) for k in ['mand', 'pad', 'bass', 'strl']}
add(coda['pad'], strings([45, 52, 57, 60], 2.1, vel=0.5, attack=0.6, bright=1500), CODA)
add(coda['mand'], mandolin_trem(72, 1.0, vel=0.45), CODA + 0.1)
add(coda['mand'], mandolin_trem(71, 0.9, vel=0.45), CODA + 1.1)
add(coda['pad'], strings([47, 51, 54, 57], 2.9, vel=0.55, attack=0.5, bright=1500), CODA + 2.05)
add(coda['mand'], mandolin_trem(69, 1.0, vel=0.45), CODA + 2.1)
add(coda['mand'], mandolin_trem(66, 1.6, vel=0.4), CODA + 3.1)
# resolution on the stamp: E minor, low bass + full strings + tremolo E, ringing out
add(coda['bass'], bass_pizz(28, vel=1.2), STAMP)
add(coda['bass'], bass_pizz(40, vel=0.8), STAMP + 0.01)
add(coda['pad'], strings([40, 52, 55, 59, 64], DUR - STAMP - 0.3, vel=1.0, attack=0.04, bright=2200), STAMP)
add(coda['mand'], mandolin_trem(76, DUR - STAMP - 0.5, vel=0.5), STAMP + 0.02)


def pan(x, p):
    l = np.cos((p + 1) * np.pi / 4); r = np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l, x * r], 1)


dry1 = (pan(mand, -0.25) * 0.5 + pan(acc, 0.1) * 0.42 + pan(tpt, 0.2) * 2.4 + pan(strl, -0.1) * 2.2 + pan(pad, 0) * 0.8
        + pan(bass, 0) * 1.0 + pan(gtr, 0.3) * 0.5 + pan(tick, 0.45) * 0.25) * part1[:, None]
dry2 = pan(coda['mand'], -0.2) * 0.5 + pan(coda['pad'], 0) * 0.9 + pan(coda['bass'], 0) * 1.1
dry = dry1 + dry2

L = int(2.2 * SR); ti = np.arange(L) / SR
ir = np.stack([sosfilt(lp(5000), rng.standard_normal(L)), sosfilt(lp(5000), rng.standard_normal(L))], 1) * np.exp(-ti * 3.2)[:, None]
ir[:int(0.02 * SR)] = 0
wet = np.stack([fftconvolve(dry[:, c], ir[:, c])[:N] for c in range(2)], 1)
wet /= np.max(np.abs(wet)) + 1e-9
mix = dry / (np.max(np.abs(dry)) + 1e-9) + wet * 0.32
# hard silence after the knock (reverb tail cut short: 80 ms), until the coda
gate = np.ones(N); c0 = int(CUT * SR); c1 = int((CUT + 0.08) * SR); gate[c0:c1] = np.linspace(1, 0, c1 - c0); gate[c1:int((CODA - 0.05) * SR)] = 0
mix *= gate[:, None]
mix = np.stack([sosfilt(hp(60), mix[:, c]) for c in range(2)], 1)
# keep the voice band clear: gentle dip 1.5-4 kHz (where speech intelligibility lives)
from scipy.signal import butter
dip = butter(2, [1500, 4000], 'band', fs=SR, output='sos')
mix = mix - 0.45 * np.stack([sosfilt(dip, mix[:, c]) for c in range(2)], 1)
fo = int(1.6 * SR); mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 2

# --- ducking from the voice envelope (60 Hz), attack 50 ms / release 350 ms ---
tm = json.load(open('public/data/case003.timing.json'))
env = np.array(tm['envelope'], float)
speech = (env > 0.06).astype(float)
duck = np.zeros_like(speech); v = 0.0
for i, s in enumerate(speech):
    v += (s - v) * (0.33 if s > v else 0.048)
    duck[i] = v
gain = 1 - 0.5 * duck  # -6 dB under words
gain_s = np.interp(np.arange(N) / SR, np.arange(len(gain)) / 60.0, gain, right=1.0)
mix *= gain_s[:, None]

# --- level: music RMS ~21 dB below the voice's speech RMS ---
vo, vsr = sf.read('public/audio/case003_vo.wav')
vo = vo if vo.ndim == 1 else vo.mean(1)
vrms = np.sqrt(np.mean(vo[np.abs(vo) > 0.02] ** 2))
seg = mix[:int(CUT * SR)]
mrms = np.sqrt(np.mean(seg[np.abs(seg).max(1) > 1e-4] ** 2))
mix *= (vrms * 10 ** (-21 / 20)) / (mrms + 1e-12)
print('peak', np.abs(mix).max(), 'voice rms', vrms)
sf.write('public/music/case003_music.wav', mix, SR, subtype='PCM_24')
print('ok', f'{len(mix) / SR:.2f}s')
