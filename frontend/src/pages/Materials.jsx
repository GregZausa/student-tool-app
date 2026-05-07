import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import AdSenseAd from "../utils/AdSenseAd";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import SelectBox from "../components/ui/SelectBox";
import { BookOpen, Plus, X, Inbox, Search } from "lucide-react";
import { TYPE_FILTER } from "../utils/constants/materials.config";
import SubjectGroup from "../components/SubjectGroup";
import AddMaterialModal from "../components/modal/AddMaterialModal";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/layout/Header";
import SearchBar from "../components/ui/SearchBar";

const Materials = () => {
  const { userId } = useUser();
  const { isDark } = useTheme();

  const [materials, setMaterials] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [groupBy, setGroupBy] = useState("subject");

  const fetchMaterials = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setMaterials(data || []);
    setFetching(false);
  }, [userId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleAdd = async (fields) => {
    if (!userId) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("materials")
      .insert({ ...fields, user_id: userId })
      .select()
      .single();

    if (!error && data) setMaterials((prev) => [data, ...prev]);
    setAdding(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (!error) setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const subjects = [
    ...new Set(materials.map((m) => m.subject).filter(Boolean)),
  ];
  const subjectOptions = [
    { value: "", label: "All subjects" },
    ...subjects.map((s) => ({ value: s, label: s })),
  ];

  const GROUP_OPTIONS = [
    { value: "subject", label: "📚 Group by subject" },
    { value: "type", label: "🔗 Group by type" },
    { value: "none", label: "📋 No grouping" },
  ];

  const filtered = materials
    .filter((m) => !filterType || m.type === filterType)
    .filter((m) => !filterSubject || m.subject === filterSubject)
    .filter((m) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.url || "").toLowerCase().includes(q)
      );
    });

  const grouped = (() => {
    if (groupBy === "none") return { "All materials": filtered };
    const key = groupBy === "subject" ? "subject" : "type";
    const groups = {};
    filtered.forEach((m) => {
      const k = m[key] || (key === "subject" ? "Uncategorized" : "other");
      if (!groups[k]) groups[k] = [];
      groups[k].push(m);
    });
    return groups;
  })();

  const activeFilters = [filterType, filterSubject].filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="Materials"
        subHeader={`${materials.length} resource${materials.length !== 1 ? "s" : ""} saved`}
        icon={<BookOpen size={20} className="text-emerald-500" />}
        onClick={() => setShowModal(true)}
        buttoNlabel="Add material"
        buttonStyle="default"
        buttonIcon={<Plus size={15} />}
      />
      <AdSenseAd />
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {[
          { label: "Total", value: materials.length, color: "text-slate-700" },
          {
            label: "Links",
            value: materials.filter((m) => m.type === "link").length,
            color: "text-sky-500",
          },
          {
            label: "Videos",
            value: materials.filter((m) => m.type === "youtube").length,
            color: "text-red-500",
          },
          {
            label: "PDFs",
            value: materials.filter((m) => m.type === "pdf").length,
            color: "text-amber-500",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} rounded-2xl p-3 border  text-center`}
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-1">
              {label}
            </div>
            <div className={`text-xl font-bold font-mono ${color}`}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-5">
        <SearchBar
          isDark={isDark}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onClick={() => setSearch("")}
          buttonIcon={<X size={13} />}
          placeholder="Search materials..."
        />

        <div className="flex gap-2 flex-wrap items-center">
          <div className="w-40">
            <SelectBox
              isDark={isDark}
              options={TYPE_FILTER}
              value={filterType}
              onChange={setFilterType}
            />
          </div>
          {subjects.length > 0 && (
            <div className="w-44">
              <SelectBox
                isDark={isDark}
                options={subjectOptions}
                value={filterSubject}
                onChange={setFilterSubject}
              />
            </div>
          )}
          <div className="w-48">
            <SelectBox
              isDark={isDark}
              options={GROUP_OPTIONS}
              value={groupBy}
              onChange={setGroupBy}
            />
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setFilterType("");
                setFilterSubject("");
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer bg-white"
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-16 text-slate-300">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-400 rounded-full animate-spin mx-auto mb-2" />
            <div className="text-sm">Loading materials...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl border ${isDark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white  border-slate-100 text-slate-600"} p-12 text-center `}
        >
          <Inbox size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium">
            {search || activeFilters > 0
              ? "No materials match your search."
              : "No materials yet. Add your first resource!"}
          </div>
        </div>
      ) : (
        Object.entries(grouped).map(([group, items]) => (
          <SubjectGroup
            isDark={isDark}
            key={group}
            subject={group === "none" ? null : group}
            materials={items}
            onDelete={handleDelete}
          />
        ))
      )}
      <AdSenseAd />

      {showModal && (
        <AddMaterialModal
          isDark={isDark}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
          loading={adding}
        />
      )}

      <p className="text-center text-[11px] text-slate-300 mt-8">
        Materials · StudyTools PH 🇵🇭
      </p>
    </div>
  );
};

export default Materials;
