import { Composition } from 'remotion';
import { QuantizationVideo } from './QuantizationVideo';

export function RemotionRoot() {
  return (
    <Composition
      id="QuantizationVideo"
      component={QuantizationVideo}
      durationInFrames={630}
      fps={30}
      width={1280}
      height={720}
    />
  );
}
