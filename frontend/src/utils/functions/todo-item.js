export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  if (diff < 0)
    return { label: `${Math.abs(diff)}d overdue`, color: "text-red-500" };
  if (diff === 0) return { label: "Due today", color: "text-amber-500" };
  if (diff === 1) return { label: "Due tomorrow", color: "text-amber-400" };
  return { label: `Due in ${diff}d`, color: "text-slate-400" };
};
