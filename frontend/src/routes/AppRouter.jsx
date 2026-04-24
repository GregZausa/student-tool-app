import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import GPACalculator from "../pages/GPACalculator";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gpa-calculator" element={<GPACalculator />} />
    </Routes>
  );
};

export default AppRouter;
