import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./components/layout/Footer";

const Home = () => {
  const navigate = useNavigate();

  const messages = [
    "students improving their study habits",
    "students using Pomodoro focus sessions",
    "students organizing their workload",
    "students preparing for exams smarter",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-black to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        {/* HERO */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Studying doesn’t have to feel overwhelming.
        </motion.h1>

        <p className="mt-6 text-slate-300 text-lg max-w-2xl mx-auto">
          Most students struggle not because they lack intelligence, but because
          they use ineffective study methods that reduce retention and increase
          stress.
        </p>

        <p className="mt-6 text-indigo-400 font-semibold text-lg">
          Stud IQ helps you study smarter using structured learning systems
          based on cognitive science.
        </p>

        <p className="mt-4 text-sm text-green-400">
          ● {messages[index]} right now
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 bg-indigo-500 hover:bg-indigo-600 px-10 py-4 rounded-xl font-semibold text-lg transition"
        >
          Start Studying Smarter →
        </button>

        {/* WHY SECTION (CORE ADSENSE FIX) */}
        <div className="mt-24 text-left max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            Why students struggle with studying
          </h2>

          <p className="text-slate-300 leading-relaxed">
            Many students rely on passive learning techniques such as rereading
            notes, highlighting textbooks, or cramming before exams. While these
            methods feel productive, they do not create strong long-term memory
            retention.
          </p>

          <p className="text-slate-300 mt-4 leading-relaxed">
            Research in cognitive science shows that active recall, spaced
            repetition, and structured focus sessions significantly improve
            learning outcomes.
          </p>

          <p className="text-slate-300 mt-4 leading-relaxed">
            Stud IQ is built around these principles to help students study more
            efficiently, reduce stress, and improve academic performance.
          </p>
        </div>

        {/* TOOLS SECTION */}
        <div className="mt-24 text-left">
          <h2 className="text-3xl font-bold text-center mb-10">
            Learning tools inside Stud IQ
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "📊 GPA Calculator",
                desc: "Helps students instantly understand academic performance and track improvement over time.",
              },
              {
                title: "⏱ Pomodoro Timer",
                desc: "Improves focus using structured study intervals and prevents burnout.",
              },
              {
                title: "❓ Quiz Generator",
                desc: "Strengthens memory through active recall practice and self-testing.",
              },
              {
                title: "📝 Task Manager",
                desc: "Organizes assignments and deadlines for better academic planning.",
              },
              {
                title: "📚 Notes System",
                desc: "Helps students structure learning materials for easier review and retention.",
              },
            ].map((tool, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-6 rounded-xl"
              >
                <h3 className="font-semibold text-lg">{tool.title}</h3>
                <p className="text-slate-300 mt-2 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BLOG HUB (CRITICAL FOR ADSENSE) */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Study Guides & Learning Articles
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Learn proven study techniques, productivity systems, and academic
            strategies to improve performance.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-10 text-left">
            {[
              "Active Recall: The Most Effective Study Method",
              "Why Rereading Notes Doesn’t Work",
              "Pomodoro Technique Explained for Students",
              "How to Stop Procrastinating",
              "Best Study Habits for Students",
              "How to Improve GPA Effectively",
              "Spaced Repetition Explained Simply",
              "How to Study Without Burnout",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <p className="text-indigo-300 font-medium">📘 {item}</p>
                <p className="text-slate-400 text-sm mt-2">
                  Read full guide in Stud IQ blog.
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/blog")}
            className="mt-10 bg-indigo-500 px-8 py-3 rounded-lg"
          >
            Go to Blog →
          </button>
        </div>

        {/* OUTCOME */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            What improves when you use Stud IQ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-slate-300 text-sm">
            <div>📈 Higher academic performance</div>
            <div>🧠 Better memory retention</div>
            <div>⏳ More efficient study time</div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold mb-4">
            You don’t need more effort — you need better systems.
          </h2>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg"
          >
            Start Now →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
