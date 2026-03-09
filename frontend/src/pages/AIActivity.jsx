import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DottedSurface from "../components/DottedSurface";
import Navbar from "../components/Navbar";
import "../styles/AIActivity.css";

export default function AIActivity() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    if (user) fetchActivity();
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      fetchActivity();
    };

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const fetchActivity = async () => {
    try {
      let url;

      if (user.role === "interviewer" || user.role === "admin")
        url = "/api/ai/created";
      else
        url = "/api/ai/my-interviews";

      const res = await API.get(url);

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedInterview(null);
  };

  return (
    <>
      <DottedSurface />
      <Navbar />
      <div className="aia-page">
        <h1>AI Interview Activity</h1>

        <div className="aia-grid">
          {data.map((i) => (
            <div key={i.interviewId} className={`aia-card aia-card--${i.status}`}>
              <span className="aia-status-badge">{i.status}</span>
              <h3>{i.jobRole}</h3>

              <p>
                <b>Note:</b> {i.note}
              </p>

              {user.role === "interviewer" ? (
                <p>
                  <b>Candidate:</b>{" "}
                  {i.candidate === "-" ? "Not Attended" : i.candidate.name}
                </p>
              ) : (
                <p>
                  <b>Interviewer:</b> {i.interviewer?.name}
                </p>
              )}

              <button
                className="aia-score-btn"
                disabled={i.status !== "completed"}
                onClick={() => setSelectedInterview(i)}
              >
                View Score
              </button>
            </div>
          ))}
        </div>

        {/* ================= MODAL ================= */}

        {selectedInterview && (
          <div className="aia-modal-overlay" onClick={closeModal}>
            <div className="aia-modal" onClick={(e) => e.stopPropagation()}>
              <button className="aia-modal-close" onClick={closeModal}>✕</button>
              <h2>Interview Details</h2>

              <p>
                <b>Job Role:</b> {selectedInterview.jobRole}
              </p>

              <p>
                <b>Note:</b> {selectedInterview.note}
              </p>

              {user.role === "interviewer" ? (
                <p>
                  <b>Candidate:</b>{" "}
                  {selectedInterview.candidate === "-"
                    ? "Not Attended"
                    : selectedInterview.candidate.name}
                </p>
              ) : (
                <p>
                  <b>Interviewer:</b> {selectedInterview.interviewer?.name}
                </p>
              )}

              <p>
                <b>Status:</b> {selectedInterview.status}
              </p>

              <hr />

              {selectedInterview.score === "-" ? (
                <p>No score available yet</p>
              ) : (
                <div className="aia-score-section">
                  <div className="aia-score-card">
                    <span className="aia-score-label">Technical</span>
                    <span className="aia-score-value">{selectedInterview.score.technical}</span>
                  </div>
                  <div className="aia-score-card">
                    <span className="aia-score-label">Communication</span>
                    <span className="aia-score-value">{selectedInterview.score.communication}</span>
                  </div>
                  <div className="aia-score-card">
                    <span className="aia-score-label">Overall</span>
                    <span className="aia-score-value">{selectedInterview.score.overall}</span>
                  </div>
                  <div className="aia-feedback-block">
                    <p>{selectedInterview.score.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
