import { NOTE_COLORS } from "../constants/notes.config";

export const getColorConfig = (color) => {
  return NOTE_COLORS.find((c) => c.value === color) || NOTE_COLORS[0];
};

export const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
