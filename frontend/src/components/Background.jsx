import "../styles/background.css";

function Background() {
  return (
    <div className="cinematic-bg" aria-hidden="true">
      {/* Mesh gradient orbs */}
      <div className="cinematic-bg__orb cinematic-bg__orb--blue" />
      <div className="cinematic-bg__orb cinematic-bg__orb--violet" />
      <div className="cinematic-bg__orb cinematic-bg__orb--cyan" />

      {/* Ambient radial glow layers */}
      <div className="cinematic-bg__glow cinematic-bg__glow--top" />
      <div className="cinematic-bg__glow cinematic-bg__glow--bottom" />

      {/* Noise texture overlay */}
      <div className="cinematic-bg__noise" />

      {/* Vignette */}
      <div className="cinematic-bg__vignette" />
    </div>
  );
}

export default Background;
