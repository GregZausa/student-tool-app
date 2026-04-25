export const MODES = {
  focus: {
    label: "Focus",
    color: "text-indigo-500",
    ring: "ring-indigo-200",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    defaultMins: 25,
  },
  shortBreak: {
    label: "Short Break",
    color: "text-emerald-500",
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    defaultMins: 5,
  },
  longBreak: {
    label: "Long Break",
    color: "text-sky-500",
    ring: "ring-sky-200",
    bg: "bg-sky-50",
    border: "border-sky-200",
    defaultMins: 15,
  },
};

export const AMBIENT_SOUNDS = [
  { value: "none", label: "🔇 No sound" },
  { value: "rain", label: "🌧️ Rain" },
  { value: "cafe", label: "☕ Coffee shop" },
  { value: "forest", label: "🌿 Forest" },
  { value: "waves", label: "🌊 Ocean waves" },
  { value: "white", label: "⬜ White noise" },
  { value: "lofi", label: "🎵 Lo-fi beats" },
];

export const AMBIENT_CONFIG = {
  rain: { type: "rain" },
  cafe: { type: "cafe" },
  forest: { type: "forest" },
  waves: { type: "waves" },
  white: { type: "white" },
  lofi: { type: "lofi" },
};

export const SUBJECT_OPTIONS = [
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