import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  StickyNote,
  BookOpen,
  CalendarClock,
  Calculator,
  BrainCircuit,
  ChevronRight,
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
    ],
  },
  {
    section: "Tools",
    items: [
      { to: "/dashboard/pomodoro", icon: Clock, label: "Pomodoro" },
      { to: "/dashboard/gpa-calculator", icon: Calculator, label: "GPA Calc" },
      { to: "/dashboard/quiz-generator", icon: BrainCircuit, label: "Quiz" },
    ],
  },
];

const Sidebar = ({ onClose }) => {
  const { name } = useUser();
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200 w-60">
      {/* ── Brand ── */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
          S
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 leading-tight">
            StudyTools
          </div>
          <div className="text-[10px] text-slate-400">PH Student App</div>
        </div>
      </div>

      {/* ── User badge ── */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-700 truncate">
            {name || "Student"}
          </div>
          <div className="text-[10px] text-slate-400">Anonymous account</div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
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
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={15}
                        className={
                          isActive ? "text-indigo-500" : "text-slate-400"
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

      {/* ── Footer ── */}
      <div className="px-5 py-4 border-t border-slate-100">
        <NavLink
          to="/"
          className="text-[11px] text-slate-400 hover:text-indigo-500 transition-colors"
        >
          ← Back to Home
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
