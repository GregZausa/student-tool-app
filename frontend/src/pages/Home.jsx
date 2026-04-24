import React from "react";
import { Link } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            Student Tools Hub
          </h1>
          <p className="text-slate-400 text-lg">
            Free calculators and smart tools for Filipino students 🇵🇭
          </p>
        </div>

        <div className="mb-10">
          <Link
            to="/gpa-calculator"
            className="block p-6 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-indigo-400">
                  📊 GPA Calculator
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Compute your GWA instantly using the PH grading system
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-12">
          <div>
            <p className="text-xl font-bold">⚡ Fast</p>
            <p className="text-xs text-slate-400">Instant results</p>
          </div>
          <div>
            <p className="text-xl font-bold">🎯 Accurate</p>
            <p className="text-xs text-slate-400">Built for real student needs</p>
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
    </div>
  );
};

export default Home;
