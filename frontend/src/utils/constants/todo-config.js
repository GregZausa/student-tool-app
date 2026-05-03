export const PRIORITIES = [
  { value: "low", label: "🟢 Low" },
  { value: "medium", label: "🟡 Medium" },
  { value: "high", label: "🔴 High" },
];

export const PRIORITY_FILTER = [
  { value: "", label: "All priorities" },
  { value: "high", label: "🔴 High" },
  { value: "medium", label: "🟡 Medium" },
  { value: "low", label: "🟢 Low" },
];

export const STATUS_FILTER = [
  { value: "", label: "All status" },
  { value: "pending", label: "⏳ Pending" },
  { value: "completed", label: "✅ Completed" },
];

export const SORT_OPTIONS = [
  { value: "created_at", label: "📅 Date added" },
  { value: "due_date", label: "⏰ Due date" },
  { value: "priority", label: "🚦 Priority" },
];

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };


export const PRIORITY_STYLES = {
  high: {
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    label: "High",
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    label: "Medium",
  },
  low: {
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    label: "Low",
  },
};
