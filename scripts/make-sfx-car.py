"""IF's car sound kit: classic V8 muscle-car (cross-plane burble) + door thunk + ignition, and a key-ring jingle.
Run once: python3 scripts/make-sfx-car.py   (writes public/sfx/car-*.wav, keys.wav; 48 kHz 24-bit)
Synthesised: firing pulses at 4 per crank revolution with the uneven cross-plane loudness pattern (the "lope"),
through exhaust resonances + soft saturation. RPM curves drive idle / arrive / depart."""
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(1967)
OUT = 'public/sfx'
os.makedirs(OUT, exist_ok=True)
t = lambda d: np.arange(int(d * SR)) / SR
noise = lambda d: rng.standard_normal(int(d * SR))
lp = lambda f, o=2: butter(o, f, 'low', fs=SR, output='sos')
hp = lambda f, o=2: butter(o, f, 'high', fs=SR, output='sos')
bp = lambda lo, hi, o=2: butter(o, [lo, hi], 'band', fs=SR, output='sos')
norm = lambda x, db: x / (np.max(np.abs(x)) + 1e-9) * 10 ** (db / 20)


def fade(x, i=0.004, o=0.02):
    a = max(2, int(SR * i)); b = max(2, int(SR * o))
    x = x.copy(); x[:a] *= np.linspace(0, 1, a); x[-b:] *= np.linspace(1, 0, b); return x


def save(name, x, stereo=True):
    if stereo and x.ndim == 1:
        d = int(0.009 * SR); x = np.stack([x, np.roll(x, d) * 0.95], 1)
    sf.write(f'{OUT}/{name}.wav', x.astype(np.float64), SR, subtype='PCM_24')
    print('ok', name, f'{len(x) / SR:.2f}s')


# cross-plane V8 firing loudness pattern (banks alternate unevenly → burble)
PATTERN = np.array([1.0, 0.62, 0.9, 0.55, 0.95, 0.7, 0.82, 0.6])


def v8(rpm, load, crackle=0.0):
    """rpm, load: per-sample arrays. Returns mono engine + exhaust."""
    n = len(rpm)
    out = np.zeros(n)
    k_len = int(0.06 * SR)
    kx = np.arange(k_len) / SR
    i = 0; cyl = 0
    while i < n:
        r = max(500.0, rpm[i]); L = load[i]
        # one firing pulse: low thump + noisy blast, decay faster at high rpm
        dec = 55 + r / 40
        f0 = 38 + r / 55
        pulse = (np.sin(2 * np.pi * f0 * kx) * 1.0 + rng.standard_normal(k_len) * (0.35 + 0.5 * L)) * np.exp(-kx * dec)
        amp = PATTERN[cyl % 8] * (0.55 + 0.6 * L) * (1 + rng.normal(0, 0.08))
        e = min(n, i + k_len)
        out[i:e] += pulse[:e - i] * amp
        i += int(SR * 60 / (r * 4) * (1 + rng.normal(0, 0.015)))
        cyl += 1
    body = sosfilt(lp(420, 3), out) * 1.4 + sosfilt(bp(70, 160), out) * 1.2 + sosfilt(bp(500, 1800), out) * 0.12 * (0.3 + load)
    body = np.tanh(body * 1.6)
    if crackle > 0:  # exhaust pops on overrun
        pops = (rng.uniform(0, 1, n) < crackle / SR * (1 - load)).astype(float) * rng.uniform(0.4, 1.0, n)
        pk = np.exp(-np.arange(int(0.012 * SR)) / SR * 400)
        body += np.convolve(pops, pk)[:n] * sosfilt(bp(250, 1600), rng.standard_normal(n)) * 0.35
    return sosfilt(lp(3000, 4), body)  # keep it a low rumble: no hiss under the voice


def curve(d, pts):
    """Piecewise-smooth curve from [(time, value)…]."""
    x = t(d); ts, vs = zip(*pts)
    y = np.interp(x, ts, vs)
    return sosfilt(lp(6, 1), y - y[0]) + y[0]


# idle loop (4 s)
d = 4.0
idle = v8(np.full(int(d * SR), 760.0) + 25 * np.sin(2 * np.pi * 0.7 * t(d)), np.full(int(d * SR), 0.15))
save('car-idle', fade(norm(idle, -8), .05, .3))

# arrive: rolling in at 2,200 rpm, off throttle with crackle, brake, settle to idle (3.2 s); gain swells as it nears
d = 3.2
rpm = curve(d, [(0, 2300), (0.6, 2000), (1.4, 1200), (1.9, 820), (d, 760)])
load = curve(d, [(0, 0.45), (0.5, 0.1), (d, 0.15)])
x = v8(rpm, load, crackle=26) * np.interp(t(d), [0, 0.8, 1.6, d], [0.35, 0.85, 1.0, 0.9])
squeal = sosfilt(bp(900, 1800), noise(d)) * np.exp(-((t(d) - 1.5) / 0.18) ** 2) * 0.02
save('car-arrive', fade(norm(x + squeal, -6), .2, .4))

# depart: idle, blip, launch to 3,800 rpm with growl, shift, fade into the distance (4.5 s)
d = 4.5
rpm = curve(d, [(0, 760), (0.25, 780), (0.45, 1900), (0.75, 1100), (1.0, 1500), (2.2, 3800), (2.35, 2600), (3.6, 3600), (d, 3400)])
load = curve(d, [(0, 0.15), (0.4, 0.9), (0.7, 0.2), (1.0, 1.0), (2.25, 1.0), (2.3, 0.3), (2.5, 1.0), (d, 1.0)])
x = v8(rpm, load, crackle=40) * np.interp(t(d), [0, 1.2, 2.6, d], [0.9, 1.0, 0.7, 0.18])
save('car-depart', fade(norm(x, -5), .02, .6))

# ignition: starter crank (whirr) then catch + idle (2.4 s)
d = 2.4; x = t(d)
crank = np.sin(2 * np.pi * (9 * x) ) ** 8 * sosfilt(bp(150, 900), noise(d)) * (x < 0.9)
rpm = curve(d, [(0, 600), (0.9, 600), (1.05, 1600), (1.6, 900), (d, 760)])
eng = v8(rpm, curve(d, [(0, 0.1), (1.0, 0.6), (1.6, 0.15), (d, 0.15)])) * (x > 0.85)
save('car-ignition', fade(norm(crank * 0.8 + eng, -6), .01, .3))

# door thunk
d = 0.6; x = t(d)
th = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * dd) for f, a, dd in [(85, 1, 18), (140, .6, 26), (310, .3, 40)])
latch = sosfilt(bp(1500, 5000), noise(d)) * np.exp(-((x - 0.012) / 0.004) ** 2) * .5
save('car-door', fade(norm(th + latch, -3), .001, .1))

# key-ring jingle (soft, low in the mix)
d = 0.8; x = t(d); y = np.zeros(len(x))
for k in range(14):
    at = rng.uniform(0, 0.5); f = rng.uniform(2800, 6200)
    e = np.exp(-np.clip(x - at, 0, None) * rng.uniform(18, 40)) * (x >= at)
    y += np.sin(2 * np.pi * f * (x - at)) * e * rng.uniform(.3, 1)
save('keys', fade(norm(sosfilt(lp(7000), y), -14), .002, .1))
