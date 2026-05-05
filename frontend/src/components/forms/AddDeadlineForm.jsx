import { Plus } from "lucide-react";
import React, { useState } from "react";
import FloatingLabelInput from "../FloatingLabelInput";
import SelectBox from "../SelectBox";
import { DEADLINE_TYPES } from "../../utils/constants/deadline.config";

const AddDeadlineForm = ({ onAdd, loading }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59");
  const [type, setType] = useState("assignment");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!dueDate) {
      setError("Due date is required.");
      return;
    }
    setError("");

    const due_date = `${dueDate}T${dueTime}:00`;
    await onAdd({
      title: title.trim(),
      subject: subject.trim(),
      due_date,
      type,
      notes: notes.trim() || null,
    });

    setTitle("");
    setSubject("");
    setDueDate("");
    setDueTime("23:59");
    setType("assignment");
    setNotes("");
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <Plus size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Add a deadline..."
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
            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
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
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Type
              </div>
              <SelectBox
                options={DEADLINE_TYPES}
                value={type}
                onChange={setType}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FloatingLabelInput
              type="date"
              label="Due date"
              value={dueDate}
              onChange={setDueDate}
            />
            <FloatingLabelInput
              type="time"
              label="Due time"
              value={dueTime}
              onChange={setDueTime}
            />
          </div>

          <FloatingLabelInput
            type="text"
            label="Notes (optional)"
            value={notes}
            onChange={setNotes}
          />

          {error && <p className="text-xs text-red-500 pl-1">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setTitle("");
                setError("");
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !dueDate || loading}
              className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add deadline"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDeadlineForm;
