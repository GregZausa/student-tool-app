import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import studIQLogo from "../components/res/logo.png";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📊",
      title: "GPA Calculator",
      desc: "Compute your General Weighted Average instantly using the Philippine grading system (1.0–5.0 scale).",
    },
    {
      icon: "⏱️",
      title: "Pomodoro Timer",
      desc: "Study using the proven Pomodoro technique — 25-minute focus sessions with short breaks and ambient sounds.",
    },
    {
      icon: "❓",
      title: "Quiz Generator",
      desc: "Test your knowledge with questions from the Open Trivia Database across dozens of categories and difficulty levels.",
    },
    {
      icon: "✅",
      title: "To-do List",
      desc: "Organize your assignments and tasks with priority levels, due dates, and subject tags — synced to your account.",
    },
    {
      icon: "⏰",
      title: "Deadline Tracker",
      desc: "Never miss a deadline again. Get browser notifications 24 hours, 3 hours, 1 hour, and at the exact due time.",
    },
    {
      icon: "📝",
      title: "Notes",
      desc: "Quickly jot down anything — color-coded sticky notes organized by subject with inline editing.",
    },
    {
      icon: "📚",
      title: "Learning Materials",
      desc: "Save links, YouTube videos, and PDF resources per subject for easy access during review.",
    },
    {
      icon: "🃏",
      title: "Flashcard & Quiz Maker",
      desc: "Create your own flashcard decks and quizzes with multiple choice, true/false, or classic flashcard formats. Share publicly with other students.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white text-sm mb-8 flex items-center gap-2 transition-colors cursor-pointer"
        >
          ← Back to Home
        </button>

        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-5">
            <img src={studIQLogo} alt="" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About Stud IQ</h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Stud IQ is a free, all-in-one study platform built specifically for
            Filipino students — combining the tools you need to study smarter,
            stay organized, and perform better academically.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            Most students struggle not because they lack intelligence, but
            because they use ineffective study methods. Stud IQ was built to
            change that — providing science-backed learning tools that are free,
            easy to use, and designed for the Philippine educational system.
          </p>
          <p className="text-slate-300 leading-relaxed mt-3">
            From GWA computation using the Philippine 1.0–5.0 grading scale, to
            Pomodoro timers with Filipino study tips, every feature is tailored
            for the local student experience.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6">What's inside Stud IQ</h2>
        <div className="space-y-4 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4"
            >
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold mb-2">🔒 No account required</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Stud IQ uses an anonymous identifier to save your data — no email,
            no password, no sign-up required. Your study data is saved securely
            and privately, accessible only from your browser session.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Start using Stud IQ →
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
