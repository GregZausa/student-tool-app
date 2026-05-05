import { useUser } from "../context/UserContext";
import AdSenseAd from "../utils/AdSenseAd";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  CalendarClock,
  StickyNote,
  BookOpen,
  Clock,
  Calculator,
  BrainCircuit,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", icon: Sun };
  if (h < 18) return { text: "Good afternoon", icon: Sunset };
  return { text: "Good evening", icon: Moon };
}

const QuickCard = ({ to, icon: Icon, label, desc, color, count }) => (
  <Link
    to={to}
    className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all flex flex-col gap-3"
  >
    <div className="flex items-start justify-between">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={17} />
      </div>
      {count !== undefined && (
        <span className="text-xs font-bold text-slate-400 font-mono">
          {count}
        </span>
      )}
    </div>
    <div>
      <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
        {label}
      </div>
      <div className="text-xs text-slate-400 mt-0.5 leading-snug">{desc}</div>
    </div>
    <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
      Open <ArrowRight size={11} />
    </div>
  </Link>
);

const DashboardOverview = () => {
  const { name } = useUser();
  const { text: greetText, icon: GreetIcon } = getGreeting();

  const QUICK_LINKS = [
    {
      to: "/dashboard/todos",
      icon: CheckSquare,
      label: "To-do List",
      desc: "Track tasks and assignments",
      color: "bg-indigo-50 text-indigo-500",
    },
    {
      to: "/dashboard/deadlines",
      icon: CalendarClock,
      label: "Deadlines",
      desc: "Never miss a due date",
      color: "bg-red-50 text-red-500",
    },
    {
      to: "/dashboard/notes",
      icon: StickyNote,
      label: "Notes",
      desc: "Jot down anything fast",
      color: "bg-amber-50 text-amber-500",
    },
    {
      to: "/dashboard/materials",
      icon: BookOpen,
      label: "Materials",
      desc: "Save links and resources",
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      to: "/dashboard/pomodoro",
      icon: Clock,
      label: "Pomodoro",
      desc: "Focus timer for study sessions",
      color: "bg-purple-50 text-purple-500",
    },
    {
      to: "/dashboard/gpa-calculator",
      icon: Calculator,
      label: "GPA Calculator",
      desc: "Check your GWA instantly",
      color: "bg-sky-50 text-sky-500",
    },
    {
      to: "/quiz-generator",
      icon: BrainCircuit,
      label: "Quiz Generator",
      desc: "Test your knowledge",
      color: "bg-pink-50 text-pink-500",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
          <GreetIcon size={15} />
          <span>{greetText}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          {name ? `${name}'s Dashboard` : "My Dashboard"} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Lahat ng kailangan mo — nasa isang lugar lang.
        </p>
      </div>

      <AdSenseAd />
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Quick access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((item) => (
            <QuickCard key={item.to} {...item} />
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="text-sm font-semibold text-indigo-800 mb-1">
              Pro tip para sa dashboard mo
            </div>
            <p className="text-xs text-indigo-600 leading-relaxed">
              Gamitin ang <strong>Pomodoro timer</strong> habang tinitingnan ang
              iyong to-do list — mas focused ka at mas marami kang matatapos na
              tasks ngayon.
            </p>
          </div>
        </div>
      </div>

      <AdSenseAd />

      <p className="text-center text-[11px] text-slate-500 mt-6">
        StudyTools · PH Student App 🇵🇭
      </p>
    </div>
  );
};

export default DashboardOverview;
