import { Suspense, lazy, useCallback } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const ROBOT_SCENE_URL = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

function SplineFallback() {
  return (
    <div className="ai-robot-fallback">
      <span className="ai-robot-spinner" />
    </div>
  );
}

function InteractiveRobotSpline({ scene, className }) {
  const onLoad = useCallback(() => {
    const logo = document.getElementById('logo');
    if (logo) logo.remove();
  }, []);

  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  );
}

export default function RobotSpline() {
  return <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="ai-robot-canvas" />;
}
