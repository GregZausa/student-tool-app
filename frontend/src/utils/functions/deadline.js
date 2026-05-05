import { useEffect, useState } from "react";

export const getCountdown = (dueDateStr) => {
  const now = new Date();
  const due = new Date(dueDateStr);
  const diff = due - now;

  if (diff <= 0) return { label: "Overdue", urgency: "overdue" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 7) return { label: `${days}d left`, urgency: "safe" };
  if (days >= 1)
    return {
      label: `${days}d ${hours}h left`,
      urgency: days <= 2 ? "warning" : "soon",
    };
  if (hours >= 1)
    return { label: `${hours}h ${mins}m left`, urgency: "danger" };
  return { label: `${mins}m left`, urgency: "danger" };
};

export const formatDueDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);
  return now;
};
