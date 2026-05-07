import React, { useState } from "react";
import SelectBox from "./ui/SelectBox";
import { AMOUNTS, CATEGORIES, DIFFICULTIES, TYPES } from "../utils/constants/quiz-generator-config";
import { ChevronRight } from "lucide-react";

const FilterScreen = ({ onStart, loading, error }) => {
  const [amount, setAmount] = useState("10");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease]">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          🧠
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          Ready to test your knowledge?
        </h2>
        <p className="text-sm text-slate-500">
          Customize your quiz below then hit <strong>Start Quiz</strong>!
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4 space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Quiz settings
        </h3>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
            Number of questions
          </div>
          <SelectBox options={AMOUNTS} value={amount} onChange={setAmount} />
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
            Category
          </div>
          <SelectBox
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            searchable
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Difficulty
            </div>
            <SelectBox
              options={DIFFICULTIES}
              value={difficulty}
              onChange={setDifficulty}
            />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Type
            </div>
            <SelectBox options={TYPES} value={type} onChange={setType} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 text-sm text-red-600 flex items-center gap-2">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={() => onStart({ amount, category, difficulty, type })}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Loading questions...
          </>
        ) : (
          <>
            Start Quiz <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
};

export default FilterScreen;
