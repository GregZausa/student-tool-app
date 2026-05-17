import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { signOut } from "../../config/user";
import ToggleButton from "../ui/ToggleButton";
import studIQLogo from "../res/logo.png";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  StickyNote,
  BookOpen,
  CalendarClock,
  Calculator,
  BrainCircuit,
  Globe,
  ChevronRight,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "Dashboard",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
    ],
  },
  {
    section: "My Stuff",
    items: [
      { to: "/dashboard/todos", icon: CheckSquare, label: "To-do List" },
      { to: "/dashboard/deadlines", icon: CalendarClock, label: "Deadlines" },
      { to: "/dashboard/notes", icon: StickyNote, label: "Notes" },
      { to: "/dashboard/materials", icon: BookOpen, label: "Materials" },
      { to: "/dashboard/decks", icon: BrainCircuit, label: "My Decks" },
    ],
  },
  {
    section: "Tools",
    items: [
      { to: "/dashboard/pomodoro", icon: Clock, label: "Pomodoro" },
      { to: "/dashboard/gpa-calculator", icon: Calculator, label: "GPA Calc" },
      { to: "/dashboard/quiz-generator", icon: BrainCircuit, label: "Quiz" },
      { to: "/dashboard/explore", icon: Globe, label: "Explore" },
    ],
  },
];

const Sidebar = ({ onClose }) => {
  const { name } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const sidebarBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-800";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <aside className={`flex flex-col h-full border-r w-60 ${sidebarBg}`}>
      {/* ── Brand ── */}
      <div
        className={`flex items-center justify-between px-5 py-5 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}
          >
            <img
              src={studIQLogo}
              alt="Logo"
              className="w-9 h-9 rounded-xl object-cover shrink-0"
            />
          </div>
          <div>
            <div className={`text-sm font-bold leading-tight ${textPrimary}`}>
              Stud IQ
            </div>
            <div className="text-[10px] text-slate-400">PH Student App</div>
          </div>
        </div>
        <ToggleButton isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      <div
        className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${isDark ? "border-slate-700" : "border-slate-100"}`}
      >
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <div className={`text-sm font-semibold truncate ${textPrimary}`}>
            {name || "Student"}
          </div>
          <div className="text-[10px] text-slate-400">Signed in</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-none">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div
              className={`text-[10px] font-semibold uppercase tracking-widest px-2 mb-1.5 ${textMuted}`}
            >
              {section}
            </div>
            <div className="space-y-0.5">
              {items.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
                        : `${isDark ? "text-slate-300 hover:bg-slate-700 hover:text-slate-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={15}
                        className={
                          isActive
                            ? "text-indigo-500"
                            : isDark
                              ? "text-slate-400"
                              : "text-slate-400"
                        }
                      />
                      <span className="flex-1">{label}</span>
                      {isActive && (
                        <ChevronRight size={12} className="text-indigo-400" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        className={`px-4 py-4 border-t space-y-1 ${isDark ? "border-slate-700" : "border-slate-100"}`}
      >
        <NavLink
          to="/"
          className={`text-[11px] block px-2 py-1 ${textMuted} hover:text-indigo-500 transition-colors`}
        >
          ← Back to Home
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
        >
          <LogOut size={13} /> Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
