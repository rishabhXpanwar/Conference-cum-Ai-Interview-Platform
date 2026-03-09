import "../styles/Auth.css";

const rings = [0, 1, 2, 3, 4, 5];

const orbits = [
  { icon: "devicon-react-original", radius: 90, duration: 8, reverse: false, color: "#61DAFB" },
  { icon: "devicon-nodejs-plain", radius: 130, duration: 12, reverse: true, color: "#539E43" },
  { icon: "devicon-javascript-plain", radius: 170, duration: 16, reverse: false, color: "#F7DF1E" },
  { icon: "devicon-css3-plain", radius: 210, duration: 20, reverse: true, color: "#264DE4" },
];

export default function AuthVisual() {
  return (
    <div className="auth-visual" aria-hidden="true">
      {/* Ripple rings */}
      {rings.map((i) => (
        <span
          key={i}
          className="auth-ripple-ring"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      {/* Orbiting icons */}
      {orbits.map((orbit, i) => (
        <div
          key={i}
          className="auth-orbit"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
            animationDuration: `${orbit.duration}s`,
            animationDirection: orbit.reverse ? "reverse" : "normal",
          }}
        >
          <span
            className="auth-orbit-icon"
            style={{ color: orbit.color }}
          >
            <i className={orbit.icon} />
          </span>
        </div>
      ))}

      {/* Center text */}
      <div className="auth-visual-center">
        <span className="auth-visual-text">MeetPro</span>
        <span className="auth-visual-tagline">Connect · Collaborate · Create</span>
      </div>
    </div>
  );
}
