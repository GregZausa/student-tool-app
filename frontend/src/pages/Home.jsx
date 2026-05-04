import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AdSenseAd from "../utils/AdSenseAd";
import { useUser } from "../context/UserContext";
import InfoSetUpModal from "../components/modal/InfoSetUpModal";
import useLiveUsers from "../hooks/useLiveUsers";

const Home = () => {

  const navigate = useNavigate();
  const liveUsers = useLiveUsers();

  const messages = [
    "students checking their GPA",
    "students using the Pomodoro timer",
    "students organizing tasks",
    "students generating quizzes",
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
        {/* 🔥 HOOK */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Still guessing your grades?
        </motion.h1>

        <p className="mt-4 text-slate-400 text-lg">
          Struggling to stay focused, track tasks, or prepare for exams?
        </p>

        {/* 💡 SOLUTION */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-xl text-indigo-400 font-semibold"
        >
          This fixes all of that.
        </motion.p>

        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Student Tools Hub gives you everything you need to manage your
          academics—so you can stop stressing and start performing.
        </p>
        {/*<p className="mt-4 text-sm text-green-400">
          ● {liveUsers} students using tools right now

          for future
        </p> */}

        <p className="mt-4 text-sm text-green-400">
          ●{liveUsers} {messages[index]} right now
        </p>
        {/* 🚀 CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 bg-indigo-500 hover:bg-indigo-600 px-10 py-4 rounded-xl font-semibold text-lg transition"
        >
          Let’s Start →
        </button>

        {/* 📊 PROBLEM → RESULT */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 text-left">
          {[
            {
              before: "Manual GPA computation",
              after: "Instant GPA results",
            },
            {
              before: "Easily distracted",
              after: "Focused study sessions",
            },
            {
              before: "Messy tasks & deadlines",
              after: "Organized workflow",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <p className="text-red-400 text-sm mb-2">✗ {item.before}</p>
              <p className="text-green-400 font-semibold">✓ {item.after}</p>
            </motion.div>
          ))}
        </div>

        {/* 🧩 TOOLS EXPLANATION */}
        <div className="mt-24 text-left">
          <h2 className="text-3xl font-bold text-center mb-10">
            Tools that actually help you
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "📊 GPA Calculator",
                desc: "Quickly compute your grades and know exactly where you stand—no more guessing or manual math.",
              },
              {
                title: "⏱ Pomodoro Timer",
                desc: "Stay focused using proven study intervals that help you avoid burnout.",
              },
              {
                title: "❓ Quiz Generator",
                desc: "Test your knowledge instantly on any topic—perfect for exam prep.",
              },
              {
                title: "📝 To-do List",
                desc: "Keep track of assignments and deadlines so nothing slips through.",
              },
            ].map((tool, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                className="bg-white/5 border border-white/10 p-6 rounded-xl"
              >
                <h3 className="font-semibold text-lg">{tool.title}</h3>
                <p className="text-slate-400 mt-2 text-sm">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🎯 OUTCOME SECTION */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            What changes when you use this?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>📈 Better academic performance</div>
            <div>🧠 Less stress and confusion</div>
            <div>⏳ More time saved daily</div>
          </div>
        </div>

        {/* 💬 FINAL CTA */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold mb-4">
            You don’t need more effort—you need better tools.
          </h2>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg transition"
          >
            Start Now →
          </button>
        </div>

        {/* 💰 ADS */}
        <div className="max-w-xl mx-auto mt-20 opacity-80">
          <AdSenseAd />
        </div>
      </div>


    </div>
  );
};

export default Home;
