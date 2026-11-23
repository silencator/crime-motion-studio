"""IF's theme: an original slow minor-key waltz in a 1970s mob-film mood (mandolin tremolo, accordion,
muted trumpet, strings, waltz bass). Melody and harmony are written here from scratch: no existing tune.
Everything is synthesised in code (Karplus-Strong plucks, additive reeds/brass, detuned-saw strings, convolution reverb).

  python3 scripts/make-music.py            -> public/music/if-theme-demo.wav (48 kHz 24-bit stereo, ~62 s)
"""
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, lfilter, fftconvolve

SR = 48000
rng = np.random.default_rng(2026)
OUT = 'public/music'
os.makedirs(OUT, exist_ok=True)

BPM = 84
BEAT = 60 / BPM            # 0.714 s
BAR = 3 * BEAT             # 3/4 waltz
NBARS = 28                 # 28 bars = 60 s
TOTAL = NBARS * BAR + 2.5  # + reverb tail
N = int(TOTAL * SR)

lp = lambda f, o=2: butter(o, f, 'low', fs=SR, output='sos')
hp = lambda f, o=2: butter(o, f, 'high', fs=SR, output='sos')
bp = lambda lo, hi, o=2: butter(o, [lo, hi], 'band', fs=SR, output='sos')
hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    e = np.full(n, s, dtype=float)
    a = min(a, n); e[:a] = np.linspace(0, 1, a)
    d = min(d, n - a); e[a:a + d] = np.linspace(1, s, d)
    r = min(r, n); e[n - r:] *= np.linspace(1, 0, r)
    return e


def add(track, x, t0):
    i = int(t0 * SR)
    if i >= len(track): return
    e = min(len(track), i + len(x))
    track[i:e] += x[:e - i]


# ------------------------------------------------------------------ instruments
def pluck(f, dur, bright=0.6, decay=0.9965, body=None):
    """Karplus-Strong string (vectorised with lfilter)."""
    n = int(dur * SR)
    P = max(2, int(round(SR / f - 0.5)))
    exc = rng.uniform(-1, 1, P)
    exc = sosfilt(lp(min(SR / 2 - 100, 1200 + 9000 * bright)), exc)
    x = np.zeros(n); x[:P] = exc
    a = np.zeros(P + 2); a[0] = 1; a[P] = -decay / 2; a[P + 1] = -decay / 2
    y = lfilter([1.0], a, x)
    if body is not None:
        y = sosfilt(body, y) * 0.6 + y * 0.4
    return y * np.exp(-np.arange(n) / SR * 0.8)


def mandolin_trem(m, dur, vel=1.0, rate=12.5):
    """Mandolin tremolo: two detuned courses re-plucked rapidly."""
    out = np.zeros(int((dur + 0.6) * SR))
    t = 0.0; k = 0
    while t < dur:
        a = vel * (0.75 + 0.25 * (k % 2 == 0)) * rng.uniform(0.85, 1.0)
        for det in (-0.0025, 0.0025):
            s = pluck(hz(m) * (1 + det), 0.5, bright=0.5, decay=0.994)
            add(out, s * a * (np.minimum(1, (dur - t) / 0.4) if dur - t < 0.4 else 1), t)
        t += 1 / rate * rng.uniform(0.92, 1.08); k += 1
    return sosfilt(bp(250, 4200), out)


def additive(f_curve, harm, n):
    """Sum of harmonics with a time-varying frequency curve; harm(k) -> amplitude array or scalar."""
    ph = 2 * np.pi * np.cumsum(f_curve) / SR
    y = np.zeros(n)
    for k in range(1, 40):
        if np.max(f_curve) * k > 9000: break
        y += harm(k) * np.sin(k * ph + rng.uniform(0, 6.28))
    return y


def accordion(m, dur, vel=1.0):
    n = int((dur + 0.15) * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for det in (0.0, 0.0035, -0.0031):  # musette tuning (three reeds)
        f = hz(m) * (1 + det) * (1 + 0.0015 * np.sin(2 * np.pi * 4.8 * t))
        y += additive(f, lambda k: (1 / k) * (1.0 if k % 2 else 0.7), n)
    y = sosfilt(lp(3200), y) + sosfilt(bp(900, 2400), y) * 0.25
    bellows = 0.85 + 0.15 * np.sin(np.pi * np.clip(t / max(dur, 0.1), 0, 1))
    return y * env_adsr(n, 0.05, 0.1, 0.85, 0.15) * bellows * vel * 0.25


def muted_trumpet(m, dur, vel=1.0):
    n = int((dur + 0.2) * SR); t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - 0.25) / 0.3, 0, 1)
    f = hz(m) * vib * (1 - 0.01 * np.exp(-t * 30))  # slight scoop into the note
    env = env_adsr(n, 0.06, 0.15, 0.8, 0.18)
    bright = 0.55 + 0.45 * env
    y = additive(f, lambda k: np.exp(-k * (1.25 - 0.55 * bright)), n)
    y = sosfilt(bp(500, 3000, 2), y) * 1.4 + sosfilt(bp(1400, 2200, 2), y) * 0.8  # harmon-mute nasal band
    breath = sosfilt(bp(1500, 5000), rng.standard_normal(n)) * 0.015 * np.exp(-t * 8)
    return (y * env + breath) * vel * 0.22


def strings(ms, dur, vel=1.0, attack=0.45, bright=2600):
    """Section pad / bowed line: several detuned saws per note, slow bow attack, vibrato."""
    n = int((dur + 0.8) * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for m in ms:
        for v in range(5):
            det = (v - 2) * 0.0022 + rng.normal(0, 0.0005)
            f = hz(m) * (1 + det) * (1 + 0.0035 * np.sin(2 * np.pi * (5.3 + v * 0.17) * t + v))
            y += additive(f, lambda k: 1 / k, n) / 5
    y = sosfilt(lp(bright, 2), y)
    e = env_adsr(n, attack, 0.2, 0.9, 0.7)
    return y * e * vel * 0.09


def bass_pizz(m, vel=1.0):
    y = pluck(hz(m), 1.6, bright=0.25, decay=0.998)
    return sosfilt(lp(700), y) * vel * 0.9


def guitar(ms, vel=1.0):
    out = np.zeros(int(0.9 * SR))
    for i, m in enumerate(ms):
        add(out, pluck(hz(m), 0.8, bright=0.45, decay=0.995) * 0.5, i * 0.012)  # tiny strum
    return sosfilt(bp(150, 5000), out) * vel * 0.55


# ------------------------------------------------------------------ score
CH = {
    'Dm': ([50, 53, 57], 38), 'Bb': ([50, 53, 58], 34), 'Gm': ([50, 55, 58], 31),
    'A7': ([49, 52, 55], 33), 'F': ([48, 53, 57], 41),
}
INTRO = ['Dm', 'Bb', 'Gm', 'A7']
A = ['Dm', 'Bb', 'Gm', 'A7', 'Dm', 'F', 'Gm', 'A7']
A2 = ['Dm', 'Bb', 'Gm', 'A7', 'Dm', 'F', 'Gm', 'Dm']
B = ['Bb', 'F', 'Gm', 'A7', 'Dm', 'A7']
END = ['Dm', 'Dm']
CHORDS = INTRO + A + A2 + B + END
assert len(CHORDS) == NBARS

MEL_A = [[(69, 2), (67, .5), (65, .5)], [(65, 1), (64, 1), (62, 1)], [(70, 2), (69, 1)], [(67, 1), (64, 1), (61, 1)],
         [(62, 1), (65, 1), (69, 1)], [(72, 2), (70, .5), (69, .5)], [(67, 1), (70, 1), (64, 1)], [(69, 3)]]
MEL_A2 = MEL_A[:6] + [[(70, 1), (69, 1), (67, 1)], [(65, 1), (64, 1), (62, 1)]]
MEL_B = [[(74, 2), (72, 1)], [(72, 1), (69, 1), (65, 1)], [(67, 1), (70, 1), (74, 1)], [(76, 2), (73, 1)],
         [(74, 1.5), (72, .5), (69, 1)], [(67, 1), (64, 1), (61, 1)]]
INTRO_MEL = [69, 65, 67, 64]

bar_t = lambda b: b * BAR  # b is 0-based
jit = lambda: rng.normal(0, 0.008)

mand = np.zeros(N); acc = np.zeros(N); tpt = np.zeros(N); strl = np.zeros(N); pad = np.zeros(N)
bass = np.zeros(N); gtr = np.zeros(N)


def play_line(track, inst, bars, start_bar, vel=1.0, legato=1.0):
    for i, bar in enumerate(bars):
        t = bar_t(start_bar + i)
        for m, beats in bar:
            add(track, inst(m, beats * BEAT * legato, vel * rng.uniform(0.9, 1.0)), t + jit())
            t += beats * BEAT


# intro: lonely mandolin tremolo over dark low strings
for i, m in enumerate(INTRO_MEL):
    add(mand, mandolin_trem(m, BAR * 0.97, vel=0.8), bar_t(i))
# theme A: accordion; A2: muted trumpet; B: strings lead (+ trumpet an octave down, soft)
play_line(acc, accordion, MEL_A, 4, vel=1.0)
play_line(tpt, muted_trumpet, MEL_A2, 12, vel=1.0, legato=0.95)
play_line(strl, lambda m, d, vel: strings([m], d, vel, attack=0.18, bright=3800) * 2.2, MEL_B, 20, vel=1.0)
play_line(tpt, muted_trumpet, [[(m - 12, b) for m, b in bar] for bar in MEL_B], 20, vel=0.45)
# ending: tremolo on the tonic, fading
add(mand, mandolin_trem(62, BAR * 2 * 0.95, vel=0.75) * np.linspace(1, 0.2, int((BAR * 2 * 0.95 + 0.6) * SR)), bar_t(26))

# harmony: pad all the way (swells in the climax), waltz accompaniment from bar 5 to 26
for b, name in enumerate(CHORDS):
    tones, root = CH[name]
    lvl = 0.55 if b < 4 else 0.7 if b < 12 else 0.9 if b < 20 else 1.25 if b < 26 else 0.7
    add(pad, strings([root + 12] + tones, BAR * 1.02, vel=lvl, attack=0.5 if b < 4 else 0.3, bright=1800), bar_t(b))
    if 4 <= b < 26:
        add(bass, bass_pizz(root, vel=1.0), bar_t(b) + jit())
        for beat in (1, 2):
            add(gtr, guitar([m + 12 for m in tones], vel=0.8 if beat == 1 else 0.65), bar_t(b) + beat * BEAT + jit())
    elif b in (0, 26):
        add(bass, bass_pizz(root, vel=0.8), bar_t(b))

# ------------------------------------------------------------------ mix
def pan(x, p):  # p in [-1, 1]
    l = np.cos((p + 1) * np.pi / 4); r = np.sin((p + 1) * np.pi / 4)
    return np.stack([x * l, x * r], 1)


dry = (pan(mand, -0.25) * 0.5 + pan(acc, 0.1) * 0.42 + pan(tpt, 0.2) * 2.6 + pan(strl, -0.1) * 2.4
       + pan(pad, 0.0) * 0.8 + pan(bass, 0.0) * 1.0 + pan(gtr, 0.3) * 0.6)

# convolution reverb: decaying stereo noise IR (~2.4 s), darker tail
L = int(2.4 * SR); ti = np.arange(L) / SR
ir = np.stack([sosfilt(lp(5000), rng.standard_normal(L)), sosfilt(lp(5000), rng.standard_normal(L))], 1)
ir *= np.exp(-ti * 2.9)[:, None]
ir[:int(0.02 * SR)] = 0  # pre-delay
wet = np.stack([fftconvolve(dry[:, c], ir[:, c])[:N] for c in range(2)], 1)
wet /= np.max(np.abs(wet)) + 1e-9
mix = dry / (np.max(np.abs(dry)) + 1e-9) + wet * 0.38
mix = np.stack([sosfilt(hp(35), mix[:, c]) for c in range(2)], 1)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
fade = np.ones(N); fo = int(2.0 * SR); fade[-fo:] = np.linspace(1, 0, fo) ** 2
mix *= fade[:, None]
mix = mix / np.max(np.abs(mix)) * 10 ** (-1.0 / 20)
sf.write(f'{OUT}/if-theme-demo.wav', mix, SR, subtype='PCM_24')
print('ok', f'{len(mix) / SR:.2f}s')
