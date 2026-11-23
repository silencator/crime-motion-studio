import React from 'react';
import {Ink, Line} from '../kit/fx';

/**
 * Side-character bust rig (front, slight 3/4), same ink/gouache language as IF.
 * Head centre ≈ (0,0), chin ≈ y 170, bust continues down to y ≈ 1200.
 * kind: 'wife' | 'driver' | 'assistant' (CASE 001), 'guard' (CASE 002 museum night guard); reusable as generic NPCs.
 */
export type SuspectKind = 'wife' | 'driver' | 'assistant';
/** Every bust-rig character (CASE 001 suspects + later NPCs). */
export type NPCKind = SuspectKind | 'guard';
export type SuspectProps = {
  kind: NPCKind;
  mouth?: number;
  blink?: number;
  lookX?: number;
  lookY?: number;
  fear?: number; // 0..1 brows up, eyes wide
  rim?: string;
  rimOp?: number;
  sweat?: number;
  turn?: number; // −1..1 horizontal feature shift (head turn)
};

const INK = '#0b0706';
const LOOK: Record<NPCKind, {skin: string; shade: string; hair: string; suit: string; suitShade: string; jaw: number; faceW: number}> = {
  wife: {skin: '#D3A285', shade: '#A06E56', hair: '#17100d', suit: '#2c1f24', suitShade: '#1a1215', jaw: 0.82, faceW: 112},
  driver: {skin: '#B47A5A', shade: '#80513A', hair: '#2a2019', suit: '#3b4034', suitShade: '#252920', jaw: 1.12, faceW: 132},
  assistant: {skin: '#CDAE96', shade: '#987964', hair: '#0f0d0c', suit: '#4a4a4a', suitShade: '#2c2c2c', jaw: 0.78, faceW: 104},
  guard: {skin: '#C48C6C', shade: '#8E5C46', hair: '#7a746c', suit: '#46505a', suitShade: '#2b3239', jaw: 1.2, faceW: 132},
};

export const Suspect: React.FC<SuspectProps> = ({kind, mouth = 0, blink = 0, lookX = 0, lookY = 0, fear = 0, rim = '#ffb45a', rimOp = 0.6, sweat = 0, turn = 0}) => {
  const L = LOOK[kind];
  const fw = L.faceW;
  const jw = fw * L.jaw;
  const tx = turn * 18;
  const face = `M${-fw} -40 C${-fw - 4} -120 ${-fw * 0.6} -168 0 -170 C${fw * 0.6} -168 ${fw + 4} -120 ${fw} -40 C${fw} 30 ${jw} 100 ${jw * 0.55} 145 C${jw * 0.3} 168 ${jw * 0.12} 176 0 178 C${-jw * 0.12} 176 ${-jw * 0.3} 168 ${-jw * 0.55} 145 C${-jw} 100 ${-fw} 30 ${-fw} -40 Z`;
  const eyeY = -30;
  const ex = fw * 0.42;
  const eyeW = kind === 'driver' || kind === 'guard' ? 40 : 44;
  const brow = -fear * 10;
  return (
    <g>
      {/* ---------- body ---------- */}
      {kind === 'wife' && (
        <g>
          <Ink d="M-360 2300 C-360 700 -330 420 -170 330 L170 330 C330 420 360 700 360 2300 Z" fill={L.suit} hatch="hatch" hatchOp={0.2} />
          {/* fur collar */}
          <Ink d="M-250 380 C-260 300 -180 250 -90 250 C-40 300 40 300 90 250 C180 250 260 300 250 380 C200 450 120 470 0 470 C-120 470 -200 450 -250 380 Z" fill="#cfc3b2" />
          {Array.from({length: 18}).map((_, i) => (
            <path key={i} d={`M${-230 + i * 27} ${360 + Math.sin(i) * 30} q8 22 -4 40`} stroke="#8a7c6a" strokeWidth={3} fill="none" />
          ))}
          <path d="M-60 260 C-50 300 50 300 60 260 L50 330 C30 350 -30 350 -50 330 Z" fill={L.shade} />
          {/* pearls */}
          {Array.from({length: 13}).map((_, i) => {
            const a = Math.PI * (0.12 + (i / 12) * 0.76);
            return <circle key={i} cx={Math.cos(a) * -70} cy={250 + Math.sin(a) * 60} r={9} fill="#efe6d6" stroke={INK} strokeWidth={1.8} />;
          })}
        </g>
      )}
      {kind === 'driver' && (
        <g>
          <Ink d="M-400 2300 C-400 680 -370 430 -200 340 L200 340 C370 430 400 680 400 2300 Z" fill={L.suit} hatch="hatch" hatchOp={0.25} />
          <Ink d="M-110 300 L110 300 L120 380 L-120 380 Z" fill={L.suitShade} />
          <path d="M-120 380 L0 520 L120 380" stroke={INK} strokeWidth={4} fill="none" />
          {[560, 680, 800].map((y) => (
            <circle key={y} cx={-40} cy={y} r={12} fill="#b8964e" stroke={INK} strokeWidth={2.5} />
          ))}
          <path d="M-330 600 H-160 M160 600 H330" stroke="#1a1d16" strokeWidth={10} opacity={0.6} />
          <path d="M-70 270 C-60 300 60 300 70 270 L70 300 L-70 300 Z" fill={L.shade} />
        </g>
      )}
      {kind === 'assistant' && (
        <g>
          <Ink d="M-330 2300 C-330 700 -300 440 -150 340 L150 340 C300 440 330 700 330 2300 Z" fill={L.suit} hatch="hatch" hatchOp={0.18} />
          <Ink d="M-80 310 L0 470 L80 310 Z" fill="#e4ddd0" heavy={0} />
          <Ink d="M-18 330 L18 330 L26 600 L0 640 L-26 600 Z" fill="#141212" heavy={0} />
          <Ink d="M-150 345 L-30 330 L0 470 L-40 720 L-170 760 Z" fill={L.suitShade} heavy={0} />
          <Ink d="M150 345 L30 330 L0 470 L40 720 L170 760 Z" fill={L.suit} heavy={0} />
          <path d="M-50 260 C-40 300 40 300 50 260 L50 320 L-50 320 Z" fill={L.shade} />
          <rect x={90} y={520} width={60} height={10} fill="#d8d1c4" opacity={0.6} />
        </g>
      )}
      {kind === 'guard' && (
        <g>
          <Ink d="M-430 2300 C-430 660 -400 430 -210 336 L210 336 C400 430 430 660 430 2300 Z" fill={L.suit} hatch="hatch" hatchOp={0.22} />
          <path d="M120 360 C300 430 410 600 430 2300 L230 2300 C220 900 190 560 120 360 Z" fill={L.suitShade} opacity={0.7} />
          {/* shirt, tie, collar */}
          <Ink d="M-90 300 L0 470 L90 300 Z" fill="#b9c0c4" heavy={0} />
          <Ink d="M-20 330 L20 330 L30 640 L0 680 L-30 640 Z" fill="#1d2228" heavy={0} />
          <Ink d="M-210 340 L-80 300 L0 470 L-60 760 L-230 790 Z" fill={L.suit} heavy={0} />
          <Ink d="M210 340 L80 300 L0 470 L60 760 L230 790 Z" fill={L.suitShade} heavy={0} />
          {/* epaulettes + shoulder patch */}
          <Ink d="M-400 470 L-230 380 L-210 420 L-380 512 Z" fill="#2b3239" heavy={0} />
          <Ink d="M400 470 L230 380 L210 420 L380 512 Z" fill="#20262c" heavy={0} />
          <Ink d="M-380 560 C-370 530 -330 520 -310 540 L-300 620 C-320 650 -370 650 -385 620 Z" fill="#7a1a14" heavy={0} />
          <path d="M-345 560 L-338 598" stroke="#c9a24a" strokeWidth={5} />
          {/* breast pockets + buttons */}
          {[-1, 1].map((sx) => (
            <g key={sx}>
              <rect x={sx > 0 ? 70 : -230} y={860} width={160} height={150} fill="none" stroke={INK} strokeWidth={3} opacity={0.8} />
              <path d={`M${sx > 0 ? 70 : -230} 860 H${sx > 0 ? 230 : -70} L${sx > 0 ? 220 : -80} 900 H${sx > 0 ? 80 : -220} Z`} fill={L.suitShade} stroke={INK} strokeWidth={2.5} />
              <circle cx={sx * 150} cy={890} r={9} fill="#b8964e" stroke={INK} strokeWidth={2} />
            </g>
          ))}
          {[800, 960, 1120].map((y) => (
            <circle key={y} cx={-50} cy={y} r={13} fill="#b8964e" stroke={INK} strokeWidth={2.5} />
          ))}
          {/* name-less badge on the chest */}
          <path d="M-200 790 L-160 770 L-120 790 L-130 840 L-160 856 L-190 840 Z" fill="#b8964e" stroke={INK} strokeWidth={2.5} />
          <path d={`M${-jw * 0.5} 250 C-40 310 40 310 ${jw * 0.5} 250 L${jw * 0.5} 320 L${-jw * 0.5} 320 Z`} fill={L.shade} />
        </g>
      )}
      {/* neck */}
      <path d={`M${-jw * 0.45} 120 L${-jw * 0.5} 320 L${jw * 0.5} 320 L${jw * 0.45} 120 Z`} fill={L.shade} />
      {/* ears */}
      {[-1, 1].map((sx) => (
        <Ink key={sx} d={`M${sx * (fw - 6)} -40 C${sx * (fw + (kind === 'assistant' ? 40 : 26))} -60 ${sx * (fw + (kind === 'assistant' ? 44 : 30))} 20 ${sx * (fw - 4)} 30 Z`} fill={L.skin} w={2.6} heavy={0} />
      ))}
      {/* face */}
      <Ink d={face} fill={L.skin} w={3.4} heavy={3} />
      <path d={`M${fw * 0.25} -150 C${fw} -110 ${fw + 2} 0 ${jw * 0.6} 140 C${jw * 0.3} 168 ${jw * 0.1} 176 0 178 C${jw * 0.5} 90 ${fw * 0.6} 0 ${fw * 0.25} -150 Z`} fill={L.shade} opacity={0.55} />
      {kind === 'driver' && <path d={face} fill="url(#stubble)" opacity={0.6} />}
      <g transform={`translate(${tx} 0)`}>
        {/* nose */}
        <path d={`M-8 -20 C-14 20 -26 50 -22 62 C-10 72 10 72 20 62`} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
        <path d={`M2 -20 C8 20 18 46 20 62 L-4 66 Z`} fill={L.shade} opacity={0.5} />
        {/* eyes */}
        {[-1, 1].map((sx) => (
          <SEye key={sx} cx={sx * ex} cy={eyeY} w={eyeW} lx={lookX * 8} ly={lookY * 5} blink={blink} fear={fear} lids={kind === 'wife' ? 0.35 : kind === 'driver' ? 0.42 : kind === 'guard' ? 0.46 : 0.28} lash={kind === 'wife'} />
        ))}
        {/* brows */}
        {[-1, 1].map((sx) => (
          <path
            key={sx}
            d={`M${sx * (ex - 30)} ${eyeY - 34 + brow + (kind === 'driver' ? 4 : 0)} C${sx * ex} ${eyeY - 50 + brow * 1.4} ${sx * (ex + 20)} ${eyeY - 46 + brow} ${sx * (ex + 34)} ${eyeY - 34 + brow * 0.4}`}
            stroke={kind === 'guard' ? '#5f5a54' : L.hair}
            strokeWidth={kind === 'driver' || kind === 'guard' ? 14 : kind === 'wife' ? 6 : 8}
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {/* mouth */}
        <SMouth m={mouth} kind={kind} />
        {kind === 'guard' && (
          <g>
            {/* tired older face: bags, nasolabial folds, forehead lines, jowls */}
            {[-1, 1].map((sx) => (
              <g key={sx}>
                <path d={`M${sx * (ex - 22)} ${eyeY + 22} C${sx * ex} ${eyeY + 32} ${sx * (ex + 18)} ${eyeY + 28} ${sx * (ex + 26)} ${eyeY + 18}`} stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
                <path d={`M${sx * 34} 58 C${sx * 56} 86 ${sx * 64} 112 ${sx * 60} 138`} stroke={INK} strokeWidth={2.4} fill="none" opacity={0.55} />
                <path d={`M${sx * (fw - 20)} 90 C${sx * (fw - 14)} 130 ${sx * (fw - 34)} 150 ${sx * (fw - 54)} 160`} stroke={INK} strokeWidth={2} fill="none" opacity={0.4} />
              </g>
            ))}
            {/* walrus moustache, grey */}
            <Ink d="M-70 100 C-60 76 -26 70 0 80 C26 70 60 76 70 100 C74 116 64 122 54 112 C40 100 20 98 0 102 C-20 98 -40 100 -54 112 C-64 122 -74 116 -70 100 Z" fill="#8f877d" w={2.4} heavy={0} />
            <path d="M-50 94 L-46 108 M-30 88 L-28 104 M30 88 L28 104 M50 94 L46 108" stroke="#5a544c" strokeWidth={2} />
          </g>
        )}
        {kind === 'assistant' && (
          <g fill="none" stroke="#1a1410" strokeWidth={4}>
            <circle cx={-ex} cy={eyeY + 2} r={34} />
            <circle cx={ex} cy={eyeY + 2} r={34} />
            <path d={`M${-ex + 34} ${eyeY} Q0 ${eyeY - 12} ${ex - 34} ${eyeY}`} />
            <path d={`M${-ex - 34} ${eyeY - 4} L${-fw - 6} ${eyeY - 14} M${ex + 34} ${eyeY - 4} L${fw + 6} ${eyeY - 14}`} />
            <path d={`M${-ex - 18} ${eyeY - 20} L${-ex - 6} ${eyeY - 26}`} stroke="#fff" strokeWidth={3} opacity={0.7} />
          </g>
        )}
      </g>
      {/* hair / hats */}
      {kind === 'wife' && (
        <g>
          <Ink d={`M${-fw - 30} 90 C${-fw - 60} -40 ${-fw - 20} -190 0 -200 C${fw + 20} -190 ${fw + 60} -40 ${fw + 30} 90 C${fw + 10} 100 ${fw - 10} 60 ${fw - 6} 10 C${fw - 10} -60 ${fw * 0.5} -120 ${-fw * 0.1} -128 C${-fw * 0.6} -100 ${-fw + 6} -60 ${-fw + 4} 10 C${-fw + 6} 60 ${-fw - 10} 100 ${-fw - 30} 90 Z`} fill={L.hair} />
          <path d={`M${-fw - 20} -40 C${-fw + 20} -60 ${-fw + 30} -10 ${-fw - 10} 10 M${fw + 20} -60 C${fw - 20} -80 ${fw - 30} -30 ${fw + 10} -10`} stroke="#3a2a24" strokeWidth={4} fill="none" />
          <circle cx={-fw - 2} cy={46} r={10} fill="#efe6d6" stroke={INK} strokeWidth={2} />
          <circle cx={fw + 2} cy={46} r={10} fill="#efe6d6" stroke={INK} strokeWidth={2} />
        </g>
      )}
      {kind === 'driver' && (
        <g>
          <Ink d={`M${-fw - 20} -100 C${-fw - 10} -190 ${fw + 10} -190 ${fw + 20} -100 Z`} fill={L.hair} />
          <Ink d={`M${-fw - 40} -110 C${-fw - 60} -230 ${fw + 60} -240 ${fw + 40} -110 Z`} fill="#30352b" />
          <Ink d={`M${-fw - 46} -112 C${-30} -96 ${30} -96 ${fw + 46} -112 L${fw + 30} -80 C${30} -60 ${-30} -60 ${-fw - 30} -80 Z`} fill="#0f0f0e" />
          <rect x={-fw - 44} y={-140} width={(fw + 44) * 2} height={24} fill="#1b1e18" stroke={INK} strokeWidth={3} />
          <circle cx={0} cy={-150} r={14} fill="#b8964e" stroke={INK} strokeWidth={2.5} />
        </g>
      )}
      {kind === 'assistant' && (
        <g>
          <Ink d={`M${-fw - 8} -20 C${-fw - 20} -130 ${-fw * 0.5} -200 ${fw * 0.2} -196 C${fw * 0.9} -190 ${fw + 16} -120 ${fw + 6} -30 C${fw - 4} -90 ${fw * 0.6} -130 ${fw * 0.1} -136 C${-fw * 0.3} -150 ${-fw * 0.8} -110 ${-fw - 8} -20 Z`} fill={L.hair} />
          <path d={`M${-fw * 0.35} -190 C${-fw * 0.4} -160 ${-fw * 0.42} -150 ${-fw * 0.5} -132`} stroke="#3a3530" strokeWidth={3} fill="none" />
          <Line d={`M${-fw * 0.3} -186 C${fw * 0.2} -196 ${fw * 0.7} -170 ${fw * 0.95} -110`} w={3} c="#4a4440" op={0.8} />
        </g>
      )}
      {kind === 'guard' && (
        <g>
          {/* grey temples under the cap */}
          {[-1, 1].map((sx) => (
            <path key={sx} d={`M${sx * (fw + 4)} -40 C${sx * (fw + 8)} -80 ${sx * (fw - 6)} -110 ${sx * (fw - 30)} -118 L${sx * (fw - 26)} -60 Z`} fill={L.hair} stroke={INK} strokeWidth={2.4} />
          ))}
          {/* peaked uniform cap: crown, band, black visor, plain cockade */}
          <Ink d={`M${-fw - 70} -120 C${-fw - 90} -250 ${fw + 90} -260 ${fw + 70} -120 Z`} fill="#3c4650" hatch="hatch" hatchOp={0.2} />
          <rect x={-fw - 30} y={-150} width={(fw + 30) * 2} height={38} fill="#1d2329" stroke={INK} strokeWidth={3} />
          <path d={`M${-fw - 30} -150 H${fw + 30}`} stroke="#7a1a14" strokeWidth={6} />
          <Ink d={`M${-fw - 34} -114 C-40 -94 40 -94 ${fw + 34} -114 L${fw + 6} -72 C40 -54 -40 -54 ${-fw - 6} -72 Z`} fill="#0d0e10" />
          <path d={`M${-fw + 10} -100 C-30 -86 30 -86 ${fw - 10} -100`} stroke="#5a6068" strokeWidth={3} fill="none" opacity={0.8} />
          <circle cx={0} cy={-170} r={17} fill="#b8964e" stroke={INK} strokeWidth={2.5} />
          <path d="M0 -182 L5 -170 L0 -158 L-5 -170 Z" fill="#7a1a14" />
        </g>
      )}
      {/* sweat */}
      {sweat > 0 && (
        <g opacity={sweat}>
          <path d={`M${-fw + 18} -110 C${-fw + 8} -90 ${-fw + 10} -78 ${-fw + 18} -76 C${-fw + 26} -78 ${-fw + 28} -90 ${-fw + 18} -110 Z`} fill="#dfe8ee" stroke={INK} strokeWidth={2} />
          <path d={`M${fw - 30} -20 C${fw - 38} 0 ${fw - 36} 10 ${fw - 30} 12 C${fw - 24} 10 ${fw - 22} 0 ${fw - 30} -20 Z`} fill="#dfe8ee" stroke={INK} strokeWidth={2} />
        </g>
      )}
      {/* rim light (screen-left edge) */}
      <path d={`M${-fw} -40 C${-fw} 30 ${-jw} 100 ${-jw * 0.55} 145`} fill="none" stroke={rim} strokeWidth={5} opacity={rimOp} strokeLinecap="round" />
    </g>
  );
};

const SEye: React.FC<{cx: number; cy: number; w: number; lx: number; ly: number; blink: number; fear: number; lids: number; lash?: boolean}> = ({cx, cy, w, lx, ly, blink, fear, lids, lash}) => {
  const h = w * 0.5 * (1 + fear * 0.35);
  const id = `se${Math.round(cx)}${Math.round(w)}`;
  const shape = `M${cx - w / 2} ${cy} C${cx - w / 4} ${cy - h * 0.62} ${cx + w / 4} ${cy - h * 0.62} ${cx + w / 2} ${cy} C${cx + w / 4} ${cy + h * 0.5} ${cx - w / 4} ${cy + h * 0.5} ${cx - w / 2} ${cy} Z`;
  if (blink > 0.85) return <path d={`M${cx - w / 2} ${cy} C${cx - w / 4} ${cy + h * 0.3} ${cx + w / 4} ${cy + h * 0.3} ${cx + w / 2} ${cy}`} stroke={INK} strokeWidth={4} fill="none" />;
  const lid = Math.max(0, lids - fear * 0.3) + blink * (1 - lids);
  const ly2 = cy - h * 0.6 + lid * h * 1.1;
  return (
    <g>
      <clipPath id={id}>
        <path d={shape} />
      </clipPath>
      <path d={shape} fill="#e6dccb" />
      <g clipPath={`url(#${id})`}>
        <circle cx={cx + lx} cy={cy + ly} r={h * (0.42 - fear * 0.1)} fill="#3b2a1e" />
        <circle cx={cx + lx} cy={cy + ly} r={h * (0.2 - fear * 0.06)} fill="#0a0604" />
        <circle cx={cx + lx - 4} cy={cy + ly - 4} r={2.6} fill="#fff" />
        <rect x={cx - w} y={cy - h * 1.2} width={w * 2} height={ly2 - (cy - h * 1.2)} fill="#00000055" />
      </g>
      <path d={shape} fill="none" stroke={INK} strokeWidth={2.6} />
      <path d={`M${cx - w / 2 - 2} ${cy - 1} C${cx - w / 4} ${ly2 - 4} ${cx + w / 4} ${ly2 - 4} ${cx + w / 2 + 2} ${cy - 1}`} stroke={INK} strokeWidth={lash ? 5 : 3.5} fill="none" />
    </g>
  );
};

const SMouth: React.FC<{m: number; kind: NPCKind}> = ({m, kind}) => {
  const y = 112;
  const w = kind === 'driver' || kind === 'guard' ? 46 : 38;
  const lip = kind === 'wife' ? '#8c1c22' : '#8a5a4a';
  if (m < 0.06)
    return (
      <g>
        {kind === 'wife' && <path d={`M${-w} ${y} C${-w / 2} ${y - 12} ${w / 2} ${y - 12} ${w} ${y} C${w / 2} ${y + 16} ${-w / 2} ${y + 16} ${-w} ${y} Z`} fill={lip} stroke={INK} strokeWidth={2} />}
        <path d={`M${-w} ${y} C${-w / 2} ${y - 3} ${w / 2} ${y - 3} ${w} ${y + 2}`} stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    );
  const o = 6 + m * 26;
  return (
    <g>
      <path d={`M${-w * 0.8} ${y} C${-w / 2} ${y - 6} ${w / 2} ${y - 6} ${w * 0.8} ${y} C${w / 2} ${y + o} ${-w / 2} ${y + o} ${-w * 0.8} ${y} Z`} fill="#2a0c0a" stroke={kind === 'wife' ? lip : INK} strokeWidth={kind === 'wife' ? 6 : 3} />
    </g>
  );
};
