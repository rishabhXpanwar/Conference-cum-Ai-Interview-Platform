import "../styles/star-button.css";

const STAR_PATH =
  "M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z";

const STARS = [
  { n: 1, size: 25 },
  { n: 2, size: 15 },
  { n: 3, size: 5  },
  { n: 4, size: 8  },
  { n: 5, size: 15 },
  { n: 6, size: 5  },
];

export default function StarButton({ children, onClick, disabled, variant = "primary" }) {
  const variantClass = `star-btn--${variant}`;
  const disabledClass = disabled ? "star-btn--disabled" : "";

  return (
    <button
      className={`star-btn ${variantClass} ${disabledClass}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {STARS.map(({ n, size }) => (
        <span
          key={n}
          className={`star-btn__star star-btn__star--${n}`}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 784.11 815.53"
            width={size}
            height={size}
          >
            <path d={STAR_PATH} />
          </svg>
        </span>
      ))}
      <span className="star-btn__label">{children}</span>
    </button>
  );
}
