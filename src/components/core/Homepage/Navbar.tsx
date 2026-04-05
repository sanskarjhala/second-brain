import brain2icon from "../../../assets/brain2icon.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  //   @ts-ignore
  const { dark, setDark } = useTheme();
  console.log(dark);

  return (
    <div className="flex justify-center pt-2 md:pt-6 dark:bg-darkbg">
      <header
        className="fixed z-[999] h-16 w-full max-w-[1250px] 
          bg-purple-200/30
          dark:bg-[#2D2D2E]/30
          backdrop-blur-md rounded-full md:rounded-xl
          border-purple-600 dark:border-[#242323]
          shadow-md dark:shadow-purple-900/40
          px-4 md:px-6 py-4 mx-1
          md:mt-0 dark:border-x-4
          flex items-center justify-between gap-4"
      >
        {/* Logo + Title */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100"
        >
          <img src={brain2icon} alt="logo" className="w-10 h-10" />
          <span>Second Brain</span>
        </div>

        {/* Links + Dark Mode Button */}
        <nav className="font-medium">
          <div className="flex justify-end items-center space-x-4 md:space-x-6">
            <a
              onClick={() => navigate("/about")}
              href="#"
              className="text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              About
            </a>
            <a
              onClick={() => navigate("/contact")}
              href="#"
              className="text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Contact
            </a>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDark(!dark)}
              title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-white/60 dark:bg-zinc-700/60
                         border border-purple-300 dark:border-zinc-600
                         text-gray-800 dark:text-gray-200
                         hover:bg-purple-100 dark:hover:bg-zinc-600
                         transition-all duration-300 text-sm font-medium"
            >
              {dark ? (
                <>
                  <Sun size={15} className="text-yellow-400" />
                  <span className="hidden sm:block">Light</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-purple-600" />
                  <span className="hidden sm:block">Dark</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};
