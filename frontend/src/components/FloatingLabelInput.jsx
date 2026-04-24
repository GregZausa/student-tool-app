import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FloatingLabelInput = ({
  type = "text",
  value,
  onChange,
  label,
  className = "",
  required = false,
  readOnly = false,
  min,
  max,
  step,
  suffix,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const isFloated = isFocused || value !== "" && value !== undefined && value !== null;

  const blockInvalidKeys = (e) => {
    if (type === "number" && ["e", "E", "+", "-", "="].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (type === "number" && !/^\d*\.?\d*$/.test(pasted)) e.preventDefault();
  };

  return (
    <div className={`relative w-full group ${className}`}>
      <input
        type={inputType}
        value={value}
        onKeyDown={blockInvalidKeys}
        onPaste={handlePaste}
        min={min}
        max={max}
        step={step}
        readOnly={readOnly}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`
          peer w-full px-4 pt-5 pb-2 text-sm text-slate-800
          bg-white rounded-xl border outline-none
          transition-all duration-200
          ${readOnly ? "cursor-default bg-slate-50 text-slate-500" : ""}
          ${isFocused
            ? "border-slate-800/50 ring-4 ring-indigo-100 shadow-sm"
            : "border-slate-200 hover:border-slate-300 shadow-xs"
          }
          ${suffix || type === "password" ? "pr-10" : ""}
        `}
      />
      <label
        className={`
          absolute left-4 pointer-events-none font-medium
          transition-all duration-200 select-none
          ${isFloated
            ? "top-2 text-[10px] tracking-widest uppercase text-slate-800"
            : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
          }
        `}
      >
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {suffix && type !== "password" && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
          {suffix}
        </span>
      )}

      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors duration-150"
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
    </div>
  );
};

export default React.memo(FloatingLabelInput);