export const NOTE_COLORS = [
  {
    value: "yellow",
    label: "Yellow",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    header: "bg-yellow-100",
    dot: "bg-yellow-400",
  },
  {
    value: "blue",
    label: "Blue",
    bg: "bg-blue-50",
    border: "border-blue-200",
    header: "bg-blue-100",
    dot: "bg-blue-400",
  },
  {
    value: "green",
    label: "Green",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    header: "bg-emerald-100",
    dot: "bg-emerald-400",
  },
  {
    value: "pink",
    label: "Pink",
    bg: "bg-pink-50",
    border: "border-pink-200",
    header: "bg-pink-100",
    dot: "bg-pink-400",
  },
  {
    value: "purple",
    label: "Purple",
    bg: "bg-purple-50",
    border: "border-purple-200",
    header: "bg-purple-100",
    dot: "bg-purple-400",
  },
];

export const COLOR_FILTER = [
  { value: "", label: "All colors" },
  ...NOTE_COLORS.map((c) => ({ value: c.value, label: c.label })),
];