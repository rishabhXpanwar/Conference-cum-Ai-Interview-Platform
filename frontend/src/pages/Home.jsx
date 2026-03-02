// import "./Home.css";
// import { motion, useMotionValue, useTransform } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   /* ---------------- PARALLAX SETUP ---------------- */
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);

//   const rotateX = useTransform(y, [-200, 200], [10, -10]);
//   const rotateY = useTransform(x, [-200, 200], [-10, 10]);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     x.set(e.clientX - rect.left - rect.width / 2);
//     y.set(e.clientY - rect.top - rect.height / 2);
//   };

//   const resetTilt = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <div className="outer-bg">
      
//       {/* ================= HERO SECTION ================= */}
//       <section className="hero-wrapper">

//         <motion.div
//           className="hero-card"
//           style={{ rotateX, rotateY }}
//           onMouseMove={handleMouseMove}
//           onMouseLeave={resetTilt}
//           initial={{ opacity: 0, y: 60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >

//           {/* Floating Gradient Blobs */}
//           <div className="blob blob1"></div>
//           <div className="blob blob2"></div>

//           {/* ---------------- NAVBAR ---------------- */}
//           <nav className="nav">
//             <div className="logo">MeetSphere</div>

//             <div className="nav-links">
//               <a href="#">Home</a>
//               <a href="#features">Features</a>
//               <a href="#ai">AI Interview</a>
//               <a href="#contact">Contact</a>
//             </div>

//             <div className="nav-buttons">
//               <button
//                 className="signup"
//                 onClick={() => navigate("/signup")}
//               >
//                 Sign Up
//               </button>

//               <button
//                 className="login"
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </button>
//             </div>
//           </nav>

//           {/* ---------------- HERO CONTENT ---------------- */}
//           <div className="hero-content">

//             <motion.div
//               className="left"
//               initial={{ x: -80, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <h1>AI Powered Video Conferencing</h1>

//               <p>
//                 Conduct seamless meetings or switch to AI Interview mode.
//                 Real-time chat, attendance tracking and adaptive questioning —
//                 all in one intelligent platform.
//               </p>

//               <div className="buttons">
//                 <button className="btn-primary">
//                   Get Started
//                 </button>

//                 <button className="btn-secondary">
//                   Explore
//                 </button>
//               </div>
//             </motion.div>

//             <motion.div
//               className="right"
//               initial={{ x: 80, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               {/* Put your SVG inside public folder */}
//               <img
//                 src="/illustration.svg"
//                 alt="Video Illustration"
//                 className="hero-img"
//               />
//             </motion.div>

//           </div>
//         </motion.div>
//       </section>


//       {/* ================= FEATURES SECTION ================= */}
//       <motion.section
//         id="features"
//         className="features-section"
//         initial={{ opacity: 0, y: 80 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         <h2>Why MeetSphere?</h2>

//         <div className="feature-grid">

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>HD Video Calls</h3>
//             <p>
//               Powered by WebRTC for ultra-clear, low-latency meetings.
//             </p>
//           </motion.div>

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>Real-time Chat</h3>
//             <p>
//               Instant messaging integrated directly into meeting rooms.
//             </p>
//           </motion.div>

//           <motion.div
//             className="feature-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             <h3>Attendance Tracking</h3>
//             <p>
//               Automatic session logs and activity monitoring.
//             </p>
//           </motion.div>

//         </div>
//       </motion.section>


//       {/* ================= AI INTERVIEW SECTION ================= */}
//       <motion.section
//         id="ai"
//         className="ai-section"
//         initial={{ opacity: 0, y: 80 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         viewport={{ once: true }}
//       >
//         <h2>AI Interview Platform</h2>

//         <p>
//           Switch to Interview Mode. Upload resume. 
//           Let AI conduct technical, DSA and behavioral rounds dynamically.
//         </p>

//         <div className="ai-cards">

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Resume Parsing
//           </motion.div>

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Adaptive DSA Questions
//           </motion.div>

//           <motion.div
//             className="ai-card"
//             whileHover={{ scale: 1.05 }}
//           >
//             Behavioral Insights
//           </motion.div>

//         </div>
//       </motion.section>


//       {/* ================= CONTACT SECTION ================= */}
//       <motion.section
//         id="contact"
//         className="contact-section"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//         viewport={{ once: true }}
//       >
//         <h2>Ready to Experience MeetSphere?</h2>

//         <button
//           className="cta-button"
//           onClick={() => navigate("/signup")}
//         >
//           Start Now
//         </button>
//       </motion.section>

//       {/* ================= FOOTER ================= */}
// <footer className="footer">

//   <div className="footer-container">

//     {/* Brand Column */}
//     <div className="footer-col">
//       <h3>MeetSphere</h3>
//       <p>
//         AI powered video conferencing and intelligent interview
//         platform designed for modern teams.
//       </p>
//     </div>

//     {/* Product Links */}
//     <div className="footer-col">
//       <h4>Product</h4>
//       <ul>
//         <li>Video Meetings</li>
//         <li>AI Interview Mode</li>
//         <li>Attendance Tracking</li>
//         <li>Real-time Chat</li>
//       </ul>
//     </div>

//     {/* Company Links */}
//     <div className="footer-col">
//       <h4>Company</h4>
//       <ul>
//         <li>About Us</li>
//         <li>Careers</li>
//         <li>Blog</li>
//         <li>Contact</li>
//       </ul>
//     </div>

//     {/* Social */}
//     <div className="footer-col">
//       <h4>Connect</h4>
//       <ul>
//         <li>LinkedIn</li>
//         <li>Twitter</li>
//         <li>GitHub</li>
//         <li>Instagram</li>
//       </ul>
//     </div>

//   </div>

//   <div className="footer-bottom">
//     © {new Date().getFullYear()} MeetSphere. All rights reserved.
//   </div>

// </footer>

//     </div>
//   );
// }

// export default Home;



//--------------------------------------self version-------------------------------------------------------



import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "../components/HeroScene";

import "../styles/Home.css";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---- Refs ---- */
  const heroTagRef    = useRef(null);
  const heroHeadRef   = useRef(null);
  const heroSubRef    = useRef(null);
  const heroBtnRef    = useRef(null);
  const featSecRef    = useRef(null);
  const featCardsRef  = useRef(null);
  const aiSecRef      = useRef(null);
  const aiStepsRef    = useRef(null);
  const ctaSecRef     = useRef(null);

  /* ---- Redirect if logged in ---- */
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  /* ---- GSAP Animations ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Hero stagger */
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(heroTagRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(heroHeadRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .fromTo(heroSubRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .fromTo(heroBtnRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

      /* Features section scroll reveal */
      gsap.fromTo(featSecRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: featSecRef.current,
            start: "top 82%",
            once: true,
          },
        });

      gsap.fromTo(
        featCardsRef.current?.querySelectorAll(".feature-card"),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: featCardsRef.current,
            start: "top 80%",
            once: true,
          },
        });

      /* AI section scroll reveal */
      gsap.fromTo(aiSecRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: aiSecRef.current,
            start: "top 82%",
            once: true,
          },
        });

      gsap.fromTo(
        aiStepsRef.current?.querySelectorAll(".ai-step"),
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: aiStepsRef.current,
            start: "top 80%",
            once: true,
          },
        });

      /* CTA section scroll reveal */
      gsap.fromTo(ctaSecRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: ctaSecRef.current,
            start: "top 85%",
            once: true,
          },
        });
    });

    return () => ctx.revert();
  }, []);

  /* ---- Card hover tilt + float + AI step float ---- */
  useEffect(() => {
    const cleanups = [];

    /* Feature card 3D hover tilt + subtle float */
    const cards = featCardsRef.current?.querySelectorAll(".feature-card");
    cards?.forEach((card, i) => {
      /* Floating y oscillation — starts slightly delayed per card */
      const floatTween = gsap.to(card, {
        y: -7,
        duration: 2.2 + i * 0.28,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.4 + i * 0.18,
      });
      cleanups.push(() => floatTween.kill());

      /* 3D tilt on mouse move */
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        gsap.to(card, {
          rotationX: -dy * 7,
          rotationY:  dx * 7,
          transformPerspective: 900,
          ease: "power2.out",
          duration: 0.35,
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          ease: "power3.out",
          duration: 0.55,
          overwrite: "auto",
        });
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    /* AI step subtle float stagger */
    const steps = aiStepsRef.current?.querySelectorAll(".ai-step");
    steps?.forEach((step, i) => {
      const floatTween = gsap.to(step, {
        y: -5,
        duration: 2.6 + i * 0.22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2.0 + i * 0.30,
      });
      cleanups.push(() => floatTween.kill());
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="home-container">

      {/* ======================== NAVBAR ======================== */}
      <nav className="navbar glass-panel glass-panel--subtle">
        <div className="logo">MeetPro</div>
        <div className="nav-links">
          {!user ? (
            <>
              <Link to="/login" className="nav-btn btn-ghost">Login</Link>
              <Link to="/signup" className="nav-btn signup-btn btn-primary">Signup</Link>
            </>
          ) : (
            <Link to="/dashboard" className="nav-btn signup-btn btn-primary">Go to Dashboard</Link>
          )}
        </div>
      </nav>

      {/* ======================== HERO ======================== */}
      <section className="hero depth-layer">
        <HeroScene />
        <div className="hero-glow-orb" />

        <span className="hero-tag" ref={heroTagRef}>
          Real-time collaboration · AI-powered interviews
        </span>

        <h1 ref={heroHeadRef}>
          Where Meetings Become<br />
          <span className="hero-head-accent">Intelligent Conversations</span>
        </h1>

        <p ref={heroSubRef}>
          High-performance video conferencing built for modern teams —
          with an AI interview engine that evaluates talent the way humans never could.
        </p>

        <div className="hero-buttons" ref={heroBtnRef}>
          <Link to="/signup" className="btn-primary hero-cta-primary">
            Start a Meeting
          </Link>
          <a href="#ai-section" className="btn-glow hero-cta-secondary">
            Explore AI Mode
          </a>
        </div>

        <div className="hero-stat-row">
          <div className="hero-stat">
            <span className="hero-stat__value">WebRTC</span>
            <span className="hero-stat__label">Peer-to-peer</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat__value">End-to-end</span>
            <span className="hero-stat__label">Secure auth</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat__value">AI Engine</span>
            <span className="hero-stat__label">Coming soon</span>
          </div>
        </div>
      </section>

      {/* ======================== FEATURES ======================== */}
      <section className="feat-section" ref={featSecRef}>
        <div className="section-label">Core Platform</div>
        <h2 className="section-heading">Built for Performance.<br />Designed for Clarity.</h2>
        <p className="section-sub">
          Every component is engineered for low-latency, high-reliability real-time communication.
        </p>

        <div className="feature-grid" ref={featCardsRef}>
          <div className="feature-card glass-panel ambient-glow">
            <div className="feature-card__icon">
              <span className="feat-icon feat-icon--video" />
            </div>
            <h3>HD Video Conferencing</h3>
            <p>
              WebRTC peer-to-peer video and audio with adaptive bitrate.
              No plugins. No latency compromises.
            </p>
          </div>

          <div className="feature-card glass-panel ambient-glow">
            <div className="feature-card__icon">
              <span className="feat-icon feat-icon--chat" />
            </div>
            <h3>Real-time Messaging</h3>
            <p>
              In-session chat powered by Socket.io. Messages sync
              instantly across all participants.
            </p>
          </div>

          <div className="feature-card glass-panel ambient-glow">
            <div className="feature-card__icon">
              <span className="feat-icon feat-icon--shield" />
            </div>
            <h3>Secure by Design</h3>
            <p>
              JWT authentication with OTP-verified email. Every session
              is access-controlled and auditable.
            </p>
          </div>

          <div className="feature-card glass-panel ambient-glow">
            <div className="feature-card__icon">
              <span className="feat-icon feat-icon--activity" />
            </div>
            <h3>Attendance Tracking</h3>
            <p>
              Automatic session logs, join/leave timestamps and
              activity summaries — available in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* ======================== AI MODE ======================== */}
      <section className="ai-section" id="ai-section" ref={aiSecRef}>
        <div className="ai-section__inner">
          <div className="ai-section__header">
            <div className="section-label section-label--violet">AI Interview Mode</div>
            <h2 className="section-heading">
              Interviews That<br />
              <span className="ai-head-accent">Think For Themselves</span>
            </h2>
            <p className="section-sub">
              Upload a resume. Enter a meeting code. Let the AI conduct a
              full technical and behavioral interview — adapting questions
              in real time based on your responses.
            </p>
            <span className="ai-coming-badge">Coming Soon</span>
          </div>

          <div className="ai-steps" ref={aiStepsRef}>
            <div className="ai-step glass-panel">
              <div className="ai-step__number">01</div>
              <div className="ai-step__content">
                <h4>Upload Resume</h4>
                <p>The AI parses your skills, experience and tech stack to build a personalised question set.</p>
              </div>
            </div>

            <div className="ai-step glass-panel">
              <div className="ai-step__number">02</div>
              <div className="ai-step__content">
                <h4>Enter Interview Room</h4>
                <p>Join a dedicated session with your meeting code. The AI moderator is already waiting.</p>
              </div>
            </div>

            <div className="ai-step glass-panel">
              <div className="ai-step__number">03</div>
              <div className="ai-step__content">
                <h4>Adaptive Questioning</h4>
                <p>DSA, system design and behavioural rounds — dynamically constructed from your profile.</p>
              </div>
            </div>

            <div className="ai-step glass-panel">
              <div className="ai-step__number">04</div>
              <div className="ai-step__content">
                <h4>Intelligent Evaluation</h4>
                <p>Receive structured feedback and scoring immediately after the session ends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="cta-section" ref={ctaSecRef}>
        <div className="cta-section__inner glass-panel glass-panel--strong">
          <div className="cta-glow-orb" />
          <h2 className="cta-heading">Ready to collaborate at a higher level?</h2>
          <p className="cta-sub">
            Create your account in seconds. No credit card. No waiting.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary cta-btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-glow cta-btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="footer">
        © {new Date().getFullYear()} MeetPro. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;