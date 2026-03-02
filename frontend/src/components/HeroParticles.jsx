import { useEffect, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

/* ------------------------------------------------------------------ */
/* Particle network config — tuned for perf + cinematic AI SaaS vibe  */
/* ------------------------------------------------------------------ */
const PARTICLE_CONFIG = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  detectRetina: true,
  background: { color: { value: "transparent" } },
  particles: {
    number: {
      value: 72,
      density: { enable: true, area: 900 },
    },
    color: {
      value: ["#4f7df9", "#7c5bf5", "#38bdf8"],
    },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.15, max: 0.45 },
    },
    size: {
      value: { min: 1, max: 2.5 },
    },
    links: {
      enable: true,
      distance: 140,
      color: "#4f7df9",
      opacity: 0.12,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" },
    },
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      onClick: { enable: false },
      resize: { enable: true },
    },
    modes: {
      grab: {
        distance: 160,
        links: { opacity: 0.30 },
      },
    },
  },
};

/* ------------------------------------------------------------------ */

function HeroParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // loadSlim keeps the bundle small — no need for the full engine
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="hero-particles"
      className="hero-particles"
      options={PARTICLE_CONFIG}
    />
  );
}

export default memo(HeroParticles);
