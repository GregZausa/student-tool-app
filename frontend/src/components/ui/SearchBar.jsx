import { Search } from "lucide-react";
import React from "react";
import { useTheme } from "../../context/ThemeContext";

const SearchBar = ({
  onChange,
  value,
  onClick,
  buttonIcon: ButtonIcon,
  placeholder,
}) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex items-center gap-2  border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-xl px-3.5 py-2.5`}
    >
      <Search size={14} className="text-slate-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`flex-1 text-sm ${isDark ? "text-slate-200" : "text-slate-700"} placeholder:text-slate-400 outline-none bg-transparent`}
      />
      {value && (
        <button
          onClick={onClick}
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {ButtonIcon}
        </button>
      )}
    </div>
  );
};

export default SearchBar;
