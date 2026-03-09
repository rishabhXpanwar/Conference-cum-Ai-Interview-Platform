import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../styles/navbar.css";

import { AuthContext } from "../context/AuthContext";
import MenuToggleIcon from "./MenuToggleIcon";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const isAIMode = location.pathname.startsWith("/ai");

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleActivityClick = () => {
    if (isAIMode) {
      navigate("/ai/activity");
    } else {
      navigate("/activity");
    }
  };

  return (
    <>
      <div className={"dash-nav-wrapper" + (scrolled ? " dash-nav-wrapper--scrolled" : "")}>
      <nav className={"dash-nav" + (scrolled ? " dash-nav--scrolled" : "")}>
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

        <button
          className="dash-nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={mobileOpen} duration={300} />
        </button>
      </nav>
      </div>

      {mobileOpen && (
        <div className="dash-nav-mobile-menu">
          {!user && (
            <>
              <button className="dash-mobile-btn" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Sign In</button>
              <button className="dash-mobile-btn dash-mobile-btn--primary" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Sign Up</button>
            </>
          )}
          {user && (
            <>
              <button className="dash-mobile-btn" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>Meet Mode</button>
              <button className="dash-mobile-btn" onClick={() => { navigate("/ai/dashboard"); setMobileOpen(false); }}>AI Mode</button>
              <button className="dash-mobile-btn" onClick={() => { navigate(isAIMode ? "/ai/activity" : "/activity"); setMobileOpen(false); }}>My Activity</button>
              <button className="dash-mobile-btn dash-mobile-btn--danger" onClick={() => { logout(); setMobileOpen(false); }}>Logout</button>
            </>
          )}
        </div>
      )}
    </>
  );
}