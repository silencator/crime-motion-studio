import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Stage, Layer} from './kit/camera';
import {Defs, FilmFinish} from './kit/fx';
import {IFBust} from './characters/IFBust';
import {IFBody} from './characters/IFBody';
import {StreetBack, StreetMid, StreetGround, StreetFront} from './locations/StreetScene';
import {SnowOverlay} from './kit/fx';
import {stepF} from './kit/time';

/** Scratch composition for previewing library pieces as stills. */
export const Lab: React.FC<{which?: string}> = ({which = 'bust'}) => {
  const f = useCurrentFrame();
  if (which === 'street') {
    const camX = 540 + f * 3.6;
    const sf = stepF(f, 4);
    return (
      <AbsoluteFill>
        <Stage cam={{x: camX, y: 1100, zoom: 1, f}}>
          <StreetBack f={f} />
          <StreetMid f={f} />
          <StreetGround f={f} />
          <Layer depth={1}>
            <g transform={`translate(${camX - 60 + 0} 1650) scale(0.95)`}>
              <IFBody phase={(sf / 66) * Math.PI * 2} t={sf / 60} rim="#ff6a3a" />
            </g>
          </Layer>
          <StreetFront f={f} />
        </Stage>
        <SnowOverlay f={f} wind={0.6} />
        <FilmFinish f={f} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#1a1414'}}>
      <Stage cam={{x: 540, y: 960, zoom: 1, f}} bg="#2a2020">
        <Defs />
        <Layer>
          {which === 'bust' && (
            <g transform="translate(560 1000) scale(1.3)">
              <IFBust mouth={0} />
            </g>
          )}
          {which === 'bust2' && (
            <>
              <g transform="translate(300 520) scale(0.75)"><IFBust mouth={0.7} brow={1} lookX={-1} /></g>
              <g transform="translate(800 1300) scale(0.75)"><IFBust mouth={0.3} blink={1} flip cig rim="#ff3020" /></g>
            </>
          )}
        </Layer>
      </Stage>
      <FilmFinish f={f} />
    </AbsoluteFill>
  );
};
