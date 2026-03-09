import { useEffect, useRef, memo } from "react";
import { gsap } from "gsap";
import "../styles/background.css";

function Background() {
  const orbVioletRef = useRef(null);
  const orbPinkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(orbVioletRef.current, {
        x: 60,
        y: -50,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orbPinkRef.current, {
        x: -50,
        y: 70,
        duration: 11,
        delay: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-root" aria-hidden="true">
      <div className="bg-orb bg-orb--violet" ref={orbVioletRef} />
      <div className="bg-orb bg-orb--pink" ref={orbPinkRef} />
      <div className="bg-vignette" />
    </div>
  );
}

export default memo(Background);
