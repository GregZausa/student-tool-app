import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  label,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  icon,
  loading = false,
  variant = "primary",
  size = "md",
}) => {
  const isDisabled = disabled || loading;

  const variants = {
    primary:
      "bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-white border-transparent shadow-sm hover:shadow-slate-200 hover:shadow-md",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-200 shadow-xs hover:border-slate-300",
    ghost:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 border-transparent",
    danger:
      "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white border-transparent shadow-sm hover:shadow-rose-200 hover:shadow-md",
    ghostDanger:
      "bg-transparent hover:bg-rose-600 active:bg-rose-100 text-rose-500 border-transparent shadow-sm hover:text-white hover:shadow-rose-600 hover:shadow-md",
    excel:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-transparent shadow-sm hover:shadow-emerald-200 hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center font-semibold
        rounded-xl border outline-none
        transition-all duration-200
        focus-visible:ring-4 focus-visible:ring-indigo-100
        ${sizes[size]}
        ${
          isDisabled
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
            : variants[variant]
        }
        ${className}
      `}
    >
      {loading && (
        <Loader2
          size={size === "sm" ? 13 : size === "lg" ? 17 : 15}
          className="animate-spin shrink-0"
        />
      )}
      {icon && !loading && (
        <span className="shrink-0 flex items-center">{icon}</span>
      )}

      <span>{label}</span>
    </button>
  );
};

export default Button;
