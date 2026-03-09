import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/AINavbar.css";
import "../styles/Dashboard.css";

import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const isAIMode = location.pathname.startsWith("/ai");

  const handleActivityClick = () => {
    if (isAIMode) {
      navigate("/ai/activity");
    } else {
      navigate("/activity");
    }
  };

  return (
    <nav className="dash-nav">
      <span className="dash-nav-logo">MeetPro</span>

      {/* ---- Mode Toggle — only when logged in ---- */}
      {user && (
        <div className="dash-toggle-pill">
          <span
            className={`dash-toggle-option ${
              location.pathname === "/dashboard"
                ? "dash-toggle-option--active"
                : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Meet Mode
          </span>

          <span
            className={`dash-toggle-option ${
              location.pathname === "/ai/dashboard"
                ? "dash-toggle-option--active"
                : ""
            }`}
            onClick={() => navigate("/ai/dashboard")}
          >
            AI Mode
          </span>
        </div>
      )}

      {/* ---- Right side ---- */}
      <div className="dash-nav-right">

        {/* Logged In */}
        {user ? (
          <>
            <span className="dash-welcome-pill">
              Welcome, <span>{user.name}</span>
            </span>

            <button
              className="dash-nav-btn dash-nav-btn--ghost"
              onClick={handleActivityClick}
            >
              My Activity
            </button>

            <button
              className="dash-nav-btn dash-nav-btn--danger"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          /* Logged Out */
          <>
            <button
              className="dash-nav-btn dash-nav-btn--ghost"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="dash-nav-btn dash-nav-btn--primary"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </>
        )}

      </div>
    </nav>
  );
}