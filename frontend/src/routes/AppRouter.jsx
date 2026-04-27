import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import GPACalculator from "../pages/GPACalculator";
import PomodoroTimer from "../pages/PomodoroTimer";
import QuizGenerator from "../pages/QuizGenerator";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gpa-calculator" element={<GPACalculator />} />
      <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
      <Route path="/quiz-generator" element={<QuizGenerator />} />
    </Routes>
  );
};

export default AppRouter;
