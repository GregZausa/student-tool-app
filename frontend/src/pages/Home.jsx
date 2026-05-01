import React from "react";
import { Link } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";
import { BookCheck, Calculator, Timer } from "lucide-react";
import RouteComponent from "../routes/RouteComponent";
import { useUser } from "../context/UserContext";
import InfoSetUpModal from "../components/modal/InfoSetUpModal";

const Home = () => {
  const { userId, isReady, name } = useUser();

  if (!isReady) return null;
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-800 to-slate-950 text-white px-4 py-10 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            Student Tools Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Free calculators and smart tools for Filipino students 🇵🇭
          </p>
          {userId && (
            <div className="mt-6 space-y-2">
              <p className="text-2xl font-semibold text-indigo-300">
                Good to see you again, {name || "there"}👋
              </p>
              <p className="text-slate-300 text-base">
                 Let’s make today productive.
              </p>
              <p className="text-sm text-slate-500">
                What are we working on today?
              </p>
            </div>
          )}
        </div>

        <RouteComponent
          link="/gpa-calculator"
          icon={Calculator}
          title="GPA Calculator"
          desc="Check your GPA in seconds—no manual computation"
        />
        <RouteComponent
          link="/pomodoro-timer"
          icon={Timer}
          title="Pomodoro Timer"
          desc="Stop procrastinating. Start a 25-minute focus sprint"
        />
        <RouteComponent
          link="/quiz-generator"
          icon={BookCheck}
          title="Random Questions Generator"
          desc="Quiz yourself on anything—trivia, science, history, and more"
        />

        <div className="grid grid-cols-3 gap-4 text-center mb-12">
          <div>
            <p className="text-xl font-bold">⚡ Fast</p>
            <p className="text-xs text-slate-400">Instant results</p>
          </div>
          <div>
            <p className="text-xl font-bold">🎯 Accurate</p>
            <p className="text-xs text-slate-400">
              Built for real student needs
            </p>
          </div>
          <div>
            <p className="text-xl font-bold">🆓 Free</p>
            <p className="text-xs text-slate-400">No signup needed</p>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <AdSenseAd />
        </div>
      </div>
      {isReady && !userId && <InfoSetUpModal />}
    </div>
  );
};

export default Home;
