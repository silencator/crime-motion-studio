/** Time + motion helpers shared by every case. 60 fps master clock; characters/snow/smoke run "stepped" (on 3s/4s). */
export const FPS = 60;
export const W = 1080;
export const H = 1920;
export const sec = (s: number) => Math.round(s * FPS);
/** Hold each pose for n frames (n=4 → 15 drawings/s): the choppy painted-cel motion from the style pack. */
export const stepF = (f: number, n = 4) => Math.floor(f / n) * n;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeO = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeI = (t: number) => t * t * t;
export const easeOutBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
/** Map frame f in [a,b] to [from,to] with easing (clamped). */
export const ramp = (f: number, a: number, b: number, from: number, to: number, ease: (t: number) => number = easeIO) =>
  lerp(from, to, ease(inv(a, b, f)));
/** Deterministic hash → [0,1). */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Smooth 1D value noise in [-1,1]. */
export const noise1 = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i), hash(i + 1), u) * 2 - 1;
};
