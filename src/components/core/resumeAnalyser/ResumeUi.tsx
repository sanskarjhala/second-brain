export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#252525] rounded-xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-[#444] font-semibold mb-2">
      {children}
    </p>
  );
}

export function Pill({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "neutral" | "success" | "danger";
}) {
  let classes = "bg-[#252525] text-[#888] border-[#333]";
  if (variant === "success") {
    classes = "bg-purple-900/25 text-purple-300 border-purple-800/50";
  } else if (variant === "danger") {
    classes = "bg-red-900/25 text-red-400 border-red-800/50";
  }

  return (
    <span
      className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
