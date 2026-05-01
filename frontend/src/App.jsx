import React, { useEffect } from "react";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";

const App = () => {

  return (
    <div className="min-h-screen absolute inset-0 bg-linear-to-br from-slate-800/50 via-white/10 to-white/5">
      <Toaster position="top-center" reverseOrder={false} />
      <AppRouter />
    </div>
  );
};

export default App;
