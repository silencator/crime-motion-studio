import React from 'react';
import {Composition} from 'remotion';
import './kit/fonts';
import {Lab} from './Lab';
import {Case001, CASE001_FRAMES} from './cases/case001/Case001';
import {Thumb001} from './cases/case001/Thumbnail';
import {Case004, CASE004_FRAMES} from './cases/case004/Case004';

export const Root: React.FC = () => (
  <>
    <Composition id="Case001" component={Case001} durationInFrames={CASE001_FRAMES} fps={60} width={1080} height={1920} />
    <Composition id="Case004" component={Case004} durationInFrames={CASE004_FRAMES} fps={60} width={1080} height={1920} />
    <Composition id="Thumb001" component={Thumb001} durationInFrames={1} fps={60} width={1080} height={1920} />
    <Composition id="Lab" component={Lab} durationInFrames={600} fps={60} width={1080} height={1920} defaultProps={{which: 'bust'}} />
  </>
);
