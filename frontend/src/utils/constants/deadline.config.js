import { BookOpen, FlaskConical, FolderKanban, MoreHorizontal } from "lucide-react";

export const DEADLINE_TYPES = [
  { value: "assignment", label: "📝 Assignment" },
  { value: "exam", label: "📖 Exam" },
  { value: "project", label: "🗂️ Project" },
  { value: "other", label: "📌 Other" },
];

export const TYPE_FILTER = [
  { value: "", label: "All types" },
  { value: "assignment", label: "📝 Assignment" },
  { value: "exam", label: "📖 Exam" },
  { value: "project", label: "🗂️ Project" },
  { value: "other", label: "📌 Other" },
];

export const STATUS_FILTER = [
  { value: "", label: "All" },
  { value: "upcoming", label: "⏳ Upcoming" },
  { value: "completed", label: "✅ Done" },
];

export const TYPE_CONFIG = {
  assignment: {
    icon: BookOpen,
    color: "bg-indigo-50 text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  exam: {
    icon: FlaskConical,
    color: "bg-red-50 text-red-500",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  project: {
    icon: FolderKanban,
    color: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  other: {
    icon: MoreHorizontal,
    color: "bg-slate-50 text-slate-500",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const URGENCY_STYLES = {
  safe: {
    bar: "bg-emerald-400",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  soon: {
    bar: "bg-sky-400",
    text: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  warning: {
    bar: "bg-amber-400",
    text: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  danger: {
    bar: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  overdue: {
    bar: "bg-slate-400",
    text: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};