export const getBarWidth = (gwa) => {
  if (!gwa) return 0;
  return Math.max(0, Math.min(100, ((5.0 - gwa) / 4.0) * 100));
};

export const getBarColor = (gwa) => {
  if (gwa <= 1.5) return "bg-green-600";
  if (gwa <= 2.5) return "bg-amber-500";
  if (gwa <= 3.0) return "bg-orange-500";
  return "bg-red-500";
};
