import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import { SUBJECT_FILTER, TYPE_BADGE } from "../utils/constants/decks.config";
import {
  Globe,
  Search,
  Play,
  Copy,
  X,
  Inbox,
  BookOpen,
  User,
  ChevronRight,
} from "lucide-react";

// ─── Deck type filter ─────────────────────────────────────────────────────────
const TYPE_FILTER = [
  { value: "", label: "All types" },
  { value: "flashcard", label: "🃏 Flashcard" },
  { value: "quiz", label: "📝 Quiz" },
];

// ─── Public Deck Card ─────────────────────────────────────────────────────────
const PublicDeckCard = ({ deck, onStudy, onClone, isCloning, isDark }) => {
  const typeBadge = TYPE_BADGE[deck.type] || TYPE_BADGE.flashcard;
  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all hover:shadow-sm group ${cardBase}`}
    >
      {/* Header */}
      <div>
        <h3 className={`text-sm font-bold leading-snug mb-0.5 ${textBase}`}>
          {deck.title}
        </h3>
        {deck.subject && (
          <p className="text-[11px] text-slate-400">📚 {deck.subject}</p>
        )}
      </div>

      {/* Description */}
      {deck.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {deck.description}
        </p>
      )}

      {/* Badges + meta */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${typeBadge.bg}`}
        >
          {typeBadge.label}
        </span>
        <span className="text-[10px] text-slate-400">
          {deck.card_count ?? 0} card{deck.card_count !== 1 ? "s" : ""}
        </span>
        {deck.show_creator && deck.creator_name && (
          <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
            <User size={9} /> {deck.creator_name}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
        <button
          onClick={() => onClone(deck)}
          disabled={isCloning}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
            isDark
              ? "border-slate-700 text-slate-300 hover:bg-slate-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Copy size={12} /> {isCloning ? "Cloning..." : "Clone"}
        </button>
        <button
          onClick={() => onStudy(deck.id)}
          disabled={!deck.card_count}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40"
        >
          <Play size={12} /> Study
        </button>
      </div>
    </div>
  );
};

// ─── Clone success toast ──────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl animate-[slideUp_0.3s_ease]">
    <span>✅ {message}</span>
    <button
      onClick={onClose}
      className="text-slate-400 hover:text-white cursor-pointer ml-1"
    >
      <X size={12} />
    </button>
  </div>
);

// ─── Main ExplorePage ─────────────────────────────────────────────────────────
const ExplorePage = () => {
  const { userId } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [decks, setDecks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [cloningId, setCloningId] = useState(null);
  const [toast, setToast] = useState("");

  // ── Fetch public decks ──
  const fetchDecks = useCallback(async () => {
    setFetching(true);

    const { data, error } = await supabase
      .from("decks")
      .select(
        `
        *,
        cards(count),
        users(name)
      `,
      )
      .eq("visibility", "public")
      .order("updated_at", { ascending: false });

    if (!error) {
      const processed = (data || []).map((d) => ({
        ...d,
        card_count: d.cards?.[0]?.count ?? 0,
        creator_name: d.users?.name || "Anonymous",
      }));
      setDecks(processed);
    }
    setFetching(false);
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // ── Clone deck ──
  const handleClone = async (deck) => {
    if (!userId) return;
    setCloningId(deck.id);

    try {
      // 1. Create new deck for this user
      const { data: newDeck, error: deckErr } = await supabase
        .from("decks")
        .insert({
          user_id: userId,
          title: `${deck.title} (copy)`,
          subject: deck.subject,
          description: deck.description,
          type: deck.type,
          visibility: "private",
          show_creator: false,
          cloned_from: deck.id,
        })
        .select()
        .single();

      if (deckErr || !newDeck) throw new Error("Failed to clone deck");

      // 2. Fetch original cards
      const { data: originalCards, error: cardsErr } = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", deck.id);

      if (cardsErr) throw new Error("Failed to fetch cards");

      // 3. Insert cloned cards
      if (originalCards?.length > 0) {
        const newCards = originalCards.map(
          ({ id, deck_id, created_at, ...rest }) => ({
            ...rest,
            deck_id: newDeck.id,
          }),
        );
        await supabase.from("cards").insert(newCards);
      }

      setToast(`"${deck.title}" cloned to your decks!`);
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setCloningId(null);
    }
  };

  // ── Study public deck ──
  // We navigate to a special public study route
  const handleStudy = (deckId) => {
    navigate(`/study/${deckId}`);
  };

  // ── Filter ──
  const filtered = decks
    .filter((d) => !filterSubject || d.subject === filterSubject)
    .filter((d) => !filterType || d.type === filterType)
    .filter((d) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        (d.subject || "").toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q)
      );
    });

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1
            className={`text-xl font-bold flex items-center gap-2 ${textBase}`}
          >
            <Globe size={20} className="text-emerald-500" /> Explore
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse and study public decks from the community
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/decks")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
            isDark
              ? "border-slate-700 text-slate-300 hover:bg-slate-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          My Decks <ChevronRight size={13} />
        </button>
      </div>

      <AdSenseAd />

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {[
          {
            label: "Public decks",
            value: decks.length,
            color: "text-emerald-500",
          },
          {
            label: "Flashcard sets",
            value: decks.filter((d) => d.type === "flashcard").length,
            color: "text-indigo-500",
          },
          {
            label: "Quiz sets",
            value: decks.filter((d) => d.type === "quiz").length,
            color: "text-purple-500",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-2xl p-3.5 border text-center ${cardBase}`}
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

      {/* ── Search + filters ── */}
      <div className="space-y-2 mb-5">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${cardBase}`}
        >
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search public decks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 text-sm placeholder:text-slate-400 outline-none bg-transparent ${textBase}`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="w-44">
            <SelectBox
              options={SUBJECT_FILTER}
              value={filterSubject}
              onChange={setFilterSubject}
              isDark={isDark}
            />
          </div>
          <div className="w-40">
            <SelectBox
              options={TYPE_FILTER}
              value={filterType}
              onChange={setFilterType}
              isDark={isDark}
            />
          </div>
          {(filterSubject || filterType) && (
            <button
              onClick={() => {
                setFilterSubject("");
                setFilterType("");
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer bg-white dark:bg-slate-800"
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Deck grid ── */}
      {fetching ? (
        <div className={`rounded-2xl border p-10 text-center ${cardBase}`}>
          <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
          <div className="text-sm text-slate-400">Loading public decks...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`rounded-2xl border p-12 text-center ${cardBase}`}>
          <Inbox size={32} className="mx-auto mb-2 opacity-30 text-slate-400" />
          <div
            className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {search || filterSubject || filterType
              ? "No decks match your search."
              : "No public decks yet. Be the first to share one!"}
          </div>
          <button
            onClick={() => navigate("/dashboard/decks")}
            className="mt-3 text-xs text-indigo-500 hover:text-indigo-600 font-semibold cursor-pointer"
          >
            Create a public deck →
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            {filtered.length} deck{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {filtered.map((deck) => (
              <PublicDeckCard
                key={deck.id}
                deck={deck}
                isDark={isDark}
                onStudy={handleStudy}
                onClone={handleClone}
                isCloning={cloningId === deck.id}
              />
            ))}
          </div>
        </>
      )}

      <AdSenseAd />

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <p className="text-center text-[11px] text-slate-300 mt-5">
        Explore · StudyTools PH 🇵🇭
      </p>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to   { opacity: 1; transform: translate(-50%, 0);    }
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;
