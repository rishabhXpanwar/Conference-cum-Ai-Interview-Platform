import { useContext , useState,  } from "react";

import "../styles/Auth.css";
import { useNavigate, Link } from "react-router-dom";

import { signupUser } from "../api/auth";


import { AuthContext } from "../context/AuthContext";

export default function Signup() {

  const [formData , setformData] = useState({
    name : "",
    username : "",
    email : "",
    password : ""
  });
  const [loading , setloading] = useState(false);

  const [error, seterror] = useState("");
  const navigate = useNavigate();



  const {login} = useContext(AuthContext);

  const handleChange =(e) => {
    setformData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    seterror("");

    try{

      const response = await signupUser(formData);
      const data = response.data;

      login(data);
      navigate("/dashboard");

    }
    catch(err)
    {
      seterror(err.response?.data?.message || "Signup Failed"); 

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

        <h2 className="auth-heading">Create account</h2>
        <p className="auth-subtext">Join MeetPro and start collaborating</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input-wrap">
            <input
              className="auth-input"
              type="email"
              name="email"
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
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

