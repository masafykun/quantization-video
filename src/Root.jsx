import { Composition } from 'remotion';
import { QuantizationVideo } from './QuantizationVideo';

export function RemotionRoot() {
  return (
    <Composition
      id="QuantizationVideo"
      component={QuantizationVideo}
      durationInFrames={8482}
      fps={30}
      width={1280}
      height={720}
    />
  );
}
