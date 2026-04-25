import React from "react";
import { MODES } from "../utils/constants/pomodoro-config";
import { formatDuration, timeAgo } from "../utils/functions/pomodoro";

const SessionItem = ({ session }) => {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-sm shrink-0">
        {session.mode === "focus"
          ? "🎯"
          : session.mode === "shortBreak"
            ? "☕"
            : "😴"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-700 truncate">
          {session.subject || "No subject"} — {MODES[session.mode].label}
        </div>
        <div className="text-xs text-slate-400">
          {formatDuration(session.duration)} · {timeAgo(session.completedAt)}
        </div>
      </div>
      <div
        className={`text-xs font-semibold px-2 py-1 rounded-lg ${
          session.mode === "focus"
            ? "bg-indigo-50 text-indigo-600"
            : session.mode === "shortBreak"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-sky-50 text-sky-600"
        }`}
      >
        {session.completed ? "✓" : "—"}
      </div>
    </div>
  );
};

export default SessionItem;
