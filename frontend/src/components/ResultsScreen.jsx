import React from "react";
import { decodeHTML, getScoreLabel } from "../utils/functions/quiz-generator";
import { ChevronRight, RotateCcw, Trophy } from "lucide-react";

const ResultsScreen = ({ questions, answers, onRestart, onNewQuiz }) => {
  const correct = questions.filter(
    (q, i) => answers[i] === q.correct_answer,
  ).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const { label, color } = getScoreLabel(pct);

  return (
    <div className="animate-[fadeSlideIn_0.3s_ease]">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 text-center">
        <Trophy size={40} className="text-yellow-400 mx-auto mb-3" />
        <div className={`text-4xl font-bold font-mono mb-1 ${color}`}>
          {correct}/{total}
        </div>
        <div className={`text-sm font-semibold mb-1 ${color}`}>{label}</div>
        <div className="text-xs text-slate-400">{pct}% correct</div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mt-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct >= 80
                ? "bg-green-500"
                : pct >= 60
                  ? "bg-blue-500"
                  : pct >= 40
                    ? "bg-amber-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          📋 Review answers
        </h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct_answer;
            return (
              <div
                key={i}
                className={`rounded-xl border p-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-sm shrink-0">
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <p className="text-xs font-semibold text-slate-700 leading-snug">
                    {decodeHTML(q.question)}
                  </p>
                </div>
                {!isCorrect && (
                  <div className="pl-5 space-y-0.5">
                    <p className="text-[11px] text-red-600">
                      Your answer:{" "}
                      <span className="font-medium">
                        {decodeHTML(answers[i] || "—")}
                      </span>
                    </p>
                    <p className="text-[11px] text-green-700">
                      Correct:{" "}
                      <span className="font-medium">
                        {decodeHTML(q.correct_answer)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} /> Same settings
        </button>
        <button
          onClick={onNewQuiz}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          New quiz <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
