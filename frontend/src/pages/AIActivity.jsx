import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
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
    <div className="ai-activity">
      <h1>AI Interview Activity</h1>

      <div className="ai-card-container">
        {data.map((i) => (
          <div key={i.interviewId} className="ai-card">
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

            <p>
              <b>Status:</b> {i.status}
            </p>

            <button
  className="score-btn"
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
        <div className="ai-modal-overlay" onClick={closeModal}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
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
              <div className="score-section">
                <p>
                  <b>Technical:</b> {selectedInterview.score.technical}
                </p>

                <p>
                  <b>Communication:</b> {selectedInterview.score.communication}
                </p>

                <p>
                  <b>Overall:</b> {selectedInterview.score.overall}
                </p>

                <p>
                  <b>Feedback:</b> {selectedInterview.score.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
