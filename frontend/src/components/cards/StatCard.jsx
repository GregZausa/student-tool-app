import React from "react";

const StatCard = ({ label, value, color, isDark }) => {
  return (
    <div
      className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-3.5  text-center`}
    >
      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
};

export default StatCard;
