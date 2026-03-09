import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Navbar from "../components/Navbar";

import "../styles/Activity.css";

/* Display-only helper — does not touch business logic */
function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}


export default function Activity() {


    const [activity , setactivity] = useState([]);
    const [error , seterror] = useState("");

        useEffect(()=>{
            fetchActivity();
        },[]);

        const fetchActivity = async () => {
            try {
                const res = await API.post("/api/activity/myactivity");
                setactivity(res.data);
            } catch (error) {

                seterror(error.respone?.data?.message || "Get Activity Failed");
                
            }

        }


  return (
    <>
    <Navbar />
    <div className="act-page">
      <div className="act-inner">

        {/* ---- Header ---- */}
        <div className="act-header">
          <h1 className="act-title">Activity</h1>
          <p className="act-subtitle">Your last 5 meeting sessions</p>
        </div>

        {/* ---- Error ---- */}
        {error && <div className="act-error">{error}</div>}

        {/* ---- Empty state ---- */}
        {activity.length === 0 && !error && (
          <div className="act-empty">
            <div className="act-empty-icon">📋</div>
            <p className="act-empty-text">No meetings attended yet.</p>
            <p className="act-empty-sub">Create or join a meeting to see your history here.</p>
            <Link to="/dashboard" className="act-empty-cta">Go to Dashboard</Link>
          </div>
        )}

        {/* ---- Timeline ---- */}
        {activity.length > 0 && (
          <ol className="act-timeline">
            {activity.slice(0, 5).map((item, index) => (
              <motion.li
                key={index}
                className="act-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="act-item-dot" />
                <div className="act-card">

                  <div className="act-card-top">
                    <span className="act-code-badge">
                      {item.meetingCode}
                    </span>
                    <span className="act-duration">
                      {formatDuration(item.duration)}
                    </span>
                  </div>

                  <div className="act-card-bottom">
                    <span className="act-date">
                      {new Date(item.joinedAt).toLocaleString()}
                    </span>
                  </div>

                </div>
              </motion.li>
            ))}
          </ol>
        )}

      </div>
    </div>
    </>
  );
}
