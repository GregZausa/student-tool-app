import { FileText, Globe, Link2, Play } from "lucide-react";

export const MATERIAL_TYPES = [
  { value: "link", label: "🔗 Link" },
  { value: "youtube", label: "▶️ YouTube" },
  { value: "pdf", label: "📄 PDF" },
  { value: "other", label: "📌 Other" },
];

export const TYPE_FILTER = [
  { value: "", label: "All types" },
  { value: "link", label: "🔗 Link" },
  { value: "youtube", label: "▶️ YouTube" },
  { value: "pdf", label: "📄 PDF" },
  { value: "other", label: "📌 Other" },
];

export const TYPE_CONFIG = {
  link: {
    icon: Globe,
    color: "bg-sky-50 text-sky-600",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    label: "Link",
  },
  youtube: {
    icon: Play,
    color: "bg-red-50 text-red-600",
    badge: "bg-red-100 text-red-700 border-red-200",
    label: "YouTube",
  },
  pdf: {
    icon: FileText,
    color: "bg-amber-50 text-amber-600",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    label: "PDF",
  },
  other: {
    icon: Link2,
    color: "bg-slate-50 text-slate-600",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    label: "Other",
  },
};
