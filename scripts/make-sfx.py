"""CRIME IF sound kit: synthesises every ambience bed and effect into public/sfx/ (48 kHz, 24-bit WAV).
Run once (or after edits): python3 scripts/make-sfx.py
Everything is generated in code, so there are no licensing questions. Technique adapted from finance/football studios."""
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, lfilter

SR = 48000
rng = np.random.default_rng(1977)
OUT = 'public/sfx'
os.makedirs(OUT, exist_ok=True)

t = lambda d: np.arange(int(d * SR)) / SR
noise = lambda d: rng.standard_normal(int(d * SR))
lp = lambda f, o=2: butter(o, f, 'low', fs=SR, output='sos')
hp = lambda f, o=2: butter(o, f, 'high', fs=SR, output='sos')
bp = lambda lo, hi, o=2: butter(o, [lo, hi], 'band', fs=SR, output='sos')
norm = lambda x, db: x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)


def smooth_rand(d, rate, seed_scale=1.0):
    """Slow random control signal 0..1 (cubic-interpolated random points at `rate` Hz)."""
    n = int(d * SR); k = max(4, int(d * rate) + 4)
    pts = rng.uniform(0, 1, k) * seed_scale
    x = np.linspace(0, k - 3, n)
    i = np.floor(x).astype(int); f = x - i
    p0, p1, p2, p3 = pts[i], pts[i + 1], pts[i + 2], pts[np.minimum(i + 3, k - 1)]
    return p1 + 0.5 * f * (p2 - p0 + f * (2 * p0 - 5 * p1 + 4 * p2 - p3 + f * (3 * (p1 - p2) + p3 - p0)))


def bp_var(x, fc, q=4.0, blocks=200):
    """Band-pass with time-varying centre frequency (overlap-add)."""
    n = len(x); y = np.zeros(n); blk = n // blocks; win = np.hanning(blk * 2)
    for b in range(blocks):
        a = max(0, b * blk - blk // 2); seg = x[a:a + blk * 2]
        c = float(fc[min(n - 1, a + blk)]); bw = c / q
        sos = butter(2, [max(20, c - bw / 2), min(SR / 2 - 200, c + bw / 2)], 'band', fs=SR, output='sos')
        y[a:a + len(seg)] += sosfilt(sos, seg) * win[:len(seg)]
    return y


def fade(x, i=0.004, o=0.02):
    a = max(2, int(SR * i)); b = max(2, int(SR * o))
    x = x.copy(); x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b); return x


def loopable(x, xf=1.5):
    """Crossfade tail into head so a bed loops seamlessly."""
    n = int(xf * SR); h = x[:n].copy(); tl = x[-n:]
    r = np.linspace(0, 1, n)
    return np.concatenate([tl * (1 - r) + h * r, x[n:-n]])


def save(name, x, stereo=False):
    if stereo and x.ndim == 1:
        d = int(0.011 * SR); x = np.stack([x, np.roll(x, d) * 0.96], 1)
    sf.write(f'{OUT}/{name}.wav', x.astype(np.float64), SR, subtype='PCM_24')
    print('ok', name, f'{len(x) / SR:.2f}s')


# ---------------- beds ----------------
D = 48
# Howling cold wind: gusting band noise + whistling resonances.
g = smooth_rand(D, 0.35) ** 1.6
w = bp_var(noise(D), 260 + 900 * smooth_rand(D, 0.25), q=1.6) * (0.25 + g)
whistle = bp_var(noise(D), 700 + 900 * smooth_rand(D, 0.18), q=28) * (0.05 + g ** 2) * 2.2
rumble = sosfilt(lp(140), noise(D)) * (0.4 + g) * 1.4
L = w + whistle + rumble
R = np.roll(w, 900) * 0.9 + bp_var(noise(D), 650 + 800 * smooth_rand(D, 0.2), q=26) * (0.05 + g ** 2) * 2 + np.roll(rumble, 300)
save('bed-wind', np.stack([loopable(norm(L, -6)), loopable(norm(R, -6))], 1))

# Dark drone: detuned low saws through a slowly breathing low-pass.
x = t(D); dr = np.zeros(len(x))
for f, a in [(36.7, 1), (36.9, .8), (55.0, .55), (73.4, .3), (110.2, .12)]:
    ph = 2 * np.pi * f * x + rng.uniform(0, 6)
    dr += a * (2 * ((ph / (2 * np.pi)) % 1) - 1)
dr = sosfilt(lp(220, 4), dr) * (0.7 + 0.3 * smooth_rand(D, 0.1))
dr += sosfilt(bp(180, 420), noise(D)) * 0.05
save('bed-drone', loopable(norm(dr, -4)), stereo=True)

# Industrial hum: mains harmonics + distant machinery rumble.
hm = sum(a * np.sin(2 * np.pi * f * x) for f, a in [(50, 1), (100, .5), (150, .3), (200, .12), (300, .05)])
hm = hm * (0.85 + 0.15 * smooth_rand(D, 0.3)) + sosfilt(lp(90), noise(D)) * 1.5
save('bed-hum', loopable(norm(hm, -8)), stereo=True)

# Interior room tone: air + far heating pipes.
rt = sosfilt(bp(60, 900), noise(D)) * 0.5 + sosfilt(lp(70), noise(D)) * 1.2
save('bed-room', loopable(norm(rt, -10)), stereo=True)

# Distant police siren (muffled two-tone wail behind walls).
x = t(12); f = 620 + 180 * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 0.55 * x)))
f = lfilter([0.002], [1, -0.998], f) / 1.0
ph = 2 * np.pi * np.cumsum(f) / SR
s = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)
s = sosfilt(lp(1400, 4), s) * (0.6 + 0.4 * smooth_rand(12, 0.5))
save('siren-far', fade(norm(s, -10), 0.6, 1.5), stereo=True)

# ---------------- one-shots ----------------
# Lighter: metallic click-scrape (open), wheel spark, flame whoosh, cap clink.
x = t(0.18)
clk = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(3200, 1, 90), (4700, .7, 120), (6900, .4, 160), (2100, .5, 70)])
clk += sosfilt(hp(2500), noise(0.18)) * np.exp(-x * 60) * .5
save('lighter-open', fade(norm(clk, -4)))
x = t(0.9)
spark = sosfilt(hp(3000), noise(0.9)) * (np.exp(-x * 40)) * 0.9
flame = sosfilt(bp(200, 2200), noise(0.9)) * np.minimum(1, x * 25) * np.exp(-x * 2.6)
crack = np.zeros(len(x)); idx = rng.integers(int(.15 * SR), len(x), 30); crack[idx] = rng.uniform(.2, 1, 30)
crack = sosfilt(hp(1500), crack) * 3
save('lighter-flame', fade(norm(spark + flame + crack, -4)))
x = t(0.12)
cl = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(2500, 1, 70), (3900, .6, 90), (5800, .3, 120)])
save('lighter-close', fade(norm(cl, -6)))
# Inhale (cigarette drag) + exhale.
x = t(1.3); e = np.sin(np.pi * np.minimum(1, x / 1.3)) ** 1.5
inh = bp_var(noise(1.3), 900 + 1600 * x / 1.3, q=2.2) * e
crk = np.zeros(len(x)); idx = rng.integers(0, len(x), 70); crk[idx] = rng.uniform(.1, .6, 70); crk = sosfilt(hp(2500), crk) * 2 * e
save('inhale', fade(norm(inh + crk, -8), .05, .1))
x = t(1.8); e = np.sin(np.pi * np.minimum(1, x / 1.8)) ** 0.8 * np.exp(-x * .6)
save('exhale', fade(norm(bp_var(noise(1.8), 1400 - 700 * x / 1.8, q=1.5) * e, -10), .05, .2))

# Footsteps: snow crunch (several variants) and heel on parquet.
for k in range(4):
    d = 0.32; x = t(d)
    g = np.zeros(len(x)); idx = np.sort(rng.integers(0, int(.22 * SR), 260)); g[idx] = rng.uniform(.2, 1, 260)
    cr = sosfilt(bp(500, 5000), g + noise(d) * .08) * np.exp(-x * 9)
    th = sosfilt(lp(160), noise(d)) * np.exp(-x * 30) * 3
    save(f'step-snow-{k}', fade(norm(cr + th, -7 - k * .6)))
for k in range(3):
    d = 0.35; x = t(d)
    heel = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * dd) for f, a, dd in [(190 + k * 15, 1, 40), (420, .5, 60), (1150, .25, 90)])
    heel += sosfilt(bp(1500, 6000), noise(d)) * np.exp(-x * 120) * .5
    save(f'step-wood-{k}', fade(norm(heel, -8 - k * .5)))

# Door creak: frequency-wobbling resonant scrape.
x = t(1.6); f0 = 240 + 140 * smooth_rand(1.6, 6) + 120 * x
ph = 2 * np.pi * np.cumsum(f0) / SR
saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
imp = (rng.uniform(0, 1, len(x)) < 0.02).astype(float)
cr = sosfilt(bp(300, 2400), saw * (0.6 + 0.4 * smooth_rand(1.6, 25)) + imp * 2) * np.sin(np.pi * x / 1.6) ** .6
save('door-creak', fade(norm(cr, -9), .05, .2))

# Paper rustle.
x = t(0.7); e = smooth_rand(0.7, 30) ** 3 * np.sin(np.pi * x / .7)
save('paper', fade(norm(sosfilt(bp(1200, 9000), noise(.7)) * e, -9)))

# Whooshes (cuts / camera moves).
for name, d, f0, f1, pk in [('whoosh-soft', .6, 300, 2400, -10), ('whoosh-fast', .35, 500, 3800, -9), ('whoosh-low', .8, 150, 800, -7)]:
    x = t(d); e = np.sin(np.pi * x / d) ** 2
    save(name, fade(norm(bp_var(noise(d), f0 * (f1 / f0) ** (x / d), q=1.3, blocks=60) * e, pk)))

# Deep hit (twist): sub drop + distorted body + noise burst + long tail.
x = t(3.2)
sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-x * 9)) / SR) * np.exp(-x * 1.1)
body = np.tanh(3 * np.sin(2 * np.pi * np.cumsum(70 + 150 * np.exp(-x * 25)) / SR)) * np.exp(-x * 4)
burst = sosfilt(lp(3000), noise(3.2)) * np.exp(-x * 14) * .6
tail = sosfilt(bp(60, 400), noise(3.2)) * np.exp(-x * 1.4) * .25
save('hit-deep', fade(norm(sub * 1.2 + body * .6 + burst + tail, -1), .001, .3), stereo=True)

# Riser (tension swell into a twist): rising filtered noise + rising tone.
d = 2.0; x = t(d); e = (x / d) ** 2.2
ris = bp_var(noise(d), 300 * (14 ** (x / d)), q=3, blocks=80) * e
tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (x / d * 1.5)) / SR) * e * .3
save('riser', fade(norm(ris + tone, -8), .05, .01), stereo=True)

# Clock tick-tock.
x = t(.06)
tk = lambda f: sosfilt(bp(f, f * 3), noise(.06)) * np.exp(-x * 160) + np.sin(2 * np.pi * f * 1.7 * x) * np.exp(-x * 220) * .5
save('tick', fade(norm(tk(1800), -10)))
save('tock', fade(norm(tk(1300), -11)))

# Heartbeat (lub-dub).
x = t(.9)
beat = lambda off, a: np.sin(2 * np.pi * 52 * np.clip(x - off, 0, None)) * np.exp(-np.clip(x - off, 0, None) * 18) * (x >= off) * a
save('heartbeat', fade(norm(sosfilt(lp(140), beat(0, 1) + beat(.17, .7)), -4)))

# Stamp slam: wooden thud + rubber-on-paper slap + desk rattle.
x = t(1.0)
th = np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-x * 40)) / SR) * np.exp(-x * 12)
slap = sosfilt(bp(400, 5000), noise(1.0)) * np.exp(-x * 45)
rat = sosfilt(bp(1800, 5000), noise(1.0)) * np.exp(-x * 9) * smooth_rand(1.0, 40) * .25
save('stamp', fade(norm(th * 1.3 + slap * .8 + rat, -1), .0005, .1), stereo=True)

# Sting tone for the end card: low bell + air.
x = t(4.0)
bell = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(73.4, 1, .7), (146.8, .4, 1.1), (220.6, .25, 1.4), (311, .1, 2)])
save('sting', fade(norm(bell, -6), .002, .5), stereo=True)

# Camera / shutter-like flash pop for police-light hits.
x = t(.25)
save('flash', fade(norm(sosfilt(hp(2000), noise(.25)) * np.exp(-x * 30), -12)))

# ---------------- added for CASE 004 (glass, safe, flashlight) ----------------
# Glass shatter: low thump + bright noise crack + a shower of short resonant shard pings.
d = 1.6; x = t(d)
thump = np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-x * 30)) / SR) * np.exp(-x * 14)
crack = sosfilt(bp(1800, 12000), noise(d)) * np.exp(-x * 26)
pings = np.zeros(len(x))
for i in range(90):
    on = rng.uniform(0, 0.55) ** 1.6; fq = rng.uniform(2200, 9500); dk = rng.uniform(25, 70)
    xx = np.clip(x - on, 0, None)
    pings += np.sin(2 * np.pi * fq * xx) * np.exp(-xx * dk) * (x >= on) * rng.uniform(0.2, 1)
save('glass-break', fade(norm(thump * .9 + crack * .7 + pings * .35, -3), .0005, .2), stereo=True)

# Glass tinkle: a few shards settling on snow (soft, sparse pings).
d = 1.4; x = t(d); tk2 = np.zeros(len(x))
for i in range(14):
    on = rng.uniform(0, 1.0); fq = rng.uniform(3000, 8000); xx = np.clip(x - on, 0, None)
    tk2 += np.sin(2 * np.pi * fq * xx) * np.exp(-xx * rng.uniform(30, 60)) * (x >= on) * rng.uniform(0.2, 1)
save('glass-tinkle', fade(norm(tk2, -16), .002, .2), stereo=True)

# Safe door: heavy steel clunk + low hinge groan.
d = 1.5; x = t(d)
clunk = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * dd) for f, a, dd in [(95, 1, 9), (230, .6, 14), (610, .35, 22), (1330, .15, 30)])
clunk += sosfilt(bp(500, 3000), noise(d)) * np.exp(-x * 60) * .6
f0 = 120 + 50 * smooth_rand(d, 5) + 40 * x; ph = 2 * np.pi * np.cumsum(f0) / SR
groan = sosfilt(bp(150, 1200), 2 * ((ph / (2 * np.pi)) % 1) - 1) * np.clip((x - .25) / .3, 0, 1) * np.exp(-np.clip(x - .25, 0, None) * 2.2)
save('safe-clank', fade(norm(clunk + groan * .35, -4), .0005, .2))

# Flashlight switch click (two-stage plastic click, low and soft).
d = .25; x = t(d)
ck = lambda off, f: np.sin(2 * np.pi * f * np.clip(x - off, 0, None)) * np.exp(-np.clip(x - off, 0, None) * 160) * (x >= off)
save('flash-click', fade(norm(sosfilt(lp(5000), ck(0, 1500) + ck(.035, 1100) * .7), -12)))
