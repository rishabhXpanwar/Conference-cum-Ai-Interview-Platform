import { useState } from "react";
import "../styles/ripple-button.css";

export default function RippleButton({ children, onClick, className = "", disabled }) {
  const [ripples, setRipples] = useState([]);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  }

  return (
    <div
      className={`ripple-btn ${className}`}
      onClick={disabled ? undefined : handleClick}
      aria-disabled={disabled || undefined}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-btn__effect"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
    </div>
  );
}
