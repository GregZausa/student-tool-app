import { X } from "lucide-react";
import { useState } from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import {
  MATERIAL_TYPES,
  TYPE_CONFIG,
} from "../../utils/constants/materials.config";
import SelectBox from "../ui/SelectBox";
import { detectType } from "../../utils/functions/materials";

const AddMaterialModal = ({ onAdd, onClose, loading, isDark }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("link");
  const [error, setError] = useState("");

  const handleUrlChange = (val) => {
    setUrl(val);
    setType(detectType(val));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!url.trim()) {
      setError("URL is required.");
      return;
    }
    try {
      new URL(url.trim());
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    await onAdd({
      title: title.trim(),
      url: url.trim(),
      subject: subject.trim() || null,
      type,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div
        className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-3xl   shadow-2xl w-full max-w-md p-6 animate-[slideUp_0.25s_ease]`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-base font-bold ${isDark ? "text-slate-50" : "text-slate-800"}`}>Add material</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
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

          <FloatingLabelInput
            isDark={isDark}
            type="url"
            label="URL / Link"
            value={url}
            onChange={handleUrlChange}
          />

          {url && (
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${TYPE_CONFIG[type]?.badge || ""}`}
            >
              {(() => {
                const Icon = TYPE_CONFIG[type]?.icon || Link2;
                return <Icon size={12} />;
              })()}
              Auto-detected: {TYPE_CONFIG[type]?.label || "Link"}
              <button
                className="ml-auto underline cursor-pointer"
                onClick={() => {}}
              >
                Change
              </button>
            </div>
          )}

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Type
            </div>
            <SelectBox
              isDark={isDark}
              options={MATERIAL_TYPES}
              value={type}
              onChange={setType}
            />
          </div>

          <FloatingLabelInput
            isDark={isDark}
            type="text"
            label="Subject (optional)"
            value={subject}
            onChange={setSubject}
          />

          {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !url.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save material"}
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

export default AddMaterialModal;
