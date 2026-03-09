import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import createGlobe from "cobe";

function Globe() {
  const canvasRef = useRef(null);
  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 1.5),
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.4, 0.3, 0.6],
      markerColor: [0.4, 0.5, 1],
      glowColor: [0.3, 0.2, 0.5],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => { state.phi = phi; phi += 0.01; },
    });
    return () => { globe.destroy(); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="feat-bento-globe"
      style={{ width: 420, height: 420, maxWidth: "100%", aspectRatio: "1" }}
    />
  );
}

const chatMessages = [
  { text: "Meeting starts in 2 min", self: false },
  { text: "On my way!", self: true },
  { text: "Link sent to everyone 🚀", self: false },
];

function ChatSkeleton() {
  return (
    <div className="feat-bento-chat">
      {chatMessages.map((msg, i) => (
        <motion.div
          key={i}
          className={"feat-bento-bubble" + (msg.self ? " feat-bento-bubble--self" : "")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.35 + 0.2, duration: 0.4 }}
        >
          {msg.text}
        </motion.div>
      ))}
    </div>
  );
}

function PulseRings() {
  return (
    <div className="feat-bento-pulse">
      <div className="feat-bento-pulse__ring feat-bento-pulse__ring--1" />
      <div className="feat-bento-pulse__ring feat-bento-pulse__ring--2" />
      <div className="feat-bento-pulse__ring feat-bento-pulse__ring--3" />
      <div className="feat-bento-pulse__dot" />
    </div>
  );
}

function ShieldSkeleton() {
  return (
    <div className="feat-bento-shield">
      <div className="feat-bento-shield__ring" />
      <ShieldCheck className="feat-bento-shield__icon" size={36} />
    </div>
  );
}

function FeatureBento() {
  return (
    <div className="feat-bento-grid">
      {/* Card 1 — wide (4 cols) */}
      <div className="feat-bento-card feat-bento-card--wide home-feat-card">
        <h3>HD Video Conferencing</h3>
        <p>WebRTC peer-to-peer, adaptive bitrate. No plugins. No latency.</p>
        <PulseRings />
      </div>

      {/* Card 2 — narrow (2 cols) */}
      <div className="feat-bento-card feat-bento-card--narrow home-feat-card">
        <h3>Real-time Messaging</h3>
        <p>Socket.io powered in-session chat, syncs instantly.</p>
        <ChatSkeleton />
      </div>

      {/* Card 3 — half (3 cols) */}
      <div className="feat-bento-card feat-bento-card--half home-feat-card">
        <h3>Secure by Design</h3>
        <p>JWT + OTP-verified email. Access-controlled sessions.</p>
        <ShieldSkeleton />
      </div>

      {/* Card 4 — half (3 cols) */}
      <div className="feat-bento-card feat-bento-card--half home-feat-card">
        <h3>Global Infrastructure</h3>
        <p>Low-latency WebRTC across regions. Built for scale.</p>
        <div className="feat-bento-globe-wrap">
          <Globe />
        </div>
      </div>
    </div>
  );
}

export default memo(FeatureBento);
