import React from 'react';
import {Composition} from 'remotion';
import './kit/fonts';
import {Lab} from './Lab';
import {Case001, CASE001_FRAMES} from './cases/case001/Case001';
import {Thumb001} from './cases/case001/Thumbnail';
import {Case002, CASE002_FRAMES} from './cases/case002/Case002';
import {Thumb002} from './cases/case002/Thumbnail';
import {Case003, CASE003_FRAMES} from './cases/case003/Case003';

export const Root: React.FC = () => (
  <>
    <Composition id="Case001" component={Case001} durationInFrames={CASE001_FRAMES} fps={60} width={1080} height={1920} />
    <Composition id="Case002" component={Case002} durationInFrames={CASE002_FRAMES} fps={60} width={1080} height={1920} />
    <Composition id="Case003" component={Case003} durationInFrames={CASE003_FRAMES} fps={60} width={1080} height={1920} />
    <Composition id="Thumb002" component={Thumb002} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Thumb001" component={Thumb001} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Lab" component={Lab} durationInFrames={600} fps={60} width={1080} height={1920} defaultProps={{which: 'bust'}} />
  </>
);
