import React from "react";
import { MODES } from "../utils/constants/pomodoro-config";
import { fmt } from "../utils/functions/pomodoro";

const CircularTimer = ({ progress, mode, timeLeft, isRunning }) => {
  const r = 90;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - progress);
  const modeConfig = MODES[mode];

  const strokeColor = {
    focus: "#6366f1",
    shortBreak: "#10b981",
    longBreak: "#0ea5e9",
  }[mode];

  return (
    <div className="relative flex items-center justify-center">
      <svg width="220" height="220" className="-rotate-90">
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className={`text-5xl font-bold font-mono tracking-tight ${modeConfig.color}`}
        >
          {fmt(timeLeft)}
        </span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
          {modeConfig.label}
        </span>
        {isRunning && (
          <span className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${strokeColor === "#6366f1" ? "bg-indigo-400" : strokeColor === "#10b981" ? "bg-emerald-400" : "bg-sky-400"} animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularTimer;
