export function ScoreRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  const radius = size * 0.42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  // Color based on score
  let ringColor = "#ef4444"; // red
  if (score >= 70) ringColor = "#a855f7"; // purple
  else if (score >= 45) ringColor = "#f59e0b"; // amber

  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        className="stroke-slate-200 dark:stroke-white/10"
        strokeWidth="8"
      />

      {/* Progress ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${centerX} ${centerY})`}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />

      {/* Score */}
      <text
        x={centerX}
        y={centerY - 4}
        textAnchor="middle"
        fontSize={size * 0.2}
        fontWeight="600"
        className="fill-slate-800 dark:fill-white"
      >
        {score}
      </text>

      {/* Label */}
      <text
        x={centerX}
        y={centerY + size * 0.13}
        textAnchor="middle"
        fontSize={size * 0.09}
        className="fill-slate-500 dark:fill-slate-400"
      >
        match %
      </text>
    </svg>
  );
}