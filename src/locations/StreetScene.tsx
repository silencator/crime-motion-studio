import React from 'react';
import {Layer} from '../kit/camera';
import {Defs, Snow} from '../kit/fx';
import {Block, Cables, Factory, Fence, Lamp, Pylon, RedSky, SnowGround, BareTree} from './soviet';

/**
 * Snowy khrushchyovka street under a blood-red sky. 5 parallax depths, ~4000 units wide.
 * Put characters on depth 1 with feet near y = 1560. Ground starts at y ≈ 1330.
 */
export const StreetBack: React.FC<{f: number; sky?: [string, string, string]}> = ({f, sky}) => (
  <>
    <Defs />
    <Layer depth={0.04}>
      <RedSky x={-1500} y={-600} w={6000} h={2000} top={sky?.[0]} mid={sky?.[1]} low={sky?.[2]} />
    </Layer>
    <Layer depth={0.18}>
      <Factory x={-300} y={1230} s={1} f={f} seed={1} />
      <Factory x={900} y={1230} s={1.3} f={f + 50} seed={5} />
      <Factory x={2200} y={1230} s={0.9} f={f + 90} seed={9} />
      <Pylon x={300} y={1240} h={520} />
      <Pylon x={1500} y={1240} h={600} />
      <Pylon x={2700} y={1240} h={520} />
      <Cables from={[-900, 820]} to={[300 - 50, 870]} sag={70} />
      <Cables from={[300 + 50, 870]} to={[1500 - 60, 800]} sag={90} />
      <Cables from={[1500 + 60, 800]} to={[2700 - 50, 870]} sag={90} />
      <Cables from={[2700 + 50, 870]} to={[3900, 820]} sag={70} />
      <rect x={-2000} y={1228} width={7000} height={400} fill="#1a0d0b" />
    </Layer>
    <Layer depth={0.42}>
      {[-900, -300, 420, 1100, 1800, 2500, 3200].map((x, i) => (
        <Block key={x} x={x} y={1290} w={520 + (i % 2) * 120} floors={9 - (i % 3)} cols={8 + (i % 2) * 2} fh={70} seed={i + 3} lit={0.08} f={f} color="#3e3d32" shade="#26251e" side={60} />
      ))}
      <rect x={-2000} y={1288} width={7000} height={500} fill="#2b2622" />
      {/* red atmospheric haze between depth planes */}
      <defs>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c01a14" stopOpacity={0} />
          <stop offset="0.7" stopColor="#c01a14" stopOpacity={0.28} />
          <stop offset="1" stopColor="#5a0a08" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect x={-2000} y={500} width={7000} height={800} fill="url(#haze)" />
    </Layer>
  </>
);

export const StreetMid: React.FC<{f: number}> = ({f}) => (
  <Layer depth={0.7}>
    <Block x={-700} y={1350} w={900} floors={12} cols={10} fh={96} seed={21} lit={0.14} f={f} side={0} />
    <Block x={1900} y={1350} w={900} floors={12} cols={10} fh={96} seed={33} lit={0.12} f={f} side={0} />
    <BareTree x={600} y={1350} s={1.4} seed={4} />
    <BareTree x={3200} y={1350} s={1.2} seed={8} />
    <Fence x={-1200} y={1352} w={5600} h={180} post={260} />
  </Layer>
);

export const StreetGround: React.FC<{f: number}> = ({f}) => (
  <Layer depth={1}>
    <SnowGround x={-1500} y={1330} w={7000} h={700} color="#968a88" shade="#62585a" />
    <rect x={-1500} y={1330} width={7000} height={260} fill="url(#fadeDown)" opacity={0} />
    {/* curb + kerb snow */}
    <rect x={-1500} y={1690} width={7000} height={18} fill="#4b4540" />
    <rect x={-1500} y={1684} width={7000} height={8} fill="#d8d1cb" />
    {[-200, 900, 2000, 3100].map((x, i) => (
      <Lamp key={x} x={x} y={1690} h={760} f={f + i * 13} flicker={i === 1} />
    ))}
  </Layer>
);

export const StreetFront: React.FC<{f: number}> = ({f}) => (
  <Layer depth={1.6} blur={5}>
    <path d="M-1200 1920 C-800 1780 -400 1800 0 1860 C400 1780 900 1800 1400 1870 C1900 1790 2400 1810 3000 1880 V2200 H-1200 Z" fill="#d6cfc9" />
    <Snow f={f} n={0} />
  </Layer>
);
