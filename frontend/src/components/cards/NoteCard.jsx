import React, { useRef, useState } from "react";
import { getColorConfig, timeAgo } from "../../utils/functions/notes";
import { Check, Trash2, X } from "lucide-react";

const NoteCard = ({ note, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);
  const cfg = getColorConfig(note.color);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onUpdate(note.id, {
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setTitle(note.title);
      setContent(note.content || "");
      setEditing(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md group ${cfg.bg} ${cfg.border}`}
    >
      <div
        className={`flex items-center justify-between px-3.5 py-2.5 ${cfg.header}`}
      >
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Note title..."
            autoFocus
          />
        ) : (
          <h3
            className="text-sm font-semibold text-slate-800 truncate flex-1 cursor-pointer"
            onClick={() => {
              setEditing(true);
              setTimeout(() => contentRef.current?.focus(), 50);
            }}
          >
            {note.title}
          </h3>
        )}

        <div className="flex items-center gap-1 ml-2 shrink-0">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors"
              >
                <Check size={11} />
              </button>
              <button
                onClick={() => {
                  setTitle(note.title);
                  setContent(note.content || "");
                  setEditing(false);
                }}
                className="w-6 h-6 rounded-lg border border-slate-300 text-slate-500 flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
              >
                <X size={11} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(note.id)}
              className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-3.5 py-2.5">
        {editing ? (
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your notes here..."
            rows={5}
            className="w-full text-xs text-slate-700 bg-transparent outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
        ) : (
          <p
            className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap cursor-pointer min-h-15"
            onClick={() => setEditing(true)}
          >
            {note.content || (
              <span className="text-slate-300 italic">
                Click to add content...
              </span>
            )}
          </p>
        )}
      </div>

      <div className="px-3.5 py-2 flex items-center justify-between">
        {note.subject && (
          <span className="text-[10px] text-slate-500 font-medium truncate max-w-30">
            📚 {note.subject}
          </span>
        )}
        <span className="text-[10px] text-slate-400 ml-auto">
          {timeAgo(note.updated_at || note.created_at)}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;
