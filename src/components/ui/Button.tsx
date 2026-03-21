import type { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  starticon?: ReactElement;
}

const variantClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-700",
};

const defaultStyles = "px-4 py-2 rounded-md  font-normal flex items-center";

export const Button = ({ variant, starticon, text }: ButtonProps) => {
  return (
    <button className={variantClasses[variant] + " " + defaultStyles}>
      <span className="px-2"> {starticon}</span>
      {text}
    </button>
  );
};
