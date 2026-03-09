export default function AiWaveform({ active }) {
  return (
    <div className={`airm-ai-wave ${active ? "active" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
