import React from "react";
import { Link } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Student Tools Hub
          </h1>
          <p className="text-slate-400 mt-3">
            Free calculators and learning tools for students.
          </p>
          <AdSenseAd />
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4">
          <Link
            to="/gpa-calculator"
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold group-hover:text-indigo-400">
                  📊 GPA Calculator
                </p>
                <p className="text-sm text-slate-400">
                  Compute your GPA easily and instantly
                </p>
              </div>
              <span className="text-slate-500 group-hover:text-indigo-400">
                →
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;