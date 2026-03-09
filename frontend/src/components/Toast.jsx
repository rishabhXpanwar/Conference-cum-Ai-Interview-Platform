import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, MessageSquare } from "lucide-react";
import "../styles/Toast.css";

// ── Module-level state ──────────────────────────────────────────────
const subscribers = new Set();
const pendingQueue = [];
let containerReady = false;
let mounted = false;

function broadcast(toast) {
  if (containerReady) {
    subscribers.forEach((fn) => fn(toast));
  } else {
    pendingQueue.push(toast);
  }
}

// ── ToastItem ───────────────────────────────────────────────────────
const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  message: MessageSquare,
};

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);

  function startTimer() {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 3000);
  }

  function clearTimer() {
    clearTimeout(timerRef.current);
  }

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, []);

  const Icon = ICONS[toast.type] || MessageSquare;

  return (
    <motion.div
      className={`toast-pill toast-pill--${toast.type}`}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.94 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <Icon size={16} className="toast-icon" />
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={() => onDismiss(toast.id)}>
        <X size={13} />
      </button>
    </motion.div>
  );
}

// ── ToastContainer ──────────────────────────────────────────────────
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handle(toast) {
      setToasts((prev) => {
        const item = { ...toast, id: Date.now() + Math.random() };
        return [...prev, item].slice(-3);
      });
    }

    subscribers.add(handle);
    containerReady = true;
    pendingQueue.splice(0).forEach(handle);

    return () => subscribers.delete(handle);
  }, []);

  function dismiss(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Mounting ────────────────────────────────────────────────────────
function ensureMounted() {
  if (mounted) return;
  mounted = true;
  const div = document.createElement("div");
  document.body.appendChild(div);
  createRoot(div).render(<ToastContainer />);
}

// ── Public API ──────────────────────────────────────────────────────
export function useToasts() {
  function add(type, message) {
    ensureMounted();
    broadcast({ type, message });
  }
  return {
    success: (msg) => add("success", msg),
    error:   (msg) => add("error",   msg),
    warning: (msg) => add("warning", msg),
    message: (msg) => add("message", msg),
  };
}
