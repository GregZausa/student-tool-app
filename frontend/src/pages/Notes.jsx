import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import AdSenseAd from "../utils/AdSenseAd";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import SelectBox from "../components/ui/SelectBox";
import {
  StickyNote,
  Plus,
  Trash2,
  X,
  Inbox,
  Search,
  Check,
} from "lucide-react";
import { COLOR_FILTER, NOTE_COLORS } from "../utils/constants/notes.config";
import { getColorConfig, timeAgo } from "../utils/functions/notes";
import NoteCard from "../components/cards/NoteCard";
import AddNoteModal from "../components/modal/AddNoteModal";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "../components/ui/SearchBar";
import Header from "../components/layout/Header";

const Notes = () => {
  const { userId } = useUser();

  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const { isDark } = useTheme();

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error) setNotes(data || []);
    setFetching(false);
  }, [userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAdd = async (fields) => {
    if (!userId) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("notes")
      .insert({ ...fields, user_id: userId })
      .select()
      .single();

    if (!error && data) setNotes((prev) => [data, ...prev]);
    setAdding(false);
  };

  const handleUpdate = async (id, fields) => {
    const { data, error } = await supabase
      .from("notes")
      .update(fields)
      .eq("id", id)
      .select()
      .single();

    if (!error && data)
      setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (!error) setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const subjects = [...new Set(notes.map((n) => n.subject).filter(Boolean))];
  const subjectOptions = [
    { value: "", label: "All subjects" },
    ...subjects.map((s) => ({ value: s, label: s })),
  ];

  const filtered = notes
    .filter((n) => !filterColor || n.color === filterColor)
    .filter((n) => !filterSubject || n.subject === filterSubject)
    .filter((n) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        (n.content || "").toLowerCase().includes(q)
      );
    });

  const activeFilters = [filterColor, filterSubject].filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Header
        isDark={isDark}
        header="Notes"
        icon={<StickyNote size={20} className="text-amber-500" />}
        subHeader={`${notes.length} note${notes.length !== 1 ? "s" : ""} saved`}
        buttoNlabel="New note"
        buttonIcon={<Plus size={15} />}
        buttonStyle="default"
        onClick={() => setShowModal(true)}
      />
      <AdSenseAd />
      <div className="space-y-2 mb-5">
        <SearchBar
          placeholder="Search notes..."
          isDark={isDark}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => setSearch("")}
          buttonIcon={<X size={13} />}
        />
        <div className="flex gap-2 flex-wrap">
          <div className="w-40">
            <SelectBox
              isDark={isDark}
              options={COLOR_FILTER}
              value={filterColor}
              onChange={setFilterColor}
              placeholder="All colors"
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
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setFilterColor("");
                setFilterSubject("");
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl border ${isDark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white  border-slate-200 text-slate-600"} text-xs transition-colors cursor-pointer hover:text-red-400 `}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-16 text-slate-300">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-400 rounded-full animate-spin mx-auto mb-2" />
            <div className="text-sm">Loading notes...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={` rounded-2xl border ${isDark ? "border-slate-700 text-slate-50 bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-300"}  p-12 text-center `}
        >
          <Inbox size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium">
            {search || activeFilters > 0
              ? "No notes match your search."
              : "No notes yet. Create your first one!"}
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {filtered.map((note) => (
            <div key={note.id} className="break-inside-avoid">
              <NoteCard
                isDark={isDark}
                note={note}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}

      <AdSenseAd />

      {showModal && (
        <AddNoteModal
          isDark={isDark}
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
          loading={adding}
        />
      )}

      <p className="text-center text-[11px] text-slate-300 mt-8">
        Notes · StudyTools PH 🇵🇭
      </p>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default Notes;
