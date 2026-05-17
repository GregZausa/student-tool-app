import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trophy,
  BookOpen,
  Zap,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getScoreLabel(pct) {
  if (pct === 100) return { label: "Perfect! 🏆", color: "text-yellow-500" };
  if (pct >= 80) return { label: "Excellent! 🎉", color: "text-emerald-500" };
  if (pct >= 60) return { label: "Good job! 👍", color: "text-blue-500" };
  if (pct >= 40) return { label: "Keep studying! 📚", color: "text-amber-500" };
  return { label: "Better luck next time 💪", color: "text-red-500" };
}

// ─── Mode Picker ──────────────────────────────────────────────────────────────
const ModePicker = ({ deck, cardCount, onPick, isDark }) => {
  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <div className="max-w-md mx-auto">
      <div className={`rounded-2xl border p-6 mb-4 text-center ${cardBase}`}>
        <div className="text-4xl mb-3">🃏</div>
        <h2 className={`text-lg font-bold mb-1 ${textBase}`}>{deck.title}</h2>
        {deck.subject && (
          <p className="text-xs text-slate-400 mb-1">📚 {deck.subject}</p>
        )}
        <p className="text-xs text-slate-400">
          {cardCount} card{cardCount !== 1 ? "s" : ""}
        </p>
      </div>

      <h3 className={`text-sm font-semibold mb-3 ${textBase}`}>
        Choose study mode
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => onPick("flashcard")}
          className={`rounded-2xl border p-5 text-left transition-all hover:shadow-sm hover:border-indigo-300 cursor-pointer group ${cardBase}`}
        >
          <div className="text-2xl mb-2">🃏</div>
          <div
            className={`text-sm font-bold mb-1 group-hover:text-indigo-500 transition-colors ${textBase}`}
          >
            Flashcard
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Flip cards to reveal answers. Mark as known or unknown.
          </div>
        </button>

        <button
          onClick={() => onPick("quiz")}
          className={`rounded-2xl border p-5 text-left transition-all hover:shadow-sm hover:border-purple-300 cursor-pointer group ${cardBase}`}
        >
          <div className="text-2xl mb-2">📝</div>
          <div
            className={`text-sm font-bold mb-1 group-hover:text-purple-500 transition-colors ${textBase}`}
          >
            Quiz
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            Answer questions and get a score at the end.
          </div>
        </button>
      </div>

      <AdSenseAd />
    </div>
  );
};

// ─── Flashcard Mode ───────────────────────────────────────────────────────────
const FlashcardMode = ({ cards, onFinish, isDark }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [unknown, setUnknown] = useState(new Set());

  const card = cards[index];
  const total = cards.length;
  const isDone = index >= total;

  const handleKnown = () => {
    setKnown((prev) => new Set([...prev, card.id]));
    setUnknown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const handleUnknown = () => {
    setUnknown((prev) => new Set([...prev, card.id]));
    setKnown((prev) => {
      const s = new Set(prev);
      s.delete(card.id);
      return s;
    });
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  const handleRestart = () => {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  };

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";
  const subText = isDark ? "text-slate-400" : "text-slate-500";

  if (isDone) {
    const knownCount = known.size;
    const unknownCount = unknown.size;
    const pct = Math.round((knownCount / total) * 100);
    const { label, color } = getScoreLabel(pct);

    return (
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl border p-6 mb-4 text-center ${cardBase}`}>
          <Trophy size={36} className="text-yellow-400 mx-auto mb-3" />
          <div className={`text-3xl font-bold font-mono mb-1 ${color}`}>
            {knownCount}/{total}
          </div>
          <div className={`text-sm font-semibold mb-3 ${color}`}>{label}</div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs text-emerald-600 font-semibold mb-1">
                Known ✓
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">
                {knownCount}
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
              <div className="text-xs text-red-500 font-semibold mb-1">
                Still learning
              </div>
              <div className="text-2xl font-bold font-mono text-red-500">
                {unknownCount}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw size={13} /> Restart
            </button>
            <button
              onClick={() =>
                onFinish({ score: knownCount, total, mode: "flashcard" })
              }
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        <AdSenseAd />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>
            Card {index + 1} of {total}
          </span>
          <span className="flex gap-3">
            <span className="text-emerald-500">✓ {known.size}</span>
            <span className="text-red-400">✗ {unknown.size}</span>
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped((v) => !v)}
        className={`rounded-2xl border p-8 mb-4 text-center cursor-pointer transition-all min-h-[200px] flex flex-col items-center justify-center gap-4 select-none ${cardBase} ${flipped ? "ring-2 ring-indigo-300 dark:ring-indigo-700" : "hover:shadow-sm"}`}
      >
        <div
          className={`text-[10px] font-semibold uppercase tracking-widest ${flipped ? "text-indigo-500" : "text-slate-400"}`}
        >
          {flipped ? "Answer" : "Question — tap to flip"}
        </div>
        <p className={`text-base font-semibold leading-relaxed ${textBase}`}>
          {flipped ? card.correct_answer : card.question}
        </p>
        {!flipped && (
          <div className="text-xs text-slate-300 flex items-center gap-1 mt-2">
            <RotateCcw size={11} /> tap to reveal
          </div>
        )}
      </div>

      {/* Actions */}
      {flipped ? (
        <div className="flex gap-3">
          <button
            onClick={handleUnknown}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 text-sm font-semibold cursor-pointer transition-colors"
          >
            <X size={15} /> Still learning
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 text-sm font-semibold cursor-pointer transition-colors"
          >
            <Check size={15} /> Got it!
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIndex((i) => Math.max(0, i - 1));
              setFlipped(false);
            }}
            disabled={index === 0}
            className="w-11 h-11 rounded-xl border flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer disabled:opacity-30 dark:border-slate-700"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setFlipped(true)}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer transition-colors"
          >
            Flip card
          </button>
          <button
            onClick={() => {
              setIndex((i) => i + 1);
              setFlipped(false);
            }}
            className="w-11 h-11 rounded-xl border flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer dark:border-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Quiz Mode ────────────────────────────────────────────────────────────────
const QuizMode = ({ cards, onFinish, isDark }) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const card = cards[index];
  const total = cards.length;
  const isDone = index >= total;

  // Build options per card
  const getOptions = (c) => {
    if (c.type === "true_false") return ["True", "False"];
    if (c.type === "multiple_choice") return c.choices || [];
    // Flashcard in quiz mode — just show correct answer as only option (not great for quiz)
    return [c.correct_answer];
  };

  const options = card ? getOptions(card) : [];

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
  };

  const handleNext = () => {
    setAnswers((prev) => [...prev, { card, selected }]);
    setSelected(null);
    setAnswered(false);
    setIndex((i) => i + 1);
  };

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  // ── Results ──
  if (isDone) {
    const correct = answers.filter(
      (a) => a.selected === a.card.correct_answer,
    ).length;
    const pct = Math.round((correct / total) * 100);
    const { label, color } = getScoreLabel(pct);

    return (
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl border p-6 mb-4 text-center ${cardBase}`}>
          <Trophy size={36} className="text-yellow-400 mx-auto mb-3" />
          <div className={`text-4xl font-bold font-mono mb-1 ${color}`}>
            {correct}/{total}
          </div>
          <div className={`text-sm font-semibold mb-1 ${color}`}>{label}</div>
          <div className="text-xs text-slate-400 mb-4">{pct}% correct</div>

          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIndex(0);
                setAnswers([]);
                setSelected(null);
                setAnswered(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw size={13} /> Retry
            </button>
            <button
              onClick={() => onFinish({ score: correct, total, mode: "quiz" })}
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        {/* Review */}
        <div className={`rounded-2xl border p-4 mb-4 ${cardBase}`}>
          <h3 className={`text-sm font-semibold mb-3 ${textBase}`}>
            📋 Review
          </h3>
          <div className="space-y-3">
            {answers.map((a, i) => {
              const isCorrect = a.selected === a.card.correct_answer;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 ${isCorrect ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-sm shrink-0">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">
                      {a.card.question}
                    </p>
                  </div>
                  {!isCorrect && (
                    <div className="pl-5 space-y-0.5">
                      <p className="text-[11px] text-red-600">
                        Your answer:{" "}
                        <span className="font-medium">{a.selected || "—"}</span>
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Correct:{" "}
                        <span className="font-medium">
                          {a.card.correct_answer}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AdSenseAd />
      </div>
    );
  }

  // ── Question ──
  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>
            Question {index + 1} of {total}
          </span>
          <span className="font-mono">
            {Math.round((index / total) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl border p-5 mb-4 ${cardBase}`}>
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-2">
          Question {index + 1}
        </div>
        <p className={`text-sm font-semibold leading-relaxed ${textBase}`}>
          {card.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {options.map((opt, i) => {
          const isCorrect = opt === card.correct_answer;
          const isSelected = opt === selected;
          const labels = ["A", "B", "C", "D"];

          let style = isDark
            ? "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:bg-slate-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";

          if (answered) {
            if (isCorrect)
              style =
                "border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300";
            else if (isSelected)
              style =
                "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400";
            else
              style = isDark
                ? "border-slate-700 bg-slate-800 text-slate-500 opacity-50"
                : "border-slate-200 bg-slate-50 text-slate-400 opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer disabled:cursor-default ${style}`}
            >
              <span
                className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                  answered && isCorrect
                    ? "bg-emerald-500 text-white"
                    : answered && isSelected
                      ? "bg-red-500 text-white"
                      : isDark
                        ? "bg-slate-700 text-slate-400"
                        : "bg-slate-100 text-slate-500"
                }`}
              >
                {answered && isCorrect
                  ? "✓"
                  : answered && isSelected
                    ? "✗"
                    : labels[i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback + Next */}
      {answered && (
        <>
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium mb-3 ${selected === card.correct_answer ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"}`}
          >
            {selected === card.correct_answer ? (
              "✅ Correct!"
            ) : (
              <>
                ❌ Wrong. Correct answer: <strong>{card.correct_answer}</strong>
              </>
            )}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            {index + 1 >= total ? "See results 🏆" : "Next question"}{" "}
            <ArrowRight size={15} />
          </button>
        </>
      )}
    </div>
  );
};

const StudyMode = () => {
  const { id } = useParams();
  const { userId } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState(null); // null | 'flashcard' | 'quiz'
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setFetching(true);
      const [deckRes, cardsRes] = await Promise.all([
        supabase.from("decks").select("*").eq("id", id).single(),
        supabase
          .from("cards")
          .select("*")
          .eq("deck_id", id)
          .order("card_order", { ascending: true }),
      ]);
      if (!deckRes.error) setDeck(deckRes.data);
      if (!cardsRes.error) setCards(shuffle(cardsRes.data || []));
      setFetching(false);
    };
    fetch();
  }, [id]);

  const handleFinish = async ({ score, total, mode: studyMode }) => {
    if (userId) {
      await supabase.from("study_sessions").insert({
        user_id: userId,
        deck_id: id,
        score,
        total,
        mode: studyMode,
      });
    }
    navigate(`/dashboard/decks/${id}`);
  };

  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm">Loading cards...</div>
        </div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Top nav ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() =>
            mode ? setMode(null) : navigate(`/dashboard/decks/${id}`)
          }
          className="w-8 h-8 rounded-xl border flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors dark:border-slate-700 dark:hover:bg-slate-700"
        >
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className={`text-base font-bold ${textBase}`}>
            {mode
              ? mode === "flashcard"
                ? "🃏 Flashcard mode"
                : "📝 Quiz mode"
              : "Study mode"}
          </h1>
          {deck && <p className="text-xs text-slate-400">{deck.title}</p>}
        </div>
      </div>

      {!mode && deck && (
        <ModePicker
          deck={deck}
          cardCount={cards.length}
          onPick={setMode}
          isDark={isDark}
        />
      )}

      {mode === "flashcard" && (
        <FlashcardMode cards={cards} onFinish={handleFinish} isDark={isDark} />
      )}

      {mode === "quiz" && (
        <QuizMode cards={cards} onFinish={handleFinish} isDark={isDark} />
      )}

      <p className="text-center text-[11px] text-slate-300 mt-8">
        Study Mode · StudyTools PH 🇵🇭
      </p>
    </div>
  );
};

export default StudyMode;
