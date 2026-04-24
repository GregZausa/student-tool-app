import React from "react";

const Header = ({header, subHeader, icon}) => {
  return (
    <div className="bg-slate-800 px-5 pt-7 pb-5 text-center">
      <div className="inline-flex items-center gap-2.5 mb-1.5">
        <div className="w-9 h-9 bg-slate-100/20 rounded-xl flex items-center justify-center text-lg text-slate-100">
          {icon}
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          {header}
        </h1>
      </div>
      <p className="text-slate-100/80 text-xs">
        Philippine grading system · 1.0 (Excellent) to 5.0 (Failed)
      </p>
    </div>
  );
};

export default Header;
