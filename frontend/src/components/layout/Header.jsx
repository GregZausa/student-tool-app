import React from "react";
import Button from "../Button";

const Header = ({ header, subHeader, icon: Icon, onClick, tool }) => {
  return (
    <div className="bg-linear-to-br from-slate-950 via-slate-800 relative to-slate-950 px-5 pt-7 pb-5 text-center">
      <div className="inline-flex items-center gap-2.5 mb-1.5">
        <div className="w-9 h-9 bg-slate-100/20 rounded-xl flex items-center justify-center text-lg text-slate-100">
          <Icon size={20} />
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          {header}
        </h1>
      </div>
      <p className="text-slate-100/80 text-xs">{subHeader}</p>
      <div className="absolute right-4 top-8">{tool}</div>
    </div>
  );
};

export default Header;
