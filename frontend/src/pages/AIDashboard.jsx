import { useState } from "react";
import Navbar from "../components/Navbar";

import CreateAIInterviewModal from "../components/CreateAIInterviewModal";
import JoinAIInterviewModal from "../components/JoinAIInterviewModal";

import "../styles/AIDashboard.css";

export default function AIDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <div className="ai-dashboard">
        <h1>AI Interview Dashboard</h1>

        <div className="ai-actions">
          <button className="ai-btn" onClick={() => setShowCreate(true)}>
            Create AI Interview
          </button>

          <button className="ai-btn" onClick={() => setShowJoin(true)}>
            Join AI Interview
          </button>
        </div>

        {showCreate && (
          <CreateAIInterviewModal close={() => setShowCreate(false)} />
        )}

        {showJoin && <JoinAIInterviewModal close={() => setShowJoin(false)} />}
      </div>
    </>
  );
}
