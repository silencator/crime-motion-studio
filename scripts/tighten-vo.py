"""Tighten the pauses between voice-over phrases (words untouched) and loudness-normalise the voice.
  python3 scripts/tighten-vo.py public/audio/case004.mp3 public/audio/case004_vo.wav "gap0,gap1,..."  (or one value for all)
Phrase segments come from public/data/<name>.timing.json (run analyze-audio first). Writes the re-timed
transcript to public/data/<out>.transcript.json and prints the old->new segment map."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
src, out, gaps = sys.argv[1], sys.argv[2], sys.argv[3]
name = os.path.splitext(os.path.basename(src))[0]
oname = os.path.splitext(os.path.basename(out))[0]
SR = 48000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.float32).astype(np.float64)
segs = json.load(open(f'public/data/{name}.timing.json'))['segments']
g = [float(x) for x in gaps.split(',')]
g = g * len(segs) if len(g) == 1 else g
PAD, FADE = 0.06, int(0.012 * SR)
parts, mp, t = [], [], 0.0
for i, s in enumerate(segs):
    s0 = max(0, s['start'] - PAD) if i else 0.0
    s1 = min(len(a) / SR, s['end'] + PAD)
    x = a[int(s0 * SR):int(s1 * SR)].copy()
    if i: x[:FADE] *= np.linspace(0, 1, FADE)
    x[-FADE:] *= np.linspace(1, 0, FADE)
    mp.append((s0, s1, t)); parts.append(x); t += len(x) / SR
    if i < len(segs) - 1:
        gap = g[i]; parts.append(np.zeros(int(gap * SR))); t += gap
y = np.concatenate(parts + [np.zeros(int(0.3 * SR))])
tmp = out + '.tmp.wav'
sf.write(tmp, y, SR, subtype='PCM_24')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), '-ac', '1', '-c:a', 'pcm_s24le', out], check=True)
os.remove(tmp)
def remap(x):
    for s0, s1, n0 in mp:
        if x < s1 + 0.2: return round(n0 + max(0.0, x - s0), 3)
    return round(x, 3)
tr = json.load(open(f'public/data/{name}.transcript.json'))
for seg in tr:
    seg['start'], seg['end'] = remap(seg['start']), remap(seg['end'])
    seg['words'] = [[w, remap(ts)] for w, ts in seg['words']]
json.dump(tr, open(f'public/data/{oname}.transcript.json', 'w'), indent=1)
for s0, s1, n0 in mp: print(f'{s0:6.2f}-{s1:6.2f} -> {n0:6.2f}')
print('total', round(len(y) / SR, 2))
