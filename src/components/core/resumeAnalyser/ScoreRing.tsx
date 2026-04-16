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

  // Score ke Isabh se 
  let ringColor = "#ef4444"; // red for bad
  if (score >= 70)
    ringColor = "#A855F7"; // purple for good
  else if (score >= 45) ringColor = "#f59e0b"; // yellow for okay

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
        stroke="#2a2a2a"
        strokeWidth="8"
      />
      {/* Colored progress ring */}
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
      {/* Score number */}
      <text
        x={centerX}
        y={centerY - 4}
        textAnchor="middle"
        fontSize={size * 0.2}
        fontWeight="600"
        fill="white"
      >
        {score}
      </text>
      {/* "match %" label */}
      <text
        x={centerX}
        y={centerY + size * 0.13}
        textAnchor="middle"
        fontSize={size * 0.09}
        fill="#666"
      >
        match %
      </text>
    </svg>
  );
}
