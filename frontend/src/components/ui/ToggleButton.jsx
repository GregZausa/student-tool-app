import { Moon, Sun } from "lucide-react";
import React from "react";

const ToggleButton = ({toggleTheme, isDark}) => {
  return (
    <button
      onClick={toggleTheme}
      className={`
          relative w-14 h-8 rounded-full p-1 transition-all duration-300 ease-in-out
          ${
            isDark
              ? "bg-linear-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
              : "bg-linear-to-r from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/25"
          }
          hover:scale-105 hover:shadow-xl
          ${isDark ? "hover:shadow-purple-500/40" : "hover:shadow-orange-500/40"}
          focus:outline-none focus:ring-4 focus:ring-opacity-50
          ${isDark ? "focus:ring-purple-400" : "focus:ring-orange-400"}
          active:scale-95
        `}
      aria-label="Toggle theme"
    >
      <div
        className={`
            absolute top-1 w-6 h-6 bg-white rounded-full shadow-md
            flex items-center justify-center transition-all duration-300 ease-in-out
            ${isDark ? "translate-x-6" : "translate-x-0"}
          `}
      >
        <div
          className={`transition-all duration-300 ${isDark ? "rotate-180" : "rotate-0"}`}
        >
          {isDark ? (
            <Moon size={14} className="text-purple-600" />
          ) : (
            <Sun size={14} className="text-orange-500" />
          )}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun
          size={12}
          className={`text-white transition-opacity duration-300 ${
            !isDark ? "opacity-0" : "opacity-70"
          }`}
        />
        <Moon
          size={12}
          className={`text-white transition-opacity duration-300 ${
            isDark ? "opacity-0" : "opacity-70"
          }`}
        />
      </div>
    </button>
  );
};

export default ToggleButton;
