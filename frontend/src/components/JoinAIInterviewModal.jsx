import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

import "../styles/JoinAIInterviewModal.css";

export default function JoinAIInterviewModal({ close }) {
  const [aiCode, setAiCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!aiCode.trim()) {
      alert("Enter interview code");
      return;
    }

    try {
      setLoading(true);

      // MATCHES BACKEND ROUTE
      const res = await API.post(`/api/ai/verify/${aiCode}`);

      const data = res.data;

      /*
      backend returns:
      interviewId
      jobRole
      interviewer
      status
      */

      // navigate to resume upload
      navigate(`/ai/upload-resume/${aiCode}`, {
        state: {
          interviewId: data.interviewId,
          jobRole: data.jobRole,
          interviewer: data.interviewer,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify interview code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <h2>Join AI Interview</h2>

        <input
          type="text"
          placeholder="Enter AI Interview Code"
          value={aiCode}
          onChange={(e) => setAiCode(e.target.value)}
          className="ai-input"
        />

        <div className="ai-modal-buttons">
          <button
            className="ai-btn-primary"
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Join"}
          </button>

          <button className="ai-btn-secondary" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
