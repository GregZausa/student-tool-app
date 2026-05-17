import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import {
  DECK_TYPES,
  VISIBILITY_OPTIONS,
  SUBJECT_OPTIONS,
  TYPE_BADGE,
  VISIBILITY_BADGE,
} from "../utils/constants/decks.config";
import {
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  Play,
  Globe,
  Lock,
  X,
  Inbox,
  Check,
  Copy,
} from "lucide-react";
import SearchBar from "../components/ui/SearchBar";

const DeckModal = ({ onClose, onSave, loading, initial, isDark }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [subject, setSubject] = useState(initial?.subject || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [type, setType] = useState(initial?.type || "flashcard");
  const [visibility, setVisibility] = useState(
    initial?.visibility || "private",
  );
  const [showCreator, setShowCreator] = useState(
    initial?.show_creator ?? false,
  );
  const [error, setError] = useState("");

  const isEdit = !!initial;

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSave({
      title: title.trim(),
      subject: subject || null,
      description: description.trim() || null,
      type,
      visibility,
      show_creator: visibility === "public" ? showCreator : false,
    });
  };

  const base = isDark
    ? "bg-slate-800 border-slate-700 text-slate-50"
    : "bg-slate-50 border-slate-100 text-slate-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        className={`${base} rounded-3xl border shadow-2xl w-full max-w-md p-6`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold">
            {isEdit ? "Edit deck" : "New deck"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-3">
          <FloatingLabelInput
            label="Title"
            type="text"
            value={title}
            onChange={(v) => {
              setTitle(v);
              setError("");
            }}
          />

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Subject
            </div>
            <SelectBox
              isDark={isDark}
              options={SUBJECT_OPTIONS.filter((s) => s.value)}
              value={subject}
              onChange={setSubject}
              placeholder="Pick a subject"
            />
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Content
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border text-sm placeholder:text-slate-400 outline-none resize-none transition-all
                ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-indigo-500" : "bg-white border-slate-200 text-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Type
              </div>
              <SelectBox
                isDark={isDark}
                options={DECK_TYPES}
                value={type}
                onChange={setType}
              />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Visibility
              </div>
              <SelectBox
                isDark={isDark}
                options={VISIBILITY_OPTIONS}
                value={visibility}
                onChange={setVisibility}
              />
            </div>
          </div>

          {/* Show creator option — only for public */}
          {visibility === "public" && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setShowCreator((v) => !v)}
                className={`w-9 h-5 rounded-full transition-all ${showCreator ? "bg-indigo-500" : "bg-slate-300"} relative`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${showCreator ? "left-4" : "left-0.5"}`}
                />
              </div>
              <span className="text-xs text-slate-500">
                Show my name on this deck
              </span>
            </label>
          )}

          {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Save changes" : "Create deck"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Deck Card ────────────────────────────────────────────────────────────────
const DeckCard = ({ deck, onEdit, onDelete, onStudy, isDark }) => {
  const typeBadge = TYPE_BADGE[deck.type] || TYPE_BADGE.flashcard;
  const visibilityBadge =
    VISIBILITY_BADGE[deck.visibility] || VISIBILITY_BADGE.private;

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all hover:shadow-sm group
      ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold truncate ${isDark ? "text-slate-100" : "text-slate-800"}`}
          >
            {deck.title}
          </h3>
          {deck.subject && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              📚 {deck.subject}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {deck.visibility === "public" ? (
            <Globe size={13} className="text-emerald-500" />
          ) : (
            <Lock size={13} className="text-slate-400" />
          )}
        </div>
      </div>

      {/* Description */}
      {deck.description && (
        <p
          className={`text-xs leading-relaxed line-clamp-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {deck.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${typeBadge.bg}`}
        >
          {typeBadge.label}
        </span>
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${visibilityBadge.bg}`}
        >
          {visibilityBadge.label}
        </span>
        <span className="text-[10px] text-slate-400 ml-auto">
          {deck.card_count ?? 0} card{deck.card_count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => onStudy(deck)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Play size={12} /> Study
        </button>
        <button
          onClick={() => onEdit(deck)}
          className={`w-8 h-8 rounded-xl border flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer
            ${isDark ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(deck.id)}
          className={`w-8 h-8 rounded-xl border flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors cursor-pointer
            ${isDark ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── Main MyDecks Page ────────────────────────────────────────────────────────
const MyDecks = () => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const { isDark } = useTheme();

  const [decks, setDecks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editDeck, setEditDeck] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");

  // ── Fetch decks with card count ──
  const fetchDecks = useCallback(async () => {
    if (!userId) return;
    setFetching(true);

    // Fetch decks
    const { data: deckData, error } = await supabase
      .from("decks")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error || !deckData) {
      setFetching(false);
      return;
    }

    // Fetch card counts per deck
    const deckIds = deckData.map((d) => d.id);
    const { data: cardCounts } = await supabase
      .from("cards")
      .select("deck_id")
      .in("deck_id", deckIds);

    const countMap = {};
    (cardCounts || []).forEach((c) => {
      countMap[c.deck_id] = (countMap[c.deck_id] || 0) + 1;
    });

    setDecks(deckData.map((d) => ({ ...d, card_count: countMap[d.id] || 0 })));
    setFetching(false);
  }, [userId]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // ── Create ──
  const handleCreate = async (fields) => {
    if (!userId) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("decks")
      .insert({ ...fields, user_id: userId })
      .select()
      .single();

    if (!error && data) {
      setDecks((prev) => [{ ...data, card_count: 0 }, ...prev]);
      setShowModal(false);
      // Navigate to editor right away
      navigate(`/dashboard/decks/${data.id}`);
    }
    setSaving(false);
  };

  // ── Update ──
  const handleUpdate = async (fields) => {
    if (!editDeck) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("decks")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", editDeck.id)
      .select()
      .single();

    if (!error && data) {
      setDecks((prev) =>
        prev.map((d) =>
          d.id === editDeck.id ? { ...data, card_count: d.card_count } : d,
        ),
      );
      setEditDeck(null);
    }
    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!confirm("Delete this deck and all its cards?")) return;
    const { error } = await supabase.from("decks").delete().eq("id", id);
    if (!error) setDecks((prev) => prev.filter((d) => d.id !== id));
  };

  // ── Study ──
  const handleStudy = (deck) => {
    if (deck.card_count === 0) {
      alert("Add some cards first before studying!");
      return;
    }
    navigate(`/dashboard/decks/${deck.id}/study`);
  };

  // ── Filter ──
  const filtered = decks
    .filter((d) => !filterType || d.type === filterType)
    .filter(
      (d) =>
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.subject || "").toLowerCase().includes(search.toLowerCase()),
    );

  const totalCards = decks.reduce((acc, d) => acc + (d.card_count || 0), 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}
          >
            <BookOpen size={20} className="text-indigo-500" /> My Decks
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {decks.length} deck{decks.length !== 1 ? "s" : ""} · {totalCards}{" "}
            total cards
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus size={15} /> New deck
        </button>
      </div>

      <AdSenseAd />

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          {
            label: "Total decks",
            value: decks.length,
            color: "text-indigo-500",
          },
          {
            label: "Public",
            value: decks.filter((d) => d.visibility === "public").length,
            color: "text-emerald-500",
          },
          { label: "Total cards", value: totalCards, color: "text-purple-500" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-2xl p-3.5 border text-center ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
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

      {/* ── Search + filter ── */}
      <div className="space-y-2 mb-5">
        <SearchBar
          isDark={isDark}
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          onClick={() => setSearch("")}
          buttonIcon={<X size={13} />}
          placeholder="Search materials..."
        />
      </div>
      <div className="w-44">
        <SelectBox
          isDark={isDark}
          options={[{ value: "", label: "All types" }, ...DECK_TYPES]}
          value={filterType}
          onChange={setFilterType}
        />
      </div>

      {/* ── Deck grid ── */}
      {fetching ? (
        <div className="flex items-center justify-center py-16 text-slate-300">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
            <div className="text-sm">Loading decks...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl border p-12 text-center ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-300"}`}
        >
          <Inbox size={32} className="mx-auto mb-2 opacity-50" />
          <div className="text-sm font-medium">
            {search || filterType
              ? "No decks match your search."
              : "No decks yet. Create your first one!"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {filtered.map((deck) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              isDark={isDark}
              onEdit={(d) => setEditDeck(d)}
              onDelete={handleDelete}
              onStudy={handleStudy}
            />
          ))}
        </div>
      )}

      {/* ── Explore CTA ── */}
      <div
        className={`rounded-2xl border p-5 mb-6 flex items-center gap-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-indigo-50 border-indigo-100"}`}
      >
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0">
          <Globe size={18} />
        </div>
        <div className="flex-1">
          <div
            className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-indigo-800"}`}
          >
            Explore public decks
          </div>
          <div
            className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-indigo-600"}`}
          >
            Study or clone decks made by other students
          </div>
        </div>
        <button
          onClick={() => navigate("/explore")}
          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          Browse →
        </button>
      </div>

      <AdSenseAd />

      {showModal && (
        <DeckModal
          isDark={isDark}
          loading={saving}
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}
      {editDeck && (
        <DeckModal
          isDark={isDark}
          loading={saving}
          initial={editDeck}
          onClose={() => setEditDeck(null)}
          onSave={handleUpdate}
        />
      )}

      <p className="text-center text-[11px] text-slate-300 mt-5">
        My Decks · StudyTools PH 🇵🇭
      </p>
    </div>
  );
};

export default MyDecks;
