import React from "react";
import Button from "../Button";

const Header = ({ header, subHeader, icon : Icon, onClick }) => {
  return (
    <div className="bg-linear-to-br from-slate-950 via-slate-800 to-slate-950 px-5 pt-7 pb-5 text-center">
        <div className="absolute right-4">
          <Button label="Go back" onClick={onClick}/>
        </div>

        <div className="inline-flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 bg-slate-100/20 rounded-xl flex items-center justify-center text-lg text-slate-100">
            <Icon size={20}/>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            {header}
          </h1>
        </div>
      <p className="text-slate-100/80 text-xs">
        {subHeader}
      </p>
    </div>
  );
};

export default Header;
