import React from "react";

const StatCard = ({ label, value, color }) => {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-200 text-center">
      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1.5">
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
    </div>
  );
};

export default StatCard;
