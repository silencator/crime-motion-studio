import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from '../../kit/fonts';
import {FilmFinish} from '../../kit/fx';
import {sec} from '../../kit/time';
import {SUB_YELLOW} from '../../kit/captions';
import {WalkOut} from './shots';

/** Cover / thumbnail: the masked thief walks out of the jewellery store into the rain (no spoiler), big title. */
export const Thumb003: React.FC = () => {
  const g = sec(20.9);
  const f = g - sec(20.18);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <WalkOut f={f} g={g} />
      <FilmFinish f={7} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 80%)'}} />
      <div style={{position: 'absolute', top: 1340, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: F.sub, fontWeight: 700, fontSize: 38, letterSpacing: 14, color: '#E0241B', textShadow: '0 2px 10px #000'}}>CASE 003</div>
        <div style={{fontFamily: F.accent, fontStyle: 'italic', fontWeight: 700, fontSize: 150, lineHeight: 1, color: SUB_YELLOW, marginTop: 14, textShadow: '0 0 50px rgba(255,190,60,0.45), 0 6px 24px rgba(0,0,0,0.9)'}}>
          The perfect crime.
        </div>
        <div style={{fontFamily: F.accent, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: SUB_YELLOW, marginTop: 10, textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>
          Zero mistakes?
        </div>
      </div>
    </AbsoluteFill>
  );
};
