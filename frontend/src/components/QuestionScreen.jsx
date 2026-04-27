import React from "react";
import { decodeHTML } from "../utils/functions/quiz-generator";

const QuestionScreen = ({
  question,
  index,
  total,
  onAnswer,
  answered,
  selectedAnswer,
}) => {
  const diffColor =
    {
      easy: "bg-green-100 text-green-700",
      medium: "bg-amber-100 text-amber-700",
      hard: "bg-red-100 text-red-700",
    }[question.difficulty] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="animate-[fadeSlideIn_0.25s_ease]">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>
            Question {index + 1} of {total}
          </span>
          <span className="font-mono">
            {Math.round(((index + 1) / total) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${diffColor}`}
          >
            {question.difficulty}
          </span>
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-50">
            {decodeHTML(question.category)}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
          {decodeHTML(question.question)}
        </p>
      </div>

      <div className="space-y-2.5 mb-4">
        {question.shuffledAnswers.map((ans, i) => {
          const isCorrect = ans === question.correct_answer;
          const isSelected = ans === selectedAnswer;
          const labels = ["A", "B", "C", "D"];

          let style =
            "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (answered) {
            if (isCorrect)
              style = "border-green-400 bg-green-50 text-green-800";
            else if (isSelected)
              style = "border-red-400 bg-red-50 text-red-700";
            else
              style = "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(ans)}
              disabled={answered}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                  answered && isCorrect
                    ? "bg-green-500 text-white"
                    : answered && isSelected
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {answered && isCorrect
                  ? "✓"
                  : answered && isSelected
                    ? "✗"
                    : labels[i]}
              </span>
              <span>{decodeHTML(ans)}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium animate-[fadeSlideIn_0.2s_ease] ${
            selectedAnswer === question.correct_answer
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {selectedAnswer === question.correct_answer ? (
            "✅ Correct! Well done."
          ) : (
            <>
              ❌ Wrong. The correct answer is:{" "}
              <strong>{decodeHTML(question.correct_answer)}</strong>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
