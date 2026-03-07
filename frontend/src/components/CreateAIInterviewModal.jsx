import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <h2>Create AI Interview</h2>

        {!createdCode && (
          <>
            <input
              type="text"
              placeholder="Job Role"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />

            <textarea
              placeholder="Notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

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
            <h3>Interview Created</h3>

            <div className="ai-code-box">{createdCode}</div>

            <div className="ai-code-actions">
              <button className="ai-btn" onClick={copyCode}>
                Copy Code
              </button>

              <button className="ai-btn" onClick={shareCode}>
                Share
              </button>

              <button className="ai-btn-secondary" onClick={close}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
