import { useState, useEffect, useCallback, useRef } from "react";
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

const ALARM_TIERS = [
  {
    key: "24h",
    ms: 24 * 60 * 60 * 1000,
    title: (d) => `📅 Tomorrow: ${d.title}`,
    body: (d) =>
      d.subject ? `${d.subject} — due in 24 hours` : "Due in 24 hours!",
  },
  {
    key: "3h",
    ms: 3 * 60 * 60 * 1000,
    title: (d) => `⚠️ 3 hours left: ${d.title}`,
    body: (d) =>
      d.subject ? `${d.subject} — due in 3 hours` : "Due in 3 hours!",
  },
  {
    key: "1h",
    ms: 1 * 60 * 60 * 1000,
    title: (d) => `⏰ 1 hour left: ${d.title}`,
    body: (d) =>
      d.subject ? `${d.subject} — due in 1 hour` : "Due in 1 hour!",
  },
  {
    key: "0h",
    ms: 0,
    title: (d) => `🚨 DEADLINE NOW: ${d.title}`,
    body: (d) =>
      d.subject ? `${d.subject} — due RIGHT NOW!` : "This is due right now!",
  },
];

const TIER_WINDOW_MS = 30 * 1000;

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

  const firedRef = useRef(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem("ph_study_fired_alarms") || "[]"),
      );
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      firedRef.current = new Set(
        JSON.parse(localStorage.getItem("ph_study_fired_alarms") || "[]"),
      );
    } catch {
      firedRef.current = new Set();
    }
  }, []);

  const markFired = (key) => {
    firedRef.current.add(key);
    const arr = [...firedRef.current].slice(-200);
    localStorage.setItem("ph_study_fired_alarms", JSON.stringify(arr));
  };

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
    if (!notifGranted || deadlines.length === 0) return;

    deadlines.forEach((d) => {
      if (d.completed) return;

      const diff = new Date(d.due_date) - now;

      ALARM_TIERS.forEach((tier) => {
        const alarmKey = `${d.id}-${tier.key}`;
        const alreadyFired = firedRef.current.has(alarmKey);
        if (alreadyFired) return;

        const lowerBound = tier.ms - TIER_WINDOW_MS;
        const upperBound = tier.ms + TIER_WINDOW_MS;

        const inWindow =
          tier.ms === 0
            ? diff >= -TIER_WINDOW_MS && diff <= TIER_WINDOW_MS
            : diff >= lowerBound && diff <= upperBound;

        if (inWindow) {
          new Notification(tier.title(d), { body: tier.body(d) });
          markFired(alarmKey);
        }
      });
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
        icon={<CalendarClock size={20} className="text-red-500" />}
        header="Deadlines"
        subHeader="Track exams, assignments, and projects"
        buttonLabel={notifGranted ? "Alerts On" : "Enable Alerts"}
        buttonStyle={notifGranted ? "granted" : "notGranted"}
        buttonIcon={notifGranted ? <Bell size={13} /> : <BellOff size={13} />}
        onButtonClick={requestNotif}
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
                className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"} rounded-2xl p-3.5 border text-center`}
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

        {notifGranted && (
          <div
            className={`rounded-2xl border px-4 py-3 mb-4 text-xs ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
          >
            <span className="font-semibold">🔔 Alerts active</span> — you'll be
            notified at <strong>24 hours</strong>, <strong>3 hours</strong>,{" "}
            <strong>1 hour</strong>, and <strong>at the exact due time</strong>{" "}
            for each deadline.
          </div>
        )}

        <AddDeadlineForm onAdd={handleAdd} loading={adding} isDark={isDark} />

        <div className="mb-4">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeFilters > 0
                ? `${isDark ? "bg-red-800 text-slate-50 border-red-700" : "bg-red-50 border-red-200 text-red-600"}`
                : `${isDark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"}`
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
              className={`border ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-500"} rounded-2xl p-8 text-center`}
            >
              <div className="w-6 h-6 border-2 border-slate-200 border-t-red-500 rounded-full animate-spin mx-auto mb-2" />
              <div className="text-sm">Loading deadlines...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className={`border ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-100 text-slate-500"} rounded-2xl p-10 text-center`}
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
