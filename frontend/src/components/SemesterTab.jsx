import React from "react";

const SemesterTab = ({ label, active, onClick, isDark }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
      active
        ? isDark
          ? "bg-slate-50 text-slate-700 shadow-sm"
          : "bg-slate-800 text-slate-100 shadow-sm"
        : "bg-transparent text-slate-400 hover:text-slate-700 hover:bg-white"
    }`}
  >
    {label}
  </button>
);

export default SemesterTab;
