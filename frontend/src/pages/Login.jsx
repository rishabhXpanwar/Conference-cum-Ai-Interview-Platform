import { useContext , useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import "../styles/Auth.css";

import { loginWithPassword, sendLoginOtp , verifyLoginOtp } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


export default function Login() {

  const navigate = useNavigate();
  const [formData , setformData] = useState({
    email : "",
    password : "",
    otp : ""

  });

  const [isotpmode , setisotpmode] = useState(false);
  const [otpsent , setotpsent] = useState(false);
  const [loading , setloading] = useState(false);
  const [error, seterror] = useState("");
  const {login} = useContext(AuthContext);

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  const handleloginwithPassword = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try{
      const response = await loginWithPassword({
        email : formData.email,
        password : formData.password
      })

      login(response.data);
      navigate("/dashboard");

    }
    catch(err)
    {
      seterror(err.response?.data?.message || " Login With Password Failed ");
    }

    setloading(false);
  }

  const handleSendOtp = async ()=> {

    setloading(true);
    seterror("");

    try{
      await sendLoginOtp({
        email : formData.email
      })

      setotpsent(true);


    }
    catch(err)
    {
      seterror(err.response?.data?.message || "Send OTP Failed");
    }
    setloading(false);
  }


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try {

      const response = await verifyLoginOtp({
        email : formData.email,
        otp : formData.otp
      })

      login(response.data);
      navigate("/dashboard");
      
    } catch (err) {
      seterror(err.response?.data?.message || "OTP verification Failed");
      
    }
    setloading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-glow" />

      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-name">MeetPro</span>
        </div>

        <h2 className="auth-heading">
          {isotpmode ? "Sign in with OTP" : "Welcome back"}
        </h2>
        <p className="auth-subtext">
          {isotpmode
            ? "Enter your email to receive a one-time code"
            : "Sign in to continue to MeetPro"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        {/* Password login */}
        {!isotpmode && (
          <form className="auth-form" onSubmit={handleloginwithPassword}>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-wrap">
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-links-row">
              <span className="auth-link">Forgot password?</span>
              <span
                className="auth-link auth-link--accent"
                onClick={() => setisotpmode(true)}
              >
                Login with OTP
              </span>
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* OTP login */}
        {isotpmode && (
          <>
            {!otpsent ? (
              <div className="auth-form">
                <div className="auth-input-wrap">
                  <input
                    className="auth-input"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  className="auth-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send OTP"}
                </button>
                <span
                  className="auth-back-link"
                  onClick={() => { setisotpmode(false); setotpsent(false); }}
                >
                  ← Back to password login
                </span>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <p className="auth-otp-hint">
                  A code was sent to <strong>{formData.email}</strong>
                </p>
                <div className="auth-input-wrap">
                  <input
                    className="auth-input"
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                  {loading ? "Verifying…" : "Verify OTP"}
                </button>
              </form>
            )}
          </>
        )}

        <p className="auth-switch">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
