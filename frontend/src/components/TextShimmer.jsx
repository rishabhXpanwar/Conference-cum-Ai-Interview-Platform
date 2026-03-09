import { useMemo } from "react";
import { motion } from "framer-motion";

export default function TextShimmer({
  children,
  as: Component = "p",
  className = "",
  duration = 2,
  spread = 2,
}) {
  const MotionComponent = motion(Component);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={"text-shimmer " + className}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={{
        "--spread": `${dynamicSpread}px`,
        backgroundImage: `var(--shimmer-bg), linear-gradient(var(--shimmer-base), var(--shimmer-base))`,
      }}
    >
      {children}
    </MotionComponent>
  );
}
