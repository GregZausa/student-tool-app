import { Check, X } from "lucide-react";
import React, { useState } from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { NOTE_COLORS } from "../../utils/constants/notes.config";

const AddNoteModal = ({ onAdd, onClose, loading, isDark }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [color, setColor] = useState("yellow");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    await onAdd({
      title: title.trim(),
      content: content.trim(),
      subject: subject.trim() || null,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div
        className={`${
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        } rounded-3xl border shadow-2xl w-full max-w-md p-6 animate-[slideUp_0.25s_ease]`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className={`text-base font-bold ${isDark ? "text-slate-50" : "text-slate-800"}`}
          >
            New note
          </h2>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-lg  ${isDark ? "hover:text-slate-200 hover:bg-slate-700" : "hover:text-slate-600 hover:bg-slate-100"} text-slate-400 flex items-center justify-center cursor-pointer`}
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <FloatingLabelInput
            isDark={isDark}
            type="text"
            label="Title"
            value={title}
            onChange={(val) => {
              setTitle(val);
              setError("");
            }}
          />

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Content
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={5}
              className={`w-full px-4 py-3 rounded-xl border ${isDark ? "border-slate-700 text-slate-100 focus:border-slate-600 focus:ring-slate-700" : "border-slate-200 text-slate-700 focus:border-indigo-400 focus:ring-indigo-100"}  text-sm  placeholder:text-slate-400 outline-none  focus:ring-4  transition-all resize-none`}
            />
          </div>

          <FloatingLabelInput
            isDark={isDark}
            type="text"
            label="Subject (optional)"
            value={subject}
            onChange={setSubject}
          />

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">
              Color
            </div>
            <div className="flex gap-2">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.dot} transition-all cursor-pointer flex items-center justify-center ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                      : "hover:scale-105"
                  }`}
                >
                  {color === c.value && (
                    <Check size={12} className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl border ${isDark ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-600"} text-sm font-medium hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save note"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
};

export default AddNoteModal;
