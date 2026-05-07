import React, { useEffect } from "react";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen absolute inset-0 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <AppRouter />
    </div>
  );
};

export default App;
