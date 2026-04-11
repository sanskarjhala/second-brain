import brain2icon from "../../../assets/brain2icon.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();
  // @ts-ignore
  const { dark, setDark } = useTheme();
  const { user, logout } = useAuth(); // make sure logout is in your AuthContext
  console.log(user)

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

        {/* Links + Actions */}
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

            {/* ✅ Conditional Auth Buttons */}
            {user ? (
              // User is logged in → show Dashboard + Logout
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-1.5 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 rounded-full border border-purple-400 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // User is not logged in → show Login + Signup
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 rounded-full border border-purple-400 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-1.5 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

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