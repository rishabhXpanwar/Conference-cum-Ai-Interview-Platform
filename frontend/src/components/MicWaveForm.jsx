import { useEffect, useRef } from "react";

export default function MicWaveform({ stream }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();

    const analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;

      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;

        ctx.fillStyle = "#7C3AED";

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }
    };

    draw();
  }, [stream]);

  return (
    <canvas ref={canvasRef} width="300" height="80" className="mic-wave" />
  );
}
