"""CASE 003 additions to the sound kit (rain, knocks, card terminal, diamonds, stopwatch, cuffs, rewind, servo).
Same helpers as make-sfx.py. Run: python3 scripts/make-sfx-case003.py"""
import numpy as np
from scipy.signal import sosfilt
import importlib.util, sys, io, contextlib

# reuse helpers from make-sfx.py without re-rendering its sounds: exec only the header (up to first save call)
src = open('scripts/make-sfx.py').read()
head = src[:src.index("save('bed-wind'")]
head = head[:head.rindex('\n# ')] if '\n# ' in head[-400:] else head
g = {}
exec(compile(head.split('\nL = ')[0], 'make-sfx-head', 'exec'), g)
SR, t, noise, lp, hp, bp, norm, fade, loopable, save, smooth_rand, bp_var, rng = (g[k] for k in ['SR', 't', 'noise', 'lp', 'hp', 'bp', 'norm', 'fade', 'loopable', 'save', 'smooth_rand', 'bp_var', 'rng'])

# --- rain bed: dense soft drops + low wash (no harsh hiss: low-passed at 6 kHz, presence cut) ---
d = 24
wash = sosfilt(bp(300, 5000), noise(d)) * (0.6 + 0.4 * smooth_rand(d, 0.3))
drops = np.zeros(int(d * SR))
for _ in range(int(d * 90)):
    i = rng.integers(0, len(drops) - 2000); L = rng.integers(200, 900)
    drops[i:i + L] += np.exp(-np.arange(L) / (L / 5)) * rng.uniform(0.2, 1) * np.sin(np.arange(L) * rng.uniform(0.15, 0.5))
rain = sosfilt(lp(6000), wash * 0.5 + sosfilt(bp(500, 4000), drops) * 1.4)
rain = sosfilt(hp(120), rain)
L_ = loopable(norm(rain, -8)); R_ = loopable(norm(np.roll(rain, 9000) * 0.95, -8))
save('bed-rain', np.stack([L_, R_], 1))

# --- heavy knock on a padded door (one knock; placed 3x in the edit) ---
x = t(0.45)
thud = np.sin(2 * np.pi * (70 + 40 * np.exp(-x * 30)) * x) * np.exp(-x * 14)
knk = sosfilt(bp(150, 1800), noise(0.45)) * np.exp(-x * 45)
rattle = sosfilt(bp(1500, 4500), noise(0.45)) * np.exp(-((x - 0.03) ** 2) / 0.0008) * 0.15
save('knock', fade(norm(thud * 1.2 + knk * 0.8 + rattle, -2), 0.0005, 0.1), stereo=True)

# --- card terminal: card slide + two-tone beep (approved) ---
x = t(0.5)
slide = sosfilt(bp(800, 3500), noise(0.5)) * np.clip(np.sin(np.pi * x / 0.35), 0, 1) * (x < 0.35) * 0.25
clunk = np.sin(2 * np.pi * 180 * x) * np.exp(-(x - 0.34).clip(0) * 60) * (x > 0.34) * 0.6
save('card-in', fade(norm(slide + clunk, -8)))
x = t(0.5)
beep = (np.sin(2 * np.pi * 1320 * x) * (x < 0.12) + np.sin(2 * np.pi * 1760 * x) * ((x > 0.16) & (x < 0.34))) * 0.5
save('beep', fade(norm(sosfilt(lp(5000), beep), -12), 0.002, 0.05))

# --- diamonds: glassy clinks pouring (many tiny bells) ---
d = 2.6; out = np.zeros(int(d * SR))
for i in range(70):
    t0 = 0.02 + (i / 70) ** 1.3 * 2.0 + rng.uniform(0, 0.04)
    f0 = rng.uniform(2600, 5200); L = int(0.25 * SR); xx = np.arange(L) / SR
    s = (np.sin(2 * np.pi * f0 * xx) + 0.5 * np.sin(2 * np.pi * f0 * 2.76 * xx)) * np.exp(-xx * rng.uniform(25, 45)) * rng.uniform(0.3, 1)
    a = int(t0 * SR); out[a:a + L] += s[:len(out) - a]
save('diamonds', fade(norm(sosfilt(lp(7000), out), -9), 0.001, 0.3), stereo=True)

# --- single diamond drop in a puddle: tiny clink + plip ---
x = t(0.6)
plip = np.sin(2 * np.pi * (900 + 1400 * np.exp(-x * 40)) * x) * np.exp(-x * 30)
clink = np.sin(2 * np.pi * 4200 * x) * np.exp(-x * 40) * 0.5
save('drop-plip', fade(norm(plip + clink, -8)))

# --- stopwatch click, fast ticking ---
x = t(0.12)
clk = sosfilt(bp(2000, 6000), noise(0.12)) * np.exp(-x * 120) + np.sin(2 * np.pi * 900 * x) * np.exp(-x * 80) * 0.6
save('watch-click', fade(norm(clk, -8)))
d = 1.4; out = np.zeros(int(d * SR))
for i in range(int(d * 14)):
    a = int(i / 14 * SR); L = int(0.03 * SR); xx = np.arange(L) / SR
    out[a:a + L] += np.sin(2 * np.pi * 3000 * xx) * np.exp(-xx * 260) * (1 if i % 2 else 0.7)
save('ticks-fast', fade(norm(sosfilt(lp(6000), out), -12)))

# --- handcuffs: ratchet clicks + metal ---
d = 0.6; out = np.zeros(int(d * SR))
for i in range(7):
    a = int((0.05 + i * 0.035) * SR); L = int(0.03 * SR); xx = np.arange(L) / SR
    out[a:a + L] += sosfilt(bp(2500, 7000), rng.standard_normal(L)) * np.exp(-xx * 200)
xx = t(d); ring = np.sin(2 * np.pi * 2900 * xx) * np.exp(-xx * 9) * 0.15 * (xx > 0.3)
save('cuffs', fade(norm(out + ring, -8)))

# --- tape-rewind whoosh (reverse sweep, low) ---
d = 0.8; x = t(d)
rw = bp_var(noise(d), 300 + 2500 * (x / d) ** 2, q=2.0, blocks=60) * np.sin(np.pi * x / d) ** 2
wob = np.sin(2 * np.pi * (90 + 600 * (x / d) ** 2) * x) * 0.2 * np.sin(np.pi * x / d)
save('rewind', fade(norm(sosfilt(lp(4500), rw + wob), -8)))

# --- CCTV servo whirr ---
d = 1.0; x = t(d)
servo = (np.sin(2 * np.pi * 220 * x) + 0.4 * np.sin(2 * np.pi * 440 * x + 2 * np.sin(2 * np.pi * 30 * x))) * np.sin(np.pi * x / d) * 0.4
save('servo', fade(norm(sosfilt(lp(2500), servo), -14)))

# --- door chain + latch (door opening) ---
d = 0.7; x = t(d)
latch = sosfilt(bp(400, 3000), noise(d)) * np.exp(-x * 50)
chain = np.zeros(len(x))
for i in range(5):
    a = int((0.12 + i * 0.05) * SR); L = int(0.04 * SR); xx = np.arange(L) / SR
    chain[a:a + L] += np.sin(2 * np.pi * rng.uniform(2500, 4000) * xx) * np.exp(-xx * 120)
save('latch', fade(norm(latch + chain * 0.6, -8)))
