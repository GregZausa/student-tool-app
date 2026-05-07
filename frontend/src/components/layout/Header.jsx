import React from "react";
import Button from "../ui/Button";

const Header = ({
  isDark,
  header,
  subHeader,
  icon: Icon,
  onClick,
  icon,
  buttonIcon: ButtonIcon,
  buttoNlabel,
  buttonStyle = "default",
}) => {
  const buttonStyles = {
    granted: ` ${isDark ? "text-emerald-200 bg-emerald-800 border-emerald-600" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`,
    notGranted: ` ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"}`,
    default: "border-none bg-indigo-500 hover:bg-indigo-600 text-white",
  };
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1
          className={`text-xl font-bold ${isDark ? "text-slate-50" : "text-slate-800"}  flex items-center gap-2`}
        >
          {Icon}
          {header}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{subHeader}</p>
      </div>
      {buttoNlabel && buttonStyle && ButtonIcon ? (
        <button
          onClick={onClick}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${buttonStyles[buttonStyle]} text-sm font-semibold transition-colors cursor-pointer`}
        >
          {ButtonIcon} {buttoNlabel}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
