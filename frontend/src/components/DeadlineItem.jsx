import { AlarmClock, CheckCircle2, Trash2 } from "lucide-react";
import React from "react";
import { formatDueDate, getCountdown } from "../utils/functions/deadline";
import {
  DEADLINE_TYPES,
  TYPE_CONFIG,
  URGENCY_STYLES,
} from "../utils/constants/deadline.config";

const DeadlineItem = ({ deadline, onToggle, onDelete, now, isDark }) => {
  const { label, urgency } = getCountdown(deadline.due_date);
  const styles = URGENCY_STYLES[urgency];
  const typeConf = TYPE_CONFIG[deadline.type] || TYPE_CONFIG.other;
  const TypeIcon = typeConf.icon;

  return (
    <div
      className={`rounded-2xl border p-4 mb-3 last:mb-0 transition-all ${
        deadline.completed
          ? "opacity-50 bg-slate-50 border-slate-200"
          : `${styles.bg} ${styles.border}`
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeConf.color}`}
        >
          <TypeIcon size={16} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-semibold text-slate-800 leading-snug ${deadline.completed ? "line-through text-slate-400" : ""}`}
            >
              {deadline.title}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onToggle(deadline.id, deadline.completed)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  deadline.completed
                    ? "bg-emerald-500 text-white"
                    : "border border-slate-300 text-slate-400 hover:border-emerald-400 hover:text-emerald-500"
                }`}
              >
                <CheckCircle2 size={14} />
              </button>
              <button
                onClick={() => onDelete(deadline.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${typeConf.badge}`}
            >
              {DEADLINE_TYPES.find((t) => t.value === deadline.type)?.label ||
                deadline.type}
            </span>

            {deadline.subject && (
              <span className="text-[10px] text-slate-500 font-medium">
                📚 {deadline.subject}
              </span>
            )}

            <span className="text-[10px] text-slate-400">
              {formatDueDate(deadline.due_date)}
            </span>
          </div>

          {deadline.notes && (
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {deadline.notes}
            </p>
          )}

          {!deadline.completed && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1">
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold ${styles.text}`}
                >
                  <AlarmClock size={10} />
                  {label}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineItem;
