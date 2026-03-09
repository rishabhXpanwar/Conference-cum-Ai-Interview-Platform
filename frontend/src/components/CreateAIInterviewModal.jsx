import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, Copy, Share2, X, Zap } from "lucide-react";

import "../styles/AIModal.css";

export default function CreateAIInterviewModal({ close }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAuthorized = user?.role === "interviewer" || user?.role === "admin";

  const [jobRole, setJobRole] = useState("");
  const [note, setNote] = useState("");

  const [createdCode, setCreatedCode] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!isAuthorized) {
      close?.();
      navigate("/pricing");
    }
  }, [close, isAuthorized, navigate, user]);

  const createInterview = async () => {
    if (!isAuthorized) {
      navigate("/pricing");
      return;
    }

    try {
      const res = await API.post("/api/ai/create", {
        jobRole,
        note,
      });

      setCreatedCode(res.data.aiCode);
    } catch (err) {
      alert(err.response?.data?.message || "Create interview failed");
    }
  };

  /* COPY CODE */

  const copyCode = () => {
    navigator.clipboard.writeText(createdCode);

    alert("Code copied");
  };

  /* SHARE CODE */

  const shareCode = () => {
    const link = `${window.location.origin}/ai/join/${createdCode}`;

    navigator.clipboard.writeText(link);

    alert("Share link copied");
  };

  if (user && !isAuthorized) {
    return null;
  }

  return (
    <motion.div
      className="ai-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.div
        className="ai-modal"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create AI Interview</h2>

        {!createdCode && (
          <>
            <div className="aim-input-group">
              <Briefcase size={16} className="aim-input-icon" />
              <input
                type="text"
                placeholder="Job Role"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>

            <div className="aim-input-group aim-input-group--textarea">
              <FileText size={16} className="aim-input-icon" />
              <textarea
                placeholder="Notes"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="ai-modal-actions">
              <button className="ai-btn" onClick={createInterview}>
                Create
              </button>

              <button className="ai-btn-secondary" onClick={close}>
                Cancel
              </button>
            </div>
          </>
        )}

        {createdCode && (
          <div className="ai-code-section">
            <div className="aim-success-icon"><Zap size={20} /></div>
            <h3>Interview Created</h3>

            <div className="ai-code-box">{createdCode}</div>

            <div className="ai-code-actions">
              <button className="ai-btn" onClick={copyCode}><Copy size={15} /> Copy Code</button>

              <button className="ai-btn" onClick={shareCode}><Share2 size={15} /> Share Link</button>

              <button className="ai-btn-secondary" onClick={close}><X size={15} /> Close</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
