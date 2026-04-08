import { useNavigate } from "react-router-dom";

export const CtaButton = () => {
  const navigate = useNavigate();

  const design =
    "bg-purple-600 hover:bg-purple-700  text-white rounded-lg text-sm py-2 px-4 font-semibold transition-all duration-200 shadow-md shadow-purple-300 dark:shadow-purple-900";
  return (
    <div className="flex items-center justify-center md:justify-start gap-4 ">
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className={design}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className={design}
      >
        Login
      </button>
    </div>
  );
};
