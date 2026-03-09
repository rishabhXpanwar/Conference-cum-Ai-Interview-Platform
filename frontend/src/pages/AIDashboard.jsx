import { useState } from "react";
import Navbar from "../components/Navbar";
import DottedSurface from "../components/DottedSurface";
import RobotSpline from "../components/RobotSpline";
import StarButton from "../components/StarButton";
import CreateAIInterviewModal from "../components/CreateAIInterviewModal";
import JoinAIInterviewModal from "../components/JoinAIInterviewModal";

import "../styles/AIDashboard.css";

export default function AIDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <>
      <DottedSurface />
      <Navbar />
      <div className="ai-dashboard-main">
        <div className="ai-dashboard-left">
          <RobotSpline />
        </div>
        <div className="ai-dashboard-right">
          <div className="ai-section-header">
            <h1 className="ai-greeting">AI Interview Studio</h1>
            <p className="ai-greeting-sub">Create or join an AI-powered interview session.</p>
          </div>
          <div className="ai-cards">

            {/* Create Card */}
            <div className="ai-card ai-card--create">
              <div className="ai-card-icon">🤖</div>
              <h3 className="ai-card-title">New AI Interview</h3>
              <p className="ai-card-desc">Start an AI-led interview session and get instant candidate evaluation.</p>
              <StarButton variant="primary" onClick={() => setShowCreate(true)}>
                Create AI Interview
              </StarButton>
            </div>

            {/* Join Card */}
            <div className="ai-card ai-card--join">
              <div className="ai-card-icon">🔗</div>
              <h3 className="ai-card-title">Join AI Interview</h3>
              <p className="ai-card-desc">Enter a session code to join an ongoing AI interview.</p>
              <StarButton variant="join" onClick={() => setShowJoin(true)}>
                Join AI Interview
              </StarButton>
            </div>

          </div>
        </div>
      </div>

      {showCreate && <CreateAIInterviewModal close={() => setShowCreate(false)} />}
      {showJoin && <JoinAIInterviewModal close={() => setShowJoin(false)} />}
    </>
  );
}
