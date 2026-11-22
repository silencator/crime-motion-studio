"""Generates the reusable film-grain frames and paper texture into public/tex/.
Run once: python3 scripts/make-textures.py"""
import numpy as np, os
from PIL import Image, ImageFilter
rng = np.random.default_rng(11)
os.makedirs('public/tex', exist_ok=True)
W, H = 540, 960
for i in range(8):  # 35 mm grain: fine noise + soft clumps, mid-grey (for overlay blend)
    fine = rng.normal(0, 1, (H, W))
    clump = np.array(Image.fromarray(((rng.normal(0, 1, (H // 3, W // 3)) * 40 + 128).clip(0, 255)).astype(np.uint8)).resize((W, H), Image.BICUBIC), float) - 128
    g = 128 + fine * 30 + clump * 0.9
    Image.fromarray(g.clip(0, 255).astype(np.uint8)).save(f'public/tex/grain{i}.png')
# Paper: low-frequency mottling + fibres (for multiply / soft-light), full size
W, H = 1080, 1920
def blob(scale, amp):
    a = rng.normal(0, 1, (H // scale + 2, W // scale + 2))
    return np.array(Image.fromarray(((a * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), float) - 128
p = 200 + blob(120, 1) * .35 + blob(30, 1) * .25 + blob(6, 1) * .18 + rng.normal(0, 6, (H, W))
fib = np.zeros((H, W))
for _ in range(2500):  # short paper fibres
    x, y = rng.integers(0, W), rng.integers(0, H); a = rng.uniform(0, np.pi); L = rng.integers(6, 26)
    for t in range(L):
        xx, yy = int(x + np.cos(a) * t), int(y + np.sin(a) * t)
        if 0 <= xx < W and 0 <= yy < H: fib[yy, xx] -= 18
p += np.array(Image.fromarray((fib + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)), float) - 128
Image.fromarray(p.clip(0, 255).astype(np.uint8)).save('public/tex/paper.png')
print('textures done')
