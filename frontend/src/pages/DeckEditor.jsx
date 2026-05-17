import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import AdSenseAd from "../utils/AdSenseAd";
import SelectBox from "../components/ui/SelectBox";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import {
  CARD_TYPES,
  DECK_TYPES,
  VISIBILITY_OPTIONS,
  TYPE_BADGE,
  VISIBILITY_BADGE,
} from "../utils/constants/decks.config";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  X,
  Play,
  Pencil,
  Save,
  ChevronDown,
  ChevronUp,
  Inbox,
} from "lucide-react";

const CardForm = ({ onAdd, loading, isDark }) => {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("flashcard");
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctChoice, setCorrectChoice] = useState(0);
  const [correctTF, setCorrectTF] = useState("True");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  const handleChoiceChange = (i, val) => {
    setChoices((prev) => prev.map((c, idx) => (idx === i ? val : c)));
  };

  const handleSubmit = () => {
    if (!question.trim()) {
      setError("Question is required.");
      return;
    }

    let correct_answer = "";
    let choicesPayload = null;

    if (type === "flashcard") {
      if (!answer.trim()) {
        setError("Answer is required.");
        return;
      }
      correct_answer = answer.trim();
    } else if (type === "multiple_choice") {
      const filled = choices.filter((c) => c.trim());
      if (filled.length < 2) {
        setError("At least 2 choices are required.");
        return;
      }
      if (!choices[correctChoice]?.trim()) {
        setError("Mark a valid correct answer.");
        return;
      }
      choicesPayload = choices.map((c) => c.trim()).filter(Boolean);
      correct_answer = choices[correctChoice].trim();
    } else {
      correct_answer = correctTF;
    }

    onAdd({
      question: question.trim(),
      type,
      choices: choicesPayload,
      correct_answer,
      card_order: Date.now(),
    });

    setQuestion("");
    setAnswer("");
    setChoices(["", "", "", ""]);
    setCorrectChoice(0);
    setCorrectTF("True");
    setError("");
  };

  const inputBase = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
    : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400";

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";

  return (
    <div className={`rounded-2xl border mb-4 overflow-hidden ${cardBase}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition-colors cursor-pointer ${isDark ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
      >
        <span className="flex items-center gap-2">
          <Plus size={15} /> Add new card
        </span>
        {open ? (
          <ChevronUp size={15} className="text-slate-400" />
        ) : (
          <ChevronDown size={15} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
          {/* Card type */}
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Card type
            </div>
            <SelectBox
              options={CARD_TYPES}
              value={type}
              onChange={setType}
              isDark={isDark}
            />
          </div>

          {/* Question */}
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Question
            </div>
            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError("");
              }}
              placeholder="Enter your question..."
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none ${inputBase}`}
            />
          </div>

          {/* Flashcard answer */}
          {type === "flashcard" && (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Answer
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer..."
                rows={2}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all resize-none ${inputBase}`}
              />
            </div>
          )}

          {/* Multiple choice */}
          {type === "multiple_choice" && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Choices — click ✓ to mark correct
              </div>
              {choices.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => setCorrectChoice(i)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      correctChoice === i
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isDark
                          ? "border-slate-600 text-slate-500"
                          : "border-slate-300 text-slate-400 hover:border-emerald-400"
                    }`}
                  >
                    <Check size={12} />
                  </button>
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => handleChoiceChange(i, e.target.value)}
                    placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none focus:border-indigo-400 transition-all ${inputBase}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* True / False */}
          {type === "true_false" && (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                Correct answer
              </div>
              <div className="flex gap-2">
                {["True", "False"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setCorrectTF(opt)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      correctTF === opt
                        ? opt === "True"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-red-500 border-red-500 text-white"
                        : isDark
                          ? "border-slate-700 text-slate-400 hover:bg-slate-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {opt === "True" ? "✅ True" : "❌ False"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 pl-1">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !question.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add card"}
          </button>
        </div>
      )}
    </div>
  );
};

const CardItem = ({ card, index, onDelete, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const typeLabel =
    CARD_TYPES.find((t) => t.value === card.type)?.label || card.type;

  return (
    <div
      className={`rounded-2xl border mb-2 last:mb-0 overflow-hidden transition-all ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Index */}
        <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </div>

        {/* Question preview */}
        <p
          className={`flex-1 text-sm font-medium truncate ${isDark ? "text-slate-200" : "text-slate-700"}`}
        >
          {card.question}
        </p>

        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border hidden sm:inline ${
              card.type === "flashcard"
                ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                : card.type === "multiple_choice"
                  ? "bg-purple-100 text-purple-600 border-purple-200"
                  : "bg-amber-100 text-amber-600 border-amber-200"
            }`}
          >
            {card.type === "flashcard"
              ? "FC"
              : card.type === "multiple_choice"
                ? "MC"
                : "T/F"}
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="w-7 h-7 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div
          className={`px-4 pb-3 border-t pt-3 space-y-2 ${isDark ? "border-slate-700" : "border-slate-100"}`}
        >
          {card.type === "flashcard" && (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Answer
              </div>
              <p
                className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {card.correct_answer}
              </p>
            </div>
          )}
          {card.type === "multiple_choice" && card.choices && (
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Choices
              </div>
              {card.choices.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm ${c === card.correct_answer ? "text-emerald-600 font-semibold" : isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${c === card.correct_answer ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {c}
                  {c === card.correct_answer && <Check size={12} />}
                </div>
              ))}
            </div>
          )}
          {card.type === "true_false" && (
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Correct answer
              </div>
              <span
                className={`text-sm font-semibold ${card.correct_answer === "True" ? "text-emerald-600" : "text-red-500"}`}
              >
                {card.correct_answer === "True" ? "✅ True" : "❌ False"}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DeckSettings = ({ deck, onSave, isDark }) => {
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || "");
  const [visibility, setVisibility] = useState(deck.visibility);
  const [showCreator, setShowCreator] = useState(deck.show_creator || false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description.trim() || null,
      visibility,
      show_creator: showCreator,
    });
    setSaving(false);
    setOpen(false);
  };

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const inputBase = isDark
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-800";

  return (
    <div className={`rounded-2xl border mb-4 overflow-hidden ${cardBase}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition-colors cursor-pointer ${isDark ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
      >
        <span className="flex items-center gap-2">
          <Pencil size={14} /> Deck settings
        </span>
        {open ? (
          <ChevronUp size={14} className="text-slate-400" />
        ) : (
          <ChevronDown size={14} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t dark:border-slate-700 space-y-3">
          <FloatingLabelInput
            label="Title"
            type="text"
            value={title}
            onChange={setTitle}
            isDark={isDark}
          />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-indigo-400 transition-all resize-none ${inputBase}`}
            />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              Visibility
            </div>
            <SelectBox
              options={VISIBILITY_OPTIONS}
              value={visibility}
              onChange={setVisibility}
              isDark={isDark}
            />
          </div>
          {visibility === "public" && (
            <button
              onClick={() => setShowCreator((v) => !v)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                showCreator
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300"
                  : isDark
                    ? "bg-slate-900 border-slate-700 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${showCreator ? "bg-indigo-500 border-indigo-500" : "border-slate-400"}`}
              >
                {showCreator && <Check size={10} className="text-white" />}
              </div>
              Show my name as creator on Explore page
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={14} /> {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      )}
    </div>
  );
};

const DeckEditor = () => {
  const { id } = useParams();
  const { userId } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchDeck = useCallback(async () => {
    if (!id) return;
    setFetching(true);

    const [deckRes, cardsRes] = await Promise.all([
      supabase.from("decks").select("*").eq("id", id).single(),
      supabase
        .from("cards")
        .select("*")
        .eq("deck_id", id)
        .order("card_order", { ascending: true }),
    ]);

    if (!deckRes.error) setDeck(deckRes.data);
    if (!cardsRes.error) setCards(cardsRes.data || []);
    setFetching(false);
  }, [id]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  const handleAddCard = async (fields) => {
    setAdding(true);
    const { data, error } = await supabase
      .from("cards")
      .insert({ ...fields, deck_id: id })
      .select()
      .single();

    console.log("SUPABASE ERROR:", error);
    console.log("SUPABASE DATA:", data);

    if (!error && data) {
      setCards((prev) => [...prev, data]);
      await supabase
        .from("decks")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", id);
    }
    setAdding(false);
  };

  const handleDeleteCard = async (cardId) => {
    const { error } = await supabase.from("cards").delete().eq("id", cardId);
    if (!error) setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleSaveDeck = async (fields) => {
    const { data, error } = await supabase
      .from("decks")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) setDeck(data);
  };

  const cardBase = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-800";

  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
          <div className="text-sm">Loading deck...</div>
        </div>
      </div>
    );

  if (!deck)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-400">
          <div className="text-3xl mb-2">🃏</div>
          <div className="text-sm">Deck not found.</div>
        </div>
      </div>
    );

  const typeBadge = TYPE_BADGE[deck.type] || TYPE_BADGE.flashcard;
  const visBadge =
    VISIBILITY_BADGE[deck.visibility] || VISIBILITY_BADGE.private;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/dashboard/decks")}
          className="w-8 h-8 rounded-xl border flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors dark:border-slate-700 dark:hover:bg-slate-700"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className={`text-lg font-bold truncate ${textBase}`}>
            {deck.title}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${typeBadge.bg}`}
            >
              {typeBadge.label}
            </span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${visBadge.bg}`}
            >
              {visBadge.label}
            </span>
            <span className="text-[10px] text-slate-400">
              {cards.length} card{cards.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/decks/${id}/study`)}
          disabled={cards.length === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40"
        >
          <Play size={14} /> Study
        </button>
      </div>

      <AdSenseAd />

      {/* ── Deck settings ── */}
      <DeckSettings deck={deck} onSave={handleSaveDeck} isDark={isDark} />

      {/* ── Add card form ── */}
      <CardForm onAdd={handleAddCard} loading={adding} isDark={isDark} />

      {/* ── Cards list ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-semibold ${textBase}`}>
            Cards{" "}
            <span className="text-slate-400 font-normal">({cards.length})</span>
          </h2>
        </div>

        {cards.length === 0 ? (
          <div className={`rounded-2xl border p-10 text-center ${cardBase}`}>
            <Inbox
              size={28}
              className="mx-auto mb-2 opacity-30 text-slate-400"
            />
            <div
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              No cards yet. Add your first card above!
            </div>
          </div>
        ) : (
          cards.map((card, i) => (
            <CardItem
              key={card.id}
              card={card}
              index={i}
              onDelete={handleDeleteCard}
              isDark={isDark}
            />
          ))
        )}
      </div>

      <AdSenseAd />

      <p className="text-center text-[11px] text-slate-300 mt-5">
        Deck Editor · StudyTools PH 🇵🇭
      </p>
    </div>
  );
};

export default DeckEditor;
