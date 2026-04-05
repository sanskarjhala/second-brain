import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react"; // or use emoji if no lucide

export default function ThemeToggle() {
  // @ts-ignore
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2 px-3 py-2 rounded-lg 
                 bg-gray-200 dark:bg-zinc-700 
                 text-gray-800 dark:text-white 
                 hover:bg-gray-300 dark:hover:bg-zinc-600 
                 transition-all duration-300"
      title="Toggle theme"
    >
      {dark ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-purple-600" />
      )}
      <span className="text-sm font-medium hidden sm:block">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
