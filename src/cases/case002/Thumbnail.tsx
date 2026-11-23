import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from '../../kit/fonts';
import {FilmFinish} from '../../kit/fx';
import {sec} from '../../kit/time';
import {SUB_YELLOW} from '../../kit/captions';
import {FrameHook} from './shots';

/** Cover / thumbnail: the cut-out frame in the flashlight (no spoiler), no subtitles, big title. */
export const Thumb002: React.FC = () => {
  const g = sec(1.2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <FrameHook f={g} g={g} />
      <FilmFinish f={7} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 80%)'}} />
      <div style={{position: 'absolute', top: 1360, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: F.sub, fontWeight: 700, fontSize: 38, letterSpacing: 14, color: '#E0241B', textShadow: '0 2px 10px #000'}}>CASE 002</div>
        <div style={{fontFamily: F.accent, fontStyle: 'italic', fontWeight: 700, fontSize: 190, lineHeight: 1, color: SUB_YELLOW, marginTop: 14, textShadow: '0 0 50px rgba(255,190,60,0.45), 0 6px 24px rgba(0,0,0,0.9)'}}>
          Gone.
        </div>
        <div style={{fontFamily: F.accent, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: SUB_YELLOW, marginTop: 6, textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>
          Nobody came in.
        </div>
      </div>
    </AbsoluteFill>
  );
};
