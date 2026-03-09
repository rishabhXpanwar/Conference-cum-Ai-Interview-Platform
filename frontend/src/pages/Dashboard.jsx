import { useContext, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useToasts } from "../components/Toast";
import StarButton from "../components/StarButton";
import MeetingCreatedModal from "../components/MeetingCreatedModal";
import Navbar from "../components/Navbar";

import "../styles/Dashboard.css";




export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user , logout } = useContext(AuthContext);
  const toasts = useToasts();


  const[error , seterror] = useState("");
  const [loading , setloading] = useState(false);
  const [meetingCode , setmeetingCode] = useState("");
  const [joincode, setjoincode] = useState("");
  const [showModal , setshowModal] = useState(false);

  const handlecreateMeeting = async() => {
    try {

      const response = await API.post("/api/meetings/create");
      setmeetingCode(response.data.meetingCode);
      setshowModal(true);
      
    } catch (err) {

      seterror(err.response?.data?.message || "Failed to create Meeting")
      
    }
    setloading(false);

  }


  const handlejoinMeeting = async() => {

    if(!joincode)
       return;



    try {
      const res = await API.get(`/api/meetings/verify/${joincode}`);

      navigate(`/meeting/${joincode}`);
    } catch (error) {
      seterror(error.response?.data?.message || "Join meeting Failed");
    }
  }

  const handlecopy = () => {
    navigator.clipboard.writeText(meetingCode);
    toasts.success("Meeting code copied!");
  };

  const handleshare = () => {
    const link = `${window.location.origin}/meeting/${meetingCode}`;
    navigator.clipboard.writeText(link);
    toasts.success("Meeting link copied!");
  };






  return (
    <>


    <Navbar />
    <div className="dash-page">

      
      {/* ======================== MAIN ======================== */}
      <main className="dash-main">

        <div className="dash-section-header">
          <h2 className="dash-greeting">Good to have you back.</h2>
          <p className="dash-greeting-sub">Create or join a meeting to get started.</p>
        </div>

        {error && <div className="dash-error">{error}</div>}

        <div className="dash-cards">

          {/* Create Meeting */}
          <div className="dash-card dash-card--create">
            <div className="dash-card-icon dash-card-icon--blue">📹</div>
            <h3 className="dash-card-title">New Meeting</h3>
            <p className="dash-card-desc">
              Start an instant room and invite participants with a code.
            </p>
            <StarButton variant="primary" onClick={handlecreateMeeting} disabled={loading}>
              {loading ? "Creating…" : "Create Meeting"}
            </StarButton>
          </div>

          {/* Join Meeting */}
          <div className="dash-card dash-card--join">
            <div className="dash-card-icon dash-card-icon--cyan">🔗</div>
            <h3 className="dash-card-title">Join Meeting</h3>
            <p className="dash-card-desc">
              Paste a meeting code below and jump straight in.
            </p>
            <input
              className="dash-input"
              type="text"
              name="joincode"
              placeholder="Enter meeting code"
              value={joincode}
              onChange={(e) => setjoincode(e.target.value)}
            />
            <StarButton variant="join" onClick={handlejoinMeeting}>
              Join Meeting
            </StarButton>
          </div>

        </div>
      </main>

      {/* ======================== MODAL ======================== */}
      <MeetingCreatedModal
        isOpen={showModal}
        onClose={() => setshowModal(false)}
        meetingCode={meetingCode}
        onCopy={handlecopy}
        onShare={handleshare}
        onJoin={() => navigate(`/meeting/${meetingCode}`)}
      />

    </div>

    </>
  );
}
