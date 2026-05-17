import { useState, useEffect, useCallback } from "react";
import AdSenseAd from "../utils/AdSenseAd";
import Header from "../components/layout/Header";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import SelectBox from "../components/ui/SelectBox";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import {
  CheckSquare,
  Plus,
  Trash2,
  SlidersHorizontal,
  X,
  CalendarDays,
  BookOpen,
  Inbox,
} from "lucide-react";
import {
  PRIORITIES,
  PRIORITY_FILTER,
  SORT_OPTIONS,
  STATUS_FILTER,
  PRIORITY_ORDER,
  PRIORITY_STYLES,
} from "../utils/constants/todo-config";
import AddTodoForm from "../components/forms/AddTodoForm";
import TodoItem from "../components/TodoItem";
import { useTheme } from "../context/ThemeContext";

const TodoList = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { isDark } = useTheme();

  const [todos, setTodos] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filterSubject, setFilterSubject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");

  const fetchTodos = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setTodos(data || []);
    setFetching(false);
  }, [userId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (fields) => {
    if (!userId) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({ ...fields, user_id: userId })
      .select()
      .single();

    if (!error && data) setTodos((prev) => [data, ...prev]);
    setAdding(false);
  };

  const handleToggle = async (id, completed) => {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id)
      .select()
      .single();

    if (!error && data)
      setTodos((prev) => prev.map((t) => (t.id === id ? data : t)));
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const subjects = [...new Set(todos.map((t) => t.subject).filter(Boolean))];
  const subjectOptions = [
    { value: "", label: "All subjects" },
    ...subjects.map((s) => ({ value: s, label: s })),
  ];

  const filtered = todos
    .filter((t) => !filterSubject || t.subject === filterSubject)
    .filter((t) => !filterPriority || t.priority === filterPriority)
    .filter((t) => {
      if (!filterStatus) return true;
      if (filterStatus === "completed") return t.completed;
      return !t.completed;
    })
    .sort((a, b) => {
      if (sortBy === "priority")
        return (
          (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1)
        );
      if (sortBy === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const pending = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;
  const activeFilters = [filterSubject, filterPriority, filterStatus].filter(
    Boolean,
  ).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="To-do List"
        subHeader="Track your tasks and assignments — synced automatically"
        icon={<CheckSquare size={20} className="text-indigo-500" />}
      />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <AdSenseAd />

        <div className="mt-5">
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "Total", value: todos.length, color: "text-slate-700" },
              { label: "Pending", value: pending, color: "text-amber-500" },
              {
                label: "Completed",
                value: completed,
                color: "text-emerald-500",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className={` border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-3.5 text-center`}
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

          <AddTodoForm onAdd={handleAdd} loading={adding} isDark={isDark} />

          <div className="mb-3">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                activeFilters > 0
                  ? isDark
                    ? "bg-slate-800 border-slate-700 text-slate-50"
                    : "bg-slate-50 border-slate-100 text-slate-800"
                  : isDark
                    ? "bg-slate-800 border-slate-700 text-slate-50 hover:bg-slate-600"
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilters > 0 && (
                <span className="bg-indigo-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {showFilter && (
              <div
                className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl p-4 mt-2 animate-[fadeSlideIn_0.2s_ease]`}
              >
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Subject
                    </div>
                    <SelectBox
                      options={subjectOptions}
                      value={filterSubject}
                      onChange={setFilterSubject}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Priority
                    </div>
                    <SelectBox
                      options={PRIORITY_FILTER}
                      value={filterPriority}
                      onChange={setFilterPriority}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Status
                    </div>
                    <SelectBox
                      options={STATUS_FILTER}
                      value={filterStatus}
                      onChange={setFilterStatus}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                      Sort by
                    </div>
                    <SelectBox
                      options={SORT_OPTIONS}
                      value={sortBy}
                      onChange={setSortBy}
                    />
                  </div>
                </div>
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setFilterSubject("");
                      setFilterPriority("");
                      setFilterStatus("");
                    }}
                    className={`flex items-center gap-1.5 text-xs ${isDark ? "text-slate-50" : "text-slate-800"} hover:text-red-400 transition-colors cursor-pointer`}
                  >
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          <div
            className={`border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"} rounded-2xl  p-4 mb-4`}
          >
            {fetching ? (
              <div className="text-center py-8 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                <div className="text-sm">Loading your tasks...</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Inbox size={32} className="mx-auto mb-2 opacity-50" />
                <div className="text-sm font-medium">
                  {activeFilters > 0
                    ? "No tasks match your filters."
                    : "No tasks yet. Add your first task above!"}
                </div>
              </div>
            ) : (
              <div>
                {filtered.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
                <div className="text-[10px] text-slate-300 text-center pt-3">
                  {filtered.length} task{filtered.length !== 1 ? "s" : ""} shown
                </div>
              </div>
            )}
          </div>

          <AdSenseAd />

          <p className="text-center text-[11px] text-slate-500 mt-5">
            To-do List · PH Study Tools 🇵🇭
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TodoList;
