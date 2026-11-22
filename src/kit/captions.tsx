import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './fonts';
import {clamp, easeO, hash, inv, lerp, sec} from './time';

/* ================================================================== */
/* 1) Film subtitles: yellow, bold clean sans, sentence case, shadow. */
/* ================================================================== */
export type Sub = {t0: number; t1: number; text: string; red?: string[]};
export const SUB_YELLOW = '#F4D447';
export const SUB_RED = '#FF3B30';

const SubLine: React.FC<{s: Sub; f: number}> = ({s, f}) => {
  const a = sec(s.t0);
  const b = sec(s.t1);
  const o = clamp((f - a) / 4) * clamp((b - f) / 4);
  const words = s.text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 150, // keep clear of the right-side Shorts/TikTok buttons
        top: 1395,
        textAlign: 'center',
        fontFamily: F.sub,
        fontWeight: 700,
        fontSize: 56,
        lineHeight: 1.18,
        letterSpacing: -0.3,
        color: SUB_YELLOW,
        opacity: o,
        textShadow: '0 3px 0 rgba(0,0,0,0.85), 0 0 14px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,1)',
      }}
    >
      {words.map((w, i) => {
        const bare = w.replace(/[^a-zA-Z']/g, '').toLowerCase();
        const red = s.red?.includes(bare);
        return (
          <span key={i} style={{color: red ? SUB_RED : undefined}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

export const Subtitles: React.FC<{subs: Sub[]; f: number}> = ({subs, f}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {subs
      .filter((s) => f >= sec(s.t0) - 1 && f <= sec(s.t1) + 1)
      .map((s, i) => (
        <SubLine key={i} s={s} f={f} />
      ))}
  </AbsoluteFill>
);

/* ================================================================== */
/* 2) Accent titles: big italic serif, fluid motion-graphic entrance. */
/* ================================================================== */
export type AccentLine = {
  text: string;
  size: number; // px
  kind?: 'serif' | 'caps'; // caps = small tracked sans kicker
  color?: string;
  at: number; // seconds (absolute) when this line starts animating in
  dx?: number; // horizontal offset
  glow?: string;
};
export type Accent = {t0: number; t1: number; y: number; lines: AccentLine[]; drift?: number};

const Letters: React.FC<{l: AccentLine; f: number; endF: number}> = ({l, f, endF}) => {
  const start = sec(l.at);
  const chars = Array.from(l.text);
  const per = l.kind === 'caps' ? 1.2 : 2.2; // frames between letters
  const outK = clamp((f - (endF - 14)) / 14);
  return (
    <div
      style={{
        fontFamily: l.kind === 'caps' ? F.sub : F.accent,
        fontStyle: l.kind === 'caps' ? 'normal' : 'italic',
        fontWeight: l.kind === 'caps' ? 700 : 700,
        fontSize: l.size,
        letterSpacing: l.kind === 'caps' ? l.size * 0.32 : -l.size * 0.01,
        lineHeight: 1.02,
        color: l.color ?? SUB_YELLOW,
        whiteSpace: 'nowrap',
        transform: `translateX(${l.dx ?? 0}px)`,
        textShadow: `0 0 ${l.size * 0.25}px ${l.glow ?? 'rgba(255,190,60,0.35)'}, 0 4px 18px rgba(0,0,0,0.85)`,
      }}
    >
      {chars.map((c, i) => {
        const k = easeO(clamp((f - start - i * per) / 16));
        const jitter = (hash(i * 7.1 + l.size) - 0.5) * 2;
        const blur = (1 - k) * 14 + outK * 10;
        const y = (1 - k) * (l.size * 0.35) - outK * 18;
        const sc = lerp(1.25, 1, k);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: k * (1 - outK),
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              transform: `translate(${jitter * (1 - k) * 18}px, ${y}px) scale(${sc}) rotate(${jitter * (1 - k) * 6}deg)`,
              whiteSpace: 'pre',
            }}
          >
            {c}
          </span>
        );
      })}
    </div>
  );
};

export const AccentTitle: React.FC<{a: Accent; f: number}> = ({a, f}) => {
  const a0 = sec(a.t0);
  const a1 = sec(a.t1);
  if (f < a0 - 1 || f > a1 + 1) return null;
  const drift = (a.drift ?? 1) * inv(a0, a1, f);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: a.y, transform: `translateY(${-drift * 26}px) scale(${1 + drift * 0.035})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {a.lines.map((l, i) => (
          <Letters key={i} l={l} f={f} endF={a1} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Subtitles hide while any accent title is on screen. */
export const Captions: React.FC<{subs: Sub[]; accents: Accent[]; f: number}> = ({subs, accents, f}) => {
  const inAccent = accents.some((a) => f >= sec(a.t0) && f <= sec(a.t1));
  return (
    <>
      {!inAccent && <Subtitles subs={subs} f={f} />}
      {accents.map((a, i) => (
        <AccentTitle key={i} a={a} f={f} />
      ))}
    </>
  );
};

/* ================================================================== */
/* 3) Channel elements: persistent case tag + CASE CLOSED stamp.      */
/* ================================================================== */
export const CaseTag: React.FC<{n: string; f: number}> = ({n, f}) => {
  const blink = Math.floor(f / 30) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 64, top: 150, display: 'flex', alignItems: 'center', gap: 14, opacity: clamp(f / 20)}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: '#E0241B', opacity: blink ? 1 : 0.25, boxShadow: '0 0 12px #ff2a1a'}} />
      <div
        style={{
          fontFamily: F.stamp,
          fontSize: 40,
          letterSpacing: 5,
          color: '#E0241B',
          textShadow: '0 0 10px rgba(255,40,20,0.45), 0 2px 0 #000',
        }}
      >
        CASE {n}
      </div>
    </div>
  );
};

export const CaseClosed: React.FC<{f: number; at: number}> = ({f, at}) => {
  const k = f - at;
  if (k < 0) return null;
  const drop = clamp(k / 7); // slams in over 7 frames
  const sc = lerp(2.6, 1, Math.pow(drop, 2));
  const rot = -9;
  const shake = k >= 7 && k < 20 ? (hash(k) - 0.5) * 14 * (1 - (k - 7) / 13) : 0;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
      <div style={{position: 'absolute', inset: 0, background: '#000', opacity: clamp(k / 10) * 0.45}} />
      <div
        style={{
          transform: `rotate(${rot}deg) scale(${sc})`,
          opacity: clamp(k / 3),
          border: '12px solid #D11F16',
          borderRadius: 14,
          padding: '20px 44px 10px',
          color: '#D11F16',
          fontFamily: F.stamp,
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: 8,
          textAlign: 'center',
          boxShadow: 'inset 0 0 0 6px rgba(0,0,0,0.0)',
          mixBlendMode: 'normal',
          WebkitMaskImage: `url(${'data:image/svg+xml;utf8,' + encodeURIComponent(stampMask())})`,
          WebkitMaskSize: '100% 100%',
          filter: 'drop-shadow(0 0 18px rgba(255,30,20,0.35))',
        }}
      >
        CASE
        <br />
        CLOSED
      </div>
    </AbsoluteFill>
  );
};

/** Worn-ink mask for the stamp (speckles where ink did not take). */
const stampMask = () => {
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'><rect width='400' height='300' fill='white'/>`;
  for (let i = 0; i < 260; i++) {
    const x = hash(i * 1.7) * 400;
    const y = hash(i * 2.3) * 300;
    const r = 0.4 + hash(i * 3.1) * 2.4;
    s += `<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='${r.toFixed(2)}' fill='black' opacity='${(0.5 + hash(i) * 0.5).toFixed(2)}'/>`;
  }
  for (let i = 0; i < 14; i++) {
    const y = hash(i * 9.3) * 300;
    s += `<rect x='${(hash(i * 4.1) * 300).toFixed(0)}' y='${y.toFixed(0)}' width='${(20 + hash(i) * 90).toFixed(0)}' height='1.2' fill='black' opacity='0.7'/>`;
  }
  return s + '</svg>';
};
