import { useState } from "react";
import CatCursor from "../../utils/animation/CatCursor";
import { useTheme } from "../../context/ThemeContext";
import { PawPrint } from "lucide-react";

const FloatingControls = () => {
  const { isDark, toggleTheme } = useTheme();
  const [catEnabled, setCatEnabled] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-center">

        <button
          onClick={() => setCatEnabled((v) => !v)}
          title={catEnabled ? "Hide cat" : "Show cat"}
          className={`w-10 h-10 rounded-full shadow-lg border flex items-center justify-center transition-all cursor-pointer ${
            catEnabled
              ? "bg-indigo-500 border-indigo-400 text-white hover:bg-indigo-600"
              : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
          }`}
        >
          <PawPrint size={16} />
        </button>
      </div>

      {catEnabled && <CatCursor enabled={true} />}
    </>
  );
};


export default FloatingControls;