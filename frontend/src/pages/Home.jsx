import { Link } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "../components/HeroScene";
import Navbar from "../components/Navbar";
import ShaderBackground from "../components/ShaderBackground";
import MagnetizeButton from "../components/MagnetizeButton";
import FeatureBento from "../components/FeatureBento";
import HomeFooter from "../components/HomeFooter";

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
        featCardsRef.current?.querySelectorAll(".home-feat-card"),
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
        aiStepsRef.current?.querySelectorAll(".home-ai-step"),
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

  /* ---- Card hover tilt ---- */
  useEffect(() => {
    const cleanups = [];
    const ctx = gsap.context(() => {
      const cards = featCardsRef.current?.querySelectorAll(".home-feat-card");
      cards?.forEach((card) => {
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
    });

    return () => { cleanups.forEach((fn) => fn()); ctx.revert(); };
  }, []);

  return (
    <>
      <Navbar />

    <div className="home-container">

      {/* ======================== HERO ======================== */}
      <section className="hero depth-layer">
        <ShaderBackground />
        {/* <HeroScene /> */}
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
          <MagnetizeButton onClick={() => navigate("/signup")} className="hero-cta-primary">
            Start a Meeting
          </MagnetizeButton>
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

        <div ref={featCardsRef}>
          <FeatureBento />
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
            <span className="ai-coming-badge">Live Now</span>
          </div>

          <div className="ai-steps" ref={aiStepsRef}>
            <div className="home-ai-step">
              <div className="home-ai-step__number">01</div>
              <div className="home-ai-step__content">
                <h4>Upload Resume</h4>
                <p>The AI parses your skills, experience and tech stack to build a personalised question set.</p>
              </div>
            </div>

            <div className="home-ai-step">
              <div className="home-ai-step__number">02</div>
              <div className="home-ai-step__content">
                <h4>Enter Interview Room</h4>
                <p>Join a dedicated session with your meeting code. The AI moderator is already waiting.</p>
              </div>
            </div>

            <div className="home-ai-step">
              <div className="home-ai-step__number">03</div>
              <div className="home-ai-step__content">
                <h4>Adaptive Questioning</h4>
                <p>DSA, system design and behavioural rounds — dynamically constructed from your profile.</p>
              </div>
            </div>

            <div className="home-ai-step">
              <div className="home-ai-step__number">04</div>
              <div className="home-ai-step__content">
                <h4>Intelligent Evaluation</h4>
                <p>Receive structured feedback and scoring immediately after the session ends.</p>
              </div>
            </div>

            <div className="home-ai-step">
              <div className="home-ai-step__number">05</div>
              <div className="home-ai-step__content">
                <h4>Face Attention Detection</h4>
                <p>FaceAPI monitors candidate presence in real time — ensuring integrity throughout the session.</p>
              </div>
            </div>

            <div className="home-ai-step">
              <div className="home-ai-step__number">06</div>
              <div className="home-ai-step__content">
                <h4>Score &amp; Feedback Report</h4>
                <p>Technical, communication and overall scores — delivered as a structured report the moment the interview ends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="cta-section" ref={ctaSecRef}>
        <div className="cta-section__inner home-cta-box">
          <div className="cta-glow-orb" />
          <h2 className="cta-heading">Ready to collaborate at a higher level?</h2>
          <p className="cta-sub">
            Create your account in seconds. No credit card. No waiting.
          </p>
          <div className="cta-buttons">
            <MagnetizeButton onClick={() => navigate("/signup")} className="cta-btn-primary">
              Get Started Free
            </MagnetizeButton>
            <Link to="/login" className="btn-glow cta-btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <HomeFooter />

    </div>

    </>
  );
}

export default Home;