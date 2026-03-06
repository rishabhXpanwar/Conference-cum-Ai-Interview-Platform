export default function AiWaveform({ active }) {
  return (
    <div className={`ai-wave ${active ? "active" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
