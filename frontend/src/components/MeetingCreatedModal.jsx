import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, CheckCircle } from "lucide-react";
import "../styles/meeting-created-modal.css";

export default function MeetingCreatedModal({
  isOpen,
  onClose,
  meetingCode,
  onCopy,
  onShare,
  onJoin,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="mcm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="mcm-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="mcm-badge">
              <CheckCircle size={12} />
              Meeting Ready
            </div>

            {/* Close */}
            <button className="mcm-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>

            {/* Icon area */}
            <div className="mcm-icon-area">
              <Zap size={40} className="mcm-zap-icon" />
            </div>

            {/* Text */}
            <h3 className="mcm-title">Meeting Created!</h3>
            <p className="mcm-subtitle">Share the code with your participants</p>

            {/* Code pill */}
            <div className="mcm-code-pill">{meetingCode}</div>

            {/* Actions */}
            <div className="mcm-actions">
              <button className="mcm-btn mcm-btn--ghost" onClick={onCopy}>
                Copy Code
              </button>
              <button className="mcm-btn mcm-btn--ghost" onClick={onShare}>
                Share Link
              </button>
              <button className="mcm-btn mcm-btn--primary" onClick={onJoin}>
                Join the Meeting
              </button>
            </div>

            <span className="mcm-dismiss" onClick={onClose}>Dismiss</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
