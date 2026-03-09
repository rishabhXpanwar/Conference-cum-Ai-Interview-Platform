import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

export default function MagnetizeButton({
  children,
  className = "",
  particleCount = 12,
  onClick,
  ...props
}) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState([]);
  const particlesControl = useAnimation();

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true);
    await particlesControl.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    });
  }, [particlesControl]);

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false);
    await particlesControl.start((i) => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }));
  }, [particlesControl, particles]);

  return (
    <button
      className={"mag-btn " + (isAttracting ? "mag-btn--active " : "") + className}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onClick={onClick}
      {...props}
    >
      {particles.map((p, index) => (
        <motion.div
          key={index}
          custom={index}
          className="mag-particle"
          initial={{ x: p.x, y: p.y }}
          animate={particlesControl}
        />
      ))}
      <span className="mag-btn__inner">{children}</span>
    </button>
  );
}
