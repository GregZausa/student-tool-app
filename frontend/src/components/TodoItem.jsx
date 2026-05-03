import React from 'react'
import { PRIORITY_STYLES } from '../utils/constants/todo-config';
import { formatDate } from '../utils/functions/todo-item';
import { BookOpen, CalendarDays, Trash2 } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  const p = PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.medium;
  const due = todo.due_date ? formatDate(todo.due_date) : null;

  return (
    <div
      className={`flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 group transition-opacity ${todo.completed ? "opacity-50" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
        className="mt-0.5 shrink-0 cursor-pointer"
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? "bg-indigo-500 border-indigo-500"
              : "border-slate-300 hover:border-indigo-400"
          }`}
        >
          {todo.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium text-slate-800 leading-snug ${todo.completed ? "line-through text-slate-400" : ""}`}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${p.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
            {p.label}
          </span>
          {todo.subject && (
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <BookOpen size={10} /> {todo.subject}
            </span>
          )}
          {due && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium ${due.color}`}
            >
              <CalendarDays size={10} /> {due.label}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-800 hover:text-red-800 transition-all cursor-pointer mt-0.5"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default TodoItem
