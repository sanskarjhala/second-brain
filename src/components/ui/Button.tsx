import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text?: string;
  starticon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-green-300 text-white hover:bg-purple-700 active:bg-purple-800 shadow-sm hover:shadow-md",
  secondary:
    "bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-300 border border-purple-200",
};

const defaultStyles =
  "px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2";

export const Button = ({
  variant,
  starticon,
  text,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        variantClasses[variant],
        defaultStyles,
        fullWidth ? "w-full justify-center" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {starticon && (
        <span className="shrink-0 flex items-center">{starticon}</span>
      )}
      {text && <span className="leading-none">{text}</span>}
    </button>
  );
};
