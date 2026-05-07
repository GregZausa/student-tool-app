import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import AdSenseAd from "../utils/AdSenseAd";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import SelectBox from "../components/ui/SelectBox";
import { CalendarClock, Bell, BellOff, Clock, X, Inbox } from "lucide-react";
import { TYPE_FILTER } from "../utils/constants/deadline.config";
import { STATUS_FILTER } from "../utils/constants/todo-config";
import { useNow } from "../utils/functions/deadline";
import AddDeadlineForm from "../components/forms/AddDeadlineForm";
import DeadlineItem from "../components/DeadlineItem";
import Header from "../components/layout/Header";
import { useTheme } from "../context/ThemeContext";

const Deadlines = () => {
  const { userId } = useUser();
  const { isDark } = useTheme();
  const now = useNow();

  const [deadlines, setDeadlines] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("upcoming");
  const [showFilter, setShowFilter] = useState(false);
  const [notifGranted, setNotifGranted] = useState(
    Notification.permission === "granted",
  );

  const fetchDeadlines = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    const { data, error } = await supabase
      .from("deadlines")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });

    if (!error) setDeadlines(data || []);
    setFetching(false);
  }, [userId]);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  const requestNotif = async () => {
    const result = await Notification.requestPermission();
    setNotifGranted(result === "granted");
  };

  useEffect(() => {
    if (!notifGranted) return;
    deadlines.forEach((d) => {
      if (d.completed) return;
      const diff = new Date(d.due_date) - now;
      if (diff > 0 && diff <= 60 * 60 * 1000 && diff > 59 * 60 * 1000) {
        new Notification(`⏰ 1 hour left: ${d.title}`, {
          body: d.subject ? `${d.subject} — due in 1 hour` : "Due in 1 hour!",
        });
      }
    });
  }, [now, deadlines, notifGranted]);

  const handleAdd = async (fields) => {
    if (!userId) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("deadlines")
      .insert({ ...fields, user_id: userId })
      .select()
      .single();

    if (!error && data)
      setDeadlines((prev) =>
        [...prev, data].sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date),
        ),
      );
    setAdding(false);
  };

  const handleToggle = async (id, completed) => {
    const { data, error } = await supabase
      .from("deadlines")
      .update({ completed: !completed })
      .eq("id", id)
      .select()
      .single();

    if (!error && data)
      setDeadlines((prev) => prev.map((d) => (d.id === id ? data : d)));
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("deadlines").delete().eq("id", id);
    if (!error) setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = deadlines
    .filter((d) => !filterType || d.type === filterType)
    .filter((d) => {
      if (!filterStatus) return true;
      if (filterStatus === "completed") return d.completed;
      return !d.completed;
    });

  const upcoming = deadlines.filter((d) => !d.completed).length;
  const overdue = deadlines.filter(
    (d) => !d.completed && new Date(d.due_date) < now,
  ).length;
  const completed = deadlines.filter((d) => d.completed).length;
  const activeFilters = [filterType, filterStatus].filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        icon={<CalendarClock size={20} className="text-red-500"/>}
        header="Deadlines"
        subHeader="Track exams, assignments, and projects"
        buttoNlabel={notifGranted ? "Alers On" : "Enable Alerts"}
        buttonStyle={notifGranted ? "granted" : "notGranted"}
        buttonIcon={notifGranted ? <Bell size={13} /> : <BellOff size={13} />}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AdSenseAd />

        <div className="mt-5">
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "Upcoming", value: upcoming, color: "text-slate-700" },
              { label: "Overdue", value: overdue, color: "text-red-500" },
              {
                label: "Completed",
                value: completed,
                color: "text-emerald-500",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl p-3.5 border  text-center`}
              >
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
                  {label}
                </div>
                <div className={`text-2xl font-bold font-mono ${color}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
        <AddDeadlineForm onAdd={handleAdd} loading={adding} isDark={isDark} />

        <div className="mb-4">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeFilters > 0
                ? `${isDark ? "bg-red-800 text-slate-50 border-red-700" : "bg-red-50 border-red-200 text-red-600"}`
                : `${isDark ? "bg-slate-800 border-slate-700 text-slate-200 hover:slate-500" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`
            }`}
          >
            <Clock size={13} />
            Filters
            {activeFilters > 0 && (
              <span className="bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {showFilter && (
            <div
              className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl p-4 mt-2 animate-[fadeSlideIn_0.2s_ease]`}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                    Type
                  </div>
                  <SelectBox
                    isDark={isDark}
                    options={TYPE_FILTER}
                    value={filterType}
                    onChange={setFilterType}
                  />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                    Status
                  </div>
                  <SelectBox
                    isDark={isDark}
                    options={STATUS_FILTER}
                    value={filterStatus}
                    onChange={setFilterStatus}
                  />
                </div>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setFilterType("");
                    setFilterStatus("");
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          {fetching ? (
            <div
              className={`border ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-700 text-slate-500"} rounded-2xl   p-8 text-center `}
            >
              <div className="w-6 h-6 border-2 border-slate-200 border-t-red-500 rounded-full animate-spin mx-auto mb-2" />
              <div className="text-sm">Loading deadlines...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className={`border ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-500"} rounded-2xl   p-10 text-center `}
            >
              <Inbox size={32} className="mx-auto mb-2 opacity-50" />
              <div className="text-sm font-medium">
                {activeFilters > 0
                  ? "No deadlines match your filters."
                  : "No deadlines yet. Add one above!"}
              </div>
            </div>
          ) : (
            filtered.map((d) => (
              <DeadlineItem
              isDark={isDark}
                key={d.id}
                deadline={d}
                onToggle={handleToggle}
                onDelete={handleDelete}
                now={now}
              />
            ))
          )}
        </div>

        <AdSenseAd />

        <p className="text-center text-[11px] text-slate-300 mt-5">
          Deadlines · StudyTools PH 🇵🇭
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default Deadlines;
