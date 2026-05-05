import { useState, useCallback } from "react";
import AdSenseAd from "../utils/AdSenseAd";
import Header from "../components/layout/Header";
import SelectBox from "../components/SelectBox";
import Button from "../components/Button";
import { BookCheck, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  shuffle,
} from "../utils/functions/quiz-generator";
import FilterScreen from "../components/FilterScreen";
import QuestionScreen from "../components/QuestionScreen";
import ResultsScreen from "../components/ResultsScreen";

const QuizGenerator = () => {
  const navigate = useNavigate();

  const [screen, setScreen] = useState("filter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastConfig, setLastConfig] = useState(null);

  const fetchQuestions = useCallback(
    async ({ amount, category, difficulty, type }) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ amount });
        if (category) params.append("category", category);
        if (difficulty) params.append("difficulty", difficulty);
        if (type) params.append("type", type);

        const res = await fetch(`https://opentdb.com/api.php?${params}`);
        const data = await res.json();

        if (data.response_code !== 0 || !data.results?.length) {
          setError(
            "No questions found for these filters. Try changing the category or difficulty.",
          );
          setLoading(false);
          return;
        }

        const processed = data.results.map((q) => ({
          ...q,
          shuffledAnswers:
            q.type === "boolean"
              ? ["True", "False"]
              : shuffle([...q.incorrect_answers, q.correct_answer]),
        }));

        setQuestions(processed);
        setAnswers([]);
        setCurrent(0);
        setAnswered(false);
        setScreen("quiz");
      } catch {
        setError(
          "Failed to load questions. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleStart = (config) => {
    setLastConfig(config);
    fetchQuestions(config);
  };

  const handleAnswer = (ans) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = ans;
      return next;
    });
    setAnswered(true);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setScreen("results");
    } else {
      setCurrent((c) => c + 1);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    if (lastConfig) fetchQuestions(lastConfig);
  };

  const handleNewQuiz = () => {
    setScreen("filter");
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setAnswered(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header
        header="Quiz Generator"
        subHeader="Test your knowledge — powered by OpenTDB 🎓"
        icon={BookCheck}
        onClick={() => navigate("/")}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AdSenseAd />

        <div className="mt-5">
          {screen === "filter" && (
            <FilterScreen
              onStart={handleStart}
              loading={loading}
              error={error}
            />
          )}

          {screen === "quiz" && questions[current] && (
            <>
              <QuestionScreen
                question={questions[current]}
                index={current}
                total={questions.length}
                onAnswer={handleAnswer}
                answered={answered}
                selectedAnswer={answers[current]}
              />

              {answered && (
                <button
                  onClick={handleNext}
                  className="mt-4 w-full py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 animate-[fadeSlideIn_0.2s_ease]"
                >
                  {current + 1 >= questions.length
                    ? "See results 🏆"
                    : "Next question"}
                  <ChevronRight size={16} />
                </button>
              )}

              <AdSenseAd />
            </>
          )}

          {screen === "results" && (
            <>
              <ResultsScreen
                questions={questions}
                answers={answers}
                onRestart={handleRestart}
                onNewQuiz={handleNewQuiz}
              />
              <AdSenseAd />
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-8">
          Quiz Generator · PH Study Tools 🇵🇭
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuizGenerator;
