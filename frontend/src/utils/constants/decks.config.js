export const DECK_TYPES = [
  { value: "flashcard", label: "🃏 Flashcard" },
  { value: "quiz", label: "📝 Quiz" },
];

export const VISIBILITY_OPTIONS = [
  { value: "private", label: "🔒 Private" },
  { value: "public", label: "🌐 Public" },
];

export const CARD_TYPES = [
  { value: "flashcard", label: "🃏 Flashcard" },
  { value: "multiple_choice", label: "🔤 Multiple Choice" },
  { value: "true_false", label: "✅ True / False" },
];

export const SUBJECT_OPTIONS = [
  { value: "", label: "All subjects" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Filipino", label: "Filipino" },
  { value: "History", label: "History" },
  { value: "Programming", label: "Programming" },
  { value: "Economics", label: "Economics" },
  { value: "Research", label: "Research" },
  { value: "Thesis", label: "Thesis" },
  { value: "Other", label: "Other" },
];

export const SUBJECT_FILTER = [
  { value: "", label: "All subjects" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Filipino", label: "Filipino" },
  { value: "History", label: "History" },
  { value: "Programming", label: "Programming" },
  { value: "Economics", label: "Economics" },
  { value: "Research", label: "Research" },
  { value: "Thesis", label: "Thesis" },
  { value: "Other", label: "Other" },
];

export const TYPE_BADGE = {
  flashcard: {
    label: "🃏 Flashcard",
    bg: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  quiz: {
    label: "📝 Quiz",
    bg: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export const VISIBILITY_BADGE = {
  private: {
    label: "🔒 Private",
    bg: "bg-slate-100 text-slate-600 border-slate-200",
  },
  public: {
    label: "🌐 Public",
    bg: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};
