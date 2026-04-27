export const decodeHTML = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const getScoreLabel = (pct) => {
  if (pct === 100) return { label: "Perfect! 🏆", color: "text-yellow-500" };
  if (pct >= 80) return { label: "Excellent! 🎉", color: "text-green-500" };
  if (pct >= 60) return { label: "Good job! 👍", color: "text-blue-500" };
  if (pct >= 40) return { label: "Keep studying! 📚", color: "text-amber-500" };
  return { label: "Better luck next time 💪", color: "text-red-500" };
};
