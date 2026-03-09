import { useEffect, useId, useRef, useState } from "react";
import { MinusIcon } from "lucide-react";
import "../styles/otp-input.css";

export default function OtpInput({ length = 6, separator = true, onComplete }) {
  const id = useId();
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => { inputsRef.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== "")) onComplete?.(newOtp.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = [...otp];
    pasted.split("").forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    if (pasted.length === length) onComplete?.(newOtp.join(""));
  };

  return (
    <div className="otp-root">
      <div className="otp-row">
        {otp.map((digit, index) => (
          <div key={index} className="otp-cell">
            <input
              id={`${id}-${index + 1}`}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`otp-box${digit ? " otp-box--filled" : ""}`}
              aria-label={`Digit ${index + 1}`}
            />
            {separator && index === Math.floor(length / 2) - 1 && (
              <span className="otp-separator"><MinusIcon size={16} /></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
