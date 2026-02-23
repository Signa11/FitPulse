export default function ProgressRing({ done, total, size = 36 }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? done / total : 0;
  const offset = c * (1 - pct);

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" strokeWidth="3"
        stroke="rgba(255,255,255,0.1)"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" strokeWidth="3" strokeLinecap="round"
        stroke="#22c55e"
        strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s' }}
      />
    </svg>
  );
}
