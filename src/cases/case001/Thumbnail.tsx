import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from '../../kit/fonts';
import {FilmFinish} from '../../kit/fx';
import {sec} from '../../kit/time';
import {SUB_YELLOW} from '../../kit/captions';
import {Reveal} from './shots';
import {SHOTS} from './timeline';

/** Cover / thumbnail: the shadow-with-the-knife frame, no subtitles, big title. */
export const Thumb001: React.FC = () => {
  const g = sec(36.9);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Reveal f={g - sec(SHOTS.reveal[0])} g={g} />
      <FilmFinish f={7} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 38%)'}} />
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: F.sub, fontWeight: 700, fontSize: 38, letterSpacing: 14, color: '#E0241B', textShadow: '0 2px 10px #000'}}>CASE 001</div>
        <div style={{fontFamily: F.accent, fontStyle: 'italic', fontWeight: 700, fontSize: 210, lineHeight: 1, color: SUB_YELLOW, marginTop: 18, textShadow: '0 0 50px rgba(255,190,60,0.45), 0 6px 24px rgba(0,0,0,0.9)'}}>
          He knew.
        </div>
      </div>
    </AbsoluteFill>
  );
};
