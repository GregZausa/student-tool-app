import React, { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import { PRIORITIES, PRIORITY_STYLES } from "../../utils/constants/todo-config";
import { Plus } from "lucide-react";

const AddTodoForm = ({ onAdd, loading }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onAdd({
      title: title.trim(),
      subject: subject.trim(),
      due_date: dueDate || null,
      priority,
    });
    setTitle("");
    setSubject("");
    setDueDate("");
    setPriority("medium");
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <Plus size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!open) setOpen(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={() => setOpen(true)}
          className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
        />
        {title && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Add
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3 animate-[fadeSlideIn_0.2s_ease]">
          <div className="grid grid-cols-2 gap-3">
            <FloatingLabelInput
              type="text"
              label="Subject (optional)"
              value={subject}
              onChange={setSubject}
            />
            <FloatingLabelInput
              type="date"
              label="Due date (optional)"
              value={dueDate}
              onChange={setDueDate}
            />
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Priority
            </div>
            <div className="flex gap-2">
              {PRIORITIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setPriority(value)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    priority === value
                      ? PRIORITY_STYLES[value].badge + " border"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setTitle("");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || loading}
              className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add task"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodoForm;
