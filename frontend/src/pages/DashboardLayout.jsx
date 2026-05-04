import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name } = useUser();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">

      <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:z-30">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-50 shadow-xl animate-[slideInLeft_0.25s_ease]">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="text-sm font-bold text-slate-800">StudyTools</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Hi, <span className="font-semibold text-slate-700">{name || "Student"}</span></span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;