import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/AINavbar.css";
import "../styles/Dashboard.css";

import { AuthContext } from "../context/AuthContext";

export default function AINavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* ======================== NAVBAR ======================== */}

      <nav className="dash-nav">
        <span className="dash-nav-logo">MeetPro</span>

        {/* ---- Mode Toggle ---- */}

        <div className="dash-toggle-pill">
          <span
            className={`dash-toggle-option ${
              location.pathname === "/dashboard"
                ? " dash-toggle-option--active"
                : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Meet Mode
          </span>

          <span
            className={`dash-toggle-option ${
              location.pathname === "/ai/dashboard"
                ? " dash-toggle-option--active"
                : ""
            }`}
            onClick={() => navigate("/ai/dashboard")}
          >
            AI Mode
          </span>
        </div>

        <div className="dash-nav-right">
          <span className="dash-welcome-pill">
            Welcome, <span>{user?.name}</span>
          </span>

          <button
            className="dash-nav-btn dash-nav-btn--ghost"
            onClick={() => navigate("/ai/activity")}
          >
            My Activity
          </button>

          <button
            className="dash-nav-btn dash-nav-btn--danger"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
