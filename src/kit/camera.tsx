import React, {createContext, useContext} from 'react';
import {H, W, noise1} from './time';

/**
 * 2.5D camera. A shot is one SVG "world"; <Layer depth> elements move with parallax.
 *  depth 1   = focal plane (characters)
 *  depth <1  = further away (moves less), depth >1 = foreground (moves more)
 * Camera {x, y} is the world point at the frame centre, zoom scales around it, rot in degrees.
 * shake adds hand-held / impact tremor (amplitude in px at depth 1).
 */
export type Cam = {x: number; y: number; zoom: number; rot?: number; shake?: number; f?: number};
const CamCtx = createContext<Cam>({x: W / 2, y: H / 2, zoom: 1});

export const Stage: React.FC<{cam: Cam; bg?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({cam, bg = '#000', children, style}) => {
  const f = cam.f ?? 0;
  const sh = cam.shake ?? 0;
  const c = {...cam, x: cam.x + noise1(f * 0.37 + 11) * sh, y: cam.y + noise1(f * 0.41 + 97) * sh};
  return (
    <CamCtx.Provider value={c}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0, background: bg, ...style}}>
        <g transform={`rotate(${cam.rot ?? 0} ${W / 2} ${H / 2})`}>{children}</g>
      </svg>
    </CamCtx.Provider>
  );
};

export const Layer: React.FC<{depth?: number; children: React.ReactNode; blur?: number; opacity?: number; style?: React.CSSProperties}> = ({
  depth = 1,
  children,
  blur = 0,
  opacity = 1,
  style,
}) => {
  const c = useContext(CamCtx);
  const z = Math.max(0.05, 1 + (c.zoom - 1) * depth);
  // Parallax: world point (c.x, c.y) at screen centre for depth 1; other depths scaled toward the centre.
  const tx = W / 2 - c.x * depth * z + (W / 2) * (depth - 1) * z;
  const ty = H / 2 - c.y * depth * z + (H / 2) * (depth - 1) * z;
  return (
    <g transform={`translate(${tx} ${ty}) scale(${z})`} opacity={opacity} style={{filter: blur > 0.2 ? `blur(${blur}px)` : undefined, ...style}}>
      {children}
    </g>
  );
};

export const useCam = () => useContext(CamCtx);
