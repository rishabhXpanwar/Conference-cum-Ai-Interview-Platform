import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/alert.css";

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export default function Alert({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={"alert-pill alert-pill--" + type}
        role="alert"
        initial={{ opacity: 0, y: -16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <span className="alert-pill-icon">{ICONS[type]}</span>
        <span className="alert-pill-message">{message}</span>
        <button className="alert-pill-close" onClick={onClose} aria-label="Close">✕</button>
      </motion.div>
    </AnimatePresence>
  );
}
